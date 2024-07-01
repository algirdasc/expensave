<?php

declare(strict_types=1);

namespace App\Service;

use App\Const\StringConst;
use App\Entity\Calendar;
use App\Entity\Expense;

class ExpenseTransferService
{
    /**
     * @return array{
     *     'from': Expense,
     *     'to': Expense
     * }|null
     */
    public function extractTransfers(Expense $expense): ?array
    {
        if ($expense->getTransferTo() === null && $expense->getTransferFrom() === null) {
            return null;
        }

        $transferFrom = $expense->getTransferFrom() ?? $expense;
        $transferTo = $expense->getTransferTo() ?? $expense;

        return ['from' => $transferFrom, 'to' => $transferTo];
    }

    public function swap(Expense $transferFrom, Expense $transferTo): void
    {
        $transferFrom
            ->setLabel(sprintf(StringConst::TRANSFER_FROM_LABEL, $transferTo->getCalendar()->getName()))
            ->setTransferFrom($transferTo)
            ->setTransferTo(null);

        $transferTo
            ->setLabel(sprintf(StringConst::TRANSFER_TO_LABEL, $transferFrom->getCalendar()->getName()))
            ->setTransferTo($transferFrom)
            ->setTransferFrom(null);
    }

    public function createTransferExpense(Expense $expense, Calendar $destinationCalendar): Expense
    {
        $transferExpense = clone $expense;
        $transferExpense
            ->setCalendar($destinationCalendar)
            ->setAmount(-1 * $transferExpense->getAmount());

        return $transferExpense;
    }
}