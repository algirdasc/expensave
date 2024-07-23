<?php

declare(strict_types=1);

namespace App\Controller\Finance\Expense;

use App\Const\ContextGroup\ExpenseContextGroupConst;
use App\Controller\AbstractApiController;
use App\Entity\Expense;
use App\Entity\User;
use App\Enum\CalendarPermission;
use App\Enum\ExpensePermission;
use App\Repository\ExpenseRepository;
use App\Request\Expense\CreateExpenseRequest;
use App\Request\Expense\SuggestRequest;
use App\Request\Expense\UpdateExpenseRequest;
use App\Response\EmptyResponse;
use App\Security\Voters\CalendarVoter;
use App\Security\Voters\ExpenseVoter;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Security\Http\Attribute\CurrentUser;
use Symfony\Component\Security\Http\Attribute\IsGranted;

#[Route('api/expense', name: 'expense_')]
class ExpenseController extends AbstractApiController
{
    public function __construct(
        private readonly ExpenseRepository $expenseRepository,
    ) {
    }

    #[Route('/{expense}', name: 'get', methods: Request::METHOD_GET)]
    public function get(Expense $expense): JsonResponse
    {
        $this->denyAccessUnlessGranted(ExpenseVoter::VIEW, $expense);

        return $this->respond($expense, groups: ExpenseContextGroupConst::DETAILS);
    }

    #[Route('', name: 'create', methods: Request::METHOD_POST)]
    public function create(#[CurrentUser] User $user, CreateExpenseRequest $request): JsonResponse
    {
        $this->denyAccessUnlessGranted(CalendarVoter::ADD_EXPENSE, $request->getCalendar());

        $expense = (new Expense())
            ->setCalendar($request->getCalendar())
            ->setCategory($request->getCategory())
            ->setUser($user)
            ->setLabel($request->getLabel())
            ->setAmount($request->getAmount())
            ->setCreatedAt($request->getCreatedAt())
            ->setConfirmed($request->isConfirmed())
            ->setDescription($request->getDescription())
        ;

        $this->expenseRepository->save($expense);

        return $this->respond($expense, groups: ExpenseContextGroupConst::DETAILS);
    }

    #[Route('/{expense}', name: 'update', methods: Request::METHOD_PUT)]
    public function update(UpdateExpenseRequest $request, Expense $expense): JsonResponse
    {
        $this->denyAccessUnlessGranted(ExpenseVoter::EDIT, $expense);
        $this->denyAccessUnlessGranted(CalendarVoter::ADD_EXPENSE, $request->getCalendar());

        $expense
            ->setCalendar($request->getCalendar())
            ->setCategory($request->getCategory())
            ->setLabel($request->getLabel())
            ->setAmount($request->getAmount())
            ->setCreatedAt($request->getCreatedAt())
            ->setConfirmed($request->isConfirmed())
            ->setDescription($request->getDescription())
        ;

        $this->expenseRepository->save($expense);

        return $this->respond($expense, groups: ExpenseContextGroupConst::DETAILS);
    }

    #[Route('/{expense}', name: 'delete', methods: Request::METHOD_DELETE)]
    public function delete(Expense $expense): JsonResponse
    {
        $this->denyAccessUnlessGranted(ExpenseVoter::DELETE, $expense);

        $this->expenseRepository->remove($expense);

        return $this->respond(new EmptyResponse());
    }

    #[Route('/suggest', name: 'suggest', methods: Request::METHOD_POST)]
    public function suggest(#[CurrentUser] User $user, SuggestRequest $request): JsonResponse
    {
        $suggestedExpense = $this->expenseRepository->findUserSuggestion($user, $request->getLabel());

        return $this->respond($suggestedExpense);
    }
}
