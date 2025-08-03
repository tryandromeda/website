# Configuration

Andromeda supports comprehensive configuration through configuration files in JSON, TOML, or YAML format. This guide covers all available configuration options and how to use them.

## Configuration Files

Andromeda automatically searches for configuration files in the following order:

1. `andromeda.json`
2. `andromeda.toml`
3. `andromeda.yaml`
4. `andromeda.yml`

The search starts in the current directory and moves up through parent directories until a configuration file is found.

## Configuration Management Commands

### Initialize Configuration

Create a new configuration file with default values:

```bash
# Create JSON config (default)
andromeda config init

# Create TOML config
andromeda config init --format toml

# Create YAML config  
andromeda config init --format yaml

# Create config in specific location
andromeda config init --output ./config/andromeda.json

# Force overwrite existing config
andromeda config init --force
```

### Show Configuration

Display the current active configuration:

```bash
# Show current config (auto-detected)
andromeda config show

# Show specific config file
andromeda config show --file ./custom-config.toml
```

### Validate Configuration

Validate configuration file format and values:

```bash
# Validate current config
andromeda config validate

# Validate specific file
andromeda config validate --file ./andromeda.json
```

## Configuration Structure

### Complete Configuration Example

**JSON Format (andromeda.json):**

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
    "include": ["src/**/*.ts", "lib/**/*.js"],
    "exclude": ["**/*.test.ts", "**/node_modules/**"],
    "timeout": 30000
  },
  "format": {
    "line_width": 80,
    "use_tabs": false,
    "tab_width": 2,
    "trailing_comma": true,
    "semicolons": true,
    "single_quotes": false
  },
  "lint": {
    "enabled": true,
    "rules": ["empty_function", "empty_statement", "var_usage", "unused_variable"],
    "disabled_rules": [],
    "max_warnings": 50
  }
}
```

**TOML Format (andromeda.toml):**

```toml
name = "my-project"
version = "1.0.0"
description = "My Andromeda project"
author = "Your Name"
license = "MIT"

[runtime]
no_strict = false
verbose = false
disable_gc = false
print_internals = false
expose_internals = false
include = ["src/**/*.ts", "lib/**/*.js"]
exclude = ["**/*.test.ts", "**/node_modules/**"]
timeout = 30000

[format]
line_width = 80
use_tabs = false
tab_width = 2
trailing_comma = true
semicolons = true
single_quotes = false

[lint]
enabled = true
rules = ["empty_function", "empty_statement", "var_usage", "unused_variable"]
disabled_rules = []
max_warnings = 50
```

**YAML Format (andromeda.yaml):**

```yaml
name: my-project
version: 1.0.0
description: My Andromeda project
author: Your Name
license: MIT

runtime:
  no_strict: false
  verbose: false
  disable_gc: false
  print_internals: false
  expose_internals: false
  include:
    - "src/**/*.ts"
    - "lib/**/*.js"
  exclude:
    - "**/*.test.ts"
    - "**/node_modules/**"
  timeout: 30000

format:
  line_width: 80
  use_tabs: false
  tab_width: 2
  trailing_comma: true
  semicolons: true
  single_quotes: false

lint:
  enabled: true
  rules:
    - empty_function
    - empty_statement
    - var_usage
    - unused_variable
  disabled_rules: []
  max_warnings: 50
```

## Configuration Sections

### Project Metadata

Basic project information that can be used by tools and documentation:

| Field | Type | Description | Default |
|-------|------|-------------|---------|
| `name` | string | Project name | `null` |
| `version` | string | Project version | `null` |
| `description` | string | Project description | `null` |
| `author` | string | Project author(s) | `null` |
| `license` | string | Project license | `null` |

### Runtime Configuration

Controls how Andromeda executes your code:

| Field | Type | Description | Default |
|-------|------|-------------|---------|
| `no_strict` | boolean | Disable strict mode for more lenient parsing | `false` |
| `verbose` | boolean | Enable verbose output with execution details | `false` |
| `disable_gc` | boolean | Disable garbage collection (debugging only) | `false` |
| `print_internals` | boolean | Print internal debugging information | `false` |
| `expose_internals` | boolean | Expose Nova internal APIs | `false` |
| `include` | string[] | File patterns to include in execution | `[]` |
| `exclude` | string[] | File patterns to exclude from execution | `[]` |
| `timeout` | number | Runtime timeout in milliseconds | `null` |

**Include/Exclude Patterns:**

Use glob patterns to specify which files to include or exclude:

```json
{
  "runtime": {
    "include": [
      "src/**/*.ts",
      "lib/**/*.js",
      "!**/*.test.*"
    ],
    "exclude": [
      "**/node_modules/**",
      "dist/**",
      "**/*.d.ts"
    ]
  }
}
```

### Format Configuration

Controls code formatting behavior:

| Field | Type | Description | Default | Range |
|-------|------|-------------|---------|-------|
| `line_width` | number | Maximum line width for formatting | `80` | `20-500` |
| `use_tabs` | boolean | Use tabs instead of spaces for indentation | `false` | - |
| `tab_width` | number | Width of tab character in spaces | `2` | `1-16` |
| `trailing_comma` | boolean | Add trailing commas in multiline objects/arrays | `true` | - |
| `semicolons` | boolean | Require semicolons at end of statements | `true` | - |
| `single_quotes` | boolean | Prefer single quotes over double quotes | `false` | - |

**Formatting Examples:**

```javascript
// With trailing_comma: true
const obj = {
  a: 1,
  b: 2,  // <- trailing comma
};

// With single_quotes: true
const message = 'Hello, World!';

