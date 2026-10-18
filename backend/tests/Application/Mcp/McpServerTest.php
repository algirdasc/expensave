<?php

declare(strict_types=1);

namespace App\Tests\Application\Mcp;

use App\Mcp\PingTool;
use PHPUnit\Framework\Attributes\CoversClass;
use Symfony\Bundle\FrameworkBundle\Console\Application;
use Symfony\Component\Console\Tester\CommandTester;
use Symfony\Component\HttpFoundation\Response;

#[CoversClass(PingTool::class)]
class McpServerTest extends McpTestCase
{
    public function testUnauthenticatedRequestIsRejected(): void
    {
        $client = self::getContainer()->get('test.client');
        self::getClient($client);
        $client->jsonRequest('POST', '/_mcp', [
            'jsonrpc' => '2.0',
            'id' => 1,
            'method' => 'initialize',
            'params' => [],
        ]);

        $this->assertResponseStatusCodeSame(Response::HTTP_UNAUTHORIZED);
    }

    public function testPing(): void
    {
        $result = $this->callMcpTool($this->getMcpClient(), 'ping');

        $this->assertFalse($result['isError']);
        $this->assertSame('pong', $result['content'][0]['text']);
    }

    public function testDebugMcpCommandListsTools(): void
    {
        $application = new Application(self::$kernel);

        $commandTester = new CommandTester($application->find('debug:mcp'));
        $commandTester->execute([]);

        $commandTester->assertCommandIsSuccessful();
        $this->assertStringContainsString('ping', $commandTester->getDisplay());
    }
}
