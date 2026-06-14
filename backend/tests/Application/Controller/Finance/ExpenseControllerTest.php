<?php

declare(strict_types=1);

namespace App\Tests\Application\Controller\Finance;

use App\Controller\Finance\ExpenseController;
use App\Tests\ApplicationTestCase;
use PHPUnit\Framework\Attributes\CoversClass;
use PHPUnit\Framework\Attributes\DataProvider;
use Symfony\Bundle\FrameworkBundle\KernelBrowser;
use Symfony\Component\HttpFoundation\Response;

#[CoversClass(ExpenseController::class)]
class ExpenseControllerTest extends ApplicationTestCase
{
    private KernelBrowser $client;

    public function setUp(): void
    {
        parent::setUp();

        $this->client = $this->getAuthenticatedClient();
    }

    public function testSuggest(): void
    {
        $this->client->jsonRequest('POST', '/api/expense/suggest', ['label' => 'Test Expense 0']);

        $this->assertResponseIsSuccessful();
        $this->assertSame('Test expense 0', $this->getJsonResponse($this->client)['label']);
        $this->assertSame('User 1', $this->getJsonResponse($this->client)['user']['name']);

        $this->client->jsonRequest('POST', '/api/expense/suggest', ['label' => 'Test']);

        $this->assertResponseIsSuccessful();
        $this->assertSame('Test expense 3', $this->getJsonResponse($this->client)['label']);
        $this->assertSame('User 1', $this->getJsonResponse($this->client)['user']['name']);
    }

    public function testGetMissingExpenseReturnsNotFound(): void
    {
        $this->client->jsonRequest('GET', '/api/expense/999999');

        $this->assertResponseStatusCodeSame(Response::HTTP_NOT_FOUND);
    }

    public function testCreateWithInvalidPayloadReturnsValidationError(): void
    {
        $this->client->jsonRequest('POST', '/api/expense', [
            'label' => '',
            'calendar' => $this->getCalendarId('User 1 Calendar'),
            'createdAt' => '2024-05-15 15:30:15',
            'amount' => 0,
        ]);

        $this->assertResponseStatusCodeSame(Response::HTTP_UNPROCESSABLE_ENTITY);

        $response = $this->getJsonResponse($this->client);
        $this->assertSame('App\Exception\RequestValidationException', $response['throwable']);
        $this->assertSame(['label', 'amount'], array_column($response['messages'], 'propertyPath'));
    }

    public function testCollaboratorCanCreateExpenseInSharedCalendar(): void
    {
        $client = $this->getAuthenticatedClient($this->getUser('User 2'));
        $client->jsonRequest('POST', '/api/expense', [
            'label' => 'Collaborator Expense',
            'calendar' => $this->getCalendarId('Shared Calendar'),
            'createdAt' => '2024-05-15 15:30:15',
            'amount' => -12.5,
        ]);

        $this->assertResponseIsSuccessful();

        $expense = $this->getJsonResponse($client);
        $this->assertIsInt($expense['id']);
        $this->assertSame('Collaborator Expense', $expense['label']);
        $this->assertSame('Shared Calendar', $expense['calendar']['name']);
        $this->assertSame('user2@email.com', $expense['user']['email']);
    }

    public function testCreateRecurringExpenseGeneratesExpensesForSelectedPeriod(): void
    {
        $calendarId = $this->getCalendarId('User 1 Calendar');

        $this->client->jsonRequest('POST', '/api/expense', [
            'label' => 'Weekly Rent',
            'calendar' => $calendarId,
            'category' => $this->getCategoryId('Category 1'),
            'createdAt' => '2024-01-01 09:00:00',
            'amount' => -100,
            'recurring' => true,
            'recurringFrequency' => 'weekly',
            'recurringOccurrences' => 4,
        ]);

        $this->assertResponseIsSuccessful();
        $response = $this->getJsonResponse($this->client);
        $this->assertSame('Weekly Rent', $response['label']);
        $this->assertSame('2024-01-01 09:00:00', $response['createdAt']);
        $this->assertTrue($response['recurring']);
        $this->assertSame('weekly', $response['recurringFrequency']);
        $this->assertSame(4, $response['recurringOccurrences']);

        $this->client->jsonRequest('GET', sprintf('/api/calendar/%d/expenses/2024-01-01/2024-01-31', $calendarId));

        $expenses = array_values(array_filter(
            $this->getJsonResponse($this->client)['expenses'],
            static fn (array $expense): bool => $expense['label'] === 'Weekly Rent'
        ));

        $this->assertCount(4, $expenses);
        $createdAtDates = array_column($expenses, 'createdAt');
        sort($createdAtDates);

        $this->assertSame(
            [
                '2024-01-01 09:00:00',
                '2024-01-08 09:00:00',
                '2024-01-15 09:00:00',
                '2024-01-22 09:00:00',
            ],
            $createdAtDates
        );
    }

