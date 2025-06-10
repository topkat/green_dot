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

### DAO Configuration Options

#### Permission bricks

Permission bricks have always `on`, `for`, `notOn` and `notFor`.

- `on`: Operations to apply filter to (`read`, `write`, `create`, etc.)
- `for`: Roles to apply filter to (`ALL` or specific roles)

You can mix and match permissions bricks, at runtime, they will be merged so that the strictest will always apply.  
So for example if two rules applies:
* mask: `{ password: true }` and select `{ password: true }`
  * Will mask all fields (`select` implies that not selected fields are masked)
* mask: `{ password: true }` and mask `{ apiKey: true }`
  * Will mask both `apiKey` and `password` fields

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
Automatically populates referenced fields when fetching documents (see example above)

## Best Practices

1. **Type Safety**
   - Always export model types using `InferType` and `InferTypeWrite`
   - Use type-safe field definitions
   - Leverage TypeScript's type checking

2. **Security**
   - Always define appropriate filters for data access
   - Mask sensitive fields appropriately
   - Use role-based access control
   - Validate input data

3. **Performance**
   - Use appropriate indexes for unique fields
   - Be selective with field population
   - Use efficient query patterns

4. **Maintenance**
   - Keep models focused and single-purpose
   - Document complex field relationships
   - Use clear, descriptive field names
   - Add comments for complex validation rules

## Example Use Cases

### User Management
```ts
export const userModel = _.mongoModel(
  ['creationDate', 'updateDate'],
  {
    email: _.email().required().unique(),
    password: _.string().required(),
    role: _.string().enum(['user', 'admin']).default('user'),
    profile: {
      name: _.string().required(),
      avatar: _.string(),
      preferences: _.object({
        theme: _.string().enum(['light', 'dark']).default('light'),
        notifications: _.boolean().default(true)
      })
    }
  }
)
```

### E-commerce Product
```ts
export const productModel = _.mongoModel(
  ['creationDate', 'updateDate'],
  {
    name: _.string().required(),
    sku: _.string().required().unique(),
    price: _.number().required().min(0),
    stock: _.number().required().min(0),
    categories: _.array(_.ref('category')),
    attributes: _.object({
      color: _.string(),
      size: _.string(),
      weight: _.number()
    })
  }
)
```

## Common Patterns

### Soft Delete
```ts
export const softDeleteModel = _.mongoModel(
  ['creationDate', 'updateDate'],
  {
    // ... other fields ...
    isDeleted: _.boolean().default(false),
    deletedAt: _.date()
  }
)
```

### Version Control
```ts
export const versionedModel = _.mongoModel(
  ['creationDate', 'updateDate'],
  {
    // ... other fields ...
    version: _.number().default(1),
    previousVersions: _.array(_.object({
      version: _.number(),
      data: _.object({/* ... */}),
      changedAt: _.date()
    }))
  }
)
```

## Error Handling

Models and DAOs handle errors in the following ways:

1. **Validation Errors**
   - Thrown when required fields are missing
   - Thrown when field validation fails
   - Include detailed error messages

2. **Access Control Errors**
   - Thrown when user lacks permission
   - Thrown when filter conditions aren't met
   - Include role and operation information

3. **Database Errors**
   - Thrown when unique constraints are violated
   - Thrown when references are invalid
   - Include database error details 