---
title: green_dot Frontend Usage
description: This guide explains how to integrate and use the Green Dot SDK in your frontend application.
---

## SDK generation

You can generate the SDK in local folder and use that in your frontend if your backend and frontend share the same repository. If not, you have the option to automatically publish npm package for your SDK through command line:

```ts
yarn publishSdks
```

## Installation

First, install the SDK in your frontend project:

```bash
npm install appUserSDK
```

## SDK Initialization

The SDK needs to be initialized before use. Here's how to set it up:

```ts
import {$, initSdk} from 'appUserSDK'

initSdk({
  // Required: Your project name
  projectName: 'myProject',
  
  // Optional: Callback when user logs out
  onLogout: () => {
    // Clear session state
    getSessionState().setSession({ status: 'notAuthenticated' })
    // Clear localStorage except for essential items
    Object.keys(window.localStorage).forEach(k => {
      if (k !== 'deviceId' && k !== 'BANGK-language' && k !== 'BANGK-currency') {
        window.localStorage.removeItem(k)
      }
    })
  },

  // Required: Function to get device ID
  getDeviceId: () => getDeviceInfos()._id,

  // Optional: Callback when SDK is initialized
  onSdkInitialized: () => {/** TODO */ },

  // Required: Query client for caching
  getQueryClient: () => queryClient,

  // Required: Local storage handlers
  localStorageSet: (name, val) => localStorage.setItem(name, val),
  localStorageGet: name => localStorage.getItem(name),
  localStorageRemove: name => localStorage.removeItem(name),

  // Required: Token configuration
  refreshTokenExpirationMinutes,
  refreshTokenErrorMessage: t('errors.wrongToken'),
  wrongTokenErrorMessage: t(`errors.refreshTokenError`),

  // Required: Server configuration
  serverUrls: {
    backend: serverUrl,
    default: 'backend',
  },

  // Optional: Error handler
  onErrorCallback: backendErrHandler,
})
```

## Using the SDK

Once initialized, you can use the SDK to make type-safe API calls. The SDK automatically generates methods based on your backend routes:

```ts
// Example API calls
const userExists = await $.checkUserExists({ email: 'user@example.com' })
const userData = await $.getUserProfile()
```

## Tracker Integration

If you want to enable tracking functionality, initialize it after the SDK:

```ts
if (isTrackerEnabled) {
  initTrackerData({
    projectName,
    getDeviceId: () => getDeviceInfos()._id,
  })
  initTrackerListeners({ isDev })
}
```

## Features

- 🔄 Automatic token refresh handling
- 🗄️ Local storage management
- 🔒 Secure authentication
- 📱 Device tracking support
- 🚀 Type-safe API calls
- 💾 Built-in caching with TanStack Query

## Best Practices

1. Always initialize the SDK before making any API calls
2. Handle the `onLogout` callback to properly clean up user data
3. Use the provided local storage handlers for consistent data management
4. Implement proper error handling using the `onErrorCallback`
5. Keep your device ID management consistent across the application

## Type Safety

The SDK provides full TypeScript support, giving you:
- Autocomplete for all API routes
- Type checking for request parameters
- Type inference for response data
- Compile-time error detection

## Error Handling

The SDK includes built-in error handling for:
- Token expiration
- Refresh token errors
- Network issues
- Backend errors

Custom error handling can be implemented through the `onErrorCallback` configuration.
