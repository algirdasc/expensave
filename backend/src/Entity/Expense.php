<?php

namespace App\Entity;

use App\Const\ContextGroup\ExpenseContextGroupConst;
use App\Repository\ExpenseRepository;
use DateTime;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation\Groups;

/**
 * @codeCoverageIgnore
 */
#[ORM\Entity(repositoryClass: ExpenseRepository::class)]
#[ORM\Index(fields: ['label'])]
class Expense
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    #[Groups(ExpenseContextGroupConst::ALWAYS)]
    private ?int $id = null;

    #[ORM\ManyToOne(targetEntity: Category::class)]
    #[Groups(ExpenseContextGroupConst::ALWAYS)]
    private Category $category;

    #[ORM\ManyToOne(targetEntity: Calendar::class, cascade: ['persist'], inversedBy: 'expenses')]
    #[Groups(ExpenseContextGroupConst::ALWAYS)]
    private Calendar $calendar;

    #[ORM\ManyToOne(targetEntity: User::class)]
    #[Groups(ExpenseContextGroupConst::ALWAYS)]
    private User $user;

    #[ORM\Column]
    #[Groups(ExpenseContextGroupConst::ALWAYS)]
    private float $amount = 0;

    #[ORM\Column]
    #[Groups(ExpenseContextGroupConst::ALWAYS)]
    private string $label;

    #[ORM\Column]
    #[Groups(ExpenseContextGroupConst::ALWAYS)]
    private bool $confirmed = false;

    #[ORM\Column(type: 'text', nullable: true)]
    #[Groups(ExpenseContextGroupConst::ALWAYS)]
    private ?string $description = null;

    #[ORM\Column]
    #[Groups(ExpenseContextGroupConst::ALWAYS)]
    private DateTime $createdAt;

    public function __construct()
    {
        $this->createdAt = new DateTime();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function setId(?int $id): self
    {
        $this->id = $id;

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

    public function getCalendar(): Calendar
    {
        return $this->calendar;
    }

    public function setCalendar(Calendar $calendar): self
    {
        $this->calendar = $calendar;

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

    public function getCreatedAt(): DateTime
    {
        return $this->createdAt;
    }

    public function setCreatedAt(DateTime $createdAt): self
    {
        $this->createdAt = $createdAt;

        return $this;
    }

    public function isIncome(): bool
    {
        return $this->getAmount() > 0;
    }
}
