// import AWS from 'aws-sdk'
// import { ServerConfig } from '../types/core.types.js'

// import { C } from 'topkat-utils'


// https://stackoverflow.com/questions/76178881/upgraded-to-aws-sdk-v3-but-still-getting-v2-maintenance-mode-warning-message
process.env.AWS_SDK_JS_SUPPRESS_MAINTENANCE_MODE_MESSAGE = '1'

// export function initAws(awsConfig?: ServerConfig['awsConfig']) {
//     if (awsConfig) {
//         AWS.config.update(awsConfig)
//         C.log(C.primary(`✓ AWS INITIALIZED`))
//     }
// }

// export function getAwsSmtpConfig() {
//   return {
//     SES: new AWS.SES({ apiVersion: '2010-12-01' })
//   }
// }