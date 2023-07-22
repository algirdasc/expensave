<?php

namespace App\Handler\Error;

use Throwable;

interface ErrorHandlerInterface
{
    public function isSupported(Throwable $throwable): bool;

    public function setThrowable(Throwable $throwable): static;

    public function getThrowable(): Throwable;

    public function getStatusCode(): int;

    public function getMessages(): mixed;
}