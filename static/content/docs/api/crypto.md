---
title: "Crypto API"
description: "Web Crypto API for cryptographic operations and secure random values"
section: "API Reference"
order: 3
id: "crypto"
---

Andromeda provides the Web Crypto API for cryptographic operations, secure
random value generation, and hashing. The implementation follows the W3C Web
Crypto API specification.

## Overview

The Crypto API allows you to:

- Generate cryptographically secure random values
- Create unique UUIDs (Universally Unique Identifiers)
- Hash data using SHA-256 and other algorithms
- Generate cryptographic keys
- Perform secure cryptographic operations

## Global `crypto` Object

The `crypto` object is available globally and provides access to cryptographic
functionality:

```typescript
// crypto is available globally
console.log(crypto); // Crypto object
```

## Random Value Generation

### `crypto.randomUUID()`

Generate a RFC 4122 version 4 UUID (Universally Unique Identifier).

```typescript
const uuid = crypto.randomUUID();
console.log(uuid); // "550e8400-e29b-41d4-a716-446655440000"
```

**Returns:** A string containing a randomly generated UUID in the format
`xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx`.

**Example:**

```typescript
// Generate multiple UUIDs
const id1 = crypto.randomUUID();
const id2 = crypto.randomUUID();
const id3 = crypto.randomUUID();

console.log(id1); // "123e4567-e89b-12d3-a456-426614174000"
console.log(id2); // "987fcdeb-51a2-43f7-b123-987654321098"
console.log(id3); // "abcdef01-2345-4678-9abc-def012345678"

// Use for generating unique identifiers
const sessionId = crypto.randomUUID();
const requestId = crypto.randomUUID();
const userId = crypto.randomUUID();
```

### `crypto.getRandomValues()`

Fill a TypedArray with cryptographically secure random values.

```typescript
crypto.getRandomValues(array: TypedArray): TypedArray
```

**Parameters:**

- `array` - A TypedArray (Uint8Array, Uint16Array, Uint32Array, etc.) to fill
  with random values

**Returns:** The same array that was passed in, now filled with random values.

**Example:**

```typescript
// Generate random bytes
const bytes = new Uint8Array(16);
crypto.getRandomValues(bytes);
console.log(bytes); // Uint8Array(16) [234, 12, 89, 45, ...]

// Generate random 32-bit integers
const ints = new Uint32Array(4);
crypto.getRandomValues(ints);
console.log(ints); // Uint32Array(4) [1234567890, 987654321, ...]

// Convert to hex string
const buffer = new Uint8Array(32);
crypto.getRandomValues(buffer);
const hexString = Array.from(buffer)
  .map((b) => b.toString(16).padStart(2, "0"))
  .join("");
console.log("Random hex:", hexString);
```

## SubtleCrypto API

The `crypto.subtle` object provides access to low-level cryptographic
operations.

### `crypto.subtle.digest()`

Generate a digest (hash) of the given data.

```typescript
crypto.subtle.digest(
  algorithm: string,
  data: ArrayBuffer | TypedArray
): Promise<string | ArrayBuffer>
```

**Parameters:**

- `algorithm` - The hash algorithm to use (currently supports "SHA-256")
- `data` - The data to hash (ArrayBuffer or TypedArray)

**Returns:** A Promise that resolves to the hash value.

**Note:** The current implementation returns a hex string instead of an
ArrayBuffer. This is temporary non-W3C compliant behavior that will be updated
in future versions to return an ArrayBuffer.

**Example:**

```typescript
// Hash a string
const encoder = new TextEncoder();
const data = encoder.encode("Hello, Andromeda!");
const hash = await crypto.subtle.digest("SHA-256", data);

// Handle both string and ArrayBuffer return types
if (typeof hash === "string") {
  console.log("SHA-256:", hash);
} else {
  // Convert ArrayBuffer to hex string
  const hashArray = new Uint8Array(hash);
  const hashHex = Array.from(hashArray)
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
  console.log("SHA-256:", hashHex);
}
```

**Supported Algorithms:**

- `SHA-256` - 256-bit SHA-2 hash function

**Complete Example:**

