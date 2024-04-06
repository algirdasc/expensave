<?php

declare(strict_types=1);

namespace App\Repository;

use App\Entity\Calendar;
use App\Entity\Expense;
use DateTime;
use Doctrine\ORM\Query;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends AbstractRepository<Expense>
 * @method Expense|null find($id, $lockMode = null, $lockVersion = null)
 * @method Expense|null findOneBy(array $criteria, array $orderBy = null)
 * @method array<Expense> findAll()
 * @method array<Expense> findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class ExpenseRepository extends AbstractRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Expense::class);
    }

    public function findByStatementHash(string $statementHash): ?Expense
    {
        return $this->findOneBy(['statementHash' => $statementHash]);
    }

    /**
     * @return array<Expense>
     */
    public function findByCalendarAndInterval(Calendar $calendar, DateTime $dateFrom, DateTime $dateTo): array
    {
        return $this->createQueryBuilder('e')
            ->where('e.calendar = :calendar')
            ->andWhere('e.createdAt >= :dateFrom')
            ->andWhere('e.createdAt <= :dateTo')
            ->setParameter('calendar', $calendar)
            ->setParameter('dateFrom', $dateFrom)
            ->setParameter('dateTo', $dateTo)
            ->getQuery()
            ->getResult();
    }

    public function getTotalBalanceToDate(Calendar $calendar, DateTime $dateTo): float
    {
        return $this->createQueryBuilder('e')
            ->select('SUM(e.amount)')
            ->where('e.calendar = :calendar')
            ->andWhere('e.confirmed = true')
            ->andWhere('e.createdAt < :dateTo')
            ->setParameter('calendar', $calendar)
            ->setParameter('dateTo', $dateTo)
            ->orderBy('e.createdAt', 'ASC')
            ->getQuery()
            ->getOneOrNullResult(Query::HYDRATE_SINGLE_SCALAR) ?? 0;
    }

    public function getTotalBalance(Calendar $calendar): float
    {
        return $this->createQueryBuilder('e')
            ->select('SUM(e.amount)')
            ->where('e.calendar = :calendar')
            ->andWhere('e.confirmed = true')
            ->setParameter('calendar', $calendar)
            ->getQuery()
            ->getOneOrNullResult(Query::HYDRATE_SINGLE_SCALAR) ?? 0;
    }

    /**
     * @return array<array{
     *     date: string,
     *     balance: float
     * }>
     */
    public function getDailyBalances(Calendar $calendar, DateTime $dateFrom, DateTime $dateTo): array
    {
        return $this->createQueryBuilder('e')
            ->select('DATE(e.createdAt) AS date, SUM(e.amount) AS balance')
            ->where('e.calendar = :calendar')
            ->andWhere('e.confirmed = true')
            ->andWhere('e.createdAt >= :dateFrom')
            ->andWhere('e.createdAt < :dateTo')
            ->setParameter('calendar', $calendar)
            ->setParameter('dateFrom', $dateFrom)
            ->setParameter('dateTo', $dateTo)
            ->orderBy('e.createdAt', 'ASC')
            ->groupBy('date')
            ->getQuery()
            ->getResult();
    }

    public function findSuggestion(string $label): ?Expense
    {
        return $this->createQueryBuilder('e')
            ->where('e.label LIKE :label')
            ->setParameter('label', "$label%")
            ->orderBy('e.id', 'DESC')
            ->setMaxResults(1)
            ->getQuery()
            ->getOneOrNullResult(Query::HYDRATE_OBJECT);
    }
}
