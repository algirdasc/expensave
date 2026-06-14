<?php

declare(strict_types=1);

namespace App\Controller\Admin;

use App\Controller\AbstractApiController;
use App\Entity\User;
use App\Repository\UserRepository;
use App\Request\User\UpdateUserRoleRequest;
use App\Response\Admin\TemporaryPasswordResponse;
use App\Response\EmptyResponse;
use App\Service\AdminUserService;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Security\Http\Attribute\CurrentUser;
use Symfony\Component\Security\Http\Attribute\IsGranted;

#[Route('api/admin/users', name: 'admin_users_')]
#[IsGranted('ROLE_ADMIN')]
class UserManagementController extends AbstractApiController
{
    public function __construct(
        private readonly UserRepository $userRepository,
        private readonly AdminUserService $adminUserService,
    ) {
    }

    #[Route('', name: 'list', methods: Request::METHOD_GET)]
    public function list(): JsonResponse
    {
        return $this->respond($this->userRepository->findAllForAdministration());
    }

    #[Route('/{user}/role', name: 'update_role', methods: Request::METHOD_PUT)]
    public function updateRole(#[CurrentUser] User $currentUser, User $user, UpdateUserRoleRequest $request): JsonResponse
    {
        return $this->respond($this->adminUserService->updateRole($currentUser, $user, $request->getRole()));
    }

    #[Route('/{user}/activate', name: 'activate', methods: Request::METHOD_PUT)]
    public function activate(#[CurrentUser] User $currentUser, User $user): JsonResponse
    {
        return $this->respond($this->adminUserService->activate($currentUser, $user));
    }

    #[Route('/{user}/deactivate', name: 'deactivate', methods: Request::METHOD_PUT)]
    public function deactivate(#[CurrentUser] User $currentUser, User $user): JsonResponse
    {
        return $this->respond($this->adminUserService->deactivate($currentUser, $user));
    }

    #[Route('/{user}/password-reset', name: 'password_reset', methods: Request::METHOD_POST)]
    public function sendPasswordReset(#[CurrentUser] User $currentUser, User $user): JsonResponse
    {
        $this->adminUserService->sendPasswordReset($currentUser, $user);

        return $this->respond(new EmptyResponse());
    }

    #[Route('/{user}/temporary-password', name: 'temporary_password', methods: Request::METHOD_POST)]
    public function resetPassword(#[CurrentUser] User $currentUser, User $user): JsonResponse
    {
        return $this->respond(new TemporaryPasswordResponse(
            $this->adminUserService->resetPassword($currentUser, $user)
        ));
    }
}
