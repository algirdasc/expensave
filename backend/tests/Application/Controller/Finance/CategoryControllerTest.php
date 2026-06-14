<?php

declare(strict_types=1);

namespace App\Tests\Application\Controller\Finance;

use App\Controller\Finance\CategoryController;
use App\Tests\ApplicationTestCase;
use PHPUnit\Framework\Attributes\CoversClass;
use Symfony\Bundle\FrameworkBundle\KernelBrowser;
use Symfony\Component\HttpFoundation\Response;

#[CoversClass(CategoryController::class)]
class CategoryControllerTest extends ApplicationTestCase
{
    private KernelBrowser $client;

    public function setUp(): void
    {
        parent::setUp();

        $this->client = $this->getAuthenticatedClient();
    }

    public function testList(): void
    {
        $this->client->jsonRequest('GET', '/api/category');
        $response = $this->client->getResponse();

        $this->assertResponseIsSuccessful();
        $this->assertResponseEqualToJson($response, 'Response/Category/category-list.json');
    }

    public function testSystemList(): void
    {
        $this->client->jsonRequest('GET', '/api/category/system');
        $response = $this->client->getResponse();

        $this->assertResponseIsSuccessful();
        $this->assertResponseEqualToJson($response, 'Response/Category/category-system-list.json');
    }

    public function testCategoryLifecycle(): void
    {
        // Create
        $this->client->jsonRequest('POST', '/api/category', [
            'name' => 'Test Name',
            'color' => '#123456',
        ]);
        $this->assertResponseIsSuccessful();
        $categoryId = $this->getJsonResponse($this->client)['id'];
        $this->assertIsInt($categoryId);

        // Get
        $this->client->jsonRequest('GET', sprintf('/api/category/%d', $categoryId));
        $this->assertResponseIsSuccessful();

        // Update
        $this->client->jsonRequest('PUT', sprintf('/api/category/%d', $categoryId), [
            'name' => 'Test Modified Name',
            'color' => '#654321',
        ]);

        $this->assertResponseIsSuccessful();
        $responseJson = json_decode((string) $this->client->getResponse()->getContent(), true);
        $this->assertSame('Test Modified Name', $responseJson['name']);

        // Delete
        $this->client->jsonRequest('DELETE', sprintf('/api/category/%d', $categoryId));
        $this->assertResponseIsSuccessful();

        // Get again
        $this->client->jsonRequest('GET', sprintf('/api/category/%d', $categoryId));
        $this->assertResponseStatusCodeSame(Response::HTTP_NOT_FOUND);
    }

    public function testDeleteSystemCategory(): void
    {
        $this->client->jsonRequest('DELETE', sprintf('/api/category/%d', $this->getCategoryId('Uncategorized')));
        $this->assertResponseStatusCodeSame(Response::HTTP_FORBIDDEN);

        $this->client->jsonRequest('DELETE', sprintf('/api/category/%d', $this->getCategoryId('Balance Update')));
        $this->assertResponseStatusCodeSame(Response::HTTP_FORBIDDEN);

    }
}
