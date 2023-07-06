<?php

declare(strict_types=1);

namespace App\DoctrineFilter;

use App\Entity\Calendar;
use Doctrine\ORM\EntityManagerInterface;
use Doctrine\ORM\Mapping\ClassMetadata;
use Doctrine\ORM\Query\Filter\SQLFilter;
use Symfony\Component\Security\Core\User\UserInterface;

class CalendarFilter extends SQLFilter
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

    public function addFilterConstraint(ClassMetadata $targetEntity, $targetTableAlias): string
    {
        if ($targetEntity->getName() !== Calendar::class) {
            return '';
        }

        $user = $this->getUser();
        if ($user === null) {
            return '1 = 0';
        }

        $userId = $this->entityManager->getConnection()->quote($user->getUserIdentifier());

        return sprintf('EXISTS (SELECT 1 FROM `calendar_user` cu_99 WHERE cu_99.calendar_id = %s.id AND cu_99.user_id = %s)', $targetTableAlias, $userId);
    }
}
