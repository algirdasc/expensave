<?php

declare(strict_types=1);

namespace App\EventSubscriber;

use Lexik\Bundle\JWTAuthenticationBundle\Event\AuthenticationFailureEvent;
use Lexik\Bundle\JWTAuthenticationBundle\Event\JWTExpiredEvent;
use Lexik\Bundle\JWTAuthenticationBundle\Event\JWTNotFoundEvent;
use Lexik\Bundle\JWTAuthenticationBundle\Events;
use Symfony\Component\EventDispatcher\EventSubscriberInterface;
use Symfony\Component\Security\Http\Event\LoginFailureEvent;

class LoginFailureSubscriber implements EventSubscriberInterface
{
    public static function getSubscribedEvents(): array
    {
        return [
            LoginFailureEvent::class => 'onLoginFailure',
            Events::JWT_NOT_FOUND => 'onJWTAuthenticationFailureEvent',
            Events::JWT_EXPIRED => 'onJWTAuthenticationFailureEvent',
            Events::JWT_INVALID => 'onJWTAuthenticationFailureEvent',
            Events::AUTHENTICATION_FAILURE => 'onJWTAuthenticationFailureEvent'
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

    public function onJWTAuthenticationFailureEvent(AuthenticationFailureEvent $event): void
    {
        throw $event->getException();
    }
}
