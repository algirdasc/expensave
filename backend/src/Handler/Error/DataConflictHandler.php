<?php

declare(strict_types=1);

namespace App\Handler\Error;

use App\Exception\DataConflictException;
use App\Response\Error\ErrorResponseMessage;
use Symfony\Component\HttpFoundation\Response;
use Throwable;

class DataConflictHandler implements ErrorHandlerInterface
{
    private DataConflictException $exception;

    public function isSupported(Throwable $throwable): bool
    {
        return $throwable instanceof DataConflictException;
    }

    /**
     * @param DataConflictException $throwable
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
        return Response::HTTP_CONFLICT;
    }

    public function getMessages(): array
    {
        return [
            new ErrorResponseMessage(
                $this->exception->getMessage(),
                $this->exception->getPropertyPath(),
            ),
        ];
    }
}
