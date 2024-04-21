<?php

namespace App\DoctrineFilter;

use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\DependencyInjection\Attribute\AutoconfigureTag;
use Symfony\Component\Security\Core\User\UserInterface;

#[AutoconfigureTag('app.doctrine.filter')]
interface DoctrineFilterInterface
{
    public function getName(): string;

    public function setUser(?UserInterface $user): self;

    public function setEntityManager(EntityManagerInterface $entityManager): self;
}