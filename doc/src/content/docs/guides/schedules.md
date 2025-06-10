---
title: Scheduled Tasks Guide
description: Learn how to create and manage scheduled tasks in your Green Dot application.
---

To create a new Schedule:
1. Run `npx green_dot generate`
2. Select "Schedule"
3. Follow the prompts

## Creating Scheduled Tasks

Scheduled tasks are created using the `schedule()` function. Here's a basic example:

```ts
import { schedule, db } from 'green_dot'

export const mySchedule = schedule({
    schedule: {
        frequency: '0 * * * *', // Every hour
        frequencyDevEnv: 'never', // Disable in development
    },
    async main(ctx) {
        // Your scheduled task logic here
        const users = await db.user.getAll(ctx.GM)
        // Process users...
    }
})
```

## Schedule Configuration

### Frequency Options

The `schedule` property accepts either a string or an object with the following options:

```ts
schedule: {
    frequency: '0 * * * *',      // Main frequency (CRON format)
    frequencyTestEnv?: string,   // Optional frequency for test environment
    frequencyDevEnv?: string     // Optional frequency for development environment
}
```

### Frequency Values

- `'server.start'`: Run once when the server starts
- `'never'`: Disable the schedule
- CRON expressions:
  - `'* * * * *'`: Every minute
  - `'0 * * * *'`: Every hour
  - `'0 */12 * * *'`: Twice a day
  - `'0 5 * * *'`: Once a day at 05:00
  - `'0 5 1 * *'`: At 05:00 on day-of-month 1

### Environment-Specific Frequencies

You can configure different frequencies for different environments:

```ts
schedule: {
    frequency: '0 5 * * *',      // Production: Daily at 5 AM
    frequencyDevEnv: 'never',    // Development: Disabled
    frequencyTestEnv: '* * * * *' // Testing: Every minute
}
```

## Schedule Context (ctx)

The `main` function receives a system context (`ctx`) with **full privileges**:

```ts
async main(ctx) {
    // ctx is a system context (ctx.GM)
    // You have full access to all databases and operations
    const users = await ctx.db.user.getAll(ctx)
    // Process data...
}
```

See [ctx documentation](./ctx.md)

## Best Practices

1. Use appropriate frequencies for different environments
2. Avoid using `'* * * * *'` in production
3. Handle errors properly in scheduled tasks
4. Log important operations and errors
5. Consider timezone implications
6. Use descriptive names for scheduled tasks
7. Document the purpose and frequency of each task

## Example Use Cases

### Data Cleanup
```ts
export const cleanupOldData = schedule({
    schedule: {
        frequency: '0 0 * * *', // Daily at midnight
        frequencyDevEnv: 'never'
    },
    async main(ctx) {
        const oldDate = new Date()
        oldDate.setDate(oldDate.getDate() - 30)
        
        await db.logs.deleteMany(ctx.GM, {
            createdAt: { $lt: oldDate }
        })
    }
})
```

### Report Generation
```ts
export const generateDailyReport = schedule({
    schedule: {
        frequency: '0 6 * * *', // Daily at 6 AM
        frequencyDevEnv: 'server.start'
    },
    async main(ctx) {
        const yesterday = new Date()
        yesterday.setDate(yesterday.getDate() - 1)
        
        const report = await db.orders.getAll(ctx.GM,  { createdAt: { $gte: yesterday } })
        
        // Send report...
    }
})
```


## Error Handling

Scheduled tasks should include proper error handling:

```ts
export const mySchedule = schedule({
    schedule: {
        frequency: '0 * * * *'
    },
    async main(ctx) {
        try {
            // Task logic
        } catch (error) {
            // Log error
            console.error('Schedule error:', error)
            // Notify administrators
            await notifyAdmins(error)
        }
    }
})
```

## Monitoring

You can monitor scheduled tasks through:

1. Application logs
2. Database audit trails
3. System monitoring tools
4. Custom monitoring solutions

## Security Considerations

1. Use system context (`ctx.GM`) for database operations
2. Implement proper error handling
3. Log sensitive operations
4. Use appropriate frequencies for different environments
5. Consider resource usage and impact 