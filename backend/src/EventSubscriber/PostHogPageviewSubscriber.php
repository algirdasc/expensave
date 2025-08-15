<?php

declare(strict_types=1);

namespace App\EventSubscriber;

use App\Service\PostHog\PostHogCollectorService;
use Symfony\Component\EventDispatcher\EventSubscriberInterface;
use Symfony\Component\HttpKernel\Event\ControllerEvent;
use Symfony\Component\HttpKernel\KernelEvents;

readonly class PostHogPageviewSubscriber implements EventSubscriberInterface
{
    public function __construct(
        private PostHogCollectorService $collectorService
    ) {
    }

    public static function getSubscribedEvents(): array
    {
        return [
            KernelEvents::CONTROLLER => ['onKernelController', 1000],
        ];
    }

    public function onKernelController(ControllerEvent $event): void
    {
        $request = $event->getRequest();

        $this->collectorService->capture(
            eventName: '$pageview',
            properties: [
                '$current_url' => $request->getRequestUri(),
            ]
        );
    }
}