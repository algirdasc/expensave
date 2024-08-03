<?php

declare(strict_types=1);

namespace App\Repository;

use App\Const\StringConst;
use App\Entity\Category;
use App\Enum\CategoryType;
use Doctrine\Common\Collections\Criteria;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends AbstractRepository<Category>
 * @method Category|null find($id, $lockMode = null, $lockVersion = null)
 * @method Category|null findOneBy(array $criteria, array $orderBy = null)
 * @method array<Category> findAll()
 * @method array<Category> findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class CategoryRepository extends AbstractRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Category::class);
    }

    public function findOrCreate(string $categoryName): Category
    {
        $category = $this->findOneBy(['name' => $categoryName]);

        if ($category === null) {
            $category = new Category();
            $category->setName($categoryName);
            $category->setColor(StringConst::UNCATEGORIZED_COLOR);

            $this->save($category);
        }

        return $category;
    }

    /**
     * @return array<Category>
     */
    public function getSystem(): array
    {
        $queryBuilder = $this->createQueryBuilder('c')
            ->where('c.type != :type')
            ->setParameter('type', CategoryType::USER);


        return $queryBuilder->getQuery()->getResult();
    }

    public function getBalanceCategory(): Category
    {
        $category = $this->findOneBy(['type' => CategoryType::BALANCE_UPDATE]);

        if ($category === null) {
            $category = $this->findOrCreate(StringConst::BALANCE_UPDATE_LABEL);
            $category->setColor(StringConst::BALANCE_COLOR);
            $category->setType(CategoryType::BALANCE_UPDATE);
        }

        return $category;
    }
}
