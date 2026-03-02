<?php

declare(strict_types=1);

namespace App\Request\Expense;

use App\Enum\RecurringFrequency;
use DateTime;
use Symfony\Component\Validator\Constraints as Assert;

class RecurringRuleRequest
{
    #[Assert\NotBlank]
    public RecurringFrequency $frequency;

    #[Assert\GreaterThanOrEqual(1)]
    public int $interval = 1;

    #[Assert\NotBlank]
    public DateTime $startAt;

    public ?DateTime $endAt = null;

    public function getFrequency(): RecurringFrequency
    {
        return $this->frequency;
    }

    public function getInterval(): int
    {
        return $this->interval;
    }

    public function getStartAt(): DateTime
    {
        return $this->startAt;
    }

    public function getEndAt(): ?DateTime
    {
        return $this->endAt;
    }
}
