<?php

declare(strict_types=1);

namespace App\Repository;

use App\Entity\Calendar;
use App\Entity\Expense;
use DateTime;
use Doctrine\Persistence\ManagerRegistry;
use JetBrains\PhpStorm\ArrayShape;

/**
 * @extends AbstractRepository<Expense>
 * @method Expense|null find($id, $lockMode = null, $lockVersion = null)
 * @method Expense|null findOneBy(array $criteria, array $orderBy = null)
 * @method Expense[]    findAll()
 * @method Expense[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
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
            ->andWhere('e.createdAt < :dateTo')
            ->setParameter('calendar', $calendar)
            ->setParameter('dateTo', $dateTo)
            ->orderBy('e.createdAt', 'ASC')
            ->getQuery()
            ->getSingleScalarResult() ?? 0;
    }

    #[ArrayShape(['date' => 'string', 'balance' => 'float',])]
    public function getDailyBalances(Calendar $calendar, DateTime $dateFrom, DateTime $dateTo): array
    {
        return $this->createQueryBuilder('e')
            ->select('DATE(e.createdAt) AS date, SUM(e.amount) AS balance')
            ->where('e.calendar = :calendar')
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
}
