---
title: "Examples Overview"
description: "Code examples and practical demonstrations"
section: "Examples"
order: 1
id: "examples-overview"
---

The [Andromeda repository](https://github.com/tryandromeda/andromeda) ships with
an extensive `examples/` directory covering every API surface. The examples on
this site walk through a few of them in detail; the full set includes:

- **CLI / process** — `args.ts`, `env.ts`, `sleep.ts`, `command.ts`
- **File system and encoding** — `fs.ts`, `btoa.ts`, `atob.ts`, `blob.ts`
- **Networking** — `fetch.ts`, `headers.ts`, `request.ts`, `response.ts`,
  `tls.ts`
- **HTTP server** — everything under `examples/serve/`
- **Canvas** — `canvas.ts`, `canvas_advanced.ts`, `canvas_gradient.ts`,
  `canvas_global_alpha.ts`, `breakout.ts`
- **Crypto** — `crypto.ts`
- **Storage** — `storage.ts`, `sqlite.ts`, `cache_storage.ts`
- **Streams** — `streams.ts`
- **URL / Web APIs** — `url.ts`, `console.ts`, `performance.ts`, `navigator.ts`,
  `event/`, `queue_microtask.ts`
- **Cron** — `cron.ts`
- **Modules** — `import-map.ts`, `modules/`, `jsr.ts`, `std.ts`
- **Window (optional)** — `window.ts`, `games/`
- **Linting** — `lint_empty_function.ts`, `lint_empty_statement.ts`,
  `lint_var_usage.ts`
- **FizzBuzz** — the obligatory `fizzbuzz.ts`

## Featured Examples

### Data and Storage

- [SQLite Examples](/docs/examples/sqlite) — `DatabaseSync`, prepared
  statements, transactions, sessions
- [Web Storage Examples](/docs/examples/web-storage) — `localStorage` and
  `sessionStorage`
- [Performance Monitoring](/docs/examples/performance) — `performance.now`,
  marks, measures

### Basics

- [FizzBuzz Example](/docs/examples/fizzbuzz) — control flow and `console.log`

## Running Examples

Every example is a single `.ts` file. Run it with:

```bash
andromeda run example.ts

# Verbose, for debugging
andromeda run --verbose example.ts
```

Examples that produce files (e.g., the canvas examples) write to the current
working directory.

## See Also

- [API Reference](/docs/api/index)
- [Quick Start](/docs/quick-start)
- [CLI Reference](/docs/cli-reference)
- [Examples on GitHub](https://github.com/tryandromeda/andromeda/tree/main/examples)
