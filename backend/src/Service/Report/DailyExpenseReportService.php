<?php

declare(strict_types=1);

namespace App\Service\Report;

readonly class DailyExpenseReportService extends AbstractExpenseReportService
{
    protected function getDateGroupingFormat(): string
    {
        return 'Y-m-d';
    }
}