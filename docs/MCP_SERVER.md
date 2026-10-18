# MCP server

Expensave exposes an [MCP (Model Context Protocol)](https://modelcontextprotocol.io/) server so AI
agents and MCP-capable clients (Claude, Cursor, pi, etc.) can manage expenses programmatically.

- Endpoint: `POST /_mcp` (streamable HTTP transport)
- Server name: `expensave`
- Tools live under `backend/src/Mcp/`; inspect them with `php bin/console debug:mcp`

## Authentication

The endpoint sits behind the same stateless JWT firewall as the REST API: send a valid Bearer token
with every request. Obtain a token from the REST login endpoint and configure it in your MCP client:

```bash
curl -X POST https://your-expensave-host/api/auth/login \
    -H 'Content-Type: application/json' \
    -d '{"email": "you@example.com", "password": "your-password"}'
```

Client configuration example (Claude Desktop / Cursor style):

```json
{
    "mcpServers": {
        "expensave": {
            "url": "https://your-expensave-host/_mcp",
            "headers": {
                "Authorization": "Bearer <token>"
            }
        }
    }
}
```

JWTs expire — refresh them via `/api/auth/refresh-token`, same as the frontend does. OAuth 2.1
discovery and dynamic client registration (per the MCP Authorization spec) are planned as a
follow-up phase.

## DNS rebinding protection / allowed hosts

The HTTP transport only accepts requests whose `Host` header matches the allowlist in
`MCP_ALLOWED_HOSTS` (comma-separated hostnames, without port). The default is
`localhost,127.0.0.1`. Set it to your public domain when deploying:

```dotenv
MCP_ALLOWED_HOSTS=expensave.example.com
```

## Running behind a reverse proxy (Docker)

When Expensave runs behind a reverse proxy (nginx, Traefik, Caddy, ...), Symfony must trust the
proxy so request scheme/host/port are derived from the `X-Forwarded-*` headers. Configure:

```dotenv
SYMFONY_TRUSTED_PROXIES=10.0.0.0/8,172.16.0.0/12,192.168.0.0/16
```

and make sure the proxy forwards the original `Host` header (and passes `Authorization` through
untouched), otherwise requests fail with `403 Forbidden: Invalid Host header` or `401`.

If the proxy terminates TLS, also forward `X-Forwarded-Proto` so generated URLs keep the `https`
scheme. The MCP endpoint itself is stateless and needs no sticky sessions.
