<?php

declare(strict_types=1);

namespace App\Service;

use App\Const\StringConst;
use App\Entity\Expense;
use App\Entity\User;
use App\Enum\CategoryType;
use App\Repository\CategoryRepository;
use App\Repository\ExpenseRepository;
use App\Request\BalanceUpdate\CreateBalanceUpdateRequest;
use App\Request\BalanceUpdate\UpdateBalanceUpdateRequest;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;

readonly class BalanceUpdateService
{
    public function __construct(
        private ExpenseRepository $expenseRepository,
        private CategoryRepository $categoryRepository,
        private BalanceCalculatorService $balanceCalculatorService,
    ) {
    }

    public function create(User $user, CreateBalanceUpdateRequest $request): Expense
    {
        $balanceUpdate = (new Expense())
            ->setCalendar($request->getCalendar())
            ->setCategory($this->categoryRepository->getBalanceCategory())
            ->setLabel(StringConst::BALANCE_UPDATE_LABEL)
            ->setUser($user)
            ->setAmount($this->calculateAmount($request))
            ->setCreatedAt($request->getCreatedAt())
            ->setConfirmed(true)
            ->setDescription($request->getDescription())
        ;

        $this->expenseRepository->save($balanceUpdate);

        return $balanceUpdate;
    }

    public function update(Expense $balanceUpdate, UpdateBalanceUpdateRequest $request): Expense
    {
        $this->assertBalanceUpdate($balanceUpdate);

        $balanceUpdate
            ->setCalendar($request->getCalendar())
            ->setAmount($this->calculateAmount($request, $balanceUpdate))
            ->setCreatedAt($request->getCreatedAt())
            ->setDescription($request->getDescription())
        ;

        $this->expenseRepository->save($balanceUpdate);

        return $balanceUpdate;
    }

    public function remove(Expense $balanceUpdate): void
    {
        $this->assertBalanceUpdate($balanceUpdate);

        $this->expenseRepository->remove($balanceUpdate);
    }

    private function calculateAmount(CreateBalanceUpdateRequest $request, ?Expense $excludedExpense = null): float
    {
        return $this->balanceCalculatorService->calculateAmount(
            $request->getAmount(),
            $request->getCreatedAt(),
            $request->getCalendar(),
            $excludedExpense
        );
    }

    private function assertBalanceUpdate(Expense $expense): void
    {
        if ($expense->getCategory()->getType() !== CategoryType::BALANCE_UPDATE) {
            throw new NotFoundHttpException('Balance update not found.');
        }
    }
}
