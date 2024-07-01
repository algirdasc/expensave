<?php

declare(strict_types=1);

namespace App\Enum;

enum CategoryType: string
{
    case USER = 'user';
    case UNCATEGORIZED = 'uncategorized';
    case TRANSFER = 'transfer';
    case BALANCE_UPDATE = 'balance_update';
}