```typescript
async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hash = await crypto.subtle.digest("SHA-256", data);

  if (typeof hash === "string") {
    return hash;
  }

  return Array.from(new Uint8Array(hash))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

const passwordHash = await hashPassword("mySecurePassword123");
console.log("Password hash:", passwordHash);
```

### `crypto.subtle.generateKey()`

Generate a cryptographic key for use in encryption/decryption operations.

```typescript
crypto.subtle.generateKey(
  algorithm: string,
  extractable: boolean,
  keyUsages: string[]
): Promise<CryptoKey>
```

**Parameters:**

- `algorithm` - The key generation algorithm (e.g., "AES-GCM")
- `extractable` - Whether the key can be exported
- `keyUsages` - Array of operations the key can be used for (e.g., ["encrypt",
  "decrypt"])

**Returns:** A Promise that resolves to a CryptoKey object.

**Example:**

```typescript
// Generate an AES-GCM key
const key = await crypto.subtle.generateKey(
  "AES-GCM",
  true,
  ["encrypt", "decrypt"],
);

console.log("Generated key:", key);
console.log("Key type:", typeof key);
```

## Complete Examples

### Secure Token Generation

```typescript
function generateSecureToken(length: number = 32): string {
  const bytes = new Uint8Array(length);
  crypto.getRandomValues(bytes);
  return Array.from(bytes)
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

// Generate API key
const apiKey = generateSecureToken(32);
console.log("API Key:", apiKey);

// Generate session token
const sessionToken = generateSecureToken(16);
console.log("Session Token:", sessionToken);
```

### File Integrity Verification

```typescript
async function calculateFileHash(content: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(content);
  const hash = await crypto.subtle.digest("SHA-256", data);

  if (typeof hash === "string") {
    return hash;
  }

  return Array.from(new Uint8Array(hash))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

const fileContent = Andromeda.readTextFileSync("document.txt");
const checksum = await calculateFileHash(fileContent);
console.log("File checksum:", checksum);

// Store checksum for later verification
Andromeda.writeTextFileSync("document.txt.sha256", checksum);
```

### Password Hashing with Salt

```typescript
async function hashPasswordWithSalt(password: string): Promise<string> {
  // Generate random salt
  const salt = new Uint8Array(16);
  crypto.getRandomValues(salt);

  // Combine password and salt
  const encoder = new TextEncoder();
  const passwordData = encoder.encode(password);
  const combined = new Uint8Array(passwordData.length + salt.length);
  combined.set(passwordData);
  combined.set(salt, passwordData.length);

  // Hash the combined data
  const hash = await crypto.subtle.digest("SHA-256", combined);

  // Convert to hex
  let hashHex: string;
  if (typeof hash === "string") {
    hashHex = hash;
  } else {
    hashHex = Array.from(new Uint8Array(hash))
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");
  }

  // Convert salt to hex
  const saltHex = Array.from(salt)
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");

  // Return salt:hash
  return `${saltHex}:${hashHex}`;
}

const hashedPassword = await hashPasswordWithSalt("myPassword123");
console.log("Hashed password:", hashedPassword);
```

### Data Integrity Check

```typescript
async function verifyDataIntegrity(
  data: string,
  expectedHash: string,
): Promise<boolean> {
  const encoder = new TextEncoder();
  const bytes = encoder.encode(data);
  const hash = await crypto.subtle.digest("SHA-256", bytes);

  let actualHash: string;
  if (typeof hash === "string") {
    actualHash = hash;
  } else {
    actualHash = Array.from(new Uint8Array(hash))
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");
  }

  return actualHash === expectedHash;
}

const data = "Important message";
const originalHash = await calculateFileHash(data);

// Later, verify the data hasn't been tampered with
const isValid = await verifyDataIntegrity(data, originalHash);
console.log("Data is valid:", isValid);
```

### Random ID Generation

```typescript
// Generate various types of IDs
function generateShortId(): string {
  const bytes = new Uint8Array(6);
  crypto.getRandomValues(bytes);
  return Array.from(bytes)
    .map((b) => b.toString(36))
    .join("")
    .substring(0, 8)
    .toUpperCase();
}

function generateNumericId(): number {
  const bytes = new Uint32Array(1);
  crypto.getRandomValues(bytes);
  return bytes[0];
}

// Usage
const shortId = generateShortId();
const numericId = generateNumericId();
const uuid = crypto.randomUUID();

console.log("Short ID:", shortId); // "A4B8C2D1"
console.log("Numeric ID:", numericId); // 1234567890
console.log("UUID:", uuid); // "550e8400-e29b-41d4-a716-446655440000"
```

