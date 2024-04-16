<?php

declare(strict_types=1);

namespace App\EventListener;

use Symfony\Component\EventDispatcher\Attribute\AsEventListener;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpKernel\Event\RequestEvent;
use Symfony\Component\HttpKernel\Event\ResponseEvent;
use Symfony\Component\HttpKernel\HttpKernelInterface;
use Symfony\Component\HttpKernel\KernelEvents;

#[AsEventListener(event: KernelEvents::REQUEST, method: 'onKernelRequest', priority: 64)]
#[AsEventListener(event: KernelEvents::RESPONSE, method: 'onKernelResponse')]
readonly class CORSResponseListener
{
    private const CORS_HEADERS = [
        'Access-Control-Allow-Origin' => '*',
        'Access-Control-Allow-Headers' => '*',
        'Access-Control-Allow-Methods' => '*',
    ];

    public function __construct(
        private string $environment
    ) {
    }

    public function onKernelRequest(RequestEvent $event): void
    {
        if ($this->environment !== 'dev') {
            return;
        }

        if ($event->getRequestType() !== HttpKernelInterface::MAIN_REQUEST) {
            return;
        }

        $request = $event->getRequest();
        if (!$request->headers->has('Origin')) {
            return;
        }

        if ($request->getMethod() === Request::METHOD_OPTIONS) {
            $event->setResponse(new Response(headers: self::CORS_HEADERS));
        }
    }

    public function onKernelResponse(ResponseEvent $event): void
    {
        if ($this->environment !== 'dev') {
            return;
        }

        $response = $event->getResponse();
        $response->headers->add(self::CORS_HEADERS);
    }
}