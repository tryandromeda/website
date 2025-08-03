---
title: "Quick Start Guide"
description: "Get up and running with Andromeda in just a few minutes"
section: "Getting Started"
order: 3
id: "quick-start"
---

Get up and running with Andromeda in just a few minutes! This guide will walk
you through creating your first Andromeda programs.

## Your First Program

Create a simple "Hello, World!" program:

```typescript
// hello.ts
console.log("Hello, Andromeda! 🌌");
console.log("Current time:", new Date().toISOString());
```

Run it:

```bash
andromeda run hello.ts
```

**Output:**

```text
Hello, Andromeda! 🌌
Current time: 2025-06-08T15:30:45.123Z
```

## Working with Files

Andromeda provides simple file I/O operations:

```typescript
// file-example.ts

// Write some data to a file
const data = `# My Notes
- Learn Andromeda
- Build something cool
- Share with friends
`;

Andromeda.writeTextFileSync("notes.md", data);
console.log("✅ File written successfully!");

// Read the file back
const content = Andromeda.readTextFileSync("notes.md");
console.log("📄 File contents:");
console.log(content);

// Check environment variables
const home = Andromeda.env.get("HOME") || Andromeda.env.get("USERPROFILE");
console.log("🏠 Home directory:", home);
```

Run it:

```bash
andromeda run file-example.ts
```

## Creating Graphics with Canvas

Andromeda includes a powerful Canvas API for creating graphics:

```typescript
// graphics.ts

// Create a canvas
const canvas = new OffscreenCanvas(400, 300);
const ctx = canvas.getContext("2d")!;

// Set background
ctx.fillStyle = "#1a1a1a";
ctx.fillRect(0, 0, 400, 300);

// Draw colorful rectangles
const colors = ["#ff6b6b", "#4ecdc4", "#45b7d1", "#96ceb4", "#feca57"];

for (let i = 0; i < colors.length; i++) {
  ctx.fillStyle = colors[i];
  ctx.fillRect(50 + i * 60, 100, 50, 100);
}

// Add some text
ctx.fillStyle = "#ffffff";
ctx.font = "24px Arial";
ctx.fillText("Hello, Andromeda!", 100, 50);

// Save the image
canvas.render();
canvas.saveAsPng("my-first-graphic.png");

console.log("🎨 Image saved as 'my-first-graphic.png'");
```

Run it:

```bash
andromeda run graphics.ts
```

## Using Cryptography

Generate secure random values and perform hashing:

```typescript
// crypto-example.ts

// Generate a random UUID
const id = crypto.randomUUID();
console.log("🆔 Random UUID:", id);

// Generate random bytes
const randomBytes = crypto.getRandomValues(new Uint8Array(16));
console.log(
  "🎲 Random bytes:",
  Array.from(randomBytes).map((b) => b.toString(16).padStart(2, "0")).join(""),
);

// Hash some data
const data = new TextEncoder().encode("Hello, Andromeda!");
const hashBuffer = await crypto.subtle.digest("SHA-256", data);
const hashArray = new Uint8Array(hashBuffer);
const hashHex = Array.from(hashArray).map((b) =>
  b.toString(16).padStart(2, "0")
).join("");

console.log("🔒 SHA-256 hash:", hashHex);
```

Run it:

```bash
andromeda run crypto-example.ts
```

## Performance Monitoring

Monitor execution performance:

```typescript
// performance-example.ts

// Measure execution time
const start = performance.now();

// Simulate some work
let sum = 0;
for (let i = 0; i < 1000000; i++) {
  sum += Math.sqrt(i);
}

const end = performance.now();
const duration = end - start;

console.log(`⚡ Calculated sum: ${sum.toFixed(2)}`);
console.log(`⏱️  Execution time: ${duration.toFixed(2)}ms`);

// Use performance marks
performance.mark("data-processing-start");

// More work
const data = Array.from({ length: 10000 }, (_, i) => Math.random() * i);
const sorted = data.sort((a, b) => a - b);

performance.mark("data-processing-end");
performance.measure(
  "data-processing",
  "data-processing-start",
  "data-processing-end",
);

console.log(`📊 Processed ${sorted.length} items`);
```

Run it:

```bash
andromeda run performance-example.ts
```

## Using SQLite Database

Andromeda includes built-in SQLite support for data persistence:

```typescript
// sqlite-example.ts

// Create or open a database
const db = new DatabaseSync("notes.db");

// Create table
db.exec(`
  CREATE TABLE IF NOT EXISTS notes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    content TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`);

// Insert data
const insertNote = db.prepare(
  "INSERT INTO notes (title, content) VALUES (?, ?)",
);
const result = insertNote.run("My First Note", "This is stored in SQLite!");

console.log(`📝 Created note with ID: ${result.lastInsertRowid}`);

// Query data
const selectNotes = db.prepare("SELECT * FROM notes ORDER BY created_at DESC");
const notes = selectNotes.all();

console.log("📚 All notes:");
for (const note of notes) {
  console.log(`- ${note.title} (${note.created_at})`);
}

// Clean up
insertNote.finalize();
selectNotes.finalize();
db.close();
```

## Web Storage

Use localStorage and sessionStorage for client-side data persistence:

