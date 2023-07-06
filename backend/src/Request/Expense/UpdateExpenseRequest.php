<?php

declare(strict_types=1);

namespace App\Request\Expense;

use App\Request\AbstractRequest;
use DateTime;
use Symfony\Component\Validator\Constraints as Assert;

class UpdateExpenseRequest extends AbstractRequest
{
    #[Assert\NotBlank]
    private string $label;

    #[Assert\NotBlank]
    private float $amount;

    //#[Assert\DateTime]
    private DateTime $createdAt;

    #[Assert\Type('bool')]
    private bool $confirmed;

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

    public function setAmount(float $amount): self
    {
        $this->amount = $amount;

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

    public function isConfirmed(): bool
    {
        return $this->confirmed;
    }

    public function setConfirmed(bool $confirmed): self
    {
        $this->confirmed = $confirmed;

        return $this;
    }
}
