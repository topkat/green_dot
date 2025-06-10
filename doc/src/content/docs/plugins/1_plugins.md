---
title: Green Dot Plugins
description: A guide for implementing and using plugins in Green Dot.
---

Green Dot provides a flexible plugin system that allows you to extend the functionality of your application. Plugins can add new features, modify existing behavior, or integrate with external services.

* Plugins are instanciated in `gd.app.config.ts` and are proposed on project init to be installed

Example:
```ts title='myApp/gd.app.config.ts'
export const appConfig = {
  ...
  plugins: [
    new GDdoubleAuthentication({ enable: true }),
  ],
  ...
}
```

## Available Plugins

Green Dot comes with several built-in plugins:

- **GDmanagedLogin**: Handles user authentication and login management
- **GDdoubleAuthentication**: Provides two-factor authentication support
- **GDapiKeyAuthentication**: Manages API key-based authentication



## Core Plugin Functions

#### getPlugin() and getPluginConfig()

Retrieves an instance of a registered plugin by its name. Returns `null` if the plugin is not registered.

Example:
```typescript
import { getPlugin, getPluginConfig } from 'green_dot'

const managedLogin = getPlugin('GDmanagedLogin');
managedLogin?.userLogin(...params) // log the user anywhere in your app

const managedLoginConfig = getPluginConfig('GDmanagedLogin')
managedLoginConfig.passwordMaxLength // number
```

## Creating Custom Plugins

Please get in touch or [propose a pull request](https://github.com/topkat/green_dot/pulls) to create a custom plugin. Documentation available soon.