---
title: "SQLite Examples"
description: "Database operations and SQL query examples"
section: "Examples"
order: 10
id: "sqlite-examples"
---

This page demonstrates various SQLite database operations using Andromeda's
built-in SQLite support.

## Basic Database Operations

### Creating and Setting Up a Database

```typescript
// Create a new SQLite database
const db = new DatabaseSync("example.db");

// Create tables
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    email TEXT UNIQUE NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`);

db.exec(`
  CREATE TABLE IF NOT EXISTS posts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    title TEXT NOT NULL,
    content TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users (id)
  )
`);

console.log("✅ Database and tables created successfully!");
```

### Basic CRUD Operations

```typescript
// Prepare statements for reuse
const insertUser = db.prepare(`
  INSERT INTO users (username, email) VALUES (?, ?)
`);

const selectUser = db.prepare(`
  SELECT * FROM users WHERE username = ?
`);

const updateUser = db.prepare(`
  UPDATE users SET email = ? WHERE id = ?
`);

const deleteUser = db.prepare(`
  DELETE FROM users WHERE id = ?
`);

// CREATE - Insert users
console.log("Creating users...");
const user1 = insertUser.run("alice", "alice@example.com");
const user2 = insertUser.run("bob", "bob@example.com");
const user3 = insertUser.run("charlie", "charlie@example.com");

console.log(`Created user Alice with ID: ${user1.lastInsertRowid}`);
console.log(`Created user Bob with ID: ${user2.lastInsertRowid}`);
console.log(`Created user Charlie with ID: ${user3.lastInsertRowid}`);

// READ - Query users
console.log("\nQuerying users...");
const alice = selectUser.get("alice");
console.log("Alice's data:", alice);

const allUsers = db.prepare("SELECT * FROM users ORDER BY username").all();
console.log("All users:", allUsers);

// UPDATE - Modify user
console.log("\nUpdating user...");
const updateResult = updateUser.run("alice.smith@example.com", alice.id);
console.log(`Updated ${updateResult.changes} user(s)`);

// DELETE - Remove user
console.log("\nDeleting user...");
const deleteResult = deleteUser.run(user3.id);
console.log(`Deleted ${deleteResult.changes} user(s)`);

// Verify final state
const remainingUsers = db.prepare("SELECT COUNT(*) as count FROM users").get();
console.log(`Remaining users: ${remainingUsers.count}`);
```

## Advanced Examples

### Blog System

```typescript
// Blog system with users and posts
class BlogDatabase {
  #db: DatabaseSync;

  constructor(filename: string) {
    this.#db = new Database(filename);
    this.#setupTables();
  }

