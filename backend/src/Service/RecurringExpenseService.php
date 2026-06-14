<?php

declare(strict_types=1);

namespace App\Service;

use App\Entity\Expense;
use App\Entity\RecurringExpense;
use App\Entity\User;
use App\Enum\RecurringExpenseFrequency;
use App\Repository\ExpenseRepository;
use App\Repository\RecurringExpenseRepository;
use App\Request\Expense\CreateExpenseRequest;
use DateInterval;
use DateTime;
use InvalidArgumentException;

readonly class RecurringExpenseService
{
    public function __construct(
        private RecurringExpenseRepository $recurringExpenseRepository,
        private ExpenseRepository $expenseRepository,
    ) {
    }

    public function createFromRequest(User $user, CreateExpenseRequest $request): Expense
    {
        $expense = (new Expense())
            ->setCalendar($request->getCalendar())
            ->setCategory($request->getCategory())
            ->setLabel($request->getLabel())
            ->setAmount($request->getAmount())
            ->setCreatedAt($request->getCreatedAt())
            ->setConfirmed($request->isConfirmed())
            ->setDescription($request->getDescription())
        ;

        if (!$request->isRecurring()) {
            return $this->createSingleExpense($user, $expense);
        }

        return $this->createRecurringExpenses(
            user: $user,
            template: $expense,
            frequency: $request->getRecurringFrequency(),
            occurrences: $request->getRecurringOccurrences(),
        )[0];
    }

    public function createSingleExpense(User $user, Expense $expense): Expense
    {
        $expense->setUser($user);
        $this->expenseRepository->save($expense);

        return $expense;
    }

    /**
     * @return list<Expense>
     */
    public function createRecurringExpenses(
        User $user,
        Expense $template,
        RecurringExpenseFrequency $frequency,
        int $occurrences,
    ): array {
        if ($occurrences < 2) {
            throw new InvalidArgumentException('Recurring expenses require at least two occurrences.');
        }

        $recurringExpense = (new RecurringExpense())
            ->setCalendar($template->getCalendar())
            ->setCategory($template->getCategory())
            ->setUser($user)
            ->setFrequency($frequency)
            ->setOccurrences($occurrences)
            ->setLabel($template->getLabel())
            ->setAmount($template->getAmount())
            ->setConfirmed($template->isConfirmed())
            ->setDescription($template->getDescription())
            ->setStartsAt($template->getCreatedAt())
        ;

        $this->recurringExpenseRepository->save($recurringExpense);

        $expenses = [];
        for ($index = 0; $index < $occurrences; $index++) {
            $expense = $this->createExpenseOccurrence($template, $user, $recurringExpense, $index);
            $this->expenseRepository->save($expense);

            $expenses[] = $expense;
        }

        return $expenses;
    }

    private function createExpenseOccurrence(
        Expense $template,
        User $user,
        RecurringExpense $recurringExpense,
        int $index,
    ): Expense {
        return (new Expense())
            ->setCalendar($template->getCalendar())
            ->setCategory($template->getCategory())
            ->setUser($user)
            ->setRecurringExpense($recurringExpense)
            ->setLabel($template->getLabel())
            ->setAmount($template->getAmount())
            ->setCreatedAt($this->getOccurrenceDate($template->getCreatedAt(), $recurringExpense->getFrequency(), $index))
            ->setConfirmed($template->isConfirmed())
            ->setDescription($template->getDescription())
        ;
    }

    private function getOccurrenceDate(DateTime $startDate, RecurringExpenseFrequency $frequency, int $index): DateTime
    {
        $date = clone $startDate;
        $interval = match ($frequency) {
            RecurringExpenseFrequency::DAILY => new DateInterval(sprintf('P%dD', $index)),
            RecurringExpenseFrequency::WEEKLY => new DateInterval(sprintf('P%dW', $index)),
            RecurringExpenseFrequency::MONTHLY => new DateInterval(sprintf('P%dM', $index)),
            RecurringExpenseFrequency::YEARLY => new DateInterval(sprintf('P%dY', $index)),
        };

        return $date->add($interval);
    }
}
