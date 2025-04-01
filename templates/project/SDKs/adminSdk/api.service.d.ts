
import * as modelTypes from './model-types.generated'
import { AsFilter, AsMongooseBody, RequestConfigRead, RequestConfigGetOne, RequestConfigWrite, MaybePaginated } from './mongo-db-base-types.generated'
import { SdkError, ServerUrls, SdkInitOptions, Breakpoints } from './apiCall'
import { useSuspenseQuery, QueryClient, FetchQueryOptions } from '@tanstack/react-query'
import { ModelNames } from './model-types.generated'
import { InitBackendConfig } from './sdkHelpers/initBackend'
import { ImgData } from './img'

export * from './sdkHelpers'

type MethodNames = 'manageDueDiligenceStatusAsAdmin' | 'manageKycStatusAsAdmin' | 'shuftiProCallback' | 'subscribeToNewsletter' | 'dataTrackingRegisterEvent' | 'updateEmail' | 'registerUserDevice' | 'userSubscribe' | 'updatePassword' | 'sendForgotPasswordEmail' | 'sendValidationEmail' | 'checkUserExists' | 'registerCompanyRepresentative' | 'getNewToken' | 'validateEmailAndLogin' | 'checkTokenBeforeEmailSvc' | 'tokenBgk' | 'sendMessageToSupport' | 'getCryptoChartData' | 'getCurrencyRateLive' | 'getCurrencyRates' | 'uploadMediasToS3' | 'frontendErrorHandler' | 'getGeneralBonusCode' | 'icoTransactionSuccessHandler' | 'cbwaa' | 'isBonusCodeValid' | 'createIcoBonusCode' | 'bangkAdminLogin' | 'logout' | 'loginOrSubscribe' | 'userLoginWithEmail' | 'plaidGetLinkToken' | 'plaidStoreToken' | 'plaidGetAllTransactions' | 'newsletterSubscriptionsGetAll' | 'newsletterSubscriptionsGetLastN' | 'newsletterSubscriptionsGetFirstN' | 'newsletterSubscriptionsCount' | 'newsletterSubscriptionsGetById' | 'newsletterSubscriptionsGetOne' | 'appConfigGetAll' | 'appConfigGetLastN' | 'appConfigGetFirstN' | 'appConfigCount' | 'appConfigGetById' | 'appConfigGetOne' | 'bangkWalletsGetAll' | 'bangkWalletsGetLastN' | 'bangkWalletsGetFirstN' | 'bangkWalletsCount' | 'bangkWalletsGetById' | 'bangkWalletsGetOne' | 'blockchainConfigGetAll' | 'blockchainConfigGetLastN' | 'blockchainConfigGetFirstN' | 'blockchainConfigCount' | 'blockchainConfigGetById' | 'blockchainConfigGetOne' | 'cardGetAll' | 'cardGetLastN' | 'cardGetFirstN' | 'cardCount' | 'cardGetById' | 'cardGetOne' | 'cardTransactionGetAll' | 'cardTransactionGetLastN' | 'cardTransactionGetFirstN' | 'cardTransactionCount' | 'cardTransactionGetById' | 'cardTransactionGetOne' | 'companyGetAll' | 'companyGetLastN' | 'companyGetFirstN' | 'companyCount' | 'companyGetById' | 'companyGetOne' | 'devCommentGetAll' | 'devCommentGetLastN' | 'devCommentGetFirstN' | 'devCommentCount' | 'devCommentGetById' | 'devCommentGetOne' | 'deviceGetAll' | 'deviceGetLastN' | 'deviceGetFirstN' | 'deviceCount' | 'deviceGetById' | 'deviceGetOne' | 'icoBonusCodeGetAll' | 'icoBonusCodeGetLastN' | 'icoBonusCodeGetFirstN' | 'icoBonusCodeCount' | 'icoBonusCodeGetById' | 'icoBonusCodeGetOne' | 'icoBonusCodeCreate' | 'icoBonusCodeUpdate' | 'icoBonusCodeUpdateMany' | 'icoBonusCodeUpsert' | 'icoBonusCodeUpdateWithFilter' | 'icoBonusCodeDelete' | 'icoBonusCodeDeleteWithFilter' | 'icoDashboardConfigGetAll' | 'icoDashboardConfigGetLastN' | 'icoDashboardConfigGetFirstN' | 'icoDashboardConfigCount' | 'icoDashboardConfigGetById' | 'icoDashboardConfigGetOne' | 'icoRewardTransactionGetAll' | 'icoRewardTransactionGetLastN' | 'icoRewardTransactionGetFirstN' | 'icoRewardTransactionCount' | 'icoRewardTransactionGetById' | 'icoRewardTransactionGetOne' | 'icoTransactionGetAll' | 'icoTransactionGetLastN' | 'icoTransactionGetFirstN' | 'icoTransactionCount' | 'icoTransactionGetById' | 'icoTransactionGetOne' | 'icoWalletTransactionToValidateManuallyGetAll' | 'icoWalletTransactionToValidateManuallyGetLastN' | 'icoWalletTransactionToValidateManuallyGetFirstN' | 'icoWalletTransactionToValidateManuallyCount' | 'icoWalletTransactionToValidateManuallyGetById' | 'icoWalletTransactionToValidateManuallyGetOne' | 'icoWalletTransactionToValidateManuallyCreate' | 'interestTransactionGetAll' | 'interestTransactionGetLastN' | 'interestTransactionGetFirstN' | 'interestTransactionCount' | 'interestTransactionGetById' | 'interestTransactionGetOne' | 'investmentBondsGetAll' | 'investmentBondsGetLastN' | 'investmentBondsGetFirstN' | 'investmentBondsCount' | 'investmentBondsGetById' | 'investmentBondsGetOne' | 'investmentEquityGetAll' | 'investmentEquityGetLastN' | 'investmentEquityGetFirstN' | 'investmentEquityCount' | 'investmentEquityGetById' | 'investmentEquityGetOne' | 'investmentFundSharesGetAll' | 'investmentFundSharesGetLastN' | 'investmentFundSharesGetFirstN' | 'investmentFundSharesCount' | 'investmentFundSharesGetById' | 'investmentFundSharesGetOne' | 'investmentProjectBondsGetAll' | 'investmentProjectBondsGetLastN' | 'investmentProjectBondsGetFirstN' | 'investmentProjectBondsCount' | 'investmentProjectBondsGetById' | 'investmentProjectBondsGetOne' | 'investmentProjectBondsUpdate' | 'investmentProjectBondsUpdateMany' | 'investmentProjectBondsUpsert' | 'investmentProjectBondsUpdateWithFilter' | 'investmentProjectEquityGetAll' | 'investmentProjectEquityGetLastN' | 'investmentProjectEquityGetFirstN' | 'investmentProjectEquityCount' | 'investmentProjectEquityGetById' | 'investmentProjectEquityGetOne' | 'investmentProjectEquityUpdate' | 'investmentProjectEquityUpdateMany' | 'investmentProjectEquityUpsert' | 'investmentProjectEquityUpdateWithFilter' | 'investmentProjectFundSharesGetAll' | 'investmentProjectFundSharesGetLastN' | 'investmentProjectFundSharesGetFirstN' | 'investmentProjectFundSharesCount' | 'investmentProjectFundSharesGetById' | 'investmentProjectFundSharesGetOne' | 'investmentProjectFundSharesUpdate' | 'investmentProjectFundSharesUpdateMany' | 'investmentProjectFundSharesUpsert' | 'investmentProjectFundSharesUpdateWithFilter' | 'investmentTransactionBondsGetAll' | 'investmentTransactionBondsGetLastN' | 'investmentTransactionBondsGetFirstN' | 'investmentTransactionBondsCount' | 'investmentTransactionBondsGetById' | 'investmentTransactionBondsGetOne' | 'investmentTransactionEquityGetAll' | 'investmentTransactionEquityGetLastN' | 'investmentTransactionEquityGetFirstN' | 'investmentTransactionEquityCount' | 'investmentTransactionEquityGetById' | 'investmentTransactionEquityGetOne' | 'investmentTransactionFundSharesGetAll' | 'investmentTransactionFundSharesGetLastN' | 'investmentTransactionFundSharesGetFirstN' | 'investmentTransactionFundSharesCount' | 'investmentTransactionFundSharesGetById' | 'investmentTransactionFundSharesGetOne' | 'missionGetAll' | 'missionGetLastN' | 'missionGetFirstN' | 'missionCount' | 'missionGetById' | 'missionGetOne' | 'newsGetAll' | 'newsGetLastN' | 'newsGetFirstN' | 'newsCount' | 'newsGetById' | 'newsGetOne' | 'sellOfferBondsGetAll' | 'sellOfferBondsGetLastN' | 'sellOfferBondsGetFirstN' | 'sellOfferBondsCount' | 'sellOfferBondsGetById' | 'sellOfferBondsGetOne' | 'sellOfferEquityGetAll' | 'sellOfferEquityGetLastN' | 'sellOfferEquityGetFirstN' | 'sellOfferEquityCount' | 'sellOfferEquityGetById' | 'sellOfferEquityGetOne' | 'sellOfferFundSharesGetAll' | 'sellOfferFundSharesGetLastN' | 'sellOfferFundSharesGetFirstN' | 'sellOfferFundSharesCount' | 'sellOfferFundSharesGetById' | 'sellOfferFundSharesGetOne' | 'serverBlacklistGetAll' | 'serverBlacklistGetLastN' | 'serverBlacklistGetFirstN' | 'serverBlacklistCount' | 'serverBlacklistGetById' | 'serverBlacklistGetOne' | 'supportMessagesGetAll' | 'supportMessagesGetLastN' | 'supportMessagesGetFirstN' | 'supportMessagesCount' | 'supportMessagesGetById' | 'supportMessagesGetOne' | 'tagGetAll' | 'tagGetLastN' | 'tagGetFirstN' | 'tagCount' | 'tagGetById' | 'tagGetOne' | 'trackingDataEventsGetAll' | 'trackingDataEventsGetLastN' | 'trackingDataEventsGetFirstN' | 'trackingDataEventsCount' | 'trackingDataEventsGetById' | 'trackingDataEventsGetOne' | 'trackingDataSessionGetAll' | 'trackingDataSessionGetLastN' | 'trackingDataSessionGetFirstN' | 'trackingDataSessionCount' | 'trackingDataSessionGetById' | 'trackingDataSessionGetOne' | 'unexpectedErrorGetAll' | 'unexpectedErrorGetLastN' | 'unexpectedErrorGetFirstN' | 'unexpectedErrorCount' | 'unexpectedErrorGetById' | 'unexpectedErrorGetOne' | 'userGetAll' | 'userGetLastN' | 'userGetFirstN' | 'userCount' | 'userGetById' | 'userGetOne' | 'userUpdate' | 'userUpdateMany' | 'userUpsert' | 'userUpdateWithFilter' | 'utmCampaignGetAll' | 'utmCampaignGetLastN' | 'utmCampaignGetFirstN' | 'utmCampaignCount' | 'utmCampaignGetById' | 'utmCampaignGetOne' | 'utmCampaignCreate' | 'utmCampaignUpdate' | 'utmCampaignUpdateMany' | 'utmCampaignUpsert' | 'utmCampaignUpdateWithFilter' | 'utmCampaignDelete' | 'utmCampaignDeleteWithFilter' | 'vestingConfigGetAll' | 'vestingConfigGetLastN' | 'vestingConfigGetFirstN' | 'vestingConfigCount' | 'vestingConfigGetById' | 'vestingConfigGetOne' | 'walletGetAll' | 'walletGetLastN' | 'walletGetFirstN' | 'walletCount' | 'walletGetById' | 'walletGetOne' | 'walletTransferTransactionGetAll' | 'walletTransferTransactionGetLastN' | 'walletTransferTransactionGetFirstN' | 'walletTransferTransactionCount' | 'walletTransferTransactionGetById' | 'walletTransferTransactionGetOne'

export * from './model-types.generated'

export type ApiType = {
    init(config: SdkInitOptions): void
    getServerUrl(): string
    /** You can set any headers that are sent to the backend on top (or replacing) already existing headers */
    setHeaders(newHeaders: Record<string, string | number>, mergeWithPrevious?: boolean): void
    /** Use this if you manually want to set authorization header. Usually, this is made automatically by the SDK */
    setAuthorization(authToken: string): void
    /** This one is like an event listener. The callback will be ran before every api request and allow to run custom code at that time */
    beforeApiCall(fn: (route: string, ...params: any[]) => any | Promise<any>): void
    /** This will invalidate the cache for target queries and make api calls again  */
    invalidateQueries(queries: (`${ModelNames}*` | MethodNames)[]): void
    /** This is used in case the SDK is used for image urls to optimize urls for app size */
    setBreakpoint(breakpoints: Breakpoints): void
    /** Take an imageId and return the full url, in the responsive breakpoint size set by `$.setBreakpoint()` if possible */
    img(img: ImgData, overrideBreakpoint: Breakpoints): string
    auth: {
        pinCode(pinCode: number | string): void,
        biometricAuthToken(biometricAuthToken: string): void,
        _2FA(_2FA: string): void
    }

    // SERVICES ==============================,
    manageDueDiligenceStatusAsAdmin(props?: {
        'userId': string
        'status': 'declined' | 'success' | 'canRetry'
    }): Promise<void>,
    manageKycStatusAsAdmin(props?: {
        'userId': string
        'status': 'declined' | 'success' | 'canRetry' | 'pending'
        'kycDeclinedReasons'?: string
    }): Promise<void>,
    shuftiProCallback(param0?: any): Promise<void>,
    subscribeToNewsletter(param0?: modelTypes.NewsletterSubscriptionsModels['Write']): Promise<void>,
    dataTrackingRegisterEvent(param0?: Array<{
        'utmCampaignId'?: string
        'type': 'press' | 'click' | 'sessionEnd' | 'pageLeft' | 'pageReturn' | 'navigate' | 'componentVisible' | 'componentHidden' | 'error' | 'sessionStart'
        'project': string
        'session': string
        'ts': number
        'screen'?: string
        'data'?: {
            [key: string]: any
        }
        'device'?: string | modelTypes.Device
        'error'?: string | modelTypes.UnexpectedError
    }>): Promise<void>,
    updateEmail(props?: {
        'token': string
    }): Promise<string>,
    registerUserDevice(param0?: modelTypes.DeviceModels['Read']): Promise<void>,
    userSubscribe(userFields?: {
        'phonePrefix': any
        'phoneNumber': string
        'lang': 'fr' | 'en' | 'ru'
        'currency': 'eur' | 'usd' | 'thb' | 'jpy' | 'inr' | 'cny' | 'try' | 'mxn' | 'gbp' | 'chf' | 'rub' | 'pln' | 'dkk' | 'ils' | 'sek' | 'ars' | 'php' | 'brl' | 'cad' | 'krw' | 'nok' | 'sgd' | 'huf' | 'uah' | 'aud' | 'zar' | 'myr' | 'idr' | 'hkd' | 'nzd' | 'aed'
        'email': string
        'password': string
        'hasAgreedWithTermsAndConditions': boolean
        'firstName'?: string
        'lastName'?: string
        'referralCode'?: string
        'emailAdditionalParams'?: {
            [prop: string]: any
        }
        'pinCode'?: string
    }): Promise<Required<{
        'userId': string
        'userEmail': string
    }>>,
    updatePassword(props?: {
        'token': string
        'newPassword': string
    }): Promise<string>,
    /** Send an email to the user with a link to change his password with \Forgot Password\ button in frontend
     * @example
     * 'rndmString'
 */
    sendForgotPasswordEmail(props?: {
        'email': string
    }): Promise<string>,
    /** Send an email to the user for validate their email
     * @example
     * 'rndmString'
 */
    sendValidationEmail(props?: {
        'userId': string
        'additionalParams'?: {
            [prop: string]: any
        }
    }): Promise<string>,
    checkUserExists(props?: {
        'email'?: string
    }): Promise<boolean>,
    registerCompanyRepresentative(userFields?: {
        'phonePrefix': any
        'phoneNumber': string
        'lang': 'fr' | 'en' | 'ru'
        'currency': 'eur' | 'usd' | 'thb' | 'jpy' | 'inr' | 'cny' | 'try' | 'mxn' | 'gbp' | 'chf' | 'rub' | 'pln' | 'dkk' | 'ils' | 'sek' | 'ars' | 'php' | 'brl' | 'cad' | 'krw' | 'nok' | 'sgd' | 'huf' | 'uah' | 'aud' | 'zar' | 'myr' | 'idr' | 'hkd' | 'nzd' | 'aed'
        'email': string
        'password': string
        'hasAgreedWithTermsAndConditions': boolean
        'firstName'?: string
        'lastName'?: string
        'referralCode'?: string
        'emailAdditionalParams'?: {
            [prop: string]: any
        }
        'pinCode'?: string
        'companyName': string
        'registrationCountry': string
        'companyIdenfier': string
    }): Promise<Required<{
        'userId': string
        'userEmail': string
        'companyId': string
        'emailWasAlreadyVerified': boolean
    }>>,
    /** This route if to renew token periodically after login. Adding a pinCode allow to use an expired token.
     * @errorCodes
     * - 404: notFound - If user do not exist,     * - 403: wrongToken - May throw for differnet reasons: 'noCookieProvided', 'notSameDevice', 'notExistingToken', 'noTokenRegistered1', 'noTokenRegistered2', 'verifyToken', 'checkTokenDataExists', 'JWTrequiredFields',     * - 401: tokenExpired,     * - 401: userLocked,     * - 429: tooMuchPinCodeAttempts,     * - 403: wrongPinCode
     * @example
     * {
     *   'accessToken': 'rndmString',
     *   'csrfToken': 'rndmString',
     *   'expirationDate': 'Fri Jan 03 2012 13:13:25 GMT+0100 (Central European Standard Time)',
     *   'biometricAuthToken': 'rndmString'
     * }
 */
    getNewToken(props?: {
        'deviceId': string
        'pinCode'?: any
        'biometricAuthToken'?: string
    }): Promise<Required<{
        'accessToken': string
        'csrfToken': string
        'expirationDate': Date | 'never'
        'biometricAuthToken': string
    }>>,
    validateEmailAndLogin(props?: {
        'token': string
        'deviceId': string
        'deviceType': 'mobile' | 'web'
    }): Promise<Required<{
        'user': modelTypes.UserModels['Read']
        'accessToken': string
        'deviceId': string
        'csrfToken': string
        'biometricAuthToken': string
        'wasEmailAlreadyValidated': false
    }> | Required<{
        'wasEmailAlreadyValidated': true
    }>>,
    checkTokenBeforeEmailSvc(props?: {
        'token': string
        'emailType': 'forgotPassword' | 'emailValidation' | 'changeEmail'
    }): Promise<Required<{
        'isValidToken': boolean
    }>>,
    tokenBgk(): Promise<void>,
    sendMessageToSupport(props?: {
        'msg': string
        'userId'?: string
        'userEmail'?: string
        'deviceId'?: string
        'errorId'?: string
        'topic'?: string
    }): Promise<void>,
    getCryptoChartData(): Promise<Required<{
        'bangkEuro': Array<[number, number]>
        'bangkCoin': Array<[number, number]>
        'tether': Array<[number, number]>
        'bitcoin': Array<[number, number]>
        'solana': Array<[number, number]>
        'ethereum': Array<[number, number]>
        'usd-coin': Array<[number, number]>
        'binancecoin': Array<[number, number]>
    }>>,
    getCurrencyRateLive(props?: {
        'sourceCurrency'?: 'tether' | 'bitcoin' | 'solana' | 'ethereum' | 'usd-coin' | 'binancecoin'
        'targetCurrency'?: 'tether' | 'bitcoin' | 'solana' | 'ethereum' | 'usd-coin' | 'binancecoin'
    }): Promise<number>,
    getCurrencyRates(): Promise<Required<{
        'bangkEuro': number
        'bangkCoin': number
        'tether': number
        'bitcoin': number
        'solana': number
        'ethereum': number
        'usd-coin': number
        'binancecoin': number
        'eur': number
        'usd': number
        'thb': number
        'jpy': number
        'inr': number
        'cny': number
        'try': number
        'mxn': number
        'gbp': number
        'chf': number
        'rub': number
        'pln': number
        'dkk': number
        'ils': number
        'sek': number
        'ars': number
        'php': number
        'brl': number
        'cad': number
        'krw': number
        'nok': number
        'sgd': number
        'huf': number
        'uah': number
        'aud': number
        'zar': number
        'myr': number
        'idr': number
        'hkd': number
        'nzd': number
        'aed': number
    }>>,
    uploadMediasToS3(props?: {
        'mediaName': string
    }): Promise<void>,
    frontendthrow error.andler(props ?: {
        'errorId'?: string
    'title': string
    'applicationVersion'?: string
    'deviceId'?: string
    'userId'?: string
    'extraInfos'?: string
    'stackTrace'?: string
    'deviceType'?: 'tablet' | 'mobile' | 'desktop' | 'unknown'
    'deviceInfos'?: {}
    'deviceName'?: string
    }): Promise<void>,
        getGeneralBonusCode(): Promise<modelTypes.IcoBonusCodeModels['Read'] | void>,
            icoTransactionSuccessHandler(props ?: {
                'transactionId': string
    'isCancel'?: boolean
    'hash'?: string
            }): Promise<void>,
                cbwaa(props ?: {
                    'wallets'?: Array<modelTypes.BangkWalletsModels['Write']>
                }): Promise<void>,
                    isBonusCodeValid(props ?: {
                        'code': string
                    }): Promise<{
                        'type'?: 'referralCode'
                        'firstName'?: string | void
                        'lastName'?: string | void
                    } | {
                        'type'?: 'bonusCode'
                        'bonusCode'?: modelTypes.IcoBonusCodeModels['Read']
                    }>,
                        createIcoBonusCode(props ?: modelTypes.IcoBonusCodeModels['Write']): Promise<void>,
                            bangkAdminLogin(userFields ?: {
                                'deviceId': string
    'deviceType': 'mobile' | 'web'
    'email': string
    'password': string
    'pinCode'?: string
                            }): Promise<Required<{
                                'isEmailVerified': true
                                'loginInfos': Required<{
                                    'user': modelTypes.UserModels['Read']
                                    'accessToken': string
                                    'deviceId': string
                                    'csrfToken': string
                                    'biometricAuthToken': string
                                }>
                            }> | Required<{
                                'isEmailVerified': false
                                'userId': string
                                'userEmail': string
                            }>>,
                                /** The cookie is cleared and token is revoked
                             */
                                logout(): Promise<void>,
                                    loginOrSubscribe(userFields ?: {
                                        'deviceId': string
    'deviceType': 'mobile' | 'web'
    'phonePrefix': any
    'phoneNumber': string
    'lang': 'fr' | 'en' | 'ru'
    'currency': 'eur' | 'usd' | 'thb' | 'jpy' | 'inr' | 'cny' | 'try' | 'mxn' | 'gbp' | 'chf' | 'rub' | 'pln' | 'dkk' | 'ils' | 'sek' | 'ars' | 'php' | 'brl' | 'cad' | 'krw' | 'nok' | 'sgd' | 'huf' | 'uah' | 'aud' | 'zar' | 'myr' | 'idr' | 'hkd' | 'nzd' | 'aed'
    'firstName'?: string
    'lastName'?: string
    'email'?: string
    'password'?: string
    'referralCode'?: string
    'pinCode'?: string
                                    }): Promise<Required<{
                                        'user': modelTypes.UserModels['Read']
                                        'accessToken': string
                                        'deviceId': string
                                        'csrfToken': string
                                        'biometricAuthToken': string
                                    }>>,
                                        userLoginWithEmail(userFields ?: {
                                            'deviceId': string
    'deviceType': 'mobile' | 'web'
    'email': string
    'password': string
    'pinCode'?: string
                                        }): Promise<Required<{
                                            'isEmailVerified': true
                                            'loginInfos': Required<{
                                                'user': modelTypes.UserModels['Read']
                                                'accessToken': string
                                                'deviceId': string
                                                'csrfToken': string
                                                'biometricAuthToken': string
                                            }>
                                        }> | Required<{
                                            'isEmailVerified': false
                                            'userId': string
                                            'userEmail': string
                                        }>>,
                                            plaidGetLinkToken(): Promise<string>,
                                                plaidStoreToken(props ?: {
                                                    'publicToken': string
                                                }): Promise<void>,
                                                    plaidGetAllTransactions(): Promise<'noPlaidToken' | 'error' | Array<Required<{
                                                        'amount': number
                                                        'object': string
                                                        'date': string
                                                        'pending': boolean
                                                        'status': 'added' | 'modified' | 'removed'
                                                        'currency': string
                                                    }>>>,
                                                        // DAO ===================================,
                                                        /** Allow to get all ressources with providing a filter as first param
                                                         * @example
                                                         * [
                                                         *   {
                                                         *     'email': 'uretreIrrité@gmail.com',
                                                         *     'lang': 'rndmString',
                                                         *     'currency': 'rndmString',
                                                         *     'ipAddress': 'rndmString',
                                                         *     'userAgent': 'rndmString',
                                                         *     'lastBrevoSync': 12,
                                                         *     '_id': '6776baf5c7c6e518aae88071',
                                                         *     'creationDate': 'Fri Jan 03 2012 13:13:25 GMT+0100 (Central European Standard Time)'
                                                         *   },
                                                         *   {
                                                         *     'email': 'uretreIrrité@gmail.com',
                                                         *     'lang': 'rndmString',
                                                         *     'currency': 'rndmString',
                                                         *     'ipAddress': 'rndmString',
                                                         *     'userAgent': 'rndmString',
                                                         *     'lastBrevoSync': 12,
                                                         *     '_id': '6776baf5c7c6e518aae88071',
                                                         *     'creationDate': 'Fri Jan 03 2012 13:13:25 GMT+0100 (Central European Standard Time)'
                                                         *   }
                                                         * ]
                                                     */
                                                        newsletterSubscriptionsGetAll(
                                                            filter ?: AsFilter<modelTypes.NewsletterSubscriptionsModels['Write']>,
                                                            config ?: never
                                                        ): Promise<modelTypes.NewsletterSubscriptionsModels['Read'][]>
newsletterSubscriptionsGetAll<Config extends Omit<RequestConfigRead<modelTypes.NewsletterSubscriptionsModels['Read']>, 'filter'>>(
    filter ?: AsFilter<modelTypes.NewsletterSubscriptionsModels['Write']>,
    config ?: Config
): Promise<MaybePaginated<modelTypes.NewsletterSubscriptionsModels['Read'][], Config>>,
    /** Allow to get the last ressources by creation date
     * @example
     * [
     *   {
     *     'email': 'uretreIrrité@gmail.com',
     *     'lang': 'rndmString',
     *     'currency': 'rndmString',
     *     'ipAddress': 'rndmString',
     *     'userAgent': 'rndmString',
     *     'lastBrevoSync': 12,
     *     '_id': '6776baf5c7c6e518aae88071',
     *     'creationDate': 'Fri Jan 03 2012 13:13:25 GMT+0100 (Central European Standard Time)'
     *   },
     *   {
     *     'email': 'uretreIrrité@gmail.com',
     *     'lang': 'rndmString',
     *     'currency': 'rndmString',
     *     'ipAddress': 'rndmString',
     *     'userAgent': 'rndmString',
     *     'lastBrevoSync': 12,
     *     '_id': '6776baf5c7c6e518aae88071',
     *     'creationDate': 'Fri Jan 03 2012 13:13:25 GMT+0100 (Central European Standard Time)'
     *   }
     * ]
 */
    newsletterSubscriptionsGetLastN(
        limit ?: number,
        config ?: never,
    ): Promise<modelTypes.NewsletterSubscriptionsModels['Read'][]>
newsletterSubscriptionsGetLastN<Config extends RequestConfigRead<modelTypes.NewsletterSubscriptionsModels['Read']>>(
    limit ?: number,
    config ?: Config,
): Promise<MaybePaginated<modelTypes.NewsletterSubscriptionsModels['Read'][], Config>>,
    /** Allow to get the first ressources by creation date
     * @example
     * [
     *   {
     *     'email': 'uretreIrrité@gmail.com',
     *     'lang': 'rndmString',
     *     'currency': 'rndmString',
     *     'ipAddress': 'rndmString',
     *     'userAgent': 'rndmString',
     *     'lastBrevoSync': 12,
     *     '_id': '6776baf5c7c6e518aae88071',
     *     'creationDate': 'Fri Jan 03 2012 13:13:25 GMT+0100 (Central European Standard Time)'
     *   },
     *   {
     *     'email': 'uretreIrrité@gmail.com',
     *     'lang': 'rndmString',
     *     'currency': 'rndmString',
     *     'ipAddress': 'rndmString',
     *     'userAgent': 'rndmString',
     *     'lastBrevoSync': 12,
     *     '_id': '6776baf5c7c6e518aae88071',
     *     'creationDate': 'Fri Jan 03 2012 13:13:25 GMT+0100 (Central European Standard Time)'
     *   }
     * ]
 */
    newsletterSubscriptionsGetFirstN(
        limit ?: number,
        config ?: never
    ): Promise<modelTypes.NewsletterSubscriptionsModels['Read'][]>
newsletterSubscriptionsGetFirstN<Config extends RequestConfigRead<modelTypes.NewsletterSubscriptionsModels['Read']>>(
    limit ?: number,
    config ?: Config
): Promise<MaybePaginated<modelTypes.NewsletterSubscriptionsModels['Read'][], Config>>,
    /** Count the number of ressources matching the filter in first param or all ressources if no filter is provided
     * @example
     * 12
 */
    newsletterSubscriptionsCount(
        filter ?: AsFilter<modelTypes.NewsletterSubscriptionsModels['Write']>
    ): Promise<number>,
        /** Allow to get a ressource by it's unique mongoDb _id
         * @errorCodes
         * - 404: ressourceDoesNotExists
         * @example
         * {
         *   'email': 'uretreIrrité@gmail.com',
         *   'lang': 'rndmString',
         *   'currency': 'rndmString',
         *   'ipAddress': 'rndmString',
         *   'userAgent': 'rndmString',
         *   'lastBrevoSync': 12,
         *   '_id': '6776baf5c7c6e518aae88071',
         *   'creationDate': 'Fri Jan 03 2012 13:13:25 GMT+0100 (Central European Standard Time)'
         * }
     */
        newsletterSubscriptionsGetById<Config extends RequestConfigGetOne<modelTypes.NewsletterSubscriptionsModels['Read']>>(
            id: string,
            config ?: Config
        ): Promise<Config['triggerErrorIfNotSet'] extends true ? modelTypes.NewsletterSubscriptionsModels['Read'] : modelTypes.NewsletterSubscriptionsModels['Read'] | undefined>,
            /** Allow to get a ressource with providing a filter as first param
             * @example
             * {
             *   'email': 'uretreIrrité@gmail.com',
             *   'lang': 'rndmString',
             *   'currency': 'rndmString',
             *   'ipAddress': 'rndmString',
             *   'userAgent': 'rndmString',
             *   'lastBrevoSync': 12,
             *   '_id': '6776baf5c7c6e518aae88071',
             *   'creationDate': 'Fri Jan 03 2012 13:13:25 GMT+0100 (Central European Standard Time)'
             * }
         */
            newsletterSubscriptionsGetOne<Config extends Omit<RequestConfigGetOne<modelTypes.NewsletterSubscriptionsModels['Read']>, 'filter'>>(
                filter ?: AsFilter<modelTypes.NewsletterSubscriptionsModels['Write']>, // WRITE HERE because it will ensure referenced fields are passed as their string counterpart
                config ?: Config
            ): Promise<Config['triggerErrorIfNotSet'] extends true ? modelTypes.NewsletterSubscriptionsModels['Read'] : modelTypes.NewsletterSubscriptionsModels['Read'] | undefined>,
                /** Allow to get all ressources with providing a filter as first param
                 * @example
                 * [
                 *   {
                 *     'featuredCryptos': [
                 *       'bangkEuro',
                 *       'bangkEuro'
                 *     ],
                 *     '_id': '6776baf5c7c6e518aae88071',
                 *     'lastUpdateDate': 'Fri Jan 03 2012 13:13:25 GMT+0100 (Central European Standard Time)',
                 *     'lastUpdater': '6776baf5c7c6e518aae88072'
                 *   },
                 *   {
                 *     'featuredCryptos': [
                 *       'bangkEuro',
                 *       'bangkEuro'
                 *     ],
                 *     '_id': '6776baf5c7c6e518aae88071',
                 *     'lastUpdateDate': 'Fri Jan 03 2012 13:13:25 GMT+0100 (Central European Standard Time)',
                 *     'lastUpdater': '6776baf5c7c6e518aae88072'
                 *   }
                 * ]
             */
                appConfigGetAll(
                    filter ?: AsFilter<modelTypes.AppConfigModels['Write']>,
                    config ?: never
                ): Promise<modelTypes.AppConfigModels['Read'][]>
appConfigGetAll<Config extends Omit<RequestConfigRead<modelTypes.AppConfigModels['Read']>, 'filter'>>(
    filter ?: AsFilter<modelTypes.AppConfigModels['Write']>,
    config ?: Config
): Promise<MaybePaginated<modelTypes.AppConfigModels['Read'][], Config>>,
    /** Allow to get the last ressources by creation date
     * @example
     * [
     *   {
     *     'featuredCryptos': [
     *       'bangkEuro',
     *       'bangkEuro'
     *     ],
     *     '_id': '6776baf5c7c6e518aae88071',
     *     'lastUpdateDate': 'Fri Jan 03 2012 13:13:25 GMT+0100 (Central European Standard Time)',
     *     'lastUpdater': '6776baf5c7c6e518aae88072'
     *   },
     *   {
     *     'featuredCryptos': [
     *       'bangkEuro',
     *       'bangkEuro'
     *     ],
     *     '_id': '6776baf5c7c6e518aae88071',
     *     'lastUpdateDate': 'Fri Jan 03 2012 13:13:25 GMT+0100 (Central European Standard Time)',
     *     'lastUpdater': '6776baf5c7c6e518aae88072'
     *   }
     * ]
 */
    appConfigGetLastN(
        limit ?: number,
        config ?: never,
    ): Promise<modelTypes.AppConfigModels['Read'][]>
appConfigGetLastN<Config extends RequestConfigRead<modelTypes.AppConfigModels['Read']>>(
    limit ?: number,
    config ?: Config,
): Promise<MaybePaginated<modelTypes.AppConfigModels['Read'][], Config>>,
    /** Allow to get the first ressources by creation date
     * @example
     * [
     *   {
     *     'featuredCryptos': [
     *       'bangkEuro',
     *       'bangkEuro'
     *     ],
     *     '_id': '6776baf5c7c6e518aae88071',
     *     'lastUpdateDate': 'Fri Jan 03 2012 13:13:25 GMT+0100 (Central European Standard Time)',
     *     'lastUpdater': '6776baf5c7c6e518aae88072'
     *   },
     *   {
     *     'featuredCryptos': [
     *       'bangkEuro',
     *       'bangkEuro'
     *     ],
     *     '_id': '6776baf5c7c6e518aae88071',
     *     'lastUpdateDate': 'Fri Jan 03 2012 13:13:25 GMT+0100 (Central European Standard Time)',
     *     'lastUpdater': '6776baf5c7c6e518aae88072'
     *   }
     * ]
 */
    appConfigGetFirstN(
        limit ?: number,
        config ?: never
    ): Promise<modelTypes.AppConfigModels['Read'][]>
appConfigGetFirstN<Config extends RequestConfigRead<modelTypes.AppConfigModels['Read']>>(
    limit ?: number,
    config ?: Config
): Promise<MaybePaginated<modelTypes.AppConfigModels['Read'][], Config>>,
    /** Count the number of ressources matching the filter in first param or all ressources if no filter is provided
     * @example
     * 12
 */
    appConfigCount(
        filter ?: AsFilter<modelTypes.AppConfigModels['Write']>
    ): Promise<number>,
        /** Allow to get a ressource by it's unique mongoDb _id
         * @errorCodes
         * - 404: ressourceDoesNotExists
         * @example
         * {
         *   'featuredCryptos': [
         *     'bangkEuro',
         *     'bangkEuro'
         *   ],
         *   '_id': '6776baf5c7c6e518aae88071',
         *   'lastUpdateDate': 'Fri Jan 03 2012 13:13:25 GMT+0100 (Central European Standard Time)',
         *   'lastUpdater': '6776baf5c7c6e518aae88072'
         * }
     */
        appConfigGetById<Config extends RequestConfigGetOne<modelTypes.AppConfigModels['Read']>>(
            id: string,
            config ?: Config
        ): Promise<Config['triggerErrorIfNotSet'] extends true ? modelTypes.AppConfigModels['Read'] : modelTypes.AppConfigModels['Read'] | undefined>,
            /** Allow to get a ressource with providing a filter as first param
             * @example
             * {
             *   'featuredCryptos': [
             *     'bangkEuro',
             *     'bangkEuro'
             *   ],
             *   '_id': '6776baf5c7c6e518aae88071',
             *   'lastUpdateDate': 'Fri Jan 03 2012 13:13:25 GMT+0100 (Central European Standard Time)',
             *   'lastUpdater': '6776baf5c7c6e518aae88072'
             * }
         */
            appConfigGetOne<Config extends Omit<RequestConfigGetOne<modelTypes.AppConfigModels['Read']>, 'filter'>>(
                filter ?: AsFilter<modelTypes.AppConfigModels['Write']>, // WRITE HERE because it will ensure referenced fields are passed as their string counterpart
                config ?: Config
            ): Promise<Config['triggerErrorIfNotSet'] extends true ? modelTypes.AppConfigModels['Read'] : modelTypes.AppConfigModels['Read'] | undefined>,
                /** Allow to get all ressources with providing a filter as first param
                 * @example
                 * [
                 *   {
                 *     'name': 'rndmString',
                 *     'nameUnique': 'rndmString',
                 *     'blockchain': 'solana',
                 *     'walletAdress': 'rndmString',
                 *     'assigned': true,
                 *     '_id': '6776baf5c7c6e518aae88071'
                 *   },
                 *   {
                 *     'name': 'rndmString',
                 *     'nameUnique': 'rndmString',
                 *     'blockchain': 'solana',
                 *     'walletAdress': 'rndmString',
                 *     'assigned': true,
                 *     '_id': '6776baf5c7c6e518aae88071'
                 *   }
                 * ]
             */
                bangkWalletsGetAll(
                    filter ?: AsFilter<modelTypes.BangkWalletsModels['Write']>,
                    config ?: never
                ): Promise<modelTypes.BangkWalletsModels['Read'][]>
bangkWalletsGetAll<Config extends Omit<RequestConfigRead<modelTypes.BangkWalletsModels['Read']>, 'filter'>>(
    filter ?: AsFilter<modelTypes.BangkWalletsModels['Write']>,
    config ?: Config
): Promise<MaybePaginated<modelTypes.BangkWalletsModels['Read'][], Config>>,
    /** Allow to get the last ressources by creation date
     * @example
     * [
     *   {
     *     'name': 'rndmString',
     *     'nameUnique': 'rndmString',
     *     'blockchain': 'solana',
     *     'walletAdress': 'rndmString',
     *     'assigned': true,
     *     '_id': '6776baf5c7c6e518aae88071'
     *   },
     *   {
     *     'name': 'rndmString',
     *     'nameUnique': 'rndmString',
     *     'blockchain': 'solana',
     *     'walletAdress': 'rndmString',
     *     'assigned': true,
     *     '_id': '6776baf5c7c6e518aae88071'
     *   }
     * ]
 */
    bangkWalletsGetLastN(
        limit ?: number,
        config ?: never,
    ): Promise<modelTypes.BangkWalletsModels['Read'][]>
bangkWalletsGetLastN<Config extends RequestConfigRead<modelTypes.BangkWalletsModels['Read']>>(
    limit ?: number,
    config ?: Config,
): Promise<MaybePaginated<modelTypes.BangkWalletsModels['Read'][], Config>>,
    /** Allow to get the first ressources by creation date
     * @example
     * [
     *   {
     *     'name': 'rndmString',
     *     'nameUnique': 'rndmString',
     *     'blockchain': 'solana',
     *     'walletAdress': 'rndmString',
     *     'assigned': true,
     *     '_id': '6776baf5c7c6e518aae88071'
     *   },
     *   {
     *     'name': 'rndmString',
     *     'nameUnique': 'rndmString',
     *     'blockchain': 'solana',
     *     'walletAdress': 'rndmString',
     *     'assigned': true,
     *     '_id': '6776baf5c7c6e518aae88071'
     *   }
     * ]
 */
    bangkWalletsGetFirstN(
        limit ?: number,
        config ?: never
    ): Promise<modelTypes.BangkWalletsModels['Read'][]>
bangkWalletsGetFirstN<Config extends RequestConfigRead<modelTypes.BangkWalletsModels['Read']>>(
    limit ?: number,
    config ?: Config
): Promise<MaybePaginated<modelTypes.BangkWalletsModels['Read'][], Config>>,
    /** Count the number of ressources matching the filter in first param or all ressources if no filter is provided
     * @example
     * 12
 */
    bangkWalletsCount(
        filter ?: AsFilter<modelTypes.BangkWalletsModels['Write']>
    ): Promise<number>,
        /** Allow to get a ressource by it's unique mongoDb _id
         * @errorCodes
         * - 404: ressourceDoesNotExists
         * @example
         * {
         *   'name': 'rndmString',
         *   'nameUnique': 'rndmString',
         *   'blockchain': 'solana',
         *   'walletAdress': 'rndmString',
         *   'assigned': true,
         *   '_id': '6776baf5c7c6e518aae88071'
         * }
     */
        bangkWalletsGetById<Config extends RequestConfigGetOne<modelTypes.BangkWalletsModels['Read']>>(
            id: string,
            config ?: Config
        ): Promise<Config['triggerErrorIfNotSet'] extends true ? modelTypes.BangkWalletsModels['Read'] : modelTypes.BangkWalletsModels['Read'] | undefined>,
            /** Allow to get a ressource with providing a filter as first param
             * @example
             * {
             *   'name': 'rndmString',
             *   'nameUnique': 'rndmString',
             *   'blockchain': 'solana',
             *   'walletAdress': 'rndmString',
             *   'assigned': true,
             *   '_id': '6776baf5c7c6e518aae88071'
             * }
         */
            bangkWalletsGetOne<Config extends Omit<RequestConfigGetOne<modelTypes.BangkWalletsModels['Read']>, 'filter'>>(
                filter ?: AsFilter<modelTypes.BangkWalletsModels['Write']>, // WRITE HERE because it will ensure referenced fields are passed as their string counterpart
                config ?: Config
            ): Promise<Config['triggerErrorIfNotSet'] extends true ? modelTypes.BangkWalletsModels['Read'] : modelTypes.BangkWalletsModels['Read'] | undefined>,
                /** Allow to get all ressources with providing a filter as first param
                 * @example
                 * [
                 *   {
                 *     'apiAdress': 'https://noodle.com/',
                 *     '_id': '6776baf5c7c6e518aae88071'
                 *   },
                 *   {
                 *     'apiAdress': 'https://noodle.com/',
                 *     '_id': '6776baf5c7c6e518aae88071'
                 *   }
                 * ]
             */
                blockchainConfigGetAll(
                    filter ?: AsFilter<modelTypes.BlockchainConfigModels['Write']>,
                    config ?: never
                ): Promise<modelTypes.BlockchainConfigModels['Read'][]>
blockchainConfigGetAll<Config extends Omit<RequestConfigRead<modelTypes.BlockchainConfigModels['Read']>, 'filter'>>(
    filter ?: AsFilter<modelTypes.BlockchainConfigModels['Write']>,
    config ?: Config
): Promise<MaybePaginated<modelTypes.BlockchainConfigModels['Read'][], Config>>,
    /** Allow to get the last ressources by creation date
     * @example
     * [
     *   {
     *     'apiAdress': 'https://noodle.com/',
     *     '_id': '6776baf5c7c6e518aae88071'
     *   },
     *   {
     *     'apiAdress': 'https://noodle.com/',
     *     '_id': '6776baf5c7c6e518aae88071'
     *   }
     * ]
 */
    blockchainConfigGetLastN(
        limit ?: number,
        config ?: never,
    ): Promise<modelTypes.BlockchainConfigModels['Read'][]>
blockchainConfigGetLastN<Config extends RequestConfigRead<modelTypes.BlockchainConfigModels['Read']>>(
    limit ?: number,
    config ?: Config,
): Promise<MaybePaginated<modelTypes.BlockchainConfigModels['Read'][], Config>>,
    /** Allow to get the first ressources by creation date
     * @example
     * [
     *   {
     *     'apiAdress': 'https://noodle.com/',
     *     '_id': '6776baf5c7c6e518aae88071'
     *   },
     *   {
     *     'apiAdress': 'https://noodle.com/',
     *     '_id': '6776baf5c7c6e518aae88071'
     *   }
     * ]
 */
    blockchainConfigGetFirstN(
        limit ?: number,
        config ?: never
    ): Promise<modelTypes.BlockchainConfigModels['Read'][]>
blockchainConfigGetFirstN<Config extends RequestConfigRead<modelTypes.BlockchainConfigModels['Read']>>(
    limit ?: number,
    config ?: Config
): Promise<MaybePaginated<modelTypes.BlockchainConfigModels['Read'][], Config>>,
    /** Count the number of ressources matching the filter in first param or all ressources if no filter is provided
     * @example
     * 12
 */
    blockchainConfigCount(
        filter ?: AsFilter<modelTypes.BlockchainConfigModels['Write']>
    ): Promise<number>,
        /** Allow to get a ressource by it's unique mongoDb _id
         * @errorCodes
         * - 404: ressourceDoesNotExists
         * @example
         * {
         *   'apiAdress': 'https://noodle.com/',
         *   '_id': '6776baf5c7c6e518aae88071'
         * }
     */
        blockchainConfigGetById<Config extends RequestConfigGetOne<modelTypes.BlockchainConfigModels['Read']>>(
            id: string,
            config ?: Config
        ): Promise<Config['triggerErrorIfNotSet'] extends true ? modelTypes.BlockchainConfigModels['Read'] : modelTypes.BlockchainConfigModels['Read'] | undefined>,
            /** Allow to get a ressource with providing a filter as first param
             * @example
             * {
             *   'apiAdress': 'https://noodle.com/',
             *   '_id': '6776baf5c7c6e518aae88071'
             * }
         */
            blockchainConfigGetOne<Config extends Omit<RequestConfigGetOne<modelTypes.BlockchainConfigModels['Read']>, 'filter'>>(
                filter ?: AsFilter<modelTypes.BlockchainConfigModels['Write']>, // WRITE HERE because it will ensure referenced fields are passed as their string counterpart
                config ?: Config
            ): Promise<Config['triggerErrorIfNotSet'] extends true ? modelTypes.BlockchainConfigModels['Read'] : modelTypes.BlockchainConfigModels['Read'] | undefined>,
                /** Allow to get all ressources with providing a filter as first param
                 * @example
                 * [
                 *   {
                 *     'last4digits': 'rndmString',
                 *     '_id': '6776baf5c7c6e518aae88071',
                 *     'creationDate': 'Fri Jan 03 2012 13:13:25 GMT+0100 (Central European Standard Time)',
                 *     'creator': '6776baf5c7c6e518aae88072'
                 *   },
                 *   {
                 *     'last4digits': 'rndmString',
                 *     '_id': '6776baf5c7c6e518aae88071',
                 *     'creationDate': 'Fri Jan 03 2012 13:13:25 GMT+0100 (Central European Standard Time)',
                 *     'creator': '6776baf5c7c6e518aae88072'
                 *   }
                 * ]
             */
                cardGetAll(
                    filter ?: AsFilter<modelTypes.CardModels['Write']>,
                    config ?: never
                ): Promise<modelTypes.CardModels['Read'][]>
cardGetAll<Config extends Omit<RequestConfigRead<modelTypes.CardModels['Read']>, 'filter'>>(
    filter ?: AsFilter<modelTypes.CardModels['Write']>,
    config ?: Config
): Promise<MaybePaginated<modelTypes.CardModels['Read'][], Config>>,
    /** Allow to get the last ressources by creation date
     * @example
     * [
     *   {
     *     'last4digits': 'rndmString',
     *     '_id': '6776baf5c7c6e518aae88071',
     *     'creationDate': 'Fri Jan 03 2012 13:13:25 GMT+0100 (Central European Standard Time)',
     *     'creator': '6776baf5c7c6e518aae88072'
     *   },
     *   {
     *     'last4digits': 'rndmString',
     *     '_id': '6776baf5c7c6e518aae88071',
     *     'creationDate': 'Fri Jan 03 2012 13:13:25 GMT+0100 (Central European Standard Time)',
     *     'creator': '6776baf5c7c6e518aae88072'
     *   }
     * ]
 */
    cardGetLastN(
        limit ?: number,
        config ?: never,
    ): Promise<modelTypes.CardModels['Read'][]>
cardGetLastN<Config extends RequestConfigRead<modelTypes.CardModels['Read']>>(
    limit ?: number,
    config ?: Config,
): Promise<MaybePaginated<modelTypes.CardModels['Read'][], Config>>,
    /** Allow to get the first ressources by creation date
     * @example
     * [
     *   {
     *     'last4digits': 'rndmString',
     *     '_id': '6776baf5c7c6e518aae88071',
     *     'creationDate': 'Fri Jan 03 2012 13:13:25 GMT+0100 (Central European Standard Time)',
     *     'creator': '6776baf5c7c6e518aae88072'
     *   },
     *   {
     *     'last4digits': 'rndmString',
     *     '_id': '6776baf5c7c6e518aae88071',
     *     'creationDate': 'Fri Jan 03 2012 13:13:25 GMT+0100 (Central European Standard Time)',
     *     'creator': '6776baf5c7c6e518aae88072'
     *   }
     * ]
 */
    cardGetFirstN(
        limit ?: number,
        config ?: never
    ): Promise<modelTypes.CardModels['Read'][]>
cardGetFirstN<Config extends RequestConfigRead<modelTypes.CardModels['Read']>>(
    limit ?: number,
    config ?: Config
): Promise<MaybePaginated<modelTypes.CardModels['Read'][], Config>>,
    /** Count the number of ressources matching the filter in first param or all ressources if no filter is provided
     * @example
     * 12
 */
    cardCount(
        filter ?: AsFilter<modelTypes.CardModels['Write']>
    ): Promise<number>,
        /** Allow to get a ressource by it's unique mongoDb _id
         * @errorCodes
         * - 404: ressourceDoesNotExists
         * @example
         * {
         *   'last4digits': 'rndmString',
         *   '_id': '6776baf5c7c6e518aae88071',
         *   'creationDate': 'Fri Jan 03 2012 13:13:25 GMT+0100 (Central European Standard Time)',
         *   'creator': '6776baf5c7c6e518aae88072'
         * }
     */
        cardGetById<Config extends RequestConfigGetOne<modelTypes.CardModels['Read']>>(
            id: string,
            config ?: Config
        ): Promise<Config['triggerErrorIfNotSet'] extends true ? modelTypes.CardModels['Read'] : modelTypes.CardModels['Read'] | undefined>,
            /** Allow to get a ressource with providing a filter as first param
             * @example
             * {
             *   'last4digits': 'rndmString',
             *   '_id': '6776baf5c7c6e518aae88071',
             *   'creationDate': 'Fri Jan 03 2012 13:13:25 GMT+0100 (Central European Standard Time)',
             *   'creator': '6776baf5c7c6e518aae88072'
             * }
         */
            cardGetOne<Config extends Omit<RequestConfigGetOne<modelTypes.CardModels['Read']>, 'filter'>>(
                filter ?: AsFilter<modelTypes.CardModels['Write']>, // WRITE HERE because it will ensure referenced fields are passed as their string counterpart
                config ?: Config
            ): Promise<Config['triggerErrorIfNotSet'] extends true ? modelTypes.CardModels['Read'] : modelTypes.CardModels['Read'] | undefined>,
                /** Allow to get all ressources with providing a filter as first param
                 * @example
                 * [
                 *   {
                 *     'user': '6776baf5c7c6e518aae88072',
                 *     'title': 'rndmString',
                 *     'type': 'cardPayment',
                 *     'status': 'pending',
                 *     'amount': 12,
                 *     '_id': '6776baf5c7c6e518aae88071',
                 *     'creationDate': 'Fri Jan 03 2012 13:13:25 GMT+0100 (Central European Standard Time)',
                 *     'lastUpdateDate': 'Fri Jan 03 2012 13:13:25 GMT+0100 (Central European Standard Time)',
                 *     'lastUpdater': '6776baf5c7c6e518aae88072'
                 *   },
                 *   {
                 *     'user': '6776baf5c7c6e518aae88072',
                 *     'title': 'rndmString',
                 *     'type': 'cardPayment',
                 *     'status': 'pending',
                 *     'amount': 12,
                 *     '_id': '6776baf5c7c6e518aae88071',
                 *     'creationDate': 'Fri Jan 03 2012 13:13:25 GMT+0100 (Central European Standard Time)',
                 *     'lastUpdateDate': 'Fri Jan 03 2012 13:13:25 GMT+0100 (Central European Standard Time)',
                 *     'lastUpdater': '6776baf5c7c6e518aae88072'
                 *   }
                 * ]
             */
                cardTransactionGetAll(
                    filter ?: AsFilter<modelTypes.CardTransactionModels['Write']>,
                    config ?: never
                ): Promise<modelTypes.CardTransactionModels['Read'][]>
cardTransactionGetAll<Config extends Omit<RequestConfigRead<modelTypes.CardTransactionModels['Read']>, 'filter'>>(
    filter ?: AsFilter<modelTypes.CardTransactionModels['Write']>,
    config ?: Config
): Promise<MaybePaginated<modelTypes.CardTransactionModels['Read'][], Config>>,
    /** Allow to get the last ressources by creation date
     * @example
     * [
     *   {
     *     'user': '6776baf5c7c6e518aae88072',
     *     'title': 'rndmString',
     *     'type': 'cardPayment',
     *     'status': 'pending',
     *     'amount': 12,
     *     '_id': '6776baf5c7c6e518aae88071',
     *     'creationDate': 'Fri Jan 03 2012 13:13:25 GMT+0100 (Central European Standard Time)',
     *     'lastUpdateDate': 'Fri Jan 03 2012 13:13:25 GMT+0100 (Central European Standard Time)',
     *     'lastUpdater': '6776baf5c7c6e518aae88072'
     *   },
     *   {
     *     'user': '6776baf5c7c6e518aae88072',
     *     'title': 'rndmString',
     *     'type': 'cardPayment',
     *     'status': 'pending',
     *     'amount': 12,
     *     '_id': '6776baf5c7c6e518aae88071',
     *     'creationDate': 'Fri Jan 03 2012 13:13:25 GMT+0100 (Central European Standard Time)',
     *     'lastUpdateDate': 'Fri Jan 03 2012 13:13:25 GMT+0100 (Central European Standard Time)',
     *     'lastUpdater': '6776baf5c7c6e518aae88072'
     *   }
     * ]
 */
    cardTransactionGetLastN(
        limit ?: number,
        config ?: never,
    ): Promise<modelTypes.CardTransactionModels['Read'][]>
cardTransactionGetLastN<Config extends RequestConfigRead<modelTypes.CardTransactionModels['Read']>>(
    limit ?: number,
    config ?: Config,
): Promise<MaybePaginated<modelTypes.CardTransactionModels['Read'][], Config>>,
    /** Allow to get the first ressources by creation date
     * @example
     * [
     *   {
     *     'user': '6776baf5c7c6e518aae88072',
     *     'title': 'rndmString',
     *     'type': 'cardPayment',
     *     'status': 'pending',
     *     'amount': 12,
     *     '_id': '6776baf5c7c6e518aae88071',
     *     'creationDate': 'Fri Jan 03 2012 13:13:25 GMT+0100 (Central European Standard Time)',
     *     'lastUpdateDate': 'Fri Jan 03 2012 13:13:25 GMT+0100 (Central European Standard Time)',
     *     'lastUpdater': '6776baf5c7c6e518aae88072'
     *   },
     *   {
     *     'user': '6776baf5c7c6e518aae88072',
     *     'title': 'rndmString',
     *     'type': 'cardPayment',
     *     'status': 'pending',
     *     'amount': 12,
     *     '_id': '6776baf5c7c6e518aae88071',
     *     'creationDate': 'Fri Jan 03 2012 13:13:25 GMT+0100 (Central European Standard Time)',
     *     'lastUpdateDate': 'Fri Jan 03 2012 13:13:25 GMT+0100 (Central European Standard Time)',
     *     'lastUpdater': '6776baf5c7c6e518aae88072'
     *   }
     * ]
 */
    cardTransactionGetFirstN(
        limit ?: number,
        config ?: never
    ): Promise<modelTypes.CardTransactionModels['Read'][]>
cardTransactionGetFirstN<Config extends RequestConfigRead<modelTypes.CardTransactionModels['Read']>>(
    limit ?: number,
    config ?: Config
): Promise<MaybePaginated<modelTypes.CardTransactionModels['Read'][], Config>>,
    /** Count the number of ressources matching the filter in first param or all ressources if no filter is provided
     * @example
     * 12
 */
    cardTransactionCount(
        filter ?: AsFilter<modelTypes.CardTransactionModels['Write']>
    ): Promise<number>,
        /** Allow to get a ressource by it's unique mongoDb _id
         * @errorCodes
         * - 404: ressourceDoesNotExists
         * @example
         * {
         *   'user': '6776baf5c7c6e518aae88072',
         *   'title': 'rndmString',
         *   'type': 'cardPayment',
         *   'status': 'pending',
         *   'amount': 12,
         *   '_id': '6776baf5c7c6e518aae88071',
         *   'creationDate': 'Fri Jan 03 2012 13:13:25 GMT+0100 (Central European Standard Time)',
         *   'lastUpdateDate': 'Fri Jan 03 2012 13:13:25 GMT+0100 (Central European Standard Time)',
         *   'lastUpdater': '6776baf5c7c6e518aae88072'
         * }
     */
        cardTransactionGetById<Config extends RequestConfigGetOne<modelTypes.CardTransactionModels['Read']>>(
            id: string,
            config ?: Config
        ): Promise<Config['triggerErrorIfNotSet'] extends true ? modelTypes.CardTransactionModels['Read'] : modelTypes.CardTransactionModels['Read'] | undefined>,
            /** Allow to get a ressource with providing a filter as first param
             * @example
             * {
             *   'user': '6776baf5c7c6e518aae88072',
             *   'title': 'rndmString',
             *   'type': 'cardPayment',
             *   'status': 'pending',
             *   'amount': 12,
             *   '_id': '6776baf5c7c6e518aae88071',
             *   'creationDate': 'Fri Jan 03 2012 13:13:25 GMT+0100 (Central European Standard Time)',
             *   'lastUpdateDate': 'Fri Jan 03 2012 13:13:25 GMT+0100 (Central European Standard Time)',
             *   'lastUpdater': '6776baf5c7c6e518aae88072'
             * }
         */
            cardTransactionGetOne<Config extends Omit<RequestConfigGetOne<modelTypes.CardTransactionModels['Read']>, 'filter'>>(
                filter ?: AsFilter<modelTypes.CardTransactionModels['Write']>, // WRITE HERE because it will ensure referenced fields are passed as their string counterpart
                config ?: Config
            ): Promise<Config['triggerErrorIfNotSet'] extends true ? modelTypes.CardTransactionModels['Read'] : modelTypes.CardTransactionModels['Read'] | undefined>,
                /** Allow to get all ressources with providing a filter as first param
                 * @example
                 * [
                 *   {
                 *     'name': 'rndmString',
                 *     'activitySector': {
                 *       'fr': 'Bonjour',
                 *       'en': 'Hello'
                 *     },
                 *     'representative': '6776baf5c7c6e518aae88072',
                 *     'registrationCountry': 'rndmString',
                 *     'geographyScope': 'national',
                 *     'companyCreationDate': 'Fri Jan 03 2012 13:13:25 GMT+0100 (Central European Standard Time)',
                 *     'companyIdenfier': 'rndmString',
                 *     'address': {
                 *       'street': 'rndmString',
                 *       'zipCode': 'rndmString',
                 *       'city': 'rndmString',
                 *       'country': 'rndmString'
                 *     },
                 *     '_id': '6776baf5c7c6e518aae88071',
                 *     'creationDate': 'Fri Jan 03 2012 13:13:25 GMT+0100 (Central European Standard Time)'
                 *   },
                 *   {
                 *     'name': 'rndmString',
                 *     'activitySector': {
                 *       'fr': 'Bonjour',
                 *       'en': 'Hello'
                 *     },
                 *     'representative': '6776baf5c7c6e518aae88072',
                 *     'registrationCountry': 'rndmString',
                 *     'geographyScope': 'national',
                 *     'companyCreationDate': 'Fri Jan 03 2012 13:13:25 GMT+0100 (Central European Standard Time)',
                 *     'companyIdenfier': 'rndmString',
                 *     'address': {
                 *       'street': 'rndmString',
                 *       'zipCode': 'rndmString',
                 *       'city': 'rndmString',
                 *       'country': 'rndmString'
                 *     },
                 *     '_id': '6776baf5c7c6e518aae88071',
                 *     'creationDate': 'Fri Jan 03 2012 13:13:25 GMT+0100 (Central European Standard Time)'
                 *   }
                 * ]
             */
                companyGetAll(
                    filter ?: AsFilter<modelTypes.CompanyModels['Write']>,
                    config ?: never
                ): Promise<modelTypes.CompanyModels['Read'][]>
companyGetAll<Config extends Omit<RequestConfigRead<modelTypes.CompanyModels['Read']>, 'filter'>>(
    filter ?: AsFilter<modelTypes.CompanyModels['Write']>,
    config ?: Config
): Promise<MaybePaginated<modelTypes.CompanyModels['Read'][], Config>>,
    /** Allow to get the last ressources by creation date
     * @example
     * [
     *   {
     *     'name': 'rndmString',
     *     'activitySector': {
     *       'fr': 'Bonjour',
     *       'en': 'Hello'
     *     },
     *     'representative': '6776baf5c7c6e518aae88072',
     *     'registrationCountry': 'rndmString',
     *     'geographyScope': 'national',
     *     'companyCreationDate': 'Fri Jan 03 2012 13:13:25 GMT+0100 (Central European Standard Time)',
     *     'companyIdenfier': 'rndmString',
     *     'address': {
     *       'street': 'rndmString',
     *       'zipCode': 'rndmString',
     *       'city': 'rndmString',
     *       'country': 'rndmString'
     *     },
     *     '_id': '6776baf5c7c6e518aae88071',
     *     'creationDate': 'Fri Jan 03 2012 13:13:25 GMT+0100 (Central European Standard Time)'
     *   },
     *   {
     *     'name': 'rndmString',
     *     'activitySector': {
     *       'fr': 'Bonjour',
     *       'en': 'Hello'
     *     },
     *     'representative': '6776baf5c7c6e518aae88072',
     *     'registrationCountry': 'rndmString',
     *     'geographyScope': 'national',
     *     'companyCreationDate': 'Fri Jan 03 2012 13:13:25 GMT+0100 (Central European Standard Time)',
     *     'companyIdenfier': 'rndmString',
     *     'address': {
     *       'street': 'rndmString',
     *       'zipCode': 'rndmString',
     *       'city': 'rndmString',
     *       'country': 'rndmString'
     *     },
     *     '_id': '6776baf5c7c6e518aae88071',
     *     'creationDate': 'Fri Jan 03 2012 13:13:25 GMT+0100 (Central European Standard Time)'
     *   }
     * ]
 */
    companyGetLastN(
        limit ?: number,
        config ?: never,
    ): Promise<modelTypes.CompanyModels['Read'][]>
companyGetLastN<Config extends RequestConfigRead<modelTypes.CompanyModels['Read']>>(
    limit ?: number,
    config ?: Config,
): Promise<MaybePaginated<modelTypes.CompanyModels['Read'][], Config>>,
    /** Allow to get the first ressources by creation date
     * @example
     * [
     *   {
     *     'name': 'rndmString',
     *     'activitySector': {
     *       'fr': 'Bonjour',
     *       'en': 'Hello'
     *     },
     *     'representative': '6776baf5c7c6e518aae88072',
     *     'registrationCountry': 'rndmString',
     *     'geographyScope': 'national',
     *     'companyCreationDate': 'Fri Jan 03 2012 13:13:25 GMT+0100 (Central European Standard Time)',
     *     'companyIdenfier': 'rndmString',
     *     'address': {
     *       'street': 'rndmString',
     *       'zipCode': 'rndmString',
     *       'city': 'rndmString',
     *       'country': 'rndmString'
     *     },
     *     '_id': '6776baf5c7c6e518aae88071',
     *     'creationDate': 'Fri Jan 03 2012 13:13:25 GMT+0100 (Central European Standard Time)'
     *   },
     *   {
     *     'name': 'rndmString',
     *     'activitySector': {
     *       'fr': 'Bonjour',
     *       'en': 'Hello'
     *     },
     *     'representative': '6776baf5c7c6e518aae88072',
     *     'registrationCountry': 'rndmString',
     *     'geographyScope': 'national',
     *     'companyCreationDate': 'Fri Jan 03 2012 13:13:25 GMT+0100 (Central European Standard Time)',
     *     'companyIdenfier': 'rndmString',
     *     'address': {
     *       'street': 'rndmString',
     *       'zipCode': 'rndmString',
     *       'city': 'rndmString',
     *       'country': 'rndmString'
     *     },
     *     '_id': '6776baf5c7c6e518aae88071',
     *     'creationDate': 'Fri Jan 03 2012 13:13:25 GMT+0100 (Central European Standard Time)'
     *   }
     * ]
 */
    companyGetFirstN(
        limit ?: number,
        config ?: never
    ): Promise<modelTypes.CompanyModels['Read'][]>
companyGetFirstN<Config extends RequestConfigRead<modelTypes.CompanyModels['Read']>>(
    limit ?: number,
    config ?: Config
): Promise<MaybePaginated<modelTypes.CompanyModels['Read'][], Config>>,
    /** Count the number of ressources matching the filter in first param or all ressources if no filter is provided
     * @example
     * 12
 */
    companyCount(
        filter ?: AsFilter<modelTypes.CompanyModels['Write']>
    ): Promise<number>,
        /** Allow to get a ressource by it's unique mongoDb _id
         * @errorCodes
         * - 404: ressourceDoesNotExists
         * @example
         * {
         *   'name': 'rndmString',
         *   'activitySector': {
         *     'fr': 'Bonjour',
         *     'en': 'Hello'
         *   },
         *   'representative': '6776baf5c7c6e518aae88072',
         *   'registrationCountry': 'rndmString',
         *   'geographyScope': 'national',
         *   'companyCreationDate': 'Fri Jan 03 2012 13:13:25 GMT+0100 (Central European Standard Time)',
         *   'companyIdenfier': 'rndmString',
         *   'address': {
         *     'street': 'rndmString',
         *     'zipCode': 'rndmString',
         *     'city': 'rndmString',
         *     'country': 'rndmString'
         *   },
         *   '_id': '6776baf5c7c6e518aae88071',
         *   'creationDate': 'Fri Jan 03 2012 13:13:25 GMT+0100 (Central European Standard Time)'
         * }
     */
        companyGetById<Config extends RequestConfigGetOne<modelTypes.CompanyModels['Read']>>(
            id: string,
            config ?: Config
        ): Promise<Config['triggerErrorIfNotSet'] extends true ? modelTypes.CompanyModels['Read'] : modelTypes.CompanyModels['Read'] | undefined>,
            /** Allow to get a ressource with providing a filter as first param
             * @example
             * {
             *   'name': 'rndmString',
             *   'activitySector': {
             *     'fr': 'Bonjour',
             *     'en': 'Hello'
             *   },
             *   'representative': '6776baf5c7c6e518aae88072',
             *   'registrationCountry': 'rndmString',
             *   'geographyScope': 'national',
             *   'companyCreationDate': 'Fri Jan 03 2012 13:13:25 GMT+0100 (Central European Standard Time)',
             *   'companyIdenfier': 'rndmString',
             *   'address': {
             *     'street': 'rndmString',
             *     'zipCode': 'rndmString',
             *     'city': 'rndmString',
             *     'country': 'rndmString'
             *   },
             *   '_id': '6776baf5c7c6e518aae88071',
             *   'creationDate': 'Fri Jan 03 2012 13:13:25 GMT+0100 (Central European Standard Time)'
             * }
         */
            companyGetOne<Config extends Omit<RequestConfigGetOne<modelTypes.CompanyModels['Read']>, 'filter'>>(
                filter ?: AsFilter<modelTypes.CompanyModels['Write']>, // WRITE HERE because it will ensure referenced fields are passed as their string counterpart
                config ?: Config
            ): Promise<Config['triggerErrorIfNotSet'] extends true ? modelTypes.CompanyModels['Read'] : modelTypes.CompanyModels['Read'] | undefined>,
                /** Allow to get all ressources with providing a filter as first param
                 * @example
                 * [
                 *   {
                 *     'domain': 'rndmString',
                 *     'route': 'rndmString',
                 *     'parentIndex': 12,
                 *     'x': 12,
                 *     'y': 12,
                 *     'content': 'rndmString',
                 *     'userId': 'rndmString',
                 *     'issueUrl': 'https://noodle.com/',
                 *     '_id': '6776baf5c7c6e518aae88071'
                 *   },
                 *   {
                 *     'domain': 'rndmString',
                 *     'route': 'rndmString',
                 *     'parentIndex': 12,
                 *     'x': 12,
                 *     'y': 12,
                 *     'content': 'rndmString',
                 *     'userId': 'rndmString',
                 *     'issueUrl': 'https://noodle.com/',
                 *     '_id': '6776baf5c7c6e518aae88071'
                 *   }
                 * ]
             */
                devCommentGetAll(
                    filter ?: AsFilter<modelTypes.DevCommentModels['Write']>,
                    config ?: never
                ): Promise<modelTypes.DevCommentModels['Read'][]>
devCommentGetAll<Config extends Omit<RequestConfigRead<modelTypes.DevCommentModels['Read']>, 'filter'>>(
    filter ?: AsFilter<modelTypes.DevCommentModels['Write']>,
    config ?: Config
): Promise<MaybePaginated<modelTypes.DevCommentModels['Read'][], Config>>,
    /** Allow to get the last ressources by creation date
     * @example
     * [
     *   {
     *     'domain': 'rndmString',
     *     'route': 'rndmString',
     *     'parentIndex': 12,
     *     'x': 12,
     *     'y': 12,
     *     'content': 'rndmString',
     *     'userId': 'rndmString',
     *     'issueUrl': 'https://noodle.com/',
     *     '_id': '6776baf5c7c6e518aae88071'
     *   },
     *   {
     *     'domain': 'rndmString',
     *     'route': 'rndmString',
     *     'parentIndex': 12,
     *     'x': 12,
     *     'y': 12,
     *     'content': 'rndmString',
     *     'userId': 'rndmString',
     *     'issueUrl': 'https://noodle.com/',
     *     '_id': '6776baf5c7c6e518aae88071'
     *   }
     * ]
 */
    devCommentGetLastN(
        limit ?: number,
        config ?: never,
    ): Promise<modelTypes.DevCommentModels['Read'][]>
devCommentGetLastN<Config extends RequestConfigRead<modelTypes.DevCommentModels['Read']>>(
    limit ?: number,
    config ?: Config,
): Promise<MaybePaginated<modelTypes.DevCommentModels['Read'][], Config>>,
    /** Allow to get the first ressources by creation date
     * @example
     * [
     *   {
     *     'domain': 'rndmString',
     *     'route': 'rndmString',
     *     'parentIndex': 12,
     *     'x': 12,
     *     'y': 12,
     *     'content': 'rndmString',
     *     'userId': 'rndmString',
     *     'issueUrl': 'https://noodle.com/',
     *     '_id': '6776baf5c7c6e518aae88071'
     *   },
     *   {
     *     'domain': 'rndmString',
     *     'route': 'rndmString',
     *     'parentIndex': 12,
     *     'x': 12,
     *     'y': 12,
     *     'content': 'rndmString',
     *     'userId': 'rndmString',
     *     'issueUrl': 'https://noodle.com/',
     *     '_id': '6776baf5c7c6e518aae88071'
     *   }
     * ]
 */
    devCommentGetFirstN(
        limit ?: number,
        config ?: never
    ): Promise<modelTypes.DevCommentModels['Read'][]>
devCommentGetFirstN<Config extends RequestConfigRead<modelTypes.DevCommentModels['Read']>>(
    limit ?: number,
    config ?: Config
): Promise<MaybePaginated<modelTypes.DevCommentModels['Read'][], Config>>,
    /** Count the number of ressources matching the filter in first param or all ressources if no filter is provided
     * @example
     * 12
 */
    devCommentCount(
        filter ?: AsFilter<modelTypes.DevCommentModels['Write']>
    ): Promise<number>,
        /** Allow to get a ressource by it's unique mongoDb _id
         * @errorCodes
         * - 404: ressourceDoesNotExists
         * @example
         * {
         *   'domain': 'rndmString',
         *   'route': 'rndmString',
         *   'parentIndex': 12,
         *   'x': 12,
         *   'y': 12,
         *   'content': 'rndmString',
         *   'userId': 'rndmString',
         *   'issueUrl': 'https://noodle.com/',
         *   '_id': '6776baf5c7c6e518aae88071'
         * }
     */
        devCommentGetById<Config extends RequestConfigGetOne<modelTypes.DevCommentModels['Read']>>(
            id: string,
            config ?: Config
        ): Promise<Config['triggerErrorIfNotSet'] extends true ? modelTypes.DevCommentModels['Read'] : modelTypes.DevCommentModels['Read'] | undefined>,
            /** Allow to get a ressource with providing a filter as first param
             * @example
             * {
             *   'domain': 'rndmString',
             *   'route': 'rndmString',
             *   'parentIndex': 12,
             *   'x': 12,
             *   'y': 12,
             *   'content': 'rndmString',
             *   'userId': 'rndmString',
             *   'issueUrl': 'https://noodle.com/',
             *   '_id': '6776baf5c7c6e518aae88071'
             * }
         */
            devCommentGetOne<Config extends Omit<RequestConfigGetOne<modelTypes.DevCommentModels['Read']>, 'filter'>>(
                filter ?: AsFilter<modelTypes.DevCommentModels['Write']>, // WRITE HERE because it will ensure referenced fields are passed as their string counterpart
                config ?: Config
            ): Promise<Config['triggerErrorIfNotSet'] extends true ? modelTypes.DevCommentModels['Read'] : modelTypes.DevCommentModels['Read'] | undefined>,
                /** Allow to get all ressources with providing a filter as first param
                 * @example
                 * [
                 *   {
                 *     'user': '6776baf5c7c6e518aae88072',
                 *     'deviceName': 'rndmString',
                 *     'deviceType': 'desktop',
                 *     'os': 'ios',
                 *     'browser': 'firefox',
                 *     'pixelHeight': 12,
                 *     'pixelWidth': 12,
                 *     'language': 'rndmString',
                 *     'deviceInfos': {},
                 *     '_id': '6776baf5c7c6e518aae88071'
                 *   },
                 *   {
                 *     'user': '6776baf5c7c6e518aae88072',
                 *     'deviceName': 'rndmString',
                 *     'deviceType': 'desktop',
                 *     'os': 'ios',
                 *     'browser': 'firefox',
                 *     'pixelHeight': 12,
                 *     'pixelWidth': 12,
                 *     'language': 'rndmString',
                 *     'deviceInfos': {},
                 *     '_id': '6776baf5c7c6e518aae88071'
                 *   }
                 * ]
             */
                deviceGetAll(
                    filter ?: AsFilter<modelTypes.DeviceModels['Write']>,
                    config ?: never
                ): Promise<modelTypes.DeviceModels['Read'][]>
deviceGetAll<Config extends Omit<RequestConfigRead<modelTypes.DeviceModels['Read']>, 'filter'>>(
    filter ?: AsFilter<modelTypes.DeviceModels['Write']>,
    config ?: Config
): Promise<MaybePaginated<modelTypes.DeviceModels['Read'][], Config>>,
    /** Allow to get the last ressources by creation date
     * @example
     * [
     *   {
     *     'user': '6776baf5c7c6e518aae88072',
     *     'deviceName': 'rndmString',
     *     'deviceType': 'desktop',
     *     'os': 'ios',
     *     'browser': 'firefox',
     *     'pixelHeight': 12,
     *     'pixelWidth': 12,
     *     'language': 'rndmString',
     *     'deviceInfos': {},
     *     '_id': '6776baf5c7c6e518aae88071'
     *   },
     *   {
     *     'user': '6776baf5c7c6e518aae88072',
     *     'deviceName': 'rndmString',
     *     'deviceType': 'desktop',
     *     'os': 'ios',
     *     'browser': 'firefox',
     *     'pixelHeight': 12,
     *     'pixelWidth': 12,
     *     'language': 'rndmString',
     *     'deviceInfos': {},
     *     '_id': '6776baf5c7c6e518aae88071'
     *   }
     * ]
 */
    deviceGetLastN(
        limit ?: number,
        config ?: never,
    ): Promise<modelTypes.DeviceModels['Read'][]>
deviceGetLastN<Config extends RequestConfigRead<modelTypes.DeviceModels['Read']>>(
    limit ?: number,
    config ?: Config,
): Promise<MaybePaginated<modelTypes.DeviceModels['Read'][], Config>>,
    /** Allow to get the first ressources by creation date
     * @example
     * [
     *   {
     *     'user': '6776baf5c7c6e518aae88072',
     *     'deviceName': 'rndmString',
     *     'deviceType': 'desktop',
     *     'os': 'ios',
     *     'browser': 'firefox',
     *     'pixelHeight': 12,
     *     'pixelWidth': 12,
     *     'language': 'rndmString',
     *     'deviceInfos': {},
     *     '_id': '6776baf5c7c6e518aae88071'
     *   },
     *   {
     *     'user': '6776baf5c7c6e518aae88072',
     *     'deviceName': 'rndmString',
     *     'deviceType': 'desktop',
     *     'os': 'ios',
     *     'browser': 'firefox',
     *     'pixelHeight': 12,
     *     'pixelWidth': 12,
     *     'language': 'rndmString',
     *     'deviceInfos': {},
     *     '_id': '6776baf5c7c6e518aae88071'
     *   }
     * ]
 */
    deviceGetFirstN(
        limit ?: number,
        config ?: never
    ): Promise<modelTypes.DeviceModels['Read'][]>
deviceGetFirstN<Config extends RequestConfigRead<modelTypes.DeviceModels['Read']>>(
    limit ?: number,
    config ?: Config
): Promise<MaybePaginated<modelTypes.DeviceModels['Read'][], Config>>,
    /** Count the number of ressources matching the filter in first param or all ressources if no filter is provided
     * @example
     * 12
 */
    deviceCount(
        filter ?: AsFilter<modelTypes.DeviceModels['Write']>
    ): Promise<number>,
        /** Allow to get a ressource by it's unique mongoDb _id
         * @errorCodes
         * - 404: ressourceDoesNotExists
         * @example
         * {
         *   'user': '6776baf5c7c6e518aae88072',
         *   'deviceName': 'rndmString',
         *   'deviceType': 'desktop',
         *   'os': 'ios',
         *   'browser': 'firefox',
         *   'pixelHeight': 12,
         *   'pixelWidth': 12,
         *   'language': 'rndmString',
         *   'deviceInfos': {},
         *   '_id': '6776baf5c7c6e518aae88071'
         * }
     */
        deviceGetById<Config extends RequestConfigGetOne<modelTypes.DeviceModels['Read']>>(
            id: string,
            config ?: Config
        ): Promise<Config['triggerErrorIfNotSet'] extends true ? modelTypes.DeviceModels['Read'] : modelTypes.DeviceModels['Read'] | undefined>,
            /** Allow to get a ressource with providing a filter as first param
             * @example
             * {
             *   'user': '6776baf5c7c6e518aae88072',
             *   'deviceName': 'rndmString',
             *   'deviceType': 'desktop',
             *   'os': 'ios',
             *   'browser': 'firefox',
             *   'pixelHeight': 12,
             *   'pixelWidth': 12,
             *   'language': 'rndmString',
             *   'deviceInfos': {},
             *   '_id': '6776baf5c7c6e518aae88071'
             * }
         */
            deviceGetOne<Config extends Omit<RequestConfigGetOne<modelTypes.DeviceModels['Read']>, 'filter'>>(
                filter ?: AsFilter<modelTypes.DeviceModels['Write']>, // WRITE HERE because it will ensure referenced fields are passed as their string counterpart
                config ?: Config
            ): Promise<Config['triggerErrorIfNotSet'] extends true ? modelTypes.DeviceModels['Read'] : modelTypes.DeviceModels['Read'] | undefined>,
                /** Allow to get all ressources with providing a filter as first param
                 * @example
                 * [
                 *   {
                 *     'code': 'rndmString',
                 *     'type': 'onReferredFirstTransaction',
                 *     'description': 'rndmString',
                 *     'valueType': 'value',
                 *     'value': 12,
                 *     'expiresOn': 'Fri Jan 03 2012 13:13:25 GMT+0100 (Central European Standard Time)',
                 *     'isOneShot': true,
                 *     'status': 'active',
                 *     'createdBy': '6776baf5c7c6e518aae88072',
                 *     'onlyForUser': '6776baf5c7c6e518aae88072',
                 *     'maximumUses': 12,
                 *     'vestingConfig': '6776baf5c7c6e518aae88072',
                 *     '_id': '6776baf5c7c6e518aae88071'
                 *   },
                 *   {
                 *     'code': 'rndmString',
                 *     'type': 'onReferredFirstTransaction',
                 *     'description': 'rndmString',
                 *     'valueType': 'value',
                 *     'value': 12,
                 *     'expiresOn': 'Fri Jan 03 2012 13:13:25 GMT+0100 (Central European Standard Time)',
                 *     'isOneShot': true,
                 *     'status': 'active',
                 *     'createdBy': '6776baf5c7c6e518aae88072',
                 *     'onlyForUser': '6776baf5c7c6e518aae88072',
                 *     'maximumUses': 12,
                 *     'vestingConfig': '6776baf5c7c6e518aae88072',
                 *     '_id': '6776baf5c7c6e518aae88071'
                 *   }
                 * ]
             */
                icoBonusCodeGetAll(
                    filter ?: AsFilter<modelTypes.IcoBonusCodeModels['Write']>,
                    config ?: never
                ): Promise<modelTypes.IcoBonusCodeModels['Read'][]>
icoBonusCodeGetAll<Config extends Omit<RequestConfigRead<modelTypes.IcoBonusCodeModels['Read']>, 'filter'>>(
    filter ?: AsFilter<modelTypes.IcoBonusCodeModels['Write']>,
    config ?: Config
): Promise<MaybePaginated<modelTypes.IcoBonusCodeModels['Read'][], Config>>,
    /** Allow to get the last ressources by creation date
     * @example
     * [
     *   {
     *     'code': 'rndmString',
     *     'type': 'onReferredFirstTransaction',
     *     'description': 'rndmString',
     *     'valueType': 'value',
     *     'value': 12,
     *     'expiresOn': 'Fri Jan 03 2012 13:13:25 GMT+0100 (Central European Standard Time)',
     *     'isOneShot': true,
     *     'status': 'active',
     *     'createdBy': '6776baf5c7c6e518aae88072',
     *     'onlyForUser': '6776baf5c7c6e518aae88072',
     *     'maximumUses': 12,
     *     'vestingConfig': '6776baf5c7c6e518aae88072',
     *     '_id': '6776baf5c7c6e518aae88071'
     *   },
     *   {
     *     'code': 'rndmString',
     *     'type': 'onReferredFirstTransaction',
     *     'description': 'rndmString',
     *     'valueType': 'value',
     *     'value': 12,
     *     'expiresOn': 'Fri Jan 03 2012 13:13:25 GMT+0100 (Central European Standard Time)',
     *     'isOneShot': true,
     *     'status': 'active',
     *     'createdBy': '6776baf5c7c6e518aae88072',
     *     'onlyForUser': '6776baf5c7c6e518aae88072',
     *     'maximumUses': 12,
     *     'vestingConfig': '6776baf5c7c6e518aae88072',
     *     '_id': '6776baf5c7c6e518aae88071'
     *   }
     * ]
 */
    icoBonusCodeGetLastN(
        limit ?: number,
        config ?: never,
    ): Promise<modelTypes.IcoBonusCodeModels['Read'][]>
icoBonusCodeGetLastN<Config extends RequestConfigRead<modelTypes.IcoBonusCodeModels['Read']>>(
    limit ?: number,
    config ?: Config,
): Promise<MaybePaginated<modelTypes.IcoBonusCodeModels['Read'][], Config>>,
    /** Allow to get the first ressources by creation date
     * @example
     * [
     *   {
     *     'code': 'rndmString',
     *     'type': 'onReferredFirstTransaction',
     *     'description': 'rndmString',
     *     'valueType': 'value',
     *     'value': 12,
     *     'expiresOn': 'Fri Jan 03 2012 13:13:25 GMT+0100 (Central European Standard Time)',
     *     'isOneShot': true,
     *     'status': 'active',
     *     'createdBy': '6776baf5c7c6e518aae88072',
     *     'onlyForUser': '6776baf5c7c6e518aae88072',
     *     'maximumUses': 12,
     *     'vestingConfig': '6776baf5c7c6e518aae88072',
     *     '_id': '6776baf5c7c6e518aae88071'
     *   },
     *   {
     *     'code': 'rndmString',
     *     'type': 'onReferredFirstTransaction',
     *     'description': 'rndmString',
     *     'valueType': 'value',
     *     'value': 12,
     *     'expiresOn': 'Fri Jan 03 2012 13:13:25 GMT+0100 (Central European Standard Time)',
     *     'isOneShot': true,
     *     'status': 'active',
     *     'createdBy': '6776baf5c7c6e518aae88072',
     *     'onlyForUser': '6776baf5c7c6e518aae88072',
     *     'maximumUses': 12,
     *     'vestingConfig': '6776baf5c7c6e518aae88072',
     *     '_id': '6776baf5c7c6e518aae88071'
     *   }
     * ]
 */
    icoBonusCodeGetFirstN(
        limit ?: number,
        config ?: never
    ): Promise<modelTypes.IcoBonusCodeModels['Read'][]>
icoBonusCodeGetFirstN<Config extends RequestConfigRead<modelTypes.IcoBonusCodeModels['Read']>>(
    limit ?: number,
    config ?: Config
): Promise<MaybePaginated<modelTypes.IcoBonusCodeModels['Read'][], Config>>,
    /** Count the number of ressources matching the filter in first param or all ressources if no filter is provided
     * @example
     * 12
 */
    icoBonusCodeCount(
        filter ?: AsFilter<modelTypes.IcoBonusCodeModels['Write']>
    ): Promise<number>,
        /** Allow to get a ressource by it's unique mongoDb _id
         * @errorCodes
         * - 404: ressourceDoesNotExists
         * @example
         * {
         *   'code': 'rndmString',
         *   'type': 'onReferredFirstTransaction',
         *   'description': 'rndmString',
         *   'valueType': 'value',
         *   'value': 12,
         *   'expiresOn': 'Fri Jan 03 2012 13:13:25 GMT+0100 (Central European Standard Time)',
         *   'isOneShot': true,
         *   'status': 'active',
         *   'createdBy': '6776baf5c7c6e518aae88072',
         *   'onlyForUser': '6776baf5c7c6e518aae88072',
         *   'maximumUses': 12,
         *   'vestingConfig': '6776baf5c7c6e518aae88072',
         *   '_id': '6776baf5c7c6e518aae88071'
         * }
     */
        icoBonusCodeGetById<Config extends RequestConfigGetOne<modelTypes.IcoBonusCodeModels['Read']>>(
            id: string,
            config ?: Config
        ): Promise<Config['triggerErrorIfNotSet'] extends true ? modelTypes.IcoBonusCodeModels['Read'] : modelTypes.IcoBonusCodeModels['Read'] | undefined>,
            /** Allow to get a ressource with providing a filter as first param
             * @example
             * {
             *   'code': 'rndmString',
             *   'type': 'onReferredFirstTransaction',
             *   'description': 'rndmString',
             *   'valueType': 'value',
             *   'value': 12,
             *   'expiresOn': 'Fri Jan 03 2012 13:13:25 GMT+0100 (Central European Standard Time)',
             *   'isOneShot': true,
             *   'status': 'active',
             *   'createdBy': '6776baf5c7c6e518aae88072',
             *   'onlyForUser': '6776baf5c7c6e518aae88072',
             *   'maximumUses': 12,
             *   'vestingConfig': '6776baf5c7c6e518aae88072',
             *   '_id': '6776baf5c7c6e518aae88071'
             * }
         */
            icoBonusCodeGetOne<Config extends Omit<RequestConfigGetOne<modelTypes.IcoBonusCodeModels['Read']>, 'filter'>>(
                filter ?: AsFilter<modelTypes.IcoBonusCodeModels['Write']>, // WRITE HERE because it will ensure referenced fields are passed as their string counterpart
                config ?: Config
            ): Promise<Config['triggerErrorIfNotSet'] extends true ? modelTypes.IcoBonusCodeModels['Read'] : modelTypes.IcoBonusCodeModels['Read'] | undefined>,
                /** Create a new document
             */
                icoBonusCodeCreate<
                    Config extends RequestConfigWrite<modelTypes.IcoBonusCodeModels['Write']>,
                    Body extends MaybeArray<modelTypes.IcoBonusCodeModels['Write']>
    >(
                        body: Body,
                        config ?: Config
                    ): Promise<
                        Config['returnDoc'] extends true ?
                        Body extends any[] ? modelTypes.IcoBonusCodeModels['Read'][] : modelTypes.IcoBonusCodeModels['Read'] :
                        Body extends any[] ? string[] : string
                    >,
                        /** Update a given document. An _id should be provided.
                     */
                        icoBonusCodeUpdate<
                            Config extends RequestConfigWrite<modelTypes.IcoBonusCodeModels['Write']>
    >(
                                id: string,
                                body: Partial<AsMongooseBody<modelTypes.IcoBonusCodeModels['Write']>>,
                                config ?: Config
                            ): Promise<
                                Config['returnDoc'] extends true ? modelTypes.IcoBonusCodeModels['Read'] : undefined
                            >,
                                /** Update multiple unique documents. Each document must have an _id field
                                 * @errorCodes
                                 * - 403: userDoNotHaveThePermission
                             */
                                icoBonusCodeUpdateMany<
                                    Config extends RequestConfigWrite<modelTypes.IcoBonusCodeModels['Write']>
    >(
                                        fields: Array<Partial<AsMongooseBody<modelTypes.IcoBonusCodeModels['Write']>> & { _id: string }>, // id is provided in the body
                                        config ?: Config
                                    ): Promise<
                                        Config['returnDoc'] extends true ? modelTypes.IcoBonusCodeModels['Read'][] : undefined
                                    >,
                                        /** Update or create document if not existing
                                     */
                                        icoBonusCodeUpsert<Config extends RequestConfigWrite<modelTypes.IcoBonusCodeModels['Write']>>(
                                            fields: modelTypes.IcoBonusCodeModels['Write'] & { _id?: string },
                                            config ?: Config
                                        ): Promise<Config['returnDoc'] extends true ? modelTypes.IcoBonusCodeModels['Read'] : string>,
                                            /** Update documents matching the filter in the first param or all documents if filter is not provided
                                             * @errorCodes
                                             * - 403: updateWithFilterNotAllowed
                                         */
                                            icoBonusCodeUpdateWithFilter<Config extends RequestConfigWrite<modelTypes.IcoBonusCodeModels['Write']>>(
                                                filter: AsFilter<modelTypes.IcoBonusCodeModels['Write']>,
                                                fields: Partial<AsMongooseBody<modelTypes.IcoBonusCodeModels['Write']>>,
                                                config ?: Config
                                            ): Promise<
                                                Config['returnDoc'] extends true ? modelTypes.IcoBonusCodeModels['Read'][] : {
                                                    acknowledged: boolean
                                                    matchedCount: number
                                                    modifiedCount: number
                                                    upsertedCount: number
                                                    upsertedId: any
                                                }
                                            >,
                                                /** Delete a document
                                             */
                                                icoBonusCodeDelete(
                                                    id: string
                                                ): Promise<void>,
                                                    /** Delete all documents matching a filter
                                                     * @errorCodes
                                                     * - 422: wrongValueForParam - When the filter is an empty object,     * - 403: userDoNotHaveThePermission - When using deleteWithFilter with something else than system permission
                                                 */
                                                    icoBonusCodeDeleteWithFilter(
                                                        filter: AsFilter<modelTypes.IcoBonusCodeModels['Write']>
                                                    ): Promise<{ success: true, deletedCount: number, hardDeleted: boolean }>,
                                                        /** Allow to get all ressources with providing a filter as first param
                                                         * @example
                                                         * [
                                                         *   {
                                                         *     'totalRaised': 12,
                                                         *     'totalTarget': 12,
                                                         *     'advantages': [
                                                         *       null,
                                                         *       null
                                                         *     ],
                                                         *     'priceCurve': [
                                                         *       {
                                                         *         'fromDate': 'Fri Jan 03 2012 13:13:25 GMT+0100 (Central European Standard Time)',
                                                         *         'tokenPrice': 12
                                                         *       },
                                                         *       {
                                                         *         'fromDate': 'Fri Jan 03 2012 13:13:25 GMT+0100 (Central European Standard Time)',
                                                         *         'tokenPrice': 12
                                                         *       }
                                                         *     ],
                                                         *     'listingDate': 'Fri Jan 03 2012 13:13:25 GMT+0100 (Central European Standard Time)',
                                                         *     'vestingConfig': [
                                                         *       '6776baf5c7c6e518aae88072',
                                                         *       '6776baf5c7c6e518aae88072'
                                                         *     ],
                                                         *     'minimumInvestment': 12,
                                                         *     'whitepaperLink': 'https://noodle.com/',
                                                         *     'websiteLink': 'https://noodle.com/',
                                                         *     'privacyPolicyLink': 'https://noodle.com/',
                                                         *     'termsAndConditionsLink': 'https://noodle.com/',
                                                         *     'cookiePolicyLink': 'https://noodle.com/',
                                                         *     '_id': '6776baf5c7c6e518aae88071'
                                                         *   },
                                                         *   {
                                                         *     'totalRaised': 12,
                                                         *     'totalTarget': 12,
                                                         *     'advantages': [
                                                         *       null,
                                                         *       null
                                                         *     ],
                                                         *     'priceCurve': [
                                                         *       {
                                                         *         'fromDate': 'Fri Jan 03 2012 13:13:25 GMT+0100 (Central European Standard Time)',
                                                         *         'tokenPrice': 12
                                                         *       },
                                                         *       {
                                                         *         'fromDate': 'Fri Jan 03 2012 13:13:25 GMT+0100 (Central European Standard Time)',
                                                         *         'tokenPrice': 12
                                                         *       }
                                                         *     ],
                                                         *     'listingDate': 'Fri Jan 03 2012 13:13:25 GMT+0100 (Central European Standard Time)',
                                                         *     'vestingConfig': [
                                                         *       '6776baf5c7c6e518aae88072',
                                                         *       '6776baf5c7c6e518aae88072'
                                                         *     ],
                                                         *     'minimumInvestment': 12,
                                                         *     'whitepaperLink': 'https://noodle.com/',
                                                         *     'websiteLink': 'https://noodle.com/',
                                                         *     'privacyPolicyLink': 'https://noodle.com/',
                                                         *     'termsAndConditionsLink': 'https://noodle.com/',
                                                         *     'cookiePolicyLink': 'https://noodle.com/',
                                                         *     '_id': '6776baf5c7c6e518aae88071'
                                                         *   }
                                                         * ]
                                                     */
                                                        icoDashboardConfigGetAll(
                                                            filter ?: AsFilter<modelTypes.IcoDashboardConfigModels['Write']>,
                                                            config ?: never
                                                        ): Promise<modelTypes.IcoDashboardConfigModels['Read'][]>
icoDashboardConfigGetAll<Config extends Omit<RequestConfigRead<modelTypes.IcoDashboardConfigModels['Read']>, 'filter'>>(
    filter ?: AsFilter<modelTypes.IcoDashboardConfigModels['Write']>,
    config ?: Config
): Promise<MaybePaginated<modelTypes.IcoDashboardConfigModels['Read'][], Config>>,
    /** Allow to get the last ressources by creation date
     * @example
     * [
     *   {
     *     'totalRaised': 12,
     *     'totalTarget': 12,
     *     'advantages': [
     *       null,
     *       null
     *     ],
     *     'priceCurve': [
     *       {
     *         'fromDate': 'Fri Jan 03 2012 13:13:25 GMT+0100 (Central European Standard Time)',
     *         'tokenPrice': 12
     *       },
     *       {
     *         'fromDate': 'Fri Jan 03 2012 13:13:25 GMT+0100 (Central European Standard Time)',
     *         'tokenPrice': 12
     *       }
     *     ],
     *     'listingDate': 'Fri Jan 03 2012 13:13:25 GMT+0100 (Central European Standard Time)',
     *     'vestingConfig': [
     *       '6776baf5c7c6e518aae88072',
     *       '6776baf5c7c6e518aae88072'
     *     ],
     *     'minimumInvestment': 12,
     *     'whitepaperLink': 'https://noodle.com/',
     *     'websiteLink': 'https://noodle.com/',
     *     'privacyPolicyLink': 'https://noodle.com/',
     *     'termsAndConditionsLink': 'https://noodle.com/',
     *     'cookiePolicyLink': 'https://noodle.com/',
     *     '_id': '6776baf5c7c6e518aae88071'
     *   },
     *   {
     *     'totalRaised': 12,
     *     'totalTarget': 12,
     *     'advantages': [
     *       null,
     *       null
     *     ],
     *     'priceCurve': [
     *       {
     *         'fromDate': 'Fri Jan 03 2012 13:13:25 GMT+0100 (Central European Standard Time)',
     *         'tokenPrice': 12
     *       },
     *       {
     *         'fromDate': 'Fri Jan 03 2012 13:13:25 GMT+0100 (Central European Standard Time)',
     *         'tokenPrice': 12
     *       }
     *     ],
     *     'listingDate': 'Fri Jan 03 2012 13:13:25 GMT+0100 (Central European Standard Time)',
     *     'vestingConfig': [
     *       '6776baf5c7c6e518aae88072',
     *       '6776baf5c7c6e518aae88072'
     *     ],
     *     'minimumInvestment': 12,
     *     'whitepaperLink': 'https://noodle.com/',
     *     'websiteLink': 'https://noodle.com/',
     *     'privacyPolicyLink': 'https://noodle.com/',
     *     'termsAndConditionsLink': 'https://noodle.com/',
     *     'cookiePolicyLink': 'https://noodle.com/',
     *     '_id': '6776baf5c7c6e518aae88071'
     *   }
     * ]
 */
    icoDashboardConfigGetLastN(
        limit ?: number,
        config ?: never,
    ): Promise<modelTypes.IcoDashboardConfigModels['Read'][]>
icoDashboardConfigGetLastN<Config extends RequestConfigRead<modelTypes.IcoDashboardConfigModels['Read']>>(
    limit ?: number,
    config ?: Config,
): Promise<MaybePaginated<modelTypes.IcoDashboardConfigModels['Read'][], Config>>,
    /** Allow to get the first ressources by creation date
     * @example
     * [
     *   {
     *     'totalRaised': 12,
     *     'totalTarget': 12,
     *     'advantages': [
     *       null,
     *       null
     *     ],
     *     'priceCurve': [
     *       {
     *         'fromDate': 'Fri Jan 03 2012 13:13:25 GMT+0100 (Central European Standard Time)',
     *         'tokenPrice': 12
     *       },
     *       {
     *         'fromDate': 'Fri Jan 03 2012 13:13:25 GMT+0100 (Central European Standard Time)',
     *         'tokenPrice': 12
     *       }
     *     ],
     *     'listingDate': 'Fri Jan 03 2012 13:13:25 GMT+0100 (Central European Standard Time)',
     *     'vestingConfig': [
     *       '6776baf5c7c6e518aae88072',
     *       '6776baf5c7c6e518aae88072'
     *     ],
     *     'minimumInvestment': 12,
     *     'whitepaperLink': 'https://noodle.com/',
     *     'websiteLink': 'https://noodle.com/',
     *     'privacyPolicyLink': 'https://noodle.com/',
     *     'termsAndConditionsLink': 'https://noodle.com/',
     *     'cookiePolicyLink': 'https://noodle.com/',
     *     '_id': '6776baf5c7c6e518aae88071'
     *   },
     *   {
     *     'totalRaised': 12,
     *     'totalTarget': 12,
     *     'advantages': [
     *       null,
     *       null
     *     ],
     *     'priceCurve': [
     *       {
     *         'fromDate': 'Fri Jan 03 2012 13:13:25 GMT+0100 (Central European Standard Time)',
     *         'tokenPrice': 12
     *       },
     *       {
     *         'fromDate': 'Fri Jan 03 2012 13:13:25 GMT+0100 (Central European Standard Time)',
     *         'tokenPrice': 12
     *       }
     *     ],
     *     'listingDate': 'Fri Jan 03 2012 13:13:25 GMT+0100 (Central European Standard Time)',
     *     'vestingConfig': [
     *       '6776baf5c7c6e518aae88072',
     *       '6776baf5c7c6e518aae88072'
     *     ],
     *     'minimumInvestment': 12,
     *     'whitepaperLink': 'https://noodle.com/',
     *     'websiteLink': 'https://noodle.com/',
     *     'privacyPolicyLink': 'https://noodle.com/',
     *     'termsAndConditionsLink': 'https://noodle.com/',
     *     'cookiePolicyLink': 'https://noodle.com/',
     *     '_id': '6776baf5c7c6e518aae88071'
     *   }
     * ]
 */
    icoDashboardConfigGetFirstN(
        limit ?: number,
        config ?: never
    ): Promise<modelTypes.IcoDashboardConfigModels['Read'][]>
icoDashboardConfigGetFirstN<Config extends RequestConfigRead<modelTypes.IcoDashboardConfigModels['Read']>>(
    limit ?: number,
    config ?: Config
): Promise<MaybePaginated<modelTypes.IcoDashboardConfigModels['Read'][], Config>>,
    /** Count the number of ressources matching the filter in first param or all ressources if no filter is provided
     * @example
     * 12
 */
    icoDashboardConfigCount(
        filter ?: AsFilter<modelTypes.IcoDashboardConfigModels['Write']>
    ): Promise<number>,
        /** Allow to get a ressource by it's unique mongoDb _id
         * @errorCodes
         * - 404: ressourceDoesNotExists
         * @example
         * {
         *   'totalRaised': 12,
         *   'totalTarget': 12,
         *   'advantages': [
         *     null,
         *     null
         *   ],
         *   'priceCurve': [
         *     {
         *       'fromDate': 'Fri Jan 03 2012 13:13:25 GMT+0100 (Central European Standard Time)',
         *       'tokenPrice': 12
         *     },
         *     {
         *       'fromDate': 'Fri Jan 03 2012 13:13:25 GMT+0100 (Central European Standard Time)',
         *       'tokenPrice': 12
         *     }
         *   ],
         *   'listingDate': 'Fri Jan 03 2012 13:13:25 GMT+0100 (Central European Standard Time)',
         *   'vestingConfig': [
         *     '6776baf5c7c6e518aae88072',
         *     '6776baf5c7c6e518aae88072'
         *   ],
         *   'minimumInvestment': 12,
         *   'whitepaperLink': 'https://noodle.com/',
         *   'websiteLink': 'https://noodle.com/',
         *   'privacyPolicyLink': 'https://noodle.com/',
         *   'termsAndConditionsLink': 'https://noodle.com/',
         *   'cookiePolicyLink': 'https://noodle.com/',
         *   '_id': '6776baf5c7c6e518aae88071'
         * }
     */
        icoDashboardConfigGetById<Config extends RequestConfigGetOne<modelTypes.IcoDashboardConfigModels['Read']>>(
            id: string,
            config ?: Config
        ): Promise<Config['triggerErrorIfNotSet'] extends true ? modelTypes.IcoDashboardConfigModels['Read'] : modelTypes.IcoDashboardConfigModels['Read'] | undefined>,
            /** Allow to get a ressource with providing a filter as first param
             * @example
             * {
             *   'totalRaised': 12,
             *   'totalTarget': 12,
             *   'advantages': [
             *     null,
             *     null
             *   ],
             *   'priceCurve': [
             *     {
             *       'fromDate': 'Fri Jan 03 2012 13:13:25 GMT+0100 (Central European Standard Time)',
             *       'tokenPrice': 12
             *     },
             *     {
             *       'fromDate': 'Fri Jan 03 2012 13:13:25 GMT+0100 (Central European Standard Time)',
             *       'tokenPrice': 12
             *     }
             *   ],
             *   'listingDate': 'Fri Jan 03 2012 13:13:25 GMT+0100 (Central European Standard Time)',
             *   'vestingConfig': [
             *     '6776baf5c7c6e518aae88072',
             *     '6776baf5c7c6e518aae88072'
             *   ],
             *   'minimumInvestment': 12,
             *   'whitepaperLink': 'https://noodle.com/',
             *   'websiteLink': 'https://noodle.com/',
             *   'privacyPolicyLink': 'https://noodle.com/',
             *   'termsAndConditionsLink': 'https://noodle.com/',
             *   'cookiePolicyLink': 'https://noodle.com/',
             *   '_id': '6776baf5c7c6e518aae88071'
             * }
         */
            icoDashboardConfigGetOne<Config extends Omit<RequestConfigGetOne<modelTypes.IcoDashboardConfigModels['Read']>, 'filter'>>(
                filter ?: AsFilter<modelTypes.IcoDashboardConfigModels['Write']>, // WRITE HERE because it will ensure referenced fields are passed as their string counterpart
                config ?: Config
            ): Promise<Config['triggerErrorIfNotSet'] extends true ? modelTypes.IcoDashboardConfigModels['Read'] : modelTypes.IcoDashboardConfigModels['Read'] | undefined>,
                /** Allow to get all ressources with providing a filter as first param
                 * @example
                 * [
                 *   {
                 *     'beneficiary': '6776baf5c7c6e518aae88072',
                 *     'referrer': '6776baf5c7c6e518aae88072',
                 *     'referred': '6776baf5c7c6e518aae88072',
                 *     'amount': 12,
                 *     'status': 'pending',
                 *     'cancelReason': 'relatedTxCancelled',
                 *     'errorExtraInfos': 'rndmString',
                 *     'transactionStage': [
                 *       {
                 *         'status': 'pending',
                 *         'cancelReason': 'relatedTxCancelled',
                 *         'date': 'Fri Jan 03 2012 13:13:25 GMT+0100 (Central European Standard Time)'
                 *       },
                 *       {
                 *         'status': 'pending',
                 *         'cancelReason': 'relatedTxCancelled',
                 *         'date': 'Fri Jan 03 2012 13:13:25 GMT+0100 (Central European Standard Time)'
                 *       }
                 *     ],
                 *     'transactionId': 'rndmString',
                 *     'icoBonusCode': '6776baf5c7c6e518aae88072',
                 *     'originTransaction': '6776baf5c7c6e518aae88072',
                 *     '_id': '6776baf5c7c6e518aae88071',
                 *     'creationDate': 'Fri Jan 03 2012 13:13:25 GMT+0100 (Central European Standard Time)'
                 *   },
                 *   {
                 *     'beneficiary': '6776baf5c7c6e518aae88072',
                 *     'referrer': '6776baf5c7c6e518aae88072',
                 *     'referred': '6776baf5c7c6e518aae88072',
                 *     'amount': 12,
                 *     'status': 'pending',
                 *     'cancelReason': 'relatedTxCancelled',
                 *     'errorExtraInfos': 'rndmString',
                 *     'transactionStage': [
                 *       {
                 *         'status': 'pending',
                 *         'cancelReason': 'relatedTxCancelled',
                 *         'date': 'Fri Jan 03 2012 13:13:25 GMT+0100 (Central European Standard Time)'
                 *       },
                 *       {
                 *         'status': 'pending',
                 *         'cancelReason': 'relatedTxCancelled',
                 *         'date': 'Fri Jan 03 2012 13:13:25 GMT+0100 (Central European Standard Time)'
                 *       }
                 *     ],
                 *     'transactionId': 'rndmString',
                 *     'icoBonusCode': '6776baf5c7c6e518aae88072',
                 *     'originTransaction': '6776baf5c7c6e518aae88072',
                 *     '_id': '6776baf5c7c6e518aae88071',
                 *     'creationDate': 'Fri Jan 03 2012 13:13:25 GMT+0100 (Central European Standard Time)'
                 *   }
                 * ]
             */
                icoRewardTransactionGetAll(
                    filter ?: AsFilter<modelTypes.IcoRewardTransactionModels['Write']>,
                    config ?: never
                ): Promise<modelTypes.IcoRewardTransactionModels['Read'][]>
icoRewardTransactionGetAll<Config extends Omit<RequestConfigRead<modelTypes.IcoRewardTransactionModels['Read']>, 'filter'>>(
    filter ?: AsFilter<modelTypes.IcoRewardTransactionModels['Write']>,
    config ?: Config
): Promise<MaybePaginated<modelTypes.IcoRewardTransactionModels['Read'][], Config>>,
    /** Allow to get the last ressources by creation date
     * @example
     * [
     *   {
     *     'beneficiary': '6776baf5c7c6e518aae88072',
     *     'referrer': '6776baf5c7c6e518aae88072',
     *     'referred': '6776baf5c7c6e518aae88072',
     *     'amount': 12,
     *     'status': 'pending',
     *     'cancelReason': 'relatedTxCancelled',
     *     'errorExtraInfos': 'rndmString',
     *     'transactionStage': [
     *       {
     *         'status': 'pending',
     *         'cancelReason': 'relatedTxCancelled',
     *         'date': 'Fri Jan 03 2012 13:13:25 GMT+0100 (Central European Standard Time)'
     *       },
     *       {
     *         'status': 'pending',
     *         'cancelReason': 'relatedTxCancelled',
     *         'date': 'Fri Jan 03 2012 13:13:25 GMT+0100 (Central European Standard Time)'
     *       }
     *     ],
     *     'transactionId': 'rndmString',
     *     'icoBonusCode': '6776baf5c7c6e518aae88072',
     *     'originTransaction': '6776baf5c7c6e518aae88072',
     *     '_id': '6776baf5c7c6e518aae88071',
     *     'creationDate': 'Fri Jan 03 2012 13:13:25 GMT+0100 (Central European Standard Time)'
     *   },
     *   {
     *     'beneficiary': '6776baf5c7c6e518aae88072',
     *     'referrer': '6776baf5c7c6e518aae88072',
     *     'referred': '6776baf5c7c6e518aae88072',
     *     'amount': 12,
     *     'status': 'pending',
     *     'cancelReason': 'relatedTxCancelled',
     *     'errorExtraInfos': 'rndmString',
     *     'transactionStage': [
     *       {
     *         'status': 'pending',
     *         'cancelReason': 'relatedTxCancelled',
     *         'date': 'Fri Jan 03 2012 13:13:25 GMT+0100 (Central European Standard Time)'
     *       },
     *       {
     *         'status': 'pending',
     *         'cancelReason': 'relatedTxCancelled',
     *         'date': 'Fri Jan 03 2012 13:13:25 GMT+0100 (Central European Standard Time)'
     *       }
     *     ],
     *     'transactionId': 'rndmString',
     *     'icoBonusCode': '6776baf5c7c6e518aae88072',
     *     'originTransaction': '6776baf5c7c6e518aae88072',
     *     '_id': '6776baf5c7c6e518aae88071',
     *     'creationDate': 'Fri Jan 03 2012 13:13:25 GMT+0100 (Central European Standard Time)'
     *   }
     * ]
 */
    icoRewardTransactionGetLastN(
        limit ?: number,
        config ?: never,
    ): Promise<modelTypes.IcoRewardTransactionModels['Read'][]>
icoRewardTransactionGetLastN<Config extends RequestConfigRead<modelTypes.IcoRewardTransactionModels['Read']>>(
    limit ?: number,
    config ?: Config,
): Promise<MaybePaginated<modelTypes.IcoRewardTransactionModels['Read'][], Config>>,
    /** Allow to get the first ressources by creation date
     * @example
     * [
     *   {
     *     'beneficiary': '6776baf5c7c6e518aae88072',
     *     'referrer': '6776baf5c7c6e518aae88072',
     *     'referred': '6776baf5c7c6e518aae88072',
     *     'amount': 12,
     *     'status': 'pending',
     *     'cancelReason': 'relatedTxCancelled',
     *     'errorExtraInfos': 'rndmString',
     *     'transactionStage': [
     *       {
     *         'status': 'pending',
     *         'cancelReason': 'relatedTxCancelled',
     *         'date': 'Fri Jan 03 2012 13:13:25 GMT+0100 (Central European Standard Time)'
     *       },
     *       {
     *         'status': 'pending',
     *         'cancelReason': 'relatedTxCancelled',
     *         'date': 'Fri Jan 03 2012 13:13:25 GMT+0100 (Central European Standard Time)'
     *       }
     *     ],
     *     'transactionId': 'rndmString',
     *     'icoBonusCode': '6776baf5c7c6e518aae88072',
     *     'originTransaction': '6776baf5c7c6e518aae88072',
     *     '_id': '6776baf5c7c6e518aae88071',
     *     'creationDate': 'Fri Jan 03 2012 13:13:25 GMT+0100 (Central European Standard Time)'
     *   },
     *   {
     *     'beneficiary': '6776baf5c7c6e518aae88072',
     *     'referrer': '6776baf5c7c6e518aae88072',
     *     'referred': '6776baf5c7c6e518aae88072',
     *     'amount': 12,
     *     'status': 'pending',
     *     'cancelReason': 'relatedTxCancelled',
     *     'errorExtraInfos': 'rndmString',
     *     'transactionStage': [
     *       {
     *         'status': 'pending',
     *         'cancelReason': 'relatedTxCancelled',
     *         'date': 'Fri Jan 03 2012 13:13:25 GMT+0100 (Central European Standard Time)'
     *       },
     *       {
     *         'status': 'pending',
     *         'cancelReason': 'relatedTxCancelled',
     *         'date': 'Fri Jan 03 2012 13:13:25 GMT+0100 (Central European Standard Time)'
     *       }
     *     ],
     *     'transactionId': 'rndmString',
     *     'icoBonusCode': '6776baf5c7c6e518aae88072',
     *     'originTransaction': '6776baf5c7c6e518aae88072',
     *     '_id': '6776baf5c7c6e518aae88071',
     *     'creationDate': 'Fri Jan 03 2012 13:13:25 GMT+0100 (Central European Standard Time)'
     *   }
     * ]
 */
    icoRewardTransactionGetFirstN(
        limit ?: number,
        config ?: never
    ): Promise<modelTypes.IcoRewardTransactionModels['Read'][]>
icoRewardTransactionGetFirstN<Config extends RequestConfigRead<modelTypes.IcoRewardTransactionModels['Read']>>(
    limit ?: number,
    config ?: Config
): Promise<MaybePaginated<modelTypes.IcoRewardTransactionModels['Read'][], Config>>,
    /** Count the number of ressources matching the filter in first param or all ressources if no filter is provided
     * @example
     * 12
 */
    icoRewardTransactionCount(
        filter ?: AsFilter<modelTypes.IcoRewardTransactionModels['Write']>
    ): Promise<number>,
        /** Allow to get a ressource by it's unique mongoDb _id
         * @errorCodes
         * - 404: ressourceDoesNotExists
         * @example
         * {
         *   'beneficiary': '6776baf5c7c6e518aae88072',
         *   'referrer': '6776baf5c7c6e518aae88072',
         *   'referred': '6776baf5c7c6e518aae88072',
         *   'amount': 12,
         *   'status': 'pending',
         *   'cancelReason': 'relatedTxCancelled',
         *   'errorExtraInfos': 'rndmString',
         *   'transactionStage': [
         *     {
         *       'status': 'pending',
         *       'cancelReason': 'relatedTxCancelled',
         *       'date': 'Fri Jan 03 2012 13:13:25 GMT+0100 (Central European Standard Time)'
         *     },
         *     {
         *       'status': 'pending',
         *       'cancelReason': 'relatedTxCancelled',
         *       'date': 'Fri Jan 03 2012 13:13:25 GMT+0100 (Central European Standard Time)'
         *     }
         *   ],
         *   'transactionId': 'rndmString',
         *   'icoBonusCode': '6776baf5c7c6e518aae88072',
         *   'originTransaction': '6776baf5c7c6e518aae88072',
         *   '_id': '6776baf5c7c6e518aae88071',
         *   'creationDate': 'Fri Jan 03 2012 13:13:25 GMT+0100 (Central European Standard Time)'
         * }
     */
        icoRewardTransactionGetById<Config extends RequestConfigGetOne<modelTypes.IcoRewardTransactionModels['Read']>>(
            id: string,
            config ?: Config
        ): Promise<Config['triggerErrorIfNotSet'] extends true ? modelTypes.IcoRewardTransactionModels['Read'] : modelTypes.IcoRewardTransactionModels['Read'] | undefined>,
            /** Allow to get a ressource with providing a filter as first param
             * @example
             * {
             *   'beneficiary': '6776baf5c7c6e518aae88072',
             *   'referrer': '6776baf5c7c6e518aae88072',
             *   'referred': '6776baf5c7c6e518aae88072',
             *   'amount': 12,
             *   'status': 'pending',
             *   'cancelReason': 'relatedTxCancelled',
             *   'errorExtraInfos': 'rndmString',
             *   'transactionStage': [
             *     {
             *       'status': 'pending',
             *       'cancelReason': 'relatedTxCancelled',
             *       'date': 'Fri Jan 03 2012 13:13:25 GMT+0100 (Central European Standard Time)'
             *     },
             *     {
             *       'status': 'pending',
             *       'cancelReason': 'relatedTxCancelled',
             *       'date': 'Fri Jan 03 2012 13:13:25 GMT+0100 (Central European Standard Time)'
             *     }
             *   ],
             *   'transactionId': 'rndmString',
             *   'icoBonusCode': '6776baf5c7c6e518aae88072',
             *   'originTransaction': '6776baf5c7c6e518aae88072',
             *   '_id': '6776baf5c7c6e518aae88071',
             *   'creationDate': 'Fri Jan 03 2012 13:13:25 GMT+0100 (Central European Standard Time)'
             * }
         */
            icoRewardTransactionGetOne<Config extends Omit<RequestConfigGetOne<modelTypes.IcoRewardTransactionModels['Read']>, 'filter'>>(
                filter ?: AsFilter<modelTypes.IcoRewardTransactionModels['Write']>, // WRITE HERE because it will ensure referenced fields are passed as their string counterpart
                config ?: Config
            ): Promise<Config['triggerErrorIfNotSet'] extends true ? modelTypes.IcoRewardTransactionModels['Read'] : modelTypes.IcoRewardTransactionModels['Read'] | undefined>,
                /** Allow to get all ressources with providing a filter as first param
                 * @example
                 * [
                 *   {
                 *     'user': '6776baf5c7c6e518aae88072',
                 *     'sourceAmount': 12,
                 *     'receivedAmount': 12,
                 *     'sourceCurrency': 'eur',
                 *     'blockchainNetwork': 'ethereum',
                 *     'conversionRate': 12,
                 *     'amountInEuros': 12,
                 *     'amountInDollars': 12,
                 *     'ethTransactionHash': 'rndmString',
                 *     'solTransactionHash': 'rndmString',
                 *     'bitcoinTransactionHash': 'rndmString',
                 *     'bonusCode': '6776baf5c7c6e518aae88072',
                 *     'validator': '6776baf5c7c6e518aae88072',
                 *     'bgkPurchaseRequested': 12,
                 *     'bgkReceivedAfterFeesAndAdjustment': 12,
                 *     'acquisitionPrice': 12,
                 *     'paymentMethod': 'solanaWithWalletConnector',
                 *     'userWallet': {
                 *       'address': 'rndmString',
                 *       'blockchain': 'solana'
                 *     },
                 *     'userWalletId': 'rndmString',
                 *     'status': 'pending',
                 *     'pendingReason': 'fundsNotReceivedYetForUntrackableTx',
                 *     'cancelReason': 'relatedTxCancelled',
                 *     'errorExtraInfos': 'rndmString',
                 *     'transactionStage': [
                 *       {
                 *         'status': 'pending',
                 *         'pendingReason': 'fundsNotReceivedYetForUntrackableTx',
                 *         'cancelReason': 'relatedTxCancelled',
                 *         'date': 'Fri Jan 03 2012 13:13:25 GMT+0100 (Central European Standard Time)'
                 *       },
                 *       {
                 *         'status': 'pending',
                 *         'pendingReason': 'fundsNotReceivedYetForUntrackableTx',
                 *         'cancelReason': 'relatedTxCancelled',
                 *         'date': 'Fri Jan 03 2012 13:13:25 GMT+0100 (Central European Standard Time)'
                 *       }
                 *     ],
                 *     'transactionId': 'rndmString',
                 *     'expiresOn': 'Fri Jan 03 2012 13:13:25 GMT+0100 (Central European Standard Time)',
                 *     'hasAgreedTermsOfSales': true,
                 *     'bankTransferInformations': {
                 *       'amount': 12,
                 *       'object': 'rndmString',
                 *       'date': 'rndmString',
                 *       'pending': true,
                 *       'status': 'added',
                 *       'currency': 'rndmString'
                 *     },
                 *     'bgkSignature': 'rndmString',
                 *     'isDeletedByUser': 'Fri Jan 03 2012 13:13:25 GMT+0100 (Central European Standard Time)',
                 *     'vestingConfig': '6776baf5c7c6e518aae88072',
                 *     '_id': '6776baf5c7c6e518aae88071',
                 *     'creationDate': 'Fri Jan 03 2012 13:13:25 GMT+0100 (Central European Standard Time)',
                 *     'lastUpdateDate': 'Fri Jan 03 2012 13:13:25 GMT+0100 (Central European Standard Time)',
                 *     'lastUpdater': '6776baf5c7c6e518aae88072'
                 *   },
                 *   {
                 *     'user': '6776baf5c7c6e518aae88072',
                 *     'sourceAmount': 12,
                 *     'receivedAmount': 12,
                 *     'sourceCurrency': 'eur',
                 *     'blockchainNetwork': 'ethereum',
                 *     'conversionRate': 12,
                 *     'amountInEuros': 12,
                 *     'amountInDollars': 12,
                 *     'ethTransactionHash': 'rndmString',
                 *     'solTransactionHash': 'rndmString',
                 *     'bitcoinTransactionHash': 'rndmString',
                 *     'bonusCode': '6776baf5c7c6e518aae88072',
                 *     'validator': '6776baf5c7c6e518aae88072',
                 *     'bgkPurchaseRequested': 12,
                 *     'bgkReceivedAfterFeesAndAdjustment': 12,
                 *     'acquisitionPrice': 12,
                 *     'paymentMethod': 'solanaWithWalletConnector',
                 *     'userWallet': {
                 *       'address': 'rndmString',
                 *       'blockchain': 'solana'
                 *     },
                 *     'userWalletId': 'rndmString',
                 *     'status': 'pending',
                 *     'pendingReason': 'fundsNotReceivedYetForUntrackableTx',
                 *     'cancelReason': 'relatedTxCancelled',
                 *     'errorExtraInfos': 'rndmString',
                 *     'transactionStage': [
                 *       {
                 *         'status': 'pending',
                 *         'pendingReason': 'fundsNotReceivedYetForUntrackableTx',
                 *         'cancelReason': 'relatedTxCancelled',
                 *         'date': 'Fri Jan 03 2012 13:13:25 GMT+0100 (Central European Standard Time)'
                 *       },
                 *       {
                 *         'status': 'pending',
                 *         'pendingReason': 'fundsNotReceivedYetForUntrackableTx',
                 *         'cancelReason': 'relatedTxCancelled',
                 *         'date': 'Fri Jan 03 2012 13:13:25 GMT+0100 (Central European Standard Time)'
                 *       }
                 *     ],
                 *     'transactionId': 'rndmString',
                 *     'expiresOn': 'Fri Jan 03 2012 13:13:25 GMT+0100 (Central European Standard Time)',
                 *     'hasAgreedTermsOfSales': true,
                 *     'bankTransferInformations': {
                 *       'amount': 12,
                 *       'object': 'rndmString',
                 *       'date': 'rndmString',
                 *       'pending': true,
                 *       'status': 'added',
                 *       'currency': 'rndmString'
                 *     },
                 *     'bgkSignature': 'rndmString',
                 *     'isDeletedByUser': 'Fri Jan 03 2012 13:13:25 GMT+0100 (Central European Standard Time)',
                 *     'vestingConfig': '6776baf5c7c6e518aae88072',
                 *     '_id': '6776baf5c7c6e518aae88071',
                 *     'creationDate': 'Fri Jan 03 2012 13:13:25 GMT+0100 (Central European Standard Time)',
                 *     'lastUpdateDate': 'Fri Jan 03 2012 13:13:25 GMT+0100 (Central European Standard Time)',
                 *     'lastUpdater': '6776baf5c7c6e518aae88072'
                 *   }
                 * ]
             */
                icoTransactionGetAll(
                    filter ?: AsFilter<modelTypes.IcoTransactionModels['Write']>,
                    config ?: never
                ): Promise<modelTypes.IcoTransactionModels['Read'][]>
icoTransactionGetAll<Config extends Omit<RequestConfigRead<modelTypes.IcoTransactionModels['Read']>, 'filter'>>(
    filter ?: AsFilter<modelTypes.IcoTransactionModels['Write']>,
    config ?: Config
): Promise<MaybePaginated<modelTypes.IcoTransactionModels['Read'][], Config>>,
    /** Allow to get the last ressources by creation date
     * @example
     * [
     *   {
     *     'user': '6776baf5c7c6e518aae88072',
     *     'sourceAmount': 12,
     *     'receivedAmount': 12,
     *     'sourceCurrency': 'eur',
     *     'blockchainNetwork': 'ethereum',
     *     'conversionRate': 12,
     *     'amountInEuros': 12,
     *     'amountInDollars': 12,
     *     'ethTransactionHash': 'rndmString',
     *     'solTransactionHash': 'rndmString',
     *     'bitcoinTransactionHash': 'rndmString',
     *     'bonusCode': '6776baf5c7c6e518aae88072',
     *     'validator': '6776baf5c7c6e518aae88072',
     *     'bgkPurchaseRequested': 12,
     *     'bgkReceivedAfterFeesAndAdjustment': 12,
     *     'acquisitionPrice': 12,
     *     'paymentMethod': 'solanaWithWalletConnector',
     *     'userWallet': {
     *       'address': 'rndmString',
     *       'blockchain': 'solana'
     *     },
     *     'userWalletId': 'rndmString',
     *     'status': 'pending',
     *     'pendingReason': 'fundsNotReceivedYetForUntrackableTx',
     *     'cancelReason': 'relatedTxCancelled',
     *     'errorExtraInfos': 'rndmString',
     *     'transactionStage': [
     *       {
     *         'status': 'pending',
     *         'pendingReason': 'fundsNotReceivedYetForUntrackableTx',
     *         'cancelReason': 'relatedTxCancelled',
     *         'date': 'Fri Jan 03 2012 13:13:25 GMT+0100 (Central European Standard Time)'
     *       },
     *       {
     *         'status': 'pending',
     *         'pendingReason': 'fundsNotReceivedYetForUntrackableTx',
     *         'cancelReason': 'relatedTxCancelled',
     *         'date': 'Fri Jan 03 2012 13:13:25 GMT+0100 (Central European Standard Time)'
     *       }
     *     ],
     *     'transactionId': 'rndmString',
     *     'expiresOn': 'Fri Jan 03 2012 13:13:25 GMT+0100 (Central European Standard Time)',
     *     'hasAgreedTermsOfSales': true,
     *     'bankTransferInformations': {
     *       'amount': 12,
     *       'object': 'rndmString',
     *       'date': 'rndmString',
     *       'pending': true,
     *       'status': 'added',
     *       'currency': 'rndmString'
     *     },
     *     'bgkSignature': 'rndmString',
     *     'isDeletedByUser': 'Fri Jan 03 2012 13:13:25 GMT+0100 (Central European Standard Time)',
     *     'vestingConfig': '6776baf5c7c6e518aae88072',
     *     '_id': '6776baf5c7c6e518aae88071',
     *     'creationDate': 'Fri Jan 03 2012 13:13:25 GMT+0100 (Central European Standard Time)',
     *     'lastUpdateDate': 'Fri Jan 03 2012 13:13:25 GMT+0100 (Central European Standard Time)',
     *     'lastUpdater': '6776baf5c7c6e518aae88072'
     *   },
     *   {
     *     'user': '6776baf5c7c6e518aae88072',
     *     'sourceAmount': 12,
     *     'receivedAmount': 12,
     *     'sourceCurrency': 'eur',
     *     'blockchainNetwork': 'ethereum',
     *     'conversionRate': 12,
     *     'amountInEuros': 12,
     *     'amountInDollars': 12,
     *     'ethTransactionHash': 'rndmString',
     *     'solTransactionHash': 'rndmString',
     *     'bitcoinTransactionHash': 'rndmString',
     *     'bonusCode': '6776baf5c7c6e518aae88072',
     *     'validator': '6776baf5c7c6e518aae88072',
     *     'bgkPurchaseRequested': 12,
     *     'bgkReceivedAfterFeesAndAdjustment': 12,
     *     'acquisitionPrice': 12,
     *     'paymentMethod': 'solanaWithWalletConnector',
     *     'userWallet': {
     *       'address': 'rndmString',
     *       'blockchain': 'solana'
     *     },
     *     'userWalletId': 'rndmString',
     *     'status': 'pending',
     *     'pendingReason': 'fundsNotReceivedYetForUntrackableTx',
     *     'cancelReason': 'relatedTxCancelled',
     *     'errorExtraInfos': 'rndmString',
     *     'transactionStage': [
     *       {
     *         'status': 'pending',
     *         'pendingReason': 'fundsNotReceivedYetForUntrackableTx',
     *         'cancelReason': 'relatedTxCancelled',
     *         'date': 'Fri Jan 03 2012 13:13:25 GMT+0100 (Central European Standard Time)'
     *       },
     *       {
     *         'status': 'pending',
     *         'pendingReason': 'fundsNotReceivedYetForUntrackableTx',
     *         'cancelReason': 'relatedTxCancelled',
     *         'date': 'Fri Jan 03 2012 13:13:25 GMT+0100 (Central European Standard Time)'
     *       }
     *     ],
     *     'transactionId': 'rndmString',
     *     'expiresOn': 'Fri Jan 03 2012 13:13:25 GMT+0100 (Central European Standard Time)',
     *     'hasAgreedTermsOfSales': true,
     *     'bankTransferInformations': {
     *       'amount': 12,
     *       'object': 'rndmString',
     *       'date': 'rndmString',
     *       'pending': true,
     *       'status': 'added',
     *       'currency': 'rndmString'
     *     },
     *     'bgkSignature': 'rndmString',
     *     'isDeletedByUser': 'Fri Jan 03 2012 13:13:25 GMT+0100 (Central European Standard Time)',
     *     'vestingConfig': '6776baf5c7c6e518aae88072',
     *     '_id': '6776baf5c7c6e518aae88071',
     *     'creationDate': 'Fri Jan 03 2012 13:13:25 GMT+0100 (Central European Standard Time)',
     *     'lastUpdateDate': 'Fri Jan 03 2012 13:13:25 GMT+0100 (Central European Standard Time)',
     *     'lastUpdater': '6776baf5c7c6e518aae88072'
     *   }
     * ]
 */
    icoTransactionGetLastN(
        limit ?: number,
        config ?: never,
    ): Promise<modelTypes.IcoTransactionModels['Read'][]>
icoTransactionGetLastN<Config extends RequestConfigRead<modelTypes.IcoTransactionModels['Read']>>(
    limit ?: number,
    config ?: Config,
): Promise<MaybePaginated<modelTypes.IcoTransactionModels['Read'][], Config>>,
    /** Allow to get the first ressources by creation date
     * @example
     * [
     *   {
     *     'user': '6776baf5c7c6e518aae88072',
     *     'sourceAmount': 12,
     *     'receivedAmount': 12,
     *     'sourceCurrency': 'eur',
     *     'blockchainNetwork': 'ethereum',
     *     'conversionRate': 12,
     *     'amountInEuros': 12,
     *     'amountInDollars': 12,
     *     'ethTransactionHash': 'rndmString',
     *     'solTransactionHash': 'rndmString',
     *     'bitcoinTransactionHash': 'rndmString',
     *     'bonusCode': '6776baf5c7c6e518aae88072',
     *     'validator': '6776baf5c7c6e518aae88072',
     *     'bgkPurchaseRequested': 12,
     *     'bgkReceivedAfterFeesAndAdjustment': 12,
     *     'acquisitionPrice': 12,
     *     'paymentMethod': 'solanaWithWalletConnector',
     *     'userWallet': {
     *       'address': 'rndmString',
     *       'blockchain': 'solana'
     *     },
     *     'userWalletId': 'rndmString',
     *     'status': 'pending',
     *     'pendingReason': 'fundsNotReceivedYetForUntrackableTx',
     *     'cancelReason': 'relatedTxCancelled',
     *     'errorExtraInfos': 'rndmString',
     *     'transactionStage': [
     *       {
     *         'status': 'pending',
     *         'pendingReason': 'fundsNotReceivedYetForUntrackableTx',
     *         'cancelReason': 'relatedTxCancelled',
     *         'date': 'Fri Jan 03 2012 13:13:25 GMT+0100 (Central European Standard Time)'
     *       },
     *       {
     *         'status': 'pending',
     *         'pendingReason': 'fundsNotReceivedYetForUntrackableTx',
     *         'cancelReason': 'relatedTxCancelled',
     *         'date': 'Fri Jan 03 2012 13:13:25 GMT+0100 (Central European Standard Time)'
     *       }
     *     ],
     *     'transactionId': 'rndmString',
     *     'expiresOn': 'Fri Jan 03 2012 13:13:25 GMT+0100 (Central European Standard Time)',
     *     'hasAgreedTermsOfSales': true,
     *     'bankTransferInformations': {
     *       'amount': 12,
     *       'object': 'rndmString',
     *       'date': 'rndmString',
     *       'pending': true,
     *       'status': 'added',
     *       'currency': 'rndmString'
     *     },
     *     'bgkSignature': 'rndmString',
     *     'isDeletedByUser': 'Fri Jan 03 2012 13:13:25 GMT+0100 (Central European Standard Time)',
     *     'vestingConfig': '6776baf5c7c6e518aae88072',
     *     '_id': '6776baf5c7c6e518aae88071',
     *     'creationDate': 'Fri Jan 03 2012 13:13:25 GMT+0100 (Central European Standard Time)',
     *     'lastUpdateDate': 'Fri Jan 03 2012 13:13:25 GMT+0100 (Central European Standard Time)',
     *     'lastUpdater': '6776baf5c7c6e518aae88072'
     *   },
     *   {
     *     'user': '6776baf5c7c6e518aae88072',
     *     'sourceAmount': 12,
     *     'receivedAmount': 12,
     *     'sourceCurrency': 'eur',
     *     'blockchainNetwork': 'ethereum',
     *     'conversionRate': 12,
     *     'amountInEuros': 12,
     *     'amountInDollars': 12,
     *     'ethTransactionHash': 'rndmString',
     *     'solTransactionHash': 'rndmString',
     *     'bitcoinTransactionHash': 'rndmString',
     *     'bonusCode': '6776baf5c7c6e518aae88072',
     *     'validator': '6776baf5c7c6e518aae88072',
     *     'bgkPurchaseRequested': 12,
     *     'bgkReceivedAfterFeesAndAdjustment': 12,
     *     'acquisitionPrice': 12,
     *     'paymentMethod': 'solanaWithWalletConnector',
     *     'userWallet': {
     *       'address': 'rndmString',
     *       'blockchain': 'solana'
     *     },
     *     'userWalletId': 'rndmString',
     *     'status': 'pending',
     *     'pendingReason': 'fundsNotReceivedYetForUntrackableTx',
     *     'cancelReason': 'relatedTxCancelled',
     *     'errorExtraInfos': 'rndmString',
     *     'transactionStage': [
     *       {
     *         'status': 'pending',
     *         'pendingReason': 'fundsNotReceivedYetForUntrackableTx',
     *         'cancelReason': 'relatedTxCancelled',
     *         'date': 'Fri Jan 03 2012 13:13:25 GMT+0100 (Central European Standard Time)'
     *       },
     *       {
     *         'status': 'pending',
     *         'pendingReason': 'fundsNotReceivedYetForUntrackableTx',
     *         'cancelReason': 'relatedTxCancelled',
     *         'date': 'Fri Jan 03 2012 13:13:25 GMT+0100 (Central European Standard Time)'
     *       }
     *     ],
     *     'transactionId': 'rndmString',
     *     'expiresOn': 'Fri Jan 03 2012 13:13:25 GMT+0100 (Central European Standard Time)',
     *     'hasAgreedTermsOfSales': true,
     *     'bankTransferInformations': {
     *       'amount': 12,
     *       'object': 'rndmString',
     *       'date': 'rndmString',
     *       'pending': true,
     *       'status': 'added',
     *       'currency': 'rndmString'
     *     },
     *     'bgkSignature': 'rndmString',
     *     'isDeletedByUser': 'Fri Jan 03 2012 13:13:25 GMT+0100 (Central European Standard Time)',
     *     'vestingConfig': '6776baf5c7c6e518aae88072',
     *     '_id': '6776baf5c7c6e518aae88071',
     *     'creationDate': 'Fri Jan 03 2012 13:13:25 GMT+0100 (Central European Standard Time)',
     *     'lastUpdateDate': 'Fri Jan 03 2012 13:13:25 GMT+0100 (Central European Standard Time)',
     *     'lastUpdater': '6776baf5c7c6e518aae88072'
     *   }
     * ]
 */
    icoTransactionGetFirstN(
        limit ?: number,
        config ?: never
    ): Promise<modelTypes.IcoTransactionModels['Read'][]>
icoTransactionGetFirstN<Config extends RequestConfigRead<modelTypes.IcoTransactionModels['Read']>>(
    limit ?: number,
    config ?: Config
): Promise<MaybePaginated<modelTypes.IcoTransactionModels['Read'][], Config>>,
    /** Count the number of ressources matching the filter in first param or all ressources if no filter is provided
     * @example
     * 12
 */
    icoTransactionCount(
        filter ?: AsFilter<modelTypes.IcoTransactionModels['Write']>
    ): Promise<number>,
        /** Allow to get a ressource by it's unique mongoDb _id
         * @errorCodes
         * - 404: ressourceDoesNotExists
         * @example
         * {
         *   'user': '6776baf5c7c6e518aae88072',
         *   'sourceAmount': 12,
         *   'receivedAmount': 12,
         *   'sourceCurrency': 'eur',
         *   'blockchainNetwork': 'ethereum',
         *   'conversionRate': 12,
         *   'amountInEuros': 12,
         *   'amountInDollars': 12,
         *   'ethTransactionHash': 'rndmString',
         *   'solTransactionHash': 'rndmString',
         *   'bitcoinTransactionHash': 'rndmString',
         *   'bonusCode': '6776baf5c7c6e518aae88072',
         *   'validator': '6776baf5c7c6e518aae88072',
         *   'bgkPurchaseRequested': 12,
         *   'bgkReceivedAfterFeesAndAdjustment': 12,
         *   'acquisitionPrice': 12,
         *   'paymentMethod': 'solanaWithWalletConnector',
         *   'userWallet': {
         *     'address': 'rndmString',
         *     'blockchain': 'solana'
         *   },
         *   'userWalletId': 'rndmString',
         *   'status': 'pending',
         *   'pendingReason': 'fundsNotReceivedYetForUntrackableTx',
         *   'cancelReason': 'relatedTxCancelled',
         *   'errorExtraInfos': 'rndmString',
         *   'transactionStage': [
         *     {
         *       'status': 'pending',
         *       'pendingReason': 'fundsNotReceivedYetForUntrackableTx',
         *       'cancelReason': 'relatedTxCancelled',
         *       'date': 'Fri Jan 03 2012 13:13:25 GMT+0100 (Central European Standard Time)'
         *     },
         *     {
         *       'status': 'pending',
         *       'pendingReason': 'fundsNotReceivedYetForUntrackableTx',
         *       'cancelReason': 'relatedTxCancelled',
         *       'date': 'Fri Jan 03 2012 13:13:25 GMT+0100 (Central European Standard Time)'
         *     }
         *   ],
         *   'transactionId': 'rndmString',
         *   'expiresOn': 'Fri Jan 03 2012 13:13:25 GMT+0100 (Central European Standard Time)',
         *   'hasAgreedTermsOfSales': true,
         *   'bankTransferInformations': {
         *     'amount': 12,
         *     'object': 'rndmString',
         *     'date': 'rndmString',
         *     'pending': true,
         *     'status': 'added',
         *     'currency': 'rndmString'
         *   },
         *   'bgkSignature': 'rndmString',
         *   'isDeletedByUser': 'Fri Jan 03 2012 13:13:25 GMT+0100 (Central European Standard Time)',
         *   'vestingConfig': '6776baf5c7c6e518aae88072',
         *   '_id': '6776baf5c7c6e518aae88071',
         *   'creationDate': 'Fri Jan 03 2012 13:13:25 GMT+0100 (Central European Standard Time)',
         *   'lastUpdateDate': 'Fri Jan 03 2012 13:13:25 GMT+0100 (Central European Standard Time)',
         *   'lastUpdater': '6776baf5c7c6e518aae88072'
         * }
     */
        icoTransactionGetById<Config extends RequestConfigGetOne<modelTypes.IcoTransactionModels['Read']>>(
            id: string,
            config ?: Config
        ): Promise<Config['triggerErrorIfNotSet'] extends true ? modelTypes.IcoTransactionModels['Read'] : modelTypes.IcoTransactionModels['Read'] | undefined>,
            /** Allow to get a ressource with providing a filter as first param
             * @example
             * {
             *   'user': '6776baf5c7c6e518aae88072',
             *   'sourceAmount': 12,
             *   'receivedAmount': 12,
             *   'sourceCurrency': 'eur',
             *   'blockchainNetwork': 'ethereum',
             *   'conversionRate': 12,
             *   'amountInEuros': 12,
             *   'amountInDollars': 12,
             *   'ethTransactionHash': 'rndmString',
             *   'solTransactionHash': 'rndmString',
             *   'bitcoinTransactionHash': 'rndmString',
             *   'bonusCode': '6776baf5c7c6e518aae88072',
             *   'validator': '6776baf5c7c6e518aae88072',
             *   'bgkPurchaseRequested': 12,
             *   'bgkReceivedAfterFeesAndAdjustment': 12,
             *   'acquisitionPrice': 12,
             *   'paymentMethod': 'solanaWithWalletConnector',
             *   'userWallet': {
             *     'address': 'rndmString',
             *     'blockchain': 'solana'
             *   },
             *   'userWalletId': 'rndmString',
             *   'status': 'pending',
             *   'pendingReason': 'fundsNotReceivedYetForUntrackableTx',
             *   'cancelReason': 'relatedTxCancelled',
             *   'errorExtraInfos': 'rndmString',
             *   'transactionStage': [
             *     {
             *       'status': 'pending',
             *       'pendingReason': 'fundsNotReceivedYetForUntrackableTx',
             *       'cancelReason': 'relatedTxCancelled',
             *       'date': 'Fri Jan 03 2012 13:13:25 GMT+0100 (Central European Standard Time)'
             *     },
             *     {
             *       'status': 'pending',
             *       'pendingReason': 'fundsNotReceivedYetForUntrackableTx',
             *       'cancelReason': 'relatedTxCancelled',
             *       'date': 'Fri Jan 03 2012 13:13:25 GMT+0100 (Central European Standard Time)'
             *     }
             *   ],
             *   'transactionId': 'rndmString',
             *   'expiresOn': 'Fri Jan 03 2012 13:13:25 GMT+0100 (Central European Standard Time)',
             *   'hasAgreedTermsOfSales': true,
             *   'bankTransferInformations': {
             *     'amount': 12,
             *     'object': 'rndmString',
             *     'date': 'rndmString',
             *     'pending': true,
             *     'status': 'added',
             *     'currency': 'rndmString'
             *   },
             *   'bgkSignature': 'rndmString',
             *   'isDeletedByUser': 'Fri Jan 03 2012 13:13:25 GMT+0100 (Central European Standard Time)',
             *   'vestingConfig': '6776baf5c7c6e518aae88072',
             *   '_id': '6776baf5c7c6e518aae88071',
             *   'creationDate': 'Fri Jan 03 2012 13:13:25 GMT+0100 (Central European Standard Time)',
             *   'lastUpdateDate': 'Fri Jan 03 2012 13:13:25 GMT+0100 (Central European Standard Time)',
             *   'lastUpdater': '6776baf5c7c6e518aae88072'
             * }
         */
            icoTransactionGetOne<Config extends Omit<RequestConfigGetOne<modelTypes.IcoTransactionModels['Read']>, 'filter'>>(
                filter ?: AsFilter<modelTypes.IcoTransactionModels['Write']>, // WRITE HERE because it will ensure referenced fields are passed as their string counterpart
                config ?: Config
            ): Promise<Config['triggerErrorIfNotSet'] extends true ? modelTypes.IcoTransactionModels['Read'] : modelTypes.IcoTransactionModels['Read'] | undefined>,
                /** Allow to get all ressources with providing a filter as first param
                 * @example
                 * [
                 *   {
                 *     'hash': 'rndmString',
                 *     'amount': 12,
                 *     'matchingTransactions': [
                 *       '6776baf5c7c6e518aae88072',
                 *       '6776baf5c7c6e518aae88072'
                 *     ],
                 *     'assignedUser': '6776baf5c7c6e518aae88072',
                 *     'assignedWallet': '6776baf5c7c6e518aae88072',
                 *     'isHandled': true,
                 *     'currency': 'eur',
                 *     '_id': '6776baf5c7c6e518aae88071',
                 *     'creationDate': 'Fri Jan 03 2012 13:13:25 GMT+0100 (Central European Standard Time)',
                 *     'lastUpdateDate': 'Fri Jan 03 2012 13:13:25 GMT+0100 (Central European Standard Time)',
                 *     'lastUpdater': '6776baf5c7c6e518aae88072'
                 *   },
                 *   {
                 *     'hash': 'rndmString',
                 *     'amount': 12,
                 *     'matchingTransactions': [
                 *       '6776baf5c7c6e518aae88072',
                 *       '6776baf5c7c6e518aae88072'
                 *     ],
                 *     'assignedUser': '6776baf5c7c6e518aae88072',
                 *     'assignedWallet': '6776baf5c7c6e518aae88072',
                 *     'isHandled': true,
                 *     'currency': 'eur',
                 *     '_id': '6776baf5c7c6e518aae88071',
                 *     'creationDate': 'Fri Jan 03 2012 13:13:25 GMT+0100 (Central European Standard Time)',
                 *     'lastUpdateDate': 'Fri Jan 03 2012 13:13:25 GMT+0100 (Central European Standard Time)',
                 *     'lastUpdater': '6776baf5c7c6e518aae88072'
                 *   }
                 * ]
             */
                icoWalletTransactionToValidateManuallyGetAll(
                    filter ?: AsFilter<modelTypes.IcoWalletTransactionToValidateManuallyModels['Write']>,
                    config ?: never
                ): Promise<modelTypes.IcoWalletTransactionToValidateManuallyModels['Read'][]>
icoWalletTransactionToValidateManuallyGetAll<Config extends Omit<RequestConfigRead<modelTypes.IcoWalletTransactionToValidateManuallyModels['Read']>, 'filter'>>(
    filter ?: AsFilter<modelTypes.IcoWalletTransactionToValidateManuallyModels['Write']>,
    config ?: Config
): Promise<MaybePaginated<modelTypes.IcoWalletTransactionToValidateManuallyModels['Read'][], Config>>,
    /** Allow to get the last ressources by creation date
     * @example
     * [
     *   {
     *     'hash': 'rndmString',
     *     'amount': 12,
     *     'matchingTransactions': [
     *       '6776baf5c7c6e518aae88072',
     *       '6776baf5c7c6e518aae88072'
     *     ],
     *     'assignedUser': '6776baf5c7c6e518aae88072',
     *     'assignedWallet': '6776baf5c7c6e518aae88072',
     *     'isHandled': true,
     *     'currency': 'eur',
     *     '_id': '6776baf5c7c6e518aae88071',
     *     'creationDate': 'Fri Jan 03 2012 13:13:25 GMT+0100 (Central European Standard Time)',
     *     'lastUpdateDate': 'Fri Jan 03 2012 13:13:25 GMT+0100 (Central European Standard Time)',
     *     'lastUpdater': '6776baf5c7c6e518aae88072'
     *   },
     *   {
     *     'hash': 'rndmString',
     *     'amount': 12,
     *     'matchingTransactions': [
     *       '6776baf5c7c6e518aae88072',
     *       '6776baf5c7c6e518aae88072'
     *     ],
     *     'assignedUser': '6776baf5c7c6e518aae88072',
     *     'assignedWallet': '6776baf5c7c6e518aae88072',
     *     'isHandled': true,
     *     'currency': 'eur',
     *     '_id': '6776baf5c7c6e518aae88071',
     *     'creationDate': 'Fri Jan 03 2012 13:13:25 GMT+0100 (Central European Standard Time)',
     *     'lastUpdateDate': 'Fri Jan 03 2012 13:13:25 GMT+0100 (Central European Standard Time)',
     *     'lastUpdater': '6776baf5c7c6e518aae88072'
     *   }
     * ]
 */
    icoWalletTransactionToValidateManuallyGetLastN(
        limit ?: number,
        config ?: never,
    ): Promise<modelTypes.IcoWalletTransactionToValidateManuallyModels['Read'][]>
icoWalletTransactionToValidateManuallyGetLastN<Config extends RequestConfigRead<modelTypes.IcoWalletTransactionToValidateManuallyModels['Read']>>(
    limit ?: number,
    config ?: Config,
): Promise<MaybePaginated<modelTypes.IcoWalletTransactionToValidateManuallyModels['Read'][], Config>>,
    /** Allow to get the first ressources by creation date
     * @example
     * [
     *   {
     *     'hash': 'rndmString',
     *     'amount': 12,
     *     'matchingTransactions': [
     *       '6776baf5c7c6e518aae88072',
     *       '6776baf5c7c6e518aae88072'
     *     ],
     *     'assignedUser': '6776baf5c7c6e518aae88072',
     *     'assignedWallet': '6776baf5c7c6e518aae88072',
     *     'isHandled': true,
     *     'currency': 'eur',
     *     '_id': '6776baf5c7c6e518aae88071',
     *     'creationDate': 'Fri Jan 03 2012 13:13:25 GMT+0100 (Central European Standard Time)',
     *     'lastUpdateDate': 'Fri Jan 03 2012 13:13:25 GMT+0100 (Central European Standard Time)',
     *     'lastUpdater': '6776baf5c7c6e518aae88072'
     *   },
     *   {
     *     'hash': 'rndmString',
     *     'amount': 12,
     *     'matchingTransactions': [
     *       '6776baf5c7c6e518aae88072',
     *       '6776baf5c7c6e518aae88072'
     *     ],
     *     'assignedUser': '6776baf5c7c6e518aae88072',
     *     'assignedWallet': '6776baf5c7c6e518aae88072',
     *     'isHandled': true,
     *     'currency': 'eur',
     *     '_id': '6776baf5c7c6e518aae88071',
     *     'creationDate': 'Fri Jan 03 2012 13:13:25 GMT+0100 (Central European Standard Time)',
     *     'lastUpdateDate': 'Fri Jan 03 2012 13:13:25 GMT+0100 (Central European Standard Time)',
     *     'lastUpdater': '6776baf5c7c6e518aae88072'
     *   }
     * ]
 */
    icoWalletTransactionToValidateManuallyGetFirstN(
        limit ?: number,
        config ?: never
    ): Promise<modelTypes.IcoWalletTransactionToValidateManuallyModels['Read'][]>
icoWalletTransactionToValidateManuallyGetFirstN<Config extends RequestConfigRead<modelTypes.IcoWalletTransactionToValidateManuallyModels['Read']>>(
    limit ?: number,
    config ?: Config
): Promise<MaybePaginated<modelTypes.IcoWalletTransactionToValidateManuallyModels['Read'][], Config>>,
    /** Count the number of ressources matching the filter in first param or all ressources if no filter is provided
     * @example
     * 12
 */
    icoWalletTransactionToValidateManuallyCount(
        filter ?: AsFilter<modelTypes.IcoWalletTransactionToValidateManuallyModels['Write']>
    ): Promise<number>,
        /** Allow to get a ressource by it's unique mongoDb _id
         * @errorCodes
         * - 404: ressourceDoesNotExists
         * @example
         * {
         *   'hash': 'rndmString',
         *   'amount': 12,
         *   'matchingTransactions': [
         *     '6776baf5c7c6e518aae88072',
         *     '6776baf5c7c6e518aae88072'
         *   ],
         *   'assignedUser': '6776baf5c7c6e518aae88072',
         *   'assignedWallet': '6776baf5c7c6e518aae88072',
         *   'isHandled': true,
         *   'currency': 'eur',
         *   '_id': '6776baf5c7c6e518aae88071',
         *   'creationDate': 'Fri Jan 03 2012 13:13:25 GMT+0100 (Central European Standard Time)',
         *   'lastUpdateDate': 'Fri Jan 03 2012 13:13:25 GMT+0100 (Central European Standard Time)',
         *   'lastUpdater': '6776baf5c7c6e518aae88072'
         * }
     */
        icoWalletTransactionToValidateManuallyGetById<Config extends RequestConfigGetOne<modelTypes.IcoWalletTransactionToValidateManuallyModels['Read']>>(
            id: string,
            config ?: Config
        ): Promise<Config['triggerErrorIfNotSet'] extends true ? modelTypes.IcoWalletTransactionToValidateManuallyModels['Read'] : modelTypes.IcoWalletTransactionToValidateManuallyModels['Read'] | undefined>,
            /** Allow to get a ressource with providing a filter as first param
             * @example
             * {
             *   'hash': 'rndmString',
             *   'amount': 12,
             *   'matchingTransactions': [
             *     '6776baf5c7c6e518aae88072',
             *     '6776baf5c7c6e518aae88072'
             *   ],
             *   'assignedUser': '6776baf5c7c6e518aae88072',
             *   'assignedWallet': '6776baf5c7c6e518aae88072',
             *   'isHandled': true,
             *   'currency': 'eur',
             *   '_id': '6776baf5c7c6e518aae88071',
             *   'creationDate': 'Fri Jan 03 2012 13:13:25 GMT+0100 (Central European Standard Time)',
             *   'lastUpdateDate': 'Fri Jan 03 2012 13:13:25 GMT+0100 (Central European Standard Time)',
             *   'lastUpdater': '6776baf5c7c6e518aae88072'
             * }
         */
            icoWalletTransactionToValidateManuallyGetOne<Config extends Omit<RequestConfigGetOne<modelTypes.IcoWalletTransactionToValidateManuallyModels['Read']>, 'filter'>>(
                filter ?: AsFilter<modelTypes.IcoWalletTransactionToValidateManuallyModels['Write']>, // WRITE HERE because it will ensure referenced fields are passed as their string counterpart
                config ?: Config
            ): Promise<Config['triggerErrorIfNotSet'] extends true ? modelTypes.IcoWalletTransactionToValidateManuallyModels['Read'] : modelTypes.IcoWalletTransactionToValidateManuallyModels['Read'] | undefined>,
                /** Create a new document
             */
                icoWalletTransactionToValidateManuallyCreate<
                    Config extends RequestConfigWrite<modelTypes.IcoWalletTransactionToValidateManuallyModels['Write']>,
                    Body extends MaybeArray<modelTypes.IcoWalletTransactionToValidateManuallyModels['Write']>
    >(
                        body: Body,
                        config ?: Config
                    ): Promise<
                        Config['returnDoc'] extends true ?
                        Body extends any[] ? modelTypes.IcoWalletTransactionToValidateManuallyModels['Read'][] : modelTypes.IcoWalletTransactionToValidateManuallyModels['Read'] :
                        Body extends any[] ? string[] : string
                    >,
                        /** Allow to get all ressources with providing a filter as first param
                         * @example
                         * [
                         *   {
                         *     'user': '6776baf5c7c6e518aae88072',
                         *     'investment': '6776baf5c7c6e518aae88072',
                         *     'investmentProject': '6776baf5c7c6e518aae88072',
                         *     'investmentPeriodIndex': 289,
                         *     'amount': 12,
                         *     'targetCurrency': 'bangkEuro',
                         *     'status': 'pending',
                         *     '_id': '6776baf5c7c6e518aae88071',
                         *     'creationDate': 'Fri Jan 03 2012 13:13:25 GMT+0100 (Central European Standard Time)'
                         *   },
                         *   {
                         *     'user': '6776baf5c7c6e518aae88072',
                         *     'investment': '6776baf5c7c6e518aae88072',
                         *     'investmentProject': '6776baf5c7c6e518aae88072',
                         *     'investmentPeriodIndex': 289,
                         *     'amount': 12,
                         *     'targetCurrency': 'bangkEuro',
                         *     'status': 'pending',
                         *     '_id': '6776baf5c7c6e518aae88071',
                         *     'creationDate': 'Fri Jan 03 2012 13:13:25 GMT+0100 (Central European Standard Time)'
                         *   }
                         * ]
                     */
                        interestTransactionGetAll(
                            filter ?: AsFilter<modelTypes.InterestTransactionModels['Write']>,
                            config ?: never
                        ): Promise<modelTypes.InterestTransactionModels['Read'][]>
interestTransactionGetAll<Config extends Omit<RequestConfigRead<modelTypes.InterestTransactionModels['Read']>, 'filter'>>(
    filter ?: AsFilter<modelTypes.InterestTransactionModels['Write']>,
    config ?: Config
): Promise<MaybePaginated<modelTypes.InterestTransactionModels['Read'][], Config>>,
    /** Allow to get the last ressources by creation date
     * @example
     * [
     *   {
     *     'user': '6776baf5c7c6e518aae88072',
     *     'investment': '6776baf5c7c6e518aae88072',
     *     'investmentProject': '6776baf5c7c6e518aae88072',
     *     'investmentPeriodIndex': 289,
     *     'amount': 12,
     *     'targetCurrency': 'bangkEuro',
     *     'status': 'pending',
     *     '_id': '6776baf5c7c6e518aae88071',
     *     'creationDate': 'Fri Jan 03 2012 13:13:25 GMT+0100 (Central European Standard Time)'
     *   },
     *   {
     *     'user': '6776baf5c7c6e518aae88072',
     *     'investment': '6776baf5c7c6e518aae88072',
     *     'investmentProject': '6776baf5c7c6e518aae88072',
     *     'investmentPeriodIndex': 289,
     *     'amount': 12,
     *     'targetCurrency': 'bangkEuro',
     *     'status': 'pending',
     *     '_id': '6776baf5c7c6e518aae88071',
     *     'creationDate': 'Fri Jan 03 2012 13:13:25 GMT+0100 (Central European Standard Time)'
     *   }
     * ]
 */
    interestTransactionGetLastN(
        limit ?: number,
        config ?: never,
    ): Promise<modelTypes.InterestTransactionModels['Read'][]>
interestTransactionGetLastN<Config extends RequestConfigRead<modelTypes.InterestTransactionModels['Read']>>(
    limit ?: number,
    config ?: Config,
): Promise<MaybePaginated<modelTypes.InterestTransactionModels['Read'][], Config>>,
    /** Allow to get the first ressources by creation date
     * @example
     * [
     *   {
     *     'user': '6776baf5c7c6e518aae88072',
     *     'investment': '6776baf5c7c6e518aae88072',
     *     'investmentProject': '6776baf5c7c6e518aae88072',
     *     'investmentPeriodIndex': 289,
     *     'amount': 12,
     *     'targetCurrency': 'bangkEuro',
     *     'status': 'pending',
     *     '_id': '6776baf5c7c6e518aae88071',
     *     'creationDate': 'Fri Jan 03 2012 13:13:25 GMT+0100 (Central European Standard Time)'
     *   },
     *   {
     *     'user': '6776baf5c7c6e518aae88072',
     *     'investment': '6776baf5c7c6e518aae88072',
     *     'investmentProject': '6776baf5c7c6e518aae88072',
     *     'investmentPeriodIndex': 289,
     *     'amount': 12,
     *     'targetCurrency': 'bangkEuro',
     *     'status': 'pending',
     *     '_id': '6776baf5c7c6e518aae88071',
     *     'creationDate': 'Fri Jan 03 2012 13:13:25 GMT+0100 (Central European Standard Time)'
     *   }
     * ]
 */
    interestTransactionGetFirstN(
        limit ?: number,
        config ?: never
    ): Promise<modelTypes.InterestTransactionModels['Read'][]>
interestTransactionGetFirstN<Config extends RequestConfigRead<modelTypes.InterestTransactionModels['Read']>>(
    limit ?: number,
    config ?: Config
): Promise<MaybePaginated<modelTypes.InterestTransactionModels['Read'][], Config>>,
    /** Count the number of ressources matching the filter in first param or all ressources if no filter is provided
     * @example
     * 12
 */
    interestTransactionCount(
        filter ?: AsFilter<modelTypes.InterestTransactionModels['Write']>
    ): Promise<number>,
        /** Allow to get a ressource by it's unique mongoDb _id
         * @errorCodes
         * - 404: ressourceDoesNotExists
         * @example
         * {
         *   'user': '6776baf5c7c6e518aae88072',
         *   'investment': '6776baf5c7c6e518aae88072',
         *   'investmentProject': '6776baf5c7c6e518aae88072',
         *   'investmentPeriodIndex': 289,
         *   'amount': 12,
         *   'targetCurrency': 'bangkEuro',
         *   'status': 'pending',
         *   '_id': '6776baf5c7c6e518aae88071',
         *   'creationDate': 'Fri Jan 03 2012 13:13:25 GMT+0100 (Central European Standard Time)'
         * }
     */
        interestTransactionGetById<Config extends RequestConfigGetOne<modelTypes.InterestTransactionModels['Read']>>(
            id: string,
            config ?: Config
        ): Promise<Config['triggerErrorIfNotSet'] extends true ? modelTypes.InterestTransactionModels['Read'] : modelTypes.InterestTransactionModels['Read'] | undefined>,
            /** Allow to get a ressource with providing a filter as first param
             * @example
             * {
             *   'user': '6776baf5c7c6e518aae88072',
             *   'investment': '6776baf5c7c6e518aae88072',
             *   'investmentProject': '6776baf5c7c6e518aae88072',
             *   'investmentPeriodIndex': 289,
             *   'amount': 12,
             *   'targetCurrency': 'bangkEuro',
             *   'status': 'pending',
             *   '_id': '6776baf5c7c6e518aae88071',
             *   'creationDate': 'Fri Jan 03 2012 13:13:25 GMT+0100 (Central European Standard Time)'
             * }
         */
            interestTransactionGetOne<Config extends Omit<RequestConfigGetOne<modelTypes.InterestTransactionModels['Read']>, 'filter'>>(
                filter ?: AsFilter<modelTypes.InterestTransactionModels['Write']>, // WRITE HERE because it will ensure referenced fields are passed as their string counterpart
                config ?: Config
            ): Promise<Config['triggerErrorIfNotSet'] extends true ? modelTypes.InterestTransactionModels['Read'] : modelTypes.InterestTransactionModels['Read'] | undefined>,
                /** Allow to get all ressources with providing a filter as first param
                 * @example
                 * [
                 *   {
                 *     'investmentType': 'rndmString',
                 *     'investmentProject': '6776baf5c7c6e518aae88072',
                 *     'totalNbShares': 12,
                 *     'nbSharesInSellOffer': 12,
                 *     'nbSharesSold': 12,
                 *     'transactions': [
                 *       '6776baf5c7c6e518aae88072',
                 *       '6776baf5c7c6e518aae88072'
                 *     ],
                 *     '_id': '6776baf5c7c6e518aae88071',
                 *     'creationDate': 'Fri Jan 03 2012 13:13:25 GMT+0100 (Central European Standard Time)',
                 *     'creator': '6776baf5c7c6e518aae88072'
                 *   },
                 *   {
                 *     'investmentType': 'rndmString',
                 *     'investmentProject': '6776baf5c7c6e518aae88072',
                 *     'totalNbShares': 12,
                 *     'nbSharesInSellOffer': 12,
                 *     'nbSharesSold': 12,
                 *     'transactions': [
                 *       '6776baf5c7c6e518aae88072',
                 *       '6776baf5c7c6e518aae88072'
                 *     ],
                 *     '_id': '6776baf5c7c6e518aae88071',
                 *     'creationDate': 'Fri Jan 03 2012 13:13:25 GMT+0100 (Central European Standard Time)',
                 *     'creator': '6776baf5c7c6e518aae88072'
                 *   }
                 * ]
             */
                investmentBondsGetAll(
                    filter ?: AsFilter<modelTypes.InvestmentBondsModels['Write']>,
                    config ?: never
                ): Promise<modelTypes.InvestmentBondsModels['Read'][]>
investmentBondsGetAll<Config extends Omit<RequestConfigRead<modelTypes.InvestmentBondsModels['Read']>, 'filter'>>(
    filter ?: AsFilter<modelTypes.InvestmentBondsModels['Write']>,
    config ?: Config
): Promise<MaybePaginated<modelTypes.InvestmentBondsModels['Read'][], Config>>,
    /** Allow to get the last ressources by creation date
     * @example
     * [
     *   {
     *     'investmentType': 'rndmString',
     *     'investmentProject': '6776baf5c7c6e518aae88072',
     *     'totalNbShares': 12,
     *     'nbSharesInSellOffer': 12,
     *     'nbSharesSold': 12,
     *     'transactions': [
     *       '6776baf5c7c6e518aae88072',
     *       '6776baf5c7c6e518aae88072'
     *     ],
     *     '_id': '6776baf5c7c6e518aae88071',
     *     'creationDate': 'Fri Jan 03 2012 13:13:25 GMT+0100 (Central European Standard Time)',
     *     'creator': '6776baf5c7c6e518aae88072'
     *   },
     *   {
     *     'investmentType': 'rndmString',
     *     'investmentProject': '6776baf5c7c6e518aae88072',
     *     'totalNbShares': 12,
     *     'nbSharesInSellOffer': 12,
     *     'nbSharesSold': 12,
     *     'transactions': [
     *       '6776baf5c7c6e518aae88072',
     *       '6776baf5c7c6e518aae88072'
     *     ],
     *     '_id': '6776baf5c7c6e518aae88071',
     *     'creationDate': 'Fri Jan 03 2012 13:13:25 GMT+0100 (Central European Standard Time)',
     *     'creator': '6776baf5c7c6e518aae88072'
     *   }
     * ]
 */
    investmentBondsGetLastN(
        limit ?: number,
        config ?: never,
    ): Promise<modelTypes.InvestmentBondsModels['Read'][]>
investmentBondsGetLastN<Config extends RequestConfigRead<modelTypes.InvestmentBondsModels['Read']>>(
    limit ?: number,
    config ?: Config,
): Promise<MaybePaginated<modelTypes.InvestmentBondsModels['Read'][], Config>>,
    /** Allow to get the first ressources by creation date
     * @example
     * [
     *   {
     *     'investmentType': 'rndmString',
     *     'investmentProject': '6776baf5c7c6e518aae88072',
     *     'totalNbShares': 12,
     *     'nbSharesInSellOffer': 12,
     *     'nbSharesSold': 12,
     *     'transactions': [
     *       '6776baf5c7c6e518aae88072',
     *       '6776baf5c7c6e518aae88072'
     *     ],
     *     '_id': '6776baf5c7c6e518aae88071',
     *     'creationDate': 'Fri Jan 03 2012 13:13:25 GMT+0100 (Central European Standard Time)',
     *     'creator': '6776baf5c7c6e518aae88072'
     *   },
     *   {
     *     'investmentType': 'rndmString',
     *     'investmentProject': '6776baf5c7c6e518aae88072',
     *     'totalNbShares': 12,
     *     'nbSharesInSellOffer': 12,
     *     'nbSharesSold': 12,
     *     'transactions': [
     *       '6776baf5c7c6e518aae88072',
     *       '6776baf5c7c6e518aae88072'
     *     ],
     *     '_id': '6776baf5c7c6e518aae88071',
     *     'creationDate': 'Fri Jan 03 2012 13:13:25 GMT+0100 (Central European Standard Time)',
     *     'creator': '6776baf5c7c6e518aae88072'
     *   }
     * ]
 */
    investmentBondsGetFirstN(
        limit ?: number,
        config ?: never
    ): Promise<modelTypes.InvestmentBondsModels['Read'][]>
investmentBondsGetFirstN<Config extends RequestConfigRead<modelTypes.InvestmentBondsModels['Read']>>(
    limit ?: number,
    config ?: Config
): Promise<MaybePaginated<modelTypes.InvestmentBondsModels['Read'][], Config>>,
    /** Count the number of ressources matching the filter in first param or all ressources if no filter is provided
     * @example
     * 12
 */
    investmentBondsCount(
        filter ?: AsFilter<modelTypes.InvestmentBondsModels['Write']>
    ): Promise<number>,
        /** Allow to get a ressource by it's unique mongoDb _id
         * @errorCodes
         * - 404: ressourceDoesNotExists
         * @example
         * {
         *   'investmentType': 'rndmString',
         *   'investmentProject': '6776baf5c7c6e518aae88072',
         *   'totalNbShares': 12,
         *   'nbSharesInSellOffer': 12,
         *   'nbSharesSold': 12,
         *   'transactions': [
         *     '6776baf5c7c6e518aae88072',
         *     '6776baf5c7c6e518aae88072'
         *   ],
         *   '_id': '6776baf5c7c6e518aae88071',
         *   'creationDate': 'Fri Jan 03 2012 13:13:25 GMT+0100 (Central European Standard Time)',
         *   'creator': '6776baf5c7c6e518aae88072'
         * }
     */
        investmentBondsGetById<Config extends RequestConfigGetOne<modelTypes.InvestmentBondsModels['Read']>>(
            id: string,
            config ?: Config
        ): Promise<Config['triggerErrorIfNotSet'] extends true ? modelTypes.InvestmentBondsModels['Read'] : modelTypes.InvestmentBondsModels['Read'] | undefined>,
            /** Allow to get a ressource with providing a filter as first param
             * @example
             * {
             *   'investmentType': 'rndmString',
             *   'investmentProject': '6776baf5c7c6e518aae88072',
             *   'totalNbShares': 12,
             *   'nbSharesInSellOffer': 12,
             *   'nbSharesSold': 12,
             *   'transactions': [
             *     '6776baf5c7c6e518aae88072',
             *     '6776baf5c7c6e518aae88072'
             *   ],
             *   '_id': '6776baf5c7c6e518aae88071',
             *   'creationDate': 'Fri Jan 03 2012 13:13:25 GMT+0100 (Central European Standard Time)',
             *   'creator': '6776baf5c7c6e518aae88072'
             * }
         */
            investmentBondsGetOne<Config extends Omit<RequestConfigGetOne<modelTypes.InvestmentBondsModels['Read']>, 'filter'>>(
                filter ?: AsFilter<modelTypes.InvestmentBondsModels['Write']>, // WRITE HERE because it will ensure referenced fields are passed as their string counterpart
                config ?: Config
            ): Promise<Config['triggerErrorIfNotSet'] extends true ? modelTypes.InvestmentBondsModels['Read'] : modelTypes.InvestmentBondsModels['Read'] | undefined>,
                /** Allow to get all ressources with providing a filter as first param
                 * @example
                 * [
                 *   {
                 *     'investmentType': 'rndmString',
                 *     'investmentProject': '6776baf5c7c6e518aae88072',
                 *     'totalNbShares': 12,
                 *     'nbSharesInSellOffer': 12,
                 *     'nbSharesSold': 12,
                 *     'transactions': [
                 *       '6776baf5c7c6e518aae88072',
                 *       '6776baf5c7c6e518aae88072'
                 *     ],
                 *     '_id': '6776baf5c7c6e518aae88071',
                 *     'creationDate': 'Fri Jan 03 2012 13:13:25 GMT+0100 (Central European Standard Time)',
                 *     'creator': '6776baf5c7c6e518aae88072'
                 *   },
                 *   {
                 *     'investmentType': 'rndmString',
                 *     'investmentProject': '6776baf5c7c6e518aae88072',
                 *     'totalNbShares': 12,
                 *     'nbSharesInSellOffer': 12,
                 *     'nbSharesSold': 12,
                 *     'transactions': [
                 *       '6776baf5c7c6e518aae88072',
                 *       '6776baf5c7c6e518aae88072'
                 *     ],
                 *     '_id': '6776baf5c7c6e518aae88071',
                 *     'creationDate': 'Fri Jan 03 2012 13:13:25 GMT+0100 (Central European Standard Time)',
                 *     'creator': '6776baf5c7c6e518aae88072'
                 *   }
                 * ]
             */
                investmentEquityGetAll(
                    filter ?: AsFilter<modelTypes.InvestmentEquityModels['Write']>,
                    config ?: never
                ): Promise<modelTypes.InvestmentEquityModels['Read'][]>
investmentEquityGetAll<Config extends Omit<RequestConfigRead<modelTypes.InvestmentEquityModels['Read']>, 'filter'>>(
    filter ?: AsFilter<modelTypes.InvestmentEquityModels['Write']>,
    config ?: Config
): Promise<MaybePaginated<modelTypes.InvestmentEquityModels['Read'][], Config>>,
    /** Allow to get the last ressources by creation date
     * @example
     * [
     *   {
     *     'investmentType': 'rndmString',
     *     'investmentProject': '6776baf5c7c6e518aae88072',
     *     'totalNbShares': 12,
     *     'nbSharesInSellOffer': 12,
     *     'nbSharesSold': 12,
     *     'transactions': [
     *       '6776baf5c7c6e518aae88072',
     *       '6776baf5c7c6e518aae88072'
     *     ],
     *     '_id': '6776baf5c7c6e518aae88071',
     *     'creationDate': 'Fri Jan 03 2012 13:13:25 GMT+0100 (Central European Standard Time)',
     *     'creator': '6776baf5c7c6e518aae88072'
     *   },
     *   {
     *     'investmentType': 'rndmString',
     *     'investmentProject': '6776baf5c7c6e518aae88072',
     *     'totalNbShares': 12,
     *     'nbSharesInSellOffer': 12,
     *     'nbSharesSold': 12,
     *     'transactions': [
     *       '6776baf5c7c6e518aae88072',
     *       '6776baf5c7c6e518aae88072'
     *     ],
     *     '_id': '6776baf5c7c6e518aae88071',
     *     'creationDate': 'Fri Jan 03 2012 13:13:25 GMT+0100 (Central European Standard Time)',
     *     'creator': '6776baf5c7c6e518aae88072'
     *   }
     * ]
 */
    investmentEquityGetLastN(
        limit ?: number,
        config ?: never,
    ): Promise<modelTypes.InvestmentEquityModels['Read'][]>
investmentEquityGetLastN<Config extends RequestConfigRead<modelTypes.InvestmentEquityModels['Read']>>(
    limit ?: number,
    config ?: Config,
): Promise<MaybePaginated<modelTypes.InvestmentEquityModels['Read'][], Config>>,
    /** Allow to get the first ressources by creation date
     * @example
     * [
     *   {
     *     'investmentType': 'rndmString',
     *     'investmentProject': '6776baf5c7c6e518aae88072',
     *     'totalNbShares': 12,
     *     'nbSharesInSellOffer': 12,
     *     'nbSharesSold': 12,
     *     'transactions': [
     *       '6776baf5c7c6e518aae88072',
     *       '6776baf5c7c6e518aae88072'
     *     ],
     *     '_id': '6776baf5c7c6e518aae88071',
     *     'creationDate': 'Fri Jan 03 2012 13:13:25 GMT+0100 (Central European Standard Time)',
     *     'creator': '6776baf5c7c6e518aae88072'
     *   },
     *   {
     *     'investmentType': 'rndmString',
     *     'investmentProject': '6776baf5c7c6e518aae88072',
     *     'totalNbShares': 12,
     *     'nbSharesInSellOffer': 12,
     *     'nbSharesSold': 12,
     *     'transactions': [
     *       '6776baf5c7c6e518aae88072',
     *       '6776baf5c7c6e518aae88072'
     *     ],
     *     '_id': '6776baf5c7c6e518aae88071',
     *     'creationDate': 'Fri Jan 03 2012 13:13:25 GMT+0100 (Central European Standard Time)',
     *     'creator': '6776baf5c7c6e518aae88072'
     *   }
     * ]
 */
    investmentEquityGetFirstN(
        limit ?: number,
        config ?: never
    ): Promise<modelTypes.InvestmentEquityModels['Read'][]>
investmentEquityGetFirstN<Config extends RequestConfigRead<modelTypes.InvestmentEquityModels['Read']>>(
    limit ?: number,
    config ?: Config
): Promise<MaybePaginated<modelTypes.InvestmentEquityModels['Read'][], Config>>,
    /** Count the number of ressources matching the filter in first param or all ressources if no filter is provided
     * @example
     * 12
 */
    investmentEquityCount(
        filter ?: AsFilter<modelTypes.InvestmentEquityModels['Write']>
    ): Promise<number>,
        /** Allow to get a ressource by it's unique mongoDb _id
         * @errorCodes
         * - 404: ressourceDoesNotExists
         * @example
         * {
         *   'investmentType': 'rndmString',
         *   'investmentProject': '6776baf5c7c6e518aae88072',
         *   'totalNbShares': 12,
         *   'nbSharesInSellOffer': 12,
         *   'nbSharesSold': 12,
         *   'transactions': [
         *     '6776baf5c7c6e518aae88072',
         *     '6776baf5c7c6e518aae88072'
         *   ],
         *   '_id': '6776baf5c7c6e518aae88071',
         *   'creationDate': 'Fri Jan 03 2012 13:13:25 GMT+0100 (Central European Standard Time)',
         *   'creator': '6776baf5c7c6e518aae88072'
         * }
     */
        investmentEquityGetById<Config extends RequestConfigGetOne<modelTypes.InvestmentEquityModels['Read']>>(
            id: string,
            config ?: Config
        ): Promise<Config['triggerErrorIfNotSet'] extends true ? modelTypes.InvestmentEquityModels['Read'] : modelTypes.InvestmentEquityModels['Read'] | undefined>,
            /** Allow to get a ressource with providing a filter as first param
             * @example
             * {
             *   'investmentType': 'rndmString',
             *   'investmentProject': '6776baf5c7c6e518aae88072',
             *   'totalNbShares': 12,
             *   'nbSharesInSellOffer': 12,
             *   'nbSharesSold': 12,
             *   'transactions': [
             *     '6776baf5c7c6e518aae88072',
             *     '6776baf5c7c6e518aae88072'
             *   ],
             *   '_id': '6776baf5c7c6e518aae88071',
             *   'creationDate': 'Fri Jan 03 2012 13:13:25 GMT+0100 (Central European Standard Time)',
             *   'creator': '6776baf5c7c6e518aae88072'
             * }
         */
            investmentEquityGetOne<Config extends Omit<RequestConfigGetOne<modelTypes.InvestmentEquityModels['Read']>, 'filter'>>(
                filter ?: AsFilter<modelTypes.InvestmentEquityModels['Write']>, // WRITE HERE because it will ensure referenced fields are passed as their string counterpart
                config ?: Config
            ): Promise<Config['triggerErrorIfNotSet'] extends true ? modelTypes.InvestmentEquityModels['Read'] : modelTypes.InvestmentEquityModels['Read'] | undefined>,
                /** Allow to get all ressources with providing a filter as first param
                 * @example
                 * [
                 *   {
                 *     'investmentType': 'rndmString',
                 *     'investmentProject': '6776baf5c7c6e518aae88072',
                 *     'totalNbShares': 12,
                 *     'nbSharesInSellOffer': 12,
                 *     'nbSharesSold': 12,
                 *     'transactions': [
                 *       '6776baf5c7c6e518aae88072',
                 *       '6776baf5c7c6e518aae88072'
                 *     ],
                 *     '_id': '6776baf5c7c6e518aae88071',
                 *     'creationDate': 'Fri Jan 03 2012 13:13:25 GMT+0100 (Central European Standard Time)',
                 *     'creator': '6776baf5c7c6e518aae88072'
                 *   },
                 *   {
                 *     'investmentType': 'rndmString',
                 *     'investmentProject': '6776baf5c7c6e518aae88072',
                 *     'totalNbShares': 12,
                 *     'nbSharesInSellOffer': 12,
                 *     'nbSharesSold': 12,
                 *     'transactions': [
                 *       '6776baf5c7c6e518aae88072',
                 *       '6776baf5c7c6e518aae88072'
                 *     ],
                 *     '_id': '6776baf5c7c6e518aae88071',
                 *     'creationDate': 'Fri Jan 03 2012 13:13:25 GMT+0100 (Central European Standard Time)',
                 *     'creator': '6776baf5c7c6e518aae88072'
                 *   }
                 * ]
             */
                investmentFundSharesGetAll(
                    filter ?: AsFilter<modelTypes.InvestmentFundSharesModels['Write']>,
                    config ?: never
                ): Promise<modelTypes.InvestmentFundSharesModels['Read'][]>
investmentFundSharesGetAll<Config extends Omit<RequestConfigRead<modelTypes.InvestmentFundSharesModels['Read']>, 'filter'>>(
    filter ?: AsFilter<modelTypes.InvestmentFundSharesModels['Write']>,
    config ?: Config
): Promise<MaybePaginated<modelTypes.InvestmentFundSharesModels['Read'][], Config>>,
    /** Allow to get the last ressources by creation date
     * @example
     * [
     *   {
     *     'investmentType': 'rndmString',
     *     'investmentProject': '6776baf5c7c6e518aae88072',
     *     'totalNbShares': 12,
     *     'nbSharesInSellOffer': 12,
     *     'nbSharesSold': 12,
     *     'transactions': [
     *       '6776baf5c7c6e518aae88072',
     *       '6776baf5c7c6e518aae88072'
     *     ],
     *     '_id': '6776baf5c7c6e518aae88071',
     *     'creationDate': 'Fri Jan 03 2012 13:13:25 GMT+0100 (Central European Standard Time)',
     *     'creator': '6776baf5c7c6e518aae88072'
     *   },
     *   {
     *     'investmentType': 'rndmString',
     *     'investmentProject': '6776baf5c7c6e518aae88072',
     *     'totalNbShares': 12,
     *     'nbSharesInSellOffer': 12,
     *     'nbSharesSold': 12,
     *     'transactions': [
     *       '6776baf5c7c6e518aae88072',
     *       '6776baf5c7c6e518aae88072'
     *     ],
     *     '_id': '6776baf5c7c6e518aae88071',
     *     'creationDate': 'Fri Jan 03 2012 13:13:25 GMT+0100 (Central European Standard Time)',
     *     'creator': '6776baf5c7c6e518aae88072'
     *   }
     * ]
 */
    investmentFundSharesGetLastN(
        limit ?: number,
        config ?: never,
    ): Promise<modelTypes.InvestmentFundSharesModels['Read'][]>
investmentFundSharesGetLastN<Config extends RequestConfigRead<modelTypes.InvestmentFundSharesModels['Read']>>(
    limit ?: number,
    config ?: Config,
): Promise<MaybePaginated<modelTypes.InvestmentFundSharesModels['Read'][], Config>>,
    /** Allow to get the first ressources by creation date
     * @example
     * [
     *   {
     *     'investmentType': 'rndmString',
     *     'investmentProject': '6776baf5c7c6e518aae88072',
     *     'totalNbShares': 12,
     *     'nbSharesInSellOffer': 12,
     *     'nbSharesSold': 12,
     *     'transactions': [
     *       '6776baf5c7c6e518aae88072',
     *       '6776baf5c7c6e518aae88072'
     *     ],
     *     '_id': '6776baf5c7c6e518aae88071',
     *     'creationDate': 'Fri Jan 03 2012 13:13:25 GMT+0100 (Central European Standard Time)',
     *     'creator': '6776baf5c7c6e518aae88072'
     *   },
     *   {
     *     'investmentType': 'rndmString',
     *     'investmentProject': '6776baf5c7c6e518aae88072',
     *     'totalNbShares': 12,
     *     'nbSharesInSellOffer': 12,
     *     'nbSharesSold': 12,
     *     'transactions': [
     *       '6776baf5c7c6e518aae88072',
     *       '6776baf5c7c6e518aae88072'
     *     ],
     *     '_id': '6776baf5c7c6e518aae88071',
     *     'creationDate': 'Fri Jan 03 2012 13:13:25 GMT+0100 (Central European Standard Time)',
     *     'creator': '6776baf5c7c6e518aae88072'
     *   }
     * ]
 */
    investmentFundSharesGetFirstN(
        limit ?: number,
        config ?: never
    ): Promise<modelTypes.InvestmentFundSharesModels['Read'][]>
investmentFundSharesGetFirstN<Config extends RequestConfigRead<modelTypes.InvestmentFundSharesModels['Read']>>(
    limit ?: number,
    config ?: Config
): Promise<MaybePaginated<modelTypes.InvestmentFundSharesModels['Read'][], Config>>,
    /** Count the number of ressources matching the filter in first param or all ressources if no filter is provided
     * @example
     * 12
 */
    investmentFundSharesCount(
        filter ?: AsFilter<modelTypes.InvestmentFundSharesModels['Write']>
    ): Promise<number>,
        /** Allow to get a ressource by it's unique mongoDb _id
         * @errorCodes
         * - 404: ressourceDoesNotExists
         * @example
         * {
         *   'investmentType': 'rndmString',
         *   'investmentProject': '6776baf5c7c6e518aae88072',
         *   'totalNbShares': 12,
         *   'nbSharesInSellOffer': 12,
         *   'nbSharesSold': 12,
         *   'transactions': [
         *     '6776baf5c7c6e518aae88072',
         *     '6776baf5c7c6e518aae88072'
         *   ],
         *   '_id': '6776baf5c7c6e518aae88071',
         *   'creationDate': 'Fri Jan 03 2012 13:13:25 GMT+0100 (Central European Standard Time)',
         *   'creator': '6776baf5c7c6e518aae88072'
         * }
     */
        investmentFundSharesGetById<Config extends RequestConfigGetOne<modelTypes.InvestmentFundSharesModels['Read']>>(
            id: string,
            config ?: Config
        ): Promise<Config['triggerErrorIfNotSet'] extends true ? modelTypes.InvestmentFundSharesModels['Read'] : modelTypes.InvestmentFundSharesModels['Read'] | undefined>,
            /** Allow to get a ressource with providing a filter as first param
             * @example
             * {
             *   'investmentType': 'rndmString',
             *   'investmentProject': '6776baf5c7c6e518aae88072',
             *   'totalNbShares': 12,
             *   'nbSharesInSellOffer': 12,
             *   'nbSharesSold': 12,
             *   'transactions': [
             *     '6776baf5c7c6e518aae88072',
             *     '6776baf5c7c6e518aae88072'
             *   ],
             *   '_id': '6776baf5c7c6e518aae88071',
             *   'creationDate': 'Fri Jan 03 2012 13:13:25 GMT+0100 (Central European Standard Time)',
             *   'creator': '6776baf5c7c6e518aae88072'
             * }
         */
            investmentFundSharesGetOne<Config extends Omit<RequestConfigGetOne<modelTypes.InvestmentFundSharesModels['Read']>, 'filter'>>(
                filter ?: AsFilter<modelTypes.InvestmentFundSharesModels['Write']>, // WRITE HERE because it will ensure referenced fields are passed as their string counterpart
                config ?: Config
            ): Promise<Config['triggerErrorIfNotSet'] extends true ? modelTypes.InvestmentFundSharesModels['Read'] : modelTypes.InvestmentFundSharesModels['Read'] | undefined>,
                /** Allow to get all ressources with providing a filter as first param
                 * @example
                 * [
                 *   {
                 *     'tokenId': 'rndmString',
                 *     'denomination': {
                 *       'fr': 'Bonjour',
                 *       'en': 'Hello'
                 *     },
                 *     'wallet': '6776baf5c7c6e518aae88072',
                 *     'baseCurrency': 'eur',
                 *     'sharePrice': 12,
                 *     'company': '6776baf5c7c6e518aae88072',
                 *     'targetInterestRatePerYear': 12,
                 *     'riskScore': 0,
                 *     'collectedAmount': 12,
                 *     'individualInvestors': 12,
                 *     'coverImage': 'rndmString',
                 *     'presentationVideoUrl': 'https://noodle.com/',
                 *     'tags': [
                 *       '6776baf5c7c6e518aae88072',
                 *       '6776baf5c7c6e518aae88072'
                 *     ],
                 *     'shortDescription': {
                 *       'fr': 'Bonjour',
                 *       'en': 'Hello'
                 *     },
                 *     'taxAdvantage': {
                 *       'fr': 'Bonjour',
                 *       'en': 'Hello'
                 *     },
                 *     'legalAnalysisInfos': [
                 *       null,
                 *       null
                 *     ],
                 *     'financialAnalysisInfos': [
                 *       null,
                 *       null
                 *     ],
                 *     'externalLinks': [
                 *       {
                 *         'label': 'smartContract',
                 *         'href': 'https://noodle.com/'
                 *       },
                 *       {
                 *         'label': 'smartContract',
                 *         'href': 'https://noodle.com/'
                 *       }
                 *     ],
                 *     'fundRaisingStartDate': 'Fri Jan 03 2012 13:13:25 GMT+0100 (Central European Standard Time)',
                 *     'fundRaisingEndDate': 'Fri Jan 03 2012 13:13:25 GMT+0100 (Central European Standard Time)',
                 *     'fundRaisingTarget': 12,
                 *     'fundRaisingMinTarget': 12,
                 *     'fundRaisingMaxTarget': 12,
                 *     'impactInfos': [
                 *       null,
                 *       null
                 *     ],
                 *     'exitHorizon': 12,
                 *     'cashbackPeriod': 'monthly',
                 *     'interestDates': [
                 *       'Fri Jan 03 2012 13:13:25 GMT+0100 (Central European Standard Time)',
                 *       'Fri Jan 03 2012 13:13:25 GMT+0100 (Central European Standard Time)'
                 *     ],
                 *     'interestPaymentStartDate': 'Fri Jan 03 2012 13:13:25 GMT+0100 (Central European Standard Time)',
                 *     'interestPaymentEndDate': 'Fri Jan 03 2012 13:13:25 GMT+0100 (Central European Standard Time)',
                 *     'investmentType': 'rndmString',
                 *     'developmentStage': {
                 *       'fr': 'Bonjour',
                 *       'en': 'Hello'
                 *     },
                 *     'location': {
                 *       'country': {
                 *         'fr': 'Bonjour',
                 *         'en': 'Hello'
                 *       },
                 *       'city': {
                 *         'fr': 'Bonjour',
                 *         'en': 'Hello'
                 *       },
                 *       'zone': {
                 *         'fr': 'Bonjour',
                 *         'en': 'Hello'
                 *       }
                 *     },
                 *     '_id': '6776baf5c7c6e518aae88071',
                 *     'creationDate': 'Fri Jan 03 2012 13:13:25 GMT+0100 (Central European Standard Time)',
                 *     'lastUpdateDate': 'Fri Jan 03 2012 13:13:25 GMT+0100 (Central European Standard Time)',
                 *     'lastUpdater': '6776baf5c7c6e518aae88072'
                 *   },
                 *   {
                 *     'tokenId': 'rndmString',
                 *     'denomination': {
                 *       'fr': 'Bonjour',
                 *       'en': 'Hello'
                 *     },
                 *     'wallet': '6776baf5c7c6e518aae88072',
                 *     'baseCurrency': 'eur',
                 *     'sharePrice': 12,
                 *     'company': '6776baf5c7c6e518aae88072',
                 *     'targetInterestRatePerYear': 12,
                 *     'riskScore': 0,
                 *     'collectedAmount': 12,
                 *     'individualInvestors': 12,
                 *     'coverImage': 'rndmString',
                 *     'presentationVideoUrl': 'https://noodle.com/',
                 *     'tags': [
                 *       '6776baf5c7c6e518aae88072',
                 *       '6776baf5c7c6e518aae88072'
                 *     ],
                 *     'shortDescription': {
                 *       'fr': 'Bonjour',
                 *       'en': 'Hello'
                 *     },
                 *     'taxAdvantage': {
                 *       'fr': 'Bonjour',
                 *       'en': 'Hello'
                 *     },
                 *     'legalAnalysisInfos': [
                 *       null,
                 *       null
                 *     ],
                 *     'financialAnalysisInfos': [
                 *       null,
                 *       null
                 *     ],
                 *     'externalLinks': [
                 *       {
                 *         'label': 'smartContract',
                 *         'href': 'https://noodle.com/'
                 *       },
                 *       {
                 *         'label': 'smartContract',
                 *         'href': 'https://noodle.com/'
                 *       }
                 *     ],
                 *     'fundRaisingStartDate': 'Fri Jan 03 2012 13:13:25 GMT+0100 (Central European Standard Time)',
                 *     'fundRaisingEndDate': 'Fri Jan 03 2012 13:13:25 GMT+0100 (Central European Standard Time)',
                 *     'fundRaisingTarget': 12,
                 *     'fundRaisingMinTarget': 12,
                 *     'fundRaisingMaxTarget': 12,
                 *     'impactInfos': [
                 *       null,
                 *       null
                 *     ],
                 *     'exitHorizon': 12,
                 *     'cashbackPeriod': 'monthly',
                 *     'interestDates': [
                 *       'Fri Jan 03 2012 13:13:25 GMT+0100 (Central European Standard Time)',
                 *       'Fri Jan 03 2012 13:13:25 GMT+0100 (Central European Standard Time)'
                 *     ],
                 *     'interestPaymentStartDate': 'Fri Jan 03 2012 13:13:25 GMT+0100 (Central European Standard Time)',
                 *     'interestPaymentEndDate': 'Fri Jan 03 2012 13:13:25 GMT+0100 (Central European Standard Time)',
                 *     'investmentType': 'rndmString',
                 *     'developmentStage': {
                 *       'fr': 'Bonjour',
                 *       'en': 'Hello'
                 *     },
                 *     'location': {
                 *       'country': {
                 *         'fr': 'Bonjour',
                 *         'en': 'Hello'
                 *       },
                 *       'city': {
                 *         'fr': 'Bonjour',
                 *         'en': 'Hello'
                 *       },
                 *       'zone': {
                 *         'fr': 'Bonjour',
                 *         'en': 'Hello'
                 *       }
                 *     },
                 *     '_id': '6776baf5c7c6e518aae88071',
                 *     'creationDate': 'Fri Jan 03 2012 13:13:25 GMT+0100 (Central European Standard Time)',
                 *     'lastUpdateDate': 'Fri Jan 03 2012 13:13:25 GMT+0100 (Central European Standard Time)',
                 *     'lastUpdater': '6776baf5c7c6e518aae88072'
                 *   }
                 * ]
             */
                investmentProjectBondsGetAll(
                    filter ?: AsFilter<modelTypes.InvestmentProjectBondsModels['Write']>,
                    config ?: never
                ): Promise<modelTypes.InvestmentProjectBondsModels['Read'][]>
investmentProjectBondsGetAll<Config extends Omit<RequestConfigRead<modelTypes.InvestmentProjectBondsModels['Read']>, 'filter'>>(
    filter ?: AsFilter<modelTypes.InvestmentProjectBondsModels['Write']>,
    config ?: Config
): Promise<MaybePaginated<modelTypes.InvestmentProjectBondsModels['Read'][], Config>>,
    /** Allow to get the last ressources by creation date
     * @example
     * [
     *   {
     *     'tokenId': 'rndmString',
     *     'denomination': {
     *       'fr': 'Bonjour',
     *       'en': 'Hello'
     *     },
     *     'wallet': '6776baf5c7c6e518aae88072',
     *     'baseCurrency': 'eur',
     *     'sharePrice': 12,
     *     'company': '6776baf5c7c6e518aae88072',
     *     'targetInterestRatePerYear': 12,
     *     'riskScore': 0,
     *     'collectedAmount': 12,
     *     'individualInvestors': 12,
     *     'coverImage': 'rndmString',
     *     'presentationVideoUrl': 'https://noodle.com/',
     *     'tags': [
     *       '6776baf5c7c6e518aae88072',
     *       '6776baf5c7c6e518aae88072'
     *     ],
     *     'shortDescription': {
     *       'fr': 'Bonjour',
     *       'en': 'Hello'
     *     },
     *     'taxAdvantage': {
     *       'fr': 'Bonjour',
     *       'en': 'Hello'
     *     },
     *     'legalAnalysisInfos': [
     *       null,
     *       null
     *     ],
     *     'financialAnalysisInfos': [
     *       null,
     *       null
     *     ],
     *     'externalLinks': [
     *       {
     *         'label': 'smartContract',
     *         'href': 'https://noodle.com/'
     *       },
     *       {
     *         'label': 'smartContract',
     *         'href': 'https://noodle.com/'
     *       }
     *     ],
     *     'fundRaisingStartDate': 'Fri Jan 03 2012 13:13:25 GMT+0100 (Central European Standard Time)',
     *     'fundRaisingEndDate': 'Fri Jan 03 2012 13:13:25 GMT+0100 (Central European Standard Time)',
     *     'fundRaisingTarget': 12,
     *     'fundRaisingMinTarget': 12,
     *     'fundRaisingMaxTarget': 12,
     *     'impactInfos': [
     *       null,
     *       null
     *     ],
     *     'exitHorizon': 12,
     *     'cashbackPeriod': 'monthly',
     *     'interestDates': [
     *       'Fri Jan 03 2012 13:13:25 GMT+0100 (Central European Standard Time)',
     *       'Fri Jan 03 2012 13:13:25 GMT+0100 (Central European Standard Time)'
     *     ],
     *     'interestPaymentStartDate': 'Fri Jan 03 2012 13:13:25 GMT+0100 (Central European Standard Time)',
     *     'interestPaymentEndDate': 'Fri Jan 03 2012 13:13:25 GMT+0100 (Central European Standard Time)',
     *     'investmentType': 'rndmString',
     *     'developmentStage': {
     *       'fr': 'Bonjour',
     *       'en': 'Hello'
     *     },
     *     'location': {
     *       'country': {
     *         'fr': 'Bonjour',
     *         'en': 'Hello'
     *       },
     *       'city': {
     *         'fr': 'Bonjour',
     *         'en': 'Hello'
     *       },
     *       'zone': {
     *         'fr': 'Bonjour',
     *         'en': 'Hello'
     *       }
     *     },
     *     '_id': '6776baf5c7c6e518aae88071',
     *     'creationDate': 'Fri Jan 03 2012 13:13:25 GMT+0100 (Central European Standard Time)',
     *     'lastUpdateDate': 'Fri Jan 03 2012 13:13:25 GMT+0100 (Central European Standard Time)',
     *     'lastUpdater': '6776baf5c7c6e518aae88072'
     *   },
     *   {
     *     'tokenId': 'rndmString',
     *     'denomination': {
     *       'fr': 'Bonjour',
     *       'en': 'Hello'
     *     },
     *     'wallet': '6776baf5c7c6e518aae88072',
     *     'baseCurrency': 'eur',
     *     'sharePrice': 12,
     *     'company': '6776baf5c7c6e518aae88072',
     *     'targetInterestRatePerYear': 12,
     *     'riskScore': 0,
     *     'collectedAmount': 12,
     *     'individualInvestors': 12,
     *     'coverImage': 'rndmString',
     *     'presentationVideoUrl': 'https://noodle.com/',
     *     'tags': [
     *       '6776baf5c7c6e518aae88072',
     *       '6776baf5c7c6e518aae88072'
     *     ],
     *     'shortDescription': {
     *       'fr': 'Bonjour',
     *       'en': 'Hello'
     *     },
     *     'taxAdvantage': {
     *       'fr': 'Bonjour',
     *       'en': 'Hello'
     *     },
     *     'legalAnalysisInfos': [
     *       null,
     *       null
     *     ],
     *     'financialAnalysisInfos': [
     *       null,
     *       null
     *     ],
     *     'externalLinks': [
     *       {
     *         'label': 'smartContract',
     *         'href': 'https://noodle.com/'
     *       },
     *       {
     *         'label': 'smartContract',
     *         'href': 'https://noodle.com/'
     *       }
     *     ],
     *     'fundRaisingStartDate': 'Fri Jan 03 2012 13:13:25 GMT+0100 (Central European Standard Time)',
     *     'fundRaisingEndDate': 'Fri Jan 03 2012 13:13:25 GMT+0100 (Central European Standard Time)',
     *     'fundRaisingTarget': 12,
     *     'fundRaisingMinTarget': 12,
     *     'fundRaisingMaxTarget': 12,
     *     'impactInfos': [
     *       null,
     *       null
     *     ],
     *     'exitHorizon': 12,
     *     'cashbackPeriod': 'monthly',
     *     'interestDates': [
     *       'Fri Jan 03 2012 13:13:25 GMT+0100 (Central European Standard Time)',
     *       'Fri Jan 03 2012 13:13:25 GMT+0100 (Central European Standard Time)'
     *     ],
     *     'interestPaymentStartDate': 'Fri Jan 03 2012 13:13:25 GMT+0100 (Central European Standard Time)',
     *     'interestPaymentEndDate': 'Fri Jan 03 2012 13:13:25 GMT+0100 (Central European Standard Time)',
     *     'investmentType': 'rndmString',
     *     'developmentStage': {
     *       'fr': 'Bonjour',
     *       'en': 'Hello'
     *     },
     *     'location': {
     *       'country': {
     *         'fr': 'Bonjour',
     *         'en': 'Hello'
     *       },
     *       'city': {
     *         'fr': 'Bonjour',
     *         'en': 'Hello'
     *       },
     *       'zone': {
     *         'fr': 'Bonjour',
     *         'en': 'Hello'
     *       }
     *     },
     *     '_id': '6776baf5c7c6e518aae88071',
     *     'creationDate': 'Fri Jan 03 2012 13:13:25 GMT+0100 (Central European Standard Time)',
     *     'lastUpdateDate': 'Fri Jan 03 2012 13:13:25 GMT+0100 (Central European Standard Time)',
     *     'lastUpdater': '6776baf5c7c6e518aae88072'
     *   }
     * ]
 */
    investmentProjectBondsGetLastN(
        limit ?: number,
        config ?: never,
    ): Promise<modelTypes.InvestmentProjectBondsModels['Read'][]>
investmentProjectBondsGetLastN<Config extends RequestConfigRead<modelTypes.InvestmentProjectBondsModels['Read']>>(
    limit ?: number,
    config ?: Config,
): Promise<MaybePaginated<modelTypes.InvestmentProjectBondsModels['Read'][], Config>>,
    /** Allow to get the first ressources by creation date
     * @example
     * [
     *   {
     *     'tokenId': 'rndmString',
     *     'denomination': {
     *       'fr': 'Bonjour',
     *       'en': 'Hello'
     *     },
     *     'wallet': '6776baf5c7c6e518aae88072',
     *     'baseCurrency': 'eur',
     *     'sharePrice': 12,
     *     'company': '6776baf5c7c6e518aae88072',
     *     'targetInterestRatePerYear': 12,
     *     'riskScore': 0,
     *     'collectedAmount': 12,
     *     'individualInvestors': 12,
     *     'coverImage': 'rndmString',
     *     'presentationVideoUrl': 'https://noodle.com/',
     *     'tags': [
     *       '6776baf5c7c6e518aae88072',
     *       '6776baf5c7c6e518aae88072'
     *     ],
     *     'shortDescription': {
     *       'fr': 'Bonjour',
     *       'en': 'Hello'
     *     },
     *     'taxAdvantage': {
     *       'fr': 'Bonjour',
     *       'en': 'Hello'
     *     },
     *     'legalAnalysisInfos': [
     *       null,
     *       null
     *     ],
     *     'financialAnalysisInfos': [
     *       null,
     *       null
     *     ],
     *     'externalLinks': [
     *       {
     *         'label': 'smartContract',
     *         'href': 'https://noodle.com/'
     *       },
     *       {
     *         'label': 'smartContract',
     *         'href': 'https://noodle.com/'
     *       }
     *     ],
     *     'fundRaisingStartDate': 'Fri Jan 03 2012 13:13:25 GMT+0100 (Central European Standard Time)',
     *     'fundRaisingEndDate': 'Fri Jan 03 2012 13:13:25 GMT+0100 (Central European Standard Time)',
     *     'fundRaisingTarget': 12,
     *     'fundRaisingMinTarget': 12,
     *     'fundRaisingMaxTarget': 12,
     *     'impactInfos': [
     *       null,
     *       null
     *     ],
     *     'exitHorizon': 12,
     *     'cashbackPeriod': 'monthly',
     *     'interestDates': [
     *       'Fri Jan 03 2012 13:13:25 GMT+0100 (Central European Standard Time)',
     *       'Fri Jan 03 2012 13:13:25 GMT+0100 (Central European Standard Time)'
     *     ],
     *     'interestPaymentStartDate': 'Fri Jan 03 2012 13:13:25 GMT+0100 (Central European Standard Time)',
     *     'interestPaymentEndDate': 'Fri Jan 03 2012 13:13:25 GMT+0100 (Central European Standard Time)',
     *     'investmentType': 'rndmString',
     *     'developmentStage': {
     *       'fr': 'Bonjour',
     *       'en': 'Hello'
     *     },
     *     'location': {
     *       'country': {
     *         'fr': 'Bonjour',
     *         'en': 'Hello'
     *       },
     *       'city': {
     *         'fr': 'Bonjour',
     *         'en': 'Hello'
     *       },
     *       'zone': {
     *         'fr': 'Bonjour',
     *         'en': 'Hello'
     *       }
     *     },
     *     '_id': '6776baf5c7c6e518aae88071',
     *     'creationDate': 'Fri Jan 03 2012 13:13:25 GMT+0100 (Central European Standard Time)',
     *     'lastUpdateDate': 'Fri Jan 03 2012 13:13:25 GMT+0100 (Central European Standard Time)',
     *     'lastUpdater': '6776baf5c7c6e518aae88072'
     *   },
     *   {
     *     'tokenId': 'rndmString',
     *     'denomination': {
     *       'fr': 'Bonjour',
     *       'en': 'Hello'
     *     },
     *     'wallet': '6776baf5c7c6e518aae88072',
     *     'baseCurrency': 'eur',
     *     'sharePrice': 12,
     *     'company': '6776baf5c7c6e518aae88072',
     *     'targetInterestRatePerYear': 12,
     *     'riskScore': 0,
     *     'collectedAmount': 12,
     *     'individualInvestors': 12,
     *     'coverImage': 'rndmString',
     *     'presentationVideoUrl': 'https://noodle.com/',
     *     'tags': [
     *       '6776baf5c7c6e518aae88072',
     *       '6776baf5c7c6e518aae88072'
     *     ],
     *     'shortDescription': {
     *       'fr': 'Bonjour',
     *       'en': 'Hello'
     *     },
     *     'taxAdvantage': {
     *       'fr': 'Bonjour',
     *       'en': 'Hello'
     *     },
     *     'legalAnalysisInfos': [
     *       null,
     *       null
     *     ],
     *     'financialAnalysisInfos': [
     *       null,
     *       null
     *     ],
     *     'externalLinks': [
     *       {
     *         'label': 'smartContract',
     *         'href': 'https://noodle.com/'
     *       },
     *       {
     *         'label': 'smartContract',
     *         'href': 'https://noodle.com/'
     *       }
     *     ],
     *     'fundRaisingStartDate': 'Fri Jan 03 2012 13:13:25 GMT+0100 (Central European Standard Time)',
     *     'fundRaisingEndDate': 'Fri Jan 03 2012 13:13:25 GMT+0100 (Central European Standard Time)',
     *     'fundRaisingTarget': 12,
     *     'fundRaisingMinTarget': 12,
     *     'fundRaisingMaxTarget': 12,
     *     'impactInfos': [
     *       null,
     *       null
     *     ],
     *     'exitHorizon': 12,
     *     'cashbackPeriod': 'monthly',
     *     'interestDates': [
     *       'Fri Jan 03 2012 13:13:25 GMT+0100 (Central European Standard Time)',
     *       'Fri Jan 03 2012 13:13:25 GMT+0100 (Central European Standard Time)'
     *     ],
     *     'interestPaymentStartDate': 'Fri Jan 03 2012 13:13:25 GMT+0100 (Central European Standard Time)',
     *     'interestPaymentEndDate': 'Fri Jan 03 2012 13:13:25 GMT+0100 (Central European Standard Time)',
     *     'investmentType': 'rndmString',
     *     'developmentStage': {
     *       'fr': 'Bonjour',
     *       'en': 'Hello'
     *     },
     *     'location': {
     *       'country': {
     *         'fr': 'Bonjour',
     *         'en': 'Hello'
     *       },
     *       'city': {
     *         'fr': 'Bonjour',
     *         'en': 'Hello'
     *       },
     *       'zone': {
     *         'fr': 'Bonjour',
     *         'en': 'Hello'
     *       }
     *     },
     *     '_id': '6776baf5c7c6e518aae88071',
     *     'creationDate': 'Fri Jan 03 2012 13:13:25 GMT+0100 (Central European Standard Time)',
     *     'lastUpdateDate': 'Fri Jan 03 2012 13:13:25 GMT+0100 (Central European Standard Time)',
     *     'lastUpdater': '6776baf5c7c6e518aae88072'
     *   }
     * ]
 */
    investmentProjectBondsGetFirstN(
        limit ?: number,
        config ?: never
    ): Promise<modelTypes.InvestmentProjectBondsModels['Read'][]>
investmentProjectBondsGetFirstN<Config extends RequestConfigRead<modelTypes.InvestmentProjectBondsModels['Read']>>(
    limit ?: number,
    config ?: Config
): Promise<MaybePaginated<modelTypes.InvestmentProjectBondsModels['Read'][], Config>>,
    /** Count the number of ressources matching the filter in first param or all ressources if no filter is provided
     * @example
     * 12
 */
    investmentProjectBondsCount(
        filter ?: AsFilter<modelTypes.InvestmentProjectBondsModels['Write']>
    ): Promise<number>,
        /** Allow to get a ressource by it's unique mongoDb _id
         * @errorCodes
         * - 404: ressourceDoesNotExists
         * @example
         * {
         *   'tokenId': 'rndmString',
         *   'denomination': {
         *     'fr': 'Bonjour',
         *     'en': 'Hello'
         *   },
         *   'wallet': '6776baf5c7c6e518aae88072',
         *   'baseCurrency': 'eur',
         *   'sharePrice': 12,
         *   'company': '6776baf5c7c6e518aae88072',
         *   'targetInterestRatePerYear': 12,
         *   'riskScore': 0,
         *   'collectedAmount': 12,
         *   'individualInvestors': 12,
         *   'coverImage': 'rndmString',
         *   'presentationVideoUrl': 'https://noodle.com/',
         *   'tags': [
         *     '6776baf5c7c6e518aae88072',
         *     '6776baf5c7c6e518aae88072'
         *   ],
         *   'shortDescription': {
         *     'fr': 'Bonjour',
         *     'en': 'Hello'
         *   },
         *   'taxAdvantage': {
         *     'fr': 'Bonjour',
         *     'en': 'Hello'
         *   },
         *   'legalAnalysisInfos': [
         *     null,
         *     null
         *   ],
         *   'financialAnalysisInfos': [
         *     null,
         *     null
         *   ],
         *   'externalLinks': [
         *     {
         *       'label': 'smartContract',
         *       'href': 'https://noodle.com/'
         *     },
         *     {
         *       'label': 'smartContract',
         *       'href': 'https://noodle.com/'
         *     }
         *   ],
         *   'fundRaisingStartDate': 'Fri Jan 03 2012 13:13:25 GMT+0100 (Central European Standard Time)',
         *   'fundRaisingEndDate': 'Fri Jan 03 2012 13:13:25 GMT+0100 (Central European Standard Time)',
         *   'fundRaisingTarget': 12,
         *   'fundRaisingMinTarget': 12,
         *   'fundRaisingMaxTarget': 12,
         *   'impactInfos': [
         *     null,
         *     null
         *   ],
         *   'exitHorizon': 12,
         *   'cashbackPeriod': 'monthly',
         *   'interestDates': [
         *     'Fri Jan 03 2012 13:13:25 GMT+0100 (Central European Standard Time)',
         *     'Fri Jan 03 2012 13:13:25 GMT+0100 (Central European Standard Time)'
         *   ],
         *   'interestPaymentStartDate': 'Fri Jan 03 2012 13:13:25 GMT+0100 (Central European Standard Time)',
         *   'interestPaymentEndDate': 'Fri Jan 03 2012 13:13:25 GMT+0100 (Central European Standard Time)',
         *   'investmentType': 'rndmString',
         *   'developmentStage': {
         *     'fr': 'Bonjour',
         *     'en': 'Hello'
         *   },
         *   'location': {
         *     'country': {
         *       'fr': 'Bonjour',
         *       'en': 'Hello'
         *     },
         *     'city': {
         *       'fr': 'Bonjour',
         *       'en': 'Hello'
         *     },
         *     'zone': {
         *       'fr': 'Bonjour',
         *       'en': 'Hello'
         *     }
         *   },
         *   '_id': '6776baf5c7c6e518aae88071',
         *   'creationDate': 'Fri Jan 03 2012 13:13:25 GMT+0100 (Central European Standard Time)',
         *   'lastUpdateDate': 'Fri Jan 03 2012 13:13:25 GMT+0100 (Central European Standard Time)',
         *   'lastUpdater': '6776baf5c7c6e518aae88072'
         * }
     */
        investmentProjectBondsGetById<Config extends RequestConfigGetOne<modelTypes.InvestmentProjectBondsModels['Read']>>(
            id: string,
            config ?: Config
        ): Promise<Config['triggerErrorIfNotSet'] extends true ? modelTypes.InvestmentProjectBondsModels['Read'] : modelTypes.InvestmentProjectBondsModels['Read'] | undefined>,
            /** Allow to get a ressource with providing a filter as first param
             * @example
             * {
             *   'tokenId': 'rndmString',
             *   'denomination': {
             *     'fr': 'Bonjour',
             *     'en': 'Hello'
             *   },
             *   'wallet': '6776baf5c7c6e518aae88072',
             *   'baseCurrency': 'eur',
             *   'sharePrice': 12,
             *   'company': '6776baf5c7c6e518aae88072',
             *   'targetInterestRatePerYear': 12,
             *   'riskScore': 0,
             *   'collectedAmount': 12,
             *   'individualInvestors': 12,
             *   'coverImage': 'rndmString',
             *   'presentationVideoUrl': 'https://noodle.com/',
             *   'tags': [
             *     '6776baf5c7c6e518aae88072',
             *     '6776baf5c7c6e518aae88072'
             *   ],
             *   'shortDescription': {
             *     'fr': 'Bonjour',
             *     'en': 'Hello'
             *   },
             *   'taxAdvantage': {
             *     'fr': 'Bonjour',
             *     'en': 'Hello'
             *   },
             *   'legalAnalysisInfos': [
             *     null,
             *     null
             *   ],
             *   'financialAnalysisInfos': [
             *     null,
             *     null
             *   ],
             *   'externalLinks': [
             *     {
             *       'label': 'smartContract',
             *       'href': 'https://noodle.com/'
             *     },
             *     {
             *       'label': 'smartContract',
             *       'href': 'https://noodle.com/'
             *     }
             *   ],
             *   'fundRaisingStartDate': 'Fri Jan 03 2012 13:13:25 GMT+0100 (Central European Standard Time)',
             *   'fundRaisingEndDate': 'Fri Jan 03 2012 13:13:25 GMT+0100 (Central European Standard Time)',
             *   'fundRaisingTarget': 12,
             *   'fundRaisingMinTarget': 12,
             *   'fundRaisingMaxTarget': 12,
             *   'impactInfos': [
             *     null,
             *     null
             *   ],
             *   'exitHorizon': 12,
             *   'cashbackPeriod': 'monthly',
             *   'interestDates': [
             *     'Fri Jan 03 2012 13:13:25 GMT+0100 (Central European Standard Time)',
             *     'Fri Jan 03 2012 13:13:25 GMT+0100 (Central European Standard Time)'
             *   ],
             *   'interestPaymentStartDate': 'Fri Jan 03 2012 13:13:25 GMT+0100 (Central European Standard Time)',
             *   'interestPaymentEndDate': 'Fri Jan 03 2012 13:13:25 GMT+0100 (Central European Standard Time)',
             *   'investmentType': 'rndmString',
             *   'developmentStage': {
             *     'fr': 'Bonjour',
             *     'en': 'Hello'
             *   },
             *   'location': {
             *     'country': {
             *       'fr': 'Bonjour',
             *       'en': 'Hello'
             *     },
             *     'city': {
             *       'fr': 'Bonjour',
             *       'en': 'Hello'
             *     },
             *     'zone': {
             *       'fr': 'Bonjour',
             *       'en': 'Hello'
             *     }
             *   },
             *   '_id': '6776baf5c7c6e518aae88071',
             *   'creationDate': 'Fri Jan 03 2012 13:13:25 GMT+0100 (Central European Standard Time)',
             *   'lastUpdateDate': 'Fri Jan 03 2012 13:13:25 GMT+0100 (Central European Standard Time)',
             *   'lastUpdater': '6776baf5c7c6e518aae88072'
             * }
         */
            investmentProjectBondsGetOne<Config extends Omit<RequestConfigGetOne<modelTypes.InvestmentProjectBondsModels['Read']>, 'filter'>>(
                filter ?: AsFilter<modelTypes.InvestmentProjectBondsModels['Write']>, // WRITE HERE because it will ensure referenced fields are passed as their string counterpart
                config ?: Config
            ): Promise<Config['triggerErrorIfNotSet'] extends true ? modelTypes.InvestmentProjectBondsModels['Read'] : modelTypes.InvestmentProjectBondsModels['Read'] | undefined>,
                /** Update a given document. An _id should be provided.
             */
                investmentProjectBondsUpdate<
                    Config extends RequestConfigWrite<modelTypes.InvestmentProjectBondsModels['Write']>
    >(
                        id: string,
                        body: Partial<AsMongooseBody<modelTypes.InvestmentProjectBondsModels['Write']>>,
                        config ?: Config
                    ): Promise<
                        Config['returnDoc'] extends true ? modelTypes.InvestmentProjectBondsModels['Read'] : undefined
                    >,
                        /** Update multiple unique documents. Each document must have an _id field
                         * @errorCodes
                         * - 403: userDoNotHaveThePermission
                     */
                        investmentProjectBondsUpdateMany<
                            Config extends RequestConfigWrite<modelTypes.InvestmentProjectBondsModels['Write']>
    >(
                                fields: Array<Partial<AsMongooseBody<modelTypes.InvestmentProjectBondsModels['Write']>> & { _id: string }>, // id is provided in the body
                                config ?: Config
                            ): Promise<
                                Config['returnDoc'] extends true ? modelTypes.InvestmentProjectBondsModels['Read'][] : undefined
                            >,
                                /** Update or create document if not existing
                             */
                                investmentProjectBondsUpsert<Config extends RequestConfigWrite<modelTypes.InvestmentProjectBondsModels['Write']>>(
                                    fields: modelTypes.InvestmentProjectBondsModels['Write'] & { _id?: string },
                                    config ?: Config
                                ): Promise<Config['returnDoc'] extends true ? modelTypes.InvestmentProjectBondsModels['Read'] : string>,
                                    /** Update documents matching the filter in the first param or all documents if filter is not provided
                                     * @errorCodes
                                     * - 403: updateWithFilterNotAllowed
                                 */
                                    investmentProjectBondsUpdateWithFilter<Config extends RequestConfigWrite<modelTypes.InvestmentProjectBondsModels['Write']>>(
                                        filter: AsFilter<modelTypes.InvestmentProjectBondsModels['Write']>,
                                        fields: Partial<AsMongooseBody<modelTypes.InvestmentProjectBondsModels['Write']>>,
                                        config ?: Config
                                    ): Promise<
                                        Config['returnDoc'] extends true ? modelTypes.InvestmentProjectBondsModels['Read'][] : {
                                            acknowledged: boolean
                                            matchedCount: number
                                            modifiedCount: number
                                            upsertedCount: number
                                            upsertedId: any
                                        }
                                    >,
                                        /** Allow to get all ressources with providing a filter as first param
                                         * @example
                                         * [
                                         *   {
                                         *     'tokenId': 'rndmString',
                                         *     'denomination': {
                                         *       'fr': 'Bonjour',
                                         *       'en': 'Hello'
                                         *     },
                                         *     'wallet': '6776baf5c7c6e518aae88072',
                                         *     'baseCurrency': 'eur',
                                         *     'sharePrice': 12,
                                         *     'company': '6776baf5c7c6e518aae88072',
                                         *     'targetInterestRatePerYear': 12,
                                         *     'riskScore': 0,
                                         *     'collectedAmount': 12,
                                         *     'individualInvestors': 12,
                                         *     'coverImage': 'rndmString',
                                         *     'presentationVideoUrl': 'https://noodle.com/',
                                         *     'tags': [
                                         *       '6776baf5c7c6e518aae88072',
                                         *       '6776baf5c7c6e518aae88072'
                                         *     ],
                                         *     'shortDescription': {
                                         *       'fr': 'Bonjour',
                                         *       'en': 'Hello'
                                         *     },
                                         *     'taxAdvantage': {
                                         *       'fr': 'Bonjour',
                                         *       'en': 'Hello'
                                         *     },
                                         *     'legalAnalysisInfos': [
                                         *       null,
                                         *       null
                                         *     ],
                                         *     'financialAnalysisInfos': [
                                         *       null,
                                         *       null
                                         *     ],
                                         *     'externalLinks': [
                                         *       {
                                         *         'label': 'smartContract',
                                         *         'href': 'https://noodle.com/'
                                         *       },
                                         *       {
                                         *         'label': 'smartContract',
                                         *         'href': 'https://noodle.com/'
                                         *       }
                                         *     ],
                                         *     'fundRaisingStartDate': 'Fri Jan 03 2012 13:13:25 GMT+0100 (Central European Standard Time)',
                                         *     'fundRaisingEndDate': 'Fri Jan 03 2012 13:13:25 GMT+0100 (Central European Standard Time)',
                                         *     'fundRaisingTarget': 12,
                                         *     'fundRaisingMinTarget': 12,
                                         *     'fundRaisingMaxTarget': 12,
                                         *     'impactInfos': [
                                         *       null,
                                         *       null
                                         *     ],
                                         *     'investmentType': 'rndmString',
                                         *     '_id': '6776baf5c7c6e518aae88071',
                                         *     'creationDate': 'Fri Jan 03 2012 13:13:25 GMT+0100 (Central European Standard Time)',
                                         *     'lastUpdateDate': 'Fri Jan 03 2012 13:13:25 GMT+0100 (Central European Standard Time)',
                                         *     'lastUpdater': '6776baf5c7c6e518aae88072'
                                         *   },
                                         *   {
                                         *     'tokenId': 'rndmString',
                                         *     'denomination': {
                                         *       'fr': 'Bonjour',
                                         *       'en': 'Hello'
                                         *     },
                                         *     'wallet': '6776baf5c7c6e518aae88072',
                                         *     'baseCurrency': 'eur',
                                         *     'sharePrice': 12,
                                         *     'company': '6776baf5c7c6e518aae88072',
                                         *     'targetInterestRatePerYear': 12,
                                         *     'riskScore': 0,
                                         *     'collectedAmount': 12,
                                         *     'individualInvestors': 12,
                                         *     'coverImage': 'rndmString',
                                         *     'presentationVideoUrl': 'https://noodle.com/',
                                         *     'tags': [
                                         *       '6776baf5c7c6e518aae88072',
                                         *       '6776baf5c7c6e518aae88072'
                                         *     ],
                                         *     'shortDescription': {
                                         *       'fr': 'Bonjour',
                                         *       'en': 'Hello'
                                         *     },
                                         *     'taxAdvantage': {
                                         *       'fr': 'Bonjour',
                                         *       'en': 'Hello'
                                         *     },
                                         *     'legalAnalysisInfos': [
                                         *       null,
                                         *       null
                                         *     ],
                                         *     'financialAnalysisInfos': [
                                         *       null,
                                         *       null
                                         *     ],
                                         *     'externalLinks': [
                                         *       {
                                         *         'label': 'smartContract',
                                         *         'href': 'https://noodle.com/'
                                         *       },
                                         *       {
                                         *         'label': 'smartContract',
                                         *         'href': 'https://noodle.com/'
                                         *       }
                                         *     ],
                                         *     'fundRaisingStartDate': 'Fri Jan 03 2012 13:13:25 GMT+0100 (Central European Standard Time)',
                                         *     'fundRaisingEndDate': 'Fri Jan 03 2012 13:13:25 GMT+0100 (Central European Standard Time)',
                                         *     'fundRaisingTarget': 12,
                                         *     'fundRaisingMinTarget': 12,
                                         *     'fundRaisingMaxTarget': 12,
                                         *     'impactInfos': [
                                         *       null,
                                         *       null
                                         *     ],
                                         *     'investmentType': 'rndmString',
                                         *     '_id': '6776baf5c7c6e518aae88071',
                                         *     'creationDate': 'Fri Jan 03 2012 13:13:25 GMT+0100 (Central European Standard Time)',
                                         *     'lastUpdateDate': 'Fri Jan 03 2012 13:13:25 GMT+0100 (Central European Standard Time)',
                                         *     'lastUpdater': '6776baf5c7c6e518aae88072'
                                         *   }
                                         * ]
                                     */
                                        investmentProjectEquityGetAll(
                                            filter ?: AsFilter<modelTypes.InvestmentProjectEquityModels['Write']>,
                                            config ?: never
                                        ): Promise<modelTypes.InvestmentProjectEquityModels['Read'][]>
investmentProjectEquityGetAll<Config extends Omit<RequestConfigRead<modelTypes.InvestmentProjectEquityModels['Read']>, 'filter'>>(
    filter ?: AsFilter<modelTypes.InvestmentProjectEquityModels['Write']>,
    config ?: Config
): Promise<MaybePaginated<modelTypes.InvestmentProjectEquityModels['Read'][], Config>>,
    /** Allow to get the last ressources by creation date
     * @example
     * [
     *   {
     *     'tokenId': 'rndmString',
     *     'denomination': {
     *       'fr': 'Bonjour',
     *       'en': 'Hello'
     *     },
     *     'wallet': '6776baf5c7c6e518aae88072',
     *     'baseCurrency': 'eur',
     *     'sharePrice': 12,
     *     'company': '6776baf5c7c6e518aae88072',
     *     'targetInterestRatePerYear': 12,
     *     'riskScore': 0,
     *     'collectedAmount': 12,
     *     'individualInvestors': 12,
     *     'coverImage': 'rndmString',
     *     'presentationVideoUrl': 'https://noodle.com/',
     *     'tags': [
     *       '6776baf5c7c6e518aae88072',
     *       '6776baf5c7c6e518aae88072'
     *     ],
     *     'shortDescription': {
     *       'fr': 'Bonjour',
     *       'en': 'Hello'
     *     },
     *     'taxAdvantage': {
     *       'fr': 'Bonjour',
     *       'en': 'Hello'
     *     },
     *     'legalAnalysisInfos': [
     *       null,
     *       null
     *     ],
     *     'financialAnalysisInfos': [
     *       null,
     *       null
     *     ],
     *     'externalLinks': [
     *       {
     *         'label': 'smartContract',
     *         'href': 'https://noodle.com/'
     *       },
     *       {
     *         'label': 'smartContract',
     *         'href': 'https://noodle.com/'
     *       }
     *     ],
     *     'fundRaisingStartDate': 'Fri Jan 03 2012 13:13:25 GMT+0100 (Central European Standard Time)',
     *     'fundRaisingEndDate': 'Fri Jan 03 2012 13:13:25 GMT+0100 (Central European Standard Time)',
     *     'fundRaisingTarget': 12,
     *     'fundRaisingMinTarget': 12,
     *     'fundRaisingMaxTarget': 12,
     *     'impactInfos': [
     *       null,
     *       null
     *     ],
     *     'investmentType': 'rndmString',
     *     '_id': '6776baf5c7c6e518aae88071',
     *     'creationDate': 'Fri Jan 03 2012 13:13:25 GMT+0100 (Central European Standard Time)',
     *     'lastUpdateDate': 'Fri Jan 03 2012 13:13:25 GMT+0100 (Central European Standard Time)',
     *     'lastUpdater': '6776baf5c7c6e518aae88072'
     *   },
     *   {
     *     'tokenId': 'rndmString',
     *     'denomination': {
     *       'fr': 'Bonjour',
     *       'en': 'Hello'
     *     },
     *     'wallet': '6776baf5c7c6e518aae88072',
     *     'baseCurrency': 'eur',
     *     'sharePrice': 12,
     *     'company': '6776baf5c7c6e518aae88072',
     *     'targetInterestRatePerYear': 12,
     *     'riskScore': 0,
     *     'collectedAmount': 12,
     *     'individualInvestors': 12,
     *     'coverImage': 'rndmString',
     *     'presentationVideoUrl': 'https://noodle.com/',
     *     'tags': [
     *       '6776baf5c7c6e518aae88072',
     *       '6776baf5c7c6e518aae88072'
     *     ],
     *     'shortDescription': {
     *       'fr': 'Bonjour',
     *       'en': 'Hello'
     *     },
     *     'taxAdvantage': {
     *       'fr': 'Bonjour',
     *       'en': 'Hello'
     *     },
     *     'legalAnalysisInfos': [
     *       null,
     *       null
     *     ],
     *     'financialAnalysisInfos': [
     *       null,
     *       null
     *     ],
     *     'externalLinks': [
     *       {
     *         'label': 'smartContract',
     *         'href': 'https://noodle.com/'
     *       },
     *       {
     *         'label': 'smartContract',
     *         'href': 'https://noodle.com/'
     *       }
     *     ],
     *     'fundRaisingStartDate': 'Fri Jan 03 2012 13:13:25 GMT+0100 (Central European Standard Time)',
     *     'fundRaisingEndDate': 'Fri Jan 03 2012 13:13:25 GMT+0100 (Central European Standard Time)',
     *     'fundRaisingTarget': 12,
     *     'fundRaisingMinTarget': 12,
     *     'fundRaisingMaxTarget': 12,
     *     'impactInfos': [
     *       null,
     *       null
     *     ],
     *     'investmentType': 'rndmString',
     *     '_id': '6776baf5c7c6e518aae88071',
     *     'creationDate': 'Fri Jan 03 2012 13:13:25 GMT+0100 (Central European Standard Time)',
     *     'lastUpdateDate': 'Fri Jan 03 2012 13:13:25 GMT+0100 (Central European Standard Time)',
     *     'lastUpdater': '6776baf5c7c6e518aae88072'
     *   }
     * ]
 */
    investmentProjectEquityGetLastN(
        limit ?: number,
        config ?: never,
    ): Promise<modelTypes.InvestmentProjectEquityModels['Read'][]>
investmentProjectEquityGetLastN<Config extends RequestConfigRead<modelTypes.InvestmentProjectEquityModels['Read']>>(
    limit ?: number,
    config ?: Config,
): Promise<MaybePaginated<modelTypes.InvestmentProjectEquityModels['Read'][], Config>>,
    /** Allow to get the first ressources by creation date
     * @example
     * [
     *   {
     *     'tokenId': 'rndmString',
     *     'denomination': {
     *       'fr': 'Bonjour',
     *       'en': 'Hello'
     *     },
     *     'wallet': '6776baf5c7c6e518aae88072',
     *     'baseCurrency': 'eur',
     *     'sharePrice': 12,
     *     'company': '6776baf5c7c6e518aae88072',
     *     'targetInterestRatePerYear': 12,
     *     'riskScore': 0,
     *     'collectedAmount': 12,
     *     'individualInvestors': 12,
     *     'coverImage': 'rndmString',
     *     'presentationVideoUrl': 'https://noodle.com/',
     *     'tags': [
     *       '6776baf5c7c6e518aae88072',
     *       '6776baf5c7c6e518aae88072'
     *     ],
     *     'shortDescription': {
     *       'fr': 'Bonjour',
     *       'en': 'Hello'
     *     },
     *     'taxAdvantage': {
     *       'fr': 'Bonjour',
     *       'en': 'Hello'
     *     },
     *     'legalAnalysisInfos': [
     *       null,
     *       null
     *     ],
     *     'financialAnalysisInfos': [
     *       null,
     *       null
     *     ],
     *     'externalLinks': [
     *       {
     *         'label': 'smartContract',
     *         'href': 'https://noodle.com/'
     *       },
     *       {
     *         'label': 'smartContract',
     *         'href': 'https://noodle.com/'
     *       }
     *     ],
     *     'fundRaisingStartDate': 'Fri Jan 03 2012 13:13:25 GMT+0100 (Central European Standard Time)',
     *     'fundRaisingEndDate': 'Fri Jan 03 2012 13:13:25 GMT+0100 (Central European Standard Time)',
     *     'fundRaisingTarget': 12,
     *     'fundRaisingMinTarget': 12,
     *     'fundRaisingMaxTarget': 12,
     *     'impactInfos': [
     *       null,
     *       null
     *     ],
     *     'investmentType': 'rndmString',
     *     '_id': '6776baf5c7c6e518aae88071',
     *     'creationDate': 'Fri Jan 03 2012 13:13:25 GMT+0100 (Central European Standard Time)',
     *     'lastUpdateDate': 'Fri Jan 03 2012 13:13:25 GMT+0100 (Central European Standard Time)',
     *     'lastUpdater': '6776baf5c7c6e518aae88072'
     *   },
     *   {
     *     'tokenId': 'rndmString',
     *     'denomination': {
     *       'fr': 'Bonjour',
     *       'en': 'Hello'
     *     },
     *     'wallet': '6776baf5c7c6e518aae88072',
     *     'baseCurrency': 'eur',
     *     'sharePrice': 12,
     *     'company': '6776baf5c7c6e518aae88072',
     *     'targetInterestRatePerYear': 12,
     *     'riskScore': 0,
     *     'collectedAmount': 12,
     *     'individualInvestors': 12,
     *     'coverImage': 'rndmString',
     *     'presentationVideoUrl': 'https://noodle.com/',
     *     'tags': [
     *       '6776baf5c7c6e518aae88072',
     *       '6776baf5c7c6e518aae88072'
     *     ],
     *     'shortDescription': {
     *       'fr': 'Bonjour',
     *       'en': 'Hello'
     *     },
     *     'taxAdvantage': {
     *       'fr': 'Bonjour',
     *       'en': 'Hello'
     *     },
     *     'legalAnalysisInfos': [
     *       null,
     *       null
     *     ],
     *     'financialAnalysisInfos': [
     *       null,
     *       null
     *     ],
     *     'externalLinks': [
     *       {
     *         'label': 'smartContract',
     *         'href': 'https://noodle.com/'
     *       },
     *       {
     *         'label': 'smartContract',
     *         'href': 'https://noodle.com/'
     *       }
     *     ],
     *     'fundRaisingStartDate': 'Fri Jan 03 2012 13:13:25 GMT+0100 (Central European Standard Time)',
     *     'fundRaisingEndDate': 'Fri Jan 03 2012 13:13:25 GMT+0100 (Central European Standard Time)',
     *     'fundRaisingTarget': 12,
     *     'fundRaisingMinTarget': 12,
     *     'fundRaisingMaxTarget': 12,
     *     'impactInfos': [
     *       null,
     *       null
     *     ],
     *     'investmentType': 'rndmString',
     *     '_id': '6776baf5c7c6e518aae88071',
     *     'creationDate': 'Fri Jan 03 2012 13:13:25 GMT+0100 (Central European Standard Time)',
     *     'lastUpdateDate': 'Fri Jan 03 2012 13:13:25 GMT+0100 (Central European Standard Time)',
     *     'lastUpdater': '6776baf5c7c6e518aae88072'
     *   }
     * ]
 */
    investmentProjectEquityGetFirstN(
        limit ?: number,
        config ?: never
    ): Promise<modelTypes.InvestmentProjectEquityModels['Read'][]>
investmentProjectEquityGetFirstN<Config extends RequestConfigRead<modelTypes.InvestmentProjectEquityModels['Read']>>(
    limit ?: number,
    config ?: Config
): Promise<MaybePaginated<modelTypes.InvestmentProjectEquityModels['Read'][], Config>>,
    /** Count the number of ressources matching the filter in first param or all ressources if no filter is provided
     * @example
     * 12
 */
    investmentProjectEquityCount(
        filter ?: AsFilter<modelTypes.InvestmentProjectEquityModels['Write']>
    ): Promise<number>,
        /** Allow to get a ressource by it's unique mongoDb _id
         * @errorCodes
         * - 404: ressourceDoesNotExists
         * @example
         * {
         *   'tokenId': 'rndmString',
         *   'denomination': {
         *     'fr': 'Bonjour',
         *     'en': 'Hello'
         *   },
         *   'wallet': '6776baf5c7c6e518aae88072',
         *   'baseCurrency': 'eur',
         *   'sharePrice': 12,
         *   'company': '6776baf5c7c6e518aae88072',
         *   'targetInterestRatePerYear': 12,
         *   'riskScore': 0,
         *   'collectedAmount': 12,
         *   'individualInvestors': 12,
         *   'coverImage': 'rndmString',
         *   'presentationVideoUrl': 'https://noodle.com/',
         *   'tags': [
         *     '6776baf5c7c6e518aae88072',
         *     '6776baf5c7c6e518aae88072'
         *   ],
         *   'shortDescription': {
         *     'fr': 'Bonjour',
         *     'en': 'Hello'
         *   },
         *   'taxAdvantage': {
         *     'fr': 'Bonjour',
         *     'en': 'Hello'
         *   },
         *   'legalAnalysisInfos': [
         *     null,
         *     null
         *   ],
         *   'financialAnalysisInfos': [
         *     null,
         *     null
         *   ],
         *   'externalLinks': [
         *     {
         *       'label': 'smartContract',
         *       'href': 'https://noodle.com/'
         *     },
         *     {
         *       'label': 'smartContract',
         *       'href': 'https://noodle.com/'
         *     }
         *   ],
         *   'fundRaisingStartDate': 'Fri Jan 03 2012 13:13:25 GMT+0100 (Central European Standard Time)',
         *   'fundRaisingEndDate': 'Fri Jan 03 2012 13:13:25 GMT+0100 (Central European Standard Time)',
         *   'fundRaisingTarget': 12,
         *   'fundRaisingMinTarget': 12,
         *   'fundRaisingMaxTarget': 12,
         *   'impactInfos': [
         *     null,
         *     null
         *   ],
         *   'investmentType': 'rndmString',
         *   '_id': '6776baf5c7c6e518aae88071',
         *   'creationDate': 'Fri Jan 03 2012 13:13:25 GMT+0100 (Central European Standard Time)',
         *   'lastUpdateDate': 'Fri Jan 03 2012 13:13:25 GMT+0100 (Central European Standard Time)',
         *   'lastUpdater': '6776baf5c7c6e518aae88072'
         * }
     */
        investmentProjectEquityGetById<Config extends RequestConfigGetOne<modelTypes.InvestmentProjectEquityModels['Read']>>(
            id: string,
            config ?: Config
        ): Promise<Config['triggerErrorIfNotSet'] extends true ? modelTypes.InvestmentProjectEquityModels['Read'] : modelTypes.InvestmentProjectEquityModels['Read'] | undefined>,
            /** Allow to get a ressource with providing a filter as first param
             * @example
             * {
             *   'tokenId': 'rndmString',
             *   'denomination': {
             *     'fr': 'Bonjour',
             *     'en': 'Hello'
             *   },
             *   'wallet': '6776baf5c7c6e518aae88072',
             *   'baseCurrency': 'eur',
             *   'sharePrice': 12,
             *   'company': '6776baf5c7c6e518aae88072',
             *   'targetInterestRatePerYear': 12,
             *   'riskScore': 0,
             *   'collectedAmount': 12,
             *   'individualInvestors': 12,
             *   'coverImage': 'rndmString',
             *   'presentationVideoUrl': 'https://noodle.com/',
             *   'tags': [
             *     '6776baf5c7c6e518aae88072',
             *     '6776baf5c7c6e518aae88072'
             *   ],
             *   'shortDescription': {
             *     'fr': 'Bonjour',
             *     'en': 'Hello'
             *   },
             *   'taxAdvantage': {
             *     'fr': 'Bonjour',
             *     'en': 'Hello'
             *   },
             *   'legalAnalysisInfos': [
             *     null,
             *     null
             *   ],
             *   'financialAnalysisInfos': [
             *     null,
             *     null
             *   ],
             *   'externalLinks': [
             *     {
             *       'label': 'smartContract',
             *       'href': 'https://noodle.com/'
             *     },
             *     {
             *       'label': 'smartContract',
             *       'href': 'https://noodle.com/'
             *     }
             *   ],
             *   'fundRaisingStartDate': 'Fri Jan 03 2012 13:13:25 GMT+0100 (Central European Standard Time)',
             *   'fundRaisingEndDate': 'Fri Jan 03 2012 13:13:25 GMT+0100 (Central European Standard Time)',
             *   'fundRaisingTarget': 12,
             *   'fundRaisingMinTarget': 12,
             *   'fundRaisingMaxTarget': 12,
             *   'impactInfos': [
             *     null,
             *     null
             *   ],
             *   'investmentType': 'rndmString',
             *   '_id': '6776baf5c7c6e518aae88071',
             *   'creationDate': 'Fri Jan 03 2012 13:13:25 GMT+0100 (Central European Standard Time)',
             *   'lastUpdateDate': 'Fri Jan 03 2012 13:13:25 GMT+0100 (Central European Standard Time)',
             *   'lastUpdater': '6776baf5c7c6e518aae88072'
             * }
         */
            investmentProjectEquityGetOne<Config extends Omit<RequestConfigGetOne<modelTypes.InvestmentProjectEquityModels['Read']>, 'filter'>>(
                filter ?: AsFilter<modelTypes.InvestmentProjectEquityModels['Write']>, // WRITE HERE because it will ensure referenced fields are passed as their string counterpart
                config ?: Config
            ): Promise<Config['triggerErrorIfNotSet'] extends true ? modelTypes.InvestmentProjectEquityModels['Read'] : modelTypes.InvestmentProjectEquityModels['Read'] | undefined>,
                /** Update a given document. An _id should be provided.
             */
                investmentProjectEquityUpdate<
                    Config extends RequestConfigWrite<modelTypes.InvestmentProjectEquityModels['Write']>
    >(
                        id: string,
                        body: Partial<AsMongooseBody<modelTypes.InvestmentProjectEquityModels['Write']>>,
                        config ?: Config
                    ): Promise<
                        Config['returnDoc'] extends true ? modelTypes.InvestmentProjectEquityModels['Read'] : undefined
                    >,
                        /** Update multiple unique documents. Each document must have an _id field
                         * @errorCodes
                         * - 403: userDoNotHaveThePermission
                     */
                        investmentProjectEquityUpdateMany<
                            Config extends RequestConfigWrite<modelTypes.InvestmentProjectEquityModels['Write']>
    >(
                                fields: Array<Partial<AsMongooseBody<modelTypes.InvestmentProjectEquityModels['Write']>> & { _id: string }>, // id is provided in the body
                                config ?: Config
                            ): Promise<
                                Config['returnDoc'] extends true ? modelTypes.InvestmentProjectEquityModels['Read'][] : undefined
                            >,
                                /** Update or create document if not existing
                             */
                                investmentProjectEquityUpsert<Config extends RequestConfigWrite<modelTypes.InvestmentProjectEquityModels['Write']>>(
                                    fields: modelTypes.InvestmentProjectEquityModels['Write'] & { _id?: string },
                                    config ?: Config
                                ): Promise<Config['returnDoc'] extends true ? modelTypes.InvestmentProjectEquityModels['Read'] : string>,
                                    /** Update documents matching the filter in the first param or all documents if filter is not provided
                                     * @errorCodes
                                     * - 403: updateWithFilterNotAllowed
                                 */
                                    investmentProjectEquityUpdateWithFilter<Config extends RequestConfigWrite<modelTypes.InvestmentProjectEquityModels['Write']>>(
                                        filter: AsFilter<modelTypes.InvestmentProjectEquityModels['Write']>,
                                        fields: Partial<AsMongooseBody<modelTypes.InvestmentProjectEquityModels['Write']>>,
                                        config ?: Config
                                    ): Promise<
                                        Config['returnDoc'] extends true ? modelTypes.InvestmentProjectEquityModels['Read'][] : {
                                            acknowledged: boolean
                                            matchedCount: number
                                            modifiedCount: number
                                            upsertedCount: number
                                            upsertedId: any
                                        }
                                    >,
                                        /** Allow to get all ressources with providing a filter as first param
                                         * @example
                                         * [
                                         *   {
                                         *     'tokenId': 'rndmString',
                                         *     'denomination': {
                                         *       'fr': 'Bonjour',
                                         *       'en': 'Hello'
                                         *     },
                                         *     'wallet': '6776baf5c7c6e518aae88072',
                                         *     'baseCurrency': 'eur',
                                         *     'sharePrice': 12,
                                         *     'company': '6776baf5c7c6e518aae88072',
                                         *     'targetInterestRatePerYear': 12,
                                         *     'riskScore': 0,
                                         *     'collectedAmount': 12,
                                         *     'individualInvestors': 12,
                                         *     'coverImage': 'rndmString',
                                         *     'presentationVideoUrl': 'https://noodle.com/',
                                         *     'tags': [
                                         *       '6776baf5c7c6e518aae88072',
                                         *       '6776baf5c7c6e518aae88072'
                                         *     ],
                                         *     'shortDescription': {
                                         *       'fr': 'Bonjour',
                                         *       'en': 'Hello'
                                         *     },
                                         *     'taxAdvantage': {
                                         *       'fr': 'Bonjour',
                                         *       'en': 'Hello'
                                         *     },
                                         *     'legalAnalysisInfos': [
                                         *       null,
                                         *       null
                                         *     ],
                                         *     'financialAnalysisInfos': [
                                         *       null,
                                         *       null
                                         *     ],
                                         *     'externalLinks': [
                                         *       {
                                         *         'label': 'smartContract',
                                         *         'href': 'https://noodle.com/'
                                         *       },
                                         *       {
                                         *         'label': 'smartContract',
                                         *         'href': 'https://noodle.com/'
                                         *       }
                                         *     ],
                                         *     'fundRaisingStartDate': 'Fri Jan 03 2012 13:13:25 GMT+0100 (Central European Standard Time)',
                                         *     'fundRaisingEndDate': 'Fri Jan 03 2012 13:13:25 GMT+0100 (Central European Standard Time)',
                                         *     'exitHorizon': 12,
                                         *     'cashbackPeriod': 'monthly',
                                         *     'interestDates': [
                                         *       'Fri Jan 03 2012 13:13:25 GMT+0100 (Central European Standard Time)',
                                         *       'Fri Jan 03 2012 13:13:25 GMT+0100 (Central European Standard Time)'
                                         *     ],
                                         *     'interestPaymentStartDate': 'Fri Jan 03 2012 13:13:25 GMT+0100 (Central European Standard Time)',
                                         *     'interestPaymentEndDate': 'Fri Jan 03 2012 13:13:25 GMT+0100 (Central European Standard Time)',
                                         *     'investmentType': 'rndmString',
                                         *     'capitalizationD1': 12,
                                         *     'creationDate': 'Fri Jan 03 2012 13:13:25 GMT+0100 (Central European Standard Time)',
                                         *     'activityZone': {
                                         *       'fr': 'Bonjour',
                                         *       'en': 'Hello'
                                         *     },
                                         *     'relatedFundedProject': [
                                         *       {
                                         *         'name': {
                                         *           'fr': 'Bonjour',
                                         *           'en': 'Hello'
                                         *         },
                                         *         'coverImage': 'rndmString',
                                         *         'href': 'https://noodle.com/'
                                         *       },
                                         *       {
                                         *         'name': {
                                         *           'fr': 'Bonjour',
                                         *           'en': 'Hello'
                                         *         },
                                         *         'coverImage': 'rndmString',
                                         *         'href': 'https://noodle.com/'
                                         *       }
                                         *     ],
                                         *     '_id': '6776baf5c7c6e518aae88071',
                                         *     'lastUpdateDate': 'Fri Jan 03 2012 13:13:25 GMT+0100 (Central European Standard Time)',
                                         *     'lastUpdater': '6776baf5c7c6e518aae88072'
                                         *   },
                                         *   {
                                         *     'tokenId': 'rndmString',
                                         *     'denomination': {
                                         *       'fr': 'Bonjour',
                                         *       'en': 'Hello'
                                         *     },
                                         *     'wallet': '6776baf5c7c6e518aae88072',
                                         *     'baseCurrency': 'eur',
                                         *     'sharePrice': 12,
                                         *     'company': '6776baf5c7c6e518aae88072',
                                         *     'targetInterestRatePerYear': 12,
                                         *     'riskScore': 0,
                                         *     'collectedAmount': 12,
                                         *     'individualInvestors': 12,
                                         *     'coverImage': 'rndmString',
                                         *     'presentationVideoUrl': 'https://noodle.com/',
                                         *     'tags': [
                                         *       '6776baf5c7c6e518aae88072',
                                         *       '6776baf5c7c6e518aae88072'
                                         *     ],
                                         *     'shortDescription': {
                                         *       'fr': 'Bonjour',
                                         *       'en': 'Hello'
                                         *     },
                                         *     'taxAdvantage': {
                                         *       'fr': 'Bonjour',
                                         *       'en': 'Hello'
                                         *     },
                                         *     'legalAnalysisInfos': [
                                         *       null,
                                         *       null
                                         *     ],
                                         *     'financialAnalysisInfos': [
                                         *       null,
                                         *       null
                                         *     ],
                                         *     'externalLinks': [
                                         *       {
                                         *         'label': 'smartContract',
                                         *         'href': 'https://noodle.com/'
                                         *       },
                                         *       {
                                         *         'label': 'smartContract',
                                         *         'href': 'https://noodle.com/'
                                         *       }
                                         *     ],
                                         *     'fundRaisingStartDate': 'Fri Jan 03 2012 13:13:25 GMT+0100 (Central European Standard Time)',
                                         *     'fundRaisingEndDate': 'Fri Jan 03 2012 13:13:25 GMT+0100 (Central European Standard Time)',
                                         *     'exitHorizon': 12,
                                         *     'cashbackPeriod': 'monthly',
                                         *     'interestDates': [
                                         *       'Fri Jan 03 2012 13:13:25 GMT+0100 (Central European Standard Time)',
                                         *       'Fri Jan 03 2012 13:13:25 GMT+0100 (Central European Standard Time)'
                                         *     ],
                                         *     'interestPaymentStartDate': 'Fri Jan 03 2012 13:13:25 GMT+0100 (Central European Standard Time)',
                                         *     'interestPaymentEndDate': 'Fri Jan 03 2012 13:13:25 GMT+0100 (Central European Standard Time)',
                                         *     'investmentType': 'rndmString',
                                         *     'capitalizationD1': 12,
                                         *     'creationDate': 'Fri Jan 03 2012 13:13:25 GMT+0100 (Central European Standard Time)',
                                         *     'activityZone': {
                                         *       'fr': 'Bonjour',
                                         *       'en': 'Hello'
                                         *     },
                                         *     'relatedFundedProject': [
                                         *       {
                                         *         'name': {
                                         *           'fr': 'Bonjour',
                                         *           'en': 'Hello'
                                         *         },
                                         *         'coverImage': 'rndmString',
                                         *         'href': 'https://noodle.com/'
                                         *       },
                                         *       {
                                         *         'name': {
                                         *           'fr': 'Bonjour',
                                         *           'en': 'Hello'
                                         *         },
                                         *         'coverImage': 'rndmString',
                                         *         'href': 'https://noodle.com/'
                                         *       }
                                         *     ],
                                         *     '_id': '6776baf5c7c6e518aae88071',
                                         *     'lastUpdateDate': 'Fri Jan 03 2012 13:13:25 GMT+0100 (Central European Standard Time)',
                                         *     'lastUpdater': '6776baf5c7c6e518aae88072'
                                         *   }
                                         * ]
                                     */
                                        investmentProjectFundSharesGetAll(
                                            filter ?: AsFilter<modelTypes.InvestmentProjectFundSharesModels['Write']>,
                                            config ?: never
                                        ): Promise<modelTypes.InvestmentProjectFundSharesModels['Read'][]>
investmentProjectFundSharesGetAll<Config extends Omit<RequestConfigRead<modelTypes.InvestmentProjectFundSharesModels['Read']>, 'filter'>>(
    filter ?: AsFilter<modelTypes.InvestmentProjectFundSharesModels['Write']>,
    config ?: Config
): Promise<MaybePaginated<modelTypes.InvestmentProjectFundSharesModels['Read'][], Config>>,
    /** Allow to get the last ressources by creation date
     * @example
     * [
     *   {
     *     'tokenId': 'rndmString',
     *     'denomination': {
     *       'fr': 'Bonjour',
     *       'en': 'Hello'
     *     },
     *     'wallet': '6776baf5c7c6e518aae88072',
     *     'baseCurrency': 'eur',
     *     'sharePrice': 12,
     *     'company': '6776baf5c7c6e518aae88072',
     *     'targetInterestRatePerYear': 12,
     *     'riskScore': 0,
     *     'collectedAmount': 12,
     *     'individualInvestors': 12,
     *     'coverImage': 'rndmString',
     *     'presentationVideoUrl': 'https://noodle.com/',
     *     'tags': [
     *       '6776baf5c7c6e518aae88072',
     *       '6776baf5c7c6e518aae88072'
     *     ],
     *     'shortDescription': {
     *       'fr': 'Bonjour',
     *       'en': 'Hello'
     *     },
     *     'taxAdvantage': {
     *       'fr': 'Bonjour',
     *       'en': 'Hello'
     *     },
     *     'legalAnalysisInfos': [
     *       null,
     *       null
     *     ],
     *     'financialAnalysisInfos': [
     *       null,
     *       null
     *     ],
     *     'externalLinks': [
     *       {
     *         'label': 'smartContract',
     *         'href': 'https://noodle.com/'
     *       },
     *       {
     *         'label': 'smartContract',
     *         'href': 'https://noodle.com/'
     *       }
     *     ],
     *     'fundRaisingStartDate': 'Fri Jan 03 2012 13:13:25 GMT+0100 (Central European Standard Time)',
     *     'fundRaisingEndDate': 'Fri Jan 03 2012 13:13:25 GMT+0100 (Central European Standard Time)',
     *     'exitHorizon': 12,
     *     'cashbackPeriod': 'monthly',
     *     'interestDates': [
     *       'Fri Jan 03 2012 13:13:25 GMT+0100 (Central European Standard Time)',
     *       'Fri Jan 03 2012 13:13:25 GMT+0100 (Central European Standard Time)'
     *     ],
     *     'interestPaymentStartDate': 'Fri Jan 03 2012 13:13:25 GMT+0100 (Central European Standard Time)',
     *     'interestPaymentEndDate': 'Fri Jan 03 2012 13:13:25 GMT+0100 (Central European Standard Time)',
     *     'investmentType': 'rndmString',
     *     'capitalizationD1': 12,
     *     'creationDate': 'Fri Jan 03 2012 13:13:25 GMT+0100 (Central European Standard Time)',
     *     'activityZone': {
     *       'fr': 'Bonjour',
     *       'en': 'Hello'
     *     },
     *     'relatedFundedProject': [
     *       {
     *         'name': {
     *           'fr': 'Bonjour',
     *           'en': 'Hello'
     *         },
     *         'coverImage': 'rndmString',
     *         'href': 'https://noodle.com/'
     *       },
     *       {
     *         'name': {
     *           'fr': 'Bonjour',
     *           'en': 'Hello'
     *         },
     *         'coverImage': 'rndmString',
     *         'href': 'https://noodle.com/'
     *       }
     *     ],
     *     '_id': '6776baf5c7c6e518aae88071',
     *     'lastUpdateDate': 'Fri Jan 03 2012 13:13:25 GMT+0100 (Central European Standard Time)',
     *     'lastUpdater': '6776baf5c7c6e518aae88072'
     *   },
     *   {
     *     'tokenId': 'rndmString',
     *     'denomination': {
     *       'fr': 'Bonjour',
     *       'en': 'Hello'
     *     },
     *     'wallet': '6776baf5c7c6e518aae88072',
     *     'baseCurrency': 'eur',
     *     'sharePrice': 12,
     *     'company': '6776baf5c7c6e518aae88072',
     *     'targetInterestRatePerYear': 12,
     *     'riskScore': 0,
     *     'collectedAmount': 12,
     *     'individualInvestors': 12,
     *     'coverImage': 'rndmString',
     *     'presentationVideoUrl': 'https://noodle.com/',
     *     'tags': [
     *       '6776baf5c7c6e518aae88072',
     *       '6776baf5c7c6e518aae88072'
     *     ],
     *     'shortDescription': {
     *       'fr': 'Bonjour',
     *       'en': 'Hello'
     *     },
     *     'taxAdvantage': {
     *       'fr': 'Bonjour',
     *       'en': 'Hello'
     *     },
     *     'legalAnalysisInfos': [
     *       null,
     *       null
     *     ],
     *     'financialAnalysisInfos': [
     *       null,
     *       null
     *     ],
     *     'externalLinks': [
     *       {
     *         'label': 'smartContract',
     *         'href': 'https://noodle.com/'
     *       },
     *       {
     *         'label': 'smartContract',
     *         'href': 'https://noodle.com/'
     *       }
     *     ],
     *     'fundRaisingStartDate': 'Fri Jan 03 2012 13:13:25 GMT+0100 (Central European Standard Time)',
     *     'fundRaisingEndDate': 'Fri Jan 03 2012 13:13:25 GMT+0100 (Central European Standard Time)',
     *     'exitHorizon': 12,
     *     'cashbackPeriod': 'monthly',
     *     'interestDates': [
     *       'Fri Jan 03 2012 13:13:25 GMT+0100 (Central European Standard Time)',
     *       'Fri Jan 03 2012 13:13:25 GMT+0100 (Central European Standard Time)'
     *     ],
     *     'interestPaymentStartDate': 'Fri Jan 03 2012 13:13:25 GMT+0100 (Central European Standard Time)',
     *     'interestPaymentEndDate': 'Fri Jan 03 2012 13:13:25 GMT+0100 (Central European Standard Time)',
     *     'investmentType': 'rndmString',
     *     'capitalizationD1': 12,
     *     'creationDate': 'Fri Jan 03 2012 13:13:25 GMT+0100 (Central European Standard Time)',
     *     'activityZone': {
     *       'fr': 'Bonjour',
     *       'en': 'Hello'
     *     },
     *     'relatedFundedProject': [
     *       {
     *         'name': {
     *           'fr': 'Bonjour',
     *           'en': 'Hello'
     *         },
     *         'coverImage': 'rndmString',
     *         'href': 'https://noodle.com/'
     *       },
     *       {
     *         'name': {
     *           'fr': 'Bonjour',
     *           'en': 'Hello'
     *         },
     *         'coverImage': 'rndmString',
     *         'href': 'https://noodle.com/'
     *       }
     *     ],
     *     '_id': '6776baf5c7c6e518aae88071',
     *     'lastUpdateDate': 'Fri Jan 03 2012 13:13:25 GMT+0100 (Central European Standard Time)',
     *     'lastUpdater': '6776baf5c7c6e518aae88072'
     *   }
     * ]
 */
    investmentProjectFundSharesGetLastN(
        limit ?: number,
        config ?: never,
    ): Promise<modelTypes.InvestmentProjectFundSharesModels['Read'][]>
investmentProjectFundSharesGetLastN<Config extends RequestConfigRead<modelTypes.InvestmentProjectFundSharesModels['Read']>>(
    limit ?: number,
    config ?: Config,
): Promise<MaybePaginated<modelTypes.InvestmentProjectFundSharesModels['Read'][], Config>>,
    /** Allow to get the first ressources by creation date
     * @example
     * [
     *   {
     *     'tokenId': 'rndmString',
     *     'denomination': {
     *       'fr': 'Bonjour',
     *       'en': 'Hello'
     *     },
     *     'wallet': '6776baf5c7c6e518aae88072',
     *     'baseCurrency': 'eur',
     *     'sharePrice': 12,
     *     'company': '6776baf5c7c6e518aae88072',
     *     'targetInterestRatePerYear': 12,
     *     'riskScore': 0,
     *     'collectedAmount': 12,
     *     'individualInvestors': 12,
     *     'coverImage': 'rndmString',
     *     'presentationVideoUrl': 'https://noodle.com/',
     *     'tags': [
     *       '6776baf5c7c6e518aae88072',
     *       '6776baf5c7c6e518aae88072'
     *     ],
     *     'shortDescription': {
     *       'fr': 'Bonjour',
     *       'en': 'Hello'
     *     },
     *     'taxAdvantage': {
     *       'fr': 'Bonjour',
     *       'en': 'Hello'
     *     },
     *     'legalAnalysisInfos': [
     *       null,
     *       null
     *     ],
     *     'financialAnalysisInfos': [
     *       null,
     *       null
     *     ],
     *     'externalLinks': [
     *       {
     *         'label': 'smartContract',
     *         'href': 'https://noodle.com/'
     *       },
     *       {
     *         'label': 'smartContract',
     *         'href': 'https://noodle.com/'
     *       }
     *     ],
     *     'fundRaisingStartDate': 'Fri Jan 03 2012 13:13:25 GMT+0100 (Central European Standard Time)',
     *     'fundRaisingEndDate': 'Fri Jan 03 2012 13:13:25 GMT+0100 (Central European Standard Time)',
     *     'exitHorizon': 12,
     *     'cashbackPeriod': 'monthly',
     *     'interestDates': [
     *       'Fri Jan 03 2012 13:13:25 GMT+0100 (Central European Standard Time)',
     *       'Fri Jan 03 2012 13:13:25 GMT+0100 (Central European Standard Time)'
     *     ],
     *     'interestPaymentStartDate': 'Fri Jan 03 2012 13:13:25 GMT+0100 (Central European Standard Time)',
     *     'interestPaymentEndDate': 'Fri Jan 03 2012 13:13:25 GMT+0100 (Central European Standard Time)',
     *     'investmentType': 'rndmString',
     *     'capitalizationD1': 12,
     *     'creationDate': 'Fri Jan 03 2012 13:13:25 GMT+0100 (Central European Standard Time)',
     *     'activityZone': {
     *       'fr': 'Bonjour',
     *       'en': 'Hello'
     *     },
     *     'relatedFundedProject': [
     *       {
     *         'name': {
     *           'fr': 'Bonjour',
     *           'en': 'Hello'
     *         },
     *         'coverImage': 'rndmString',
     *         'href': 'https://noodle.com/'
     *       },
     *       {
     *         'name': {
     *           'fr': 'Bonjour',
     *           'en': 'Hello'
     *         },
     *         'coverImage': 'rndmString',
     *         'href': 'https://noodle.com/'
     *       }
     *     ],
     *     '_id': '6776baf5c7c6e518aae88071',
     *     'lastUpdateDate': 'Fri Jan 03 2012 13:13:25 GMT+0100 (Central European Standard Time)',
     *     'lastUpdater': '6776baf5c7c6e518aae88072'
     *   },
     *   {
     *     'tokenId': 'rndmString',
     *     'denomination': {
     *       'fr': 'Bonjour',
     *       'en': 'Hello'
     *     },
     *     'wallet': '6776baf5c7c6e518aae88072',
     *     'baseCurrency': 'eur',
     *     'sharePrice': 12,
     *     'company': '6776baf5c7c6e518aae88072',
     *     'targetInterestRatePerYear': 12,
     *     'riskScore': 0,
     *     'collectedAmount': 12,
     *     'individualInvestors': 12,
     *     'coverImage': 'rndmString',
     *     'presentationVideoUrl': 'https://noodle.com/',
     *     'tags': [
     *       '6776baf5c7c6e518aae88072',
     *       '6776baf5c7c6e518aae88072'
     *     ],
     *     'shortDescription': {
     *       'fr': 'Bonjour',
     *       'en': 'Hello'
     *     },
     *     'taxAdvantage': {
     *       'fr': 'Bonjour',
     *       'en': 'Hello'
     *     },
     *     'legalAnalysisInfos': [
     *       null,
     *       null
     *     ],
     *     'financialAnalysisInfos': [
     *       null,
     *       null
     *     ],
     *     'externalLinks': [
     *       {
     *         'label': 'smartContract',
     *         'href': 'https://noodle.com/'
     *       },
     *       {
     *         'label': 'smartContract',
     *         'href': 'https://noodle.com/'
     *       }
     *     ],
     *     'fundRaisingStartDate': 'Fri Jan 03 2012 13:13:25 GMT+0100 (Central European Standard Time)',
     *     'fundRaisingEndDate': 'Fri Jan 03 2012 13:13:25 GMT+0100 (Central European Standard Time)',
     *     'exitHorizon': 12,
     *     'cashbackPeriod': 'monthly',
     *     'interestDates': [
     *       'Fri Jan 03 2012 13:13:25 GMT+0100 (Central European Standard Time)',
     *       'Fri Jan 03 2012 13:13:25 GMT+0100 (Central European Standard Time)'
     *     ],
     *     'interestPaymentStartDate': 'Fri Jan 03 2012 13:13:25 GMT+0100 (Central European Standard Time)',
     *     'interestPaymentEndDate': 'Fri Jan 03 2012 13:13:25 GMT+0100 (Central European Standard Time)',
     *     'investmentType': 'rndmString',
     *     'capitalizationD1': 12,
     *     'creationDate': 'Fri Jan 03 2012 13:13:25 GMT+0100 (Central European Standard Time)',
     *     'activityZone': {
     *       'fr': 'Bonjour',
     *       'en': 'Hello'
     *     },
     *     'relatedFundedProject': [
     *       {
     *         'name': {
     *           'fr': 'Bonjour',
     *           'en': 'Hello'
     *         },
     *         'coverImage': 'rndmString',
     *         'href': 'https://noodle.com/'
     *       },
     *       {
     *         'name': {
     *           'fr': 'Bonjour',
     *           'en': 'Hello'
     *         },
     *         'coverImage': 'rndmString',
     *         'href': 'https://noodle.com/'
     *       }
     *     ],
     *     '_id': '6776baf5c7c6e518aae88071',
     *     'lastUpdateDate': 'Fri Jan 03 2012 13:13:25 GMT+0100 (Central European Standard Time)',
     *     'lastUpdater': '6776baf5c7c6e518aae88072'
     *   }
     * ]
 */
    investmentProjectFundSharesGetFirstN(
        limit ?: number,
        config ?: never
    ): Promise<modelTypes.InvestmentProjectFundSharesModels['Read'][]>
investmentProjectFundSharesGetFirstN<Config extends RequestConfigRead<modelTypes.InvestmentProjectFundSharesModels['Read']>>(
    limit ?: number,
    config ?: Config
): Promise<MaybePaginated<modelTypes.InvestmentProjectFundSharesModels['Read'][], Config>>,
    /** Count the number of ressources matching the filter in first param or all ressources if no filter is provided
     * @example
     * 12
 */
    investmentProjectFundSharesCount(
        filter ?: AsFilter<modelTypes.InvestmentProjectFundSharesModels['Write']>
    ): Promise<number>,
        /** Allow to get a ressource by it's unique mongoDb _id
         * @errorCodes
         * - 404: ressourceDoesNotExists
         * @example
         * {
         *   'tokenId': 'rndmString',
         *   'denomination': {
         *     'fr': 'Bonjour',
         *     'en': 'Hello'
         *   },
         *   'wallet': '6776baf5c7c6e518aae88072',
         *   'baseCurrency': 'eur',
         *   'sharePrice': 12,
         *   'company': '6776baf5c7c6e518aae88072',
         *   'targetInterestRatePerYear': 12,
         *   'riskScore': 0,
         *   'collectedAmount': 12,
         *   'individualInvestors': 12,
         *   'coverImage': 'rndmString',
         *   'presentationVideoUrl': 'https://noodle.com/',
         *   'tags': [
         *     '6776baf5c7c6e518aae88072',
         *     '6776baf5c7c6e518aae88072'
         *   ],
         *   'shortDescription': {
         *     'fr': 'Bonjour',
         *     'en': 'Hello'
         *   },
         *   'taxAdvantage': {
         *     'fr': 'Bonjour',
         *     'en': 'Hello'
         *   },
         *   'legalAnalysisInfos': [
         *     null,
         *     null
         *   ],
         *   'financialAnalysisInfos': [
         *     null,
         *     null
         *   ],
         *   'externalLinks': [
         *     {
         *       'label': 'smartContract',
         *       'href': 'https://noodle.com/'
         *     },
         *     {
         *       'label': 'smartContract',
         *       'href': 'https://noodle.com/'
         *     }
         *   ],
         *   'fundRaisingStartDate': 'Fri Jan 03 2012 13:13:25 GMT+0100 (Central European Standard Time)',
         *   'fundRaisingEndDate': 'Fri Jan 03 2012 13:13:25 GMT+0100 (Central European Standard Time)',
         *   'exitHorizon': 12,
         *   'cashbackPeriod': 'monthly',
         *   'interestDates': [
         *     'Fri Jan 03 2012 13:13:25 GMT+0100 (Central European Standard Time)',
         *     'Fri Jan 03 2012 13:13:25 GMT+0100 (Central European Standard Time)'
         *   ],
         *   'interestPaymentStartDate': 'Fri Jan 03 2012 13:13:25 GMT+0100 (Central European Standard Time)',
         *   'interestPaymentEndDate': 'Fri Jan 03 2012 13:13:25 GMT+0100 (Central European Standard Time)',
         *   'investmentType': 'rndmString',
         *   'capitalizationD1': 12,
         *   'creationDate': 'Fri Jan 03 2012 13:13:25 GMT+0100 (Central European Standard Time)',
         *   'activityZone': {
         *     'fr': 'Bonjour',
         *     'en': 'Hello'
         *   },
         *   'relatedFundedProject': [
         *     {
         *       'name': {
         *         'fr': 'Bonjour',
         *         'en': 'Hello'
         *       },
         *       'coverImage': 'rndmString',
         *       'href': 'https://noodle.com/'
         *     },
         *     {
         *       'name': {
         *         'fr': 'Bonjour',
         *         'en': 'Hello'
         *       },
         *       'coverImage': 'rndmString',
         *       'href': 'https://noodle.com/'
         *     }
         *   ],
         *   '_id': '6776baf5c7c6e518aae88071',
         *   'lastUpdateDate': 'Fri Jan 03 2012 13:13:25 GMT+0100 (Central European Standard Time)',
         *   'lastUpdater': '6776baf5c7c6e518aae88072'
         * }
     */
        investmentProjectFundSharesGetById<Config extends RequestConfigGetOne<modelTypes.InvestmentProjectFundSharesModels['Read']>>(
            id: string,
            config ?: Config
        ): Promise<Config['triggerErrorIfNotSet'] extends true ? modelTypes.InvestmentProjectFundSharesModels['Read'] : modelTypes.InvestmentProjectFundSharesModels['Read'] | undefined>,
            /** Allow to get a ressource with providing a filter as first param
             * @example
             * {
             *   'tokenId': 'rndmString',
             *   'denomination': {
             *     'fr': 'Bonjour',
             *     'en': 'Hello'
             *   },
             *   'wallet': '6776baf5c7c6e518aae88072',
             *   'baseCurrency': 'eur',
             *   'sharePrice': 12,
             *   'company': '6776baf5c7c6e518aae88072',
             *   'targetInterestRatePerYear': 12,
             *   'riskScore': 0,
             *   'collectedAmount': 12,
             *   'individualInvestors': 12,
             *   'coverImage': 'rndmString',
             *   'presentationVideoUrl': 'https://noodle.com/',
             *   'tags': [
             *     '6776baf5c7c6e518aae88072',
             *     '6776baf5c7c6e518aae88072'
             *   ],
             *   'shortDescription': {
             *     'fr': 'Bonjour',
             *     'en': 'Hello'
             *   },
             *   'taxAdvantage': {
             *     'fr': 'Bonjour',
             *     'en': 'Hello'
             *   },
             *   'legalAnalysisInfos': [
             *     null,
             *     null
             *   ],
             *   'financialAnalysisInfos': [
             *     null,
             *     null
             *   ],
             *   'externalLinks': [
             *     {
             *       'label': 'smartContract',
             *       'href': 'https://noodle.com/'
             *     },
             *     {
             *       'label': 'smartContract',
             *       'href': 'https://noodle.com/'
             *     }
             *   ],
             *   'fundRaisingStartDate': 'Fri Jan 03 2012 13:13:25 GMT+0100 (Central European Standard Time)',
             *   'fundRaisingEndDate': 'Fri Jan 03 2012 13:13:25 GMT+0100 (Central European Standard Time)',
             *   'exitHorizon': 12,
             *   'cashbackPeriod': 'monthly',
             *   'interestDates': [
             *     'Fri Jan 03 2012 13:13:25 GMT+0100 (Central European Standard Time)',
             *     'Fri Jan 03 2012 13:13:25 GMT+0100 (Central European Standard Time)'
             *   ],
             *   'interestPaymentStartDate': 'Fri Jan 03 2012 13:13:25 GMT+0100 (Central European Standard Time)',
             *   'interestPaymentEndDate': 'Fri Jan 03 2012 13:13:25 GMT+0100 (Central European Standard Time)',
             *   'investmentType': 'rndmString',
             *   'capitalizationD1': 12,
             *   'creationDate': 'Fri Jan 03 2012 13:13:25 GMT+0100 (Central European Standard Time)',
             *   'activityZone': {
             *     'fr': 'Bonjour',
             *     'en': 'Hello'
             *   },
             *   'relatedFundedProject': [
             *     {
             *       'name': {
             *         'fr': 'Bonjour',
             *         'en': 'Hello'
             *       },
             *       'coverImage': 'rndmString',
             *       'href': 'https://noodle.com/'
             *     },
             *     {
             *       'name': {
             *         'fr': 'Bonjour',
             *         'en': 'Hello'
             *       },
             *       'coverImage': 'rndmString',
             *       'href': 'https://noodle.com/'
             *     }
             *   ],
             *   '_id': '6776baf5c7c6e518aae88071',
             *   'lastUpdateDate': 'Fri Jan 03 2012 13:13:25 GMT+0100 (Central European Standard Time)',
             *   'lastUpdater': '6776baf5c7c6e518aae88072'
             * }
         */
            investmentProjectFundSharesGetOne<Config extends Omit<RequestConfigGetOne<modelTypes.InvestmentProjectFundSharesModels['Read']>, 'filter'>>(
                filter ?: AsFilter<modelTypes.InvestmentProjectFundSharesModels['Write']>, // WRITE HERE because it will ensure referenced fields are passed as their string counterpart
                config ?: Config
            ): Promise<Config['triggerErrorIfNotSet'] extends true ? modelTypes.InvestmentProjectFundSharesModels['Read'] : modelTypes.InvestmentProjectFundSharesModels['Read'] | undefined>,
                /** Update a given document. An _id should be provided.
             */
                investmentProjectFundSharesUpdate<
                    Config extends RequestConfigWrite<modelTypes.InvestmentProjectFundSharesModels['Write']>
    >(
                        id: string,
                        body: Partial<AsMongooseBody<modelTypes.InvestmentProjectFundSharesModels['Write']>>,
                        config ?: Config
                    ): Promise<
                        Config['returnDoc'] extends true ? modelTypes.InvestmentProjectFundSharesModels['Read'] : undefined
                    >,
                        /** Update multiple unique documents. Each document must have an _id field
                         * @errorCodes
                         * - 403: userDoNotHaveThePermission
                     */
                        investmentProjectFundSharesUpdateMany<
                            Config extends RequestConfigWrite<modelTypes.InvestmentProjectFundSharesModels['Write']>
    >(
                                fields: Array<Partial<AsMongooseBody<modelTypes.InvestmentProjectFundSharesModels['Write']>> & { _id: string }>, // id is provided in the body
                                config ?: Config
                            ): Promise<
                                Config['returnDoc'] extends true ? modelTypes.InvestmentProjectFundSharesModels['Read'][] : undefined
                            >,
                                /** Update or create document if not existing
                             */
                                investmentProjectFundSharesUpsert<Config extends RequestConfigWrite<modelTypes.InvestmentProjectFundSharesModels['Write']>>(
                                    fields: modelTypes.InvestmentProjectFundSharesModels['Write'] & { _id?: string },
                                    config ?: Config
                                ): Promise<Config['returnDoc'] extends true ? modelTypes.InvestmentProjectFundSharesModels['Read'] : string>,
                                    /** Update documents matching the filter in the first param or all documents if filter is not provided
                                     * @errorCodes
                                     * - 403: updateWithFilterNotAllowed
                                 */
                                    investmentProjectFundSharesUpdateWithFilter<Config extends RequestConfigWrite<modelTypes.InvestmentProjectFundSharesModels['Write']>>(
                                        filter: AsFilter<modelTypes.InvestmentProjectFundSharesModels['Write']>,
                                        fields: Partial<AsMongooseBody<modelTypes.InvestmentProjectFundSharesModels['Write']>>,
                                        config ?: Config
                                    ): Promise<
                                        Config['returnDoc'] extends true ? modelTypes.InvestmentProjectFundSharesModels['Read'][] : {
                                            acknowledged: boolean
                                            matchedCount: number
                                            modifiedCount: number
                                            upsertedCount: number
                                            upsertedId: any
                                        }
                                    >,
                                        /** Allow to get all ressources with providing a filter as first param
                                         * @example
                                         * [
                                         *   {
                                         *     'investmentType': 'rndmString',
                                         *     'user': '6776baf5c7c6e518aae88072',
                                         *     'investment': '6776baf5c7c6e518aae88072',
                                         *     'investmentProject': '6776baf5c7c6e518aae88072',
                                         *     'sourceUser': '6776baf5c7c6e518aae88072',
                                         *     'sellOffer': '6776baf5c7c6e518aae88072',
                                         *     'status': 'pending',
                                         *     'sourceWallet': '6776baf5c7c6e518aae88072',
                                         *     'totalPriceInSourceCurrency': 12,
                                         *     'totalPriceInProjectCurrency': 12,
                                         *     'nbShares': 289,
                                         *     'exchangeRateMultiplier': 12,
                                         *     'exchangeFeesPercent': 12,
                                         *     'exchangeFeesAmountInSourceCurrency': 12,
                                         *     'blockchainTransactionHash': 'rndmString',
                                         *     '_id': '6776baf5c7c6e518aae88071',
                                         *     'creationDate': 'Fri Jan 03 2012 13:13:25 GMT+0100 (Central European Standard Time)',
                                         *     'lastUpdateDate': 'Fri Jan 03 2012 13:13:25 GMT+0100 (Central European Standard Time)',
                                         *     'lastUpdater': '6776baf5c7c6e518aae88072'
                                         *   },
                                         *   {
                                         *     'investmentType': 'rndmString',
                                         *     'user': '6776baf5c7c6e518aae88072',
                                         *     'investment': '6776baf5c7c6e518aae88072',
                                         *     'investmentProject': '6776baf5c7c6e518aae88072',
                                         *     'sourceUser': '6776baf5c7c6e518aae88072',
                                         *     'sellOffer': '6776baf5c7c6e518aae88072',
                                         *     'status': 'pending',
                                         *     'sourceWallet': '6776baf5c7c6e518aae88072',
                                         *     'totalPriceInSourceCurrency': 12,
                                         *     'totalPriceInProjectCurrency': 12,
                                         *     'nbShares': 289,
                                         *     'exchangeRateMultiplier': 12,
                                         *     'exchangeFeesPercent': 12,
                                         *     'exchangeFeesAmountInSourceCurrency': 12,
                                         *     'blockchainTransactionHash': 'rndmString',
                                         *     '_id': '6776baf5c7c6e518aae88071',
                                         *     'creationDate': 'Fri Jan 03 2012 13:13:25 GMT+0100 (Central European Standard Time)',
                                         *     'lastUpdateDate': 'Fri Jan 03 2012 13:13:25 GMT+0100 (Central European Standard Time)',
                                         *     'lastUpdater': '6776baf5c7c6e518aae88072'
                                         *   }
                                         * ]
                                     */
                                        investmentTransactionBondsGetAll(
                                            filter ?: AsFilter<modelTypes.InvestmentTransactionBondsModels['Write']>,
                                            config ?: never
                                        ): Promise<modelTypes.InvestmentTransactionBondsModels['Read'][]>
investmentTransactionBondsGetAll<Config extends Omit<RequestConfigRead<modelTypes.InvestmentTransactionBondsModels['Read']>, 'filter'>>(
    filter ?: AsFilter<modelTypes.InvestmentTransactionBondsModels['Write']>,
    config ?: Config
): Promise<MaybePaginated<modelTypes.InvestmentTransactionBondsModels['Read'][], Config>>,
    /** Allow to get the last ressources by creation date
     * @example
     * [
     *   {
     *     'investmentType': 'rndmString',
     *     'user': '6776baf5c7c6e518aae88072',
     *     'investment': '6776baf5c7c6e518aae88072',
     *     'investmentProject': '6776baf5c7c6e518aae88072',
     *     'sourceUser': '6776baf5c7c6e518aae88072',
     *     'sellOffer': '6776baf5c7c6e518aae88072',
     *     'status': 'pending',
     *     'sourceWallet': '6776baf5c7c6e518aae88072',
     *     'totalPriceInSourceCurrency': 12,
     *     'totalPriceInProjectCurrency': 12,
     *     'nbShares': 289,
     *     'exchangeRateMultiplier': 12,
     *     'exchangeFeesPercent': 12,
     *     'exchangeFeesAmountInSourceCurrency': 12,
     *     'blockchainTransactionHash': 'rndmString',
     *     '_id': '6776baf5c7c6e518aae88071',
     *     'creationDate': 'Fri Jan 03 2012 13:13:25 GMT+0100 (Central European Standard Time)',
     *     'lastUpdateDate': 'Fri Jan 03 2012 13:13:25 GMT+0100 (Central European Standard Time)',
     *     'lastUpdater': '6776baf5c7c6e518aae88072'
     *   },
     *   {
     *     'investmentType': 'rndmString',
     *     'user': '6776baf5c7c6e518aae88072',
     *     'investment': '6776baf5c7c6e518aae88072',
     *     'investmentProject': '6776baf5c7c6e518aae88072',
     *     'sourceUser': '6776baf5c7c6e518aae88072',
     *     'sellOffer': '6776baf5c7c6e518aae88072',
     *     'status': 'pending',
     *     'sourceWallet': '6776baf5c7c6e518aae88072',
     *     'totalPriceInSourceCurrency': 12,
     *     'totalPriceInProjectCurrency': 12,
     *     'nbShares': 289,
     *     'exchangeRateMultiplier': 12,
     *     'exchangeFeesPercent': 12,
     *     'exchangeFeesAmountInSourceCurrency': 12,
     *     'blockchainTransactionHash': 'rndmString',
     *     '_id': '6776baf5c7c6e518aae88071',
     *     'creationDate': 'Fri Jan 03 2012 13:13:25 GMT+0100 (Central European Standard Time)',
     *     'lastUpdateDate': 'Fri Jan 03 2012 13:13:25 GMT+0100 (Central European Standard Time)',
     *     'lastUpdater': '6776baf5c7c6e518aae88072'
     *   }
     * ]
 */
    investmentTransactionBondsGetLastN(
        limit ?: number,
        config ?: never,
    ): Promise<modelTypes.InvestmentTransactionBondsModels['Read'][]>
investmentTransactionBondsGetLastN<Config extends RequestConfigRead<modelTypes.InvestmentTransactionBondsModels['Read']>>(
    limit ?: number,
    config ?: Config,
): Promise<MaybePaginated<modelTypes.InvestmentTransactionBondsModels['Read'][], Config>>,
    /** Allow to get the first ressources by creation date
     * @example
     * [
     *   {
     *     'investmentType': 'rndmString',
     *     'user': '6776baf5c7c6e518aae88072',
     *     'investment': '6776baf5c7c6e518aae88072',
     *     'investmentProject': '6776baf5c7c6e518aae88072',
     *     'sourceUser': '6776baf5c7c6e518aae88072',
     *     'sellOffer': '6776baf5c7c6e518aae88072',
     *     'status': 'pending',
     *     'sourceWallet': '6776baf5c7c6e518aae88072',
     *     'totalPriceInSourceCurrency': 12,
     *     'totalPriceInProjectCurrency': 12,
     *     'nbShares': 289,
     *     'exchangeRateMultiplier': 12,
     *     'exchangeFeesPercent': 12,
     *     'exchangeFeesAmountInSourceCurrency': 12,
     *     'blockchainTransactionHash': 'rndmString',
     *     '_id': '6776baf5c7c6e518aae88071',
     *     'creationDate': 'Fri Jan 03 2012 13:13:25 GMT+0100 (Central European Standard Time)',
     *     'lastUpdateDate': 'Fri Jan 03 2012 13:13:25 GMT+0100 (Central European Standard Time)',
     *     'lastUpdater': '6776baf5c7c6e518aae88072'
     *   },
     *   {
     *     'investmentType': 'rndmString',
     *     'user': '6776baf5c7c6e518aae88072',
     *     'investment': '6776baf5c7c6e518aae88072',
     *     'investmentProject': '6776baf5c7c6e518aae88072',
     *     'sourceUser': '6776baf5c7c6e518aae88072',
     *     'sellOffer': '6776baf5c7c6e518aae88072',
     *     'status': 'pending',
     *     'sourceWallet': '6776baf5c7c6e518aae88072',
     *     'totalPriceInSourceCurrency': 12,
     *     'totalPriceInProjectCurrency': 12,
     *     'nbShares': 289,
     *     'exchangeRateMultiplier': 12,
     *     'exchangeFeesPercent': 12,
     *     'exchangeFeesAmountInSourceCurrency': 12,
     *     'blockchainTransactionHash': 'rndmString',
     *     '_id': '6776baf5c7c6e518aae88071',
     *     'creationDate': 'Fri Jan 03 2012 13:13:25 GMT+0100 (Central European Standard Time)',
     *     'lastUpdateDate': 'Fri Jan 03 2012 13:13:25 GMT+0100 (Central European Standard Time)',
     *     'lastUpdater': '6776baf5c7c6e518aae88072'
     *   }
     * ]
 */
    investmentTransactionBondsGetFirstN(
        limit ?: number,
        config ?: never
    ): Promise<modelTypes.InvestmentTransactionBondsModels['Read'][]>
investmentTransactionBondsGetFirstN<Config extends RequestConfigRead<modelTypes.InvestmentTransactionBondsModels['Read']>>(
    limit ?: number,
    config ?: Config
): Promise<MaybePaginated<modelTypes.InvestmentTransactionBondsModels['Read'][], Config>>,
    /** Count the number of ressources matching the filter in first param or all ressources if no filter is provided
     * @example
     * 12
 */
    investmentTransactionBondsCount(
        filter ?: AsFilter<modelTypes.InvestmentTransactionBondsModels['Write']>
    ): Promise<number>,
        /** Allow to get a ressource by it's unique mongoDb _id
         * @errorCodes
         * - 404: ressourceDoesNotExists
         * @example
         * {
         *   'investmentType': 'rndmString',
         *   'user': '6776baf5c7c6e518aae88072',
         *   'investment': '6776baf5c7c6e518aae88072',
         *   'investmentProject': '6776baf5c7c6e518aae88072',
         *   'sourceUser': '6776baf5c7c6e518aae88072',
         *   'sellOffer': '6776baf5c7c6e518aae88072',
         *   'status': 'pending',
         *   'sourceWallet': '6776baf5c7c6e518aae88072',
         *   'totalPriceInSourceCurrency': 12,
         *   'totalPriceInProjectCurrency': 12,
         *   'nbShares': 289,
         *   'exchangeRateMultiplier': 12,
         *   'exchangeFeesPercent': 12,
         *   'exchangeFeesAmountInSourceCurrency': 12,
         *   'blockchainTransactionHash': 'rndmString',
         *   '_id': '6776baf5c7c6e518aae88071',
         *   'creationDate': 'Fri Jan 03 2012 13:13:25 GMT+0100 (Central European Standard Time)',
         *   'lastUpdateDate': 'Fri Jan 03 2012 13:13:25 GMT+0100 (Central European Standard Time)',
         *   'lastUpdater': '6776baf5c7c6e518aae88072'
         * }
     */
        investmentTransactionBondsGetById<Config extends RequestConfigGetOne<modelTypes.InvestmentTransactionBondsModels['Read']>>(
            id: string,
            config ?: Config
        ): Promise<Config['triggerErrorIfNotSet'] extends true ? modelTypes.InvestmentTransactionBondsModels['Read'] : modelTypes.InvestmentTransactionBondsModels['Read'] | undefined>,
            /** Allow to get a ressource with providing a filter as first param
             * @example
             * {
             *   'investmentType': 'rndmString',
             *   'user': '6776baf5c7c6e518aae88072',
             *   'investment': '6776baf5c7c6e518aae88072',
             *   'investmentProject': '6776baf5c7c6e518aae88072',
             *   'sourceUser': '6776baf5c7c6e518aae88072',
             *   'sellOffer': '6776baf5c7c6e518aae88072',
             *   'status': 'pending',
             *   'sourceWallet': '6776baf5c7c6e518aae88072',
             *   'totalPriceInSourceCurrency': 12,
             *   'totalPriceInProjectCurrency': 12,
             *   'nbShares': 289,
             *   'exchangeRateMultiplier': 12,
             *   'exchangeFeesPercent': 12,
             *   'exchangeFeesAmountInSourceCurrency': 12,
             *   'blockchainTransactionHash': 'rndmString',
             *   '_id': '6776baf5c7c6e518aae88071',
             *   'creationDate': 'Fri Jan 03 2012 13:13:25 GMT+0100 (Central European Standard Time)',
             *   'lastUpdateDate': 'Fri Jan 03 2012 13:13:25 GMT+0100 (Central European Standard Time)',
             *   'lastUpdater': '6776baf5c7c6e518aae88072'
             * }
         */
            investmentTransactionBondsGetOne<Config extends Omit<RequestConfigGetOne<modelTypes.InvestmentTransactionBondsModels['Read']>, 'filter'>>(
                filter ?: AsFilter<modelTypes.InvestmentTransactionBondsModels['Write']>, // WRITE HERE because it will ensure referenced fields are passed as their string counterpart
                config ?: Config
            ): Promise<Config['triggerErrorIfNotSet'] extends true ? modelTypes.InvestmentTransactionBondsModels['Read'] : modelTypes.InvestmentTransactionBondsModels['Read'] | undefined>,
                /** Allow to get all ressources with providing a filter as first param
                 * @example
                 * [
                 *   {
                 *     'investmentType': 'rndmString',
                 *     'user': '6776baf5c7c6e518aae88072',
                 *     'investment': '6776baf5c7c6e518aae88072',
                 *     'investmentProject': '6776baf5c7c6e518aae88072',
                 *     'sourceUser': '6776baf5c7c6e518aae88072',
                 *     'sellOffer': '6776baf5c7c6e518aae88072',
                 *     'status': 'pending',
                 *     'sourceWallet': '6776baf5c7c6e518aae88072',
                 *     'totalPriceInSourceCurrency': 12,
                 *     'totalPriceInProjectCurrency': 12,
                 *     'nbShares': 289,
                 *     'exchangeRateMultiplier': 12,
                 *     'exchangeFeesPercent': 12,
                 *     'exchangeFeesAmountInSourceCurrency': 12,
                 *     'blockchainTransactionHash': 'rndmString',
                 *     '_id': '6776baf5c7c6e518aae88071',
                 *     'creationDate': 'Fri Jan 03 2012 13:13:25 GMT+0100 (Central European Standard Time)',
                 *     'lastUpdateDate': 'Fri Jan 03 2012 13:13:25 GMT+0100 (Central European Standard Time)',
                 *     'lastUpdater': '6776baf5c7c6e518aae88072'
                 *   },
                 *   {
                 *     'investmentType': 'rndmString',
                 *     'user': '6776baf5c7c6e518aae88072',
                 *     'investment': '6776baf5c7c6e518aae88072',
                 *     'investmentProject': '6776baf5c7c6e518aae88072',
                 *     'sourceUser': '6776baf5c7c6e518aae88072',
                 *     'sellOffer': '6776baf5c7c6e518aae88072',
                 *     'status': 'pending',
                 *     'sourceWallet': '6776baf5c7c6e518aae88072',
                 *     'totalPriceInSourceCurrency': 12,
                 *     'totalPriceInProjectCurrency': 12,
                 *     'nbShares': 289,
                 *     'exchangeRateMultiplier': 12,
                 *     'exchangeFeesPercent': 12,
                 *     'exchangeFeesAmountInSourceCurrency': 12,
                 *     'blockchainTransactionHash': 'rndmString',
                 *     '_id': '6776baf5c7c6e518aae88071',
                 *     'creationDate': 'Fri Jan 03 2012 13:13:25 GMT+0100 (Central European Standard Time)',
                 *     'lastUpdateDate': 'Fri Jan 03 2012 13:13:25 GMT+0100 (Central European Standard Time)',
                 *     'lastUpdater': '6776baf5c7c6e518aae88072'
                 *   }
                 * ]
             */
                investmentTransactionEquityGetAll(
                    filter ?: AsFilter<modelTypes.InvestmentTransactionEquityModels['Write']>,
                    config ?: never
                ): Promise<modelTypes.InvestmentTransactionEquityModels['Read'][]>
investmentTransactionEquityGetAll<Config extends Omit<RequestConfigRead<modelTypes.InvestmentTransactionEquityModels['Read']>, 'filter'>>(
    filter ?: AsFilter<modelTypes.InvestmentTransactionEquityModels['Write']>,
    config ?: Config
): Promise<MaybePaginated<modelTypes.InvestmentTransactionEquityModels['Read'][], Config>>,
    /** Allow to get the last ressources by creation date
     * @example
     * [
     *   {
     *     'investmentType': 'rndmString',
     *     'user': '6776baf5c7c6e518aae88072',
     *     'investment': '6776baf5c7c6e518aae88072',
     *     'investmentProject': '6776baf5c7c6e518aae88072',
     *     'sourceUser': '6776baf5c7c6e518aae88072',
     *     'sellOffer': '6776baf5c7c6e518aae88072',
     *     'status': 'pending',
     *     'sourceWallet': '6776baf5c7c6e518aae88072',
     *     'totalPriceInSourceCurrency': 12,
     *     'totalPriceInProjectCurrency': 12,
     *     'nbShares': 289,
     *     'exchangeRateMultiplier': 12,
     *     'exchangeFeesPercent': 12,
     *     'exchangeFeesAmountInSourceCurrency': 12,
     *     'blockchainTransactionHash': 'rndmString',
     *     '_id': '6776baf5c7c6e518aae88071',
     *     'creationDate': 'Fri Jan 03 2012 13:13:25 GMT+0100 (Central European Standard Time)',
     *     'lastUpdateDate': 'Fri Jan 03 2012 13:13:25 GMT+0100 (Central European Standard Time)',
     *     'lastUpdater': '6776baf5c7c6e518aae88072'
     *   },
     *   {
     *     'investmentType': 'rndmString',
     *     'user': '6776baf5c7c6e518aae88072',
     *     'investment': '6776baf5c7c6e518aae88072',
     *     'investmentProject': '6776baf5c7c6e518aae88072',
     *     'sourceUser': '6776baf5c7c6e518aae88072',
     *     'sellOffer': '6776baf5c7c6e518aae88072',
     *     'status': 'pending',
     *     'sourceWallet': '6776baf5c7c6e518aae88072',
     *     'totalPriceInSourceCurrency': 12,
     *     'totalPriceInProjectCurrency': 12,
     *     'nbShares': 289,
     *     'exchangeRateMultiplier': 12,
     *     'exchangeFeesPercent': 12,
     *     'exchangeFeesAmountInSourceCurrency': 12,
     *     'blockchainTransactionHash': 'rndmString',
     *     '_id': '6776baf5c7c6e518aae88071',
     *     'creationDate': 'Fri Jan 03 2012 13:13:25 GMT+0100 (Central European Standard Time)',
     *     'lastUpdateDate': 'Fri Jan 03 2012 13:13:25 GMT+0100 (Central European Standard Time)',
     *     'lastUpdater': '6776baf5c7c6e518aae88072'
     *   }
     * ]
 */
    investmentTransactionEquityGetLastN(
        limit ?: number,
        config ?: never,
    ): Promise<modelTypes.InvestmentTransactionEquityModels['Read'][]>
investmentTransactionEquityGetLastN<Config extends RequestConfigRead<modelTypes.InvestmentTransactionEquityModels['Read']>>(
    limit ?: number,
    config ?: Config,
): Promise<MaybePaginated<modelTypes.InvestmentTransactionEquityModels['Read'][], Config>>,
    /** Allow to get the first ressources by creation date
     * @example
     * [
     *   {
     *     'investmentType': 'rndmString',
     *     'user': '6776baf5c7c6e518aae88072',
     *     'investment': '6776baf5c7c6e518aae88072',
     *     'investmentProject': '6776baf5c7c6e518aae88072',
     *     'sourceUser': '6776baf5c7c6e518aae88072',
     *     'sellOffer': '6776baf5c7c6e518aae88072',
     *     'status': 'pending',
     *     'sourceWallet': '6776baf5c7c6e518aae88072',
     *     'totalPriceInSourceCurrency': 12,
     *     'totalPriceInProjectCurrency': 12,
     *     'nbShares': 289,
     *     'exchangeRateMultiplier': 12,
     *     'exchangeFeesPercent': 12,
     *     'exchangeFeesAmountInSourceCurrency': 12,
     *     'blockchainTransactionHash': 'rndmString',
     *     '_id': '6776baf5c7c6e518aae88071',
     *     'creationDate': 'Fri Jan 03 2012 13:13:25 GMT+0100 (Central European Standard Time)',
     *     'lastUpdateDate': 'Fri Jan 03 2012 13:13:25 GMT+0100 (Central European Standard Time)',
     *     'lastUpdater': '6776baf5c7c6e518aae88072'
     *   },
     *   {
     *     'investmentType': 'rndmString',
     *     'user': '6776baf5c7c6e518aae88072',
     *     'investment': '6776baf5c7c6e518aae88072',
     *     'investmentProject': '6776baf5c7c6e518aae88072',
     *     'sourceUser': '6776baf5c7c6e518aae88072',
     *     'sellOffer': '6776baf5c7c6e518aae88072',
     *     'status': 'pending',
     *     'sourceWallet': '6776baf5c7c6e518aae88072',
     *     'totalPriceInSourceCurrency': 12,
     *     'totalPriceInProjectCurrency': 12,
     *     'nbShares': 289,
     *     'exchangeRateMultiplier': 12,
     *     'exchangeFeesPercent': 12,
     *     'exchangeFeesAmountInSourceCurrency': 12,
     *     'blockchainTransactionHash': 'rndmString',
     *     '_id': '6776baf5c7c6e518aae88071',
     *     'creationDate': 'Fri Jan 03 2012 13:13:25 GMT+0100 (Central European Standard Time)',
     *     'lastUpdateDate': 'Fri Jan 03 2012 13:13:25 GMT+0100 (Central European Standard Time)',
     *     'lastUpdater': '6776baf5c7c6e518aae88072'
     *   }
     * ]
 */
    investmentTransactionEquityGetFirstN(
        limit ?: number,
        config ?: never
    ): Promise<modelTypes.InvestmentTransactionEquityModels['Read'][]>
investmentTransactionEquityGetFirstN<Config extends RequestConfigRead<modelTypes.InvestmentTransactionEquityModels['Read']>>(
    limit ?: number,
    config ?: Config
): Promise<MaybePaginated<modelTypes.InvestmentTransactionEquityModels['Read'][], Config>>,
    /** Count the number of ressources matching the filter in first param or all ressources if no filter is provided
     * @example
     * 12
 */
    investmentTransactionEquityCount(
        filter ?: AsFilter<modelTypes.InvestmentTransactionEquityModels['Write']>
    ): Promise<number>,
        /** Allow to get a ressource by it's unique mongoDb _id
         * @errorCodes
         * - 404: ressourceDoesNotExists
         * @example
         * {
         *   'investmentType': 'rndmString',
         *   'user': '6776baf5c7c6e518aae88072',
         *   'investment': '6776baf5c7c6e518aae88072',
         *   'investmentProject': '6776baf5c7c6e518aae88072',
         *   'sourceUser': '6776baf5c7c6e518aae88072',
         *   'sellOffer': '6776baf5c7c6e518aae88072',
         *   'status': 'pending',
         *   'sourceWallet': '6776baf5c7c6e518aae88072',
         *   'totalPriceInSourceCurrency': 12,
         *   'totalPriceInProjectCurrency': 12,
         *   'nbShares': 289,
         *   'exchangeRateMultiplier': 12,
         *   'exchangeFeesPercent': 12,
         *   'exchangeFeesAmountInSourceCurrency': 12,
         *   'blockchainTransactionHash': 'rndmString',
         *   '_id': '6776baf5c7c6e518aae88071',
         *   'creationDate': 'Fri Jan 03 2012 13:13:25 GMT+0100 (Central European Standard Time)',
         *   'lastUpdateDate': 'Fri Jan 03 2012 13:13:25 GMT+0100 (Central European Standard Time)',
         *   'lastUpdater': '6776baf5c7c6e518aae88072'
         * }
     */
        investmentTransactionEquityGetById<Config extends RequestConfigGetOne<modelTypes.InvestmentTransactionEquityModels['Read']>>(
            id: string,
            config ?: Config
        ): Promise<Config['triggerErrorIfNotSet'] extends true ? modelTypes.InvestmentTransactionEquityModels['Read'] : modelTypes.InvestmentTransactionEquityModels['Read'] | undefined>,
            /** Allow to get a ressource with providing a filter as first param
             * @example
             * {
             *   'investmentType': 'rndmString',
             *   'user': '6776baf5c7c6e518aae88072',
             *   'investment': '6776baf5c7c6e518aae88072',
             *   'investmentProject': '6776baf5c7c6e518aae88072',
             *   'sourceUser': '6776baf5c7c6e518aae88072',
             *   'sellOffer': '6776baf5c7c6e518aae88072',
             *   'status': 'pending',
             *   'sourceWallet': '6776baf5c7c6e518aae88072',
             *   'totalPriceInSourceCurrency': 12,
             *   'totalPriceInProjectCurrency': 12,
             *   'nbShares': 289,
             *   'exchangeRateMultiplier': 12,
             *   'exchangeFeesPercent': 12,
             *   'exchangeFeesAmountInSourceCurrency': 12,
             *   'blockchainTransactionHash': 'rndmString',
             *   '_id': '6776baf5c7c6e518aae88071',
             *   'creationDate': 'Fri Jan 03 2012 13:13:25 GMT+0100 (Central European Standard Time)',
             *   'lastUpdateDate': 'Fri Jan 03 2012 13:13:25 GMT+0100 (Central European Standard Time)',
             *   'lastUpdater': '6776baf5c7c6e518aae88072'
             * }
         */
            investmentTransactionEquityGetOne<Config extends Omit<RequestConfigGetOne<modelTypes.InvestmentTransactionEquityModels['Read']>, 'filter'>>(
                filter ?: AsFilter<modelTypes.InvestmentTransactionEquityModels['Write']>, // WRITE HERE because it will ensure referenced fields are passed as their string counterpart
                config ?: Config
            ): Promise<Config['triggerErrorIfNotSet'] extends true ? modelTypes.InvestmentTransactionEquityModels['Read'] : modelTypes.InvestmentTransactionEquityModels['Read'] | undefined>,
                /** Allow to get all ressources with providing a filter as first param
                 * @example
                 * [
                 *   {
                 *     'investmentType': 'rndmString',
                 *     'user': '6776baf5c7c6e518aae88072',
                 *     'investment': '6776baf5c7c6e518aae88072',
                 *     'investmentProject': '6776baf5c7c6e518aae88072',
                 *     'sourceUser': '6776baf5c7c6e518aae88072',
                 *     'sellOffer': '6776baf5c7c6e518aae88072',
                 *     'status': 'pending',
                 *     'sourceWallet': '6776baf5c7c6e518aae88072',
                 *     'totalPriceInSourceCurrency': 12,
                 *     'totalPriceInProjectCurrency': 12,
                 *     'nbShares': 289,
                 *     'exchangeRateMultiplier': 12,
                 *     'exchangeFeesPercent': 12,
                 *     'exchangeFeesAmountInSourceCurrency': 12,
                 *     'blockchainTransactionHash': 'rndmString',
                 *     '_id': '6776baf5c7c6e518aae88071',
                 *     'creationDate': 'Fri Jan 03 2012 13:13:25 GMT+0100 (Central European Standard Time)',
                 *     'lastUpdateDate': 'Fri Jan 03 2012 13:13:25 GMT+0100 (Central European Standard Time)',
                 *     'lastUpdater': '6776baf5c7c6e518aae88072'
                 *   },
                 *   {
                 *     'investmentType': 'rndmString',
                 *     'user': '6776baf5c7c6e518aae88072',
                 *     'investment': '6776baf5c7c6e518aae88072',
                 *     'investmentProject': '6776baf5c7c6e518aae88072',
                 *     'sourceUser': '6776baf5c7c6e518aae88072',
                 *     'sellOffer': '6776baf5c7c6e518aae88072',
                 *     'status': 'pending',
                 *     'sourceWallet': '6776baf5c7c6e518aae88072',
                 *     'totalPriceInSourceCurrency': 12,
                 *     'totalPriceInProjectCurrency': 12,
                 *     'nbShares': 289,
                 *     'exchangeRateMultiplier': 12,
                 *     'exchangeFeesPercent': 12,
                 *     'exchangeFeesAmountInSourceCurrency': 12,
                 *     'blockchainTransactionHash': 'rndmString',
                 *     '_id': '6776baf5c7c6e518aae88071',
                 *     'creationDate': 'Fri Jan 03 2012 13:13:25 GMT+0100 (Central European Standard Time)',
                 *     'lastUpdateDate': 'Fri Jan 03 2012 13:13:25 GMT+0100 (Central European Standard Time)',
                 *     'lastUpdater': '6776baf5c7c6e518aae88072'
                 *   }
                 * ]
             */
                investmentTransactionFundSharesGetAll(
                    filter ?: AsFilter<modelTypes.InvestmentTransactionFundSharesModels['Write']>,
                    config ?: never
                ): Promise<modelTypes.InvestmentTransactionFundSharesModels['Read'][]>
investmentTransactionFundSharesGetAll<Config extends Omit<RequestConfigRead<modelTypes.InvestmentTransactionFundSharesModels['Read']>, 'filter'>>(
    filter ?: AsFilter<modelTypes.InvestmentTransactionFundSharesModels['Write']>,
    config ?: Config
): Promise<MaybePaginated<modelTypes.InvestmentTransactionFundSharesModels['Read'][], Config>>,
    /** Allow to get the last ressources by creation date
     * @example
     * [
     *   {
     *     'investmentType': 'rndmString',
     *     'user': '6776baf5c7c6e518aae88072',
     *     'investment': '6776baf5c7c6e518aae88072',
     *     'investmentProject': '6776baf5c7c6e518aae88072',
     *     'sourceUser': '6776baf5c7c6e518aae88072',
     *     'sellOffer': '6776baf5c7c6e518aae88072',
     *     'status': 'pending',
     *     'sourceWallet': '6776baf5c7c6e518aae88072',
     *     'totalPriceInSourceCurrency': 12,
     *     'totalPriceInProjectCurrency': 12,
     *     'nbShares': 289,
     *     'exchangeRateMultiplier': 12,
     *     'exchangeFeesPercent': 12,
     *     'exchangeFeesAmountInSourceCurrency': 12,
     *     'blockchainTransactionHash': 'rndmString',
     *     '_id': '6776baf5c7c6e518aae88071',
     *     'creationDate': 'Fri Jan 03 2012 13:13:25 GMT+0100 (Central European Standard Time)',
     *     'lastUpdateDate': 'Fri Jan 03 2012 13:13:25 GMT+0100 (Central European Standard Time)',
     *     'lastUpdater': '6776baf5c7c6e518aae88072'
     *   },
     *   {
     *     'investmentType': 'rndmString',
     *     'user': '6776baf5c7c6e518aae88072',
     *     'investment': '6776baf5c7c6e518aae88072',
     *     'investmentProject': '6776baf5c7c6e518aae88072',
     *     'sourceUser': '6776baf5c7c6e518aae88072',
     *     'sellOffer': '6776baf5c7c6e518aae88072',
     *     'status': 'pending',
     *     'sourceWallet': '6776baf5c7c6e518aae88072',
     *     'totalPriceInSourceCurrency': 12,
     *     'totalPriceInProjectCurrency': 12,
     *     'nbShares': 289,
     *     'exchangeRateMultiplier': 12,
     *     'exchangeFeesPercent': 12,
     *     'exchangeFeesAmountInSourceCurrency': 12,
     *     'blockchainTransactionHash': 'rndmString',
     *     '_id': '6776baf5c7c6e518aae88071',
     *     'creationDate': 'Fri Jan 03 2012 13:13:25 GMT+0100 (Central European Standard Time)',
     *     'lastUpdateDate': 'Fri Jan 03 2012 13:13:25 GMT+0100 (Central European Standard Time)',
     *     'lastUpdater': '6776baf5c7c6e518aae88072'
     *   }
     * ]
 */
    investmentTransactionFundSharesGetLastN(
        limit ?: number,
        config ?: never,
    ): Promise<modelTypes.InvestmentTransactionFundSharesModels['Read'][]>
investmentTransactionFundSharesGetLastN<Config extends RequestConfigRead<modelTypes.InvestmentTransactionFundSharesModels['Read']>>(
    limit ?: number,
    config ?: Config,
): Promise<MaybePaginated<modelTypes.InvestmentTransactionFundSharesModels['Read'][], Config>>,
    /** Allow to get the first ressources by creation date
     * @example
     * [
     *   {
     *     'investmentType': 'rndmString',
     *     'user': '6776baf5c7c6e518aae88072',
     *     'investment': '6776baf5c7c6e518aae88072',
     *     'investmentProject': '6776baf5c7c6e518aae88072',
     *     'sourceUser': '6776baf5c7c6e518aae88072',
     *     'sellOffer': '6776baf5c7c6e518aae88072',
     *     'status': 'pending',
     *     'sourceWallet': '6776baf5c7c6e518aae88072',
     *     'totalPriceInSourceCurrency': 12,
     *     'totalPriceInProjectCurrency': 12,
     *     'nbShares': 289,
     *     'exchangeRateMultiplier': 12,
     *     'exchangeFeesPercent': 12,
     *     'exchangeFeesAmountInSourceCurrency': 12,
     *     'blockchainTransactionHash': 'rndmString',
     *     '_id': '6776baf5c7c6e518aae88071',
     *     'creationDate': 'Fri Jan 03 2012 13:13:25 GMT+0100 (Central European Standard Time)',
     *     'lastUpdateDate': 'Fri Jan 03 2012 13:13:25 GMT+0100 (Central European Standard Time)',
     *     'lastUpdater': '6776baf5c7c6e518aae88072'
     *   },
     *   {
     *     'investmentType': 'rndmString',
     *     'user': '6776baf5c7c6e518aae88072',
     *     'investment': '6776baf5c7c6e518aae88072',
     *     'investmentProject': '6776baf5c7c6e518aae88072',
     *     'sourceUser': '6776baf5c7c6e518aae88072',
     *     'sellOffer': '6776baf5c7c6e518aae88072',
     *     'status': 'pending',
     *     'sourceWallet': '6776baf5c7c6e518aae88072',
     *     'totalPriceInSourceCurrency': 12,
     *     'totalPriceInProjectCurrency': 12,
     *     'nbShares': 289,
     *     'exchangeRateMultiplier': 12,
     *     'exchangeFeesPercent': 12,
     *     'exchangeFeesAmountInSourceCurrency': 12,
     *     'blockchainTransactionHash': 'rndmString',
     *     '_id': '6776baf5c7c6e518aae88071',
     *     'creationDate': 'Fri Jan 03 2012 13:13:25 GMT+0100 (Central European Standard Time)',
     *     'lastUpdateDate': 'Fri Jan 03 2012 13:13:25 GMT+0100 (Central European Standard Time)',
     *     'lastUpdater': '6776baf5c7c6e518aae88072'
     *   }
     * ]
 */
    investmentTransactionFundSharesGetFirstN(
        limit ?: number,
        config ?: never
    ): Promise<modelTypes.InvestmentTransactionFundSharesModels['Read'][]>
investmentTransactionFundSharesGetFirstN<Config extends RequestConfigRead<modelTypes.InvestmentTransactionFundSharesModels['Read']>>(
    limit ?: number,
    config ?: Config
): Promise<MaybePaginated<modelTypes.InvestmentTransactionFundSharesModels['Read'][], Config>>,
    /** Count the number of ressources matching the filter in first param or all ressources if no filter is provided
     * @example
     * 12
 */
    investmentTransactionFundSharesCount(
        filter ?: AsFilter<modelTypes.InvestmentTransactionFundSharesModels['Write']>
    ): Promise<number>,
        /** Allow to get a ressource by it's unique mongoDb _id
         * @errorCodes
         * - 404: ressourceDoesNotExists
         * @example
         * {
         *   'investmentType': 'rndmString',
         *   'user': '6776baf5c7c6e518aae88072',
         *   'investment': '6776baf5c7c6e518aae88072',
         *   'investmentProject': '6776baf5c7c6e518aae88072',
         *   'sourceUser': '6776baf5c7c6e518aae88072',
         *   'sellOffer': '6776baf5c7c6e518aae88072',
         *   'status': 'pending',
         *   'sourceWallet': '6776baf5c7c6e518aae88072',
         *   'totalPriceInSourceCurrency': 12,
         *   'totalPriceInProjectCurrency': 12,
         *   'nbShares': 289,
         *   'exchangeRateMultiplier': 12,
         *   'exchangeFeesPercent': 12,
         *   'exchangeFeesAmountInSourceCurrency': 12,
         *   'blockchainTransactionHash': 'rndmString',
         *   '_id': '6776baf5c7c6e518aae88071',
         *   'creationDate': 'Fri Jan 03 2012 13:13:25 GMT+0100 (Central European Standard Time)',
         *   'lastUpdateDate': 'Fri Jan 03 2012 13:13:25 GMT+0100 (Central European Standard Time)',
         *   'lastUpdater': '6776baf5c7c6e518aae88072'
         * }
     */
        investmentTransactionFundSharesGetById<Config extends RequestConfigGetOne<modelTypes.InvestmentTransactionFundSharesModels['Read']>>(
            id: string,
            config ?: Config
        ): Promise<Config['triggerErrorIfNotSet'] extends true ? modelTypes.InvestmentTransactionFundSharesModels['Read'] : modelTypes.InvestmentTransactionFundSharesModels['Read'] | undefined>,
            /** Allow to get a ressource with providing a filter as first param
             * @example
             * {
             *   'investmentType': 'rndmString',
             *   'user': '6776baf5c7c6e518aae88072',
             *   'investment': '6776baf5c7c6e518aae88072',
             *   'investmentProject': '6776baf5c7c6e518aae88072',
             *   'sourceUser': '6776baf5c7c6e518aae88072',
             *   'sellOffer': '6776baf5c7c6e518aae88072',
             *   'status': 'pending',
             *   'sourceWallet': '6776baf5c7c6e518aae88072',
             *   'totalPriceInSourceCurrency': 12,
             *   'totalPriceInProjectCurrency': 12,
             *   'nbShares': 289,
             *   'exchangeRateMultiplier': 12,
             *   'exchangeFeesPercent': 12,
             *   'exchangeFeesAmountInSourceCurrency': 12,
             *   'blockchainTransactionHash': 'rndmString',
             *   '_id': '6776baf5c7c6e518aae88071',
             *   'creationDate': 'Fri Jan 03 2012 13:13:25 GMT+0100 (Central European Standard Time)',
             *   'lastUpdateDate': 'Fri Jan 03 2012 13:13:25 GMT+0100 (Central European Standard Time)',
             *   'lastUpdater': '6776baf5c7c6e518aae88072'
             * }
         */
            investmentTransactionFundSharesGetOne<Config extends Omit<RequestConfigGetOne<modelTypes.InvestmentTransactionFundSharesModels['Read']>, 'filter'>>(
                filter ?: AsFilter<modelTypes.InvestmentTransactionFundSharesModels['Write']>, // WRITE HERE because it will ensure referenced fields are passed as their string counterpart
                config ?: Config
            ): Promise<Config['triggerErrorIfNotSet'] extends true ? modelTypes.InvestmentTransactionFundSharesModels['Read'] : modelTypes.InvestmentTransactionFundSharesModels['Read'] | undefined>,
                /** Allow to get all ressources with providing a filter as first param
                 * @example
                 * [
                 *   {
                 *     'title': {
                 *       'fr': 'Bonjour',
                 *       'en': 'Hello'
                 *     },
                 *     'description': {
                 *       'fr': 'Bonjour',
                 *       'en': 'Hello'
                 *     },
                 *     'abTestingVersion': [
                 *       'rndmString',
                 *       'rndmString'
                 *     ],
                 *     'url': 'rndmString',
                 *     'startBtnText': {
                 *       'fr': 'Bonjour',
                 *       'en': 'Hello'
                 *     },
                 *     'bottomBarTitle': {
                 *       'fr': 'Bonjour',
                 *       'en': 'Hello'
                 *     },
                 *     'bottomBarDescription': {
                 *       'fr': 'Bonjour',
                 *       'en': 'Hello'
                 *     },
                 *     'bottomBarBtnTxt': {
                 *       'fr': 'Bonjour',
                 *       'en': 'Hello'
                 *     },
                 *     'outroTitle': {
                 *       'fr': 'Bonjour',
                 *       'en': 'Hello'
                 *     },
                 *     'outroDescription': {
                 *       'fr': 'Bonjour',
                 *       'en': 'Hello'
                 *     },
                 *     'outroUrl': 'rndmString',
                 *     '_id': '6776baf5c7c6e518aae88071'
                 *   },
                 *   {
                 *     'title': {
                 *       'fr': 'Bonjour',
                 *       'en': 'Hello'
                 *     },
                 *     'description': {
                 *       'fr': 'Bonjour',
                 *       'en': 'Hello'
                 *     },
                 *     'abTestingVersion': [
                 *       'rndmString',
                 *       'rndmString'
                 *     ],
                 *     'url': 'rndmString',
                 *     'startBtnText': {
                 *       'fr': 'Bonjour',
                 *       'en': 'Hello'
                 *     },
                 *     'bottomBarTitle': {
                 *       'fr': 'Bonjour',
                 *       'en': 'Hello'
                 *     },
                 *     'bottomBarDescription': {
                 *       'fr': 'Bonjour',
                 *       'en': 'Hello'
                 *     },
                 *     'bottomBarBtnTxt': {
                 *       'fr': 'Bonjour',
                 *       'en': 'Hello'
                 *     },
                 *     'outroTitle': {
                 *       'fr': 'Bonjour',
                 *       'en': 'Hello'
                 *     },
                 *     'outroDescription': {
                 *       'fr': 'Bonjour',
                 *       'en': 'Hello'
                 *     },
                 *     'outroUrl': 'rndmString',
                 *     '_id': '6776baf5c7c6e518aae88071'
                 *   }
                 * ]
             */
                missionGetAll(
                    filter ?: AsFilter<modelTypes.MissionModels['Write']>,
                    config ?: never
                ): Promise<modelTypes.MissionModels['Read'][]>
missionGetAll<Config extends Omit<RequestConfigRead<modelTypes.MissionModels['Read']>, 'filter'>>(
    filter ?: AsFilter<modelTypes.MissionModels['Write']>,
    config ?: Config
): Promise<MaybePaginated<modelTypes.MissionModels['Read'][], Config>>,
    /** Allow to get the last ressources by creation date
     * @example
     * [
     *   {
     *     'title': {
     *       'fr': 'Bonjour',
     *       'en': 'Hello'
     *     },
     *     'description': {
     *       'fr': 'Bonjour',
     *       'en': 'Hello'
     *     },
     *     'abTestingVersion': [
     *       'rndmString',
     *       'rndmString'
     *     ],
     *     'url': 'rndmString',
     *     'startBtnText': {
     *       'fr': 'Bonjour',
     *       'en': 'Hello'
     *     },
     *     'bottomBarTitle': {
     *       'fr': 'Bonjour',
     *       'en': 'Hello'
     *     },
     *     'bottomBarDescription': {
     *       'fr': 'Bonjour',
     *       'en': 'Hello'
     *     },
     *     'bottomBarBtnTxt': {
     *       'fr': 'Bonjour',
     *       'en': 'Hello'
     *     },
     *     'outroTitle': {
     *       'fr': 'Bonjour',
     *       'en': 'Hello'
     *     },
     *     'outroDescription': {
     *       'fr': 'Bonjour',
     *       'en': 'Hello'
     *     },
     *     'outroUrl': 'rndmString',
     *     '_id': '6776baf5c7c6e518aae88071'
     *   },
     *   {
     *     'title': {
     *       'fr': 'Bonjour',
     *       'en': 'Hello'
     *     },
     *     'description': {
     *       'fr': 'Bonjour',
     *       'en': 'Hello'
     *     },
     *     'abTestingVersion': [
     *       'rndmString',
     *       'rndmString'
     *     ],
     *     'url': 'rndmString',
     *     'startBtnText': {
     *       'fr': 'Bonjour',
     *       'en': 'Hello'
     *     },
     *     'bottomBarTitle': {
     *       'fr': 'Bonjour',
     *       'en': 'Hello'
     *     },
     *     'bottomBarDescription': {
     *       'fr': 'Bonjour',
     *       'en': 'Hello'
     *     },
     *     'bottomBarBtnTxt': {
     *       'fr': 'Bonjour',
     *       'en': 'Hello'
     *     },
     *     'outroTitle': {
     *       'fr': 'Bonjour',
     *       'en': 'Hello'
     *     },
     *     'outroDescription': {
     *       'fr': 'Bonjour',
     *       'en': 'Hello'
     *     },
     *     'outroUrl': 'rndmString',
     *     '_id': '6776baf5c7c6e518aae88071'
     *   }
     * ]
 */
    missionGetLastN(
        limit ?: number,
        config ?: never,
    ): Promise<modelTypes.MissionModels['Read'][]>
missionGetLastN<Config extends RequestConfigRead<modelTypes.MissionModels['Read']>>(
    limit ?: number,
    config ?: Config,
): Promise<MaybePaginated<modelTypes.MissionModels['Read'][], Config>>,
    /** Allow to get the first ressources by creation date
     * @example
     * [
     *   {
     *     'title': {
     *       'fr': 'Bonjour',
     *       'en': 'Hello'
     *     },
     *     'description': {
     *       'fr': 'Bonjour',
     *       'en': 'Hello'
     *     },
     *     'abTestingVersion': [
     *       'rndmString',
     *       'rndmString'
     *     ],
     *     'url': 'rndmString',
     *     'startBtnText': {
     *       'fr': 'Bonjour',
     *       'en': 'Hello'
     *     },
     *     'bottomBarTitle': {
     *       'fr': 'Bonjour',
     *       'en': 'Hello'
     *     },
     *     'bottomBarDescription': {
     *       'fr': 'Bonjour',
     *       'en': 'Hello'
     *     },
     *     'bottomBarBtnTxt': {
     *       'fr': 'Bonjour',
     *       'en': 'Hello'
     *     },
     *     'outroTitle': {
     *       'fr': 'Bonjour',
     *       'en': 'Hello'
     *     },
     *     'outroDescription': {
     *       'fr': 'Bonjour',
     *       'en': 'Hello'
     *     },
     *     'outroUrl': 'rndmString',
     *     '_id': '6776baf5c7c6e518aae88071'
     *   },
     *   {
     *     'title': {
     *       'fr': 'Bonjour',
     *       'en': 'Hello'
     *     },
     *     'description': {
     *       'fr': 'Bonjour',
     *       'en': 'Hello'
     *     },
     *     'abTestingVersion': [
     *       'rndmString',
     *       'rndmString'
     *     ],
     *     'url': 'rndmString',
     *     'startBtnText': {
     *       'fr': 'Bonjour',
     *       'en': 'Hello'
     *     },
     *     'bottomBarTitle': {
     *       'fr': 'Bonjour',
     *       'en': 'Hello'
     *     },
     *     'bottomBarDescription': {
     *       'fr': 'Bonjour',
     *       'en': 'Hello'
     *     },
     *     'bottomBarBtnTxt': {
     *       'fr': 'Bonjour',
     *       'en': 'Hello'
     *     },
     *     'outroTitle': {
     *       'fr': 'Bonjour',
     *       'en': 'Hello'
     *     },
     *     'outroDescription': {
     *       'fr': 'Bonjour',
     *       'en': 'Hello'
     *     },
     *     'outroUrl': 'rndmString',
     *     '_id': '6776baf5c7c6e518aae88071'
     *   }
     * ]
 */
    missionGetFirstN(
        limit ?: number,
        config ?: never
    ): Promise<modelTypes.MissionModels['Read'][]>
missionGetFirstN<Config extends RequestConfigRead<modelTypes.MissionModels['Read']>>(
    limit ?: number,
    config ?: Config
): Promise<MaybePaginated<modelTypes.MissionModels['Read'][], Config>>,
    /** Count the number of ressources matching the filter in first param or all ressources if no filter is provided
     * @example
     * 12
 */
    missionCount(
        filter ?: AsFilter<modelTypes.MissionModels['Write']>
    ): Promise<number>,
        /** Allow to get a ressource by it's unique mongoDb _id
         * @errorCodes
         * - 404: ressourceDoesNotExists
         * @example
         * {
         *   'title': {
         *     'fr': 'Bonjour',
         *     'en': 'Hello'
         *   },
         *   'description': {
         *     'fr': 'Bonjour',
         *     'en': 'Hello'
         *   },
         *   'abTestingVersion': [
         *     'rndmString',
         *     'rndmString'
         *   ],
         *   'url': 'rndmString',
         *   'startBtnText': {
         *     'fr': 'Bonjour',
         *     'en': 'Hello'
         *   },
         *   'bottomBarTitle': {
         *     'fr': 'Bonjour',
         *     'en': 'Hello'
         *   },
         *   'bottomBarDescription': {
         *     'fr': 'Bonjour',
         *     'en': 'Hello'
         *   },
         *   'bottomBarBtnTxt': {
         *     'fr': 'Bonjour',
         *     'en': 'Hello'
         *   },
         *   'outroTitle': {
         *     'fr': 'Bonjour',
         *     'en': 'Hello'
         *   },
         *   'outroDescription': {
         *     'fr': 'Bonjour',
         *     'en': 'Hello'
         *   },
         *   'outroUrl': 'rndmString',
         *   '_id': '6776baf5c7c6e518aae88071'
         * }
     */
        missionGetById<Config extends RequestConfigGetOne<modelTypes.MissionModels['Read']>>(
            id: string,
            config ?: Config
        ): Promise<Config['triggerErrorIfNotSet'] extends true ? modelTypes.MissionModels['Read'] : modelTypes.MissionModels['Read'] | undefined>,
            /** Allow to get a ressource with providing a filter as first param
             * @example
             * {
             *   'title': {
             *     'fr': 'Bonjour',
             *     'en': 'Hello'
             *   },
             *   'description': {
             *     'fr': 'Bonjour',
             *     'en': 'Hello'
             *   },
             *   'abTestingVersion': [
             *     'rndmString',
             *     'rndmString'
             *   ],
             *   'url': 'rndmString',
             *   'startBtnText': {
             *     'fr': 'Bonjour',
             *     'en': 'Hello'
             *   },
             *   'bottomBarTitle': {
             *     'fr': 'Bonjour',
             *     'en': 'Hello'
             *   },
             *   'bottomBarDescription': {
             *     'fr': 'Bonjour',
             *     'en': 'Hello'
             *   },
             *   'bottomBarBtnTxt': {
             *     'fr': 'Bonjour',
             *     'en': 'Hello'
             *   },
             *   'outroTitle': {
             *     'fr': 'Bonjour',
             *     'en': 'Hello'
             *   },
             *   'outroDescription': {
             *     'fr': 'Bonjour',
             *     'en': 'Hello'
             *   },
             *   'outroUrl': 'rndmString',
             *   '_id': '6776baf5c7c6e518aae88071'
             * }
         */
            missionGetOne<Config extends Omit<RequestConfigGetOne<modelTypes.MissionModels['Read']>, 'filter'>>(
                filter ?: AsFilter<modelTypes.MissionModels['Write']>, // WRITE HERE because it will ensure referenced fields are passed as their string counterpart
                config ?: Config
            ): Promise<Config['triggerErrorIfNotSet'] extends true ? modelTypes.MissionModels['Read'] : modelTypes.MissionModels['Read'] | undefined>,
                /** Allow to get all ressources with providing a filter as first param
                 * @example
                 * [
                 *   {
                 *     'title': {
                 *       'fr': 'Bonjour',
                 *       'en': 'Hello'
                 *     },
                 *     'avatar': 'rndmString',
                 *     'description': {
                 *       'fr': 'Bonjour',
                 *       'en': 'Hello'
                 *     },
                 *     'info': {
                 *       'fr': 'Bonjour',
                 *       'en': 'Hello'
                 *     },
                 *     'image': 'rndmString',
                 *     'linkUrl': 'https://noodle.com/',
                 *     '_id': '6776baf5c7c6e518aae88071',
                 *     'creationDate': 'Fri Jan 03 2012 13:13:25 GMT+0100 (Central European Standard Time)',
                 *     'creator': '6776baf5c7c6e518aae88072',
                 *     'lastUpdateDate': 'Fri Jan 03 2012 13:13:25 GMT+0100 (Central European Standard Time)'
                 *   },
                 *   {
                 *     'title': {
                 *       'fr': 'Bonjour',
                 *       'en': 'Hello'
                 *     },
                 *     'avatar': 'rndmString',
                 *     'description': {
                 *       'fr': 'Bonjour',
                 *       'en': 'Hello'
                 *     },
                 *     'info': {
                 *       'fr': 'Bonjour',
                 *       'en': 'Hello'
                 *     },
                 *     'image': 'rndmString',
                 *     'linkUrl': 'https://noodle.com/',
                 *     '_id': '6776baf5c7c6e518aae88071',
                 *     'creationDate': 'Fri Jan 03 2012 13:13:25 GMT+0100 (Central European Standard Time)',
                 *     'creator': '6776baf5c7c6e518aae88072',
                 *     'lastUpdateDate': 'Fri Jan 03 2012 13:13:25 GMT+0100 (Central European Standard Time)'
                 *   }
                 * ]
             */
                newsGetAll(
                    filter ?: AsFilter<modelTypes.NewsModels['Write']>,
                    config ?: never
                ): Promise<modelTypes.NewsModels['Read'][]>
newsGetAll<Config extends Omit<RequestConfigRead<modelTypes.NewsModels['Read']>, 'filter'>>(
    filter ?: AsFilter<modelTypes.NewsModels['Write']>,
    config ?: Config
): Promise<MaybePaginated<modelTypes.NewsModels['Read'][], Config>>,
    /** Allow to get the last ressources by creation date
     * @example
     * [
     *   {
     *     'title': {
     *       'fr': 'Bonjour',
     *       'en': 'Hello'
     *     },
     *     'avatar': 'rndmString',
     *     'description': {
     *       'fr': 'Bonjour',
     *       'en': 'Hello'
     *     },
     *     'info': {
     *       'fr': 'Bonjour',
     *       'en': 'Hello'
     *     },
     *     'image': 'rndmString',
     *     'linkUrl': 'https://noodle.com/',
     *     '_id': '6776baf5c7c6e518aae88071',
     *     'creationDate': 'Fri Jan 03 2012 13:13:25 GMT+0100 (Central European Standard Time)',
     *     'creator': '6776baf5c7c6e518aae88072',
     *     'lastUpdateDate': 'Fri Jan 03 2012 13:13:25 GMT+0100 (Central European Standard Time)'
     *   },
     *   {
     *     'title': {
     *       'fr': 'Bonjour',
     *       'en': 'Hello'
     *     },
     *     'avatar': 'rndmString',
     *     'description': {
     *       'fr': 'Bonjour',
     *       'en': 'Hello'
     *     },
     *     'info': {
     *       'fr': 'Bonjour',
     *       'en': 'Hello'
     *     },
     *     'image': 'rndmString',
     *     'linkUrl': 'https://noodle.com/',
     *     '_id': '6776baf5c7c6e518aae88071',
     *     'creationDate': 'Fri Jan 03 2012 13:13:25 GMT+0100 (Central European Standard Time)',
     *     'creator': '6776baf5c7c6e518aae88072',
     *     'lastUpdateDate': 'Fri Jan 03 2012 13:13:25 GMT+0100 (Central European Standard Time)'
     *   }
     * ]
 */
    newsGetLastN(
        limit ?: number,
        config ?: never,
    ): Promise<modelTypes.NewsModels['Read'][]>
newsGetLastN<Config extends RequestConfigRead<modelTypes.NewsModels['Read']>>(
    limit ?: number,
    config ?: Config,
): Promise<MaybePaginated<modelTypes.NewsModels['Read'][], Config>>,
    /** Allow to get the first ressources by creation date
     * @example
     * [
     *   {
     *     'title': {
     *       'fr': 'Bonjour',
     *       'en': 'Hello'
     *     },
     *     'avatar': 'rndmString',
     *     'description': {
     *       'fr': 'Bonjour',
     *       'en': 'Hello'
     *     },
     *     'info': {
     *       'fr': 'Bonjour',
     *       'en': 'Hello'
     *     },
     *     'image': 'rndmString',
     *     'linkUrl': 'https://noodle.com/',
     *     '_id': '6776baf5c7c6e518aae88071',
     *     'creationDate': 'Fri Jan 03 2012 13:13:25 GMT+0100 (Central European Standard Time)',
     *     'creator': '6776baf5c7c6e518aae88072',
     *     'lastUpdateDate': 'Fri Jan 03 2012 13:13:25 GMT+0100 (Central European Standard Time)'
     *   },
     *   {
     *     'title': {
     *       'fr': 'Bonjour',
     *       'en': 'Hello'
     *     },
     *     'avatar': 'rndmString',
     *     'description': {
     *       'fr': 'Bonjour',
     *       'en': 'Hello'
     *     },
     *     'info': {
     *       'fr': 'Bonjour',
     *       'en': 'Hello'
     *     },
     *     'image': 'rndmString',
     *     'linkUrl': 'https://noodle.com/',
     *     '_id': '6776baf5c7c6e518aae88071',
     *     'creationDate': 'Fri Jan 03 2012 13:13:25 GMT+0100 (Central European Standard Time)',
     *     'creator': '6776baf5c7c6e518aae88072',
     *     'lastUpdateDate': 'Fri Jan 03 2012 13:13:25 GMT+0100 (Central European Standard Time)'
     *   }
     * ]
 */
    newsGetFirstN(
        limit ?: number,
        config ?: never
    ): Promise<modelTypes.NewsModels['Read'][]>
newsGetFirstN<Config extends RequestConfigRead<modelTypes.NewsModels['Read']>>(
    limit ?: number,
    config ?: Config
): Promise<MaybePaginated<modelTypes.NewsModels['Read'][], Config>>,
    /** Count the number of ressources matching the filter in first param or all ressources if no filter is provided
     * @example
     * 12
 */
    newsCount(
        filter ?: AsFilter<modelTypes.NewsModels['Write']>
    ): Promise<number>,
        /** Allow to get a ressource by it's unique mongoDb _id
         * @errorCodes
         * - 404: ressourceDoesNotExists
         * @example
         * {
         *   'title': {
         *     'fr': 'Bonjour',
         *     'en': 'Hello'
         *   },
         *   'avatar': 'rndmString',
         *   'description': {
         *     'fr': 'Bonjour',
         *     'en': 'Hello'
         *   },
         *   'info': {
         *     'fr': 'Bonjour',
         *     'en': 'Hello'
         *   },
         *   'image': 'rndmString',
         *   'linkUrl': 'https://noodle.com/',
         *   '_id': '6776baf5c7c6e518aae88071',
         *   'creationDate': 'Fri Jan 03 2012 13:13:25 GMT+0100 (Central European Standard Time)',
         *   'creator': '6776baf5c7c6e518aae88072',
         *   'lastUpdateDate': 'Fri Jan 03 2012 13:13:25 GMT+0100 (Central European Standard Time)'
         * }
     */
        newsGetById<Config extends RequestConfigGetOne<modelTypes.NewsModels['Read']>>(
            id: string,
            config ?: Config
        ): Promise<Config['triggerErrorIfNotSet'] extends true ? modelTypes.NewsModels['Read'] : modelTypes.NewsModels['Read'] | undefined>,
            /** Allow to get a ressource with providing a filter as first param
             * @example
             * {
             *   'title': {
             *     'fr': 'Bonjour',
             *     'en': 'Hello'
             *   },
             *   'avatar': 'rndmString',
             *   'description': {
             *     'fr': 'Bonjour',
             *     'en': 'Hello'
             *   },
             *   'info': {
             *     'fr': 'Bonjour',
             *     'en': 'Hello'
             *   },
             *   'image': 'rndmString',
             *   'linkUrl': 'https://noodle.com/',
             *   '_id': '6776baf5c7c6e518aae88071',
             *   'creationDate': 'Fri Jan 03 2012 13:13:25 GMT+0100 (Central European Standard Time)',
             *   'creator': '6776baf5c7c6e518aae88072',
             *   'lastUpdateDate': 'Fri Jan 03 2012 13:13:25 GMT+0100 (Central European Standard Time)'
             * }
         */
            newsGetOne<Config extends Omit<RequestConfigGetOne<modelTypes.NewsModels['Read']>, 'filter'>>(
                filter ?: AsFilter<modelTypes.NewsModels['Write']>, // WRITE HERE because it will ensure referenced fields are passed as their string counterpart
                config ?: Config
            ): Promise<Config['triggerErrorIfNotSet'] extends true ? modelTypes.NewsModels['Read'] : modelTypes.NewsModels['Read'] | undefined>,
                /** Allow to get all ressources with providing a filter as first param
                 * @example
                 * [
                 *   {
                 *     'investmentType': 'rndmString',
                 *     'status': 'active',
                 *     'investment': '6776baf5c7c6e518aae88072',
                 *     'investmentProject': '6776baf5c7c6e518aae88072',
                 *     'pricePerShare': 2.12,
                 *     'currency': 'bangkEuro',
                 *     'nbShares': 2.12,
                 *     'transaction': '6776baf5c7c6e518aae88072',
                 *     'validUntil': 'Fri Jan 03 2012 13:13:25 GMT+0100 (Central European Standard Time)',
                 *     '_id': '6776baf5c7c6e518aae88071',
                 *     'creationDate': 'Fri Jan 03 2012 13:13:25 GMT+0100 (Central European Standard Time)',
                 *     'creator': '6776baf5c7c6e518aae88072'
                 *   },
                 *   {
                 *     'investmentType': 'rndmString',
                 *     'status': 'active',
                 *     'investment': '6776baf5c7c6e518aae88072',
                 *     'investmentProject': '6776baf5c7c6e518aae88072',
                 *     'pricePerShare': 2.12,
                 *     'currency': 'bangkEuro',
                 *     'nbShares': 2.12,
                 *     'transaction': '6776baf5c7c6e518aae88072',
                 *     'validUntil': 'Fri Jan 03 2012 13:13:25 GMT+0100 (Central European Standard Time)',
                 *     '_id': '6776baf5c7c6e518aae88071',
                 *     'creationDate': 'Fri Jan 03 2012 13:13:25 GMT+0100 (Central European Standard Time)',
                 *     'creator': '6776baf5c7c6e518aae88072'
                 *   }
                 * ]
             */
                sellOfferBondsGetAll(
                    filter ?: AsFilter<modelTypes.SellOfferBondsModels['Write']>,
                    config ?: never
                ): Promise<modelTypes.SellOfferBondsModels['Read'][]>
sellOfferBondsGetAll<Config extends Omit<RequestConfigRead<modelTypes.SellOfferBondsModels['Read']>, 'filter'>>(
    filter ?: AsFilter<modelTypes.SellOfferBondsModels['Write']>,
    config ?: Config
): Promise<MaybePaginated<modelTypes.SellOfferBondsModels['Read'][], Config>>,
    /** Allow to get the last ressources by creation date
     * @example
     * [
     *   {
     *     'investmentType': 'rndmString',
     *     'status': 'active',
     *     'investment': '6776baf5c7c6e518aae88072',
     *     'investmentProject': '6776baf5c7c6e518aae88072',
     *     'pricePerShare': 2.12,
     *     'currency': 'bangkEuro',
     *     'nbShares': 2.12,
     *     'transaction': '6776baf5c7c6e518aae88072',
     *     'validUntil': 'Fri Jan 03 2012 13:13:25 GMT+0100 (Central European Standard Time)',
     *     '_id': '6776baf5c7c6e518aae88071',
     *     'creationDate': 'Fri Jan 03 2012 13:13:25 GMT+0100 (Central European Standard Time)',
     *     'creator': '6776baf5c7c6e518aae88072'
     *   },
     *   {
     *     'investmentType': 'rndmString',
     *     'status': 'active',
     *     'investment': '6776baf5c7c6e518aae88072',
     *     'investmentProject': '6776baf5c7c6e518aae88072',
     *     'pricePerShare': 2.12,
     *     'currency': 'bangkEuro',
     *     'nbShares': 2.12,
     *     'transaction': '6776baf5c7c6e518aae88072',
     *     'validUntil': 'Fri Jan 03 2012 13:13:25 GMT+0100 (Central European Standard Time)',
     *     '_id': '6776baf5c7c6e518aae88071',
     *     'creationDate': 'Fri Jan 03 2012 13:13:25 GMT+0100 (Central European Standard Time)',
     *     'creator': '6776baf5c7c6e518aae88072'
     *   }
     * ]
 */
    sellOfferBondsGetLastN(
        limit ?: number,
        config ?: never,
    ): Promise<modelTypes.SellOfferBondsModels['Read'][]>
sellOfferBondsGetLastN<Config extends RequestConfigRead<modelTypes.SellOfferBondsModels['Read']>>(
    limit ?: number,
    config ?: Config,
): Promise<MaybePaginated<modelTypes.SellOfferBondsModels['Read'][], Config>>,
    /** Allow to get the first ressources by creation date
     * @example
     * [
     *   {
     *     'investmentType': 'rndmString',
     *     'status': 'active',
     *     'investment': '6776baf5c7c6e518aae88072',
     *     'investmentProject': '6776baf5c7c6e518aae88072',
     *     'pricePerShare': 2.12,
     *     'currency': 'bangkEuro',
     *     'nbShares': 2.12,
     *     'transaction': '6776baf5c7c6e518aae88072',
     *     'validUntil': 'Fri Jan 03 2012 13:13:25 GMT+0100 (Central European Standard Time)',
     *     '_id': '6776baf5c7c6e518aae88071',
     *     'creationDate': 'Fri Jan 03 2012 13:13:25 GMT+0100 (Central European Standard Time)',
     *     'creator': '6776baf5c7c6e518aae88072'
     *   },
     *   {
     *     'investmentType': 'rndmString',
     *     'status': 'active',
     *     'investment': '6776baf5c7c6e518aae88072',
     *     'investmentProject': '6776baf5c7c6e518aae88072',
     *     'pricePerShare': 2.12,
     *     'currency': 'bangkEuro',
     *     'nbShares': 2.12,
     *     'transaction': '6776baf5c7c6e518aae88072',
     *     'validUntil': 'Fri Jan 03 2012 13:13:25 GMT+0100 (Central European Standard Time)',
     *     '_id': '6776baf5c7c6e518aae88071',
     *     'creationDate': 'Fri Jan 03 2012 13:13:25 GMT+0100 (Central European Standard Time)',
     *     'creator': '6776baf5c7c6e518aae88072'
     *   }
     * ]
 */
    sellOfferBondsGetFirstN(
        limit ?: number,
        config ?: never
    ): Promise<modelTypes.SellOfferBondsModels['Read'][]>
sellOfferBondsGetFirstN<Config extends RequestConfigRead<modelTypes.SellOfferBondsModels['Read']>>(
    limit ?: number,
    config ?: Config
): Promise<MaybePaginated<modelTypes.SellOfferBondsModels['Read'][], Config>>,
    /** Count the number of ressources matching the filter in first param or all ressources if no filter is provided
     * @example
     * 12
 */
    sellOfferBondsCount(
        filter ?: AsFilter<modelTypes.SellOfferBondsModels['Write']>
    ): Promise<number>,
        /** Allow to get a ressource by it's unique mongoDb _id
         * @errorCodes
         * - 404: ressourceDoesNotExists
         * @example
         * {
         *   'investmentType': 'rndmString',
         *   'status': 'active',
         *   'investment': '6776baf5c7c6e518aae88072',
         *   'investmentProject': '6776baf5c7c6e518aae88072',
         *   'pricePerShare': 2.12,
         *   'currency': 'bangkEuro',
         *   'nbShares': 2.12,
         *   'transaction': '6776baf5c7c6e518aae88072',
         *   'validUntil': 'Fri Jan 03 2012 13:13:25 GMT+0100 (Central European Standard Time)',
         *   '_id': '6776baf5c7c6e518aae88071',
         *   'creationDate': 'Fri Jan 03 2012 13:13:25 GMT+0100 (Central European Standard Time)',
         *   'creator': '6776baf5c7c6e518aae88072'
         * }
     */
        sellOfferBondsGetById<Config extends RequestConfigGetOne<modelTypes.SellOfferBondsModels['Read']>>(
            id: string,
            config ?: Config
        ): Promise<Config['triggerErrorIfNotSet'] extends true ? modelTypes.SellOfferBondsModels['Read'] : modelTypes.SellOfferBondsModels['Read'] | undefined>,
            /** Allow to get a ressource with providing a filter as first param
             * @example
             * {
             *   'investmentType': 'rndmString',
             *   'status': 'active',
             *   'investment': '6776baf5c7c6e518aae88072',
             *   'investmentProject': '6776baf5c7c6e518aae88072',
             *   'pricePerShare': 2.12,
             *   'currency': 'bangkEuro',
             *   'nbShares': 2.12,
             *   'transaction': '6776baf5c7c6e518aae88072',
             *   'validUntil': 'Fri Jan 03 2012 13:13:25 GMT+0100 (Central European Standard Time)',
             *   '_id': '6776baf5c7c6e518aae88071',
             *   'creationDate': 'Fri Jan 03 2012 13:13:25 GMT+0100 (Central European Standard Time)',
             *   'creator': '6776baf5c7c6e518aae88072'
             * }
         */
            sellOfferBondsGetOne<Config extends Omit<RequestConfigGetOne<modelTypes.SellOfferBondsModels['Read']>, 'filter'>>(
                filter ?: AsFilter<modelTypes.SellOfferBondsModels['Write']>, // WRITE HERE because it will ensure referenced fields are passed as their string counterpart
                config ?: Config
            ): Promise<Config['triggerErrorIfNotSet'] extends true ? modelTypes.SellOfferBondsModels['Read'] : modelTypes.SellOfferBondsModels['Read'] | undefined>,
                /** Allow to get all ressources with providing a filter as first param
                 * @example
                 * [
                 *   {
                 *     'investmentType': 'rndmString',
                 *     'status': 'active',
                 *     'investment': '6776baf5c7c6e518aae88072',
                 *     'investmentProject': '6776baf5c7c6e518aae88072',
                 *     'pricePerShare': 2.12,
                 *     'currency': 'bangkEuro',
                 *     'nbShares': 2.12,
                 *     'transaction': '6776baf5c7c6e518aae88072',
                 *     'validUntil': 'Fri Jan 03 2012 13:13:25 GMT+0100 (Central European Standard Time)',
                 *     '_id': '6776baf5c7c6e518aae88071',
                 *     'creationDate': 'Fri Jan 03 2012 13:13:25 GMT+0100 (Central European Standard Time)',
                 *     'creator': '6776baf5c7c6e518aae88072'
                 *   },
                 *   {
                 *     'investmentType': 'rndmString',
                 *     'status': 'active',
                 *     'investment': '6776baf5c7c6e518aae88072',
                 *     'investmentProject': '6776baf5c7c6e518aae88072',
                 *     'pricePerShare': 2.12,
                 *     'currency': 'bangkEuro',
                 *     'nbShares': 2.12,
                 *     'transaction': '6776baf5c7c6e518aae88072',
                 *     'validUntil': 'Fri Jan 03 2012 13:13:25 GMT+0100 (Central European Standard Time)',
                 *     '_id': '6776baf5c7c6e518aae88071',
                 *     'creationDate': 'Fri Jan 03 2012 13:13:25 GMT+0100 (Central European Standard Time)',
                 *     'creator': '6776baf5c7c6e518aae88072'
                 *   }
                 * ]
             */
                sellOfferEquityGetAll(
                    filter ?: AsFilter<modelTypes.SellOfferEquityModels['Write']>,
                    config ?: never
                ): Promise<modelTypes.SellOfferEquityModels['Read'][]>
sellOfferEquityGetAll<Config extends Omit<RequestConfigRead<modelTypes.SellOfferEquityModels['Read']>, 'filter'>>(
    filter ?: AsFilter<modelTypes.SellOfferEquityModels['Write']>,
    config ?: Config
): Promise<MaybePaginated<modelTypes.SellOfferEquityModels['Read'][], Config>>,
    /** Allow to get the last ressources by creation date
     * @example
     * [
     *   {
     *     'investmentType': 'rndmString',
     *     'status': 'active',
     *     'investment': '6776baf5c7c6e518aae88072',
     *     'investmentProject': '6776baf5c7c6e518aae88072',
     *     'pricePerShare': 2.12,
     *     'currency': 'bangkEuro',
     *     'nbShares': 2.12,
     *     'transaction': '6776baf5c7c6e518aae88072',
     *     'validUntil': 'Fri Jan 03 2012 13:13:25 GMT+0100 (Central European Standard Time)',
     *     '_id': '6776baf5c7c6e518aae88071',
     *     'creationDate': 'Fri Jan 03 2012 13:13:25 GMT+0100 (Central European Standard Time)',
     *     'creator': '6776baf5c7c6e518aae88072'
     *   },
     *   {
     *     'investmentType': 'rndmString',
     *     'status': 'active',
     *     'investment': '6776baf5c7c6e518aae88072',
     *     'investmentProject': '6776baf5c7c6e518aae88072',
     *     'pricePerShare': 2.12,
     *     'currency': 'bangkEuro',
     *     'nbShares': 2.12,
     *     'transaction': '6776baf5c7c6e518aae88072',
     *     'validUntil': 'Fri Jan 03 2012 13:13:25 GMT+0100 (Central European Standard Time)',
     *     '_id': '6776baf5c7c6e518aae88071',
     *     'creationDate': 'Fri Jan 03 2012 13:13:25 GMT+0100 (Central European Standard Time)',
     *     'creator': '6776baf5c7c6e518aae88072'
     *   }
     * ]
 */
    sellOfferEquityGetLastN(
        limit ?: number,
        config ?: never,
    ): Promise<modelTypes.SellOfferEquityModels['Read'][]>
sellOfferEquityGetLastN<Config extends RequestConfigRead<modelTypes.SellOfferEquityModels['Read']>>(
    limit ?: number,
    config ?: Config,
): Promise<MaybePaginated<modelTypes.SellOfferEquityModels['Read'][], Config>>,
    /** Allow to get the first ressources by creation date
     * @example
     * [
     *   {
     *     'investmentType': 'rndmString',
     *     'status': 'active',
     *     'investment': '6776baf5c7c6e518aae88072',
     *     'investmentProject': '6776baf5c7c6e518aae88072',
     *     'pricePerShare': 2.12,
     *     'currency': 'bangkEuro',
     *     'nbShares': 2.12,
     *     'transaction': '6776baf5c7c6e518aae88072',
     *     'validUntil': 'Fri Jan 03 2012 13:13:25 GMT+0100 (Central European Standard Time)',
     *     '_id': '6776baf5c7c6e518aae88071',
     *     'creationDate': 'Fri Jan 03 2012 13:13:25 GMT+0100 (Central European Standard Time)',
     *     'creator': '6776baf5c7c6e518aae88072'
     *   },
     *   {
     *     'investmentType': 'rndmString',
     *     'status': 'active',
     *     'investment': '6776baf5c7c6e518aae88072',
     *     'investmentProject': '6776baf5c7c6e518aae88072',
     *     'pricePerShare': 2.12,
     *     'currency': 'bangkEuro',
     *     'nbShares': 2.12,
     *     'transaction': '6776baf5c7c6e518aae88072',
     *     'validUntil': 'Fri Jan 03 2012 13:13:25 GMT+0100 (Central European Standard Time)',
     *     '_id': '6776baf5c7c6e518aae88071',
     *     'creationDate': 'Fri Jan 03 2012 13:13:25 GMT+0100 (Central European Standard Time)',
     *     'creator': '6776baf5c7c6e518aae88072'
     *   }
     * ]
 */
    sellOfferEquityGetFirstN(
        limit ?: number,
        config ?: never
    ): Promise<modelTypes.SellOfferEquityModels['Read'][]>
sellOfferEquityGetFirstN<Config extends RequestConfigRead<modelTypes.SellOfferEquityModels['Read']>>(
    limit ?: number,
    config ?: Config
): Promise<MaybePaginated<modelTypes.SellOfferEquityModels['Read'][], Config>>,
    /** Count the number of ressources matching the filter in first param or all ressources if no filter is provided
     * @example
     * 12
 */
    sellOfferEquityCount(
        filter ?: AsFilter<modelTypes.SellOfferEquityModels['Write']>
    ): Promise<number>,
        /** Allow to get a ressource by it's unique mongoDb _id
         * @errorCodes
         * - 404: ressourceDoesNotExists
         * @example
         * {
         *   'investmentType': 'rndmString',
         *   'status': 'active',
         *   'investment': '6776baf5c7c6e518aae88072',
         *   'investmentProject': '6776baf5c7c6e518aae88072',
         *   'pricePerShare': 2.12,
         *   'currency': 'bangkEuro',
         *   'nbShares': 2.12,
         *   'transaction': '6776baf5c7c6e518aae88072',
         *   'validUntil': 'Fri Jan 03 2012 13:13:25 GMT+0100 (Central European Standard Time)',
         *   '_id': '6776baf5c7c6e518aae88071',
         *   'creationDate': 'Fri Jan 03 2012 13:13:25 GMT+0100 (Central European Standard Time)',
         *   'creator': '6776baf5c7c6e518aae88072'
         * }
     */
        sellOfferEquityGetById<Config extends RequestConfigGetOne<modelTypes.SellOfferEquityModels['Read']>>(
            id: string,
            config ?: Config
        ): Promise<Config['triggerErrorIfNotSet'] extends true ? modelTypes.SellOfferEquityModels['Read'] : modelTypes.SellOfferEquityModels['Read'] | undefined>,
            /** Allow to get a ressource with providing a filter as first param
             * @example
             * {
             *   'investmentType': 'rndmString',
             *   'status': 'active',
             *   'investment': '6776baf5c7c6e518aae88072',
             *   'investmentProject': '6776baf5c7c6e518aae88072',
             *   'pricePerShare': 2.12,
             *   'currency': 'bangkEuro',
             *   'nbShares': 2.12,
             *   'transaction': '6776baf5c7c6e518aae88072',
             *   'validUntil': 'Fri Jan 03 2012 13:13:25 GMT+0100 (Central European Standard Time)',
             *   '_id': '6776baf5c7c6e518aae88071',
             *   'creationDate': 'Fri Jan 03 2012 13:13:25 GMT+0100 (Central European Standard Time)',
             *   'creator': '6776baf5c7c6e518aae88072'
             * }
         */
            sellOfferEquityGetOne<Config extends Omit<RequestConfigGetOne<modelTypes.SellOfferEquityModels['Read']>, 'filter'>>(
                filter ?: AsFilter<modelTypes.SellOfferEquityModels['Write']>, // WRITE HERE because it will ensure referenced fields are passed as their string counterpart
                config ?: Config
            ): Promise<Config['triggerErrorIfNotSet'] extends true ? modelTypes.SellOfferEquityModels['Read'] : modelTypes.SellOfferEquityModels['Read'] | undefined>,
                /** Allow to get all ressources with providing a filter as first param
                 * @example
                 * [
                 *   {
                 *     'investmentType': 'rndmString',
                 *     'status': 'active',
                 *     'investment': '6776baf5c7c6e518aae88072',
                 *     'investmentProject': '6776baf5c7c6e518aae88072',
                 *     'pricePerShare': 2.12,
                 *     'currency': 'bangkEuro',
                 *     'nbShares': 2.12,
                 *     'transaction': '6776baf5c7c6e518aae88072',
                 *     'validUntil': 'Fri Jan 03 2012 13:13:25 GMT+0100 (Central European Standard Time)',
                 *     '_id': '6776baf5c7c6e518aae88071',
                 *     'creationDate': 'Fri Jan 03 2012 13:13:25 GMT+0100 (Central European Standard Time)',
                 *     'creator': '6776baf5c7c6e518aae88072'
                 *   },
                 *   {
                 *     'investmentType': 'rndmString',
                 *     'status': 'active',
                 *     'investment': '6776baf5c7c6e518aae88072',
                 *     'investmentProject': '6776baf5c7c6e518aae88072',
                 *     'pricePerShare': 2.12,
                 *     'currency': 'bangkEuro',
                 *     'nbShares': 2.12,
                 *     'transaction': '6776baf5c7c6e518aae88072',
                 *     'validUntil': 'Fri Jan 03 2012 13:13:25 GMT+0100 (Central European Standard Time)',
                 *     '_id': '6776baf5c7c6e518aae88071',
                 *     'creationDate': 'Fri Jan 03 2012 13:13:25 GMT+0100 (Central European Standard Time)',
                 *     'creator': '6776baf5c7c6e518aae88072'
                 *   }
                 * ]
             */
                sellOfferFundSharesGetAll(
                    filter ?: AsFilter<modelTypes.SellOfferFundSharesModels['Write']>,
                    config ?: never
                ): Promise<modelTypes.SellOfferFundSharesModels['Read'][]>
sellOfferFundSharesGetAll<Config extends Omit<RequestConfigRead<modelTypes.SellOfferFundSharesModels['Read']>, 'filter'>>(
    filter ?: AsFilter<modelTypes.SellOfferFundSharesModels['Write']>,
    config ?: Config
): Promise<MaybePaginated<modelTypes.SellOfferFundSharesModels['Read'][], Config>>,
    /** Allow to get the last ressources by creation date
     * @example
     * [
     *   {
     *     'investmentType': 'rndmString',
     *     'status': 'active',
     *     'investment': '6776baf5c7c6e518aae88072',
     *     'investmentProject': '6776baf5c7c6e518aae88072',
     *     'pricePerShare': 2.12,
     *     'currency': 'bangkEuro',
     *     'nbShares': 2.12,
     *     'transaction': '6776baf5c7c6e518aae88072',
     *     'validUntil': 'Fri Jan 03 2012 13:13:25 GMT+0100 (Central European Standard Time)',
     *     '_id': '6776baf5c7c6e518aae88071',
     *     'creationDate': 'Fri Jan 03 2012 13:13:25 GMT+0100 (Central European Standard Time)',
     *     'creator': '6776baf5c7c6e518aae88072'
     *   },
     *   {
     *     'investmentType': 'rndmString',
     *     'status': 'active',
     *     'investment': '6776baf5c7c6e518aae88072',
     *     'investmentProject': '6776baf5c7c6e518aae88072',
     *     'pricePerShare': 2.12,
     *     'currency': 'bangkEuro',
     *     'nbShares': 2.12,
     *     'transaction': '6776baf5c7c6e518aae88072',
     *     'validUntil': 'Fri Jan 03 2012 13:13:25 GMT+0100 (Central European Standard Time)',
     *     '_id': '6776baf5c7c6e518aae88071',
     *     'creationDate': 'Fri Jan 03 2012 13:13:25 GMT+0100 (Central European Standard Time)',
     *     'creator': '6776baf5c7c6e518aae88072'
     *   }
     * ]
 */
    sellOfferFundSharesGetLastN(
        limit ?: number,
        config ?: never,
    ): Promise<modelTypes.SellOfferFundSharesModels['Read'][]>
sellOfferFundSharesGetLastN<Config extends RequestConfigRead<modelTypes.SellOfferFundSharesModels['Read']>>(
    limit ?: number,
    config ?: Config,
): Promise<MaybePaginated<modelTypes.SellOfferFundSharesModels['Read'][], Config>>,
    /** Allow to get the first ressources by creation date
     * @example
     * [
     *   {
     *     'investmentType': 'rndmString',
     *     'status': 'active',
     *     'investment': '6776baf5c7c6e518aae88072',
     *     'investmentProject': '6776baf5c7c6e518aae88072',
     *     'pricePerShare': 2.12,
     *     'currency': 'bangkEuro',
     *     'nbShares': 2.12,
     *     'transaction': '6776baf5c7c6e518aae88072',
     *     'validUntil': 'Fri Jan 03 2012 13:13:25 GMT+0100 (Central European Standard Time)',
     *     '_id': '6776baf5c7c6e518aae88071',
     *     'creationDate': 'Fri Jan 03 2012 13:13:25 GMT+0100 (Central European Standard Time)',
     *     'creator': '6776baf5c7c6e518aae88072'
     *   },
     *   {
     *     'investmentType': 'rndmString',
     *     'status': 'active',
     *     'investment': '6776baf5c7c6e518aae88072',
     *     'investmentProject': '6776baf5c7c6e518aae88072',
     *     'pricePerShare': 2.12,
     *     'currency': 'bangkEuro',
     *     'nbShares': 2.12,
     *     'transaction': '6776baf5c7c6e518aae88072',
     *     'validUntil': 'Fri Jan 03 2012 13:13:25 GMT+0100 (Central European Standard Time)',
     *     '_id': '6776baf5c7c6e518aae88071',
     *     'creationDate': 'Fri Jan 03 2012 13:13:25 GMT+0100 (Central European Standard Time)',
     *     'creator': '6776baf5c7c6e518aae88072'
     *   }
     * ]
 */
    sellOfferFundSharesGetFirstN(
        limit ?: number,
        config ?: never
    ): Promise<modelTypes.SellOfferFundSharesModels['Read'][]>
sellOfferFundSharesGetFirstN<Config extends RequestConfigRead<modelTypes.SellOfferFundSharesModels['Read']>>(
    limit ?: number,
    config ?: Config
): Promise<MaybePaginated<modelTypes.SellOfferFundSharesModels['Read'][], Config>>,
    /** Count the number of ressources matching the filter in first param or all ressources if no filter is provided
     * @example
     * 12
 */
    sellOfferFundSharesCount(
        filter ?: AsFilter<modelTypes.SellOfferFundSharesModels['Write']>
    ): Promise<number>,
        /** Allow to get a ressource by it's unique mongoDb _id
         * @errorCodes
         * - 404: ressourceDoesNotExists
         * @example
         * {
         *   'investmentType': 'rndmString',
         *   'status': 'active',
         *   'investment': '6776baf5c7c6e518aae88072',
         *   'investmentProject': '6776baf5c7c6e518aae88072',
         *   'pricePerShare': 2.12,
         *   'currency': 'bangkEuro',
         *   'nbShares': 2.12,
         *   'transaction': '6776baf5c7c6e518aae88072',
         *   'validUntil': 'Fri Jan 03 2012 13:13:25 GMT+0100 (Central European Standard Time)',
         *   '_id': '6776baf5c7c6e518aae88071',
         *   'creationDate': 'Fri Jan 03 2012 13:13:25 GMT+0100 (Central European Standard Time)',
         *   'creator': '6776baf5c7c6e518aae88072'
         * }
     */
        sellOfferFundSharesGetById<Config extends RequestConfigGetOne<modelTypes.SellOfferFundSharesModels['Read']>>(
            id: string,
            config ?: Config
        ): Promise<Config['triggerErrorIfNotSet'] extends true ? modelTypes.SellOfferFundSharesModels['Read'] : modelTypes.SellOfferFundSharesModels['Read'] | undefined>,
            /** Allow to get a ressource with providing a filter as first param
             * @example
             * {
             *   'investmentType': 'rndmString',
             *   'status': 'active',
             *   'investment': '6776baf5c7c6e518aae88072',
             *   'investmentProject': '6776baf5c7c6e518aae88072',
             *   'pricePerShare': 2.12,
             *   'currency': 'bangkEuro',
             *   'nbShares': 2.12,
             *   'transaction': '6776baf5c7c6e518aae88072',
             *   'validUntil': 'Fri Jan 03 2012 13:13:25 GMT+0100 (Central European Standard Time)',
             *   '_id': '6776baf5c7c6e518aae88071',
             *   'creationDate': 'Fri Jan 03 2012 13:13:25 GMT+0100 (Central European Standard Time)',
             *   'creator': '6776baf5c7c6e518aae88072'
             * }
         */
            sellOfferFundSharesGetOne<Config extends Omit<RequestConfigGetOne<modelTypes.SellOfferFundSharesModels['Read']>, 'filter'>>(
                filter ?: AsFilter<modelTypes.SellOfferFundSharesModels['Write']>, // WRITE HERE because it will ensure referenced fields are passed as their string counterpart
                config ?: Config
            ): Promise<Config['triggerErrorIfNotSet'] extends true ? modelTypes.SellOfferFundSharesModels['Read'] : modelTypes.SellOfferFundSharesModels['Read'] | undefined>,
                /** Allow to get all ressources with providing a filter as first param
                 * @example
                 * [
                 *   {
                 *     'discriminator': 'rndmString',
                 *     'lockUntil': 'Fri Jan 03 2012 13:13:25 GMT+0100 (Central European Standard Time)',
                 *     'nbWarning': 12,
                 *     'nbBan': 12,
                 *     '_id': '6776baf5c7c6e518aae88071',
                 *     'creationDate': 'Fri Jan 03 2012 13:13:25 GMT+0100 (Central European Standard Time)',
                 *     'lastUpdateDate': 'Fri Jan 03 2012 13:13:25 GMT+0100 (Central European Standard Time)'
                 *   },
                 *   {
                 *     'discriminator': 'rndmString',
                 *     'lockUntil': 'Fri Jan 03 2012 13:13:25 GMT+0100 (Central European Standard Time)',
                 *     'nbWarning': 12,
                 *     'nbBan': 12,
                 *     '_id': '6776baf5c7c6e518aae88071',
                 *     'creationDate': 'Fri Jan 03 2012 13:13:25 GMT+0100 (Central European Standard Time)',
                 *     'lastUpdateDate': 'Fri Jan 03 2012 13:13:25 GMT+0100 (Central European Standard Time)'
                 *   }
                 * ]
             */
                serverBlacklistGetAll(
                    filter ?: AsFilter<modelTypes.ServerBlacklistModels['Write']>,
                    config ?: never
                ): Promise<modelTypes.ServerBlacklistModels['Read'][]>
serverBlacklistGetAll<Config extends Omit<RequestConfigRead<modelTypes.ServerBlacklistModels['Read']>, 'filter'>>(
    filter ?: AsFilter<modelTypes.ServerBlacklistModels['Write']>,
    config ?: Config
): Promise<MaybePaginated<modelTypes.ServerBlacklistModels['Read'][], Config>>,
    /** Allow to get the last ressources by creation date
     * @example
     * [
     *   {
     *     'discriminator': 'rndmString',
     *     'lockUntil': 'Fri Jan 03 2012 13:13:25 GMT+0100 (Central European Standard Time)',
     *     'nbWarning': 12,
     *     'nbBan': 12,
     *     '_id': '6776baf5c7c6e518aae88071',
     *     'creationDate': 'Fri Jan 03 2012 13:13:25 GMT+0100 (Central European Standard Time)',
     *     'lastUpdateDate': 'Fri Jan 03 2012 13:13:25 GMT+0100 (Central European Standard Time)'
     *   },
     *   {
     *     'discriminator': 'rndmString',
     *     'lockUntil': 'Fri Jan 03 2012 13:13:25 GMT+0100 (Central European Standard Time)',
     *     'nbWarning': 12,
     *     'nbBan': 12,
     *     '_id': '6776baf5c7c6e518aae88071',
     *     'creationDate': 'Fri Jan 03 2012 13:13:25 GMT+0100 (Central European Standard Time)',
     *     'lastUpdateDate': 'Fri Jan 03 2012 13:13:25 GMT+0100 (Central European Standard Time)'
     *   }
     * ]
 */
    serverBlacklistGetLastN(
        limit ?: number,
        config ?: never,
    ): Promise<modelTypes.ServerBlacklistModels['Read'][]>
serverBlacklistGetLastN<Config extends RequestConfigRead<modelTypes.ServerBlacklistModels['Read']>>(
    limit ?: number,
    config ?: Config,
): Promise<MaybePaginated<modelTypes.ServerBlacklistModels['Read'][], Config>>,
    /** Allow to get the first ressources by creation date
     * @example
     * [
     *   {
     *     'discriminator': 'rndmString',
     *     'lockUntil': 'Fri Jan 03 2012 13:13:25 GMT+0100 (Central European Standard Time)',
     *     'nbWarning': 12,
     *     'nbBan': 12,
     *     '_id': '6776baf5c7c6e518aae88071',
     *     'creationDate': 'Fri Jan 03 2012 13:13:25 GMT+0100 (Central European Standard Time)',
     *     'lastUpdateDate': 'Fri Jan 03 2012 13:13:25 GMT+0100 (Central European Standard Time)'
     *   },
     *   {
     *     'discriminator': 'rndmString',
     *     'lockUntil': 'Fri Jan 03 2012 13:13:25 GMT+0100 (Central European Standard Time)',
     *     'nbWarning': 12,
     *     'nbBan': 12,
     *     '_id': '6776baf5c7c6e518aae88071',
     *     'creationDate': 'Fri Jan 03 2012 13:13:25 GMT+0100 (Central European Standard Time)',
     *     'lastUpdateDate': 'Fri Jan 03 2012 13:13:25 GMT+0100 (Central European Standard Time)'
     *   }
     * ]
 */
    serverBlacklistGetFirstN(
        limit ?: number,
        config ?: never
    ): Promise<modelTypes.ServerBlacklistModels['Read'][]>
serverBlacklistGetFirstN<Config extends RequestConfigRead<modelTypes.ServerBlacklistModels['Read']>>(
    limit ?: number,
    config ?: Config
): Promise<MaybePaginated<modelTypes.ServerBlacklistModels['Read'][], Config>>,
    /** Count the number of ressources matching the filter in first param or all ressources if no filter is provided
     * @example
     * 12
 */
    serverBlacklistCount(
        filter ?: AsFilter<modelTypes.ServerBlacklistModels['Write']>
    ): Promise<number>,
        /** Allow to get a ressource by it's unique mongoDb _id
         * @errorCodes
         * - 404: ressourceDoesNotExists
         * @example
         * {
         *   'discriminator': 'rndmString',
         *   'lockUntil': 'Fri Jan 03 2012 13:13:25 GMT+0100 (Central European Standard Time)',
         *   'nbWarning': 12,
         *   'nbBan': 12,
         *   '_id': '6776baf5c7c6e518aae88071',
         *   'creationDate': 'Fri Jan 03 2012 13:13:25 GMT+0100 (Central European Standard Time)',
         *   'lastUpdateDate': 'Fri Jan 03 2012 13:13:25 GMT+0100 (Central European Standard Time)'
         * }
     */
        serverBlacklistGetById<Config extends RequestConfigGetOne<modelTypes.ServerBlacklistModels['Read']>>(
            id: string,
            config ?: Config
        ): Promise<Config['triggerErrorIfNotSet'] extends true ? modelTypes.ServerBlacklistModels['Read'] : modelTypes.ServerBlacklistModels['Read'] | undefined>,
            /** Allow to get a ressource with providing a filter as first param
             * @example
             * {
             *   'discriminator': 'rndmString',
             *   'lockUntil': 'Fri Jan 03 2012 13:13:25 GMT+0100 (Central European Standard Time)',
             *   'nbWarning': 12,
             *   'nbBan': 12,
             *   '_id': '6776baf5c7c6e518aae88071',
             *   'creationDate': 'Fri Jan 03 2012 13:13:25 GMT+0100 (Central European Standard Time)',
             *   'lastUpdateDate': 'Fri Jan 03 2012 13:13:25 GMT+0100 (Central European Standard Time)'
             * }
         */
            serverBlacklistGetOne<Config extends Omit<RequestConfigGetOne<modelTypes.ServerBlacklistModels['Read']>, 'filter'>>(
                filter ?: AsFilter<modelTypes.ServerBlacklistModels['Write']>, // WRITE HERE because it will ensure referenced fields are passed as their string counterpart
                config ?: Config
            ): Promise<Config['triggerErrorIfNotSet'] extends true ? modelTypes.ServerBlacklistModels['Read'] : modelTypes.ServerBlacklistModels['Read'] | undefined>,
                /** Allow to get all ressources with providing a filter as first param
                 * @example
                 * [
                 *   {
                 *     'msg': 'rndmString',
                 *     'topic': 'rndmString',
                 *     'deviceId': '6776baf5c7c6e518aae88072',
                 *     'errorId': '6776baf5c7c6e518aae88072',
                 *     '_id': '6776baf5c7c6e518aae88071',
                 *     'creationDate': 'Fri Jan 03 2012 13:13:25 GMT+0100 (Central European Standard Time)',
                 *     'creator': '6776baf5c7c6e518aae88072'
                 *   },
                 *   {
                 *     'msg': 'rndmString',
                 *     'topic': 'rndmString',
                 *     'deviceId': '6776baf5c7c6e518aae88072',
                 *     'errorId': '6776baf5c7c6e518aae88072',
                 *     '_id': '6776baf5c7c6e518aae88071',
                 *     'creationDate': 'Fri Jan 03 2012 13:13:25 GMT+0100 (Central European Standard Time)',
                 *     'creator': '6776baf5c7c6e518aae88072'
                 *   }
                 * ]
             */
                supportMessagesGetAll(
                    filter ?: AsFilter<modelTypes.SupportMessagesModels['Write']>,
                    config ?: never
                ): Promise<modelTypes.SupportMessagesModels['Read'][]>
supportMessagesGetAll<Config extends Omit<RequestConfigRead<modelTypes.SupportMessagesModels['Read']>, 'filter'>>(
    filter ?: AsFilter<modelTypes.SupportMessagesModels['Write']>,
    config ?: Config
): Promise<MaybePaginated<modelTypes.SupportMessagesModels['Read'][], Config>>,
    /** Allow to get the last ressources by creation date
     * @example
     * [
     *   {
     *     'msg': 'rndmString',
     *     'topic': 'rndmString',
     *     'deviceId': '6776baf5c7c6e518aae88072',
     *     'errorId': '6776baf5c7c6e518aae88072',
     *     '_id': '6776baf5c7c6e518aae88071',
     *     'creationDate': 'Fri Jan 03 2012 13:13:25 GMT+0100 (Central European Standard Time)',
     *     'creator': '6776baf5c7c6e518aae88072'
     *   },
     *   {
     *     'msg': 'rndmString',
     *     'topic': 'rndmString',
     *     'deviceId': '6776baf5c7c6e518aae88072',
     *     'errorId': '6776baf5c7c6e518aae88072',
     *     '_id': '6776baf5c7c6e518aae88071',
     *     'creationDate': 'Fri Jan 03 2012 13:13:25 GMT+0100 (Central European Standard Time)',
     *     'creator': '6776baf5c7c6e518aae88072'
     *   }
     * ]
 */
    supportMessagesGetLastN(
        limit ?: number,
        config ?: never,
    ): Promise<modelTypes.SupportMessagesModels['Read'][]>
supportMessagesGetLastN<Config extends RequestConfigRead<modelTypes.SupportMessagesModels['Read']>>(
    limit ?: number,
    config ?: Config,
): Promise<MaybePaginated<modelTypes.SupportMessagesModels['Read'][], Config>>,
    /** Allow to get the first ressources by creation date
     * @example
     * [
     *   {
     *     'msg': 'rndmString',
     *     'topic': 'rndmString',
     *     'deviceId': '6776baf5c7c6e518aae88072',
     *     'errorId': '6776baf5c7c6e518aae88072',
     *     '_id': '6776baf5c7c6e518aae88071',
     *     'creationDate': 'Fri Jan 03 2012 13:13:25 GMT+0100 (Central European Standard Time)',
     *     'creator': '6776baf5c7c6e518aae88072'
     *   },
     *   {
     *     'msg': 'rndmString',
     *     'topic': 'rndmString',
     *     'deviceId': '6776baf5c7c6e518aae88072',
     *     'errorId': '6776baf5c7c6e518aae88072',
     *     '_id': '6776baf5c7c6e518aae88071',
     *     'creationDate': 'Fri Jan 03 2012 13:13:25 GMT+0100 (Central European Standard Time)',
     *     'creator': '6776baf5c7c6e518aae88072'
     *   }
     * ]
 */
    supportMessagesGetFirstN(
        limit ?: number,
        config ?: never
    ): Promise<modelTypes.SupportMessagesModels['Read'][]>
supportMessagesGetFirstN<Config extends RequestConfigRead<modelTypes.SupportMessagesModels['Read']>>(
    limit ?: number,
    config ?: Config
): Promise<MaybePaginated<modelTypes.SupportMessagesModels['Read'][], Config>>,
    /** Count the number of ressources matching the filter in first param or all ressources if no filter is provided
     * @example
     * 12
 */
    supportMessagesCount(
        filter ?: AsFilter<modelTypes.SupportMessagesModels['Write']>
    ): Promise<number>,
        /** Allow to get a ressource by it's unique mongoDb _id
         * @errorCodes
         * - 404: ressourceDoesNotExists
         * @example
         * {
         *   'msg': 'rndmString',
         *   'topic': 'rndmString',
         *   'deviceId': '6776baf5c7c6e518aae88072',
         *   'errorId': '6776baf5c7c6e518aae88072',
         *   '_id': '6776baf5c7c6e518aae88071',
         *   'creationDate': 'Fri Jan 03 2012 13:13:25 GMT+0100 (Central European Standard Time)',
         *   'creator': '6776baf5c7c6e518aae88072'
         * }
     */
        supportMessagesGetById<Config extends RequestConfigGetOne<modelTypes.SupportMessagesModels['Read']>>(
            id: string,
            config ?: Config
        ): Promise<Config['triggerErrorIfNotSet'] extends true ? modelTypes.SupportMessagesModels['Read'] : modelTypes.SupportMessagesModels['Read'] | undefined>,
            /** Allow to get a ressource with providing a filter as first param
             * @example
             * {
             *   'msg': 'rndmString',
             *   'topic': 'rndmString',
             *   'deviceId': '6776baf5c7c6e518aae88072',
             *   'errorId': '6776baf5c7c6e518aae88072',
             *   '_id': '6776baf5c7c6e518aae88071',
             *   'creationDate': 'Fri Jan 03 2012 13:13:25 GMT+0100 (Central European Standard Time)',
             *   'creator': '6776baf5c7c6e518aae88072'
             * }
         */
            supportMessagesGetOne<Config extends Omit<RequestConfigGetOne<modelTypes.SupportMessagesModels['Read']>, 'filter'>>(
                filter ?: AsFilter<modelTypes.SupportMessagesModels['Write']>, // WRITE HERE because it will ensure referenced fields are passed as their string counterpart
                config ?: Config
            ): Promise<Config['triggerErrorIfNotSet'] extends true ? modelTypes.SupportMessagesModels['Read'] : modelTypes.SupportMessagesModels['Read'] | undefined>,
                /** Allow to get all ressources with providing a filter as first param
                 * @example
                 * [
                 *   {
                 *     'label': {
                 *       'fr': 'Bonjour',
                 *       'en': 'Hello'
                 *     }
                 *   },
                 *   {
                 *     'label': {
                 *       'fr': 'Bonjour',
                 *       'en': 'Hello'
                 *     }
                 *   }
                 * ]
             */
                tagGetAll(
                    filter ?: AsFilter<modelTypes.TagModels['Write']>,
                    config ?: never
                ): Promise<modelTypes.TagModels['Read'][]>
tagGetAll<Config extends Omit<RequestConfigRead<modelTypes.TagModels['Read']>, 'filter'>>(
    filter ?: AsFilter<modelTypes.TagModels['Write']>,
    config ?: Config
): Promise<MaybePaginated<modelTypes.TagModels['Read'][], Config>>,
    /** Allow to get the last ressources by creation date
     * @example
     * [
     *   {
     *     'label': {
     *       'fr': 'Bonjour',
     *       'en': 'Hello'
     *     }
     *   },
     *   {
     *     'label': {
     *       'fr': 'Bonjour',
     *       'en': 'Hello'
     *     }
     *   }
     * ]
 */
    tagGetLastN(
        limit ?: number,
        config ?: never,
    ): Promise<modelTypes.TagModels['Read'][]>
tagGetLastN<Config extends RequestConfigRead<modelTypes.TagModels['Read']>>(
    limit ?: number,
    config ?: Config,
): Promise<MaybePaginated<modelTypes.TagModels['Read'][], Config>>,
    /** Allow to get the first ressources by creation date
     * @example
     * [
     *   {
     *     'label': {
     *       'fr': 'Bonjour',
     *       'en': 'Hello'
     *     }
     *   },
     *   {
     *     'label': {
     *       'fr': 'Bonjour',
     *       'en': 'Hello'
     *     }
     *   }
     * ]
 */
    tagGetFirstN(
        limit ?: number,
        config ?: never
    ): Promise<modelTypes.TagModels['Read'][]>
tagGetFirstN<Config extends RequestConfigRead<modelTypes.TagModels['Read']>>(
    limit ?: number,
    config ?: Config
): Promise<MaybePaginated<modelTypes.TagModels['Read'][], Config>>,
    /** Count the number of ressources matching the filter in first param or all ressources if no filter is provided
     * @example
     * 12
 */
    tagCount(
        filter ?: AsFilter<modelTypes.TagModels['Write']>
    ): Promise<number>,
        /** Allow to get a ressource by it's unique mongoDb _id
         * @errorCodes
         * - 404: ressourceDoesNotExists
         * @example
         * {
         *   'label': {
         *     'fr': 'Bonjour',
         *     'en': 'Hello'
         *   }
         * }
     */
        tagGetById<Config extends RequestConfigGetOne<modelTypes.TagModels['Read']>>(
            id: string,
            config ?: Config
        ): Promise<Config['triggerErrorIfNotSet'] extends true ? modelTypes.TagModels['Read'] : modelTypes.TagModels['Read'] | undefined>,
            /** Allow to get a ressource with providing a filter as first param
             * @example
             * {
             *   'label': {
             *     'fr': 'Bonjour',
             *     'en': 'Hello'
             *   }
             * }
         */
            tagGetOne<Config extends Omit<RequestConfigGetOne<modelTypes.TagModels['Read']>, 'filter'>>(
                filter ?: AsFilter<modelTypes.TagModels['Write']>, // WRITE HERE because it will ensure referenced fields are passed as their string counterpart
                config ?: Config
            ): Promise<Config['triggerErrorIfNotSet'] extends true ? modelTypes.TagModels['Read'] : modelTypes.TagModels['Read'] | undefined>,
                /** Allow to get all ressources with providing a filter as first param
                 * @example
                 * [
                 *   {
                 *     'type': 'press',
                 *     'project': 'rndmString',
                 *     'session': 'rndmString',
                 *     'ts': 12,
                 *     'screen': 'rndmString',
                 *     'data': {
                 *       'randomKey': true,
                 *       'nb': 4,
                 *       'info': 'this is untyped'
                 *     },
                 *     'device': '6776baf5c7c6e518aae88072',
                 *     'error': '6776baf5c7c6e518aae88072',
                 *     '_id': '6776baf5c7c6e518aae88071',
                 *     'creator': '6776baf5c7c6e518aae88072'
                 *   },
                 *   {
                 *     'type': 'press',
                 *     'project': 'rndmString',
                 *     'session': 'rndmString',
                 *     'ts': 12,
                 *     'screen': 'rndmString',
                 *     'data': {
                 *       'randomKey': true,
                 *       'nb': 4,
                 *       'info': 'this is untyped'
                 *     },
                 *     'device': '6776baf5c7c6e518aae88072',
                 *     'error': '6776baf5c7c6e518aae88072',
                 *     '_id': '6776baf5c7c6e518aae88071',
                 *     'creator': '6776baf5c7c6e518aae88072'
                 *   }
                 * ]
             */
                trackingDataEventsGetAll(
                    filter ?: AsFilter<modelTypes.TrackingDataEventsModels['Write']>,
                    config ?: never
                ): Promise<modelTypes.TrackingDataEventsModels['Read'][]>
trackingDataEventsGetAll<Config extends Omit<RequestConfigRead<modelTypes.TrackingDataEventsModels['Read']>, 'filter'>>(
    filter ?: AsFilter<modelTypes.TrackingDataEventsModels['Write']>,
    config ?: Config
): Promise<MaybePaginated<modelTypes.TrackingDataEventsModels['Read'][], Config>>,
    /** Allow to get the last ressources by creation date
     * @example
     * [
     *   {
     *     'type': 'press',
     *     'project': 'rndmString',
     *     'session': 'rndmString',
     *     'ts': 12,
     *     'screen': 'rndmString',
     *     'data': {
     *       'randomKey': true,
     *       'nb': 4,
     *       'info': 'this is untyped'
     *     },
     *     'device': '6776baf5c7c6e518aae88072',
     *     'error': '6776baf5c7c6e518aae88072',
     *     '_id': '6776baf5c7c6e518aae88071',
     *     'creator': '6776baf5c7c6e518aae88072'
     *   },
     *   {
     *     'type': 'press',
     *     'project': 'rndmString',
     *     'session': 'rndmString',
     *     'ts': 12,
     *     'screen': 'rndmString',
     *     'data': {
     *       'randomKey': true,
     *       'nb': 4,
     *       'info': 'this is untyped'
     *     },
     *     'device': '6776baf5c7c6e518aae88072',
     *     'error': '6776baf5c7c6e518aae88072',
     *     '_id': '6776baf5c7c6e518aae88071',
     *     'creator': '6776baf5c7c6e518aae88072'
     *   }
     * ]
 */
    trackingDataEventsGetLastN(
        limit ?: number,
        config ?: never,
    ): Promise<modelTypes.TrackingDataEventsModels['Read'][]>
trackingDataEventsGetLastN<Config extends RequestConfigRead<modelTypes.TrackingDataEventsModels['Read']>>(
    limit ?: number,
    config ?: Config,
): Promise<MaybePaginated<modelTypes.TrackingDataEventsModels['Read'][], Config>>,
    /** Allow to get the first ressources by creation date
     * @example
     * [
     *   {
     *     'type': 'press',
     *     'project': 'rndmString',
     *     'session': 'rndmString',
     *     'ts': 12,
     *     'screen': 'rndmString',
     *     'data': {
     *       'randomKey': true,
     *       'nb': 4,
     *       'info': 'this is untyped'
     *     },
     *     'device': '6776baf5c7c6e518aae88072',
     *     'error': '6776baf5c7c6e518aae88072',
     *     '_id': '6776baf5c7c6e518aae88071',
     *     'creator': '6776baf5c7c6e518aae88072'
     *   },
     *   {
     *     'type': 'press',
     *     'project': 'rndmString',
     *     'session': 'rndmString',
     *     'ts': 12,
     *     'screen': 'rndmString',
     *     'data': {
     *       'randomKey': true,
     *       'nb': 4,
     *       'info': 'this is untyped'
     *     },
     *     'device': '6776baf5c7c6e518aae88072',
     *     'error': '6776baf5c7c6e518aae88072',
     *     '_id': '6776baf5c7c6e518aae88071',
     *     'creator': '6776baf5c7c6e518aae88072'
     *   }
     * ]
 */
    trackingDataEventsGetFirstN(
        limit ?: number,
        config ?: never
    ): Promise<modelTypes.TrackingDataEventsModels['Read'][]>
trackingDataEventsGetFirstN<Config extends RequestConfigRead<modelTypes.TrackingDataEventsModels['Read']>>(
    limit ?: number,
    config ?: Config
): Promise<MaybePaginated<modelTypes.TrackingDataEventsModels['Read'][], Config>>,
    /** Count the number of ressources matching the filter in first param or all ressources if no filter is provided
     * @example
     * 12
 */
    trackingDataEventsCount(
        filter ?: AsFilter<modelTypes.TrackingDataEventsModels['Write']>
    ): Promise<number>,
        /** Allow to get a ressource by it's unique mongoDb _id
         * @errorCodes
         * - 404: ressourceDoesNotExists
         * @example
         * {
         *   'type': 'press',
         *   'project': 'rndmString',
         *   'session': 'rndmString',
         *   'ts': 12,
         *   'screen': 'rndmString',
         *   'data': {
         *     'randomKey': true,
         *     'nb': 4,
         *     'info': 'this is untyped'
         *   },
         *   'device': '6776baf5c7c6e518aae88072',
         *   'error': '6776baf5c7c6e518aae88072',
         *   '_id': '6776baf5c7c6e518aae88071',
         *   'creator': '6776baf5c7c6e518aae88072'
         * }
     */
        trackingDataEventsGetById<Config extends RequestConfigGetOne<modelTypes.TrackingDataEventsModels['Read']>>(
            id: string,
            config ?: Config
        ): Promise<Config['triggerErrorIfNotSet'] extends true ? modelTypes.TrackingDataEventsModels['Read'] : modelTypes.TrackingDataEventsModels['Read'] | undefined>,
            /** Allow to get a ressource with providing a filter as first param
             * @example
             * {
             *   'type': 'press',
             *   'project': 'rndmString',
             *   'session': 'rndmString',
             *   'ts': 12,
             *   'screen': 'rndmString',
             *   'data': {
             *     'randomKey': true,
             *     'nb': 4,
             *     'info': 'this is untyped'
             *   },
             *   'device': '6776baf5c7c6e518aae88072',
             *   'error': '6776baf5c7c6e518aae88072',
             *   '_id': '6776baf5c7c6e518aae88071',
             *   'creator': '6776baf5c7c6e518aae88072'
             * }
         */
            trackingDataEventsGetOne<Config extends Omit<RequestConfigGetOne<modelTypes.TrackingDataEventsModels['Read']>, 'filter'>>(
                filter ?: AsFilter<modelTypes.TrackingDataEventsModels['Write']>, // WRITE HERE because it will ensure referenced fields are passed as their string counterpart
                config ?: Config
            ): Promise<Config['triggerErrorIfNotSet'] extends true ? modelTypes.TrackingDataEventsModels['Read'] : modelTypes.TrackingDataEventsModels['Read'] | undefined>,
                /** Allow to get all ressources with providing a filter as first param
                 * @example
                 * [
                 *   {
                 *     'sessionStart': 12,
                 *     'sessionEnd': 12,
                 *     'utmCampaign': '6776baf5c7c6e518aae88072',
                 *     'device': '6776baf5c7c6e518aae88072',
                 *     '_id': '6776baf5c7c6e518aae88071',
                 *     'creator': '6776baf5c7c6e518aae88072'
                 *   },
                 *   {
                 *     'sessionStart': 12,
                 *     'sessionEnd': 12,
                 *     'utmCampaign': '6776baf5c7c6e518aae88072',
                 *     'device': '6776baf5c7c6e518aae88072',
                 *     '_id': '6776baf5c7c6e518aae88071',
                 *     'creator': '6776baf5c7c6e518aae88072'
                 *   }
                 * ]
             */
                trackingDataSessionGetAll(
                    filter ?: AsFilter<modelTypes.TrackingDataSessionModels['Write']>,
                    config ?: never
                ): Promise<modelTypes.TrackingDataSessionModels['Read'][]>
trackingDataSessionGetAll<Config extends Omit<RequestConfigRead<modelTypes.TrackingDataSessionModels['Read']>, 'filter'>>(
    filter ?: AsFilter<modelTypes.TrackingDataSessionModels['Write']>,
    config ?: Config
): Promise<MaybePaginated<modelTypes.TrackingDataSessionModels['Read'][], Config>>,
    /** Allow to get the last ressources by creation date
     * @example
     * [
     *   {
     *     'sessionStart': 12,
     *     'sessionEnd': 12,
     *     'utmCampaign': '6776baf5c7c6e518aae88072',
     *     'device': '6776baf5c7c6e518aae88072',
     *     '_id': '6776baf5c7c6e518aae88071',
     *     'creator': '6776baf5c7c6e518aae88072'
     *   },
     *   {
     *     'sessionStart': 12,
     *     'sessionEnd': 12,
     *     'utmCampaign': '6776baf5c7c6e518aae88072',
     *     'device': '6776baf5c7c6e518aae88072',
     *     '_id': '6776baf5c7c6e518aae88071',
     *     'creator': '6776baf5c7c6e518aae88072'
     *   }
     * ]
 */
    trackingDataSessionGetLastN(
        limit ?: number,
        config ?: never,
    ): Promise<modelTypes.TrackingDataSessionModels['Read'][]>
trackingDataSessionGetLastN<Config extends RequestConfigRead<modelTypes.TrackingDataSessionModels['Read']>>(
    limit ?: number,
    config ?: Config,
): Promise<MaybePaginated<modelTypes.TrackingDataSessionModels['Read'][], Config>>,
    /** Allow to get the first ressources by creation date
     * @example
     * [
     *   {
     *     'sessionStart': 12,
     *     'sessionEnd': 12,
     *     'utmCampaign': '6776baf5c7c6e518aae88072',
     *     'device': '6776baf5c7c6e518aae88072',
     *     '_id': '6776baf5c7c6e518aae88071',
     *     'creator': '6776baf5c7c6e518aae88072'
     *   },
     *   {
     *     'sessionStart': 12,
     *     'sessionEnd': 12,
     *     'utmCampaign': '6776baf5c7c6e518aae88072',
     *     'device': '6776baf5c7c6e518aae88072',
     *     '_id': '6776baf5c7c6e518aae88071',
     *     'creator': '6776baf5c7c6e518aae88072'
     *   }
     * ]
 */
    trackingDataSessionGetFirstN(
        limit ?: number,
        config ?: never
    ): Promise<modelTypes.TrackingDataSessionModels['Read'][]>
trackingDataSessionGetFirstN<Config extends RequestConfigRead<modelTypes.TrackingDataSessionModels['Read']>>(
    limit ?: number,
    config ?: Config
): Promise<MaybePaginated<modelTypes.TrackingDataSessionModels['Read'][], Config>>,
    /** Count the number of ressources matching the filter in first param or all ressources if no filter is provided
     * @example
     * 12
 */
    trackingDataSessionCount(
        filter ?: AsFilter<modelTypes.TrackingDataSessionModels['Write']>
    ): Promise<number>,
        /** Allow to get a ressource by it's unique mongoDb _id
         * @errorCodes
         * - 404: ressourceDoesNotExists
         * @example
         * {
         *   'sessionStart': 12,
         *   'sessionEnd': 12,
         *   'utmCampaign': '6776baf5c7c6e518aae88072',
         *   'device': '6776baf5c7c6e518aae88072',
         *   '_id': '6776baf5c7c6e518aae88071',
         *   'creator': '6776baf5c7c6e518aae88072'
         * }
     */
        trackingDataSessionGetById<Config extends RequestConfigGetOne<modelTypes.TrackingDataSessionModels['Read']>>(
            id: string,
            config ?: Config
        ): Promise<Config['triggerErrorIfNotSet'] extends true ? modelTypes.TrackingDataSessionModels['Read'] : modelTypes.TrackingDataSessionModels['Read'] | undefined>,
            /** Allow to get a ressource with providing a filter as first param
             * @example
             * {
             *   'sessionStart': 12,
             *   'sessionEnd': 12,
             *   'utmCampaign': '6776baf5c7c6e518aae88072',
             *   'device': '6776baf5c7c6e518aae88072',
             *   '_id': '6776baf5c7c6e518aae88071',
             *   'creator': '6776baf5c7c6e518aae88072'
             * }
         */
            trackingDataSessionGetOne<Config extends Omit<RequestConfigGetOne<modelTypes.TrackingDataSessionModels['Read']>, 'filter'>>(
                filter ?: AsFilter<modelTypes.TrackingDataSessionModels['Write']>, // WRITE HERE because it will ensure referenced fields are passed as their string counterpart
                config ?: Config
            ): Promise<Config['triggerErrorIfNotSet'] extends true ? modelTypes.TrackingDataSessionModels['Read'] : modelTypes.TrackingDataSessionModels['Read'] | undefined>,
                /** Allow to get all ressources with providing a filter as first param
                 * @example
                 * [
                 *   {
                 *     'status': 'unresolved',
                 *     'title': 'rndmString',
                 *     'ipAddress': 'rndmString',
                 *     'applicationVersion': 'rndmString',
                 *     'extraInfos': 'rndmString',
                 *     'stackTrace': 'rndmString',
                 *     'deviceId': '6776baf5c7c6e518aae88072',
                 *     'deviceType': 'tablet',
                 *     '_id': '6776baf5c7c6e518aae88071',
                 *     'creationDate': 'Fri Jan 03 2012 13:13:25 GMT+0100 (Central European Standard Time)',
                 *     'creator': '6776baf5c7c6e518aae88072',
                 *     'lastUpdateDate': 'Fri Jan 03 2012 13:13:25 GMT+0100 (Central European Standard Time)',
                 *     'lastUpdater': '6776baf5c7c6e518aae88072'
                 *   },
                 *   {
                 *     'status': 'unresolved',
                 *     'title': 'rndmString',
                 *     'ipAddress': 'rndmString',
                 *     'applicationVersion': 'rndmString',
                 *     'extraInfos': 'rndmString',
                 *     'stackTrace': 'rndmString',
                 *     'deviceId': '6776baf5c7c6e518aae88072',
                 *     'deviceType': 'tablet',
                 *     '_id': '6776baf5c7c6e518aae88071',
                 *     'creationDate': 'Fri Jan 03 2012 13:13:25 GMT+0100 (Central European Standard Time)',
                 *     'creator': '6776baf5c7c6e518aae88072',
                 *     'lastUpdateDate': 'Fri Jan 03 2012 13:13:25 GMT+0100 (Central European Standard Time)',
                 *     'lastUpdater': '6776baf5c7c6e518aae88072'
                 *   }
                 * ]
             */
                unexpectedthrow error.etAll(
                    filter ?: AsFilter<modelTypes.UnexpectedErrorModels['Write']>,
                    config ?: never
                ): Promise<modelTypes.UnexpectedErrorModels['Read'][]>
unexpectedErrorGetAll<Config extends Omit<RequestConfigRead<modelTypes.UnexpectedErrorModels['Read']>, 'filter'>>(
    filter ?: AsFilter<modelTypes.UnexpectedErrorModels['Write']>,
    config ?: Config
): Promise<MaybePaginated<modelTypes.UnexpectedErrorModels['Read'][], Config>>,
    /** Allow to get the last ressources by creation date
     * @example
     * [
     *   {
     *     'status': 'unresolved',
     *     'title': 'rndmString',
     *     'ipAddress': 'rndmString',
     *     'applicationVersion': 'rndmString',
     *     'extraInfos': 'rndmString',
     *     'stackTrace': 'rndmString',
     *     'deviceId': '6776baf5c7c6e518aae88072',
     *     'deviceType': 'tablet',
     *     '_id': '6776baf5c7c6e518aae88071',
     *     'creationDate': 'Fri Jan 03 2012 13:13:25 GMT+0100 (Central European Standard Time)',
     *     'creator': '6776baf5c7c6e518aae88072',
     *     'lastUpdateDate': 'Fri Jan 03 2012 13:13:25 GMT+0100 (Central European Standard Time)',
     *     'lastUpdater': '6776baf5c7c6e518aae88072'
     *   },
     *   {
     *     'status': 'unresolved',
     *     'title': 'rndmString',
     *     'ipAddress': 'rndmString',
     *     'applicationVersion': 'rndmString',
     *     'extraInfos': 'rndmString',
     *     'stackTrace': 'rndmString',
     *     'deviceId': '6776baf5c7c6e518aae88072',
     *     'deviceType': 'tablet',
     *     '_id': '6776baf5c7c6e518aae88071',
     *     'creationDate': 'Fri Jan 03 2012 13:13:25 GMT+0100 (Central European Standard Time)',
     *     'creator': '6776baf5c7c6e518aae88072',
     *     'lastUpdateDate': 'Fri Jan 03 2012 13:13:25 GMT+0100 (Central European Standard Time)',
     *     'lastUpdater': '6776baf5c7c6e518aae88072'
     *   }
     * ]
 */
    unexpectedthrow error.etLastN(
        limit ?: number,
        config ?: never,
    ): Promise<modelTypes.UnexpectedErrorModels['Read'][]>
unexpectedErrorGetLastN<Config extends RequestConfigRead<modelTypes.UnexpectedErrorModels['Read']>>(
    limit ?: number,
    config ?: Config,
): Promise<MaybePaginated<modelTypes.UnexpectedErrorModels['Read'][], Config>>,
    /** Allow to get the first ressources by creation date
     * @example
     * [
     *   {
     *     'status': 'unresolved',
     *     'title': 'rndmString',
     *     'ipAddress': 'rndmString',
     *     'applicationVersion': 'rndmString',
     *     'extraInfos': 'rndmString',
     *     'stackTrace': 'rndmString',
     *     'deviceId': '6776baf5c7c6e518aae88072',
     *     'deviceType': 'tablet',
     *     '_id': '6776baf5c7c6e518aae88071',
     *     'creationDate': 'Fri Jan 03 2012 13:13:25 GMT+0100 (Central European Standard Time)',
     *     'creator': '6776baf5c7c6e518aae88072',
     *     'lastUpdateDate': 'Fri Jan 03 2012 13:13:25 GMT+0100 (Central European Standard Time)',
     *     'lastUpdater': '6776baf5c7c6e518aae88072'
     *   },
     *   {
     *     'status': 'unresolved',
     *     'title': 'rndmString',
     *     'ipAddress': 'rndmString',
     *     'applicationVersion': 'rndmString',
     *     'extraInfos': 'rndmString',
     *     'stackTrace': 'rndmString',
     *     'deviceId': '6776baf5c7c6e518aae88072',
     *     'deviceType': 'tablet',
     *     '_id': '6776baf5c7c6e518aae88071',
     *     'creationDate': 'Fri Jan 03 2012 13:13:25 GMT+0100 (Central European Standard Time)',
     *     'creator': '6776baf5c7c6e518aae88072',
     *     'lastUpdateDate': 'Fri Jan 03 2012 13:13:25 GMT+0100 (Central European Standard Time)',
     *     'lastUpdater': '6776baf5c7c6e518aae88072'
     *   }
     * ]
 */
    unexpectedthrow error.etFirstN(
        limit ?: number,
        config ?: never
    ): Promise<modelTypes.UnexpectedErrorModels['Read'][]>
unexpectedErrorGetFirstN<Config extends RequestConfigRead<modelTypes.UnexpectedErrorModels['Read']>>(
    limit ?: number,
    config ?: Config
): Promise<MaybePaginated<modelTypes.UnexpectedErrorModels['Read'][], Config>>,
    /** Count the number of ressources matching the filter in first param or all ressources if no filter is provided
     * @example
     * 12
 */
    unexpectedthrow error.ount(
        filter ?: AsFilter<modelTypes.UnexpectedErrorModels['Write']>
    ): Promise<number>,
        /** Allow to get a ressource by it's unique mongoDb _id
         * @errorCodes
         * - 404: ressourceDoesNotExists
         * @example
         * {
         *   'status': 'unresolved',
         *   'title': 'rndmString',
         *   'ipAddress': 'rndmString',
         *   'applicationVersion': 'rndmString',
         *   'extraInfos': 'rndmString',
         *   'stackTrace': 'rndmString',
         *   'deviceId': '6776baf5c7c6e518aae88072',
         *   'deviceType': 'tablet',
         *   '_id': '6776baf5c7c6e518aae88071',
         *   'creationDate': 'Fri Jan 03 2012 13:13:25 GMT+0100 (Central European Standard Time)',
         *   'creator': '6776baf5c7c6e518aae88072',
         *   'lastUpdateDate': 'Fri Jan 03 2012 13:13:25 GMT+0100 (Central European Standard Time)',
         *   'lastUpdater': '6776baf5c7c6e518aae88072'
         * }
     */
        unexpectedErrorGetById<Config extends RequestConfigGetOne<modelTypes.UnexpectedErrorModels['Read']>>(
            id: string,
            config ?: Config
        ): Promise<Config['triggerErrorIfNotSet'] extends true ? modelTypes.UnexpectedErrorModels['Read'] : modelTypes.UnexpectedErrorModels['Read'] | undefined>,
            /** Allow to get a ressource with providing a filter as first param
             * @example
             * {
             *   'status': 'unresolved',
             *   'title': 'rndmString',
             *   'ipAddress': 'rndmString',
             *   'applicationVersion': 'rndmString',
             *   'extraInfos': 'rndmString',
             *   'stackTrace': 'rndmString',
             *   'deviceId': '6776baf5c7c6e518aae88072',
             *   'deviceType': 'tablet',
             *   '_id': '6776baf5c7c6e518aae88071',
             *   'creationDate': 'Fri Jan 03 2012 13:13:25 GMT+0100 (Central European Standard Time)',
             *   'creator': '6776baf5c7c6e518aae88072',
             *   'lastUpdateDate': 'Fri Jan 03 2012 13:13:25 GMT+0100 (Central European Standard Time)',
             *   'lastUpdater': '6776baf5c7c6e518aae88072'
             * }
         */
            unexpectedErrorGetOne<Config extends Omit<RequestConfigGetOne<modelTypes.UnexpectedErrorModels['Read']>, 'filter'>>(
                filter ?: AsFilter<modelTypes.UnexpectedErrorModels['Write']>, // WRITE HERE because it will ensure referenced fields are passed as their string counterpart
                config ?: Config
            ): Promise<Config['triggerErrorIfNotSet'] extends true ? modelTypes.UnexpectedErrorModels['Read'] : modelTypes.UnexpectedErrorModels['Read'] | undefined>,
                /** Allow to get all ressources with providing a filter as first param
                 * @example
                 * [
                 *   {
                 *     'isEmailVerified': true,
                 *     'isPhoneVerified': true,
                 *     'hasPassedKyc': true,
                 *     'isLocked': true,
                 *     'hasAgreedWithTermsAndConditions': true,
                 *     'isDeleted': true,
                 *     'isCompanyRepresentative': true,
                 *     'isFinanceAdmin': true,
                 *     'isComplianceAdmin': true,
                 *     'isAppUser': true,
                 *     'isIcoInvestor': true,
                 *     'isBangkAdmin': true,
                 *     'phonePrefix': 'rndmString',
                 *     'phoneWithPrefix': 'rndmString',
                 *     'email': 'uretreIrrité@gmail.com',
                 *     'newEmail': 'uretreIrrité@gmail.com',
                 *     'password': 'P@ss123!',
                 *     'validationTokens': [
                 *       null,
                 *       null
                 *     ],
                 *     'lastPasswordCompareTime': 'Fri Jan 03 2012 13:13:25 GMT+0100 (Central European Standard Time)',
                 *     'passwordRetrialNb': 12,
                 *     'lockedReason': 'tooMuchPasswordAttempts',
                 *     'lockUntil': 'Fri Jan 03 2012 13:13:25 GMT+0100 (Central European Standard Time)',
                 *     'deleteRequestStatus': 'sent',
                 *     'pinCode': 'P@ss123!',
                 *     'pinCodeRetrialNb': 12,
                 *     'lastPincodeCompareTime': 'Fri Jan 03 2012 13:13:25 GMT+0100 (Central European Standard Time)',
                 *     'biometricAuthToken': 'rndmString',
                 *     'biometricAuthRetrialNb': 12,
                 *     'lastBiometricCompareTime': 'Fri Jan 03 2012 13:13:25 GMT+0100 (Central European Standard Time)',
                 *     '_2FAcode': 'rndmString',
                 *     '_2FAretrialNb': 12,
                 *     'last2FACompareTime': 'Fri Jan 03 2012 13:13:25 GMT+0100 (Central European Standard Time)',
                 *     'kycStatus': 'required',
                 *     'kycLastRequestDate': 'Fri Jan 03 2012 13:13:25 GMT+0100 (Central European Standard Time)',
                 *     'kycUrl': 'rndmString',
                 *     'isDuplicateAccount': true,
                 *     'kycReferences': [
                 *       {
                 *         'date': 'Fri Jan 03 2012 13:13:25 GMT+0100 (Central European Standard Time)',
                 *         'reference': 'rndmString',
                 *         'status': 'required'
                 *       },
                 *       {
                 *         'date': 'Fri Jan 03 2012 13:13:25 GMT+0100 (Central European Standard Time)',
                 *         'reference': 'rndmString',
                 *         'status': 'required'
                 *       }
                 *     ],
                 *     'kycValidator': '6776baf5c7c6e518aae88072',
                 *     'kycRetrialNb': 12,
                 *     'kycDeclinedReasons': [
                 *       'rndmString',
                 *       'rndmString'
                 *     ],
                 *     'hasCompletedDueDiligence': true,
                 *     'dueDiligenceStatus': 'required',
                 *     'dueDiligenceUrl': 'rndmString',
                 *     'dueDiligenceReferences': [
                 *       {
                 *         'date': 'Fri Jan 03 2012 13:13:25 GMT+0100 (Central European Standard Time)',
                 *         'reference': 'rndmString',
                 *         'status': 'required'
                 *       },
                 *       {
                 *         'date': 'Fri Jan 03 2012 13:13:25 GMT+0100 (Central European Standard Time)',
                 *         'reference': 'rndmString',
                 *         'status': 'required'
                 *       }
                 *     ],
                 *     'KYBstatus': 'notConcerned',
                 *     'kycReminderSentNb': 12,
                 *     'kycReminderLastSentAt': 'Fri Jan 03 2012 13:13:25 GMT+0100 (Central European Standard Time)',
                 *     'referralCode': 'rndmString',
                 *     'referralCodeUsed': 'rndmString',
                 *     'referralPageLastView': 'Fri Jan 03 2012 13:13:25 GMT+0100 (Central European Standard Time)',
                 *     'assignedBangkEthWallet': '6776baf5c7c6e518aae88072',
                 *     'assignedBangkSolanaWallet': '6776baf5c7c6e518aae88072',
                 *     'assignedBangkBitcoinWallet': '6776baf5c7c6e518aae88072',
                 *     'assignedBangkPolygonWallet': '6776baf5c7c6e518aae88072',
                 *     'firstName': 'rndmString',
                 *     'middleName': 'rndmString',
                 *     'lastName': 'rndmString',
                 *     'gender': 'M',
                 *     'contactPhoneNumber': 'rndmString',
                 *     'contactPhoneNumberPrefix': 'rndmString',
                 *     'lang': 'fr',
                 *     'currency': 'eur',
                 *     'nationality': 'rndmString',
                 *     'birthDate': '20120101',
                 *     'countryIsoCode': 'rndmString',
                 *     'favoriteCryptos': [
                 *       'bangkEuro',
                 *       'bangkEuro'
                 *     ],
                 *     'hasSubscribedToBangkNewsletter': true,
                 *     'hasSubscribedToBangkOpportunitiesNewsletter': true,
                 *     'hasSubscribedToUserResearchNewsletter': true,
                 *     'hasSentEmailVerificationReminder': true,
                 *     'hasSentReferralProgramReminder': true,
                 *     'company': '6776baf5c7c6e518aae88072',
                 *     'lastBrevoSync': 12,
                 *     '_id': '6776baf5c7c6e518aae88071',
                 *     'creationDate': 'Fri Jan 03 2012 13:13:25 GMT+0100 (Central European Standard Time)',
                 *     'lastUpdateDate': 'Fri Jan 03 2012 13:13:25 GMT+0100 (Central European Standard Time)'
                 *   },
                 *   {
                 *     'isEmailVerified': true,
                 *     'isPhoneVerified': true,
                 *     'hasPassedKyc': true,
                 *     'isLocked': true,
                 *     'hasAgreedWithTermsAndConditions': true,
                 *     'isDeleted': true,
                 *     'isCompanyRepresentative': true,
                 *     'isFinanceAdmin': true,
                 *     'isComplianceAdmin': true,
                 *     'isAppUser': true,
                 *     'isIcoInvestor': true,
                 *     'isBangkAdmin': true,
                 *     'phonePrefix': 'rndmString',
                 *     'phoneWithPrefix': 'rndmString',
                 *     'email': 'uretreIrrité@gmail.com',
                 *     'newEmail': 'uretreIrrité@gmail.com',
                 *     'password': 'P@ss123!',
                 *     'validationTokens': [
                 *       null,
                 *       null
                 *     ],
                 *     'lastPasswordCompareTime': 'Fri Jan 03 2012 13:13:25 GMT+0100 (Central European Standard Time)',
                 *     'passwordRetrialNb': 12,
                 *     'lockedReason': 'tooMuchPasswordAttempts',
                 *     'lockUntil': 'Fri Jan 03 2012 13:13:25 GMT+0100 (Central European Standard Time)',
                 *     'deleteRequestStatus': 'sent',
                 *     'pinCode': 'P@ss123!',
                 *     'pinCodeRetrialNb': 12,
                 *     'lastPincodeCompareTime': 'Fri Jan 03 2012 13:13:25 GMT+0100 (Central European Standard Time)',
                 *     'biometricAuthToken': 'rndmString',
                 *     'biometricAuthRetrialNb': 12,
                 *     'lastBiometricCompareTime': 'Fri Jan 03 2012 13:13:25 GMT+0100 (Central European Standard Time)',
                 *     '_2FAcode': 'rndmString',
                 *     '_2FAretrialNb': 12,
                 *     'last2FACompareTime': 'Fri Jan 03 2012 13:13:25 GMT+0100 (Central European Standard Time)',
                 *     'kycStatus': 'required',
                 *     'kycLastRequestDate': 'Fri Jan 03 2012 13:13:25 GMT+0100 (Central European Standard Time)',
                 *     'kycUrl': 'rndmString',
                 *     'isDuplicateAccount': true,
                 *     'kycReferences': [
                 *       {
                 *         'date': 'Fri Jan 03 2012 13:13:25 GMT+0100 (Central European Standard Time)',
                 *         'reference': 'rndmString',
                 *         'status': 'required'
                 *       },
                 *       {
                 *         'date': 'Fri Jan 03 2012 13:13:25 GMT+0100 (Central European Standard Time)',
                 *         'reference': 'rndmString',
                 *         'status': 'required'
                 *       }
                 *     ],
                 *     'kycValidator': '6776baf5c7c6e518aae88072',
                 *     'kycRetrialNb': 12,
                 *     'kycDeclinedReasons': [
                 *       'rndmString',
                 *       'rndmString'
                 *     ],
                 *     'hasCompletedDueDiligence': true,
                 *     'dueDiligenceStatus': 'required',
                 *     'dueDiligenceUrl': 'rndmString',
                 *     'dueDiligenceReferences': [
                 *       {
                 *         'date': 'Fri Jan 03 2012 13:13:25 GMT+0100 (Central European Standard Time)',
                 *         'reference': 'rndmString',
                 *         'status': 'required'
                 *       },
                 *       {
                 *         'date': 'Fri Jan 03 2012 13:13:25 GMT+0100 (Central European Standard Time)',
                 *         'reference': 'rndmString',
                 *         'status': 'required'
                 *       }
                 *     ],
                 *     'KYBstatus': 'notConcerned',
                 *     'kycReminderSentNb': 12,
                 *     'kycReminderLastSentAt': 'Fri Jan 03 2012 13:13:25 GMT+0100 (Central European Standard Time)',
                 *     'referralCode': 'rndmString',
                 *     'referralCodeUsed': 'rndmString',
                 *     'referralPageLastView': 'Fri Jan 03 2012 13:13:25 GMT+0100 (Central European Standard Time)',
                 *     'assignedBangkEthWallet': '6776baf5c7c6e518aae88072',
                 *     'assignedBangkSolanaWallet': '6776baf5c7c6e518aae88072',
                 *     'assignedBangkBitcoinWallet': '6776baf5c7c6e518aae88072',
                 *     'assignedBangkPolygonWallet': '6776baf5c7c6e518aae88072',
                 *     'firstName': 'rndmString',
                 *     'middleName': 'rndmString',
                 *     'lastName': 'rndmString',
                 *     'gender': 'M',
                 *     'contactPhoneNumber': 'rndmString',
                 *     'contactPhoneNumberPrefix': 'rndmString',
                 *     'lang': 'fr',
                 *     'currency': 'eur',
                 *     'nationality': 'rndmString',
                 *     'birthDate': '20120101',
                 *     'countryIsoCode': 'rndmString',
                 *     'favoriteCryptos': [
                 *       'bangkEuro',
                 *       'bangkEuro'
                 *     ],
                 *     'hasSubscribedToBangkNewsletter': true,
                 *     'hasSubscribedToBangkOpportunitiesNewsletter': true,
                 *     'hasSubscribedToUserResearchNewsletter': true,
                 *     'hasSentEmailVerificationReminder': true,
                 *     'hasSentReferralProgramReminder': true,
                 *     'company': '6776baf5c7c6e518aae88072',
                 *     'lastBrevoSync': 12,
                 *     '_id': '6776baf5c7c6e518aae88071',
                 *     'creationDate': 'Fri Jan 03 2012 13:13:25 GMT+0100 (Central European Standard Time)',
                 *     'lastUpdateDate': 'Fri Jan 03 2012 13:13:25 GMT+0100 (Central European Standard Time)'
                 *   }
                 * ]
             */
                userGetAll(
                    filter ?: AsFilter<modelTypes.UserModels['Write']>,
                    config ?: never
                ): Promise<modelTypes.UserModels['Read'][]>
userGetAll<Config extends Omit<RequestConfigRead<modelTypes.UserModels['Read']>, 'filter'>>(
    filter ?: AsFilter<modelTypes.UserModels['Write']>,
    config ?: Config
): Promise<MaybePaginated<modelTypes.UserModels['Read'][], Config>>,
    /** Allow to get the last ressources by creation date
     * @example
     * [
     *   {
     *     'isEmailVerified': true,
     *     'isPhoneVerified': true,
     *     'hasPassedKyc': true,
     *     'isLocked': true,
     *     'hasAgreedWithTermsAndConditions': true,
     *     'isDeleted': true,
     *     'isCompanyRepresentative': true,
     *     'isFinanceAdmin': true,
     *     'isComplianceAdmin': true,
     *     'isAppUser': true,
     *     'isIcoInvestor': true,
     *     'isBangkAdmin': true,
     *     'phonePrefix': 'rndmString',
     *     'phoneWithPrefix': 'rndmString',
     *     'email': 'uretreIrrité@gmail.com',
     *     'newEmail': 'uretreIrrité@gmail.com',
     *     'password': 'P@ss123!',
     *     'validationTokens': [
     *       null,
     *       null
     *     ],
     *     'lastPasswordCompareTime': 'Fri Jan 03 2012 13:13:25 GMT+0100 (Central European Standard Time)',
     *     'passwordRetrialNb': 12,
     *     'lockedReason': 'tooMuchPasswordAttempts',
     *     'lockUntil': 'Fri Jan 03 2012 13:13:25 GMT+0100 (Central European Standard Time)',
     *     'deleteRequestStatus': 'sent',
     *     'pinCode': 'P@ss123!',
     *     'pinCodeRetrialNb': 12,
     *     'lastPincodeCompareTime': 'Fri Jan 03 2012 13:13:25 GMT+0100 (Central European Standard Time)',
     *     'biometricAuthToken': 'rndmString',
     *     'biometricAuthRetrialNb': 12,
     *     'lastBiometricCompareTime': 'Fri Jan 03 2012 13:13:25 GMT+0100 (Central European Standard Time)',
     *     '_2FAcode': 'rndmString',
     *     '_2FAretrialNb': 12,
     *     'last2FACompareTime': 'Fri Jan 03 2012 13:13:25 GMT+0100 (Central European Standard Time)',
     *     'kycStatus': 'required',
     *     'kycLastRequestDate': 'Fri Jan 03 2012 13:13:25 GMT+0100 (Central European Standard Time)',
     *     'kycUrl': 'rndmString',
     *     'isDuplicateAccount': true,
     *     'kycReferences': [
     *       {
     *         'date': 'Fri Jan 03 2012 13:13:25 GMT+0100 (Central European Standard Time)',
     *         'reference': 'rndmString',
     *         'status': 'required'
     *       },
     *       {
     *         'date': 'Fri Jan 03 2012 13:13:25 GMT+0100 (Central European Standard Time)',
     *         'reference': 'rndmString',
     *         'status': 'required'
     *       }
     *     ],
     *     'kycValidator': '6776baf5c7c6e518aae88072',
     *     'kycRetrialNb': 12,
     *     'kycDeclinedReasons': [
     *       'rndmString',
     *       'rndmString'
     *     ],
     *     'hasCompletedDueDiligence': true,
     *     'dueDiligenceStatus': 'required',
     *     'dueDiligenceUrl': 'rndmString',
     *     'dueDiligenceReferences': [
     *       {
     *         'date': 'Fri Jan 03 2012 13:13:25 GMT+0100 (Central European Standard Time)',
     *         'reference': 'rndmString',
     *         'status': 'required'
     *       },
     *       {
     *         'date': 'Fri Jan 03 2012 13:13:25 GMT+0100 (Central European Standard Time)',
     *         'reference': 'rndmString',
     *         'status': 'required'
     *       }
     *     ],
     *     'KYBstatus': 'notConcerned',
     *     'kycReminderSentNb': 12,
     *     'kycReminderLastSentAt': 'Fri Jan 03 2012 13:13:25 GMT+0100 (Central European Standard Time)',
     *     'referralCode': 'rndmString',
     *     'referralCodeUsed': 'rndmString',
     *     'referralPageLastView': 'Fri Jan 03 2012 13:13:25 GMT+0100 (Central European Standard Time)',
     *     'assignedBangkEthWallet': '6776baf5c7c6e518aae88072',
     *     'assignedBangkSolanaWallet': '6776baf5c7c6e518aae88072',
     *     'assignedBangkBitcoinWallet': '6776baf5c7c6e518aae88072',
     *     'assignedBangkPolygonWallet': '6776baf5c7c6e518aae88072',
     *     'firstName': 'rndmString',
     *     'middleName': 'rndmString',
     *     'lastName': 'rndmString',
     *     'gender': 'M',
     *     'contactPhoneNumber': 'rndmString',
     *     'contactPhoneNumberPrefix': 'rndmString',
     *     'lang': 'fr',
     *     'currency': 'eur',
     *     'nationality': 'rndmString',
     *     'birthDate': '20120101',
     *     'countryIsoCode': 'rndmString',
     *     'favoriteCryptos': [
     *       'bangkEuro',
     *       'bangkEuro'
     *     ],
     *     'hasSubscribedToBangkNewsletter': true,
     *     'hasSubscribedToBangkOpportunitiesNewsletter': true,
     *     'hasSubscribedToUserResearchNewsletter': true,
     *     'hasSentEmailVerificationReminder': true,
     *     'hasSentReferralProgramReminder': true,
     *     'company': '6776baf5c7c6e518aae88072',
     *     'lastBrevoSync': 12,
     *     '_id': '6776baf5c7c6e518aae88071',
     *     'creationDate': 'Fri Jan 03 2012 13:13:25 GMT+0100 (Central European Standard Time)',
     *     'lastUpdateDate': 'Fri Jan 03 2012 13:13:25 GMT+0100 (Central European Standard Time)'
     *   },
     *   {
     *     'isEmailVerified': true,
     *     'isPhoneVerified': true,
     *     'hasPassedKyc': true,
     *     'isLocked': true,
     *     'hasAgreedWithTermsAndConditions': true,
     *     'isDeleted': true,
     *     'isCompanyRepresentative': true,
     *     'isFinanceAdmin': true,
     *     'isComplianceAdmin': true,
     *     'isAppUser': true,
     *     'isIcoInvestor': true,
     *     'isBangkAdmin': true,
     *     'phonePrefix': 'rndmString',
     *     'phoneWithPrefix': 'rndmString',
     *     'email': 'uretreIrrité@gmail.com',
     *     'newEmail': 'uretreIrrité@gmail.com',
     *     'password': 'P@ss123!',
     *     'validationTokens': [
     *       null,
     *       null
     *     ],
     *     'lastPasswordCompareTime': 'Fri Jan 03 2012 13:13:25 GMT+0100 (Central European Standard Time)',
     *     'passwordRetrialNb': 12,
     *     'lockedReason': 'tooMuchPasswordAttempts',
     *     'lockUntil': 'Fri Jan 03 2012 13:13:25 GMT+0100 (Central European Standard Time)',
     *     'deleteRequestStatus': 'sent',
     *     'pinCode': 'P@ss123!',
     *     'pinCodeRetrialNb': 12,
     *     'lastPincodeCompareTime': 'Fri Jan 03 2012 13:13:25 GMT+0100 (Central European Standard Time)',
     *     'biometricAuthToken': 'rndmString',
     *     'biometricAuthRetrialNb': 12,
     *     'lastBiometricCompareTime': 'Fri Jan 03 2012 13:13:25 GMT+0100 (Central European Standard Time)',
     *     '_2FAcode': 'rndmString',
     *     '_2FAretrialNb': 12,
     *     'last2FACompareTime': 'Fri Jan 03 2012 13:13:25 GMT+0100 (Central European Standard Time)',
     *     'kycStatus': 'required',
     *     'kycLastRequestDate': 'Fri Jan 03 2012 13:13:25 GMT+0100 (Central European Standard Time)',
     *     'kycUrl': 'rndmString',
     *     'isDuplicateAccount': true,
     *     'kycReferences': [
     *       {
     *         'date': 'Fri Jan 03 2012 13:13:25 GMT+0100 (Central European Standard Time)',
     *         'reference': 'rndmString',
     *         'status': 'required'
     *       },
     *       {
     *         'date': 'Fri Jan 03 2012 13:13:25 GMT+0100 (Central European Standard Time)',
     *         'reference': 'rndmString',
     *         'status': 'required'
     *       }
     *     ],
     *     'kycValidator': '6776baf5c7c6e518aae88072',
     *     'kycRetrialNb': 12,
     *     'kycDeclinedReasons': [
     *       'rndmString',
     *       'rndmString'
     *     ],
     *     'hasCompletedDueDiligence': true,
     *     'dueDiligenceStatus': 'required',
     *     'dueDiligenceUrl': 'rndmString',
     *     'dueDiligenceReferences': [
     *       {
     *         'date': 'Fri Jan 03 2012 13:13:25 GMT+0100 (Central European Standard Time)',
     *         'reference': 'rndmString',
     *         'status': 'required'
     *       },
     *       {
     *         'date': 'Fri Jan 03 2012 13:13:25 GMT+0100 (Central European Standard Time)',
     *         'reference': 'rndmString',
     *         'status': 'required'
     *       }
     *     ],
     *     'KYBstatus': 'notConcerned',
     *     'kycReminderSentNb': 12,
     *     'kycReminderLastSentAt': 'Fri Jan 03 2012 13:13:25 GMT+0100 (Central European Standard Time)',
     *     'referralCode': 'rndmString',
     *     'referralCodeUsed': 'rndmString',
     *     'referralPageLastView': 'Fri Jan 03 2012 13:13:25 GMT+0100 (Central European Standard Time)',
     *     'assignedBangkEthWallet': '6776baf5c7c6e518aae88072',
     *     'assignedBangkSolanaWallet': '6776baf5c7c6e518aae88072',
     *     'assignedBangkBitcoinWallet': '6776baf5c7c6e518aae88072',
     *     'assignedBangkPolygonWallet': '6776baf5c7c6e518aae88072',
     *     'firstName': 'rndmString',
     *     'middleName': 'rndmString',
     *     'lastName': 'rndmString',
     *     'gender': 'M',
     *     'contactPhoneNumber': 'rndmString',
     *     'contactPhoneNumberPrefix': 'rndmString',
     *     'lang': 'fr',
     *     'currency': 'eur',
     *     'nationality': 'rndmString',
     *     'birthDate': '20120101',
     *     'countryIsoCode': 'rndmString',
     *     'favoriteCryptos': [
     *       'bangkEuro',
     *       'bangkEuro'
     *     ],
     *     'hasSubscribedToBangkNewsletter': true,
     *     'hasSubscribedToBangkOpportunitiesNewsletter': true,
     *     'hasSubscribedToUserResearchNewsletter': true,
     *     'hasSentEmailVerificationReminder': true,
     *     'hasSentReferralProgramReminder': true,
     *     'company': '6776baf5c7c6e518aae88072',
     *     'lastBrevoSync': 12,
     *     '_id': '6776baf5c7c6e518aae88071',
     *     'creationDate': 'Fri Jan 03 2012 13:13:25 GMT+0100 (Central European Standard Time)',
     *     'lastUpdateDate': 'Fri Jan 03 2012 13:13:25 GMT+0100 (Central European Standard Time)'
     *   }
     * ]
 */
    userGetLastN(
        limit ?: number,
        config ?: never,
    ): Promise<modelTypes.UserModels['Read'][]>
userGetLastN<Config extends RequestConfigRead<modelTypes.UserModels['Read']>>(
    limit ?: number,
    config ?: Config,
): Promise<MaybePaginated<modelTypes.UserModels['Read'][], Config>>,
    /** Allow to get the first ressources by creation date
     * @example
     * [
     *   {
     *     'isEmailVerified': true,
     *     'isPhoneVerified': true,
     *     'hasPassedKyc': true,
     *     'isLocked': true,
     *     'hasAgreedWithTermsAndConditions': true,
     *     'isDeleted': true,
     *     'isCompanyRepresentative': true,
     *     'isFinanceAdmin': true,
     *     'isComplianceAdmin': true,
     *     'isAppUser': true,
     *     'isIcoInvestor': true,
     *     'isBangkAdmin': true,
     *     'phonePrefix': 'rndmString',
     *     'phoneWithPrefix': 'rndmString',
     *     'email': 'uretreIrrité@gmail.com',
     *     'newEmail': 'uretreIrrité@gmail.com',
     *     'password': 'P@ss123!',
     *     'validationTokens': [
     *       null,
     *       null
     *     ],
     *     'lastPasswordCompareTime': 'Fri Jan 03 2012 13:13:25 GMT+0100 (Central European Standard Time)',
     *     'passwordRetrialNb': 12,
     *     'lockedReason': 'tooMuchPasswordAttempts',
     *     'lockUntil': 'Fri Jan 03 2012 13:13:25 GMT+0100 (Central European Standard Time)',
     *     'deleteRequestStatus': 'sent',
     *     'pinCode': 'P@ss123!',
     *     'pinCodeRetrialNb': 12,
     *     'lastPincodeCompareTime': 'Fri Jan 03 2012 13:13:25 GMT+0100 (Central European Standard Time)',
     *     'biometricAuthToken': 'rndmString',
     *     'biometricAuthRetrialNb': 12,
     *     'lastBiometricCompareTime': 'Fri Jan 03 2012 13:13:25 GMT+0100 (Central European Standard Time)',
     *     '_2FAcode': 'rndmString',
     *     '_2FAretrialNb': 12,
     *     'last2FACompareTime': 'Fri Jan 03 2012 13:13:25 GMT+0100 (Central European Standard Time)',
     *     'kycStatus': 'required',
     *     'kycLastRequestDate': 'Fri Jan 03 2012 13:13:25 GMT+0100 (Central European Standard Time)',
     *     'kycUrl': 'rndmString',
     *     'isDuplicateAccount': true,
     *     'kycReferences': [
     *       {
     *         'date': 'Fri Jan 03 2012 13:13:25 GMT+0100 (Central European Standard Time)',
     *         'reference': 'rndmString',
     *         'status': 'required'
     *       },
     *       {
     *         'date': 'Fri Jan 03 2012 13:13:25 GMT+0100 (Central European Standard Time)',
     *         'reference': 'rndmString',
     *         'status': 'required'
     *       }
     *     ],
     *     'kycValidator': '6776baf5c7c6e518aae88072',
     *     'kycRetrialNb': 12,
     *     'kycDeclinedReasons': [
     *       'rndmString',
     *       'rndmString'
     *     ],
     *     'hasCompletedDueDiligence': true,
     *     'dueDiligenceStatus': 'required',
     *     'dueDiligenceUrl': 'rndmString',
     *     'dueDiligenceReferences': [
     *       {
     *         'date': 'Fri Jan 03 2012 13:13:25 GMT+0100 (Central European Standard Time)',
     *         'reference': 'rndmString',
     *         'status': 'required'
     *       },
     *       {
     *         'date': 'Fri Jan 03 2012 13:13:25 GMT+0100 (Central European Standard Time)',
     *         'reference': 'rndmString',
     *         'status': 'required'
     *       }
     *     ],
     *     'KYBstatus': 'notConcerned',
     *     'kycReminderSentNb': 12,
     *     'kycReminderLastSentAt': 'Fri Jan 03 2012 13:13:25 GMT+0100 (Central European Standard Time)',
     *     'referralCode': 'rndmString',
     *     'referralCodeUsed': 'rndmString',
     *     'referralPageLastView': 'Fri Jan 03 2012 13:13:25 GMT+0100 (Central European Standard Time)',
     *     'assignedBangkEthWallet': '6776baf5c7c6e518aae88072',
     *     'assignedBangkSolanaWallet': '6776baf5c7c6e518aae88072',
     *     'assignedBangkBitcoinWallet': '6776baf5c7c6e518aae88072',
     *     'assignedBangkPolygonWallet': '6776baf5c7c6e518aae88072',
     *     'firstName': 'rndmString',
     *     'middleName': 'rndmString',
     *     'lastName': 'rndmString',
     *     'gender': 'M',
     *     'contactPhoneNumber': 'rndmString',
     *     'contactPhoneNumberPrefix': 'rndmString',
     *     'lang': 'fr',
     *     'currency': 'eur',
     *     'nationality': 'rndmString',
     *     'birthDate': '20120101',
     *     'countryIsoCode': 'rndmString',
     *     'favoriteCryptos': [
     *       'bangkEuro',
     *       'bangkEuro'
     *     ],
     *     'hasSubscribedToBangkNewsletter': true,
     *     'hasSubscribedToBangkOpportunitiesNewsletter': true,
     *     'hasSubscribedToUserResearchNewsletter': true,
     *     'hasSentEmailVerificationReminder': true,
     *     'hasSentReferralProgramReminder': true,
     *     'company': '6776baf5c7c6e518aae88072',
     *     'lastBrevoSync': 12,
     *     '_id': '6776baf5c7c6e518aae88071',
     *     'creationDate': 'Fri Jan 03 2012 13:13:25 GMT+0100 (Central European Standard Time)',
     *     'lastUpdateDate': 'Fri Jan 03 2012 13:13:25 GMT+0100 (Central European Standard Time)'
     *   },
     *   {
     *     'isEmailVerified': true,
     *     'isPhoneVerified': true,
     *     'hasPassedKyc': true,
     *     'isLocked': true,
     *     'hasAgreedWithTermsAndConditions': true,
     *     'isDeleted': true,
     *     'isCompanyRepresentative': true,
     *     'isFinanceAdmin': true,
     *     'isComplianceAdmin': true,
     *     'isAppUser': true,
     *     'isIcoInvestor': true,
     *     'isBangkAdmin': true,
     *     'phonePrefix': 'rndmString',
     *     'phoneWithPrefix': 'rndmString',
     *     'email': 'uretreIrrité@gmail.com',
     *     'newEmail': 'uretreIrrité@gmail.com',
     *     'password': 'P@ss123!',
     *     'validationTokens': [
     *       null,
     *       null
     *     ],
     *     'lastPasswordCompareTime': 'Fri Jan 03 2012 13:13:25 GMT+0100 (Central European Standard Time)',
     *     'passwordRetrialNb': 12,
     *     'lockedReason': 'tooMuchPasswordAttempts',
     *     'lockUntil': 'Fri Jan 03 2012 13:13:25 GMT+0100 (Central European Standard Time)',
     *     'deleteRequestStatus': 'sent',
     *     'pinCode': 'P@ss123!',
     *     'pinCodeRetrialNb': 12,
     *     'lastPincodeCompareTime': 'Fri Jan 03 2012 13:13:25 GMT+0100 (Central European Standard Time)',
     *     'biometricAuthToken': 'rndmString',
     *     'biometricAuthRetrialNb': 12,
     *     'lastBiometricCompareTime': 'Fri Jan 03 2012 13:13:25 GMT+0100 (Central European Standard Time)',
     *     '_2FAcode': 'rndmString',
     *     '_2FAretrialNb': 12,
     *     'last2FACompareTime': 'Fri Jan 03 2012 13:13:25 GMT+0100 (Central European Standard Time)',
     *     'kycStatus': 'required',
     *     'kycLastRequestDate': 'Fri Jan 03 2012 13:13:25 GMT+0100 (Central European Standard Time)',
     *     'kycUrl': 'rndmString',
     *     'isDuplicateAccount': true,
     *     'kycReferences': [
     *       {
     *         'date': 'Fri Jan 03 2012 13:13:25 GMT+0100 (Central European Standard Time)',
     *         'reference': 'rndmString',
     *         'status': 'required'
     *       },
     *       {
     *         'date': 'Fri Jan 03 2012 13:13:25 GMT+0100 (Central European Standard Time)',
     *         'reference': 'rndmString',
     *         'status': 'required'
     *       }
     *     ],
     *     'kycValidator': '6776baf5c7c6e518aae88072',
     *     'kycRetrialNb': 12,
     *     'kycDeclinedReasons': [
     *       'rndmString',
     *       'rndmString'
     *     ],
     *     'hasCompletedDueDiligence': true,
     *     'dueDiligenceStatus': 'required',
     *     'dueDiligenceUrl': 'rndmString',
     *     'dueDiligenceReferences': [
     *       {
     *         'date': 'Fri Jan 03 2012 13:13:25 GMT+0100 (Central European Standard Time)',
     *         'reference': 'rndmString',
     *         'status': 'required'
     *       },
     *       {
     *         'date': 'Fri Jan 03 2012 13:13:25 GMT+0100 (Central European Standard Time)',
     *         'reference': 'rndmString',
     *         'status': 'required'
     *       }
     *     ],
     *     'KYBstatus': 'notConcerned',
     *     'kycReminderSentNb': 12,
     *     'kycReminderLastSentAt': 'Fri Jan 03 2012 13:13:25 GMT+0100 (Central European Standard Time)',
     *     'referralCode': 'rndmString',
     *     'referralCodeUsed': 'rndmString',
     *     'referralPageLastView': 'Fri Jan 03 2012 13:13:25 GMT+0100 (Central European Standard Time)',
     *     'assignedBangkEthWallet': '6776baf5c7c6e518aae88072',
     *     'assignedBangkSolanaWallet': '6776baf5c7c6e518aae88072',
     *     'assignedBangkBitcoinWallet': '6776baf5c7c6e518aae88072',
     *     'assignedBangkPolygonWallet': '6776baf5c7c6e518aae88072',
     *     'firstName': 'rndmString',
     *     'middleName': 'rndmString',
     *     'lastName': 'rndmString',
     *     'gender': 'M',
     *     'contactPhoneNumber': 'rndmString',
     *     'contactPhoneNumberPrefix': 'rndmString',
     *     'lang': 'fr',
     *     'currency': 'eur',
     *     'nationality': 'rndmString',
     *     'birthDate': '20120101',
     *     'countryIsoCode': 'rndmString',
     *     'favoriteCryptos': [
     *       'bangkEuro',
     *       'bangkEuro'
     *     ],
     *     'hasSubscribedToBangkNewsletter': true,
     *     'hasSubscribedToBangkOpportunitiesNewsletter': true,
     *     'hasSubscribedToUserResearchNewsletter': true,
     *     'hasSentEmailVerificationReminder': true,
     *     'hasSentReferralProgramReminder': true,
     *     'company': '6776baf5c7c6e518aae88072',
     *     'lastBrevoSync': 12,
     *     '_id': '6776baf5c7c6e518aae88071',
     *     'creationDate': 'Fri Jan 03 2012 13:13:25 GMT+0100 (Central European Standard Time)',
     *     'lastUpdateDate': 'Fri Jan 03 2012 13:13:25 GMT+0100 (Central European Standard Time)'
     *   }
     * ]
 */
    userGetFirstN(
        limit ?: number,
        config ?: never
    ): Promise<modelTypes.UserModels['Read'][]>
userGetFirstN<Config extends RequestConfigRead<modelTypes.UserModels['Read']>>(
    limit ?: number,
    config ?: Config
): Promise<MaybePaginated<modelTypes.UserModels['Read'][], Config>>,
    /** Count the number of ressources matching the filter in first param or all ressources if no filter is provided
     * @example
     * 12
 */
    userCount(
        filter ?: AsFilter<modelTypes.UserModels['Write']>
    ): Promise<number>,
        /** Allow to get a ressource by it's unique mongoDb _id
         * @errorCodes
         * - 404: ressourceDoesNotExists
         * @example
         * {
         *   'isEmailVerified': true,
         *   'isPhoneVerified': true,
         *   'hasPassedKyc': true,
         *   'isLocked': true,
         *   'hasAgreedWithTermsAndConditions': true,
         *   'isDeleted': true,
         *   'isCompanyRepresentative': true,
         *   'isFinanceAdmin': true,
         *   'isComplianceAdmin': true,
         *   'isAppUser': true,
         *   'isIcoInvestor': true,
         *   'isBangkAdmin': true,
         *   'phonePrefix': 'rndmString',
         *   'phoneWithPrefix': 'rndmString',
         *   'email': 'uretreIrrité@gmail.com',
         *   'newEmail': 'uretreIrrité@gmail.com',
         *   'password': 'P@ss123!',
         *   'validationTokens': [
         *     null,
         *     null
         *   ],
         *   'lastPasswordCompareTime': 'Fri Jan 03 2012 13:13:25 GMT+0100 (Central European Standard Time)',
         *   'passwordRetrialNb': 12,
         *   'lockedReason': 'tooMuchPasswordAttempts',
         *   'lockUntil': 'Fri Jan 03 2012 13:13:25 GMT+0100 (Central European Standard Time)',
         *   'deleteRequestStatus': 'sent',
         *   'pinCode': 'P@ss123!',
         *   'pinCodeRetrialNb': 12,
         *   'lastPincodeCompareTime': 'Fri Jan 03 2012 13:13:25 GMT+0100 (Central European Standard Time)',
         *   'biometricAuthToken': 'rndmString',
         *   'biometricAuthRetrialNb': 12,
         *   'lastBiometricCompareTime': 'Fri Jan 03 2012 13:13:25 GMT+0100 (Central European Standard Time)',
         *   '_2FAcode': 'rndmString',
         *   '_2FAretrialNb': 12,
         *   'last2FACompareTime': 'Fri Jan 03 2012 13:13:25 GMT+0100 (Central European Standard Time)',
         *   'kycStatus': 'required',
         *   'kycLastRequestDate': 'Fri Jan 03 2012 13:13:25 GMT+0100 (Central European Standard Time)',
         *   'kycUrl': 'rndmString',
         *   'isDuplicateAccount': true,
         *   'kycReferences': [
         *     {
         *       'date': 'Fri Jan 03 2012 13:13:25 GMT+0100 (Central European Standard Time)',
         *       'reference': 'rndmString',
         *       'status': 'required'
         *     },
         *     {
         *       'date': 'Fri Jan 03 2012 13:13:25 GMT+0100 (Central European Standard Time)',
         *       'reference': 'rndmString',
         *       'status': 'required'
         *     }
         *   ],
         *   'kycValidator': '6776baf5c7c6e518aae88072',
         *   'kycRetrialNb': 12,
         *   'kycDeclinedReasons': [
         *     'rndmString',
         *     'rndmString'
         *   ],
         *   'hasCompletedDueDiligence': true,
         *   'dueDiligenceStatus': 'required',
         *   'dueDiligenceUrl': 'rndmString',
         *   'dueDiligenceReferences': [
         *     {
         *       'date': 'Fri Jan 03 2012 13:13:25 GMT+0100 (Central European Standard Time)',
         *       'reference': 'rndmString',
         *       'status': 'required'
         *     },
         *     {
         *       'date': 'Fri Jan 03 2012 13:13:25 GMT+0100 (Central European Standard Time)',
         *       'reference': 'rndmString',
         *       'status': 'required'
         *     }
         *   ],
         *   'KYBstatus': 'notConcerned',
         *   'kycReminderSentNb': 12,
         *   'kycReminderLastSentAt': 'Fri Jan 03 2012 13:13:25 GMT+0100 (Central European Standard Time)',
         *   'referralCode': 'rndmString',
         *   'referralCodeUsed': 'rndmString',
         *   'referralPageLastView': 'Fri Jan 03 2012 13:13:25 GMT+0100 (Central European Standard Time)',
         *   'assignedBangkEthWallet': '6776baf5c7c6e518aae88072',
         *   'assignedBangkSolanaWallet': '6776baf5c7c6e518aae88072',
         *   'assignedBangkBitcoinWallet': '6776baf5c7c6e518aae88072',
         *   'assignedBangkPolygonWallet': '6776baf5c7c6e518aae88072',
         *   'firstName': 'rndmString',
         *   'middleName': 'rndmString',
         *   'lastName': 'rndmString',
         *   'gender': 'M',
         *   'contactPhoneNumber': 'rndmString',
         *   'contactPhoneNumberPrefix': 'rndmString',
         *   'lang': 'fr',
         *   'currency': 'eur',
         *   'nationality': 'rndmString',
         *   'birthDate': '20120101',
         *   'countryIsoCode': 'rndmString',
         *   'favoriteCryptos': [
         *     'bangkEuro',
         *     'bangkEuro'
         *   ],
         *   'hasSubscribedToBangkNewsletter': true,
         *   'hasSubscribedToBangkOpportunitiesNewsletter': true,
         *   'hasSubscribedToUserResearchNewsletter': true,
         *   'hasSentEmailVerificationReminder': true,
         *   'hasSentReferralProgramReminder': true,
         *   'company': '6776baf5c7c6e518aae88072',
         *   'lastBrevoSync': 12,
         *   '_id': '6776baf5c7c6e518aae88071',
         *   'creationDate': 'Fri Jan 03 2012 13:13:25 GMT+0100 (Central European Standard Time)',
         *   'lastUpdateDate': 'Fri Jan 03 2012 13:13:25 GMT+0100 (Central European Standard Time)'
         * }
     */
        userGetById<Config extends RequestConfigGetOne<modelTypes.UserModels['Read']>>(
            id: string,
            config ?: Config
        ): Promise<Config['triggerErrorIfNotSet'] extends true ? modelTypes.UserModels['Read'] : modelTypes.UserModels['Read'] | undefined>,
            /** Allow to get a ressource with providing a filter as first param
             * @example
             * {
             *   'isEmailVerified': true,
             *   'isPhoneVerified': true,
             *   'hasPassedKyc': true,
             *   'isLocked': true,
             *   'hasAgreedWithTermsAndConditions': true,
             *   'isDeleted': true,
             *   'isCompanyRepresentative': true,
             *   'isFinanceAdmin': true,
             *   'isComplianceAdmin': true,
             *   'isAppUser': true,
             *   'isIcoInvestor': true,
             *   'isBangkAdmin': true,
             *   'phonePrefix': 'rndmString',
             *   'phoneWithPrefix': 'rndmString',
             *   'email': 'uretreIrrité@gmail.com',
             *   'newEmail': 'uretreIrrité@gmail.com',
             *   'password': 'P@ss123!',
             *   'validationTokens': [
             *     null,
             *     null
             *   ],
             *   'lastPasswordCompareTime': 'Fri Jan 03 2012 13:13:25 GMT+0100 (Central European Standard Time)',
             *   'passwordRetrialNb': 12,
             *   'lockedReason': 'tooMuchPasswordAttempts',
             *   'lockUntil': 'Fri Jan 03 2012 13:13:25 GMT+0100 (Central European Standard Time)',
             *   'deleteRequestStatus': 'sent',
             *   'pinCode': 'P@ss123!',
             *   'pinCodeRetrialNb': 12,
             *   'lastPincodeCompareTime': 'Fri Jan 03 2012 13:13:25 GMT+0100 (Central European Standard Time)',
             *   'biometricAuthToken': 'rndmString',
             *   'biometricAuthRetrialNb': 12,
             *   'lastBiometricCompareTime': 'Fri Jan 03 2012 13:13:25 GMT+0100 (Central European Standard Time)',
             *   '_2FAcode': 'rndmString',
             *   '_2FAretrialNb': 12,
             *   'last2FACompareTime': 'Fri Jan 03 2012 13:13:25 GMT+0100 (Central European Standard Time)',
             *   'kycStatus': 'required',
             *   'kycLastRequestDate': 'Fri Jan 03 2012 13:13:25 GMT+0100 (Central European Standard Time)',
             *   'kycUrl': 'rndmString',
             *   'isDuplicateAccount': true,
             *   'kycReferences': [
             *     {
             *       'date': 'Fri Jan 03 2012 13:13:25 GMT+0100 (Central European Standard Time)',
             *       'reference': 'rndmString',
             *       'status': 'required'
             *     },
             *     {
             *       'date': 'Fri Jan 03 2012 13:13:25 GMT+0100 (Central European Standard Time)',
             *       'reference': 'rndmString',
             *       'status': 'required'
             *     }
             *   ],
             *   'kycValidator': '6776baf5c7c6e518aae88072',
             *   'kycRetrialNb': 12,
             *   'kycDeclinedReasons': [
             *     'rndmString',
             *     'rndmString'
             *   ],
             *   'hasCompletedDueDiligence': true,
             *   'dueDiligenceStatus': 'required',
             *   'dueDiligenceUrl': 'rndmString',
             *   'dueDiligenceReferences': [
             *     {
             *       'date': 'Fri Jan 03 2012 13:13:25 GMT+0100 (Central European Standard Time)',
             *       'reference': 'rndmString',
             *       'status': 'required'
             *     },
             *     {
             *       'date': 'Fri Jan 03 2012 13:13:25 GMT+0100 (Central European Standard Time)',
             *       'reference': 'rndmString',
             *       'status': 'required'
             *     }
             *   ],
             *   'KYBstatus': 'notConcerned',
             *   'kycReminderSentNb': 12,
             *   'kycReminderLastSentAt': 'Fri Jan 03 2012 13:13:25 GMT+0100 (Central European Standard Time)',
             *   'referralCode': 'rndmString',
             *   'referralCodeUsed': 'rndmString',
             *   'referralPageLastView': 'Fri Jan 03 2012 13:13:25 GMT+0100 (Central European Standard Time)',
             *   'assignedBangkEthWallet': '6776baf5c7c6e518aae88072',
             *   'assignedBangkSolanaWallet': '6776baf5c7c6e518aae88072',
             *   'assignedBangkBitcoinWallet': '6776baf5c7c6e518aae88072',
             *   'assignedBangkPolygonWallet': '6776baf5c7c6e518aae88072',
             *   'firstName': 'rndmString',
             *   'middleName': 'rndmString',
             *   'lastName': 'rndmString',
             *   'gender': 'M',
             *   'contactPhoneNumber': 'rndmString',
             *   'contactPhoneNumberPrefix': 'rndmString',
             *   'lang': 'fr',
             *   'currency': 'eur',
             *   'nationality': 'rndmString',
             *   'birthDate': '20120101',
             *   'countryIsoCode': 'rndmString',
             *   'favoriteCryptos': [
             *     'bangkEuro',
             *     'bangkEuro'
             *   ],
             *   'hasSubscribedToBangkNewsletter': true,
             *   'hasSubscribedToBangkOpportunitiesNewsletter': true,
             *   'hasSubscribedToUserResearchNewsletter': true,
             *   'hasSentEmailVerificationReminder': true,
             *   'hasSentReferralProgramReminder': true,
             *   'company': '6776baf5c7c6e518aae88072',
             *   'lastBrevoSync': 12,
             *   '_id': '6776baf5c7c6e518aae88071',
             *   'creationDate': 'Fri Jan 03 2012 13:13:25 GMT+0100 (Central European Standard Time)',
             *   'lastUpdateDate': 'Fri Jan 03 2012 13:13:25 GMT+0100 (Central European Standard Time)'
             * }
         */
            userGetOne<Config extends Omit<RequestConfigGetOne<modelTypes.UserModels['Read']>, 'filter'>>(
                filter ?: AsFilter<modelTypes.UserModels['Write']>, // WRITE HERE because it will ensure referenced fields are passed as their string counterpart
                config ?: Config
            ): Promise<Config['triggerErrorIfNotSet'] extends true ? modelTypes.UserModels['Read'] : modelTypes.UserModels['Read'] | undefined>,
                /** Update a given document. An _id should be provided.
             */
                userUpdate<
                    Config extends RequestConfigWrite<modelTypes.UserModels['Write']>
    >(
                        id: string,
                        body: Partial<AsMongooseBody<modelTypes.UserModels['Write']>>,
                        config ?: Config
                    ): Promise<
                        Config['returnDoc'] extends true ? modelTypes.UserModels['Read'] : undefined
                    >,
                        /** Update multiple unique documents. Each document must have an _id field
                         * @errorCodes
                         * - 403: userDoNotHaveThePermission
                     */
                        userUpdateMany<
                            Config extends RequestConfigWrite<modelTypes.UserModels['Write']>
    >(
                                fields: Array<Partial<AsMongooseBody<modelTypes.UserModels['Write']>> & { _id: string }>, // id is provided in the body
                                config ?: Config
                            ): Promise<
                                Config['returnDoc'] extends true ? modelTypes.UserModels['Read'][] : undefined
                            >,
                                /** Update or create document if not existing
                             */
                                userUpsert<Config extends RequestConfigWrite<modelTypes.UserModels['Write']>>(
                                    fields: modelTypes.UserModels['Write'] & { _id?: string },
                                    config ?: Config
                                ): Promise<Config['returnDoc'] extends true ? modelTypes.UserModels['Read'] : string>,
                                    /** Update documents matching the filter in the first param or all documents if filter is not provided
                                     * @errorCodes
                                     * - 403: updateWithFilterNotAllowed
                                 */
                                    userUpdateWithFilter<Config extends RequestConfigWrite<modelTypes.UserModels['Write']>>(
                                        filter: AsFilter<modelTypes.UserModels['Write']>,
                                        fields: Partial<AsMongooseBody<modelTypes.UserModels['Write']>>,
                                        config ?: Config
                                    ): Promise<
                                        Config['returnDoc'] extends true ? modelTypes.UserModels['Read'][] : {
                                            acknowledged: boolean
                                            matchedCount: number
                                            modifiedCount: number
                                            upsertedCount: number
                                            upsertedId: any
                                        }
                                    >,
                                        /** Allow to get all ressources with providing a filter as first param
                                         * @example
                                         * [
                                         *   {
                                         *     'id': 'rndmString',
                                         *     'from': 'rndmString',
                                         *     'fromDescription': 'rndmString',
                                         *     'campaignStartDate': 'Fri Jan 03 2012 13:13:25 GMT+0100 (Central European Standard Time)',
                                         *     'campaignEndDate': 'Fri Jan 03 2012 13:13:25 GMT+0100 (Central European Standard Time)',
                                         *     '_id': '6776baf5c7c6e518aae88071'
                                         *   },
                                         *   {
                                         *     'id': 'rndmString',
                                         *     'from': 'rndmString',
                                         *     'fromDescription': 'rndmString',
                                         *     'campaignStartDate': 'Fri Jan 03 2012 13:13:25 GMT+0100 (Central European Standard Time)',
                                         *     'campaignEndDate': 'Fri Jan 03 2012 13:13:25 GMT+0100 (Central European Standard Time)',
                                         *     '_id': '6776baf5c7c6e518aae88071'
                                         *   }
                                         * ]
                                     */
                                        utmCampaignGetAll(
                                            filter ?: AsFilter<modelTypes.UtmCampaignModels['Write']>,
                                            config ?: never
                                        ): Promise<modelTypes.UtmCampaignModels['Read'][]>
utmCampaignGetAll<Config extends Omit<RequestConfigRead<modelTypes.UtmCampaignModels['Read']>, 'filter'>>(
    filter ?: AsFilter<modelTypes.UtmCampaignModels['Write']>,
    config ?: Config
): Promise<MaybePaginated<modelTypes.UtmCampaignModels['Read'][], Config>>,
    /** Allow to get the last ressources by creation date
     * @example
     * [
     *   {
     *     'id': 'rndmString',
     *     'from': 'rndmString',
     *     'fromDescription': 'rndmString',
     *     'campaignStartDate': 'Fri Jan 03 2012 13:13:25 GMT+0100 (Central European Standard Time)',
     *     'campaignEndDate': 'Fri Jan 03 2012 13:13:25 GMT+0100 (Central European Standard Time)',
     *     '_id': '6776baf5c7c6e518aae88071'
     *   },
     *   {
     *     'id': 'rndmString',
     *     'from': 'rndmString',
     *     'fromDescription': 'rndmString',
     *     'campaignStartDate': 'Fri Jan 03 2012 13:13:25 GMT+0100 (Central European Standard Time)',
     *     'campaignEndDate': 'Fri Jan 03 2012 13:13:25 GMT+0100 (Central European Standard Time)',
     *     '_id': '6776baf5c7c6e518aae88071'
     *   }
     * ]
 */
    utmCampaignGetLastN(
        limit ?: number,
        config ?: never,
    ): Promise<modelTypes.UtmCampaignModels['Read'][]>
utmCampaignGetLastN<Config extends RequestConfigRead<modelTypes.UtmCampaignModels['Read']>>(
    limit ?: number,
    config ?: Config,
): Promise<MaybePaginated<modelTypes.UtmCampaignModels['Read'][], Config>>,
    /** Allow to get the first ressources by creation date
     * @example
     * [
     *   {
     *     'id': 'rndmString',
     *     'from': 'rndmString',
     *     'fromDescription': 'rndmString',
     *     'campaignStartDate': 'Fri Jan 03 2012 13:13:25 GMT+0100 (Central European Standard Time)',
     *     'campaignEndDate': 'Fri Jan 03 2012 13:13:25 GMT+0100 (Central European Standard Time)',
     *     '_id': '6776baf5c7c6e518aae88071'
     *   },
     *   {
     *     'id': 'rndmString',
     *     'from': 'rndmString',
     *     'fromDescription': 'rndmString',
     *     'campaignStartDate': 'Fri Jan 03 2012 13:13:25 GMT+0100 (Central European Standard Time)',
     *     'campaignEndDate': 'Fri Jan 03 2012 13:13:25 GMT+0100 (Central European Standard Time)',
     *     '_id': '6776baf5c7c6e518aae88071'
     *   }
     * ]
 */
    utmCampaignGetFirstN(
        limit ?: number,
        config ?: never
    ): Promise<modelTypes.UtmCampaignModels['Read'][]>
utmCampaignGetFirstN<Config extends RequestConfigRead<modelTypes.UtmCampaignModels['Read']>>(
    limit ?: number,
    config ?: Config
): Promise<MaybePaginated<modelTypes.UtmCampaignModels['Read'][], Config>>,
    /** Count the number of ressources matching the filter in first param or all ressources if no filter is provided
     * @example
     * 12
 */
    utmCampaignCount(
        filter ?: AsFilter<modelTypes.UtmCampaignModels['Write']>
    ): Promise<number>,
        /** Allow to get a ressource by it's unique mongoDb _id
         * @errorCodes
         * - 404: ressourceDoesNotExists
         * @example
         * {
         *   'id': 'rndmString',
         *   'from': 'rndmString',
         *   'fromDescription': 'rndmString',
         *   'campaignStartDate': 'Fri Jan 03 2012 13:13:25 GMT+0100 (Central European Standard Time)',
         *   'campaignEndDate': 'Fri Jan 03 2012 13:13:25 GMT+0100 (Central European Standard Time)',
         *   '_id': '6776baf5c7c6e518aae88071'
         * }
     */
        utmCampaignGetById<Config extends RequestConfigGetOne<modelTypes.UtmCampaignModels['Read']>>(
            id: string,
            config ?: Config
        ): Promise<Config['triggerErrorIfNotSet'] extends true ? modelTypes.UtmCampaignModels['Read'] : modelTypes.UtmCampaignModels['Read'] | undefined>,
            /** Allow to get a ressource with providing a filter as first param
             * @example
             * {
             *   'id': 'rndmString',
             *   'from': 'rndmString',
             *   'fromDescription': 'rndmString',
             *   'campaignStartDate': 'Fri Jan 03 2012 13:13:25 GMT+0100 (Central European Standard Time)',
             *   'campaignEndDate': 'Fri Jan 03 2012 13:13:25 GMT+0100 (Central European Standard Time)',
             *   '_id': '6776baf5c7c6e518aae88071'
             * }
         */
            utmCampaignGetOne<Config extends Omit<RequestConfigGetOne<modelTypes.UtmCampaignModels['Read']>, 'filter'>>(
                filter ?: AsFilter<modelTypes.UtmCampaignModels['Write']>, // WRITE HERE because it will ensure referenced fields are passed as their string counterpart
                config ?: Config
            ): Promise<Config['triggerErrorIfNotSet'] extends true ? modelTypes.UtmCampaignModels['Read'] : modelTypes.UtmCampaignModels['Read'] | undefined>,
                /** Create a new document
             */
                utmCampaignCreate<
                    Config extends RequestConfigWrite<modelTypes.UtmCampaignModels['Write']>,
                    Body extends MaybeArray<modelTypes.UtmCampaignModels['Write']>
    >(
                        body: Body,
                        config ?: Config
                    ): Promise<
                        Config['returnDoc'] extends true ?
                        Body extends any[] ? modelTypes.UtmCampaignModels['Read'][] : modelTypes.UtmCampaignModels['Read'] :
                        Body extends any[] ? string[] : string
                    >,
                        /** Update a given document. An _id should be provided.
                     */
                        utmCampaignUpdate<
                            Config extends RequestConfigWrite<modelTypes.UtmCampaignModels['Write']>
    >(
                                id: string,
                                body: Partial<AsMongooseBody<modelTypes.UtmCampaignModels['Write']>>,
                                config ?: Config
                            ): Promise<
                                Config['returnDoc'] extends true ? modelTypes.UtmCampaignModels['Read'] : undefined
                            >,
                                /** Update multiple unique documents. Each document must have an _id field
                                 * @errorCodes
                                 * - 403: userDoNotHaveThePermission
                             */
                                utmCampaignUpdateMany<
                                    Config extends RequestConfigWrite<modelTypes.UtmCampaignModels['Write']>
    >(
                                        fields: Array<Partial<AsMongooseBody<modelTypes.UtmCampaignModels['Write']>> & { _id: string }>, // id is provided in the body
                                        config ?: Config
                                    ): Promise<
                                        Config['returnDoc'] extends true ? modelTypes.UtmCampaignModels['Read'][] : undefined
                                    >,
                                        /** Update or create document if not existing
                                     */
                                        utmCampaignUpsert<Config extends RequestConfigWrite<modelTypes.UtmCampaignModels['Write']>>(
                                            fields: modelTypes.UtmCampaignModels['Write'] & { _id?: string },
                                            config ?: Config
                                        ): Promise<Config['returnDoc'] extends true ? modelTypes.UtmCampaignModels['Read'] : string>,
                                            /** Update documents matching the filter in the first param or all documents if filter is not provided
                                             * @errorCodes
                                             * - 403: updateWithFilterNotAllowed
                                         */
                                            utmCampaignUpdateWithFilter<Config extends RequestConfigWrite<modelTypes.UtmCampaignModels['Write']>>(
                                                filter: AsFilter<modelTypes.UtmCampaignModels['Write']>,
                                                fields: Partial<AsMongooseBody<modelTypes.UtmCampaignModels['Write']>>,
                                                config ?: Config
                                            ): Promise<
                                                Config['returnDoc'] extends true ? modelTypes.UtmCampaignModels['Read'][] : {
                                                    acknowledged: boolean
                                                    matchedCount: number
                                                    modifiedCount: number
                                                    upsertedCount: number
                                                    upsertedId: any
                                                }
                                            >,
                                                /** Delete a document
                                             */
                                                utmCampaignDelete(
                                                    id: string
                                                ): Promise<void>,
                                                    /** Delete all documents matching a filter
                                                     * @errorCodes
                                                     * - 422: wrongValueForParam - When the filter is an empty object,     * - 403: userDoNotHaveThePermission - When using deleteWithFilter with something else than system permission
                                                 */
                                                    utmCampaignDeleteWithFilter(
                                                        filter: AsFilter<modelTypes.UtmCampaignModels['Write']>
                                                    ): Promise<{ success: true, deletedCount: number, hardDeleted: boolean }>,
                                                        /** Allow to get all ressources with providing a filter as first param
                                                         * @example
                                                         * [
                                                         *   {
                                                         *     'type': 'teamFounder',
                                                         *     'forParticipantsFromPeriod': 289,
                                                         *     'forParticipantsToPeriod': 289,
                                                         *     'vestedForWeeks': 289,
                                                         *     'vestingStartingAtNbWeeksPostListing': 289,
                                                         *     'initialUnvestingPercent': 12,
                                                         *     'weeklyUnvestingPercent': 12,
                                                         *     'lastUnvestingPercent': 12,
                                                         *     '_id': '6776baf5c7c6e518aae88071'
                                                         *   },
                                                         *   {
                                                         *     'type': 'teamFounder',
                                                         *     'forParticipantsFromPeriod': 289,
                                                         *     'forParticipantsToPeriod': 289,
                                                         *     'vestedForWeeks': 289,
                                                         *     'vestingStartingAtNbWeeksPostListing': 289,
                                                         *     'initialUnvestingPercent': 12,
                                                         *     'weeklyUnvestingPercent': 12,
                                                         *     'lastUnvestingPercent': 12,
                                                         *     '_id': '6776baf5c7c6e518aae88071'
                                                         *   }
                                                         * ]
                                                     */
                                                        vestingConfigGetAll(
                                                            filter ?: AsFilter<modelTypes.VestingConfigModels['Write']>,
                                                            config ?: never
                                                        ): Promise<modelTypes.VestingConfigModels['Read'][]>
vestingConfigGetAll<Config extends Omit<RequestConfigRead<modelTypes.VestingConfigModels['Read']>, 'filter'>>(
    filter ?: AsFilter<modelTypes.VestingConfigModels['Write']>,
    config ?: Config
): Promise<MaybePaginated<modelTypes.VestingConfigModels['Read'][], Config>>,
    /** Allow to get the last ressources by creation date
     * @example
     * [
     *   {
     *     'type': 'teamFounder',
     *     'forParticipantsFromPeriod': 289,
     *     'forParticipantsToPeriod': 289,
     *     'vestedForWeeks': 289,
     *     'vestingStartingAtNbWeeksPostListing': 289,
     *     'initialUnvestingPercent': 12,
     *     'weeklyUnvestingPercent': 12,
     *     'lastUnvestingPercent': 12,
     *     '_id': '6776baf5c7c6e518aae88071'
     *   },
     *   {
     *     'type': 'teamFounder',
     *     'forParticipantsFromPeriod': 289,
     *     'forParticipantsToPeriod': 289,
     *     'vestedForWeeks': 289,
     *     'vestingStartingAtNbWeeksPostListing': 289,
     *     'initialUnvestingPercent': 12,
     *     'weeklyUnvestingPercent': 12,
     *     'lastUnvestingPercent': 12,
     *     '_id': '6776baf5c7c6e518aae88071'
     *   }
     * ]
 */
    vestingConfigGetLastN(
        limit ?: number,
        config ?: never,
    ): Promise<modelTypes.VestingConfigModels['Read'][]>
vestingConfigGetLastN<Config extends RequestConfigRead<modelTypes.VestingConfigModels['Read']>>(
    limit ?: number,
    config ?: Config,
): Promise<MaybePaginated<modelTypes.VestingConfigModels['Read'][], Config>>,
    /** Allow to get the first ressources by creation date
     * @example
     * [
     *   {
     *     'type': 'teamFounder',
     *     'forParticipantsFromPeriod': 289,
     *     'forParticipantsToPeriod': 289,
     *     'vestedForWeeks': 289,
     *     'vestingStartingAtNbWeeksPostListing': 289,
     *     'initialUnvestingPercent': 12,
     *     'weeklyUnvestingPercent': 12,
     *     'lastUnvestingPercent': 12,
     *     '_id': '6776baf5c7c6e518aae88071'
     *   },
     *   {
     *     'type': 'teamFounder',
     *     'forParticipantsFromPeriod': 289,
     *     'forParticipantsToPeriod': 289,
     *     'vestedForWeeks': 289,
     *     'vestingStartingAtNbWeeksPostListing': 289,
     *     'initialUnvestingPercent': 12,
     *     'weeklyUnvestingPercent': 12,
     *     'lastUnvestingPercent': 12,
     *     '_id': '6776baf5c7c6e518aae88071'
     *   }
     * ]
 */
    vestingConfigGetFirstN(
        limit ?: number,
        config ?: never
    ): Promise<modelTypes.VestingConfigModels['Read'][]>
vestingConfigGetFirstN<Config extends RequestConfigRead<modelTypes.VestingConfigModels['Read']>>(
    limit ?: number,
    config ?: Config
): Promise<MaybePaginated<modelTypes.VestingConfigModels['Read'][], Config>>,
    /** Count the number of ressources matching the filter in first param or all ressources if no filter is provided
     * @example
     * 12
 */
    vestingConfigCount(
        filter ?: AsFilter<modelTypes.VestingConfigModels['Write']>
    ): Promise<number>,
        /** Allow to get a ressource by it's unique mongoDb _id
         * @errorCodes
         * - 404: ressourceDoesNotExists
         * @example
         * {
         *   'type': 'teamFounder',
         *   'forParticipantsFromPeriod': 289,
         *   'forParticipantsToPeriod': 289,
         *   'vestedForWeeks': 289,
         *   'vestingStartingAtNbWeeksPostListing': 289,
         *   'initialUnvestingPercent': 12,
         *   'weeklyUnvestingPercent': 12,
         *   'lastUnvestingPercent': 12,
         *   '_id': '6776baf5c7c6e518aae88071'
         * }
     */
        vestingConfigGetById<Config extends RequestConfigGetOne<modelTypes.VestingConfigModels['Read']>>(
            id: string,
            config ?: Config
        ): Promise<Config['triggerErrorIfNotSet'] extends true ? modelTypes.VestingConfigModels['Read'] : modelTypes.VestingConfigModels['Read'] | undefined>,
            /** Allow to get a ressource with providing a filter as first param
             * @example
             * {
             *   'type': 'teamFounder',
             *   'forParticipantsFromPeriod': 289,
             *   'forParticipantsToPeriod': 289,
             *   'vestedForWeeks': 289,
             *   'vestingStartingAtNbWeeksPostListing': 289,
             *   'initialUnvestingPercent': 12,
             *   'weeklyUnvestingPercent': 12,
             *   'lastUnvestingPercent': 12,
             *   '_id': '6776baf5c7c6e518aae88071'
             * }
         */
            vestingConfigGetOne<Config extends Omit<RequestConfigGetOne<modelTypes.VestingConfigModels['Read']>, 'filter'>>(
                filter ?: AsFilter<modelTypes.VestingConfigModels['Write']>, // WRITE HERE because it will ensure referenced fields are passed as their string counterpart
                config ?: Config
            ): Promise<Config['triggerErrorIfNotSet'] extends true ? modelTypes.VestingConfigModels['Read'] : modelTypes.VestingConfigModels['Read'] | undefined>,
                /** Allow to get all ressources with providing a filter as first param
                 * @example
                 * [
                 *   {
                 *     'user': '6776baf5c7c6e518aae88072',
                 *     'amount': 12,
                 *     'currency': 'bangkEuro',
                 *     'identityPublicKey': 'rndmString',
                 *     '_id': '6776baf5c7c6e518aae88071',
                 *     'creationDate': 'Fri Jan 03 2012 13:13:25 GMT+0100 (Central European Standard Time)'
                 *   },
                 *   {
                 *     'user': '6776baf5c7c6e518aae88072',
                 *     'amount': 12,
                 *     'currency': 'bangkEuro',
                 *     'identityPublicKey': 'rndmString',
                 *     '_id': '6776baf5c7c6e518aae88071',
                 *     'creationDate': 'Fri Jan 03 2012 13:13:25 GMT+0100 (Central European Standard Time)'
                 *   }
                 * ]
             */
                walletGetAll(
                    filter ?: AsFilter<modelTypes.WalletModels['Write']>,
                    config ?: never
                ): Promise<modelTypes.WalletModels['Read'][]>
walletGetAll<Config extends Omit<RequestConfigRead<modelTypes.WalletModels['Read']>, 'filter'>>(
    filter ?: AsFilter<modelTypes.WalletModels['Write']>,
    config ?: Config
): Promise<MaybePaginated<modelTypes.WalletModels['Read'][], Config>>,
    /** Allow to get the last ressources by creation date
     * @example
     * [
     *   {
     *     'user': '6776baf5c7c6e518aae88072',
     *     'amount': 12,
     *     'currency': 'bangkEuro',
     *     'identityPublicKey': 'rndmString',
     *     '_id': '6776baf5c7c6e518aae88071',
     *     'creationDate': 'Fri Jan 03 2012 13:13:25 GMT+0100 (Central European Standard Time)'
     *   },
     *   {
     *     'user': '6776baf5c7c6e518aae88072',
     *     'amount': 12,
     *     'currency': 'bangkEuro',
     *     'identityPublicKey': 'rndmString',
     *     '_id': '6776baf5c7c6e518aae88071',
     *     'creationDate': 'Fri Jan 03 2012 13:13:25 GMT+0100 (Central European Standard Time)'
     *   }
     * ]
 */
    walletGetLastN(
        limit ?: number,
        config ?: never,
    ): Promise<modelTypes.WalletModels['Read'][]>
walletGetLastN<Config extends RequestConfigRead<modelTypes.WalletModels['Read']>>(
    limit ?: number,
    config ?: Config,
): Promise<MaybePaginated<modelTypes.WalletModels['Read'][], Config>>,
    /** Allow to get the first ressources by creation date
     * @example
     * [
     *   {
     *     'user': '6776baf5c7c6e518aae88072',
     *     'amount': 12,
     *     'currency': 'bangkEuro',
     *     'identityPublicKey': 'rndmString',
     *     '_id': '6776baf5c7c6e518aae88071',
     *     'creationDate': 'Fri Jan 03 2012 13:13:25 GMT+0100 (Central European Standard Time)'
     *   },
     *   {
     *     'user': '6776baf5c7c6e518aae88072',
     *     'amount': 12,
     *     'currency': 'bangkEuro',
     *     'identityPublicKey': 'rndmString',
     *     '_id': '6776baf5c7c6e518aae88071',
     *     'creationDate': 'Fri Jan 03 2012 13:13:25 GMT+0100 (Central European Standard Time)'
     *   }
     * ]
 */
    walletGetFirstN(
        limit ?: number,
        config ?: never
    ): Promise<modelTypes.WalletModels['Read'][]>
walletGetFirstN<Config extends RequestConfigRead<modelTypes.WalletModels['Read']>>(
    limit ?: number,
    config ?: Config
): Promise<MaybePaginated<modelTypes.WalletModels['Read'][], Config>>,
    /** Count the number of ressources matching the filter in first param or all ressources if no filter is provided
     * @example
     * 12
 */
    walletCount(
        filter ?: AsFilter<modelTypes.WalletModels['Write']>
    ): Promise<number>,
        /** Allow to get a ressource by it's unique mongoDb _id
         * @errorCodes
         * - 404: ressourceDoesNotExists
         * @example
         * {
         *   'user': '6776baf5c7c6e518aae88072',
         *   'amount': 12,
         *   'currency': 'bangkEuro',
         *   'identityPublicKey': 'rndmString',
         *   '_id': '6776baf5c7c6e518aae88071',
         *   'creationDate': 'Fri Jan 03 2012 13:13:25 GMT+0100 (Central European Standard Time)'
         * }
     */
        walletGetById<Config extends RequestConfigGetOne<modelTypes.WalletModels['Read']>>(
            id: string,
            config ?: Config
        ): Promise<Config['triggerErrorIfNotSet'] extends true ? modelTypes.WalletModels['Read'] : modelTypes.WalletModels['Read'] | undefined>,
            /** Allow to get a ressource with providing a filter as first param
             * @example
             * {
             *   'user': '6776baf5c7c6e518aae88072',
             *   'amount': 12,
             *   'currency': 'bangkEuro',
             *   'identityPublicKey': 'rndmString',
             *   '_id': '6776baf5c7c6e518aae88071',
             *   'creationDate': 'Fri Jan 03 2012 13:13:25 GMT+0100 (Central European Standard Time)'
             * }
         */
            walletGetOne<Config extends Omit<RequestConfigGetOne<modelTypes.WalletModels['Read']>, 'filter'>>(
                filter ?: AsFilter<modelTypes.WalletModels['Write']>, // WRITE HERE because it will ensure referenced fields are passed as their string counterpart
                config ?: Config
            ): Promise<Config['triggerErrorIfNotSet'] extends true ? modelTypes.WalletModels['Read'] : modelTypes.WalletModels['Read'] | undefined>,
                /** Allow to get all ressources with providing a filter as first param
                 * @example
                 * [
                 *   {
                 *     'source': {
                 *       'user': '6776baf5c7c6e518aae88072',
                 *       'amount': 2.12,
                 *       'wallet': '6776baf5c7c6e518aae88072'
                 *     },
                 *     'target': {
                 *       'user': '6776baf5c7c6e518aae88072',
                 *       'amount': 2.12,
                 *       'wallet': '6776baf5c7c6e518aae88072'
                 *     },
                 *     'status': 'pending',
                 *     'exchangeRateMultiplier': 12,
                 *     'exchangeFeesPercent': 12,
                 *     'exchangeFeesAmount': 12,
                 *     '_id': '6776baf5c7c6e518aae88071',
                 *     'creationDate': 'Fri Jan 03 2012 13:13:25 GMT+0100 (Central European Standard Time)',
                 *     'creator': '6776baf5c7c6e518aae88072',
                 *     'lastUpdateDate': 'Fri Jan 03 2012 13:13:25 GMT+0100 (Central European Standard Time)',
                 *     'lastUpdater': '6776baf5c7c6e518aae88072'
                 *   },
                 *   {
                 *     'source': {
                 *       'user': '6776baf5c7c6e518aae88072',
                 *       'amount': 2.12,
                 *       'wallet': '6776baf5c7c6e518aae88072'
                 *     },
                 *     'target': {
                 *       'user': '6776baf5c7c6e518aae88072',
                 *       'amount': 2.12,
                 *       'wallet': '6776baf5c7c6e518aae88072'
                 *     },
                 *     'status': 'pending',
                 *     'exchangeRateMultiplier': 12,
                 *     'exchangeFeesPercent': 12,
                 *     'exchangeFeesAmount': 12,
                 *     '_id': '6776baf5c7c6e518aae88071',
                 *     'creationDate': 'Fri Jan 03 2012 13:13:25 GMT+0100 (Central European Standard Time)',
                 *     'creator': '6776baf5c7c6e518aae88072',
                 *     'lastUpdateDate': 'Fri Jan 03 2012 13:13:25 GMT+0100 (Central European Standard Time)',
                 *     'lastUpdater': '6776baf5c7c6e518aae88072'
                 *   }
                 * ]
             */
                walletTransferTransactionGetAll(
                    filter ?: AsFilter<modelTypes.WalletTransferTransactionModels['Write']>,
                    config ?: never
                ): Promise<modelTypes.WalletTransferTransactionModels['Read'][]>
walletTransferTransactionGetAll<Config extends Omit<RequestConfigRead<modelTypes.WalletTransferTransactionModels['Read']>, 'filter'>>(
    filter ?: AsFilter<modelTypes.WalletTransferTransactionModels['Write']>,
    config ?: Config
): Promise<MaybePaginated<modelTypes.WalletTransferTransactionModels['Read'][], Config>>,
    /** Allow to get the last ressources by creation date
     * @example
     * [
     *   {
     *     'source': {
     *       'user': '6776baf5c7c6e518aae88072',
     *       'amount': 2.12,
     *       'wallet': '6776baf5c7c6e518aae88072'
     *     },
     *     'target': {
     *       'user': '6776baf5c7c6e518aae88072',
     *       'amount': 2.12,
     *       'wallet': '6776baf5c7c6e518aae88072'
     *     },
     *     'status': 'pending',
     *     'exchangeRateMultiplier': 12,
     *     'exchangeFeesPercent': 12,
     *     'exchangeFeesAmount': 12,
     *     '_id': '6776baf5c7c6e518aae88071',
     *     'creationDate': 'Fri Jan 03 2012 13:13:25 GMT+0100 (Central European Standard Time)',
     *     'creator': '6776baf5c7c6e518aae88072',
     *     'lastUpdateDate': 'Fri Jan 03 2012 13:13:25 GMT+0100 (Central European Standard Time)',
     *     'lastUpdater': '6776baf5c7c6e518aae88072'
     *   },
     *   {
     *     'source': {
     *       'user': '6776baf5c7c6e518aae88072',
     *       'amount': 2.12,
     *       'wallet': '6776baf5c7c6e518aae88072'
     *     },
     *     'target': {
     *       'user': '6776baf5c7c6e518aae88072',
     *       'amount': 2.12,
     *       'wallet': '6776baf5c7c6e518aae88072'
     *     },
     *     'status': 'pending',
     *     'exchangeRateMultiplier': 12,
     *     'exchangeFeesPercent': 12,
     *     'exchangeFeesAmount': 12,
     *     '_id': '6776baf5c7c6e518aae88071',
     *     'creationDate': 'Fri Jan 03 2012 13:13:25 GMT+0100 (Central European Standard Time)',
     *     'creator': '6776baf5c7c6e518aae88072',
     *     'lastUpdateDate': 'Fri Jan 03 2012 13:13:25 GMT+0100 (Central European Standard Time)',
     *     'lastUpdater': '6776baf5c7c6e518aae88072'
     *   }
     * ]
 */
    walletTransferTransactionGetLastN(
        limit ?: number,
        config ?: never,
    ): Promise<modelTypes.WalletTransferTransactionModels['Read'][]>
walletTransferTransactionGetLastN<Config extends RequestConfigRead<modelTypes.WalletTransferTransactionModels['Read']>>(
    limit ?: number,
    config ?: Config,
): Promise<MaybePaginated<modelTypes.WalletTransferTransactionModels['Read'][], Config>>,
    /** Allow to get the first ressources by creation date
     * @example
     * [
     *   {
     *     'source': {
     *       'user': '6776baf5c7c6e518aae88072',
     *       'amount': 2.12,
     *       'wallet': '6776baf5c7c6e518aae88072'
     *     },
     *     'target': {
     *       'user': '6776baf5c7c6e518aae88072',
     *       'amount': 2.12,
     *       'wallet': '6776baf5c7c6e518aae88072'
     *     },
     *     'status': 'pending',
     *     'exchangeRateMultiplier': 12,
     *     'exchangeFeesPercent': 12,
     *     'exchangeFeesAmount': 12,
     *     '_id': '6776baf5c7c6e518aae88071',
     *     'creationDate': 'Fri Jan 03 2012 13:13:25 GMT+0100 (Central European Standard Time)',
     *     'creator': '6776baf5c7c6e518aae88072',
     *     'lastUpdateDate': 'Fri Jan 03 2012 13:13:25 GMT+0100 (Central European Standard Time)',
     *     'lastUpdater': '6776baf5c7c6e518aae88072'
     *   },
     *   {
     *     'source': {
     *       'user': '6776baf5c7c6e518aae88072',
     *       'amount': 2.12,
     *       'wallet': '6776baf5c7c6e518aae88072'
     *     },
     *     'target': {
     *       'user': '6776baf5c7c6e518aae88072',
     *       'amount': 2.12,
     *       'wallet': '6776baf5c7c6e518aae88072'
     *     },
     *     'status': 'pending',
     *     'exchangeRateMultiplier': 12,
     *     'exchangeFeesPercent': 12,
     *     'exchangeFeesAmount': 12,
     *     '_id': '6776baf5c7c6e518aae88071',
     *     'creationDate': 'Fri Jan 03 2012 13:13:25 GMT+0100 (Central European Standard Time)',
     *     'creator': '6776baf5c7c6e518aae88072',
     *     'lastUpdateDate': 'Fri Jan 03 2012 13:13:25 GMT+0100 (Central European Standard Time)',
     *     'lastUpdater': '6776baf5c7c6e518aae88072'
     *   }
     * ]
 */
    walletTransferTransactionGetFirstN(
        limit ?: number,
        config ?: never
    ): Promise<modelTypes.WalletTransferTransactionModels['Read'][]>
walletTransferTransactionGetFirstN<Config extends RequestConfigRead<modelTypes.WalletTransferTransactionModels['Read']>>(
    limit ?: number,
    config ?: Config
): Promise<MaybePaginated<modelTypes.WalletTransferTransactionModels['Read'][], Config>>,
    /** Count the number of ressources matching the filter in first param or all ressources if no filter is provided
     * @example
     * 12
 */
    walletTransferTransactionCount(
        filter ?: AsFilter<modelTypes.WalletTransferTransactionModels['Write']>
    ): Promise<number>,
        /** Allow to get a ressource by it's unique mongoDb _id
         * @errorCodes
         * - 404: ressourceDoesNotExists
         * @example
         * {
         *   'source': {
         *     'user': '6776baf5c7c6e518aae88072',
         *     'amount': 2.12,
         *     'wallet': '6776baf5c7c6e518aae88072'
         *   },
         *   'target': {
         *     'user': '6776baf5c7c6e518aae88072',
         *     'amount': 2.12,
         *     'wallet': '6776baf5c7c6e518aae88072'
         *   },
         *   'status': 'pending',
         *   'exchangeRateMultiplier': 12,
         *   'exchangeFeesPercent': 12,
         *   'exchangeFeesAmount': 12,
         *   '_id': '6776baf5c7c6e518aae88071',
         *   'creationDate': 'Fri Jan 03 2012 13:13:25 GMT+0100 (Central European Standard Time)',
         *   'creator': '6776baf5c7c6e518aae88072',
         *   'lastUpdateDate': 'Fri Jan 03 2012 13:13:25 GMT+0100 (Central European Standard Time)',
         *   'lastUpdater': '6776baf5c7c6e518aae88072'
         * }
     */
        walletTransferTransactionGetById<Config extends RequestConfigGetOne<modelTypes.WalletTransferTransactionModels['Read']>>(
            id: string,
            config ?: Config
        ): Promise<Config['triggerErrorIfNotSet'] extends true ? modelTypes.WalletTransferTransactionModels['Read'] : modelTypes.WalletTransferTransactionModels['Read'] | undefined>,
            /** Allow to get a ressource with providing a filter as first param
             * @example
             * {
             *   'source': {
             *     'user': '6776baf5c7c6e518aae88072',
             *     'amount': 2.12,
             *     'wallet': '6776baf5c7c6e518aae88072'
             *   },
             *   'target': {
             *     'user': '6776baf5c7c6e518aae88072',
             *     'amount': 2.12,
             *     'wallet': '6776baf5c7c6e518aae88072'
             *   },
             *   'status': 'pending',
             *   'exchangeRateMultiplier': 12,
             *   'exchangeFeesPercent': 12,
             *   'exchangeFeesAmount': 12,
             *   '_id': '6776baf5c7c6e518aae88071',
             *   'creationDate': 'Fri Jan 03 2012 13:13:25 GMT+0100 (Central European Standard Time)',
             *   'creator': '6776baf5c7c6e518aae88072',
             *   'lastUpdateDate': 'Fri Jan 03 2012 13:13:25 GMT+0100 (Central European Standard Time)',
             *   'lastUpdater': '6776baf5c7c6e518aae88072'
             * }
         */
            walletTransferTransactionGetOne<Config extends Omit<RequestConfigGetOne<modelTypes.WalletTransferTransactionModels['Read']>, 'filter'>>(
                filter ?: AsFilter<modelTypes.WalletTransferTransactionModels['Write']>, // WRITE HERE because it will ensure referenced fields are passed as their string counterpart
                config ?: Config
            ): Promise<Config['triggerErrorIfNotSet'] extends true ? modelTypes.WalletTransferTransactionModels['Read'] : modelTypes.WalletTransferTransactionModels['Read'] | undefined>,
                useQuery: {
    manageDueDiligenceStatusAsAdmin(
        queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>, props ?: {
            'userId': string
        'status': 'declined' | 'success' | 'canRetry'
        }): [
            void,
            Omit<ReturnType<typeof useSuspenseQuery>, 'data'>
        ],
            manageKycStatusAsAdmin(
                queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>, props ?: {
                    'userId': string
        'status': 'declined' | 'success' | 'canRetry' | 'pending'
        'kycDeclinedReasons'?: string
                }): [
                    void,
                    Omit<ReturnType<typeof useSuspenseQuery>, 'data'>
                ],
                    shuftiProCallback(
                        queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>, param0 ?: any): [
                            void,
                            Omit<ReturnType<typeof useSuspenseQuery>, 'data'>
                        ],
                            subscribeToNewsletter(
                                queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>, param0 ?: modelTypes.NewsletterSubscriptionsModels['Write']): [
                                    void,
                                    Omit<ReturnType<typeof useSuspenseQuery>, 'data'>
                                ],
                                    dataTrackingRegisterEvent(
                                        queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>, param0 ?: Array<{
                                            'utmCampaignId'?: string
                                            'type': 'press' | 'click' | 'sessionEnd' | 'pageLeft' | 'pageReturn' | 'navigate' | 'componentVisible' | 'componentHidden' | 'error' | 'sessionStart'
                                            'project': string
                                            'session': string
                                            'ts': number
                                            'screen'?: string
                                            'data'?: {
                                                [key: string]: any
                                            }
                                            'device'?: string | modelTypes.Device
                                            'error'?: string | modelTypes.UnexpectedError
                                        }>): [
                                            void,
                                            Omit<ReturnType<typeof useSuspenseQuery>, 'data'>
                                        ],
                                            updateEmail(
                                                queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>, props ?: {
                                                    'token': string
                                                }): [
                                                    string,
                                                    Omit<ReturnType<typeof useSuspenseQuery>, 'data'>
                                                ],
                                                    registerUserDevice(
                                                        queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>, param0 ?: modelTypes.DeviceModels['Read']): [
                                                            void,
                                                            Omit<ReturnType<typeof useSuspenseQuery>, 'data'>
                                                        ],
                                                            userSubscribe(
                                                                queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>, userFields ?: {
                                                                    'phonePrefix': any
        'phoneNumber': string
        'lang': 'fr' | 'en' | 'ru'
        'currency': 'eur' | 'usd' | 'thb' | 'jpy' | 'inr' | 'cny' | 'try' | 'mxn' | 'gbp' | 'chf' | 'rub' | 'pln' | 'dkk' | 'ils' | 'sek' | 'ars' | 'php' | 'brl' | 'cad' | 'krw' | 'nok' | 'sgd' | 'huf' | 'uah' | 'aud' | 'zar' | 'myr' | 'idr' | 'hkd' | 'nzd' | 'aed'
        'email': string
        'password': string
        'hasAgreedWithTermsAndConditions': boolean
        'firstName'?: string
        'lastName'?: string
        'referralCode'?: string
        'emailAdditionalParams'?: {
                                                                        [prop: string]: any
                                                                    }
        'pinCode'?: string
                                                                }): [
                                                                    Required<{
                                                                        'userId': string
                                                                        'userEmail': string
                                                                    }>,
                                                                    Omit<ReturnType<typeof useSuspenseQuery>, 'data'>
                                                                ],
                                                                    updatePassword(
                                                                        queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>, props ?: {
                                                                            'token': string
        'newPassword': string
                                                                        }): [
                                                                            string,
                                                                            Omit<ReturnType<typeof useSuspenseQuery>, 'data'>
                                                                        ],
                                                                            sendForgotPasswordEmail(
                                                                                queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>, props ?: {
                                                                                    'email': string
                                                                                }): [
                                                                                    string,
                                                                                    Omit<ReturnType<typeof useSuspenseQuery>, 'data'>
                                                                                ],
                                                                                    sendValidationEmail(
                                                                                        queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>, props ?: {
                                                                                            'userId': string
        'additionalParams'?: {
                                                                                                [prop: string]: any
                                                                                            }
                                                                                        }): [
                                                                                            string,
                                                                                            Omit<ReturnType<typeof useSuspenseQuery>, 'data'>
                                                                                        ],
                                                                                            checkUserExists(
                                                                                                queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>, props ?: {
                                                                                                    'email'?: string
                                                                                                }): [
                                                                                                    boolean,
                                                                                                    Omit<ReturnType<typeof useSuspenseQuery>, 'data'>
                                                                                                ],
                                                                                                    registerCompanyRepresentative(
                                                                                                        queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>, userFields ?: {
                                                                                                            'phonePrefix': any
        'phoneNumber': string
        'lang': 'fr' | 'en' | 'ru'
        'currency': 'eur' | 'usd' | 'thb' | 'jpy' | 'inr' | 'cny' | 'try' | 'mxn' | 'gbp' | 'chf' | 'rub' | 'pln' | 'dkk' | 'ils' | 'sek' | 'ars' | 'php' | 'brl' | 'cad' | 'krw' | 'nok' | 'sgd' | 'huf' | 'uah' | 'aud' | 'zar' | 'myr' | 'idr' | 'hkd' | 'nzd' | 'aed'
        'email': string
        'password': string
        'hasAgreedWithTermsAndConditions': boolean
        'firstName'?: string
        'lastName'?: string
        'referralCode'?: string
        'emailAdditionalParams'?: {
                                                                                                                [prop: string]: any
                                                                                                            }
        'pinCode'?: string
        'companyName': string
        'registrationCountry': string
        'companyIdenfier': string
                                                                                                        }): [
                                                                                                            Required<{
                                                                                                                'userId': string
                                                                                                                'userEmail': string
                                                                                                                'companyId': string
                                                                                                                'emailWasAlreadyVerified': boolean
                                                                                                            }>,
                                                                                                            Omit<ReturnType<typeof useSuspenseQuery>, 'data'>
                                                                                                        ],
                                                                                                            getNewToken(
                                                                                                                queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>, props ?: {
                                                                                                                    'deviceId': string
        'pinCode'?: any
        'biometricAuthToken'?: string
                                                                                                                }): [
                                                                                                                    Required<{
                                                                                                                        'accessToken': string
                                                                                                                        'csrfToken': string
                                                                                                                        'expirationDate': Date | 'never'
                                                                                                                        'biometricAuthToken': string
                                                                                                                    }>,
                                                                                                                    Omit<ReturnType<typeof useSuspenseQuery>, 'data'>
                                                                                                                ],
                                                                                                                    validateEmailAndLogin(
                                                                                                                        queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>, props ?: {
                                                                                                                            'token': string
        'deviceId': string
        'deviceType': 'mobile' | 'web'
                                                                                                                        }): [
                                                                                                                            Required<{
                                                                                                                                'user': modelTypes.UserModels['Read']
                                                                                                                                'accessToken': string
                                                                                                                                'deviceId': string
                                                                                                                                'csrfToken': string
                                                                                                                                'biometricAuthToken': string
                                                                                                                                'wasEmailAlreadyValidated': false
                                                                                                                            }> | Required<{
                                                                                                                                'wasEmailAlreadyValidated': true
                                                                                                                            }>,
                                                                                                                            Omit<ReturnType<typeof useSuspenseQuery>, 'data'>
                                                                                                                        ],
                                                                                                                            checkTokenBeforeEmailSvc(
                                                                                                                                queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>, props ?: {
                                                                                                                                    'token': string
        'emailType': 'forgotPassword' | 'emailValidation' | 'changeEmail'
                                                                                                                                }): [
                                                                                                                                    Required<{
                                                                                                                                        'isValidToken': boolean
                                                                                                                                    }>,
                                                                                                                                    Omit<ReturnType<typeof useSuspenseQuery>, 'data'>
                                                                                                                                ],
                                                                                                                                    tokenBgk(
                                                                                                                                        queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>,): [
                                                                                                                                            void,
                                                                                                                                            Omit<ReturnType<typeof useSuspenseQuery>, 'data'>
                                                                                                                                        ],
                                                                                                                                            sendMessageToSupport(
                                                                                                                                                queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>, props ?: {
                                                                                                                                                    'msg': string
        'userId'?: string
        'userEmail'?: string
        'deviceId'?: string
        'errorId'?: string
        'topic'?: string
                                                                                                                                                }): [
                                                                                                                                                    void,
                                                                                                                                                    Omit<ReturnType<typeof useSuspenseQuery>, 'data'>
                                                                                                                                                ],
                                                                                                                                                    getCryptoChartData(
                                                                                                                                                        queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>,): [
                                                                                                                                                            Required<{
                                                                                                                                                                'bangkEuro': Array<[number, number]>
                                                                                                                                                                'bangkCoin': Array<[number, number]>
                                                                                                                                                                'tether': Array<[number, number]>
                                                                                                                                                                'bitcoin': Array<[number, number]>
                                                                                                                                                                'solana': Array<[number, number]>
                                                                                                                                                                'ethereum': Array<[number, number]>
                                                                                                                                                                'usd-coin': Array<[number, number]>
                                                                                                                                                                'binancecoin': Array<[number, number]>
                                                                                                                                                            }>,
                                                                                                                                                            Omit<ReturnType<typeof useSuspenseQuery>, 'data'>
                                                                                                                                                        ],
                                                                                                                                                            getCurrencyRateLive(
                                                                                                                                                                queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>, props ?: {
                                                                                                                                                                    'sourceCurrency'?: 'tether' | 'bitcoin' | 'solana' | 'ethereum' | 'usd-coin' | 'binancecoin'
        'targetCurrency'?: 'tether' | 'bitcoin' | 'solana' | 'ethereum' | 'usd-coin' | 'binancecoin'
                                                                                                                                                                }): [
                                                                                                                                                                    number,
                                                                                                                                                                    Omit<ReturnType<typeof useSuspenseQuery>, 'data'>
                                                                                                                                                                ],
                                                                                                                                                                    getCurrencyRates(
                                                                                                                                                                        queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>,): [
                                                                                                                                                                            Required<{
                                                                                                                                                                                'bangkEuro': number
                                                                                                                                                                                'bangkCoin': number
                                                                                                                                                                                'tether': number
                                                                                                                                                                                'bitcoin': number
                                                                                                                                                                                'solana': number
                                                                                                                                                                                'ethereum': number
                                                                                                                                                                                'usd-coin': number
                                                                                                                                                                                'binancecoin': number
                                                                                                                                                                                'eur': number
                                                                                                                                                                                'usd': number
                                                                                                                                                                                'thb': number
                                                                                                                                                                                'jpy': number
                                                                                                                                                                                'inr': number
                                                                                                                                                                                'cny': number
                                                                                                                                                                                'try': number
                                                                                                                                                                                'mxn': number
                                                                                                                                                                                'gbp': number
                                                                                                                                                                                'chf': number
                                                                                                                                                                                'rub': number
                                                                                                                                                                                'pln': number
                                                                                                                                                                                'dkk': number
                                                                                                                                                                                'ils': number
                                                                                                                                                                                'sek': number
                                                                                                                                                                                'ars': number
                                                                                                                                                                                'php': number
                                                                                                                                                                                'brl': number
                                                                                                                                                                                'cad': number
                                                                                                                                                                                'krw': number
                                                                                                                                                                                'nok': number
                                                                                                                                                                                'sgd': number
                                                                                                                                                                                'huf': number
                                                                                                                                                                                'uah': number
                                                                                                                                                                                'aud': number
                                                                                                                                                                                'zar': number
                                                                                                                                                                                'myr': number
                                                                                                                                                                                'idr': number
                                                                                                                                                                                'hkd': number
                                                                                                                                                                                'nzd': number
                                                                                                                                                                                'aed': number
                                                                                                                                                                            }>,
                                                                                                                                                                            Omit<ReturnType<typeof useSuspenseQuery>, 'data'>
                                                                                                                                                                        ],
                                                                                                                                                                            uploadMediasToS3(
                                                                                                                                                                                queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>, props ?: {
                                                                                                                                                                                    'mediaName': string
                                                                                                                                                                                }): [
                                                                                                                                                                                    void,
                                                                                                                                                                                    Omit<ReturnType<typeof useSuspenseQuery>, 'data'>
                                                                                                                                                                                ],
                                                                                                                                                                                    frontendthrow error.andler(
                                                                                                                                                                                        queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>, props ?: {
                                                                                                                                                                                            'errorId'?: string
        'title': string
        'applicationVersion'?: string
        'deviceId'?: string
        'userId'?: string
        'extraInfos'?: string
        'stackTrace'?: string
        'deviceType'?: 'tablet' | 'mobile' | 'desktop' | 'unknown'
        'deviceInfos'?: {}
        'deviceName'?: string
                                                                                                                                                                                        }): [
                                                                                                                                                                                            void,
                                                                                                                                                                                            Omit<ReturnType<typeof useSuspenseQuery>, 'data'>
                                                                                                                                                                                        ],
                                                                                                                                                                                            getGeneralBonusCode(
                                                                                                                                                                                                queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>,): [
                                                                                                                                                                                                    modelTypes.IcoBonusCodeModels['Read'] | void,
                                                                                                                                                                                                    Omit<ReturnType<typeof useSuspenseQuery>, 'data'>
                                                                                                                                                                                                ],
                                                                                                                                                                                                    icoTransactionSuccessHandler(
                                                                                                                                                                                                        queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>, props ?: {
                                                                                                                                                                                                            'transactionId': string
        'isCancel'?: boolean
        'hash'?: string
                                                                                                                                                                                                        }): [
                                                                                                                                                                                                            void,
                                                                                                                                                                                                            Omit<ReturnType<typeof useSuspenseQuery>, 'data'>
                                                                                                                                                                                                        ],
                                                                                                                                                                                                            cbwaa(
                                                                                                                                                                                                                queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>, props ?: {
                                                                                                                                                                                                                    'wallets'?: Array<modelTypes.BangkWalletsModels['Write']>
                                                                                                                                                                                                                }): [
                                                                                                                                                                                                                    void,
                                                                                                                                                                                                                    Omit<ReturnType<typeof useSuspenseQuery>, 'data'>
                                                                                                                                                                                                                ],
                                                                                                                                                                                                                    isBonusCodeValid(
                                                                                                                                                                                                                        queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>, props ?: {
                                                                                                                                                                                                                            'code': string
                                                                                                                                                                                                                        }): [
                                                                                                                                                                                                                            {
                                                                                                                                                                                                                                'type'?: 'referralCode'
    'firstName'?: string | void
                                                                                                                                                                                                                                    'lastName' ?: string | void
} | {
                                                                                                                                                                                                                                'type'?: 'bonusCode'
    'bonusCode'?: modelTypes.IcoBonusCodeModels['Read']
                                                                                                                                                                                                                            },
                                                                                                                                                                                                                            Omit<ReturnType<typeof useSuspenseQuery>, 'data'>
                                                                                                                                                                                                                        ],
                                                                                                                                                                                                                            createIcoBonusCode(
                                                                                                                                                                                                                                queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>, props ?: modelTypes.IcoBonusCodeModels['Write']): [
                                                                                                                                                                                                                                    void,
                                                                                                                                                                                                                                    Omit<ReturnType<typeof useSuspenseQuery>, 'data'>
                                                                                                                                                                                                                                ],
                                                                                                                                                                                                                                    bangkAdminLogin(
                                                                                                                                                                                                                                        queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>, userFields ?: {
                                                                                                                                                                                                                                            'deviceId': string
        'deviceType': 'mobile' | 'web'
        'email': string
        'password': string
        'pinCode'?: string
                                                                                                                                                                                                                                        }): [
                                                                                                                                                                                                                                            Required<{
                                                                                                                                                                                                                                                'isEmailVerified': true
                                                                                                                                                                                                                                                'loginInfos': Required<{
                                                                                                                                                                                                                                                    'user': modelTypes.UserModels['Read']
                                                                                                                                                                                                                                                    'accessToken': string
                                                                                                                                                                                                                                                    'deviceId': string
                                                                                                                                                                                                                                                    'csrfToken': string
                                                                                                                                                                                                                                                    'biometricAuthToken': string
                                                                                                                                                                                                                                                }>
                                                                                                                                                                                                                                            }> | Required<{
                                                                                                                                                                                                                                                'isEmailVerified': false
                                                                                                                                                                                                                                                'userId': string
                                                                                                                                                                                                                                                'userEmail': string
                                                                                                                                                                                                                                            }>,
                                                                                                                                                                                                                                            Omit<ReturnType<typeof useSuspenseQuery>, 'data'>
                                                                                                                                                                                                                                        ],
                                                                                                                                                                                                                                            logout(
                                                                                                                                                                                                                                                queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>,): [
                                                                                                                                                                                                                                                    void,
                                                                                                                                                                                                                                                    Omit<ReturnType<typeof useSuspenseQuery>, 'data'>
                                                                                                                                                                                                                                                ],
                                                                                                                                                                                                                                                    loginOrSubscribe(
                                                                                                                                                                                                                                                        queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>, userFields ?: {
                                                                                                                                                                                                                                                            'deviceId': string
        'deviceType': 'mobile' | 'web'
        'phonePrefix': any
        'phoneNumber': string
        'lang': 'fr' | 'en' | 'ru'
        'currency': 'eur' | 'usd' | 'thb' | 'jpy' | 'inr' | 'cny' | 'try' | 'mxn' | 'gbp' | 'chf' | 'rub' | 'pln' | 'dkk' | 'ils' | 'sek' | 'ars' | 'php' | 'brl' | 'cad' | 'krw' | 'nok' | 'sgd' | 'huf' | 'uah' | 'aud' | 'zar' | 'myr' | 'idr' | 'hkd' | 'nzd' | 'aed'
        'firstName'?: string
        'lastName'?: string
        'email'?: string
        'password'?: string
        'referralCode'?: string
        'pinCode'?: string
                                                                                                                                                                                                                                                        }): [
                                                                                                                                                                                                                                                            Required<{
                                                                                                                                                                                                                                                                'user': modelTypes.UserModels['Read']
                                                                                                                                                                                                                                                                'accessToken': string
                                                                                                                                                                                                                                                                'deviceId': string
                                                                                                                                                                                                                                                                'csrfToken': string
                                                                                                                                                                                                                                                                'biometricAuthToken': string
                                                                                                                                                                                                                                                            }>,
                                                                                                                                                                                                                                                            Omit<ReturnType<typeof useSuspenseQuery>, 'data'>
                                                                                                                                                                                                                                                        ],
                                                                                                                                                                                                                                                            userLoginWithEmail(
                                                                                                                                                                                                                                                                queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>, userFields ?: {
                                                                                                                                                                                                                                                                    'deviceId': string
        'deviceType': 'mobile' | 'web'
        'email': string
        'password': string
        'pinCode'?: string
                                                                                                                                                                                                                                                                }): [
                                                                                                                                                                                                                                                                    Required<{
                                                                                                                                                                                                                                                                        'isEmailVerified': true
                                                                                                                                                                                                                                                                        'loginInfos': Required<{
                                                                                                                                                                                                                                                                            'user': modelTypes.UserModels['Read']
                                                                                                                                                                                                                                                                            'accessToken': string
                                                                                                                                                                                                                                                                            'deviceId': string
                                                                                                                                                                                                                                                                            'csrfToken': string
                                                                                                                                                                                                                                                                            'biometricAuthToken': string
                                                                                                                                                                                                                                                                        }>
                                                                                                                                                                                                                                                                    }> | Required<{
                                                                                                                                                                                                                                                                        'isEmailVerified': false
                                                                                                                                                                                                                                                                        'userId': string
                                                                                                                                                                                                                                                                        'userEmail': string
                                                                                                                                                                                                                                                                    }>,
                                                                                                                                                                                                                                                                    Omit<ReturnType<typeof useSuspenseQuery>, 'data'>
                                                                                                                                                                                                                                                                ],
                                                                                                                                                                                                                                                                    plaidGetLinkToken(
                                                                                                                                                                                                                                                                        queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>,): [
                                                                                                                                                                                                                                                                            string,
                                                                                                                                                                                                                                                                            Omit<ReturnType<typeof useSuspenseQuery>, 'data'>
                                                                                                                                                                                                                                                                        ],
                                                                                                                                                                                                                                                                            plaidStoreToken(
                                                                                                                                                                                                                                                                                queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>, props ?: {
                                                                                                                                                                                                                                                                                    'publicToken': string
                                                                                                                                                                                                                                                                                }): [
                                                                                                                                                                                                                                                                                    void,
                                                                                                                                                                                                                                                                                    Omit<ReturnType<typeof useSuspenseQuery>, 'data'>
                                                                                                                                                                                                                                                                                ],
                                                                                                                                                                                                                                                                                    plaidGetAllTransactions(
                                                                                                                                                                                                                                                                                        queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>,): [
                                                                                                                                                                                                                                                                                            'noPlaidToken' | 'error' | Array<Required<{
                                                                                                                                                                                                                                                                                                'amount': number
                                                                                                                                                                                                                                                                                                'object': string
                                                                                                                                                                                                                                                                                                'date': string
                                                                                                                                                                                                                                                                                                'pending': boolean
                                                                                                                                                                                                                                                                                                'status': 'added' | 'modified' | 'removed'
                                                                                                                                                                                                                                                                                                'currency': string
                                                                                                                                                                                                                                                                                            }>>,
                                                                                                                                                                                                                                                                                            Omit<ReturnType<typeof useSuspenseQuery>, 'data'>
                                                                                                                                                                                                                                                                                        ],
                                                                                                                                                                                                                                                                                            newsletterSubscriptionsGetAll(
                                                                                                                                                                                                                                                                                                queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>,
                                                                                                                                                                                                                                                                                                filter ?: AsFilter<modelTypes.NewsletterSubscriptionsModels['Write']>,
                                                                                                                                                                                                                                                                                                config ?: never
                                                                                                                                                                                                                                                                                            ): [
                                                                                                                                                                                                                                                                                                modelTypes.NewsletterSubscriptionsModels['Read'][],
                                                                                                                                                                                                                                                                                                Omit<ReturnType<typeof useSuspenseQuery>, 'data'>
                                                                                                                                                                                                                                                                                            ]
    newsletterSubscriptionsGetAll<Config extends Omit<RequestConfigRead<modelTypes.NewsletterSubscriptionsModels['Read']>, 'filter'>>(
        queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>,
        filter ?: AsFilter<modelTypes.NewsletterSubscriptionsModels['Write']>,
        config ?: Config
    ): [
        MaybePaginated<modelTypes.NewsletterSubscriptionsModels['Read'][], Config>,
        Omit<ReturnType<typeof useSuspenseQuery>, 'data'>
    ],
        newsletterSubscriptionsGetLastN(
            queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>,
            limit ?: number,
            config ?: never,
        ): [
            modelTypes.NewsletterSubscriptionsModels['Read'][],
            Omit<ReturnType<typeof useSuspenseQuery>, 'data'>
        ]
    newsletterSubscriptionsGetLastN<Config extends RequestConfigRead<modelTypes.NewsletterSubscriptionsModels['Read']>>(
        queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>,
        limit ?: number,
        config ?: Config,
    ): [
        MaybePaginated<modelTypes.NewsletterSubscriptionsModels['Read'][], Config>,
        Omit<ReturnType<typeof useSuspenseQuery>, 'data'>
    ],
        newsletterSubscriptionsGetFirstN(
            queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>,
            limit ?: number,
            config ?: never
        ): [
            modelTypes.NewsletterSubscriptionsModels['Read'][],
            Omit<ReturnType<typeof useSuspenseQuery>, 'data'>
        ]
    newsletterSubscriptionsGetFirstN<Config extends RequestConfigRead<modelTypes.NewsletterSubscriptionsModels['Read']>>(
        queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>,
        limit ?: number,
        config ?: Config
    ): [
        MaybePaginated<modelTypes.NewsletterSubscriptionsModels['Read'][], Config>,
        Omit<ReturnType<typeof useSuspenseQuery>, 'data'>
    ],
        newsletterSubscriptionsCount(
            queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>,
            filter ?: AsFilter<modelTypes.NewsletterSubscriptionsModels['Write']>
        ): [
            number,
            Omit<ReturnType<typeof useSuspenseQuery>, 'data'>
        ],
            newsletterSubscriptionsGetById<Config extends RequestConfigGetOne<modelTypes.NewsletterSubscriptionsModels['Read']>>(
                queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>,
                id: string,
                config ?: Config
            ): [
                Config['triggerErrorIfNotSet'] extends true ? modelTypes.NewsletterSubscriptionsModels['Read'] : modelTypes.NewsletterSubscriptionsModels['Read'] | undefined,
                Omit<ReturnType<typeof useSuspenseQuery>, 'data'>
            ],
                newsletterSubscriptionsGetOne<Config extends Omit<RequestConfigGetOne<modelTypes.NewsletterSubscriptionsModels['Read']>, 'filter'>>(
                    queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>,
                    filter ?: AsFilter<modelTypes.NewsletterSubscriptionsModels['Write']>, // WRITE HERE because it will ensure referenced fields are passed as their string counterpart
                    config ?: Config
                ): [
                    Config['triggerErrorIfNotSet'] extends true ? modelTypes.NewsletterSubscriptionsModels['Read'] : modelTypes.NewsletterSubscriptionsModels['Read'] | undefined,
                    Omit<ReturnType<typeof useSuspenseQuery>, 'data'>
                ],
                    appConfigGetAll(
                        queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>,
                        filter ?: AsFilter<modelTypes.AppConfigModels['Write']>,
                        config ?: never
                    ): [
                        modelTypes.AppConfigModels['Read'][],
                        Omit<ReturnType<typeof useSuspenseQuery>, 'data'>
                    ]
    appConfigGetAll<Config extends Omit<RequestConfigRead<modelTypes.AppConfigModels['Read']>, 'filter'>>(
        queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>,
        filter ?: AsFilter<modelTypes.AppConfigModels['Write']>,
        config ?: Config
    ): [
        MaybePaginated<modelTypes.AppConfigModels['Read'][], Config>,
        Omit<ReturnType<typeof useSuspenseQuery>, 'data'>
    ],
        appConfigGetLastN(
            queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>,
            limit ?: number,
            config ?: never,
        ): [
            modelTypes.AppConfigModels['Read'][],
            Omit<ReturnType<typeof useSuspenseQuery>, 'data'>
        ]
    appConfigGetLastN<Config extends RequestConfigRead<modelTypes.AppConfigModels['Read']>>(
        queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>,
        limit ?: number,
        config ?: Config,
    ): [
        MaybePaginated<modelTypes.AppConfigModels['Read'][], Config>,
        Omit<ReturnType<typeof useSuspenseQuery>, 'data'>
    ],
        appConfigGetFirstN(
            queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>,
            limit ?: number,
            config ?: never
        ): [
            modelTypes.AppConfigModels['Read'][],
            Omit<ReturnType<typeof useSuspenseQuery>, 'data'>
        ]
    appConfigGetFirstN<Config extends RequestConfigRead<modelTypes.AppConfigModels['Read']>>(
        queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>,
        limit ?: number,
        config ?: Config
    ): [
        MaybePaginated<modelTypes.AppConfigModels['Read'][], Config>,
        Omit<ReturnType<typeof useSuspenseQuery>, 'data'>
    ],
        appConfigCount(
            queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>,
            filter ?: AsFilter<modelTypes.AppConfigModels['Write']>
        ): [
            number,
            Omit<ReturnType<typeof useSuspenseQuery>, 'data'>
        ],
            appConfigGetById<Config extends RequestConfigGetOne<modelTypes.AppConfigModels['Read']>>(
                queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>,
                id: string,
                config ?: Config
            ): [
                Config['triggerErrorIfNotSet'] extends true ? modelTypes.AppConfigModels['Read'] : modelTypes.AppConfigModels['Read'] | undefined,
                Omit<ReturnType<typeof useSuspenseQuery>, 'data'>
            ],
                appConfigGetOne<Config extends Omit<RequestConfigGetOne<modelTypes.AppConfigModels['Read']>, 'filter'>>(
                    queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>,
                    filter ?: AsFilter<modelTypes.AppConfigModels['Write']>, // WRITE HERE because it will ensure referenced fields are passed as their string counterpart
                    config ?: Config
                ): [
                    Config['triggerErrorIfNotSet'] extends true ? modelTypes.AppConfigModels['Read'] : modelTypes.AppConfigModels['Read'] | undefined,
                    Omit<ReturnType<typeof useSuspenseQuery>, 'data'>
                ],
                    bangkWalletsGetAll(
                        queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>,
                        filter ?: AsFilter<modelTypes.BangkWalletsModels['Write']>,
                        config ?: never
                    ): [
                        modelTypes.BangkWalletsModels['Read'][],
                        Omit<ReturnType<typeof useSuspenseQuery>, 'data'>
                    ]
    bangkWalletsGetAll<Config extends Omit<RequestConfigRead<modelTypes.BangkWalletsModels['Read']>, 'filter'>>(
        queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>,
        filter ?: AsFilter<modelTypes.BangkWalletsModels['Write']>,
        config ?: Config
    ): [
        MaybePaginated<modelTypes.BangkWalletsModels['Read'][], Config>,
        Omit<ReturnType<typeof useSuspenseQuery>, 'data'>
    ],
        bangkWalletsGetLastN(
            queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>,
            limit ?: number,
            config ?: never,
        ): [
            modelTypes.BangkWalletsModels['Read'][],
            Omit<ReturnType<typeof useSuspenseQuery>, 'data'>
        ]
    bangkWalletsGetLastN<Config extends RequestConfigRead<modelTypes.BangkWalletsModels['Read']>>(
        queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>,
        limit ?: number,
        config ?: Config,
    ): [
        MaybePaginated<modelTypes.BangkWalletsModels['Read'][], Config>,
        Omit<ReturnType<typeof useSuspenseQuery>, 'data'>
    ],
        bangkWalletsGetFirstN(
            queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>,
            limit ?: number,
            config ?: never
        ): [
            modelTypes.BangkWalletsModels['Read'][],
            Omit<ReturnType<typeof useSuspenseQuery>, 'data'>
        ]
    bangkWalletsGetFirstN<Config extends RequestConfigRead<modelTypes.BangkWalletsModels['Read']>>(
        queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>,
        limit ?: number,
        config ?: Config
    ): [
        MaybePaginated<modelTypes.BangkWalletsModels['Read'][], Config>,
        Omit<ReturnType<typeof useSuspenseQuery>, 'data'>
    ],
        bangkWalletsCount(
            queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>,
            filter ?: AsFilter<modelTypes.BangkWalletsModels['Write']>
        ): [
            number,
            Omit<ReturnType<typeof useSuspenseQuery>, 'data'>
        ],
            bangkWalletsGetById<Config extends RequestConfigGetOne<modelTypes.BangkWalletsModels['Read']>>(
                queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>,
                id: string,
                config ?: Config
            ): [
                Config['triggerErrorIfNotSet'] extends true ? modelTypes.BangkWalletsModels['Read'] : modelTypes.BangkWalletsModels['Read'] | undefined,
                Omit<ReturnType<typeof useSuspenseQuery>, 'data'>
            ],
                bangkWalletsGetOne<Config extends Omit<RequestConfigGetOne<modelTypes.BangkWalletsModels['Read']>, 'filter'>>(
                    queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>,
                    filter ?: AsFilter<modelTypes.BangkWalletsModels['Write']>, // WRITE HERE because it will ensure referenced fields are passed as their string counterpart
                    config ?: Config
                ): [
                    Config['triggerErrorIfNotSet'] extends true ? modelTypes.BangkWalletsModels['Read'] : modelTypes.BangkWalletsModels['Read'] | undefined,
                    Omit<ReturnType<typeof useSuspenseQuery>, 'data'>
                ],
                    blockchainConfigGetAll(
                        queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>,
                        filter ?: AsFilter<modelTypes.BlockchainConfigModels['Write']>,
                        config ?: never
                    ): [
                        modelTypes.BlockchainConfigModels['Read'][],
                        Omit<ReturnType<typeof useSuspenseQuery>, 'data'>
                    ]
    blockchainConfigGetAll<Config extends Omit<RequestConfigRead<modelTypes.BlockchainConfigModels['Read']>, 'filter'>>(
        queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>,
        filter ?: AsFilter<modelTypes.BlockchainConfigModels['Write']>,
        config ?: Config
    ): [
        MaybePaginated<modelTypes.BlockchainConfigModels['Read'][], Config>,
        Omit<ReturnType<typeof useSuspenseQuery>, 'data'>
    ],
        blockchainConfigGetLastN(
            queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>,
            limit ?: number,
            config ?: never,
        ): [
            modelTypes.BlockchainConfigModels['Read'][],
            Omit<ReturnType<typeof useSuspenseQuery>, 'data'>
        ]
    blockchainConfigGetLastN<Config extends RequestConfigRead<modelTypes.BlockchainConfigModels['Read']>>(
        queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>,
        limit ?: number,
        config ?: Config,
    ): [
        MaybePaginated<modelTypes.BlockchainConfigModels['Read'][], Config>,
        Omit<ReturnType<typeof useSuspenseQuery>, 'data'>
    ],
        blockchainConfigGetFirstN(
            queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>,
            limit ?: number,
            config ?: never
        ): [
            modelTypes.BlockchainConfigModels['Read'][],
            Omit<ReturnType<typeof useSuspenseQuery>, 'data'>
        ]
    blockchainConfigGetFirstN<Config extends RequestConfigRead<modelTypes.BlockchainConfigModels['Read']>>(
        queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>,
        limit ?: number,
        config ?: Config
    ): [
        MaybePaginated<modelTypes.BlockchainConfigModels['Read'][], Config>,
        Omit<ReturnType<typeof useSuspenseQuery>, 'data'>
    ],
        blockchainConfigCount(
            queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>,
            filter ?: AsFilter<modelTypes.BlockchainConfigModels['Write']>
        ): [
            number,
            Omit<ReturnType<typeof useSuspenseQuery>, 'data'>
        ],
            blockchainConfigGetById<Config extends RequestConfigGetOne<modelTypes.BlockchainConfigModels['Read']>>(
                queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>,
                id: string,
                config ?: Config
            ): [
                Config['triggerErrorIfNotSet'] extends true ? modelTypes.BlockchainConfigModels['Read'] : modelTypes.BlockchainConfigModels['Read'] | undefined,
                Omit<ReturnType<typeof useSuspenseQuery>, 'data'>
            ],
                blockchainConfigGetOne<Config extends Omit<RequestConfigGetOne<modelTypes.BlockchainConfigModels['Read']>, 'filter'>>(
                    queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>,
                    filter ?: AsFilter<modelTypes.BlockchainConfigModels['Write']>, // WRITE HERE because it will ensure referenced fields are passed as their string counterpart
                    config ?: Config
                ): [
                    Config['triggerErrorIfNotSet'] extends true ? modelTypes.BlockchainConfigModels['Read'] : modelTypes.BlockchainConfigModels['Read'] | undefined,
                    Omit<ReturnType<typeof useSuspenseQuery>, 'data'>
                ],
                    cardGetAll(
                        queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>,
                        filter ?: AsFilter<modelTypes.CardModels['Write']>,
                        config ?: never
                    ): [
                        modelTypes.CardModels['Read'][],
                        Omit<ReturnType<typeof useSuspenseQuery>, 'data'>
                    ]
    cardGetAll<Config extends Omit<RequestConfigRead<modelTypes.CardModels['Read']>, 'filter'>>(
        queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>,
        filter ?: AsFilter<modelTypes.CardModels['Write']>,
        config ?: Config
    ): [
        MaybePaginated<modelTypes.CardModels['Read'][], Config>,
        Omit<ReturnType<typeof useSuspenseQuery>, 'data'>
    ],
        cardGetLastN(
            queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>,
            limit ?: number,
            config ?: never,
        ): [
            modelTypes.CardModels['Read'][],
            Omit<ReturnType<typeof useSuspenseQuery>, 'data'>
        ]
    cardGetLastN<Config extends RequestConfigRead<modelTypes.CardModels['Read']>>(
        queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>,
        limit ?: number,
        config ?: Config,
    ): [
        MaybePaginated<modelTypes.CardModels['Read'][], Config>,
        Omit<ReturnType<typeof useSuspenseQuery>, 'data'>
    ],
        cardGetFirstN(
            queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>,
            limit ?: number,
            config ?: never
        ): [
            modelTypes.CardModels['Read'][],
            Omit<ReturnType<typeof useSuspenseQuery>, 'data'>
        ]
    cardGetFirstN<Config extends RequestConfigRead<modelTypes.CardModels['Read']>>(
        queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>,
        limit ?: number,
        config ?: Config
    ): [
        MaybePaginated<modelTypes.CardModels['Read'][], Config>,
        Omit<ReturnType<typeof useSuspenseQuery>, 'data'>
    ],
        cardCount(
            queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>,
            filter ?: AsFilter<modelTypes.CardModels['Write']>
        ): [
            number,
            Omit<ReturnType<typeof useSuspenseQuery>, 'data'>
        ],
            cardGetById<Config extends RequestConfigGetOne<modelTypes.CardModels['Read']>>(
                queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>,
                id: string,
                config ?: Config
            ): [
                Config['triggerErrorIfNotSet'] extends true ? modelTypes.CardModels['Read'] : modelTypes.CardModels['Read'] | undefined,
                Omit<ReturnType<typeof useSuspenseQuery>, 'data'>
            ],
                cardGetOne<Config extends Omit<RequestConfigGetOne<modelTypes.CardModels['Read']>, 'filter'>>(
                    queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>,
                    filter ?: AsFilter<modelTypes.CardModels['Write']>, // WRITE HERE because it will ensure referenced fields are passed as their string counterpart
                    config ?: Config
                ): [
                    Config['triggerErrorIfNotSet'] extends true ? modelTypes.CardModels['Read'] : modelTypes.CardModels['Read'] | undefined,
                    Omit<ReturnType<typeof useSuspenseQuery>, 'data'>
                ],
                    cardTransactionGetAll(
                        queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>,
                        filter ?: AsFilter<modelTypes.CardTransactionModels['Write']>,
                        config ?: never
                    ): [
                        modelTypes.CardTransactionModels['Read'][],
                        Omit<ReturnType<typeof useSuspenseQuery>, 'data'>
                    ]
    cardTransactionGetAll<Config extends Omit<RequestConfigRead<modelTypes.CardTransactionModels['Read']>, 'filter'>>(
        queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>,
        filter ?: AsFilter<modelTypes.CardTransactionModels['Write']>,
        config ?: Config
    ): [
        MaybePaginated<modelTypes.CardTransactionModels['Read'][], Config>,
        Omit<ReturnType<typeof useSuspenseQuery>, 'data'>
    ],
        cardTransactionGetLastN(
            queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>,
            limit ?: number,
            config ?: never,
        ): [
            modelTypes.CardTransactionModels['Read'][],
            Omit<ReturnType<typeof useSuspenseQuery>, 'data'>
        ]
    cardTransactionGetLastN<Config extends RequestConfigRead<modelTypes.CardTransactionModels['Read']>>(
        queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>,
        limit ?: number,
        config ?: Config,
    ): [
        MaybePaginated<modelTypes.CardTransactionModels['Read'][], Config>,
        Omit<ReturnType<typeof useSuspenseQuery>, 'data'>
    ],
        cardTransactionGetFirstN(
            queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>,
            limit ?: number,
            config ?: never
        ): [
            modelTypes.CardTransactionModels['Read'][],
            Omit<ReturnType<typeof useSuspenseQuery>, 'data'>
        ]
    cardTransactionGetFirstN<Config extends RequestConfigRead<modelTypes.CardTransactionModels['Read']>>(
        queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>,
        limit ?: number,
        config ?: Config
    ): [
        MaybePaginated<modelTypes.CardTransactionModels['Read'][], Config>,
        Omit<ReturnType<typeof useSuspenseQuery>, 'data'>
    ],
        cardTransactionCount(
            queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>,
            filter ?: AsFilter<modelTypes.CardTransactionModels['Write']>
        ): [
            number,
            Omit<ReturnType<typeof useSuspenseQuery>, 'data'>
        ],
            cardTransactionGetById<Config extends RequestConfigGetOne<modelTypes.CardTransactionModels['Read']>>(
                queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>,
                id: string,
                config ?: Config
            ): [
                Config['triggerErrorIfNotSet'] extends true ? modelTypes.CardTransactionModels['Read'] : modelTypes.CardTransactionModels['Read'] | undefined,
                Omit<ReturnType<typeof useSuspenseQuery>, 'data'>
            ],
                cardTransactionGetOne<Config extends Omit<RequestConfigGetOne<modelTypes.CardTransactionModels['Read']>, 'filter'>>(
                    queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>,
                    filter ?: AsFilter<modelTypes.CardTransactionModels['Write']>, // WRITE HERE because it will ensure referenced fields are passed as their string counterpart
                    config ?: Config
                ): [
                    Config['triggerErrorIfNotSet'] extends true ? modelTypes.CardTransactionModels['Read'] : modelTypes.CardTransactionModels['Read'] | undefined,
                    Omit<ReturnType<typeof useSuspenseQuery>, 'data'>
                ],
                    companyGetAll(
                        queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>,
                        filter ?: AsFilter<modelTypes.CompanyModels['Write']>,
                        config ?: never
                    ): [
                        modelTypes.CompanyModels['Read'][],
                        Omit<ReturnType<typeof useSuspenseQuery>, 'data'>
                    ]
    companyGetAll<Config extends Omit<RequestConfigRead<modelTypes.CompanyModels['Read']>, 'filter'>>(
        queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>,
        filter ?: AsFilter<modelTypes.CompanyModels['Write']>,
        config ?: Config
    ): [
        MaybePaginated<modelTypes.CompanyModels['Read'][], Config>,
        Omit<ReturnType<typeof useSuspenseQuery>, 'data'>
    ],
        companyGetLastN(
            queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>,
            limit ?: number,
            config ?: never,
        ): [
            modelTypes.CompanyModels['Read'][],
            Omit<ReturnType<typeof useSuspenseQuery>, 'data'>
        ]
    companyGetLastN<Config extends RequestConfigRead<modelTypes.CompanyModels['Read']>>(
        queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>,
        limit ?: number,
        config ?: Config,
    ): [
        MaybePaginated<modelTypes.CompanyModels['Read'][], Config>,
        Omit<ReturnType<typeof useSuspenseQuery>, 'data'>
    ],
        companyGetFirstN(
            queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>,
            limit ?: number,
            config ?: never
        ): [
            modelTypes.CompanyModels['Read'][],
            Omit<ReturnType<typeof useSuspenseQuery>, 'data'>
        ]
    companyGetFirstN<Config extends RequestConfigRead<modelTypes.CompanyModels['Read']>>(
        queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>,
        limit ?: number,
        config ?: Config
    ): [
        MaybePaginated<modelTypes.CompanyModels['Read'][], Config>,
        Omit<ReturnType<typeof useSuspenseQuery>, 'data'>
    ],
        companyCount(
            queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>,
            filter ?: AsFilter<modelTypes.CompanyModels['Write']>
        ): [
            number,
            Omit<ReturnType<typeof useSuspenseQuery>, 'data'>
        ],
            companyGetById<Config extends RequestConfigGetOne<modelTypes.CompanyModels['Read']>>(
                queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>,
                id: string,
                config ?: Config
            ): [
                Config['triggerErrorIfNotSet'] extends true ? modelTypes.CompanyModels['Read'] : modelTypes.CompanyModels['Read'] | undefined,
                Omit<ReturnType<typeof useSuspenseQuery>, 'data'>
            ],
                companyGetOne<Config extends Omit<RequestConfigGetOne<modelTypes.CompanyModels['Read']>, 'filter'>>(
                    queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>,
                    filter ?: AsFilter<modelTypes.CompanyModels['Write']>, // WRITE HERE because it will ensure referenced fields are passed as their string counterpart
                    config ?: Config
                ): [
                    Config['triggerErrorIfNotSet'] extends true ? modelTypes.CompanyModels['Read'] : modelTypes.CompanyModels['Read'] | undefined,
                    Omit<ReturnType<typeof useSuspenseQuery>, 'data'>
                ],
                    devCommentGetAll(
                        queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>,
                        filter ?: AsFilter<modelTypes.DevCommentModels['Write']>,
                        config ?: never
                    ): [
                        modelTypes.DevCommentModels['Read'][],
                        Omit<ReturnType<typeof useSuspenseQuery>, 'data'>
                    ]
    devCommentGetAll<Config extends Omit<RequestConfigRead<modelTypes.DevCommentModels['Read']>, 'filter'>>(
        queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>,
        filter ?: AsFilter<modelTypes.DevCommentModels['Write']>,
        config ?: Config
    ): [
        MaybePaginated<modelTypes.DevCommentModels['Read'][], Config>,
        Omit<ReturnType<typeof useSuspenseQuery>, 'data'>
    ],
        devCommentGetLastN(
            queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>,
            limit ?: number,
            config ?: never,
        ): [
            modelTypes.DevCommentModels['Read'][],
            Omit<ReturnType<typeof useSuspenseQuery>, 'data'>
        ]
    devCommentGetLastN<Config extends RequestConfigRead<modelTypes.DevCommentModels['Read']>>(
        queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>,
        limit ?: number,
        config ?: Config,
    ): [
        MaybePaginated<modelTypes.DevCommentModels['Read'][], Config>,
        Omit<ReturnType<typeof useSuspenseQuery>, 'data'>
    ],
        devCommentGetFirstN(
            queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>,
            limit ?: number,
            config ?: never
        ): [
            modelTypes.DevCommentModels['Read'][],
            Omit<ReturnType<typeof useSuspenseQuery>, 'data'>
        ]
    devCommentGetFirstN<Config extends RequestConfigRead<modelTypes.DevCommentModels['Read']>>(
        queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>,
        limit ?: number,
        config ?: Config
    ): [
        MaybePaginated<modelTypes.DevCommentModels['Read'][], Config>,
        Omit<ReturnType<typeof useSuspenseQuery>, 'data'>
    ],
        devCommentCount(
            queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>,
            filter ?: AsFilter<modelTypes.DevCommentModels['Write']>
        ): [
            number,
            Omit<ReturnType<typeof useSuspenseQuery>, 'data'>
        ],
            devCommentGetById<Config extends RequestConfigGetOne<modelTypes.DevCommentModels['Read']>>(
                queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>,
                id: string,
                config ?: Config
            ): [
                Config['triggerErrorIfNotSet'] extends true ? modelTypes.DevCommentModels['Read'] : modelTypes.DevCommentModels['Read'] | undefined,
                Omit<ReturnType<typeof useSuspenseQuery>, 'data'>
            ],
                devCommentGetOne<Config extends Omit<RequestConfigGetOne<modelTypes.DevCommentModels['Read']>, 'filter'>>(
                    queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>,
                    filter ?: AsFilter<modelTypes.DevCommentModels['Write']>, // WRITE HERE because it will ensure referenced fields are passed as their string counterpart
                    config ?: Config
                ): [
                    Config['triggerErrorIfNotSet'] extends true ? modelTypes.DevCommentModels['Read'] : modelTypes.DevCommentModels['Read'] | undefined,
                    Omit<ReturnType<typeof useSuspenseQuery>, 'data'>
                ],
                    deviceGetAll(
                        queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>,
                        filter ?: AsFilter<modelTypes.DeviceModels['Write']>,
                        config ?: never
                    ): [
                        modelTypes.DeviceModels['Read'][],
                        Omit<ReturnType<typeof useSuspenseQuery>, 'data'>
                    ]
    deviceGetAll<Config extends Omit<RequestConfigRead<modelTypes.DeviceModels['Read']>, 'filter'>>(
        queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>,
        filter ?: AsFilter<modelTypes.DeviceModels['Write']>,
        config ?: Config
    ): [
        MaybePaginated<modelTypes.DeviceModels['Read'][], Config>,
        Omit<ReturnType<typeof useSuspenseQuery>, 'data'>
    ],
        deviceGetLastN(
            queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>,
            limit ?: number,
            config ?: never,
        ): [
            modelTypes.DeviceModels['Read'][],
            Omit<ReturnType<typeof useSuspenseQuery>, 'data'>
        ]
    deviceGetLastN<Config extends RequestConfigRead<modelTypes.DeviceModels['Read']>>(
        queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>,
        limit ?: number,
        config ?: Config,
    ): [
        MaybePaginated<modelTypes.DeviceModels['Read'][], Config>,
        Omit<ReturnType<typeof useSuspenseQuery>, 'data'>
    ],
        deviceGetFirstN(
            queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>,
            limit ?: number,
            config ?: never
        ): [
            modelTypes.DeviceModels['Read'][],
            Omit<ReturnType<typeof useSuspenseQuery>, 'data'>
        ]
    deviceGetFirstN<Config extends RequestConfigRead<modelTypes.DeviceModels['Read']>>(
        queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>,
        limit ?: number,
        config ?: Config
    ): [
        MaybePaginated<modelTypes.DeviceModels['Read'][], Config>,
        Omit<ReturnType<typeof useSuspenseQuery>, 'data'>
    ],
        deviceCount(
            queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>,
            filter ?: AsFilter<modelTypes.DeviceModels['Write']>
        ): [
            number,
            Omit<ReturnType<typeof useSuspenseQuery>, 'data'>
        ],
            deviceGetById<Config extends RequestConfigGetOne<modelTypes.DeviceModels['Read']>>(
                queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>,
                id: string,
                config ?: Config
            ): [
                Config['triggerErrorIfNotSet'] extends true ? modelTypes.DeviceModels['Read'] : modelTypes.DeviceModels['Read'] | undefined,
                Omit<ReturnType<typeof useSuspenseQuery>, 'data'>
            ],
                deviceGetOne<Config extends Omit<RequestConfigGetOne<modelTypes.DeviceModels['Read']>, 'filter'>>(
                    queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>,
                    filter ?: AsFilter<modelTypes.DeviceModels['Write']>, // WRITE HERE because it will ensure referenced fields are passed as their string counterpart
                    config ?: Config
                ): [
                    Config['triggerErrorIfNotSet'] extends true ? modelTypes.DeviceModels['Read'] : modelTypes.DeviceModels['Read'] | undefined,
                    Omit<ReturnType<typeof useSuspenseQuery>, 'data'>
                ],
                    icoBonusCodeGetAll(
                        queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>,
                        filter ?: AsFilter<modelTypes.IcoBonusCodeModels['Write']>,
                        config ?: never
                    ): [
                        modelTypes.IcoBonusCodeModels['Read'][],
                        Omit<ReturnType<typeof useSuspenseQuery>, 'data'>
                    ]
    icoBonusCodeGetAll<Config extends Omit<RequestConfigRead<modelTypes.IcoBonusCodeModels['Read']>, 'filter'>>(
        queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>,
        filter ?: AsFilter<modelTypes.IcoBonusCodeModels['Write']>,
        config ?: Config
    ): [
        MaybePaginated<modelTypes.IcoBonusCodeModels['Read'][], Config>,
        Omit<ReturnType<typeof useSuspenseQuery>, 'data'>
    ],
        icoBonusCodeGetLastN(
            queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>,
            limit ?: number,
            config ?: never,
        ): [
            modelTypes.IcoBonusCodeModels['Read'][],
            Omit<ReturnType<typeof useSuspenseQuery>, 'data'>
        ]
    icoBonusCodeGetLastN<Config extends RequestConfigRead<modelTypes.IcoBonusCodeModels['Read']>>(
        queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>,
        limit ?: number,
        config ?: Config,
    ): [
        MaybePaginated<modelTypes.IcoBonusCodeModels['Read'][], Config>,
        Omit<ReturnType<typeof useSuspenseQuery>, 'data'>
    ],
        icoBonusCodeGetFirstN(
            queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>,
            limit ?: number,
            config ?: never
        ): [
            modelTypes.IcoBonusCodeModels['Read'][],
            Omit<ReturnType<typeof useSuspenseQuery>, 'data'>
        ]
    icoBonusCodeGetFirstN<Config extends RequestConfigRead<modelTypes.IcoBonusCodeModels['Read']>>(
        queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>,
        limit ?: number,
        config ?: Config
    ): [
        MaybePaginated<modelTypes.IcoBonusCodeModels['Read'][], Config>,
        Omit<ReturnType<typeof useSuspenseQuery>, 'data'>
    ],
        icoBonusCodeCount(
            queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>,
            filter ?: AsFilter<modelTypes.IcoBonusCodeModels['Write']>
        ): [
            number,
            Omit<ReturnType<typeof useSuspenseQuery>, 'data'>
        ],
            icoBonusCodeGetById<Config extends RequestConfigGetOne<modelTypes.IcoBonusCodeModels['Read']>>(
                queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>,
                id: string,
                config ?: Config
            ): [
                Config['triggerErrorIfNotSet'] extends true ? modelTypes.IcoBonusCodeModels['Read'] : modelTypes.IcoBonusCodeModels['Read'] | undefined,
                Omit<ReturnType<typeof useSuspenseQuery>, 'data'>
            ],
                icoBonusCodeGetOne<Config extends Omit<RequestConfigGetOne<modelTypes.IcoBonusCodeModels['Read']>, 'filter'>>(
                    queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>,
                    filter ?: AsFilter<modelTypes.IcoBonusCodeModels['Write']>, // WRITE HERE because it will ensure referenced fields are passed as their string counterpart
                    config ?: Config
                ): [
                    Config['triggerErrorIfNotSet'] extends true ? modelTypes.IcoBonusCodeModels['Read'] : modelTypes.IcoBonusCodeModels['Read'] | undefined,
                    Omit<ReturnType<typeof useSuspenseQuery>, 'data'>
                ],
                    icoDashboardConfigGetAll(
                        queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>,
                        filter ?: AsFilter<modelTypes.IcoDashboardConfigModels['Write']>,
                        config ?: never
                    ): [
                        modelTypes.IcoDashboardConfigModels['Read'][],
                        Omit<ReturnType<typeof useSuspenseQuery>, 'data'>
                    ]
    icoDashboardConfigGetAll<Config extends Omit<RequestConfigRead<modelTypes.IcoDashboardConfigModels['Read']>, 'filter'>>(
        queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>,
        filter ?: AsFilter<modelTypes.IcoDashboardConfigModels['Write']>,
        config ?: Config
    ): [
        MaybePaginated<modelTypes.IcoDashboardConfigModels['Read'][], Config>,
        Omit<ReturnType<typeof useSuspenseQuery>, 'data'>
    ],
        icoDashboardConfigGetLastN(
            queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>,
            limit ?: number,
            config ?: never,
        ): [
            modelTypes.IcoDashboardConfigModels['Read'][],
            Omit<ReturnType<typeof useSuspenseQuery>, 'data'>
        ]
    icoDashboardConfigGetLastN<Config extends RequestConfigRead<modelTypes.IcoDashboardConfigModels['Read']>>(
        queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>,
        limit ?: number,
        config ?: Config,
    ): [
        MaybePaginated<modelTypes.IcoDashboardConfigModels['Read'][], Config>,
        Omit<ReturnType<typeof useSuspenseQuery>, 'data'>
    ],
        icoDashboardConfigGetFirstN(
            queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>,
            limit ?: number,
            config ?: never
        ): [
            modelTypes.IcoDashboardConfigModels['Read'][],
            Omit<ReturnType<typeof useSuspenseQuery>, 'data'>
        ]
    icoDashboardConfigGetFirstN<Config extends RequestConfigRead<modelTypes.IcoDashboardConfigModels['Read']>>(
        queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>,
        limit ?: number,
        config ?: Config
    ): [
        MaybePaginated<modelTypes.IcoDashboardConfigModels['Read'][], Config>,
        Omit<ReturnType<typeof useSuspenseQuery>, 'data'>
    ],
        icoDashboardConfigCount(
            queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>,
            filter ?: AsFilter<modelTypes.IcoDashboardConfigModels['Write']>
        ): [
            number,
            Omit<ReturnType<typeof useSuspenseQuery>, 'data'>
        ],
            icoDashboardConfigGetById<Config extends RequestConfigGetOne<modelTypes.IcoDashboardConfigModels['Read']>>(
                queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>,
                id: string,
                config ?: Config
            ): [
                Config['triggerErrorIfNotSet'] extends true ? modelTypes.IcoDashboardConfigModels['Read'] : modelTypes.IcoDashboardConfigModels['Read'] | undefined,
                Omit<ReturnType<typeof useSuspenseQuery>, 'data'>
            ],
                icoDashboardConfigGetOne<Config extends Omit<RequestConfigGetOne<modelTypes.IcoDashboardConfigModels['Read']>, 'filter'>>(
                    queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>,
                    filter ?: AsFilter<modelTypes.IcoDashboardConfigModels['Write']>, // WRITE HERE because it will ensure referenced fields are passed as their string counterpart
                    config ?: Config
                ): [
                    Config['triggerErrorIfNotSet'] extends true ? modelTypes.IcoDashboardConfigModels['Read'] : modelTypes.IcoDashboardConfigModels['Read'] | undefined,
                    Omit<ReturnType<typeof useSuspenseQuery>, 'data'>
                ],
                    icoRewardTransactionGetAll(
                        queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>,
                        filter ?: AsFilter<modelTypes.IcoRewardTransactionModels['Write']>,
                        config ?: never
                    ): [
                        modelTypes.IcoRewardTransactionModels['Read'][],
                        Omit<ReturnType<typeof useSuspenseQuery>, 'data'>
                    ]
    icoRewardTransactionGetAll<Config extends Omit<RequestConfigRead<modelTypes.IcoRewardTransactionModels['Read']>, 'filter'>>(
        queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>,
        filter ?: AsFilter<modelTypes.IcoRewardTransactionModels['Write']>,
        config ?: Config
    ): [
        MaybePaginated<modelTypes.IcoRewardTransactionModels['Read'][], Config>,
        Omit<ReturnType<typeof useSuspenseQuery>, 'data'>
    ],
        icoRewardTransactionGetLastN(
            queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>,
            limit ?: number,
            config ?: never,
        ): [
            modelTypes.IcoRewardTransactionModels['Read'][],
            Omit<ReturnType<typeof useSuspenseQuery>, 'data'>
        ]
    icoRewardTransactionGetLastN<Config extends RequestConfigRead<modelTypes.IcoRewardTransactionModels['Read']>>(
        queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>,
        limit ?: number,
        config ?: Config,
    ): [
        MaybePaginated<modelTypes.IcoRewardTransactionModels['Read'][], Config>,
        Omit<ReturnType<typeof useSuspenseQuery>, 'data'>
    ],
        icoRewardTransactionGetFirstN(
            queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>,
            limit ?: number,
            config ?: never
        ): [
            modelTypes.IcoRewardTransactionModels['Read'][],
            Omit<ReturnType<typeof useSuspenseQuery>, 'data'>
        ]
    icoRewardTransactionGetFirstN<Config extends RequestConfigRead<modelTypes.IcoRewardTransactionModels['Read']>>(
        queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>,
        limit ?: number,
        config ?: Config
    ): [
        MaybePaginated<modelTypes.IcoRewardTransactionModels['Read'][], Config>,
        Omit<ReturnType<typeof useSuspenseQuery>, 'data'>
    ],
        icoRewardTransactionCount(
            queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>,
            filter ?: AsFilter<modelTypes.IcoRewardTransactionModels['Write']>
        ): [
            number,
            Omit<ReturnType<typeof useSuspenseQuery>, 'data'>
        ],
            icoRewardTransactionGetById<Config extends RequestConfigGetOne<modelTypes.IcoRewardTransactionModels['Read']>>(
                queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>,
                id: string,
                config ?: Config
            ): [
                Config['triggerErrorIfNotSet'] extends true ? modelTypes.IcoRewardTransactionModels['Read'] : modelTypes.IcoRewardTransactionModels['Read'] | undefined,
                Omit<ReturnType<typeof useSuspenseQuery>, 'data'>
            ],
                icoRewardTransactionGetOne<Config extends Omit<RequestConfigGetOne<modelTypes.IcoRewardTransactionModels['Read']>, 'filter'>>(
                    queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>,
                    filter ?: AsFilter<modelTypes.IcoRewardTransactionModels['Write']>, // WRITE HERE because it will ensure referenced fields are passed as their string counterpart
                    config ?: Config
                ): [
                    Config['triggerErrorIfNotSet'] extends true ? modelTypes.IcoRewardTransactionModels['Read'] : modelTypes.IcoRewardTransactionModels['Read'] | undefined,
                    Omit<ReturnType<typeof useSuspenseQuery>, 'data'>
                ],
                    icoTransactionGetAll(
                        queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>,
                        filter ?: AsFilter<modelTypes.IcoTransactionModels['Write']>,
                        config ?: never
                    ): [
                        modelTypes.IcoTransactionModels['Read'][],
                        Omit<ReturnType<typeof useSuspenseQuery>, 'data'>
                    ]
    icoTransactionGetAll<Config extends Omit<RequestConfigRead<modelTypes.IcoTransactionModels['Read']>, 'filter'>>(
        queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>,
        filter ?: AsFilter<modelTypes.IcoTransactionModels['Write']>,
        config ?: Config
    ): [
        MaybePaginated<modelTypes.IcoTransactionModels['Read'][], Config>,
        Omit<ReturnType<typeof useSuspenseQuery>, 'data'>
    ],
        icoTransactionGetLastN(
            queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>,
            limit ?: number,
            config ?: never,
        ): [
            modelTypes.IcoTransactionModels['Read'][],
            Omit<ReturnType<typeof useSuspenseQuery>, 'data'>
        ]
    icoTransactionGetLastN<Config extends RequestConfigRead<modelTypes.IcoTransactionModels['Read']>>(
        queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>,
        limit ?: number,
        config ?: Config,
    ): [
        MaybePaginated<modelTypes.IcoTransactionModels['Read'][], Config>,
        Omit<ReturnType<typeof useSuspenseQuery>, 'data'>
    ],
        icoTransactionGetFirstN(
            queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>,
            limit ?: number,
            config ?: never
        ): [
            modelTypes.IcoTransactionModels['Read'][],
            Omit<ReturnType<typeof useSuspenseQuery>, 'data'>
        ]
    icoTransactionGetFirstN<Config extends RequestConfigRead<modelTypes.IcoTransactionModels['Read']>>(
        queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>,
        limit ?: number,
        config ?: Config
    ): [
        MaybePaginated<modelTypes.IcoTransactionModels['Read'][], Config>,
        Omit<ReturnType<typeof useSuspenseQuery>, 'data'>
    ],
        icoTransactionCount(
            queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>,
            filter ?: AsFilter<modelTypes.IcoTransactionModels['Write']>
        ): [
            number,
            Omit<ReturnType<typeof useSuspenseQuery>, 'data'>
        ],
            icoTransactionGetById<Config extends RequestConfigGetOne<modelTypes.IcoTransactionModels['Read']>>(
                queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>,
                id: string,
                config ?: Config
            ): [
                Config['triggerErrorIfNotSet'] extends true ? modelTypes.IcoTransactionModels['Read'] : modelTypes.IcoTransactionModels['Read'] | undefined,
                Omit<ReturnType<typeof useSuspenseQuery>, 'data'>
            ],
                icoTransactionGetOne<Config extends Omit<RequestConfigGetOne<modelTypes.IcoTransactionModels['Read']>, 'filter'>>(
                    queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>,
                    filter ?: AsFilter<modelTypes.IcoTransactionModels['Write']>, // WRITE HERE because it will ensure referenced fields are passed as their string counterpart
                    config ?: Config
                ): [
                    Config['triggerErrorIfNotSet'] extends true ? modelTypes.IcoTransactionModels['Read'] : modelTypes.IcoTransactionModels['Read'] | undefined,
                    Omit<ReturnType<typeof useSuspenseQuery>, 'data'>
                ],
                    icoWalletTransactionToValidateManuallyGetAll(
                        queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>,
                        filter ?: AsFilter<modelTypes.IcoWalletTransactionToValidateManuallyModels['Write']>,
                        config ?: never
                    ): [
                        modelTypes.IcoWalletTransactionToValidateManuallyModels['Read'][],
                        Omit<ReturnType<typeof useSuspenseQuery>, 'data'>
                    ]
    icoWalletTransactionToValidateManuallyGetAll<Config extends Omit<RequestConfigRead<modelTypes.IcoWalletTransactionToValidateManuallyModels['Read']>, 'filter'>>(
        queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>,
        filter ?: AsFilter<modelTypes.IcoWalletTransactionToValidateManuallyModels['Write']>,
        config ?: Config
    ): [
        MaybePaginated<modelTypes.IcoWalletTransactionToValidateManuallyModels['Read'][], Config>,
        Omit<ReturnType<typeof useSuspenseQuery>, 'data'>
    ],
        icoWalletTransactionToValidateManuallyGetLastN(
            queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>,
            limit ?: number,
            config ?: never,
        ): [
            modelTypes.IcoWalletTransactionToValidateManuallyModels['Read'][],
            Omit<ReturnType<typeof useSuspenseQuery>, 'data'>
        ]
    icoWalletTransactionToValidateManuallyGetLastN<Config extends RequestConfigRead<modelTypes.IcoWalletTransactionToValidateManuallyModels['Read']>>(
        queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>,
        limit ?: number,
        config ?: Config,
    ): [
        MaybePaginated<modelTypes.IcoWalletTransactionToValidateManuallyModels['Read'][], Config>,
        Omit<ReturnType<typeof useSuspenseQuery>, 'data'>
    ],
        icoWalletTransactionToValidateManuallyGetFirstN(
            queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>,
            limit ?: number,
            config ?: never
        ): [
            modelTypes.IcoWalletTransactionToValidateManuallyModels['Read'][],
            Omit<ReturnType<typeof useSuspenseQuery>, 'data'>
        ]
    icoWalletTransactionToValidateManuallyGetFirstN<Config extends RequestConfigRead<modelTypes.IcoWalletTransactionToValidateManuallyModels['Read']>>(
        queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>,
        limit ?: number,
        config ?: Config
    ): [
        MaybePaginated<modelTypes.IcoWalletTransactionToValidateManuallyModels['Read'][], Config>,
        Omit<ReturnType<typeof useSuspenseQuery>, 'data'>
    ],
        icoWalletTransactionToValidateManuallyCount(
            queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>,
            filter ?: AsFilter<modelTypes.IcoWalletTransactionToValidateManuallyModels['Write']>
        ): [
            number,
            Omit<ReturnType<typeof useSuspenseQuery>, 'data'>
        ],
            icoWalletTransactionToValidateManuallyGetById<Config extends RequestConfigGetOne<modelTypes.IcoWalletTransactionToValidateManuallyModels['Read']>>(
                queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>,
                id: string,
                config ?: Config
            ): [
                Config['triggerErrorIfNotSet'] extends true ? modelTypes.IcoWalletTransactionToValidateManuallyModels['Read'] : modelTypes.IcoWalletTransactionToValidateManuallyModels['Read'] | undefined,
                Omit<ReturnType<typeof useSuspenseQuery>, 'data'>
            ],
                icoWalletTransactionToValidateManuallyGetOne<Config extends Omit<RequestConfigGetOne<modelTypes.IcoWalletTransactionToValidateManuallyModels['Read']>, 'filter'>>(
                    queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>,
                    filter ?: AsFilter<modelTypes.IcoWalletTransactionToValidateManuallyModels['Write']>, // WRITE HERE because it will ensure referenced fields are passed as their string counterpart
                    config ?: Config
                ): [
                    Config['triggerErrorIfNotSet'] extends true ? modelTypes.IcoWalletTransactionToValidateManuallyModels['Read'] : modelTypes.IcoWalletTransactionToValidateManuallyModels['Read'] | undefined,
                    Omit<ReturnType<typeof useSuspenseQuery>, 'data'>
                ],
                    interestTransactionGetAll(
                        queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>,
                        filter ?: AsFilter<modelTypes.InterestTransactionModels['Write']>,
                        config ?: never
                    ): [
                        modelTypes.InterestTransactionModels['Read'][],
                        Omit<ReturnType<typeof useSuspenseQuery>, 'data'>
                    ]
    interestTransactionGetAll<Config extends Omit<RequestConfigRead<modelTypes.InterestTransactionModels['Read']>, 'filter'>>(
        queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>,
        filter ?: AsFilter<modelTypes.InterestTransactionModels['Write']>,
        config ?: Config
    ): [
        MaybePaginated<modelTypes.InterestTransactionModels['Read'][], Config>,
        Omit<ReturnType<typeof useSuspenseQuery>, 'data'>
    ],
        interestTransactionGetLastN(
            queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>,
            limit ?: number,
            config ?: never,
        ): [
            modelTypes.InterestTransactionModels['Read'][],
            Omit<ReturnType<typeof useSuspenseQuery>, 'data'>
        ]
    interestTransactionGetLastN<Config extends RequestConfigRead<modelTypes.InterestTransactionModels['Read']>>(
        queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>,
        limit ?: number,
        config ?: Config,
    ): [
        MaybePaginated<modelTypes.InterestTransactionModels['Read'][], Config>,
        Omit<ReturnType<typeof useSuspenseQuery>, 'data'>
    ],
        interestTransactionGetFirstN(
            queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>,
            limit ?: number,
            config ?: never
        ): [
            modelTypes.InterestTransactionModels['Read'][],
            Omit<ReturnType<typeof useSuspenseQuery>, 'data'>
        ]
    interestTransactionGetFirstN<Config extends RequestConfigRead<modelTypes.InterestTransactionModels['Read']>>(
        queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>,
        limit ?: number,
        config ?: Config
    ): [
        MaybePaginated<modelTypes.InterestTransactionModels['Read'][], Config>,
        Omit<ReturnType<typeof useSuspenseQuery>, 'data'>
    ],
        interestTransactionCount(
            queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>,
            filter ?: AsFilter<modelTypes.InterestTransactionModels['Write']>
        ): [
            number,
            Omit<ReturnType<typeof useSuspenseQuery>, 'data'>
        ],
            interestTransactionGetById<Config extends RequestConfigGetOne<modelTypes.InterestTransactionModels['Read']>>(
                queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>,
                id: string,
                config ?: Config
            ): [
                Config['triggerErrorIfNotSet'] extends true ? modelTypes.InterestTransactionModels['Read'] : modelTypes.InterestTransactionModels['Read'] | undefined,
                Omit<ReturnType<typeof useSuspenseQuery>, 'data'>
            ],
                interestTransactionGetOne<Config extends Omit<RequestConfigGetOne<modelTypes.InterestTransactionModels['Read']>, 'filter'>>(
                    queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>,
                    filter ?: AsFilter<modelTypes.InterestTransactionModels['Write']>, // WRITE HERE because it will ensure referenced fields are passed as their string counterpart
                    config ?: Config
                ): [
                    Config['triggerErrorIfNotSet'] extends true ? modelTypes.InterestTransactionModels['Read'] : modelTypes.InterestTransactionModels['Read'] | undefined,
                    Omit<ReturnType<typeof useSuspenseQuery>, 'data'>
                ],
                    investmentBondsGetAll(
                        queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>,
                        filter ?: AsFilter<modelTypes.InvestmentBondsModels['Write']>,
                        config ?: never
                    ): [
                        modelTypes.InvestmentBondsModels['Read'][],
                        Omit<ReturnType<typeof useSuspenseQuery>, 'data'>
                    ]
    investmentBondsGetAll<Config extends Omit<RequestConfigRead<modelTypes.InvestmentBondsModels['Read']>, 'filter'>>(
        queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>,
        filter ?: AsFilter<modelTypes.InvestmentBondsModels['Write']>,
        config ?: Config
    ): [
        MaybePaginated<modelTypes.InvestmentBondsModels['Read'][], Config>,
        Omit<ReturnType<typeof useSuspenseQuery>, 'data'>
    ],
        investmentBondsGetLastN(
            queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>,
            limit ?: number,
            config ?: never,
        ): [
            modelTypes.InvestmentBondsModels['Read'][],
            Omit<ReturnType<typeof useSuspenseQuery>, 'data'>
        ]
    investmentBondsGetLastN<Config extends RequestConfigRead<modelTypes.InvestmentBondsModels['Read']>>(
        queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>,
        limit ?: number,
        config ?: Config,
    ): [
        MaybePaginated<modelTypes.InvestmentBondsModels['Read'][], Config>,
        Omit<ReturnType<typeof useSuspenseQuery>, 'data'>
    ],
        investmentBondsGetFirstN(
            queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>,
            limit ?: number,
            config ?: never
        ): [
            modelTypes.InvestmentBondsModels['Read'][],
            Omit<ReturnType<typeof useSuspenseQuery>, 'data'>
        ]
    investmentBondsGetFirstN<Config extends RequestConfigRead<modelTypes.InvestmentBondsModels['Read']>>(
        queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>,
        limit ?: number,
        config ?: Config
    ): [
        MaybePaginated<modelTypes.InvestmentBondsModels['Read'][], Config>,
        Omit<ReturnType<typeof useSuspenseQuery>, 'data'>
    ],
        investmentBondsCount(
            queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>,
            filter ?: AsFilter<modelTypes.InvestmentBondsModels['Write']>
        ): [
            number,
            Omit<ReturnType<typeof useSuspenseQuery>, 'data'>
        ],
            investmentBondsGetById<Config extends RequestConfigGetOne<modelTypes.InvestmentBondsModels['Read']>>(
                queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>,
                id: string,
                config ?: Config
            ): [
                Config['triggerErrorIfNotSet'] extends true ? modelTypes.InvestmentBondsModels['Read'] : modelTypes.InvestmentBondsModels['Read'] | undefined,
                Omit<ReturnType<typeof useSuspenseQuery>, 'data'>
            ],
                investmentBondsGetOne<Config extends Omit<RequestConfigGetOne<modelTypes.InvestmentBondsModels['Read']>, 'filter'>>(
                    queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>,
                    filter ?: AsFilter<modelTypes.InvestmentBondsModels['Write']>, // WRITE HERE because it will ensure referenced fields are passed as their string counterpart
                    config ?: Config
                ): [
                    Config['triggerErrorIfNotSet'] extends true ? modelTypes.InvestmentBondsModels['Read'] : modelTypes.InvestmentBondsModels['Read'] | undefined,
                    Omit<ReturnType<typeof useSuspenseQuery>, 'data'>
                ],
                    investmentEquityGetAll(
                        queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>,
                        filter ?: AsFilter<modelTypes.InvestmentEquityModels['Write']>,
                        config ?: never
                    ): [
                        modelTypes.InvestmentEquityModels['Read'][],
                        Omit<ReturnType<typeof useSuspenseQuery>, 'data'>
                    ]
    investmentEquityGetAll<Config extends Omit<RequestConfigRead<modelTypes.InvestmentEquityModels['Read']>, 'filter'>>(
        queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>,
        filter ?: AsFilter<modelTypes.InvestmentEquityModels['Write']>,
        config ?: Config
    ): [
        MaybePaginated<modelTypes.InvestmentEquityModels['Read'][], Config>,
        Omit<ReturnType<typeof useSuspenseQuery>, 'data'>
    ],
        investmentEquityGetLastN(
            queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>,
            limit ?: number,
            config ?: never,
        ): [
            modelTypes.InvestmentEquityModels['Read'][],
            Omit<ReturnType<typeof useSuspenseQuery>, 'data'>
        ]
    investmentEquityGetLastN<Config extends RequestConfigRead<modelTypes.InvestmentEquityModels['Read']>>(
        queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>,
        limit ?: number,
        config ?: Config,
    ): [
        MaybePaginated<modelTypes.InvestmentEquityModels['Read'][], Config>,
        Omit<ReturnType<typeof useSuspenseQuery>, 'data'>
    ],
        investmentEquityGetFirstN(
            queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>,
            limit ?: number,
            config ?: never
        ): [
            modelTypes.InvestmentEquityModels['Read'][],
            Omit<ReturnType<typeof useSuspenseQuery>, 'data'>
        ]
    investmentEquityGetFirstN<Config extends RequestConfigRead<modelTypes.InvestmentEquityModels['Read']>>(
        queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>,
        limit ?: number,
        config ?: Config
    ): [
        MaybePaginated<modelTypes.InvestmentEquityModels['Read'][], Config>,
        Omit<ReturnType<typeof useSuspenseQuery>, 'data'>
    ],
        investmentEquityCount(
            queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>,
            filter ?: AsFilter<modelTypes.InvestmentEquityModels['Write']>
        ): [
            number,
            Omit<ReturnType<typeof useSuspenseQuery>, 'data'>
        ],
            investmentEquityGetById<Config extends RequestConfigGetOne<modelTypes.InvestmentEquityModels['Read']>>(
                queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>,
                id: string,
                config ?: Config
            ): [
                Config['triggerErrorIfNotSet'] extends true ? modelTypes.InvestmentEquityModels['Read'] : modelTypes.InvestmentEquityModels['Read'] | undefined,
                Omit<ReturnType<typeof useSuspenseQuery>, 'data'>
            ],
                investmentEquityGetOne<Config extends Omit<RequestConfigGetOne<modelTypes.InvestmentEquityModels['Read']>, 'filter'>>(
                    queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>,
                    filter ?: AsFilter<modelTypes.InvestmentEquityModels['Write']>, // WRITE HERE because it will ensure referenced fields are passed as their string counterpart
                    config ?: Config
                ): [
                    Config['triggerErrorIfNotSet'] extends true ? modelTypes.InvestmentEquityModels['Read'] : modelTypes.InvestmentEquityModels['Read'] | undefined,
                    Omit<ReturnType<typeof useSuspenseQuery>, 'data'>
                ],
                    investmentFundSharesGetAll(
                        queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>,
                        filter ?: AsFilter<modelTypes.InvestmentFundSharesModels['Write']>,
                        config ?: never
                    ): [
                        modelTypes.InvestmentFundSharesModels['Read'][],
                        Omit<ReturnType<typeof useSuspenseQuery>, 'data'>
                    ]
    investmentFundSharesGetAll<Config extends Omit<RequestConfigRead<modelTypes.InvestmentFundSharesModels['Read']>, 'filter'>>(
        queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>,
        filter ?: AsFilter<modelTypes.InvestmentFundSharesModels['Write']>,
        config ?: Config
    ): [
        MaybePaginated<modelTypes.InvestmentFundSharesModels['Read'][], Config>,
        Omit<ReturnType<typeof useSuspenseQuery>, 'data'>
    ],
        investmentFundSharesGetLastN(
            queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>,
            limit ?: number,
            config ?: never,
        ): [
            modelTypes.InvestmentFundSharesModels['Read'][],
            Omit<ReturnType<typeof useSuspenseQuery>, 'data'>
        ]
    investmentFundSharesGetLastN<Config extends RequestConfigRead<modelTypes.InvestmentFundSharesModels['Read']>>(
        queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>,
        limit ?: number,
        config ?: Config,
    ): [
        MaybePaginated<modelTypes.InvestmentFundSharesModels['Read'][], Config>,
        Omit<ReturnType<typeof useSuspenseQuery>, 'data'>
    ],
        investmentFundSharesGetFirstN(
            queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>,
            limit ?: number,
            config ?: never
        ): [
            modelTypes.InvestmentFundSharesModels['Read'][],
            Omit<ReturnType<typeof useSuspenseQuery>, 'data'>
        ]
    investmentFundSharesGetFirstN<Config extends RequestConfigRead<modelTypes.InvestmentFundSharesModels['Read']>>(
        queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>,
        limit ?: number,
        config ?: Config
    ): [
        MaybePaginated<modelTypes.InvestmentFundSharesModels['Read'][], Config>,
        Omit<ReturnType<typeof useSuspenseQuery>, 'data'>
    ],
        investmentFundSharesCount(
            queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>,
            filter ?: AsFilter<modelTypes.InvestmentFundSharesModels['Write']>
        ): [
            number,
            Omit<ReturnType<typeof useSuspenseQuery>, 'data'>
        ],
            investmentFundSharesGetById<Config extends RequestConfigGetOne<modelTypes.InvestmentFundSharesModels['Read']>>(
                queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>,
                id: string,
                config ?: Config
            ): [
                Config['triggerErrorIfNotSet'] extends true ? modelTypes.InvestmentFundSharesModels['Read'] : modelTypes.InvestmentFundSharesModels['Read'] | undefined,
                Omit<ReturnType<typeof useSuspenseQuery>, 'data'>
            ],
                investmentFundSharesGetOne<Config extends Omit<RequestConfigGetOne<modelTypes.InvestmentFundSharesModels['Read']>, 'filter'>>(
                    queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>,
                    filter ?: AsFilter<modelTypes.InvestmentFundSharesModels['Write']>, // WRITE HERE because it will ensure referenced fields are passed as their string counterpart
                    config ?: Config
                ): [
                    Config['triggerErrorIfNotSet'] extends true ? modelTypes.InvestmentFundSharesModels['Read'] : modelTypes.InvestmentFundSharesModels['Read'] | undefined,
                    Omit<ReturnType<typeof useSuspenseQuery>, 'data'>
                ],
                    investmentProjectBondsGetAll(
                        queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>,
                        filter ?: AsFilter<modelTypes.InvestmentProjectBondsModels['Write']>,
                        config ?: never
                    ): [
                        modelTypes.InvestmentProjectBondsModels['Read'][],
                        Omit<ReturnType<typeof useSuspenseQuery>, 'data'>
                    ]
    investmentProjectBondsGetAll<Config extends Omit<RequestConfigRead<modelTypes.InvestmentProjectBondsModels['Read']>, 'filter'>>(
        queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>,
        filter ?: AsFilter<modelTypes.InvestmentProjectBondsModels['Write']>,
        config ?: Config
    ): [
        MaybePaginated<modelTypes.InvestmentProjectBondsModels['Read'][], Config>,
        Omit<ReturnType<typeof useSuspenseQuery>, 'data'>
    ],
        investmentProjectBondsGetLastN(
            queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>,
            limit ?: number,
            config ?: never,
        ): [
            modelTypes.InvestmentProjectBondsModels['Read'][],
            Omit<ReturnType<typeof useSuspenseQuery>, 'data'>
        ]
    investmentProjectBondsGetLastN<Config extends RequestConfigRead<modelTypes.InvestmentProjectBondsModels['Read']>>(
        queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>,
        limit ?: number,
        config ?: Config,
    ): [
        MaybePaginated<modelTypes.InvestmentProjectBondsModels['Read'][], Config>,
        Omit<ReturnType<typeof useSuspenseQuery>, 'data'>
    ],
        investmentProjectBondsGetFirstN(
            queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>,
            limit ?: number,
            config ?: never
        ): [
            modelTypes.InvestmentProjectBondsModels['Read'][],
            Omit<ReturnType<typeof useSuspenseQuery>, 'data'>
        ]
    investmentProjectBondsGetFirstN<Config extends RequestConfigRead<modelTypes.InvestmentProjectBondsModels['Read']>>(
        queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>,
        limit ?: number,
        config ?: Config
    ): [
        MaybePaginated<modelTypes.InvestmentProjectBondsModels['Read'][], Config>,
        Omit<ReturnType<typeof useSuspenseQuery>, 'data'>
    ],
        investmentProjectBondsCount(
            queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>,
            filter ?: AsFilter<modelTypes.InvestmentProjectBondsModels['Write']>
        ): [
            number,
            Omit<ReturnType<typeof useSuspenseQuery>, 'data'>
        ],
            investmentProjectBondsGetById<Config extends RequestConfigGetOne<modelTypes.InvestmentProjectBondsModels['Read']>>(
                queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>,
                id: string,
                config ?: Config
            ): [
                Config['triggerErrorIfNotSet'] extends true ? modelTypes.InvestmentProjectBondsModels['Read'] : modelTypes.InvestmentProjectBondsModels['Read'] | undefined,
                Omit<ReturnType<typeof useSuspenseQuery>, 'data'>
            ],
                investmentProjectBondsGetOne<Config extends Omit<RequestConfigGetOne<modelTypes.InvestmentProjectBondsModels['Read']>, 'filter'>>(
                    queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>,
                    filter ?: AsFilter<modelTypes.InvestmentProjectBondsModels['Write']>, // WRITE HERE because it will ensure referenced fields are passed as their string counterpart
                    config ?: Config
                ): [
                    Config['triggerErrorIfNotSet'] extends true ? modelTypes.InvestmentProjectBondsModels['Read'] : modelTypes.InvestmentProjectBondsModels['Read'] | undefined,
                    Omit<ReturnType<typeof useSuspenseQuery>, 'data'>
                ],
                    investmentProjectEquityGetAll(
                        queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>,
                        filter ?: AsFilter<modelTypes.InvestmentProjectEquityModels['Write']>,
                        config ?: never
                    ): [
                        modelTypes.InvestmentProjectEquityModels['Read'][],
                        Omit<ReturnType<typeof useSuspenseQuery>, 'data'>
                    ]
    investmentProjectEquityGetAll<Config extends Omit<RequestConfigRead<modelTypes.InvestmentProjectEquityModels['Read']>, 'filter'>>(
        queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>,
        filter ?: AsFilter<modelTypes.InvestmentProjectEquityModels['Write']>,
        config ?: Config
    ): [
        MaybePaginated<modelTypes.InvestmentProjectEquityModels['Read'][], Config>,
        Omit<ReturnType<typeof useSuspenseQuery>, 'data'>
    ],
        investmentProjectEquityGetLastN(
            queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>,
            limit ?: number,
            config ?: never,
        ): [
            modelTypes.InvestmentProjectEquityModels['Read'][],
            Omit<ReturnType<typeof useSuspenseQuery>, 'data'>
        ]
    investmentProjectEquityGetLastN<Config extends RequestConfigRead<modelTypes.InvestmentProjectEquityModels['Read']>>(
        queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>,
        limit ?: number,
        config ?: Config,
    ): [
        MaybePaginated<modelTypes.InvestmentProjectEquityModels['Read'][], Config>,
        Omit<ReturnType<typeof useSuspenseQuery>, 'data'>
    ],
        investmentProjectEquityGetFirstN(
            queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>,
            limit ?: number,
            config ?: never
        ): [
            modelTypes.InvestmentProjectEquityModels['Read'][],
            Omit<ReturnType<typeof useSuspenseQuery>, 'data'>
        ]
    investmentProjectEquityGetFirstN<Config extends RequestConfigRead<modelTypes.InvestmentProjectEquityModels['Read']>>(
        queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>,
        limit ?: number,
        config ?: Config
    ): [
        MaybePaginated<modelTypes.InvestmentProjectEquityModels['Read'][], Config>,
        Omit<ReturnType<typeof useSuspenseQuery>, 'data'>
    ],
        investmentProjectEquityCount(
            queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>,
            filter ?: AsFilter<modelTypes.InvestmentProjectEquityModels['Write']>
        ): [
            number,
            Omit<ReturnType<typeof useSuspenseQuery>, 'data'>
        ],
            investmentProjectEquityGetById<Config extends RequestConfigGetOne<modelTypes.InvestmentProjectEquityModels['Read']>>(
                queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>,
                id: string,
                config ?: Config
            ): [
                Config['triggerErrorIfNotSet'] extends true ? modelTypes.InvestmentProjectEquityModels['Read'] : modelTypes.InvestmentProjectEquityModels['Read'] | undefined,
                Omit<ReturnType<typeof useSuspenseQuery>, 'data'>
            ],
                investmentProjectEquityGetOne<Config extends Omit<RequestConfigGetOne<modelTypes.InvestmentProjectEquityModels['Read']>, 'filter'>>(
                    queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>,
                    filter ?: AsFilter<modelTypes.InvestmentProjectEquityModels['Write']>, // WRITE HERE because it will ensure referenced fields are passed as their string counterpart
                    config ?: Config
                ): [
                    Config['triggerErrorIfNotSet'] extends true ? modelTypes.InvestmentProjectEquityModels['Read'] : modelTypes.InvestmentProjectEquityModels['Read'] | undefined,
                    Omit<ReturnType<typeof useSuspenseQuery>, 'data'>
                ],
                    investmentProjectFundSharesGetAll(
                        queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>,
                        filter ?: AsFilter<modelTypes.InvestmentProjectFundSharesModels['Write']>,
                        config ?: never
                    ): [
                        modelTypes.InvestmentProjectFundSharesModels['Read'][],
                        Omit<ReturnType<typeof useSuspenseQuery>, 'data'>
                    ]
    investmentProjectFundSharesGetAll<Config extends Omit<RequestConfigRead<modelTypes.InvestmentProjectFundSharesModels['Read']>, 'filter'>>(
        queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>,
        filter ?: AsFilter<modelTypes.InvestmentProjectFundSharesModels['Write']>,
        config ?: Config
    ): [
        MaybePaginated<modelTypes.InvestmentProjectFundSharesModels['Read'][], Config>,
        Omit<ReturnType<typeof useSuspenseQuery>, 'data'>
    ],
        investmentProjectFundSharesGetLastN(
            queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>,
            limit ?: number,
            config ?: never,
        ): [
            modelTypes.InvestmentProjectFundSharesModels['Read'][],
            Omit<ReturnType<typeof useSuspenseQuery>, 'data'>
        ]
    investmentProjectFundSharesGetLastN<Config extends RequestConfigRead<modelTypes.InvestmentProjectFundSharesModels['Read']>>(
        queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>,
        limit ?: number,
        config ?: Config,
    ): [
        MaybePaginated<modelTypes.InvestmentProjectFundSharesModels['Read'][], Config>,
        Omit<ReturnType<typeof useSuspenseQuery>, 'data'>
    ],
        investmentProjectFundSharesGetFirstN(
            queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>,
            limit ?: number,
            config ?: never
        ): [
            modelTypes.InvestmentProjectFundSharesModels['Read'][],
            Omit<ReturnType<typeof useSuspenseQuery>, 'data'>
        ]
    investmentProjectFundSharesGetFirstN<Config extends RequestConfigRead<modelTypes.InvestmentProjectFundSharesModels['Read']>>(
        queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>,
        limit ?: number,
        config ?: Config
    ): [
        MaybePaginated<modelTypes.InvestmentProjectFundSharesModels['Read'][], Config>,
        Omit<ReturnType<typeof useSuspenseQuery>, 'data'>
    ],
        investmentProjectFundSharesCount(
            queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>,
            filter ?: AsFilter<modelTypes.InvestmentProjectFundSharesModels['Write']>
        ): [
            number,
            Omit<ReturnType<typeof useSuspenseQuery>, 'data'>
        ],
            investmentProjectFundSharesGetById<Config extends RequestConfigGetOne<modelTypes.InvestmentProjectFundSharesModels['Read']>>(
                queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>,
                id: string,
                config ?: Config
            ): [
                Config['triggerErrorIfNotSet'] extends true ? modelTypes.InvestmentProjectFundSharesModels['Read'] : modelTypes.InvestmentProjectFundSharesModels['Read'] | undefined,
                Omit<ReturnType<typeof useSuspenseQuery>, 'data'>
            ],
                investmentProjectFundSharesGetOne<Config extends Omit<RequestConfigGetOne<modelTypes.InvestmentProjectFundSharesModels['Read']>, 'filter'>>(
                    queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>,
                    filter ?: AsFilter<modelTypes.InvestmentProjectFundSharesModels['Write']>, // WRITE HERE because it will ensure referenced fields are passed as their string counterpart
                    config ?: Config
                ): [
                    Config['triggerErrorIfNotSet'] extends true ? modelTypes.InvestmentProjectFundSharesModels['Read'] : modelTypes.InvestmentProjectFundSharesModels['Read'] | undefined,
                    Omit<ReturnType<typeof useSuspenseQuery>, 'data'>
                ],
                    investmentTransactionBondsGetAll(
                        queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>,
                        filter ?: AsFilter<modelTypes.InvestmentTransactionBondsModels['Write']>,
                        config ?: never
                    ): [
                        modelTypes.InvestmentTransactionBondsModels['Read'][],
                        Omit<ReturnType<typeof useSuspenseQuery>, 'data'>
                    ]
    investmentTransactionBondsGetAll<Config extends Omit<RequestConfigRead<modelTypes.InvestmentTransactionBondsModels['Read']>, 'filter'>>(
        queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>,
        filter ?: AsFilter<modelTypes.InvestmentTransactionBondsModels['Write']>,
        config ?: Config
    ): [
        MaybePaginated<modelTypes.InvestmentTransactionBondsModels['Read'][], Config>,
        Omit<ReturnType<typeof useSuspenseQuery>, 'data'>
    ],
        investmentTransactionBondsGetLastN(
            queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>,
            limit ?: number,
            config ?: never,
        ): [
            modelTypes.InvestmentTransactionBondsModels['Read'][],
            Omit<ReturnType<typeof useSuspenseQuery>, 'data'>
        ]
    investmentTransactionBondsGetLastN<Config extends RequestConfigRead<modelTypes.InvestmentTransactionBondsModels['Read']>>(
        queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>,
        limit ?: number,
        config ?: Config,
    ): [
        MaybePaginated<modelTypes.InvestmentTransactionBondsModels['Read'][], Config>,
        Omit<ReturnType<typeof useSuspenseQuery>, 'data'>
    ],
        investmentTransactionBondsGetFirstN(
            queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>,
            limit ?: number,
            config ?: never
        ): [
            modelTypes.InvestmentTransactionBondsModels['Read'][],
            Omit<ReturnType<typeof useSuspenseQuery>, 'data'>
        ]
    investmentTransactionBondsGetFirstN<Config extends RequestConfigRead<modelTypes.InvestmentTransactionBondsModels['Read']>>(
        queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>,
        limit ?: number,
        config ?: Config
    ): [
        MaybePaginated<modelTypes.InvestmentTransactionBondsModels['Read'][], Config>,
        Omit<ReturnType<typeof useSuspenseQuery>, 'data'>
    ],
        investmentTransactionBondsCount(
            queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>,
            filter ?: AsFilter<modelTypes.InvestmentTransactionBondsModels['Write']>
        ): [
            number,
            Omit<ReturnType<typeof useSuspenseQuery>, 'data'>
        ],
            investmentTransactionBondsGetById<Config extends RequestConfigGetOne<modelTypes.InvestmentTransactionBondsModels['Read']>>(
                queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>,
                id: string,
                config ?: Config
            ): [
                Config['triggerErrorIfNotSet'] extends true ? modelTypes.InvestmentTransactionBondsModels['Read'] : modelTypes.InvestmentTransactionBondsModels['Read'] | undefined,
                Omit<ReturnType<typeof useSuspenseQuery>, 'data'>
            ],
                investmentTransactionBondsGetOne<Config extends Omit<RequestConfigGetOne<modelTypes.InvestmentTransactionBondsModels['Read']>, 'filter'>>(
                    queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>,
                    filter ?: AsFilter<modelTypes.InvestmentTransactionBondsModels['Write']>, // WRITE HERE because it will ensure referenced fields are passed as their string counterpart
                    config ?: Config
                ): [
                    Config['triggerErrorIfNotSet'] extends true ? modelTypes.InvestmentTransactionBondsModels['Read'] : modelTypes.InvestmentTransactionBondsModels['Read'] | undefined,
                    Omit<ReturnType<typeof useSuspenseQuery>, 'data'>
                ],
                    investmentTransactionEquityGetAll(
                        queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>,
                        filter ?: AsFilter<modelTypes.InvestmentTransactionEquityModels['Write']>,
                        config ?: never
                    ): [
                        modelTypes.InvestmentTransactionEquityModels['Read'][],
                        Omit<ReturnType<typeof useSuspenseQuery>, 'data'>
                    ]
    investmentTransactionEquityGetAll<Config extends Omit<RequestConfigRead<modelTypes.InvestmentTransactionEquityModels['Read']>, 'filter'>>(
        queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>,
        filter ?: AsFilter<modelTypes.InvestmentTransactionEquityModels['Write']>,
        config ?: Config
    ): [
        MaybePaginated<modelTypes.InvestmentTransactionEquityModels['Read'][], Config>,
        Omit<ReturnType<typeof useSuspenseQuery>, 'data'>
    ],
        investmentTransactionEquityGetLastN(
            queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>,
            limit ?: number,
            config ?: never,
        ): [
            modelTypes.InvestmentTransactionEquityModels['Read'][],
            Omit<ReturnType<typeof useSuspenseQuery>, 'data'>
        ]
    investmentTransactionEquityGetLastN<Config extends RequestConfigRead<modelTypes.InvestmentTransactionEquityModels['Read']>>(
        queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>,
        limit ?: number,
        config ?: Config,
    ): [
        MaybePaginated<modelTypes.InvestmentTransactionEquityModels['Read'][], Config>,
        Omit<ReturnType<typeof useSuspenseQuery>, 'data'>
    ],
        investmentTransactionEquityGetFirstN(
            queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>,
            limit ?: number,
            config ?: never
        ): [
            modelTypes.InvestmentTransactionEquityModels['Read'][],
            Omit<ReturnType<typeof useSuspenseQuery>, 'data'>
        ]
    investmentTransactionEquityGetFirstN<Config extends RequestConfigRead<modelTypes.InvestmentTransactionEquityModels['Read']>>(
        queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>,
        limit ?: number,
        config ?: Config
    ): [
        MaybePaginated<modelTypes.InvestmentTransactionEquityModels['Read'][], Config>,
        Omit<ReturnType<typeof useSuspenseQuery>, 'data'>
    ],
        investmentTransactionEquityCount(
            queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>,
            filter ?: AsFilter<modelTypes.InvestmentTransactionEquityModels['Write']>
        ): [
            number,
            Omit<ReturnType<typeof useSuspenseQuery>, 'data'>
        ],
            investmentTransactionEquityGetById<Config extends RequestConfigGetOne<modelTypes.InvestmentTransactionEquityModels['Read']>>(
                queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>,
                id: string,
                config ?: Config
            ): [
                Config['triggerErrorIfNotSet'] extends true ? modelTypes.InvestmentTransactionEquityModels['Read'] : modelTypes.InvestmentTransactionEquityModels['Read'] | undefined,
                Omit<ReturnType<typeof useSuspenseQuery>, 'data'>
            ],
                investmentTransactionEquityGetOne<Config extends Omit<RequestConfigGetOne<modelTypes.InvestmentTransactionEquityModels['Read']>, 'filter'>>(
                    queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>,
                    filter ?: AsFilter<modelTypes.InvestmentTransactionEquityModels['Write']>, // WRITE HERE because it will ensure referenced fields are passed as their string counterpart
                    config ?: Config
                ): [
                    Config['triggerErrorIfNotSet'] extends true ? modelTypes.InvestmentTransactionEquityModels['Read'] : modelTypes.InvestmentTransactionEquityModels['Read'] | undefined,
                    Omit<ReturnType<typeof useSuspenseQuery>, 'data'>
                ],
                    investmentTransactionFundSharesGetAll(
                        queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>,
                        filter ?: AsFilter<modelTypes.InvestmentTransactionFundSharesModels['Write']>,
                        config ?: never
                    ): [
                        modelTypes.InvestmentTransactionFundSharesModels['Read'][],
                        Omit<ReturnType<typeof useSuspenseQuery>, 'data'>
                    ]
    investmentTransactionFundSharesGetAll<Config extends Omit<RequestConfigRead<modelTypes.InvestmentTransactionFundSharesModels['Read']>, 'filter'>>(
        queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>,
        filter ?: AsFilter<modelTypes.InvestmentTransactionFundSharesModels['Write']>,
        config ?: Config
    ): [
        MaybePaginated<modelTypes.InvestmentTransactionFundSharesModels['Read'][], Config>,
        Omit<ReturnType<typeof useSuspenseQuery>, 'data'>
    ],
        investmentTransactionFundSharesGetLastN(
            queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>,
            limit ?: number,
            config ?: never,
        ): [
            modelTypes.InvestmentTransactionFundSharesModels['Read'][],
            Omit<ReturnType<typeof useSuspenseQuery>, 'data'>
        ]
    investmentTransactionFundSharesGetLastN<Config extends RequestConfigRead<modelTypes.InvestmentTransactionFundSharesModels['Read']>>(
        queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>,
        limit ?: number,
        config ?: Config,
    ): [
        MaybePaginated<modelTypes.InvestmentTransactionFundSharesModels['Read'][], Config>,
        Omit<ReturnType<typeof useSuspenseQuery>, 'data'>
    ],
        investmentTransactionFundSharesGetFirstN(
            queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>,
            limit ?: number,
            config ?: never
        ): [
            modelTypes.InvestmentTransactionFundSharesModels['Read'][],
            Omit<ReturnType<typeof useSuspenseQuery>, 'data'>
        ]
    investmentTransactionFundSharesGetFirstN<Config extends RequestConfigRead<modelTypes.InvestmentTransactionFundSharesModels['Read']>>(
        queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>,
        limit ?: number,
        config ?: Config
    ): [
        MaybePaginated<modelTypes.InvestmentTransactionFundSharesModels['Read'][], Config>,
        Omit<ReturnType<typeof useSuspenseQuery>, 'data'>
    ],
        investmentTransactionFundSharesCount(
            queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>,
            filter ?: AsFilter<modelTypes.InvestmentTransactionFundSharesModels['Write']>
        ): [
            number,
            Omit<ReturnType<typeof useSuspenseQuery>, 'data'>
        ],
            investmentTransactionFundSharesGetById<Config extends RequestConfigGetOne<modelTypes.InvestmentTransactionFundSharesModels['Read']>>(
                queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>,
                id: string,
                config ?: Config
            ): [
                Config['triggerErrorIfNotSet'] extends true ? modelTypes.InvestmentTransactionFundSharesModels['Read'] : modelTypes.InvestmentTransactionFundSharesModels['Read'] | undefined,
                Omit<ReturnType<typeof useSuspenseQuery>, 'data'>
            ],
                investmentTransactionFundSharesGetOne<Config extends Omit<RequestConfigGetOne<modelTypes.InvestmentTransactionFundSharesModels['Read']>, 'filter'>>(
                    queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>,
                    filter ?: AsFilter<modelTypes.InvestmentTransactionFundSharesModels['Write']>, // WRITE HERE because it will ensure referenced fields are passed as their string counterpart
                    config ?: Config
                ): [
                    Config['triggerErrorIfNotSet'] extends true ? modelTypes.InvestmentTransactionFundSharesModels['Read'] : modelTypes.InvestmentTransactionFundSharesModels['Read'] | undefined,
                    Omit<ReturnType<typeof useSuspenseQuery>, 'data'>
                ],
                    missionGetAll(
                        queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>,
                        filter ?: AsFilter<modelTypes.MissionModels['Write']>,
                        config ?: never
                    ): [
                        modelTypes.MissionModels['Read'][],
                        Omit<ReturnType<typeof useSuspenseQuery>, 'data'>
                    ]
    missionGetAll<Config extends Omit<RequestConfigRead<modelTypes.MissionModels['Read']>, 'filter'>>(
        queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>,
        filter ?: AsFilter<modelTypes.MissionModels['Write']>,
        config ?: Config
    ): [
        MaybePaginated<modelTypes.MissionModels['Read'][], Config>,
        Omit<ReturnType<typeof useSuspenseQuery>, 'data'>
    ],
        missionGetLastN(
            queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>,
            limit ?: number,
            config ?: never,
        ): [
            modelTypes.MissionModels['Read'][],
            Omit<ReturnType<typeof useSuspenseQuery>, 'data'>
        ]
    missionGetLastN<Config extends RequestConfigRead<modelTypes.MissionModels['Read']>>(
        queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>,
        limit ?: number,
        config ?: Config,
    ): [
        MaybePaginated<modelTypes.MissionModels['Read'][], Config>,
        Omit<ReturnType<typeof useSuspenseQuery>, 'data'>
    ],
        missionGetFirstN(
            queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>,
            limit ?: number,
            config ?: never
        ): [
            modelTypes.MissionModels['Read'][],
            Omit<ReturnType<typeof useSuspenseQuery>, 'data'>
        ]
    missionGetFirstN<Config extends RequestConfigRead<modelTypes.MissionModels['Read']>>(
        queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>,
        limit ?: number,
        config ?: Config
    ): [
        MaybePaginated<modelTypes.MissionModels['Read'][], Config>,
        Omit<ReturnType<typeof useSuspenseQuery>, 'data'>
    ],
        missionCount(
            queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>,
            filter ?: AsFilter<modelTypes.MissionModels['Write']>
        ): [
            number,
            Omit<ReturnType<typeof useSuspenseQuery>, 'data'>
        ],
            missionGetById<Config extends RequestConfigGetOne<modelTypes.MissionModels['Read']>>(
                queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>,
                id: string,
                config ?: Config
            ): [
                Config['triggerErrorIfNotSet'] extends true ? modelTypes.MissionModels['Read'] : modelTypes.MissionModels['Read'] | undefined,
                Omit<ReturnType<typeof useSuspenseQuery>, 'data'>
            ],
                missionGetOne<Config extends Omit<RequestConfigGetOne<modelTypes.MissionModels['Read']>, 'filter'>>(
                    queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>,
                    filter ?: AsFilter<modelTypes.MissionModels['Write']>, // WRITE HERE because it will ensure referenced fields are passed as their string counterpart
                    config ?: Config
                ): [
                    Config['triggerErrorIfNotSet'] extends true ? modelTypes.MissionModels['Read'] : modelTypes.MissionModels['Read'] | undefined,
                    Omit<ReturnType<typeof useSuspenseQuery>, 'data'>
                ],
                    newsGetAll(
                        queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>,
                        filter ?: AsFilter<modelTypes.NewsModels['Write']>,
                        config ?: never
                    ): [
                        modelTypes.NewsModels['Read'][],
                        Omit<ReturnType<typeof useSuspenseQuery>, 'data'>
                    ]
    newsGetAll<Config extends Omit<RequestConfigRead<modelTypes.NewsModels['Read']>, 'filter'>>(
        queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>,
        filter ?: AsFilter<modelTypes.NewsModels['Write']>,
        config ?: Config
    ): [
        MaybePaginated<modelTypes.NewsModels['Read'][], Config>,
        Omit<ReturnType<typeof useSuspenseQuery>, 'data'>
    ],
        newsGetLastN(
            queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>,
            limit ?: number,
            config ?: never,
        ): [
            modelTypes.NewsModels['Read'][],
            Omit<ReturnType<typeof useSuspenseQuery>, 'data'>
        ]
    newsGetLastN<Config extends RequestConfigRead<modelTypes.NewsModels['Read']>>(
        queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>,
        limit ?: number,
        config ?: Config,
    ): [
        MaybePaginated<modelTypes.NewsModels['Read'][], Config>,
        Omit<ReturnType<typeof useSuspenseQuery>, 'data'>
    ],
        newsGetFirstN(
            queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>,
            limit ?: number,
            config ?: never
        ): [
            modelTypes.NewsModels['Read'][],
            Omit<ReturnType<typeof useSuspenseQuery>, 'data'>
        ]
    newsGetFirstN<Config extends RequestConfigRead<modelTypes.NewsModels['Read']>>(
        queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>,
        limit ?: number,
        config ?: Config
    ): [
        MaybePaginated<modelTypes.NewsModels['Read'][], Config>,
        Omit<ReturnType<typeof useSuspenseQuery>, 'data'>
    ],
        newsCount(
            queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>,
            filter ?: AsFilter<modelTypes.NewsModels['Write']>
        ): [
            number,
            Omit<ReturnType<typeof useSuspenseQuery>, 'data'>
        ],
            newsGetById<Config extends RequestConfigGetOne<modelTypes.NewsModels['Read']>>(
                queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>,
                id: string,
                config ?: Config
            ): [
                Config['triggerErrorIfNotSet'] extends true ? modelTypes.NewsModels['Read'] : modelTypes.NewsModels['Read'] | undefined,
                Omit<ReturnType<typeof useSuspenseQuery>, 'data'>
            ],
                newsGetOne<Config extends Omit<RequestConfigGetOne<modelTypes.NewsModels['Read']>, 'filter'>>(
                    queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>,
                    filter ?: AsFilter<modelTypes.NewsModels['Write']>, // WRITE HERE because it will ensure referenced fields are passed as their string counterpart
                    config ?: Config
                ): [
                    Config['triggerErrorIfNotSet'] extends true ? modelTypes.NewsModels['Read'] : modelTypes.NewsModels['Read'] | undefined,
                    Omit<ReturnType<typeof useSuspenseQuery>, 'data'>
                ],
                    sellOfferBondsGetAll(
                        queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>,
                        filter ?: AsFilter<modelTypes.SellOfferBondsModels['Write']>,
                        config ?: never
                    ): [
                        modelTypes.SellOfferBondsModels['Read'][],
                        Omit<ReturnType<typeof useSuspenseQuery>, 'data'>
                    ]
    sellOfferBondsGetAll<Config extends Omit<RequestConfigRead<modelTypes.SellOfferBondsModels['Read']>, 'filter'>>(
        queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>,
        filter ?: AsFilter<modelTypes.SellOfferBondsModels['Write']>,
        config ?: Config
    ): [
        MaybePaginated<modelTypes.SellOfferBondsModels['Read'][], Config>,
        Omit<ReturnType<typeof useSuspenseQuery>, 'data'>
    ],
        sellOfferBondsGetLastN(
            queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>,
            limit ?: number,
            config ?: never,
        ): [
            modelTypes.SellOfferBondsModels['Read'][],
            Omit<ReturnType<typeof useSuspenseQuery>, 'data'>
        ]
    sellOfferBondsGetLastN<Config extends RequestConfigRead<modelTypes.SellOfferBondsModels['Read']>>(
        queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>,
        limit ?: number,
        config ?: Config,
    ): [
        MaybePaginated<modelTypes.SellOfferBondsModels['Read'][], Config>,
        Omit<ReturnType<typeof useSuspenseQuery>, 'data'>
    ],
        sellOfferBondsGetFirstN(
            queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>,
            limit ?: number,
            config ?: never
        ): [
            modelTypes.SellOfferBondsModels['Read'][],
            Omit<ReturnType<typeof useSuspenseQuery>, 'data'>
        ]
    sellOfferBondsGetFirstN<Config extends RequestConfigRead<modelTypes.SellOfferBondsModels['Read']>>(
        queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>,
        limit ?: number,
        config ?: Config
    ): [
        MaybePaginated<modelTypes.SellOfferBondsModels['Read'][], Config>,
        Omit<ReturnType<typeof useSuspenseQuery>, 'data'>
    ],
        sellOfferBondsCount(
            queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>,
            filter ?: AsFilter<modelTypes.SellOfferBondsModels['Write']>
        ): [
            number,
            Omit<ReturnType<typeof useSuspenseQuery>, 'data'>
        ],
            sellOfferBondsGetById<Config extends RequestConfigGetOne<modelTypes.SellOfferBondsModels['Read']>>(
                queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>,
                id: string,
                config ?: Config
            ): [
                Config['triggerErrorIfNotSet'] extends true ? modelTypes.SellOfferBondsModels['Read'] : modelTypes.SellOfferBondsModels['Read'] | undefined,
                Omit<ReturnType<typeof useSuspenseQuery>, 'data'>
            ],
                sellOfferBondsGetOne<Config extends Omit<RequestConfigGetOne<modelTypes.SellOfferBondsModels['Read']>, 'filter'>>(
                    queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>,
                    filter ?: AsFilter<modelTypes.SellOfferBondsModels['Write']>, // WRITE HERE because it will ensure referenced fields are passed as their string counterpart
                    config ?: Config
                ): [
                    Config['triggerErrorIfNotSet'] extends true ? modelTypes.SellOfferBondsModels['Read'] : modelTypes.SellOfferBondsModels['Read'] | undefined,
                    Omit<ReturnType<typeof useSuspenseQuery>, 'data'>
                ],
                    sellOfferEquityGetAll(
                        queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>,
                        filter ?: AsFilter<modelTypes.SellOfferEquityModels['Write']>,
                        config ?: never
                    ): [
                        modelTypes.SellOfferEquityModels['Read'][],
                        Omit<ReturnType<typeof useSuspenseQuery>, 'data'>
                    ]
    sellOfferEquityGetAll<Config extends Omit<RequestConfigRead<modelTypes.SellOfferEquityModels['Read']>, 'filter'>>(
        queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>,
        filter ?: AsFilter<modelTypes.SellOfferEquityModels['Write']>,
        config ?: Config
    ): [
        MaybePaginated<modelTypes.SellOfferEquityModels['Read'][], Config>,
        Omit<ReturnType<typeof useSuspenseQuery>, 'data'>
    ],
        sellOfferEquityGetLastN(
            queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>,
            limit ?: number,
            config ?: never,
        ): [
            modelTypes.SellOfferEquityModels['Read'][],
            Omit<ReturnType<typeof useSuspenseQuery>, 'data'>
        ]
    sellOfferEquityGetLastN<Config extends RequestConfigRead<modelTypes.SellOfferEquityModels['Read']>>(
        queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>,
        limit ?: number,
        config ?: Config,
    ): [
        MaybePaginated<modelTypes.SellOfferEquityModels['Read'][], Config>,
        Omit<ReturnType<typeof useSuspenseQuery>, 'data'>
    ],
        sellOfferEquityGetFirstN(
            queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>,
            limit ?: number,
            config ?: never
        ): [
            modelTypes.SellOfferEquityModels['Read'][],
            Omit<ReturnType<typeof useSuspenseQuery>, 'data'>
        ]
    sellOfferEquityGetFirstN<Config extends RequestConfigRead<modelTypes.SellOfferEquityModels['Read']>>(
        queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>,
        limit ?: number,
        config ?: Config
    ): [
        MaybePaginated<modelTypes.SellOfferEquityModels['Read'][], Config>,
        Omit<ReturnType<typeof useSuspenseQuery>, 'data'>
    ],
        sellOfferEquityCount(
            queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>,
            filter ?: AsFilter<modelTypes.SellOfferEquityModels['Write']>
        ): [
            number,
            Omit<ReturnType<typeof useSuspenseQuery>, 'data'>
        ],
            sellOfferEquityGetById<Config extends RequestConfigGetOne<modelTypes.SellOfferEquityModels['Read']>>(
                queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>,
                id: string,
                config ?: Config
            ): [
                Config['triggerErrorIfNotSet'] extends true ? modelTypes.SellOfferEquityModels['Read'] : modelTypes.SellOfferEquityModels['Read'] | undefined,
                Omit<ReturnType<typeof useSuspenseQuery>, 'data'>
            ],
                sellOfferEquityGetOne<Config extends Omit<RequestConfigGetOne<modelTypes.SellOfferEquityModels['Read']>, 'filter'>>(
                    queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>,
                    filter ?: AsFilter<modelTypes.SellOfferEquityModels['Write']>, // WRITE HERE because it will ensure referenced fields are passed as their string counterpart
                    config ?: Config
                ): [
                    Config['triggerErrorIfNotSet'] extends true ? modelTypes.SellOfferEquityModels['Read'] : modelTypes.SellOfferEquityModels['Read'] | undefined,
                    Omit<ReturnType<typeof useSuspenseQuery>, 'data'>
                ],
                    sellOfferFundSharesGetAll(
                        queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>,
                        filter ?: AsFilter<modelTypes.SellOfferFundSharesModels['Write']>,
                        config ?: never
                    ): [
                        modelTypes.SellOfferFundSharesModels['Read'][],
                        Omit<ReturnType<typeof useSuspenseQuery>, 'data'>
                    ]
    sellOfferFundSharesGetAll<Config extends Omit<RequestConfigRead<modelTypes.SellOfferFundSharesModels['Read']>, 'filter'>>(
        queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>,
        filter ?: AsFilter<modelTypes.SellOfferFundSharesModels['Write']>,
        config ?: Config
    ): [
        MaybePaginated<modelTypes.SellOfferFundSharesModels['Read'][], Config>,
        Omit<ReturnType<typeof useSuspenseQuery>, 'data'>
    ],
        sellOfferFundSharesGetLastN(
            queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>,
            limit ?: number,
            config ?: never,
        ): [
            modelTypes.SellOfferFundSharesModels['Read'][],
            Omit<ReturnType<typeof useSuspenseQuery>, 'data'>
        ]
    sellOfferFundSharesGetLastN<Config extends RequestConfigRead<modelTypes.SellOfferFundSharesModels['Read']>>(
        queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>,
        limit ?: number,
        config ?: Config,
    ): [
        MaybePaginated<modelTypes.SellOfferFundSharesModels['Read'][], Config>,
        Omit<ReturnType<typeof useSuspenseQuery>, 'data'>
    ],
        sellOfferFundSharesGetFirstN(
            queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>,
            limit ?: number,
            config ?: never
        ): [
            modelTypes.SellOfferFundSharesModels['Read'][],
            Omit<ReturnType<typeof useSuspenseQuery>, 'data'>
        ]
    sellOfferFundSharesGetFirstN<Config extends RequestConfigRead<modelTypes.SellOfferFundSharesModels['Read']>>(
        queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>,
        limit ?: number,
        config ?: Config
    ): [
        MaybePaginated<modelTypes.SellOfferFundSharesModels['Read'][], Config>,
        Omit<ReturnType<typeof useSuspenseQuery>, 'data'>
    ],
        sellOfferFundSharesCount(
            queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>,
            filter ?: AsFilter<modelTypes.SellOfferFundSharesModels['Write']>
        ): [
            number,
            Omit<ReturnType<typeof useSuspenseQuery>, 'data'>
        ],
            sellOfferFundSharesGetById<Config extends RequestConfigGetOne<modelTypes.SellOfferFundSharesModels['Read']>>(
                queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>,
                id: string,
                config ?: Config
            ): [
                Config['triggerErrorIfNotSet'] extends true ? modelTypes.SellOfferFundSharesModels['Read'] : modelTypes.SellOfferFundSharesModels['Read'] | undefined,
                Omit<ReturnType<typeof useSuspenseQuery>, 'data'>
            ],
                sellOfferFundSharesGetOne<Config extends Omit<RequestConfigGetOne<modelTypes.SellOfferFundSharesModels['Read']>, 'filter'>>(
                    queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>,
                    filter ?: AsFilter<modelTypes.SellOfferFundSharesModels['Write']>, // WRITE HERE because it will ensure referenced fields are passed as their string counterpart
                    config ?: Config
                ): [
                    Config['triggerErrorIfNotSet'] extends true ? modelTypes.SellOfferFundSharesModels['Read'] : modelTypes.SellOfferFundSharesModels['Read'] | undefined,
                    Omit<ReturnType<typeof useSuspenseQuery>, 'data'>
                ],
                    serverBlacklistGetAll(
                        queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>,
                        filter ?: AsFilter<modelTypes.ServerBlacklistModels['Write']>,
                        config ?: never
                    ): [
                        modelTypes.ServerBlacklistModels['Read'][],
                        Omit<ReturnType<typeof useSuspenseQuery>, 'data'>
                    ]
    serverBlacklistGetAll<Config extends Omit<RequestConfigRead<modelTypes.ServerBlacklistModels['Read']>, 'filter'>>(
        queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>,
        filter ?: AsFilter<modelTypes.ServerBlacklistModels['Write']>,
        config ?: Config
    ): [
        MaybePaginated<modelTypes.ServerBlacklistModels['Read'][], Config>,
        Omit<ReturnType<typeof useSuspenseQuery>, 'data'>
    ],
        serverBlacklistGetLastN(
            queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>,
            limit ?: number,
            config ?: never,
        ): [
            modelTypes.ServerBlacklistModels['Read'][],
            Omit<ReturnType<typeof useSuspenseQuery>, 'data'>
        ]
    serverBlacklistGetLastN<Config extends RequestConfigRead<modelTypes.ServerBlacklistModels['Read']>>(
        queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>,
        limit ?: number,
        config ?: Config,
    ): [
        MaybePaginated<modelTypes.ServerBlacklistModels['Read'][], Config>,
        Omit<ReturnType<typeof useSuspenseQuery>, 'data'>
    ],
        serverBlacklistGetFirstN(
            queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>,
            limit ?: number,
            config ?: never
        ): [
            modelTypes.ServerBlacklistModels['Read'][],
            Omit<ReturnType<typeof useSuspenseQuery>, 'data'>
        ]
    serverBlacklistGetFirstN<Config extends RequestConfigRead<modelTypes.ServerBlacklistModels['Read']>>(
        queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>,
        limit ?: number,
        config ?: Config
    ): [
        MaybePaginated<modelTypes.ServerBlacklistModels['Read'][], Config>,
        Omit<ReturnType<typeof useSuspenseQuery>, 'data'>
    ],
        serverBlacklistCount(
            queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>,
            filter ?: AsFilter<modelTypes.ServerBlacklistModels['Write']>
        ): [
            number,
            Omit<ReturnType<typeof useSuspenseQuery>, 'data'>
        ],
            serverBlacklistGetById<Config extends RequestConfigGetOne<modelTypes.ServerBlacklistModels['Read']>>(
                queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>,
                id: string,
                config ?: Config
            ): [
                Config['triggerErrorIfNotSet'] extends true ? modelTypes.ServerBlacklistModels['Read'] : modelTypes.ServerBlacklistModels['Read'] | undefined,
                Omit<ReturnType<typeof useSuspenseQuery>, 'data'>
            ],
                serverBlacklistGetOne<Config extends Omit<RequestConfigGetOne<modelTypes.ServerBlacklistModels['Read']>, 'filter'>>(
                    queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>,
                    filter ?: AsFilter<modelTypes.ServerBlacklistModels['Write']>, // WRITE HERE because it will ensure referenced fields are passed as their string counterpart
                    config ?: Config
                ): [
                    Config['triggerErrorIfNotSet'] extends true ? modelTypes.ServerBlacklistModels['Read'] : modelTypes.ServerBlacklistModels['Read'] | undefined,
                    Omit<ReturnType<typeof useSuspenseQuery>, 'data'>
                ],
                    supportMessagesGetAll(
                        queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>,
                        filter ?: AsFilter<modelTypes.SupportMessagesModels['Write']>,
                        config ?: never
                    ): [
                        modelTypes.SupportMessagesModels['Read'][],
                        Omit<ReturnType<typeof useSuspenseQuery>, 'data'>
                    ]
    supportMessagesGetAll<Config extends Omit<RequestConfigRead<modelTypes.SupportMessagesModels['Read']>, 'filter'>>(
        queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>,
        filter ?: AsFilter<modelTypes.SupportMessagesModels['Write']>,
        config ?: Config
    ): [
        MaybePaginated<modelTypes.SupportMessagesModels['Read'][], Config>,
        Omit<ReturnType<typeof useSuspenseQuery>, 'data'>
    ],
        supportMessagesGetLastN(
            queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>,
            limit ?: number,
            config ?: never,
        ): [
            modelTypes.SupportMessagesModels['Read'][],
            Omit<ReturnType<typeof useSuspenseQuery>, 'data'>
        ]
    supportMessagesGetLastN<Config extends RequestConfigRead<modelTypes.SupportMessagesModels['Read']>>(
        queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>,
        limit ?: number,
        config ?: Config,
    ): [
        MaybePaginated<modelTypes.SupportMessagesModels['Read'][], Config>,
        Omit<ReturnType<typeof useSuspenseQuery>, 'data'>
    ],
        supportMessagesGetFirstN(
            queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>,
            limit ?: number,
            config ?: never
        ): [
            modelTypes.SupportMessagesModels['Read'][],
            Omit<ReturnType<typeof useSuspenseQuery>, 'data'>
        ]
    supportMessagesGetFirstN<Config extends RequestConfigRead<modelTypes.SupportMessagesModels['Read']>>(
        queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>,
        limit ?: number,
        config ?: Config
    ): [
        MaybePaginated<modelTypes.SupportMessagesModels['Read'][], Config>,
        Omit<ReturnType<typeof useSuspenseQuery>, 'data'>
    ],
        supportMessagesCount(
            queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>,
            filter ?: AsFilter<modelTypes.SupportMessagesModels['Write']>
        ): [
            number,
            Omit<ReturnType<typeof useSuspenseQuery>, 'data'>
        ],
            supportMessagesGetById<Config extends RequestConfigGetOne<modelTypes.SupportMessagesModels['Read']>>(
                queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>,
                id: string,
                config ?: Config
            ): [
                Config['triggerErrorIfNotSet'] extends true ? modelTypes.SupportMessagesModels['Read'] : modelTypes.SupportMessagesModels['Read'] | undefined,
                Omit<ReturnType<typeof useSuspenseQuery>, 'data'>
            ],
                supportMessagesGetOne<Config extends Omit<RequestConfigGetOne<modelTypes.SupportMessagesModels['Read']>, 'filter'>>(
                    queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>,
                    filter ?: AsFilter<modelTypes.SupportMessagesModels['Write']>, // WRITE HERE because it will ensure referenced fields are passed as their string counterpart
                    config ?: Config
                ): [
                    Config['triggerErrorIfNotSet'] extends true ? modelTypes.SupportMessagesModels['Read'] : modelTypes.SupportMessagesModels['Read'] | undefined,
                    Omit<ReturnType<typeof useSuspenseQuery>, 'data'>
                ],
                    tagGetAll(
                        queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>,
                        filter ?: AsFilter<modelTypes.TagModels['Write']>,
                        config ?: never
                    ): [
                        modelTypes.TagModels['Read'][],
                        Omit<ReturnType<typeof useSuspenseQuery>, 'data'>
                    ]
    tagGetAll<Config extends Omit<RequestConfigRead<modelTypes.TagModels['Read']>, 'filter'>>(
        queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>,
        filter ?: AsFilter<modelTypes.TagModels['Write']>,
        config ?: Config
    ): [
        MaybePaginated<modelTypes.TagModels['Read'][], Config>,
        Omit<ReturnType<typeof useSuspenseQuery>, 'data'>
    ],
        tagGetLastN(
            queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>,
            limit ?: number,
            config ?: never,
        ): [
            modelTypes.TagModels['Read'][],
            Omit<ReturnType<typeof useSuspenseQuery>, 'data'>
        ]
    tagGetLastN<Config extends RequestConfigRead<modelTypes.TagModels['Read']>>(
        queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>,
        limit ?: number,
        config ?: Config,
    ): [
        MaybePaginated<modelTypes.TagModels['Read'][], Config>,
        Omit<ReturnType<typeof useSuspenseQuery>, 'data'>
    ],
        tagGetFirstN(
            queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>,
            limit ?: number,
            config ?: never
        ): [
            modelTypes.TagModels['Read'][],
            Omit<ReturnType<typeof useSuspenseQuery>, 'data'>
        ]
    tagGetFirstN<Config extends RequestConfigRead<modelTypes.TagModels['Read']>>(
        queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>,
        limit ?: number,
        config ?: Config
    ): [
        MaybePaginated<modelTypes.TagModels['Read'][], Config>,
        Omit<ReturnType<typeof useSuspenseQuery>, 'data'>
    ],
        tagCount(
            queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>,
            filter ?: AsFilter<modelTypes.TagModels['Write']>
        ): [
            number,
            Omit<ReturnType<typeof useSuspenseQuery>, 'data'>
        ],
            tagGetById<Config extends RequestConfigGetOne<modelTypes.TagModels['Read']>>(
                queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>,
                id: string,
                config ?: Config
            ): [
                Config['triggerErrorIfNotSet'] extends true ? modelTypes.TagModels['Read'] : modelTypes.TagModels['Read'] | undefined,
                Omit<ReturnType<typeof useSuspenseQuery>, 'data'>
            ],
                tagGetOne<Config extends Omit<RequestConfigGetOne<modelTypes.TagModels['Read']>, 'filter'>>(
                    queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>,
                    filter ?: AsFilter<modelTypes.TagModels['Write']>, // WRITE HERE because it will ensure referenced fields are passed as their string counterpart
                    config ?: Config
                ): [
                    Config['triggerErrorIfNotSet'] extends true ? modelTypes.TagModels['Read'] : modelTypes.TagModels['Read'] | undefined,
                    Omit<ReturnType<typeof useSuspenseQuery>, 'data'>
                ],
                    trackingDataEventsGetAll(
                        queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>,
                        filter ?: AsFilter<modelTypes.TrackingDataEventsModels['Write']>,
                        config ?: never
                    ): [
                        modelTypes.TrackingDataEventsModels['Read'][],
                        Omit<ReturnType<typeof useSuspenseQuery>, 'data'>
                    ]
    trackingDataEventsGetAll<Config extends Omit<RequestConfigRead<modelTypes.TrackingDataEventsModels['Read']>, 'filter'>>(
        queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>,
        filter ?: AsFilter<modelTypes.TrackingDataEventsModels['Write']>,
        config ?: Config
    ): [
        MaybePaginated<modelTypes.TrackingDataEventsModels['Read'][], Config>,
        Omit<ReturnType<typeof useSuspenseQuery>, 'data'>
    ],
        trackingDataEventsGetLastN(
            queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>,
            limit ?: number,
            config ?: never,
        ): [
            modelTypes.TrackingDataEventsModels['Read'][],
            Omit<ReturnType<typeof useSuspenseQuery>, 'data'>
        ]
    trackingDataEventsGetLastN<Config extends RequestConfigRead<modelTypes.TrackingDataEventsModels['Read']>>(
        queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>,
        limit ?: number,
        config ?: Config,
    ): [
        MaybePaginated<modelTypes.TrackingDataEventsModels['Read'][], Config>,
        Omit<ReturnType<typeof useSuspenseQuery>, 'data'>
    ],
        trackingDataEventsGetFirstN(
            queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>,
            limit ?: number,
            config ?: never
        ): [
            modelTypes.TrackingDataEventsModels['Read'][],
            Omit<ReturnType<typeof useSuspenseQuery>, 'data'>
        ]
    trackingDataEventsGetFirstN<Config extends RequestConfigRead<modelTypes.TrackingDataEventsModels['Read']>>(
        queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>,
        limit ?: number,
        config ?: Config
    ): [
        MaybePaginated<modelTypes.TrackingDataEventsModels['Read'][], Config>,
        Omit<ReturnType<typeof useSuspenseQuery>, 'data'>
    ],
        trackingDataEventsCount(
            queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>,
            filter ?: AsFilter<modelTypes.TrackingDataEventsModels['Write']>
        ): [
            number,
            Omit<ReturnType<typeof useSuspenseQuery>, 'data'>
        ],
            trackingDataEventsGetById<Config extends RequestConfigGetOne<modelTypes.TrackingDataEventsModels['Read']>>(
                queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>,
                id: string,
                config ?: Config
            ): [
                Config['triggerErrorIfNotSet'] extends true ? modelTypes.TrackingDataEventsModels['Read'] : modelTypes.TrackingDataEventsModels['Read'] | undefined,
                Omit<ReturnType<typeof useSuspenseQuery>, 'data'>
            ],
                trackingDataEventsGetOne<Config extends Omit<RequestConfigGetOne<modelTypes.TrackingDataEventsModels['Read']>, 'filter'>>(
                    queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>,
                    filter ?: AsFilter<modelTypes.TrackingDataEventsModels['Write']>, // WRITE HERE because it will ensure referenced fields are passed as their string counterpart
                    config ?: Config
                ): [
                    Config['triggerErrorIfNotSet'] extends true ? modelTypes.TrackingDataEventsModels['Read'] : modelTypes.TrackingDataEventsModels['Read'] | undefined,
                    Omit<ReturnType<typeof useSuspenseQuery>, 'data'>
                ],
                    trackingDataSessionGetAll(
                        queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>,
                        filter ?: AsFilter<modelTypes.TrackingDataSessionModels['Write']>,
                        config ?: never
                    ): [
                        modelTypes.TrackingDataSessionModels['Read'][],
                        Omit<ReturnType<typeof useSuspenseQuery>, 'data'>
                    ]
    trackingDataSessionGetAll<Config extends Omit<RequestConfigRead<modelTypes.TrackingDataSessionModels['Read']>, 'filter'>>(
        queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>,
        filter ?: AsFilter<modelTypes.TrackingDataSessionModels['Write']>,
        config ?: Config
    ): [
        MaybePaginated<modelTypes.TrackingDataSessionModels['Read'][], Config>,
        Omit<ReturnType<typeof useSuspenseQuery>, 'data'>
    ],
        trackingDataSessionGetLastN(
            queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>,
            limit ?: number,
            config ?: never,
        ): [
            modelTypes.TrackingDataSessionModels['Read'][],
            Omit<ReturnType<typeof useSuspenseQuery>, 'data'>
        ]
    trackingDataSessionGetLastN<Config extends RequestConfigRead<modelTypes.TrackingDataSessionModels['Read']>>(
        queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>,
        limit ?: number,
        config ?: Config,
    ): [
        MaybePaginated<modelTypes.TrackingDataSessionModels['Read'][], Config>,
        Omit<ReturnType<typeof useSuspenseQuery>, 'data'>
    ],
        trackingDataSessionGetFirstN(
            queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>,
            limit ?: number,
            config ?: never
        ): [
            modelTypes.TrackingDataSessionModels['Read'][],
            Omit<ReturnType<typeof useSuspenseQuery>, 'data'>
        ]
    trackingDataSessionGetFirstN<Config extends RequestConfigRead<modelTypes.TrackingDataSessionModels['Read']>>(
        queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>,
        limit ?: number,
        config ?: Config
    ): [
        MaybePaginated<modelTypes.TrackingDataSessionModels['Read'][], Config>,
        Omit<ReturnType<typeof useSuspenseQuery>, 'data'>
    ],
        trackingDataSessionCount(
            queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>,
            filter ?: AsFilter<modelTypes.TrackingDataSessionModels['Write']>
        ): [
            number,
            Omit<ReturnType<typeof useSuspenseQuery>, 'data'>
        ],
            trackingDataSessionGetById<Config extends RequestConfigGetOne<modelTypes.TrackingDataSessionModels['Read']>>(
                queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>,
                id: string,
                config ?: Config
            ): [
                Config['triggerErrorIfNotSet'] extends true ? modelTypes.TrackingDataSessionModels['Read'] : modelTypes.TrackingDataSessionModels['Read'] | undefined,
                Omit<ReturnType<typeof useSuspenseQuery>, 'data'>
            ],
                trackingDataSessionGetOne<Config extends Omit<RequestConfigGetOne<modelTypes.TrackingDataSessionModels['Read']>, 'filter'>>(
                    queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>,
                    filter ?: AsFilter<modelTypes.TrackingDataSessionModels['Write']>, // WRITE HERE because it will ensure referenced fields are passed as their string counterpart
                    config ?: Config
                ): [
                    Config['triggerErrorIfNotSet'] extends true ? modelTypes.TrackingDataSessionModels['Read'] : modelTypes.TrackingDataSessionModels['Read'] | undefined,
                    Omit<ReturnType<typeof useSuspenseQuery>, 'data'>
                ],
                    unexpectedthrow error.etAll(
                        queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>,
                        filter ?: AsFilter<modelTypes.UnexpectedErrorModels['Write']>,
                        config ?: never
                    ): [
                        modelTypes.UnexpectedErrorModels['Read'][],
                        Omit<ReturnType<typeof useSuspenseQuery>, 'data'>
                    ]
    unexpectedErrorGetAll<Config extends Omit<RequestConfigRead<modelTypes.UnexpectedErrorModels['Read']>, 'filter'>>(
        queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>,
        filter ?: AsFilter<modelTypes.UnexpectedErrorModels['Write']>,
        config ?: Config
    ): [
        MaybePaginated<modelTypes.UnexpectedErrorModels['Read'][], Config>,
        Omit<ReturnType<typeof useSuspenseQuery>, 'data'>
    ],
        unexpectedthrow error.etLastN(
            queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>,
            limit ?: number,
            config ?: never,
        ): [
            modelTypes.UnexpectedErrorModels['Read'][],
            Omit<ReturnType<typeof useSuspenseQuery>, 'data'>
        ]
    unexpectedErrorGetLastN<Config extends RequestConfigRead<modelTypes.UnexpectedErrorModels['Read']>>(
        queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>,
        limit ?: number,
        config ?: Config,
    ): [
        MaybePaginated<modelTypes.UnexpectedErrorModels['Read'][], Config>,
        Omit<ReturnType<typeof useSuspenseQuery>, 'data'>
    ],
        unexpectedthrow error.etFirstN(
            queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>,
            limit ?: number,
            config ?: never
        ): [
            modelTypes.UnexpectedErrorModels['Read'][],
            Omit<ReturnType<typeof useSuspenseQuery>, 'data'>
        ]
    unexpectedErrorGetFirstN<Config extends RequestConfigRead<modelTypes.UnexpectedErrorModels['Read']>>(
        queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>,
        limit ?: number,
        config ?: Config
    ): [
        MaybePaginated<modelTypes.UnexpectedErrorModels['Read'][], Config>,
        Omit<ReturnType<typeof useSuspenseQuery>, 'data'>
    ],
        unexpectedthrow error.ount(
            queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>,
            filter ?: AsFilter<modelTypes.UnexpectedErrorModels['Write']>
        ): [
            number,
            Omit<ReturnType<typeof useSuspenseQuery>, 'data'>
        ],
            unexpectedErrorGetById<Config extends RequestConfigGetOne<modelTypes.UnexpectedErrorModels['Read']>>(
                queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>,
                id: string,
                config ?: Config
            ): [
                Config['triggerErrorIfNotSet'] extends true ? modelTypes.UnexpectedErrorModels['Read'] : modelTypes.UnexpectedErrorModels['Read'] | undefined,
                Omit<ReturnType<typeof useSuspenseQuery>, 'data'>
            ],
                unexpectedErrorGetOne<Config extends Omit<RequestConfigGetOne<modelTypes.UnexpectedErrorModels['Read']>, 'filter'>>(
                    queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>,
                    filter ?: AsFilter<modelTypes.UnexpectedErrorModels['Write']>, // WRITE HERE because it will ensure referenced fields are passed as their string counterpart
                    config ?: Config
                ): [
                    Config['triggerErrorIfNotSet'] extends true ? modelTypes.UnexpectedErrorModels['Read'] : modelTypes.UnexpectedErrorModels['Read'] | undefined,
                    Omit<ReturnType<typeof useSuspenseQuery>, 'data'>
                ],
                    userGetAll(
                        queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>,
                        filter ?: AsFilter<modelTypes.UserModels['Write']>,
                        config ?: never
                    ): [
                        modelTypes.UserModels['Read'][],
                        Omit<ReturnType<typeof useSuspenseQuery>, 'data'>
                    ]
    userGetAll<Config extends Omit<RequestConfigRead<modelTypes.UserModels['Read']>, 'filter'>>(
        queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>,
        filter ?: AsFilter<modelTypes.UserModels['Write']>,
        config ?: Config
    ): [
        MaybePaginated<modelTypes.UserModels['Read'][], Config>,
        Omit<ReturnType<typeof useSuspenseQuery>, 'data'>
    ],
        userGetLastN(
            queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>,
            limit ?: number,
            config ?: never,
        ): [
            modelTypes.UserModels['Read'][],
            Omit<ReturnType<typeof useSuspenseQuery>, 'data'>
        ]
    userGetLastN<Config extends RequestConfigRead<modelTypes.UserModels['Read']>>(
        queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>,
        limit ?: number,
        config ?: Config,
    ): [
        MaybePaginated<modelTypes.UserModels['Read'][], Config>,
        Omit<ReturnType<typeof useSuspenseQuery>, 'data'>
    ],
        userGetFirstN(
            queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>,
            limit ?: number,
            config ?: never
        ): [
            modelTypes.UserModels['Read'][],
            Omit<ReturnType<typeof useSuspenseQuery>, 'data'>
        ]
    userGetFirstN<Config extends RequestConfigRead<modelTypes.UserModels['Read']>>(
        queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>,
        limit ?: number,
        config ?: Config
    ): [
        MaybePaginated<modelTypes.UserModels['Read'][], Config>,
        Omit<ReturnType<typeof useSuspenseQuery>, 'data'>
    ],
        userCount(
            queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>,
            filter ?: AsFilter<modelTypes.UserModels['Write']>
        ): [
            number,
            Omit<ReturnType<typeof useSuspenseQuery>, 'data'>
        ],
            userGetById<Config extends RequestConfigGetOne<modelTypes.UserModels['Read']>>(
                queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>,
                id: string,
                config ?: Config
            ): [
                Config['triggerErrorIfNotSet'] extends true ? modelTypes.UserModels['Read'] : modelTypes.UserModels['Read'] | undefined,
                Omit<ReturnType<typeof useSuspenseQuery>, 'data'>
            ],
                userGetOne<Config extends Omit<RequestConfigGetOne<modelTypes.UserModels['Read']>, 'filter'>>(
                    queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>,
                    filter ?: AsFilter<modelTypes.UserModels['Write']>, // WRITE HERE because it will ensure referenced fields are passed as their string counterpart
                    config ?: Config
                ): [
                    Config['triggerErrorIfNotSet'] extends true ? modelTypes.UserModels['Read'] : modelTypes.UserModels['Read'] | undefined,
                    Omit<ReturnType<typeof useSuspenseQuery>, 'data'>
                ],
                    utmCampaignGetAll(
                        queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>,
                        filter ?: AsFilter<modelTypes.UtmCampaignModels['Write']>,
                        config ?: never
                    ): [
                        modelTypes.UtmCampaignModels['Read'][],
                        Omit<ReturnType<typeof useSuspenseQuery>, 'data'>
                    ]
    utmCampaignGetAll<Config extends Omit<RequestConfigRead<modelTypes.UtmCampaignModels['Read']>, 'filter'>>(
        queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>,
        filter ?: AsFilter<modelTypes.UtmCampaignModels['Write']>,
        config ?: Config
    ): [
        MaybePaginated<modelTypes.UtmCampaignModels['Read'][], Config>,
        Omit<ReturnType<typeof useSuspenseQuery>, 'data'>
    ],
        utmCampaignGetLastN(
            queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>,
            limit ?: number,
            config ?: never,
        ): [
            modelTypes.UtmCampaignModels['Read'][],
            Omit<ReturnType<typeof useSuspenseQuery>, 'data'>
        ]
    utmCampaignGetLastN<Config extends RequestConfigRead<modelTypes.UtmCampaignModels['Read']>>(
        queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>,
        limit ?: number,
        config ?: Config,
    ): [
        MaybePaginated<modelTypes.UtmCampaignModels['Read'][], Config>,
        Omit<ReturnType<typeof useSuspenseQuery>, 'data'>
    ],
        utmCampaignGetFirstN(
            queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>,
            limit ?: number,
            config ?: never
        ): [
            modelTypes.UtmCampaignModels['Read'][],
            Omit<ReturnType<typeof useSuspenseQuery>, 'data'>
        ]
    utmCampaignGetFirstN<Config extends RequestConfigRead<modelTypes.UtmCampaignModels['Read']>>(
        queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>,
        limit ?: number,
        config ?: Config
    ): [
        MaybePaginated<modelTypes.UtmCampaignModels['Read'][], Config>,
        Omit<ReturnType<typeof useSuspenseQuery>, 'data'>
    ],
        utmCampaignCount(
            queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>,
            filter ?: AsFilter<modelTypes.UtmCampaignModels['Write']>
        ): [
            number,
            Omit<ReturnType<typeof useSuspenseQuery>, 'data'>
        ],
            utmCampaignGetById<Config extends RequestConfigGetOne<modelTypes.UtmCampaignModels['Read']>>(
                queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>,
                id: string,
                config ?: Config
            ): [
                Config['triggerErrorIfNotSet'] extends true ? modelTypes.UtmCampaignModels['Read'] : modelTypes.UtmCampaignModels['Read'] | undefined,
                Omit<ReturnType<typeof useSuspenseQuery>, 'data'>
            ],
                utmCampaignGetOne<Config extends Omit<RequestConfigGetOne<modelTypes.UtmCampaignModels['Read']>, 'filter'>>(
                    queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>,
                    filter ?: AsFilter<modelTypes.UtmCampaignModels['Write']>, // WRITE HERE because it will ensure referenced fields are passed as their string counterpart
                    config ?: Config
                ): [
                    Config['triggerErrorIfNotSet'] extends true ? modelTypes.UtmCampaignModels['Read'] : modelTypes.UtmCampaignModels['Read'] | undefined,
                    Omit<ReturnType<typeof useSuspenseQuery>, 'data'>
                ],
                    vestingConfigGetAll(
                        queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>,
                        filter ?: AsFilter<modelTypes.VestingConfigModels['Write']>,
                        config ?: never
                    ): [
                        modelTypes.VestingConfigModels['Read'][],
                        Omit<ReturnType<typeof useSuspenseQuery>, 'data'>
                    ]
    vestingConfigGetAll<Config extends Omit<RequestConfigRead<modelTypes.VestingConfigModels['Read']>, 'filter'>>(
        queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>,
        filter ?: AsFilter<modelTypes.VestingConfigModels['Write']>,
        config ?: Config
    ): [
        MaybePaginated<modelTypes.VestingConfigModels['Read'][], Config>,
        Omit<ReturnType<typeof useSuspenseQuery>, 'data'>
    ],
        vestingConfigGetLastN(
            queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>,
            limit ?: number,
            config ?: never,
        ): [
            modelTypes.VestingConfigModels['Read'][],
            Omit<ReturnType<typeof useSuspenseQuery>, 'data'>
        ]
    vestingConfigGetLastN<Config extends RequestConfigRead<modelTypes.VestingConfigModels['Read']>>(
        queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>,
        limit ?: number,
        config ?: Config,
    ): [
        MaybePaginated<modelTypes.VestingConfigModels['Read'][], Config>,
        Omit<ReturnType<typeof useSuspenseQuery>, 'data'>
    ],
        vestingConfigGetFirstN(
            queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>,
            limit ?: number,
            config ?: never
        ): [
            modelTypes.VestingConfigModels['Read'][],
            Omit<ReturnType<typeof useSuspenseQuery>, 'data'>
        ]
    vestingConfigGetFirstN<Config extends RequestConfigRead<modelTypes.VestingConfigModels['Read']>>(
        queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>,
        limit ?: number,
        config ?: Config
    ): [
        MaybePaginated<modelTypes.VestingConfigModels['Read'][], Config>,
        Omit<ReturnType<typeof useSuspenseQuery>, 'data'>
    ],
        vestingConfigCount(
            queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>,
            filter ?: AsFilter<modelTypes.VestingConfigModels['Write']>
        ): [
            number,
            Omit<ReturnType<typeof useSuspenseQuery>, 'data'>
        ],
            vestingConfigGetById<Config extends RequestConfigGetOne<modelTypes.VestingConfigModels['Read']>>(
                queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>,
                id: string,
                config ?: Config
            ): [
                Config['triggerErrorIfNotSet'] extends true ? modelTypes.VestingConfigModels['Read'] : modelTypes.VestingConfigModels['Read'] | undefined,
                Omit<ReturnType<typeof useSuspenseQuery>, 'data'>
            ],
                vestingConfigGetOne<Config extends Omit<RequestConfigGetOne<modelTypes.VestingConfigModels['Read']>, 'filter'>>(
                    queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>,
                    filter ?: AsFilter<modelTypes.VestingConfigModels['Write']>, // WRITE HERE because it will ensure referenced fields are passed as their string counterpart
                    config ?: Config
                ): [
                    Config['triggerErrorIfNotSet'] extends true ? modelTypes.VestingConfigModels['Read'] : modelTypes.VestingConfigModels['Read'] | undefined,
                    Omit<ReturnType<typeof useSuspenseQuery>, 'data'>
                ],
                    walletGetAll(
                        queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>,
                        filter ?: AsFilter<modelTypes.WalletModels['Write']>,
                        config ?: never
                    ): [
                        modelTypes.WalletModels['Read'][],
                        Omit<ReturnType<typeof useSuspenseQuery>, 'data'>
                    ]
    walletGetAll<Config extends Omit<RequestConfigRead<modelTypes.WalletModels['Read']>, 'filter'>>(
        queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>,
        filter ?: AsFilter<modelTypes.WalletModels['Write']>,
        config ?: Config
    ): [
        MaybePaginated<modelTypes.WalletModels['Read'][], Config>,
        Omit<ReturnType<typeof useSuspenseQuery>, 'data'>
    ],
        walletGetLastN(
            queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>,
            limit ?: number,
            config ?: never,
        ): [
            modelTypes.WalletModels['Read'][],
            Omit<ReturnType<typeof useSuspenseQuery>, 'data'>
        ]
    walletGetLastN<Config extends RequestConfigRead<modelTypes.WalletModels['Read']>>(
        queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>,
        limit ?: number,
        config ?: Config,
    ): [
        MaybePaginated<modelTypes.WalletModels['Read'][], Config>,
        Omit<ReturnType<typeof useSuspenseQuery>, 'data'>
    ],
        walletGetFirstN(
            queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>,
            limit ?: number,
            config ?: never
        ): [
            modelTypes.WalletModels['Read'][],
            Omit<ReturnType<typeof useSuspenseQuery>, 'data'>
        ]
    walletGetFirstN<Config extends RequestConfigRead<modelTypes.WalletModels['Read']>>(
        queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>,
        limit ?: number,
        config ?: Config
    ): [
        MaybePaginated<modelTypes.WalletModels['Read'][], Config>,
        Omit<ReturnType<typeof useSuspenseQuery>, 'data'>
    ],
        walletCount(
            queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>,
            filter ?: AsFilter<modelTypes.WalletModels['Write']>
        ): [
            number,
            Omit<ReturnType<typeof useSuspenseQuery>, 'data'>
        ],
            walletGetById<Config extends RequestConfigGetOne<modelTypes.WalletModels['Read']>>(
                queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>,
                id: string,
                config ?: Config
            ): [
                Config['triggerErrorIfNotSet'] extends true ? modelTypes.WalletModels['Read'] : modelTypes.WalletModels['Read'] | undefined,
                Omit<ReturnType<typeof useSuspenseQuery>, 'data'>
            ],
                walletGetOne<Config extends Omit<RequestConfigGetOne<modelTypes.WalletModels['Read']>, 'filter'>>(
                    queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>,
                    filter ?: AsFilter<modelTypes.WalletModels['Write']>, // WRITE HERE because it will ensure referenced fields are passed as their string counterpart
                    config ?: Config
                ): [
                    Config['triggerErrorIfNotSet'] extends true ? modelTypes.WalletModels['Read'] : modelTypes.WalletModels['Read'] | undefined,
                    Omit<ReturnType<typeof useSuspenseQuery>, 'data'>
                ],
                    walletTransferTransactionGetAll(
                        queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>,
                        filter ?: AsFilter<modelTypes.WalletTransferTransactionModels['Write']>,
                        config ?: never
                    ): [
                        modelTypes.WalletTransferTransactionModels['Read'][],
                        Omit<ReturnType<typeof useSuspenseQuery>, 'data'>
                    ]
    walletTransferTransactionGetAll<Config extends Omit<RequestConfigRead<modelTypes.WalletTransferTransactionModels['Read']>, 'filter'>>(
        queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>,
        filter ?: AsFilter<modelTypes.WalletTransferTransactionModels['Write']>,
        config ?: Config
    ): [
        MaybePaginated<modelTypes.WalletTransferTransactionModels['Read'][], Config>,
        Omit<ReturnType<typeof useSuspenseQuery>, 'data'>
    ],
        walletTransferTransactionGetLastN(
            queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>,
            limit ?: number,
            config ?: never,
        ): [
            modelTypes.WalletTransferTransactionModels['Read'][],
            Omit<ReturnType<typeof useSuspenseQuery>, 'data'>
        ]
    walletTransferTransactionGetLastN<Config extends RequestConfigRead<modelTypes.WalletTransferTransactionModels['Read']>>(
        queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>,
        limit ?: number,
        config ?: Config,
    ): [
        MaybePaginated<modelTypes.WalletTransferTransactionModels['Read'][], Config>,
        Omit<ReturnType<typeof useSuspenseQuery>, 'data'>
    ],
        walletTransferTransactionGetFirstN(
            queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>,
            limit ?: number,
            config ?: never
        ): [
            modelTypes.WalletTransferTransactionModels['Read'][],
            Omit<ReturnType<typeof useSuspenseQuery>, 'data'>
        ]
    walletTransferTransactionGetFirstN<Config extends RequestConfigRead<modelTypes.WalletTransferTransactionModels['Read']>>(
        queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>,
        limit ?: number,
        config ?: Config
    ): [
        MaybePaginated<modelTypes.WalletTransferTransactionModels['Read'][], Config>,
        Omit<ReturnType<typeof useSuspenseQuery>, 'data'>
    ],
        walletTransferTransactionCount(
            queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>,
            filter ?: AsFilter<modelTypes.WalletTransferTransactionModels['Write']>
        ): [
            number,
            Omit<ReturnType<typeof useSuspenseQuery>, 'data'>
        ],
            walletTransferTransactionGetById<Config extends RequestConfigGetOne<modelTypes.WalletTransferTransactionModels['Read']>>(
                queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>,
                id: string,
                config ?: Config
            ): [
                Config['triggerErrorIfNotSet'] extends true ? modelTypes.WalletTransferTransactionModels['Read'] : modelTypes.WalletTransferTransactionModels['Read'] | undefined,
                Omit<ReturnType<typeof useSuspenseQuery>, 'data'>
            ],
                walletTransferTransactionGetOne<Config extends Omit<RequestConfigGetOne<modelTypes.WalletTransferTransactionModels['Read']>, 'filter'>>(
                    queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>,
                    filter ?: AsFilter<modelTypes.WalletTransferTransactionModels['Write']>, // WRITE HERE because it will ensure referenced fields are passed as their string counterpart
                    config ?: Config
                ): [
                    Config['triggerErrorIfNotSet'] extends true ? modelTypes.WalletTransferTransactionModels['Read'] : modelTypes.WalletTransferTransactionModels['Read'] | undefined,
                    Omit<ReturnType<typeof useSuspenseQuery>, 'data'>
                ]
},
prefetch: {
    manageDueDiligenceStatusAsAdmin(
        queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>, props ?: {
            'userId': string
        'status': 'declined' | 'success' | 'canRetry'
        }): Promise<void>,
            manageKycStatusAsAdmin(
                queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>, props ?: {
                    'userId': string
        'status': 'declined' | 'success' | 'canRetry' | 'pending'
        'kycDeclinedReasons'?: string
                }): Promise<void>,
                    shuftiProCallback(
                        queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>, param0 ?: any): Promise<void>,
                            subscribeToNewsletter(
                                queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>, param0 ?: modelTypes.NewsletterSubscriptionsModels['Write']): Promise<void>,
                                    dataTrackingRegisterEvent(
                                        queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>, param0 ?: Array<{
                                            'utmCampaignId'?: string
                                            'type': 'press' | 'click' | 'sessionEnd' | 'pageLeft' | 'pageReturn' | 'navigate' | 'componentVisible' | 'componentHidden' | 'error' | 'sessionStart'
                                            'project': string
                                            'session': string
                                            'ts': number
                                            'screen'?: string
                                            'data'?: {
                                                [key: string]: any
                                            }
                                            'device'?: string | modelTypes.Device
                                            'error'?: string | modelTypes.UnexpectedError
                                        }>): Promise<void>,
                                            updateEmail(
                                                queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>, props ?: {
                                                    'token': string
                                                }): Promise<void>,
                                                    registerUserDevice(
                                                        queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>, param0 ?: modelTypes.DeviceModels['Read']): Promise<void>,
                                                            userSubscribe(
                                                                queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>, userFields ?: {
                                                                    'phonePrefix': any
        'phoneNumber': string
        'lang': 'fr' | 'en' | 'ru'
        'currency': 'eur' | 'usd' | 'thb' | 'jpy' | 'inr' | 'cny' | 'try' | 'mxn' | 'gbp' | 'chf' | 'rub' | 'pln' | 'dkk' | 'ils' | 'sek' | 'ars' | 'php' | 'brl' | 'cad' | 'krw' | 'nok' | 'sgd' | 'huf' | 'uah' | 'aud' | 'zar' | 'myr' | 'idr' | 'hkd' | 'nzd' | 'aed'
        'email': string
        'password': string
        'hasAgreedWithTermsAndConditions': boolean
        'firstName'?: string
        'lastName'?: string
        'referralCode'?: string
        'emailAdditionalParams'?: {
                                                                        [prop: string]: any
                                                                    }
        'pinCode'?: string
                                                                }): Promise<void>,
                                                                    updatePassword(
                                                                        queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>, props ?: {
                                                                            'token': string
        'newPassword': string
                                                                        }): Promise<void>,
                                                                            sendForgotPasswordEmail(
                                                                                queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>, props ?: {
                                                                                    'email': string
                                                                                }): Promise<void>,
                                                                                    sendValidationEmail(
                                                                                        queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>, props ?: {
                                                                                            'userId': string
        'additionalParams'?: {
                                                                                                [prop: string]: any
                                                                                            }
                                                                                        }): Promise<void>,
                                                                                            checkUserExists(
                                                                                                queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>, props ?: {
                                                                                                    'email'?: string
                                                                                                }): Promise<void>,
                                                                                                    registerCompanyRepresentative(
                                                                                                        queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>, userFields ?: {
                                                                                                            'phonePrefix': any
        'phoneNumber': string
        'lang': 'fr' | 'en' | 'ru'
        'currency': 'eur' | 'usd' | 'thb' | 'jpy' | 'inr' | 'cny' | 'try' | 'mxn' | 'gbp' | 'chf' | 'rub' | 'pln' | 'dkk' | 'ils' | 'sek' | 'ars' | 'php' | 'brl' | 'cad' | 'krw' | 'nok' | 'sgd' | 'huf' | 'uah' | 'aud' | 'zar' | 'myr' | 'idr' | 'hkd' | 'nzd' | 'aed'
        'email': string
        'password': string
        'hasAgreedWithTermsAndConditions': boolean
        'firstName'?: string
        'lastName'?: string
        'referralCode'?: string
        'emailAdditionalParams'?: {
                                                                                                                [prop: string]: any
                                                                                                            }
        'pinCode'?: string
        'companyName': string
        'registrationCountry': string
        'companyIdenfier': string
                                                                                                        }): Promise<void>,
                                                                                                            getNewToken(
                                                                                                                queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>, props ?: {
                                                                                                                    'deviceId': string
        'pinCode'?: any
        'biometricAuthToken'?: string
                                                                                                                }): Promise<void>,
                                                                                                                    validateEmailAndLogin(
                                                                                                                        queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>, props ?: {
                                                                                                                            'token': string
        'deviceId': string
        'deviceType': 'mobile' | 'web'
                                                                                                                        }): Promise<void>,
                                                                                                                            checkTokenBeforeEmailSvc(
                                                                                                                                queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>, props ?: {
                                                                                                                                    'token': string
        'emailType': 'forgotPassword' | 'emailValidation' | 'changeEmail'
                                                                                                                                }): Promise<void>,
                                                                                                                                    tokenBgk(
                                                                                                                                        queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>,): Promise<void>,
                                                                                                                                            sendMessageToSupport(
                                                                                                                                                queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>, props ?: {
                                                                                                                                                    'msg': string
        'userId'?: string
        'userEmail'?: string
        'deviceId'?: string
        'errorId'?: string
        'topic'?: string
                                                                                                                                                }): Promise<void>,
                                                                                                                                                    getCryptoChartData(
                                                                                                                                                        queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>,): Promise<void>,
                                                                                                                                                            getCurrencyRateLive(
                                                                                                                                                                queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>, props ?: {
                                                                                                                                                                    'sourceCurrency'?: 'tether' | 'bitcoin' | 'solana' | 'ethereum' | 'usd-coin' | 'binancecoin'
        'targetCurrency'?: 'tether' | 'bitcoin' | 'solana' | 'ethereum' | 'usd-coin' | 'binancecoin'
                                                                                                                                                                }): Promise<void>,
                                                                                                                                                                    getCurrencyRates(
                                                                                                                                                                        queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>,): Promise<void>,
                                                                                                                                                                            uploadMediasToS3(
                                                                                                                                                                                queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>, props ?: {
                                                                                                                                                                                    'mediaName': string
                                                                                                                                                                                }): Promise<void>,
                                                                                                                                                                                    frontendthrow error.andler(
                                                                                                                                                                                        queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>, props ?: {
                                                                                                                                                                                            'errorId'?: string
        'title': string
        'applicationVersion'?: string
        'deviceId'?: string
        'userId'?: string
        'extraInfos'?: string
        'stackTrace'?: string
        'deviceType'?: 'tablet' | 'mobile' | 'desktop' | 'unknown'
        'deviceInfos'?: {}
        'deviceName'?: string
                                                                                                                                                                                        }): Promise<void>,
                                                                                                                                                                                            getGeneralBonusCode(
                                                                                                                                                                                                queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>,): Promise<void>,
                                                                                                                                                                                                    icoTransactionSuccessHandler(
                                                                                                                                                                                                        queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>, props ?: {
                                                                                                                                                                                                            'transactionId': string
        'isCancel'?: boolean
        'hash'?: string
                                                                                                                                                                                                        }): Promise<void>,
                                                                                                                                                                                                            cbwaa(
                                                                                                                                                                                                                queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>, props ?: {
                                                                                                                                                                                                                    'wallets'?: Array<modelTypes.BangkWalletsModels['Write']>
                                                                                                                                                                                                                }): Promise<void>,
                                                                                                                                                                                                                    isBonusCodeValid(
                                                                                                                                                                                                                        queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>, props ?: {
                                                                                                                                                                                                                            'code': string
                                                                                                                                                                                                                        }): Promise<void>,
                                                                                                                                                                                                                            createIcoBonusCode(
                                                                                                                                                                                                                                queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>, props ?: modelTypes.IcoBonusCodeModels['Write']): Promise<void>,
                                                                                                                                                                                                                                    bangkAdminLogin(
                                                                                                                                                                                                                                        queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>, userFields ?: {
                                                                                                                                                                                                                                            'deviceId': string
        'deviceType': 'mobile' | 'web'
        'email': string
        'password': string
        'pinCode'?: string
                                                                                                                                                                                                                                        }): Promise<void>,
                                                                                                                                                                                                                                            logout(
                                                                                                                                                                                                                                                queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>,): Promise<void>,
                                                                                                                                                                                                                                                    loginOrSubscribe(
                                                                                                                                                                                                                                                        queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>, userFields ?: {
                                                                                                                                                                                                                                                            'deviceId': string
        'deviceType': 'mobile' | 'web'
        'phonePrefix': any
        'phoneNumber': string
        'lang': 'fr' | 'en' | 'ru'
        'currency': 'eur' | 'usd' | 'thb' | 'jpy' | 'inr' | 'cny' | 'try' | 'mxn' | 'gbp' | 'chf' | 'rub' | 'pln' | 'dkk' | 'ils' | 'sek' | 'ars' | 'php' | 'brl' | 'cad' | 'krw' | 'nok' | 'sgd' | 'huf' | 'uah' | 'aud' | 'zar' | 'myr' | 'idr' | 'hkd' | 'nzd' | 'aed'
        'firstName'?: string
        'lastName'?: string
        'email'?: string
        'password'?: string
        'referralCode'?: string
        'pinCode'?: string
                                                                                                                                                                                                                                                        }): Promise<void>,
                                                                                                                                                                                                                                                            userLoginWithEmail(
                                                                                                                                                                                                                                                                queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>, userFields ?: {
                                                                                                                                                                                                                                                                    'deviceId': string
        'deviceType': 'mobile' | 'web'
        'email': string
        'password': string
        'pinCode'?: string
                                                                                                                                                                                                                                                                }): Promise<void>,
                                                                                                                                                                                                                                                                    plaidGetLinkToken(
                                                                                                                                                                                                                                                                        queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>,): Promise<void>,
                                                                                                                                                                                                                                                                            plaidStoreToken(
                                                                                                                                                                                                                                                                                queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>, props ?: {
                                                                                                                                                                                                                                                                                    'publicToken': string
                                                                                                                                                                                                                                                                                }): Promise<void>,
                                                                                                                                                                                                                                                                                    plaidGetAllTransactions(
                                                                                                                                                                                                                                                                                        queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>,): Promise<void>,
                                                                                                                                                                                                                                                                                            newsletterSubscriptionsGetAll(
                                                                                                                                                                                                                                                                                                queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>,
                                                                                                                                                                                                                                                                                                filter ?: AsFilter<modelTypes.NewsletterSubscriptionsModels['Write']>,
                                                                                                                                                                                                                                                                                                config ?: never
                                                                                                                                                                                                                                                                                            ): Promise<void>
    newsletterSubscriptionsGetAll<Config extends Omit<RequestConfigRead<modelTypes.NewsletterSubscriptionsModels['Read']>, 'filter'>>(
        queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>,
        filter ?: AsFilter<modelTypes.NewsletterSubscriptionsModels['Write']>,
        config ?: Config
    ): Promise<void>,
        newsletterSubscriptionsGetLastN(
            queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>,
            limit ?: number,
            config ?: never,
        ): Promise<void>
    newsletterSubscriptionsGetLastN<Config extends RequestConfigRead<modelTypes.NewsletterSubscriptionsModels['Read']>>(
        queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>,
        limit ?: number,
        config ?: Config,
    ): Promise<void>,
        newsletterSubscriptionsGetFirstN(
            queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>,
            limit ?: number,
            config ?: never
        ): Promise<void>
    newsletterSubscriptionsGetFirstN<Config extends RequestConfigRead<modelTypes.NewsletterSubscriptionsModels['Read']>>(
        queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>,
        limit ?: number,
        config ?: Config
    ): Promise<void>,
        newsletterSubscriptionsCount(
            queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>,
            filter ?: AsFilter<modelTypes.NewsletterSubscriptionsModels['Write']>
        ): Promise<void>,
            newsletterSubscriptionsGetById<Config extends RequestConfigGetOne<modelTypes.NewsletterSubscriptionsModels['Read']>>(
                queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>,
                id: string,
                config ?: Config
            ): Promise<void>,
                newsletterSubscriptionsGetOne<Config extends Omit<RequestConfigGetOne<modelTypes.NewsletterSubscriptionsModels['Read']>, 'filter'>>(
                    queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>,
                    filter ?: AsFilter<modelTypes.NewsletterSubscriptionsModels['Write']>, // WRITE HERE because it will ensure referenced fields are passed as their string counterpart
                    config ?: Config
                ): Promise<void>,
                    appConfigGetAll(
                        queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>,
                        filter ?: AsFilter<modelTypes.AppConfigModels['Write']>,
                        config ?: never
                    ): Promise<void>
    appConfigGetAll<Config extends Omit<RequestConfigRead<modelTypes.AppConfigModels['Read']>, 'filter'>>(
        queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>,
        filter ?: AsFilter<modelTypes.AppConfigModels['Write']>,
        config ?: Config
    ): Promise<void>,
        appConfigGetLastN(
            queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>,
            limit ?: number,
            config ?: never,
        ): Promise<void>
    appConfigGetLastN<Config extends RequestConfigRead<modelTypes.AppConfigModels['Read']>>(
        queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>,
        limit ?: number,
        config ?: Config,
    ): Promise<void>,
        appConfigGetFirstN(
            queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>,
            limit ?: number,
            config ?: never
        ): Promise<void>
    appConfigGetFirstN<Config extends RequestConfigRead<modelTypes.AppConfigModels['Read']>>(
        queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>,
        limit ?: number,
        config ?: Config
    ): Promise<void>,
        appConfigCount(
            queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>,
            filter ?: AsFilter<modelTypes.AppConfigModels['Write']>
        ): Promise<void>,
            appConfigGetById<Config extends RequestConfigGetOne<modelTypes.AppConfigModels['Read']>>(
                queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>,
                id: string,
                config ?: Config
            ): Promise<void>,
                appConfigGetOne<Config extends Omit<RequestConfigGetOne<modelTypes.AppConfigModels['Read']>, 'filter'>>(
                    queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>,
                    filter ?: AsFilter<modelTypes.AppConfigModels['Write']>, // WRITE HERE because it will ensure referenced fields are passed as their string counterpart
                    config ?: Config
                ): Promise<void>,
                    bangkWalletsGetAll(
                        queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>,
                        filter ?: AsFilter<modelTypes.BangkWalletsModels['Write']>,
                        config ?: never
                    ): Promise<void>
    bangkWalletsGetAll<Config extends Omit<RequestConfigRead<modelTypes.BangkWalletsModels['Read']>, 'filter'>>(
        queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>,
        filter ?: AsFilter<modelTypes.BangkWalletsModels['Write']>,
        config ?: Config
    ): Promise<void>,
        bangkWalletsGetLastN(
            queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>,
            limit ?: number,
            config ?: never,
        ): Promise<void>
    bangkWalletsGetLastN<Config extends RequestConfigRead<modelTypes.BangkWalletsModels['Read']>>(
        queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>,
        limit ?: number,
        config ?: Config,
    ): Promise<void>,
        bangkWalletsGetFirstN(
            queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>,
            limit ?: number,
            config ?: never
        ): Promise<void>
    bangkWalletsGetFirstN<Config extends RequestConfigRead<modelTypes.BangkWalletsModels['Read']>>(
        queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>,
        limit ?: number,
        config ?: Config
    ): Promise<void>,
        bangkWalletsCount(
            queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>,
            filter ?: AsFilter<modelTypes.BangkWalletsModels['Write']>
        ): Promise<void>,
            bangkWalletsGetById<Config extends RequestConfigGetOne<modelTypes.BangkWalletsModels['Read']>>(
                queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>,
                id: string,
                config ?: Config
            ): Promise<void>,
                bangkWalletsGetOne<Config extends Omit<RequestConfigGetOne<modelTypes.BangkWalletsModels['Read']>, 'filter'>>(
                    queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>,
                    filter ?: AsFilter<modelTypes.BangkWalletsModels['Write']>, // WRITE HERE because it will ensure referenced fields are passed as their string counterpart
                    config ?: Config
                ): Promise<void>,
                    blockchainConfigGetAll(
                        queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>,
                        filter ?: AsFilter<modelTypes.BlockchainConfigModels['Write']>,
                        config ?: never
                    ): Promise<void>
    blockchainConfigGetAll<Config extends Omit<RequestConfigRead<modelTypes.BlockchainConfigModels['Read']>, 'filter'>>(
        queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>,
        filter ?: AsFilter<modelTypes.BlockchainConfigModels['Write']>,
        config ?: Config
    ): Promise<void>,
        blockchainConfigGetLastN(
            queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>,
            limit ?: number,
            config ?: never,
        ): Promise<void>
    blockchainConfigGetLastN<Config extends RequestConfigRead<modelTypes.BlockchainConfigModels['Read']>>(
        queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>,
        limit ?: number,
        config ?: Config,
    ): Promise<void>,
        blockchainConfigGetFirstN(
            queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>,
            limit ?: number,
            config ?: never
        ): Promise<void>
    blockchainConfigGetFirstN<Config extends RequestConfigRead<modelTypes.BlockchainConfigModels['Read']>>(
        queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>,
        limit ?: number,
        config ?: Config
    ): Promise<void>,
        blockchainConfigCount(
            queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>,
            filter ?: AsFilter<modelTypes.BlockchainConfigModels['Write']>
        ): Promise<void>,
            blockchainConfigGetById<Config extends RequestConfigGetOne<modelTypes.BlockchainConfigModels['Read']>>(
                queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>,
                id: string,
                config ?: Config
            ): Promise<void>,
                blockchainConfigGetOne<Config extends Omit<RequestConfigGetOne<modelTypes.BlockchainConfigModels['Read']>, 'filter'>>(
                    queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>,
                    filter ?: AsFilter<modelTypes.BlockchainConfigModels['Write']>, // WRITE HERE because it will ensure referenced fields are passed as their string counterpart
                    config ?: Config
                ): Promise<void>,
                    cardGetAll(
                        queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>,
                        filter ?: AsFilter<modelTypes.CardModels['Write']>,
                        config ?: never
                    ): Promise<void>
    cardGetAll<Config extends Omit<RequestConfigRead<modelTypes.CardModels['Read']>, 'filter'>>(
        queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>,
        filter ?: AsFilter<modelTypes.CardModels['Write']>,
        config ?: Config
    ): Promise<void>,
        cardGetLastN(
            queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>,
            limit ?: number,
            config ?: never,
        ): Promise<void>
    cardGetLastN<Config extends RequestConfigRead<modelTypes.CardModels['Read']>>(
        queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>,
        limit ?: number,
        config ?: Config,
    ): Promise<void>,
        cardGetFirstN(
            queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>,
            limit ?: number,
            config ?: never
        ): Promise<void>
    cardGetFirstN<Config extends RequestConfigRead<modelTypes.CardModels['Read']>>(
        queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>,
        limit ?: number,
        config ?: Config
    ): Promise<void>,
        cardCount(
            queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>,
            filter ?: AsFilter<modelTypes.CardModels['Write']>
        ): Promise<void>,
            cardGetById<Config extends RequestConfigGetOne<modelTypes.CardModels['Read']>>(
                queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>,
                id: string,
                config ?: Config
            ): Promise<void>,
                cardGetOne<Config extends Omit<RequestConfigGetOne<modelTypes.CardModels['Read']>, 'filter'>>(
                    queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>,
                    filter ?: AsFilter<modelTypes.CardModels['Write']>, // WRITE HERE because it will ensure referenced fields are passed as their string counterpart
                    config ?: Config
                ): Promise<void>,
                    cardTransactionGetAll(
                        queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>,
                        filter ?: AsFilter<modelTypes.CardTransactionModels['Write']>,
                        config ?: never
                    ): Promise<void>
    cardTransactionGetAll<Config extends Omit<RequestConfigRead<modelTypes.CardTransactionModels['Read']>, 'filter'>>(
        queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>,
        filter ?: AsFilter<modelTypes.CardTransactionModels['Write']>,
        config ?: Config
    ): Promise<void>,
        cardTransactionGetLastN(
            queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>,
            limit ?: number,
            config ?: never,
        ): Promise<void>
    cardTransactionGetLastN<Config extends RequestConfigRead<modelTypes.CardTransactionModels['Read']>>(
        queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>,
        limit ?: number,
        config ?: Config,
    ): Promise<void>,
        cardTransactionGetFirstN(
            queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>,
            limit ?: number,
            config ?: never
        ): Promise<void>
    cardTransactionGetFirstN<Config extends RequestConfigRead<modelTypes.CardTransactionModels['Read']>>(
        queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>,
        limit ?: number,
        config ?: Config
    ): Promise<void>,
        cardTransactionCount(
            queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>,
            filter ?: AsFilter<modelTypes.CardTransactionModels['Write']>
        ): Promise<void>,
            cardTransactionGetById<Config extends RequestConfigGetOne<modelTypes.CardTransactionModels['Read']>>(
                queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>,
                id: string,
                config ?: Config
            ): Promise<void>,
                cardTransactionGetOne<Config extends Omit<RequestConfigGetOne<modelTypes.CardTransactionModels['Read']>, 'filter'>>(
                    queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>,
                    filter ?: AsFilter<modelTypes.CardTransactionModels['Write']>, // WRITE HERE because it will ensure referenced fields are passed as their string counterpart
                    config ?: Config
                ): Promise<void>,
                    companyGetAll(
                        queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>,
                        filter ?: AsFilter<modelTypes.CompanyModels['Write']>,
                        config ?: never
                    ): Promise<void>
    companyGetAll<Config extends Omit<RequestConfigRead<modelTypes.CompanyModels['Read']>, 'filter'>>(
        queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>,
        filter ?: AsFilter<modelTypes.CompanyModels['Write']>,
        config ?: Config
    ): Promise<void>,
        companyGetLastN(
            queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>,
            limit ?: number,
            config ?: never,
        ): Promise<void>
    companyGetLastN<Config extends RequestConfigRead<modelTypes.CompanyModels['Read']>>(
        queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>,
        limit ?: number,
        config ?: Config,
    ): Promise<void>,
        companyGetFirstN(
            queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>,
            limit ?: number,
            config ?: never
        ): Promise<void>
    companyGetFirstN<Config extends RequestConfigRead<modelTypes.CompanyModels['Read']>>(
        queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>,
        limit ?: number,
        config ?: Config
    ): Promise<void>,
        companyCount(
            queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>,
            filter ?: AsFilter<modelTypes.CompanyModels['Write']>
        ): Promise<void>,
            companyGetById<Config extends RequestConfigGetOne<modelTypes.CompanyModels['Read']>>(
                queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>,
                id: string,
                config ?: Config
            ): Promise<void>,
                companyGetOne<Config extends Omit<RequestConfigGetOne<modelTypes.CompanyModels['Read']>, 'filter'>>(
                    queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>,
                    filter ?: AsFilter<modelTypes.CompanyModels['Write']>, // WRITE HERE because it will ensure referenced fields are passed as their string counterpart
                    config ?: Config
                ): Promise<void>,
                    devCommentGetAll(
                        queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>,
                        filter ?: AsFilter<modelTypes.DevCommentModels['Write']>,
                        config ?: never
                    ): Promise<void>
    devCommentGetAll<Config extends Omit<RequestConfigRead<modelTypes.DevCommentModels['Read']>, 'filter'>>(
        queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>,
        filter ?: AsFilter<modelTypes.DevCommentModels['Write']>,
        config ?: Config
    ): Promise<void>,
        devCommentGetLastN(
            queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>,
            limit ?: number,
            config ?: never,
        ): Promise<void>
    devCommentGetLastN<Config extends RequestConfigRead<modelTypes.DevCommentModels['Read']>>(
        queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>,
        limit ?: number,
        config ?: Config,
    ): Promise<void>,
        devCommentGetFirstN(
            queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>,
            limit ?: number,
            config ?: never
        ): Promise<void>
    devCommentGetFirstN<Config extends RequestConfigRead<modelTypes.DevCommentModels['Read']>>(
        queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>,
        limit ?: number,
        config ?: Config
    ): Promise<void>,
        devCommentCount(
            queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>,
            filter ?: AsFilter<modelTypes.DevCommentModels['Write']>
        ): Promise<void>,
            devCommentGetById<Config extends RequestConfigGetOne<modelTypes.DevCommentModels['Read']>>(
                queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>,
                id: string,
                config ?: Config
            ): Promise<void>,
                devCommentGetOne<Config extends Omit<RequestConfigGetOne<modelTypes.DevCommentModels['Read']>, 'filter'>>(
                    queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>,
                    filter ?: AsFilter<modelTypes.DevCommentModels['Write']>, // WRITE HERE because it will ensure referenced fields are passed as their string counterpart
                    config ?: Config
                ): Promise<void>,
                    deviceGetAll(
                        queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>,
                        filter ?: AsFilter<modelTypes.DeviceModels['Write']>,
                        config ?: never
                    ): Promise<void>
    deviceGetAll<Config extends Omit<RequestConfigRead<modelTypes.DeviceModels['Read']>, 'filter'>>(
        queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>,
        filter ?: AsFilter<modelTypes.DeviceModels['Write']>,
        config ?: Config
    ): Promise<void>,
        deviceGetLastN(
            queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>,
            limit ?: number,
            config ?: never,
        ): Promise<void>
    deviceGetLastN<Config extends RequestConfigRead<modelTypes.DeviceModels['Read']>>(
        queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>,
        limit ?: number,
        config ?: Config,
    ): Promise<void>,
        deviceGetFirstN(
            queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>,
            limit ?: number,
            config ?: never
        ): Promise<void>
    deviceGetFirstN<Config extends RequestConfigRead<modelTypes.DeviceModels['Read']>>(
        queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>,
        limit ?: number,
        config ?: Config
    ): Promise<void>,
        deviceCount(
            queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>,
            filter ?: AsFilter<modelTypes.DeviceModels['Write']>
        ): Promise<void>,
            deviceGetById<Config extends RequestConfigGetOne<modelTypes.DeviceModels['Read']>>(
                queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>,
                id: string,
                config ?: Config
            ): Promise<void>,
                deviceGetOne<Config extends Omit<RequestConfigGetOne<modelTypes.DeviceModels['Read']>, 'filter'>>(
                    queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>,
                    filter ?: AsFilter<modelTypes.DeviceModels['Write']>, // WRITE HERE because it will ensure referenced fields are passed as their string counterpart
                    config ?: Config
                ): Promise<void>,
                    icoBonusCodeGetAll(
                        queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>,
                        filter ?: AsFilter<modelTypes.IcoBonusCodeModels['Write']>,
                        config ?: never
                    ): Promise<void>
    icoBonusCodeGetAll<Config extends Omit<RequestConfigRead<modelTypes.IcoBonusCodeModels['Read']>, 'filter'>>(
        queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>,
        filter ?: AsFilter<modelTypes.IcoBonusCodeModels['Write']>,
        config ?: Config
    ): Promise<void>,
        icoBonusCodeGetLastN(
            queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>,
            limit ?: number,
            config ?: never,
        ): Promise<void>
    icoBonusCodeGetLastN<Config extends RequestConfigRead<modelTypes.IcoBonusCodeModels['Read']>>(
        queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>,
        limit ?: number,
        config ?: Config,
    ): Promise<void>,
        icoBonusCodeGetFirstN(
            queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>,
            limit ?: number,
            config ?: never
        ): Promise<void>
    icoBonusCodeGetFirstN<Config extends RequestConfigRead<modelTypes.IcoBonusCodeModels['Read']>>(
        queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>,
        limit ?: number,
        config ?: Config
    ): Promise<void>,
        icoBonusCodeCount(
            queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>,
            filter ?: AsFilter<modelTypes.IcoBonusCodeModels['Write']>
        ): Promise<void>,
            icoBonusCodeGetById<Config extends RequestConfigGetOne<modelTypes.IcoBonusCodeModels['Read']>>(
                queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>,
                id: string,
                config ?: Config
            ): Promise<void>,
                icoBonusCodeGetOne<Config extends Omit<RequestConfigGetOne<modelTypes.IcoBonusCodeModels['Read']>, 'filter'>>(
                    queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>,
                    filter ?: AsFilter<modelTypes.IcoBonusCodeModels['Write']>, // WRITE HERE because it will ensure referenced fields are passed as their string counterpart
                    config ?: Config
                ): Promise<void>,
                    icoDashboardConfigGetAll(
                        queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>,
                        filter ?: AsFilter<modelTypes.IcoDashboardConfigModels['Write']>,
                        config ?: never
                    ): Promise<void>
    icoDashboardConfigGetAll<Config extends Omit<RequestConfigRead<modelTypes.IcoDashboardConfigModels['Read']>, 'filter'>>(
        queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>,
        filter ?: AsFilter<modelTypes.IcoDashboardConfigModels['Write']>,
        config ?: Config
    ): Promise<void>,
        icoDashboardConfigGetLastN(
            queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>,
            limit ?: number,
            config ?: never,
        ): Promise<void>
    icoDashboardConfigGetLastN<Config extends RequestConfigRead<modelTypes.IcoDashboardConfigModels['Read']>>(
        queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>,
        limit ?: number,
        config ?: Config,
    ): Promise<void>,
        icoDashboardConfigGetFirstN(
            queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>,
            limit ?: number,
            config ?: never
        ): Promise<void>
    icoDashboardConfigGetFirstN<Config extends RequestConfigRead<modelTypes.IcoDashboardConfigModels['Read']>>(
        queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>,
        limit ?: number,
        config ?: Config
    ): Promise<void>,
        icoDashboardConfigCount(
            queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>,
            filter ?: AsFilter<modelTypes.IcoDashboardConfigModels['Write']>
        ): Promise<void>,
            icoDashboardConfigGetById<Config extends RequestConfigGetOne<modelTypes.IcoDashboardConfigModels['Read']>>(
                queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>,
                id: string,
                config ?: Config
            ): Promise<void>,
                icoDashboardConfigGetOne<Config extends Omit<RequestConfigGetOne<modelTypes.IcoDashboardConfigModels['Read']>, 'filter'>>(
                    queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>,
                    filter ?: AsFilter<modelTypes.IcoDashboardConfigModels['Write']>, // WRITE HERE because it will ensure referenced fields are passed as their string counterpart
                    config ?: Config
                ): Promise<void>,
                    icoRewardTransactionGetAll(
                        queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>,
                        filter ?: AsFilter<modelTypes.IcoRewardTransactionModels['Write']>,
                        config ?: never
                    ): Promise<void>
    icoRewardTransactionGetAll<Config extends Omit<RequestConfigRead<modelTypes.IcoRewardTransactionModels['Read']>, 'filter'>>(
        queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>,
        filter ?: AsFilter<modelTypes.IcoRewardTransactionModels['Write']>,
        config ?: Config
    ): Promise<void>,
        icoRewardTransactionGetLastN(
            queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>,
            limit ?: number,
            config ?: never,
        ): Promise<void>
    icoRewardTransactionGetLastN<Config extends RequestConfigRead<modelTypes.IcoRewardTransactionModels['Read']>>(
        queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>,
        limit ?: number,
        config ?: Config,
    ): Promise<void>,
        icoRewardTransactionGetFirstN(
            queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>,
            limit ?: number,
            config ?: never
        ): Promise<void>
    icoRewardTransactionGetFirstN<Config extends RequestConfigRead<modelTypes.IcoRewardTransactionModels['Read']>>(
        queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>,
        limit ?: number,
        config ?: Config
    ): Promise<void>,
        icoRewardTransactionCount(
            queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>,
            filter ?: AsFilter<modelTypes.IcoRewardTransactionModels['Write']>
        ): Promise<void>,
            icoRewardTransactionGetById<Config extends RequestConfigGetOne<modelTypes.IcoRewardTransactionModels['Read']>>(
                queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>,
                id: string,
                config ?: Config
            ): Promise<void>,
                icoRewardTransactionGetOne<Config extends Omit<RequestConfigGetOne<modelTypes.IcoRewardTransactionModels['Read']>, 'filter'>>(
                    queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>,
                    filter ?: AsFilter<modelTypes.IcoRewardTransactionModels['Write']>, // WRITE HERE because it will ensure referenced fields are passed as their string counterpart
                    config ?: Config
                ): Promise<void>,
                    icoTransactionGetAll(
                        queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>,
                        filter ?: AsFilter<modelTypes.IcoTransactionModels['Write']>,
                        config ?: never
                    ): Promise<void>
    icoTransactionGetAll<Config extends Omit<RequestConfigRead<modelTypes.IcoTransactionModels['Read']>, 'filter'>>(
        queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>,
        filter ?: AsFilter<modelTypes.IcoTransactionModels['Write']>,
        config ?: Config
    ): Promise<void>,
        icoTransactionGetLastN(
            queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>,
            limit ?: number,
            config ?: never,
        ): Promise<void>
    icoTransactionGetLastN<Config extends RequestConfigRead<modelTypes.IcoTransactionModels['Read']>>(
        queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>,
        limit ?: number,
        config ?: Config,
    ): Promise<void>,
        icoTransactionGetFirstN(
            queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>,
            limit ?: number,
            config ?: never
        ): Promise<void>
    icoTransactionGetFirstN<Config extends RequestConfigRead<modelTypes.IcoTransactionModels['Read']>>(
        queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>,
        limit ?: number,
        config ?: Config
    ): Promise<void>,
        icoTransactionCount(
            queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>,
            filter ?: AsFilter<modelTypes.IcoTransactionModels['Write']>
        ): Promise<void>,
            icoTransactionGetById<Config extends RequestConfigGetOne<modelTypes.IcoTransactionModels['Read']>>(
                queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>,
                id: string,
                config ?: Config
            ): Promise<void>,
                icoTransactionGetOne<Config extends Omit<RequestConfigGetOne<modelTypes.IcoTransactionModels['Read']>, 'filter'>>(
                    queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>,
                    filter ?: AsFilter<modelTypes.IcoTransactionModels['Write']>, // WRITE HERE because it will ensure referenced fields are passed as their string counterpart
                    config ?: Config
                ): Promise<void>,
                    icoWalletTransactionToValidateManuallyGetAll(
                        queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>,
                        filter ?: AsFilter<modelTypes.IcoWalletTransactionToValidateManuallyModels['Write']>,
                        config ?: never
                    ): Promise<void>
    icoWalletTransactionToValidateManuallyGetAll<Config extends Omit<RequestConfigRead<modelTypes.IcoWalletTransactionToValidateManuallyModels['Read']>, 'filter'>>(
        queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>,
        filter ?: AsFilter<modelTypes.IcoWalletTransactionToValidateManuallyModels['Write']>,
        config ?: Config
    ): Promise<void>,
        icoWalletTransactionToValidateManuallyGetLastN(
            queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>,
            limit ?: number,
            config ?: never,
        ): Promise<void>
    icoWalletTransactionToValidateManuallyGetLastN<Config extends RequestConfigRead<modelTypes.IcoWalletTransactionToValidateManuallyModels['Read']>>(
        queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>,
        limit ?: number,
        config ?: Config,
    ): Promise<void>,
        icoWalletTransactionToValidateManuallyGetFirstN(
            queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>,
            limit ?: number,
            config ?: never
        ): Promise<void>
    icoWalletTransactionToValidateManuallyGetFirstN<Config extends RequestConfigRead<modelTypes.IcoWalletTransactionToValidateManuallyModels['Read']>>(
        queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>,
        limit ?: number,
        config ?: Config
    ): Promise<void>,
        icoWalletTransactionToValidateManuallyCount(
            queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>,
            filter ?: AsFilter<modelTypes.IcoWalletTransactionToValidateManuallyModels['Write']>
        ): Promise<void>,
            icoWalletTransactionToValidateManuallyGetById<Config extends RequestConfigGetOne<modelTypes.IcoWalletTransactionToValidateManuallyModels['Read']>>(
                queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>,
                id: string,
                config ?: Config
            ): Promise<void>,
                icoWalletTransactionToValidateManuallyGetOne<Config extends Omit<RequestConfigGetOne<modelTypes.IcoWalletTransactionToValidateManuallyModels['Read']>, 'filter'>>(
                    queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>,
                    filter ?: AsFilter<modelTypes.IcoWalletTransactionToValidateManuallyModels['Write']>, // WRITE HERE because it will ensure referenced fields are passed as their string counterpart
                    config ?: Config
                ): Promise<void>,
                    interestTransactionGetAll(
                        queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>,
                        filter ?: AsFilter<modelTypes.InterestTransactionModels['Write']>,
                        config ?: never
                    ): Promise<void>
    interestTransactionGetAll<Config extends Omit<RequestConfigRead<modelTypes.InterestTransactionModels['Read']>, 'filter'>>(
        queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>,
        filter ?: AsFilter<modelTypes.InterestTransactionModels['Write']>,
        config ?: Config
    ): Promise<void>,
        interestTransactionGetLastN(
            queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>,
            limit ?: number,
            config ?: never,
        ): Promise<void>
    interestTransactionGetLastN<Config extends RequestConfigRead<modelTypes.InterestTransactionModels['Read']>>(
        queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>,
        limit ?: number,
        config ?: Config,
    ): Promise<void>,
        interestTransactionGetFirstN(
            queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>,
            limit ?: number,
            config ?: never
        ): Promise<void>
    interestTransactionGetFirstN<Config extends RequestConfigRead<modelTypes.InterestTransactionModels['Read']>>(
        queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>,
        limit ?: number,
        config ?: Config
    ): Promise<void>,
        interestTransactionCount(
            queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>,
            filter ?: AsFilter<modelTypes.InterestTransactionModels['Write']>
        ): Promise<void>,
            interestTransactionGetById<Config extends RequestConfigGetOne<modelTypes.InterestTransactionModels['Read']>>(
                queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>,
                id: string,
                config ?: Config
            ): Promise<void>,
                interestTransactionGetOne<Config extends Omit<RequestConfigGetOne<modelTypes.InterestTransactionModels['Read']>, 'filter'>>(
                    queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>,
                    filter ?: AsFilter<modelTypes.InterestTransactionModels['Write']>, // WRITE HERE because it will ensure referenced fields are passed as their string counterpart
                    config ?: Config
                ): Promise<void>,
                    investmentBondsGetAll(
                        queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>,
                        filter ?: AsFilter<modelTypes.InvestmentBondsModels['Write']>,
                        config ?: never
                    ): Promise<void>
    investmentBondsGetAll<Config extends Omit<RequestConfigRead<modelTypes.InvestmentBondsModels['Read']>, 'filter'>>(
        queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>,
        filter ?: AsFilter<modelTypes.InvestmentBondsModels['Write']>,
        config ?: Config
    ): Promise<void>,
        investmentBondsGetLastN(
            queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>,
            limit ?: number,
            config ?: never,
        ): Promise<void>
    investmentBondsGetLastN<Config extends RequestConfigRead<modelTypes.InvestmentBondsModels['Read']>>(
        queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>,
        limit ?: number,
        config ?: Config,
    ): Promise<void>,
        investmentBondsGetFirstN(
            queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>,
            limit ?: number,
            config ?: never
        ): Promise<void>
    investmentBondsGetFirstN<Config extends RequestConfigRead<modelTypes.InvestmentBondsModels['Read']>>(
        queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>,
        limit ?: number,
        config ?: Config
    ): Promise<void>,
        investmentBondsCount(
            queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>,
            filter ?: AsFilter<modelTypes.InvestmentBondsModels['Write']>
        ): Promise<void>,
            investmentBondsGetById<Config extends RequestConfigGetOne<modelTypes.InvestmentBondsModels['Read']>>(
                queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>,
                id: string,
                config ?: Config
            ): Promise<void>,
                investmentBondsGetOne<Config extends Omit<RequestConfigGetOne<modelTypes.InvestmentBondsModels['Read']>, 'filter'>>(
                    queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>,
                    filter ?: AsFilter<modelTypes.InvestmentBondsModels['Write']>, // WRITE HERE because it will ensure referenced fields are passed as their string counterpart
                    config ?: Config
                ): Promise<void>,
                    investmentEquityGetAll(
                        queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>,
                        filter ?: AsFilter<modelTypes.InvestmentEquityModels['Write']>,
                        config ?: never
                    ): Promise<void>
    investmentEquityGetAll<Config extends Omit<RequestConfigRead<modelTypes.InvestmentEquityModels['Read']>, 'filter'>>(
        queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>,
        filter ?: AsFilter<modelTypes.InvestmentEquityModels['Write']>,
        config ?: Config
    ): Promise<void>,
        investmentEquityGetLastN(
            queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>,
            limit ?: number,
            config ?: never,
        ): Promise<void>
    investmentEquityGetLastN<Config extends RequestConfigRead<modelTypes.InvestmentEquityModels['Read']>>(
        queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>,
        limit ?: number,
        config ?: Config,
    ): Promise<void>,
        investmentEquityGetFirstN(
            queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>,
            limit ?: number,
            config ?: never
        ): Promise<void>
    investmentEquityGetFirstN<Config extends RequestConfigRead<modelTypes.InvestmentEquityModels['Read']>>(
        queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>,
        limit ?: number,
        config ?: Config
    ): Promise<void>,
        investmentEquityCount(
            queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>,
            filter ?: AsFilter<modelTypes.InvestmentEquityModels['Write']>
        ): Promise<void>,
            investmentEquityGetById<Config extends RequestConfigGetOne<modelTypes.InvestmentEquityModels['Read']>>(
                queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>,
                id: string,
                config ?: Config
            ): Promise<void>,
                investmentEquityGetOne<Config extends Omit<RequestConfigGetOne<modelTypes.InvestmentEquityModels['Read']>, 'filter'>>(
                    queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>,
                    filter ?: AsFilter<modelTypes.InvestmentEquityModels['Write']>, // WRITE HERE because it will ensure referenced fields are passed as their string counterpart
                    config ?: Config
                ): Promise<void>,
                    investmentFundSharesGetAll(
                        queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>,
                        filter ?: AsFilter<modelTypes.InvestmentFundSharesModels['Write']>,
                        config ?: never
                    ): Promise<void>
    investmentFundSharesGetAll<Config extends Omit<RequestConfigRead<modelTypes.InvestmentFundSharesModels['Read']>, 'filter'>>(
        queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>,
        filter ?: AsFilter<modelTypes.InvestmentFundSharesModels['Write']>,
        config ?: Config
    ): Promise<void>,
        investmentFundSharesGetLastN(
            queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>,
            limit ?: number,
            config ?: never,
        ): Promise<void>
    investmentFundSharesGetLastN<Config extends RequestConfigRead<modelTypes.InvestmentFundSharesModels['Read']>>(
        queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>,
        limit ?: number,
        config ?: Config,
    ): Promise<void>,
        investmentFundSharesGetFirstN(
            queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>,
            limit ?: number,
            config ?: never
        ): Promise<void>
    investmentFundSharesGetFirstN<Config extends RequestConfigRead<modelTypes.InvestmentFundSharesModels['Read']>>(
        queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>,
        limit ?: number,
        config ?: Config
    ): Promise<void>,
        investmentFundSharesCount(
            queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>,
            filter ?: AsFilter<modelTypes.InvestmentFundSharesModels['Write']>
        ): Promise<void>,
            investmentFundSharesGetById<Config extends RequestConfigGetOne<modelTypes.InvestmentFundSharesModels['Read']>>(
                queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>,
                id: string,
                config ?: Config
            ): Promise<void>,
                investmentFundSharesGetOne<Config extends Omit<RequestConfigGetOne<modelTypes.InvestmentFundSharesModels['Read']>, 'filter'>>(
                    queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>,
                    filter ?: AsFilter<modelTypes.InvestmentFundSharesModels['Write']>, // WRITE HERE because it will ensure referenced fields are passed as their string counterpart
                    config ?: Config
                ): Promise<void>,
                    investmentProjectBondsGetAll(
                        queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>,
                        filter ?: AsFilter<modelTypes.InvestmentProjectBondsModels['Write']>,
                        config ?: never
                    ): Promise<void>
    investmentProjectBondsGetAll<Config extends Omit<RequestConfigRead<modelTypes.InvestmentProjectBondsModels['Read']>, 'filter'>>(
        queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>,
        filter ?: AsFilter<modelTypes.InvestmentProjectBondsModels['Write']>,
        config ?: Config
    ): Promise<void>,
        investmentProjectBondsGetLastN(
            queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>,
            limit ?: number,
            config ?: never,
        ): Promise<void>
    investmentProjectBondsGetLastN<Config extends RequestConfigRead<modelTypes.InvestmentProjectBondsModels['Read']>>(
        queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>,
        limit ?: number,
        config ?: Config,
    ): Promise<void>,
        investmentProjectBondsGetFirstN(
            queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>,
            limit ?: number,
            config ?: never
        ): Promise<void>
    investmentProjectBondsGetFirstN<Config extends RequestConfigRead<modelTypes.InvestmentProjectBondsModels['Read']>>(
        queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>,
        limit ?: number,
        config ?: Config
    ): Promise<void>,
        investmentProjectBondsCount(
            queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>,
            filter ?: AsFilter<modelTypes.InvestmentProjectBondsModels['Write']>
        ): Promise<void>,
            investmentProjectBondsGetById<Config extends RequestConfigGetOne<modelTypes.InvestmentProjectBondsModels['Read']>>(
                queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>,
                id: string,
                config ?: Config
            ): Promise<void>,
                investmentProjectBondsGetOne<Config extends Omit<RequestConfigGetOne<modelTypes.InvestmentProjectBondsModels['Read']>, 'filter'>>(
                    queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>,
                    filter ?: AsFilter<modelTypes.InvestmentProjectBondsModels['Write']>, // WRITE HERE because it will ensure referenced fields are passed as their string counterpart
                    config ?: Config
                ): Promise<void>,
                    investmentProjectEquityGetAll(
                        queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>,
                        filter ?: AsFilter<modelTypes.InvestmentProjectEquityModels['Write']>,
                        config ?: never
                    ): Promise<void>
    investmentProjectEquityGetAll<Config extends Omit<RequestConfigRead<modelTypes.InvestmentProjectEquityModels['Read']>, 'filter'>>(
        queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>,
        filter ?: AsFilter<modelTypes.InvestmentProjectEquityModels['Write']>,
        config ?: Config
    ): Promise<void>,
        investmentProjectEquityGetLastN(
            queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>,
            limit ?: number,
            config ?: never,
        ): Promise<void>
    investmentProjectEquityGetLastN<Config extends RequestConfigRead<modelTypes.InvestmentProjectEquityModels['Read']>>(
        queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>,
        limit ?: number,
        config ?: Config,
    ): Promise<void>,
        investmentProjectEquityGetFirstN(
            queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>,
            limit ?: number,
            config ?: never
        ): Promise<void>
    investmentProjectEquityGetFirstN<Config extends RequestConfigRead<modelTypes.InvestmentProjectEquityModels['Read']>>(
        queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>,
        limit ?: number,
        config ?: Config
    ): Promise<void>,
        investmentProjectEquityCount(
            queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>,
            filter ?: AsFilter<modelTypes.InvestmentProjectEquityModels['Write']>
        ): Promise<void>,
            investmentProjectEquityGetById<Config extends RequestConfigGetOne<modelTypes.InvestmentProjectEquityModels['Read']>>(
                queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>,
                id: string,
                config ?: Config
            ): Promise<void>,
                investmentProjectEquityGetOne<Config extends Omit<RequestConfigGetOne<modelTypes.InvestmentProjectEquityModels['Read']>, 'filter'>>(
                    queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>,
                    filter ?: AsFilter<modelTypes.InvestmentProjectEquityModels['Write']>, // WRITE HERE because it will ensure referenced fields are passed as their string counterpart
                    config ?: Config
                ): Promise<void>,
                    investmentProjectFundSharesGetAll(
                        queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>,
                        filter ?: AsFilter<modelTypes.InvestmentProjectFundSharesModels['Write']>,
                        config ?: never
                    ): Promise<void>
    investmentProjectFundSharesGetAll<Config extends Omit<RequestConfigRead<modelTypes.InvestmentProjectFundSharesModels['Read']>, 'filter'>>(
        queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>,
        filter ?: AsFilter<modelTypes.InvestmentProjectFundSharesModels['Write']>,
        config ?: Config
    ): Promise<void>,
        investmentProjectFundSharesGetLastN(
            queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>,
            limit ?: number,
            config ?: never,
        ): Promise<void>
    investmentProjectFundSharesGetLastN<Config extends RequestConfigRead<modelTypes.InvestmentProjectFundSharesModels['Read']>>(
        queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>,
        limit ?: number,
        config ?: Config,
    ): Promise<void>,
        investmentProjectFundSharesGetFirstN(
            queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>,
            limit ?: number,
            config ?: never
        ): Promise<void>
    investmentProjectFundSharesGetFirstN<Config extends RequestConfigRead<modelTypes.InvestmentProjectFundSharesModels['Read']>>(
        queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>,
        limit ?: number,
        config ?: Config
    ): Promise<void>,
        investmentProjectFundSharesCount(
            queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>,
            filter ?: AsFilter<modelTypes.InvestmentProjectFundSharesModels['Write']>
        ): Promise<void>,
            investmentProjectFundSharesGetById<Config extends RequestConfigGetOne<modelTypes.InvestmentProjectFundSharesModels['Read']>>(
                queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>,
                id: string,
                config ?: Config
            ): Promise<void>,
                investmentProjectFundSharesGetOne<Config extends Omit<RequestConfigGetOne<modelTypes.InvestmentProjectFundSharesModels['Read']>, 'filter'>>(
                    queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>,
                    filter ?: AsFilter<modelTypes.InvestmentProjectFundSharesModels['Write']>, // WRITE HERE because it will ensure referenced fields are passed as their string counterpart
                    config ?: Config
                ): Promise<void>,
                    investmentTransactionBondsGetAll(
                        queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>,
                        filter ?: AsFilter<modelTypes.InvestmentTransactionBondsModels['Write']>,
                        config ?: never
                    ): Promise<void>
    investmentTransactionBondsGetAll<Config extends Omit<RequestConfigRead<modelTypes.InvestmentTransactionBondsModels['Read']>, 'filter'>>(
        queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>,
        filter ?: AsFilter<modelTypes.InvestmentTransactionBondsModels['Write']>,
        config ?: Config
    ): Promise<void>,
        investmentTransactionBondsGetLastN(
            queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>,
            limit ?: number,
            config ?: never,
        ): Promise<void>
    investmentTransactionBondsGetLastN<Config extends RequestConfigRead<modelTypes.InvestmentTransactionBondsModels['Read']>>(
        queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>,
        limit ?: number,
        config ?: Config,
    ): Promise<void>,
        investmentTransactionBondsGetFirstN(
            queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>,
            limit ?: number,
            config ?: never
        ): Promise<void>
    investmentTransactionBondsGetFirstN<Config extends RequestConfigRead<modelTypes.InvestmentTransactionBondsModels['Read']>>(
        queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>,
        limit ?: number,
        config ?: Config
    ): Promise<void>,
        investmentTransactionBondsCount(
            queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>,
            filter ?: AsFilter<modelTypes.InvestmentTransactionBondsModels['Write']>
        ): Promise<void>,
            investmentTransactionBondsGetById<Config extends RequestConfigGetOne<modelTypes.InvestmentTransactionBondsModels['Read']>>(
                queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>,
                id: string,
                config ?: Config
            ): Promise<void>,
                investmentTransactionBondsGetOne<Config extends Omit<RequestConfigGetOne<modelTypes.InvestmentTransactionBondsModels['Read']>, 'filter'>>(
                    queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>,
                    filter ?: AsFilter<modelTypes.InvestmentTransactionBondsModels['Write']>, // WRITE HERE because it will ensure referenced fields are passed as their string counterpart
                    config ?: Config
                ): Promise<void>,
                    investmentTransactionEquityGetAll(
                        queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>,
                        filter ?: AsFilter<modelTypes.InvestmentTransactionEquityModels['Write']>,
                        config ?: never
                    ): Promise<void>
    investmentTransactionEquityGetAll<Config extends Omit<RequestConfigRead<modelTypes.InvestmentTransactionEquityModels['Read']>, 'filter'>>(
        queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>,
        filter ?: AsFilter<modelTypes.InvestmentTransactionEquityModels['Write']>,
        config ?: Config
    ): Promise<void>,
        investmentTransactionEquityGetLastN(
            queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>,
            limit ?: number,
            config ?: never,
        ): Promise<void>
    investmentTransactionEquityGetLastN<Config extends RequestConfigRead<modelTypes.InvestmentTransactionEquityModels['Read']>>(
        queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>,
        limit ?: number,
        config ?: Config,
    ): Promise<void>,
        investmentTransactionEquityGetFirstN(
            queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>,
            limit ?: number,
            config ?: never
        ): Promise<void>
    investmentTransactionEquityGetFirstN<Config extends RequestConfigRead<modelTypes.InvestmentTransactionEquityModels['Read']>>(
        queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>,
        limit ?: number,
        config ?: Config
    ): Promise<void>,
        investmentTransactionEquityCount(
            queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>,
            filter ?: AsFilter<modelTypes.InvestmentTransactionEquityModels['Write']>
        ): Promise<void>,
            investmentTransactionEquityGetById<Config extends RequestConfigGetOne<modelTypes.InvestmentTransactionEquityModels['Read']>>(
                queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>,
                id: string,
                config ?: Config
            ): Promise<void>,
                investmentTransactionEquityGetOne<Config extends Omit<RequestConfigGetOne<modelTypes.InvestmentTransactionEquityModels['Read']>, 'filter'>>(
                    queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>,
                    filter ?: AsFilter<modelTypes.InvestmentTransactionEquityModels['Write']>, // WRITE HERE because it will ensure referenced fields are passed as their string counterpart
                    config ?: Config
                ): Promise<void>,
                    investmentTransactionFundSharesGetAll(
                        queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>,
                        filter ?: AsFilter<modelTypes.InvestmentTransactionFundSharesModels['Write']>,
                        config ?: never
                    ): Promise<void>
    investmentTransactionFundSharesGetAll<Config extends Omit<RequestConfigRead<modelTypes.InvestmentTransactionFundSharesModels['Read']>, 'filter'>>(
        queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>,
        filter ?: AsFilter<modelTypes.InvestmentTransactionFundSharesModels['Write']>,
        config ?: Config
    ): Promise<void>,
        investmentTransactionFundSharesGetLastN(
            queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>,
            limit ?: number,
            config ?: never,
        ): Promise<void>
    investmentTransactionFundSharesGetLastN<Config extends RequestConfigRead<modelTypes.InvestmentTransactionFundSharesModels['Read']>>(
        queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>,
        limit ?: number,
        config ?: Config,
    ): Promise<void>,
        investmentTransactionFundSharesGetFirstN(
            queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>,
            limit ?: number,
            config ?: never
        ): Promise<void>
    investmentTransactionFundSharesGetFirstN<Config extends RequestConfigRead<modelTypes.InvestmentTransactionFundSharesModels['Read']>>(
        queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>,
        limit ?: number,
        config ?: Config
    ): Promise<void>,
        investmentTransactionFundSharesCount(
            queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>,
            filter ?: AsFilter<modelTypes.InvestmentTransactionFundSharesModels['Write']>
        ): Promise<void>,
            investmentTransactionFundSharesGetById<Config extends RequestConfigGetOne<modelTypes.InvestmentTransactionFundSharesModels['Read']>>(
                queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>,
                id: string,
                config ?: Config
            ): Promise<void>,
                investmentTransactionFundSharesGetOne<Config extends Omit<RequestConfigGetOne<modelTypes.InvestmentTransactionFundSharesModels['Read']>, 'filter'>>(
                    queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>,
                    filter ?: AsFilter<modelTypes.InvestmentTransactionFundSharesModels['Write']>, // WRITE HERE because it will ensure referenced fields are passed as their string counterpart
                    config ?: Config
                ): Promise<void>,
                    missionGetAll(
                        queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>,
                        filter ?: AsFilter<modelTypes.MissionModels['Write']>,
                        config ?: never
                    ): Promise<void>
    missionGetAll<Config extends Omit<RequestConfigRead<modelTypes.MissionModels['Read']>, 'filter'>>(
        queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>,
        filter ?: AsFilter<modelTypes.MissionModels['Write']>,
        config ?: Config
    ): Promise<void>,
        missionGetLastN(
            queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>,
            limit ?: number,
            config ?: never,
        ): Promise<void>
    missionGetLastN<Config extends RequestConfigRead<modelTypes.MissionModels['Read']>>(
        queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>,
        limit ?: number,
        config ?: Config,
    ): Promise<void>,
        missionGetFirstN(
            queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>,
            limit ?: number,
            config ?: never
        ): Promise<void>
    missionGetFirstN<Config extends RequestConfigRead<modelTypes.MissionModels['Read']>>(
        queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>,
        limit ?: number,
        config ?: Config
    ): Promise<void>,
        missionCount(
            queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>,
            filter ?: AsFilter<modelTypes.MissionModels['Write']>
        ): Promise<void>,
            missionGetById<Config extends RequestConfigGetOne<modelTypes.MissionModels['Read']>>(
                queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>,
                id: string,
                config ?: Config
            ): Promise<void>,
                missionGetOne<Config extends Omit<RequestConfigGetOne<modelTypes.MissionModels['Read']>, 'filter'>>(
                    queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>,
                    filter ?: AsFilter<modelTypes.MissionModels['Write']>, // WRITE HERE because it will ensure referenced fields are passed as their string counterpart
                    config ?: Config
                ): Promise<void>,
                    newsGetAll(
                        queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>,
                        filter ?: AsFilter<modelTypes.NewsModels['Write']>,
                        config ?: never
                    ): Promise<void>
    newsGetAll<Config extends Omit<RequestConfigRead<modelTypes.NewsModels['Read']>, 'filter'>>(
        queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>,
        filter ?: AsFilter<modelTypes.NewsModels['Write']>,
        config ?: Config
    ): Promise<void>,
        newsGetLastN(
            queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>,
            limit ?: number,
            config ?: never,
        ): Promise<void>
    newsGetLastN<Config extends RequestConfigRead<modelTypes.NewsModels['Read']>>(
        queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>,
        limit ?: number,
        config ?: Config,
    ): Promise<void>,
        newsGetFirstN(
            queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>,
            limit ?: number,
            config ?: never
        ): Promise<void>
    newsGetFirstN<Config extends RequestConfigRead<modelTypes.NewsModels['Read']>>(
        queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>,
        limit ?: number,
        config ?: Config
    ): Promise<void>,
        newsCount(
            queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>,
            filter ?: AsFilter<modelTypes.NewsModels['Write']>
        ): Promise<void>,
            newsGetById<Config extends RequestConfigGetOne<modelTypes.NewsModels['Read']>>(
                queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>,
                id: string,
                config ?: Config
            ): Promise<void>,
                newsGetOne<Config extends Omit<RequestConfigGetOne<modelTypes.NewsModels['Read']>, 'filter'>>(
                    queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>,
                    filter ?: AsFilter<modelTypes.NewsModels['Write']>, // WRITE HERE because it will ensure referenced fields are passed as their string counterpart
                    config ?: Config
                ): Promise<void>,
                    sellOfferBondsGetAll(
                        queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>,
                        filter ?: AsFilter<modelTypes.SellOfferBondsModels['Write']>,
                        config ?: never
                    ): Promise<void>
    sellOfferBondsGetAll<Config extends Omit<RequestConfigRead<modelTypes.SellOfferBondsModels['Read']>, 'filter'>>(
        queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>,
        filter ?: AsFilter<modelTypes.SellOfferBondsModels['Write']>,
        config ?: Config
    ): Promise<void>,
        sellOfferBondsGetLastN(
            queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>,
            limit ?: number,
            config ?: never,
        ): Promise<void>
    sellOfferBondsGetLastN<Config extends RequestConfigRead<modelTypes.SellOfferBondsModels['Read']>>(
        queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>,
        limit ?: number,
        config ?: Config,
    ): Promise<void>,
        sellOfferBondsGetFirstN(
            queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>,
            limit ?: number,
            config ?: never
        ): Promise<void>
    sellOfferBondsGetFirstN<Config extends RequestConfigRead<modelTypes.SellOfferBondsModels['Read']>>(
        queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>,
        limit ?: number,
        config ?: Config
    ): Promise<void>,
        sellOfferBondsCount(
            queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>,
            filter ?: AsFilter<modelTypes.SellOfferBondsModels['Write']>
        ): Promise<void>,
            sellOfferBondsGetById<Config extends RequestConfigGetOne<modelTypes.SellOfferBondsModels['Read']>>(
                queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>,
                id: string,
                config ?: Config
            ): Promise<void>,
                sellOfferBondsGetOne<Config extends Omit<RequestConfigGetOne<modelTypes.SellOfferBondsModels['Read']>, 'filter'>>(
                    queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>,
                    filter ?: AsFilter<modelTypes.SellOfferBondsModels['Write']>, // WRITE HERE because it will ensure referenced fields are passed as their string counterpart
                    config ?: Config
                ): Promise<void>,
                    sellOfferEquityGetAll(
                        queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>,
                        filter ?: AsFilter<modelTypes.SellOfferEquityModels['Write']>,
                        config ?: never
                    ): Promise<void>
    sellOfferEquityGetAll<Config extends Omit<RequestConfigRead<modelTypes.SellOfferEquityModels['Read']>, 'filter'>>(
        queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>,
        filter ?: AsFilter<modelTypes.SellOfferEquityModels['Write']>,
        config ?: Config
    ): Promise<void>,
        sellOfferEquityGetLastN(
            queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>,
            limit ?: number,
            config ?: never,
        ): Promise<void>
    sellOfferEquityGetLastN<Config extends RequestConfigRead<modelTypes.SellOfferEquityModels['Read']>>(
        queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>,
        limit ?: number,
        config ?: Config,
    ): Promise<void>,
        sellOfferEquityGetFirstN(
            queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>,
            limit ?: number,
            config ?: never
        ): Promise<void>
    sellOfferEquityGetFirstN<Config extends RequestConfigRead<modelTypes.SellOfferEquityModels['Read']>>(
        queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>,
        limit ?: number,
        config ?: Config
    ): Promise<void>,
        sellOfferEquityCount(
            queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>,
            filter ?: AsFilter<modelTypes.SellOfferEquityModels['Write']>
        ): Promise<void>,
            sellOfferEquityGetById<Config extends RequestConfigGetOne<modelTypes.SellOfferEquityModels['Read']>>(
                queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>,
                id: string,
                config ?: Config
            ): Promise<void>,
                sellOfferEquityGetOne<Config extends Omit<RequestConfigGetOne<modelTypes.SellOfferEquityModels['Read']>, 'filter'>>(
                    queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>,
                    filter ?: AsFilter<modelTypes.SellOfferEquityModels['Write']>, // WRITE HERE because it will ensure referenced fields are passed as their string counterpart
                    config ?: Config
                ): Promise<void>,
                    sellOfferFundSharesGetAll(
                        queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>,
                        filter ?: AsFilter<modelTypes.SellOfferFundSharesModels['Write']>,
                        config ?: never
                    ): Promise<void>
    sellOfferFundSharesGetAll<Config extends Omit<RequestConfigRead<modelTypes.SellOfferFundSharesModels['Read']>, 'filter'>>(
        queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>,
        filter ?: AsFilter<modelTypes.SellOfferFundSharesModels['Write']>,
        config ?: Config
    ): Promise<void>,
        sellOfferFundSharesGetLastN(
            queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>,
            limit ?: number,
            config ?: never,
        ): Promise<void>
    sellOfferFundSharesGetLastN<Config extends RequestConfigRead<modelTypes.SellOfferFundSharesModels['Read']>>(
        queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>,
        limit ?: number,
        config ?: Config,
    ): Promise<void>,
        sellOfferFundSharesGetFirstN(
            queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>,
            limit ?: number,
            config ?: never
        ): Promise<void>
    sellOfferFundSharesGetFirstN<Config extends RequestConfigRead<modelTypes.SellOfferFundSharesModels['Read']>>(
        queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>,
        limit ?: number,
        config ?: Config
    ): Promise<void>,
        sellOfferFundSharesCount(
            queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>,
            filter ?: AsFilter<modelTypes.SellOfferFundSharesModels['Write']>
        ): Promise<void>,
            sellOfferFundSharesGetById<Config extends RequestConfigGetOne<modelTypes.SellOfferFundSharesModels['Read']>>(
                queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>,
                id: string,
                config ?: Config
            ): Promise<void>,
                sellOfferFundSharesGetOne<Config extends Omit<RequestConfigGetOne<modelTypes.SellOfferFundSharesModels['Read']>, 'filter'>>(
                    queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>,
                    filter ?: AsFilter<modelTypes.SellOfferFundSharesModels['Write']>, // WRITE HERE because it will ensure referenced fields are passed as their string counterpart
                    config ?: Config
                ): Promise<void>,
                    serverBlacklistGetAll(
                        queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>,
                        filter ?: AsFilter<modelTypes.ServerBlacklistModels['Write']>,
                        config ?: never
                    ): Promise<void>
    serverBlacklistGetAll<Config extends Omit<RequestConfigRead<modelTypes.ServerBlacklistModels['Read']>, 'filter'>>(
        queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>,
        filter ?: AsFilter<modelTypes.ServerBlacklistModels['Write']>,
        config ?: Config
    ): Promise<void>,
        serverBlacklistGetLastN(
            queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>,
            limit ?: number,
            config ?: never,
        ): Promise<void>
    serverBlacklistGetLastN<Config extends RequestConfigRead<modelTypes.ServerBlacklistModels['Read']>>(
        queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>,
        limit ?: number,
        config ?: Config,
    ): Promise<void>,
        serverBlacklistGetFirstN(
            queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>,
            limit ?: number,
            config ?: never
        ): Promise<void>
    serverBlacklistGetFirstN<Config extends RequestConfigRead<modelTypes.ServerBlacklistModels['Read']>>(
        queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>,
        limit ?: number,
        config ?: Config
    ): Promise<void>,
        serverBlacklistCount(
            queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>,
            filter ?: AsFilter<modelTypes.ServerBlacklistModels['Write']>
        ): Promise<void>,
            serverBlacklistGetById<Config extends RequestConfigGetOne<modelTypes.ServerBlacklistModels['Read']>>(
                queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>,
                id: string,
                config ?: Config
            ): Promise<void>,
                serverBlacklistGetOne<Config extends Omit<RequestConfigGetOne<modelTypes.ServerBlacklistModels['Read']>, 'filter'>>(
                    queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>,
                    filter ?: AsFilter<modelTypes.ServerBlacklistModels['Write']>, // WRITE HERE because it will ensure referenced fields are passed as their string counterpart
                    config ?: Config
                ): Promise<void>,
                    supportMessagesGetAll(
                        queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>,
                        filter ?: AsFilter<modelTypes.SupportMessagesModels['Write']>,
                        config ?: never
                    ): Promise<void>
    supportMessagesGetAll<Config extends Omit<RequestConfigRead<modelTypes.SupportMessagesModels['Read']>, 'filter'>>(
        queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>,
        filter ?: AsFilter<modelTypes.SupportMessagesModels['Write']>,
        config ?: Config
    ): Promise<void>,
        supportMessagesGetLastN(
            queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>,
            limit ?: number,
            config ?: never,
        ): Promise<void>
    supportMessagesGetLastN<Config extends RequestConfigRead<modelTypes.SupportMessagesModels['Read']>>(
        queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>,
        limit ?: number,
        config ?: Config,
    ): Promise<void>,
        supportMessagesGetFirstN(
            queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>,
            limit ?: number,
            config ?: never
        ): Promise<void>
    supportMessagesGetFirstN<Config extends RequestConfigRead<modelTypes.SupportMessagesModels['Read']>>(
        queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>,
        limit ?: number,
        config ?: Config
    ): Promise<void>,
        supportMessagesCount(
            queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>,
            filter ?: AsFilter<modelTypes.SupportMessagesModels['Write']>
        ): Promise<void>,
            supportMessagesGetById<Config extends RequestConfigGetOne<modelTypes.SupportMessagesModels['Read']>>(
                queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>,
                id: string,
                config ?: Config
            ): Promise<void>,
                supportMessagesGetOne<Config extends Omit<RequestConfigGetOne<modelTypes.SupportMessagesModels['Read']>, 'filter'>>(
                    queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>,
                    filter ?: AsFilter<modelTypes.SupportMessagesModels['Write']>, // WRITE HERE because it will ensure referenced fields are passed as their string counterpart
                    config ?: Config
                ): Promise<void>,
                    tagGetAll(
                        queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>,
                        filter ?: AsFilter<modelTypes.TagModels['Write']>,
                        config ?: never
                    ): Promise<void>
    tagGetAll<Config extends Omit<RequestConfigRead<modelTypes.TagModels['Read']>, 'filter'>>(
        queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>,
        filter ?: AsFilter<modelTypes.TagModels['Write']>,
        config ?: Config
    ): Promise<void>,
        tagGetLastN(
            queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>,
            limit ?: number,
            config ?: never,
        ): Promise<void>
    tagGetLastN<Config extends RequestConfigRead<modelTypes.TagModels['Read']>>(
        queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>,
        limit ?: number,
        config ?: Config,
    ): Promise<void>,
        tagGetFirstN(
            queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>,
            limit ?: number,
            config ?: never
        ): Promise<void>
    tagGetFirstN<Config extends RequestConfigRead<modelTypes.TagModels['Read']>>(
        queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>,
        limit ?: number,
        config ?: Config
    ): Promise<void>,
        tagCount(
            queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>,
            filter ?: AsFilter<modelTypes.TagModels['Write']>
        ): Promise<void>,
            tagGetById<Config extends RequestConfigGetOne<modelTypes.TagModels['Read']>>(
                queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>,
                id: string,
                config ?: Config
            ): Promise<void>,
                tagGetOne<Config extends Omit<RequestConfigGetOne<modelTypes.TagModels['Read']>, 'filter'>>(
                    queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>,
                    filter ?: AsFilter<modelTypes.TagModels['Write']>, // WRITE HERE because it will ensure referenced fields are passed as their string counterpart
                    config ?: Config
                ): Promise<void>,
                    trackingDataEventsGetAll(
                        queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>,
                        filter ?: AsFilter<modelTypes.TrackingDataEventsModels['Write']>,
                        config ?: never
                    ): Promise<void>
    trackingDataEventsGetAll<Config extends Omit<RequestConfigRead<modelTypes.TrackingDataEventsModels['Read']>, 'filter'>>(
        queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>,
        filter ?: AsFilter<modelTypes.TrackingDataEventsModels['Write']>,
        config ?: Config
    ): Promise<void>,
        trackingDataEventsGetLastN(
            queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>,
            limit ?: number,
            config ?: never,
        ): Promise<void>
    trackingDataEventsGetLastN<Config extends RequestConfigRead<modelTypes.TrackingDataEventsModels['Read']>>(
        queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>,
        limit ?: number,
        config ?: Config,
    ): Promise<void>,
        trackingDataEventsGetFirstN(
            queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>,
            limit ?: number,
            config ?: never
        ): Promise<void>
    trackingDataEventsGetFirstN<Config extends RequestConfigRead<modelTypes.TrackingDataEventsModels['Read']>>(
        queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>,
        limit ?: number,
        config ?: Config
    ): Promise<void>,
        trackingDataEventsCount(
            queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>,
            filter ?: AsFilter<modelTypes.TrackingDataEventsModels['Write']>
        ): Promise<void>,
            trackingDataEventsGetById<Config extends RequestConfigGetOne<modelTypes.TrackingDataEventsModels['Read']>>(
                queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>,
                id: string,
                config ?: Config
            ): Promise<void>,
                trackingDataEventsGetOne<Config extends Omit<RequestConfigGetOne<modelTypes.TrackingDataEventsModels['Read']>, 'filter'>>(
                    queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>,
                    filter ?: AsFilter<modelTypes.TrackingDataEventsModels['Write']>, // WRITE HERE because it will ensure referenced fields are passed as their string counterpart
                    config ?: Config
                ): Promise<void>,
                    trackingDataSessionGetAll(
                        queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>,
                        filter ?: AsFilter<modelTypes.TrackingDataSessionModels['Write']>,
                        config ?: never
                    ): Promise<void>
    trackingDataSessionGetAll<Config extends Omit<RequestConfigRead<modelTypes.TrackingDataSessionModels['Read']>, 'filter'>>(
        queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>,
        filter ?: AsFilter<modelTypes.TrackingDataSessionModels['Write']>,
        config ?: Config
    ): Promise<void>,
        trackingDataSessionGetLastN(
            queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>,
            limit ?: number,
            config ?: never,
        ): Promise<void>
    trackingDataSessionGetLastN<Config extends RequestConfigRead<modelTypes.TrackingDataSessionModels['Read']>>(
        queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>,
        limit ?: number,
        config ?: Config,
    ): Promise<void>,
        trackingDataSessionGetFirstN(
            queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>,
            limit ?: number,
            config ?: never
        ): Promise<void>
    trackingDataSessionGetFirstN<Config extends RequestConfigRead<modelTypes.TrackingDataSessionModels['Read']>>(
        queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>,
        limit ?: number,
        config ?: Config
    ): Promise<void>,
        trackingDataSessionCount(
            queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>,
            filter ?: AsFilter<modelTypes.TrackingDataSessionModels['Write']>
        ): Promise<void>,
            trackingDataSessionGetById<Config extends RequestConfigGetOne<modelTypes.TrackingDataSessionModels['Read']>>(
                queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>,
                id: string,
                config ?: Config
            ): Promise<void>,
                trackingDataSessionGetOne<Config extends Omit<RequestConfigGetOne<modelTypes.TrackingDataSessionModels['Read']>, 'filter'>>(
                    queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>,
                    filter ?: AsFilter<modelTypes.TrackingDataSessionModels['Write']>, // WRITE HERE because it will ensure referenced fields are passed as their string counterpart
                    config ?: Config
                ): Promise<void>,
                    unexpectedthrow error.etAll(
                        queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>,
                        filter ?: AsFilter<modelTypes.UnexpectedErrorModels['Write']>,
                        config ?: never
                    ): Promise<void>
    unexpectedErrorGetAll<Config extends Omit<RequestConfigRead<modelTypes.UnexpectedErrorModels['Read']>, 'filter'>>(
        queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>,
        filter ?: AsFilter<modelTypes.UnexpectedErrorModels['Write']>,
        config ?: Config
    ): Promise<void>,
        unexpectedthrow error.etLastN(
            queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>,
            limit ?: number,
            config ?: never,
        ): Promise<void>
    unexpectedErrorGetLastN<Config extends RequestConfigRead<modelTypes.UnexpectedErrorModels['Read']>>(
        queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>,
        limit ?: number,
        config ?: Config,
    ): Promise<void>,
        unexpectedthrow error.etFirstN(
            queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>,
            limit ?: number,
            config ?: never
        ): Promise<void>
    unexpectedErrorGetFirstN<Config extends RequestConfigRead<modelTypes.UnexpectedErrorModels['Read']>>(
        queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>,
        limit ?: number,
        config ?: Config
    ): Promise<void>,
        unexpectedthrow error.ount(
            queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>,
            filter ?: AsFilter<modelTypes.UnexpectedErrorModels['Write']>
        ): Promise<void>,
            unexpectedErrorGetById<Config extends RequestConfigGetOne<modelTypes.UnexpectedErrorModels['Read']>>(
                queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>,
                id: string,
                config ?: Config
            ): Promise<void>,
                unexpectedErrorGetOne<Config extends Omit<RequestConfigGetOne<modelTypes.UnexpectedErrorModels['Read']>, 'filter'>>(
                    queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>,
                    filter ?: AsFilter<modelTypes.UnexpectedErrorModels['Write']>, // WRITE HERE because it will ensure referenced fields are passed as their string counterpart
                    config ?: Config
                ): Promise<void>,
                    userGetAll(
                        queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>,
                        filter ?: AsFilter<modelTypes.UserModels['Write']>,
                        config ?: never
                    ): Promise<void>
    userGetAll<Config extends Omit<RequestConfigRead<modelTypes.UserModels['Read']>, 'filter'>>(
        queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>,
        filter ?: AsFilter<modelTypes.UserModels['Write']>,
        config ?: Config
    ): Promise<void>,
        userGetLastN(
            queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>,
            limit ?: number,
            config ?: never,
        ): Promise<void>
    userGetLastN<Config extends RequestConfigRead<modelTypes.UserModels['Read']>>(
        queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>,
        limit ?: number,
        config ?: Config,
    ): Promise<void>,
        userGetFirstN(
            queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>,
            limit ?: number,
            config ?: never
        ): Promise<void>
    userGetFirstN<Config extends RequestConfigRead<modelTypes.UserModels['Read']>>(
        queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>,
        limit ?: number,
        config ?: Config
    ): Promise<void>,
        userCount(
            queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>,
            filter ?: AsFilter<modelTypes.UserModels['Write']>
        ): Promise<void>,
            userGetById<Config extends RequestConfigGetOne<modelTypes.UserModels['Read']>>(
                queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>,
                id: string,
                config ?: Config
            ): Promise<void>,
                userGetOne<Config extends Omit<RequestConfigGetOne<modelTypes.UserModels['Read']>, 'filter'>>(
                    queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>,
                    filter ?: AsFilter<modelTypes.UserModels['Write']>, // WRITE HERE because it will ensure referenced fields are passed as their string counterpart
                    config ?: Config
                ): Promise<void>,
                    utmCampaignGetAll(
                        queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>,
                        filter ?: AsFilter<modelTypes.UtmCampaignModels['Write']>,
                        config ?: never
                    ): Promise<void>
    utmCampaignGetAll<Config extends Omit<RequestConfigRead<modelTypes.UtmCampaignModels['Read']>, 'filter'>>(
        queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>,
        filter ?: AsFilter<modelTypes.UtmCampaignModels['Write']>,
        config ?: Config
    ): Promise<void>,
        utmCampaignGetLastN(
            queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>,
            limit ?: number,
            config ?: never,
        ): Promise<void>
    utmCampaignGetLastN<Config extends RequestConfigRead<modelTypes.UtmCampaignModels['Read']>>(
        queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>,
        limit ?: number,
        config ?: Config,
    ): Promise<void>,
        utmCampaignGetFirstN(
            queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>,
            limit ?: number,
            config ?: never
        ): Promise<void>
    utmCampaignGetFirstN<Config extends RequestConfigRead<modelTypes.UtmCampaignModels['Read']>>(
        queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>,
        limit ?: number,
        config ?: Config
    ): Promise<void>,
        utmCampaignCount(
            queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>,
            filter ?: AsFilter<modelTypes.UtmCampaignModels['Write']>
        ): Promise<void>,
            utmCampaignGetById<Config extends RequestConfigGetOne<modelTypes.UtmCampaignModels['Read']>>(
                queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>,
                id: string,
                config ?: Config
            ): Promise<void>,
                utmCampaignGetOne<Config extends Omit<RequestConfigGetOne<modelTypes.UtmCampaignModels['Read']>, 'filter'>>(
                    queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>,
                    filter ?: AsFilter<modelTypes.UtmCampaignModels['Write']>, // WRITE HERE because it will ensure referenced fields are passed as their string counterpart
                    config ?: Config
                ): Promise<void>,
                    vestingConfigGetAll(
                        queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>,
                        filter ?: AsFilter<modelTypes.VestingConfigModels['Write']>,
                        config ?: never
                    ): Promise<void>
    vestingConfigGetAll<Config extends Omit<RequestConfigRead<modelTypes.VestingConfigModels['Read']>, 'filter'>>(
        queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>,
        filter ?: AsFilter<modelTypes.VestingConfigModels['Write']>,
        config ?: Config
    ): Promise<void>,
        vestingConfigGetLastN(
            queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>,
            limit ?: number,
            config ?: never,
        ): Promise<void>
    vestingConfigGetLastN<Config extends RequestConfigRead<modelTypes.VestingConfigModels['Read']>>(
        queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>,
        limit ?: number,
        config ?: Config,
    ): Promise<void>,
        vestingConfigGetFirstN(
            queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>,
            limit ?: number,
            config ?: never
        ): Promise<void>
    vestingConfigGetFirstN<Config extends RequestConfigRead<modelTypes.VestingConfigModels['Read']>>(
        queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>,
        limit ?: number,
        config ?: Config
    ): Promise<void>,
        vestingConfigCount(
            queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>,
            filter ?: AsFilter<modelTypes.VestingConfigModels['Write']>
        ): Promise<void>,
            vestingConfigGetById<Config extends RequestConfigGetOne<modelTypes.VestingConfigModels['Read']>>(
                queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>,
                id: string,
                config ?: Config
            ): Promise<void>,
                vestingConfigGetOne<Config extends Omit<RequestConfigGetOne<modelTypes.VestingConfigModels['Read']>, 'filter'>>(
                    queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>,
                    filter ?: AsFilter<modelTypes.VestingConfigModels['Write']>, // WRITE HERE because it will ensure referenced fields are passed as their string counterpart
                    config ?: Config
                ): Promise<void>,
                    walletGetAll(
                        queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>,
                        filter ?: AsFilter<modelTypes.WalletModels['Write']>,
                        config ?: never
                    ): Promise<void>
    walletGetAll<Config extends Omit<RequestConfigRead<modelTypes.WalletModels['Read']>, 'filter'>>(
        queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>,
        filter ?: AsFilter<modelTypes.WalletModels['Write']>,
        config ?: Config
    ): Promise<void>,
        walletGetLastN(
            queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>,
            limit ?: number,
            config ?: never,
        ): Promise<void>
    walletGetLastN<Config extends RequestConfigRead<modelTypes.WalletModels['Read']>>(
        queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>,
        limit ?: number,
        config ?: Config,
    ): Promise<void>,
        walletGetFirstN(
            queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>,
            limit ?: number,
            config ?: never
        ): Promise<void>
    walletGetFirstN<Config extends RequestConfigRead<modelTypes.WalletModels['Read']>>(
        queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>,
        limit ?: number,
        config ?: Config
    ): Promise<void>,
        walletCount(
            queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>,
            filter ?: AsFilter<modelTypes.WalletModels['Write']>
        ): Promise<void>,
            walletGetById<Config extends RequestConfigGetOne<modelTypes.WalletModels['Read']>>(
                queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>,
                id: string,
                config ?: Config
            ): Promise<void>,
                walletGetOne<Config extends Omit<RequestConfigGetOne<modelTypes.WalletModels['Read']>, 'filter'>>(
                    queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>,
                    filter ?: AsFilter<modelTypes.WalletModels['Write']>, // WRITE HERE because it will ensure referenced fields are passed as their string counterpart
                    config ?: Config
                ): Promise<void>,
                    walletTransferTransactionGetAll(
                        queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>,
                        filter ?: AsFilter<modelTypes.WalletTransferTransactionModels['Write']>,
                        config ?: never
                    ): Promise<void>
    walletTransferTransactionGetAll<Config extends Omit<RequestConfigRead<modelTypes.WalletTransferTransactionModels['Read']>, 'filter'>>(
        queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>,
        filter ?: AsFilter<modelTypes.WalletTransferTransactionModels['Write']>,
        config ?: Config
    ): Promise<void>,
        walletTransferTransactionGetLastN(
            queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>,
            limit ?: number,
            config ?: never,
        ): Promise<void>
    walletTransferTransactionGetLastN<Config extends RequestConfigRead<modelTypes.WalletTransferTransactionModels['Read']>>(
        queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>,
        limit ?: number,
        config ?: Config,
    ): Promise<void>,
        walletTransferTransactionGetFirstN(
            queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>,
            limit ?: number,
            config ?: never
        ): Promise<void>
    walletTransferTransactionGetFirstN<Config extends RequestConfigRead<modelTypes.WalletTransferTransactionModels['Read']>>(
        queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>,
        limit ?: number,
        config ?: Config
    ): Promise<void>,
        walletTransferTransactionCount(
            queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>,
            filter ?: AsFilter<modelTypes.WalletTransferTransactionModels['Write']>
        ): Promise<void>,
            walletTransferTransactionGetById<Config extends RequestConfigGetOne<modelTypes.WalletTransferTransactionModels['Read']>>(
                queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>,
                id: string,
                config ?: Config
            ): Promise<void>,
                walletTransferTransactionGetOne<Config extends Omit<RequestConfigGetOne<modelTypes.WalletTransferTransactionModels['Read']>, 'filter'>>(
                    queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>,
                    filter ?: AsFilter<modelTypes.WalletTransferTransactionModels['Write']>, // WRITE HERE because it will ensure referenced fields are passed as their string counterpart
                    config ?: Config
                ): Promise<void>
},
addQueriesToInvalidate: {
    manageDueDiligenceStatusAsAdmin(queriesToInvalidate: Array<`${ModelNames}*` | MethodNames>): void,
        manageKycStatusAsAdmin(queriesToInvalidate: Array<`${ModelNames}*` | MethodNames>): void,
            shuftiProCallback(queriesToInvalidate: Array<`${ModelNames}*` | MethodNames>): void,
                subscribeToNewsletter(queriesToInvalidate: Array<`${ModelNames}*` | MethodNames>): void,
                    dataTrackingRegisterEvent(queriesToInvalidate: Array<`${ModelNames}*` | MethodNames>): void,
                        updateEmail(queriesToInvalidate: Array<`${ModelNames}*` | MethodNames>): void,
                            registerUserDevice(queriesToInvalidate: Array<`${ModelNames}*` | MethodNames>): void,
                                userSubscribe(queriesToInvalidate: Array<`${ModelNames}*` | MethodNames>): void,
                                    updatePassword(queriesToInvalidate: Array<`${ModelNames}*` | MethodNames>): void,
                                        sendForgotPasswordEmail(queriesToInvalidate: Array<`${ModelNames}*` | MethodNames>): void,
                                            sendValidationEmail(queriesToInvalidate: Array<`${ModelNames}*` | MethodNames>): void,
                                                checkUserExists(queriesToInvalidate: Array<`${ModelNames}*` | MethodNames>): void,
                                                    registerCompanyRepresentative(queriesToInvalidate: Array<`${ModelNames}*` | MethodNames>): void,
                                                        getNewToken(queriesToInvalidate: Array<`${ModelNames}*` | MethodNames>): void,
                                                            validateEmailAndLogin(queriesToInvalidate: Array<`${ModelNames}*` | MethodNames>): void,
                                                                checkTokenBeforeEmailSvc(queriesToInvalidate: Array<`${ModelNames}*` | MethodNames>): void,
                                                                    tokenBgk(queriesToInvalidate: Array<`${ModelNames}*` | MethodNames>): void,
                                                                        sendMessageToSupport(queriesToInvalidate: Array<`${ModelNames}*` | MethodNames>): void,
                                                                            getCryptoChartData(queriesToInvalidate: Array<`${ModelNames}*` | MethodNames>): void,
                                                                                getCurrencyRateLive(queriesToInvalidate: Array<`${ModelNames}*` | MethodNames>): void,
                                                                                    getCurrencyRates(queriesToInvalidate: Array<`${ModelNames}*` | MethodNames>): void,
                                                                                        uploadMediasToS3(queriesToInvalidate: Array<`${ModelNames}*` | MethodNames>): void,
                                                                                            frontendthrow error.andler(queriesToInvalidate: Array<`${ModelNames}*` | MethodNames>): void,
                                                                                                getGeneralBonusCode(queriesToInvalidate: Array<`${ModelNames}*` | MethodNames>): void,
                                                                                                    icoTransactionSuccessHandler(queriesToInvalidate: Array<`${ModelNames}*` | MethodNames>): void,
                                                                                                        cbwaa(queriesToInvalidate: Array<`${ModelNames}*` | MethodNames>): void,
                                                                                                            isBonusCodeValid(queriesToInvalidate: Array<`${ModelNames}*` | MethodNames>): void,
                                                                                                                createIcoBonusCode(queriesToInvalidate: Array<`${ModelNames}*` | MethodNames>): void,
                                                                                                                    bangkAdminLogin(queriesToInvalidate: Array<`${ModelNames}*` | MethodNames>): void,
                                                                                                                        logout(queriesToInvalidate: Array<`${ModelNames}*` | MethodNames>): void,
                                                                                                                            loginOrSubscribe(queriesToInvalidate: Array<`${ModelNames}*` | MethodNames>): void,
                                                                                                                                userLoginWithEmail(queriesToInvalidate: Array<`${ModelNames}*` | MethodNames>): void,
                                                                                                                                    plaidGetLinkToken(queriesToInvalidate: Array<`${ModelNames}*` | MethodNames>): void,
                                                                                                                                        plaidStoreToken(queriesToInvalidate: Array<`${ModelNames}*` | MethodNames>): void,
                                                                                                                                            plaidGetAllTransactions(queriesToInvalidate: Array<`${ModelNames}*` | MethodNames>): void
    },
/** DEFER is used to avoid many user actions to trigger a lot of api calls. When a user do a modification (Eg: check a checkbox) we send a deferred call that will send the api call in 3 seconds. If between this time the user reclick the checkbox, it will cancel the first call and wait 3 seconds again so that in the end only one call is triggered. */
defer: {
    manageDueDiligenceStatusAsAdmin(props ?: {
        'userId': string
    'status': 'declined' | 'success' | 'canRetry'
    }): void,
        manageKycStatusAsAdmin(props ?: {
            'userId': string
    'status': 'declined' | 'success' | 'canRetry' | 'pending'
    'kycDeclinedReasons'?: string
        }): void,
            shuftiProCallback(param0 ?: any): void,
                subscribeToNewsletter(param0 ?: modelTypes.NewsletterSubscriptionsModels['Write']): void,
                    dataTrackingRegisterEvent(param0 ?: Array<{
                        'utmCampaignId'?: string
                        'type': 'press' | 'click' | 'sessionEnd' | 'pageLeft' | 'pageReturn' | 'navigate' | 'componentVisible' | 'componentHidden' | 'error' | 'sessionStart'
                        'project': string
                        'session': string
                        'ts': number
                        'screen'?: string
                        'data'?: {
                            [key: string]: any
                        }
                        'device'?: string | modelTypes.Device
                        'error'?: string | modelTypes.UnexpectedError
                    }>): void,
                        updateEmail(props ?: {
                            'token': string
                        }): void,
                            registerUserDevice(param0 ?: modelTypes.DeviceModels['Read']): void,
                                userSubscribe(userFields ?: {
                                    'phonePrefix': any
    'phoneNumber': string
    'lang': 'fr' | 'en' | 'ru'
    'currency': 'eur' | 'usd' | 'thb' | 'jpy' | 'inr' | 'cny' | 'try' | 'mxn' | 'gbp' | 'chf' | 'rub' | 'pln' | 'dkk' | 'ils' | 'sek' | 'ars' | 'php' | 'brl' | 'cad' | 'krw' | 'nok' | 'sgd' | 'huf' | 'uah' | 'aud' | 'zar' | 'myr' | 'idr' | 'hkd' | 'nzd' | 'aed'
    'email': string
    'password': string
    'hasAgreedWithTermsAndConditions': boolean
    'firstName'?: string
    'lastName'?: string
    'referralCode'?: string
    'emailAdditionalParams'?: {
                                        [prop: string]: any
                                    }
    'pinCode'?: string
                                }): Promise<Required<{
                                    'userId': string
                                    'userEmail': string
                                }>>,
                                    updatePassword(props ?: {
                                        'token': string
    'newPassword': string
                                    }): void,
                                        sendForgotPasswordEmail(props ?: {
                                            'email': string
                                        }): void,
                                            sendValidationEmail(props ?: {
                                                'userId': string
    'additionalParams'?: {
                                                    [prop: string]: any
                                                }
                                            }): void,
                                                checkUserExists(props ?: {
                                                    'email'?: string
                                                }): void,
                                                    registerCompanyRepresentative(userFields ?: {
                                                        'phonePrefix': any
    'phoneNumber': string
    'lang': 'fr' | 'en' | 'ru'
    'currency': 'eur' | 'usd' | 'thb' | 'jpy' | 'inr' | 'cny' | 'try' | 'mxn' | 'gbp' | 'chf' | 'rub' | 'pln' | 'dkk' | 'ils' | 'sek' | 'ars' | 'php' | 'brl' | 'cad' | 'krw' | 'nok' | 'sgd' | 'huf' | 'uah' | 'aud' | 'zar' | 'myr' | 'idr' | 'hkd' | 'nzd' | 'aed'
    'email': string
    'password': string
    'hasAgreedWithTermsAndConditions': boolean
    'firstName'?: string
    'lastName'?: string
    'referralCode'?: string
    'emailAdditionalParams'?: {
                                                            [prop: string]: any
                                                        }
    'pinCode'?: string
    'companyName': string
    'registrationCountry': string
    'companyIdenfier': string
                                                    }): Promise<Required<{
                                                        'userId': string
                                                        'userEmail': string
                                                        'companyId': string
                                                        'emailWasAlreadyVerified': boolean
                                                    }>>,
                                                        getNewToken(props ?: {
                                                            'deviceId': string
    'pinCode'?: any
    'biometricAuthToken'?: string
                                                        }): Promise<Required<{
                                                            'accessToken': string
                                                            'csrfToken': string
                                                            'expirationDate': Date | 'never'
                                                            'biometricAuthToken': string
                                                        }>>,
                                                            validateEmailAndLogin(props ?: {
                                                                'token': string
    'deviceId': string
    'deviceType': 'mobile' | 'web'
                                                            }): Promise<Required<{
                                                                'user': modelTypes.UserModels['Read']
                                                                'accessToken': string
                                                                'deviceId': string
                                                                'csrfToken': string
                                                                'biometricAuthToken': string
                                                                'wasEmailAlreadyValidated': false
                                                            }> | Required<{
                                                                'wasEmailAlreadyValidated': true
                                                            }>>,
                                                                checkTokenBeforeEmailSvc(props ?: {
                                                                    'token': string
    'emailType': 'forgotPassword' | 'emailValidation' | 'changeEmail'
                                                                }): Promise<Required<{
                                                                    'isValidToken': boolean
                                                                }>>,
                                                                    tokenBgk(): void,
                                                                        sendMessageToSupport(props ?: {
                                                                            'msg': string
    'userId'?: string
    'userEmail'?: string
    'deviceId'?: string
    'errorId'?: string
    'topic'?: string
                                                                        }): void,
                                                                            getCryptoChartData(): Promise<Required<{
                                                                                'bangkEuro': Array<[number, number]>
                                                                                'bangkCoin': Array<[number, number]>
                                                                                'tether': Array<[number, number]>
                                                                                'bitcoin': Array<[number, number]>
                                                                                'solana': Array<[number, number]>
                                                                                'ethereum': Array<[number, number]>
                                                                                'usd-coin': Array<[number, number]>
                                                                                'binancecoin': Array<[number, number]>
                                                                            }>>,
                                                                                getCurrencyRateLive(props ?: {
                                                                                    'sourceCurrency'?: 'tether' | 'bitcoin' | 'solana' | 'ethereum' | 'usd-coin' | 'binancecoin'
    'targetCurrency'?: 'tether' | 'bitcoin' | 'solana' | 'ethereum' | 'usd-coin' | 'binancecoin'
                                                                                }): void,
                                                                                    getCurrencyRates(): Promise<Required<{
                                                                                        'bangkEuro': number
                                                                                        'bangkCoin': number
                                                                                        'tether': number
                                                                                        'bitcoin': number
                                                                                        'solana': number
                                                                                        'ethereum': number
                                                                                        'usd-coin': number
                                                                                        'binancecoin': number
                                                                                        'eur': number
                                                                                        'usd': number
                                                                                        'thb': number
                                                                                        'jpy': number
                                                                                        'inr': number
                                                                                        'cny': number
                                                                                        'try': number
                                                                                        'mxn': number
                                                                                        'gbp': number
                                                                                        'chf': number
                                                                                        'rub': number
                                                                                        'pln': number
                                                                                        'dkk': number
                                                                                        'ils': number
                                                                                        'sek': number
                                                                                        'ars': number
                                                                                        'php': number
                                                                                        'brl': number
                                                                                        'cad': number
                                                                                        'krw': number
                                                                                        'nok': number
                                                                                        'sgd': number
                                                                                        'huf': number
                                                                                        'uah': number
                                                                                        'aud': number
                                                                                        'zar': number
                                                                                        'myr': number
                                                                                        'idr': number
                                                                                        'hkd': number
                                                                                        'nzd': number
                                                                                        'aed': number
                                                                                    }>>,
                                                                                        uploadMediasToS3(props ?: {
                                                                                            'mediaName': string
                                                                                        }): void,
                                                                                            frontendthrow error.andler(props ?: {
                                                                                                'errorId'?: string
    'title': string
    'applicationVersion'?: string
    'deviceId'?: string
    'userId'?: string
    'extraInfos'?: string
    'stackTrace'?: string
    'deviceType'?: 'tablet' | 'mobile' | 'desktop' | 'unknown'
    'deviceInfos'?: {}
    'deviceName'?: string
                                                                                            }): void,
                                                                                                getGeneralBonusCode(): void,
                                                                                                    icoTransactionSuccessHandler(props ?: {
                                                                                                        'transactionId': string
    'isCancel'?: boolean
    'hash'?: string
                                                                                                    }): void,
                                                                                                        cbwaa(props ?: {
                                                                                                            'wallets'?: Array<modelTypes.BangkWalletsModels['Write']>
                                                                                                        }): void,
                                                                                                            isBonusCodeValid(props ?: {
                                                                                                                'code': string
                                                                                                            }): Promise<{
                                                                                                                'type'?: 'referralCode'
                                                                                                                'firstName'?: string | void
                                                                                                                'lastName'?: string | void
                                                                                                            } | {
                                                                                                                'type'?: 'bonusCode'
                                                                                                                'bonusCode'?: modelTypes.IcoBonusCodeModels['Read']
                                                                                                            }>,
                                                                                                                createIcoBonusCode(props ?: modelTypes.IcoBonusCodeModels['Write']): void,
                                                                                                                    bangkAdminLogin(userFields ?: {
                                                                                                                        'deviceId': string
    'deviceType': 'mobile' | 'web'
    'email': string
    'password': string
    'pinCode'?: string
                                                                                                                    }): Promise<Required<{
                                                                                                                        'isEmailVerified': true
                                                                                                                        'loginInfos': Required<{
                                                                                                                            'user': modelTypes.UserModels['Read']
                                                                                                                            'accessToken': string
                                                                                                                            'deviceId': string
                                                                                                                            'csrfToken': string
                                                                                                                            'biometricAuthToken': string
                                                                                                                        }>
                                                                                                                    }> | Required<{
                                                                                                                        'isEmailVerified': false
                                                                                                                        'userId': string
                                                                                                                        'userEmail': string
                                                                                                                    }>>,
                                                                                                                        logout(): void,
                                                                                                                            loginOrSubscribe(userFields ?: {
                                                                                                                                'deviceId': string
    'deviceType': 'mobile' | 'web'
    'phonePrefix': any
    'phoneNumber': string
    'lang': 'fr' | 'en' | 'ru'
    'currency': 'eur' | 'usd' | 'thb' | 'jpy' | 'inr' | 'cny' | 'try' | 'mxn' | 'gbp' | 'chf' | 'rub' | 'pln' | 'dkk' | 'ils' | 'sek' | 'ars' | 'php' | 'brl' | 'cad' | 'krw' | 'nok' | 'sgd' | 'huf' | 'uah' | 'aud' | 'zar' | 'myr' | 'idr' | 'hkd' | 'nzd' | 'aed'
    'firstName'?: string
    'lastName'?: string
    'email'?: string
    'password'?: string
    'referralCode'?: string
    'pinCode'?: string
                                                                                                                            }): Promise<Required<{
                                                                                                                                'user': modelTypes.UserModels['Read']
                                                                                                                                'accessToken': string
                                                                                                                                'deviceId': string
                                                                                                                                'csrfToken': string
                                                                                                                                'biometricAuthToken': string
                                                                                                                            }>>,
                                                                                                                                userLoginWithEmail(userFields ?: {
                                                                                                                                    'deviceId': string
    'deviceType': 'mobile' | 'web'
    'email': string
    'password': string
    'pinCode'?: string
                                                                                                                                }): Promise<Required<{
                                                                                                                                    'isEmailVerified': true
                                                                                                                                    'loginInfos': Required<{
                                                                                                                                        'user': modelTypes.UserModels['Read']
                                                                                                                                        'accessToken': string
                                                                                                                                        'deviceId': string
                                                                                                                                        'csrfToken': string
                                                                                                                                        'biometricAuthToken': string
                                                                                                                                    }>
                                                                                                                                }> | Required<{
                                                                                                                                    'isEmailVerified': false
                                                                                                                                    'userId': string
                                                                                                                                    'userEmail': string
                                                                                                                                }>>,
                                                                                                                                    plaidGetLinkToken(): void,
                                                                                                                                        plaidStoreToken(props ?: {
                                                                                                                                            'publicToken': string
                                                                                                                                        }): void,
                                                                                                                                            plaidGetAllTransactions(): Promise<'noPlaidToken' | 'error' | Array<Required<{
                                                                                                                                                'amount': number
                                                                                                                                                'object': string
                                                                                                                                                'date': string
                                                                                                                                                'pending': boolean
                                                                                                                                                'status': 'added' | 'modified' | 'removed'
                                                                                                                                                'currency': string
                                                                                                                                            }>>>,
                                                                                                                                                icoBonusCodeCreate<
                                                                                                                                                    Config extends RequestConfigWrite<modelTypes.IcoBonusCodeModels['Write']>,
                                                                                                                                                    Body extends MaybeArray<modelTypes.IcoBonusCodeModels['Write']>
    >(
                                                                                                                                                        body: Body,
                                                                                                                                                        config ?: Config
                                                                                                                                                    ): Promise<
                                                                                                                                                        Config['returnDoc'] extends true ?
                                                                                                                                                        Body extends any[] ? modelTypes.IcoBonusCodeModels['Read'][] : modelTypes.IcoBonusCodeModels['Read'] :
                                                                                                                                                        Body extends any[] ? string[] : string
                                                                                                                                                    >,
                                                                                                                                                        icoBonusCodeUpdate<
                                                                                                                                                            Config extends RequestConfigWrite<modelTypes.IcoBonusCodeModels['Write']>
    >(
                                                                                                                                                                id: string,
                                                                                                                                                                body: Partial<AsMongooseBody<modelTypes.IcoBonusCodeModels['Write']>>,
                                                                                                                                                                config ?: Config
                                                                                                                                                            ): Promise<
                                                                                                                                                                Config['returnDoc'] extends true ? modelTypes.IcoBonusCodeModels['Read'] : undefined
                                                                                                                                                            >,
                                                                                                                                                                icoBonusCodeUpdateMany<
                                                                                                                                                                    Config extends RequestConfigWrite<modelTypes.IcoBonusCodeModels['Write']>
    >(
                                                                                                                                                                        fields: Array<Partial<AsMongooseBody<modelTypes.IcoBonusCodeModels['Write']>> & { _id: string }>, // id is provided in the body
                                                                                                                                                                        config ?: Config
                                                                                                                                                                    ): Promise<
                                                                                                                                                                        Config['returnDoc'] extends true ? modelTypes.IcoBonusCodeModels['Read'][] : undefined
                                                                                                                                                                    >,
                                                                                                                                                                        icoBonusCodeUpsert<Config extends RequestConfigWrite<modelTypes.IcoBonusCodeModels['Write']>>(
                                                                                                                                                                            fields: modelTypes.IcoBonusCodeModels['Write'] & { _id?: string },
                                                                                                                                                                            config ?: Config
                                                                                                                                                                        ): void,
                                                                                                                                                                            icoBonusCodeUpdateWithFilter<Config extends RequestConfigWrite<modelTypes.IcoBonusCodeModels['Write']>>(
                                                                                                                                                                                filter: AsFilter<modelTypes.IcoBonusCodeModels['Write']>,
                                                                                                                                                                                fields: Partial<AsMongooseBody<modelTypes.IcoBonusCodeModels['Write']>>,
                                                                                                                                                                                config ?: Config
                                                                                                                                                                            ): Promise<
                                                                                                                                                                                Config['returnDoc'] extends true ? modelTypes.IcoBonusCodeModels['Read'][] : {
                                                                                                                                                                                    acknowledged: boolean
                                                                                                                                                                                    matchedCount: number
                                                                                                                                                                                    modifiedCount: number
                                                                                                                                                                                    upsertedCount: number
                                                                                                                                                                                    upsertedId: any
                                                                                                                                                                                }
                                                                                                                                                                            >,
                                                                                                                                                                                icoBonusCodeDelete(
                                                                                                                                                                                    id: string
                                                                                                                                                                                ): void,
                                                                                                                                                                                    icoBonusCodeDeleteWithFilter(
                                                                                                                                                                                        filter: AsFilter<modelTypes.IcoBonusCodeModels['Write']>
                                                                                                                                                                                    ): void,
                                                                                                                                                                                        icoWalletTransactionToValidateManuallyCreate<
                                                                                                                                                                                            Config extends RequestConfigWrite<modelTypes.IcoWalletTransactionToValidateManuallyModels['Write']>,
                                                                                                                                                                                            Body extends MaybeArray<modelTypes.IcoWalletTransactionToValidateManuallyModels['Write']>
    >(
                                                                                                                                                                                                body: Body,
                                                                                                                                                                                                config ?: Config
                                                                                                                                                                                            ): Promise<
                                                                                                                                                                                                Config['returnDoc'] extends true ?
                                                                                                                                                                                                Body extends any[] ? modelTypes.IcoWalletTransactionToValidateManuallyModels['Read'][] : modelTypes.IcoWalletTransactionToValidateManuallyModels['Read'] :
                                                                                                                                                                                                Body extends any[] ? string[] : string
                                                                                                                                                                                            >,
                                                                                                                                                                                                investmentProjectBondsUpdate<
                                                                                                                                                                                                    Config extends RequestConfigWrite<modelTypes.InvestmentProjectBondsModels['Write']>
    >(
                                                                                                                                                                                                        id: string,
                                                                                                                                                                                                        body: Partial<AsMongooseBody<modelTypes.InvestmentProjectBondsModels['Write']>>,
                                                                                                                                                                                                        config ?: Config
                                                                                                                                                                                                    ): Promise<
                                                                                                                                                                                                        Config['returnDoc'] extends true ? modelTypes.InvestmentProjectBondsModels['Read'] : undefined
                                                                                                                                                                                                    >,
                                                                                                                                                                                                        investmentProjectBondsUpdateMany<
                                                                                                                                                                                                            Config extends RequestConfigWrite<modelTypes.InvestmentProjectBondsModels['Write']>
    >(
                                                                                                                                                                                                                fields: Array<Partial<AsMongooseBody<modelTypes.InvestmentProjectBondsModels['Write']>> & { _id: string }>, // id is provided in the body
                                                                                                                                                                                                                config ?: Config
                                                                                                                                                                                                            ): Promise<
                                                                                                                                                                                                                Config['returnDoc'] extends true ? modelTypes.InvestmentProjectBondsModels['Read'][] : undefined
                                                                                                                                                                                                            >,
                                                                                                                                                                                                                investmentProjectBondsUpsert<Config extends RequestConfigWrite<modelTypes.InvestmentProjectBondsModels['Write']>>(
                                                                                                                                                                                                                    fields: modelTypes.InvestmentProjectBondsModels['Write'] & { _id?: string },
                                                                                                                                                                                                                    config ?: Config
                                                                                                                                                                                                                ): void,
                                                                                                                                                                                                                    investmentProjectBondsUpdateWithFilter<Config extends RequestConfigWrite<modelTypes.InvestmentProjectBondsModels['Write']>>(
                                                                                                                                                                                                                        filter: AsFilter<modelTypes.InvestmentProjectBondsModels['Write']>,
                                                                                                                                                                                                                        fields: Partial<AsMongooseBody<modelTypes.InvestmentProjectBondsModels['Write']>>,
                                                                                                                                                                                                                        config ?: Config
                                                                                                                                                                                                                    ): Promise<
                                                                                                                                                                                                                        Config['returnDoc'] extends true ? modelTypes.InvestmentProjectBondsModels['Read'][] : {
                                                                                                                                                                                                                            acknowledged: boolean
                                                                                                                                                                                                                            matchedCount: number
                                                                                                                                                                                                                            modifiedCount: number
                                                                                                                                                                                                                            upsertedCount: number
                                                                                                                                                                                                                            upsertedId: any
                                                                                                                                                                                                                        }
                                                                                                                                                                                                                    >,
                                                                                                                                                                                                                        investmentProjectEquityUpdate<
                                                                                                                                                                                                                            Config extends RequestConfigWrite<modelTypes.InvestmentProjectEquityModels['Write']>
    >(
                                                                                                                                                                                                                                id: string,
                                                                                                                                                                                                                                body: Partial<AsMongooseBody<modelTypes.InvestmentProjectEquityModels['Write']>>,
                                                                                                                                                                                                                                config ?: Config
                                                                                                                                                                                                                            ): Promise<
                                                                                                                                                                                                                                Config['returnDoc'] extends true ? modelTypes.InvestmentProjectEquityModels['Read'] : undefined
                                                                                                                                                                                                                            >,
                                                                                                                                                                                                                                investmentProjectEquityUpdateMany<
                                                                                                                                                                                                                                    Config extends RequestConfigWrite<modelTypes.InvestmentProjectEquityModels['Write']>
    >(
                                                                                                                                                                                                                                        fields: Array<Partial<AsMongooseBody<modelTypes.InvestmentProjectEquityModels['Write']>> & { _id: string }>, // id is provided in the body
                                                                                                                                                                                                                                        config ?: Config
                                                                                                                                                                                                                                    ): Promise<
                                                                                                                                                                                                                                        Config['returnDoc'] extends true ? modelTypes.InvestmentProjectEquityModels['Read'][] : undefined
                                                                                                                                                                                                                                    >,
                                                                                                                                                                                                                                        investmentProjectEquityUpsert<Config extends RequestConfigWrite<modelTypes.InvestmentProjectEquityModels['Write']>>(
                                                                                                                                                                                                                                            fields: modelTypes.InvestmentProjectEquityModels['Write'] & { _id?: string },
                                                                                                                                                                                                                                            config ?: Config
                                                                                                                                                                                                                                        ): void,
                                                                                                                                                                                                                                            investmentProjectEquityUpdateWithFilter<Config extends RequestConfigWrite<modelTypes.InvestmentProjectEquityModels['Write']>>(
                                                                                                                                                                                                                                                filter: AsFilter<modelTypes.InvestmentProjectEquityModels['Write']>,
                                                                                                                                                                                                                                                fields: Partial<AsMongooseBody<modelTypes.InvestmentProjectEquityModels['Write']>>,
                                                                                                                                                                                                                                                config ?: Config
                                                                                                                                                                                                                                            ): Promise<
                                                                                                                                                                                                                                                Config['returnDoc'] extends true ? modelTypes.InvestmentProjectEquityModels['Read'][] : {
                                                                                                                                                                                                                                                    acknowledged: boolean
                                                                                                                                                                                                                                                    matchedCount: number
                                                                                                                                                                                                                                                    modifiedCount: number
                                                                                                                                                                                                                                                    upsertedCount: number
                                                                                                                                                                                                                                                    upsertedId: any
                                                                                                                                                                                                                                                }
                                                                                                                                                                                                                                            >,
                                                                                                                                                                                                                                                investmentProjectFundSharesUpdate<
                                                                                                                                                                                                                                                    Config extends RequestConfigWrite<modelTypes.InvestmentProjectFundSharesModels['Write']>
    >(
                                                                                                                                                                                                                                                        id: string,
                                                                                                                                                                                                                                                        body: Partial<AsMongooseBody<modelTypes.InvestmentProjectFundSharesModels['Write']>>,
                                                                                                                                                                                                                                                        config ?: Config
                                                                                                                                                                                                                                                    ): Promise<
                                                                                                                                                                                                                                                        Config['returnDoc'] extends true ? modelTypes.InvestmentProjectFundSharesModels['Read'] : undefined
                                                                                                                                                                                                                                                    >,
                                                                                                                                                                                                                                                        investmentProjectFundSharesUpdateMany<
                                                                                                                                                                                                                                                            Config extends RequestConfigWrite<modelTypes.InvestmentProjectFundSharesModels['Write']>
    >(
                                                                                                                                                                                                                                                                fields: Array<Partial<AsMongooseBody<modelTypes.InvestmentProjectFundSharesModels['Write']>> & { _id: string }>, // id is provided in the body
                                                                                                                                                                                                                                                                config ?: Config
                                                                                                                                                                                                                                                            ): Promise<
                                                                                                                                                                                                                                                                Config['returnDoc'] extends true ? modelTypes.InvestmentProjectFundSharesModels['Read'][] : undefined
                                                                                                                                                                                                                                                            >,
                                                                                                                                                                                                                                                                investmentProjectFundSharesUpsert<Config extends RequestConfigWrite<modelTypes.InvestmentProjectFundSharesModels['Write']>>(
                                                                                                                                                                                                                                                                    fields: modelTypes.InvestmentProjectFundSharesModels['Write'] & { _id?: string },
                                                                                                                                                                                                                                                                    config ?: Config
                                                                                                                                                                                                                                                                ): void,
                                                                                                                                                                                                                                                                    investmentProjectFundSharesUpdateWithFilter<Config extends RequestConfigWrite<modelTypes.InvestmentProjectFundSharesModels['Write']>>(
                                                                                                                                                                                                                                                                        filter: AsFilter<modelTypes.InvestmentProjectFundSharesModels['Write']>,
                                                                                                                                                                                                                                                                        fields: Partial<AsMongooseBody<modelTypes.InvestmentProjectFundSharesModels['Write']>>,
                                                                                                                                                                                                                                                                        config ?: Config
                                                                                                                                                                                                                                                                    ): Promise<
                                                                                                                                                                                                                                                                        Config['returnDoc'] extends true ? modelTypes.InvestmentProjectFundSharesModels['Read'][] : {
                                                                                                                                                                                                                                                                            acknowledged: boolean
                                                                                                                                                                                                                                                                            matchedCount: number
                                                                                                                                                                                                                                                                            modifiedCount: number
                                                                                                                                                                                                                                                                            upsertedCount: number
                                                                                                                                                                                                                                                                            upsertedId: any
                                                                                                                                                                                                                                                                        }
                                                                                                                                                                                                                                                                    >,
                                                                                                                                                                                                                                                                        userUpdate<
                                                                                                                                                                                                                                                                            Config extends RequestConfigWrite<modelTypes.UserModels['Write']>
    >(
                                                                                                                                                                                                                                                                                id: string,
                                                                                                                                                                                                                                                                                body: Partial<AsMongooseBody<modelTypes.UserModels['Write']>>,
                                                                                                                                                                                                                                                                                config ?: Config
                                                                                                                                                                                                                                                                            ): Promise<
                                                                                                                                                                                                                                                                                Config['returnDoc'] extends true ? modelTypes.UserModels['Read'] : undefined
                                                                                                                                                                                                                                                                            >,
                                                                                                                                                                                                                                                                                userUpdateMany<
                                                                                                                                                                                                                                                                                    Config extends RequestConfigWrite<modelTypes.UserModels['Write']>
    >(
                                                                                                                                                                                                                                                                                        fields: Array<Partial<AsMongooseBody<modelTypes.UserModels['Write']>> & { _id: string }>, // id is provided in the body
                                                                                                                                                                                                                                                                                        config ?: Config
                                                                                                                                                                                                                                                                                    ): Promise<
                                                                                                                                                                                                                                                                                        Config['returnDoc'] extends true ? modelTypes.UserModels['Read'][] : undefined
                                                                                                                                                                                                                                                                                    >,
                                                                                                                                                                                                                                                                                        userUpsert<Config extends RequestConfigWrite<modelTypes.UserModels['Write']>>(
                                                                                                                                                                                                                                                                                            fields: modelTypes.UserModels['Write'] & { _id?: string },
                                                                                                                                                                                                                                                                                            config ?: Config
                                                                                                                                                                                                                                                                                        ): void,
                                                                                                                                                                                                                                                                                            userUpdateWithFilter<Config extends RequestConfigWrite<modelTypes.UserModels['Write']>>(
                                                                                                                                                                                                                                                                                                filter: AsFilter<modelTypes.UserModels['Write']>,
                                                                                                                                                                                                                                                                                                fields: Partial<AsMongooseBody<modelTypes.UserModels['Write']>>,
                                                                                                                                                                                                                                                                                                config ?: Config
                                                                                                                                                                                                                                                                                            ): Promise<
                                                                                                                                                                                                                                                                                                Config['returnDoc'] extends true ? modelTypes.UserModels['Read'][] : {
                                                                                                                                                                                                                                                                                                    acknowledged: boolean
                                                                                                                                                                                                                                                                                                    matchedCount: number
                                                                                                                                                                                                                                                                                                    modifiedCount: number
                                                                                                                                                                                                                                                                                                    upsertedCount: number
                                                                                                                                                                                                                                                                                                    upsertedId: any
                                                                                                                                                                                                                                                                                                }
                                                                                                                                                                                                                                                                                            >,
                                                                                                                                                                                                                                                                                                utmCampaignCreate<
                                                                                                                                                                                                                                                                                                    Config extends RequestConfigWrite<modelTypes.UtmCampaignModels['Write']>,
                                                                                                                                                                                                                                                                                                    Body extends MaybeArray<modelTypes.UtmCampaignModels['Write']>
    >(
                                                                                                                                                                                                                                                                                                        body: Body,
                                                                                                                                                                                                                                                                                                        config ?: Config
                                                                                                                                                                                                                                                                                                    ): Promise<
                                                                                                                                                                                                                                                                                                        Config['returnDoc'] extends true ?
                                                                                                                                                                                                                                                                                                        Body extends any[] ? modelTypes.UtmCampaignModels['Read'][] : modelTypes.UtmCampaignModels['Read'] :
                                                                                                                                                                                                                                                                                                        Body extends any[] ? string[] : string
                                                                                                                                                                                                                                                                                                    >,
                                                                                                                                                                                                                                                                                                        utmCampaignUpdate<
                                                                                                                                                                                                                                                                                                            Config extends RequestConfigWrite<modelTypes.UtmCampaignModels['Write']>
    >(
                                                                                                                                                                                                                                                                                                                id: string,
                                                                                                                                                                                                                                                                                                                body: Partial<AsMongooseBody<modelTypes.UtmCampaignModels['Write']>>,
                                                                                                                                                                                                                                                                                                                config ?: Config
                                                                                                                                                                                                                                                                                                            ): Promise<
                                                                                                                                                                                                                                                                                                                Config['returnDoc'] extends true ? modelTypes.UtmCampaignModels['Read'] : undefined
                                                                                                                                                                                                                                                                                                            >,
                                                                                                                                                                                                                                                                                                                utmCampaignUpdateMany<
                                                                                                                                                                                                                                                                                                                    Config extends RequestConfigWrite<modelTypes.UtmCampaignModels['Write']>
    >(
                                                                                                                                                                                                                                                                                                                        fields: Array<Partial<AsMongooseBody<modelTypes.UtmCampaignModels['Write']>> & { _id: string }>, // id is provided in the body
                                                                                                                                                                                                                                                                                                                        config ?: Config
                                                                                                                                                                                                                                                                                                                    ): Promise<
                                                                                                                                                                                                                                                                                                                        Config['returnDoc'] extends true ? modelTypes.UtmCampaignModels['Read'][] : undefined
                                                                                                                                                                                                                                                                                                                    >,
                                                                                                                                                                                                                                                                                                                        utmCampaignUpsert<Config extends RequestConfigWrite<modelTypes.UtmCampaignModels['Write']>>(
                                                                                                                                                                                                                                                                                                                            fields: modelTypes.UtmCampaignModels['Write'] & { _id?: string },
                                                                                                                                                                                                                                                                                                                            config ?: Config
                                                                                                                                                                                                                                                                                                                        ): void,
                                                                                                                                                                                                                                                                                                                            utmCampaignUpdateWithFilter<Config extends RequestConfigWrite<modelTypes.UtmCampaignModels['Write']>>(
                                                                                                                                                                                                                                                                                                                                filter: AsFilter<modelTypes.UtmCampaignModels['Write']>,
                                                                                                                                                                                                                                                                                                                                fields: Partial<AsMongooseBody<modelTypes.UtmCampaignModels['Write']>>,
                                                                                                                                                                                                                                                                                                                                config ?: Config
                                                                                                                                                                                                                                                                                                                            ): Promise<
                                                                                                                                                                                                                                                                                                                                Config['returnDoc'] extends true ? modelTypes.UtmCampaignModels['Read'][] : {
                                                                                                                                                                                                                                                                                                                                    acknowledged: boolean
                                                                                                                                                                                                                                                                                                                                    matchedCount: number
                                                                                                                                                                                                                                                                                                                                    modifiedCount: number
                                                                                                                                                                                                                                                                                                                                    upsertedCount: number
                                                                                                                                                                                                                                                                                                                                    upsertedId: any
                                                                                                                                                                                                                                                                                                                                }
                                                                                                                                                                                                                                                                                                                            >,
                                                                                                                                                                                                                                                                                                                                utmCampaignDelete(
                                                                                                                                                                                                                                                                                                                                    id: string
                                                                                                                                                                                                                                                                                                                                ): void,
                                                                                                                                                                                                                                                                                                                                    utmCampaignDeleteWithFilter(
                                                                                                                                                                                                                                                                                                                                        filter: AsFilter<modelTypes.UtmCampaignModels['Write']>
                                                                                                                                                                                                                                                                                                                                    ): void
    }

} /*  */

export declare const $: ApiType

export const methodNames: { dbRead: Record<string, string>, dbWrite: Record<string, string>, service: Record<string, string> }

export default $

export declare function initBackend(serverConfig: InitBackendConfig<ServerUrls>)