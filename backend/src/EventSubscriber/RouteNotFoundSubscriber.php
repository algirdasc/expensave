<?php

declare(strict_types=1);

namespace App\EventSubscriber;

use Symfony\Component\EventDispatcher\EventSubscriberInterface;
use Symfony\Component\HttpKernel\EventListener\RouterListener;
use Symfony\Component\HttpKernel\KernelEvents;

class RouteNotFoundSubscriber implements EventSubscriberInterface
{
    public static function getSubscribedEvents(): array
    {
        return [
        ];
    }
}