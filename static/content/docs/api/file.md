---
title: "File API"
description: "Web-standard File API for working with file objects and metadata"
section: "API Reference"
order: 16
id: "file-api"
---

The File API provides a web-standard interface for working with file objects,
file metadata, and file reading operations. It complements the File System API
by providing higher-level abstractions for file handling.

## Overview

The File API in Andromeda allows you to:

- Create and work with File objects
- Read file contents in various formats
- Handle file metadata (name, size, type, modification time)
- Work with Blob objects for binary data
- Process files in a standardized way
- Handle FormData for form submissions and multipart data

## Basic Usage

### Creating File Objects

```typescript
// Create a File from text content
const textFile = new File(["Hello, World!"], "hello.txt", {
  type: "text/plain",
  lastModified: Date.now(),
});

// Create a File from binary data
const binaryData = new Uint8Array([72, 101, 108, 108, 111]); // "Hello"
const binaryFile = new File([binaryData], "data.bin", {
  type: "application/octet-stream",
});

// Create a File from JSON data
const jsonData = { message: "Hello", timestamp: Date.now() };
const jsonFile = new File([JSON.stringify(jsonData)], "data.json", {
  type: "application/json",
});
```

### Reading File Contents

```typescript
// Read file as text
const text = await file.text();
console.log("File content:", text);

// Read file as array buffer
const arrayBuffer = await file.arrayBuffer();
const uint8Array = new Uint8Array(arrayBuffer);

// Read file as stream
const stream = file.stream();
const reader = stream.getReader();

while (true) {
  const { done, value } = await reader.read();
  if (done) break;
  console.log("Chunk:", value);
}
```

## API Reference

### File Constructor

Creates a new File object.

**Syntax:**

```typescript
new File(fileBits, fileName, options?)
```

**Parameters:**

- `fileBits` (Array): Array of data chunks (strings, Uint8Array, ArrayBuffer,
  etc.)
- `fileName` (string): Name of the file
- `options` (object, optional): File options

**Options:**

- `type` (string): MIME type of the file
- `lastModified` (number): Last modification time as timestamp

**Example:**

```typescript
const file = new File(["content"], "example.txt", {
  type: "text/plain",
  lastModified: Date.now(),
});
```

### File Properties

#### `file.name`

The name of the file.

**Type:** `string`

```typescript
console.log("File name:", file.name); // "example.txt"
```

#### `file.size`

The size of the file in bytes.

**Type:** `number`

```typescript
console.log("File size:", file.size, "bytes");
```

#### `file.type`

The MIME type of the file.

**Type:** `string`

```typescript
console.log("File type:", file.type); // "text/plain"
```

#### `file.lastModified`

The last modification time as a timestamp.

**Type:** `number`

```typescript
const lastMod = new Date(file.lastModified);
console.log("Last modified:", lastMod.toISOString());
```

### File Methods

#### `file.text()`

Reads the file content as a UTF-8 string.

**Returns:**

- `Promise<string>`: The file content as text

**Example:**

```typescript
const content = await file.text();
console.log("File content:", content);
```

#### `file.arrayBuffer()`

Reads the file content as an ArrayBuffer.

**Returns:**

- `Promise<ArrayBuffer>`: The file content as binary data

**Example:**

```typescript
const buffer = await file.arrayBuffer();
const bytes = new Uint8Array(buffer);
console.log("File bytes:", bytes);
```

#### `file.stream()`

Returns a ReadableStream for the file content.

**Returns:**

- `ReadableStream<Uint8Array>`: Stream of file chunks

**Example:**

```typescript
const stream = file.stream();
const reader = stream.getReader();

try {
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    console.log("Received chunk:", value);
  }
} finally {
  reader.releaseLock();
}
```

#### `file.slice(start?, end?, contentType?)`

Creates a new File object containing a subset of the file's data.

**Parameters:**

- `start` (number, optional): Start offset in bytes
- `end` (number, optional): End offset in bytes
- `contentType` (string, optional): MIME type for the slice

**Returns:**

- `File`: New File object with the sliced content

**Example:**

