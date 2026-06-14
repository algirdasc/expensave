<?php

declare(strict_types=1);

namespace App\Tests\Application\Service;

use App\Entity\Calendar;
use App\Entity\User;
use App\Exception\DataConflictException;
use App\Repository\CalendarRepository;
use App\Repository\ExpenseRepository;
use App\Repository\RecurringExpenseRepository;
use App\Service\CalendarService;
use PHPUnit\Framework\Attributes\CoversClass;
use PHPUnit\Framework\TestCase;

#[CoversClass(CalendarService::class)]
class CalendarServiceTest extends TestCase
{
    private CalendarRepository $calendarRepository;
    private ExpenseRepository $expenseRepository;
    private RecurringExpenseRepository $recurringExpenseRepository;
    private CalendarService $calendarService;

    protected function setUp(): void
    {
        $this->calendarRepository = $this->createMock(CalendarRepository::class);
        $this->expenseRepository = $this->createMock(ExpenseRepository::class);
        $this->recurringExpenseRepository = $this->createMock(RecurringExpenseRepository::class);
        $this->calendarService = new CalendarService(
            $this->calendarRepository,
            $this->expenseRepository,
            $this->recurringExpenseRepository,
        );
    }

    public function testRemoveDeletesCalendarWhenItHasNoDependants(): void
    {
        $calendar = new Calendar('Calendar', new User());

        $this->expenseRepository->method('hasCalendar')->with($calendar)->willReturn(false);
        $this->recurringExpenseRepository->method('hasCalendar')->with($calendar)->willReturn(false);
        $this->calendarRepository
            ->expects($this->once())
            ->method('remove')
            ->with($calendar);

        $this->calendarService->remove($calendar);
    }

    public function testRemoveThrowsFriendlyConflictWhenCalendarHasExpenses(): void
    {
        $calendar = new Calendar('Calendar', new User());

        $this->expenseRepository->method('hasCalendar')->with($calendar)->willReturn(true);
        $this->recurringExpenseRepository->expects($this->never())->method('hasCalendar');
        $this->calendarRepository->expects($this->never())->method('remove');

        $this->expectException(DataConflictException::class);
        $this->expectExceptionMessage(
            'This calendar contains expenses. Delete or move those expenses before deleting the calendar.'
        );

        $this->calendarService->remove($calendar);
    }

    public function testRemoveThrowsFriendlyConflictWhenCalendarHasRecurringExpenses(): void
    {
        $calendar = new Calendar('Calendar', new User());

        $this->expenseRepository->method('hasCalendar')->with($calendar)->willReturn(false);
        $this->recurringExpenseRepository->method('hasCalendar')->with($calendar)->willReturn(true);
        $this->calendarRepository->expects($this->never())->method('remove');

        $this->expectException(DataConflictException::class);
        $this->expectExceptionMessage(
            'This calendar is used by recurring expenses. Change or delete those recurring expenses before deleting the calendar.'
        );

        $this->calendarService->remove($calendar);
    }
}
