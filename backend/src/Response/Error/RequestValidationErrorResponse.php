<?php

declare(strict_types=1);

namespace App\Response\Error;

use App\Const\ContextGroupConst;
use Symfony\Component\Serializer\Annotation\Groups;

class RequestValidationErrorResponse
{
    #[Groups(ContextGroupConst::API_ERROR)]
    private string $propertyPath;

    #[Groups(ContextGroupConst::API_ERROR)]
    private string $message;

    public function getPropertyPath(): string
    {
        return $this->propertyPath;
    }

    public function setPropertyPath(string $propertyPath): self
    {
        $this->propertyPath = $propertyPath;

        return $this;
    }

    public function getMessage(): string
    {
        return $this->message;
    }

    public function setMessage(string $message): self
    {
        $this->message = $message;

        return $this;
    }
}
