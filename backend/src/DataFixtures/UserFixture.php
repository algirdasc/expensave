<?php

namespace App\DataFixtures;

use App\Entity\Calendar;
use App\Entity\User;
use App\Repository\UserRepository;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Persistence\ObjectManager;

class UserFixture extends Fixture
{
    public const USER_1_REFERENCE = 'user-1';
    public const USER_2_REFERENCE = 'user-2';

    public function load(ObjectManager $manager): void
    {
        /** @var UserRepository $userRepository */
        $userRepository = $manager->getRepository(User::class);

        $user1 = new User();
        $user1->setName('User 1');
        $user1->setEmail('user1@email.com');
        $user1->setActive(true);
        $user1->setPlainPassword('password1');
        $userRepository->save($user1);

        $user2 = new User();
        $user2->setName('User 2');
        $user2->setEmail('user2@email.com');
        $user2->setActive(true);
        $user2->setPlainPassword('password2');
        $userRepository->save($user2);

        $user3 = new User();
        $user3->setName('User 3');
        $user3->setEmail('user3@email.com');
        $user3->setActive(false);
        $user3->setPlainPassword('password3');
        $userRepository->save($user3);

        $this->setReference(self::USER_1_REFERENCE, $user1);
        $this->setReference(self::USER_2_REFERENCE, $user2);
    }
}
