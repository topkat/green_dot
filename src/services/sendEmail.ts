import nodemailer from 'nodemailer'
import { asArray, miniTemplater, C } from 'topkat-utils'
import { getActiveAppConfig } from '../helpers/getGreenDotConfigs'

let testAccountCache

export type EmailConfig = {
    emailFromAddress: string
    smtp: {
        host: string
        port?: number
        /** true for 465, false for other ports */
        secure?: boolean
        auth?: {
            user?: string
            pass?: string
        }
    }
}

export async function createTestSmtp() {
    const testAccount = testAccountCache || await nodemailer.createTestAccount()

    return {
        host: 'smtp.ethereal.email',
        port: 587,
        secure: false, // true for 465, false for other ports
        auth: {
            user: testAccount.user, // generated ethereal user
            pass: testAccount.pass, // generated ethereal password
        },
    }
}

export type SendEmailConfig = {
    useTestAccount?: boolean
    fromAddress?: string
    attachments?: string[]
    smtpConfig?: {
        host?: string
        port?: number
        /** true for 465, false for other ports */
        secure?: boolean
        auth?: {
            user?: string
            pass?: string
        },
    },
    /** use this to interpolate variables in content and subject of email. Eg: {{user}} will be provided when vars = { user: 'Jean-Pierre' } */
    vars?: ObjectGeneric
    useAwsSmtp?: boolean
}

export async function sendEmail(ctx, subject, content, recipients: string | string[] = '', { useTestAccount, smtpConfig, fromAddress, attachments, vars, useAwsSmtp }: SendEmailConfig = {}) {
    try {
        let smtpAccount: typeof smtpConfig

        const appConfig = await getActiveAppConfig()

        if (useTestAccount) {
            try {
                const smtp = await new Promise<Awaited<ReturnType<typeof createTestSmtp>> | false>((resolve) => {
                    let resolved = false
                    setTimeout(() => {
                        if (!resolved) resolve(false)
                    })
                    createTestSmtp().then(smtp => {
                        resolved = true
                        resolve(smtp)
                    })
                })
                if (smtp) smtpAccount = smtp
                else return C.error(false, 'Test SMTP server down, email sent has been bypassed')
            } catch (err) {
                return C.error(false, 'Test SMTP server down, email sent has been bypassed')
            }
        } else if (useAwsSmtp) throw 'not implemented 789987' // smtpAccount = getAwsSmtpConfig() as typeof smtpConfig
        else smtpAccount = (smtpConfig || appConfig?.smtp)

        if (smtpAccount.host.includes('live.smtp.mailtrap')) fromAddress = 'mailtrap@demomailtrap.com'

        const transporter = nodemailer.createTransport(smtpAccount)

        if (vars) {
            content = miniTemplater(content, vars)
            subject = miniTemplater(subject, vars)
        }

        const info = await transporter.sendMail({
            from: fromAddress || appConfig?.emailFromAddress, // sender address
            to: asArray(recipients).join(', '), // list of receivers
            subject, // Subject line
            html: content, // html body
            attachments,
        })
        C.info(`Message sent: ${info.messageId}`)
        if (useTestAccount) C.log(`Preview URL: ${nodemailer.getTestMessageUrl(info)}`)
        return info
    } catch (err) {
        throw ctx.error.sendEmailError({ recipients, err, fromAddress, varsUsed: vars, attachmentsLength: attachments?.length || 0 })
    }
}