<?php

declare(strict_types=1);

namespace App\Repository;

use App\Entity\RecurringExpense;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends AbstractRepository<RecurringExpense>
 * @method RecurringExpense|null find($id, $lockMode = null, $lockVersion = null)
 * @method RecurringExpense|null findOneBy(array $criteria, array $orderBy = null)
 * @method array<RecurringExpense> findAll()
 * @method array<RecurringExpense> findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class RecurringExpenseRepository extends AbstractRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, RecurringExpense::class);
    }
}
