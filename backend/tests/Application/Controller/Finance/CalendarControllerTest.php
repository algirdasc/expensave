<?php

declare(strict_types=1);

namespace App\Tests\Application\Controller\Finance;

use App\Controller\Finance\CalendarController;
use App\Tests\ApplicationTestCase;
use PHPUnit\Framework\Attributes\CoversClass;
use Symfony\Bundle\FrameworkBundle\KernelBrowser;
use Symfony\Component\HttpFoundation\Response;

#[CoversClass(CalendarController::class)]
class CalendarControllerTest extends ApplicationTestCase
{
    private KernelBrowser $client;

    public function setUp(): void
    {
        parent::setUp();

        $this->client = $this->getAuthenticatedClient();
    }

    public function testList(): void
    {
        $this->client->jsonRequest('GET', '/api/calendar');

        $this->assertResponseIsSuccessful();
        $this->assertResponseEqualToJson($this->client->getResponse(), 'Response/Calendar/calendar-list.json');
    }

    public function testListExpenses(): void
    {
        $this->client->jsonRequest('GET', '/api/calendar/1/expenses/2024-01-01/2024-12-31');

        $json = $this->getJsonResponse($this->client);

        $this->assertResponseIsSuccessful();
        $this->assertArrayHasKey('expenses', $json);
        $this->assertArrayHasKey('expenseBalances', $json);
        $this->assertArrayHasKey('calendar', $json);

        $this->assertCount(4, $json['expenses']);
    }

    public function testCalendarLifecycle(): void
    {
        // Create
        $this->client->jsonRequest('POST', '/api/calendar', [
            'name' => 'Test Calendar',
        ]);

        $this->assertResponseIsSuccessful();
        $this->assertSame(4, $this->getJsonResponse($this->client)['id']);

        // Get
        $this->client->jsonRequest('GET', '/api/calendar/4');
        $this->assertResponseIsSuccessful();

        // Update
        $this->client->jsonRequest('PUT', "/api/calendar/4", [
            'name' => 'Test Modified Name',
        ]);

        $this->assertResponseIsSuccessful();
        $this->assertSame('Test Modified Name', $this->getJsonResponse($this->client)['name']);

        // Delete
        $this->client->jsonRequest('DELETE', "/api/calendar/4");
        $this->assertResponseIsSuccessful();

        // Get again
        $this->client->jsonRequest('GET', "/api/calendar/4");
        $this->assertResponseStatusCodeSame(Response::HTTP_NOT_FOUND);
    }
}