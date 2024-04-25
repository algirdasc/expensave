<?php

declare(strict_types=1);

namespace App\Repository;

use App\Entity\Calendar;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends AbstractRepository<Calendar>
 * @method Calendar|null find($id, $lockMode = null, $lockVersion = null)
 * @method Calendar|null findOneBy(array $criteria, array $orderBy = null)
 * @method array<Calendar> findAll()
 * @method array<Calendar> findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class CalendarRepository extends AbstractRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Calendar::class);
    }
}
