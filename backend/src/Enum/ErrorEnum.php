<?php

namespace App\Enum;

enum ErrorEnum
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
