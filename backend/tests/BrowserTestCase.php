<?php

declare(strict_types=1);

namespace App\Tests;

use App\Entity\User;
use App\Repository\UserRepository;
use InvalidArgumentException;
use Symfony\Bundle\FrameworkBundle\KernelBrowser;
use Symfony\Bundle\FrameworkBundle\Test\WebTestCase;

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

    protected function getAuthenticatedJsonBrowser(int $userId = 1): KernelBrowser
    {
        $browser = $this->getJsonBrowser();

        /** @var UserRepository $userRepository */
        $userRepository = static::getContainer()->get(UserRepository::class);
        $user = $userRepository->find($userId);
        if ($user === null) {
            throw new InvalidArgumentException(sprintf('User by ID "%d" is not found', $userId));
        }

        $browser->loginUser($user);

        return $browser;
    }
}