```typescript
// Get first 100 bytes
const firstPart = file.slice(0, 100);

// Get last 50 bytes
const lastPart = file.slice(-50);

// Get middle section with specific type
const middle = file.slice(100, 200, "text/plain");
```

## FileReader Class

For compatibility with web standards, Andromeda provides a FileReader class.

### FileReader Methods

#### `fileReader.readAsText(file, encoding?)`

Reads the file as text.

**Parameters:**

- `file` (File): File to read
- `encoding` (string, optional): Text encoding (default: "utf-8")

**Example:**

```typescript
const reader = new FileReader();

reader.onload = (event) => {
  console.log("File content:", event.target.result);
};

reader.onerror = (event) => {
  console.error("Read error:", event.target.error);
};

reader.readAsText(file);
```

#### `fileReader.readAsArrayBuffer(file)`

Reads the file as an ArrayBuffer.

**Example:**

```typescript
const reader = new FileReader();

reader.onload = (event) => {
  const buffer = event.target.result as ArrayBuffer;
  const bytes = new Uint8Array(buffer);
  console.log("File bytes:", bytes);
};

reader.readAsArrayBuffer(file);
```

#### `fileReader.readAsDataURL(file)`

Reads the file as a data URL.

**Example:**

```typescript
const reader = new FileReader();

reader.onload = (event) => {
  const dataUrl = event.target.result as string;
  console.log("Data URL:", dataUrl);
};

reader.readAsDataURL(file);
```

## Examples

### File Processing Pipeline

```typescript
class FileProcessor {
  static async processTextFile(file: File) {
    if (!file.type.startsWith("text/")) {
      throw new Error("Not a text file");
    }

    const content = await file.text();
    const lines = content.split("\n");

    return {
      filename: file.name,
      size: file.size,
      lineCount: lines.length,
      wordCount: content.split(/\s+/).length,
      characterCount: content.length,
    };
  }

  static async processImageFile(file: File) {
    if (!file.type.startsWith("image/")) {
      throw new Error("Not an image file");
    }

    const buffer = await file.arrayBuffer();

    // Basic image analysis (simplified)
    return {
      filename: file.name,
      size: file.size,
      type: file.type,
      dataSize: buffer.byteLength,
    };
  }

  static async processJsonFile(file: File) {
    if (file.type !== "application/json" && !file.name.endsWith(".json")) {
      throw new Error("Not a JSON file");
    }

    const content = await file.text();
    const data = JSON.parse(content);

    return {
      filename: file.name,
      size: file.size,
      structure: this.analyzeJsonStructure(data),
    };
  }

  private static analyzeJsonStructure(obj: any): any {
    if (Array.isArray(obj)) {
      return {
        type: "array",
        length: obj.length,
        elementTypes: [...new Set(obj.map((item) => typeof item))],
      };
    } else if (typeof obj === "object" && obj !== null) {
      return {
        type: "object",
        keys: Object.keys(obj),
        propertyTypes: Object.fromEntries(
          Object.entries(obj).map(([key, value]) => [key, typeof value]),
        ),
      };
    } else {
      return { type: typeof obj };
    }
  }
}

// Usage
const textFile = new File(["Hello\nWorld\nHow are you?"], "greeting.txt", {
  type: "text/plain",
});

const analysis = await FileProcessor.processTextFile(textFile);
console.log("Text analysis:", analysis);
```

### File Upload Simulation

