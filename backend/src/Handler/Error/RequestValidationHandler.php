<?php

declare(strict_types=1);

namespace App\Handler\Error;

use App\Exception\RequestValidationException;
use App\Http\Response\Error\ErrorResponseMessage;
use Symfony\Component\HttpFoundation\Response;
use Throwable;

class RequestValidationHandler implements ErrorHandlerInterface
{
    private RequestValidationException $exception;

    public function isSupported(Throwable $throwable): bool
    {
        return $throwable instanceof RequestValidationException;
    }

    /**
     * @param RequestValidationException $throwable
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
        return Response::HTTP_UNPROCESSABLE_ENTITY;
    }

    public function getMessages(): array
    {
        $errors = [];

        foreach ($this->exception->getValidationErrors() as $error) {
            $validationError = new ErrorResponseMessage(
                message: (string) $error->getMessage(),
                propertyPath: $error->getPropertyPath()
            );

            $errors[] = $validationError;
        }

        return $errors;
    }
}
