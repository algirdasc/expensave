<?php

namespace App\Entity;

use App\Const\ContextGroup\UserContextGroupConst;
use App\Repository\UserRepository;
use DateTime;
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

    /**
     * @var array<string>
     */
    #[ORM\Column]
    private array $roles = [];

    #[ORM\Column]
    private string $password;

    private ?string $plainPassword = null;

    /**
     * @var Collection<Calendar>
     */
    #[ORM\ManyToMany(targetEntity: Calendar::class, mappedBy: 'users')]
    #[Groups(UserContextGroupConst::DETAILS)]
    private Collection $calendars;

    #[ORM\Column]
    private bool $active = false;

    #[ORM\Column(nullable: true)]
    private ?DateTime $lastLoginAt = null;

    public function __construct()
    {
        $this->calendars = new ArrayCollection();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getEmail(): ?string
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
        $roles = $this->roles;
        // guarantee every user at least has ROLE_USER
        $roles[] = 'ROLE_USER';

        return array_unique($roles);
    }

    /**
     * @param array<string> $roles
     */
    public function setRoles(array $roles): self
    {
        $this->roles = $roles;

        return $this;
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

    public function addCalendar(Calendar $calendar): self
    {
        if (!$this->calendars->contains($calendar)) {
            $this->calendars->add($calendar);
        }

        return $this;
    }

    public function removeCalendar(Calendar $calendar): self
    {
        $this->calendars->removeElement($calendar);

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

    public function getLastLoginAt(): ?DateTime
    {
        return $this->lastLoginAt;
    }

    public function setLastLoginAt(?DateTime $lastLoginAt): self
    {
        $this->lastLoginAt = $lastLoginAt;

        return $this;
    }

    public function eraseCredentials(): void
    {
        // If you store any temporary, sensitive data on the user, clear it here
        $this->plainPassword = null;
    }
}
