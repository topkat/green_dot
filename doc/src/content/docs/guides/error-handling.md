---
title: Error Handling Guide
description: Learn how to create and manage custom errors in your Green Dot application.
---

# Error Handling

Green Dot provides a powerful error handling system that allows you to create custom errors and use them consistently throughout your application. This guide will show you how to create and use custom errors effectively.

## Creating Custom Errors

To create a new error file:

1. Run `npx green_dot generate`
2. Select "Error File"
3. Choose a name for your error file (e.g., `userErrors`)

This will generate a new error file in your application's error directory.

## Error File Structure

Here's an example of how to structure your error file:

```ts title='app/myApp/errors/userErrors.ts'
import { _ } from 'green_dot'

export const userErrors = {
    // Basic error with message
    userNotFound: _.error({
        code: 'USER_NOT_FOUND',
        message: 'User not found',
        status: 404
    }),

    // Error with dynamic message
    invalidEmail: _.error({
        code: 'INVALID_EMAIL',
        message: (ctx) => `Invalid email format: ${ctx.email}`,
        status: 400
    }),

    // Error with additional context
    accountLocked: _.error({
        code: 'ACCOUNT_LOCKED',
        message: 'Account is locked',
        status: 403,
        // Additional data that will be included in the error response
        data: (ctx) => ({
            lockExpiresAt: ctx.lockExpiresAt,
            reason: ctx.lockReason
        })
    })
}
```

## Registering Errors

To use your custom errors, you need to register them in your application's error configuration:

```ts title='app/myApp/gd.app.config.ts'
import { userErrors } from './errors/userErrors'

export default {
    // ... other config
    errors: {
        // Register your error files
        userErrors,
        // You can register multiple error files
        // otherErrors,
    }
}
```

## Using Errors with Context

The context object (`ctx`) provides an error factory that makes it easy to throw errors with proper context:

```ts title='app/myApp/services/user.svc.ts'
export const getUserById = svc({
    for: ['user'],
    input: {
        userId: _.string().required()
    },
    async main(ctx, { userId }) {
        const user = await db.user.getOne(ctx, { _id: userId })
        
        if (!user) {
            throw ctx.error.userNotFound({ userId })
        }

        if (user.isLocked) {
            throw ctx.error.accountLocked({
                lockExpiresAt: user.lockExpiresAt,
                lockReason: user.lockReason
            })
        }

        return user
    }
})
```

## Error Properties

When creating custom errors, you can specify the following properties:

- `code`: Unique error code (string)
- `message`: Error message (string or function that returns string)
- `status`: HTTP status code (number)
- `data`: Additional error data (object or function that returns object)

## Best Practices

1. **Use Descriptive Error Codes**
   ```ts
   // Good
   code: 'USER_NOT_FOUND'
   
   // Avoid
   code: 'ERROR_1'
   ```

2. **Include Context in Messages**
   ```ts
   message: (ctx) => `User ${ctx.userId} not found`
   ```

3. **Use Appropriate Status Codes**
   ```ts
   status: 404  // Not Found
   status: 403  // Forbidden
   status: 400  // Bad Request
   ```

4. **Add Helpful Data**
   ```ts
   data: (ctx) => ({
       userId: ctx.userId,
       attemptedAt: new Date(),
       reason: ctx.reason
   })
   ```

5. **Keep Error Messages User-Friendly**
   ```ts
   // Good
   message: 'Your account has been locked due to multiple failed login attempts'
   
   // Avoid
   message: 'Account locked: too many failed attempts'
   ```

## Error Handling in Frontend

The generated SDK will automatically handle these errors and provide type-safe error handling:

```ts
try {
    const user = await $.getUserById({ userId: '123' })
} catch (error) {
    if (error.code === 'USER_NOT_FOUND') {
        // Handle user not found
    } else if (error.code === 'ACCOUNT_LOCKED') {
        // Handle locked account
        console.log(error.data.lockExpiresAt)
    }
}
```

## Security Considerations

1. **Don't Expose Sensitive Information**
   ```ts
   // Avoid
   message: (ctx) => `Database error: ${ctx.internalError}`
   
   // Good
   message: 'An error occurred while processing your request'
   ```

2. **Sanitize Error Data**
   ```ts
   data: (ctx) => ({
       // Only include necessary information
       userId: ctx.userId,
       // Don't include sensitive data
       // password: ctx.password
   })
   ```

3. **Use Appropriate Error Types**
   - Use 400-level errors for client issues
   - Use 500-level errors for server issues
   - Use 403 for permission issues
   - Use 404 for not found issues


