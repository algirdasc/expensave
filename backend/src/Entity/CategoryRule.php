<?php

namespace App\Entity;

use App\Const\ContextGroupConst;
use App\Repository\CategoryRuleRepository;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation\Groups;

#[ORM\Entity(repositoryClass: CategoryRuleRepository::class)]
class CategoryRule
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    #[Groups(ContextGroupConst::API_ALL)]
    private ?int $id = null;

    #[ORM\ManyToOne(targetEntity: Category::class, inversedBy: 'rules')]
    #[Groups(ContextGroupConst::API_ALL)]
    private Category $category;

    #[ORM\Column]
    #[Groups(ContextGroupConst::API_ALL)]
    private string $name;

    #[ORM\Column]
    #[Groups(ContextGroupConst::API_ALL)]
    private string $pattern;

    #[ORM\Column]
    #[Groups(ContextGroupConst::API_ALL)]
    private ?string $label = null;

    #[ORM\ManyToOne(targetEntity: User::class, inversedBy: 'categoryRules')]
    private User $owner;

    public function getId(): ?int
    {
        return $this->id;
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

    public function getName(): string
    {
        return $this->name;
    }

    public function setName(string $name): self
    {
        $this->name = $name;

        return $this;
    }

    public function getPattern(): string
    {
        return $this->pattern;
    }

    public function setPattern(string $pattern): self
    {
        $this->pattern = $pattern;

        return $this;
    }

    public function getLabel(): ?string
    {
        return $this->label;
    }

    public function setLabel(?string $label): self
    {
        $this->label = $label;

        return $this;
    }

    public function getOwner(): User
    {
        return $this->owner;
    }

    public function setOwner(User $owner): self
    {
        $this->owner = $owner;

        return $this;
    }

    public function hasMatch(string $needle): bool
    {
        @preg_match(sprintf('/%s/i', $this->getPattern()), $needle, $matches);

        return (bool) $matches;
    }
}
