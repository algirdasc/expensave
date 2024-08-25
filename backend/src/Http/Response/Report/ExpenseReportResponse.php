<?php

declare(strict_types=1);

namespace App\Http\Response\Report;

use App\Const\ContextGroupConst;
use App\DTO\Report\BalanceMeta;
use App\DTO\Report\ExpenseBalance;
use Symfony\Component\Serializer\Annotation\Groups;

readonly class ExpenseReportResponse
{
    /**
     * @param array<ExpenseBalance> $expenseBalances
     */
    public function __construct(
        private array $expenseBalances,
        private BalanceMeta $meta,
    ) {
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
    public function getMeta(): BalanceMeta
    {
        return $this->meta;
    }
}