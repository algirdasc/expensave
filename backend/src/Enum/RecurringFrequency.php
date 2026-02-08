<?php

declare(strict_types=1);

namespace App\Enum;

/**
 * @codeCoverageIgnore
 */
enum RecurringFrequency: string
{
    case DAILY = 'daily';
    case WEEKLY = 'weekly';
    case MONTHLY = 'monthly';
    case YEARLY = 'yearly';
}
