<?php

declare(strict_types=1);

namespace App\EventListener;

use Doctrine\Bundle\DoctrineBundle\Attribute\AsDoctrineListener;
use Doctrine\ORM\Event\LoadClassMetadataEventArgs;
use Doctrine\ORM\Events;
use Doctrine\ORM\Mapping\ClassMetadata;

#[AsDoctrineListener(event: Events::loadClassMetadata)]
class DoctrineTrackingPolicyListener
{
    public function __invoke(LoadClassMetadataEventArgs $args): void
    {
        $classMetadata = $args->getClassMetadata();
        $classMetadata->setChangeTrackingPolicy(
            ClassMetadata::CHANGETRACKING_DEFERRED_EXPLICIT
        );
    }
}
