<?php

declare(strict_types=1);

namespace App\DTO\Report;

use App\Const\ContextGroupConst;
use DateTime;
use Symfony\Component\Serializer\Annotation\Groups;

/**
 * @codeCoverageIgnore
 */
class ExpenseBalance implements BalanceInterface
{
    public function __construct(
        private readonly DateTime $balanceAt,
        private readonly float $income,
        private readonly float $expense,
        private float $balance = 0,
    ) {
    }

    #[Groups(ContextGroupConst::API_ALL)]
    public function getBalanceAt(): DateTime
    {
        return $this->balanceAt;
    }

    #[Groups(ContextGroupConst::API_ALL)]
    public function getIncome(): float
    {
        return $this->income;
    }

    #[Groups(ContextGroupConst::API_ALL)]
    public function getExpense(): float
    {
        return $this->expense;
    }

    #[Groups(ContextGroupConst::API_ALL)]
    public function getChange(): float
    {
        return $this->expense + $this->income;
    }

    #[Groups(ContextGroupConst::API_ALL)]
    public function getBalance(): float
    {
        return $this->balance;
    }

    public function setBalance(float $balance): self
    {
        $this->balance = $balance;

        return $this;
    }
}