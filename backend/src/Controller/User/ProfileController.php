<?php

declare(strict_types=1);

namespace App\Controller\User;

use App\Const\AssertConst;
use App\Const\ContextGroup\UserContextGroupConst;
use App\Controller\AbstractApiController;
use App\Entity\Calendar;
use App\Entity\User;
use App\Exception\RequestValidationException;
use App\Repository\UserRepository;
use App\Request\User\PasswordChangeRequest;
use App\Security\Voters\CalendarVoter;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Security\Http\Attribute\CurrentUser;
use Symfony\Component\Validator\ConstraintViolationList;

#[Route('api/user', name: 'user_')]
class ProfileController extends AbstractApiController
{
    public function __construct(
        private readonly UserRepository $userRepository,
        private readonly UserPasswordHasherInterface $passwordHasher,
    ) {
    }

    #[Route('', methods: Request::METHOD_GET)]
    public function list(): JsonResponse
    {
        return $this->respond($this->userRepository->findBy([], ['name' => 'ASC']));
    }

    #[Route('/profile', methods: Request::METHOD_GET)]
    public function profile(#[CurrentUser] User $user): JsonResponse
    {
        return $this->respond($user, groups: UserContextGroupConst::DETAILS);
    }

    #[Route('/change-password', methods: Request::METHOD_PUT)]
    public function changePassword(#[CurrentUser] User $user, PasswordChangeRequest $request): JsonResponse
    {
        if (!$this->passwordHasher->isPasswordValid($user, $request->getCurrentPassword())) {
            throw new RequestValidationException(
                ConstraintViolationList::createFromMessage(AssertConst::MSG_PASSWORD_INVALID)
            );
        }

        $user->setPlainPassword($request->getNewPassword());

        $this->userRepository->save($user);

        return $this->respond($user, groups: UserContextGroupConst::DETAILS);
    }

    #[Route('/default-calendar/{calendar}', methods: Request::METHOD_PUT)]
    public function defaultCalendar(#[CurrentUser] User $user, Calendar $calendar): JsonResponse
    {
        $this->denyAccessUnlessGranted(CalendarVoter::VIEW, $calendar);

        $user->setDefaultCalendarId($calendar->getId());

        $this->userRepository->save($user);

        return $this->respond($user, groups: UserContextGroupConst::DETAILS);
    }
}
