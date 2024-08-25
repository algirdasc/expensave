<?php

declare(strict_types=1);

namespace App\Http\Request\Category;

use App\Http\Request\AbstractRequest;
use Symfony\Component\Validator\Constraints as Assert;

class CreateCategoryRequest extends AbstractRequest
{
    #[Assert\NotBlank]
    protected string $name;

    #[Assert\NotBlank]
    #[Assert\CssColor(formats: [Assert\CssColor::HEX_LONG])]
    protected string $color;

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
}
