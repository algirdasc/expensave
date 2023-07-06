<?php

namespace App\Repository;

use App\Entity\Calendar;
use App\Entity\CalendarIdentification;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\ORM\Query\Expr\Join;
use Doctrine\Persistence\ManagerRegistry;
use Symfony\Component\Security\Core\User\UserInterface;

/**
 * @extends ServiceEntityRepository<Calendar>
 *
 * @method Calendar|null find($id, $lockMode = null, $lockVersion = null)
 * @method Calendar|null findOneBy(array $criteria, array $orderBy = null)
 * @method Calendar[]    findAll()
 * @method Calendar[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class CalendarRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Calendar::class);
    }

    public function save(Calendar $calendar, bool $flush = false): void
    {
        $this->getEntityManager()->persist($calendar);

        if ($flush) {
            $this->getEntityManager()->flush();
        }
    }

    public function remove(Calendar $calendar, bool $flush = false): void
    {
        $this->getEntityManager()->remove($calendar);

        if ($flush) {
            $this->getEntityManager()->flush();
        }
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
