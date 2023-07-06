<?php

declare(strict_types=1);

namespace App\Response\Error;

use App\Const\ContextGroupConst;
use Symfony\Component\Serializer\Annotation\Groups;

class ErrorResponseMessage
{
    #[Groups(ContextGroupConst::API_ERROR)]
    private string $message;

    #[Groups(ContextGroupConst::API_ERROR)]
    private ?string $propertyPath = null;

    public function getMessage(): string
    {
        return $this->message;
    }

    public function setMessage(string $message): ErrorResponseMessage
    {
        $this->message = $message;

        return $this;
    }

    public function getPropertyPath(): ?string
    {
        return $this->propertyPath;
    }

    public function setPropertyPath(?string $propertyPath): ErrorResponseMessage
    {
        $this->propertyPath = $propertyPath;

        return $this;
    }
}