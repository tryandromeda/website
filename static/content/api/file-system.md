# File System API

Andromeda provides a comprehensive file system API for reading, writing, and managing files and directories.

## Overview

The File System API is available through the global `Andromeda` object and provides both synchronous and asynchronous methods for file operations.

## Methods

### Reading Files

#### `Andromeda.readTextFileSync(path: string): string`

Synchronously reads the entire contents of a file as a UTF-8 encoded string.

**Parameters:**
- `path` - Path to the file to read

**Returns:** String containing the file contents

**Example:**
```typescript
const content = Andromeda.readTextFileSync("config.json");
console.log("Config:", content);
```

**Throws:**
- `Error` if the file doesn't exist
- `Error` if there are permission issues
- `Error` if the file is not valid UTF-8

#### `Andromeda.readFileSync(path: string): Uint8Array`

Synchronously reads the entire contents of a file as raw bytes.

**Parameters:**
- `path` - Path to the file to read

**Returns:** `Uint8Array` containing the file bytes

**Example:**
```typescript
const bytes = Andromeda.readFileSync("image.png");
console.log(`File size: ${bytes.length} bytes`);
```

### Writing Files

#### `Andromeda.writeTextFileSync(path: string, data: string): void`

Synchronously writes a string to a file, creating the file if it doesn't exist.

**Parameters:**
- `path` - Path to the file to write
- `data` - String data to write

**Example:**
```typescript
const data = JSON.stringify({ name: "John", age: 30 }, null, 2);
Andromeda.writeTextFileSync("user.json", data);
console.log("✅ File written successfully");
```

**Notes:**
- Creates parent directories if they don't exist
- Overwrites existing files
- Uses UTF-8 encoding

#### `Andromeda.writeFileSync(path: string, data: Uint8Array): void`

Synchronously writes raw bytes to a file.

**Parameters:**
- `path` - Path to the file to write
- `data` - Byte data to write

**Example:**
```typescript
const data = new Uint8Array([0x89, 0x50, 0x4E, 0x47]); // PNG header
Andromeda.writeFileSync("test.png", data);
```

### File Information

#### `Andromeda.stat(path: string): FileInfo`

Gets information about a file or directory.

**Parameters:**
- `path` - Path to the file or directory

**Returns:** `FileInfo` object with properties:
- `isFile: boolean` - True if the path is a file
- `isDirectory: boolean` - True if the path is a directory
- `size: number` - Size in bytes (for files)
- `modified: Date` - Last modification time
- `created: Date` - Creation time
- `accessed: Date` - Last access time

**Example:**
```typescript
const info = Andromeda.stat("myfile.txt");
console.log(`File size: ${info.size} bytes`);
console.log(`Modified: ${info.modified.toISOString()}`);
console.log(`Is directory: ${info.isDirectory}`);
```

#### `Andromeda.exists(path: string): boolean`

Checks if a file or directory exists.

**Parameters:**
- `path` - Path to check

**Returns:** `true` if the path exists, `false` otherwise

**Example:**
```typescript
if (Andromeda.exists("config.json")) {
  const config = Andromeda.readTextFileSync("config.json");
  // Process config...
} else {
  console.log("Config file not found, using defaults");
}
```

### Directory Operations

#### `Andromeda.readDir(path: string): string[]`

Lists the contents of a directory.

**Parameters:**
- `path` - Path to the directory

**Returns:** Array of filenames in the directory

**Example:**
```typescript
const files = Andromeda.readDir("./src");
console.log("Source files:", files);

// Filter for TypeScript files
const tsFiles = files.filter(file => file.endsWith(".ts"));
console.log("TypeScript files:", tsFiles);
```

#### `Andromeda.mkdir(path: string, recursive?: boolean): void`

Creates a directory.

**Parameters:**
- `path` - Path of the directory to create
- `recursive` - If true, creates parent directories as needed (default: false)

