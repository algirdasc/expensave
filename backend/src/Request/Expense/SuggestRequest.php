<?php

declare(strict_types=1);

namespace App\Request\Expense;

use App\Request\AbstractRequest;
use Symfony\Component\Validator\Constraints as Assert;

class SuggestRequest extends AbstractRequest
{
    #[Assert\NotBlank]
    private string $label;

    public function getLabel(): string
    {
        return $this->label;
    }

    public function setLabel(string $label): self
    {
        $this->label = $label;

        return $this;
    }
}