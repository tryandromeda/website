---
title: "CLI Reference"
description: "Complete command-line interface documentation"
section: "Getting Started"
order: 5
id: "cli-reference"
---

Complete reference for Andromeda's command-line interface (version `0.1.10`).

## Synopsis

```bash
andromeda [COMMAND] [OPTIONS] [ARGS...]
```

Invoking `andromeda` with no arguments starts the REPL. Invoking it with a `.ts`
file as the first argument is shorthand for `andromeda run`.

## Commands

| Command       | Purpose                                     |
| ------------- | ------------------------------------------- |
| `run`         | Execute a JS or TS file                     |
| `repl`        | Start an interactive REPL                   |
| `compile`     | Build a single-file executable              |
| `bundle`      | Bundle and minify a script                  |
| `fmt`         | Format source files                         |
| `lint`        | Lint source files                           |
| `check`       | Type-check TypeScript files                 |
| `lsp`         | Start the Language Server                   |
| `task`        | Run tasks defined in `andromeda.json`       |
| `config`      | Manage `andromeda.json` / `.toml` / `.yaml` |
| `completions` | Generate shell completion scripts           |
| `upgrade`     | Self-update Andromeda                       |

### `run`

Execute a JavaScript or TypeScript file.

**Syntax:**

```bash
andromeda run [OPTIONS] <PATH> [-- ARGS...]
```

**Arguments:**

- `<PATH>` — path to the file to execute
- `[ARGS...]` — additional arguments forwarded to the script (available via
  `Andromeda.args`)

**Options:**

- `-v, --verbose` — Enable verbose runtime output
- `--no-strict` — Disable strict mode

**Examples:**

```bash
andromeda run script.ts
andromeda run --verbose my-app.ts
andromeda run --no-strict legacy.js
andromeda run my-app.ts -- --port 3000 --name Alice
```

### `repl`

Start an interactive Read-Eval-Print Loop.

**Syntax:**

```bash
andromeda repl [OPTIONS]
```

**Options:**

- `--expose-internals` — Expose Nova internal APIs for debugging
- `--print-internals` — Print internal debugging information
- `--disable-gc` — Disable garbage collection

**Built-in REPL commands:** `help`, `history`, `clear`, `gc`, `exit` / `quit`.

```bash
andromeda repl
andromeda repl --expose-internals --print-internals
andromeda repl --disable-gc
```

### `compile`

Compile a script into a single-file executable.

**Syntax:**

```bash
andromeda compile [OPTIONS] <PATH> <OUT>
```

**Options:**

- `-v, --verbose` — Embed verbose mode in the binary
- `-s, --no-strict` — Disable strict mode in the binary

**Examples:**

```bash
andromeda compile my-app.ts my-app
andromeda compile -v src/main.ts dist/tool
```

The resulting executable embeds your script plus the configuration block, so it
can run on any matching platform without `andromeda` installed.

### `bundle`

Bundle a JavaScript/TypeScript entry file and its dependencies into a single
minified output file.

**Syntax:**

```bash
andromeda bundle <INPUT> <OUTPUT>
```

**Examples:**

```bash
andromeda bundle src/main.ts dist/app.js
```

### `fmt`

Format JavaScript, TypeScript, and JSON files using the built-in formatter
(dprint).

**Syntax:**

```bash
andromeda fmt [PATHS...]
```

If no paths are provided, formats the current directory. File discovery respects
`format.include` and `format.exclude` from your config.

**Examples:**

```bash
andromeda fmt
andromeda fmt src/ tests/
andromeda fmt script.ts utils.js
```

**Supported file types:** `.js`, `.ts`, `.jsx`, `.tsx`, `.mjs`, `.mts`, `.json`.

### `lint`

Run the built-in linter against your code.

**Syntax:**

```bash
andromeda lint [PATHS...]
```

**Built-in rules:**

- Empty function detection
- Empty statement detection
- Variable usage validation
- Unreachable code detection
- Invalid syntax highlighting

The set of enabled and disabled rules can be customised through the `lint`
section of [`andromeda.json`](/docs/configuration).

**Examples:**

```bash
andromeda lint
andromeda lint src/ tests/
andromeda lint script.ts utils.js
```

### `check`

Type-check TypeScript files.

**Syntax:**

```bash
andromeda check [OPTIONS] [PATHS...]
```

**Options:**

- `--json` — Emit one JSON object per diagnostic (ndjson) on stdout. Progress
  and summary lines still go to stderr. Conflicts with `--quiet`.
- `--quiet` — Suppress all output and rely on the exit code. Conflicts with
  `--json`.

**Examples:**

```bash
andromeda check
andromeda check src/
andromeda check --json src/ | jq .
andromeda check --quiet && echo ok || echo "type errors"
```

### `lsp`

Start the Language Server Protocol server. This is typically invoked by your
editor rather than directly.

**Syntax:**

```bash
andromeda lsp
```

**Features:**

- Real-time diagnostics
- Built-in linting rules (matching `andromeda lint`)
- Multi-file workspace analysis
- Editor integration (VS Code, Neovim, and other LSP clients)

