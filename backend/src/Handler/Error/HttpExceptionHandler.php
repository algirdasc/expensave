<?php

declare(strict_types=1);

namespace App\Handler\Error;

use App\Http\Response\Error\ErrorResponseMessage;
use Symfony\Component\HttpKernel\Exception\HttpExceptionInterface;
use Throwable;

class HttpExceptionHandler implements ErrorHandlerInterface
{
    private HttpExceptionInterface $exception;

    public function getThrowable(): HttpExceptionInterface
    {
        return $this->exception;
    }

    /**
     * @param HttpExceptionInterface $throwable
     */
    public function setThrowable(Throwable $throwable): static
    {
        $this->exception = $throwable;

        return $this;
    }

    public function isSupported(Throwable $throwable): bool
    {
        return $throwable instanceof HttpExceptionInterface;
    }

    public function getStatusCode(): int
    {
        return $this->exception->getStatusCode();
    }

    public function getMessages(): array
    {
        return [new ErrorResponseMessage($this->exception->getMessage())];
    }
}
