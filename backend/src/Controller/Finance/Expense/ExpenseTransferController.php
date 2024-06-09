<?php

declare(strict_types=1);

namespace App\Controller\Finance\Expense;

use App\Const\ContextGroup\ExpenseContextGroupConst;
use App\Const\StringConst;
use App\Controller\AbstractApiController;
use App\Entity\Calendar;
use App\Entity\Expense;
use App\Entity\User;
use App\Repository\CategoryRepository;
use App\Repository\ExpenseRepository;
use App\Request\ExpenseTransfer\CreateExpenseTransferRequest;
use App\Request\ExpenseTransfer\UpdateExpenseTransferRequest;
use App\Response\EmptyResponse;
use InvalidArgumentException;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Security\Http\Attribute\CurrentUser;

#[Route('api/expense-transfer', name: 'expense_transfer_')]
class ExpenseTransferController extends AbstractApiController
{
    public function __construct(
        private readonly ExpenseRepository $expenseRepository,
        private readonly CategoryRepository $categoryRepository,
    ) {
    }

    #[Route('/{destinationCalendar}', name: 'create', methods: Request::METHOD_POST)]
    public function create(#[CurrentUser] User $user, Calendar $destinationCalendar, CreateExpenseTransferRequest $request): JsonResponse
    {
        $transferFrom = (new Expense())
            ->setCalendar($request->getCalendar())
            ->setCategory($this->categoryRepository->findTransferCategory())
            ->setLabel(StringConst::TRANSFER_LABEL)
            ->setAmount($request->getAmount())
            ->setCreatedAt($request->getCreatedAt())
            ->setConfirmed(true)
            ->setDescription($request->getDescription())
            ->setUser($user);

        $transferTo = clone $transferFrom;
        $transferTo
            ->setAmount(-1 * $transferTo->getAmount())
            ->setCalendar($destinationCalendar)
            ->setRelated($transferFrom);

        $transferFrom->setRelated($transferTo);

        $this->expenseRepository->save($transferFrom);
        $this->expenseRepository->save($transferTo);

        return $this->respond($transferFrom, groups: ExpenseContextGroupConst::DETAILS);
    }

    #[Route('/{calendar}/{expenseTransfer}', name: 'update', methods: Request::METHOD_PUT)]
    public function update(UpdateExpenseTransferRequest $request, Calendar $calendar, Expense $expenseTransfer): JsonResponse
    {
        $relatedExpense = $expenseTransfer->getRelated();
        if ($relatedExpense === null) {
            throw new InvalidArgumentException('Related expense is not found');
        }

        $expenseTransfer->setAmount($request->getAmount());
        $relatedExpense->setAmount(-1 * $request->getAmount());

        foreach ([$expenseTransfer, $relatedExpense] as $expense) {
            $expense
                ->setCreatedAt($request->getCreatedAt())
                ->setDescription($request->getDescription());

            $this->expenseRepository->save($expense);
        }

        return $this->respond($expenseTransfer, groups: ExpenseContextGroupConst::DETAILS);
    }

    #[Route('/{expenseTransfer}', name: 'delete', methods: Request::METHOD_DELETE)]
    public function delete(Expense $expenseTransfer): JsonResponse
    {
        $related = $expenseTransfer->getRelated();

        $expenseTransfer->setRelated(null);
        $this->expenseRepository->save($expenseTransfer);

        if ($related !== null) {
            $related->setRelated(null);
            $this->expenseRepository->save($related);
            $this->expenseRepository->remove($related);
        }

        $this->expenseRepository->remove($expenseTransfer);

        return $this->respond(new EmptyResponse());
    }
}