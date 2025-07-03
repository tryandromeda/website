# SQLite API

Andromeda provides comprehensive SQLite database support through a synchronous
API that mirrors the Deno SQLite implementation, making it compatible with
existing SQLite-based applications.

## Overview

The SQLite API is available through global classes `DatabaseSync` and
`StatementSync`, providing full database operations including:

- Database creation and management
- SQL statement preparation and execution
- Parameter binding and result handling
- Transaction support
- Custom function registration

## Database Operations

### `DatabaseSync`

The main database class for managing SQLite databases.

#### Constructor

```typescript
new DatabaseSync(filename: string, options?: DatabaseSyncOptions)
```

**Parameters:**

- `filename` - Path to the database file (use `:memory:` for in-memory database)
- `options` - Optional configuration (currently available but not fully
  implemented)

**Example:**

```typescript
// Create or open a database file
const db = new DatabaseSync("my-database.db");

// Create an in-memory database
const memDb = new DatabaseSync(":memory:");
```

#### Methods

##### `exec(sql: string): void`

Execute SQL statements directly without returning results.

```typescript
// Create a table
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT UNIQUE
  )
`);

// Insert initial data
db.exec(`
  INSERT INTO users (name, email) VALUES 
  ('Alice', 'alice@example.com'),
  ('Bob', 'bob@example.com')
`);
```

##### `prepare(sql: string): StatementSync`

Prepare a SQL statement for repeated execution.

```typescript
const stmt = db.prepare("INSERT INTO users (name, email) VALUES (?, ?)");
```

##### `close(): void`

Close the database connection.

```typescript
db.close();
```

## Statement Operations

### `StatementSync`

Represents a prepared SQL statement that can be executed multiple times.

#### Methods

##### `run(...params: SQLInputValue[]): StatementResultingChanges`

Execute a statement that modifies the database (INSERT, UPDATE, DELETE).

**Returns:** Object with `changes` (number of affected rows) and
`lastInsertRowid` (last inserted row ID)

```typescript
const insertStmt = db.prepare("INSERT INTO users (name, email) VALUES (?, ?)");

const result = insertStmt.run("Charlie", "charlie@example.com");
console.log(`Inserted ${result.changes} rows, ID: ${result.lastInsertRowid}`);
```

##### `get(...params: SQLInputValue[]): unknown`

Execute a statement and return the first row as an object.

```typescript
const selectStmt = db.prepare("SELECT * FROM users WHERE id = ?");

const user = selectStmt.get(1);
console.log("User:", user);
// Output: { id: 1, name: "Alice", email: "alice@example.com" }
```

##### `all(...params: SQLInputValue[]): unknown[]`

Execute a statement and return all rows as an array of objects.

```typescript
const allUsersStmt = db.prepare("SELECT * FROM users ORDER BY name");

const users = allUsersStmt.all();
console.log("All users:", users);
// Output: [{ id: 1, name: "Alice", ... }, { id: 2, name: "Bob", ... }]
```

##### `*iterate(...params: SQLInputValue[]): IterableIterator<unknown>`

Execute a statement and return an iterator for processing large result sets.

```typescript
const iterStmt = db.prepare("SELECT * FROM users");

for (const user of iterStmt.iterate()) {
  console.log(`Processing user: ${user.name}`);
}
```

##### `finalize(): void`

Finalize and clean up the prepared statement.

```typescript
stmt.finalize();
```

## Parameter Binding

All statement methods support parameter binding using positional parameters:

```typescript
// Positional parameters
const stmt = db.prepare("SELECT * FROM users WHERE name = ? AND email = ?");
const user = stmt.get("Alice", "alice@example.com");

// Works with all statement methods
stmt.run("New User", "new@example.com");
stmt.all();
```

## Complete Example

```typescript
// Create and set up database
const db = new DatabaseSync("blog.db");

db.exec(`
  CREATE TABLE IF NOT EXISTS posts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    content TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`);

// Prepare statements
const insertPost = db.prepare(`
  INSERT INTO posts (title, content) VALUES (?, ?)
`);

const selectPosts = db.prepare(`
  SELECT * FROM posts ORDER BY created_at DESC LIMIT ?
`);

const selectPostById = db.prepare(`
  SELECT * FROM posts WHERE id = ?
`);

// Insert some posts
const posts = [
  [
    "Getting Started with Andromeda",
    "Andromeda is a fast JavaScript runtime...",
  ],
  ["SQLite Integration", "Today we're excited to announce SQLite support..."],
  [
    "Performance Improvements",
    "The latest release includes significant performance gains...",
  ],
];

