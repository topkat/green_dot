---
title: Scheduled Tasks Guide
description: Learn how to create and manage scheduled tasks in your Green Dot application.
---

To create a new scheduled task, you can use the Green Dot CLI:

```bash
npx green_dot
```

Then select "> Hook Event Service" from the menu to generate a Hook Service file template.

***

Basic example:

```ts
export const userOnUpdateExample = {
    on: [
        'server.start',
        'user.update.before',
        'user.create.before',
        'myCustomModel.update.before'
    ],
    // In case multiple services are triggered by an event, how this one should be prioritized. The lower, the prior. From 0 to 100
    priority: 49,
    async main(ctx) {
        // get the input fields if any here
        ctx.inputFields
        // the modelName is here if you need
        ctx.modelName
        // you can get the ressourceId if the id is provided in the request (Eg: update or getById)
        ctx.ressourceId
    }
}
```
