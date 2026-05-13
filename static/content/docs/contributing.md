---
title: "Contributing to Andromeda"
description: "How to contribute to the Andromeda project"
section: "Development"
order: 11
id: "contributing"
---

Thank you for your interest in contributing. This guide describes the repository
layout, the development workflow, and the standards we ask contributors to
follow.

## Where to start

We welcome contributions in:

- **Core runtime** — Nova-bound runtime work in `crates/core`
- **Web APIs** — implementations in `crates/runtime/src/ext`
- **Documentation** — both the in-repo docs and this website
- **Testing** — `crates/runtime/tests`, integration tests, fixtures
- **Bug fixes** — issues are tracked on
  [GitHub](https://github.com/tryandromeda/andromeda/issues)
- **New features** — discuss on Discord or in a GitHub issue before starting

## Prerequisites

- The latest pinned Rust toolchain (see `rust-toolchain.toml`)
- `git`
- Optional but recommended: VS Code or another LSP-capable editor with
  rust-analyzer

## Development Setup

```bash
git clone https://github.com/tryandromeda/andromeda
cd andromeda

cargo build
cargo run -- --help
cargo run -- run examples/canvas.ts
```

See [Building from Source](/docs/building) for feature flags.

## Project Layout

```text
andromeda/
├── crates/
│   ├── cli/                    # `andromeda` CLI binary
│   │   └── src/
│   │       ├── main.rs         # subcommand dispatch
│   │       ├── run.rs          # `run`
│   │       ├── repl.rs         # `repl`
│   │       ├── compile.rs      # `compile`
│   │       ├── bundle.rs       # `bundle`
│   │       ├── format.rs       # `fmt`
│   │       ├── lint.rs         # `lint`
│   │       ├── check.rs        # `check`
│   │       ├── lsp/            # Language Server
│   │       ├── task.rs         # `task`
│   │       ├── config.rs       # config file parsing
│   │       └── upgrade.rs      # `upgrade`
│   ├── core/                   # Nova-driven runtime engine
│   └── runtime/                # Web APIs / extensions
│       └── src/ext/            # one folder/file per extension
├── examples/                   # JS / TS examples
├── namespace/                  # built-in TS module loaded into every realm
├── types/                      # TypeScript declarations
├── tests/                      # integration tests
├── andromeda.json              # repo-level Andromeda config
└── Cargo.toml                  # workspace manifest
```

The `namespace/mod.ts` file is loaded into every Andromeda runtime — it defines
the `Andromeda` global object and is a good place to start when adding a new
top-level API.

Extensions in `crates/runtime/src/ext` typically come in two flavours:

1. A Rust `*Ext` struct exposing host ops (`internal_*`) via
   `Extension::new_extension()`.
2. An optional TypeScript companion (`mod.ts`) registered as a built-in,
   layering the user-facing API over those ops.

## Building, running, and testing

```bash
cargo build
cargo build --release

# Run the test suite
cargo test --workspace

# Format and lint
cargo fmt --all
cargo clippy --workspace --all-targets --all-features -- -D warnings

# Run an example
cargo run --release -- run examples/sqlite.ts
```

## Coding Standards

### Rust

- Follow `rustfmt` and `clippy` defaults
- Prefer small, focused functions and explicit error types
- Avoid unnecessary `unsafe`
- Document non-obvious invariants with `//` comments where the code does not
  speak for itself

### TypeScript

- Run `andromeda fmt` (or `cargo run -- fmt`) on changed TS files
- Keep `types/global.d.ts` in sync with the runtime — it's the source of truth
  for IDE typings
- Match the style of existing extensions in `crates/runtime/src/ext/*/mod.ts`

### Tests

- Co-locate tests with the code where possible
- Integration tests for runtime behavior live under `tests/` and
  `crates/runtime/tests/`

## Submitting Changes

1. **Open or claim an issue** for non-trivial work so we can sync on approach.
2. **Fork** the repo and create a topic branch.
3. **Keep commits focused** and write descriptive commit messages.
4. **Run the checks** before opening a PR:

   ```bash
   cargo fmt --all
   cargo clippy --workspace --all-targets --all-features -- -D warnings
   cargo test --workspace
   ```

5. **Open a pull request** against `main`. Link the issue it addresses and
   describe testing you performed.

## Documentation

If you change a public API:

- Update the type declarations in `types/`
- Update the corresponding page in
  [the website's `static/content/docs`](https://github.com/tryandromeda/website/tree/main/static/content/docs)
  (every doc page links to its source via "Edit on GitHub")

## Community

- [Discord](https://discord.gg/tgjAnX2Ny3)
- [GitHub Issues](https://github.com/tryandromeda/andromeda/issues)
- [GitHub Discussions](https://github.com/tryandromeda/andromeda/discussions)

## License

By contributing, you agree that your contributions will be licensed under the
[Mozilla Public License Version 2.0](https://github.com/tryandromeda/andromeda/blob/main/LICENSE.md).
