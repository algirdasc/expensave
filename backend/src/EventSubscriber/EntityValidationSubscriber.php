<?php

declare(strict_types=1);

namespace App\EventSubscriber;

use App\Exception\RequestValidationException;
use App\Service\ValidationService;
use Doctrine\Bundle\DoctrineBundle\EventSubscriber\EventSubscriberInterface;
use Doctrine\ORM\Events;
use Doctrine\Persistence\Event\LifecycleEventArgs;

class EntityValidationSubscriber implements EventSubscriberInterface
{
    public function __construct(
        private readonly ValidationService $validator
    ) {
    }

    public function getSubscribedEvents(): array
    {
        return [
            Events::prePersist,
            Events::preUpdate,
        ];
    }

    /**
     * @SupressWarnings("unused")
     *
     * @throws RequestValidationException
     */
    public function prePersist(LifecycleEventArgs $eventArgs): void
    {
        $this->validator->validateOrException($eventArgs->getObject());
    }

    /**
     * @SupressWarnings("unused")
     *
     * @throws RequestValidationException
     */
    public function preUpdate(LifecycleEventArgs $eventArgs): void
    {
        $this->validator->validateOrException($eventArgs->getObject());
    }
}
