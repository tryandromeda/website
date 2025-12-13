---
title: "Canvas API"
description: "Hardware-accelerated 2D graphics with GPU-powered Canvas API"
section: "API Reference"
order: 2
id: "canvas"
---

Andromeda provides a hardware-accelerated 2D Canvas API powered by WGPU,
enabling high-performance graphics rendering with full support for the standard
Canvas 2D Context specification.

## Overview

The Canvas API allows you to:

- Create and manipulate 2D graphics
- Draw shapes, paths, text, and images
- Apply colors, gradients, and styles
- Export graphics as PNG images
- Hardware-accelerated rendering with GPU

## Creating a Canvas

### OffscreenCanvas

Use `OffscreenCanvas` to create a canvas without a DOM:

```typescript
// Create a 400x300 canvas
const canvas = new OffscreenCanvas(400, 300);

// Get the 2D rendering context
const ctx = canvas.getContext("2d");

if (!ctx) {
  throw new Error("Failed to get 2D context");
}
```

## Canvas Context

### Getting the Context

```typescript
const canvas = new OffscreenCanvas(800, 600);
const ctx = canvas.getContext("2d");

// Check if context was created successfully
if (!ctx) {
  console.error("Failed to get 2D context");
}
```

## Drawing Shapes

### Rectangles

```typescript
const canvas = new OffscreenCanvas(400, 300);
const ctx = canvas.getContext("2d")!;

// Fill a rectangle
ctx.fillStyle = "#ff0000";
ctx.fillRect(50, 50, 100, 80);

// Stroke (outline) a rectangle
ctx.strokeStyle = "#00ff00";
ctx.lineWidth = 3;
ctx.strokeRect(200, 50, 100, 80);

// Clear a rectangular area
ctx.clearRect(60, 60, 30, 30);
```

### Paths

```typescript
const canvas = new OffscreenCanvas(400, 300);
const ctx = canvas.getContext("2d")!;

// Begin a new path
ctx.beginPath();

// Move to starting point
ctx.moveTo(100, 100);

// Draw lines
ctx.lineTo(200, 100);
ctx.lineTo(150, 200);
ctx.lineTo(100, 100);

// Close the path
ctx.closePath();

// Fill or stroke the path
ctx.fillStyle = "#4ecdc4";
ctx.fill();
ctx.strokeStyle = "#2c3e50";
ctx.stroke();
```

### Circles and Arcs

```typescript
const canvas = new OffscreenCanvas(400, 300);
const ctx = canvas.getContext("2d")!;

// Draw a circle
ctx.beginPath();
ctx.arc(200, 150, 50, 0, Math.PI * 2);
ctx.fillStyle = "#e74c3c";
ctx.fill();

// Draw a semi-circle
ctx.beginPath();
ctx.arc(100, 150, 40, 0, Math.PI);
ctx.fillStyle = "#3498db";
ctx.fill();

// Draw an arc
ctx.beginPath();
ctx.arc(300, 150, 40, 0, Math.PI * 1.5);
ctx.strokeStyle = "#2ecc71";
ctx.lineWidth = 4;
ctx.stroke();
```

## Colors and Styles

### Solid Colors

```typescript
const canvas = new OffscreenCanvas(400, 300);
const ctx = canvas.getContext("2d")!;

// Hex colors
ctx.fillStyle = "#ff6b6b";
ctx.fillRect(10, 10, 80, 80);

// RGB colors
ctx.fillStyle = "rgb(255, 165, 0)";
ctx.fillRect(100, 10, 80, 80);

// RGBA colors (with transparency)
ctx.fillStyle = "rgba(0, 255, 0, 0.5)";
ctx.fillRect(190, 10, 80, 80);

// Named colors
ctx.fillStyle = "rebeccapurple";
ctx.fillRect(280, 10, 80, 80);
```

### Gradients

Andromeda supports linear gradients for advanced visual effects:

```typescript
const canvas = new OffscreenCanvas(400, 300);
const ctx = canvas.getContext("2d")!;

// Create a linear gradient
const gradient = ctx.createLinearGradient(0, 0, 400, 0);

// Add color stops
gradient.addColorStop(0, "#ff6b6b");
gradient.addColorStop(0.5, "#4ecdc4");
gradient.addColorStop(1, "#45b7d1");

// Use the gradient as a fill style
ctx.fillStyle = gradient;
ctx.fillRect(0, 0, 400, 300);
```

### Transparency

```typescript
const canvas = new OffscreenCanvas(400, 300);
const ctx = canvas.getContext("2d")!;

// Set global alpha (affects all subsequent drawing operations)
ctx.globalAlpha = 0.5;

ctx.fillStyle = "red";
ctx.fillRect(50, 50, 100, 100);

ctx.fillStyle = "blue";
ctx.fillRect(100, 100, 100, 100);

// Reset global alpha
ctx.globalAlpha = 1.0;
```

## Text Rendering

### Drawing Text

