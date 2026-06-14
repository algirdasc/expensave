<?php

declare(strict_types=1);

namespace App\Tests\Application;

use App\Tests\ApplicationTestCase;
use PHPUnit\Framework\Attributes\DataProvider;
use Symfony\Component\HttpFoundation\Response;

class AuthenticationRequiredTest extends ApplicationTestCase
{
    #[DataProvider('endpointProvider')]
    public function testRequiresAuth(string $method, string $endpoint, array $data = []): void
    {
        if (($data['calendar'] ?? null) === '{user1Calendar}') {
            $data['calendar'] = $this->getCalendarId('User 1 Calendar');
        }

        /** @var \Symfony\Bundle\FrameworkBundle\KernelBrowser $client */
        $client = self::getContainer()->get('test.client');

        $browser = self::getClient($client);
        $browser->jsonRequest($method, $endpoint, $data);

        $this->assertResponseStatusCodeSame(Response::HTTP_UNAUTHORIZED);
    }

    public static function endpointProvider(): array
    {
        return [
            'Profile' => ['GET', '/api/user/profile'],
            'User list' => ['GET', '/api/user'],
            'Calendar list' => ['GET', '/api/calendar'],
            'Expense create' => ['POST', '/api/expense', [
                'label' => 'Test',
                'amount' => -10,
                'calendar' => '{user1Calendar}',
                'createdAt' => '2024-05-15 15:30:15',
            ]],
        ];
    }
}
