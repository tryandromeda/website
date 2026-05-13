---
title: "Installation Guide"
description: "How to install and set up Andromeda on your system"
section: "Getting Started"
order: 2
id: "installation"
---

This guide walks you through installing Andromeda on your system.

## Prerequisites

Pre-built binaries do not require any tooling — just `curl`, `irm`, or `winget`.
To build from source you need:

- **Rust** (the pinned nightly toolchain from `rust-toolchain.toml`, picked up
  automatically by [rustup](https://rustup.rs/))
- **Git**

## Quick Install

### Linux / macOS

```bash
curl -fsSL https://tryandromeda.dev/install.sh | bash
```

Or download and run manually:

```bash
wget https://tryandromeda.dev/install.sh
chmod +x install.sh
./install.sh
```

### Windows (PowerShell)

```powershell
irm -Uri "https://tryandromeda.dev/install.ps1" | Invoke-Expression
```

### Windows (CMD)

```cmd
curl -L -o install.bat https://tryandromeda.dev/install.bat && install.bat
```

## Other Installation Methods

### Install with winget (Windows)

```powershell
winget install --id Andromeda.Andromeda
```

### Install from Git with Cargo

```bash
cargo install --git https://github.com/tryandromeda/andromeda andromeda
```

This downloads the latest source, compiles with `--release`, and installs the
`andromeda` binary to your Cargo bin directory.

### Build from Source

For development or to enable optional features:

1. Clone the repository:

   ```bash
   git clone https://github.com/tryandromeda/andromeda.git
   cd andromeda
   ```

2. Build the project:

   ```bash
   cargo build --release
   ```

3. Install from the local checkout:

   ```bash
   cargo install --path crates/cli
   ```

See the [Building from Source](/docs/building) guide for feature flags and
satellite binaries.

## Verify Installation

```bash
andromeda --version

# Start the REPL (the default with no arguments)
andromeda repl

# Run a quick test
echo 'console.log("Hello, Andromeda!");' > test.ts
andromeda run test.ts
```

> **Tip:** Running `andromeda foo.ts` (no `run` subcommand) is shorthand for
> `andromeda run foo.ts` — the CLI auto-detects `.ts` files as the first
> argument.

## Setting Up Your Environment

### Adding to PATH

Cargo installs binaries to `~/.cargo/bin` on Unix and `%USERPROFILE%\.cargo\bin`
on Windows. Ensure this directory is on your PATH.

#### Linux / macOS

```bash
echo 'export PATH="$HOME/.cargo/bin:$PATH"' >> ~/.bashrc
source ~/.bashrc
```

#### Windows

Add `%USERPROFILE%\.cargo\bin` to PATH via:

1. System Properties → Advanced → Environment Variables
2. Edit the `Path` user variable
3. Add the Cargo bin directory

### Shell Completion

Andromeda generates completions for bash, zsh, fish, and PowerShell.

```bash
# Auto-detect your shell
andromeda completions

# Bash
andromeda completions bash > ~/.local/share/bash-completion/completions/andromeda

# Zsh
andromeda completions zsh > ~/.zfunc/_andromeda

# Fish
andromeda completions fish > ~/.config/fish/completions/andromeda.fish

# PowerShell
andromeda completions powershell > andromeda.ps1
```

## Platform Support

### Windows

- Windows 10 / 11 (x86_64)
- PowerShell, Command Prompt, and WSL
- Available via winget

### macOS

- macOS 10.15+ (Catalina and later)
- Apple Silicon (arm64) and Intel (x86_64)

### Linux

- x86_64 and ARM64
- Most distributions (Ubuntu, Debian, Fedora, Arch, etc.)

## Updating Andromeda

Andromeda includes a built-in upgrade command:

```bash
# Upgrade to the latest version
andromeda upgrade

# Preview without applying
andromeda upgrade --dry-run

# Force reinstall
andromeda upgrade --force

# Upgrade to a specific version
andromeda upgrade --version 0.1.10
```

The upgrade command downloads the matching prebuilt binary from
[GitHub Releases](https://github.com/tryandromeda/andromeda/releases) and
replaces the running binary safely.

### Manual update via Cargo

```bash
cargo install --git https://github.com/tryandromeda/andromeda --force
```

## Troubleshooting

### `andromeda: command not found`

Ensure `~/.cargo/bin` (or the install location) is on your PATH and restart your
terminal.

### Build failures on installation

- Update Rust: `rustup update`
- Clear the cargo cache: `cargo clean`
- Retry with `--force`

### Permission errors

- On Unix, ensure write permissions to your install directory
- On Windows, run the install script in an elevated shell if needed

For more, see the [Troubleshooting Guide](/docs/troubleshooting).

## Next Steps

1. Read the [Quick Start Guide](/docs/quick-start)
2. Browse the [CLI Reference](/docs/cli-reference)
3. Configure your project with [andromeda.json](/docs/configuration)
4. Join the [Discord community](https://discord.gg/tgjAnX2Ny3)
