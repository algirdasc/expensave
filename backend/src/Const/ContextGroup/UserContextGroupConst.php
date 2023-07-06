<?php

declare(strict_types=1);

namespace App\Const\ContextGroup;

use App\Const\ContextGroupConst;

class UserContextGroupConst
{
    public const ALWAYS = [ContextGroupConst::ALWAYS, self::DETAILS];
    public const DETAILS = 'user.details';
}
