<?php

declare(strict_types=1);

namespace App\Response\ExpenseTransfer;

use App\Const\ContextGroupConst;
use App\Entity\Expense;
use Symfony\Component\Serializer\Annotation\Groups;

readonly class ExpenseTransferResponse
{
    public function __construct(
        private Expense $transferFrom,
        private Expense $transferTo,
    ) {
    }

    #[Groups(ContextGroupConst::API_ALL)]
    public function getTransferFrom(): Expense
    {
        return $this->transferFrom;
    }

    #[Groups(ContextGroupConst::API_ALL)]
    public function getTransferTo(): Expense
    {
        return $this->transferTo;
    }
}