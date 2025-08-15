<?php

declare(strict_types=1);

namespace App\EventSubscriber;

use App\Service\PostHog\PostHogCollectorService;
use Symfony\Component\EventDispatcher\EventSubscriberInterface;
use Symfony\Component\HttpKernel\Event\ExceptionEvent;
use Symfony\Component\HttpKernel\KernelEvents;
use Symfony\Component\Security\Core\Exception\BadCredentialsException;

readonly class PostHogExceptionSubscriber implements EventSubscriberInterface
{
    private const array IGNORED_EXCEPTIONS = [
        BadCredentialsException::class,
    ];

    public function __construct(
        private PostHogCollectorService $collectorService
    ) {
    }

    public static function getSubscribedEvents(): array
    {
        return [
            KernelEvents::EXCEPTION => ['onKernelException', 1000],
        ];
    }

    public function onKernelException(ExceptionEvent $event): void
    {
        $exception = $event->getThrowable();

        if (in_array($exception::class, self::IGNORED_EXCEPTIONS)) {
            return;
        }

        $this->collectorService->capture(
            eventName: '$exception',
            properties: [
                '$exception_fingerprint' => sha1(microtime(true) . $exception::class),
                '$exception_list' => [
                    [
                        'type' => $exception::class,
                        'value' => $exception->getMessage(),
                    ],
                ],
            ],
        );
    }
}