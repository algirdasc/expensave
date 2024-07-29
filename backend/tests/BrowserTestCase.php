<?php

declare(strict_types=1);

namespace App\Tests;

use App\Entity\User;
use App\Repository\UserRepository;
use InvalidArgumentException;
use Symfony\Bundle\FrameworkBundle\KernelBrowser;
use Symfony\Bundle\FrameworkBundle\Test\WebTestCase;
use Symfony\Component\HttpFoundation\Response;

abstract class BrowserTestCase extends WebTestCase
{
    public function __construct(string $name)
    {
        parent::__construct($name);
    }

    protected function getJsonBrowser(): KernelBrowser
    {
        return static::createClient([], [
            'CONTENT_TYPE' => 'application/json'
        ]);
    }

    protected function getUser(string $name = 'User 1'): User
    {
        /** @var UserRepository $userRepository */
        $userRepository = static::getContainer()->get(UserRepository::class);
        $user = $userRepository->findOneBy(['name' => $name]);
        if ($user === null) {
            throw new InvalidArgumentException(sprintf('User by name "%s" is not found', $name));
        }

        return $user;
    }

    protected function getResponseJsonFile(string $path): string
    {
        return __DIR__ . DIRECTORY_SEPARATOR . $path;
    }

    protected function assertResponseEqualToJson(Response $response, string $jsonFile): void
    {
        $this->assertJsonStringEqualsJsonFile(
            $this->getResponseJsonFile($jsonFile),
            (string) $response->getContent()
        );
    }

    /**
     * @return array<int>
     */
    protected function getUserCalendarIds(User $user): array
    {
        $ids = [];

        foreach ($user->getCalendars() as $calendar) {
            $ids[] = (int) $calendar->getId();
        }

        foreach ($user->getSharedCalendars() as $calendar) {
            $ids[] = (int) $calendar->getId();
        }

        return $ids;
    }

    protected function getAuthenticatedJsonBrowser(?User $user = null): KernelBrowser
    {
        $browser = $this->getJsonBrowser();

        if ($user === null) {
            $user = $this->getUser();
        }

        $browser->loginUser($user);

        return $browser;
    }
}