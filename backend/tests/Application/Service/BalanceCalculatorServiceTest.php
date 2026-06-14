<?php

declare(strict_types=1);

namespace App\Tests\Application\Service;

use App\Service\BalanceCalculatorService;
use App\Tests\ApplicationTestCase;
use DateTime;
use PHPUnit\Framework\Attributes\CoversClass;

#[CoversClass(BalanceCalculatorService::class)]
class BalanceCalculatorServiceTest extends ApplicationTestCase
{
    public function testCalculateAmount(): void
    {
        /** @var BalanceCalculatorService $service */
        $service = self::getContainer()->get(BalanceCalculatorService::class);

        $amount = $service->calculateAmount(2000, new DateTime('2024-12-31 23:59:59'), $this->getCalendar('User 1 Calendar'));

        $this->assertEquals(2020.0, $amount);
    }
}
