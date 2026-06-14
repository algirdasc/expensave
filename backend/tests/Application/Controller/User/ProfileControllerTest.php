<?php

declare(strict_types=1);

namespace App\Tests\Application\Controller\User;

use App\Controller\User\ProfileController;
use App\Tests\ApplicationTestCase;
use PHPUnit\Framework\Attributes\CoversClass;
use Symfony\Bundle\FrameworkBundle\KernelBrowser;

#[CoversClass(ProfileController::class)]
class ProfileControllerTest extends ApplicationTestCase
{
    private KernelBrowser $client;

    public function setUp(): void
    {
        parent::setUp();

        $this->client = $this->getAuthenticatedClient();
    }

    public function testList(): void
    {
        $this->client->jsonRequest('GET', '/api/user');

        $this->assertResponseIsSuccessful();

        $users = $this->indexBy($this->getJsonResponse($this->client), 'email');
        $this->assertCount(2, $users);
        $this->assertArrayHasKey('user1@email.com', $users);
        $this->assertArrayHasKey('user2@email.com', $users);
        $this->assertSame('User 1', $users['user1@email.com']['name']);
        $this->assertSame('User 2', $users['user2@email.com']['name']);
        $this->assertTrue($users['user1@email.com']['active']);
        $this->assertTrue($users['user2@email.com']['active']);
    }

    public function testChangePassword(): void
    {
        $this->client->jsonRequest('PUT', '/api/user/change-password', [
            'currentPassword' => 'password1',
            'newPassword' => 'changed',
            'confirmPassword' => 'changed',
        ]);

        $this->assertResponseIsSuccessful();
    }

    public function testDefaultCalendar(): void
    {
        $calendarId = $this->getCalendarId('Shared Calendar');

        $this->client->jsonRequest('PUT', sprintf('/api/user/default-calendar/%d', $calendarId));

        $this->assertResponseIsSuccessful();

        $profile = $this->getJsonResponse($this->client);
        $this->assertIsInt($profile['id']);
        $this->assertSame('user1@email.com', $profile['email']);
        $this->assertSame('User 1', $profile['name']);
        $this->assertTrue($profile['active']);
        $this->assertSame($calendarId, $profile['defaultCalendarId']);
    }

    public function testProfile(): void
    {
        $this->client->jsonRequest('GET', '/api/user/profile');

        $this->assertResponseIsSuccessful();

        $profile = $this->getJsonResponse($this->client);
        $this->assertIsInt($profile['id']);
        $this->assertSame('user1@email.com', $profile['email']);
        $this->assertSame('User 1', $profile['name']);
        $this->assertTrue($profile['active']);
        $this->assertNull($profile['defaultCalendarId']);
    }
}
