<?php

declare(strict_types=1);

namespace App\Repository;

use App\Entity\RecurringExpense;
use DateTime;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<RecurringExpense>
 */
class RecurringExpenseRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, RecurringExpense::class);
    }

    public function save(RecurringExpense $entity): void
    {
        $entity->touch();

        $this->getEntityManager()->persist($entity);
        $this->getEntityManager()->flush();
    }

    public function findDue(DateTime $now): array
    {
        return $this->createQueryBuilder('r')
            ->andWhere('r.active = true')
            ->andWhere('r.nextRunAt <= :now')
            ->setParameter('now', $now)
            ->orderBy('r.nextRunAt', 'ASC')
            ->getQuery()
            ->getResult();
    }
}
