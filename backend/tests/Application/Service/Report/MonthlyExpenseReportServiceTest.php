<?php

declare(strict_types=1);

namespace App\Tests\Application\Service\Report;

use App\Repository\CalendarRepository;
use App\Service\Report\MonthlyExpenseReportService;
use App\Tests\ApplicationTestCase;
use DateTime;
use PHPUnit\Framework\Attributes\CoversClass;

#[CoversClass(MonthlyExpenseReportService::class)]
class MonthlyExpenseReportServiceTest extends ApplicationTestCase
{
    public function testGenerate(): void
    {
        /** @var CalendarRepository $calendarRepository */
        $calendarRepository = self::getContainer()->get(CalendarRepository::class);

        /** @var MonthlyExpenseReportService $reportService */
        $reportService = self::getContainer()->get(MonthlyExpenseReportService::class);

        $result = $reportService->generate(
            $calendarRepository->findAllByUser($this->getUser()),
            new DateTime('2024-01-01 00:00:00'),
            new DateTime('2024-12-31 23:59:59')
        );

        $this->assertCount(12, $result);

        $balancesByMonth = [];
        foreach ($result as $balance) {
            $balancesByMonth[$balance->getBalanceAt()->format('Y-m')] = $balance;
        }

        $this->assertEquals(-75, $balancesByMonth['2024-01']->getExpense());
        $this->assertEquals(25, $balancesByMonth['2024-02']->getIncome());
        $this->assertEquals(30, $balancesByMonth['2024-03']->getIncome());
        $this->assertEquals(0, $balancesByMonth['2024-04']->getExpense());
        $this->assertEquals(0, $balancesByMonth['2024-08']->getExpense());
        $this->assertEquals(0, $balancesByMonth['2024-09']->getIncome());
        $this->assertEquals(-20, $balancesByMonth['2024-12']->getBalance());
    }
}
