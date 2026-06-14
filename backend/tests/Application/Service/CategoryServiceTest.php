<?php

declare(strict_types=1);

namespace App\Tests\Application\Service;

use App\Entity\Category;
use App\Exception\DataConflictException;
use App\Repository\CategoryRepository;
use App\Repository\CategoryRuleRepository;
use App\Repository\ExpenseRepository;
use App\Repository\RecurringExpenseRepository;
use App\Service\CategoryService;
use PHPUnit\Framework\Attributes\CoversClass;
use PHPUnit\Framework\TestCase;

#[CoversClass(CategoryService::class)]
class CategoryServiceTest extends TestCase
{
    private CategoryRepository $categoryRepository;
    private ExpenseRepository $expenseRepository;
    private RecurringExpenseRepository $recurringExpenseRepository;
    private CategoryRuleRepository $categoryRuleRepository;
    private CategoryService $categoryService;

    protected function setUp(): void
    {
        $this->categoryRepository = $this->createMock(CategoryRepository::class);
        $this->expenseRepository = $this->createMock(ExpenseRepository::class);
        $this->recurringExpenseRepository = $this->createMock(RecurringExpenseRepository::class);
        $this->categoryRuleRepository = $this->createMock(CategoryRuleRepository::class);
        $this->categoryService = new CategoryService(
            $this->categoryRepository,
            $this->expenseRepository,
            $this->recurringExpenseRepository,
            $this->categoryRuleRepository,
        );
    }

    public function testRemoveDeletesCategoryWhenItHasNoDependants(): void
    {
        $category = new Category();

        $this->expenseRepository->method('hasCategory')->with($category)->willReturn(false);
        $this->recurringExpenseRepository->method('hasCategory')->with($category)->willReturn(false);
        $this->categoryRuleRepository->method('hasCategory')->with($category)->willReturn(false);
        $this->categoryRepository
            ->expects($this->once())
            ->method('remove')
            ->with($category);

        $this->categoryService->remove($category);
    }

    public function testRemoveThrowsFriendlyConflictWhenCategoryHasExpenses(): void
    {
        $category = new Category();

        $this->expenseRepository->method('hasCategory')->with($category)->willReturn(true);
        $this->recurringExpenseRepository->expects($this->never())->method('hasCategory');
        $this->categoryRuleRepository->expects($this->never())->method('hasCategory');
        $this->categoryRepository->expects($this->never())->method('remove');

        $this->expectException(DataConflictException::class);
        $this->expectExceptionMessage(
            'This category is used by existing expenses. Move or delete those expenses before deleting the category.'
        );

        $this->categoryService->remove($category);
    }

    public function testRemoveThrowsFriendlyConflictWhenCategoryHasRecurringExpenses(): void
    {
        $category = new Category();

        $this->expenseRepository->method('hasCategory')->with($category)->willReturn(false);
        $this->recurringExpenseRepository->method('hasCategory')->with($category)->willReturn(true);
        $this->categoryRuleRepository->expects($this->never())->method('hasCategory');
        $this->categoryRepository->expects($this->never())->method('remove');

        $this->expectException(DataConflictException::class);
        $this->expectExceptionMessage(
            'This category is used by recurring expenses. Change or delete those recurring expenses before deleting the category.'
        );

        $this->categoryService->remove($category);
    }

    public function testRemoveThrowsFriendlyConflictWhenCategoryHasRules(): void
    {
        $category = new Category();

        $this->expenseRepository->method('hasCategory')->with($category)->willReturn(false);
        $this->recurringExpenseRepository->method('hasCategory')->with($category)->willReturn(false);
        $this->categoryRuleRepository->method('hasCategory')->with($category)->willReturn(true);
        $this->categoryRepository->expects($this->never())->method('remove');

        $this->expectException(DataConflictException::class);
        $this->expectExceptionMessage(
            'This category has category rules. Remove those rules before deleting the category.'
        );

        $this->categoryService->remove($category);
    }
}
