---
title: API Key Authentication Plugin
description: A guide for implementing and using API Key authentication in your application.
---

## Features

- API key-based authentication
- Role-based access control
- Custom permissions per API key
- IP whitelisting support
- System role support

## Configuration

To use the API Key Authentication plugin, you need to configure it in your application. Here's how to set it up:

```ts title='myApp/gd.app.config.ts'
...
  plugin: [
    new GDapiKeyAuthentication({ 
      enable: true, 
      apiKeys: {
        myApiKeyName: {
            token: API_KEY_TOKEN,
            permissions: {
                // put here any permission that you want to give to the apiKey
                isEmailVerified: true,
                isCustomerWithApiKey: true,
            }
        }
      }
    })
  ],
...
```

### Configuration Options

- `enable`: (boolean) Enable or disable the plugin
- `apiKeys`: (object) Configuration for your API keys
  - `[apiKeyName]`: (object) Configuration for a specific API key
    - `token`: (string) The API key token
    - `permissions`: (object) Custom permissions for this API key
    - `role`: (string) Optional role assignment
    - `_id`: (string) Optional user ID to associate with this API key
    - `ipWhitelist`: (string | string[]) Optional list of allowed IP addresses

## Usage

To authenticate using an API key, include it in your request headers. When using the SDK, use:

```ts
$.setHeaders({ apiKey: 'myApiKey' })
```

### Authentication Flow

1. When a request is made with an API key:
   - The plugin checks if the API key exists and is valid
   - If valid, it assigns the configured role and permissions to the request
   - If the API key has an associated user ID, it will be used for the request
   - The authentication method is marked as 'apiKey'

### Security Best Practices

1. Always use IP whitelisting when possible to restrict API key usage to specific IP addresses
2. Use strong, randomly generated API key tokens
3. Regularly rotate API keys
4. Assign minimal required permissions to each API key
5. Monitor API key usage for suspicious activity

## Error Handling

The plugin will reject requests that:
- Use an invalid or expired API key
- Come from non-whitelisted IPs (if IP whitelisting is enabled)
- Attempt to use an API key with insufficient permissions

## Example Use Cases

1. Server-to-server communication
2. Third-party API integration
3. Automated testing
4. Backend service authentication
5. Microservice communication