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
        $client->jsonRequest(
            $method,
            $this->resolveFixturePlaceholders($endpoint),
            $this->resolveFixturePlaceholders($data)
        );

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
            'Access to category expense report' => ['GET', '/api/report/category-expenses/{user2Calendar}/2024-01-01/2024-12-31',],
            'Access to monthly expense report' => ['GET', '/api/report/monthly-expenses/{user2Calendar}/2024-01-01/2024-12-31',],
            'Access to daily expense report' => ['GET', '/api/report/daily-expenses/{user2Calendar}/2024-01-01/2024-12-31',],
            'Access to calendar' => ['GET', '/api/calendar/{user2Calendar}',],
            'Access to calendar expenses' => ['GET', '/api/calendar/{user2Calendar}/expenses/2024-01-01/2024-12-31',],
            'Access to calendar update' => ['PUT', '/api/calendar/{user2Calendar}', ['name' => 'test']],
            'Access to calendar delete' => ['DELETE', '/api/calendar/{user2Calendar}',],
            'Access to expense' => ['GET', '/api/expense/{user2Expense}',],
            'Access to expense create' => ['POST', '/api/expense', ['calendar' => '{user2Calendar}', ...$expense]],
            'Access to expense update' => ['PUT', '/api/expense/{user2Expense}', ['calendar' => '{user1Calendar}', ...$expense]],
            'Access to expense delete' => ['DELETE', '/api/expense/{user2Expense}',],
            'Access to balance update create' => ['POST', '/api/balance-update', ['calendar' => '{user2Calendar}', ...$expense]],
            'Access to balance update update' => ['PUT', '/api/balance-update/{user2Expense}', ['calendar' => '{user1Calendar}', ...$expense]],
            'Access to balance update delete' => ['DELETE', '/api/balance-update/{user2Expense}',],
            'Access to change default calendar' => ['PUT', '/api/user/default-calendar/{user2Calendar}',],
        ];
    }

    private function resolveFixturePlaceholders(mixed $value): mixed
    {
        $replacements = [
            '{user1Calendar}' => $this->getCalendarId('User 1 Calendar'),
            '{user2Calendar}' => $this->getCalendarId('User 2 Calendar'),
            '{user2Expense}' => $this->getExpenseId('Test expense 0', 'User 2 Calendar'),
        ];

        if (is_string($value)) {
            if (array_key_exists($value, $replacements)) {
                return $replacements[$value];
            }

            return str_replace(array_keys($replacements), array_map('strval', $replacements), $value);
        }

        if (!is_array($value)) {
            return $value;
        }

        $resolved = [];
        foreach ($value as $key => $nestedValue) {
            $resolved[$key] = $this->resolveFixturePlaceholders($nestedValue);
        }

        return $resolved;
    }
}
