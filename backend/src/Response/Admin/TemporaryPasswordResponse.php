<?php

declare(strict_types=1);

namespace App\Response\Admin;

use App\Const\ContextGroupConst;
use Symfony\Component\Serializer\Attribute\Groups;

/**
 * @codeCoverageIgnore
 */
readonly class TemporaryPasswordResponse
{
    public function __construct(
        private string $password,
    ) {
    }

    #[Groups(ContextGroupConst::API_ALWAYS)]
    public function getPassword(): string
    {
        return $this->password;
    }
}
