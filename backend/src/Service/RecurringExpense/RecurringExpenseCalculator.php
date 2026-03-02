<?php

declare(strict_types=1);

namespace App\Service\RecurringExpense;

use App\Entity\RecurringExpense;
use App\Enum\RecurringFrequency;
use DateInterval;
use DateTime;

class RecurringExpenseCalculator
{
    public function calculateNextRunAt(RecurringExpense $recurringExpense, DateTime $from): DateTime
    {
        $interval = max(1, $recurringExpense->getInterval());

        $next = clone $from;

        // Keep the time part from $from.
        // We rely on DateTime's add() semantics for month boundaries.
        switch ($recurringExpense->getFrequency()) {
            case RecurringFrequency::DAILY:
                $next->add(new DateInterval(sprintf('P%dD', $interval)));
                break;
            case RecurringFrequency::WEEKLY:
                $next->add(new DateInterval(sprintf('P%dW', $interval)));
                break;
            case RecurringFrequency::MONTHLY:
                $next->add(new DateInterval(sprintf('P%dM', $interval)));
                break;
            case RecurringFrequency::YEARLY:
                $next->add(new DateInterval(sprintf('P%dY', $interval)));
                break;
        }

        return $next;
    }
}
