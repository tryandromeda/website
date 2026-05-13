---
title: "Time API"
description: "Timers, intervals, and sleep"
section: "API Reference"
order: 17
id: "time-api"
---

Andromeda implements the standard browser-style timer functions plus
`Andromeda.sleep` for promise-based delays.

## `Andromeda.sleep(ms)`

Returns a `Promise` that resolves after `ms` milliseconds. Use it with `await`.

```typescript
console.log("starting");
await Andromeda.sleep(1000);
console.log("1s later");

for (let i = 0; i < 5; i++) {
  console.log("tick", i);
  await Andromeda.sleep(500);
}
```

## `setTimeout(callback, delay, ...args)` / `clearTimeout(id)`

Run `callback` once after `delay` milliseconds. Returns a numeric ID you can
pass to `clearTimeout`.

```typescript
const id = setTimeout(() => console.log("hi"), 1000);
clearTimeout(id); // cancels before it fires

setTimeout(
  (name, age) => {
    console.log(`Hello ${name}, age ${age}`);
  },
  1000,
  "Alice",
  30,
);
```

## `setInterval(callback, period, ...args)` / `clearInterval(id)`

Run `callback` every `period` milliseconds, starting after the first period
elapses.

```typescript
const id = setInterval(() => {
  console.log("every 500ms");
}, 500);

// Cancel after 5 ticks
let n = 0;
const id2 = setInterval(() => {
  if (++n >= 5) clearInterval(id2);
  console.log(n);
}, 500);
```

## `queueMicrotask(callback)`

Schedules `callback` to run after the current synchronous job completes but
before the next macrotask.

```typescript
queueMicrotask(() => console.log("microtask"));
console.log("sync");
// prints: sync, microtask
```

## High-Resolution Time

Use `performance.now()` for sub-millisecond timings. See the
[Performance API](/docs/api/performance).

```typescript
const t0 = performance.now();
doWork();
console.log(`took ${(performance.now() - t0).toFixed(2)}ms`);
```

## Patterns

### Debounce

```typescript
function debounce<T extends (...args: any[]) => void>(fn: T, wait: number) {
  let timer: number | undefined;
  return (...args: Parameters<T>) => {
    if (timer !== undefined) clearTimeout(timer);
    timer = setTimeout(() => fn(...args), wait);
  };
}
```

### Throttle

```typescript
function throttle<T extends (...args: any[]) => void>(fn: T, wait: number) {
  let last = 0;
  return (...args: Parameters<T>) => {
    const now = Date.now();
    if (now - last >= wait) {
      last = now;
      fn(...args);
    }
  };
}
```

### Timeout race

```typescript
function withTimeout<T>(work: Promise<T>, ms: number): Promise<T> {
  return Promise.race([
    work,
    new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error("Timeout")), ms)
    ),
  ]);
}

const result = await withTimeout(fetch("/slow").then((r) => r.text()), 3000);
```

## See Also

- [Performance API](/docs/api/performance)
- [Cron API](/docs/api/cron) for cron-style schedules
- [Process API](/docs/api/process) for `Andromeda.sleep` and signals
