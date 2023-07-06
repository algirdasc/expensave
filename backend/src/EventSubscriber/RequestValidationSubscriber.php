<?php

declare(strict_types=1);

namespace App\EventSubscriber;

use App\Controller\AbstractApiController;
use App\Exception\RequestValidationException;
use App\Request\AbstractRequest;
use App\Service\ValidationService;
use Symfony\Component\EventDispatcher\EventSubscriberInterface;
use Symfony\Component\HttpKernel\Event\ControllerArgumentsEvent;
use Symfony\Component\HttpKernel\KernelEvents;

class RequestValidationSubscriber implements EventSubscriberInterface
{
    public function __construct(
        private readonly ValidationService $validator
    ) {
    }

    public static function getSubscribedEvents(): array
    {
        return [
            KernelEvents::CONTROLLER_ARGUMENTS => ['onKernelControllerArguments', -1000],
        ];
    }

    /**
     * @throws RequestValidationException
     */
    public function onKernelControllerArguments(ControllerArgumentsEvent $event): void
    {
        $controller = is_array($event->getController()) ? $event->getController()[0] : $event->getController();

        if (!$controller instanceof AbstractApiController || !$event->isMainRequest()) {
            return;
        }

        foreach ($event->getArguments() as $argument) {
            if ($argument instanceof AbstractRequest) {
                $this->validator->validateOrException($argument);
            }
        }
    }
}
