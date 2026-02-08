<?php

declare(strict_types=1);

namespace App\Tests\Application\Service\RecurringExpense;

use App\Entity\RecurringExpense;
use App\Enum\RecurringFrequency;
use App\Service\RecurringExpense\RecurringExpenseCalculator;
use App\Tests\ApplicationTestCase;
use DateTime;
use PHPUnit\Framework\Attributes\CoversClass;

#[CoversClass(RecurringExpenseCalculator::class)]
class RecurringExpenseCalculatorTest extends ApplicationTestCase
{
    public function testMonthlyInterval(): void
    {
        $schedule = (new RecurringExpense())
            ->setFrequency(RecurringFrequency::MONTHLY)
            ->setInterval(1);

        $calc = self::getContainer()->get(RecurringExpenseCalculator::class);

        $from = new DateTime('2026-02-08 10:00:00');
        $next = $calc->calculateNextRunAt($schedule, $from);

        self::assertSame('2026-03-08 10:00:00', $next->format('Y-m-d H:i:s'));
    }
}
