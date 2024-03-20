<?php

declare(strict_types=1);

namespace App\Service\Statement\Import;

use App\DTO\Statement\Import\StatementImportRowInterface;
use App\Entity\Calendar;
use App\Entity\Expense;
use App\Entity\User;
use App\Repository\CalendarRepository;
use App\Repository\CategoryRepository;
use App\Repository\CategoryRuleRepository;
use App\Repository\ExpenseRepository;
use Symfony\Bundle\SecurityBundle\Security;

readonly class ImporterService
{
    public function __construct(
        private CalendarRepository     $calendarRepository,
        private CategoryRepository $categoryRepository,
        private ExpenseRepository      $expenseRepository,
        private CategoryRuleRepository $categoryRuleRepository,
        private Security               $security
    ) {
    }

    public function import(StatementImportRowInterface $row, Calendar $defaultCalendar): void
    {
        /** @var User $user */
        $user = $this->security->getUser();

        $calendar = $defaultCalendar;
        if ($row->getIdentification() !== null) {
            $calendar = $this->calendarRepository->findByIdentification($row->getIdentification()) ?? $defaultCalendar;
        }

        if ($row->getCategoryName() !== null) {
            $category = $this->categoryRepository->findOrCreate($row->getCategoryName());
        } else {
            $category = $this->categoryRuleRepository->match($row->getLabel());
        }

        $expense = ($this->expenseRepository->findByStatementHash($row->getStatementHash()) ?? new Expense())
            ->setCalendar($calendar)
            ->setCategory($category)
            ->setStatementHash($row->getStatementHash())
            ->setCreatedAt($row->getCreatedAt())
            ->setConfirmed($row->isConfirmed())
            ->setLabel($row->getLabel())
            ->setAmount($row->getAmount())
            ->setDescription($row->getDescription())
            ->setUser($user)
        ;

        $this->expenseRepository->save($expense);
    }
}
