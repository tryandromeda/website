# Canvas API

Andromeda provides a comprehensive Canvas API for creating 2D graphics, drawings, and visualizations. The API is based on the standard HTML5 Canvas specification.

## Overview

The Canvas API allows you to:

- Draw shapes, lines, and text
- Render images and apply transformations
- Create complex graphics and visualizations
- Export graphics to PNG format

## Creating a Canvas

### `OffscreenCanvas`

Create a canvas that renders off-screen:

```typescript
const canvas = new OffscreenCanvas(width, height);
const ctx = canvas.getContext("2d");
```

**Parameters:**

- `width` - Canvas width in pixels
- `height` - Canvas height in pixels

**Example:**

```typescript
// Create a 800x600 canvas
const canvas = new OffscreenCanvas(800, 600);
const ctx = canvas.getContext("2d");

if (!ctx) {
  throw new Error("Failed to get 2D context");
}
```

## Drawing Context

### Getting the Context

```typescript
const ctx = canvas.getContext("2d");
```

The context provides all drawing methods and properties.

### Basic Shapes

#### Rectangles

```typescript
// Filled rectangle
ctx.fillStyle = "#ff0000";
ctx.fillRect(x, y, width, height);

// Outlined rectangle
ctx.strokeStyle = "#00ff00";
ctx.lineWidth = 2;
ctx.strokeRect(x, y, width, height);

// Clear rectangle (make transparent)
ctx.clearRect(x, y, width, height);
```

#### Circles and Arcs

```typescript
// Circle
ctx.beginPath();
ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
ctx.fillStyle = "#0000ff";
ctx.fill();

// Arc
ctx.beginPath();
ctx.arc(centerX, centerY, radius, startAngle, endAngle);
ctx.strokeStyle = "#ff00ff";
ctx.stroke();
```

#### Custom Paths

```typescript
ctx.beginPath();
ctx.moveTo(50, 50);      // Move to starting point
ctx.lineTo(150, 50);     // Draw line to point
ctx.lineTo(100, 150);    // Draw line to another point
ctx.closePath();         // Close the path
ctx.fillStyle = "#ffff00";
ctx.fill();
```

### Colors and Styles

#### Fill and Stroke Colors

```typescript
// Solid colors
ctx.fillStyle = "#ff0000";           // Hex
ctx.fillStyle = "rgb(255, 0, 0)";    // RGB
ctx.fillStyle = "rgba(255, 0, 0, 0.5)"; // RGBA
ctx.fillStyle = "red";               // Named color

// Apply to shapes
ctx.fillRect(10, 10, 100, 100);
```

#### Gradients

```typescript
// Linear gradient
const gradient = ctx.createLinearGradient(0, 0, 200, 0);
gradient.addColorStop(0, "#ff0000");
gradient.addColorStop(1, "#0000ff");
ctx.fillStyle = gradient;
ctx.fillRect(0, 0, 200, 100);

// Radial gradient
const radialGradient = ctx.createRadialGradient(100, 100, 0, 100, 100, 100);
radialGradient.addColorStop(0, "#fff");
radialGradient.addColorStop(1, "#000");
ctx.fillStyle = radialGradient;
ctx.fillRect(0, 0, 200, 200);
```

#### Line Styles

```typescript
ctx.lineWidth = 5;
ctx.lineCap = "round";     // "butt", "round", "square"
ctx.lineJoin = "round";    // "miter", "round", "bevel"
ctx.strokeStyle = "#000";
```

### Text Rendering

#### Basic Text

```typescript
ctx.font = "24px Arial";
ctx.fillStyle = "#000";
ctx.fillText("Hello, World!", x, y);

// Outlined text
ctx.strokeStyle = "#ff0000";
ctx.strokeText("Outlined Text", x, y);
```

#### Text Properties

```typescript
ctx.font = "bold 32px 'Times New Roman'";
ctx.textAlign = "center";     // "start", "end", "left", "right", "center"
ctx.textBaseline = "middle";  // "top", "hanging", "middle", "alphabetic", "ideographic", "bottom"
ctx.fillText("Centered Text", canvas.width / 2, canvas.height / 2);
```