  #setupTables() {
    this.#db.exec(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE NOT NULL,
        email TEXT UNIQUE NOT NULL,
        bio TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    this.#db.exec(`
      CREATE TABLE IF NOT EXISTS posts (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        title TEXT NOT NULL,
        content TEXT,
        published BOOLEAN DEFAULT FALSE,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users (id)
      )
    `);

    this.#db.exec(`
      CREATE TABLE IF NOT EXISTS comments (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        post_id INTEGER NOT NULL,
        user_id INTEGER NOT NULL,
        content TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (post_id) REFERENCES posts (id),
        FOREIGN KEY (user_id) REFERENCES users (id)
      )
    `);
  }

  createUser(username: string, email: string, bio?: string) {
    const stmt = this.#db.prepare(`
      INSERT INTO users (username, email, bio) VALUES (?, ?, ?)
    `);
    const result = stmt.run(username, email, bio || null);
    stmt.finalize();
    return result.lastInsertRowid;
  }

  createPost(
    userId: number,
    title: string,
    content: string,
    published = false,
  ) {
    const stmt = this.#db.prepare(`
      INSERT INTO posts (user_id, title, content, published) VALUES (?, ?, ?, ?)
    `);
    const result = stmt.run(userId, title, content, published);
    stmt.finalize();
    return result.lastInsertRowid;
  }

  getPostsWithAuthors(limit = 10) {
    const stmt = this.#db.prepare(`
      SELECT 
        p.id,
        p.title,
        p.content,
        p.published,
        p.created_at,
        u.username as author,
        u.email as author_email
      FROM posts p
      JOIN users u ON p.user_id = u.id
      WHERE p.published = TRUE
      ORDER BY p.created_at DESC
      LIMIT ?
    `);
    const posts = stmt.all(limit);
    stmt.finalize();
    return posts;
  }

  addComment(postId: number, userId: number, content: string) {
    const stmt = this.#db.prepare(`
      INSERT INTO comments (post_id, user_id, content) VALUES (?, ?, ?)
    `);
    const result = stmt.run(postId, userId, content);
    stmt.finalize();
    return result.lastInsertRowid;
  }

  getPostWithComments(postId: number) {
    // Get post with author
    const postStmt = this.#db.prepare(`
      SELECT 
        p.*,
        u.username as author,
        u.email as author_email,
        u.bio as author_bio
      FROM posts p
      JOIN users u ON p.user_id = u.id
      WHERE p.id = ?
    `);
    const post = postStmt.get(postId);
    postStmt.finalize();

    if (!post) return null;

    // Get comments with authors
    const commentsStmt = this.#db.prepare(`
      SELECT 
        c.*,
        u.username as commenter
      FROM comments c
      JOIN users u ON c.user_id = u.id
      WHERE c.post_id = ?
      ORDER BY c.created_at ASC
    `);
    const comments = commentsStmt.all(postId);
    commentsStmt.finalize();

    return { ...post, comments };
  }

  close() {
    this.#db.close();
  }
}

// Usage example
const blog = new BlogDatabase("blog.db");

// Create users
const aliceId = blog.createUser(
  "alice",
  "alice@blog.com",
  "Tech enthusiast and blogger",
);
const bobId = blog.createUser("bob", "bob@blog.com", "Software developer");

// Create posts
const post1Id = blog.createPost(
  aliceId as number,
  "Getting Started with Andromeda",
  "Andromeda is an amazing JavaScript runtime...",
  true,
);

const post2Id = blog.createPost(
  bobId as number,
  "SQLite in Andromeda",
  "Today we'll explore the built-in SQLite support...",
  true,
);

// Add comments
blog.addComment(post1Id as number, bobId as number, "Great article, Alice!");
blog.addComment(post1Id as number, aliceId as number, "Thanks, Bob!");

// Query data
console.log("Recent blog posts:");
const recentPosts = blog.getPostsWithAuthors(5);
recentPosts.forEach((post) => {
  console.log(`📝 "${post.title}" by ${post.author} (${post.created_at})`);
});

console.log("\nPost with comments:");
const postWithComments = blog.getPostWithComments(post1Id as number);
if (postWithComments) {
  console.log(`📄 ${postWithComments.title}`);
  console.log(`👤 Author: ${postWithComments.author}`);
  console.log(`💬 Comments: ${postWithComments.comments.length}`);

  postWithComments.comments.forEach((comment) => {
    console.log(`  - ${comment.commenter}: ${comment.content}`);
  });
}

blog.close();
```

### Data Analytics Example

```typescript
// Analytics system for tracking events
class AnalyticsDatabase {
  #db: DatabaseSync;

  constructor(filename: string) {
    this.#db = new Database(filename);
    this.#setupTables();
  }

  #setupTables() {
    this.#db.exec(`
      CREATE TABLE IF NOT EXISTS events (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        event_type TEXT NOT NULL,
        user_id TEXT,
        session_id TEXT,
        properties TEXT, -- JSON string
        timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    this.#db.exec(`
      CREATE INDEX IF NOT EXISTS idx_events_type_time 
      ON events(event_type, timestamp)
    `);

    this.#db.exec(`
      CREATE INDEX IF NOT EXISTS idx_events_user_time 
      ON events(user_id, timestamp)
    `);
  }

  trackEvent(
    eventType: string,
    userId?: string,
    sessionId?: string,
    properties?: any,
  ) {
    const stmt = this.#db.prepare(`
      INSERT INTO events (event_type, user_id, session_id, properties)
      VALUES (?, ?, ?, ?)
    `);

    const result = stmt.run(
      eventType,
      userId || null,
      sessionId || null,
      properties ? JSON.stringify(properties) : null,
    );

    stmt.finalize();
    return result.lastInsertRowid;
  }

  getEventCounts(days = 7) {
    const stmt = this.#db.prepare(`
      SELECT 
        event_type,
        COUNT(*) as count,
        DATE(timestamp) as date
      FROM events
      WHERE timestamp >= datetime('now', '-${days} days')
      GROUP BY event_type, DATE(timestamp)
      ORDER BY date DESC, count DESC
    `);

    const results = stmt.all();
    stmt.finalize();
    return results;
  }

  getUserActivity(userId: string, days = 30) {
    const stmt = this.#db.prepare(`
      SELECT 
        event_type,
        COUNT(*) as count,
        MIN(timestamp) as first_seen,
        MAX(timestamp) as last_seen
      FROM events
      WHERE user_id = ? AND timestamp >= datetime('now', '-${days} days')
      GROUP BY event_type
      ORDER BY count DESC
    `);

    const results = stmt.all(userId);
    stmt.finalize();
    return results;
  }

  getTopUsers(eventType?: string, limit = 10) {
    let query = `
      SELECT 
        user_id,
        COUNT(*) as event_count,
        COUNT(DISTINCT session_id) as session_count,
        MIN(timestamp) as first_seen,
        MAX(timestamp) as last_seen
      FROM events
      WHERE user_id IS NOT NULL
    `;

    const params: any[] = [];

    if (eventType) {
      query += ` AND event_type = ?`;
      params.push(eventType);
    }

    query += `
      GROUP BY user_id
      ORDER BY event_count DESC
      LIMIT ?
    `;
    params.push(limit);

    const stmt = this.#db.prepare(query);
    const results = stmt.all(...params);
    stmt.finalize();
    return results;
  }

  close() {
    this.#db.close();
  }
}

const analytics = new AnalyticsDatabase("analytics.db");

// Simulate user events
const users = ["user1", "user2", "user3"];
const events = ["page_view", "click", "purchase", "signup"];

console.log("Generating sample analytics data...");

// Generate random events
for (let i = 0; i < 100; i++) {
  const eventType = events[Math.floor(Math.random() * events.length)];
  const userId = users[Math.floor(Math.random() * users.length)];
  const sessionId = `session_${Math.floor(Math.random() * 20)}`;

  const properties = {
    page: `/page${Math.floor(Math.random() * 10)}`,
    browser: ["Chrome", "Firefox", "Safari"][Math.floor(Math.random() * 3)],
    value: eventType === "purchase"
      ? Math.floor(Math.random() * 100) + 10
      : undefined,
  };

  analytics.trackEvent(eventType, userId, sessionId, properties);
}

// Generate reports
console.log("\n📊 Event Counts (Last 7 days):");
const eventCounts = analytics.getEventCounts(7);
eventCounts.forEach((row) => {
  console.log(`${row.date}: ${row.event_type} = ${row.count}`);
});

console.log("\n👥 Top Users:");
const topUsers = analytics.getTopUsers(undefined, 5);
topUsers.forEach((user, index) => {
  console.log(
    `${
      index + 1
    }. ${user.user_id}: ${user.event_count} events, ${user.session_count} sessions`,
  );
});

console.log("\n🛒 Top Purchasers:");
const topPurchasers = analytics.getTopUsers("purchase", 3);
topPurchasers.forEach((user, index) => {
  console.log(`${index + 1}. ${user.user_id}: ${user.event_count} purchases`);
});

console.log("\n📈 User1 Activity:");
const user1Activity = analytics.getUserActivity("user1");
user1Activity.forEach((activity) => {
  console.log(`${activity.event_type}: ${activity.count} times`);
});

analytics.close();
```

These examples demonstrate the power and flexibility of Andromeda's SQLite
integration for building data-driven applications.
