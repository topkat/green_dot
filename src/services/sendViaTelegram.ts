

process.env.NTBA_FIX_319 = 1 as any // prevent telegram lib promise error log shall be before the lib import

import TelegramBot from 'node-telegram-bot-api'
import { GreenDotAppConfig } from '../types/greenDotAppConfig.types'
import { getActiveAppConfig } from '../helpers/getGreenDotConfigs'
import { capitalize1st } from 'topkat-utils'


let telegramBot
let sendOnErrorCodeGlob: GreenDotAppConfig['alerts']['telegram']['sendOnErrorCode']
let errorChatId: GreenDotAppConfig['alerts']['telegram']['chatId']
let appNameGlob: string

export async function initTelegramBot() {

    const { alerts, name } = await getActiveAppConfig()

    if (alerts && alerts.telegram && alerts.telegram.enable) {
        const { botId, chatId, sendOnErrorCode } = alerts.telegram
        telegramBot = new TelegramBot(botId)
        errorChatId = chatId
        appNameGlob = name
        sendOnErrorCodeGlob = sendOnErrorCode || (code => code === 500)
    }
}

export async function sendErrorViaTelegram(code, msg: string, extraInfos: string) {
    if (errorChatId && sendOnErrorCodeGlob(code)) {
        await telegramBot.sendMessage(
            errorChatId,
            `<b>${capitalize1st(appNameGlob)} App => error ${code}: ${msg}</b>\n<code>${extraInfos
                .replace(/.*\n/, '') // first line
                // eslint-disable-next-line no-control-regex
                .replace(/\u001b\[[012345]m/g, '') // removecli code coloration
            }</code>`,
            { parse_mode: 'HTML' }
        )
    }
}