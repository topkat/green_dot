---
title: green_dot Models and DAOs
description: Learn how to define and secure your data models with Green Dot's type-safe model and DAO system.
---


Green Dot provides a powerful type-safe system for defining data models and securing their access through Data Access Objects (DAOs). This guide will show you how to create and configure models and DAOs for your application.



To create a new model and DAO:
1. Run `npx green_dot generate`
2. Select "Database Model"
3. Follow the prompts to name your model

This will generate two files:
- `myModel.model.ts`: Contains your model definition
- `myModel.dao.ts`: Contains security and access configuration

## Model Definition

Models are defined using the `_.mongoModel()` function, which provides type safety and validation.

```ts title='myModel.model.ts'
import { _ } from 'green_dot'

export const userModel = _.mongoModel(
  // Automatic timestamp fields
  ['creationDate', 'updateDate'], 
  {
    // Basic fields
    name: _.string().required(),
    email: _.email().required().unique(),
    
    // References to other models
    company: _.ref('company').required(),
    
    // Nested objects
    address: {
      street: _.string().required(),
      zipCode: _.string().required(),
      city: _.string().required(),
      country: _.string().required(),
    },
    
    // Arrays
    roles: [_.string()], // OR _.array(_.string()).minLength(2) for example
    
    // Complex fields
    settings: _.object({
      notifications: _.boolean().default(true),
      theme: _.string().enum(['light', 'dark']).default('light')
    })
  }
)

// Type exports
export type UserModel = InferType<typeof userModel>
export type UserModelWrite = InferTypeWrite<typeof userModel>
```

### Available Field Types and modifiers

Please use intellisense to find out all the possibilities, the original lib for validation is [good-cop](https://github.com/topkat/good-cop)


## DAO Configuration

DAOs (Data Access Objects) define how your model can be accessed and what security rules apply.

```ts title='myModel.dao.ts'
export const dao = {
  type: 'mongo',
  
  // Expose methods to specific roles via API and SDK
  expose: [
    { 
      for: [{ role: 'user', hasEmailValidated: false }],
      expose: [] // that user will take a permission error if reaching those services
    },
    {
      for: ['user'],
      expose: [
        'getOne', // using the userAppSDK I can now use $.myModel.getOne() in frontend
        'update' // as well as $.myModel.update()
      ]
    }, {
      for: 'admin',
      expose: ['ALL'], // the admin SDK will be generate with all user routes ($.userGetById, $.userDelete, $.userCreate...)
    }
  ],
  
  // Filter data based on user context
  filter: [{
    on: ['read', 'write'],
    for: 'ALL', // or can be perm specific
    filter: (ctx, filter) => {
      if (ctx.role === 'admin') return
      filter.userId = ctx._id
    }
  }],
  
  // Mask sensitive fields
  mask: [{
    on: ['read'],
    mask: () => ({
      password: true,
      secretKey: true
    })
  }, {
    on: ['read'],
    notFor: 'admin',
    mask: () => ({
      internalNotes: true
    })
  }],
  
  // Auto-populate references
  populate: [
    'company',
    { path: 'createdBy', populate: { path: 'company' } }, // you can use mongoose populate syntax here
  ]
} satisfies MongoDao<UserModel>

export default dao
```

#### Permission bricks

As you have seen above, permission bricks can be configured with `on`, `for`, `notOn` and `notFor`.

- `on`: CRUD operation to apply security rule to (Can be `'read'`, `'write'`, `'create'`, etc.)
- `for`: Role and permission to apply rule to (Can be formatted like `'ALL'`, `'myRole'` or `{ role: 'user', hasEmailValidated: true }`)

You can mix and match permissions bricks. At runtime, they will be merged so that the strictest rule always apply.  

So for example if two rules applies:
* mask: `{ password: true }` and select `{ password: true }`
  * This will mask all fields (`select` implies that not selected fields are masked)
* mask: `{ password: true }` and mask `{ apiKey: true }`
  * This will mask both `apiKey` and `password` fields

### DAO Security Settings

#### Expose  

Controls which operations are available to which roles:
- `getOne`: Get a single document
- `getAll`: Get multiple documents
- `create`: Create new documents
- `update`: Update existing documents
- `delete`: Delete documents
- `count`: Count documents
- As well as `getLastN`, `getFirstN`, `updateMany`, `upsert`, `updateWithFilter`, `deleteWithFilter`

#### Filter

> Tips: type `gd_dao:filter` to expand snippet template in your IDE

Filter output data
* Use a function to modify existing filter
* OR use a filter object that is going to be merged with actual filter with precedence

Eg: the user can only modify it's own user
```ts title='myModel.dao.ts'
...
    filter: [{
        on: 'ALL',
        filter: (ctx, filter) => {
            if (ctx.role === 'admin' && ctx.method === 'getAll') return
            else filter._id = ctx._id
        }
    }]
...
```

#### Mask
Hides sensitive fields based on user role and operation:

```ts title='myModel.dao.ts'
mask: [
    {
      for: 'admin',
      on: 'write',
      select: ctx => ({
        // SELECT so admin acn only write `adminFields` field
        adminFields: true
      }),
    },
    {
      for: 'ALL',
      on: 'ALL',
      mask: () => ({
        // this is masked for all in all situations
        password: true
      }),
    },
],
```

#### MongoDb Indexes (🚧 Coming Soon 🚧)

It is possible to create mongoDb indexes directly from dao config

```ts title='myModel.dao.ts'
const dao = {
  modelConfig: { indexes: ['myField'] },
}
```

#### Populate

Automatically populates referenced fields when fetching documents

```ts title='myModel.dao.ts'
const dao = {
  populate: [
    'company',
    { path: 'createdBy', populate: { path: 'company' } }, // you can use mongoose populate syntax here
  ]
}
```