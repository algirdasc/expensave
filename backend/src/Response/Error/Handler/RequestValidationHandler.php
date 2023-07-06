<?php

declare(strict_types=1);

namespace App\Response\Error\Handler;

use App\Exception\RequestValidationException;
use App\Response\Error\ErrorResponseMessage;
use App\Response\Error\Response\RequestValidationErrorResponse;
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

    /**
     * @return array<ErrorResponseMessage>
     */
    public function getMessages(): array
    {
        $errors = [];

        foreach ($this->exception->getValidationErrors() as $error) {
            $validationError = (new ErrorResponseMessage())
                ->setMessage((string) $error->getMessage())
                ->setPropertyPath($error->getPropertyPath())
            ;

            $errors[] = $validationError;
        }

        return $errors;
    }
}
