<?php

declare(strict_types=1);

namespace App\Repository;

use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;

/**
 * @template T of object
 * @template-extends ServiceEntityRepository<T>
 */
abstract class AbstractRepository extends ServiceEntityRepository
{
    /**
     * @psalm-param T $entity
     */
    public function save(mixed $entity): void
    {
        $this->getEntityManager()->persist($entity);
        $this->getEntityManager()->flush();
    }

    /**
     * @psalm-param T $entity
     */
    public function remove(mixed $calendar): void
    {
        $this->getEntityManager()->remove($calendar);
        $this->getEntityManager()->flush();
    }
}
