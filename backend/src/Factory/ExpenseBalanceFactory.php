<?php

declare(strict_types=1);

namespace App\Factory;

use App\DTO\Report\ExpenseBalance;
use App\Entity\Expense;
use DateTimeInterface;

class ExpenseBalanceFactory
{
    /**
     * @param array<Expense> $expenses
     */
    public static function createFromExpenseArray(DateTimeInterface $balanceAt, array $expenses): ExpenseBalance
    {
        $dailyIncome = 0;
        $dailyExpense = 0;

        foreach ($expenses as $expense) {
            if ($expense->isIncome()) {
                $dailyIncome += $expense->getAmount();
            } else {
                $dailyExpense += $expense->getAmount();
            }
        }

        return new ExpenseBalance(
            balanceAt: $balanceAt->setTime(0, 0),
            income: $dailyIncome,
            expense: $dailyExpense,
        );
    }
}