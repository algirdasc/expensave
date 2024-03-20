<?php

declare(strict_types=1);

namespace App\Repository;

use App\Entity\Calendar;
use App\Entity\CalendarIdentification;
use Doctrine\ORM\Query\Expr\Join;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends AbstractRepository<Calendar>
 * @method Calendar|null find($id, $lockMode = null, $lockVersion = null)
 * @method Calendar|null findOneBy(array $criteria, array $orderBy = null)
 * @method Calendar[]    findAll()
 * @method Calendar[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class CalendarRepository extends AbstractRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Calendar::class);
    }

    public function findByIdentification(string $identification): ?Calendar
    {
        return $this->createQueryBuilder('c')
            ->leftJoin(CalendarIdentification::class, 'ci', Join::WITH, 'c = ci.calendar')
            ->where('ci.identification = :identification')
            ->setParameter('identification', $identification)
            ->getQuery()
            ->getOneOrNullResult()
            ;
    }
}
