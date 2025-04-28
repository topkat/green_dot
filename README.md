# 🟢 green_dot

A powerful TypeScript nodeJs framework for building DX friendly, secure and type-safe backend services with MongoDB integration

[![GitHub Repository](https://img.shields.io/badge/GitHub-Repository-blue)](https://github.com/top-kat/green_dot)

## Features

🧭 Back/Front Type-safe API route declarations  
📐 Secure model definitions with validation and routes exposed automatically via configuration  
🪪 Built-in security and access control  
🗃️ MongoDB integration with type safety (others database drivers to come)  
👨‍💻 DX and intellisense friendly  
🏗️ Generate a SDK to use in frontend (Eg: `$.myApiRoute()`)  
⚡  Fully cached in frontend via TanStack Query  

## Installation

```bash
npm install green_dot
# yarn
yarn add green_dot
```

## Create project or files

```bash
npx green_dot generate
```

=> Follow the prompt to configure your project. Run the same command again to generate database models, api routes, schedules...

## API Service example

* run `npx green_dot generate` and select `> Api Service`

```typescript
export const checkUserExists = svc({
    // Access level
    for: ['customRole', { role; 'user', hasValidatedEmail: true }],
    // Type-safe input validation
    input: {
        email: _.email().required(),
        user: _.model('myDbName', 'user'), // ref to app models
    },
    // Type-safe output
    output: _.boolean(),
    // optinal security features
    rateLimiter: '10/min',
    ...
    async main(ctx, { email }) {
        const nbUsers = await db.user.count(ctx.GM, { email })
        return !!nbUsers
    },
})
```

### Api Service Features

- Everything is typed / Autocomplete friendly
- Nothing else to do, route is declared automatically based on the name of the exported constant
- Fine tuning on security features (roles, permissions...)
- Route will be available in frontend via the generated SDK (`const userExists = $.checkUserExists() // type boolean`)
- A Swagger documentation will be generated for the route
  
See documentation (will come soon) for more details.

## Model and DB Security

To create an api service:
* run `npx green_dot generate` and select `> Database Model`
* this will generate `./myModel.model.ts` and `./myModel.dao.ts` files for declaring model and DAO (data access object, a security configuration for your model)

### Models

```typescript
const model = _.mongoModel(
  // Automatic timestamp fields
  ['creationDate', 'updateDate'], 
  {
      name: _.string().required(),
      admin: _.ref('user').required(),
      companyIdenfier: _.string().required().unique(),
      address: {
          street: _.string().required(),
          zipCode: _.string().required(),
          city: _.string().required(),
          country: _.string().required(),
      },
})
```

### DAO (Data Access Object)

Configure data access with security and type safety:

```typescript
// user.dao.ts
const dao = {
    type: 'mongo',
    // The expose config will automatically create routes for given
    // permissions and config
    expose: [{
        // Here user and admin both can update or getOne for your model
        for: ['user', 'admin'],
        expose: ['getOne', 'update'],
    }, {
        // Here only admin can getAll
        for: ['admin'],
        expose: ['getAll'],
    }],
    // Filter is another powerful security feature, it allow to add filter
    // depending on the connected user
    filter: [{
        on: ['read', 'write'], // for all methods
        for: 'ALL', // for all perms
        filter: (ctx, filter) => {
            if (ctx.role === 'admin') return
            // if !admin we constrain the filter to be the userId
            // so we make sure the user can only acess his own user!
            else filter._id = ctx._id
        }
    }],
    // Mask allow to mask fields of a model depending on user permissions 
    // and methods (read, update, create...)
    mask: [{
        on: ['read'],
        // for everyone, we mask password field on read
        mask: () => ({
            password: true,
        }),
    }, {
        // only admin can see user.stats
        on: ['read'],
        notFor: 'admin',
        mask: () => ({
            stats: true
        }),
    }],
    populate: [
        // we can always populate a field if needed
        'company',
    ],
}
```


## Contributing

Contributions are welcome! 
- For bug reports and feature requests, please open an issue at [GitHub Issues](https://github.com/top-kat/green_dot/issues)
- For code contributions, please submit a Pull Request at [GitHub Pull Requests](https://github.com/top-kat/green_dot/pulls)
- Visit our [GitHub Repository](https://github.com/top-kat/green_dot) for more information

## License

[MIT License](LICENSE)
