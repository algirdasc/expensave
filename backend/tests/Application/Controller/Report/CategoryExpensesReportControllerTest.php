<?php

declare(strict_types=1);

namespace App\Tests\Application\Controller\Report;

use App\Controller\Report\CategoryExpensesReportController;
use App\Tests\ApplicationTestCase;
use PHPUnit\Framework\Attributes\CoversClass;

#[CoversClass(CategoryExpensesReportController::class)]
class CategoryExpensesReportControllerTest extends ApplicationTestCase
{
    public function testInvoke(): void
    {
        $client = $this->getAuthenticatedClient();
        $calendarIds = sprintf('%d,%d', $this->getCalendarId('User 1 Calendar'), $this->getCalendarId('Shared Calendar'));

        $client->jsonRequest('GET', sprintf('/api/report/category-expenses/%s/2024-01-01/2024-12-31', $calendarIds));

        $response = $client->getResponse();

        $this->assertResponseIsSuccessful();

        $responseJson = json_decode((string) $response->getContent(), true);

        $this->assertArrayHasKey('categoryBalances', $responseJson);
        $this->assertCount(4, $responseJson['categoryBalances']);

        $this->assertArrayHasKey('meta', $responseJson);
        $this->assertEquals(['change' => -20, 'expense' => -75, 'income' => 55], $responseJson['meta']);
    }
}