## Security Best Practices

1. **Use crypto.getRandomValues() for Cryptographic Operations**

```typescript
// Good - cryptographically secure
const secureRandom = new Uint8Array(32);
crypto.getRandomValues(secureRandom);

// Bad - NOT cryptographically secure
const insecureRandom = Math.random();
```

2. **Always Use Salt When Hashing Passwords**

```typescript
// Good - uses salt
const salt = new Uint8Array(16);
crypto.getRandomValues(salt);
const hashedWithSalt = await hashPasswordWithSalt(password);

// Bad - no salt (vulnerable to rainbow table attacks)
const hashedWithoutSalt = await crypto.subtle.digest("SHA-256", passwordData);
```

3. **Use UUIDs for Unique Identifiers**

```typescript
// Good - guaranteed unique
const userId = crypto.randomUUID();

// Bad - potential collisions
const userId = Math.floor(Math.random() * 1000000);
```

4. **Handle Sensitive Data Carefully**

```typescript
// Clear sensitive data from memory when done
function processPassword(password: string) {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);

  // Use the data...

  // Clear the array
  data.fill(0);
}
```

## Performance Tips

1. **Reuse TypedArrays for Multiple Random Values**

```typescript
// Efficient - reuse array
const buffer = new Uint8Array(32);
for (let i = 0; i < 1000; i++) {
  crypto.getRandomValues(buffer);
  // Use buffer...
}

// Less efficient - create new array each time
for (let i = 0; i < 1000; i++) {
  const buffer = new Uint8Array(32);
  crypto.getRandomValues(buffer);
}
```

2. **Batch Hash Operations When Possible**

```typescript
async function hashMultipleItems(items: string[]): Promise<string[]> {
  const encoder = new TextEncoder();
  const promises = items.map((item) => {
    const data = encoder.encode(item);
    return crypto.subtle.digest("SHA-256", data);
  });

  const hashes = await Promise.all(promises);
  return hashes.map((hash) => {
    if (typeof hash === "string") {
      return hash;
    }
    return Array.from(new Uint8Array(hash))
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");
  });
}

const items = ["item1", "item2", "item3"];
const hashes = await hashMultipleItems(items);
```

## Error Handling

```typescript
async function safeHash(data: string): Promise<string | null> {
  try {
    const encoder = new TextEncoder();
    const bytes = encoder.encode(data);
    const hash = await crypto.subtle.digest("SHA-256", bytes);

    if (typeof hash === "string") {
      return hash;
    }

    return Array.from(new Uint8Array(hash))
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");
  } catch (error) {
    console.error("Hash operation failed:", error);
    return null;
  }
}

const hash = await safeHash("test data");
if (hash) {
  console.log("Hash:", hash);
} else {
  console.error("Hashing failed");
}
```

## Compatibility Notes

The Crypto API in Andromeda aims to follow the W3C Web Crypto API specification.
Current compatibility notes:

- `crypto.randomUUID()` - Fully compatible with web standards
- `crypto.getRandomValues()` - Fully compatible with web standards
- `crypto.subtle.digest()` - Currently returns hex string instead of ArrayBuffer
  (will be updated to match spec)
- `crypto.subtle.generateKey()` - Basic implementation, limited algorithm
  support

## Limitations

Current limitations in Andromeda's Crypto implementation:

- Limited algorithm support (SHA-256 primarily)
- `crypto.subtle.digest()` returns string instead of ArrayBuffer (temporary)
- Encryption/decryption operations not yet fully implemented
- Key derivation functions not yet available

These features are planned for future releases.

## See Also

- [Web API](/docs/api/web) - TextEncoder/TextDecoder for data conversion
- [File System API](/docs/api/file-system) - For reading/writing hash files
- [Performance API](/docs/api/performance) - Measure crypto operation
  performance
- [Crypto Example](/docs/examples/crypto) - More complete examples