// With semicolons: false
const value = 42  // no semicolon
```

### Lint Configuration

Controls code analysis and linting:

| Field | Type | Description | Default |
|-------|------|-------------|---------|
| `enabled` | boolean | Enable linting | `true` |
| `rules` | string[] | List of lint rules to enable | `[]` |
| `disabled_rules` | string[] | List of lint rules to disable | `[]` |
| `max_warnings` | number | Maximum warnings before error | `null` |

**Available Lint Rules:**

| Rule | Description | Example |
|------|-------------|---------|
| `empty_function` | Detect empty function declarations | `function test() {}` |
| `empty_statement` | Detect empty statements | `;;` or single `;` |
| `var_usage` | Discourage use of `var` keyword | `var x = 1;` |
| `unused_variable` | Detect unused variable declarations | `let unused = 42;` |
| `prefer_const` | Prefer `const` over `let` when possible | `let readonly = 'value';` |

**Lint Configuration Examples:**

```json
{
  "lint": {
    "enabled": true,
    "rules": ["empty_function", "var_usage", "unused_variable"],
    "disabled_rules": ["empty_statement"],
    "max_warnings": 10
  }
}
```

## Environment-Specific Configuration

### Development Configuration

```json
{
  "runtime": {
    "verbose": true,
    "expose_internals": true,
    "timeout": 0
  },
  "lint": {
    "enabled": true,
    "rules": ["empty_function", "empty_statement", "var_usage", "unused_variable"],
    "max_warnings": 100
  }
}
```

### Production Configuration

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

### Performance Testing Configuration

```json
{
  "runtime": {
    "disable_gc": true,
    "print_internals": true,
    "timeout": 0
  },
  "format": {
    "line_width": 120
  }
}
```

## Configuration Inheritance

When multiple configuration files exist in the directory hierarchy, Andromeda uses the closest one to your current working directory. CLI arguments override configuration file settings.

**Priority Order (highest to lowest):**

1. CLI arguments (`--verbose`, `--no-strict`, etc.)
2. Configuration file in current directory
3. Configuration file in parent directory (searched recursively)
4. Default configuration values

## CLI Integration

All configuration options can be overridden via CLI arguments:

```bash
# Override runtime settings
andromeda run --verbose --no-strict script.ts

# Override REPL settings  
andromeda repl --expose-internals --disable-gc

# Use specific config file
andromeda run --config ./custom-config.toml script.ts
```

## Validation Rules

Andromeda validates configuration files and provides helpful error messages:

### Runtime Validation

- `timeout` must be greater than 0 (if specified)
- `include`/`exclude` patterns must be valid glob expressions

### Format Validation

- `line_width` must be between 20 and 500
- `tab_width` must be between 1 and 16

### Lint Validation

- `max_warnings` must be greater than 0 (if specified)
- `rules` and `disabled_rules` must contain valid rule names

### Example Validation Error

```
⚠️  Config file error: Invalid TOML in config file: expected `.`, `=`
   Using default configuration

Config validation failed: Format line width must be between 20 and 500
```

## Best Practices

### Project Structure

```
my-project/
├── andromeda.json          # Main config
├── src/
│   ├── andromeda.dev.json  # Development overrides
│   └── **/*.ts
├── tests/
│   ├── andromeda.test.json # Test-specific config
│   └── **/*.test.ts
└── dist/
```

### Configuration Tips

1. **Use environment-specific configs** for different development stages
2. **Keep configs minimal** - only specify non-default values  
3. **Use include/exclude patterns** to control file processing
4. **Set reasonable timeouts** to prevent runaway scripts
5. **Enable verbose mode** during development for better debugging
6. **Use validation** before deploying configuration changes

### Common Patterns

**TypeScript Project:**

```json
{
  "name": "typescript-app",
  "runtime": {
    "include": ["src/**/*.ts"],
    "exclude": ["**/*.d.ts", "**/*.test.ts"]
  },
  "format": {
    "semicolons": true,
    "single_quotes": true
  }
}
```

**JavaScript Library:**

```json
{
  "name": "js-library", 
  "runtime": {
    "include": ["lib/**/*.js", "index.js"],
    "no_strict": true
  },
  "format": {
    "semicolons": false,
    "trailing_comma": false
  }
}
```

**Development Setup:**

```json
{
  "runtime": {
    "verbose": true,
    "expose_internals": true,
    "include": ["src/**/*", "examples/**/*"]
  },
  "lint": {
    "enabled": true,
    "rules": ["empty_function", "var_usage", "unused_variable"],
    "max_warnings": null
  }
}
```

## Language Server Integration

The configuration system integrates with Andromeda's Language Server Protocol (LSP) implementation:

- **Real-time validation** - Config changes are validated immediately
- **Dynamic rule updates** - Lint rules are applied as configuration changes  
- **Workspace awareness** - Different folders can have different configurations
- **Editor integration** - VS Code and other editors respect Andromeda config

## Troubleshooting

### Common Issues

**Config file not found:**

```bash
# Check which config is being used
andromeda config show

# Create a new config file
andromeda config init
```

**Invalid configuration format:**

```bash
# Validate your config
andromeda config validate

# Check syntax for TOML/YAML files
```

**Conflicting settings:**

```bash
# Show effective configuration
andromeda config show

# CLI args override config file settings
andromeda run --verbose script.ts  # overrides config verbose setting
```

### Configuration Migration

When upgrading Andromeda versions, use the validation command to ensure your configuration is still valid:

```bash
# After upgrade, validate existing config
andromeda config validate

# Create new config with latest defaults
andromeda config init --force
```

For more configuration examples and use cases, see the [Examples](/docs/examples) section.

For more configuration examples and use cases, see the [Examples](/docs/examples) section.
