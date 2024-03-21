<?php

declare(strict_types=1);

namespace App\Repository;

use App\Entity\Category;
use App\Entity\CategoryRule;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends AbstractRepository<CategoryRule>
 * @method CategoryRule|null find($id, $lockMode = null, $lockVersion = null)
 * @method CategoryRule|null findOneBy(array $criteria, array $orderBy = null)
 * @method CategoryRule[]    findAll()
 * @method CategoryRule[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class CategoryRuleRepository extends AbstractRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, CategoryRule::class);
    }

    public function match(string $expenseLabel): ?Category
    {
        $rules = $this->findAll();
        foreach ($rules as $rule) {
            if ($rule->hasMatch($expenseLabel)) {
                return $rule->getCategory();
            }
        }

        return null;
    }
}
