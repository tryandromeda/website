---
title: "Configuration"
description: "Configure Andromeda with project-specific settings"
section: "Getting Started"
order: 4
id: "configuration"
---

Andromeda is configured through a project file in JSON, TOML, or YAML format.
This guide covers every section the CLI understands.

## Configuration Files

Andromeda searches for a configuration file in the current directory, then walks
up to the parent directories. The first match wins. Supported names, in order of
preference:

1. `andromeda.json`
2. `andromeda.toml`
3. `andromeda.yaml`
4. `andromeda.yml`

If no file is found, defaults are used.

## Managing Configuration

### `andromeda config init`

Create a new configuration with default values.

```bash
andromeda config init                              # andromeda.json
andromeda config init --format toml                # andromeda.toml
andromeda config init --format yaml                # andromeda.yaml
andromeda config init --output ./conf/andromeda.json
andromeda config init --force                      # overwrite existing
```

### `andromeda config show`

Print the currently resolved configuration.

```bash
andromeda config show
andromeda config show --file ./custom.toml
```

### `andromeda config validate`

Validate a configuration file.

```bash
andromeda config validate
andromeda config validate --file ./andromeda.json
```

## Structure

A complete `andromeda.json` example:

```json
{
  "name": "my-project",
  "version": "1.0.0",
  "description": "My Andromeda project",
  "author": "Your Name",
  "license": "MIT",

  "runtime": {
    "no_strict": false,
    "verbose": false,
    "disable_gc": false,
    "print_internals": false,
    "expose_internals": false,
    "include": ["src/**/*.ts"],
    "exclude": ["**/*.test.ts", "**/node_modules/**"],
    "timeout": 30000
  },

  "format": {
    "line_width": 80,
    "use_tabs": false,
    "tab_width": 2,
    "trailing_comma": false,
    "semicolons": true,
    "single_quotes": false,
    "include": [],
    "exclude": ["./tests/**"]
  },

  "lint": {
    "enabled": true,
    "rules": [],
    "disabled_rules": [],
    "max_warnings": null,
    "include": [],
    "exclude": []
  },

  "tasks": {
    "dev": "andromeda run src/main.ts",
    "test": "andromeda run tests/main.ts",
    "build": {
      "description": "Bundle the project",
      "command": "andromeda bundle src/main.ts dist/app.js",
      "dependencies": ["test"],
      "cwd": ".",
      "env": { "NODE_ENV": "production" }
    }
  },

  "imports": {
    "std/": "https://tryandromeda.dev/std/"
  },
  "scopes": {},
  "integrity": {},
  "import_map_files": []
}
```

TOML and YAML versions accept the same keys with the obvious syntactic
adjustments.

## Sections

### Project metadata

| Field         | Type   | Description         |
| ------------- | ------ | ------------------- |
| `name`        | string | Project name        |
| `version`     | string | Project version     |
| `description` | string | Project description |
| `author`      | string | Project author(s)   |
| `license`     | string | SPDX license string |

These fields are optional and currently used only for tooling and documentation.

### `runtime`

Controls how Andromeda executes code.

| Field              | Type     | Default | Description                                       |
| ------------------ | -------- | ------- | ------------------------------------------------- |
| `no_strict`        | boolean  | `false` | Disable strict mode                               |
| `verbose`          | boolean  | `false` | Enable verbose output                             |
| `disable_gc`       | boolean  | `false` | Disable GC (debugging only)                       |
| `print_internals`  | boolean  | `false` | Print internal Nova engine info                   |
| `expose_internals` | boolean  | `false` | Expose Nova internals to user code                |
| `include`          | string[] | `[]`    | File globs to include                             |
| `exclude`          | string[] | `[]`    | File globs to exclude                             |
| `timeout`          | number?  | `null`  | Soft execution timeout (ms). Must be `> 0` if set |

### `format`

