<?php

declare(strict_types=1);

namespace App\Tests\Application\Controller\Auth;

use App\Controller\Auth\PasswordController;
use App\Repository\UserRepository;
use App\Tests\ApplicationTestCase;
use DateTimeImmutable;
use PHPUnit\Framework\Attributes\CoversClass;
use Symfony\Bundle\FrameworkBundle\KernelBrowser;
use Symfony\Component\HttpFoundation\Response;

#[CoversClass(PasswordController::class)]
class PasswordControllerTest extends ApplicationTestCase
{
    private KernelBrowser $client;

    public function setUp(): void
    {
        parent::setUp();

        $this->client = $this->getAuthenticatedClient();
    }

    public function testResetPasswordTokenCannotBeUsedTwice(): void
    {
        $token = 'reset-token';
        $user = $this->getUser();
        $user
            ->setPasswordResetToken($token)
            ->setPasswordResetTokenExpiresAt(new DateTimeImmutable('+1 hour'))
        ;

        self::getContainer()->get(UserRepository::class)->save($user);

        $payload = [
            'hash' => $token,
            'password' => 'changed-password',
            'confirmPassword' => 'changed-password',
        ];

        $this->client->jsonRequest('PUT', '/api/auth/password/reset', $payload);
        $this->assertResponseIsSuccessful();

        $this->client->jsonRequest('PUT', '/api/auth/password/reset', $payload);
        $this->assertResponseStatusCodeSame(Response::HTTP_UNPROCESSABLE_ENTITY);

        $response = $this->getJsonResponse($this->client);
        $this->assertSame('App\Exception\RequestValidationException', $response['throwable']);
        $this->assertSame('hash', $response['messages'][0]['propertyPath']);
    }
}
