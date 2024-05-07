<?php

namespace App\Entity;

use App\Const\ContextGroup\UserContextGroupConst;
use App\Repository\UserRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Bridge\Doctrine\Validator\Constraints\UniqueEntity;
use Symfony\Component\Security\Core\User\PasswordAuthenticatedUserInterface;
use Symfony\Component\Security\Core\User\UserInterface;
use Symfony\Component\Serializer\Annotation\Groups;

#[ORM\Entity(repositoryClass: UserRepository::class)]
#[ORM\Table(name: '`user`')]
#[UniqueEntity(['email'])]
class User implements UserInterface, PasswordAuthenticatedUserInterface
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    #[Groups(UserContextGroupConst::ALWAYS)]
    private ?int $id = null;

    #[ORM\Column(unique: true)]
    #[Groups(UserContextGroupConst::ALWAYS)]
    private string $email;

    #[ORM\Column]
    #[Groups(UserContextGroupConst::ALWAYS)]
    private string $name;

    #[ORM\Column]
    private string $password;

    private ?string $plainPassword = null;

    /**
     * @var Collection<Calendar>
     */
    #[ORM\OneToMany(targetEntity: Calendar::class, mappedBy: 'owner')]
    private Collection $calendars;

    /**
     * @var Collection<Calendar>
     */
    #[ORM\ManyToMany(targetEntity: Calendar::class, mappedBy: 'collaborators')]
    private Collection $sharedCalendars;

    #[ORM\Column]
    #[Groups(UserContextGroupConst::ALWAYS)]
    private bool $active = false;

    #[ORM\Column(nullable: true)]
    #[Groups(UserContextGroupConst::DETAILS)]
    private ?int $defaultCalendarId = null;

    public function __construct()
    {
        $this->calendars = new ArrayCollection();
        $this->sharedCalendars = new ArrayCollection();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getEmail(): string
    {
        return $this->email;
    }

    public function setEmail(string $email): self
    {
        $this->email = $email;

        return $this;
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

    public function getUserIdentifier(): string
    {
        return $this->getEmail();
    }

    public function getRoles(): array
    {
        return ['ROLE_USER'];
    }

    public function getPassword(): string
    {
        return $this->password;
    }

    public function setPassword(string $password): self
    {
        $this->password = $password;

        return $this;
    }

    public function getPlainPassword(): ?string
    {
        return $this->plainPassword;
    }

    public function setPlainPassword(?string $plainPassword): self
    {
        $this->plainPassword = $plainPassword;

        return $this;
    }

    public function getCalendars(): Collection
    {
        return $this->calendars;
    }

    public function getSharedCalendars(): Collection
    {
        return $this->sharedCalendars;
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

    public function getDefaultCalendarId(): ?int
    {
        return $this->defaultCalendarId;
    }

    public function setDefaultCalendarId(?int $defaultCalendarId): self
    {
        $this->defaultCalendarId = $defaultCalendarId;

        return $this;
    }

    public function eraseCredentials(): void
    {
        // If you store any temporary, sensitive data on the user, clear it here
        $this->plainPassword = null;
    }
}