```typescript
class FileUploader {
  private static readonly MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
  private static readonly ALLOWED_TYPES = [
    "text/plain",
    "application/json",
    "image/jpeg",
    "image/png",
    "application/pdf",
  ];

  static async validateFile(file: File): Promise<boolean> {
    // Check file size
    if (file.size > this.MAX_FILE_SIZE) {
      throw new Error(
        `File too large: ${file.size} bytes. Max: ${this.MAX_FILE_SIZE}`,
      );
    }

    // Check file type
    if (!this.ALLOWED_TYPES.includes(file.type)) {
      throw new Error(`File type not allowed: ${file.type}`);
    }

    // Additional validation based on type
    if (file.type.startsWith("image/")) {
      return this.validateImage(file);
    } else if (file.type === "application/json") {
      return this.validateJson(file);
    }

    return true;
  }

  private static async validateImage(file: File): Promise<boolean> {
    const buffer = await file.arrayBuffer();
    const bytes = new Uint8Array(buffer);

    // Check for valid image headers
    if (file.type === "image/jpeg") {
      return bytes[0] === 0xFF && bytes[1] === 0xD8;
    } else if (file.type === "image/png") {
      return bytes[0] === 0x89 && bytes[1] === 0x50 &&
        bytes[2] === 0x4E && bytes[3] === 0x47;
    }

    return true;
  }

  private static async validateJson(file: File): Promise<boolean> {
    try {
      const content = await file.text();
      JSON.parse(content);
      return true;
    } catch (error) {
      throw new Error("Invalid JSON format");
    }
  }

  static async uploadFile(file: File, destination: string) {
    await this.validateFile(file);

    console.log(
      `Uploading ${file.name} (${file.size} bytes) to ${destination}`,
    );

    // Simulate chunked upload
    const chunkSize = 64 * 1024; // 64KB chunks
    const stream = file.stream();
    const reader = stream.getReader();

    let uploaded = 0;

    try {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        // Simulate upload of chunk
        await this.uploadChunk(value, destination, uploaded);
        uploaded += value.byteLength;

        const progress = (uploaded / file.size) * 100;
        console.log(`Upload progress: ${progress.toFixed(1)}%`);
      }
    } finally {
      reader.releaseLock();
    }

    console.log(`Upload completed: ${file.name}`);
  }

  private static async uploadChunk(
    chunk: Uint8Array,
    destination: string,
    offset: number,
  ) {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 10));

    // In a real implementation, you would send the chunk to a server
    console.log(
      `Uploaded chunk: ${chunk.byteLength} bytes at offset ${offset}`,
    );
  }
}

// Usage
const file = new File(["Large file content..."], "document.txt", {
  type: "text/plain",
});

await FileUploader.uploadFile(file, "/uploads/documents/");
```

### File Conversion Utilities

```typescript
class FileConverter {
  static async textToFile(text: string, filename: string): Promise<File> {
    return new File([text], filename, {
      type: "text/plain",
      lastModified: Date.now(),
    });
  }

  static async jsonToFile(data: any, filename: string): Promise<File> {
    const jsonString = JSON.stringify(data, null, 2);
    return new File([jsonString], filename, {
      type: "application/json",
      lastModified: Date.now(),
    });
  }

  static async csvToFile(data: any[], filename: string): Promise<File> {
    if (data.length === 0) {
      throw new Error("No data to convert");
    }

    const headers = Object.keys(data[0]);
    const csvRows = [
      headers.join(","),
      ...data.map((row) =>
        headers.map((field) => {
          const value = row[field];
          return typeof value === "string" && value.includes(",")
            ? `"${value}"`
            : value;
        }).join(",")
      ),
    ];

    const csvContent = csvRows.join("\n");
    return new File([csvContent], filename, {
      type: "text/csv",
      lastModified: Date.now(),
    });
  }

  static async fileToBase64(file: File): Promise<string> {
    const buffer = await file.arrayBuffer();
    const bytes = new Uint8Array(buffer);

    // Convert to base64
    let binary = "";
    for (let i = 0; i < bytes.length; i++) {
      binary += String.fromCharCode(bytes[i]);
    }

    return btoa(binary);
  }

  static async base64ToFile(
    base64: string,
    filename: string,
    type: string,
  ): Promise<File> {
    const binary = atob(base64);
    const bytes = new Uint8Array(binary.length);

    for (let i = 0; i < binary.length; i++) {
      bytes[i] = binary.charCodeAt(i);
    }

    return new File([bytes], filename, {
      type: type,
      lastModified: Date.now(),
    });
  }
}

// Usage examples
const textFile = await FileConverter.textToFile(
  "Hello, World!",
  "greeting.txt",
);

const data = [
  { name: "Alice", age: 30, city: "New York" },
  { name: "Bob", age: 25, city: "San Francisco" },
];
const csvFile = await FileConverter.csvToFile(data, "users.csv");

const base64 = await FileConverter.fileToBase64(textFile);
console.log("Base64:", base64);
```

