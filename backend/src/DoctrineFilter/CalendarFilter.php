<?php

declare(strict_types=1);

namespace App\DoctrineFilter;

use App\Entity\Calendar;
use Doctrine\ORM\EntityManagerInterface;
use Doctrine\ORM\Mapping\ClassMetadata;
use Doctrine\ORM\Query\Filter\SQLFilter;
use Symfony\Component\Security\Core\User\UserInterface;

class CalendarFilter extends SQLFilter implements DoctrineFilterInterface
{
    private ?UserInterface $user;
    private EntityManagerInterface $entityManager;

    public function getUser(): ?UserInterface
    {
        return $this->user;
    }

    public function setUser(?UserInterface $user): self
    {
        $this->user = $user;

        return $this;
    }

    public function getEntityManager(): EntityManagerInterface
    {
        return $this->entityManager;
    }

    public function setEntityManager(EntityManagerInterface $entityManager): self
    {
        $this->entityManager = $entityManager;

        return $this;
    }

    public function addFilterConstraint(ClassMetadata $targetEntity, string $targetTableAlias): string
    {
        if ($targetEntity->getName() !== Calendar::class) {
            return '';
        }

        $user = $this->getUser();
        if ($user === null) {
            return '1 = 0';
        }

        $userEmail = $this->entityManager->getConnection()->quote($user->getUserIdentifier());

        $existsInSharedCalendars = sprintf('EXISTS (SELECT 1 FROM `calendar_user` cu_99 LEFT JOIN `user` u ON u.id = cu_99.user_id WHERE cu_99.calendar_id = %s.id AND u.email = %s)', $targetTableAlias, $userEmail);
        $isOwner = sprintf('%s.%s IN (SELECT c_99.%s FROM `%s` c_99 LEFT JOIN `user` u ON u.id = c_99.owner_id WHERE u.email = %s)',
            $targetTableAlias,
            $targetEntity->getSingleIdentifierColumnName(),
            $targetEntity->getSingleIdentifierColumnName(),
            $targetEntity->getTableName(), $userEmail
        );

        return sprintf('(%s OR %s)', $existsInSharedCalendars, $isOwner);
    }

    public function getName(): string
    {
        return 'calendar';
    }
}
