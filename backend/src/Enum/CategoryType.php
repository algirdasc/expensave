<?php

declare(strict_types=1);

namespace App\Enum;

/**
 * @codeCoverageIgnore
 */
enum CategoryType: string
{
    case USER = 'user';
    case UNCATEGORIZED = 'uncategorized';
    case BALANCE_UPDATE = 'balance_update';
}
