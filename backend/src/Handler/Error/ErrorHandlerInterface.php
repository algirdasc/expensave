<?php

namespace App\Handler\Error;

use App\Response\Error\ErrorResponseMessage;
use Symfony\Component\DependencyInjection\Attribute\AutoconfigureTag;
use Throwable;

#[AutoconfigureTag('app.handler.error')]
interface ErrorHandlerInterface
{
    public function isSupported(Throwable $throwable): bool;

    public function setThrowable(Throwable $throwable): static;

    public function getThrowable(): Throwable;

    public function getStatusCode(): int;

    /**
     * @return array<ErrorResponseMessage>
     */
    public function getMessages(): array;
}