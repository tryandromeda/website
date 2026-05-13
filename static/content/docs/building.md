---
title: "Building from Source"
description: "Compiling Andromeda yourself"
section: "Development"
order: 10
id: "building"
---

This guide walks you through compiling Andromeda from source.

## Prerequisites

- **Rust toolchain** — Andromeda tracks a recent nightly toolchain pinned in
  `rust-toolchain.toml` (currently `nightly-2025-10-20`). `rustup` will pick it
  up automatically.
- **Git**
- **Platform build tools** — see below.

### Platform-Specific Requirements

#### Linux

```bash
# Ubuntu / Debian
sudo apt update
sudo apt install build-essential git pkg-config libssl-dev

# Fedora / RHEL
sudo dnf install gcc gcc-c++ git openssl-devel pkgconf-pkg-config

# Arch
sudo pacman -S base-devel git openssl pkgconf
```

For the optional `window` feature you'll also need X11/Wayland and graphics
drivers compatible with `wgpu`.

#### macOS

```bash
xcode-select --install
```

#### Windows

- Visual Studio Build Tools (with the "Desktop development with C++" workload)
  or Visual Studio Community
- Windows SDK (installed alongside the Build Tools)
- Git for Windows or WSL

## Cloning

```bash
git clone https://github.com/tryandromeda/andromeda
cd andromeda
```

## Installing Rust

If you don't have Rust:

```bash
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
source $HOME/.cargo/env

rustc --version
cargo --version
```

The pinned toolchain is downloaded automatically the first time you run `cargo`
inside the repo.

## Building

### Workspace overview

The repo is a Cargo workspace with three crates:

| Crate               | Path             | Purpose                   |
| ------------------- | ---------------- | ------------------------- |
| `andromeda`         | `crates/cli`     | CLI binary                |
| `andromeda-core`    | `crates/core`    | Core runtime / event loop |
| `andromeda-runtime` | `crates/runtime` | Web API extensions        |

### Quick build

```bash
# Debug build (faster compile, slower runtime)
cargo build

# Release build (recommended for actual use)
cargo build --release
```

The binary lands at `target/debug/andromeda` or `target/release/andromeda`.

### Running a script during development

```bash
cargo run --release -- run examples/canvas.ts
```

### Installing locally

```bash
cargo install --path crates/cli
```

This installs `andromeda` to `~/.cargo/bin`.

## Feature Flags

Most extensions are gated behind Cargo features on the workspace-level
`andromeda-runtime` dependency. The default feature set (defined in the root
`Cargo.toml`) is:

```toml
andromeda-runtime = { features = ["canvas", "crypto", "storage", "serve"] }
```

| Feature      | What it adds                                                         |
| ------------ | -------------------------------------------------------------------- |
| `canvas`     | `OffscreenCanvas`, GPU graphics via `wgpu`, text via `cosmic-text`   |
| `crypto`     | `crypto.subtle`, `randomUUID`, `getRandomValues` (via `ring`/`rand`) |
| `storage`    | SQLite (`DatabaseSync`), `localStorage`, `sessionStorage`, `caches`  |
| `virtualfs`  | In-memory virtual filesystem (implies `storage`)                     |
| `serve`      | `Andromeda.serve()` HTTP server                                      |
| `window`     | Native `Andromeda.Window` via `winit` + `wgpu`                       |
| `hotpath`    | Profiling instrumentation                                            |
| `typescript` | Nova TypeScript support                                              |
| `annex-b`    | ECMAScript Annex B legacy features                                   |
| `proposals`  | Experimental TC39 proposals                                          |

To build with a custom feature set:

```bash
# Without canvas (faster build, no graphics)
cargo build --release --no-default-features --features "crypto,storage,serve"

# Add native windowing
cargo build --release --features window

# Add the hotpath profiler
cargo build --release --features hotpath
```

The `window` feature is opt-in because it pulls in `winit` and platform
windowing libraries.

## Running Examples

```bash
cargo run --release -- run examples/canvas.ts
cargo run --release -- run examples/sqlite.ts
cargo run --release -- run examples/fetch.ts

# Window + canvas example
cargo run --release --features window -- run examples/window.ts
```

## Running the Test Suite

```bash
cargo test --workspace
```

See the [Testing Guide](/docs/testing) for more.

## Formatting and Linting

```bash
cargo fmt --all
cargo clippy --workspace --all-targets --all-features -- -D warnings
```

## Build Profiles

The release profile enables LTO for the smallest binary:

```toml
[profile.release]
lto = true
```

A custom `hotpath` profile inherits from release but disables LTO to keep
profiling builds fast.

## Cleaning

```bash
cargo clean
```

## Troubleshooting

- **Linker errors on Linux** — ensure `pkg-config` and `libssl-dev` (or the
  equivalent) are installed.
- **`wgpu` build failures** — make sure your graphics drivers are up to date.
  For headless CI you can build without the `canvas` or `window` features.
- **Rust toolchain mismatch** — run `rustup show` from inside the repo to let
  rustup install the pinned nightly.

## See Also

- [Contributing Guide](/docs/contributing)
- [Testing Guide](/docs/testing)
- [GitHub repository](https://github.com/tryandromeda/andromeda)
