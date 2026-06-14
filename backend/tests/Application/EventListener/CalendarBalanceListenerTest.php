<?php

declare(strict_types=1);

namespace App\Tests\Application\EventListener;

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

    public function testPostUpdate(): void
    {
        $expense = $this->getExpense('Test expense 0', 'User 1 Calendar');

        $expense->setAmount(30);

        $this->expenseRepository->save($expense);

        $this->assertEquals(30, $expense->getCalendar()->getBalance());
    }

    public function testPostRemove(): void
    {
        $expense = $this->getExpense('Test expense 0', 'User 1 Calendar');

        $this->expenseRepository->remove($expense);

        $this->assertEquals(0, $expense->getCalendar()->getBalance());
    }
}
