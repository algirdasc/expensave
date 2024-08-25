<?php

declare(strict_types=1);

namespace App\Service\Statement\Import;

use App\DTO\Statement\Import\StatementImportRowInterface;
use App\Entity\Calendar;
use App\Entity\Category;
use App\Entity\Expense;
use App\Entity\User;
use App\Enum\CategoryType;
use App\Repository\CategoryRepository;
use App\Repository\CategoryRuleRepository;
use App\Repository\ExpenseRepository;
use Symfony\Bundle\SecurityBundle\Security;

readonly class ImporterService
{
    public function __construct(
        private CategoryRepository $categoryRepository,
        private ExpenseRepository $expenseRepository,
        private CategoryRuleRepository $categoryRuleRepository,
        private Security $security
    ) {
    }

    public function import(StatementImportRowInterface $row, Calendar $calendar): ?Expense
    {
        $expense = $this->expenseRepository->findByCalendarAndStatementRow($calendar, $row);
        if ($expense !== null) {
            return null;
        }

        /** @var User $user */
        $user = $this->security->getUser();

        if ($row->getCategoryName() !== null) {
            $category = $this->categoryRepository->findOrCreate($row->getCategoryName());
        } else {
            $category = $this->categoryRuleRepository->match($row->getLabel());
        }

        if ($category === null) {
            $category = $this->expenseRepository->findUserSuggestion($user, $row->getLabel())?->getCategory();
        }

        if ($category === null) {
            /** @var Category $category */
            $category = $this->categoryRepository->findOneBy(['type' => CategoryType::UNCATEGORIZED]);
        }

        return (new Expense())
            ->setCalendar($calendar)
            ->setCategory($category)
            ->setCreatedAt($row->getCreatedAt())
            ->setConfirmed($row->isConfirmed())
            ->setLabel($row->getLabel())
            ->setAmount($row->getAmount())
            ->setDescription($row->getDescription())
            ->setUser($user);
    }
}
