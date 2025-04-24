
import { sendTeamsMessage } from 'send-teams-message'

import { removeCircularJSONstringify, C } from 'topkat-utils'
import { getActiveAppConfig } from '../helpers/getGreenDotConfigs'


export async function sendErrorOnTeams(ctx, code: number, msg: string, extraInfos: Record<string, any>, stackTrace?: string) {
    return await sendTeamsMsgGeneric(
        await appErrorTeamsCard(ctx, code, msg, extraInfos, stackTrace?.toString()),
        { code, msg, ...(extraInfos || {}), stackTrace }
    )
}

type RateLimiterExtraInfos = { route: string, discriminator: string, ip: string, userId: string, extraInfos?: Record<string, any>, nbAttempts: number }

export async function sendRateLimiterTeamsMessage(
    ctx: Ctx,
    extraInfs: RateLimiterExtraInfos
) {
    return await sendTeamsMsgGeneric(
        await rateLimiterAlertTeamsCard(ctx, extraInfs),
        extraInfs
    )
}



async function sendTeamsMsgGeneric(
    card,
    errExtraInfos,
) {
    try {
        const { alerts } = await getActiveAppConfig(true) || {}
        if (alerts && alerts.teams?.enable) {
            const { teamsWebhookUrl } = alerts.teams
            await sendTeamsMessage(teamsWebhookUrl, card)
        }
    } catch (err) {
        C.error(false, 'Message: ' + JSON.stringify(errExtraInfos, null, 2))
        C.error(err)
        C.error(false, 'Error sending teams message')
    }
}



const newTeamCard = (card: any[]) => ({
    'type': 'AdaptiveCard',
    '$schema': 'http://adaptivecards.io/schemas/adaptive-card.json',
    'version': '1.5',
    'fallbackText': 'This card requires Adaptive Cards v1.5 support to be rendered properly.',
    'body': card
})

async function appErrorTeamsCard(ctx: Ctx, code: number, msg: string, extraInfos: Record<string, any>, stackTrace: string) {

    return newTeamCard([
        {
            'type': 'TextBlock',
            'size': 'large',
            'weight': 'bolder',
            'text': '❌ **SERVER ERROR** ❌',
            'style': 'heading',
            'wrap': true,
            'horizontalAlignment': 'center'
        },
        {
            'type': 'TextBlock',
            'text': msg,
            'wrap': true,
            'style': 'heading'
        },
        {
            'type': 'Container',
            'items': [
                {
                    'type': 'FactSet',
                    'spacing': 'Large',
                    'facts': [
                        {
                            'title': 'User Id:',
                            'value': ctx?._id || '-'
                        },
                        {
                            'title': 'Code:',
                            'value': code || '-'
                        },
                        {
                            'title': 'Msg:',
                            'value': msg || '-'
                        },
                        {
                            'title': 'Extra Infos:',
                            'value': ' '
                        }
                    ]
                },
                {
                    //----------------------------------------
                    // EXTRAINFOS
                    //----------------------------------------
                    'type': 'Container',
                    'items': [
                        {
                            'type': 'RichTextBlock',
                            'inlines': [
                                {
                                    'type': 'TextRun',
                                    'text': removeCircularJSONstringify(extraInfos, 2) || ' ',
                                    'fontType': 'Monospace'
                                }
                            ]
                        }
                    ],
                    'style': 'emphasis'
                }
            ]
        },
        {
            //----------------------------------------
            // STACKTRACE
            //----------------------------------------
            'type': 'Container',
            'selectAction': {
                'type': 'Action.ToggleVisibility',
                'targetElements': [
                    'cardContent4',
                    'showStack',
                    'hideStack'
                ]
            },
            'items': [
                {
                    'type': 'TextBlock',
                    'text': 'Show Stack Trace',
                    'wrap': true,
                    'id': 'showStack',
                    'color': 'Accent'
                },
                {
                    'type': 'TextBlock',
                    'text': 'Hide stack trace',
                    'wrap': true,
                    'isVisible': false,
                    'id': 'hideStack',
                    'color': 'Accent'
                },
                {
                    'type': 'Container',
                    'isVisible': false,
                    'items': [
                        {
                            'type': 'RichTextBlock',
                            'inlines': [
                                {
                                    'type': 'TextRun',
                                    'text': stackTrace || ' ',
                                    'fontType': 'Monospace'
                                }
                            ]
                        }
                    ],
                    'id': 'cardContent4'
                }
            ]
        },
    ])
}





async function rateLimiterAlertTeamsCard(ctx: Ctx, extraInfos: RateLimiterExtraInfos) {

    return newTeamCard([{
        'type': 'TextBlock',
        'size': 'large',
        'weight': 'bolder',
        'text': '🤖 User has been Banished 🤖',
        'style': 'heading',
        'wrap': true,
        'horizontalAlignment': 'center'
    },
    {
        'type': 'Container',
        'items': [
            {
                'type': 'FactSet',
                'spacing': 'Large',
                'facts': [
                    {
                        'title': 'User Id:',
                        'value': extraInfos.userId || '-'
                    },
                    {
                        'title': 'IP:',
                        'value': extraInfos.ip || '-'
                    },
                    {
                        'title': 'Route:',
                        'value': extraInfos.route || '-'
                    },
                    {
                        'title': 'Nb attempt:',
                        'value': extraInfos.nbAttempts || '-'
                    },
                    {
                        'title': 'Extra Infos:',
                        'value': ' '
                    }
                ]
            },
            {
                //----------------------------------------
                // EXTRAINFOS
                //----------------------------------------
                'type': 'Container',
                'items': [
                    {
                        'type': 'RichTextBlock',
                        'inlines': [
                            {
                                'type': 'TextRun',
                                'text': removeCircularJSONstringify(extraInfos, 2) || ' ',
                                'fontType': 'Monospace'
                            }
                        ]
                    }
                ],
                'style': 'emphasis'
            }
        ]
    }])
}