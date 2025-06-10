---
title: Double Authentication Plugin
description: Enhanced security with 2FA, PIN code, and biometric authentication options.
---

# Double Authentication Plugin

The Double Authentication Plugin provides multiple layers of security for your application by implementing various authentication methods. This plugin is designed to work seamlessly with your existing authentication system while adding an extra layer of security.

## Features

- **Multiple Authentication Methods**:
  - Two-Factor Authentication (2FA)
  - PIN Code Authentication
  - Biometric Authentication
- **Configurable Security Settings**
- **Anti-timing Attack Protection**
- **Automatic Attempt Tracking**
- **User Lockout Mechanism**

## Installation

The plugin is included by default in the Green Dot framework. To enable it, configure it in your application settings.

## Configuration

You can configure the plugin using the following options:

```typescript
{
  enable: boolean,                    // Enable/disable the plugin
  nbAttemptsForAuth?: {              // Number of allowed attempts per auth method
    '2FA'?: number,                  // Default: 3
    biometricAuthToken?: number,     // Default: 3
    pincode?: number                 // Default: 3
  },
  resetTimeMinutesForSecureConnexion?: number,  // Lockout duration in minutes (Default: 15)
  pinCodeLength?: number             // Length of PIN code (Default: 4)
}
```

### Default Configuration

```typescript
{
  enable: true,
  nbAttemptsForAuth: {
    '2FA': 3,
    biometricAuthToken: 3,
    pincode: 3
  },
  pinCodeLength: 4,
  resetTimeMinutesForSecureConnexion: 15
}
```

## Usage

### Authentication Headers

The plugin automatically integrates with your login process. To use any of the authentication methods, include one of the following headers in your request:

- `biometricAuthToken`: For biometric authentication
- `pincode`: For PIN code authentication
- `2FA`: For two-factor authentication

All of these fields are encrypted in user model for secure verification

### Security Features

1. **Attempt Tracking**
   - Each authentication method tracks failed attempts separately
   - Attempts are reset after the configured lockout period
   - Different counters for each authentication method

2. **Automatic Lockout**
   - Users are locked out after exceeding the configured number of attempts
   - Lockout duration is configurable
   - Separate lockout counters for each authentication method

3. **Anti-Timing Attack Protection**
   - Random delays are added to prevent timing-based attacks
   - Secure comparison of authentication tokens

4. **Secure Storage**
   - PIN codes are encrypted using bcrypt
   - Secure handling of biometric tokens
   - Protected storage of 2FA codes

## User Model Fields

The plugin adds the following fields to your user model:

### PIN Code Related
- `pinCode`: Encrypted PIN code
- `pinCodeRetrialNb`: Number of failed PIN attempts
- `lastPincodeCompareTime`: Timestamp of last PIN verification

### 2FA Related
- `_2FAcode`: Current 2FA code
- `_2FAretrialNb`: Number of failed 2FA attempts
- `last2FACompareTime`: Timestamp of last 2FA verification

### Biometric Related
- `biometricAuthToken`: Biometric authentication token
- `biometricAuthRetrialNb`: Number of failed biometric attempts
- `lastBiometricCompareTime`: Timestamp of last biometric verification

## Error Handling

The plugin throws the following errors:

- `wrongToken`: When an invalid authentication token is provided
- `tooManyAttempsForSecureAuthentication`: When the maximum number of attempts is exceeded

## Best Practices

1. **PIN Code Security**
   - Use the default 4-digit PIN or configure a longer length for enhanced security
   - Regularly prompt users to change their PIN
   - Implement PIN complexity requirements if needed

2. **2FA Implementation**
   - Use a reliable 2FA service provider
   - Implement backup codes for account recovery
   - Provide clear instructions for 2FA setup

3. **Biometric Authentication**
   - Ensure proper device compatibility
   - Implement fallback authentication methods
   - Handle biometric authentication failures gracefully

## Security Considerations

1. **Rate Limiting**
   - The plugin implements automatic rate limiting through attempt tracking
   - Configure appropriate attempt limits based on your security requirements

2. **Lockout Duration**
   - Default lockout duration is 15 minutes
   - Adjust based on your security needs and user experience requirements

3. **Token Security**
   - All authentication tokens are handled securely
   - Implement proper token rotation and expiration

## Troubleshooting

Common issues and solutions:

1. **Authentication Failures**
   - Verify correct header format
   - Check attempt limits
   - Ensure proper token format

2. **Lockout Issues**
   - Verify lockout duration configuration
   - Check attempt counter reset logic
   - Ensure proper time synchronization

## Support

For additional support or feature requests, please contact the Green Dot support team or create an issue in the repository.
