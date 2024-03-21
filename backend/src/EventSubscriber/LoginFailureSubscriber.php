<?php

declare(strict_types=1);

namespace App\EventSubscriber;

use Lexik\Bundle\JWTAuthenticationBundle\Event\AuthenticationFailureEvent;
use Lexik\Bundle\JWTAuthenticationBundle\Event\JWTNotFoundEvent;
use Lexik\Bundle\JWTAuthenticationBundle\Events;
use Lexik\Bundle\JWTAuthenticationBundle\Exception\MissingTokenException;
use Symfony\Component\EventDispatcher\EventSubscriberInterface;
use Symfony\Component\Security\Http\Event\LoginFailureEvent;

class LoginFailureSubscriber implements EventSubscriberInterface
{
    public static function getSubscribedEvents(): array
    {
        return [
            LoginFailureEvent::class => 'onLoginFailure',
            Events::JWT_NOT_FOUND => 'onJWTNotFoundEvent',
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

    public function onJWTNotFoundEvent(JWTNotFoundEvent $event): void
    {
        throw new MissingTokenException('Invalid credentials');
    }

    public function onJWTAuthenticationFailureEvent(AuthenticationFailureEvent $event): void
    {
        throw $event->getException();
    }
}
