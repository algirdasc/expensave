<?php

declare(strict_types=1);

namespace App\Handler\Error;

use App\Exception\UnhandledException;
use App\Response\Error\ErrorResponseMessage;
use Symfony\Component\DependencyInjection\Attribute\Autowire;
use Symfony\Component\HttpFoundation\Response;
use Throwable;

class UnhandledExceptionHandler implements ErrorHandlerInterface
{
    private const string GENERIC_MESSAGE = 'Internal server error.';

    private Throwable $throwable;

    public function __construct(
        #[Autowire('%kernel.debug%')] private readonly bool $debug = false
    ) {
    }

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
        // Hide the real exception class (e.g. Doctrine internals) from API clients in prod.
        return $this->debug ? $this->throwable : new UnhandledException(self::GENERIC_MESSAGE);
    }

    public function getStatusCode(): int
    {
        return Response::HTTP_INTERNAL_SERVER_ERROR;
    }

    public function getMessages(): array
    {
        if (!$this->debug) {
            return [new ErrorResponseMessage(self::GENERIC_MESSAGE)];
        }

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