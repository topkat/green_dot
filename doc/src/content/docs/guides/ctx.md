---
title: Example Guide
description: A guide in my new Starlight docs site.
---



```ts
async main(ctx, input) {
    // User information
    ctx.user        // Current user object
    ctx.role        // User's role
    ctx.permissions // User's permissions
    
    // Database access
    ctx.db          // Database instance
    ctx.dbs.myDb    // in case you have multiple databases
    
    // Error handling
    ctx.error       // Error factory

    const user = await ctx.getUser()
    
    if(!user.isAdmin) throw ctx.error.myCustomError({ userId: user._id })
    
    // API information
    ctx.api         // Request information
}
```