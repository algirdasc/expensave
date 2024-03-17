<?php

namespace App\Repository;

use App\Entity\Calendar;
use App\Entity\Expense;
use DateTimeInterface;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<Expense>
 *
 * @method Expense|null find($id, $lockMode = null, $lockVersion = null)
 * @method Expense|null findOneBy(array $criteria, array $orderBy = null)
 * @method Expense[]    findAll()
 * @method Expense[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class ExpenseRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Expense::class);
    }

    public function save(Expense $entity, bool $flush = false): void
    {
        $this->getEntityManager()->persist($entity);
        $this->getEntityManager()->flush();
    }

    public function remove(Expense $entity, bool $flush = false): void
    {
        $this->getEntityManager()->remove($entity);
        $this->getEntityManager()->flush();
    }

    public function findByStatementHash(string $statementHash): ?Expense
    {
        return $this->findOneBy(['statementHash' => $statementHash]);
    }

    /**
     * @return array<Expense>
     */
    public function findByCalendarAndInterval(Calendar $calendar, \DateTime $fromDate, \DateTime $toDate): array
    {
        return $this->createQueryBuilder('e')
            ->where('e.calendar = :calendar')
            ->andWhere('e.createdAt >= :fromDate')
            ->andWhere('e.createdAt <= :toDate')
            ->setParameter('calendar', $calendar)
            ->setParameter('fromDate', $fromDate)
            ->setParameter('toDate', $toDate)
            ->getQuery()
            ->getResult();
    }
}
