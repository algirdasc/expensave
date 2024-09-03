<?php

namespace App\Entity;

use App\Repository\CategoryRuleRepository;
use Doctrine\ORM\Mapping as ORM;

/**
 * @codeCoverageIgnore
 */
#[ORM\Entity(repositoryClass: CategoryRuleRepository::class)]
class CategoryRule
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\ManyToOne(targetEntity: Category::class, inversedBy: 'rules')]
    private Category $category;

    #[ORM\Column]
    private string $name;

    #[ORM\Column]
    private string $pattern;

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

    public function hasMatch(string $needle): bool
    {
        @preg_match(sprintf('/%s/i', $this->getPattern()), $needle, $matches);

        return (bool) $matches;
    }
}
