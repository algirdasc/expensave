<?php

declare(strict_types=1);

namespace App\Controller\Finance\Calendar;

use App\Const\ContextGroup\ExpenseContextGroupConst;
use App\Controller\AbstractApiController;
use App\Entity\Calendar;
use App\Entity\Expense;
use App\Entity\User;
use App\Repository\CalendarRepository;
use App\Repository\ExpenseRepository;
use App\Request\Expense\CreateExpenseRequest;
use App\Request\Expense\UpdateExpenseRequest;
use App\Response\EmptyResponse;
use DateTime;
use PHPUnit\Util\Json;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Security\Http\Attribute\CurrentUser;

#[Route('expense', name: 'expense_')]
class ExpenseController extends AbstractApiController
{
    public function __construct(
        private readonly ExpenseRepository $expenseRepository
    ) {
    }

    #[Route('/{calendar}/{fromTs}/{toTs}', name: 'list', methods: Request::METHOD_GET)]
    public function list(Calendar $calendar, int $fromTs, int $toTs): JsonResponse
    {
        $expenses = $this->expenseRepository->findByCalendarAndInterval(
            $calendar,
            (new DateTime())->setTimestamp($fromTs),
            (new DateTime())->setTimestamp($toTs)
        );

        return $this->respond($expenses);
    }

    #[Route('/{id}', name: 'get', methods: Request::METHOD_GET)]
    public function get(Expense $expense): JsonResponse
    {
        return $this->respond($expense, groups: ExpenseContextGroupConst::DETAILS);
    }

    #[Route('', name: 'create', methods: Request::METHOD_POST)]
    public function create(#[CurrentUser] User $user, CreateExpenseRequest $request): JsonResponse
    {
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

        $this->expenseRepository->save($expense, true);

        return $this->respond($expense, groups: ExpenseContextGroupConst::DETAILS);
    }

    #[Route('/{expense}', name: 'update', methods: Request::METHOD_PUT)]
    public function update(UpdateExpenseRequest $request, Expense $expense): JsonResponse
    {
        $expense
            ->setConfirmed($request->isConfirmed())
            ->setLabel($request->getLabel())
            ->setAmount($request->getAmount())
            ->setCreatedAt($request->getCreatedAt())
        ;

        $this->expenseRepository->save($expense, true);

        return $this->respond($expense, groups: ExpenseContextGroupConst::DETAILS);
    }

    #[Route('/{calendar}/{expense}', name: 'delete', methods: Request::METHOD_DELETE)]
    public function delete(Calendar $calendar, Expense $expense): JsonResponse
    {
        $this->expenseRepository->remove($expense, true);

        return $this->respond(new EmptyResponse());
    }
}
