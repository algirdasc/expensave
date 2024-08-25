<?php

declare(strict_types=1);

namespace App\Controller\Report;

use App\Factory\BalanceMetaFactory;
use App\Http\Response\Report\ExpenseReportResponse;
use App\Repository\CalendarRepository;
use App\Repository\ExpenseRepository;
use App\Service\Report\MonthlyExpenseReportService;
use DateTime;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Attribute\Route;

#[Route('api/report/monthly-expenses/{calendarIds}/{dateFrom}/{dateTo}', methods: Request::METHOD_GET)]
class MonthlyExpenseReportController extends AbstractReportController
{
    public function __construct(
        protected readonly CalendarRepository $calendarRepository,
        protected readonly ExpenseRepository $expenseRepository,
        private readonly MonthlyExpenseReportService $monthlyExpenseReportService
    ) {
    }

    public function __invoke(string $calendarIds, DateTime $dateFrom, DateTime $dateTo): JsonResponse
    {
        $calendars = $this->getCalendarsFromIds($calendarIds);
        $this->denyAccessToReportUnlessGranted($calendars);

        $this->parseDateRange($calendars, $dateFrom, $dateTo);

        $expenseBalances = $this->monthlyExpenseReportService->generate($calendars, $dateFrom, $dateTo);

        return $this->respond(
            new ExpenseReportResponse(
                expenseBalances: $expenseBalances,
                meta: BalanceMetaFactory::createMetaFromBalanceArray($expenseBalances),
            )
        );
    }
}