---
title: Using Database
description: Learn how to use a database Green Dot application
---


## Use DB with connected user permission

This is the main way to go if you return data to the frontend and you want all security features to apply (mask, filters...)

```ts twoslash
// @noErrors
import { db } from 'green_dot'

const sanitizedUser = await ctx.db.user.getOne()
// OR
const sanitizedUser = await db.user.getOne(ctx)
console.log(sanitizedUser.password)
// @log: undefined  
//
```

## God Mode Request (disable all security when getting a model)

This is best when you your data is scoped to the backend and you are sure it will never reach frontend (Eg: in a schedule)

```ts twoslash
// @noErrors
const userAsAdmin = await ctx.GM.db.user.getOne()
console.log(userAsAdmin.password)
// @warn: 'Abcd1234!'
//
```

## Deal with multiples databases

```ts twoslash
// @noErrors
import { dbs } from 'green_dot'

const company = await ctx.dbs.myOtherDb.company.getOne()
const company = await dbs.myOtherDb.company.getOne()
```

## Get actual connected user

With caching as admin (no mask nor filters here so ⚠️)


```ts twoslash
// @noErrors
const actualConnectedUser = await ctx.getUser()
console.log(actualConnectedUser.password)
// @warn: 'Abcd1234!'
//
```