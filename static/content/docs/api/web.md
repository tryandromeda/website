---
title: "Web APIs"
description: "Events, text encoding, navigator, structuredClone, atob/btoa, AbortController"
section: "API Reference"
order: 19
id: "web-apis"
---

Andromeda implements core web-platform APIs from the WHATWG and W3C
specifications so existing code can run with minimal change.

## Events

Andromeda implements `EventTarget`, `Event`, and `CustomEvent` following the
WHATWG DOM specification.

```typescript
const target = new EventTarget();

target.addEventListener("greet", (event) => {
  console.log(event.type, (event as CustomEvent).detail);
});

target.dispatchEvent(new CustomEvent("greet", { detail: { name: "Alice" } }));
```

Listener options: `{ once, passive, signal }`. The `signal` option ties the
listener to an `AbortSignal` so calling `controller.abort()` removes it.

```typescript
const controller = new AbortController();
target.addEventListener("greet", handler, { signal: controller.signal });
controller.abort(); // removes the listener
```

## AbortController and AbortSignal

```typescript
const controller = new AbortController();

setTimeout(() => controller.abort("Timed out"), 1000);

try {
  await fetch("https://example.com/slow", { signal: controller.signal });
} catch (err) {
  if (err instanceof DOMException && err.name === "AbortError") {
    console.log("Aborted:", controller.signal.reason);
  }
}
```

Static helpers:

```typescript
const aborted = AbortSignal.abort("immediate");
const timeout = AbortSignal.timeout(5000);
const any = AbortSignal.any([signal1, signal2]);
```

## TextEncoder / TextDecoder

UTF-8 encode and decode following the WHATWG Encoding standard.

```typescript
const encoder = new TextEncoder();
const bytes = encoder.encode("Hello, 世界!");
console.log(bytes); // Uint8Array
console.log(encoder.encoding); // "utf-8"

// encodeInto writes into an existing buffer
const buffer = new Uint8Array(16);
const { read, written } = encoder.encodeInto("hi", buffer);

const decoder = new TextDecoder("utf-8", { fatal: false, ignoreBOM: false });
console.log(decoder.decode(bytes)); // "Hello, 世界!"
```

The decoder supports streaming via `{ stream: true }` on `decode()`.

## structuredClone

```typescript
const original = { a: 1, b: [2, 3], when: new Date() };
const copy = structuredClone(original);

// Circular references are handled
const circular: any = {};
circular.self = circular;
structuredClone(circular);

// Transfers move ownership instead of copying
const buf = new ArrayBuffer(8);
const moved = structuredClone(buf, { transfer: [buf] });
```

## Base64 (`atob` / `btoa`)

```typescript
const encoded = btoa("Hello, World!"); // "SGVsbG8sIFdvcmxkIQ=="
const decoded = atob(encoded); // "Hello, World!"
```

Both functions operate on the binary-string (ISO-8859-1) representation per the
HTML spec. For arbitrary bytes, encode through `TextEncoder` first.

## URL Encoding

`encodeURIComponent`, `decodeURIComponent`, `encodeURI`, and `decodeURI` are
provided as globals matching the WHATWG / ECMAScript behavior:

```typescript
encodeURIComponent("hello world?"); // "hello%20world%3F"
decodeURIComponent("hello%20world"); // "hello world"
```

## Console

See the [Console API](/docs/api/console) page. Andromeda implements
`console.log`, `console.error`, `console.warn`, `console.info`, `console.debug`,
`console.trace`, `console.group`, `console.groupEnd`, `console.table`,
`console.time` / `timeEnd`, `console.dir`, and CSS-style formatting with `%c`.

## DOMException

```typescript
throw new DOMException("Invalid state", "InvalidStateError");
```

`DOMException` supports the standard error names (`AbortError`, `NetworkError`,
`NotFoundError`, `NotSupportedError`, `QuotaExceededError`, `SecurityError`,
`SyntaxError`, `TimeoutError`, etc.).

## navigator

Andromeda implements the Navigator surface enough for feature detection:

```typescript
navigator.userAgent; // "Andromeda/0.1.10 …"
navigator.platform;
navigator.appName; // "Netscape" (legacy)
navigator.appCodeName; // "Mozilla" (legacy)
navigator.appVersion;
navigator.product; // "Gecko"
navigator.productSub;
navigator.vendor;
navigator.vendorSub;

// User-Agent Client Hints
navigator.userAgentData.brands;
navigator.userAgentData.platform;
navigator.userAgentData.mobile;
await navigator.userAgentData.getHighEntropyValues(["architecture", "model"]);
```

`navigator.locks` is documented separately on the
[Web Locks API page](/docs/api/web-locks).

## queueMicrotask

```typescript
queueMicrotask(() => {
  // runs after the current synchronous job, before the next task
});
```

## Timers

`setTimeout`, `setInterval`, `clearTimeout`, `clearInterval` are covered in the
[Time API](/docs/api/time).

## Patterns

### Custom event bus

```typescript
class Bus extends EventTarget {
  emit<T>(name: string, detail: T) {
    this.dispatchEvent(new CustomEvent(name, { detail }));
  }
  on<T>(name: string, handler: (detail: T) => void) {
    this.addEventListener(name, (e) => handler((e as CustomEvent).detail));
  }
}

const bus = new Bus();
bus.on<string>("hello", (msg) => console.log("got:", msg));
bus.emit("hello", "world");
```

### Cancellable async work

```typescript
async function withTimeout<T>(
  work: (signal: AbortSignal) => Promise<T>,
  ms: number,
) {
  const signal = AbortSignal.timeout(ms);
  return work(signal);
}

const data = await withTimeout(
  (signal) => fetch("https://example.com", { signal }).then((r) => r.text()),
  3000,
);
```

## See Also

- [Fetch API](/docs/api/fetch)
- [Streams API](/docs/api/streams)
- [URL API](/docs/api/url)
- [Web Locks API](/docs/api/web-locks)
