<?php

namespace App\Entity;

use App\Const\ContextGroup\CalendarContextGroupConst;
use App\Repository\CalendarRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation\Groups;

#[ORM\Entity(repositoryClass: CalendarRepository::class)]
class Calendar
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    #[Groups(CalendarContextGroupConst::ALWAYS)]
    private ?int $id = null;

    #[ORM\Column]
    #[Groups(CalendarContextGroupConst::ALWAYS)]
    private string $name;

    #[ORM\ManyToOne(targetEntity: User::class, inversedBy: 'calendars')]
    #[Groups(CalendarContextGroupConst::ALWAYS)]
    private User $owner;

    /**
     * @var Collection<Expense>
     */
    #[ORM\OneToMany(mappedBy: 'calendar', targetEntity: Expense::class)]
    private Collection $expenses;

    /**
     * @var Collection<User>
     */
    #[ORM\ManyToMany(targetEntity: User::class, inversedBy: 'sharedCalendars')]
    #[Groups(CalendarContextGroupConst::DETAILS)]
    private Collection $collaborators;

    #[ORM\Column]
    #[Groups(CalendarContextGroupConst::ALWAYS)]
    private float $balance = 0;

    #[Groups(CalendarContextGroupConst::ALWAYS)]
    public function isShared(): bool
    {
        return $this->collaborators->count() > 0;
    }

    public function __construct(string $name, User $owner)
    {
        $this->name = $name;
        $this->owner = $owner;
        $this->collaborators = new ArrayCollection();
        $this->expenses = new ArrayCollection();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getName(): string
    {
        return $this->name;
    }

    public function setName(string $name): self
    {
        $this->name = $name;

        return $this;
    }

    public function getExpenses(): Collection
    {
        return $this->expenses;
    }

    public function addExpense(Expense $expense): self
    {
        if (!$this->expenses->contains($expense)) {
            $this->expenses->add($expense);
        }

        return $this;
    }

    public function removeExpense(Expense $expense): self
    {
        $this->expenses->removeElement($expense);

        return $this;
    }

    public function getCollaborators(): Collection
    {
        return $this->collaborators;
    }

    public function addCollaborator(User $user): self
    {
        if (!$this->collaborators->contains($user)) {
            $this->collaborators->add($user);
        }

        return $this;
    }

    public function removeCollaborator(User $user): self
    {
        $this->collaborators->removeElement($user);

        return $this;
    }

    public function getBalance(): float
    {
        return $this->balance;
    }

    public function setBalance(float $balance): self
    {
        $this->balance = $balance;

        return $this;
    }

    public function addBalance(float $balance): self
    {
        $this->balance += $balance;

        return $this;
    }

    public function subBalance(float $balance): self
    {
        $this->balance -= $balance;

        return $this;
    }

    public function getOwner(): User
    {
        return $this->owner;
    }
}