    public function testUpdateSingleExpenseCanConvertItToRecurringExpense(): void
    {
        $calendarId = $this->getCalendarId('User 1 Calendar');

        $this->client->jsonRequest('POST', '/api/expense', [
            'label' => 'One-off Subscription',
            'calendar' => $calendarId,
            'category' => $this->getCategoryId('Category 1'),
            'createdAt' => '2024-01-03 09:00:00',
            'amount' => -20,
        ]);

        $this->assertResponseIsSuccessful();
        $expenseId = $this->getJsonResponse($this->client)['id'];

        $this->client->jsonRequest('PUT', sprintf('/api/expense/%d', $expenseId), [
            'label' => 'Recurring Subscription',
            'calendar' => $calendarId,
            'category' => $this->getCategoryId('Category 2'),
            'createdAt' => '2024-01-03 09:00:00',
            'amount' => -25,
            'confirmed' => true,
            'description' => 'Converted from one-off expense',
            'recurring' => true,
            'recurringFrequency' => 'weekly',
            'recurringOccurrences' => 4,
        ]);

        $this->assertResponseIsSuccessful();
        $response = $this->getJsonResponse($this->client);
        $this->assertSame($expenseId, $response['id']);
        $this->assertTrue($response['recurring']);
        $this->assertSame('weekly', $response['recurringFrequency']);
        $this->assertSame(4, $response['recurringOccurrences']);

        $expenses = $this->getExpensesByLabels($calendarId, ['Recurring Subscription']);

        $this->assertCount(4, $expenses);
        $this->assertSame(
            [
                '2024-01-03 09:00:00',
                '2024-01-10 09:00:00',
                '2024-01-17 09:00:00',
                '2024-01-24 09:00:00',
            ],
            array_column($expenses, 'createdAt')
        );

        foreach ($expenses as $expense) {
            $this->assertSame(-25, $expense['amount']);
            $this->assertSame('Category 2', $expense['category']['name']);
            $this->assertSame('Converted from one-off expense', $expense['description']);
        }
    }

    /**
     * @param array<string, string> $expectedLabelsByDate
     */
    #[DataProvider('recurringUpdateScopeProvider')]
    public function testUpdateRecurringExpenseAppliesSelectedScope(
        string $scope,
        array $expectedLabelsByDate,
    ): void {
        $calendarId = $this->getCalendarId('User 1 Calendar');
        $label = sprintf('Scoped %s Rent', $scope);
        $updatedLabel = sprintf('Scoped %s Rent Updated', $scope);

        $this->createRecurringExpense($calendarId, $label);
        $selectedExpense = $this->getExpenseByDate($calendarId, $label, '2024-01-15 09:00:00');

        $this->client->jsonRequest('PUT', sprintf('/api/expense/%d', $selectedExpense['id']), [
            'label' => $updatedLabel,
            'calendar' => $calendarId,
            'category' => $this->getCategoryId('Category 2'),
            'createdAt' => '2024-01-16 09:00:00',
            'amount' => -125,
            'confirmed' => true,
            'description' => 'Scoped recurring update',
            'recurring' => true,
            'recurringFrequency' => 'weekly',
            'recurringOccurrences' => 4,
            'recurringUpdateScope' => $scope,
        ]);

        $this->assertResponseIsSuccessful();
        $response = $this->getJsonResponse($this->client);
        $this->assertSame($updatedLabel, $response['label']);
        $this->assertSame('2024-01-16 09:00:00', $response['createdAt']);

        $expenses = $this->getExpensesByLabels($calendarId, [$label, $updatedLabel]);
        $this->assertSame($expectedLabelsByDate, array_column($expenses, 'label', 'createdAt'));

        foreach ($expenses as $expense) {
            if ($expense['label'] !== $updatedLabel) {
                continue;
            }

            $this->assertSame(-125, $expense['amount']);
            $this->assertSame('Category 2', $expense['category']['name']);
            $this->assertSame('Scoped recurring update', $expense['description']);
        }
    }

