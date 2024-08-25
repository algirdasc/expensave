<?php

declare(strict_types=1);

namespace App\Controller\Auth;

use App\Controller\AbstractApiController;
use App\Entity\Calendar;
use App\Entity\User;
use App\Http\Request\Auth\RegistrationRequest;
use App\Http\Response\Auth\AuthTokenResponse;
use App\Repository\CalendarRepository;
use App\Repository\UserRepository;
use Lexik\Bundle\JWTAuthenticationBundle\Services\JWTTokenManagerInterface;
use Symfony\Component\DependencyInjection\Attribute\Autowire;
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
    public function index(
        RegistrationRequest $request,
        JWTTokenManagerInterface $JWTManager,
        #[Autowire('%registrationDisabled%')] bool $registrationDisabled
    ): JsonResponse
    {
        if ($registrationDisabled) {
            throw $this->createNotFoundException();
        }

        $user = (new User())
            ->setEmail($request->getEmail())
            ->setName($request->getFullName())
            ->setActive(true)
            ->setPlainPassword($request->getPassword())
        ;

        $calendar = new Calendar('Personal', $user);

        $this->userRepository->save($user);
        $this->calendarRepository->save($calendar);

        $user->setDefaultCalendarId($calendar->getId());
        $this->userRepository->save($user);


        return $this->respond(
            new AuthTokenResponse(
                $JWTManager->create($user)
            )
        );
    }
}