**Example:**
```typescript
// Create a single directory
Andromeda.mkdir("output");

// Create nested directories
Andromeda.mkdir("projects/my-app/src", true);
```

#### `Andromeda.rmdir(path: string): void`

Removes an empty directory.

**Parameters:**
- `path` - Path of the directory to remove

**Example:**
```typescript
Andromeda.rmdir("empty-folder");
```

**Note:** Directory must be empty. Use `remove` for non-empty directories.

### File Operations

#### `Andromeda.remove(path: string): void`

Removes a file or directory (and all its contents).

**Parameters:**
- `path` - Path to remove

**Example:**
```typescript
// Remove a file
Andromeda.remove("old-file.txt");

// Remove a directory and all contents
Andromeda.remove("old-project/");
```

**Warning:** This operation is irreversible!

#### `Andromeda.copy(from: string, to: string): void`

Copies a file or directory.

**Parameters:**
- `from` - Source path
- `to` - Destination path

**Example:**
```typescript
// Copy a file
Andromeda.copy("template.txt", "new-file.txt");

// Copy a directory
Andromeda.copy("src/", "backup/src/");
```

#### `Andromeda.move(from: string, to: string): void`

Moves (renames) a file or directory.

**Parameters:**
- `from` - Source path
- `to` - Destination path

**Example:**
```typescript
// Rename a file
Andromeda.move("old-name.txt", "new-name.txt");

// Move to different directory
Andromeda.move("temp/file.txt", "permanent/file.txt");
```

## Path Utilities

### `Andromeda.resolve(...paths: string[]): string`

Resolves a sequence of path segments to an absolute path.

**Example:**
```typescript
const absolutePath = Andromeda.resolve("./data", "users", "profile.json");
console.log("Absolute path:", absolutePath);
// Output: /home/user/project/data/users/profile.json
```

### `Andromeda.join(...paths: string[]): string`

Joins path segments together.

**Example:**
```typescript
const fullPath = Andromeda.join("src", "components", "Button.tsx");
console.log("Joined path:", fullPath);
// Output: src/components/Button.tsx
```

### `Andromeda.dirname(path: string): string`

Returns the directory portion of a path.

**Example:**
```typescript
const dir = Andromeda.dirname("/home/user/file.txt");
console.log("Directory:", dir);
// Output: /home/user
```

### `Andromeda.basename(path: string): string`

Returns the last portion of a path.

**Example:**
```typescript
const name = Andromeda.basename("/home/user/file.txt");
console.log("Filename:", name);
// Output: file.txt
```

### `Andromeda.extname(path: string): string`

Returns the extension of a path.

**Example:**
```typescript
const ext = Andromeda.extname("document.pdf");
console.log("Extension:", ext);
// Output: .pdf
```

## Working Directory

### `Andromeda.cwd(): string`

Gets the current working directory.

**Example:**
```typescript
const currentDir = Andromeda.cwd();
console.log("Current directory:", currentDir);
```

### `Andromeda.chdir(path: string): void`

Changes the current working directory.

**Parameters:**
- `path` - New working directory

**Example:**
```typescript
console.log("Before:", Andromeda.cwd());
Andromeda.chdir("../other-project");
console.log("After:", Andromeda.cwd());
```

## Practical Examples

### Configuration File Handler

```typescript
interface Config {
  apiUrl: string;
  timeout: number;
  debug: boolean;
}

function loadConfig(): Config {
  const configPath = "config.json";
  
  if (!Andromeda.exists(configPath)) {
    // Create default config
    const defaultConfig: Config = {
      apiUrl: "https://api.example.com",
      timeout: 5000,
      debug: false
    };
    
    Andromeda.writeTextFileSync(configPath, JSON.stringify(defaultConfig, null, 2));
    return defaultConfig;
  }
  
  const configText = Andromeda.readTextFileSync(configPath);
  return JSON.parse(configText);
}

const config = loadConfig();
console.log("API URL:", config.apiUrl);
```