#### Text Measurements

```typescript
const text = "Measure me!";
const metrics = ctx.measureText(text);
console.log(`Text width: ${metrics.width}px`);
```

### Transformations

#### Translation

```typescript
ctx.save();                    // Save current state
ctx.translate(100, 50);        // Move origin
ctx.fillRect(0, 0, 50, 50);   // Draw at new origin
ctx.restore();                 // Restore previous state
```

#### Rotation

```typescript
ctx.save();
ctx.translate(canvas.width / 2, canvas.height / 2); // Move to center
ctx.rotate(Math.PI / 4);       // Rotate 45 degrees
ctx.fillRect(-25, -25, 50, 50); // Draw centered square
ctx.restore();
```

#### Scaling

```typescript
ctx.save();
ctx.scale(2, 2);              // Scale 2x
ctx.fillRect(10, 10, 50, 50); // Will appear as 100x100
ctx.restore();
```

#### Custom Transforms

```typescript
// Matrix transformation: transform(a, b, c, d, e, f)
ctx.transform(1, 0.5, -0.5, 1, 30, 10);
ctx.fillRect(0, 0, 50, 50);
```

### Clipping and Compositing

#### Clipping Paths

```typescript
// Create clipping region
ctx.beginPath();
ctx.arc(100, 100, 50, 0, Math.PI * 2);
ctx.clip();

// Everything drawn now will be clipped to the circle
ctx.fillStyle = "red";
ctx.fillRect(0, 0, 200, 200); // Only the part inside circle shows
```

#### Global Composite Operations

```typescript
ctx.globalCompositeOperation = "multiply";
// Other options: "source-over", "source-in", "source-out", "destination-over", etc.

ctx.fillStyle = "red";
ctx.fillRect(50, 50, 100, 100);

ctx.fillStyle = "blue";
ctx.fillRect(100, 100, 100, 100); // Will multiply with red
```

#### Global Alpha

```typescript
ctx.globalAlpha = 0.5; // 50% transparency
ctx.fillStyle = "red";
ctx.fillRect(10, 10, 100, 100); // Semi-transparent

ctx.globalAlpha = 1.0; // Reset to opaque
```

## Advanced Features

### Shadows

```typescript
ctx.shadowColor = "rgba(0, 0, 0, 0.5)";
ctx.shadowOffsetX = 5;
ctx.shadowOffsetY = 5;
ctx.shadowBlur = 10;

ctx.fillStyle = "blue";
ctx.fillRect(50, 50, 100, 100); // Rectangle with shadow
```

### Image Data Manipulation

```typescript
// Get image data
const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
const data = imageData.data; // Uint8ClampedArray (RGBA values)

// Manipulate pixels (invert colors)
for (let i = 0; i < data.length; i += 4) {
  data[i] = 255 - data[i];         // Red
  data[i + 1] = 255 - data[i + 1]; // Green  
  data[i + 2] = 255 - data[i + 2]; // Blue
  // data[i + 3] is alpha, leave unchanged
}

// Put modified data back
ctx.putImageData(imageData, 0, 0);
```

### Patterns

```typescript
// Create a pattern from another canvas
const patternCanvas = new OffscreenCanvas(20, 20);
const patternCtx = patternCanvas.getContext("2d")!;

// Draw pattern
patternCtx.fillStyle = "#ff0000";
patternCtx.fillRect(0, 0, 10, 10);
patternCtx.fillStyle = "#0000ff";
patternCtx.fillRect(10, 10, 10, 10);

// Use pattern
const pattern = ctx.createPattern(patternCanvas, "repeat");
ctx.fillStyle = pattern;
ctx.fillRect(0, 0, 200, 200);
```

## Exporting Graphics

### Save as PNG

