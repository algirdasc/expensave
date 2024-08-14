<?php

declare(strict_types=1);

namespace App\Repository;

use App\DTO\Statement\Import\StatementImportRowInterface;
use App\Entity\Calendar;
use App\Entity\Category;
use App\Entity\Expense;
use App\Enum\CategoryType;
use DateTime;
use Doctrine\ORM\AbstractQuery;
use Doctrine\ORM\Query;
use Doctrine\ORM\QueryBuilder;
use Doctrine\Persistence\ManagerRegistry;
use LogicException;
use Symfony\Component\Security\Core\User\UserInterface;

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
            ->getOneOrNullResult(AbstractQuery::HYDRATE_SINGLE_SCALAR) ?? 0;
    }

    public function getTotalBalance(Calendar $calendar): float
    {
        return $this->createQueryBuilder('e')
            ->select('SUM(e.amount)')
            ->where('e.calendar = :calendar')
            ->andWhere('e.confirmed = true')
            ->setParameter('calendar', $calendar)
            ->getQuery()
            ->getOneOrNullResult(AbstractQuery::HYDRATE_SINGLE_SCALAR) ?? 0;
    }

    public function findUserSuggestion(UserInterface $user, string $label): ?Expense
    {
        return $this->getUserExpenseByLabel($user, $label)
            ?? $this->getUserExpenseByLabelStartsWith($user, $label);
    }

    public function getUserExpenseByLabel(UserInterface $user, string $label): ?Expense
    {
        return $this->getQueryBuilderForUserSuggestion($user)
            ->andWhere('e.label LIKE :label')
            ->setParameter('label', $label)
            ->setMaxResults(1)
            ->getQuery()
            ->getOneOrNullResult(AbstractQuery::HYDRATE_OBJECT);
    }

    public function getUserExpenseByLabelStartsWith(UserInterface $user, string $label): ?Expense
    {
        return $this->getQueryBuilderForUserSuggestion($user)
            ->andWhere('e.label LIKE :label')
            ->setParameter('label', "$label%")
            ->setMaxResults(1)
            ->getQuery()
            ->getOneOrNullResult(AbstractQuery::HYDRATE_OBJECT);
    }

    private function getQueryBuilderForUserSuggestion(UserInterface $user): QueryBuilder
    {
        return $this->createQueryBuilder('e')
            ->andWhere('e.user = :user')
            ->setParameter('user', $user)
            ->addOrderBy('e.id', 'DESC')
            ->addOrderBy('e.label', 'ASC');
    }
}
