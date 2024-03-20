<?php

namespace App\Response\Statement;

use App\Const\ContextGroupConst;
use App\DTO\Balance;
use App\Entity\Expense;
use JetBrains\PhpStorm\ArrayShape;
use Symfony\Component\Serializer\Annotation\Groups;

readonly class ExpenseListResponse
{
    /**
     * @param array<Expense> $expenses
     * @param array $balances
     */
    public function __construct(
        private array $expenses,
        private array $balances
    ) {
    }

    #[Groups(ContextGroupConst::API_ALL)]
    public function getExpenses(): array
    {
        return $this->expenses;
    }

    #[Groups(ContextGroupConst::API_ALL)]
    #[ArrayShape([Balance::class])]
    public function getBalances(): array
    {
        return $this->balances;
    }
}