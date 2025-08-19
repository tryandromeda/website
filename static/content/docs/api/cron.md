---
title: "Cron API"
description: "Schedule and manage recurring tasks with Andromeda's cron functionality"
section: "API Reference"
order: 14
id: "cron-api"
---

The Cron API provides functionality for scheduling and managing recurring tasks
in Andromeda. It allows you to execute functions at specified intervals using
familiar cron syntax.

## Overview

The Andromeda Cron API enables you to:

- Schedule tasks using standard cron expressions
- Execute functions at specific times or intervals
- Manage scheduled jobs (start, stop, list)
- Handle async/await patterns in scheduled tasks

## Basic Usage

### Scheduling a Task

```typescript
// Schedule a task to run every minute
const job = Andromeda.cron("* * * * *", () => {
  console.log("Task executed at:", new Date().toISOString());
});

// Schedule a task to run every day at 2:30 AM
const dailyJob = Andromeda.cron("30 2 * * *", async () => {
  console.log("Running daily maintenance...");
  await performMaintenanceTasks();
});
```

### Cron Expression Format

Cron expressions use the standard format:

```text
* * * * *
┬ ┬ ┬ ┬ ┬
│ │ │ │ │
│ │ │ │ └─── day of week (0 - 6) (Sunday to Saturday)
│ │ │ └───── month (1 - 12)
│ │ └─────── day of month (1 - 31)
│ └───────── hour (0 - 23)
└─────────── minute (0 - 59)
```

## API Reference

### `Andromeda.cron(expression, callback)`

Schedules a recurring task using a cron expression.

**Parameters:**

- `expression` (string): Cron expression defining when to run the task
- `callback` (function): Function to execute on schedule

**Returns:**

- `CronJob`: A job object for managing the scheduled task

**Example:**

```typescript
const job = Andromeda.cron("0 */2 * * *", () => {
  console.log("Runs every 2 hours");
});
```

### CronJob Methods

#### `start()`

Starts or resumes the scheduled job.

```typescript
const job = Andromeda.cron("0 9 * * 1-5", workdayTask);
job.start();
```

#### `stop()`

Stops the scheduled job.

```typescript
job.stop();
console.log("Job stopped");
```

#### `isRunning()`

Returns whether the job is currently active.

**Returns:**

- `boolean`: True if the job is running, false otherwise

```typescript
if (job.isRunning()) {
  console.log("Job is active");
} else {
  console.log("Job is stopped");
}
```

#### `getNextRun()`

Gets the next scheduled execution time.

**Returns:**

- `Date`: The next execution time

```typescript
const nextRun = job.getNextRun();
console.log("Next execution:", nextRun.toISOString());
```

## Common Cron Expressions

| Expression     | Description              |
| -------------- | ------------------------ |
| `* * * * *`    | Every minute             |
| `0 * * * *`    | Every hour               |
| `0 0 * * *`    | Every day at midnight    |
| `0 0 * * 1`    | Every Monday at midnight |
| `0 9 * * 1-5`  | Weekdays at 9 AM         |
| `0 0 1 * *`    | First day of every month |
| `0 0 1 1 *`    | January 1st every year   |
| `*/15 * * * *` | Every 15 minutes         |
| `0 */6 * * *`  | Every 6 hours            |

## Examples

### Data Backup Task

```typescript
// Backup data every day at 3 AM
const backupJob = Andromeda.cron("0 3 * * *", async () => {
  console.log("Starting daily backup...");

  try {
    // Read application data
    const data = await Andromeda.readTextFile("data.json");

    // Create backup filename with timestamp
    const timestamp = new Date().toISOString().slice(0, 10);
    const backupFile = `backup-${timestamp}.json`;

    // Write backup
    await Andromeda.writeTextFile(backupFile, data);
    console.log(`Backup created: ${backupFile}`);
  } catch (error) {
    console.error("Backup failed:", error);
  }
});
```

### System Health Check

```typescript
// Check system health every 5 minutes
const healthCheckJob = Andromeda.cron("*/5 * * * *", async () => {
  const startTime = performance.now();

  try {
    // Check memory usage
    const memoryInfo = process.memoryUsage();

    // Check if critical files exist
    const configExists = await Andromeda.exists("config.json");

    const health = {
      timestamp: new Date().toISOString(),
      memory: memoryInfo,
      configFile: configExists,
      responseTime: performance.now() - startTime,
    };

    console.log("Health check:", health);

    // Save health log
    await Andromeda.writeTextFile(
      "health.log",
      JSON.stringify(health) + "\n",
      { append: true },
    );
  } catch (error) {
    console.error("Health check failed:", error);
  }
});
```

