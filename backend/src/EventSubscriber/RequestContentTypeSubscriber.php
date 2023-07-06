<?php

declare(strict_types=1);

namespace App\EventSubscriber;

use App\Controller\AbstractApiController;
use Symfony\Component\EventDispatcher\EventSubscriberInterface;
use Symfony\Component\HttpKernel\Event\ControllerEvent;
use Symfony\Component\HttpKernel\Event\RequestEvent;
use Symfony\Component\HttpKernel\Exception\BadRequestHttpException;
use Symfony\Component\HttpKernel\KernelEvents;

class RequestContentTypeSubscriber implements EventSubscriberInterface
{
    public static function getSubscribedEvents(): array
    {
        return [
            KernelEvents::CONTROLLER => 'onKernelController',
        ];
    }

    public function onKernelController(ControllerEvent $event): void
    {
        $controller = is_array($event->getController()) ? $event->getController()[0] : $event->getController();

        if (!$controller instanceof AbstractApiController || !$event->isMainRequest()) {
            return;
        }

        if ($event->getRequest()->getContentTypeFormat() !== $controller->getAllowedContentTypeFormat()) {
            throw new BadRequestHttpException($controller->getDisallowedContentTypeError());
        }
    }
}
