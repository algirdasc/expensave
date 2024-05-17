<?php

declare(strict_types=1);

namespace App\Service\Report;

use DateInterval;
use DatePeriod;
use DateTime;

readonly class MonthlyExpenseReportService extends AbstractExpenseReportService
{
    protected function getDateGroupingFormat(): string
    {
        return 'Y-m';
    }

    protected function buildPeriod(DateTime $dateFrom, DateTime $dateTo): DatePeriod
    {
        $interval = DateInterval::createFromDateString('1 month');

        return new DatePeriod($dateFrom, $interval, $dateTo);
    }
}