---
title: "Console API"
description: "console.log and friends, with styling, tables, timers, and groups"
section: "API Reference"
order: 10
id: "console-api"
---

Andromeda follows the
[WHATWG Console standard](https://console.spec.whatwg.org/), so the API will be
familiar to anyone coming from browsers or Node.js.

## Output Methods

```typescript
console.log("Hello, World!");
console.info("App started");
console.warn("Deprecated API");
console.error("Network failure");
console.debug("Cache hit", { key: "x", ttl: 60 });
```

All methods accept any number of arguments — objects are inspected, arrays are
formatted, and primitives stringified.

### printf-style formatting

```typescript
console.log("User %s is %d years old", "John", 25);
```

Supported specifiers: `%s`, `%d` / `%i`, `%f`, `%o` / `%O`, `%j`, `%c`.

### Styled output (`%c`)

`%c` consumes one CSS-style argument and applies it to the substring that
follows:

```typescript
console.log(
  "%cHello%c %cAndromeda",
  "color:red;font-weight:bold",
  "",
  "color:blue",
);
```

Common properties: `color`, `background`, `font-weight`, `font-style`,
`text-decoration`, `padding`.

## Assertions

```typescript
console.assert(value > 0, "Value should be positive, got %d", value);
```

If the assertion fails, the remaining arguments are logged as an error.

## Counts

```typescript
console.count(); // default: 1
console.count("login"); // login: 1
console.count("login"); // login: 2
console.countReset("login");
```

## Timers

```typescript
console.time("query");
await runQuery();
console.timeLog("query", "partial result");
console.timeEnd("query");
```

## Groups

```typescript
console.group("Auth");
console.log("token", token);
console.group("User");
console.log({ id, name });
console.groupEnd();
console.groupEnd();
```

`console.groupCollapsed` is supported but rendered identically to `group` in a
terminal.

## Tables

```typescript
console.table([
  { name: "Alice", age: 30 },
  { name: "Bob", age: 25 },
]);

console.table([
  { name: "Alice", age: 30, role: "admin" },
  { name: "Bob", age: 25, role: "user" },
], ["name", "role"]); // restrict columns
```

## Other Methods

```typescript
console.dir(obj); // tree-style object inspection
console.trace(); // logs a stack trace
console.clear(); // clear the terminal (best effort)
```

## Patterns

### Custom logger wrapper

```typescript
function log(
  level: "info" | "warn" | "error",
  scope: string,
  msg: string,
  data?: unknown,
) {
  const ts = new Date().toISOString();
  const target = console[level];
  if (data === undefined) target(`[${ts}] [${scope}] ${msg}`);
  else target(`[${ts}] [${scope}] ${msg}`, data);
}

log("info", "boot", "starting", { port: 3000 });
log("error", "db", "connection failed");
```

### Conditional debug logging

```typescript
const DEBUG = Andromeda.env.get("DEBUG") === "1";
const debug = DEBUG ? console.debug.bind(console) : () => {};
debug("verbose info", details);
```

## See Also

- [Performance API](/docs/api/performance) for high-resolution timing
- [Process API](/docs/api/process) for `Andromeda.stdout` direct writes