```typescript
const canvas = new OffscreenCanvas(600, 200);
const ctx = canvas.getContext("2d")!;

// Set font properties
ctx.font = "48px sans-serif";
ctx.fillStyle = "#2c3e50";

// Fill text
ctx.fillText("Hello, Andromeda!", 50, 100);

// Stroke text
ctx.strokeStyle = "#e74c3c";
ctx.lineWidth = 2;
ctx.strokeText("Hello, Andromeda!", 50, 150);
```

### Font Styles

```typescript
const canvas = new OffscreenCanvas(600, 400);
const ctx = canvas.getContext("2d")!;

// Different font styles
ctx.font = "bold 32px Arial";
ctx.fillText("Bold Arial", 50, 50);

ctx.font = "italic 28px Georgia";
ctx.fillText("Italic Georgia", 50, 100);

ctx.font = "24px monospace";
ctx.fillText("Monospace Font", 50, 150);

ctx.font = "36px sans-serif";
ctx.fillText("Sans-serif", 50, 200);
```

## Line Styles

### Line Properties

```typescript
const canvas = new OffscreenCanvas(400, 300);
const ctx = canvas.getContext("2d")!;

// Line width
ctx.lineWidth = 5;
ctx.strokeStyle = "#2c3e50";
ctx.beginPath();
ctx.moveTo(50, 50);
ctx.lineTo(350, 50);
ctx.stroke();

// Different line widths
ctx.lineWidth = 10;
ctx.beginPath();
ctx.moveTo(50, 100);
ctx.lineTo(350, 100);
ctx.stroke();

ctx.lineWidth = 15;
ctx.beginPath();
ctx.moveTo(50, 150);
ctx.lineTo(350, 150);
ctx.stroke();
```

## Saving Canvas as PNG

### saveAsPng()

Export your canvas as a PNG image file:

```typescript
const canvas = new OffscreenCanvas(600, 400);
const ctx = canvas.getContext("2d")!;

// Draw something
ctx.fillStyle = "#f0f0f0";
ctx.fillRect(0, 0, 600, 400);

ctx.fillStyle = "#e74c3c";
ctx.fillRect(100, 100, 200, 150);

// Save as PNG
const success = canvas.saveAsPng("output.png");

if (success) {
  console.log("✅ Image saved successfully!");
} else {
  console.error("❌ Failed to save image");
}
```

## Complete Examples

### Colorful Grid

```typescript
const canvas = new OffscreenCanvas(600, 400);
const ctx = canvas.getContext("2d")!;

// Background
ctx.fillStyle = "#1a1a1a";
ctx.fillRect(0, 0, 600, 400);

// Draw colorful grid
const colors = [
  "#ff6b6b",
  "#4ecdc4",
  "#45b7d1",
  "#96ceb4",
  "#feca57",
  "#ee5a6f",
];

for (let i = 0; i < colors.length; i++) {
  ctx.fillStyle = colors[i];
  ctx.fillRect(50 + i * 80, 50, 70, 70);
  ctx.fillRect(50 + i * 80, 140, 70, 70);
  ctx.fillRect(50 + i * 80, 230, 70, 70);
}

// Add text
ctx.fillStyle = "#ffffff";
ctx.font = "32px sans-serif";
ctx.fillText("Colorful Grid Demo", 150, 350);

canvas.saveAsPng("colorful-grid.png");
```

### Gradient Banner

```typescript
const canvas = new OffscreenCanvas(800, 200);
const ctx = canvas.getContext("2d")!;

// Create gradient background
const gradient = ctx.createLinearGradient(0, 0, 800, 0);
gradient.addColorStop(0, "#667eea");
gradient.addColorStop(0.5, "#764ba2");
gradient.addColorStop(1, "#f093fb");

ctx.fillStyle = gradient;
ctx.fillRect(0, 0, 800, 200);

// Add text with shadow effect
ctx.fillStyle = "rgba(0, 0, 0, 0.3)";
ctx.font = "bold 56px Arial";
ctx.fillText("Andromeda", 152, 112);

ctx.fillStyle = "#ffffff";
ctx.fillText("Andromeda", 150, 110);

canvas.saveAsPng("gradient-banner.png");
```

### Data Visualization

```typescript
const canvas = new OffscreenCanvas(600, 400);
const ctx = canvas.getContext("2d")!;

// Background
ctx.fillStyle = "#ffffff";
ctx.fillRect(0, 0, 600, 400);

// Sample data
const data = [65, 28, 80, 45, 92, 38, 71];
const barWidth = 60;
const maxHeight = 250;

// Draw bars
for (let i = 0; i < data.length; i++) {
  const barHeight = (data[i] / 100) * maxHeight;
  const x = 50 + i * (barWidth + 20);
  const y = 300 - barHeight;

  // Bar gradient
  const gradient = ctx.createLinearGradient(x, y, x, 300);
  gradient.addColorStop(0, "#4facfe");
  gradient.addColorStop(1, "#00f2fe");

  ctx.fillStyle = gradient;
  ctx.fillRect(x, y, barWidth, barHeight);

  // Value label
  ctx.fillStyle = "#2c3e50";
  ctx.font = "16px Arial";
  ctx.fillText(data[i].toString(), x + 20, y - 10);
}

// Title
ctx.fillStyle = "#2c3e50";
ctx.font = "bold 24px Arial";
ctx.fillText("Monthly Data", 200, 40);

canvas.saveAsPng("data-visualization.png");
```

