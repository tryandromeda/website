---
title: "SQLite API"
description: "Database operations with SQLite support"
section: "API Reference"
order: 11
id: "sqlite"
---

Andromeda includes built-in support for SQLite databases through the `Database`
class, providing a synchronous API for database operations.

## Overview

The SQLite API allows you to:

- Create and manage SQLite databases
- Execute SQL statements and queries
- Use prepared statements for better performance and security
- Work with transactions
- Handle various data types
- Use in-memory databases for temporary storage

## Creating a Database

### File-based Database

```typescript
// Create or open a database file
const db = new Database("myapp.db");

// Use the database
db.exec("CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY, name TEXT)");

// Close when done
db.close();
```

### In-Memory Database

```typescript
// Create a temporary in-memory database
const db = new Database(":memory:");

// Perfect for testing or temporary data
db.exec("CREATE TABLE temp_data (id INTEGER, value TEXT)");
```

## Database Methods

### `exec(sql: string): void`

Execute one or more SQL statements. Does not return results.

```typescript
const db = new Database(":memory:");

// Execute single statement
db.exec("CREATE TABLE users (id INTEGER PRIMARY KEY, name TEXT, email TEXT)");

// Execute multiple statements
db.exec(`
  CREATE TABLE products (id INTEGER PRIMARY KEY, name TEXT, price REAL);
  CREATE TABLE orders (id INTEGER PRIMARY KEY, user_id INTEGER, product_id INTEGER);
  CREATE INDEX idx_orders_user ON orders(user_id);
`);
```

### `prepare(sql: string): Statement`

Create a prepared statement for efficient repeated execution.

```typescript
const db = new Database(":memory:");
db.exec("CREATE TABLE users (id INTEGER PRIMARY KEY, name TEXT, age INTEGER)");

// Prepare a statement
const stmt = db.prepare("INSERT INTO users (name, age) VALUES (?, ?)");

// Execute multiple times
stmt.run("Alice", 30);
stmt.run("Bob", 25);
stmt.run("Charlie", 35);
```

### `close(): void`

Close the database connection.

```typescript
const db = new Database("myapp.db");
// ... use database ...
db.close();
```

### `enableLoadExtension(enable: boolean): void`

Enable or disable loading SQLite extensions.

```typescript
const db = new Database("myapp.db");

// Enable extension loading
db.enableLoadExtension(true);

// Load an extension (if needed)
// db.loadExtension("path/to/extension");

// Disable when done
db.enableLoadExtension(false);
```

### `function(name: string, callback: Function): any`

Register a custom SQL function.

```typescript
const db = new Database(":memory:");

// Register a simple function
db.function("double", (x) => x * 2);

db.exec("CREATE TABLE numbers (value INTEGER)");
db.exec("INSERT INTO numbers VALUES (5), (10), (15)");

const results = db.prepare(
  "SELECT value, double(value) as doubled FROM numbers",
).all();
console.log(results);
// [{ value: 5, doubled: 10 }, { value: 10, doubled: 20 }, { value: 15, doubled: 30 }]
```

## Prepared Statements

Prepared statements provide better performance and security for repeated
queries.

### Statement Methods

#### `run(...params): void`

Execute the statement with the given parameters. Used for INSERT, UPDATE,
DELETE.

```typescript
const db = new Database(":memory:");
db.exec("CREATE TABLE users (id INTEGER PRIMARY KEY, name TEXT, email TEXT)");

const stmt = db.prepare("INSERT INTO users (name, email) VALUES (?, ?)");
stmt.run("Alice", "alice@example.com");
stmt.run("Bob", "bob@example.com");
```

#### `get(...params): object | undefined`

Execute the statement and return the first result row.

```typescript
const db = new Database(":memory:");
db.exec("CREATE TABLE users (id INTEGER PRIMARY KEY, name TEXT, age INTEGER)");
db.exec("INSERT INTO users (name, age) VALUES ('Alice', 30), ('Bob', 25)");

const stmt = db.prepare("SELECT * FROM users WHERE name = ?");
const user = stmt.get("Alice");

console.log(user); // { id: 1, name: "Alice", age: 30 }
```

#### `all(...params): object[]`

Execute the statement and return all result rows.

