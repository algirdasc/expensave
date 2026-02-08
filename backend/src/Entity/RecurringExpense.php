<?php

declare(strict_types=1);

namespace App\Entity;

use App\Enum\RecurringFrequency;
use App\Repository\RecurringExpenseRepository;
use DateTime;
use Doctrine\ORM\Mapping as ORM;

/**
 * Template/schedule for generating recurring expenses.
 *
 * @codeCoverageIgnore
 */
#[ORM\Entity(repositoryClass: RecurringExpenseRepository::class)]
#[ORM\Index(fields: ['nextRunAt'])]
class RecurringExpense
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\ManyToOne(targetEntity: User::class)]
    private User $user;

    #[ORM\ManyToOne(targetEntity: Calendar::class)]
    private Calendar $calendar;

    #[ORM\ManyToOne(targetEntity: Category::class)]
    private Category $category;

    #[ORM\Column]
    private float $amount = 0;

    #[ORM\Column]
    private string $label;

    #[ORM\Column(type: 'text', nullable: true)]
    private ?string $description = null;

    #[ORM\Column]
    private bool $confirmed = false;

    #[ORM\Column]
    private DateTime $startAt;

    #[ORM\Column]
    private DateTime $nextRunAt;

    #[ORM\Column(nullable: true)]
    private ?DateTime $endAt = null;

    #[ORM\Column(enumType: RecurringFrequency::class)]
    private RecurringFrequency $frequency;

    #[ORM\Column]
    private int $interval = 1;

    #[ORM\Column]
    private bool $active = true;

    #[ORM\Column]
    private DateTime $createdAt;

    #[ORM\Column]
    private DateTime $updatedAt;

    public function __construct()
    {
        $now = new DateTime();
        $this->createdAt = $now;
        $this->updatedAt = $now;
    }

    public function touch(): void
    {
        $this->updatedAt = new DateTime();
    }

    public function getId(): ?int
    {
        return $this->id;
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

    public function getAmount(): float
    {
        return $this->amount;
    }

    public function setAmount(float $amount): self
    {
        $this->amount = $amount;
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

    public function isConfirmed(): bool
    {
        return $this->confirmed;
    }

    public function setConfirmed(bool $confirmed): self
    {
        $this->confirmed = $confirmed;
        return $this;
    }

    public function getStartAt(): DateTime
    {
        return $this->startAt;
    }

    public function setStartAt(DateTime $startAt): self
    {
        $this->startAt = $startAt;
        return $this;
    }

    public function getNextRunAt(): DateTime
    {
        return $this->nextRunAt;
    }

    public function setNextRunAt(DateTime $nextRunAt): self
    {
        $this->nextRunAt = $nextRunAt;
        return $this;
    }

    public function getEndAt(): ?DateTime
    {
        return $this->endAt;
    }

    public function setEndAt(?DateTime $endAt): self
    {
        $this->endAt = $endAt;
        return $this;
    }

    public function getFrequency(): RecurringFrequency
    {
        return $this->frequency;
    }

    public function setFrequency(RecurringFrequency $frequency): self
    {
        $this->frequency = $frequency;
        return $this;
    }

    public function getInterval(): int
    {
        return $this->interval;
    }

    public function setInterval(int $interval): self
    {
        $this->interval = $interval;
        return $this;
    }

    public function isActive(): bool
    {
        return $this->active;
    }

    public function setActive(bool $active): self
    {
        $this->active = $active;
        return $this;
    }
}
