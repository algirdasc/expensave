<?php

declare(strict_types=1);

namespace App\Response\Error;

use App\Const\ContextGroupConst;
use App\Response\Error\Handler\ErrorHandlerInterface;
use Symfony\Component\Serializer\Annotation\Groups;

class ErrorResponse
{
    public function __construct(
        private readonly ErrorHandlerInterface $response
    ) {
    }

    #[Groups(ContextGroupConst::API_ERROR)]
    public function getThrowable(): string
    {
        return $this->response->getThrowable()::class;
    }

    #[Groups(ContextGroupConst::API_ERROR)]
    public function getMessages(): array
    {
        return $this->response->getMessages();
    }

    public function getStatusCode(): int
    {
        return $this->response->getStatusCode();
    }
}
