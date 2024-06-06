<?php

declare(strict_types=1);

namespace App\Controller\Finance\Calendar;

use App\Const\ContextGroup\ExpenseContextGroupConst;
use App\Const\StringConst;
use App\Controller\AbstractApiController;
use App\Entity\Expense;
use App\Entity\User;
use App\Repository\CategoryRepository;
use App\Repository\ExpenseRepository;
use App\Request\Balance\CreateBalanceRequest;
use App\Request\Balance\UpdateBalanceRequest;
use App\Response\EmptyResponse;
use App\Service\BalanceCalculatorService;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Security\Http\Attribute\CurrentUser;

#[Route('api/balance', name: 'balance_')]
class BalanceController extends AbstractApiController
{
    public function __construct(
        private readonly ExpenseRepository $expenseRepository,
        private readonly CategoryRepository $categoryRepository,
        private readonly BalanceCalculatorService $balanceCalculatorService,
    ) {
    }

    #[Route('', name: 'create', methods: Request::METHOD_POST)]
    public function create(#[CurrentUser] User $user, CreateBalanceRequest $request): JsonResponse
    {
        $balanceCategory = $this->categoryRepository->findBalanceCategory();

        $amount = $this->balanceCalculatorService->calculateAmount(
            $request->getAmount(),
            $request->getCreatedAt(),
            $request->getCalendar()
        );

        $balance = (new Expense())
            ->setCalendar($request->getCalendar())
            ->setCategory($balanceCategory)
            ->setLabel(StringConst::BALANCE_UPDATE_LABEL)
            ->setUser($user)
            ->setAmount($amount)
            ->setCreatedAt($request->getCreatedAt())
            ->setConfirmed(true)
            ->setDescription($request->getDescription())
        ;

        $this->expenseRepository->save($balance);

        return $this->respond($balance, groups: ExpenseContextGroupConst::DETAILS);
    }

    #[Route('/{balance}', name: 'update', methods: Request::METHOD_PUT)]
    public function update(UpdateBalanceRequest $request, Expense $balance): JsonResponse
    {
        $amount = $this->balanceCalculatorService->calculateAmount(
            $request->getAmount(),
            $request->getCreatedAt(),
            $request->getCalendar()
        );

        $balance
            ->setCalendar($request->getCalendar())
            ->setAmount($amount)
            ->setCreatedAt($request->getCreatedAt())
            ->setDescription($request->getDescription())
        ;

        $this->expenseRepository->save($balance);

        return $this->respond($balance, groups: ExpenseContextGroupConst::DETAILS);
    }

    #[Route('/{balance}', name: 'delete', methods: Request::METHOD_DELETE)]
    public function delete(Expense $balance): JsonResponse
    {
        $this->expenseRepository->remove($balance);

        return $this->respond(new EmptyResponse());
    }
}