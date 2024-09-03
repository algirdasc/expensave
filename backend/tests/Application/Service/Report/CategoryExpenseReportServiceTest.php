<?php

declare(strict_types=1);

namespace App\Tests\Application\Service\Report;

use App\Repository\CalendarRepository;
use App\Service\Report\CategoryExpenseReportService;
use App\Tests\ApplicationTestCase;
use DateTime;
use PHPUnit\Framework\Attributes\CoversClass;

#[CoversClass(CategoryExpenseReportService::class)]
class CategoryExpenseReportServiceTest extends ApplicationTestCase
{
    public function testGenerate(): void
    {
        /** @var CalendarRepository $calendarRepository */
        $calendarRepository = self::getContainer()->get(CalendarRepository::class);

        /** @var CategoryExpenseReportService $reportService */
        $reportService = self::getContainer()->get(CategoryExpenseReportService::class);

        $result = $reportService->generate(
            $calendarRepository->findAllByUser($this->getUser()),
            new DateTime('2024-01-01 00:00:00'),
            new DateTime('2024-12-31 23:59:59')
        );

        $this->assertCount(4, $result);

        $this->assertEquals(0, $result[0]->getIncome());
        $this->assertEquals(0, $result[0]->getExpense());
        $this->assertEquals(0, $result[0]->getBalance());

        $this->assertEquals(0, $result[1]->getIncome());
        $this->assertEquals(-75, $result[1]->getExpense());
        $this->assertEquals(0, $result[1]->getBalance());

        $this->assertEquals(25, $result[2]->getIncome());
        $this->assertEquals(0, $result[2]->getExpense());
        $this->assertEquals(0, $result[2]->getBalance());

        $this->assertEquals(30, $result[3]->getIncome());
        $this->assertEquals(0, $result[3]->getExpense());
        $this->assertEquals(0, $result[3]->getBalance());
    }
}