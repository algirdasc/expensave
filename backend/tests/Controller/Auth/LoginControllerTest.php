<?php

declare(strict_types=1);

namespace App\Tests\Controller\Auth;

use App\Repository\UserRepository;
use Symfony\Bundle\FrameworkBundle\Test\WebTestCase;
use Symfony\Component\HttpFoundation\Request;

final class LoginControllerTest extends WebTestCase
{
    public function testLogin(): void
    {
        $client = static::createClient();

        $response = $client->request(Request::METHOD_POST, 'auth/login');

        $this->assertResponseIsSuccessful();
    }
}