```typescript
const db = new Database(":memory:");
db.exec("CREATE TABLE users (id INTEGER PRIMARY KEY, name TEXT, age INTEGER)");
db.exec(
  "INSERT INTO users (name, age) VALUES ('Alice', 30), ('Bob', 25), ('Charlie', 35)",
);

const stmt = db.prepare("SELECT * FROM users WHERE age > ?");
const users = stmt.all(26);

console.log(users);
// [
//   { id: 1, name: "Alice", age: 30 },
//   { id: 3, name: "Charlie", age: 35 }
// ]
```

#### `iterate(...params): Iterator<object>`

Execute the statement and return an iterator for the results.

```typescript
const db = new Database(":memory:");
db.exec("CREATE TABLE users (id INTEGER PRIMARY KEY, name TEXT)");
db.exec("INSERT INTO users (name) VALUES ('Alice'), ('Bob'), ('Charlie')");

const stmt = db.prepare("SELECT * FROM users");

for (const user of stmt.iterate()) {
  console.log(user.name);
}
// Alice
// Bob
// Charlie
```

### Statement Properties

#### `sourceSQL: string`

Get the original SQL text of the statement.

```typescript
const stmt = db.prepare("SELECT * FROM users WHERE age > ?");
console.log(stmt.sourceSQL); // "SELECT * FROM users WHERE age > ?"
```

#### `expandedSQL: string`

Get the SQL with parameters expanded (useful for debugging).

```typescript
const stmt = db.prepare("SELECT * FROM users WHERE name = ?");
stmt.get("Alice");
console.log(stmt.expandedSQL); // Shows the SQL with actual values
```

### Statement Options

#### `setAllowBareNamedParameters(allow: boolean): void`

Configure whether to allow bare named parameters (without prefix).

```typescript
const stmt = db.prepare("SELECT * FROM users WHERE name = ?");
stmt.setAllowBareNamedParameters(true);
```

#### `setReadBigInts(enable: boolean): void`

Configure whether to read large integers as BigInt.

```typescript
const stmt = db.prepare("SELECT * FROM large_numbers");
stmt.setReadBigInts(true);
const results = stmt.all();
// Integer values will be returned as BigInt
```

## Parameter Binding

Use `?` placeholders for parameters:

```typescript
const db = new Database(":memory:");
db.exec("CREATE TABLE users (id INTEGER PRIMARY KEY, name TEXT, age INTEGER)");

// Single parameter
const stmt1 = db.prepare("SELECT * FROM users WHERE age > ?");
const users = stmt1.all(25);

// Multiple parameters
const stmt2 = db.prepare("INSERT INTO users (name, age) VALUES (?, ?)");
stmt2.run("Alice", 30);

// Mixed types
const stmt3 = db.prepare(
  "SELECT * FROM users WHERE name = ? AND age BETWEEN ? AND ?",
);
const filtered = stmt3.all("Alice", 20, 40);
```

## Data Types

SQLite supports the following data types, which map to JavaScript types:

| SQLite Type | JavaScript Type  | Example                     |
| ----------- | ---------------- | --------------------------- |
| INTEGER     | number or BigInt | `42`, `9007199254740991n`   |
| REAL        | number           | `3.14159`                   |
| TEXT        | string           | `"Hello, World!"`           |
| BLOB        | Uint8Array       | `new Uint8Array([1, 2, 3])` |
| NULL        | null             | `null`                      |

```typescript
const db = new Database(":memory:");
db.exec(`
  CREATE TABLE data_types (
    id INTEGER PRIMARY KEY,
    text_val TEXT,
    int_val INTEGER,
    real_val REAL,
    blob_val BLOB,
    null_val TEXT
  )
`);

const stmt = db.prepare(
  "INSERT INTO data_types (text_val, int_val, real_val, null_val) VALUES (?, ?, ?, ?)",
);

stmt.run("Hello", 42, 3.14159, null);
stmt.run("Unicode: 🚀", 2147483647, -99.5, null);

const results = db.prepare("SELECT * FROM data_types").all();
console.log(results);
```

## Transactions

Use transactions for better performance and data consistency:

```typescript
const db = new Database("myapp.db");

// Start a transaction
db.exec("BEGIN TRANSACTION");

try {
  // Multiple operations
  const insertStmt = db.prepare(
    "INSERT INTO users (name, email) VALUES (?, ?)",
  );
  insertStmt.run("Alice", "alice@example.com");
  insertStmt.run("Bob", "bob@example.com");
  insertStmt.run("Charlie", "charlie@example.com");

  // Commit if all succeeded
  db.exec("COMMIT");
  console.log("Transaction committed successfully");
} catch (error) {
  // Rollback on error
  db.exec("ROLLBACK");
  console.error("Transaction rolled back:", error);
}
```

