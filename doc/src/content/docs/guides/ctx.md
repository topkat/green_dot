---
title: green_dot Context (ctx)
description: Learn about the context object and how to use it in your Green Dot application.
---

The context object (`ctx`) is a fundamental part of Green Dot that stores contextual information about a request. It's scoped to a request and is carried throughout the request's lifetime in the backend.

## Basic Usage

```ts
async main(ctx, input) {
    // User information
    ctx.user        // Current user object
    ctx.role        // User's role
    ctx.permissions // User's permissions
    
    // Database access
    ctx.db          // Database instance
    ctx.dbs.myDb    // Access specific database
    
    // Error handling
    ctx.error       // Error factory
    
    // Get full user object
    const user = await ctx.getUser()
    
    // Throw errors with context
    if(!user.isAdmin) throw ctx.error.myCustomError({ userId: user._id })
    
    // API information
    ctx.api         // Request information
}
```

## Context Properties

### User Information
- `_id`: User ID (or public/system ID for anonymous users)
- `role`: User's role (e.g., 'admin', 'user', 'public')
- `permissions`: User's permissions object (`{ isAdmin, hasEmailValidated...}`)
- `authenticationMethod`: Array of authentication methods used. Eg: one or multiple of `['accessToken', '2FA', 'biometricAuthToken', 'pincode', 'apiKey']`
- `isPublic`: Boolean indicating if user is not logged in
- `isSystem`: Boolean indicating if context has system privileges
- `platform`: Platform identifier (e.g., 'web', 'mobile')

### Access and permissions
- `GM` (god mode) ctx.GM returns a system ctx with all privileges

### Database Access
- `db`: Default database instance
- `dbs`: Object containing all database instances
- `transactionSession`: MongoDB transaction session (if active)

### API Information
- `api.params`: Route parameters
- `api.body`: Request body
- `api.query`: Query parameters
- `api.originalUrl`: Original request URL
- `api.ipAdress`: Client IP address
- `api.req`: Express request object
- `api.res`: Express response object
- `api.outputType`: Response output type configuration

### Environment
- `env`: Current environment (dev, prod, preprod)
- `debugMode`: Debug mode flag

## Context Methods

### User Management
```ts
// Get full user object (cached)
const user = await ctx.getUser({
    refreshCache: false,  // Whether to bypass cache
    errorIfNotSet: true   // Whether to throw error if user not found
})

// Clear user cache
ctx.clearUserCache()

// Check if user is anonymous (login via apiKey for example or public)
const isAnonymous = ctx.isAnonymousUser()
```

### Role Management
```ts
// Check if user has specific role
const isAdmin = ctx.hasRole('admin')

// Use different role
ctx.useRole('admin', {
    // Additional permissions
    canManageUsers: true
})

// Create context from user
ctx.fromUser('admin', userObject)
```


### Error Handling
```ts
// Throw errors with context
throw ctx.error.notFound({ resource: 'user' })
throw ctx.error.forbidden({ action: 'delete' })
throw ctx.error.myCustomError(anyHelpfulContextualInformations)
```

[See error handling doc for how to create custom errors](./error-handling.md)

**NOTE**: Be carreful when sending extra infos in errors because those information may leak in frontend

### Context Cloning
```ts
// Clone context with modifications
const newCtx = ctx.clone({
    role: 'admin',
    permissions: { canManageUsers: true }
})
```

## Security Features

### User Banning and warning
```ts
// add user warning. At some configured number of warnings, 
// user will automatcally be banned for a configured period of time
// (gd.app.config.ts)
await ctx.addWarning()
// Ban user for a configured period of time (gd.app.config.ts)
await ctx.banUser()
```

### Authentication Methods
```ts
// This array will be filled with request authentication that have succeeded
const methods = ctx.authenticationMethod // ['accessToken', '2FA', 'biometricAuthToken', 'pincode', 'apiKey']
```

## Example Use Cases

### Role-Based Access Control
```ts
async function deleteUser(ctx, userId) {
    if (!ctx.hasRole('admin')) {
        throw ctx.error.forbidden({ action: 'delete_user' })
    }
    // Delete user logic
}
```

### User Management
```ts
async function updateUserProfile(ctx, data) {
    const user = await ctx.getUser()
    if (user._id !== data.userId && !ctx.hasRole('admin')) {
        throw ctx.error.forbidden({ action: 'update_other_user' })
    }
    // Update user logic
}
```