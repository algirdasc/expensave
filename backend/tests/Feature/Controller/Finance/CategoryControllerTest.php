<?php

declare(strict_types=1);

namespace App\Tests\Feature\Controller\Finance;

use App\Controller\Finance\CategoryController;
use App\Tests\BrowserTestCase;
use PHPUnit\Framework\Attributes\CoversClass;
use Symfony\Bundle\FrameworkBundle\KernelBrowser;

#[CoversClass(CategoryController::class)]
class CategoryControllerTest extends BrowserTestCase
{
    private KernelBrowser $browser;

    public function setUp(): void
    {
        parent::setUp();

        $this->browser = $this->getAuthenticatedJsonBrowser();
    }

    public function testList(): void
    {
        $this->browser->request('GET', '/api/category');
        $response = $this->browser->getResponse();

        $this->assertResponseIsSuccessful();
        $this->assertResponseEqualToJson($response, 'Response/Category/category-list.json');
    }
    public function testSystemList(): void
    {
        $this->browser->request('GET', '/api/category/system');
        $response = $this->browser->getResponse();

        $this->assertResponseIsSuccessful();
        $this->assertResponseEqualToJson($response, 'Response/Category/category-system-list.json');
    }

    public function testGetCategory(): void
    {
        $this->browser->request('GET', '/api/category/1');
        $response = $this->browser->getResponse();

        $this->assertResponseIsSuccessful();
        $this->assertResponseEqualToJson($response, 'Response/Category/category-system-list.json');
    }

    public function testUpdateCategory(): void
    {
        $this->browser->request('PUT', '/api/category/1');
        $response = $this->browser->getResponse();

        $this->assertResponseIsSuccessful();
        $this->assertResponseEqualToJson($response, 'Response/Category/category-system-list.json');
    }

    public function testRemoveCategory(): void
    {
        $this->browser->request('DELETE', '/api/category/1');
        $response = $this->browser->getResponse();

        $this->assertResponseIsSuccessful();
        $this->assertResponseEqualToJson($response, 'Response/Category/category-system-list.json');
    }
}