<?php

declare(strict_types=1);

namespace App\Helper;

use DateTime;

class DateHelper
{
    public static function setRange(DateTime $d1, DateTime $d2): void
    {
        $d1->setTime(0, 0);
        $d2->setTime(23, 59, 59);
    }
}