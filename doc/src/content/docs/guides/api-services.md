---
title: API Services Guide
description: Learn how to create and use API services in your Green Dot application.
---

Create a new API service like so:

```bash
npx green_dot generate
```

Then select `> API service`

## Creating API Services

Basic example:

```ts
import { svc, _ } from 'green_dot'

export const myService = svc({
    doc: {
        description: 'Description of what this service does',
        errors: [
            // documentation of thrown errors (will appear on hover in SDK in frontend and be generated in swagger doc)
            [404, 'notFound', 'When the requested resource is not found'],
            [403, 'forbidden', 'When the user does not have permission']
        ]
    },
    for: [
      // Who can access this service
      'admin', 
      { role: 'appUser', hasEmailValidated: true }
    ]
    input: {
        // here are the validation syntax for your input data
        userId: _.string().required(),
        data: _.object({
            name: _.string(),
            age: _.number()
        })
    },
    output: _.object({
        success: _.boolean(),
        message: _.string(),
        user: _.model('myDb', 'user')
    }),
    route: ['POST', '/users'], // HTTP method and route
    rateLimiter: '5/min', // Rate limiting
    async main(ctx, { userId, data }) {
        // Your service logic here
        return {
            success: true,
            message: 'User updated successfully',
            user: await db.user.getOne(ctx, { email }) // this db call will automatically apply mask and filter depending on user perm (see dao doc)
        }
    }
})
```

## Service Configuration Options

### Basic Options

- `doc`: Documentation for the service
  - `description`: Service description
  - `errors`: Array of possible error responses `[statusCode, errorCode, description]`
- `for`: Array of roles that can access this service
- `notFor`: Array of roles that cannot access this service
- `route`: HTTP route configuration
  - String: Just the route path
  - Array: `[method, path]` (e.g., `['GET', '/users']`)
- `method`: HTTP method (GET, POST, PUT, DELETE, PATCH)
- `aliasRoute`: Alternative route for the same service

### Input/Output Validation

- `input`: Input validation schema using good-cop validators
  - Object schema: `{ field: _.type() }`
  - Array of types: `[_.type1(), _.type2()]`
  - Single type: `_.type()`
- `output`: Output validation schema
- `doNotValidate`: Skip input validation (default: false). This can be useful if you want to avoid triggering an error if the body may be malformed or uncomplete

### Security

- `rateLimiter`: Rate limiting configuration
  - String: `'5/min'`, `'100/hour'`, etc.
  - Object: `{ default: '5/min', test: 'disable' }` for setting a different config depending on `env`
- `ipWhitelist`: Array of allowed IP addresses (all other IPs will be blocked)
- `needs2FA`: Require 2FA authentication (headers with `_2FA` field set) [needs doubleAuthentication plugin](../plugins/double-authentication)
- `needsFingerprintOrPincode`: Require biometric or PIN code authentication (headers with `biometricAuthToken` field set) [needs doubleAuthentication plugin](../plugins/double-authentication)

### Cache Management

- `invalidateCacheFor`: Array of cache patterns to invalidate
  - Example: `['user*']` to invalidate all user-related caches

### Environment Control

- `forEnv`: Environment where the service should run
  - String: Single environment
  - Array: Multiple environments

## Service Context (ctx)

See [ctx documentation](./ctx.md)

## Best Practices

1. Always provide clear documentation
2. Use appropriate rate limiting
3. Implement proper error handling
4. Validate all inputs and outputs
5. Use TypeScript for better type safety
6. Follow RESTful conventions for routes
7. Implement proper security measures
8. Use cache invalidation when modifying data

## Example Use Cases

### User Management
```ts
export const createUser = svc({
    doc: {
        description: 'Create a new user account',
        errors: [
            [409, 'emailExists', 'Email already registered'],
            [400, 'invalidInput', 'Invalid input data']
        ]
    },
    for: ['admin'],
    input: {
        email: _.email().required(),
        password: _.password().required(),
        role: _.enum(['user', 'admin']).required()
    },
    output: _.object({
        userId: _.string(),
        email: _.email()
    }),
    route: ['POST', '/users'],
    rateLimiter: '10/min',
    async main(ctx, { email, password, role }) {
        // Implementation
    }
})
```

### Data Retrieval
```ts
export const getUserProfile = svc({
    doc: {
        description: 'Get user profile information'
    },
    for: ['user', 'admin'],
    input: {
        userId: _.string().required()
    },
    output: _.object({
        name: _.string(),
        email: _.email(),
        preferences: _.object({
            theme: _.string(),
            notifications: _.boolean()
        })
    }),
    route: ['GET', '/users/:userId/profile'],
    async main(ctx, { userId }) {
        // Implementation
    }
})
```