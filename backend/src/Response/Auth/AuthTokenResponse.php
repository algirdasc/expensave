<?php

declare(strict_types=1);

namespace App\Response\Auth;

use App\Const\ContextGroupConst;
use App\Response\AbstractResponse;
use Symfony\Component\Serializer\Annotation\Groups;

class AuthTokenResponse extends AbstractResponse
{
    #[Groups(ContextGroupConst::ALWAYS)]
    private string $token;

    public function getToken(): string
    {
        return $this->token;
    }

    public function setToken(string $token): self
    {
        $this->token = $token;

        return $this;
    }
}
