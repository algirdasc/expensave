<?php

declare(strict_types=1);

namespace App\Enum;

/**
 * @codeCoverageIgnore
 */
enum RecurringExpenseFrequency: string
{
    case DAILY = 'daily';
    case WEEKLY = 'weekly';
    case MONTHLY = 'monthly';
    case YEARLY = 'yearly';

    /**
     * @return list<string>
     */
    public static function values(): array
    {
        return array_map(static fn (self $frequency): string => $frequency->value, self::cases());
    }
}
