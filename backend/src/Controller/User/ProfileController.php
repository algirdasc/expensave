<?php

declare(strict_types=1);

namespace App\Controller\User;

use App\Const\ContextGroup\UserContextGroupConst;
use App\Controller\AbstractApiController;
use App\Entity\User;
use App\Repository\UserRepository;
use App\Response\EntityResponse;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Security\Http\Attribute\CurrentUser;

#[Route('user', name: 'user_')]
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

    #[Route('/profile', methods: Request::METHOD_PUT)]
    public function update(#[CurrentUser] User $user): JsonResponse
    {
        $this->userRepository->save($user);

        return $this->respond($user, groups: UserContextGroupConst::DETAILS);
    }
}