```typescript
// Render the canvas
canvas.render();

// Save to file
canvas.saveAsPng("output.png");
console.log("✅ Image saved as output.png");
```

### Get Image Data

```typescript
// Get raw RGBA pixel data
const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
console.log(`Image data: ${imageData.width}x${imageData.height}`);
```

## Practical Examples

### Drawing a Chart

```typescript
function drawBarChart(canvas: OffscreenCanvas, data: number[]) {
  const ctx = canvas.getContext("2d")!;
  
  // Clear canvas
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  
  // Chart settings
  const padding = 40;
  const chartWidth = canvas.width - padding * 2;
  const chartHeight = canvas.height - padding * 2;
  const barWidth = chartWidth / data.length;
  const maxValue = Math.max(...data);
  
  // Draw bars
  data.forEach((value, index) => {
    const barHeight = (value / maxValue) * chartHeight;
    const x = padding + index * barWidth;
    const y = canvas.height - padding - barHeight;
    
    // Bar
    ctx.fillStyle = `hsl(${index * 40}, 70%, 50%)`;
    ctx.fillRect(x, y, barWidth - 2, barHeight);
    
    // Value label
    ctx.fillStyle = "#000";
    ctx.font = "12px Arial";
    ctx.textAlign = "center";
    ctx.fillText(value.toString(), x + barWidth / 2, y - 5);
  });
  
  // Title
  ctx.fillStyle = "#000";
  ctx.font = "bold 18px Arial";
  ctx.textAlign = "center";
  ctx.fillText("Sales Data", canvas.width / 2, 25);
}

// Usage
const canvas = new OffscreenCanvas(600, 400);
drawBarChart(canvas, [25, 40, 35, 60, 45, 55]);
canvas.render();
canvas.saveAsPng("chart.png");
```

### Creating a Logo

```typescript
function createLogo(canvas: OffscreenCanvas) {
  const ctx = canvas.getContext("2d")!;
  
  // Background
  const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
  gradient.addColorStop(0, "#667eea");
  gradient.addColorStop(1, "#764ba2");
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  
  // Center circle
  const centerX = canvas.width / 2;
  const centerY = canvas.height / 2;
  
  ctx.beginPath();
  ctx.arc(centerX, centerY, 80, 0, Math.PI * 2);
  ctx.fillStyle = "#ffffff";
  ctx.fill();
  
  // Inner design
  ctx.beginPath();
  ctx.arc(centerX, centerY, 60, 0, Math.PI * 2);
  ctx.fillStyle = "#4c51bf";
  ctx.fill();
  
  // Text
  ctx.fillStyle = "#ffffff";
  ctx.font = "bold 24px Arial";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText("LOGO", centerX, centerY);
}

// Usage
const canvas = new OffscreenCanvas(300, 300);
createLogo(canvas);
canvas.render();
canvas.saveAsPng("logo.png");
```

### Animated Visualization

```typescript
function drawFrame(canvas: OffscreenCanvas, frame: number) {
  const ctx = canvas.getContext("2d")!;
  
  // Clear canvas
  ctx.fillStyle = "#000";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  
  // Draw rotating elements
  const centerX = canvas.width / 2;
  const centerY = canvas.height / 2;
  
  for (let i = 0; i < 8; i++) {
    ctx.save();
    
    // Position and rotate
    ctx.translate(centerX, centerY);
    ctx.rotate((frame * 0.02) + (i * Math.PI / 4));
    ctx.translate(60, 0);
    
    // Draw shape
    ctx.beginPath();
    ctx.arc(0, 0, 20, 0, Math.PI * 2);
    ctx.fillStyle = `hsl(${(frame + i * 45) % 360}, 70%, 50%)`;
    ctx.fill();
    
    ctx.restore();
  }
}

// Create animation frames
const canvas = new OffscreenCanvas(400, 400);
for (let frame = 0; frame < 60; frame++) {
  drawFrame(canvas, frame);
  canvas.render();
  canvas.saveAsPng(`animation-${frame.toString().padStart(3, '0')}.png`);
}
```

