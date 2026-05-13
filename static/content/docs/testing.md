---
title: "Testing Guide"
description: "Running and writing tests for Andromeda"
section: "Development"
order: 12
id: "testing"
---

This guide covers running Andromeda's own tests and writing tests for your own
Andromeda projects.

## Running Andromeda's Tests

Andromeda's test suite is a Cargo workspace test set, plus an integration crate
at `tests/`.

```bash
# All tests in the workspace
cargo test --workspace

# Just the runtime crate
cargo test -p andromeda-runtime

# Just the integration tests
cargo test -p andromeda-tests
```

For a clean run from scratch:

```bash
cargo clean && cargo test --workspace
```

## Continuous Integration

Pull requests run formatting, linting, and the full test suite. Before opening a
PR, run the same checks locally:

```bash
cargo fmt --all
cargo clippy --workspace --all-targets --all-features -- -D warnings
cargo test --workspace
```

## Type-Checking and Linting Your Code

Andromeda includes a TypeScript checker and a linter:

```bash
andromeda check src/                # type-check
andromeda lint src/                 # lint
andromeda fmt src/                  # format
```

Combine them in a `tasks` block for a single `andromeda task check` command:

```json
{
  "tasks": {
    "verify": {
      "description": "Type-check, lint, and format-check",
      "command": "andromeda check && andromeda lint",
      "dependencies": []
    }
  }
}
```

## Writing Tests for Andromeda Apps

Andromeda does not yet ship a dedicated test runner. For now, use one of these
patterns:

### Built-in assertions

Andromeda exposes the global helpers `assert`, `assertEquals`,
`assertNotEquals`, and `assertThrows`. They throw on failure, so a script that
exits 0 means every assertion passed.

```typescript
// tests/math.test.ts
import { add } from "../src/math.ts";

assertEquals(add(2, 3), 5, "add should sum integers");
assertEquals(add(-1, 1), 0, "add should handle negatives");
assertThrows(() => add(NaN, 1), "should throw on NaN");

console.log("All math tests passed!");
```

Run with:

```bash
andromeda run tests/math.test.ts
```

### A simple test harness

```typescript
// tests/harness.ts
type Test = { name: string; fn: () => void | Promise<void> };

const tests: Test[] = [];

export function test(name: string, fn: Test["fn"]) {
  tests.push({ name, fn });
}

export async function run() {
  let pass = 0;
  let fail = 0;
  for (const t of tests) {
    try {
      await t.fn();
      console.log(`  ok ${t.name}`);
      pass++;
    } catch (err) {
      console.error(`  fail ${t.name}\n    ${(err as Error).message}`);
      fail++;
    }
  }
  console.log(`\n${pass} passed, ${fail} failed`);
  if (fail > 0) Andromeda.exit(1);
}
```

```typescript
// tests/index.ts
import { run, test } from "./harness.ts";
import "./math.test.ts";

await run();
```

```bash
andromeda run tests/index.ts
```

### CI integration

A typical `andromeda.json` configuration:

```json
{
  "tasks": {
    "test": "andromeda run tests/index.ts",
    "ci": {
      "description": "All checks",
      "command": "andromeda check && andromeda lint && andromeda task test"
    }
  }
}
```

Then in CI:

```bash
andromeda task ci
```

## Tips

- Use `:memory:` databases when testing SQLite-backed code — they're fast and
  leave nothing behind.
- Use `AbortSignal.timeout(ms)` to bound network tests.
- Use `performance.now()` to assert timing budgets, but keep slack for CI
  variance.
- `Andromeda.exit(1)` is the conventional way to fail a test script.

## See Also

- [Contributing Guide](/docs/contributing)
- [Building from Source](/docs/building)
- [Examples](/docs/examples/index)
