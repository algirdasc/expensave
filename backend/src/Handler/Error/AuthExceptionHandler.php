<?php

namespace App\Handler\Error;

use App\Http\Response\Error\ErrorResponseMessage;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Security\Core\Exception\AuthenticationException;
use Throwable;

class AuthExceptionHandler implements ErrorHandlerInterface
{
    private AuthenticationException $exception;

    public function isSupported(Throwable $throwable): bool
    {
        return $throwable instanceof AuthenticationException;
    }

    /**
     * @param AuthenticationException $throwable
     */
    public function setThrowable(Throwable $throwable): static
    {
        $this->exception = $throwable;

        return $this;
    }

    public function getThrowable(): Throwable
    {
        return $this->exception;
    }

    public function getStatusCode(): int
    {
        return Response::HTTP_UNAUTHORIZED;
    }

    public function getMessages(): array
    {
        return [new ErrorResponseMessage($this->exception->getMessage())];
    }
}