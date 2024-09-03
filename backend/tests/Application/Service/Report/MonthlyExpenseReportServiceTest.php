<?php

declare(strict_types=1);

namespace App\Tests\Application\Service\Report;

use App\Repository\CalendarRepository;
use App\Service\Report\CategoryExpenseReportService;
use App\Service\Report\DailyExpenseReportService;
use App\Service\Report\MonthlyExpenseReportService;
use App\Tests\ApplicationTestCase;
use DateTime;
use PHPUnit\Framework\Attributes\CoversClass;

#[CoversClass(CategoryExpenseReportService::class)]
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

        $this->assertEquals(-49, $result[11]->getBalance());
    }
}