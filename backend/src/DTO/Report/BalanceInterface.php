<?php

namespace App\DTO\Report;

interface BalanceInterface
{
    public function getIncome(): float;

    public function getExpense(): float
    ;
    public function getChange(): float;
}
