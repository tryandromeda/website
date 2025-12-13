---
title: "SQLite Database Example"
description: "Working with SQLite databases in Andromeda"
section: "Examples"
order: 4
id: "sqlite"
---

This example demonstrates how to use SQLite databases in Andromeda for data
persistence and management.

## Basic Database Operations

```typescript
// Create or open a database
const db = new Database("my-app.db");

// Create a table
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    age INTEGER,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`);

// Insert data using prepared statements
const insertStmt = db.prepare(
  "INSERT INTO users (name, email, age) VALUES (?, ?, ?)",
);

insertStmt.run("Alice Smith", "alice@example.com", 30);
insertStmt.run("Bob Johnson", "bob@example.com", 25);
insertStmt.run("Charlie Brown", "charlie@example.com", 35);

console.log("✅ Users inserted successfully");

// Query all users
const allUsers = db.prepare("SELECT * FROM users ORDER BY name").all();
console.log("\n📋 All users:");
for (const user of allUsers) {
  console.log(`  - ${user.name} (${user.age}): ${user.email}`);
}

// Query with parameters
const olderUsers = db.prepare("SELECT * FROM users WHERE age > ?").all(26);
console.log("\n👴 Users over 26:");
for (const user of olderUsers) {
  console.log(`  - ${user.name} (${user.age})`);
}

// Get a single user
const user = db.prepare("SELECT * FROM users WHERE email = ?").get(
  "alice@example.com",
);
console.log("\n👤 User lookup:");
console.log(`  Name: ${user.name}, Age: ${user.age}`);

// Update data
const updateStmt = db.prepare("UPDATE users SET age = ? WHERE name = ?");
updateStmt.run(31, "Alice Smith");
console.log("\n✅ User updated");

// Delete data
const deleteStmt = db.prepare("DELETE FROM users WHERE name = ?");
deleteStmt.run("Bob Johnson");
console.log("✅ User deleted");

// Clean up
db.close();
console.log("\n✅ Database closed");
```

## Complete Blog Application

```typescript
// blog.ts - A complete blog database application

// Create database
const db = new Database("blog.db");

// Create schema
db.exec(`
  CREATE TABLE IF NOT EXISTS posts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    content TEXT,
    author TEXT NOT NULL,
    published INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS comments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    post_id INTEGER NOT NULL,
    author TEXT NOT NULL,
    content TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (post_id) REFERENCES posts(id)
  );

  CREATE INDEX IF NOT EXISTS idx_posts_author ON posts(author);
  CREATE INDEX IF NOT EXISTS idx_posts_published ON posts(published);
  CREATE INDEX IF NOT EXISTS idx_comments_post ON comments(post_id);
`);

console.log("✅ Database schema created");

// Insert some posts
const insertPost = db.prepare(
  "INSERT INTO posts (title, content, author, published) VALUES (?, ?, ?, ?)",
);

insertPost.run(
  "Getting Started with Andromeda",
  "Andromeda is a modern JavaScript runtime built in Rust...",
  "Alice",
  1,
);

insertPost.run(
  "SQLite Integration Guide",
  "Learn how to use SQLite databases in your Andromeda applications...",
  "Bob",
  1,
);

insertPost.run(
  "Advanced Performance Tips",
  "Optimize your Andromeda applications with these techniques...",
  "Alice",
  1,
);

insertPost.run(
  "Draft: Future Features",
  "Coming soon to Andromeda...",
  "Charlie",
  0,
);

console.log("✅ Posts inserted");

// Insert comments
const insertComment = db.prepare(
  "INSERT INTO comments (post_id, author, content) VALUES (?, ?, ?)",
);

insertComment.run(1, "Bob", "Great introduction!");
insertComment.run(1, "Charlie", "Very helpful, thanks!");
insertComment.run(2, "Alice", "Nice guide!");

console.log("✅ Comments inserted");

// Query published posts with comment count
const publishedPosts = db.prepare(`
  SELECT 
    p.id,
    p.title,
    p.author,
    p.created_at,
    COUNT(c.id) as comment_count
  FROM posts p
  LEFT JOIN comments c ON p.id = c.post_id
  WHERE p.published = 1
  GROUP BY p.id
  ORDER BY p.created_at DESC
`).all();

console.log("\n📚 Published posts:");
for (const post of publishedPosts) {
  console.log(
    `  - "${post.title}" by ${post.author} (${post.comment_count} comments)`,
  );
}