### Directory Tree Walker

```typescript
function walkDirectory(dirPath: string, callback: (filePath: string) => void) {
  const items = Andromeda.readDir(dirPath);
  
  for (const item of items) {
    const fullPath = Andromeda.join(dirPath, item);
    const info = Andromeda.stat(fullPath);
    
    if (info.isFile) {
      callback(fullPath);
    } else if (info.isDirectory) {
      walkDirectory(fullPath, callback); // Recursive
    }
  }
}

// Find all TypeScript files
walkDirectory("./src", (filePath) => {
  if (filePath.endsWith(".ts")) {
    console.log("TypeScript file:", filePath);
  }
});
```

### Backup Utility

```typescript
function createBackup(sourceDir: string): string {
  const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
  const backupDir = `backup-${timestamp}`;
  
  console.log(`Creating backup: ${sourceDir} -> ${backupDir}`);
  Andromeda.copy(sourceDir, backupDir);
  
  console.log("✅ Backup created successfully");
  return backupDir;
}

// Create a backup of the current project
const backupPath = createBackup("./src");
console.log("Backup location:", backupPath);
```

### Log File Manager

```typescript
class LogManager {
  private logPath: string;
  
  constructor(logPath: string) {
    this.logPath = logPath;
    
    // Ensure log directory exists
    const logDir = Andromeda.dirname(logPath);
    if (!Andromeda.exists(logDir)) {
      Andromeda.mkdir(logDir, true);
    }
  }
  
  log(level: string, message: string): void {
    const timestamp = new Date().toISOString();
    const logEntry = `${timestamp} [${level.toUpperCase()}] ${message}\n`;
    
    // Append to log file
    if (Andromeda.exists(this.logPath)) {
      const existing = Andromeda.readTextFileSync(this.logPath);
      Andromeda.writeTextFileSync(this.logPath, existing + logEntry);
    } else {
      Andromeda.writeTextFileSync(this.logPath, logEntry);
    }
  }
  
  info(message: string): void {
    this.log("info", message);
  }
  
  error(message: string): void {
    this.log("error", message);
  }
  
  getLogs(): string[] {
    if (!Andromeda.exists(this.logPath)) {
      return [];
    }
    
    const content = Andromeda.readTextFileSync(this.logPath);
    return content.split("\n").filter(line => line.trim());
  }
}

// Usage
const logger = new LogManager("logs/app.log");
logger.info("Application started");
logger.error("Something went wrong");

// Read all logs
const logs = logger.getLogs();
console.log("Recent logs:", logs.slice(-5));
```

## Error Handling

Always wrap file operations in try-catch blocks:

```typescript
function safeReadFile(path: string): string | null {
  try {
    return Andromeda.readTextFileSync(path);
  } catch (error) {
    console.error(`Failed to read ${path}:`, error.message);
    return null;
  }
}

function safeWriteFile(path: string, data: string): boolean {
  try {
    Andromeda.writeTextFileSync(path, data);
    return true;
  } catch (error) {
    console.error(`Failed to write ${path}:`, error.message);
    return false;
  }
}
```

## Performance Tips

1. **Use appropriate methods**: Use `readFileSync` for binary data, `readTextFileSync` for text
2. **Check existence**: Use `exists()` before reading to avoid exceptions
3. **Batch operations**: Group multiple file operations together
4. **Use streaming**: For large files, consider reading in chunks

## Security Considerations

1. **Validate paths**: Always validate user-provided file paths
2. **Check permissions**: Handle permission errors gracefully
3. **Sanitize filenames**: Remove dangerous characters from filenames
4. **Limit access**: Don't allow access to system files or parent directories

```typescript
function isValidPath(path: string): boolean {
  // Prevent directory traversal
  if (path.includes("..")) return false;
  
  // Prevent access to system directories
  if (path.startsWith("/etc") || path.startsWith("/sys")) return false;
  
  return true;
}
```
