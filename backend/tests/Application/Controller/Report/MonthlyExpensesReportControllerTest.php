<?php

declare(strict_types=1);

namespace App\Tests\Application\Controller\Report;

use App\Controller\Report\CategoryExpensesReportController;
use App\Controller\Report\DailyExpenseReportController;
use App\Controller\Report\MonthlyExpenseReportController;
use App\Entity\Calendar;
use App\Repository\CalendarRepository;
use App\Tests\ApplicationTestCase;
use App\Tests\BrowserTestCase;
use PHPUnit\Framework\Attributes\CoversClass;
use Symfony\Bundle\FrameworkBundle\KernelBrowser;
use Symfony\Component\HttpFoundation\Response;

#[CoversClass(MonthlyExpenseReportController::class)]
class MonthlyExpensesReportControllerTest extends ApplicationTestCase
{
    public function testInvoke(): void
    {
        $client = $this->getAuthenticatedClient();
        $client->jsonRequest('GET', '/api/report/monthly-expenses/1,3/2024-01-01/2024-12-31');

        $response = $client->getResponse();

        $this->assertResponseIsSuccessful();

        $responseJson = json_decode((string) $response->getContent(), true);

        $this->assertArrayHasKey('expenseBalances', $responseJson);
        $this->assertCount(12, $responseJson['expenseBalances']);

        $this->assertArrayHasKey('meta', $responseJson);
        $this->assertEquals(['change' => -49, 'expense' => -134, 'income' => 85], $responseJson['meta']);
    }
}