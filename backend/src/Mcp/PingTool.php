<?php

declare(strict_types=1);

namespace App\Mcp;

use Mcp\Capability\Attribute\McpTool;

#[McpTool(name: 'ping', description: 'Check connectivity with the Expensave MCP server.')]
final class PingTool
{
    public function __invoke(): string
    {
        return 'pong';
    }
}
