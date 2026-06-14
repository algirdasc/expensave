<?php

declare(strict_types=1);

namespace App\Exception;

use RuntimeException;

class DataConflictException extends RuntimeException
{
    public function __construct(
        string $message,
        private readonly ?string $propertyPath = null,
    ) {
        parent::__construct($message);
    }

    public function getPropertyPath(): ?string
    {
        return $this->propertyPath;
    }
}
