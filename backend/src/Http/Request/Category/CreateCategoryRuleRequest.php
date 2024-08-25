<?php

declare(strict_types=1);

namespace App\Http\Request\Category;

use App\Attribute\Request\ResolveEntity;
use App\Entity\Category;
use App\Http\Request\AbstractRequest;
use Symfony\Component\Validator\Constraints as Assert;

class CreateCategoryRuleRequest extends AbstractRequest
{
    #[Assert\NotBlank]
    protected string $name;

    #[Assert\NotBlank]
    protected string $pattern;

    #[ResolveEntity]
    protected Category $category;

    protected ?string $label = null;

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

    public function getCategory(): Category
    {
        return $this->category;
    }

    public function setCategory(Category $category): self
    {
        $this->category = $category;
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
}