<?php

declare(strict_types=1);

namespace App\Security\Voters;

use App\Entity\Expense;
use App\Entity\User;
use Symfony\Component\Security\Core\Authentication\Token\TokenInterface;
use Symfony\Component\Security\Core\Authorization\Voter\Voter;

class ExpenseVoter extends Voter
{
    public const string VIEW = 'view';
    public const string EDIT = 'edit';
    public const string DELETE = 'delete';

    protected function supports(string $attribute, mixed $subject): bool
    {
        return $subject instanceof Expense;
    }

    /**
     * @param Expense $subject
     */
    protected function voteOnAttribute(string $attribute, mixed $subject, TokenInterface $token): bool
    {
        $user = $token->getUser();

        if (!$user instanceof User) {
            return false;
        }

        return match($attribute) {
            self::VIEW => $subject->getUser() === $user || $subject->getCalendar()->getCollaborators()->contains($user),
            default => $subject->getUser() === $user
        };
    }
}