

process.env.NTBA_FIX_319 = 1 as any // prevent telegram lib promise error log shall be before the lib import

import TelegramBot from 'node-telegram-bot-api'
import { GreenDotAppConfig } from '../types/core.types'


let telegramBot
let sendOnErrorCodeGlob: GreenDotAppConfig['telegramConfig']['sendOnErrorCode']

let serverConfigCache: GreenDotAppConfig
let errorChatId: number

export function initTelegramBot(serverConfig: GreenDotAppConfig) {
    if (!serverConfig?.telegramConfig) return
    telegramBot = new TelegramBot(serverConfig.telegramConfig.botId)
    serverConfigCache = serverConfig
    errorChatId = serverConfig?.telegramConfig?.sendErrorChatIdsPerEnv?.[serverConfig.env]
    sendOnErrorCodeGlob = serverConfigCache?.telegramConfig?.sendOnErrorCode || (() => false)
}

export async function sendErrorViaTelegram(code, msg: string, extraInfos: string) {
    if (telegramBot && errorChatId && sendOnErrorCodeGlob(code)) {
        await telegramBot.sendMessage(
            errorChatId,
            `<b>${serverConfigCache.appName} => error ${code}: ${msg}</b>\n<code>${extraInfos
                .replace(/.*\n/, '') // first line
                // eslint-disable-next-line no-control-regex
                .replace(/\u001b\[[012345]m/g, '') // cli code coloration
            }</code>`,
            { parse_mode: 'HTML' }
        )
    }
}