<?php

declare(strict_types=1);

namespace App\Tests\Application\Controller\Admin;

use App\Controller\Admin\UserManagementController;
use App\Tests\ApplicationTestCase;
use Doctrine\ORM\EntityManagerInterface;
use PHPUnit\Framework\Attributes\CoversClass;
use Symfony\Bundle\FrameworkBundle\KernelBrowser;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;

#[CoversClass(UserManagementController::class)]
class UserManagementControllerTest extends ApplicationTestCase
{
    private KernelBrowser $client;

    public function setUp(): void
    {
        $_ENV['MAILER_DSN'] = 'null://null';
        putenv('MAILER_DSN=null://null');

        parent::setUp();

        $this->client = $this->getAuthenticatedClient();
    }

    public function testAdminCanListUsers(): void
    {
        $this->client->jsonRequest('GET', '/api/admin/users');

        $this->assertResponseIsSuccessful();

        $users = $this->indexBy($this->getJsonResponse($this->client), 'email');
        $this->assertCount(3, $users);
        $this->assertSame('admin', $users['user1@email.com']['role']);
        $this->assertSame('user', $users['user2@email.com']['role']);
        $this->assertFalse($users['user3@email.com']['active']);
    }

    public function testAdminCanUpdateUserRole(): void
    {
        $user = $this->getUser('User 2');

        $this->client->jsonRequest('PUT', sprintf('/api/admin/users/%d/role', $user->getId()), [
            'role' => 'admin',
        ]);

        $this->assertResponseIsSuccessful();

        $response = $this->getJsonResponse($this->client);
        $this->assertSame('user2@email.com', $response['email']);
        $this->assertSame('admin', $response['role']);
    }

    public function testAdminCanActivateUser(): void
    {
        $user = $this->getUser('User 3');
        $this->assertFalse($user->isActive());

        $this->client->jsonRequest('PUT', sprintf('/api/admin/users/%d/activate', $user->getId()));

        $this->assertResponseIsSuccessful();

        $response = $this->getJsonResponse($this->client);
        $this->assertSame('user3@email.com', $response['email']);
        $this->assertTrue($response['active']);

        $this->refresh($user);
        $this->assertTrue($user->isActive());
    }

    public function testAdminCanDeactivateUser(): void
    {
        $user = $this->getUser('User 2');
        $this->client->jsonRequest('POST', sprintf('/api/admin/users/%d/password-reset', $user->getId()));
        $this->refresh($user);
        $this->assertNotNull($user->getPasswordResetToken());

        $this->client->jsonRequest('PUT', sprintf('/api/admin/users/%d/deactivate', $user->getId()));

        $this->assertResponseIsSuccessful();

        $response = $this->getJsonResponse($this->client);
        $this->assertSame('user2@email.com', $response['email']);
        $this->assertFalse($response['active']);

        $deactivatedUser = $this->getUser('User 2');
        $this->assertFalse($deactivatedUser->isActive());
        $this->assertNull($deactivatedUser->getPasswordResetToken());
        $this->assertNull($deactivatedUser->getPasswordResetTokenExpiresAt());
    }

    public function testAdminCannotDeactivateSelf(): void
    {
        $user = $this->getUser('User 1');

        $this->client->jsonRequest('PUT', sprintf('/api/admin/users/%d/deactivate', $user->getId()));

        $this->assertResponseStatusCodeSame(Response::HTTP_CONFLICT);

        $response = $this->getJsonResponse($this->client);
        $this->assertSame('user', $response['messages'][0]['propertyPath']);
    }

    public function testAdminCannotManageOwnRole(): void
    {
        $user = $this->getUser('User 1');

        $this->client->jsonRequest('PUT', sprintf('/api/admin/users/%d/role', $user->getId()), [
            'role' => 'user',
        ]);

        $this->assertResponseStatusCodeSame(Response::HTTP_CONFLICT);

        $response = $this->getJsonResponse($this->client);
        $this->assertSame('user', $response['messages'][0]['propertyPath']);
    }

    public function testAdminCanSendPasswordResetEmail(): void
    {
        $user = $this->getUser('User 2');
        $this->assertNull($user->getPasswordResetToken());

        $this->client->jsonRequest('POST', sprintf('/api/admin/users/%d/password-reset', $user->getId()));

        $this->assertResponseIsSuccessful();

        $this->refresh($user);
        $this->assertNotNull($user->getPasswordResetToken());
        $this->assertNotNull($user->getPasswordResetTokenExpiresAt());
    }

    public function testAdminCannotSendPasswordResetEmailToSelf(): void
    {
        $user = $this->getUser('User 1');

        $this->client->jsonRequest('POST', sprintf('/api/admin/users/%d/password-reset', $user->getId()));

        $this->assertResponseStatusCodeSame(Response::HTTP_CONFLICT);

        $response = $this->getJsonResponse($this->client);
        $this->assertSame('user', $response['messages'][0]['propertyPath']);
    }

    public function testAdminCanResetPasswordAndReceiveTemporaryPassword(): void
    {
        $user = $this->getUser('User 2');

        $this->client->jsonRequest('POST', sprintf('/api/admin/users/%d/temporary-password', $user->getId()));

        $this->assertResponseIsSuccessful();

        $response = $this->getJsonResponse($this->client);
        $this->assertIsString($response['password']);
        $this->assertSame(16, strlen($response['password']));

        $this->refresh($user);
        $this->assertTrue($this->passwordHasher()->isPasswordValid($user, $response['password']));
    }

    public function testAdminCannotResetOwnPassword(): void
    {
        $user = $this->getUser('User 1');

        $this->client->jsonRequest('POST', sprintf('/api/admin/users/%d/temporary-password', $user->getId()));

        $this->assertResponseStatusCodeSame(Response::HTTP_CONFLICT);

        $response = $this->getJsonResponse($this->client);
        $this->assertSame('user', $response['messages'][0]['propertyPath']);
    }

    public function testNonAdminCannotManageUsers(): void
    {
        $client = $this->getAuthenticatedClient($this->getUser('User 2'));

        $client->jsonRequest('GET', '/api/admin/users');

        $this->assertResponseStatusCodeSame(Response::HTTP_FORBIDDEN);
    }

    private function refresh(object $entity): void
    {
        /** @var EntityManagerInterface $manager */
        $manager = static::getContainer()->get('doctrine')->getManager();
        $manager->refresh($entity);
    }

    private function passwordHasher(): UserPasswordHasherInterface
    {
        return static::getContainer()->get(UserPasswordHasherInterface::class);
    }
}
