<?php

declare(strict_types=1);

namespace App\Controller\Finance;

use App\Const\ContextGroup\ExpenseContextGroupConst;
use App\Const\ContextGroup\UserContextGroupConst;
use App\Const\ContextGroupConst;
use App\Controller\AbstractApiController;
use App\Entity\Calendar;
use App\Entity\Expense;
use App\Entity\User;
use App\Repository\CalendarRepository;
use App\Repository\ExpenseRepository;
use App\Request\Expense\CreateExpenseRequest;
use App\Request\Expense\UpdateExpenseRequest;
use DateTime;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Security\Core\Security;

#[Route('expense', name: 'expense_')]
class ExpenseController extends AbstractApiController
{
    public function __construct(
        private ExpenseRepository $expenseRepository
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

    #[Route('', name: 'create', methods: Request::METHOD_POST)]
    public function create(CreateExpenseRequest $request, CalendarRepository $calendarRepository): JsonResponse
    {
        /** @var User $user */
        $user = $this->getUser(); // TODO: maybe use #[CurrentUser]

        $calendar = $calendarRepository->find(22);

        $expense = (new Expense())
            ->setCalendar($calendar)
            ->setUser($user)
            ->setLabel($request->getLabel())
            ->setAmount($request->getAmount())
            ->setCreatedAt($request->getCreatedAt())
        ;

        $this->expenseRepository->save($expense, true);

        return $this->respond($expense);
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

        return $this->respond($expense);
    }

    #[Route('/{calendar}/{expense}', name: 'delete', methods: Request::METHOD_DELETE)]
    public function delete(Calendar $calendar, Expense $expense): JsonResponse
    {
        $this->expenseRepository->remove($expense, true);

        return $this->respond('');
    }
}
