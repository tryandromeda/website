---
title: "Installation Guide"
description: "How to install and set up Andromeda on your system"
section: "Getting Started"
order: 2
id: "installation"
---

This guide will walk you through installing Andromeda on your system.

## Prerequisites

For building from source, Andromeda requires:

- **Rust** (latest stable version via rustup)
- **Git** (for cloning the repository)

Note: Pre-built binaries are available and don't require Rust to be installed.

## Quick Install

### Linux/macOS (Bash)

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

### Windows (Command Prompt)

```cmd
curl -L -o install.bat https://tryandromeda.dev/install.bat && install.bat
```

## Other Installation Methods

### Method 1: Install with Winget (Windows)

Windows users can install Andromeda using the Windows Package Manager:

```bash
winget install --id Andromeda.Andromeda
```

### Method 2: Install from Git with Cargo

Install Andromeda using Cargo directly from the Git repository:

```bash
cargo install --git https://github.com/tryandromeda/andromeda andromeda
```

This will:

1. Download the latest source code
2. Compile Andromeda with optimizations
3. Install the `andromeda` binary to your Cargo bin directory

### Method 3: Build from Source

If you want to build from source or contribute to development:

1. **Clone the repository:**

   ```bash
   git clone https://github.com/tryandromeda/andromeda.git
   cd andromeda
   ```

2. **Build the project:**

   ```bash
   cargo build --release
   ```

3. **Install locally:**

   ```bash
   cargo install --path cli
   ```

## Verify Installation

After installation, verify that Andromeda is working correctly:

```bash
andromeda --version

# Start the REPL
andromeda repl

# Run a simple test
echo 'console.log("Hello, Andromeda!");' > test.js
andromeda run test.js
```

## Setting up Your Environment

### Adding to PATH

Cargo typically installs binaries to `~/.cargo/bin` (Unix) or
`%USERPROFILE%\.cargo\bin` (Windows). Make sure this directory is in your
system's PATH.

#### On Unix-like systems (Linux, macOS)

```bash
echo 'export PATH="$HOME/.cargo/bin:$PATH"' >> ~/.bashrc
source ~/.bashrc
```

#### On Windows

Add `%USERPROFILE%\.cargo\bin` to your system PATH through:

1. System Properties → Advanced → Environment Variables
2. Edit the PATH variable
3. Add the Cargo bin directory

### Shell Completion (Optional)

Andromeda supports shell completion for bash, zsh, fish, and PowerShell.
Generate completion scripts:

```bash
# For bash
andromeda completions bash > ~/.local/share/bash-completion/completions/andromeda

# For zsh
andromeda completions zsh > ~/.oh-my-zsh/completions/_andromeda

# For fish
andromeda completions fish > ~/.config/fish/completions/andromeda.fish

# For PowerShell
andromeda completions powershell > andromeda.ps1
```

## Platform-Specific Notes

### Windows

- Andromeda works on Windows 10/11 (x86_64)
- Fully supported in PowerShell, Command Prompt, and WSL
- Available via winget package manager

### macOS

- Andromeda works on macOS 10.15+ (Catalina and later)
- Apple Silicon (M1/M2/M3) is fully supported
- Intel Macs are also fully supported

### Linux

- x86_64 and ARM64 architectures supported
- Most distributions supported (Ubuntu, Debian, Fedora, Arch, etc.)
- Requires glibc 2.31+ or musl 1.2.0+

## Troubleshooting

### Common Issues

#### "andromeda: command not found"

- Ensure `~/.cargo/bin` is in your PATH
- Restart your terminal after installation

#### Build failures on installation

- Update Rust: `rustup update`
- Clear Cargo cache: `cargo clean`
- Try installing with `--force` flag

#### Permission errors

- On Unix systems, ensure you have write permissions to `~/.cargo/bin`
- On Windows, run as Administrator if needed

### Getting Help

If you encounter issues:

1. Check the [Troubleshooting Guide](/docs/troubleshooting)
2. Search [GitHub Issues](https://github.com/tryandromeda/andromeda/issues)
3. Ask for help on [Discord](https://discord.gg/tgjAnX2Ny3)

## Next Steps

Now that Andromeda is installed:

1. Read the [Quick Start Guide](/docs/quick-start)
2. Explore the [CLI Reference](/docs/cli-reference)
3. Join our [Discord community](https://discord.gg/tgjAnX2Ny3)

## Updating Andromeda

Andromeda includes a built-in upgrade system for easy updates:

### Automatic Upgrade

```bash
# Upgrade to latest version
andromeda upgrade

# Check what would be upgraded (dry run)
andromeda upgrade --dry-run

# Force reinstall current version
andromeda upgrade --force

# Upgrade to specific version
andromeda upgrade --version 0.1.0-draft-49
```

### Manual Update

To update manually using Cargo:

```bash
cargo install --git https://github.com/tryandromeda/andromeda --force
```

The `--force` flag will overwrite the existing installation with the latest
version.

### Upgrade Features

The built-in upgrade system provides:

- **Cross-platform support**: Works on Windows, macOS, and Linux
- **Safe upgrades**: Creates automatic backups before upgrading
- **Version targeting**: Upgrade to specific versions (e.g., 0.1.0-draft-49)
- **Dry run mode**: Preview upgrades without making changes
- **Auto-detection**: Automatically detects your platform and architecture
- **GitHub Releases**: Downloads pre-built binaries from official releases
