<?php

declare(strict_types=1);

namespace App\Controller\Auth;

use App\Controller\AbstractApiController;
use App\Entity\User;
use App\Repository\RefreshTokenRepository;
use App\Response\EmptyResponse;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Security\Http\Attribute\CurrentUser;

#[Route('api/auth/logout', name: 'logout_')]
class LogoutController extends AbstractApiController
{
    public function __construct(
        private readonly RefreshTokenRepository $refreshTokenRepository,
    ) {
    }

    #[Route('', name: 'index', methods: Request::METHOD_DELETE)]
    public function index(#[CurrentUser] User $user): JsonResponse
    {
        // ponytail: revokes every session of the user; per-device revoke if clients ever send the token
        $this->refreshTokenRepository->revokeAllForUser($user);

        return $this->respond(new EmptyResponse());
    }
}
