---
title: Models and DAOs
description: Learn how to define and secure your data models with Green Dot's type-safe model and DAO system.
---

# Models and DAOs

Green Dot provides a powerful type-safe system for defining data models and securing their access through Data Access Objects (DAOs). This guide will show you how to create and configure models and DAOs for your application.

## Creating Models and DAOs

To create a new model and DAO:
1. Run `npx green_dot generate`
2. Select "Database Model"
3. Follow the prompts to name your model

This will generate two files:
- `myModel.model.ts`: Contains your model definition
- `myModel.dao.ts`: Contains security and access configuration

## Model Definition

Models are defined using the `_.mongoModel()` function, which provides type safety and validation.

```ts
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
    roles: _.array(_.string()),
    
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

### Available Field Types

- `_.string()`: String field
- `_.number()`: Number field
- `_.boolean()`: Boolean field
- `_.date()`: Date field
- `_.email()`: Email field with validation
- `_.ref(modelName)`: Reference to another model
- `_.array(type)`: Array of specified type
- `_.object(schema)`: Nested object with schema
- `_.enum(values)`: Enum field with specific values

### Field Modifiers

- `.required()`: Field is required
- `.unique()`: Field must be unique
- `.default(value)`: Default value if not provided
- `.min(value)`: Minimum value/number of items
- `.max(value)`: Maximum value/number of items

## DAO Configuration

DAOs (Data Access Objects) define how your model can be accessed and what security rules apply.

```ts
export const dao = {
  type: 'mongo',
  
  // Expose methods to specific roles
  expose: [{
    for: ['user', 'admin'],
    expose: ['getOne', 'update'],
  }, {
    for: 'admin',
    expose: ['getAll', 'create', 'delete'],
  }],
  
  // Filter data based on user context
  filter: [{
    on: ['read', 'write'],
    for: 'ALL',
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
    'createdBy'
  ]
} satisfies MongoDao<UserModel>

export default dao
```

### DAO Configuration Options

#### Expose
Controls which operations are available to which roles:
- `getOne`: Get a single document
- `getAll`: Get multiple documents
- `create`: Create new documents
- `update`: Update existing documents
- `delete`: Delete documents
- `count`: Count documents
- `aggregate`: Run aggregation pipelines

#### Filter
Adds security filters to queries based on user context:
- `on`: Operations to apply filter to (`read`, `write`, `create`, etc.)
- `for`: Roles to apply filter to (`ALL` or specific roles)
- `filter`: Function that modifies the query filter

#### Mask
Hides sensitive fields based on user role and operation:
- `on`: Operations to apply mask to
- `for`/`notFor`: Roles to apply/not apply mask to
- `mask`: Function that returns fields to hide

#### Populate
Automatically populates referenced fields when fetching documents.

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