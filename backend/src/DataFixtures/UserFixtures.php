<?php

namespace App\DataFixtures;

use App\Entity\Calendar;
use App\Entity\User;
use App\Repository\UserRepository;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Persistence\ObjectManager;

class UserFixtures extends Fixture
{
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
        $userRepository->save($user1);

//        $calendar1 = new Calendar('User 1 Calendar', $user1);
//        $manager->persist($calendar1);
//
//        $calendar2 = new Calendar('User 2 Calendar', $user2);
//        $manager->persist($calendar2);

//        $calendar3 = (new Calendar('Shared Calendar', $user1))->addCollaborator($user2);
//        $manager->persist($calendar3);

        $manager->flush();
    }
}
