<?php

declare(strict_types=1);

namespace App\EventSubscriber;

use Symfony\Component\EventDispatcher\EventSubscriberInterface;
use Symfony\Component\Security\Http\Event\LoginFailureEvent;

class LoginFailureSubscriber implements EventSubscriberInterface
{
    public static function getSubscribedEvents(): array
    {
        return [
            LoginFailureEvent::class => 'onLoginFailure',
        ];
    }

    public function onLoginFailure(LoginFailureEvent $event): void
    {
        /*
         * LexitJWTBundle would return JWTAuthenticationFailureResponse, so
         * we need to throw exception here to make our ErrorController do the error handling
         */
        throw $event->getException();
    }
}
