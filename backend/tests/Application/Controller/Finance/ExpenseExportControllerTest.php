<?php

declare(strict_types=1);

namespace App\Tests\Application\Controller\Finance;

use App\Tests\ApplicationTestCase;
use Symfony\Bundle\FrameworkBundle\KernelBrowser;
use Symfony\Component\HttpFoundation\Response;

class ExpenseExportControllerTest extends ApplicationTestCase
{
    private KernelBrowser $client;

    public function setUp(): void
    {
        parent::setUp();

        $this->client = $this->getAuthenticatedClient();
    }

    public function testExpenseExport(): void
    {
        $calendarId = $this->getCalendarId('User 1 Calendar');

        $this->client->request('GET', sprintf('/api/calendar/%d/export/2024-01-01/2024-12-31', $calendarId));

        $this->assertResponseIsSuccessful();
        $this->assertStringStartsWith('text/csv', (string) $this->client->getResponse()->headers->get('Content-Type'));
        $this->assertSame(
            'attachment; filename="expenses-user-1-calendar-2024-01-01-2024-12-31.csv"',
            $this->client->getResponse()->headers->get('Content-Disposition')
        );

        $rows = array_map('str_getcsv', array_filter(explode("\n", $this->getStreamedContent())));

        $this->assertSame(
            ['date', 'label', 'category', 'calendar', 'amount', 'user', 'description', 'confirmed'],
            $rows[0]
        );
        $this->assertCount(5, $rows);

        $this->assertSame(
            ['2024-01-05 12:00:00', 'Test expense 0', 'Category 1', 'User 1 Calendar', '-75', 'user1@email.com', '', '1'],
            $rows[1]
        );
        $this->assertSame(
            ['2024-04-20 12:00:00', 'Test expense 3', 'Uncategorized', 'User 1 Calendar', '-9', 'user1@email.com', '', '0'],
            $rows[4]
        );
    }

    public function testExpenseExportDateRange(): void
    {
        $calendarId = $this->getCalendarId('User 1 Calendar');

        $this->client->request('GET', sprintf('/api/calendar/%d/export/2024-02-01/2024-03-31', $calendarId));

        $this->assertResponseIsSuccessful();

        $rows = array_filter(explode("\n", $this->getStreamedContent()));
        $this->assertCount(3, $rows);
    }

    private function getStreamedContent(): string
    {
        $response = $this->client->getResponse();

        ob_start();
        $response->sendContent();

        return (string) ob_get_clean();
    }

    public function testExpenseExportForbidden(): void
    {
        $calendarId = $this->getCalendarId('User 2 Calendar');

        $this->client->request('GET', sprintf('/api/calendar/%d/export/2024-01-01/2024-12-31', $calendarId));

        $this->assertResponseStatusCodeSame(Response::HTTP_FORBIDDEN);
    }
}
