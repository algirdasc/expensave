<?php

declare(strict_types=1);

namespace App\DTO\Report;

use App\Const\ContextGroupConst;
use Symfony\Component\Serializer\Annotation\Groups;

readonly class BalanceMeta implements BalanceInterface
{
    public function __construct(
        private float $income,
        private float $expense,
    ) {
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
}