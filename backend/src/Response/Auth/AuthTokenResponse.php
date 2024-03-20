<?php

declare(strict_types=1);

namespace App\Response\Auth;

use App\Const\ContextGroupConst;
use Symfony\Component\Serializer\Annotation\Groups;

readonly class AuthTokenResponse
{
    public function __construct(
        private string $token
    ) {
    }

    #[Groups(ContextGroupConst::API_ALWAYS)]
    public function getToken(): string
    {
        return $this->token;
    }
}
