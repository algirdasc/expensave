<?php

namespace App\Entity;

use App\Const\ContextGroup\UserContextGroupConst;
use App\Enum\UserRole;
use App\Repository\UserRepository;
use DateTimeInterface;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Bridge\Doctrine\Validator\Constraints\UniqueEntity;
use Symfony\Component\Security\Core\User\PasswordAuthenticatedUserInterface;
use Symfony\Component\Security\Core\User\UserInterface;
use Symfony\Component\Serializer\Attribute\Groups;

/**
 * @codeCoverageIgnore
 */
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

    #[ORM\Column(length: 16, enumType: UserRole::class)]
    #[Groups(UserContextGroupConst::ALWAYS)]
    private UserRole $role = UserRole::USER;

    private ?string $plainPassword = null;

    /**
     * @var Collection<array-key, Calendar>
     */
    #[ORM\OneToMany(targetEntity: Calendar::class, mappedBy: 'owner')]
    private Collection $calendars;

    /**
     * @var Collection<array-key, Calendar>
     */
    #[ORM\ManyToMany(targetEntity: Calendar::class, mappedBy: 'collaborators')]
    private Collection $sharedCalendars;

    #[ORM\Column]
    #[Groups(UserContextGroupConst::ALWAYS)]
    private bool $active = false;

    #[ORM\Column(nullable: true)]
    #[Groups(UserContextGroupConst::DETAILS)]
    private ?int $defaultCalendarId = null;

    #[ORM\Column(nullable: true)]
    private ?string $passwordResetToken = null;

    #[ORM\Column(nullable: true)]
    private ?\DateTimeImmutable $passwordResetTokenExpiresAt = null;

    public function __construct()
    {
        $this->calendars = new ArrayCollection();
        $this->sharedCalendars = new ArrayCollection();
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
        $roles = ['ROLE_USER'];

        if ($this->role === UserRole::ADMIN) {
            $roles[] = 'ROLE_ADMIN';
        }

        return $roles;
    }

    public function getRole(): UserRole
    {
        return $this->role;
    }

    public function setRole(UserRole $role): self
    {
        $this->role = $role;

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

    /**
     * @return Collection<array-key, Calendar>
     */
    public function getCalendars(): Collection
    {
        return $this->calendars;
    }

    /**
     * @return Collection<array-key, Calendar>
     */
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

    public function getPasswordResetToken(): ?string
    {
        return $this->passwordResetToken;
    }

    public function setPasswordResetToken(?string $passwordResetToken): self
    {
        $this->passwordResetToken = $passwordResetToken;

        return $this;
    }

    public function getPasswordResetTokenExpiresAt(): ?\DateTimeImmutable
    {
        return $this->passwordResetTokenExpiresAt;
    }

    public function setPasswordResetTokenExpiresAt(?\DateTimeImmutable $passwordResetTokenExpiresAt): self
    {
        $this->passwordResetTokenExpiresAt = $passwordResetTokenExpiresAt;

        return $this;
    }

    public function hasValidPasswordResetToken(string $token, DateTimeInterface $now): bool
    {
        return $this->passwordResetToken === $token
            && $this->passwordResetTokenExpiresAt !== null
            && $this->passwordResetTokenExpiresAt > $now;
    }

    public function clearPasswordResetToken(): self
    {
        $this->passwordResetToken = null;
        $this->passwordResetTokenExpiresAt = null;

        return $this;
    }

    public function eraseCredentials(): void
    {
        // If you store any temporary, sensitive data on the user, clear it here
        $this->plainPassword = null;
    }
}
