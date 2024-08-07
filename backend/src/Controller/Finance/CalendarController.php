<?php

declare(strict_types=1);

namespace App\Controller\Finance;

use App\Const\ContextGroup\CalendarContextGroupConst;
use App\Controller\AbstractApiController;
use App\Entity\Calendar;
use App\Entity\User;
use App\Enum\CalendarPermission;
use App\Helper\DateHelper;
use App\Repository\CalendarRepository;
use App\Repository\ExpenseRepository;
use App\Request\Calendar\CreateCalendarRequest;
use App\Request\Calendar\UpdateCalendarRequest;
use App\Response\EmptyResponse;
use App\Response\Statement\ExpenseListResponse;
use App\Security\Voters\CalendarVoter;
use App\Service\Report\DailyExpenseReportService;
use DateTime;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Security\Http\Attribute\CurrentUser;

#[Route('api/calendar', name: 'calendar_')]
class CalendarController extends AbstractApiController
{
    public function __construct(
        private readonly CalendarRepository        $calendarRepository,
        private readonly ExpenseRepository         $expenseRepository,
        private readonly DailyExpenseReportService $cashFlowReportService,
    ) {
    }

    #[Route('', name: 'list', methods: Request::METHOD_GET)]
    public function list(#[CurrentUser] User $user): JsonResponse
    {
        return $this->respond($this->calendarRepository->findAllByUser($user));
    }

    #[Route('/{calendar}', name: 'get', methods: Request::METHOD_GET)]
    public function get(Calendar $calendar): JsonResponse
    {
        $this->denyAccessUnlessGranted(CalendarVoter::VIEW, $calendar);

        return $this->respond($calendar, groups: CalendarContextGroupConst::DETAILS);
    }

    #[Route('/{calendar}/expenses/{dateFrom}/{dateTo}', name: 'expenses', methods: Request::METHOD_GET)]
    public function expenses(Calendar $calendar, DateTime $dateFrom, DateTime $dateTo): JsonResponse
    {
        $this->denyAccessUnlessGranted(CalendarVoter::VIEW, $calendar);

        DateHelper::setRange($dateFrom, $dateTo);

        $expenses = $this->expenseRepository->findByCalendarsAndInterval([$calendar], $dateFrom, $dateTo);
        $expensesBalances = $this->cashFlowReportService->generate([$calendar], $dateFrom, $dateTo);

        return $this->respond(
            new ExpenseListResponse(
                expenses: $expenses,
                expenseBalances: $expensesBalances,
                calendar: $calendar,
            )
        );
    }

    #[Route('', name: 'create', methods: Request::METHOD_POST)]
    public function create(#[CurrentUser] User $user, CreateCalendarRequest $request): JsonResponse
    {
        $calendar = (new Calendar($request->getName(), $user))
            ->setCollaborators($request->getCollaborators())
            ;

        $this->calendarRepository->save($calendar);

        return $this->respond($calendar, groups: CalendarContextGroupConst::DETAILS);
    }

    #[Route('/{calendar}', name: 'update', methods: Request::METHOD_PUT)]
    public function update(#[CurrentUser] User $user, Calendar $calendar, UpdateCalendarRequest $request): JsonResponse
    {
        $this->denyAccessUnlessGranted(CalendarVoter::EDIT, $calendar);

        $calendar
            ->setName($request->getName())
            ->setCollaborators($request->getCollaborators())
        ;

        $this->calendarRepository->save($calendar);

        return $this->respond($calendar, groups: CalendarContextGroupConst::DETAILS);
    }

    #[Route('/{calendar}', name: 'remove', methods: Request::METHOD_DELETE)]
    public function remove(Calendar $calendar): JsonResponse
    {
        $this->denyAccessUnlessGranted(CalendarVoter::DELETE, $calendar);

        $this->calendarRepository->remove($calendar);

        return $this->respond(new EmptyResponse());
    }
}
