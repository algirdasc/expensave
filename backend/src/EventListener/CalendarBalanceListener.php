<?php

declare(strict_types=1);

namespace App\EventListener;

use App\Entity\Expense;
use Doctrine\ORM\EntityManagerInterface;
use Doctrine\Persistence\Event\LifecycleEventArgs;

class CalendarBalanceListener
{
    public function postUpdate(Expense $expense, LifecycleEventArgs $eventArgs): void
    {
        // TODO: phpstan fixes needed
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

        $eventArgs->getObjectManager()->flush();
    }

    public function postRemove(Expense $expense, LifecycleEventArgs $eventArgs): void
    {
        $expense
            ->getCalendar()
            ->subBalance($expense->getAmount())
        ;

        $eventArgs->getObjectManager()->flush();
    }

    public function postPersist(Expense $expense, LifecycleEventArgs $eventArgs): void
    {
        /** @var Expense $expense */
        $expense->getCalendar()->addBalance($expense->getAmount());

        $eventArgs->getObjectManager()->flush();
    }
}
