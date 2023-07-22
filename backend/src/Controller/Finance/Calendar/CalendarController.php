<?php

declare(strict_types=1);

namespace App\Controller\Finance\Calendar;

use App\Const\ContextGroup\CalendarContextGroupConst;
use App\Controller\AbstractApiController;
use App\Entity\Calendar;
use App\Entity\User;
use App\Repository\CalendarRepository;
use App\Request\Calendar\CreateCalendarRequest;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Security\Http\Attribute\CurrentUser;

#[Route('calendar', name: 'calendar_')]
class CalendarController extends AbstractApiController
{
    public function __construct(
        private readonly CalendarRepository $calendarRepository
    ) {
    }

    #[Route('', name: 'list', methods: Request::METHOD_GET)]
    public function list(): JsonResponse
    {
        return $this->respond($this->calendarRepository->findAll());
    }

    #[Route('/{calendar}', name: 'get', methods: Request::METHOD_GET)]
    public function get(Calendar $calendar): JsonResponse
    {
        return $this->respond($calendar, groups: CalendarContextGroupConst::DETAILS);
    }

    #[Route('', name: 'create', methods: Request::METHOD_POST)]
    public function create(#[CurrentUser] User $user, CreateCalendarRequest $request): JsonResponse
    {
        $calendar = (new Calendar())
            ->setName($request->getName())
            ->addUser($user)
        ;

        foreach ($request->getUsers() as $user) {
            $calendar->addUser($user);
        }

        $this->calendarRepository->save($calendar, true);

        return $this->respond($calendar, groups: CalendarContextGroupConst::DETAILS);
    }

    #[Route('/{calendar}', name: 'update', methods: Request::METHOD_PUT)]
    public function update(#[CurrentUser] User $user, Calendar $calendar, CreateCalendarRequest $request): JsonResponse
    {
        $calendar
            ->setName($request->getName())
            ->addUser($user)
        ;

        foreach ($request->getUsers() as $user) {
            $calendar->addUser($user);
        }

        $this->calendarRepository->save($calendar, true);

        return $this->respond($calendar, groups: CalendarContextGroupConst::DETAILS);
    }

    #[Route('/{calendar}', name: 'remove', methods: Request::METHOD_DELETE)]
    public function remove(Calendar $calendar): JsonResponse
    {
        $this->calendarRepository->remove($calendar, true);

        return $this->respond($this->calendarRepository->findAll());
    }
}