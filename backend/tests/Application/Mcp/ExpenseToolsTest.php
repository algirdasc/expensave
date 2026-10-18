<?php

declare(strict_types=1);

namespace App\Tests\Application\Mcp;

use App\Mcp\ExpenseTools;
use PHPUnit\Framework\Attributes\CoversClass;
use Symfony\Bundle\FrameworkBundle\KernelBrowser;

#[CoversClass(ExpenseTools::class)]
class ExpenseToolsTest extends McpTestCase
{
    private KernelBrowser $client;

    public function setUp(): void
    {
        parent::setUp();

        $this->client = $this->getMcpClient();
    }

    public function testListExpenses(): void
    {
        $expenses = $this->callMcpToolForContent($this->client, 'list-expenses', [
            'calendarId' => $this->getCalendarId('User 1 Calendar'),
            'dateFrom' => '2024-01-01',
            'dateTo' => '2024-12-31',
        ]);

        $this->assertCount(4, $expenses);

        $expenses = $this->callMcpToolForContent($this->client, 'list-expenses', [
            'calendarId' => $this->getCalendarId('User 1 Calendar'),
            'dateFrom' => '2024-01-01',
            'dateTo' => '2024-02-28',
        ]);

        $this->assertSame(['Test expense 0', 'Test expense 1'], array_column($expenses, 'label'));
    }

    public function testListExpensesOfForeignCalendarIsDenied(): void
    {
        $result = $this->callMcpTool($this->client, 'list-expenses', [
            'calendarId' => $this->getCalendarId('User 2 Calendar'),
            'dateFrom' => '2024-01-01',
            'dateTo' => '2024-12-31',
        ]);

        $this->assertTrue($result['isError']);
        $this->assertStringContainsString('denied', $result['content'][0]['text']);
    }

    public function testListExpensesOfMissingCalendarFails(): void
    {
        $result = $this->callMcpTool($this->client, 'list-expenses', [
            'calendarId' => 999999,
            'dateFrom' => '2024-01-01',
            'dateTo' => '2024-12-31',
        ]);

        $this->assertTrue($result['isError']);
        $this->assertStringContainsString('not found', $result['content'][0]['text']);
    }

    public function testListExpensesWithInvalidDateFails(): void
    {
        $result = $this->callMcpTool($this->client, 'list-expenses', [
            'calendarId' => $this->getCalendarId('User 1 Calendar'),
            'dateFrom' => 'not-a-date',
            'dateTo' => '2024-12-31',
        ]);

        $this->assertTrue($result['isError']);
        $this->assertStringContainsString('Invalid date', $result['content'][0]['text']);
    }

    public function testGetExpense(): void
    {
        $expense = $this->callMcpToolForContent($this->client, 'get-expense', [
            'expenseId' => $this->getExpenseId('Test expense 0', 'User 1 Calendar'),
        ]);

        $this->assertSame('Test expense 0', $expense['label']);
        $this->assertSame(-75, $expense['amount']);
        $this->assertSame('User 1 Calendar', $expense['calendar']['name']);
        $this->assertSame('user1@email.com', $expense['user']['email']);
    }

    public function testGetForeignExpenseIsDenied(): void
    {
        $result = $this->callMcpTool($this->client, 'get-expense', [
            'expenseId' => $this->getExpenseId('Test expense 0', 'User 2 Calendar'),
        ]);

        $this->assertTrue($result['isError']);
        $this->assertStringContainsString('denied', $result['content'][0]['text']);
    }

    public function testGetMissingExpenseFails(): void
    {
        $result = $this->callMcpTool($this->client, 'get-expense', ['expenseId' => 999999]);

        $this->assertTrue($result['isError']);
        $this->assertStringContainsString('not found', $result['content'][0]['text']);
    }

    public function testAddExpense(): void
    {
        $expense = $this->callMcpToolForContent($this->client, 'add-expense', [
            'calendarId' => $this->getCalendarId('User 1 Calendar'),
            'label' => 'MCP expense',
            'amount' => -12.5,
            'date' => '2024-05-15',
        ]);

        $this->assertIsInt($expense['id']);
        $this->assertSame('MCP expense', $expense['label']);
        $this->assertSame(-12.5, $expense['amount']);
        $this->assertSame('2024-05-15 00:00:00', $expense['createdAt']);
        $this->assertSame('Uncategorized', $expense['category']['name']);
        $this->assertTrue($expense['confirmed']);
        $this->assertSame('user1@email.com', $expense['user']['email']);

        $this->assertSame($expense['id'], $this->getExpense('MCP expense')->getId());
    }

