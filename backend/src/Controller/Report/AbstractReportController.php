<?php

declare(strict_types=1);

namespace App\Controller\Report;

use App\Controller\AbstractApiController;
use App\Entity\Calendar;
use App\Helper\DateHelper;
use App\Repository\CalendarRepository;
use App\Repository\ExpenseRepository;
use DateTime;

abstract class AbstractReportController extends AbstractApiController
{
    /** @phpstan-ignore-next-line */
    protected readonly CalendarRepository $calendarRepository;

    /** @phpstan-ignore-next-line */
    protected readonly ExpenseRepository $expenseRepository;

    /**
     * @return array<Calendar>
     */
    protected function getCalendarsFromIds(string $calendarIds): array
    {
        return $this->calendarRepository->findBy(['id' => explode(',', $calendarIds)]);
    }

    /**
     * @param array<Calendar> $calendars
     */
    protected function parseDateRange(array $calendars, DateTime $dateFrom, DateTime $dateTo): void
    {
        if ($dateFrom->getTimestamp() === 0) {
            $firstExpense = $this->expenseRepository->findOneBy(['calendar' => $calendars], ['createdAt' => 'ASC']);
            if ($firstExpense !== null) {
                $firstExpenseDate = $firstExpense->getCreatedAt();
                $dateFrom->modify($firstExpenseDate->format('c'));
            }
        }

        DateHelper::setRange($dateFrom, $dateTo);
    }
}