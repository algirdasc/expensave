<?php

declare(strict_types=1);

namespace App\Service;

use App\Entity\Category;
use App\Enum\CategoryType;
use App\Exception\DataConflictException;
use App\Repository\CategoryRepository;
use App\Repository\CategoryRuleRepository;
use App\Repository\ExpenseRepository;
use App\Repository\RecurringExpenseRepository;
use App\Request\Category\CreateCategoryRequest;
use App\Request\Category\UpdateCategoryRequest;
use Symfony\Component\Security\Core\Exception\AccessDeniedException;

readonly class CategoryService
{
    public function __construct(
        private CategoryRepository $categoryRepository,
        private ExpenseRepository $expenseRepository,
        private RecurringExpenseRepository $recurringExpenseRepository,
        private CategoryRuleRepository $categoryRuleRepository,
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
        $this->assertCanRemove($category);

        $this->categoryRepository->remove($category);
    }

    private function assertCanRemove(Category $category): void
    {
        if ($this->expenseRepository->hasCategory($category)) {
            throw new DataConflictException(
                'This category is used by existing expenses. Move or delete those expenses before deleting the category.',
                'category',
            );
        }

        if ($this->recurringExpenseRepository->hasCategory($category)) {
            throw new DataConflictException(
                'This category is used by recurring expenses. Change or delete those recurring expenses before deleting the category.',
                'category',
            );
        }

        if ($this->categoryRuleRepository->hasCategory($category)) {
            throw new DataConflictException(
                'This category has category rules. Remove those rules before deleting the category.',
                'category',
            );
        }
    }

    private function assertDefinedByUser(Category $category): void
    {
        if (!$category->isDefinedByUser()) {
            throw new AccessDeniedException();
        }
    }
}
