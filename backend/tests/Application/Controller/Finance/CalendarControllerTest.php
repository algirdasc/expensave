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

        $calendars = $this->indexBy($this->getJsonResponse($this->client), 'name');
        $this->assertCount(2, $calendars);
        $this->assertArrayHasKey('User 1 Calendar', $calendars);
        $this->assertArrayHasKey('Shared Calendar', $calendars);

        $this->assertIsInt($calendars['User 1 Calendar']['id']);
        $this->assertSame(-75, $calendars['User 1 Calendar']['balance']);
        $this->assertFalse($calendars['User 1 Calendar']['shared']);
        $this->assertSame('user1@email.com', $calendars['User 1 Calendar']['owner']['email']);

        $this->assertIsInt($calendars['Shared Calendar']['id']);
        $this->assertSame(0, $calendars['Shared Calendar']['balance']);
        $this->assertTrue($calendars['Shared Calendar']['shared']);
        $this->assertSame('user1@email.com', $calendars['Shared Calendar']['owner']['email']);
    }

    public function testListExpenses(): void
    {
        $calendarId = $this->getCalendarId('User 1 Calendar');

        $this->client->jsonRequest('GET', sprintf('/api/calendar/%d/expenses/2024-01-01/2024-12-31', $calendarId));

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
        $calendarId = $this->getJsonResponse($this->client)['id'];
        $this->assertIsInt($calendarId);

        // Get
        $this->client->jsonRequest('GET', sprintf('/api/calendar/%d', $calendarId));
        $this->assertResponseIsSuccessful();

        // Update
        $this->client->jsonRequest('PUT', sprintf('/api/calendar/%d', $calendarId), [
            'name' => 'Test Modified Name',
        ]);

        $this->assertResponseIsSuccessful();
        $this->assertSame('Test Modified Name', $this->getJsonResponse($this->client)['name']);

        // Delete
        $this->client->jsonRequest('DELETE', sprintf('/api/calendar/%d', $calendarId));
        $this->assertResponseIsSuccessful();

        // Get again
        $this->client->jsonRequest('GET', sprintf('/api/calendar/%d', $calendarId));
        $this->assertResponseStatusCodeSame(Response::HTTP_NOT_FOUND);
    }
}
