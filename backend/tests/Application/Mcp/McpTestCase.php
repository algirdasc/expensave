<?php

declare(strict_types=1);

namespace App\Tests\Application\Mcp;

use App\Entity\User;
use App\Tests\ApplicationTestCase;
use RuntimeException;
use stdClass;
use Symfony\Bundle\FrameworkBundle\KernelBrowser;

abstract class McpTestCase extends ApplicationTestCase
{
    private const string PROTOCOL_VERSION = '2025-11-25';

    private int $requestId = 0;

    protected function getMcpClient(?User $user = null): KernelBrowser
    {
        $client = $this->getAuthenticatedClient($user);
        $client->setServerParameter('HTTP_ACCEPT', 'application/json, text/event-stream');

        $this->mcpRequest($client, 'initialize', [
            'protocolVersion' => self::PROTOCOL_VERSION,
            'capabilities' => new stdClass(),
            'clientInfo' => ['name' => 'phpunit', 'version' => '1.0'],
        ]);

        $sessionId = $client->getResponse()->headers->get('Mcp-Session-Id');
        if ($sessionId === null) {
            throw new RuntimeException(sprintf('MCP initialize failed: %s', $client->getResponse()->getContent()));
        }

        $client->setServerParameter('HTTP_MCP_SESSION_ID', $sessionId);
        $this->mcpRequest($client, 'notifications/initialized');

        return $client;
    }

    /**
     * @param array<string, mixed> $arguments
     *
     * @return array<string, mixed> the "result" payload of the JSON-RPC response
     */
    protected function callMcpTool(KernelBrowser $client, string $tool, array $arguments = []): array
    {
        $response = $this->mcpRequest($client, 'tools/call', [
            'name' => $tool,
            'arguments' => $arguments,
        ]);

        if (isset($response['error'])) {
            throw new RuntimeException(sprintf('MCP tool "%s" failed: %s', $tool, json_encode($response['error'])));
        }

        return $response['result'] ?? [];
    }

    /**
     * @return array<string, mixed> the tool result decoded from its text content
     */
    protected function callMcpToolForContent(KernelBrowser $client, string $tool, array $arguments = []): array
    {
        $result = $this->callMcpTool($client, $tool, $arguments);

        return json_decode($result['content'][0]['text'] ?? '', true) ?? [];
    }

    /**
     * @param array<string, mixed> $params
     *
     * @return array<string, mixed>
     */
    protected function mcpRequest(KernelBrowser $client, string $method, array $params = []): array
    {
        $payload = [
            'jsonrpc' => '2.0',
            'method' => $method,
        ];

        if (!str_starts_with($method, 'notifications/')) {
            $payload['id'] = ++$this->requestId;
        }

        if ($params !== []) {
            $payload['params'] = $params;
        }

        $client->jsonRequest('POST', '/_mcp', $payload);

        return json_decode($client->getResponse()->getContent(), true) ?? [];
    }
}
