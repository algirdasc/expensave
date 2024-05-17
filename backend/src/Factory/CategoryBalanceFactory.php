<?php

declare(strict_types=1);

namespace App\Factory;

use App\DTO\Report\CategoryBalance;
use App\Entity\Category;
use App\Entity\Expense;

class CategoryBalanceFactory
{
    /**
     * @param array<Expense> $expenses
     */
    public static function createFromExpenseArray(Category $category, array $expenses): CategoryBalance
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

        return new CategoryBalance(
            category: $category,
            income: $dailyIncome,
            expense: $dailyExpense,
        );
    }
}