<?php

declare(strict_types=1);

namespace App\Tests\Application\Security\Voters;

use App\Security\Voters\ExpenseVoter;
use App\Tests\ApplicationTestCase;
use PHPUnit\Framework\Attributes\CoversClass;
use Symfony\Component\Security\Core\Authentication\Token\UsernamePasswordToken;
use Symfony\Component\Security\Core\Authorization\Voter\VoterInterface;

#[CoversClass(ExpenseVoter::class)]
class ExpenseVoterTest extends ApplicationTestCase
{
    public function testUnsupportedAttributeAbstains(): void
    {
        $voter = new ExpenseVoter();

        $this->assertSame(
            VoterInterface::ACCESS_ABSTAIN,
            $voter->vote($this->createToken(), $this->getExpense('Test expense 0', 'User 1 Calendar'), ['typo_permission'])
        );
    }

    public function testOwnerCanEditOwnExpense(): void
    {
        $voter = new ExpenseVoter();

        $this->assertSame(
            VoterInterface::ACCESS_GRANTED,
            $voter->vote($this->createToken(), $this->getExpense('Test expense 0', 'User 1 Calendar'), [ExpenseVoter::EDIT])
        );
    }

    private function createToken(): UsernamePasswordToken
    {
        $user = $this->getUser();

        return new UsernamePasswordToken($user, 'main', $user->getRoles());
    }
}
