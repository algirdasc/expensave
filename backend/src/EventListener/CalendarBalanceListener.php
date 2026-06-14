<?php

declare(strict_types=1);

namespace App\EventListener;

use App\Entity\Calendar;
use App\Entity\Expense;
use Doctrine\Bundle\DoctrineBundle\Attribute\AsDoctrineListener;
use Doctrine\ORM\EntityManagerInterface;
use Doctrine\ORM\Event\OnFlushEventArgs;
use Doctrine\ORM\Events;

#[AsDoctrineListener(event: Events::onFlush)]
class CalendarBalanceListener
{
    public function onFlush(OnFlushEventArgs $eventArgs): void
    {
        /** @var EntityManagerInterface $entityManager */
        $entityManager = $eventArgs->getObjectManager();
        $unitOfWork = $entityManager->getUnitOfWork();

        /** @var array<int, array{calendar: Calendar, delta: float}> $balanceChanges */
        $balanceChanges = [];

        foreach ($unitOfWork->getScheduledEntityInsertions() as $entity) {
            if ($entity instanceof Expense && $entity->isConfirmed()) {
                $this->addBalanceChange($balanceChanges, $entity->getCalendar(), $entity->getAmount());
            }
        }

        foreach ($unitOfWork->getScheduledEntityUpdates() as $entity) {
            if (!$entity instanceof Expense) {
                continue;
            }

            $changeSet = $unitOfWork->getEntityChangeSet($entity);
            if (!$this->hasBalanceChange($changeSet)) {
                continue;
            }

            /** @var Calendar $oldCalendar */
            $oldCalendar = $changeSet['calendar'][0] ?? $entity->getCalendar();
            $oldAmount = (float) ($changeSet['amount'][0] ?? $entity->getAmount());
            $oldConfirmed = (bool) ($changeSet['confirmed'][0] ?? $entity->isConfirmed());

            if ($oldConfirmed) {
                $this->addBalanceChange($balanceChanges, $oldCalendar, -$oldAmount);
            }

            if ($entity->isConfirmed()) {
                $this->addBalanceChange($balanceChanges, $entity->getCalendar(), $entity->getAmount());
            }
        }

        foreach ($unitOfWork->getScheduledEntityDeletions() as $entity) {
            if ($entity instanceof Expense && $entity->isConfirmed()) {
                $this->addBalanceChange($balanceChanges, $entity->getCalendar(), -$entity->getAmount());
            }
        }

        $calendarMetadata = $entityManager->getClassMetadata(Calendar::class);
        foreach ($balanceChanges as $balanceChange) {
            if ($balanceChange['delta'] === 0.0) {
                continue;
            }

            $balanceChange['calendar']->addBalance($balanceChange['delta']);
            $unitOfWork->recomputeSingleEntityChangeSet($calendarMetadata, $balanceChange['calendar']);
        }
    }

    /**
     * @param array<int, array{calendar: Calendar, delta: float}> $balanceChanges
     */
    private function addBalanceChange(array &$balanceChanges, Calendar $calendar, float $delta): void
    {
        $key = spl_object_id($calendar);
        $balanceChanges[$key] ??= [
            'calendar' => $calendar,
            'delta' => 0.0,
        ];
        $balanceChanges[$key]['delta'] += $delta;
    }

    /**
     * @param array<string, mixed> $changeSet
     */
    private function hasBalanceChange(array $changeSet): bool
    {
        return isset($changeSet['amount'])
            || isset($changeSet['calendar'])
            || isset($changeSet['confirmed']);
    }
}
