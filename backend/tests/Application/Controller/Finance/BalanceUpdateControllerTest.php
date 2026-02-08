<?php

declare(strict_types=1);

namespace App\Tests\Application\Controller\Finance;

use App\Controller\Finance\BalanceUpdateController;
use App\Tests\ApplicationTestCase;
use PHPUnit\Framework\Attributes\CoversClass;
use Symfony\Bundle\FrameworkBundle\KernelBrowser;

#[CoversClass(BalanceUpdateController::class)]
class BalanceUpdateControllerTest extends ApplicationTestCase
{
    private KernelBrowser $client;

    public function setUp(): void
    {
        parent::setUp();

        $this->client = $this->getAuthenticatedClient();
    }

    public function testBalanceUpdateLifecycle(): void
    {
        // Create
        $this->client->jsonRequest('POST', '/api/balance-update', [
            'label' => 'Test Balance Update',
            'calendar' => 1,
            'createdAt' => '2024-05-15 15:30:15',
            'amount' => 300,
        ]);

        $this->assertResponseIsSuccessful();

        $response = $this->getJsonResponse($this->client);
        $this->assertArrayHasKey('id', $response);
        $this->assertIsInt($response['id']);

        $id = $response['id'];

        // Update
        $this->client->jsonRequest('PUT', sprintf('/api/balance-update/%d', $id), [
            'label' => 'Test Modified Label',
            'calendar' => 1,
            'createdAt' => '2024-05-15 15:30:15',
            'amount' => 400,
        ]);

        $this->assertResponseIsSuccessful();

        $updated = $this->getJsonResponse($this->client);
        $this->assertArrayHasKey('id', $updated);
        $this->assertSame($id, $updated['id']);

        // Delete
        $this->client->jsonRequest('DELETE', sprintf('/api/balance-update/%d', $id));
        $this->assertResponseIsSuccessful();
    }
}
