---
title: Key Concepts
description: Understanding the core concepts of Green Dot framework.
---

## ⚠️ Role-Based Architecture ⚠️

In Green Dot, roles are designed to match your application's frontend interfaces. This means:

- Each role corresponds to a specific interface in your application
- For example, if you have an admin panel and a user-facing app, you would define two roles:
  - `admin` - for the admin panel interface
  - `appUser` - for the user-facing application
- All other rights / accesses are granted via permission system

### SDK Generation

The framework generates separate SDKs based on roles:

- Each role (thus each interface) gets its own dedicated SDK
- This ensures proper separation of concerns:
  - Admin services remain hidden from the app user SDK
  - Each interface only has access to its relevant endpoints
- Multiple backends and databases can be configured with any access role configuration, in the end everything will be merged into one SDK per interface
- Access control is automatically enforced at the SDK level

### Permission System


* roles and permissions are configured in `gd.config.ts`
* Permissions in Green Dot are **boolean properties on the user object**. They are injected automatically from your config.
* Each **role** as a corresponding **permission**. Example: `user.isAdmin` or `user.isAppUser`
* Anywhere when configuring access, you can have a string `'myRole'` config OR a full object with permissions: `{ role: 'myRole', hasEmailValidated: true }`