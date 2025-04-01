

import { AllPermissions } from './rolesAndPermission.constants'
import { systemUserId, GreenDotAppConfig } from 'green_dot'



export const apiKeyDefaultPerms = {
  hasAgreedWithTermsAndConditions: true,
  isEmailVerified: true,
  isPhoneVerified: true,
}


export const testApiKeys = {
  appUser: {
    _id: '650482c8f5398e5fc5def042',
    role: 'appUser',
    token: 'userToken',
    permissions: {
      ...apiKeyDefaultPerms,
      hasPassedKyc: false,
      isPhoneVerified: true,
    }
  },
  bangkAdmin: {
    _id: '650482c8f5398e5fc5def043',
    role: 'bangkAdmin',
    token: 'bangkAdminToken',
    permissions: {
      ...apiKeyDefaultPerms,
      hasPassedKyc: true,
      isPhoneVerified: true,
    }
  },
  icoInvestor: {
    _id: '650482c8f5398e5fc5def043',
    role: 'icoInvestor',
    token: 'icoInvestorToken',
    permissions: {
      ...apiKeyDefaultPerms,
      hasPassedKyc: true,
    }
  },
  hasPassedKyc: {
    _id: '650482c8f5398e5fc5def044',
    role: 'appUser',
    token: 'hasPassedKycToken',
    permissions: {
      ...apiKeyDefaultPerms,
      hasPassedKyc: true,
    },
  },
  system: {
    _id: systemUserId,
    role: 'system' as any, // not typed because it should not be suggested
    token: 'systemToken',
    permissions: {
      ...apiKeyDefaultPerms,
      hasPassedKyc: true,
      hasAgreedWithTermsAndConditions: true,
      isEmailVerified: true,
      // isAppUser: true,
      // isBangkAdmin: true,
      // isIcoInvestor: true,
      isLocked: false,
      isPhoneVerified: true,
      isDeleted: false,
      isCompanyRepresentative: true,
      isFinanceAdmin: true,
      isComplianceAdmin: true,
    } satisfies Record<AllPermissions, boolean>,
  },
} satisfies GreenDotAppConfig['apiKeys']