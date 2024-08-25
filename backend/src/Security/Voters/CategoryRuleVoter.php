<?php

declare(strict_types=1);

namespace App\Security\Voters;

use App\Entity\Calendar;
use App\Entity\CategoryRule;
use App\Entity\User;
use App\Enum\CalendarPermission;
use Symfony\Component\Security\Core\Authentication\Token\TokenInterface;
use Symfony\Component\Security\Core\Authorization\Voter\Voter;

class CategoryRuleVoter extends Voter
{
    public const VIEW = 'view';
    public const UPDATE = 'update';
    public const DELETE = 'delete';

    protected function supports(string $attribute, mixed $subject): bool
    {
        return $subject instanceof CategoryRule;
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
            default => $user->getCategoryRules()->contains($subject),
        };
    }
}
