<?php

declare(strict_types=1);

namespace App\Enum;

/**
 * @codeCoverageIgnore
 */
enum Error
{
    case AUTH_HANDLE_ERROR;

    public function message(): string
    {
        return match($this)
        {
            self::AUTH_HANDLE_ERROR => 'Authentication handling error',
        };
    }
}
