

export const docOneLine = `2FA, Pin Code Auth and biometric authentication`

export const documentation = `
# GDdoubleAuthentication Plugin

## Features

- Multiple authentication methods:
  - Two-Factor Authentication (2FA)
  - PIN code authentication
  - Biometric authentication
- Configurable security settings:
  - Number of allowed attempts before lockout
  - Lockout duration
  - PIN code length customization
- Anti-timing attack protection
- Automatic attempt tracking and reset
- User lockout mechanism after multiple failed attempts

## Configuration

The plugin can be configured with the following options:

\`\`\`typescript
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
\`\`\`

## Usage

The plugin automatically hooks into the login process and requires one of the following headers in the request:
- \`biometricAuthToken\`: For biometric authentication
- \`pincode\`: For PIN code authentication
- \`2FA\`: For two-factor authentication

## Security Features

1. **Attempt Tracking**: Each authentication method tracks failed attempts separately
2. **Automatic Lockout**: Users are locked out after exceeding the configured number of attempts
3. **Time-based Reset**: Failed attempt counters reset after the configured lockout period
4. **Anti-Timing Attack**: Random delays are added to prevent timing-based attacks
5. **Secure Storage**: PIN codes are encrypted using bcrypt

## User Fields

The plugin adds the following fields to the user model:
- PIN Code related:
  - \`pinCode\`: Encrypted PIN code
  - \`pinCodeRetrialNb\`: Number of failed PIN attempts
  - \`lastPincodeCompareTime\`: Timestamp of last PIN verification
- 2FA related:
  - \`_2FAcode\`: Current 2FA code
  - \`_2FAretrialNb\`: Number of failed 2FA attempts
  - \`last2FACompareTime\`: Timestamp of last 2FA verification
- Biometric related:
  - \`biometricAuthToken\`: Biometric authentication token
  - \`biometricAuthRetrialNb\`: Number of failed biometric attempts
  - \`lastBiometricCompareTime\`: Timestamp of last biometric verification

## Error Handling

The plugin throws the following errors:
- \`wrongToken\`: When an invalid authentication token is provided
- \`tooManyAttempsForSecureAuthentication\`: When the maximum number of attempts is exceeded
`