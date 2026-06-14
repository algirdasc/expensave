<?php

declare(strict_types=1);

namespace App\Request\Expense;

use App\Attribute\Request\ResolveEntity;
use App\Entity\Calendar;
use App\Entity\Category;
use App\Enum\CategoryType;
use App\Enum\RecurringExpenseFrequency;
use App\Request\AbstractRequest;
use DateTime;
use Symfony\Component\Validator\Constraints as Assert;
use Symfony\Component\Validator\Context\ExecutionContextInterface;

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

    protected bool $recurring = false;

    #[Assert\Choice(callback: [RecurringExpenseFrequency::class, 'values'])]
    protected ?string $recurringFrequency = null;

    protected ?int $recurringOccurrences = null;

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

    public function isRecurring(): bool
    {
        return $this->recurring;
    }

    public function setRecurring(bool $recurring): self
    {
        $this->recurring = $recurring;

        return $this;
    }

    public function getRecurringFrequency(): RecurringExpenseFrequency
    {
        return RecurringExpenseFrequency::from((string) $this->recurringFrequency);
    }

    public function setRecurringFrequency(?string $recurringFrequency): self
    {
        $this->recurringFrequency = $recurringFrequency;

        return $this;
    }

    public function getRecurringOccurrences(): int
    {
        return (int) $this->recurringOccurrences;
    }

    public function setRecurringOccurrences(?int $recurringOccurrences): self
    {
        $this->recurringOccurrences = $recurringOccurrences;

        return $this;
    }

    #[Assert\Callback]
    public function validateRecurringExpense(ExecutionContextInterface $context): void
    {
        if (!$this->recurring) {
            return;
        }

        if ($this->recurringFrequency === null) {
            $context
                ->buildViolation('Recurring frequency is required.')
                ->atPath('recurringFrequency')
                ->addViolation();
        }

        if ($this->recurringOccurrences === null || $this->recurringOccurrences < 2 || $this->recurringOccurrences > 120) {
            $context
                ->buildViolation('Recurring occurrences must be between 2 and 120.')
                ->atPath('recurringOccurrences')
                ->addViolation();
        }
    }

    #[Assert\Callback]
    public function validateCategory(ExecutionContextInterface $context): void
    {
        if (!isset($this->category) || $this->category->getType() !== CategoryType::BALANCE_UPDATE) {
            return;
        }

        $context
            ->buildViolation('Balance update category cannot be used for expenses.')
            ->atPath('category')
            ->addViolation();
    }
}
