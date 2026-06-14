<?php

declare(strict_types=1);

namespace App\DataFixtures;

use App\Entity\Calendar;
use App\Entity\Category;
use App\Entity\Expense;
use App\Entity\User;
use DateTime;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Common\DataFixtures\DependentFixtureInterface;
use Doctrine\Persistence\ObjectManager;

class ExpenseFixture extends Fixture implements DependentFixtureInterface
{
    private int $dateIndex = 0;

    public function load(ObjectManager $manager): void
    {
        $calendar1 = $this->getReference(CalendarFixture::CALENDAR_1_REFERENCE, Calendar::class);
        $calendar2 = $this->getReference(CalendarFixture::CALENDAR_2_REFERENCE, Calendar::class);
        $calendarShared = $this->getReference(CalendarFixture::CALENDAR_SHARED_REFERENCE, Calendar::class);

        $user1 = $this->getReference(UserFixture::USER_1_REFERENCE, User::class);
        $user2 = $this->getReference(UserFixture::USER_2_REFERENCE, User::class);

        $categories = [
            $this->getReference(CategoryFixture::CATEGORY_1_REFERENCE, Category::class),
            $this->getReference(CategoryFixture::CATEGORY_2_REFERENCE, Category::class),
            $this->getReference(CategoryFixture::UNCATEGORIZED_REFERENCE, Category::class),
        ];

        // User 1 expenses
        foreach ([-75, 25, 30, -9] as $idx => $amount) {
            $expense = new Expense();
            $expense->setCalendar($calendar1);
            $expense->setUser($user1);
            $expense->setLabel(sprintf('Test expense %d', $idx));
            $expense->setAmount($amount);
            $expense->setCreatedAt($this->getFixtureDate());
            $expense->setCategory($categories[$idx] ?? $categories[2]);
            $expense->setConfirmed($idx !== 3);
            $manager->persist($expense);
        }

        // User 2 expenses
        foreach ([-45, -25, 80] as $idx => $amount) {
            $expense = new Expense();
            $expense->setCalendar($calendar2);
            $expense->setUser($user2);
            $expense->setLabel(sprintf('Test expense %d', $idx));
            $expense->setAmount($amount);
            $expense->setCreatedAt($this->getFixtureDate());
            $expense->setCategory($categories[$idx]);
            $manager->persist($expense);
        }

        // Shared expenses
        $expense = new Expense();
        $expense->setCalendar($calendarShared);
        $expense->setUser($user1);
        $expense->setLabel('Shared expense 1 of User 1');
        $expense->setAmount(-50);
        $expense->setCreatedAt($this->getFixtureDate());
        $expense->setCategory($categories[0]);
        $manager->persist($expense);

        $expense = new Expense();
        $expense->setCalendar($calendarShared);
        $expense->setUser($user2);
        $expense->setLabel('Shared expense 2 of User 2');
        $expense->setAmount(30);
        $expense->setCreatedAt($this->getFixtureDate());
        $expense->setCategory($categories[1]);
        $manager->persist($expense);

        $manager->flush();
    }

    private function getFixtureDate(): DateTime
    {
        $dates = [
            '2024-01-05 12:00:00',
            '2024-02-10 12:00:00',
            '2024-03-15 12:00:00',
            '2024-04-20 12:00:00',
            '2024-05-05 12:00:00',
            '2024-06-10 12:00:00',
            '2024-07-15 12:00:00',
            '2024-08-20 12:00:00',
            '2024-09-25 12:00:00',
        ];

        return new DateTime($dates[$this->dateIndex++]);
    }

    public function getDependencies(): array
    {
        return [
            UserFixture::class,
            CalendarFixture::class,
            CategoryFixture::class,
        ];
    }
}
