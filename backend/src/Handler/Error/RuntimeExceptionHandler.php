<?php

declare(strict_types=1);

namespace App\Handler\Error;

use App\Response\Error\ErrorResponseMessage;
use RuntimeException;
use Symfony\Component\HttpFoundation\Response;
use Throwable;

class RuntimeExceptionHandler implements ErrorHandlerInterface
{
    private RuntimeException $exception;

    public function getThrowable(): RuntimeException
    {
        return $this->exception;
    }

    /**
     * @param RuntimeException $throwable
     */
    public function setThrowable(Throwable $throwable): static
    {
        $this->exception = $throwable;

        return $this;
    }

    public function isSupported(Throwable $throwable): bool
    {
        return $throwable instanceof RuntimeException;
    }

    public function getStatusCode(): int
    {
        return Response::HTTP_INTERNAL_SERVER_ERROR;
    }

    public function getMessages(): array
    {
        return [new ErrorResponseMessage($this->exception->getMessage())];
    }
}
