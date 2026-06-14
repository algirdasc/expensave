<?php

declare(strict_types=1);

namespace App\Entity;

use App\Enum\RecurringExpenseFrequency;
use App\Repository\RecurringExpenseRepository;
use DateTime;
use Doctrine\ORM\Mapping as ORM;

/**
 * @codeCoverageIgnore
 */
#[ORM\Entity(repositoryClass: RecurringExpenseRepository::class)]
class RecurringExpense
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\ManyToOne(targetEntity: Calendar::class)]
    private Calendar $calendar;

    #[ORM\ManyToOne(targetEntity: Category::class)]
    private Category $category;

    #[ORM\ManyToOne(targetEntity: User::class)]
    private User $user;

    #[ORM\Column(length: 16, enumType: RecurringExpenseFrequency::class)]
    private RecurringExpenseFrequency $frequency;

    #[ORM\Column]
    private int $occurrences;

    #[ORM\Column]
    private string $label;

    #[ORM\Column(type: 'text', nullable: true)]
    private ?string $description = null;

    #[ORM\Column]
    private float $amount = 0;

    #[ORM\Column]
    private bool $confirmed = false;

    #[ORM\Column]
    private DateTime $startsAt;

    public function getId(): ?int
    {
        return $this->id;
    }

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

    public function getUser(): User
    {
        return $this->user;
    }

    public function setUser(User $user): self
    {
        $this->user = $user;

        return $this;
    }

    public function getFrequency(): RecurringExpenseFrequency
    {
        return $this->frequency;
    }

    public function setFrequency(RecurringExpenseFrequency $frequency): self
    {
        $this->frequency = $frequency;

        return $this;
    }

    public function getOccurrences(): int
    {
        return $this->occurrences;
    }

    public function setOccurrences(int $occurrences): self
    {
        $this->occurrences = $occurrences;

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

    public function getDescription(): ?string
    {
        return $this->description;
    }

    public function setDescription(?string $description): self
    {
        $this->description = $description;

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

    public function isConfirmed(): bool
    {
        return $this->confirmed;
    }

    public function setConfirmed(bool $confirmed): self
    {
        $this->confirmed = $confirmed;

        return $this;
    }

    public function getStartsAt(): DateTime
    {
        return $this->startsAt;
    }

    public function setStartsAt(DateTime $startsAt): self
    {
        $this->startsAt = $startsAt;

        return $this;
    }
}
