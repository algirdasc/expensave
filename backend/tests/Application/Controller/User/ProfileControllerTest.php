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
        $this->assertResponseEqualToJson($this->client->getResponse(), 'Response/User/user-list.json');
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
        $this->client->jsonRequest('PUT', '/api/user/default-calendar/3');

        $this->assertResponseIsSuccessful();
        $this->assertResponseEqualToJson($this->client->getResponse(), 'Response/User/user-default-calendar.json');
    }

    public function testProfile(): void
    {
        $this->client->jsonRequest('GET', '/api/user/profile');

        $this->assertResponseIsSuccessful();
        $this->assertResponseEqualToJson($this->client->getResponse(), 'Response/User/user-profile.json');
    }
}