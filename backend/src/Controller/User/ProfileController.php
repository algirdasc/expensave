<?php

declare(strict_types=1);

namespace App\Controller\User;

use App\Const\ContextGroup\UserContextGroupConst;
use App\Controller\AbstractApiController;
use App\Entity\User;
use App\Repository\UserRepository;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Security\Http\Attribute\CurrentUser;

#[Route('api/user', name: 'user_')]
class ProfileController extends AbstractApiController
{
    public function __construct(
        private readonly UserRepository $userRepository
    ) {
    }

    #[Route('', methods: Request::METHOD_GET)]
    public function list(): JsonResponse
    {
        return $this->respond($this->userRepository->findAll());
    }

    #[Route('/profile', methods: Request::METHOD_GET)]
    public function profile(#[CurrentUser] User $user): JsonResponse
    {
        return $this->respond($user, groups: UserContextGroupConst::DETAILS);
    }

    #[Route('/change-password', methods: Request::METHOD_PUT)]
    public function changePassword(#[CurrentUser] User $user): JsonResponse
    {
        $this->userRepository->save($user);

        return $this->respond($user, groups: UserContextGroupConst::DETAILS);
    }

    #[Route('/search', methods: Request::METHOD_POST)]
    public function search(#[CurrentUser] User $user): JsonResponse
    {
        $users = $this->userRepository->findAll();

        return $this->respond($this->userRepository->findAll());
    }
}
