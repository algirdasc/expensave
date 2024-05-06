<?php

declare(strict_types=1);

namespace App\Repository;

use App\DTO\Statement\Import\StatementImportRowInterface;
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

    public function findByCalendarAndStatementRow(Calendar $calendar, StatementImportRowInterface $row): ?Expense
    {
        $queryBuilder = $this->createQueryBuilder('e')
            ->where('e.calendar = :calendar')
            ->andWhere('e.amount = :amount')
            ->andWhere('DATE(e.createdAt) = DATE(:createdAtDate)')
            ->setParameter('calendar', $calendar)
            ->setParameter('amount', $row->getAmount())
            ->setParameter('createdAtDate', $row->getCreatedAt())
            ->setMaxResults(1)
        ;

        return $queryBuilder->getQuery()->getOneOrNullResult();
    }

    /**
     * @param array<Calendar> $calendars
     *
     * @return array<Expense>
     */
    public function findByCalendarsAndInterval(array $calendars, DateTime $dateFrom, DateTime $dateTo): array
    {
        return $this->createQueryBuilder('e')
            ->where('e.calendar IN (:calendars)')
            ->andWhere('e.createdAt >= :dateFrom')
            ->andWhere('e.createdAt <= :dateTo')
            ->setParameter('calendars', $calendars)
            ->setParameter('dateFrom', $dateFrom)
            ->setParameter('dateTo', $dateTo)
            ->getQuery()
            ->getResult();
    }

    /**
     * @param array<Calendar> $calendars
     */
    public function getTotalBalanceToDate(array $calendars, DateTime $dateTo): float
    {
        return $this->createQueryBuilder('e')
            ->select('SUM(e.amount)')
            ->where('e.calendar IN (:calendars)')
            ->andWhere('e.confirmed = true')
            ->andWhere('e.createdAt < :dateTo')
            ->setParameter('calendars', $calendars)
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
