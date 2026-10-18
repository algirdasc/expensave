<?php

declare(strict_types=1);

namespace App\Mcp;

use App\Entity\Calendar;
use App\Factory\BalanceMetaFactory;
use App\Helper\DateHelper;
use App\Repository\CalendarRepository;
use App\Repository\CategoryRepository;
use App\Repository\ExpenseRepository;
use App\Response\Report\CategoryReportResponse;
use App\Response\Report\ExpenseReportResponse;
use App\Security\Voters\CalendarVoter;
use App\Service\Report\CategoryExpenseReportService;
use App\Service\Report\DailyExpenseReportService;
use App\Service\Report\MonthlyExpenseReportService;
use DateTime;
use Mcp\Capability\Attribute\McpTool;
use Mcp\Capability\Attribute\Schema;
use Symfony\Bundle\SecurityBundle\Security;
use Symfony\Component\Serializer\Normalizer\NormalizerInterface;

final class ReportTools extends AbstractMcpTools
{
    public function __construct(
        Security $security,
        NormalizerInterface $normalizer,
        CalendarRepository $calendarRepository,
        CategoryRepository $categoryRepository,
        ExpenseRepository $expenseRepository,
        private readonly DailyExpenseReportService $dailyExpenseReportService,
        private readonly MonthlyExpenseReportService $monthlyExpenseReportService,
        private readonly CategoryExpenseReportService $categoryExpenseReportService,
    ) {
        parent::__construct($security, $normalizer, $calendarRepository, $categoryRepository, $expenseRepository);
    }

    /**
     * @param list<int> $calendarIds
     *
     * @return array<mixed>
     */
    #[McpTool(name: 'daily-expense-report', description: 'Daily income/expense balances with a running balance for the given calendars.')]
    public function dailyExpenseReport(
        #[Schema(description: 'Calendar IDs to include', items: ['type' => 'integer'], minItems: 1)] array $calendarIds,
        #[Schema(description: 'Range start, e.g. 2024-01-01; 1970-01-01 starts at the first expense')] string $dateFrom,
        #[Schema(description: 'Range end, e.g. 2024-12-31')] string $dateTo,
    ): array {
        [$calendars, $dateFrom, $dateTo] = $this->resolveCalendarsAndRange($calendarIds, $dateFrom, $dateTo);

        $expenseBalances = $this->dailyExpenseReportService->generate($calendars, $dateFrom, $dateTo);

        return $this->serialize(
            new ExpenseReportResponse(
                expenseBalances: $expenseBalances,
                meta: BalanceMetaFactory::createMetaFromBalanceArray($expenseBalances),
            )
        );
    }

    /**
     * @param list<int> $calendarIds
     *
     * @return array<mixed>
     */
    #[McpTool(name: 'monthly-expense-report', description: 'Monthly income/expense balances with a running balance for the given calendars.')]
    public function monthlyExpenseReport(
        #[Schema(description: 'Calendar IDs to include', items: ['type' => 'integer'], minItems: 1)] array $calendarIds,
        #[Schema(description: 'Range start, e.g. 2024-01-01; 1970-01-01 starts at the first expense')] string $dateFrom,
        #[Schema(description: 'Range end, e.g. 2024-12-31')] string $dateTo,
    ): array {
        [$calendars, $dateFrom, $dateTo] = $this->resolveCalendarsAndRange($calendarIds, $dateFrom, $dateTo);

        $expenseBalances = $this->monthlyExpenseReportService->generate($calendars, $dateFrom, $dateTo);

        return $this->serialize(
            new ExpenseReportResponse(
                expenseBalances: $expenseBalances,
                meta: BalanceMetaFactory::createMetaFromBalanceArray($expenseBalances),
            )
        );
    }

    /**
     * @param list<int> $calendarIds
     *
     * @return array<mixed>
     */
    #[McpTool(name: 'category-expenses-report', description: 'Income/expense totals grouped by category for the given calendars.')]
    public function categoryExpensesReport(
        #[Schema(description: 'Calendar IDs to include', items: ['type' => 'integer'], minItems: 1)] array $calendarIds,
        #[Schema(description: 'Range start, e.g. 2024-01-01; 1970-01-01 starts at the first expense')] string $dateFrom,
        #[Schema(description: 'Range end, e.g. 2024-12-31')] string $dateTo,
    ): array {
        [$calendars, $dateFrom, $dateTo] = $this->resolveCalendarsAndRange($calendarIds, $dateFrom, $dateTo);

        $categoryBalances = $this->categoryExpenseReportService->generate($calendars, $dateFrom, $dateTo);

        return $this->serialize(
            new CategoryReportResponse(
                categoryBalances: $categoryBalances,
                meta: BalanceMetaFactory::createMetaFromBalanceArray($categoryBalances),
            )
        );
    }

    /**
     * shortcut: duplicated from AbstractReportController, extract a shared report query resolver if this grows
     *
     * @param list<int> $calendarIds
     *
     * @return array{array<Calendar>, DateTime, DateTime}
     */
    private function resolveCalendarsAndRange(array $calendarIds, string $dateFrom, string $dateTo): array
    {
        $calendars = $this->calendarRepository->findBy(['id' => $calendarIds]);

        foreach ($calendars as $calendar) {
            $this->denyAccessUnlessGranted(CalendarVoter::VIEW, $calendar);
        }

        $dateFrom = $this->parseDate($dateFrom);
        $dateTo = $this->parseDate($dateTo);

        if ($dateFrom->getTimestamp() === 0) {
            $firstExpense = $this->expenseRepository->findOneBy(['calendar' => $calendars], ['createdAt' => 'ASC']);
            if ($firstExpense !== null) {
                $firstExpenseDate = $firstExpense->getCreatedAt();
                $dateFrom->modify($firstExpenseDate->format('c'));
            }
        }

        DateHelper::setRange($dateFrom, $dateTo);

        return [$calendars, $dateFrom, $dateTo];
    }
}
