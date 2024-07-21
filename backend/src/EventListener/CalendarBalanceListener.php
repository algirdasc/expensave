<?php

declare(strict_types=1);

namespace App\EventListener;

use App\Entity\Expense;
use Doctrine\Bundle\DoctrineBundle\Attribute\AsEntityListener;
use Doctrine\ORM\EntityManagerInterface;
use Doctrine\ORM\Events;
use Doctrine\Persistence\Event\LifecycleEventArgs;

#[AsEntityListener(event: Events::postUpdate, entity: Expense::class)]
#[AsEntityListener(event: Events::postRemove, entity: Expense::class)]
#[AsEntityListener(event: Events::postPersist, entity: Expense::class)]
class CalendarBalanceListener
{
    /**
     * @param LifecycleEventArgs<EntityManagerInterface> $eventArgs
     */
    public function postUpdate(Expense $expense, LifecycleEventArgs $eventArgs): void
    {
        /** @var EntityManagerInterface $entityManager */
        $entityManager = $eventArgs->getObjectManager();
        $changes = $entityManager->getUnitOfWork()->getEntityChangeSet($expense);

        if (empty($changes['amount'])) {
            return;
        }

        $expense
            ->getCalendar()
            ->subBalance($changes['amount'][0])
            ->addBalance($changes['amount'][1])
        ;

        $entityManager->flush();
    }

    /**
     * @param LifecycleEventArgs<EntityManagerInterface> $eventArgs
     */
    public function postRemove(Expense $expense, LifecycleEventArgs $eventArgs): void
    {
        $expense
            ->getCalendar()
            ->subBalance($expense->getAmount())
        ;

        $eventArgs->getObjectManager()->flush();
    }

    /**
     * @param LifecycleEventArgs<EntityManagerInterface> $eventArgs
     */
    public function postPersist(Expense $expense, LifecycleEventArgs $eventArgs): void
    {
        /** @var Expense $expense */
        $expense->getCalendar()->addBalance($expense->getAmount());

        $eventArgs->getObjectManager()->flush();
    }
}
