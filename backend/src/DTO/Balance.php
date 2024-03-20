<?php

declare(strict_types=1);

namespace App\DTO;

use App\Const\ContextGroupConst;
use DateTime;
use Symfony\Component\Serializer\Annotation\Groups;

readonly class Balance
{
    public function __construct(
        private DateTime $balanceAt,
        private float $balance,
        private float $expenses
    ) {

    }

    #[Groups(ContextGroupConst::API_ALL)]
    public function getBalanceAt(): DateTime
    {
        return $this->balanceAt;
    }

    #[Groups(ContextGroupConst::API_ALL)]
    public function getBalance(): float
    {
        return $this->balance;
    }

    #[Groups(ContextGroupConst::API_ALL)]
    public function getExpenses(): float
    {
        return $this->expenses;
    }
}