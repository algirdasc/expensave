<?php

declare(strict_types=1);

namespace App\Tests\Application\Controller\Auth;

use App\Controller\Auth\RegistrationController;
use App\Tests\ApplicationTestCase;
use PHPUnit\Framework\Attributes\CoversClass;
use Symfony\Bundle\FrameworkBundle\KernelBrowser;
use Symfony\Component\HttpFoundation\Response;

#[CoversClass(RegistrationController::class)]
class RegistrationControllerTest extends ApplicationTestCase
{
    private KernelBrowser $client;

    public function setUp(): void
    {
        parent::setUp();

        $this->client = $this->getAuthenticatedClient();
    }

    public function testRegistration(): void
    {
        $this->client->jsonRequest('POST', '/api/auth/register', [
            'email' => 'registration@email.com',
            'password' => 'password100',
            'confirmPassword' => 'password100',
            'fullName' => 'Registered User',
        ]);
        $this->assertResponseIsSuccessful();

        $registeredClient = $this->getAuthenticatedClient($this->getUser('Registered User'));

        $registeredClient->jsonRequest('GET', '/api/user/profile');
        $this->assertResponseEqualToJson($registeredClient->getResponse(), 'Response/Auth/user-registration.json');
    }

    public function testDisabledRegistration(): void
    {
        $_ENV['REGISTRATION_DISABLED'] = true;

        $this->client->jsonRequest('POST', '/api/auth/register', [
            'email' => 'registration@email.com',
            'password' => 'password100',
            'confirmPassword' => 'password100',
            'fullName' => 'Registered User',
        ]);

        $this->assertResponseStatusCodeSame(Response::HTTP_NOT_FOUND);
    }
}