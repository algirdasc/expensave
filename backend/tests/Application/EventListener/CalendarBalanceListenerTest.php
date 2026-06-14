<?php

declare(strict_types=1);

namespace App\Tests\Application\EventListener;

use App\Entity\Expense;
use App\EventListener\CalendarBalanceListener;
use App\Repository\ExpenseRepository;
use App\Tests\ApplicationTestCase;
use PHPUnit\Framework\Attributes\CoversClass;

#[CoversClass(CalendarBalanceListener::class)]
class CalendarBalanceListenerTest extends ApplicationTestCase
{
    private ExpenseRepository $expenseRepository;

    public function setUp(): void
    {
        parent::setUp();

        $this->expenseRepository = static::getContainer()->get(ExpenseRepository::class);
    }

    public function testPersistsBalanceWhenConfirmedExpenseAmountChanges(): void
    {
        $expense = $this->getExpense('Test expense 0', 'User 1 Calendar');

        $expense->setAmount(30);

        $this->expenseRepository->save($expense);

        $this->assertEquals(85, $this->getReloadedCalendarBalance('User 1 Calendar'));
    }

    public function testPersistsBalanceWhenConfirmedExpenseIsRemoved(): void
    {
        $expense = $this->getExpense('Test expense 0', 'User 1 Calendar');

        $this->expenseRepository->remove($expense);

        $this->assertEquals(55, $this->getReloadedCalendarBalance('User 1 Calendar'));
    }

    public function testPersistsBalanceWhenConfirmedExpenseIsCreated(): void
    {
        $expense = (new Expense())
            ->setCalendar($this->getCalendar('User 1 Calendar'))
            ->setCategory($this->getCategory('Category 1'))
            ->setUser($this->getUser())
            ->setLabel('Persisted balance expense')
            ->setAmount(-12.5)
            ->setConfirmed(true)
        ;

        $this->expenseRepository->save($expense);

        $this->assertEquals(-32.5, $this->getReloadedCalendarBalance('User 1 Calendar'));
    }

    public function testPersistsBalanceWhenExpenseIsConfirmed(): void
    {
        $expense = $this->getExpense('Test expense 3', 'User 1 Calendar');

        $expense->setConfirmed(true);

        $this->expenseRepository->save($expense);

        $this->assertEquals(-29, $this->getReloadedCalendarBalance('User 1 Calendar'));
    }

    private function getReloadedCalendarBalance(string $name): float
    {
        self::getContainer()->get('doctrine')->getManager()->clear();

        return $this->getCalendar($name)->getBalance();
    }
}
