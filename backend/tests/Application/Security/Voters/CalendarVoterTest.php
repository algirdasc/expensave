<?php

declare(strict_types=1);

namespace App\Tests\Application\Security\Voters;

use App\Security\Voters\CalendarVoter;
use App\Tests\ApplicationTestCase;
use PHPUnit\Framework\Attributes\CoversClass;
use Symfony\Component\Security\Core\Authentication\Token\UsernamePasswordToken;
use Symfony\Component\Security\Core\Authorization\Voter\VoterInterface;

#[CoversClass(CalendarVoter::class)]
class CalendarVoterTest extends ApplicationTestCase
{
    public function testUnsupportedAttributeAbstains(): void
    {
        $voter = new CalendarVoter();

        $this->assertSame(
            VoterInterface::ACCESS_ABSTAIN,
            $voter->vote($this->createToken(), $this->getCalendar('User 1 Calendar'), ['typo_permission'])
        );
    }

    public function testOwnerCanImportCalendar(): void
    {
        $voter = new CalendarVoter();

        $this->assertSame(
            VoterInterface::ACCESS_GRANTED,
            $voter->vote($this->createToken(), $this->getCalendar('User 1 Calendar'), [CalendarVoter::IMPORT])
        );
    }

    private function createToken(): UsernamePasswordToken
    {
        $user = $this->getUser();

        return new UsernamePasswordToken($user, 'main', $user->getRoles());
    }
}
