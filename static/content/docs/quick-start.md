---
title: "Quick Start Guide"
description: "Get up and running with Andromeda in just a few minutes"
section: "Getting Started"
order: 3
id: "quick-start"
---

This guide walks you through your first Andromeda programs and the major APIs.

## Your First Program

Create `hello.ts`:

```typescript
console.log("Hello, Andromeda!");
console.log("Current time:", new Date().toISOString());
```

Run it:

```bash
andromeda run hello.ts
```

Output:

```text
Hello, Andromeda!
Current time: 2026-05-11T15:30:45.123Z
```

> **Shorthand:** `andromeda hello.ts` is equivalent to `andromeda run hello.ts`
> when the first argument is a `.ts` file.

## Working with Files

Andromeda exposes both sync and async file APIs on the global `Andromeda`
object.

```typescript
const notes = `# My Notes
- Learn Andromeda
- Build something cool
- Share with friends
`;

// Sync API
Andromeda.writeTextFileSync("notes.md", notes);
console.log(Andromeda.readTextFileSync("notes.md"));

// Async API
await Andromeda.writeTextFile("notes.copy.md", notes);
const copy = await Andromeda.readTextFile("notes.copy.md");
console.log(copy);

// Binary files
const bytes = new Uint8Array([72, 101, 108, 108, 111]);
Andromeda.writeFileSync("hello.bin", bytes);
const back = Andromeda.readFileSync("hello.bin");
console.log(back.length);

// Environment variables and CLI args
const home = Andromeda.env.get("HOME") || Andromeda.env.get("USERPROFILE");
console.log("Home directory:", home);
console.log("CLI args:", Andromeda.args);
```

## Creating Graphics with Canvas

Andromeda ships a GPU-accelerated 2D Canvas API via `OffscreenCanvas`:

```typescript
const canvas = new OffscreenCanvas(400, 300);
const ctx = canvas.getContext("2d")!;

ctx.fillStyle = "#1a1a1a";
ctx.fillRect(0, 0, 400, 300);

const colors = ["#ff6b6b", "#4ecdc4", "#45b7d1", "#96ceb4", "#feca57"];
for (let i = 0; i < colors.length; i++) {
  ctx.fillStyle = colors[i];
  ctx.fillRect(50 + i * 60, 100, 50, 100);
}

ctx.fillStyle = "#ffffff";
ctx.font = "24px sans-serif";
ctx.fillText("Hello, Andromeda!", 100, 50);

// Save to disk
canvas.saveAsPng("my-first-graphic.png");

// Or get raw bytes / a data URL / a Blob
const png = canvas.toBuffer("image/png");
const dataUrl = canvas.toDataURL("image/png");
const blob = await canvas.convertToBlob({ type: "image/png" });

console.log("PNG bytes:", png.length, "data URL prefix:", dataUrl.slice(0, 30));
```

## Cryptography

```typescript
// Random UUID
console.log(crypto.randomUUID());

// Secure random bytes
const bytes = crypto.getRandomValues(new Uint8Array(16));
console.log(
  Array.from(bytes).map((b) => b.toString(16).padStart(2, "0")).join(""),
);

// SHA-256 digest (returns ArrayBuffer)
const data = new TextEncoder().encode("Hello, Andromeda!");
const hash = await crypto.subtle.digest("SHA-256", data);
const hex = Array.from(new Uint8Array(hash))
  .map((b) => b.toString(16).padStart(2, "0"))
  .join("");
console.log("SHA-256:", hex);
```

## Performance

```typescript
const start = performance.now();

let sum = 0;
for (let i = 0; i < 1_000_000; i++) sum += Math.sqrt(i);

console.log(`Took ${(performance.now() - start).toFixed(2)}ms`);

// Marks and measures
performance.mark("sort:start");
const data = Array.from({ length: 10_000 }, () => Math.random());
data.sort((a, b) => a - b);
performance.mark("sort:end");
performance.measure("sort", "sort:start", "sort:end");

for (const entry of performance.getEntriesByType("measure")) {
  console.log(`${entry.name}: ${entry.duration.toFixed(2)}ms`);
}
```

## SQLite

Andromeda ships SQLite via `DatabaseSync` (aliased as `Database`):

