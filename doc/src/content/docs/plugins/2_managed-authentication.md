---
title: Managed Authentication Plugin
description: Complete login solution with secure authentication, token management, and user device handling.
---

# Managed Authentication Plugin

The Managed Authentication Plugin provides a comprehensive authentication solution for your application, handling everything from user login to token management, security standards compliance, and user device management.

## Features

- **Complete Authentication Flow**
  - User login with email/password
  - Token-based authentication
  - Automatic token refresh
  - Session management
  - Device management

- **Security Features**
  - OWASP security standards compliance
  - JWT-based authentication
  - Secure password policies
  - Email validation
  - Device tracking

- **User Management**
  - Password updates
  - Email updates
  - Account validation
  - Multi-device support
  - Role-based access control

## Installation

The plugin is included by default in the Green Dot framework. To enable it, configure it in your application settings.

## Configuration

The plugin offers extensive configuration options:

```typescript
{
  enable: boolean,
  
  // Email Configuration
  sendEmail: (ctx, emailType, encodedToken, user, additionalParams, updatedEmail?) => any,
  sendPasswordUpdatedMailConfirmation: (ctx, user) => any,
  sendEmailUpdatedMailConfirmation?: (ctx, { user, newEmail, oldEmail }) => any,
  
  // Login Configuration
  loginConfigPerRole: {
    [role: string]: {
      emailLogin: boolean,
      loginOnValidateToken?: boolean,
      additionalLoginPermissionsChecks?: (ctx, user) => boolean,
      onBeforeLogin?: (ctx, requestedRole, user) => void,
      onAfterLogin?: (ctx, requestedRole, user, loginTokens) => void
    }
  },
  
  // Cookie Configuration
  cookieProductionDomain: string,
  
  // Token Configuration
  emailTokenTimeValidMinutes?: number,        // Default: 30
  refreshTokenExpirationMinutes?: number,     // Default: 15
  jwtSecret: string,                          // Required
  jwtExpirationMs?: number,                   // Default: 15 minutes
  jwtRefreshExpirationMsWeb?: number | 'never', // Default: 48h
  jwtRefreshExpirationMsMobile?: number | 'never', // Default: 48h
  
  // Security Settings
  loginErrorIfEmailIsNotValidated?: boolean,  // Default: true
  validationTokenTypes?: string[],
  maxRefreshTokenPerRole?: Record<string, number>, // Default: 2 per role
  passwordRegexp?: RegExp,                    // Default: 1 uppercase, 1 lowercase, 1 number
  passwordMinLength?: number,                 // Default: 8
  passwordMaxLength?: number                  // Default: 35
}
```

### Default Configuration

```typescript
{
  enable: true,
  refreshTokenExpirationMinutes: 15,
  emailTokenTimeValidMinutes: 30,
  validationTokenTypes: [],
  passwordRegexp: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).*$/,
  passwordMinLength: 8,
  passwordMaxLength: 35,
  loginErrorIfEmailIsNotValidated: true
}
```

## Usage

### Authentication Flow

1. **User Login**
   - Email/password authentication
   - Token generation and validation
   - Session creation
   - Device tracking

2. **Token Management**
   - Automatic token refresh
   - Token expiration handling
   - Secure token storage
   - Device-specific tokens

3. **Security Features**
   - Password complexity enforcement
   - Email validation
   - Device management
   - Session control

### Email Types

The plugin supports various email types for different scenarios:

- Account validation
- Password reset
- Email update confirmation
- Password update confirmation

### Role-Based Access

Configure different login behaviors per role:

```typescript
loginConfigPerRole: {
  'admin': {
    emailLogin: true,
    loginOnValidateToken: true,
    additionalLoginPermissionsChecks: (ctx, user) => {
      // Custom permission checks
      return true;
    }
  },
  'user': {
    emailLogin: true
  }
}
```

## Security Features

### Password Policy

- Minimum length: 8 characters
- Maximum length: 35 characters
- Must contain:
  - At least one uppercase letter
  - At least one lowercase letter
  - At least one number
- Customizable regex pattern

### Token Security

- JWT-based authentication
- Configurable expiration times
- Separate web and mobile token policies
- Secure token storage
- Automatic token refresh

### Device Management

- Track user devices
- Limit simultaneous connections
- Device-specific tokens
- Automatic device cleanup

## Best Practices

1. **Security**
   - Use strong JWT secrets
   - Implement proper token expiration
   - Enable email validation
   - Configure appropriate password policies

2. **Email Handling**
   - Implement proper email templates
   - Handle email delivery failures
   - Provide clear user instructions
   - Implement email validation flow

3. **Token Management**
   - Configure appropriate token lifetimes
   - Implement proper token refresh
   - Handle token revocation
   - Monitor token usage

4. **Device Management**
   - Set appropriate device limits
   - Implement device tracking
   - Handle device cleanup
   - Monitor device usage

## Error Handling

The plugin handles various error scenarios:

- Invalid credentials
- Expired tokens
- Invalid email
- Device limit exceeded
- Permission denied
- Token validation failed

## Troubleshooting

Common issues and solutions:

1. **Authentication Failures**
   - Verify email validation status
   - Check token expiration
   - Validate device limits
   - Review permission settings

2. **Token Issues**
   - Check token expiration settings
   - Verify JWT secret
   - Review refresh token configuration
   - Check device limits

3. **Email Problems**
   - Verify email configuration
   - Check email templates
   - Review email validation flow
   - Monitor email delivery

## Support

For additional support or feature requests, please contact the Green Dot support team or [create an issue in the repository](https://github.com/topkat/green_dot/issues)
