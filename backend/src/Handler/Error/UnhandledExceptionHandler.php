<?php

declare(strict_types=1);

namespace App\Handler\Error;

use App\Exception\UnhandledException;
use App\Http\Response\Error\ErrorResponseMessage;
use Symfony\Component\HttpFoundation\Response;
use Throwable;

class UnhandledExceptionHandler implements ErrorHandlerInterface
{
    private Throwable $throwable;

    public function isSupported(Throwable $throwable): bool
    {
        return $throwable instanceof UnhandledException;
    }

    public function setThrowable(Throwable $throwable): static
    {
        $this->throwable = $throwable;

        return $this;
    }

    public function getThrowable(): Throwable
    {
        return $this->throwable;
    }

    public function getStatusCode(): int
    {
        return Response::HTTP_INTERNAL_SERVER_ERROR;
    }

    public function getMessages(): array
    {
        return [
            new ErrorResponseMessage(
                $this->throwable->getMessage(),
                file: $this->throwable->getFile(),
                line: $this->throwable->getLine(),
                trace: $this->throwable->getTraceAsString()
            )
        ];
    }
}