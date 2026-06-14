<?php

declare(strict_types=1);

namespace App\Tests\Application\Controller\Finance;

use App\Controller\Finance\BalanceUpdateController;
use App\Tests\ApplicationTestCase;
use PHPUnit\Framework\Attributes\CoversClass;
use Symfony\Bundle\FrameworkBundle\KernelBrowser;
use Symfony\Component\HttpFoundation\Response;

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
        $calendarId = $this->getCalendarId('User 1 Calendar');

        // Create
        $this->client->jsonRequest('POST', '/api/balance-update', [
            'label' => 'Test Balance Update',
            'calendar' => $calendarId,
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
            'calendar' => $calendarId,
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

    public function testUpdateMissingBalanceUpdateReturnsNotFound(): void
    {
        $this->client->jsonRequest('PUT', '/api/balance-update/999999', [
            'calendar' => $this->getCalendarId('User 1 Calendar'),
            'createdAt' => '2024-05-15 15:30:15',
            'amount' => 400,
        ]);

        $this->assertResponseStatusCodeSame(Response::HTTP_NOT_FOUND);
    }

    public function testUpdateRegularExpenseAsBalanceUpdateReturnsNotFound(): void
    {
        $this->client->jsonRequest('PUT', sprintf('/api/balance-update/%d', $this->getExpenseId('Test expense 0', 'User 1 Calendar')), [
            'calendar' => $this->getCalendarId('User 1 Calendar'),
            'createdAt' => '2024-05-15 15:30:15',
            'amount' => 400,
        ]);

        $this->assertResponseStatusCodeSame(Response::HTTP_NOT_FOUND);
    }

    public function testDeleteRegularExpenseAsBalanceUpdateReturnsNotFound(): void
    {
        $this->client->jsonRequest('DELETE', sprintf('/api/balance-update/%d', $this->getExpenseId('Test expense 0', 'User 1 Calendar')));

        $this->assertResponseStatusCodeSame(Response::HTTP_NOT_FOUND);
    }

    public function testUpdateExcludesExistingBalanceUpdateFromAmountCalculation(): void
    {
        $calendarId = $this->getCalendarId('User 1 Calendar');

        $this->client->jsonRequest('POST', '/api/balance-update', [
            'calendar' => $calendarId,
            'createdAt' => '2024-05-15 15:30:15',
            'amount' => 300,
        ]);

        $this->assertResponseIsSuccessful();
        $balanceUpdateId = $this->getJsonResponse($this->client)['id'];

        $this->client->jsonRequest('PUT', sprintf('/api/balance-update/%d', $balanceUpdateId), [
            'calendar' => $calendarId,
            'createdAt' => '2024-12-31 15:30:15',
            'amount' => 400,
        ]);

        $this->assertResponseIsSuccessful();
        $this->assertSame(420, $this->getJsonResponse($this->client)['amount']);
    }

    public function testCreateWithInvalidPayloadReturnsValidationError(): void
    {
        $this->client->jsonRequest('POST', '/api/balance-update', [
            'calendar' => $this->getCalendarId('User 1 Calendar'),
            'createdAt' => '2024-05-15 15:30:15',
            'amount' => 0,
        ]);

        $this->assertResponseStatusCodeSame(Response::HTTP_UNPROCESSABLE_ENTITY);

        $response = $this->getJsonResponse($this->client);
        $this->assertSame('App\Exception\RequestValidationException', $response['throwable']);
        $this->assertSame('amount', $response['messages'][0]['propertyPath']);
    }
}
