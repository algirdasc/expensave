<?php

declare(strict_types=1);

namespace App\Request\User;

use App\Enum\UserRole;
use App\Request\AbstractRequest;
use Symfony\Component\Validator\Constraints as Assert;

class UpdateUserRoleRequest extends AbstractRequest
{
    #[Assert\NotBlank]
    #[Assert\Choice(callback: [UserRole::class, 'values'])]
    private string $role;

    public function getRole(): UserRole
    {
        return UserRole::from($this->role);
    }

    public function setRole(string $role): self
    {
        $this->role = $role;

        return $this;
    }
}
