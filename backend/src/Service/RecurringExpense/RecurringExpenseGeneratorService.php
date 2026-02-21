<?php

declare(strict_types=1);

namespace App\Service\RecurringExpense;

use App\Entity\Expense;
use App\Entity\RecurringExpense;
use App\Repository\ExpenseRepository;
use App\Repository\RecurringExpenseRepository;
use DateTime;

readonly class RecurringExpenseGeneratorService
{
    public function __construct(
        private RecurringExpenseRepository $recurringExpenseRepository,
        private ExpenseRepository $expenseRepository,
        private RecurringExpenseCalculator $calculator,
    ) {
    }

    /**
     * Generate due recurring expenses up to $now.
     *
     * @return int number of generated Expense rows
     */
    public function generate(DateTime $now): int
    {
        $generated = 0;

        /** @var RecurringExpense $schedule */
        foreach ($this->recurringExpenseRepository->findDue($now) as $schedule) {
            // Skip schedules that ended.
            if ($schedule->getEndAt() !== null && $schedule->getNextRunAt() > $schedule->getEndAt()) {
                $schedule->setActive(false);
                $this->recurringExpenseRepository->save($schedule);
                continue;
            }

            // Generate occurrences until we're caught up.
            while ($schedule->getNextRunAt() <= $now) {
                $occurrenceAt = clone $schedule->getNextRunAt();

                if ($schedule->getEndAt() !== null && $occurrenceAt > $schedule->getEndAt()) {
                    $schedule->setActive(false);
                    break;
                }

                $expense = (new Expense())
                    ->setUser($schedule->getUser())
                    ->setCalendar($schedule->getCalendar())
                    ->setCategory($schedule->getCategory())
                    ->setLabel($schedule->getLabel())
                    ->setDescription($schedule->getDescription())
                    ->setAmount($schedule->getAmount())
                    ->setConfirmed($schedule->isConfirmed())
                    ->setCreatedAt($occurrenceAt)
                    ->setRecurringExpense($schedule)
                    ->setRecurringOccurrenceAt($occurrenceAt)
                ;

                // ExpenseRepository->save() flushes; unique index ensures idempotency.
                $this->expenseRepository->save($expense);
                $generated++;

                $schedule->setNextRunAt($this->calculator->calculateNextRunAt($schedule, $occurrenceAt));
            }

            $this->recurringExpenseRepository->save($schedule);
        }

        return $generated;
    }
}
