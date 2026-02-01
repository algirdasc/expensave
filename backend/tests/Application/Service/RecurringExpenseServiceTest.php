<?php

declare(strict_types=1);

namespace App\Tests\Application\Service;

use App\Entity\Calendar;
use App\Entity\Category;
use App\Entity\Expense;
use App\Entity\User;
use App\Enum\RecurringType;
use App\Repository\ExpenseRepository;
use App\Service\RecurringExpenseService;
use DateTime;
use PHPUnit\Framework\TestCase;

class RecurringExpenseServiceTest extends TestCase
{
    public function testCreateRecurringExpensesWeekly(): void
    {
        $expenseRepository = $this->createMock(ExpenseRepository::class);
        $service = new RecurringExpenseService($expenseRepository);

        $user = new User();
        $calendar = new Calendar('Test', $user);
        $category = new Category();

        $baseExpense = (new Expense())
            ->setCalendar($calendar)
            ->setCategory($category)
            ->setUser($user)
            ->setLabel('Weekly Test')
            ->setAmount(-10.0)
            ->setCreatedAt(new DateTime('2024-01-01'))
            ->setRecurringType(RecurringType::WEEKLY->value)
            ->setRecurringId('test-id')
        ;

        $until = new DateTime('2024-01-22'); // Should create 3 more (Jan 8, 15, 22)

        $expenseRepository->expects($this->exactly(3))
            ->method('save')
            ->with($this->isInstanceOf(Expense::class));

        $service->createRecurringExpenses($baseExpense, $until);
    }

    public function testCreateRecurringExpensesMonthly(): void
    {
        $expenseRepository = $this->createMock(ExpenseRepository::class);
        $service = new RecurringExpenseService($expenseRepository);

        $user = new User();
        $calendar = new Calendar('Test', $user);
        $category = new Category();

        $baseExpense = (new Expense())
            ->setCalendar($calendar)
            ->setCategory($category)
            ->setUser($user)
            ->setLabel('Monthly Test')
            ->setAmount(-100.0)
            ->setCreatedAt(new DateTime('2024-01-01'))
            ->setRecurringType(RecurringType::MONTHLY->value)
            ->setRecurringId('test-id-monthly')
        ;

        $until = new DateTime('2024-03-01'); // Should create 2 more (Feb 1, Mar 1)

        $expenseRepository->expects($this->exactly(2))
            ->method('save')
            ->with($this->isInstanceOf(Expense::class));

        $service->createRecurringExpenses($baseExpense, $until);
    }

    public function testCreateRecurringExpensesFortnightly(): void
    {
        $expenseRepository = $this->createMock(ExpenseRepository::class);
        $service = new RecurringExpenseService($expenseRepository);

        $user = new User();
        $calendar = new Calendar('Test', $user);
        $category = new Category();

        $baseExpense = (new Expense())
            ->setCalendar($calendar)
            ->setCategory($category)
            ->setUser($user)
            ->setLabel('Fortnightly Test')
            ->setAmount(-50.0)
            ->setCreatedAt(new DateTime('2024-01-01'))
            ->setRecurringType(RecurringType::FORTNIGHTLY->value)
            ->setRecurringId('test-id-fortnightly')
        ;

        $until = new DateTime('2024-02-01'); // Should create 2 more (Jan 15, Jan 29)

        $expenseRepository->expects($this->exactly(2))
            ->method('save')
            ->with($this->isInstanceOf(Expense::class));

        $service->createRecurringExpenses($baseExpense, $until);
    }
}