### Transparency and Overlays

```typescript
const canvas = new OffscreenCanvas(400, 400);
const ctx = canvas.getContext("2d")!;

// Background
ctx.fillStyle = "#ecf0f1";
ctx.fillRect(0, 0, 400, 400);

// Draw overlapping shapes with transparency
ctx.globalAlpha = 0.6;

ctx.fillStyle = "#e74c3c";
ctx.fillRect(50, 50, 150, 150);

ctx.fillStyle = "#3498db";
ctx.fillRect(125, 125, 150, 150);

ctx.fillStyle = "#2ecc71";
ctx.fillRect(200, 50, 150, 150);

// Reset alpha
ctx.globalAlpha = 1.0;

// Add border
ctx.strokeStyle = "#34495e";
ctx.lineWidth = 3;
ctx.strokeRect(0, 0, 400, 400);

canvas.saveAsPng("transparency-demo.png");
```

## Properties and Methods Reference

### Canvas Properties

- `width: number` - Canvas width in pixels
- `height: number` - Canvas height in pixels

### Context Properties

- `fillStyle: string | CanvasGradient` - Fill color or gradient
- `strokeStyle: string` - Stroke color
- `lineWidth: number` - Line width for strokes
- `font: string` - Text font specification
- `globalAlpha: number` - Global transparency (0.0 to 1.0)

### Context Methods

#### Shape Drawing

- `fillRect(x, y, width, height)` - Draw filled rectangle
- `strokeRect(x, y, width, height)` - Draw rectangle outline
- `clearRect(x, y, width, height)` - Clear rectangular area

#### Path Drawing

- `beginPath()` - Start a new path
- `closePath()` - Close the current path
- `moveTo(x, y)` - Move to point without drawing
- `lineTo(x, y)` - Draw line to point
- `arc(x, y, radius, startAngle, endAngle)` - Draw arc/circle
- `fill()` - Fill the current path
- `stroke()` - Stroke the current path

#### Text Drawing

- `fillText(text, x, y)` - Draw filled text
- `strokeText(text, x, y)` - Draw text outline

#### Gradients

- `createLinearGradient(x0, y0, x1, y1)` - Create linear gradient
- `gradient.addColorStop(offset, color)` - Add color to gradient

#### Export

- `canvas.saveAsPng(filename)` - Save canvas as PNG file

## Performance Tips

1. **Minimize Context State Changes**: Group drawing operations with the same
   style together

```typescript
// Good - set style once
ctx.fillStyle = "red";
ctx.fillRect(0, 0, 50, 50);
ctx.fillRect(100, 0, 50, 50);
ctx.fillRect(200, 0, 50, 50);

// Less efficient - changes style repeatedly
ctx.fillStyle = "red";
ctx.fillRect(0, 0, 50, 50);
ctx.fillStyle = "blue";
ctx.fillRect(100, 0, 50, 50);
ctx.fillStyle = "red";
ctx.fillRect(200, 0, 50, 50);
```

2. **Use Appropriate Canvas Size**: Create canvases at the size you need

```typescript
// For web thumbnail
const thumbnail = new OffscreenCanvas(320, 240);

// For high-res poster
const poster = new OffscreenCanvas(3840, 2160);
```

3. **Reuse Canvas Objects**: Don't create new canvases unnecessarily

## Hardware Acceleration

Andromeda's Canvas API is powered by WGPU, providing:

- **GPU Acceleration** - All rendering operations use the GPU
- **High Performance** - Efficient for complex graphics and animations
- **Cross-Platform** - Works consistently across Windows, macOS, and Linux

## Best Practices

1. **Always check context creation**:

```typescript
const ctx = canvas.getContext("2d");
if (!ctx) {
  throw new Error("Failed to get 2D context");
}
```

2. **Use gradients for smooth color transitions**:

```typescript
const gradient = ctx.createLinearGradient(0, 0, width, 0);
gradient.addColorStop(0, "red");
gradient.addColorStop(1, "blue");
ctx.fillStyle = gradient;
```

3. **Reset globalAlpha after using transparency**:

```typescript
ctx.globalAlpha = 0.5;
// ... draw transparent elements ...
ctx.globalAlpha = 1.0; // Reset
```

4. **Save frequently to avoid data loss**:

```typescript
// Save intermediate results
canvas.saveAsPng("work-in-progress.png");
```

## Limitations

Current limitations in Andromeda's Canvas implementation:

- No image loading (ImageData not yet supported)
- Radial gradients not yet implemented
- Pattern fills not yet supported
- Advanced compositing modes limited

These features are planned for future releases.

## See Also

- [Canvas Example](/docs/examples/canvas) - Complete working examples
- [Performance API](/docs/api/performance) - Measure rendering performance
- [File System API](/docs/api/file-system) - Save and load image files
