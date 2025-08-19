---
title: "Import Maps API"
description: "Documentation for the Import Maps API in Andromeda"
section: "API Reference"
order: 1
id: "import-maps"
---

# Import Maps API

Import Maps provide modern module resolution with bare specifiers and CDN
integration in Andromeda, following the
[Web Import Maps specification](https://github.com/WICG/import-maps).

## Overview

Import Maps allow you to control how module specifiers are resolved, enabling:

- **Bare specifiers** - Use simple names like `@std/path` instead of relative
  paths
- **CDN integration** - Map specifiers to remote URLs for dependencies
- **Version management** - Control which versions of libraries are loaded
- **Local development** - Map to local files during development

## Configuration

Import Maps can be configured in several ways:

### 1. In Andromeda Configuration File

Add import maps directly to your `andromeda.json`, `andromeda.toml`, or
`andromeda.yml`:

```json
{
  "imports": {
    "@std/path": "./modules/path.ts",
    "lodash": "https://cdn.skypack.dev/lodash@4.17.21",
    "react": "https://esm.sh/react@18.2.0"
  },
  "scopes": {
    "./vendor/": {
      "lodash": "./vendor/lodash.js"
    }
  },
  "integrity": {
    "https://cdn.skypack.dev/lodash@4.17.21": "sha384-..."
  }
}
```

### 2. Separate Import Map Files

Reference external import map files:

```json
{
  "import_map_files": [
    "./importmap.json",
    "./vendor/deps.json"
  ]
}
```

### 3. Standalone Import Map File

Create a dedicated `importmap.json`:

```json
{
  "imports": {
    "@std/": "https://deno.land/std@0.201.0/",
    "preact": "https://esm.sh/preact@10.17.1",
    "preact/": "https://esm.sh/preact@10.17.1/"
  },
  "scopes": {
    "https://esm.sh/": {
      "react": "https://esm.sh/preact@10.17.1/compat"
    }
  }
}
```

## Import Map Structure

### imports

Direct module specifier mappings for global resolution:

```json
{
  "imports": {
    "bare-specifier": "./local/file.js",
    "package": "https://cdn.example.com/package@1.0.0/index.js",
    "utils/": "./src/utils/"
  }
}
```

### scopes

Scope-specific mappings that apply only within certain paths:

```json
{
  "scopes": {
    "./vendor/": {
      "lodash": "./vendor/lodash-local.js"
    },
    "https://cdn.example.com/": {
      "react": "https://cdn.example.com/react@17.0.0"
    }
  }
}
```

### integrity

Subresource integrity metadata for security:

```json
{
  "integrity": {
    "https://cdn.example.com/package.js": "sha384-oqVuAfXRKap7fdgcCY5uykM6+R9GqQ8K/uxy9rx7HNQlGYl1kPzQho1wx4JwY8wC"
  }
}
```

## Usage Examples

### Basic Bare Specifier Resolution

```typescript
// Import map configuration
{
  "imports": {
    "@std/path": "./modules/path.ts"
  }
}

// In your code
import { join, dirname, basename } from "@std/path";

console.log(join("a", "b", "c")); // "a/b/c"
console.log(dirname("/path/to/file.ts")); // "/path/to"
console.log(basename("/path/to/file.ts")); // "file.ts"
```

### CDN Dependencies

```typescript
// Import map configuration
{
  "imports": {
    "lodash": "https://cdn.skypack.dev/lodash@4.17.21",
    "date-fns": "https://cdn.skypack.dev/date-fns@2.29.3"
  }
}

// In your code
import _ from "lodash";
import { format } from "date-fns";

console.log(_.chunk([1, 2, 3, 4, 5], 2)); // [[1, 2], [3, 4], [5]]
console.log(format(new Date(), "yyyy-MM-dd")); // "2024-01-01"
```

### Directory Mapping

```typescript
// Import map configuration
{
  "imports": {
    "utils/": "./src/utilities/",
    "@components/": "./src/components/"
  }
}

// In your code
import { helper } from "utils/helpers.ts";
import { Button } from "@components/Button.tsx";
```

### Scoped Mappings

```typescript
// Import map configuration
{
  "imports": {
    "react": "https://esm.sh/react@18.2.0"
  },
  "scopes": {
    "./legacy/": {
      "react": "https://esm.sh/react@16.14.0"
    }
  }
}

// In ./src/modern.ts
import React from "react"; // Uses React 18.2.0

// In ./legacy/old-component.ts  
import React from "react"; // Uses React 16.14.0
```

## Resolution Algorithm

Andromeda follows the standard Import Maps resolution algorithm:

1. **Check for relative/absolute specifiers** - Skip mapping for `./`, `../`,
   `/`, or URLs with protocols
2. **Apply scope-specific mappings** - If the importing module is within a
   scope, check scope mappings first
3. **Apply global mappings** - Check the global `imports` for exact matches
4. **Try prefix matching** - For directory mappings ending with `/`
5. **Fall back to standard resolution** - Use normal module resolution if no
   mapping found

## API Reference

### ImportMap Interface

```typescript
interface ImportMap {
  imports?: Record<string, string>;
  scopes?: Record<string, Record<string, string>>;
  integrity?: Record<string, string>;
}
```

### Methods

#### ImportMap.from_file(path)

Load an import map from a JSON file:

```typescript
// In Rust/internal API
let import_map = ImportMap::from_file("./importmap.json")?;
```

#### ImportMap.resolve_specifier(specifier, base_url?)

Resolve a bare specifier using the import map:

```typescript
// Returns the mapped specifier or None if not found
let resolved = import_map.resolve_specifier("@std/path", Some("./src/"));
```

#### ImportMap.merge(other)

Merge another import map into this one:

```typescript
// Combines imports, scopes, and integrity from both maps
import_map.merge(other_map);
```

## Runtime Integration

Import Maps are automatically integrated into Andromeda's module system:

```rust
// Create a runtime with import map support
let import_map = ImportMap::from_file("./importmap.json")?;
let hooks = RuntimeHostHooks::with_import_map(host_data, base_path, import_map);
```

The import map resolution happens transparently during module loading, so your
TypeScript/JavaScript code can use bare specifiers without any special syntax.

## Best Practices

### 1. Use Consistent Patterns

```json
{
  "imports": {
    "@std/": "https://deno.land/std@0.201.0/",
    "@app/": "./src/",
    "npm:": "https://esm.sh/"
  }
}
```

### 2. Version Pinning

```json
{
  "imports": {
    "react": "https://esm.sh/react@18.2.0",
    "react-dom": "https://esm.sh/react-dom@18.2.0"
  }
}
```

### 3. Development vs Production

```json
{
  "imports": {
    "debug": "./src/debug-dev.ts"
  },
  "scopes": {
    "./dist/": {
      "debug": "./src/debug-prod.ts"
    }
  }
}
```

### 4. Security with Integrity

```json
{
  "imports": {
    "lodash": "https://cdn.jsdelivr.net/npm/lodash@4.17.21/lodash.min.js"
  },
  "integrity": {
    "https://cdn.jsdelivr.net/npm/lodash@4.17.21/lodash.min.js": "sha384-oqVuAfXRKap7fdgcCY5uykM6+R9GqQ8K/uxy9rx7HNQlGYl1kPzQho1wx4JwY8wC"
  }
}
```

## Common Patterns

### Standard Library Mapping

```json
{
  "imports": {
    "@std/assert": "https://deno.land/std@0.201.0/assert/mod.ts",
    "@std/path": "https://deno.land/std@0.201.0/path/mod.ts",
    "@std/fs": "https://deno.land/std@0.201.0/fs/mod.ts"
  }
}
```

### Framework Setup

```json
{
  "imports": {
    "react": "https://esm.sh/react@18.2.0",
    "react-dom": "https://esm.sh/react-dom@18.2.0",
    "@emotion/react": "https://esm.sh/@emotion/react@11.11.1",
    "@emotion/styled": "https://esm.sh/@emotion/styled@11.11.0"
  }
}
```

### Local Development

```json
{
  "imports": {
    "@app/components": "./src/components/index.ts",
    "@app/utils": "./src/utils/index.ts",
    "@app/types": "./src/types/index.ts"
  }
}
```

## Error Handling

Import Maps provide clear error messages for common issues:

- **Module not found**: When a mapped specifier points to a non-existent file
- **Invalid JSON**: When import map files contain syntax errors
- **Resolution errors**: When circular dependencies or invalid mappings are
  detected

```typescript
// Error examples
import { nonExistent } from "@std/path"; // TypeError: Module not found
import cycles from "@app/cycles"; // Error: Circular import detected
```

## Compatibility

Andromeda's Import Maps implementation follows the
[WHATWG Import Maps specification](https://github.com/WICG/import-maps),
ensuring compatibility with:

- **Web browsers** supporting Import Maps
- **Deno** runtime import maps
- **Node.js** with appropriate tooling
- **Bundlers** that support Import Maps

This makes your code portable across different JavaScript runtimes and build
tools.
