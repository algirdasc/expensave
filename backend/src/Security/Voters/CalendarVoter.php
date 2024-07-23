<?php

declare(strict_types=1);

namespace App\Security\Voters;

use App\Entity\Calendar;
use App\Entity\User;
use App\Enum\CalendarPermission;
use Symfony\Component\Security\Core\Authentication\Token\TokenInterface;
use Symfony\Component\Security\Core\Authorization\Voter\Voter;

class CalendarVoter extends Voter
{
    public const VIEW = 'view';
    public const EDIT = 'edit';
    public const DELETE = 'delete';
    public const ADD_EXPENSE = 'add_expense';
    public const IMPORT = 'import';

    protected function supports(string $attribute, mixed $subject): bool
    {
        return $subject instanceof Calendar;
    }

    /**
     * @param Calendar $subject
     */
    protected function voteOnAttribute(string $attribute, mixed $subject, TokenInterface $token): bool
    {
        $user = $token->getUser();

        if (!$user instanceof User) {
            return false;
        }

        return match ($attribute) {
            self::VIEW, self::ADD_EXPENSE => $user->getCalendars()->contains($subject) || $user->getSharedCalendars()->contains($subject),
            default => $user->getCalendars()->contains($subject),
        };
    }
}
