<?php

declare(strict_types=1);

namespace App\Controller\Finance;

use App\Controller\AbstractApiController;
use App\Entity\Calendar;
use App\Entity\User;
use App\Repository\CalendarRepository;
use App\Request\Calendar\CreateCalendarRequest;
use App\Request\Calendar\UpdateCalendarRequest;
use App\Response\EntityResponse;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;

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
        $calendars = $this->calendarRepository->findAll();

        return $this->respond(
            new EntityResponse($calendars)
        );
    }

    #[Route('/{calendar}', name: 'get', methods: Request::METHOD_GET)]
    public function get(Calendar $calendar): JsonResponse
    {
        return $this->respond(
            new EntityResponse($calendar)
        );
    }

    #[Route('', name: 'create', methods: Request::METHOD_POST)]
    public function create(CreateCalendarRequest $request): JsonResponse
    {
        /** @var User $user */
        $user = $this->getUser();

        $calendar = (new Calendar())
            ->setName($request->getName())
            ->addUser($user)
        ;

        foreach ($request->getUsers() as $user) {
            $calendar->addUser($user);
        }

        $this->calendarRepository->save($calendar, true);

        return $this->respond(
            new EntityResponse($calendar)
        );
    }

    #[Route('/{calendar}', name: 'update', methods: Request::METHOD_PUT)]
    public function update(Calendar $calendar, CreateCalendarRequest $request): JsonResponse
    {
        /** @var User $user */
        $user = $this->getUser();

        $calendar
            ->setName($request->getName())
            ->addUser($user)
        ;

        foreach ($request->getUsers() as $user) {
            $calendar->addUser($user);
        }

        $this->calendarRepository->save($calendar, true);

        return $this->respond(
            new EntityResponse($calendar)
        );
    }

    #[Route('/{calendar}', name: 'remove', methods: Request::METHOD_DELETE)]
    public function remove(Calendar $calendar): JsonResponse
    {
        $this->calendarRepository->remove($calendar, true);

        return $this->respond(
            new EntityResponse($this->calendarRepository->findAll())
        );
    }
}
