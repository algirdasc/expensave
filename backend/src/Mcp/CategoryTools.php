<?php

declare(strict_types=1);

namespace App\Mcp;

use App\Enum\CategoryType;
use Mcp\Capability\Attribute\McpTool;
use Mcp\Capability\Attribute\Schema;

final class CategoryTools extends AbstractMcpTools
{
    /**
     * @return array<mixed>
     */
    #[McpTool(name: 'list-categories', description: 'List expense categories available to the user, sorted by name.')]
    public function listCategories(): array
    {
        $categories = $this->categoryRepository->findBy(
            ['type' => [CategoryType::USER, CategoryType::UNCATEGORIZED]],
            ['name' => 'ASC'],
        );

        return $this->serialize($categories);
    }

    /**
     * @return array<mixed>
     */
    #[McpTool(name: 'get-category', description: 'Get a single category by ID.')]
    public function getCategory(
        #[Schema(description: 'Category ID')] int $categoryId,
    ): array {
        return $this->serialize($this->findCategoryOrFail($categoryId));
    }
}
