<?php

declare(strict_types=1);

namespace App\Controller\Report;

use App\Factory\BalanceMetaFactory;
use App\Repository\CalendarRepository;
use App\Repository\ExpenseRepository;
use App\Response\Report\CategoryReportResponse;
use App\Service\Report\CategoryExpenseReportService;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Attribute\Route;

#[Route('api/report/category-expenses/{calendarIds}/{fromTs}/{toTs}', methods: Request::METHOD_GET)]
class CategoryExpensesReportController extends AbstractReportController
{
    public function __construct(
        protected readonly CalendarRepository $calendarRepository,
        protected readonly ExpenseRepository $expenseRepository,
        private readonly CategoryExpenseReportService $categoryExpenseReportService,
    ) {
    }

    public function __invoke(string $calendarIds, int $fromTs, int $toTs): JsonResponse
    {
        [$calendars, $dateFrom, $dateTo] = $this->getParameters($calendarIds, $fromTs, $toTs);

        $categoryBalances = $this->categoryExpenseReportService->generate($calendars, $dateFrom, $dateTo);

        return $this->respond(
            new CategoryReportResponse(
                categoryBalances: $categoryBalances,
                meta: BalanceMetaFactory::createMetaFromBalanceArray($categoryBalances),
            )
        );
    }
}