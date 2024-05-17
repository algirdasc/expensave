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
    public function __construct(
        protected readonly CalendarRepository $calendarRepository,
        protected readonly ExpenseRepository $expenseRepository,
    ) {
    }

    /**
     * @return array{
     *     0: array<Calendar>,
     *     1: DateTime,
     *     2: DateTime
     * }
     */
    protected function getParameters(string $calendarIds, int $fromTs, int $toTs): array
    {
        $calendars = $this->calendarRepository->findBy(['id' => explode(',', $calendarIds)]);

        if ($fromTs <= 0) {
            $firstExpense = $this->expenseRepository->findOneBy(['calendar' => $calendars], ['createdAt' => 'ASC']);
            $dateFrom = $firstExpense?->getCreatedAt() ?? (new DateTime())->setTimestamp($fromTs);
        } else {
            $dateFrom = (new DateTime())->setTimestamp($fromTs);
        }

        $dateTo = (new DateTime())->setTimestamp($toTs);

        return [$calendars, $dateFrom, $dateTo];
    }
}