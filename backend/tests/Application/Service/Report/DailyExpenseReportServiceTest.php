<?php

declare(strict_types=1);

namespace App\Tests\Application\Service\Report;

use App\Repository\CalendarRepository;
use App\Service\Report\DailyExpenseReportService;
use App\Tests\ApplicationTestCase;
use DateTime;
use PHPUnit\Framework\Attributes\CoversClass;

#[CoversClass(DailyExpenseReportService::class)]
class DailyExpenseReportServiceTest extends ApplicationTestCase
{
    public function testGenerate(): void
    {
        /** @var CalendarRepository $calendarRepository */
        $calendarRepository = self::getContainer()->get(CalendarRepository::class);

        /** @var DailyExpenseReportService $reportService */
        $reportService = self::getContainer()->get(DailyExpenseReportService::class);

        $result = $reportService->generate(
            $calendarRepository->findAllByUser($this->getUser()),
            new DateTime('2024-01-01 00:00:00'),
            new DateTime('2024-12-31 23:59:59')
        );

        $this->assertCount(366, $result);

        $balancesByDate = [];
        foreach ($result as $balance) {
            $balancesByDate[$balance->getBalanceAt()->format('Y-m-d')] = $balance;
        }

        $this->assertEquals(-75, $balancesByDate['2024-01-05']->getExpense());
        $this->assertEquals(25, $balancesByDate['2024-02-10']->getIncome());
        $this->assertEquals(30, $balancesByDate['2024-03-15']->getIncome());
        $this->assertEquals(-9, $balancesByDate['2024-04-20']->getExpense());
        $this->assertEquals(-50, $balancesByDate['2024-08-20']->getExpense());
        $this->assertEquals(30, $balancesByDate['2024-09-25']->getIncome());
        $this->assertEquals(-49, $balancesByDate['2024-12-31']->getBalance());
    }
}
