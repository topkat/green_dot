import { documentation, docOneLine } from './doc'
import { newPlugin } from '../newPlugin'
import { GDmanagedLogin, Name } from './GDmanagedLogin'
import { defaultConfig, PluginUserConfig } from './config'

export default newPlugin<Name, PluginUserConfig, typeof GDmanagedLogin>({
  name: 'GDmanagedLogin',
  version: '1.0.0',
  defaultConfig,
  documentation,
  docOneLine,
  addToVariablesInNewProjectTemplate: {
    addToEnvVariableImports: [`JWT_SECRET = 'TODOreplaceThisStringWithYourTestSecret'`],
    instanciatePluginInAppConfig: ({ roles }) => `
      enable: true,
      jwtSecret: JWT_SECRET,
      loginConfigPerRole: {
        ${roles.map(r => `
        ${r}: {
          emailLogin: true,
          loginOnValidateToken: true,
        },`).join('')}
      },
      sendEmail(ctx, emailType, encodedToken, user, additionalParams, newEmail) {
        // TODO manage sending credential emails here
      },
      async sendPasswordUpdatedMailConfirmation(ctx, user) {
        // TODO ma,age sending updated mail here
      },
      async sendEmailUpdatedMailConfirmation(ctx, { oldEmail }) {
        // TODO ma,age sending updated mail here
      }
`,
  },
  plugin: GDmanagedLogin,
})

export { GDmanagedLogin } from './GDmanagedLogin'