### File Comparison

```typescript
class FileComparator {
  static async compareFiles(file1: File, file2: File): Promise<{
    identical: boolean;
    sizeDifference: number;
    typeDifference: boolean;
    contentDifference?: string;
  }> {
    const result = {
      identical: false,
      sizeDifference: file1.size - file2.size,
      typeDifference: file1.type !== file2.type,
      contentDifference: undefined as string | undefined,
    };

    // Quick checks first
    if (result.sizeDifference !== 0 || result.typeDifference) {
      return result;
    }

    // Compare content
    const [content1, content2] = await Promise.all([
      file1.arrayBuffer(),
      file2.arrayBuffer(),
    ]);

    const bytes1 = new Uint8Array(content1);
    const bytes2 = new Uint8Array(content2);

    for (let i = 0; i < bytes1.length; i++) {
      if (bytes1[i] !== bytes2[i]) {
        result.contentDifference = `Difference at byte ${i}: ${bytes1[i]} vs ${
          bytes2[i]
        }`;
        return result;
      }
    }

    result.identical = true;
    return result;
  }

  static async checksumFile(file: File): Promise<string> {
    const buffer = await file.arrayBuffer();
    const hashBuffer = await crypto.subtle.digest("SHA-256", buffer);
    const hashArray = new Uint8Array(hashBuffer);

    return Array.from(hashArray)
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");
  }
}

// Usage
const file1 = new File(["Hello"], "test1.txt", { type: "text/plain" });
const file2 = new File(["Hello"], "test2.txt", { type: "text/plain" });

const comparison = await FileComparator.compareFiles(file1, file2);
console.log("Files identical:", comparison.identical);

const checksum = await FileComparator.checksumFile(file1);
console.log("File checksum:", checksum);
```

## Best Practices

### Memory Management

```typescript
// For large files, use streams instead of loading entire content
async function processLargeFile(file: File) {
  if (file.size > 100 * 1024 * 1024) { // 100MB
    const stream = file.stream();
    const reader = stream.getReader();

    try {
      // Process in chunks
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        // Process chunk
        await processChunk(value);
      }
    } finally {
      reader.releaseLock();
    }
  } else {
    // Small files can be loaded entirely
    const content = await file.text();
    await processContent(content);
  }
}
```

### Error Handling

```typescript
async function safeFileOperation(file: File) {
  try {
    // Validate file first
    if (!file.name || file.size === 0) {
      throw new Error("Invalid file");
    }

    const content = await file.text();
    return content;
  } catch (error) {
    if (error instanceof DOMException) {
      console.error("File access error:", error.message);
    } else {
      console.error("Unexpected error:", error);
    }
    throw error;
  }
}
```

### Type Checking

```typescript
function isValidFileType(file: File, allowedTypes: string[]): boolean {
  // Check MIME type
  if (allowedTypes.includes(file.type)) {
    return true;
  }

  // Check file extension as fallback
  const extension = file.name.toLowerCase().split(".").pop();
  const typeMap: Record<string, string> = {
    "txt": "text/plain",
    "json": "application/json",
    "jpg": "image/jpeg",
    "jpeg": "image/jpeg",
    "png": "image/png",
  };

  const inferredType = typeMap[extension || ""];
  return allowedTypes.includes(inferredType || "");
}
```

## FormData API

The FormData interface provides a way to construct key/value pairs representing form fields and their values for form submissions and multipart data handling.

### Creating FormData

```typescript
// Create an empty FormData
const formData = new FormData();

// Append different types of data
formData.append("username", "john_doe");
formData.append("email", "john@example.com");

// Append a file
const file = new File(["file content"], "document.txt", { type: "text/plain" });
formData.append("document", file);

// Append a Blob
const blob = new Blob(["binary data"], { type: "application/octet-stream" });
formData.append("data", blob, "data.bin");
```

### FormData Methods

#### `append(name, value, filename?)`

