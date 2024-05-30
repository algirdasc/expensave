<?php

declare(strict_types=1);

namespace App\Service\Report;

use App\DTO\Report\CategoryBalance;
use App\Entity\Calendar;
use App\Entity\Expense;
use App\Factory\CategoryBalanceFactory;
use App\Repository\CategoryRepository;
use App\Repository\ExpenseRepository;
use DateTime;
use Doctrine\Common\Collections\ArrayCollection;

readonly class CategoryExpenseReportService extends AbstractReportService
{
    public function __construct(
        private ExpenseRepository $expenseRepository,
        private CategoryRepository $categoryRepository,
    ) {
    }

    /**
     * @param array<Calendar> $calendars
     *
     * @return array<CategoryBalance>
     */
    public function generate(array $calendars, DateTime $dateFrom, DateTime $dateTo): array
    {
        $categoriesBalances = [];

        /** @var ArrayCollection<array-key, Expense> $expenses */
        $expenses = new ArrayCollection($this->expenseRepository->findByCalendarsAndInterval($calendars, $dateFrom, $dateTo));
        $categories = $this->categoryRepository->findBy([], ['name' => 'ASC']);

        foreach ($categories as $category) {
            $categoryExpenses = $expenses
                ->filter(function (Expense $expense) use ($category) {
                    return $expense->isConfirmed() && $expense->getCategory()?->getId() === $category->getId();
                });

            $categoriesBalances[] = CategoryBalanceFactory::createFromExpenseArray($category, $categoryExpenses->toArray());
        }



        return $categoriesBalances;
    }
}