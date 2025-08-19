---
title: "CLI Reference"
description: "Complete command-line interface documentation"
section: "Getting Started"
order: 5
id: "cli-reference"
---

Complete reference for Andromeda's command-line interface.

> **Latest Version**: v0.1.0-draft12 includes new cron functionality and
> improved formatter! See the [upgrade command](#upgrade) to get the latest
> features.

## Synopsis

```bash
andromeda [COMMAND] [OPTIONS] [ARGS...]
```

## Commands

### `run`

Execute JavaScript or TypeScript files.

**Syntax:**

```bash
andromeda run [OPTIONS] <FILES...>
```

**Arguments:**

- `<FILES...>` - One or more files to execute

**Options:**

- `-v, --verbose` - Enable verbose output showing detailed execution information
- `--no-strict` - Disable strict mode (allows more lenient JavaScript parsing)

**Examples:**

```bash
andromeda run script.ts

# Run multiple files
andromeda run utils.js main.ts helper.ts

# Run with verbose output
andromeda run --verbose my-app.ts

# Run without strict mode
andromeda run --no-strict legacy-script.js
```

### `repl`

Start an interactive Read-Eval-Print Loop.

**Syntax:**

```bash
andromeda repl [OPTIONS]
```

**Options:**

- `--expose-internals` - Expose Nova internal APIs for debugging
- `--print-internals` - Print internal debugging information
- `--disable-gc` - Disable garbage collection

**Examples:**

```bash
# Start basic REPL
andromeda repl

# Start REPL with debugging features
andromeda repl --expose-internals --print-internals

# Start REPL with GC disabled (for debugging)
andromeda repl --disable-gc
```

**REPL Commands:**

- `help` - Show available commands
- `history` - Display command history
- `clear` - Clear the screen
- `gc` - Manually trigger garbage collection
- `exit` or `quit` - Exit the REPL

### `compile`

Compile a JavaScript/TypeScript file into a single-file executable.

**Syntax:**

```bash
andromeda compile <INPUT> <OUTPUT>
```

**Arguments:**

- `<INPUT>` - Path to the source file to compile
- `<OUTPUT>` - Path for the output executable

**Examples:**

```bash
# Compile a TypeScript file
andromeda compile my-app.ts my-app.exe

# Compile to a Unix executable
andromeda compile script.js ./my-tool

# Compile with full paths
andromeda compile /path/to/source.ts /usr/local/bin/mytool
```

### `fmt`

Format JavaScript and TypeScript files.

**Syntax:**

```bash
andromeda fmt [PATHS...]
```

**Arguments:**

- `[PATHS...]` - Files or directories to format (optional, defaults to current
  directory)

**Examples:**

```bash
# Format specific files
andromeda fmt script.ts utils.js

# Format entire directory
andromeda fmt src/

# Format current directory
andromeda fmt

# Format multiple directories
andromeda fmt src/ tests/ examples/
```

**Supported File Types:**

- `.js` - JavaScript files
- `.ts` - TypeScript files
- `.jsx` - JavaScript with JSX
- `.tsx` - TypeScript with JSX
- `.json` - JSON files

## Global Options

These options are available for all commands:

- `-h, --help` - Show help information
- `-V, --version` - Show version information

**Examples:**

```bash
# Show general help
andromeda --help

# Show help for specific command
andromeda run --help

# Show version
andromeda --version
```

## File Types

Andromeda supports these file extensions:

| Extension | Description                   |
| --------- | ----------------------------- |
| `.js`     | JavaScript files              |
| `.ts`     | TypeScript files              |
| `.jsx`    | JavaScript with JSX\* (React) |
| `.tsx`    | TypeScript with JSX\* (React) |
| `.mjs`    | ES Module JavaScript          |
| `.mts`    | ES Module TypeScript          |

\*JSX not actually supported yet

## Environment Variables

Andromeda respects these environment variables:

| Variable   | Description            | Default |
| ---------- | ---------------------- | ------- |
| `RUST_LOG` | Set logging level      | `info`  |
| `NO_COLOR` | Disable colored output | `false` |

**Examples:**

```bash
# Enable debug logging
RUST_LOG=debug andromeda run script.ts

# Disable colors
NO_COLOR=1 andromeda run script.ts
```

## Debugging

### Verbose Output

Use `--verbose` with the `run` command to see detailed execution information:

```bash
andromeda run --verbose script.ts
```

This shows:

- File loading times
- Parse times
- Execution times
- Memory usage
- Extension loading

### REPL Debugging

Start REPL with debugging options:

```bash
andromeda repl --expose-internals --print-internals
```

This provides access to:

- Nova engine internals
- Garbage collection stats
- Detailed execution traces

### Error Reporting

Andromeda provides detailed error messages with:

- File location and line numbers
- Syntax highlighting
- Suggestions for fixes
- Stack traces with source context

## Examples

### Basic Script Execution

```bash
# Simple execution
andromeda run hello.ts

# Multiple files with dependencies
andromeda run utils.ts main.ts

andromeda run complex-app.ts
```

### Development Workflow

```bash
# Format code
andromeda fmt src/

andromeda run src/main.ts

# Test in REPL
andromeda repl

# Create production executable
andromeda compile src/main.ts dist/my-app
```

### CI/CD Integration

### `config`

Manage Andromeda configuration files.

**Syntax:**

```bash
andromeda config <SUBCOMMAND>
```

**Subcommands:**

#### `config init`

Initialize a new configuration file with default values.

**Syntax:**

```bash
andromeda config init [OPTIONS]
```

**Options:**

- `--format <FORMAT>` - Configuration file format (json, toml, yaml) [default:
  json]
- `-o, --output <PATH>` - Output path for configuration file
- `-f, --force` - Force overwrite existing configuration file

**Examples:**

```bash
# Create default JSON config
andromeda config init

# Create TOML config
andromeda config init --format toml

# Create config in custom location
andromeda config init --output ./config/andromeda.json

# Force overwrite existing config
andromeda config init --force
```

#### `config show`

Display the current active configuration.

**Syntax:**

```bash
andromeda config show [OPTIONS]
```

**Options:**

- `-f, --file <PATH>` - Show configuration from specific file

**Examples:**

```bash
# Show current active config
andromeda config show

# Show specific config file
andromeda config show --file ./custom-config.toml
```

#### `config validate`

Validate configuration file format and values.

**Syntax:**

```bash
andromeda config validate [OPTIONS]
```

**Options:**

- `-f, --file <PATH>` - Config file to validate

**Examples:**

```bash
# Validate current config
andromeda config validate

# Validate specific file
andromeda config validate --file ./andromeda.json
```

**Configuration Files:**

Andromeda supports configuration in JSON, TOML, and YAML formats:

- `andromeda.json` - JSON configuration
- `andromeda.toml` - TOML configuration
- `andromeda.yaml` / `andromeda.yml` - YAML configuration

For detailed configuration options, see the
[Configuration Guide](/docs/configuration).

### `completions`

Generate shell completion scripts for bash, zsh, fish, or PowerShell.

**Syntax:**

```bash
andromeda completions [SHELL]
```

**Arguments:**

- `[SHELL]` - Target shell (optional, auto-detects if not specified)
  - `bash` - Bash completion
  - `zsh` - Zsh completion
  - `fish` - Fish completion
  - `powershell` - PowerShell completion

**Examples:**

```bash
# Auto-detect shell and generate completions
andromeda completions

# Generate bash completions
andromeda completions bash > ~/.local/share/bash-completion/completions/andromeda

# Generate zsh completions
andromeda completions zsh > ~/.oh-my-zsh/completions/_andromeda

# Generate fish completions
andromeda completions fish > ~/.config/fish/completions/andromeda.fish

# Generate PowerShell completions
andromeda completions powershell > andromeda.ps1
```

### `upgrade`

Upgrade Andromeda to the latest version or a specific version.

**Syntax:**

```bash
andromeda upgrade [OPTIONS]
```

**Options:**

- `-f, --force` - Force upgrade even if already on the latest version
- `-v, --version <VERSION>` - Upgrade to a specific version instead of latest
- `--dry-run` - Show what would be upgraded without actually upgrading

**Examples:**

```bash
# Upgrade to latest version
andromeda upgrade

# Force reinstall current version
andromeda upgrade --force

# Upgrade to specific version
andromeda upgrade --version v0.2.0

# Check what would be upgraded (dry run)
andromeda upgrade --dry-run
```

### `lsp`

Start the Language Server Protocol (LSP) server for editor integration.

**Syntax:**

```bash
andromeda lsp
```

**Description:**

The LSP server provides real-time diagnostics and code analysis for JavaScript
and TypeScript files in your editor. It offers comprehensive linting with
built-in rules for code quality.

**Features:**

- **Real-time Diagnostics** - Live error reporting as you type
- **Comprehensive Linting** - 5 built-in rules for code quality:
  - Empty function detection
  - Empty statement detection
  - Variable usage validation
  - Unreachable code detection
  - Invalid syntax highlighting
- **Multi-file Support** - Workspace-wide analysis
- **Rich Error Messages** - Detailed explanations with code context
- **Editor Integration** - Works with VS Code, Neovim, and other LSP-compatible
  editors

**Examples:**

```bash
# Start the Language Server (typically called by your editor)
andromeda lsp
```

**Editor Setup:**

Configure your editor to use `andromeda lsp` as the language server for
JavaScript and TypeScript files to get instant feedback on code quality.

### `lint`

Analyze code for potential issues and style violations.

**Syntax:**

```bash
andromeda lint [PATHS...]
```

**Arguments:**

- `[PATHS...]` - Files or directories to lint (optional, defaults to current
  directory)

**Examples:**

```bash
# Lint specific files
andromeda lint script.ts utils.js

# Lint entire directory
andromeda lint src/

# Lint current directory
andromeda lint

# Lint multiple directories
andromeda lint src/ tests/ examples/
```

**Lint Rules:**

- Empty function detection
- Empty statement detection
- Variable usage validation
- Unreachable code detection
- Invalid syntax highlighting

### `bundle`

Bundle JavaScript/TypeScript files and their dependencies into a single file.

**Syntax:**

```bash
andromeda bundle <INPUT> <OUTPUT>
```

**Arguments:**

- `<INPUT>` - Path to the entry file to bundle
- `<OUTPUT>` - Path for the output bundled file

**Examples:**

```bash
# Bundle a TypeScript application
andromeda bundle src/main.ts dist/app.js

# Bundle with dependencies
andromeda bundle index.ts bundle.js

# Bundle for distribution
andromeda bundle app.ts dist/standalone.js
```

**Features:**

- **Module Resolution** - Automatic dependency resolution
- **Tree Shaking** - Dead code elimination
- **TypeScript Support** - Seamless TS to JS bundling
- **Single File Output** - Self-contained bundles

## Troubleshooting

For common issues and solutions, see the
[Troubleshooting Guide](/docs/troubleshooting).

For more examples check out the [Examples](/docs/examples)
