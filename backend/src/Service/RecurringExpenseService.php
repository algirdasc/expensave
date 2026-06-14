<?php

declare(strict_types=1);

namespace App\Service;

use App\Entity\Expense;
use App\Entity\RecurringExpense;
use App\Entity\User;
use App\Enum\RecurringExpenseFrequency;
use App\Enum\RecurringExpenseUpdateScope;
use App\Repository\ExpenseRepository;
use App\Repository\RecurringExpenseRepository;
use App\Request\Expense\CreateExpenseRequest;
use App\Request\Expense\UpdateExpenseRequest;
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

    public function updateFromRequest(Expense $expense, UpdateExpenseRequest $request): Expense
    {
        if ($expense->getRecurringExpense() === null && $request->isRecurring()) {
            return $this->convertSingleExpenseToRecurring($expense, $request);
        }

        $originalSelectedDate = clone $expense->getCreatedAt();
        $dateShiftSeconds = $request->getCreatedAt()->getTimestamp() - $originalSelectedDate->getTimestamp();

        foreach ($this->getExpensesForUpdate($expense, $request->getRecurringUpdateScope()) as $targetExpense) {
            $this->applyRequestToExpense(
                expense: $targetExpense,
                request: $request,
                createdAt: $this->shiftDate($targetExpense->getCreatedAt(), $dateShiftSeconds),
            );

            $this->expenseRepository->save($targetExpense);
        }

        if ($request->getRecurringUpdateScope() === RecurringExpenseUpdateScope::ALL) {
            $this->updateRecurringExpense($expense, $request, $dateShiftSeconds);
        }

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
        $recurringExpense = $this->createRecurringExpenseRule($user, $template, $frequency, $occurrences);
        $this->recurringExpenseRepository->save($recurringExpense);

        $expenses = [];
        for ($index = 0; $index < $occurrences; $index++) {
            $expense = $this->createExpenseOccurrence($template, $user, $recurringExpense, $index);
            $this->expenseRepository->save($expense);

            $expenses[] = $expense;
        }

        return $expenses;
    }

    private function convertSingleExpenseToRecurring(Expense $expense, UpdateExpenseRequest $request): Expense
    {
        $this->applyRequestToExpense($expense, $request, clone $request->getCreatedAt());

        $user = $expense->getUser();
        $recurringExpense = $this->createRecurringExpenseRule(
            user: $user,
            template: $expense,
            frequency: $request->getRecurringFrequency(),
            occurrences: $request->getRecurringOccurrences(),
        );

        $this->recurringExpenseRepository->save($recurringExpense);
        $expense->setRecurringExpense($recurringExpense);
        $this->expenseRepository->save($expense);

        for ($index = 1; $index < $request->getRecurringOccurrences(); $index++) {
            $occurrence = $this->createExpenseOccurrence($expense, $user, $recurringExpense, $index);
            $this->expenseRepository->save($occurrence);
        }

        return $expense;
    }

    private function createRecurringExpenseRule(
        User $user,
        Expense $template,
        RecurringExpenseFrequency $frequency,
        int $occurrences,
    ): RecurringExpense {
        if ($occurrences < 2) {
            throw new InvalidArgumentException('Recurring expenses require at least two occurrences.');
        }

        return (new RecurringExpense())
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

    /**
     * @return list<Expense>
     */
    private function getExpensesForUpdate(Expense $expense, RecurringExpenseUpdateScope $scope): array
    {
        $recurringExpense = $expense->getRecurringExpense();
        if ($recurringExpense === null) {
            return [$expense];
        }

        $expenses = $this->expenseRepository->findByRecurringExpenseAndUpdateScope(
            recurringExpense: $recurringExpense,
            selectedDate: $expense->getCreatedAt(),
            scope: $scope,
        );

        return $expenses === [] ? [$expense] : $expenses;
    }

    private function applyRequestToExpense(Expense $expense, UpdateExpenseRequest $request, DateTime $createdAt): void
    {
        $expense
            ->setCalendar($request->getCalendar())
            ->setCategory($request->getCategory())
            ->setLabel($request->getLabel())
            ->setAmount($request->getAmount())
            ->setCreatedAt($createdAt)
            ->setConfirmed($request->isConfirmed())
            ->setDescription($request->getDescription())
        ;
    }

    private function updateRecurringExpense(Expense $expense, UpdateExpenseRequest $request, int $dateShiftSeconds): void
    {
        $recurringExpense = $expense->getRecurringExpense();
        if ($recurringExpense === null) {
            return;
        }

        $recurringExpense
            ->setCalendar($request->getCalendar())
            ->setCategory($request->getCategory())
            ->setLabel($request->getLabel())
            ->setAmount($request->getAmount())
            ->setConfirmed($request->isConfirmed())
            ->setDescription($request->getDescription())
            ->setStartsAt($this->shiftDate($recurringExpense->getStartsAt(), $dateShiftSeconds))
        ;

        $this->recurringExpenseRepository->save($recurringExpense);
    }

    private function shiftDate(DateTime $date, int $seconds): DateTime
    {
        $shiftedDate = clone $date;
        if ($seconds === 0) {
            return $shiftedDate;
        }

        return $shiftedDate->modify(sprintf('%+d seconds', $seconds));
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