```typescript
// storage-example.ts

// Store user preferences
localStorage.setItem("theme", "dark");
localStorage.setItem("language", "en");

// Store complex data as JSON
const userProfile = {
  name: "Alice",
  settings: {
    notifications: true,
    autoSave: true,
  },
};
localStorage.setItem("profile", JSON.stringify(userProfile));

// Read data back
const theme = localStorage.getItem("theme");
const profileData = localStorage.getItem("profile");
const profile = profileData ? JSON.parse(profileData) : null;

console.log("💾 Stored theme:", theme);
console.log("👤 User profile:", profile);

// Session storage for temporary data
sessionStorage.setItem("sessionId", crypto.randomUUID());
sessionStorage.setItem("startTime", Date.now().toString());

console.log("🎫 Session ID:", sessionStorage.getItem("sessionId"));
console.log(
  "⏰ Session started:",
  new Date(parseInt(sessionStorage.getItem("startTime") || "0")),
);

// Check storage info
console.log(`📊 localStorage items: ${localStorage.length}`);
console.log(`📊 sessionStorage items: ${sessionStorage.length}`);
```

Run it:

```bash
andromeda run storage-example.ts
```

## Using the Interactive REPL

Start the REPL for interactive development:

```bash
andromeda repl
```

Try these commands in the REPL:

```javascript
// Basic calculations
> 2 + 2
4

// Create a canvas
> const canvas = new OffscreenCanvas(100, 100)
> const ctx = canvas.getContext("2d")
> ctx.fillStyle = "red"
> ctx.fillRect(0, 0, 50, 50)

// File operations
> Andromeda.writeTextFileSync("test.txt", "Hello from REPL!")
> Andromeda.readTextFileSync("test.txt")
"Hello from REPL!"

// SQLite database
> const db = new DatabaseSync(":memory:")
> db.exec("CREATE TABLE test (id INTEGER, name TEXT)")
> const stmt = db.prepare("INSERT INTO test VALUES (?, ?)")
> stmt.run(1, "Test Item")
> db.prepare("SELECT * FROM test").all()
[{ id: 1, name: "Test Item" }]

// Crypto
> crypto.randomUUID()
"12345678-1234-1234-1234-123456789abc"
```

Type `help` for available REPL commands, or `exit` to quit.

## Running Multiple Files

You can run multiple files together:

```bash
andromeda run utils.ts main.ts helper.ts
```

## Working with Modules

Andromeda supports ES modules and TypeScript module resolution:

```typescript
// math-utils.ts
export function add(a: number, b: number): number {
  return a + b;
}

export function multiply(a: number, b: number): number {
  return a * b;
}

export const PI = Math.PI;
```

```typescript
// main.ts
import { add, multiply, PI } from "./math-utils.ts";

console.log("Addition:", add(5, 3));
console.log("Multiplication:", multiply(4, 7));
console.log("PI value:", PI);

// Dynamic imports are also supported
const { readTextFileSync } = await import("./file-helpers.ts");
```

Run the main file:

```bash
andromeda run main.ts
```

## Code Formatting

Format your TypeScript/JavaScript files:

```bash
andromeda fmt hello.ts graphics.ts

# Format entire directory
andromeda fmt src/

# Format current directory
andromeda fmt
```

## Bundling Applications

Bundle your application and dependencies into a single file:

```typescript
// Create a small app with dependencies
// app.ts
import { add } from "./math-utils.ts";
import { writeTextFileSync } from "./file-helpers.ts";

const result = add(10, 20);
writeTextFileSync("result.txt", `The answer is: ${result}`);
console.log("Result saved to file!");
```

Bundle it:

```bash
andromeda bundle app.ts dist/my-app.js
```

The bundled file will contain all dependencies and can be run independently:

```bash
andromeda run dist/my-app.js
```

## Code Linting

Analyze your code for potential issues:

```bash
# Lint specific files
andromeda lint script.ts utils.js

# Lint entire directory
andromeda lint src/

# Lint current directory
andromeda lint
```

The linter checks for:

- Empty function detection
- Empty statement detection
- Variable usage validation
- Unreachable code detection
- Invalid syntax highlighting

## Single-File Executables

Compile your TypeScript/JavaScript into standalone executables:

```bash
# Create executable from TypeScript
andromeda compile app.ts my-app.exe

# Run the compiled executable
./my-app.exe
```

This creates a self-contained executable that doesn't require Andromeda to be
installed on the target system.

## Upgrading Andromeda

Keep your runtime up to date:

```bash
# Check for and install updates
andromeda upgrade

# See what would be updated without installing
andromeda upgrade --dry-run
```

## Next Steps

Now that you've got the basics down:

1. **Explore the APIs**: Check out the [API Documentation](/docs/api/) for
   detailed information about available functions
2. **Join the Community**: Connect with other developers on
   [Discord](https://discord.gg/tgjAnX2Ny3)

## Common Patterns

### Error Handling

```typescript
try {
  const content = Andromeda.readTextFileSync("nonexistent.txt");
  console.log(content);
} catch (error) {
  console.error("❌ Failed to read file:", error.message);
}
```

### Async Operations

```typescript
// Using crypto with async/await
async function hashData(input: string) {
  const data = new TextEncoder().encode(input);
  const hash = await crypto.subtle.digest("SHA-256", data);
  return new Uint8Array(hash);
}

const result = await hashData("Hello, World!");
console.log("Hash result:", result);
```

### Environment Configuration

```typescript
// Check if we're in development mode
const isDev = Andromeda.env.get("NODE_ENV") !== "production";

if (isDev) {
  console.log("🚧 Running in development mode");
}

// Get command line arguments
console.log("📋 Arguments:", Andromeda.args);
```

Happy coding with Andromeda! 🚀
