<?php

declare(strict_types=1);

namespace App\Service;

use App\Entity\Expense;
use App\Enum\RecurringType;
use App\Repository\ExpenseRepository;
use DateInterval;
use DateTime;

class RecurringExpenseService
{
    public function __construct(
        private readonly ExpenseRepository $expenseRepository
    ) {
    }

    public function createRecurringExpenses(Expense $baseExpense, ?DateTime $until = null): void
    {
        $recurringType = RecurringType::tryFrom($baseExpense->getRecurringType() ?? '');

        if (!$recurringType || $recurringType === RecurringType::NONE) {
            return;
        }

        if ($until === null) {
            $until = (new DateTime())->add(new DateInterval('P2Y'));
        }

        $interval = match ($recurringType) {
            RecurringType::WEEKLY => new DateInterval('P1W'),
            RecurringType::FORTNIGHTLY => new DateInterval('P2W'),
            RecurringType::MONTHLY => new DateInterval('P1M'),
            default => null,
        };

        if ($interval === null) {
            return;
        }

        $currentDate = clone $baseExpense->getCreatedAt();
        $currentDate->add($interval);

        while ($currentDate <= $until) {
            $newExpense = (new Expense())
                ->setCalendar($baseExpense->getCalendar())
                ->setCategory($baseExpense->getCategory())
                ->setUser($baseExpense->getUser())
                ->setLabel($baseExpense->getLabel())
                ->setAmount($baseExpense->getAmount())
                ->setCreatedAt(clone $currentDate)
                ->setConfirmed($baseExpense->isConfirmed())
                ->setDescription($baseExpense->getDescription())
                ->setRecurringType($baseExpense->getRecurringType())
                ->setRecurringId($baseExpense->getRecurringId())
            ;

            $this->expenseRepository->save($newExpense);
            $currentDate->add($interval);
        }
    }
}
