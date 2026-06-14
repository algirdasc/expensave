<?php

declare(strict_types=1);

namespace App\Service;

use App\Entity\Category;
use App\Enum\CategoryType;
use App\Repository\CategoryRepository;
use App\Request\Category\CreateCategoryRequest;
use App\Request\Category\UpdateCategoryRequest;
use Symfony\Component\Security\Core\Exception\AccessDeniedException;

readonly class CategoryService
{
    public function __construct(
        private CategoryRepository $categoryRepository,
    ) {
    }

    public function create(CreateCategoryRequest $request): Category
    {
        $category = (new Category())
            ->setName($request->getName())
            ->setColor($request->getColor())
            ->setType(CategoryType::USER)
        ;

        $this->categoryRepository->save($category);

        return $category;
    }

    public function update(Category $category, UpdateCategoryRequest $request): Category
    {
        $this->assertDefinedByUser($category);

        $category
            ->setName($request->getName())
            ->setColor($request->getColor())
        ;

        $this->categoryRepository->save($category);

        return $category;
    }

    public function remove(Category $category): void
    {
        $this->assertDefinedByUser($category);

        $this->categoryRepository->remove($category);
    }

    private function assertDefinedByUser(Category $category): void
    {
        if (!$category->isDefinedByUser()) {
            throw new AccessDeniedException();
        }
    }
}