The formatter is based on [dprint](https://dprint.dev/).

| Field            | Type     | Default | Range    | Description                                      |
| ---------------- | -------- | ------- | -------- | ------------------------------------------------ |
| `line_width`     | number   | `80`    | `20-500` | Maximum line width                               |
| `use_tabs`       | boolean  | `false` | -        | Indent with tabs                                 |
| `tab_width`      | number   | `2`     | `1-16`   | Tab width                                        |
| `trailing_comma` | boolean  | `false` | -        | Emit trailing commas                             |
| `semicolons`     | boolean  | `true`  | -        | Require semicolons                               |
| `single_quotes`  | boolean  | `false` | -        | Prefer single quotes                             |
| `include`        | string[] | `[]`    | -        | File globs to format (default: all source files) |
| `exclude`        | string[] | `[]`    | -        | File globs to exclude                            |

### `lint`

| Field            | Type     | Default | Description                            |
| ---------------- | -------- | ------- | -------------------------------------- |
| `enabled`        | boolean  | `true`  | Master switch                          |
| `rules`          | string[] | `[]`    | Rules to enable explicitly             |
| `disabled_rules` | string[] | `[]`    | Rules to disable                       |
| `max_warnings`   | number?  | `null`  | Fail if exceeded. Must be `> 0` if set |
| `include`        | string[] | `[]`    | File globs to lint                     |
| `exclude`        | string[] | `[]`    | File globs to exclude                  |

**Built-in rules:**

- `empty_function` — empty function declarations
- `empty_statement` — bare `;` statements
- `var_usage` — discourage `var`
- `unused_variable` — never-read declarations
- `unreachable_code` — code after `return`/`throw`/`break`/`continue`

### `tasks`

Tasks are scripts you run with `andromeda task <name>`. A task value is either a
simple command string or an object with extra metadata:

```json
{
  "tasks": {
    "dev": "andromeda run src/main.ts",
    "build": {
      "description": "Bundle the project",
      "command": "andromeda bundle src/main.ts dist/app.js",
      "dependencies": ["test"],
      "cwd": ".",
      "env": { "NODE_ENV": "production" }
    }
  }
}
```

Object task fields:

| Field          | Type                  | Description                               |
| -------------- | --------------------- | ----------------------------------------- |
| `description`  | string                | Shown in `andromeda task` listing         |
| `command`      | string                | The shell command to execute (required)   |
| `dependencies` | string[]              | Other tasks to run first                  |
| `cwd`          | string                | Working directory                         |
| `env`          | `Record<string, str>` | Extra environment variables for this task |

### `imports`, `scopes`, `integrity`, `import_map_files`

Andromeda implements the [Web Import Maps](https://github.com/WICG/import-maps)
spec at the configuration level. You can either specify the map inline:

```json
{
  "imports": {
    "std/": "https://tryandromeda.dev/std/",
    "lodash": "https://esm.sh/lodash@4"
  },
  "scopes": {
    "https://example.com/": {
      "lodash": "https://esm.sh/lodash@3"
    }
  },
  "integrity": {
    "https://esm.sh/lodash@4": "sha384-..."
  }
}
```

…or load additional import-map JSON files:

```json
{
  "import_map_files": ["./import-map.json"]
}
```

`import_map_files` paths must exist when the config is validated.

## Environment-Specific Configurations

### Development

```json
{
  "runtime": {
    "verbose": true,
    "expose_internals": true
  },
  "lint": {
    "enabled": true,
    "max_warnings": 100
  }
}
```

### Production

```json
{
  "runtime": {
    "no_strict": false,
    "verbose": false,
    "timeout": 30000,
    "exclude": ["**/*.test.*", "**/*.spec.*"]
  },
  "lint": {
    "enabled": true,
    "max_warnings": 0
  }
}
```

### Performance profiling

```json
{
  "runtime": {
    "disable_gc": true,
    "print_internals": true
  }
}
```

## Resolution Order

1. CLI flags on the active subcommand (e.g. `--verbose`, `--no-strict`)
2. The first config file found walking from the current directory upward
3. Defaults

## Validation

`andromeda config validate` enforces the following:

- `runtime.timeout` must be `> 0` when set
- `format.line_width` must be in `[20, 500]`
- `format.tab_width` must be in `[1, 16]`
- `lint.max_warnings` must be `> 0` when set
- Every file in `import_map_files` must exist

Example error:

```text
Config file error: Invalid TOML in config file: expected `.`, `=`
   Using default configuration

Config validation failed: Format line width must be between 20 and 500
```

## Project Layout Example

```text
my-project/
├── andromeda.json
├── import-map.json
├── src/
│   └── main.ts
├── tests/
│   └── main.ts
└── dist/
```

```json
{
  "name": "my-project",
  "tasks": {
    "dev": "andromeda run src/main.ts",
    "test": "andromeda run tests/main.ts"
  },
  "import_map_files": ["./import-map.json"]
}
```

## Tips

- Keep configs minimal — only specify non-default values.
- Use `include` / `exclude` to scope `fmt`, `lint`, and `check` to relevant
  source files.
- Validate before deploying configuration changes.
- Run `andromeda config show` to confirm which config file is in effect.

For more examples, see [Examples](/docs/examples/index).
