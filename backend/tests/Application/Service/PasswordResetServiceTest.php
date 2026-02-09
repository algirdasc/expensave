<?php

declare(strict_types=1);

namespace App\Tests\Application\Service;

use App\Entity\User;
use App\Repository\UserRepository;
use App\Service\PasswordResetService;
use PHPUnit\Framework\Attributes\CoversClass;
use PHPUnit\Framework\TestCase;

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

        $service = new PasswordResetService($repo);
        $service->forgotPassword('missing@example.com');

        $this->assertTrue(true); // explicit: no exception, no save
    }

    public function testForgotPasswordRandomizesPasswordAndPersistsUser(): void
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

        $service = new PasswordResetService($repo);
        $service->forgotPassword('user@example.com');

        $this->assertNotSame('old-hash', $user->getPassword());
        $this->assertSame(64, strlen($user->getPassword()));
    }

    public function testResetPasswordDoesNothingWhenHashNotFound(): void
    {
        $repo = $this->createMock(UserRepository::class);
        $repo
            ->expects($this->once())
            ->method('findOneBy')
            ->with(['password' => 'missing-hash', 'active' => true])
            ->willReturn(null);

        $repo
            ->expects($this->never())
            ->method('save');

        $service = new PasswordResetService($repo);
        $service->resetPassword('missing-hash', 'new-password');

        $this->assertTrue(true);
    }

    public function testResetPasswordSetsPlainPasswordAndPersistsUser(): void
    {
        $user = (new User())
            ->setEmail('user@example.com')
            ->setName('User')
            ->setActive(true)
            ->setPassword('reset-hash');

        $repo = $this->createMock(UserRepository::class);
        $repo
            ->expects($this->once())
            ->method('findOneBy')
            ->with(['password' => 'reset-hash', 'active' => true])
            ->willReturn($user);

        $repo
            ->expects($this->once())
            ->method('save')
            ->with($this->identicalTo($user));

        $service = new PasswordResetService($repo);
        $service->resetPassword('reset-hash', 'new-password');

        $this->assertSame('new-password', $user->getPlainPassword());
    }
}
