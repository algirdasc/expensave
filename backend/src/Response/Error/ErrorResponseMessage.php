<?php

declare(strict_types=1);

namespace App\Response\Error;

use App\Const\ContextGroupConst;
use Symfony\Component\Serializer\Annotation\Groups;

/**
 * @codeCoverageIgnore
 */
readonly class ErrorResponseMessage
{
    public function __construct(
        private string $message,
        private ?string $propertyPath = null,
        private ?string $file = null,
        private ?int $line = null,
        private ?string $trace = null,
    ) {
    }

    #[Groups(ContextGroupConst::API_ERROR)]
    public function getMessage(): string
    {
        return $this->message;
    }

    #[Groups(ContextGroupConst::API_ERROR)]
    public function getPropertyPath(): ?string
    {
        return $this->propertyPath;
    }

    #[Groups(ContextGroupConst::API_ERROR)]
    public function getFile(): ?string
    {
        return $this->file;
    }

    #[Groups(ContextGroupConst::API_ERROR)]
    public function getLine(): ?int
    {
        return $this->line;
    }

    #[Groups(ContextGroupConst::API_ERROR)]
    public function getTrace(): ?string
    {
        return $this->trace;
    }
}
