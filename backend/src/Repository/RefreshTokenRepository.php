<?php

declare(strict_types=1);

namespace App\Repository;

use App\Entity\RefreshToken;
use App\Entity\User;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends AbstractRepository<RefreshToken>
 */
class RefreshTokenRepository extends AbstractRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, RefreshToken::class);
    }

    public function revokeAllForUser(User $user): void
    {
        $this->getEntityManager()->createQueryBuilder()
            ->delete(RefreshToken::class, 't')
            ->where('t.username = :username')
            ->setParameter('username', $user->getUserIdentifier())
            ->getQuery()
            ->execute()
        ;
    }
}
