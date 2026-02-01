<?php

declare(strict_types=1);

namespace App\Request\Expense;

use App\Attribute\Request\ResolveEntity;
use App\Entity\Calendar;
use App\Entity\Category;
use App\Enum\CategoryType;
use App\Enum\RecurringType;
use App\Request\AbstractRequest;
use DateTime;
use Symfony\Component\Validator\Constraints as Assert;

class CreateExpenseRequest extends AbstractRequest
{
    #[Assert\NotBlank]
    #[ResolveEntity]
    protected Calendar $calendar;

    #[ResolveEntity(defaultCriteria: ['type' => CategoryType::UNCATEGORIZED])]
    protected Category $category;

    #[Assert\NotBlank]
    protected string $label;

    protected ?string $description = null;

    #[Assert\NotBlank]
    #[Assert\NotEqualTo(0)]
    protected float $amount;

    protected bool $confirmed = true;

    #[Assert\NotBlank]
    protected DateTime $createdAt;

    #[Assert\Choice(callback: [RecurringType::class, 'values'])]
    protected ?string $recurringType = null;

    public function getCalendar(): Calendar
    {
        return $this->calendar;
    }

    public function setCalendar(Calendar $calendar): self
    {
        $this->calendar = $calendar;

        return $this;
    }

    public function getCategory(): Category
    {
        return $this->category;
    }

    public function setCategory(Category $category): self
    {
        $this->category = $category;

        return $this;
    }

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

    public function isConfirmed(): bool
    {
        return $this->confirmed;
    }

    public function setConfirmed(bool $confirmed): self
    {
        $this->confirmed = $confirmed;

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

    public function getRecurringType(): ?string
    {
        return $this->recurringType;
    }

    public function setRecurringType(?string $recurringType): self
    {
        $this->recurringType = $recurringType;
        return $this;
    }
}
