<?php

declare(strict_types=1);

namespace App\Repository;

use App\Entity\Calendar;
use App\Entity\Category;
use App\Entity\RecurringExpense;
use Doctrine\ORM\AbstractQuery;
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

    public function hasCategory(Category $category): bool
    {
        return $this->createQueryBuilder('r')
            ->select('1')
            ->where('r.category = :category')
            ->setParameter('category', $category)
            ->setMaxResults(1)
            ->getQuery()
            ->getOneOrNullResult(AbstractQuery::HYDRATE_SINGLE_SCALAR) !== null;
    }

    public function hasCalendar(Calendar $calendar): bool
    {
        return $this->createQueryBuilder('r')
            ->select('1')
            ->where('r.calendar = :calendar')
            ->setParameter('calendar', $calendar)
            ->setMaxResults(1)
            ->getQuery()
            ->getOneOrNullResult(AbstractQuery::HYDRATE_SINGLE_SCALAR) !== null;
    }
}
