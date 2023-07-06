<?php

declare(strict_types=1);

namespace App\Response\Error\Resolver;

use App\Response\Error\ErrorResponse;
use App\Response\Error\Handler\ErrorHandlerInterface;
use RuntimeException;
use Symfony\Component\DependencyInjection\Attribute\TaggedIterator;
use Throwable;

class ErrorResponseResolver
{
    /**
     * @var iterable<ErrorHandlerInterface>
     */
    private iterable $responseErrorHandlers;

    /**
     * @param iterable<ErrorHandlerInterface> $responseErrorHandlers
     */
    public function __construct(
        #[TaggedIterator('app.response.error.handlers')] iterable $responseErrorHandlers
    ) {
        $this->responseErrorHandlers = $responseErrorHandlers;
    }

    public function getFromThrowable(Throwable $throwable): ErrorResponse
    {
        foreach ($this->responseErrorHandlers as $responseErrorHandler) {
            if ($responseErrorHandler->isSupported($throwable)) {
                return new ErrorResponse($responseErrorHandler->setThrowable($throwable));
            }
        }

        //throw $throwable;

        throw new RuntimeException($throwable->getMessage(), 500, $throwable);

        throw new RuntimeException(sprintf('Handler for %s not found', $throwable::class), 500, $throwable);
    }
}
