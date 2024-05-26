<?php

declare(strict_types=1);

namespace App\Controller\Report;

use App\Controller\AbstractApiController;
use App\Entity\Calendar;
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
     * @return array{
     *     0: array<Calendar>,
     *     1: DateTime,
     * }
     */
    protected function getParameters(string $calendarIds, DateTime $fromDate): array
    {
        $calendars = $this->calendarRepository->findBy(['id' => explode(',', $calendarIds)]);

        if ($fromDate->getTimestamp() === 0) {
            $firstExpense = $this->expenseRepository->findOneBy(['calendar' => $calendars], ['createdAt' => 'ASC']);
            $fromDate = $firstExpense?->getCreatedAt() ?? $fromDate;
        }

        return [$calendars, $fromDate];
    }
}