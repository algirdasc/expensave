<?php

namespace App\Response\Statement;

use App\Const\ContextGroupConst;
use App\DTO\Report\ExpenseBalance;
use App\Entity\Calendar;
use App\Entity\Expense;
use Symfony\Component\Serializer\Annotation\Groups;

/**
 * @codeCoverageIgnore
 */
readonly class ExpenseListResponse
{
    /**
     * @param array<Expense> $expenses
     * @param array<ExpenseBalance> $expenseBalances
     */
    public function __construct(
        private array $expenses,
        private array $expenseBalances,
        private Calendar $calendar,
    ) {
    }

    /**
     * @return array<Expense>
     */
    #[Groups(ContextGroupConst::API_ALL)]
    public function getExpenses(): array
    {
        return $this->expenses;
    }

    /**
     * @return array<ExpenseBalance>
     */
    #[Groups(ContextGroupConst::API_ALL)]
    public function getExpenseBalances(): array
    {
        return $this->expenseBalances;
    }

    #[Groups(ContextGroupConst::API_ALL)]
    public function getCalendar(): Calendar
    {
        return $this->calendar;
    }
}