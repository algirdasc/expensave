<?php

declare(strict_types=1);

namespace App\Tests;

use App\Entity\User;
use Symfony\Bundle\FrameworkBundle\KernelBrowser;
use Symfony\Bundle\FrameworkBundle\Test\WebTestCase;

abstract class BrowserTestCase extends WebTestCase
{
    protected function getJsonBrowser(): KernelBrowser
    {
        return static::createClient([], [
            'CONTENT_TYPE' => 'application/json'
        ]);
    }

    protected function getAuthenticatedJsonBrowser(): KernelBrowser
    {
        $browser = $this->getJsonBrowser();

        $browser->loginUser(new User());

        return $browser;
    }
}