    public function testCreateRecurringExpenseWithInvalidPayloadReturnsValidationError(): void
    {
        $this->client->jsonRequest('POST', '/api/expense', [
            'label' => 'Invalid Recurrence',
            'calendar' => $this->getCalendarId('User 1 Calendar'),
            'createdAt' => '2024-01-01 09:00:00',
            'amount' => -100,
            'recurring' => true,
            'recurringFrequency' => 'fortnightly',
            'recurringOccurrences' => 1,
        ]);

        $this->assertResponseStatusCodeSame(Response::HTTP_UNPROCESSABLE_ENTITY);

        $response = $this->getJsonResponse($this->client);
        $this->assertSame('App\Exception\RequestValidationException', $response['throwable']);
        $propertyPaths = array_column($response['messages'], 'propertyPath');
        sort($propertyPaths);

        $this->assertSame(
            ['recurringFrequency', 'recurringOccurrences'],
            $propertyPaths
        );
    }

    public function testUpdateRecurringExpenseWithInvalidScopeReturnsValidationError(): void
    {
        $calendarId = $this->getCalendarId('User 1 Calendar');
        $label = 'Invalid Scope Rent';

        $this->createRecurringExpense($calendarId, $label);
        $selectedExpense = $this->getExpenseByDate($calendarId, $label, '2024-01-15 09:00:00');

        $this->client->jsonRequest('PUT', sprintf('/api/expense/%d', $selectedExpense['id']), [
            'label' => $label,
            'calendar' => $calendarId,
            'category' => $this->getCategoryId('Category 1'),
            'createdAt' => '2024-01-15 09:00:00',
            'amount' => -100,
            'recurring' => true,
            'recurringFrequency' => 'weekly',
            'recurringOccurrences' => 4,
            'recurringUpdateScope' => 'nearby',
        ]);

        $this->assertResponseStatusCodeSame(Response::HTTP_UNPROCESSABLE_ENTITY);

        $response = $this->getJsonResponse($this->client);
        $this->assertSame('App\Exception\RequestValidationException', $response['throwable']);
        $this->assertSame('recurringUpdateScope', $response['messages'][0]['propertyPath']);
    }

    public function testCreateWithBalanceUpdateCategoryReturnsValidationError(): void
    {
        $this->client->jsonRequest('POST', '/api/expense', [
            'label' => 'Invalid Balance Update Category',
            'calendar' => $this->getCalendarId('User 1 Calendar'),
            'category' => $this->getCategoryId('Balance Update'),
            'createdAt' => '2024-05-15 15:30:15',
            'amount' => -10,
        ]);

        $this->assertResponseStatusCodeSame(Response::HTTP_UNPROCESSABLE_ENTITY);

        $response = $this->getJsonResponse($this->client);
        $this->assertSame('App\Exception\RequestValidationException', $response['throwable']);
        $this->assertSame('category', $response['messages'][0]['propertyPath']);
    }

    public function testUpdateWithBalanceUpdateCategoryReturnsValidationError(): void
    {
        $this->client->jsonRequest('PUT', sprintf('/api/expense/%d', $this->getExpenseId('Test expense 0', 'User 1 Calendar')), [
            'label' => 'Invalid Balance Update Category',
            'calendar' => $this->getCalendarId('User 1 Calendar'),
            'category' => $this->getCategoryId('Balance Update'),
            'createdAt' => '2024-05-15 15:30:15',
            'amount' => -10,
        ]);

        $this->assertResponseStatusCodeSame(Response::HTTP_UNPROCESSABLE_ENTITY);

        $response = $this->getJsonResponse($this->client);
        $this->assertSame('App\Exception\RequestValidationException', $response['throwable']);
        $this->assertSame('category', $response['messages'][0]['propertyPath']);
    }

