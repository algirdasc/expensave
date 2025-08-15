<?php

declare(strict_types=1);

namespace App\Service\PostHog;

use PostHog\PostHog;
use Symfony\Component\DependencyInjection\Attribute\Autowire;
use Throwable;

readonly class PostHogCollectorService
{
    public function __construct(
        #[Autowire('%anonymousDataCollectionDisabled%')] private bool $anonymousDataCollectionDisabled,
        #[Autowire('%env(APP_HASH)%')] private string $applicationHash,
        #[Autowire('%env(APP_ENV)%')] private string $applicationEnvironment,
        #[Autowire('%env(APP_VERSION)%')] private string $applicationVersion,
    ) {
        if ($anonymousDataCollectionDisabled) {
            return;
        }

        try {
            PostHog::init(base64_decode('cGhjX3NQV3dxZnhKekpOc0FRRjBDZmZmQUVremdTeWk3UmF1ODRWSllVa1Fyek8='), [
                'host' => 'https://eu.i.posthog.com'
            ]);
        } catch (Throwable) {
        }
    }

    public function capture(string $eventName, array $properties = []): void
    {
        if ($this->anonymousDataCollectionDisabled) {
            return;
        }

        try {
            PostHog::capture([
                'distinctId' => md5($this->applicationHash),
                'event' => $eventName,
                'properties' => [
                    '$process_person_profile' => false,
                    'app_version' => $this->applicationVersion,
                    'app_environment' => $this->applicationEnvironment,
                    ...$properties,
                ]
            ]);
        } catch (Throwable) {
        }
    }
}