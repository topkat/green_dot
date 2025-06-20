---
title: Error Handling
description: Learn how to create and manage custom errors in your Green Dot application.
---

Green Dot provides a powerful error handling system that allows you to create custom errors and use them consistently throughout your application. This guide will show you how to create and use custom errors effectively.

## Creating Custom Errors

To create a new error file:

1. Run `npx green_dot generate`
2. Select "Error File"
3. Choose a name for your error file (e.g., `userErrors`)



## Error File Structure

Here's an example of how to structure your error file:

```ts title='app/myApp/user/user.error.ts'
import { registerErrors } from 'green_dot'

export default registerErrors({
    wrongReferralCode: { code: 403 },
    anyCustomError: { code: 500, anyContextualInfo: 'anyValue' },
})
```

Thanks to this, you can now do:

```ts
throw ctx.error.anyCustomError({ anyContextualData: 'val' })
// OR
import { error } from 'green_dot'
throw error.anyCustomError({ anyContextualData: 'val' })
```

## Error Context Informations

The good practice here is to always pass any useful information to the error so it's always easier to debug. Things like companyName, transactionId, reason or attemptedAt may be passed to an error to better track where the problem may be and what is its side effects.

* ⚠️ Be carefull not to pass sensitive data, since those data can be returned to frontend
* Always pass `code` to an error with HTTP error code good practice


## Best Practices


1. **Add Helpful Data**
```ts
throw ctx.error.anyCustomError({
    userId: ctx.userId,
    attemptedAt: new Date(),
    reason: ctx.reason
})
```

2. **Don't Expose Sensitive Information**
```ts
// ❌ Avoid
throw ctx.error.anyCustomError({ message: `Database error: ${internalError}` })

// ✅ Good
throw ctx.error.anyCustomError({ message: 'An error occurred while processing your request', modelName: ctx.modelName, method: ctx.method })
```

3. **Use Appropriate Status Codes**
```ts
code: 404  // Not Found
code: 403  // Forbidden
code: 400  // Bad Request
code: 500  // Server Error
```