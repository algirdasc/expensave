<?php

declare(strict_types=1);

namespace App\Controller\Auth;

use App\Controller\AbstractApiController;
use App\Entity\Calendar;
use App\Entity\User;
use App\Repository\UserRepository;
use App\Request\Auth\RegistrationRequest;
use App\Response\Auth\AuthTokenResponse;
use Lexik\Bundle\JWTAuthenticationBundle\Services\JWTTokenManagerInterface;
use Nelmio\ApiDocBundle\Annotation\Security;
use OpenApi\Attributes as OA;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;

#[Route('api/auth/register', name: 'registration_')]
#[OA\Tag(name: 'Authentication')]
#[Security(name: '')]
class RegistrationController extends AbstractApiController
{
    #[Route('', name: 'create', methods: Request::METHOD_POST)]
    public function index(RegistrationRequest $request, JWTTokenManagerInterface $JWTManager, UserRepository $userRepository): JsonResponse
    {
        $user = (new User())
            ->setEmail($request->getEmail())
            ->setName($request->getFullName())
            ->setActive(true)
            ->setPlainPassword($request->getPassword())
            ->addCalendar(new Calendar('Personal'))
        ;

        $userRepository->save($user);

        return $this->respond(new AuthTokenResponse($JWTManager->create($user)));
    }
}
