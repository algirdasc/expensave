<?php

declare(strict_types=1);

namespace App\Tests\Application\Controller\Auth;

use App\Controller\Auth\PasswordController;
use App\Request\Auth\PasswordForgotRequest;
use App\Service\PasswordResetService;
use PHPUnit\Framework\Attributes\CoversClass;
use PHPUnit\Framework\TestCase;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\RequestStack;
use Symfony\Component\HttpKernel\Exception\TooManyRequestsHttpException;
use Symfony\Component\RateLimiter\RateLimiterFactory;
use Symfony\Component\RateLimiter\Storage\InMemoryStorage;

#[CoversClass(PasswordController::class)]
class PasswordForgotThrottleTest extends TestCase
{
    public function testForgotPasswordIsThrottledByIp(): void
    {
        $limiterFactory = $this->createLimiterFactory();
        $limiterFactory->create('127.0.0.1')->consume(); // drain the IP budget

        $this->expectException(TooManyRequestsHttpException::class);
        $this->callForgot($limiterFactory);
    }

    public function testForgotPasswordIsThrottledByEmail(): void
    {
        $limiterFactory = $this->createLimiterFactory();
        $limiterFactory->create('user@example.com')->consume(); // drain the email budget

        $this->expectException(TooManyRequestsHttpException::class);
        $this->callForgot($limiterFactory);
    }

    private function callForgot(RateLimiterFactory $limiterFactory): void
    {
        $passwordResetService = $this->createMock(PasswordResetService::class);
        $passwordResetService->expects($this->never())->method('forgotPassword');

        $request = (new PasswordForgotRequest([], new RequestStack()))->setEmail('user@example.com');

        (new PasswordController())->forgotPassword(
            $request,
            $passwordResetService,
            Request::create('/api/auth/password/forgot', Request::METHOD_POST),
            $limiterFactory,
        );
    }

    private function createLimiterFactory(): RateLimiterFactory
    {
        return new RateLimiterFactory(
            ['id' => 'password_forgot', 'policy' => 'fixed_window', 'limit' => 1, 'interval' => '15 minutes'],
            new InMemoryStorage(),
        );
    }
}