### Data Visualization

```typescript
interface DataPoint {
  x: number;
  y: number;
  label: string;
}

function drawScatterPlot(canvas: OffscreenCanvas, data: DataPoint[]) {
  const ctx = canvas.getContext("2d")!;
  
  // Settings
  const padding = 60;
  const plotWidth = canvas.width - padding * 2;
  const plotHeight = canvas.height - padding * 2;
  
  // Find data ranges
  const xMin = Math.min(...data.map(d => d.x));
  const xMax = Math.max(...data.map(d => d.x));
  const yMin = Math.min(...data.map(d => d.y));
  const yMax = Math.max(...data.map(d => d.y));
  
  // Helper function to convert data coordinates to canvas coordinates
  const toCanvasX = (x: number) => padding + ((x - xMin) / (xMax - xMin)) * plotWidth;
  const toCanvasY = (y: number) => canvas.height - padding - ((y - yMin) / (yMax - yMin)) * plotHeight;
  
  // Clear background
  ctx.fillStyle = "#fff";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  
  // Draw axes
  ctx.strokeStyle = "#000";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(padding, padding);
  ctx.lineTo(padding, canvas.height - padding);
  ctx.lineTo(canvas.width - padding, canvas.height - padding);
  ctx.stroke();
  
  // Draw data points
  data.forEach((point, index) => {
    const x = toCanvasX(point.x);
    const y = toCanvasY(point.y);
    
    // Point
    ctx.beginPath();
    ctx.arc(x, y, 6, 0, Math.PI * 2);
    ctx.fillStyle = `hsl(${index * 30}, 70%, 50%)`;
    ctx.fill();
    
    // Label
    ctx.fillStyle = "#000";
    ctx.font = "10px Arial";
    ctx.textAlign = "center";
    ctx.fillText(point.label, x, y - 10);
  });
  
  // Axis labels
  ctx.fillStyle = "#000";
  ctx.font = "14px Arial";
  ctx.textAlign = "center";
  ctx.fillText("X Axis", canvas.width / 2, canvas.height - 10);
  
  ctx.save();
  ctx.translate(15, canvas.height / 2);
  ctx.rotate(-Math.PI / 2);
  ctx.fillText("Y Axis", 0, 0);
  ctx.restore();
}

// Usage
const data: DataPoint[] = [
  { x: 1, y: 2, label: "A" },
  { x: 2, y: 4, label: "B" },
  { x: 3, y: 3, label: "C" },
  { x: 4, y: 6, label: "D" },
  { x: 5, y: 5, label: "E" }
];

const canvas = new OffscreenCanvas(500, 400);
drawScatterPlot(canvas, data);
canvas.render();
canvas.saveAsPng("scatter-plot.png");
```

## Performance Tips

1. **Batch drawing operations** - Group similar operations together
2. **Use save/restore carefully** - Only when necessary, as they have overhead
3. **Avoid frequent context switches** - Set styles once for multiple operations
4. **Use appropriate canvas size** - Larger canvases require more memory
5. **Clear efficiently** - Use `clearRect` instead of drawing over with white

## Best Practices

1. **Always check context** - Ensure `getContext("2d")` returns a valid context
2. **Handle errors gracefully** - Wrap canvas operations in try-catch blocks
3. **Use meaningful coordinates** - Define coordinate systems that make sense
4. **Document complex drawings** - Comment your drawing logic
5. **Test output** - Always verify that images are saved correctly

```typescript
// Good error handling
function safeDrawing(canvas: OffscreenCanvas) {
  const ctx = canvas.getContext("2d");
  if (!ctx) {
    throw new Error("Could not get 2D context");
  }
  
  try {
    // Drawing code here
    ctx.fillRect(0, 0, 100, 100);
    
    canvas.render();
    canvas.saveAsPng("output.png");
    
    console.log("✅ Drawing completed successfully");
  } catch (error) {
    console.error("❌ Drawing failed:", error.message);
  }
}
```
