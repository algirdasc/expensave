<?php

declare(strict_types=1);

namespace App\Const\ContextGroup;

use App\Const\ContextGroupConst;

class ExpenseContextGroupConst
{
    public const ALWAYS = [ContextGroupConst::API_ALWAYS, self::DETAILS, self::TRANSFER];
    public const DETAILS = 'expense.details';
    public const TRANSFER = 'expense.transfer';
}
