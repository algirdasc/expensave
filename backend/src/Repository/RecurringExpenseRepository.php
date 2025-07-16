<?php

namespace App\Repository;

use App\Entity\RecurringExpense;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

class RecurringExpenseRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, RecurringExpense::class);
    }

    public function findDueForDate(\DateTime $date): array
    {
        $qb = $this->createQueryBuilder('r');
        $qb->where('r.isActive = true')
           ->andWhere('r.startDate <= :date')
           ->andWhere($qb->expr()->orX(
               'r.endDate IS NULL',
               'r.endDate >= :date'
           ))
           ->setParameter('date', $date->format('Y-m-d'));

        return $qb->getQuery()->getResult();
    }
}
