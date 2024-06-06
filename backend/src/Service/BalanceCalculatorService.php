<?php

declare(strict_types=1);

namespace App\Service;

use App\Entity\Calendar;
use App\Repository\ExpenseRepository;
use DateTime;

readonly class BalanceCalculatorService
{
    public function __construct(
        private ExpenseRepository $expenseRepository
    ) {
    }

    public function calculateAmount(float $desiredBalance, DateTime $dateTo, Calendar $calendar): float
    {
        $calendarBalance = $this->expenseRepository->getTotalBalanceToDate([$calendar], $dateTo);

        return round($desiredBalance - $calendarBalance, 2);
    }
}