---
title: "Performance API"
description: "High-resolution timing, marks, measures, and entries"
section: "API Reference"
order: 15
id: "performance-api"
---

Andromeda implements the
[W3C High Resolution Time](https://www.w3.org/TR/hr-time/) and
[Performance Timeline](https://www.w3.org/TR/performance-timeline/)
specifications. The global `performance` object provides sub-millisecond
timestamps, marks, and measures.

## `performance.now()`

Returns a high-resolution timestamp in milliseconds, relative to
`performance.timeOrigin`.

```typescript
const t0 = performance.now();
work();
const t1 = performance.now();
console.log(`took ${(t1 - t0).toFixed(3)}ms`);
```

## `performance.timeOrigin`

Read-only number — the start time of the runtime in Unix epoch milliseconds. Add
it to `performance.now()` for wall-clock timestamps.

```typescript
const wallClockMs = performance.timeOrigin + performance.now();
console.log(new Date(wallClockMs).toISOString());
```

## Marks

```typescript
performance.mark("op:start");
work();
performance.mark("op:end", { detail: { kind: "render" } });
```

Marks can carry an optional `detail` value and a `startTime` override (used by
the `measure` helpers below).

## Measures

```typescript
performance.measure("op", "op:start", "op:end");

// Object form with detail
performance.measure("op", {
  start: "op:start",
  end: "op:end",
  detail: { kind: "render" },
});

// Duration-based
performance.measure("op", { start: performance.now() - 100, duration: 100 });
```

## Reading Entries

```typescript
performance.getEntries(); // all entries
performance.getEntriesByType("mark"); // only marks
performance.getEntriesByType("measure");
performance.getEntriesByName("op");
performance.getEntriesByName("op", "measure");
```

Each entry has:

```typescript
{
  name: string;
  entryType: "mark" | "measure";
  startTime: number;
  duration: number;       // 0 for marks
  detail?: unknown;       // optional payload
}
```

## Clearing Entries

```typescript
performance.clearMarks(); // remove all marks
performance.clearMarks("op:start"); // remove a single mark

performance.clearMeasures();
performance.clearMeasures("op");
```

## JSON

```typescript
console.log(performance.toJSON());
```

## Patterns

### Benchmark helper

```typescript
async function benchmark(label: string, fn: () => unknown | Promise<unknown>) {
  performance.mark(`${label}:start`);
  await fn();
  performance.mark(`${label}:end`);
  performance.measure(label, `${label}:start`, `${label}:end`);
  const entry = performance.getEntriesByName(label, "measure").at(-1);
  return entry?.duration ?? 0;
}

const ms = await benchmark("sort", () => bigArray.sort());
console.log(`sort: ${ms.toFixed(2)}ms`);
```

### Recording N samples

```typescript
function profile(name: string, fn: () => void, samples = 100) {
  const times: number[] = [];
  for (let i = 0; i < samples; i++) {
    const t0 = performance.now();
    fn();
    times.push(performance.now() - t0);
  }
  times.sort((a, b) => a - b);
  const median = times[Math.floor(samples / 2)];
  const p95 = times[Math.floor(samples * 0.95)];
  console.log(`${name} median=${median.toFixed(3)}ms p95=${p95.toFixed(3)}ms`);
}
```

## See Also

- [Time API](/docs/api/time)
- [Examples → Performance](/docs/examples/performance)
