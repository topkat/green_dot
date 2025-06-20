---
title: green_dot API Services
description: Learn how to create and use API services in your Green Dot application.
---

To create a new API Service:
1. Run `npx green_dot generate`
2. Select "API Service"
3. Follow the prompts

## Basic example

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
    async main(ctx, { userId, data }) {
        // Your service logic here
        return {
            success: true,
            message: 'User updated successfully',
            user: await ctx.db.user.getOne({ email }) // this db call will automatically apply mask and filter depending on user perm (see dao doc)
        }
    }
})
```

## Extended options

```ts
import { svc, _ } from 'green_dot'

export const myService = svc({
    ...
    // You can customize the generated route, by default it's all POST and the 
    // route name is based on the variable name (myService => '/my-service')
    route: ['GET', '/users'],
    // alternative route
    aliasRoute: '/users/alternative',
  
    // Rate limiting
    rateLimiter: '5/min',
    // you can set different configs for a certain env (here env === 'test')
    rateLimiter: { default:'5/min', test: '100/min' },
    
    // Access control
    for: ['admin', { role: 'appUser', hasEmailValidated: true }],
    notFor: ['guest'],
    
    // Cache management, when using this, the frontend cache will invalidate for 
    // the configured queries
    invalidateCacheFor: ['user*', 'profile*'],
    
    // Environment control: this service will only be exposed in configured envs
    forEnv: ['test'],
    
    // Input validation control. This can be useful if you want to avoid triggering an error if the body may be malformed or uncomplete
    doNotValidate: false,

    // allow only those IPs to access the service, all other requests will take a 403 permission error
    ipWhitelist: ['127.9.9.1']

    // will not be generated in SDK, you can still access the route via SDK (Eg: ($ as any).myService()) but it will appear nowhere in the SDK code
    maskInSdk: true

    // Plugin specific routes
    // Require 2FA authentication (headers with `_2FA` field set) [needs doubleAuthentication plugin](./plugins/double-authentication)
    needs2FA: true,
    needsFingerprintOrPincode: true, // see above
    ...
})
```


## Service Context (ctx)

See [ctx documentation](./ctx.md)


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

