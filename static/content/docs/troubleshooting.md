---
title: "Troubleshooting Guide"
description: "Common issues and solutions"
section: "Help & Support"
order: 11
id: "troubleshooting"
---

This page collects the most common issues encountered when installing, building,
or running Andromeda — along with their fixes.

## Installation

### `cargo: command not found`

Rust isn't installed or not on PATH.

```bash
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
source $HOME/.cargo/env
cargo --version
```

### `andromeda: command not found` after install

Cargo installs binaries to `~/.cargo/bin`. Ensure that's on PATH:

```bash
echo 'export PATH="$HOME/.cargo/bin:$PATH"' >> ~/.bashrc
source ~/.bashrc
```

Or reinstall with `--force`:

```bash
cargo install --git https://github.com/tryandromeda/andromeda --force
```

### Build failures during `cargo install`

- **Outdated nightly:** run `rustup update`. Andromeda pins a nightly toolchain
  in `rust-toolchain.toml`; rustup will install it automatically the first time
  you build inside the repo.
- **Missing system deps on Linux:**

  ```bash
  sudo apt install build-essential git pkg-config libssl-dev
  ```

- **wgpu build issues:** the `canvas` and `window` features need
  graphics-capable system libraries. Build without them if you don't need them:

  ```bash
  cargo install --git https://github.com/tryandromeda/andromeda \
    --no-default-features --features "crypto,storage,serve"
  ```

- **`cargo clean`** and retry if you hit caching weirdness.

### Permission errors

- On Unix, ensure your install directory is writable.
- On Windows, use an elevated shell if writing outside your user profile.

## Runtime Errors

### `Andromeda namespace not defined`

The runtime didn't finish initializing built-ins. Make sure you're running
Andromeda itself (`andromeda run …`) rather than a different JS engine that
tries to execute the file.

### `HTTP extension is not available`

`Andromeda.serve` requires the `serve` feature to be enabled at build time. The
default feature set includes it; if you built with `--no-default-features` you
need to re-enable it.

### `Window extension is not available`

`Andromeda.Window` requires the `window` feature:

```bash
cargo run --features window -- run examples/window.ts
```

### Module loading fails

- Verify the file path or URL is correct
- For remote imports, check connectivity and TLS
- Check your import map (in `andromeda.json` or referenced via
  `import_map_files`) — see [Import Maps](/docs/api/import-maps)

### TypeScript errors

```bash
# See diagnostics
andromeda check src/

# Inspect what Andromeda is parsing
andromeda run --verbose src/main.ts
```

The built-in LSP (`andromeda lsp`) also surfaces diagnostics directly in your
editor.

### `Permission denied` or unexpected file errors

- Confirm the path exists: `Andromeda.existsSync(path)`
- Confirm you can read or write it from the shell
- Use absolute paths when in doubt; the CWD may not be what you expect when
  Andromeda is invoked from another tool

## Performance

### Slow startup

```bash
andromeda run --verbose script.ts
```

Verbose output shows extension loading and parse times. Most cold-start latency
comes from large module graphs and parsing — bundle for production with
`andromeda bundle`.

### High memory usage

- Free resources you don't need: close SQLite handles (`db.close()`), release
  stream readers (`reader.releaseLock()`).
- Avoid holding large `ArrayBuffer`s in long-lived closures.
- Prefer `for…of` over `Array.prototype.map`/`filter` chains for large
  collections.

### Slow file I/O

- Prefer async APIs (`readTextFile`, `writeTextFile`) for I/O-bound work.
- Batch writes; group SQLite inserts into a single transaction.

### Slow database operations

```typescript
db.exec("BEGIN TRANSACTION");
for (const row of rows) insert.run(row.a, row.b);
db.exec("COMMIT");
```

A few thousand inserts inside one transaction can be **dramatically** faster
than the same inserts outside.

## Canvas

### Empty or black PNG output

- Make sure you actually drew something before calling `saveAsPng`.
- The runtime needs the `canvas` feature enabled (default).
- Call `canvas.render()` if you want to force a flush before reading back
  pixels.

### `getContext` returns `null`

Pass `"2d"` exactly:

```typescript
const ctx = canvas.getContext("2d")!;
```

Other contexts (`webgl`, etc.) are not implemented.

## Networking

### `fetch` fails with TLS errors

- Update your system trust store.
- Verify the URL uses a valid certificate (e.g., visit it in a browser).
- Behind a corporate proxy, set `HTTPS_PROXY` / `HTTP_PROXY` env vars (some
  cases) or trust your proxy's CA.

### Connection refused with `Andromeda.serve`

- Confirm the port isn't already bound.
- Bind to `0.0.0.0` if you need to reach the server from another host.
- The current server is HTTP only — point clients at `http://`, not `https://`.

## Configuration

### Config file not picked up

```bash
andromeda config show
```

This prints which file is in effect. The search walks from the CWD up, looking
for `andromeda.json`, then `.toml`, then `.yaml` / `.yml`.

### Invalid configuration

```bash
andromeda config validate
```

This reports JSON / TOML / YAML syntax errors and field-level validation
failures (timeouts, line widths, etc.).

## Tools

### `andromeda fmt` doesn't change anything

- Files outside `format.include` are skipped if `include` is set.
- Files in `format.exclude` are skipped.
- Only `.js`, `.ts`, `.jsx`, `.tsx`, `.mjs`, `.mts`, and `.json` are formatted.

### `andromeda lint` reports unexpected errors

Tune rules in your config:

```json
{
  "lint": {
    "disabled_rules": ["empty_function"]
  }
}
```

See the [CLI lint reference](/docs/cli-reference#lint) for the built-in rule
list.

## Reporting Issues

If none of the above helps:

1. Update to the latest Andromeda: `andromeda upgrade`
2. Reproduce with `andromeda run --verbose` and capture the output
3. Open an issue on [GitHub](https://github.com/tryandromeda/andromeda/issues)
   with:
   - Andromeda version (`andromeda --version`)
   - OS and architecture
   - Minimal reproduction script
   - Full error output

You can also ask in the [Discord community](https://discord.gg/tgjAnX2Ny3).