    public function testAddExpenseWithCategoryAndDescription(): void
    {
        $expense = $this->callMcpToolForContent($this->client, 'add-expense', [
            'calendarId' => $this->getCalendarId('User 1 Calendar'),
            'label' => 'Categorized expense',
            'amount' => 30,
            'date' => '2024-05-15 15:30:15',
            'categoryId' => $this->getCategoryId('Category 1'),
            'description' => 'Added via MCP',
            'confirmed' => false,
        ]);

        $this->assertSame('Category 1', $expense['category']['name']);
        $this->assertSame('Added via MCP', $expense['description']);
        $this->assertFalse($expense['confirmed']);
    }

    public function testAddExpenseWithInvalidPayloadFailsWithValidationErrors(): void
    {
        $result = $this->callMcpTool($this->client, 'add-expense', [
            'calendarId' => $this->getCalendarId('User 1 Calendar'),
            'label' => '',
            'amount' => 0,
            'date' => '2024-05-15',
        ]);

        $this->assertTrue($result['isError']);
        $this->assertStringContainsString('label', $result['content'][0]['text']);
        $this->assertStringContainsString('amount', $result['content'][0]['text']);
    }

    public function testAddExpenseToForeignCalendarIsDenied(): void
    {
        $result = $this->callMcpTool($this->client, 'add-expense', [
            'calendarId' => $this->getCalendarId('User 2 Calendar'),
            'label' => 'Nope',
            'amount' => -1,
            'date' => '2024-05-15',
        ]);

        $this->assertTrue($result['isError']);
        $this->assertStringContainsString('denied', $result['content'][0]['text']);
    }

    public function testCollaboratorCanAddExpenseToSharedCalendar(): void
    {
        $client = $this->getMcpClient($this->getUser('User 2'));

        $expense = $this->callMcpToolForContent($client, 'add-expense', [
            'calendarId' => $this->getCalendarId('Shared Calendar'),
            'label' => 'Collaborator MCP expense',
            'amount' => -7.5,
            'date' => '2024-05-15',
        ]);

        $this->assertSame('Shared Calendar', $expense['calendar']['name']);
        $this->assertSame('user2@email.com', $expense['user']['email']);
    }

    public function testUpdateExpense(): void
    {
        $expenseId = $this->getExpenseId('Test expense 1', 'User 1 Calendar');

        $expense = $this->callMcpToolForContent($this->client, 'update-expense', [
            'expenseId' => $expenseId,
            'label' => 'Updated label',
            'amount' => -99.9,
        ]);

        $this->assertSame($expenseId, $expense['id']);
        $this->assertSame('Updated label', $expense['label']);
        $this->assertSame(-99.9, $expense['amount']);
        $this->assertSame('2024-02-10 12:00:00', $expense['createdAt']);
        $this->assertSame('Category 2', $expense['category']['name']);
    }

    public function testUpdateExpenseMovesToSharedCalendar(): void
    {
        $expenseId = $this->getExpenseId('Test expense 1', 'User 1 Calendar');

        $expense = $this->callMcpToolForContent($this->client, 'update-expense', [
            'expenseId' => $expenseId,
            'calendarId' => $this->getCalendarId('Shared Calendar'),
        ]);

        $this->assertSame('Shared Calendar', $expense['calendar']['name']);
    }

    public function testUpdateForeignExpenseIsDenied(): void
    {
        $result = $this->callMcpTool($this->client, 'update-expense', [
            'expenseId' => $this->getExpenseId('Test expense 0', 'User 2 Calendar'),
            'label' => 'Nope',
        ]);

        $this->assertTrue($result['isError']);
        $this->assertStringContainsString('denied', $result['content'][0]['text']);
    }

    public function testCollaboratorCannotEditSharedExpenseOfAnotherUser(): void
    {
        $result = $this->callMcpTool($this->client, 'update-expense', [
            'expenseId' => $this->getExpenseId('Shared expense 2 of User 2'),
            'label' => 'Nope',
        ]);

        $this->assertTrue($result['isError']);
        $this->assertStringContainsString('denied', $result['content'][0]['text']);
    }

    public function testDeleteExpense(): void
    {
        $expenseId = $this->getExpenseId('Test expense 2', 'User 1 Calendar');

        $result = $this->callMcpToolForContent($this->client, 'delete-expense', ['expenseId' => $expenseId]);

        $this->assertTrue($result['deleted']);

        $result = $this->callMcpTool($this->client, 'get-expense', ['expenseId' => $expenseId]);
        $this->assertTrue($result['isError']);
        $this->assertStringContainsString('not found', $result['content'][0]['text']);
    }

    public function testDeleteForeignExpenseIsDenied(): void
    {
        $result = $this->callMcpTool($this->client, 'delete-expense', [
            'expenseId' => $this->getExpenseId('Test expense 0', 'User 2 Calendar'),
        ]);

        $this->assertTrue($result['isError']);
        $this->assertStringContainsString('denied', $result['content'][0]['text']);
    }
}