### Cleanup Old Files

```typescript
// Clean up temporary files every Sunday at midnight
const cleanupJob = Andromeda.cron("0 0 * * 0", async () => {
  console.log("Starting weekly cleanup...");

  try {
    const tempDir = "./temp";
    const files = await Andromeda.readDir(tempDir);
    const oneWeekAgo = Date.now() - (7 * 24 * 60 * 60 * 1000);

    for (const file of files) {
      const filePath = `${tempDir}/${file}`;
      const stats = await Andromeda.stat(filePath);

      if (stats.mtime < oneWeekAgo) {
        await Andromeda.remove(filePath);
        console.log(`Deleted old file: ${file}`);
      }
    }
  } catch (error) {
    console.error("Cleanup failed:", error);
  }
});
```

### API Data Synchronization

```typescript
// Sync data with external API every 30 minutes
const syncJob = Andromeda.cron("*/30 * * * *", async () => {
  console.log("Starting data sync...");

  try {
    // Fetch latest data from API
    const response = await fetch("https://api.example.com/data");
    if (!response.ok) {
      throw new Error(`API request failed: ${response.status}`);
    }

    const apiData = await response.json();

    // Update local data file
    await Andromeda.writeTextFile(
      "api-data.json",
      JSON.stringify(apiData, null, 2),
    );

    console.log(`Synced ${apiData.length} records`);
  } catch (error) {
    console.error("Sync failed:", error);
  }
});
```

## Managing Multiple Jobs

```typescript
// Store jobs for management
const jobs = new Map<string, CronJob>();

// Create multiple scheduled tasks
jobs.set("backup", Andromeda.cron("0 3 * * *", backupTask));
jobs.set("health", Andromeda.cron("*/5 * * * *", healthCheck));
jobs.set("sync", Andromeda.cron("*/30 * * * *", syncData));

// Start all jobs
for (const [name, job] of jobs) {
  job.start();
  console.log(`Started job: ${name}`);
}

// Stop all jobs on shutdown
process.on("SIGINT", () => {
  console.log("Stopping all cron jobs...");
  for (const [name, job] of jobs) {
    job.stop();
    console.log(`Stopped job: ${name}`);
  }
  process.exit(0);
});
```

## Error Handling

```typescript
const job = Andromeda.cron("* * * * *", async () => {
  try {
    await riskyOperation();
  } catch (error) {
    console.error("Scheduled task failed:", error);

    // Log error to file
    const errorLog = {
      timestamp: new Date().toISOString(),
      error: error.message,
      stack: error.stack,
    };

    await Andromeda.writeTextFile(
      "error.log",
      JSON.stringify(errorLog) + "\n",
      { append: true },
    );
  }
});
```

## Best Practices

### Resource Management

```typescript
// Always stop jobs when no longer needed
const job = Andromeda.cron("* * * * *", task);

// Stop job after certain conditions
setTimeout(() => {
  job.stop();
  console.log("Job stopped after timeout");
}, 60000);
```

### Async Task Handling

```typescript
// Use async/await for asynchronous operations
const job = Andromeda.cron("0 * * * *", async () => {
  try {
    await processData();
    await sendNotification();
  } catch (error) {
    console.error("Async task failed:", error);
  }
});
```

### Avoiding Overlapping Executions

```typescript
let isRunning = false;

const job = Andromeda.cron("*/5 * * * *", async () => {
  if (isRunning) {
    console.log("Previous task still running, skipping...");
    return;
  }

  isRunning = true;
  try {
    await longRunningTask();
  } finally {
    isRunning = false;
  }
});
```

## Notes

- Cron expressions use local system time
- Tasks run in the same thread as your main application
- Long-running tasks may block other scheduled jobs
- Always handle errors appropriately in scheduled tasks
- Consider timezone implications when scheduling tasks

## See Also

- **[Time API](/docs/api/time)** - Date and time utilities
- **[Performance API](/docs/api/performance)** - Performance monitoring
- **[File System API](/docs/api/file-system)** - File operations for scheduled
  tasks
