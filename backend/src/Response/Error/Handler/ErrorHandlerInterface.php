<?php

namespace App\Response\Error\Handler;

use Throwable;

interface ErrorHandlerInterface
{
    public function isSupported(Throwable $throwable): bool;

    public function setThrowable(Throwable $throwable): static;

    public function getThrowable(): Throwable;

    public function getStatusCode(): int;

    /**
     * @return array<string>
     */
    public function getMessages(): array;
}