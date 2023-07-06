<?php

declare(strict_types=1);

namespace App\Const\ContextGroup;

use App\Const\ContextGroupConst;

class CalendarContextGroupConst
{
    public const ALWAYS = [ContextGroupConst::BASIC, self::DETAILS];
    public const DETAILS = 'calendar.details';
}
