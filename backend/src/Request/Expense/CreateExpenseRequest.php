<?php

declare(strict_types=1);

namespace App\Request\Expense;

use App\Entity\Calendar;
use App\Request\AbstractRequest;
use DateTime;
use Symfony\Component\Validator\Constraints as Assert;

class CreateExpenseRequest extends AbstractRequest
{
    #[Assert\NotBlank]
    private string $label;

    #[Assert\NotBlank]
    private float $amount;

    //#[Assert\DateTime]
    private DateTime $createdAt;

    public function getLabel(): string
    {
        return $this->label;
    }

    public function setLabel(string $label): self
    {
        $this->label = $label;

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
}
