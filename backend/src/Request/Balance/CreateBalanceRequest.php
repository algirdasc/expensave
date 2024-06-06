<?php

declare(strict_types=1);

namespace App\Request\Balance;

use App\Attribute\Request\ResolveEntity;
use App\Entity\Calendar;
use App\Request\AbstractRequest;
use DateTime;
use Symfony\Component\Validator\Constraints as Assert;

class CreateBalanceRequest extends AbstractRequest
{
    #[Assert\NotBlank]
    #[ResolveEntity]
    protected Calendar $calendar;

    protected ?string $description = null;

    #[Assert\NotBlank]
    #[Assert\NotEqualTo(0)]
    protected float $amount;

    #[Assert\NotBlank]
    protected DateTime $createdAt;

    public function getCalendar(): Calendar
    {
        return $this->calendar;
    }

    public function setCalendar(Calendar $calendar): self
    {
        $this->calendar = $calendar;

        return $this;
    }

    public function getAmount(): float
    {
        return $this->amount;
    }

    public function setAmount(float|int $amount): self
    {
        $this->amount = (float) $amount;

        return $this;
    }

    public function getCreatedAt(): DateTime
    {
        return $this->createdAt;
    }

    public function setCreatedAt(DateTime $createdAt): self
    {
        $this->createdAt = $createdAt;

        return $this;
    }

    public function getDescription(): ?string
    {
        return $this->description;
    }

    public function setDescription(?string $description): self
    {
        $this->description = $description;

        return $this;
    }
}