### `task`

Run tasks defined in `andromeda.json` (or `.toml` / `.yaml`). Tasks are inspired
by Deno's task system.

**Syntax:**

```bash
andromeda task [TASK_NAME]
```

If `TASK_NAME` is omitted, all available tasks are listed.

**Defining tasks:** add a `tasks` map to your config. A task can be a string or
a richer object with description, dependencies, working directory, and
environment overrides.

```json
{
  "tasks": {
    "dev": "andromeda run src/main.ts",
    "test": "andromeda run tests/main.ts",
    "build": {
      "description": "Bundle and compile",
      "command": "andromeda bundle src/main.ts dist/app.js",
      "dependencies": ["test"],
      "env": { "NODE_ENV": "production" }
    }
  }
}
```

**Examples:**

```bash
andromeda task           # list tasks
andromeda task dev
andromeda task build
```

### `config`

Manage Andromeda configuration files.

**Syntax:**

```bash
andromeda config <SUBCOMMAND>
```

#### `config init`

Create a new configuration file with defaults.

```bash
andromeda config init                       # andromeda.json
andromeda config init --format toml
andromeda config init --output ./conf/andromeda.json
andromeda config init --force               # overwrite existing
```

Options:

- `--format <json|toml|yaml>` — default `json`
- `-o, --output <PATH>` — output location
- `-f, --force` — overwrite an existing file

#### `config show`

Print the resolved configuration. Reads `andromeda.json` / `andromeda.toml` /
`andromeda.yaml` from the current or parent directories.

```bash
andromeda config show
andromeda config show --file ./custom.toml
```

#### `config validate`

Validate a configuration file.

```bash
andromeda config validate
andromeda config validate --file ./andromeda.json
```

For full configuration reference, see the
[Configuration Guide](/docs/configuration).

### `completions`

Generate shell completion scripts.

**Syntax:**

```bash
andromeda completions [SHELL]
```

If no shell is provided, Andromeda auto-detects from `$SHELL` (or PowerShell on
Windows). Supported shells: `bash`, `zsh`, `fish`, `powershell`.

```bash
andromeda completions
andromeda completions bash > ~/.local/share/bash-completion/completions/andromeda
andromeda completions zsh > ~/.zfunc/_andromeda
andromeda completions fish > ~/.config/fish/completions/andromeda.fish
andromeda completions powershell > andromeda.ps1
```

### `upgrade`

Upgrade Andromeda to the latest version (or a specific version).

**Syntax:**

```bash
andromeda upgrade [OPTIONS]
```

**Options:**

- `-f, --force` — Re-install even if already on the latest version
- `-v, --version <VERSION>` — Upgrade to a specific version
- `--dry-run` — Show what would change without applying

```bash
andromeda upgrade
andromeda upgrade --dry-run
andromeda upgrade --force
andromeda upgrade --version 0.1.10
```

## Global Options

- `-h, --help` — Show help (works on each subcommand too)
- `-V, --version` — Show the Andromeda version

```bash
andromeda --help
andromeda run --help
andromeda --version
```

## File Types

Andromeda treats these extensions as runnable / formattable:

| Extension | Description           |
| --------- | --------------------- |
| `.js`     | JavaScript            |
| `.ts`     | TypeScript            |
| `.mjs`    | ES Module JavaScript  |
| `.mts`    | ES Module TypeScript  |
| `.jsx`    | JavaScript with JSX*  |
| `.tsx`    | TypeScript with JSX*  |
| `.json`   | JSON (formatter only) |

*JSX syntax is parsed by the formatter and linter but is not yet executed at
runtime.

## Environment Variables

| Variable   | Description                           | Default |
| ---------- | ------------------------------------- | ------- |
| `RUST_LOG` | Logging level for runtime diagnostics | unset   |
| `NO_COLOR` | Disable colored output                | unset   |

```bash
RUST_LOG=debug andromeda run script.ts
NO_COLOR=1 andromeda run script.ts
```

## Debugging

### Verbose Output

```bash
andromeda run --verbose script.ts
```

Shows extension loading, parse and execution timing, and other diagnostics.

### REPL Internals

```bash
andromeda repl --expose-internals --print-internals
```

This exposes Nova engine internals — primarily useful when working on the
runtime itself.

### Error Reporting

Andromeda surfaces source-mapped errors with file location, syntax highlighting,
and stack traces with context.

## Examples

### Basic Script Execution

```bash
andromeda run hello.ts
andromeda run --verbose app.ts
```

### Development Workflow

```bash
andromeda fmt src/
andromeda lint src/
andromeda check src/
andromeda run src/main.ts
```

### Production Workflow

```bash
andromeda check && andromeda lint
andromeda bundle src/main.ts dist/app.js
andromeda compile src/main.ts dist/my-app
```

### Single-File Executable

```bash
andromeda compile src/cli.ts ./tool
./tool --help
```

## Troubleshooting

For common issues and solutions, see the
[Troubleshooting Guide](/docs/troubleshooting).

For more code samples, browse the [Examples](/docs/examples/index).
