<?php

namespace App\Tests\Controller\User;

use App\Controller\User\ProfileController;
use App\Entity\User;
use App\Repository\UserRepository;
use App\Tests\BrowserTestCase;
use PHPUnit\Framework\MockObject\MockObject;
use PHPUnit\Framework\TestCase;
use Symfony\Bundle\FrameworkBundle\KernelBrowser;
use Symfony\Bundle\FrameworkBundle\Test\WebTestCase;
use Symfony\Component\HttpFoundation\Request;

final class ProfileControllerTest extends BrowserTestCase
{
    private KernelBrowser $browser;

    protected function setUp(): void
    {
        parent::setUp();

        $this->browser = $this->getAuthenticatedJsonBrowser();
    }


    public function testList(): void
    {
        $this->browser->request(Request::METHOD_GET, '/user');

        $this->assertResponseIsSuccessful();
        // $this->assertJson();
    }

    public function testProfile(): void
    {
        $this->browser->request(Request::METHOD_GET, '/user/profile');

        $this->assertResponseIsSuccessful();
    }

    public function testUpdate(): void
    {
        $this->browser->request(Request::METHOD_PUT, '/user/profile');

        $this->assertResponseIsSuccessful();
    }
}
