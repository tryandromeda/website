---
title: "Window API"
description: "Native OS windows with Andromeda.Window — winit-backed, canvas-aware"
section: "API Reference"
order: 24
id: "window-api"
---

`Andromeda.Window` opens a real OS window on macOS, Windows, and Linux (X11 /
Wayland) using [winit](https://crates.io/crates/winit). Windows are
`EventTarget`-style — you attach listeners for keyboard, mouse, resize, and
close events, then drive the loop with `Andromeda.Window.mainloop()`.

The Window API ships behind the `window` Cargo feature. To use it you must compile Andromeda with
`--features window`:

```bash
cargo run --features window -- run examples/window.ts
```

When the feature is missing, accessing `Andromeda.Window` or calling
`Andromeda.createWindow` throws:

```text
Window extension is not available. Make sure the 'window' feature is enabled.
```

## Creating a window

```typescript
const win = Andromeda.createWindow({
  title: "Hello, Andromeda",
  width: 800,
  height: 600,
});
```

`Andromeda.createWindow(options?)` is shorthand for
`new Andromeda.Window(options)`.

### Options

```typescript
interface CreateWindowOptions {
  title?: string; // default: "Andromeda"
  width?: number; // default: 800   (logical pixels)
  height?: number; // default: 600   (logical pixels)
  resizable?: boolean; // default: true
  visible?: boolean; // default: true
}
```

### Instance properties

| Property | Type      | Description                                |
| -------- | --------- | ------------------------------------------ |
| `rid`    | `number`  | Internal resource id (used by canvas blit) |
| `title`  | `string`  | The current window title                   |
| `width`  | `number`  | Inner width in logical pixels              |
| `height` | `number`  | Inner height in logical pixels             |
| `closed` | `boolean` | `true` once the window has been closed     |

## Events

Windows expose the standard `addEventListener` / `removeEventListener` /
`dispatchEvent` trio — attach handlers like you would on an `EventTarget`, and
tear them down with `removeEventListener`.

Events fire while `Andromeda.Window.mainloop()` is running. The dispatched event
is a plain object: `{ type, detail, target }`.

| Event       | `detail` shape               |
| ----------- | ---------------------------- |
| `close`     | none — the window is closing |
| `resize`    | `ResizeEventDetail`          |
| `keydown`   | `KeyEventDetail`             |
| `keyup`     | `KeyEventDetail`             |
| `mousemove` | `MouseEventDetail`           |
| `mousedown` | `MouseEventDetail`           |
| `mouseup`   | `MouseEventDetail`           |

### Event detail interfaces

```typescript
interface ResizeEventDetail {
  width: number;
  height: number;
  scaleFactor: number;
}

interface KeyEventDetail {
  key: string; // KeyboardEvent.key (e.g. "Enter", "a")
  code: string; // KeyboardEvent.code (e.g. "Escape", "KeyA")
  keyCode: number; // legacy numeric code
  which: number; // alias of keyCode
  location: 0 | 1 | 2 | 3;
  altKey: boolean;
  ctrlKey: boolean;
  metaKey: boolean; // Command on macOS, Super on Linux
  shiftKey: boolean;
  repeat: boolean; // true for auto-repeat
  isComposing: boolean; // part of an IME composition
}

interface MouseEventDetail {
  x: number;
  y: number;
  button: number; // 0=left, 1=middle, 2=right, 3=back, 4=forward, -1 on mousemove
  buttons: number; // bitmask of currently held buttons
  altKey: boolean;
  ctrlKey: boolean;
  metaKey: boolean;
  shiftKey: boolean;
}
```

### Example: keyboard close

```typescript
const win = Andromeda.createWindow({ title: "Demo" });

win.addEventListener("keydown", (e) => {
  if (e.detail.code === "Escape") win.close();
});

win.addEventListener("close", () => {
  console.log("goodbye");
});

await Andromeda.Window.mainloop();
```

## Rendering

### `present(r, g, b, a?)`

Clears the swapchain to a solid RGBA color and presents one frame. Channel
values are in `[0, 1]`. Useful as a render-loop smoke test before wiring real
content.

```typescript
const win = Andromeda.createWindow({ title: "Solid" });
win.present(0.2, 0.6, 0.9);
await Andromeda.Window.mainloop();
```

### `presentCanvas(canvas)`

Blit an `OffscreenCanvas`'s latest frame to the window. Andromeda shares a
single `wgpu` device between the canvas and the window, so this is a zero-copy
GPU blit — no CPU readback. The canvas can be any size; it stretches to fill the
window.

`presentCanvas` requires the runtime to be built with **both** the `window` and
`canvas` features. It throws otherwise.

```typescript
const WIDTH = 640;
const HEIGHT = 480;

const win = Andromeda.createWindow({
  title: "Canvas",
  width: WIDTH,
  height: HEIGHT,
});
const canvas = new OffscreenCanvas(WIDTH, HEIGHT);
const ctx = canvas.getContext("2d")!;

let frame = 0;
await Andromeda.Window.mainloop(() => {
  frame++;
  const t = frame / 60;

  ctx.fillStyle = `rgb(${20 + 20 * Math.sin(t) | 0}, 40, 80)`;
  ctx.fillRect(0, 0, WIDTH, HEIGHT);

  ctx.fillStyle = "#ffcc66";
  ctx.fillRect(280, 200 + Math.sin(t) * 60, 80, 80);

  win.presentCanvas(canvas);
});
```

See
[`examples/window.ts`](https://github.com/tryandromeda/andromeda/blob/main/examples/window.ts)
and
[`examples/breakout.ts`](https://github.com/tryandromeda/andromeda/blob/main/examples/games/breakout.ts)
for full demos.

## Window lifecycle

### `Andromeda.Window.mainloop(callback?)`

Drives the winit event loop, dispatching events to every open window. Returns
once every open window has been closed. The optional `callback` runs once per
frame after events are dispatched — use it for rendering or state updates.

```typescript
// Idle loop — just dispatch events.
await Andromeda.Window.mainloop();

// Per-frame callback.
await Andromeda.Window.mainloop(() => {
  // animate, render, etc.
});
```

### `close()`, `setTitle`, `setVisible`, sizing

```typescript
win.close(); // close and drop the window
win.setTitle("New title");
win.setVisible(false);

win.setSize(1280, 720);
const { width, height, scaleFactor } = win.getSize();
```

## Native handle access

`rawHandle()` returns the OS-level window and display handles so you can hand
the window off to a WebGPU surface bridge or other native interop. The shape is
compatible with `Deno.UnsafeWindowSurface`.

```typescript
interface RawWindowHandleData {
  system: "cocoa" | "win32" | "x11" | "wayland";
  windowHandle: string; // pointer-sized handle, parse with BigInt(...)
  displayHandle: string; // "0" when not applicable
  width: number;
  height: number;
}

const { system, windowHandle, displayHandle } = win.rawHandle();
console.log(system, BigInt(windowHandle), BigInt(displayHandle));
```

## Patterns

### Per-frame state machine

```typescript
const win = Andromeda.createWindow({ title: "State" });
let paused = false;

win.addEventListener("keydown", (e) => {
  if (e.detail.code === "Space") paused = !paused;
});

await Andromeda.Window.mainloop(() => {
  if (paused) return;
  step();
  render();
});
```

### Cleanly handling close

```typescript
const win = Andromeda.createWindow({ title: "Cleanup" });

win.addEventListener("close", () => {
  flushPersistence();
});

await Andromeda.Window.mainloop();
Andromeda.exit(0);
```

### Mouse tracking

```typescript
let mx = 0;
let my = 0;

win.addEventListener("mousemove", (e) => {
  mx = e.detail.x;
  my = e.detail.y;
});
```

## Limitations

- Only one mainloop can run at a time per process.
- `presentCanvas` requires the same process as the canvas — there is no
  cross-process surface sharing.

## See Also

- [Canvas API](/docs/api/canvas) — for the `OffscreenCanvas` half of
  `presentCanvas`
- [Building from Source](/docs/building)
- [`examples/window.ts`](https://github.com/tryandromeda/andromeda/blob/main/examples/window.ts)
  in the Andromeda repo
