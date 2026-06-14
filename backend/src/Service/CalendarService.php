<?php

declare(strict_types=1);

namespace App\Service;

use App\Entity\Calendar;
use App\Exception\DataConflictException;
use App\Repository\CalendarRepository;
use App\Repository\ExpenseRepository;
use App\Repository\RecurringExpenseRepository;

readonly class CalendarService
{
    public function __construct(
        private CalendarRepository $calendarRepository,
        private ExpenseRepository $expenseRepository,
        private RecurringExpenseRepository $recurringExpenseRepository,
    ) {
    }

    public function remove(Calendar $calendar): void
    {
        $this->assertCanRemove($calendar);

        $this->calendarRepository->remove($calendar);
    }

    private function assertCanRemove(Calendar $calendar): void
    {
        if ($this->expenseRepository->hasCalendar($calendar)) {
            throw new DataConflictException(
                'This calendar contains expenses. Delete or move those expenses before deleting the calendar.',
                'calendar',
            );
        }

        if ($this->recurringExpenseRepository->hasCalendar($calendar)) {
            throw new DataConflictException(
                'This calendar is used by recurring expenses. Change or delete those recurring expenses before deleting the calendar.',
                'calendar',
            );
        }
    }
}
