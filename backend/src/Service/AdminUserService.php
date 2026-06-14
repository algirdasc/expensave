<?php

declare(strict_types=1);

namespace App\Service;

use App\Entity\User;
use App\Enum\UserRole;
use App\Exception\DataConflictException;
use App\Repository\UserRepository;

readonly class AdminUserService
{
    private const int TEMPORARY_PASSWORD_BYTES = 8;

    public function __construct(
        private UserRepository $userRepository,
        private PasswordResetService $passwordResetService,
    ) {
    }

    public function updateRole(User $currentUser, User $user, UserRole $role): User
    {
        $this->assertNotCurrentUser($currentUser, $user);

        if ($role !== UserRole::ADMIN) {
            $this->assertActiveAdminCanBeRemoved($user, 'role');
        }

        $user->setRole($role);
        $this->userRepository->save($user);

        return $user;
    }

    public function activate(User $currentUser, User $user): User
    {
        $this->assertNotCurrentUser($currentUser, $user);

        $user->setActive(true);
        $this->userRepository->save($user);

        return $user;
    }

    public function deactivate(User $currentUser, User $user): User
    {
        $this->assertNotCurrentUser($currentUser, $user);
        $this->assertActiveAdminCanBeRemoved($user, 'active');

        $user
            ->setActive(false)
            ->clearPasswordResetToken()
        ;

        $this->userRepository->save($user);

        return $user;
    }

    public function sendPasswordReset(User $currentUser, User $user): void
    {
        $this->assertNotCurrentUser($currentUser, $user);

        $this->passwordResetService->forgotPassword($user->getEmail());
    }

    public function resetPassword(User $currentUser, User $user): string
    {
        $this->assertNotCurrentUser($currentUser, $user);

        $password = bin2hex(random_bytes(self::TEMPORARY_PASSWORD_BYTES));
        $user
            ->setPlainPassword($password)
            ->clearPasswordResetToken()
        ;

        $this->userRepository->save($user);

        return $password;
    }

    private function assertNotCurrentUser(User $currentUser, User $user): void
    {
        if ($currentUser->getId() !== $user->getId()) {
            return;
        }

        throw new DataConflictException('You cannot manage your own user account from this screen.', 'user');
    }

    private function assertActiveAdminCanBeRemoved(User $user, string $propertyPath): void
    {
        if (
            $user->getRole() !== UserRole::ADMIN
            || !$user->isActive()
            || $this->userRepository->countActiveByRole(UserRole::ADMIN) > 1
        ) {
            return;
        }

        throw new DataConflictException('At least one active administrator account must remain.', $propertyPath);
    }
}
