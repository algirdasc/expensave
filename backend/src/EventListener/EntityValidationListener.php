<?php

declare(strict_types=1);

namespace App\EventListener;

use App\Exception\RequestValidationException;
use App\Service\ValidationService;
use Doctrine\Bundle\DoctrineBundle\Attribute\AsDoctrineListener;
use Doctrine\ORM\EntityManagerInterface;
use Doctrine\ORM\Events;
use Doctrine\Persistence\Event\LifecycleEventArgs;

#[AsDoctrineListener(event: Events::prePersist)]
#[AsDoctrineListener(event: Events::preUpdate)]
readonly class EntityValidationListener
{
    public function __construct(
        private ValidationService $validator
    ) {
    }

    /**
     * @param LifecycleEventArgs<EntityManagerInterface> $eventArgs
     *
     * @throws RequestValidationException
     */
    public function prePersist(LifecycleEventArgs $eventArgs): void
    {
        $this->validator->validateOrException($eventArgs->getObject());
    }

    /**
     * @param LifecycleEventArgs<EntityManagerInterface> $eventArgs
     *
     * @throws RequestValidationException
     */
    public function preUpdate(LifecycleEventArgs $eventArgs): void
    {
        $this->validator->validateOrException($eventArgs->getObject());
    }
}
