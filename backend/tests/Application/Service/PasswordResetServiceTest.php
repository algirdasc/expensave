<?php

declare(strict_types=1);

namespace App\Tests\Application\Service;

use App\Entity\User;
use App\Exception\RequestValidationException;
use App\Repository\UserRepository;
use App\Service\PasswordResetService;
use DateTimeImmutable;
use PHPUnit\Framework\Attributes\CoversClass;
use PHPUnit\Framework\TestCase;
use Symfony\Component\Mailer\MailerInterface;
use Symfony\Component\Mime\Email;
use Symfony\Component\Mime\RawMessage;

#[CoversClass(PasswordResetService::class)]
class PasswordResetServiceTest extends TestCase
{
    public function testForgotPasswordDoesNothingWhenUserNotFound(): void
    {
        $repo = $this->createMock(UserRepository::class);
        $repo
            ->expects($this->once())
            ->method('findOneBy')
            ->with(['email' => 'missing@example.com', 'active' => true])
            ->willReturn(null);

        $repo
            ->expects($this->never())
            ->method('save');

        $mailer = $this->createMock(MailerInterface::class);
        $mailer
            ->expects($this->never())
            ->method('send');

        $service = new PasswordResetService($repo, $mailer, 'http://localhost:18002', 'no-reply@expensave.local');
        $service->forgotPassword('missing@example.com');
    }

    public function testForgotPasswordCreatesResetTokenPersistsUserAndSendsEmail(): void
    {
        $user = (new User())
            ->setEmail('user@example.com')
            ->setName('User')
            ->setActive(true)
            ->setPassword('old-hash');

        $repo = $this->createMock(UserRepository::class);
        $repo
            ->expects($this->once())
            ->method('findOneBy')
            ->with(['email' => 'user@example.com', 'active' => true])
            ->willReturn($user);

        $repo
            ->expects($this->once())
            ->method('save')
            ->with($this->identicalTo($user));

        $mailer = $this->createMock(MailerInterface::class);
        $mailer
            ->expects($this->once())
            ->method('send')
            ->with($this->callback(function (RawMessage $message) use ($user): bool {
                $this->assertInstanceOf(Email::class, $message);
                $this->assertSame(['no-reply@expensave.local'], array_map(static fn ($address): string => $address->getAddress(), $message->getFrom()));
                $this->assertSame(['user@example.com'], array_map(static fn ($address): string => $address->getAddress(), $message->getTo()));
                $this->assertStringContainsString('/auth/reset-password?hash=', (string) $message->getTextBody());
                $this->assertStringContainsString((string) $user->getPasswordResetToken(), (string) $message->getTextBody());

                return true;
            }));

        $service = new PasswordResetService($repo, $mailer, 'http://localhost:18002', 'no-reply@expensave.local');
        $service->forgotPassword('user@example.com');

        $this->assertSame('old-hash', $user->getPassword());
        $this->assertNotNull($user->getPasswordResetToken());
        $this->assertSame(64, strlen($user->getPasswordResetToken()));
        $this->assertNotNull($user->getPasswordResetTokenExpiresAt());
        $this->assertGreaterThan(new DateTimeImmutable(), $user->getPasswordResetTokenExpiresAt());
    }

    public function testResetPasswordDoesNothingWhenHashNotFound(): void
    {
        $repo = $this->createMock(UserRepository::class);
        $repo
            ->expects($this->once())
            ->method('findOneBy')
            ->with(['passwordResetToken' => 'missing-hash', 'active' => true])
            ->willReturn(null);

        $repo
            ->expects($this->never())
            ->method('save');

        $service = new PasswordResetService($repo, $this->createStub(MailerInterface::class), 'http://localhost:18002', 'no-reply@expensave.local');

        $this->expectException(RequestValidationException::class);
        $this->expectExceptionMessage('hash: Password reset link is invalid or expired.');

        $service->resetPassword('missing-hash', 'new-password');
    }

    public function testResetPasswordFailsWhenHashIsExpired(): void
    {
        $user = (new User())
            ->setEmail('user@example.com')
            ->setName('User')
            ->setActive(true)
            ->setPassword('current-password-hash')
            ->setPasswordResetToken('reset-hash')
            ->setPasswordResetTokenExpiresAt(new DateTimeImmutable('-1 minute'));

        $repo = $this->createMock(UserRepository::class);
        $repo
            ->expects($this->once())
            ->method('findOneBy')
            ->with(['passwordResetToken' => 'reset-hash', 'active' => true])
            ->willReturn($user);

        $repo
            ->expects($this->never())
            ->method('save');

        $service = new PasswordResetService($repo, $this->createStub(MailerInterface::class), 'http://localhost:18002', 'no-reply@expensave.local');

        $this->expectException(RequestValidationException::class);
        $this->expectExceptionMessage('hash: Password reset link is invalid or expired.');

        $service->resetPassword('reset-hash', 'new-password');
    }

    public function testResetPasswordSetsPlainPasswordClearsTokenAndPersistsUser(): void
    {
        $user = (new User())
            ->setEmail('user@example.com')
            ->setName('User')
            ->setActive(true)
            ->setPassword('current-password-hash')
            ->setPasswordResetToken('reset-hash')
            ->setPasswordResetTokenExpiresAt(new DateTimeImmutable('+1 hour'));

        $repo = $this->createMock(UserRepository::class);
        $repo
            ->expects($this->once())
            ->method('findOneBy')
            ->with(['passwordResetToken' => 'reset-hash', 'active' => true])
            ->willReturn($user);

        $repo
            ->expects($this->once())
            ->method('save')
            ->with($this->identicalTo($user));

        $service = new PasswordResetService($repo, $this->createStub(MailerInterface::class), 'http://localhost:18002', 'no-reply@expensave.local');
        $service->resetPassword('reset-hash', 'new-password');

        $this->assertSame('new-password', $user->getPlainPassword());
        $this->assertNull($user->getPasswordResetToken());
        $this->assertNull($user->getPasswordResetTokenExpiresAt());
    }
}