// Get posts by author
const getPostsByAuthor = db.prepare(
  "SELECT * FROM posts WHERE author = ? ORDER BY created_at DESC",
);

const alicePosts = getPostsByAuthor.all("Alice");
console.log(`\n✍️  Alice has written ${alicePosts.length} posts`);

// Get a post with its comments
function getPostWithComments(postId: number) {
  const post = db.prepare("SELECT * FROM posts WHERE id = ?").get(postId);

  if (!post) {
    return null;
  }

  const comments = db.prepare(
    "SELECT * FROM comments WHERE post_id = ? ORDER BY created_at ASC",
  ).all(postId);

  return { ...post, comments };
}

const postWithComments = getPostWithComments(1);
console.log(`\n📝 Post: "${postWithComments.title}"`);
console.log(`   Author: ${postWithComments.author}`);
console.log(`   Comments (${postWithComments.comments.length}):`);
for (const comment of postWithComments.comments) {
  console.log(`     - ${comment.author}: ${comment.content}`);
}

// Search posts
const searchPosts = db.prepare(
  "SELECT * FROM posts WHERE title LIKE ? OR content LIKE ?",
);

const searchTerm = "%Andromeda%";
const searchResults = searchPosts.all(searchTerm, searchTerm);
console.log(`\n🔍 Found ${searchResults.length} posts matching "Andromeda"`);

// Update post
const updatePost = db.prepare(
  "UPDATE posts SET published = 1, updated_at = CURRENT_TIMESTAMP WHERE id = ?",
);
updatePost.run(4);
console.log("\n✅ Published draft post");

// Statistics
const stats = db.prepare(`
  SELECT 
    (SELECT COUNT(*) FROM posts) as total_posts,
    (SELECT COUNT(*) FROM posts WHERE published = 1) as published_posts,
    (SELECT COUNT(*) FROM comments) as total_comments,
    (SELECT COUNT(DISTINCT author) FROM posts) as unique_authors
`).get();

console.log("\n📊 Blog Statistics:");
console.log(`   Total posts: ${stats.total_posts}`);
console.log(`   Published: ${stats.published_posts}`);
console.log(`   Comments: ${stats.total_comments}`);
console.log(`   Authors: ${stats.unique_authors}`);

// Clean up
db.close();
console.log("\n✅ Database closed");
```

## Using Transactions

```typescript
// transactions.ts - Demonstrating transaction usage

const db = new Database("transactions.db");

// Create accounts table
db.exec(`
  CREATE TABLE IF NOT EXISTS accounts (
    id INTEGER PRIMARY KEY,
    name TEXT NOT NULL,
    balance REAL NOT NULL DEFAULT 0.0
  )
`);

// Insert initial accounts
const insertAccount = db.prepare(
  "INSERT INTO accounts (id, name, balance) VALUES (?, ?, ?)",
);
insertAccount.run(1, "Alice", 1000.0);
insertAccount.run(2, "Bob", 500.0);

console.log("✅ Initial accounts created");

// Transfer money between accounts using a transaction
function transferMoney(fromId: number, toId: number, amount: number): boolean {
  try {
    // Start transaction
    db.exec("BEGIN TRANSACTION");

    // Deduct from source account
    const deduct = db.prepare(
      "UPDATE accounts SET balance = balance - ? WHERE id = ?",
    );
    deduct.run(amount, fromId);

    // Check if source has sufficient balance
    const fromAccount = db.prepare("SELECT balance FROM accounts WHERE id = ?")
      .get(fromId);
    if (fromAccount.balance < 0) {
      throw new Error("Insufficient funds");
    }

    // Add to destination account
    const add = db.prepare(
      "UPDATE accounts SET balance = balance + ? WHERE id = ?",
    );
    add.run(amount, toId);

    // Commit transaction
    db.exec("COMMIT");
    console.log(
      `✅ Transferred $${amount} from account ${fromId} to account ${toId}`,
    );
    return true;
  } catch (error) {
    // Rollback on error
    db.exec("ROLLBACK");
    console.error(`❌ Transfer failed: ${error.message}`);
    return false;
  }
}

// Display balances
function showBalances() {
  const accounts = db.prepare("SELECT * FROM accounts ORDER BY id").all();
  console.log("\n💰 Account Balances:");
  for (const account of accounts) {
    console.log(`   ${account.name}: $${account.balance.toFixed(2)}`);
  }
}

showBalances();

// Successful transfer
transferMoney(1, 2, 200);
showBalances();

