# 🟢 green_dot

A powerful TypeScript nodeJs framework for building DX friendly, secure and front-end / back-end type-safe backend services with MongoDB integration (other DBs coming soon) and SDK generation

[![GitHub Repository](https://img.shields.io/badge/GitHub-Repository-blue)](https://github.com/top-kat/green_dot)

## Features

🧭 Back/Front Type-safe API route declarations, shared models  
📐 Secure model definitions with validation and routes exposed automatically via configuration  
🪪 Built-in DX friendly security and access control  
🔌 Powerful plugin system with Managed Login, ApiKey Login, and Secure Authentication (2FA, biometric authentication and pinCode) (BETA)
🪄 File generation from templates to generate project, database, app, model...so you get up and running in no time
🗃️ MongoDB integration with type safety (others database drivers to come)  
👨‍💻 DX and intellisense friendly  
🏗️ Generate it's own SDK to use in frontend (Eg: `$.myApiRoute()`)  
⚡  Fully cached in frontend via TanStack Query  
📦 [VSCode / Cursor Plugin](https://marketplace.visualstudio.com/items?itemName=topkat.green-dot-vscode-module)

## Quick Start  

1. Generate a project with `npx green_dot generate` in a blank folder
2. Generate your first model with `npx green_dot generate` => and choose 'Model'
3. Configure model security in the .dao.ts generated file
4. Generate your first service (api route) with `npx green_dot generate` => and choose 'Service'


## IDE Integration  

1. Hover any green_dot props or function to see the documentation in your IDE
2. Type gd_ in any ts file to see all green_dot snippets to use to improve productivity
3. Install VSCode / Cursor extension from the IDE extension tab or by downloading it [here](https://marketplace.visualstudio.com/items?itemName=topkat.green-dot-vscode-module)

## File Structure

```bash
📁 app/
├── 📁 myDb1/                   
│   ├── 📁 models/              
│   │   ├── user.dao.ts         # Security config for the 'user' model
│   │   └── user.model.ts       # Data model definition for 'user'
│   └── ⚙️ gd.db.config.ts     # DB config file specific to this database
│
├── 📁 myApp1/                  
│   ├── 📁 _shared/             # Shared utilities and types across modules
│   │   └── mySharedFile.ts
│   ├── 📁 myModule/            # A custom module; structure is flexible
│   │   └── myModule.svc.ts     # API route definition for the module
│   ├── ⚙️ gd.apiTests.config.ts # Config file for automated API tests (BETA)
│   └── ⚙️ gd.app.config.ts      # App config file specific to this application
│
└── ⚙️ gd.config.ts              # Global config (all roles, permissions, etc.)
```

Note: you can create mutiple app and dbs with the `npx green_dot generate` command


<br/><br/><br/>
<br/><br/>

## Helpers

* `getMainConfig()` => get your main config where yuo set allRoles, allPermissions
* `getActiveAppConfig()`, `getActiveDbConfig()` => get respective actual db/app config

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
    // optional security features
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
