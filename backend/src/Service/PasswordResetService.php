<?php

declare(strict_types=1);

namespace App\Service;

use App\Repository\UserRepository;
use Symfony\Component\String\ByteString;

readonly class PasswordResetService
{
    public function __construct(
        private UserRepository $userRepository
    ) {
    }

    public function forgotPassword(string $email): void
    {
        $user = $this->userRepository->findOneBy(['email' => $email, 'active' => true]);

        if ($user === null) {
            return;
        }

        $user->setPassword(ByteString::fromRandom(64)->toString());

        $this->userRepository->save($user);

        // TODO: send email
    }

    public function resetPassword(string $hash, string $password): void
    {
        $user = $this->userRepository->findOneBy(['password' => $hash, 'active' => true]);

        if ($user === null) {
            return;
        }

        $user->setPlainPassword($password);

        $this->userRepository->save($user);

        // TODO: send email
    }
}