for (const [title, content] of posts) {
  const result = insertPost.run(title, content);
  console.log(`Created post with ID: ${result.lastInsertRowid}`);
}

// Query posts
console.log("\nRecent posts:");
const recentPosts = selectPosts.all(5);
for (const post of recentPosts) {
  console.log(`- ${post.title} (ID: ${post.id})`);
}

// Get specific post
const specificPost = selectPostById.get(1);
console.log("\nFirst post details:");
console.log(`Title: ${specificPost.title}`);
console.log(`Content: ${specificPost.content.substring(0, 50)}...`);

// Clean up
insertPost.finalize();
selectPosts.finalize();
selectPostById.finalize();
db.close();
```

## Advanced Features

### Statement Information

Get information about prepared statements:

```typescript
const stmt = db.prepare("SELECT COUNT(*) as total FROM users WHERE active = ?");

// Get the expanded SQL with parameters
console.log("Expanded SQL:", stmt.expandedSQL);

// Get the original SQL
console.log("Source SQL:", stmt.sourceSQL);
```

### Error Handling

Always wrap database operations in try-catch blocks:

```typescript
function safeInsertUser(name: string, email: string): boolean {
  try {
    const stmt = db.prepare("INSERT INTO users (name, email) VALUES (?, ?)");
    const result = stmt.run(name, email);
    stmt.finalize();

    console.log(`User inserted with ID: ${result.lastInsertRowid}`);
    return true;
  } catch (error) {
    console.error("Failed to insert user:", error.message);
    return false;
  }
}

function safeSelectUser(id: number): any | null {
  try {
    const stmt = db.prepare("SELECT * FROM users WHERE id = ?");
    const user = stmt.get(id);
    stmt.finalize();

    return user || null;
  } catch (error) {
    console.error("Failed to select user:", error.message);
    return null;
  }
}
```

### Transactions

While explicit transaction support isn't exposed in the current API, you can use
SQL transaction statements:

```typescript
function transferFunds(
  fromAccount: number,
  toAccount: number,
  amount: number,
): boolean {
  try {
    db.exec("BEGIN TRANSACTION");

    // Deduct from source account
    const deductStmt = db.prepare(
      "UPDATE accounts SET balance = balance - ? WHERE id = ?",
    );
    deductStmt.run(amount, fromAccount);

    // Add to destination account
    const addStmt = db.prepare(
      "UPDATE accounts SET balance = balance + ? WHERE id = ?",
    );
    addStmt.run(amount, toAccount);

    db.exec("COMMIT");

    deductStmt.finalize();
    addStmt.finalize();

    return true;
  } catch (error) {
    db.exec("ROLLBACK");
    console.error("Transaction failed:", error.message);
    return false;
  }
}
```

## Performance Tips

1. **Reuse prepared statements**: Create statements once and reuse them for
   multiple executions
2. **Use transactions**: Group multiple operations in transactions for better
   performance
3. **Finalize statements**: Always call `finalize()` when done with a statement
4. **Use appropriate methods**: Use `get()` for single rows, `all()` for small
   result sets, `iterate()` for large ones

```typescript
// Good: Reuse statement
const stmt = db.prepare("INSERT INTO logs (message) VALUES (?)");
for (const message of messages) {
  stmt.run(message);
}
stmt.finalize();

// Less efficient: Prepare statement each time
for (const message of messages) {
  const stmt = db.prepare("INSERT INTO logs (message) VALUES (?)");
  stmt.run(message);
  stmt.finalize();
}
```

## Data Types

SQLite data types are automatically converted to JavaScript types:

| SQLite Type | JavaScript Type |
| ----------- | --------------- |
| `INTEGER`   | `number`        |
| `REAL`      | `number`        |
| `TEXT`      | `string`        |
| `BLOB`      | `Uint8Array`    |
| `NULL`      | `null`          |

## Global Access

The SQLite API is available globally as:

```typescript
// Direct class access
const db = new DatabaseSync("test.db");

// Through sqlite namespace
const db2 = new sqlite.DatabaseSync("test2.db");

// Alternative Database alias
const db3 = new Database("test3.db");
```

## Compatibility

The Andromeda SQLite API is designed to be compatible with Deno's SQLite
implementation, making it easy to port existing applications. Key compatibility
features:

- Same class names and method signatures
- Compatible parameter binding
- Similar error handling patterns
- Matching return value formats

This allows you to use existing Deno SQLite tutorials, examples, and libraries
with minimal modifications.
