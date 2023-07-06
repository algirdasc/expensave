<?php

namespace App\Repository;

use App\Entity\Category;
use App\Entity\CategoryRule;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<CategoryRule>
 *
 * @method CategoryRule|null find($id, $lockMode = null, $lockVersion = null)
 * @method CategoryRule|null findOneBy(array $criteria, array $orderBy = null)
 * @method CategoryRule[]    findAll()
 * @method CategoryRule[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class CategoryRuleRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, CategoryRule::class);
    }

    public function save(CategoryRule $entity, bool $flush = false): void
    {
        $this->getEntityManager()->persist($entity);

        if ($flush) {
            $this->getEntityManager()->flush();
        }
    }

    public function remove(CategoryRule $entity, bool $flush = false): void
    {
        $this->getEntityManager()->remove($entity);

        if ($flush) {
            $this->getEntityManager()->flush();
        }
    }

    public function match(string $remittanceInformation): ?Category
    {
        $rules = $this->findAll();
        foreach ($rules as $rule) {
            if ($rule->hasMatch($remittanceInformation)) {
                return $rule->getCategory();
            }
        }

        return null;
    }
}
