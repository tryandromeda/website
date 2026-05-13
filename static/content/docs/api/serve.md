---
title: "HTTP Server (Andromeda.serve)"
description: "Build HTTP services with Andromeda.serve"
section: "API Reference"
order: 23
id: "serve-api"
---

`Andromeda.serve()` starts an HTTP/1.1 server that calls your handler for each
incoming request. The handler is the same fetch-style function used by
Cloudflare Workers, Deno, and Bun — it receives a `Request` and returns a
`Response` (or `Promise<Response>`).

The serve extension is included when Andromeda is built with the `serve` feature
(enabled by default).

## Signatures

```typescript
type ServeHandler = (request: Request) => Response | Promise<Response>;

interface ServeOptions {
  port?: number; // default 8080
  hostname?: string; // default "127.0.0.1"
  signal?: AbortSignal;
  reusePort?: boolean;
  key?: string; // TLS private key (planned)
  cert?: string; // TLS certificate (planned)
  onError?: (error: unknown) => Response | Promise<Response>;
  onListen?: (info: { hostname: string; port: number }) => void;
  handler?: ServeHandler;
}

declare namespace Andromeda {
  function serve(handler: ServeHandler): Promise<void>;
  function serve(options: ServeOptions): Promise<void>;
  function serve(handler: ServeHandler, options: ServeOptions): Promise<void>;
}
```

## Hello, world

```typescript
Andromeda.serve(() => new Response("Hello, Andromeda!"));
```

Visit <http://127.0.0.1:8080>.

## With options

```typescript
Andromeda.serve({
  port: 3000,
  hostname: "0.0.0.0",
  handler: (req) => new Response(`Hello from ${req.url}`),
});
```

Or pass them as a second argument:

```typescript
Andromeda.serve(
  (req) => new Response(req.method),
  { port: 3000, hostname: "0.0.0.0" },
);
```

## Routing

There is no built-in router — use `new URL(req.url)` and match against
`pathname`:

```typescript
Andromeda.serve((req) => {
  const url = new URL(req.url);

  if (url.pathname === "/health") {
    return new Response(JSON.stringify({ ok: true }), {
      headers: { "Content-Type": "application/json" },
    });
  }

  if (url.pathname === "/echo" && req.method === "POST") {
    return req.text().then((body) => new Response(body));
  }

  if (url.pathname.startsWith("/users/")) {
    const id = url.pathname.slice("/users/".length);
    return new Response(JSON.stringify({ id }));
  }

  return new Response("Not Found", { status: 404 });
});
```

## Reading the request

```typescript
Andromeda.serve(async (req) => {
  const url = new URL(req.url);
  const method = req.method;
  const headers = req.headers;
  const body = await req.text(); // or .json(), .arrayBuffer()
  const ua = headers.get("user-agent");

  return new Response(
    JSON.stringify({ method, path: url.pathname, ua, body }),
    { headers: { "Content-Type": "application/json" } },
  );
});
```

## Writing the response

```typescript
return new Response("hello");

return new Response(JSON.stringify(data), {
  status: 201,
  headers: {
    "Content-Type": "application/json",
    "X-Trace-Id": crypto.randomUUID(),
  },
});

// Plain HTML
return new Response("<h1>Hi</h1>", {
  headers: { "Content-Type": "text/html; charset=utf-8" },
});

// Binary body
const bytes = Andromeda.readFileSync("./logo.png");
return new Response(bytes, {
  headers: { "Content-Type": "image/png" },
});
```

## Examples

The Andromeda repository contains end-to-end serve examples:

- [`examples/serve/basic.ts`](https://github.com/tryandromeda/andromeda/blob/main/examples/serve/basic.ts)
- [`examples/serve/api-server.ts`](https://github.com/tryandromeda/andromeda/blob/main/examples/serve/api-server.ts)
- [`examples/serve/headers.ts`](https://github.com/tryandromeda/andromeda/blob/main/examples/serve/headers.ts)
- [`examples/serve/json-request.ts`](https://github.com/tryandromeda/andromeda/blob/main/examples/serve/json-request.ts)
- [`examples/serve/query-params.ts`](https://github.com/tryandromeda/andromeda/blob/main/examples/serve/query-params.ts)
- [`examples/serve/routing.ts`](https://github.com/tryandromeda/andromeda/blob/main/examples/serve/routing.ts)
- [`examples/serve/user-agent.ts`](https://github.com/tryandromeda/andromeda/blob/main/examples/serve/user-agent.ts)

## Limitations

The current `Andromeda.serve` is a minimal HTTP/1.1 implementation. The
following features are on the roadmap:

- TLS / HTTPS (`key` and `cert` options)
- Connection keep-alive, chunked transfer encoding
- Multipart form handling
- HTTP/2
- WebSocket upgrades
- `signal` / `AbortController` for graceful shutdown
- `onListen` callback invocation

If your workload needs production-grade HTTP, consider running Andromeda behind
a reverse proxy such as nginx or Caddy until these gaps close.

## See Also

- [Fetch API](/docs/api/fetch) — same `Request` / `Response` types used here
- [URL API](/docs/api/url) — request parsing
- [Streams API](/docs/api/streams) — streaming bodies