    public function testExpenseLifecycle(): void
    {
        $calendarId = $this->getCalendarId('User 1 Calendar');

        // Create
        $this->client->jsonRequest('POST', '/api/expense', [
            'label' => 'Test Label',
            'calendar' => $calendarId,
            'createdAt' => '2024-05-15 15:30:15',
            'amount' => -10,
        ]);

        $this->assertResponseIsSuccessful();
        $expenseId = $this->getJsonResponse($this->client)['id'];
        $this->assertIsInt($expenseId);

        // Get
        $this->client->jsonRequest('GET', sprintf('/api/expense/%d', $expenseId));
        $this->assertResponseIsSuccessful();

        // Update
        $this->client->jsonRequest('PUT', sprintf('/api/expense/%d', $expenseId), [
            'label' => 'Test Modified Label',
            'calendar' => $calendarId,
            'createdAt' => '2024-05-15 15:30:15',
            'amount' => -100,
        ]);

        $this->assertResponseIsSuccessful();
        $this->assertSame('Test Modified Label', $this->getJsonResponse($this->client)['label']);

        // Delete
        $this->client->jsonRequest('DELETE', sprintf('/api/expense/%d', $expenseId));
        $this->assertResponseIsSuccessful();

        // Get again
        $this->client->jsonRequest('GET', sprintf('/api/expense/%d', $expenseId));
        $this->assertResponseStatusCodeSame(Response::HTTP_NOT_FOUND);
    }

    public static function recurringUpdateScopeProvider(): iterable
    {
        yield 'this occurrence' => [
            'this',
            [
                '2024-01-01 09:00:00' => 'Scoped this Rent',
                '2024-01-08 09:00:00' => 'Scoped this Rent',
                '2024-01-16 09:00:00' => 'Scoped this Rent Updated',
                '2024-01-22 09:00:00' => 'Scoped this Rent',
            ],
        ];

        yield 'this and future occurrences' => [
            'future',
            [
                '2024-01-01 09:00:00' => 'Scoped future Rent',
                '2024-01-08 09:00:00' => 'Scoped future Rent',
                '2024-01-16 09:00:00' => 'Scoped future Rent Updated',
                '2024-01-23 09:00:00' => 'Scoped future Rent Updated',
            ],
        ];

        yield 'this and past occurrences' => [
            'past',
            [
                '2024-01-02 09:00:00' => 'Scoped past Rent Updated',
                '2024-01-09 09:00:00' => 'Scoped past Rent Updated',
                '2024-01-16 09:00:00' => 'Scoped past Rent Updated',
                '2024-01-22 09:00:00' => 'Scoped past Rent',
            ],
        ];

        yield 'all occurrences' => [
            'all',
            [
                '2024-01-02 09:00:00' => 'Scoped all Rent Updated',
                '2024-01-09 09:00:00' => 'Scoped all Rent Updated',
                '2024-01-16 09:00:00' => 'Scoped all Rent Updated',
                '2024-01-23 09:00:00' => 'Scoped all Rent Updated',
            ],
        ];
    }

    private function createRecurringExpense(int $calendarId, string $label): void
    {
        $this->client->jsonRequest('POST', '/api/expense', [
            'label' => $label,
            'calendar' => $calendarId,
            'category' => $this->getCategoryId('Category 1'),
            'createdAt' => '2024-01-01 09:00:00',
            'amount' => -100,
            'recurring' => true,
            'recurringFrequency' => 'weekly',
            'recurringOccurrences' => 4,
        ]);

        $this->assertResponseIsSuccessful();
    }

    /**
     * @return array<string, mixed>
     */
    private function getExpenseByDate(int $calendarId, string $label, string $createdAt): array
    {
        foreach ($this->getExpensesByLabels($calendarId, [$label]) as $expense) {
            if ($expense['createdAt'] === $createdAt) {
                return $expense;
            }
        }

        $this->fail(sprintf('Expense "%s" at "%s" was not found.', $label, $createdAt));
    }

    /**
     * @param list<string> $labels
     *
     * @return list<array<string, mixed>>
     */
    private function getExpensesByLabels(int $calendarId, array $labels): array
    {
        $this->client->jsonRequest('GET', sprintf('/api/calendar/%d/expenses/2024-01-01/2024-01-31', $calendarId));
        $this->assertResponseIsSuccessful();

        $expenses = array_values(array_filter(
            $this->getJsonResponse($this->client)['expenses'],
            static fn (array $expense): bool => in_array($expense['label'], $labels, true)
        ));
        usort($expenses, static fn (array $left, array $right): int => $left['createdAt'] <=> $right['createdAt']);

        return $expenses;
    }
}
