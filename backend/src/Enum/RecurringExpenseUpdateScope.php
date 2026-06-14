<?php

declare(strict_types=1);

namespace App\Enum;

/**
 * @codeCoverageIgnore
 */
enum RecurringExpenseUpdateScope: string
{
    case THIS = 'this';
    case FUTURE = 'future';
    case PAST = 'past';
    case ALL = 'all';

    /**
     * @return list<string>
     */
    public static function values(): array
    {
        return array_map(static fn (self $scope): string => $scope->value, self::cases());
    }
}
