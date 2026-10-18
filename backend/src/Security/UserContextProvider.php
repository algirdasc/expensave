<?php

declare(strict_types=1);

namespace App\Security;

use App\Entity\User;
use LogicException;
use Symfony\Bundle\SecurityBundle\Security;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\RequestStack;

final readonly class UserContextProvider
{
    public function __construct(
        private Security $security,
        private RequestStack $requestStack,
    ) {
    }

    public function login(User $user): void
    {
        $this->requestStack->push(new Request());
        $this->security->login($user, authenticatorName: 'security.authenticator.json_login.main');
    }

    public function getUser(): User
    {
        $user = $this->security->getUser();

        if (!$user instanceof User) {
            throw new LogicException('No authenticated user in the current security context.');
        }

        return $user;
    }
}