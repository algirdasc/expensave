<?php

declare(strict_types=1);

namespace App\Const;

/**
 * @codeCoverageIgnore
 */
class AssertConst
{
    public const MIN_PASSWORD_LENGTH = 6;

    public const MAX_STRING_LENGTH = 255;

    public const MSG_NON_UNIQUE_EMAIL = 'Email is already taken';
    public const MSG_NON_UNIQUE_NAME = 'Name is already taken';
    public const MSG_PASSWORD_MISMATCH = 'Passwords do not match';
    public const MSG_PASSWORD_INVALID = 'Current password is invalid';
    public const MSG_DEFAULT_CALENDAR_USER_MISMATCH = 'This calendar owned by other user';
}
