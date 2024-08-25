<?php

namespace App\DataFixtures;

use App\Entity\Calendar;
use App\Entity\User;
use App\Repository\UserRepository;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Common\DataFixtures\DependentFixtureInterface;
use Doctrine\Persistence\ObjectManager;

class CalendarFixture extends Fixture implements DependentFixtureInterface
{
    public const string CALENDAR_1_REFERENCE = 'calendar-1';
    public const string CALENDAR_2_REFERENCE = 'calendar-2';
    public const string CALENDAR_SHARED_REFERENCE = 'calendar-shared';

    public function load(ObjectManager $manager): void
    {
        $user1 = $this->getReference(UserFixture::USER_1_REFERENCE, User::class);
        $user2 = $this->getReference(UserFixture::USER_2_REFERENCE, User::class);

        $calendar1 = new Calendar('User 1 Calendar', $user1);
        $manager->persist($calendar1);

        $calendar2 = new Calendar('User 2 Calendar', $user2);
        $manager->persist($calendar2);

        $calendar3 = (new Calendar('Shared Calendar', $user1))
            ->addCollaborator($user2);

        $manager->persist($calendar3);

        $manager->flush();

        $this->setReference(self::CALENDAR_1_REFERENCE, $calendar1);
        $this->setReference(self::CALENDAR_2_REFERENCE, $calendar2);
        $this->setReference(self::CALENDAR_SHARED_REFERENCE, $calendar3);
    }

    public function getDependencies(): array
    {
        return [
            UserFixture::class
        ];
    }
}
