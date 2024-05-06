<?php

declare(strict_types=1);

namespace App\Controller\Report;

use App\Factory\BalanceMetaFactory;
use App\Repository\CalendarRepository;
use App\Repository\ExpenseRepository;
use App\Response\Report\ExpenseReportResponse;
use App\Service\Report\MonthlyExpenseReportService;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Attribute\Route;

#[Route('api/report/monthly-expenses/{calendarIds}/{fromTs}/{toTs}', methods: Request::METHOD_GET)]
class MonthlyExpenseReportController extends AbstractReportController
{
    public function __construct(
        protected readonly CalendarRepository $calendarRepository,
        protected readonly ExpenseRepository $expenseRepository,
        private readonly MonthlyExpenseReportService $monthlyExpenseReportService
    ) {
    }

    public function __invoke(string $calendarIds, int $fromTs, int $toTs): JsonResponse
    {
        [$calendars, $dateFrom, $dateTo] = $this->getParameters($calendarIds, $fromTs, $toTs);

        $expenseBalances = $this->monthlyExpenseReportService->generate($calendars, $dateFrom, $dateTo);

        return $this->respond(
            new ExpenseReportResponse(
                expenseBalances: $expenseBalances,
                meta: BalanceMetaFactory::createMetaFromBalanceArray($expenseBalances),
            )
        );
    }
}