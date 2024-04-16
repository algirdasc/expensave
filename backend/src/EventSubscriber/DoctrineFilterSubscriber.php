<?php

declare(strict_types=1);

namespace App\EventSubscriber;

use App\DoctrineFilter\CalendarFilter;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\SecurityBundle\Security;
use Symfony\Component\EventDispatcher\EventSubscriberInterface;
use Symfony\Component\HttpKernel\KernelEvents;

readonly class DoctrineFilterSubscriber implements EventSubscriberInterface
{
    public function __construct(
        private EntityManagerInterface $entityManager,
        private Security $security,
    ) {
    }

    public static function getSubscribedEvents(): array
    {
        return [
            KernelEvents::REQUEST => 'onKernelRequest',
        ];
    }

    public function onKernelRequest(): void
    {
        /** @var CalendarFilter $filter */
        $filter = $this->entityManager->getFilters()->enable('calendar');
        $filter
            ->setUser($this->security->getUser())
            ->setEntityManager($this->entityManager)
        ;
    }
}
