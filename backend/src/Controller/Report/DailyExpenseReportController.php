<?php

declare(strict_types=1);

namespace App\Controller\Report;

use App\Factory\BalanceMetaFactory;
use App\Repository\CalendarRepository;
use App\Repository\ExpenseRepository;
use App\Response\Report\ExpenseReportResponse;
use App\Service\Report\DailyExpenseReportService;
use DateTime;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Attribute\Route;

#[Route('api/report/daily-expenses/{calendarIds}/{dateFrom}/{dateTo}', methods: Request::METHOD_GET)]
class DailyExpenseReportController extends AbstractReportController
{
    public function __construct(
        protected readonly CalendarRepository $calendarRepository,
        protected readonly ExpenseRepository $expenseRepository,
        private readonly DailyExpenseReportService $dailyExpenseReportService,
    ) {
    }

    public function __invoke(string $calendarIds, DateTime $dateFrom, DateTime $dateTo): JsonResponse
    {
        $calendars = $this->getCalendarsFromIds($calendarIds);
        $this->denyAccessToReportUnlessGranted($calendars);

        $this->parseDateRange($calendars, $dateFrom, $dateTo);

        $expenseBalances = $this->dailyExpenseReportService->generate($calendars, $dateFrom, $dateTo);

        return $this->respond(
            new ExpenseReportResponse(
                expenseBalances: $expenseBalances,
                meta: BalanceMetaFactory::createMetaFromBalanceArray($expenseBalances),
            )
        );
    }
}