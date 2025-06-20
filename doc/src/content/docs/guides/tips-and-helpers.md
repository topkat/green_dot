---
title: Tips and Helpers
description: Tips and Helpers for green_dot
---

### Env

This is the best way to get env and also env.isProd or env.isTest

```ts twoslash
import { env } from 'green_dot'

env.isProd // boolean
env.isTest // boolean
env.env // 'production' | 'development' | 'test'
```

### Get Model Type

Get model type safely like:

```ts twoslash
// @noErrors

import { ModelTypes, MainDbName } from 'green_dot'

type User = ModelTypes['user']
type UserWrite =  ModelTypes['userWrite']
type MyModelWrite =  ModelTypes['myModelWrite']

// You also have a type for the default db name: MainDbName

```


### sendEmail

Send an email with the configured smtp config

```ts twoslash
// @noErrors
import { sendEmail } from 'green_dot'

sendEmail()

```