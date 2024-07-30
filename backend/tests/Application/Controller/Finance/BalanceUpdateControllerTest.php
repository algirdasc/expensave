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
        $this->assertSame(10, $this->getJsonResponse($this->client)['id']);
        $this->assertSame('Balance Update', $this->getJsonResponse($this->client)['label']);
//        $this->assertSame(350, $this->getJsonResponse($this->client)['amount']);


        // Update
        $this->client->jsonRequest('PUT', '/api/balance-update/10', [
            'label' => 'Test Modified Label',
            'calendar' => 1,
            'createdAt' => '2024-05-15 15:30:15',
            'amount' => 400,
        ]);

        $this->assertResponseIsSuccessful();
        $this->assertSame('Balance Update', $this->getJsonResponse($this->client)['label']);
//        $this->assertSame(275, $this->getJsonResponse($this->client)['amount']);

        // Delete
        $this->client->jsonRequest('DELETE', '/api/balance-update/10');
        $this->assertResponseIsSuccessful();
    }
}