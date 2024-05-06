<?php

declare(strict_types=1);

namespace App\Factory;

use App\DTO\Report\BalanceInterface;
use App\DTO\Report\BalanceMeta;

class BalanceMetaFactory
{
    /**
     * @param array<BalanceInterface> $balances
     */
    public static function createMetaFromBalanceArray(array $balances): BalanceMeta
    {
        $totalIncome = 0;
        $totalExpense = 0;

        foreach ($balances as $balance) {
            $totalIncome += $balance->getIncome();
            $totalExpense += $balance->getExpense();
        }

        return new BalanceMeta(
            income: $totalIncome,
            expense: $totalExpense,
        );
    }
}