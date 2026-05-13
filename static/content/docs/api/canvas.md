---
title: "Canvas API"
description: "GPU-accelerated 2D graphics with OffscreenCanvas"
section: "API Reference"
order: 2
id: "canvas"
---

Andromeda provides a hardware-accelerated 2D Canvas API powered by
[wgpu](https://wgpu.rs/). The surface follows the HTML
[`OffscreenCanvas`](https://developer.mozilla.org/en-US/docs/Web/API/OffscreenCanvas)
and
[`CanvasRenderingContext2D`](https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D)
specifications, with extensions for saving to disk and encoding to bytes.

The Canvas extension is enabled by default. Build without
`--no-default-features` or include the `canvas` feature explicitly when
compiling Andromeda yourself.

## Creating a Canvas

```typescript
const canvas = new OffscreenCanvas(800, 600);
const ctx = canvas.getContext("2d");

if (!ctx) {
  throw new Error("Failed to get 2D context");
}

canvas.getWidth(); // 800
canvas.getHeight(); // 600
```

## Drawing

### Rectangles

```typescript
const canvas = new OffscreenCanvas(400, 300);
const ctx = canvas.getContext("2d")!;

ctx.fillStyle = "#ff0000";
ctx.fillRect(50, 50, 100, 80);

ctx.strokeStyle = "#00ff00";
ctx.lineWidth = 3;
ctx.strokeRect(200, 50, 100, 80);

ctx.clearRect(60, 60, 30, 30);
```

### Paths

```typescript
ctx.beginPath();
ctx.moveTo(100, 100);
ctx.lineTo(200, 100);
ctx.lineTo(150, 200);
ctx.closePath();

ctx.fillStyle = "#4ecdc4";
ctx.fill();
ctx.strokeStyle = "#2c3e50";
ctx.stroke();
```

### Arcs and Curves

```typescript
ctx.beginPath();
ctx.arc(200, 150, 50, 0, Math.PI * 2);
ctx.fill();

ctx.beginPath();
ctx.ellipse(200, 150, 80, 40, 0, 0, Math.PI * 2);
ctx.stroke();

ctx.beginPath();
ctx.moveTo(20, 200);
ctx.quadraticCurveTo(120, 100, 220, 200);
ctx.bezierCurveTo(220, 100, 320, 100, 320, 200);
ctx.stroke();

ctx.roundRect(20, 20, 200, 80, 12);
ctx.stroke();
```

### Path2D

`Path2D` lets you record and reuse paths:

```typescript
const heart = new Path2D(
  "M10 30 A20 20 0 0 1 50 30 A20 20 0 0 1 90 30 Q90 60 50 90 Q10 60 10 30 Z",
);
ctx.fillStyle = "#e74c3c";
ctx.fill(heart);
```

## Colors and Styles

### Solid colors

```typescript
ctx.fillStyle = "#ff6b6b";
ctx.fillStyle = "rgb(255, 165, 0)";
ctx.fillStyle = "rgba(0, 255, 0, 0.5)";
ctx.fillStyle = "rebeccapurple";
```

### Gradients

```typescript
const linear = ctx.createLinearGradient(0, 0, 400, 0);
linear.addColorStop(0, "#ff6b6b");
linear.addColorStop(0.5, "#4ecdc4");
linear.addColorStop(1, "#45b7d1");

const radial = ctx.createRadialGradient(200, 150, 10, 200, 150, 150);
radial.addColorStop(0, "white");
radial.addColorStop(1, "black");

const conic = ctx.createConicGradient(0, 200, 150);
conic.addColorStop(0, "red");
conic.addColorStop(1, "blue");

ctx.fillStyle = linear;
ctx.fillRect(0, 0, 400, 300);
```

### Patterns

```typescript
const image = createImageBitmap("./pattern.png");
const pattern = ctx.createPattern(image, "repeat")!;
ctx.fillStyle = pattern;
ctx.fillRect(0, 0, 400, 300);
```

### Transparency and blending

```typescript
ctx.globalAlpha = 0.5;
ctx.globalCompositeOperation = "multiply"; // any HTML5 composite op
```

### Shadows

```typescript
ctx.shadowColor = "rgba(0, 0, 0, 0.4)";
ctx.shadowBlur = 8;
ctx.shadowOffsetX = 4;
ctx.shadowOffsetY = 4;
```

## Text

```typescript
ctx.font = "48px sans-serif";
ctx.textAlign = "center";
ctx.textBaseline = "middle";

ctx.fillStyle = "#2c3e50";
ctx.fillText("Hello, Andromeda!", 200, 100);

ctx.strokeStyle = "#e74c3c";
ctx.lineWidth = 2;
ctx.strokeText("Hello, Andromeda!", 200, 200);

const metrics = ctx.measureText("Hello");
console.log(metrics.width);
```

Additional text properties supported: `direction`, `letterSpacing`,
`wordSpacing`, `fontKerning`, `fontStretch`, `fontVariantCaps`, `textRendering`,
and `lang`.

## Lines and dashes

```typescript
ctx.lineWidth = 4;
ctx.lineCap = "round"; // "butt" | "round" | "square"
ctx.lineJoin = "round"; // "miter" | "round" | "bevel"
ctx.miterLimit = 10;

ctx.setLineDash([12, 6]);
ctx.lineDashOffset = 2;
ctx.beginPath();
ctx.moveTo(10, 10);
ctx.lineTo(390, 10);
ctx.stroke();
```

## Transforms

```typescript
ctx.save();
ctx.translate(200, 150);
ctx.rotate(Math.PI / 6);
ctx.scale(1.5, 1.5);
ctx.fillRect(-50, -25, 100, 50);
ctx.restore();
```

Andromeda also implements `transform`, `setTransform`, `resetTransform`, and
`getTransform` (returning a `DOMMatrix`).

## Image data and bitmaps

```typescript
// Load a bitmap from a path or URL
const bitmap = createImageBitmap("./photo.png");

ctx.drawImage(bitmap, 0, 0);
ctx.drawImage(bitmap, 0, 0, 100, 100);
ctx.drawImage(bitmap, 10, 10, 50, 50, 100, 100, 100, 100);

// Read and write pixels
const image = ctx.getImageData(0, 0, 100, 100);
ctx.putImageData(image, 200, 200);

const blank = ctx.createImageData(64, 64);
```

## Exporting

```typescript
const canvas = new OffscreenCanvas(600, 400);
const ctx = canvas.getContext("2d")!;

ctx.fillStyle = "#1a1a1a";
ctx.fillRect(0, 0, 600, 400);

// Save directly to disk
canvas.saveAsPng("artwork.png");

// Encode to bytes
const png = canvas.toBuffer("image/png");
const jpeg = canvas.toBuffer("image/jpeg", 0.85);

// Encode as data URL
const dataUrl = canvas.toDataURL("image/png");

// Or build a Blob
const blob = await canvas.convertToBlob({ type: "image/jpeg", quality: 0.85 });
```

`render()` forces all pending GPU operations to finalize and is occasionally
useful when you need to read back pixels immediately.

## Hit testing

```typescript
ctx.beginPath();
ctx.rect(50, 50, 100, 100);

ctx.isPointInPath(75, 75); // true
ctx.isPointInStroke(50, 50); // along the border
```

## See Also

- [Canvas examples](https://github.com/tryandromeda/andromeda/tree/main/examples)
  in the Andromeda repo (`canvas.ts`, `canvas_advanced.ts`,
  `canvas_gradient.ts`, `canvas_global_alpha.ts`)
- [File System API](/docs/api/file-system) for saving generated images
- [File API](/docs/api/file) for working with `Blob` outputs