## Complete Example

```typescript
// Create database
const db = new Database("blog.db");

// Create schema
db.exec(`
  CREATE TABLE IF NOT EXISTS posts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    content TEXT,
    author TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    published INTEGER DEFAULT 0
  );
  
  CREATE INDEX IF NOT EXISTS idx_posts_author ON posts(author);
  CREATE INDEX IF NOT EXISTS idx_posts_published ON posts(published);
`);

// Insert posts
const insertPost = db.prepare(
  "INSERT INTO posts (title, content, author, published) VALUES (?, ?, ?, ?)",
);

insertPost.run(
  "Getting Started with Andromeda",
  "Learn how to build amazing apps with Andromeda...",
  "Alice",
  1,
);

insertPost.run(
  "Advanced SQLite Techniques",
  "Discover advanced database patterns...",
  "Bob",
  1,
);

insertPost.run(
  "Draft Post",
  "This is still being written...",
  "Alice",
  0,
);

// Query published posts
const publishedPosts = db.prepare(
  "SELECT * FROM posts WHERE published = 1 ORDER BY created_at DESC",
).all();

console.log("Published posts:");
for (const post of publishedPosts) {
  console.log(`- ${post.title} by ${post.author}`);
}

// Get posts by author
const getByAuthor = db.prepare(
  "SELECT COUNT(*) as count FROM posts WHERE author = ?",
);
const alicePosts = getByAuthor.get("Alice");
console.log(`Alice has written ${alicePosts.count} posts`);

// Update a post
const updatePost = db.prepare(
  "UPDATE posts SET published = 1 WHERE id = ?",
);
updatePost.run(3); // Publish the draft

// Get all posts with pagination
const getAllPosts = db.prepare(
  "SELECT * FROM posts ORDER BY created_at DESC LIMIT ? OFFSET ?",
);
const page1 = getAllPosts.all(10, 0);
const page2 = getAllPosts.all(10, 10);

// Clean up
db.close();
```

## Performance Tips

1. **Use Prepared Statements**: Reuse prepared statements for better performance

```typescript
// Good - prepare once, execute many times
const stmt = db.prepare("INSERT INTO users (name) VALUES (?)");
for (const name of names) {
  stmt.run(name);
}

// Less efficient - prepares each time
for (const name of names) {
  db.exec(`INSERT INTO users (name) VALUES ('${name}')`);
}
```

2. **Use Transactions for Bulk Operations**:

```typescript
db.exec("BEGIN TRANSACTION");
const stmt = db.prepare("INSERT INTO data (value) VALUES (?)");
for (let i = 0; i < 10000; i++) {
  stmt.run(i);
}
db.exec("COMMIT");
```

3. **Create Indexes for Frequently Queried Columns**:

```typescript
db.exec("CREATE INDEX idx_users_email ON users(email)");
db.exec("CREATE INDEX idx_posts_author_date ON posts(author, created_at)");
```

4. **Use `get()` When You Need Only One Row**:

```typescript
// Efficient - stops after first match
const user = db.prepare("SELECT * FROM users WHERE id = ?").get(123);

// Less efficient - fetches all matches
const users = db.prepare("SELECT * FROM users WHERE id = ?").all(123);
const user = users[0];
```

## Error Handling

```typescript
const db = new Database("myapp.db");

try {
  db.exec("CREATE TABLE users (id INTEGER PRIMARY KEY, name TEXT)");

  const stmt = db.prepare("INSERT INTO users (name) VALUES (?)");
  stmt.run("Alice");
} catch (error) {
  console.error("Database error:", error.message);
} finally {
  db.close();
}
```

## Best Practices

1. **Always close databases** when done to release resources
2. **Use prepared statements** with parameters to prevent SQL injection
3. **Use transactions** for multiple related operations
4. **Create indexes** on frequently queried columns
5. **Use appropriate data types** for your data
6. **Handle errors properly** with try/catch blocks
7. **Use `:memory:` databases** for testing

## See Also

- [Web Storage API](/docs/api/web-storage) - For simple key-value storage
- [Cache Storage API](/docs/api/cache-storage) - For HTTP response caching
- [File System API](/docs/api/file-system) - For file operations
- [SQLite Example](/docs/examples/sqlite) - Complete working example
