<?php

declare(strict_types=1);

namespace App\Response\Expense;

use App\Const\ContextGroupConst;
use App\Entity\Category;
use Symfony\Component\Serializer\Annotation\Groups;

readonly class SuggestResponse
{
    public function __construct(
        private string $label,
        private ?Category $category = null
    ) {
    }

    #[Groups(ContextGroupConst::API_ALL)]
    public function getLabel(): string
    {
        return $this->label;
    }

    #[Groups(ContextGroupConst::API_ALL)]
    public function getCategory(): ?Category
    {
        return $this->category;
    }
}