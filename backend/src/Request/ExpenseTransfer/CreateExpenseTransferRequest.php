<?php

declare(strict_types=1);

namespace App\Request\ExpenseTransfer;

use App\Attribute\Request\ResolveEntity;
use App\Const\AssertConst;
use App\Entity\Calendar;
use App\Request\Expense\CreateExpenseRequest;
use Symfony\Component\Validator\Constraints as Assert;

class CreateExpenseTransferRequest extends CreateExpenseRequest
{
    #[Assert\NotBlank]
    #[ResolveEntity]
    protected Calendar $destinationCalendar;

    public function getDestinationCalendar(): Calendar
    {
        return $this->destinationCalendar;
    }

    public function setDestinationCalendar(Calendar $destinationCalendar): self
    {
        $this->destinationCalendar = $destinationCalendar;

        return $this;
    }

    public function getSourceCalendar(): Calendar
    {
        return $this->calendar;
    }

    #[Assert\IsFalse(message: AssertConst::MSG_CANNOT_TRANSFER_TO_SAME_CALENDAR)]
    public function isCalendarsTheSame(): bool
    {
        return $this->getSourceCalendar()->getId() === $this->getDestinationCalendar()->getId();
    }

    public function isAmountNegative(): bool
    {
        return $this->getAmount() < 0;
    }
}
