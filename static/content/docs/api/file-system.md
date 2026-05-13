---
title: "File System API"
description: "File and directory I/O on the Andromeda namespace"
section: "API Reference"
order: 11
id: "file-system-api"
---

Andromeda exposes its file system API on the global `Andromeda` namespace. Every
operation comes in a synchronous and an asynchronous variant; the async variants
return a `Promise`. Text APIs use UTF-8.

## Text files

### `readTextFileSync(path)` and `readTextFile(path)`

Read a UTF-8 text file.

```typescript
const sync = Andromeda.readTextFileSync("hello.txt");
const async = await Andromeda.readTextFile("hello.txt");
```

### `writeTextFileSync(path, data)` and `writeTextFile(path, data)`

Write a UTF-8 text file. Creates the file if it does not exist; overwrites
existing files.

```typescript
Andromeda.writeTextFileSync("hello.txt", "Hello, World!");
await Andromeda.writeTextFile("hello.txt", "Hello, World!");
```

## Binary files

### `readFileSync(path)` and `readFile(path)`

Read a binary file as a `Uint8Array`.

```typescript
const bytes = Andromeda.readFileSync("image.png");
const bytesAsync = await Andromeda.readFile("image.png");
```

### `writeFileSync(path, data)` and `writeFile(path, data)`

Write a `Uint8Array` to a file.

```typescript
const data = new Uint8Array([72, 101, 108, 108, 111]);
Andromeda.writeFileSync("data.bin", data);
await Andromeda.writeFile("data.bin", data);
```

## Creating, copying, and removing

| Method                                | Description                              |
| ------------------------------------- | ---------------------------------------- |
| `createSync(path)` / `create(path)`   | Create an empty file                     |
| `copyFileSync(src, dst)` / `copyFile` | Copy a file                              |
| `removeSync(path)` / `remove(path)`   | Delete a file or empty directory         |
| `removeAllSync(path)` / `removeAll`   | Recursively delete a file or directory   |
| `renameSync(old, new)` / `rename`     | Rename or move a file/directory          |
| `existsSync(path)` / `exists(path)`   | Check whether a path exists              |
| `truncateSync(path, length)`          | Truncate a file to the given length      |
| `chmodSync(path, mode)`               | Change permissions (Unix mode bits)      |
| `openSync(path, mode)`                | Open a file and return a file descriptor |

```typescript
await Andromeda.create("hello.txt");
await Andromeda.copyFile("hello.txt", "world.txt");
await Andromeda.rename("world.txt", "goodbye.txt");

if (Andromeda.existsSync("goodbye.txt")) {
  Andromeda.removeSync("goodbye.txt");
}

await Andromeda.removeAll("./scratch");

Andromeda.chmodSync("script.sh", 0o755);
Andromeda.truncateSync("log.txt", 0);
```

## Directories

### `mkdirSync(path)` / `mkdir(path)` and `mkdirAllSync` / `mkdirAll`

`mkdir` creates a single directory; `mkdirAll` recursively creates all
intermediate directories.

```typescript
Andromeda.mkdirSync("output");
await Andromeda.mkdir("output");

Andromeda.mkdirAllSync("path/to/deep/dir");
await Andromeda.mkdirAll("path/to/deep/dir");
```

### `readDirSync(path)`

List a directory's contents. Returns an array of entry descriptors.

```typescript
const entries = Andromeda.readDirSync("./src");
for (const entry of entries) {
  console.log(entry.name, entry.isFile, entry.isDirectory, entry.isSymlink);
}

const tsFiles = entries.filter((e) => e.isFile && e.name.endsWith(".ts"));
```

Returned entry shape:

```typescript
{
  name: string;
  isFile: boolean;
  isDirectory: boolean;
  isSymlink: boolean;
}
```

## File information

### `statSync(path)` and `lstatSync(path)`

`statSync` follows symbolic links; `lstatSync` does not.

```typescript
const info = Andromeda.statSync("hello.txt");
console.log(info.size); // bytes
console.log(info.isFile, info.isDirectory); // booleans
console.log(info.modified); // ms since epoch
console.log(info.mode.toString(8)); // permissions
```

Returned shape:

```typescript
{
  isFile: boolean;
  isDirectory: boolean;
  isSymlink: boolean;
  size: number;
  modified: number; // ms since epoch
  accessed: number;
  created: number;
  mode: number;
}
```

## Standard I/O

```typescript
// Read a line from stdin
const name = Andromeda.stdin.readLine();

// Write to stdout (no newline)
Andromeda.stdout.write("Enter again: ");

// Convenience prompt helpers
const colour = prompt("favourite colour?");
const sure = confirm("continue?");
```

## Environment Variables

```typescript
const home = Andromeda.env.get("HOME");
Andromeda.env.set("MY_VAR", "value");
Andromeda.env.remove("OLD_VAR");

for (const key of Andromeda.env.keys()) {
  console.log(key, "=", Andromeda.env.get(key));
}
```

## Patterns

### Conditional reads

```typescript
async function loadConfig(path: string) {
  if (!(await Andromeda.exists(path))) {
    return { theme: "dark", debug: false };
  }
  return JSON.parse(await Andromeda.readTextFile(path));
}
```

### Recursive walk

```typescript
function walk(dir: string): string[] {
  const out: string[] = [];
  for (const entry of Andromeda.readDirSync(dir)) {
    const full = `${dir}/${entry.name}`;
    if (entry.isDirectory) out.push(...walk(full));
    else out.push(full);
  }
  return out;
}
```

## Error Handling

Every method throws on failure. Wrap calls in `try` / `catch`:

```typescript
try {
  const data = await Andromeda.readTextFile("missing.txt");
} catch (err) {
  console.error("Read failed:", (err as Error).message);
}
```

## See Also

- [Process API](/docs/api/process) — args, env, signals, subprocess
- [Examples](/docs/examples/index)
