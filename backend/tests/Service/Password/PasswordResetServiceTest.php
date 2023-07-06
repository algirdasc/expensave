<?php

namespace App\Tests\Service\Password;

use App\Repository\UserRepository;
use App\Service\Password\PasswordResetService;
use PHPUnit\Framework\MockObject\MockObject;
use PHPUnit\Framework\TestCase;

/**
 * Class PasswordResetServiceTest.
 *
 * @covers \App\Service\Password\PasswordResetService
 */
final class PasswordResetServiceTest extends TestCase
{
    private PasswordResetService $passwordResetService;

    private UserRepository|MockObject $userRepository;

    /**
     * {@inheritdoc}
     */
    protected function setUp(): void
    {
        parent::setUp();

        $this->userRepository = $this->createMock(UserRepository::class);
        $this->passwordResetService = new PasswordResetService($this->userRepository);
    }

    /**
     * {@inheritdoc}
     */
    protected function tearDown(): void
    {
        parent::tearDown();

        unset($this->passwordResetService);
        unset($this->userRepository);
    }

    public function testForgotPassword(): void
    {
        /** @todo This test is incomplete. */
        $this->markTestIncomplete();
    }

    public function testResetPassword(): void
    {
        /** @todo This test is incomplete. */
        $this->markTestIncomplete();
    }
}
