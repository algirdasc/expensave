<?php

declare(strict_types=1);

namespace App\Controller\Auth;

use App\Controller\AbstractApiController;
use App\Entity\Calendar;
use App\Entity\User;
use App\Repository\CalendarRepository;
use App\Repository\UserRepository;
use App\Request\Auth\RegistrationRequest;
use App\Response\Auth\AuthTokenResponse;
use Lexik\Bundle\JWTAuthenticationBundle\Services\JWTTokenManagerInterface;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Attribute\Route;

#[Route('api/auth/register', name: 'registration_')]
class RegistrationController extends AbstractApiController
{
    public function __construct(
        private readonly CalendarRepository $calendarRepository,
        private readonly UserRepository $userRepository,
    ) {
    }

    #[Route('', name: 'create', methods: Request::METHOD_POST)]
    public function index(RegistrationRequest $request, JWTTokenManagerInterface $JWTManager): JsonResponse
    {
        $user = (new User())
            ->setEmail($request->getEmail())
            ->setName($request->getFullName())
            ->setActive(true)
            ->setPlainPassword($request->getPassword())
        ;

        $calendar = new Calendar('Personal', $user);

        $this->userRepository->save($user);
        $this->calendarRepository->save($calendar);

        return $this->respond(
            new AuthTokenResponse(
                $JWTManager->create($user)
            )
        );
    }
}
