<?php

declare(strict_types=1);

namespace App\Controller\Auth;

use App\Controller\AbstractApiController;
use App\Entity\User;
use App\Repository\UserRepository;
use App\Request\Auth\RegistrationRequest;
use App\Response\Auth\AuthTokenResponse;
use Lexik\Bundle\JWTAuthenticationBundle\Services\JWTTokenManagerInterface;
use Nelmio\ApiDocBundle\Annotation\Model;
use Nelmio\ApiDocBundle\Annotation\Security;
use OpenApi\Attributes as OA;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;

#[Route('auth/register', name: 'registration_')]
#[OA\Tag(name: 'Authentication')]
#[Security(name: '')]
class RegistrationController extends AbstractApiController
{
    #[Route('', name: 'create', methods: Request::METHOD_POST)]
    #[OA\Response(
        response: 200,
        description: 'Creates new user',
        content: new OA\JsonContent(
            type: 'array',
            items: new OA\Items(ref: new Model(type: User::class, groups: ['full']))
        )
    )]
    public function index(RegistrationRequest $request, JWTTokenManagerInterface $JWTManager, UserRepository $userRepository): JsonResponse
    {
        $user = (new User())
            ->setEmail($request->getEmail())
            ->setName($request->getFullName())
            ->setActive(true)
            ->setPlainPassword($request->getPassword())
        ;

        $userRepository->save($user, true);

        return $this->respond(
            (new AuthTokenResponse())
                ->setToken($JWTManager->create($user))
        );
    }
}
