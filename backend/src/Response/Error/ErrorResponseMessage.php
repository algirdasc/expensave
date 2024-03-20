<?php

declare(strict_types=1);

namespace App\Response\Error;

use App\Const\ContextGroupConst;
use Symfony\Component\Serializer\Annotation\Groups;

readonly class ErrorResponseMessage
{
    public function __construct(
        private string $message,
        private ?string $propertyPath = null
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
}
