<?php

namespace App\Response\Statement;

use App\Const\ContextGroupConst;
use App\DTO\Balance;
use App\Entity\Calendar;
use App\Entity\Expense;
use Symfony\Component\Serializer\Annotation\Groups;

readonly class ExpenseListResponse
{
    /**
     * @param array<Expense> $expenses
     * @param array<Balance> $balances
     */
    public function __construct(
        private array $expenses,
        private array $balances,
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
     * @return array<Balance>
     */
    #[Groups(ContextGroupConst::API_ALL)]
    public function getBalances(): array
    {
        return $this->balances;
    }

    #[Groups(ContextGroupConst::API_ALL)]
    public function getCalendar(): Calendar
    {
        return $this->calendar;
    }
}