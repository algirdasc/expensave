<?php

declare(strict_types=1);

namespace App\Request\Category;

use App\Request\AbstractRequest;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Symfony\Component\Validator\Constraints as Assert;

class CreateCategoryRequest extends AbstractRequest
{
    #[Assert\NotBlank]
    protected string $name;

    #[Assert\NotBlank]
    #[Assert\CssColor(formats: [Assert\CssColor::HEX_LONG])]
    protected string $color;

    private ?Collection $rules = null;

    public function getName(): string
    {
        return $this->name;
    }

    public function setName(string $name): self
    {
        $this->name = $name;

        return $this;
    }

    public function getColor(): string
    {
        return $this->color;
    }

    public function setColor(string $color): self
    {
        $this->color = $color;

        return $this;
    }

    public function getRules(): Collection
    {
        return $this->rules ?? new ArrayCollection();
    }

    public function setRules(?Collection $rules): self
    {
        $this->rules = $rules;

        return $this;
    }
}
