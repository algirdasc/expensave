<?php

declare(strict_types=1);

namespace App\Tests\Application;

use App\Tests\ApplicationTestCase;
use PHPUnit\Framework\Attributes\DataProvider;
use Symfony\Component\HttpFoundation\Response;

class AccessDeniedTest extends ApplicationTestCase
{
    #[DataProvider('endpointProvider')]
    public function testEndpoint(string $method, string $endpoint, array $data = []): void
    {
        $client = $this->getAuthenticatedClient();
        $client->jsonRequest($method, $endpoint, $data);

        $this->assertResponseStatusCodeSame(Response::HTTP_FORBIDDEN);
    }

    public static function endpointProvider(): array
    {
        $expense = [
            'label' => 'label',
            'amount' => 10,
            'createdAt' => '2024-06-01 12:30:59',
        ];

        return [
            'Access to category expense report' => ['GET', '/api/report/category-expenses/2/2024-01-01/2024-12-31',],
            'Access to monthly expense report' => ['GET', '/api/report/monthly-expenses/2/2024-01-01/2024-12-31',],
            'Access to daily expense report' => ['GET', '/api/report/daily-expenses/2/2024-01-01/2024-12-31',],
            'Access to calendar' => ['GET', '/api/calendar/2',],
            'Access to calendar expenses' => ['GET', '/api/calendar/2/expenses/2024-01-01/2024-12-31',],
            'Access to calendar update' => ['PUT', '/api/calendar/2', ['name' => 'test']],
            'Access to calendar delete' => ['DELETE', '/api/calendar/2',],
            'Access to expense' => ['GET', '/api/expense/5',],
            'Access to expense create' => ['POST', '/api/expense', ['calendar' => 2, ...$expense]],
            'Access to expense update' => ['PUT', '/api/expense/5', ['calendar' => 1, ...$expense]],
            'Access to expense delete' => ['DELETE', '/api/expense/5',],
            'Access to balance update create' => ['POST', '/api/balance-update', ['calendar' => 2, ...$expense]],
            'Access to balance update update' => ['PUT', '/api/balance-update/5', ['calendar' => 1, ...$expense]],
            'Access to balance update delete' => ['DELETE', '/api/balance-update/5',],
            'Access to change default calendar' => ['PUT', '/api/user/default-calendar/2',],
        ];
    }
}