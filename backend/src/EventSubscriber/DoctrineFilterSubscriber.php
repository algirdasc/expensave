<?php

declare(strict_types=1);

namespace App\EventSubscriber;

use App\DoctrineFilter\DoctrineFilterInterface;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\SecurityBundle\Security;
use Symfony\Component\DependencyInjection\Attribute\TaggedIterator;
use Symfony\Component\EventDispatcher\EventSubscriberInterface;
use Symfony\Component\HttpKernel\KernelEvents;

readonly class DoctrineFilterSubscriber implements EventSubscriberInterface
{
    /**
     * @param iterable<DoctrineFilterInterface> $doctrineFilters
     */
    public function __construct(
        private EntityManagerInterface $entityManager,
        private Security $security,
        #[TaggedIterator('app.doctrine.filter')] private iterable $doctrineFilters
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
        foreach ($this->doctrineFilters as $doctrineFilter) {
            /** @var DoctrineFilterInterface $filter */
            $filter = $this->entityManager->getFilters()->enable($doctrineFilter->getName());
            $filter
                ->setUser($this->security->getUser())
                ->setEntityManager($this->entityManager)
            ;
        }
    }
}
