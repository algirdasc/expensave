<?php

declare(strict_types=1);

namespace App\Service\Statement\Import;

use App\Entity\Calendar;
use App\Entity\Expense;
use App\Entity\Statement\Import\StatementImportRowInterface;
use App\Entity\User;
use App\Exception\StatementImportException;
use App\Repository\CalendarRepository;
use App\Repository\CategoryRuleRepository;
use App\Repository\ExpenseRepository;
use Symfony\Bundle\SecurityBundle\Security;

class ImporterService
{
    private User $user;

    public function __construct(
        private readonly CalendarRepository     $calendarRepository,
        private readonly ExpenseRepository      $expenseRepository,
        private readonly CategoryRuleRepository $categoryRuleRepository,
        private readonly Security               $security
    ) {
        $user = $this->security->getUser();
        if ($user instanceof User) {
            $this->user = $user;
        }
    }

    public function import(StatementImportRowInterface $row, Calendar $defaultCalendar): void
    {
        $calendar = $defaultCalendar;
        if ($row->getIdentification() !== null) {
            $calendar = $this->calendarRepository->findByIdentification($row->getIdentification()) ?? $defaultCalendar;
        }

        $expense = ($this->expenseRepository->findByStatementHash($row->getStatementHash()) ?? new Expense())
            ->setCalendar($calendar)
            ->setCategory($this->categoryRuleRepository->match($row->getLabel()))
            ->setStatementHash($row->getStatementHash())
            ->setCreatedAt($row->getCreatedAt())
            ->setConfirmed($row->isConfirmed())
            ->setLabel($row->getLabel())
            ->setAmount($row->getAmount())
            ->setUser($this->user)
        ;

        $this->expenseRepository->save($expense);
    }
}