Appends a new value to an existing key, or adds the key/value pair if it doesn't exist.

```typescript
const formData = new FormData();

// Append string values
formData.append("name", "John");
formData.append("age", "30");

// Append files with optional filename
formData.append("profile", file, "profile.jpg");

// Multiple values for the same key
formData.append("hobby", "reading");
formData.append("hobby", "gaming");
```

#### `set(name, value, filename?)`

Sets a new value for an existing key, or adds the key/value pair if it doesn't exist. Unlike `append()`, this replaces existing values.

```typescript
formData.set("name", "Jane"); // Replaces any existing "name" values
formData.set("avatar", avatarFile, "avatar.png");
```

#### `get(name)`

Returns the first value associated with the given name.

```typescript
const name = formData.get("name"); // Returns string or File
console.log("Name:", name);

const file = formData.get("document"); // Returns File object if it was a file
if (file instanceof File) {
  console.log("File name:", file.name);
}
```

#### `getAll(name)`

Returns all values associated with the given name.

```typescript
const hobbies = formData.getAll("hobby"); // Returns array of values
console.log("Hobbies:", hobbies); // ["reading", "gaming"]
```

#### `has(name)`

Returns whether a FormData object contains a certain key.

```typescript
if (formData.has("email")) {
  console.log("Email field is present");
}
```

#### `delete(name)`

Deletes a key and all its values from the FormData object.

```typescript
formData.delete("temp_field");
```

#### Iteration Methods

FormData supports iteration through its entries:

```typescript
// Iterate over all entries
for (const [key, value] of formData.entries()) {
  console.log(`${key}:`, value);
}

// Get all keys
for (const key of formData.keys()) {
  console.log("Key:", key);
}

// Get all values
for (const value of formData.values()) {
  console.log("Value:", value);
}

// Convert to array
const entries = Array.from(formData.entries());
```

### FormData with Fetch

FormData is commonly used with the Fetch API for submitting forms:

```typescript
async function submitForm() {
  const formData = new FormData();
  
  formData.append("username", "user123");
  formData.append("profile_pic", profileFile);
  formData.append("description", "User profile update");

  try {
    const response = await fetch("/api/profile", {
      method: "POST",
      body: formData, // Browser automatically sets Content-Type: multipart/form-data
    });

    if (response.ok) {
      console.log("Profile updated successfully");
    }
  } catch (error) {
    console.error("Upload failed:", error);
  }
}
```

### Advanced FormData Usage

```typescript
// Building form data from an HTML form
function createFormDataFromForm(form: HTMLFormElement): FormData {
  const formData = new FormData();
  
  const inputs = form.querySelectorAll('input, select, textarea');
  inputs.forEach((input) => {
    if (input.type === 'file') {
      const files = input.files;
      if (files) {
        for (let i = 0; i < files.length; i++) {
          formData.append(input.name, files[i]);
        }
      }
    } else if (input.type === 'checkbox') {
      if (input.checked) {
        formData.append(input.name, input.value);
      }
    } else {
      formData.append(input.name, input.value);
    }
  });
  
  return formData;
}

// Cloning FormData
function cloneFormData(original: FormData): FormData {
  const clone = new FormData();
  
  for (const [key, value] of original.entries()) {
    clone.append(key, value);
  }
  
  return clone;
}

// Converting FormData to URL-encoded string
function formDataToUrlEncoded(formData: FormData): string {
  const params = new URLSearchParams();
  
  for (const [key, value] of formData.entries()) {
    if (typeof value === 'string') {
      params.append(key, value);
    } else {
      // For File/Blob objects, use their name or convert to string
      params.append(key, value.name || value.toString());
    }
  }
  
  return params.toString();
}
```

## Notes

- File objects are immutable once created
- Use `file.slice()` to work with parts of large files
- Always handle errors when reading file content
- Consider memory usage when working with large files
- File timestamps are in milliseconds since Unix epoch

## See Also

- **[File System API](/docs/api/file-system)** - Low-level file operations
- **[Web Storage API](/docs/api/web-storage)** - Data persistence
- **[Fetch API](/docs/api/fetch)** - Network requests with file data
