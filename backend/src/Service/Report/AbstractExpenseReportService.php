<?php

declare(strict_types=1);

namespace App\Service\Report;

use App\DTO\Report\ExpenseBalance;
use App\Entity\Calendar;
use App\Entity\Expense;
use App\Factory\ExpenseBalanceFactory;
use App\Repository\ExpenseRepository;
use DateTime;
use Doctrine\Common\Collections\ArrayCollection;

readonly abstract class AbstractExpenseReportService extends AbstractReportService
{
    public function __construct(
        private ExpenseRepository $expenseRepository
    ) {
    }

    abstract protected function getDateGroupingFormat(): string;

    /**
     * @param array<Calendar> $calendars
     *
     * @return array<ExpenseBalance>
     */
    public function generate(array $calendars, DateTime $dateFrom, DateTime $dateTo): array
    {
        $balances = [];
        $period = $this->buildPeriod($dateFrom, $dateTo);

        /** @var ArrayCollection<array-key, Expense> $expenses */
        $expenses = new ArrayCollection($this->expenseRepository->findByCalendarsAndInterval($calendars, $dateFrom, $dateTo));
        $balanceToDate = $this->expenseRepository->getTotalBalanceToDate($calendars, $dateFrom);

        foreach ($period as $dt) {
            $dailyExpenses = $expenses
                ->filter(function (Expense $expense) use ($dt) {
                    return $expense->getCreatedAt()->format($this->getDateGroupingFormat()) === $dt->format($this->getDateGroupingFormat());
                });

            $balance = ExpenseBalanceFactory::createFromExpenseArray($dt, $dailyExpenses->toArray());

            $balanceToDate += $balance->getChange();

            $balance->setBalance($balanceToDate);

            $balances[] = $balance;
        }

        return $balances;
    }
}