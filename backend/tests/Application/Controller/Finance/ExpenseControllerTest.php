<?php

declare(strict_types=1);

namespace App\Tests\Application\Controller\Finance;

use App\Controller\Finance\ExpenseController;
use App\Tests\ApplicationTestCase;
use PHPUnit\Framework\Attributes\CoversClass;
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
}
