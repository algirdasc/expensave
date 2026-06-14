<?php

declare(strict_types=1);

namespace App\Enum;

/**
 * @codeCoverageIgnore
 */
enum UserRole: string
{
    case USER = 'user';
    case ADMIN = 'admin';

    /**
     * @return list<string>
     */
    public static function values(): array
    {
        return array_map(static fn (self $role): string => $role->value, self::cases());
    }
}
