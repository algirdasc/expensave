<?php

declare(strict_types=1);

namespace App\Service;

use App\DTO\Balance;
use App\Entity\Calendar;
use App\Repository\ExpenseRepository;
use DateInterval;
use DatePeriod;
use DateTime;
use Doctrine\Common\Collections\ArrayCollection;

readonly class BalanceCalculatorService
{
    public function __construct(
        private ExpenseRepository $expenseRepository
    ) {
    }

    /**
     * @return array<Balance>
     */
    public function calculate(Calendar $calendar, DateTime $dateFrom, DateTime $dateTo): array
    {
        $balanceAmount = $this->expenseRepository->getTotalBalanceToDate($calendar, $dateFrom);
        $dailyBalances = new ArrayCollection($this->expenseRepository->getDailyBalances($calendar, $dateFrom, $dateTo));

        $interval = DateInterval::createFromDateString('1 day');
        $period = new DatePeriod($dateFrom, $interval, $dateTo);

        $balances = [];
        foreach ($period as $dt) {
            $dailyBalance = (float) $dailyBalances
                ->filter(function (array $item) use ($dt) {
                    return $item['date'] === $dt->format('Y-m-d');
                })
                ->map(function (array $item) {
                    return $item['balance'];
                })
                ->first();

            $balanceAmount += $dailyBalance;

            $balances[] = new Balance(
                $dt->setTime(0, 0),
                $balanceAmount,
                $dailyBalance
            );
        }

        return $balances;
    }
}