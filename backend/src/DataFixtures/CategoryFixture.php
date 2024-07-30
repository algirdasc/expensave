<?php

declare(strict_types=1);

namespace App\DataFixtures;

use App\Entity\Category;
use App\Enum\CategoryType;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Persistence\ObjectManager;

class CategoryFixture extends Fixture
{
    public const CATEGORY_1_REFERENCE = 'category-1';
    public const CATEGORY_2_REFERENCE = 'category-2';
    public const UNCATEGORIZED_REFERENCE = 'category-uncategorized';

    public function load(ObjectManager $manager): void
    {
        $category1 = new Category();
        $category1->setName('Category 1');
        $category1->setColor('#00ff00');
        $manager->persist($category1);

        $category2 = new Category();
        $category2->setName('Category 2');
        $category2->setColor('#ffff00');
        $manager->persist($category2);

        $uncategorized = new Category();
        $uncategorized->setName('Uncategorized');
        $uncategorized->setColor('#00ffff');
        $uncategorized->setType(CategoryType::UNCATEGORIZED);
        $manager->persist($uncategorized);

        $balanceUpdate = new Category();
        $balanceUpdate->setName('Balance Update');
        $balanceUpdate->setColor('#0fff0f');
        $balanceUpdate->setType(CategoryType::BALANCE_UPDATE);
        $manager->persist($balanceUpdate);

        $manager->flush();

        $this->setReference(self::CATEGORY_1_REFERENCE, $category1);
        $this->setReference(self::CATEGORY_2_REFERENCE, $category2);
        $this->setReference(self::UNCATEGORIZED_REFERENCE, $uncategorized);
    }
}