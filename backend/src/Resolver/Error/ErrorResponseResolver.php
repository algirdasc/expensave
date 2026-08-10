<?php

declare(strict_types=1);

namespace App\Resolver\Error;

use App\Exception\UnhandledException;
use App\Handler\Error\ErrorHandlerInterface;
use App\Handler\Error\UnhandledExceptionHandler;
use App\Response\Error\ErrorResponse;
use RuntimeException;
use Symfony\Component\DependencyInjection\Attribute\Autowire;
use Symfony\Component\DependencyInjection\Attribute\AutowireIterator;
use Throwable;

readonly class ErrorResponseResolver
{
    /**
     * @param iterable<ErrorHandlerInterface> $responseErrorHandlers
     */
    public function __construct(
        #[AutowireIterator('app.handler.error')] private readonly iterable $responseErrorHandlers,
        #[Autowire('%kernel.debug%')] private readonly bool $debug,
    ) {
    }

    public function getFromThrowable(Throwable $throwable): ErrorResponse
    {
        foreach ($this->responseErrorHandlers as $responseErrorHandler) {
            if ($responseErrorHandler->isSupported($throwable)) {
                return new ErrorResponse($responseErrorHandler->setThrowable($throwable));
            }
        }

        return new ErrorResponse(
            (new UnhandledExceptionHandler($this->debug))->setThrowable($throwable)
        );
    }
}
