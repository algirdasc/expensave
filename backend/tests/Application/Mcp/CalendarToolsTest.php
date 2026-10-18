<?php

declare(strict_types=1);

namespace App\Tests\Application\Mcp;

use App\Mcp\CalendarTools;
use PHPUnit\Framework\Attributes\CoversClass;

#[CoversClass(CalendarTools::class)]
class CalendarToolsTest extends McpTestCase
{
    public function testListCalendars(): void
    {
        $calendars = $this->callMcpToolForContent($this->getMcpClient(), 'list-calendars');

        $indexed = $this->indexBy($calendars, 'name');

        $this->assertCount(2, $indexed);
        $this->assertArrayHasKey('User 1 Calendar', $indexed);
        $this->assertArrayHasKey('Shared Calendar', $indexed);
        $this->assertFalse($indexed['User 1 Calendar']['shared']);
        $this->assertTrue($indexed['Shared Calendar']['shared']);
        $this->assertSame('user1@email.com', $indexed['User 1 Calendar']['owner']['email']);
    }

    public function testListCalendarsAsCollaborator(): void
    {
        $calendars = $this->callMcpToolForContent($this->getMcpClient($this->getUser('User 2')), 'list-calendars');

        $this->assertSame(['Shared Calendar', 'User 2 Calendar'], array_column($calendars, 'name'));
    }

    public function testGetCalendar(): void
    {
        $calendar = $this->callMcpToolForContent($this->getMcpClient(), 'get-calendar', [
            'calendarId' => $this->getCalendarId('Shared Calendar'),
        ]);

        $this->assertSame('Shared Calendar', $calendar['name']);
        $this->assertSame(['user2@email.com'], array_column($calendar['collaborators'], 'email'));
    }

    public function testGetForeignCalendarIsDenied(): void
    {
        $result = $this->callMcpTool($this->getMcpClient(), 'get-calendar', [
            'calendarId' => $this->getCalendarId('User 2 Calendar'),
        ]);

        $this->assertTrue($result['isError']);
        $this->assertStringContainsString('denied', $result['content'][0]['text']);
    }

    public function testGetMissingCalendarFails(): void
    {
        $result = $this->callMcpTool($this->getMcpClient(), 'get-calendar', ['calendarId' => 999999]);

        $this->assertTrue($result['isError']);
        $this->assertStringContainsString('not found', $result['content'][0]['text']);
    }
}
