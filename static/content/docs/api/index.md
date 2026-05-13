---
title: "API Reference"
description: "Comprehensive documentation for all APIs available in Andromeda"
section: "API Reference"
order: 1
id: "api-overview"
---

This section documents every API surface that Andromeda exposes to user code.
APIs follow web standards wherever possible and ship as runtime extensions that
can be feature-gated at build time.

## Runtime APIs

- **[Console API](/docs/api/console)** — `console.log` and friends, with styling
  support
- **[Performance API](/docs/api/performance)** — `performance.now`, marks,
  measures, and entries
- **[Process API](/docs/api/process)** — `Andromeda.args`, `env`, `exit`,
  signals, and the `Command` subprocess class
- **[Time API](/docs/api/time)** — `setTimeout`, `setInterval`,
  `Andromeda.sleep`

## File System APIs

- **[File System API](/docs/api/file-system)** — Sync and async file and
  directory operations on the `Andromeda` namespace
- **[File API](/docs/api/file)** — Web-standard `Blob`, `File`, and FormData
  types

## Database APIs

- **[SQLite API](/docs/api/sqlite)** — `DatabaseSync` / `Database` with prepared
  statements and transactions

## Storage APIs

- **[Web Storage API](/docs/api/web-storage)** — Persistent `localStorage` and
  `sessionStorage` backed by SQLite
- **[Cache Storage API](/docs/api/cache-storage)** — Web-standard cache storage
  for HTTP responses

## Network APIs

- **[Fetch API](/docs/api/fetch)** — `fetch`, `Request`, `Response`, `Headers`
- **[HTTP Server (Andromeda.serve)](/docs/api/serve)** — Build HTTP services
  with a fetch-style handler
- **[URL API](/docs/api/url)** — `URL` and `URLSearchParams`

## Module System

- **[Import Maps](/docs/api/import-maps)** — Bare specifiers, scoped mappings,
  integrity metadata

## Graphics APIs

- **[Canvas API](/docs/api/canvas)** — GPU-accelerated 2D `OffscreenCanvas` with
  PNG/JPEG export, paths, gradients, text, and image data
- **[Window API](/docs/api/window)** — Native OS windows via winit, with
  canvas-aware presentation (`window` feature)

## Cryptography APIs

- **[Crypto API](/docs/api/crypto)** — `crypto.randomUUID`,
  `crypto.getRandomValues`, full `SubtleCrypto` surface

## Web Standard APIs

- **[Web APIs](/docs/api/web)** — Events (`EventTarget`, `Event`,
  `CustomEvent`), `TextEncoder`/`TextDecoder`, `AbortController`, `AbortSignal`,
  `structuredClone`, `atob` / `btoa`, `navigator`
- **[Streams API](/docs/api/streams)** — `ReadableStream`, `WritableStream`,
  `TransformStream`, queuing strategies
- **[Web Locks API](/docs/api/web-locks)** — `navigator.locks` for coordinating
  shared resources

## Utility APIs

- **[Cron API](/docs/api/cron)** — `Andromeda.cron` with cron-string and
  structured JSON schedules

## Design Principles

### Web Standards

Andromeda implements WHATWG (URL, Encoding, Fetch, Streams, DOM events) and W3C
standards (Canvas 2D, Performance, Web Crypto, Web Locks, Cache Storage)
wherever possible. Andromeda-specific APIs live on the `Andromeda` global to
avoid colliding with the standard surface.

### TypeScript First

Every API ships with TypeScript declarations from `types/global.d.ts` (and
related files) in the Andromeda repository. Editors using the LSP (via
`andromeda lsp`) get real-time diagnostics.

### Cross-Platform

APIs are designed to work the same way on Windows, macOS, and Linux. Where a
platform difference is unavoidable (for example, signal handling), it is
documented on the relevant page.

## Common Patterns

### Error Handling

```typescript
try {
  const result = await someApiCall();
} catch (error) {
  console.error("API call failed:", (error as Error).message);
}
```

### Async I/O

```typescript
const content = await Andromeda.readTextFile("file.txt");
const res = await fetch("https://api.example.com/data");
```

### Configuration Objects

Many constructors accept an options bag:

```typescript
const decoder = new TextDecoder("utf-8", { fatal: true, ignoreBOM: false });

const canvas = new OffscreenCanvas(800, 600);
const ctx = canvas.getContext("2d");
```

## Quick Tour

```typescript
// Console
console.log("Hello, Andromeda!");

// File system
const content = await Andromeda.readTextFile("config.json");
const config = JSON.parse(content);

// Fetch
const response = await fetch("https://api.example.com/data");
const data = await response.json();

// Canvas
const canvas = new OffscreenCanvas(400, 300);
const ctx = canvas.getContext("2d")!;
ctx.fillStyle = "blue";
ctx.fillRect(10, 10, 100, 100);
canvas.saveAsPng("out.png");

// SQLite
const db = new Database(":memory:");
db.exec("CREATE TABLE t (id INTEGER, name TEXT)");
db.prepare("INSERT INTO t VALUES (?, ?)").run(1, "Alice");

// HTTP server
Andromeda.serve((req) => new Response("hello"));
```

## See Also

- [Quick Start Guide](/docs/quick-start)
- [Examples](/docs/examples/index)
- [CLI Reference](/docs/cli-reference)