// Failed transfer (insufficient funds)
transferMoney(2, 1, 10000);
showBalances();

// Clean up
db.close();
```

## Performance Testing

```typescript
// performance.ts - Testing SQLite performance

const db = new Database(":memory:");

// Create table
db.exec(`
  CREATE TABLE test_data (
    id INTEGER PRIMARY KEY,
    value TEXT,
    number INTEGER,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`);

// Test 1: Insert performance with transaction
console.log("🧪 Test 1: Bulk insert with transaction");
const startTime1 = performance.now();

db.exec("BEGIN TRANSACTION");
const insertStmt = db.prepare(
  "INSERT INTO test_data (id, value, number) VALUES (?, ?, ?)",
);

for (let i = 0; i < 10000; i++) {
  insertStmt.run(i, `value_${i}`, Math.floor(Math.random() * 1000));
}

db.exec("COMMIT");
const endTime1 = performance.now();

console.log(
  `   Inserted 10,000 rows in ${(endTime1 - startTime1).toFixed(2)}ms`,
);

// Test 2: Query performance
console.log("\n🧪 Test 2: Query performance");
const startTime2 = performance.now();

const results = db.prepare("SELECT * FROM test_data WHERE number > ?").all(500);

const endTime2 = performance.now();
console.log(
  `   Queried ${results.length} rows in ${
    (endTime2 - startTime2).toFixed(2)
  }ms`,
);

// Test 3: Index performance
console.log("\n🧪 Test 3: Creating index");
const startTime3 = performance.now();

db.exec("CREATE INDEX idx_number ON test_data(number)");

const endTime3 = performance.now();
console.log(`   Created index in ${(endTime3 - startTime3).toFixed(2)}ms`);

// Test 4: Query with index
console.log("\n🧪 Test 4: Query with index");
const startTime4 = performance.now();

const resultsWithIndex = db.prepare("SELECT * FROM test_data WHERE number > ?")
  .all(500);

const endTime4 = performance.now();
console.log(
  `   Queried ${resultsWithIndex.length} rows in ${
    (endTime4 - startTime4).toFixed(2)
  }ms`,
);

// Statistics
const stats = db.prepare(`
  SELECT 
    COUNT(*) as total,
    AVG(number) as avg_number,
    MIN(number) as min_number,
    MAX(number) as max_number
  FROM test_data
`).get();

console.log("\n📊 Data Statistics:");
console.log(`   Total rows: ${stats.total}`);
console.log(`   Average: ${stats.avg_number.toFixed(2)}`);
console.log(`   Min: ${stats.min_number}`);
console.log(`   Max: ${stats.max_number}`);

db.close();
```

## Best Practices Demonstrated

1. **Use Prepared Statements**: More efficient and prevents SQL injection
2. **Use Transactions**: For multiple related operations
3. **Create Indexes**: For frequently queried columns
4. **Close Connections**: Always close the database when done
5. **Error Handling**: Wrap operations in try-catch blocks
6. **Use Appropriate Data Types**: INTEGER, TEXT, REAL, BLOB
7. **Foreign Keys**: Maintain referential integrity
8. **Default Values**: Use DEFAULT for common values

## Common Patterns

### Checking if Record Exists

```typescript
function userExists(email: string): boolean {
  const result = db.prepare(
    "SELECT COUNT(*) as count FROM users WHERE email = ?",
  ).get(email);
  return result.count > 0;
}
```

### Upsert (Insert or Update)

```typescript
function upsertUser(email: string, name: string) {
  db.prepare(
    "INSERT INTO users (email, name) VALUES (?, ?) ON CONFLICT(email) DO UPDATE SET name = ?",
  ).run(email, name, name);
}
```

### Pagination

```typescript
function getUsers(page: number, pageSize: number) {
  const offset = (page - 1) * pageSize;
  return db.prepare(
    "SELECT * FROM users ORDER BY id LIMIT ? OFFSET ?",
  ).all(pageSize, offset);
}
```

## Running the Examples

```bash
# Basic example
andromeda run examples/sqlite-basic.ts

# Blog application
andromeda run examples/sqlite-blog.ts

# Transaction example
andromeda run examples/sqlite-transactions.ts

# Performance testing
andromeda run examples/sqlite-performance.ts
```

## See Also

- [SQLite API Documentation](/docs/api/sqlite)
- [Web Storage API](/docs/api/web-storage)
- [File System API](/docs/api/file-system)
