<?php

declare(strict_types=1);

namespace App\Tests\Application\Mcp;

use App\Mcp\ReportTools;
use PHPUnit\Framework\Attributes\CoversClass;
use Symfony\Bundle\FrameworkBundle\KernelBrowser;

#[CoversClass(ReportTools::class)]
class ReportToolsTest extends McpTestCase
{
    private KernelBrowser $client;

    /**
     * @var list<int>
     */
    private array $calendarIds;

    public function setUp(): void
    {
        parent::setUp();

        $this->client = $this->getMcpClient();
        $this->calendarIds = [
            $this->getCalendarId('User 1 Calendar'),
            $this->getCalendarId('Shared Calendar'),
        ];
    }

    public function testDailyExpenseReport(): void
    {
        $report = $this->callMcpToolForContent($this->client, 'daily-expense-report', [
            'calendarIds' => $this->calendarIds,
            'dateFrom' => '2024-01-01',
            'dateTo' => '2024-12-31',
        ]);

        $this->assertArrayHasKey('expenseBalances', $report);
        $this->assertCount(366, $report['expenseBalances']);
        $this->assertEquals(['change' => -20, 'expense' => -75, 'income' => 55], $report['meta']);
    }

    public function testMonthlyExpenseReport(): void
    {
        $report = $this->callMcpToolForContent($this->client, 'monthly-expense-report', [
            'calendarIds' => $this->calendarIds,
            'dateFrom' => '2024-01-01',
            'dateTo' => '2024-12-31',
        ]);

        $this->assertArrayHasKey('expenseBalances', $report);
        $this->assertCount(12, $report['expenseBalances']);
        $this->assertEquals(['change' => -20, 'expense' => -75, 'income' => 55], $report['meta']);
    }

    public function testCategoryExpensesReport(): void
    {
        $report = $this->callMcpToolForContent($this->client, 'category-expenses-report', [
            'calendarIds' => $this->calendarIds,
            'dateFrom' => '2024-01-01',
            'dateTo' => '2024-12-31',
        ]);

        $this->assertArrayHasKey('categoryBalances', $report);
        $this->assertCount(4, $report['categoryBalances']);
        $this->assertEquals(['change' => -20, 'expense' => -75, 'income' => 55], $report['meta']);
    }

    public function testReportStartsAtFirstExpenseForEpochDateFrom(): void
    {
        $report = $this->callMcpToolForContent($this->client, 'monthly-expense-report', [
            'calendarIds' => $this->calendarIds,
            'dateFrom' => '1970-01-01',
            'dateTo' => '2024-12-31',
        ]);

        $this->assertCount(12, $report['expenseBalances']);
        $this->assertSame('2024-01-05 00:00:00', $report['expenseBalances'][0]['balanceAt']);
    }

    public function testReportWithForeignCalendarIsDenied(): void
    {
        $result = $this->callMcpTool($this->client, 'daily-expense-report', [
            'calendarIds' => [...$this->calendarIds, $this->getCalendarId('User 2 Calendar')],
            'dateFrom' => '2024-01-01',
            'dateTo' => '2024-12-31',
        ]);

        $this->assertTrue($result['isError']);
        $this->assertStringContainsString('denied', $result['content'][0]['text']);
    }

    public function testReportWithInvalidDateFails(): void
    {
        $result = $this->callMcpTool($this->client, 'daily-expense-report', [
            'calendarIds' => $this->calendarIds,
            'dateFrom' => 'not-a-date',
            'dateTo' => '2024-12-31',
        ]);

        $this->assertTrue($result['isError']);
        $this->assertStringContainsString('Invalid date', $result['content'][0]['text']);
    }
}
