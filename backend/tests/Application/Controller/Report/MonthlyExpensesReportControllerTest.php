<?php

declare(strict_types=1);

namespace App\Tests\Application\Controller\Report;

use App\Controller\Report\MonthlyExpenseReportController;
use App\Tests\ApplicationTestCase;
use PHPUnit\Framework\Attributes\CoversClass;

#[CoversClass(MonthlyExpenseReportController::class)]
class MonthlyExpensesReportControllerTest extends ApplicationTestCase
{
    public function testInvoke(): void
    {
        $client = $this->getAuthenticatedClient();
        $calendarIds = sprintf('%d,%d', $this->getCalendarId('User 1 Calendar'), $this->getCalendarId('Shared Calendar'));

        $client->jsonRequest('GET', sprintf('/api/report/monthly-expenses/%s/2024-01-01/2024-12-31', $calendarIds));

        $response = $client->getResponse();

        $this->assertResponseIsSuccessful();

        $responseJson = json_decode((string) $response->getContent(), true);

        $this->assertArrayHasKey('expenseBalances', $responseJson);
        $this->assertCount(12, $responseJson['expenseBalances']);

        $this->assertArrayHasKey('meta', $responseJson);
        $this->assertEquals(['change' => -49, 'expense' => -134, 'income' => 85], $responseJson['meta']);
    }
}
