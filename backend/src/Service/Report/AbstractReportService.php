<?php

declare(strict_types=1);

namespace App\Service\Report;

use App\DTO\Report\BalanceInterface;
use App\Entity\Calendar;
use DateInterval;
use DatePeriod;
use DateTime;

readonly abstract class AbstractReportService
{
    /**
     * @param array<Calendar> $calendars
     *
     * @return array<BalanceInterface>
     */
    abstract public function generate(array $calendars, DateTime $dateFrom, DateTime $dateTo): array;

    protected function buildPeriod(DateTime $dateFrom, DateTime $dateTo): DatePeriod
    {
        $interval = DateInterval::createFromDateString('1 day');

        return new DatePeriod($dateFrom, $interval, $dateTo);
    }
}