```typescript
const db = new Database("notes.db");

db.exec(`
  CREATE TABLE IF NOT EXISTS notes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    content TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`);

const insert = db.prepare("INSERT INTO notes (title, content) VALUES (?, ?)");
insert.run("First note", "Stored in SQLite!");

const rows = db.prepare("SELECT * FROM notes ORDER BY id DESC").all();
for (const row of rows as any[]) {
  console.log(`- ${row.title} (${row.created_at})`);
}

db.close();
```

In-memory databases are written `new Database(":memory:")`.

## Web Storage

`localStorage` and `sessionStorage` are persistent and backed by SQLite:

```typescript
localStorage.setItem("theme", "dark");
localStorage.setItem("profile", JSON.stringify({ name: "Alice" }));

console.log("theme:", localStorage.getItem("theme"));
console.log("items:", localStorage.length);

sessionStorage.setItem("sessionId", crypto.randomUUID());
console.log("session id:", sessionStorage.getItem("sessionId"));
```

## HTTP Server

Build an HTTP service with `Andromeda.serve` (returns a `Promise` that runs
until aborted):

```typescript
Andromeda.serve((req) => {
  const url = new URL(req.url);
  if (url.pathname === "/health") {
    return new Response(JSON.stringify({ ok: true }), {
      headers: { "Content-Type": "application/json" },
    });
  }
  return new Response("Hello from Andromeda!");
});

// With options
Andromeda.serve({
  port: 3000,
  hostname: "0.0.0.0",
  handler: async (req) => {
    const body = await req.text();
    return new Response(`echo: ${body}`);
  },
});
```

The HTTP server requires the runtime to be built with the `serve` feature
(enabled by default).

## Scheduled Tasks (Cron)

```typescript
// Cron-string schedule
Andromeda.cron("hourly-cleanup", "0 * * * *", () => {
  console.log("Cleaning up at", new Date().toISOString());
});

// Or the structured-object form (UTC)
Andromeda.cron("every-six-hours", { hour: { every: 6 } }, async () => {
  await doWork();
});
```

## Subprocesses

Spawn external programs with `Andromeda.Command`:

```typescript
const cmd = new Andromeda.Command("echo", { args: ["hello", "world"] });
const out = await cmd.output();
console.log(out.stdout); // "hello world\n"

// Long-running
const child = new Andromeda.Command("sleep", { args: ["10"] }).spawn();
child.kill();
```

## Interactive REPL

```bash
andromeda repl
```

Try:

```javascript
> 2 + 2
4
> crypto.randomUUID()
"…"
> const db = new Database(":memory:")
> db.exec("CREATE TABLE t (id INTEGER)")
> db.prepare("INSERT INTO t VALUES (?)").run(1)
> db.prepare("SELECT * FROM t").all()
```

REPL commands: `help`, `history`, `clear`, `gc`, `exit`.

## Modules and Imports

ES modules and TypeScript module resolution work out of the box:

```typescript
// math-utils.ts
export function add(a: number, b: number): number {
  return a + b;
}
export const PI = Math.PI;
```

```typescript
// main.ts
import { add, PI } from "./math-utils.ts";
console.log(add(5, 3), PI);

// Dynamic imports work too
const helpers = await import("./helpers.ts");
```

Bare specifiers resolve through [Import Maps](/docs/api/import-maps) defined in
your `andromeda.json` or referenced via `import_map_files`.

## Toolchain

```bash
andromeda fmt              # format current directory
andromeda lint             # lint current directory
andromeda check            # TypeScript type check
andromeda bundle main.ts dist/app.js
andromeda compile main.ts dist/app   # single-file executable
andromeda task dev          # run a task from andromeda.json
andromeda upgrade           # update to the latest release
```

See the [CLI Reference](/docs/cli-reference) for full details.

## Common Patterns

### Error Handling

```typescript
try {
  const content = Andromeda.readTextFileSync("nonexistent.txt");
  console.log(content);
} catch (error) {
  console.error("Failed to read file:", (error as Error).message);
}
```

### Signals

```typescript
Andromeda.addSignalListener("SIGINT", () => {
  console.log("Got SIGINT, cleaning up…");
  Andromeda.exit(0);
});
```

## Next Steps

- Browse the [API Reference](/docs/api/index)
- Configure your project with [andromeda.json](/docs/configuration)
- See the [Examples](/docs/examples/index)
- Join the [Discord community](https://discord.gg/tgjAnX2Ny3)
