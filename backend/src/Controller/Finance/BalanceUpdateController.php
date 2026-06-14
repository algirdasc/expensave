<?php

declare(strict_types=1);

namespace App\Controller\Finance;

use App\Const\ContextGroup\ExpenseContextGroupConst;
use App\Controller\AbstractApiController;
use App\Entity\Expense;
use App\Entity\User;
use App\Request\BalanceUpdate\CreateBalanceUpdateRequest;
use App\Request\BalanceUpdate\UpdateBalanceUpdateRequest;
use App\Response\EmptyResponse;
use App\Security\Voters\CalendarVoter;
use App\Security\Voters\ExpenseVoter;
use App\Service\BalanceUpdateService;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Security\Http\Attribute\CurrentUser;

#[Route('api/balance-update', name: 'balance_update_')]
class BalanceUpdateController extends AbstractApiController
{
    public function __construct(
        private readonly BalanceUpdateService $balanceUpdateService,
    ) {
    }

    #[Route('', name: 'create', methods: Request::METHOD_POST)]
    public function create(#[CurrentUser] User $user, CreateBalanceUpdateRequest $request): JsonResponse
    {
        $this->denyAccessUnlessGranted(CalendarVoter::ADD_EXPENSE, $request->getCalendar());

        $balanceUpdate = $this->balanceUpdateService->create($user, $request);

        return $this->respond($balanceUpdate, groups: ExpenseContextGroupConst::DETAILS);
    }

    #[Route('/{balanceUpdate}', name: 'update', methods: Request::METHOD_PUT)]
    public function update(UpdateBalanceUpdateRequest $request, Expense $balanceUpdate): JsonResponse
    {
        $this->denyAccessUnlessGranted(ExpenseVoter::EDIT, $balanceUpdate);
        $this->denyAccessUnlessGranted(CalendarVoter::ADD_EXPENSE, $request->getCalendar());

        $balanceUpdate = $this->balanceUpdateService->update($balanceUpdate, $request);

        return $this->respond($balanceUpdate, groups: ExpenseContextGroupConst::DETAILS);
    }

    #[Route('/{balanceUpdate}', name: 'delete', methods: Request::METHOD_DELETE)]
    public function delete(Expense $balanceUpdate): JsonResponse
    {
        $this->denyAccessUnlessGranted(ExpenseVoter::DELETE, $balanceUpdate);

        $this->balanceUpdateService->remove($balanceUpdate);

        return $this->respond(new EmptyResponse());
    }
}
