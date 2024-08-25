<?php

namespace App\Handler\Error;

use App\Http\Response\Error\ErrorResponseMessage;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpKernel\Exception\AccessDeniedHttpException;
use Throwable;

class AccessDeniedHandler implements ErrorHandlerInterface
{
    private AccessDeniedHttpException $exception;

    public function isSupported(Throwable $throwable): bool
    {
        return $throwable instanceof AccessDeniedHttpException;
    }

    /**
     * @param AccessDeniedHttpException $throwable
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
        return Response::HTTP_FORBIDDEN;
    }

    public function getMessages(): array
    {
        return [new ErrorResponseMessage($this->exception->getMessage())];
    }
}