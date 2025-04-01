
import * as modelTypes from './model-types.generated'
import { AsFilter, AsMongooseBody, RequestConfigRead, RequestConfigGetOne, RequestConfigWrite, MaybePaginated } from './mongo-db-base-types.generated'
import { SdkError, ServerUrls, SdkInitOptions, Breakpoints } from './apiCall'
import { useSuspenseQuery, QueryClient, FetchQueryOptions } from '@tanstack/react-query'
import { ModelNames } from './model-types.generated'
import { InitBackendConfig } from './sdkHelpers/initBackend'
import { ImgData } from './img'

export * from './sdkHelpers'

type MethodNames = 'addTransactionInfo' | 'updateKycStatus' | 'updateDueDiligenceStatus' | 'kycRequestForRestrictedCountries' | 'getKycUrl' | 'getDueDiligenceUrl' | 'shuftiProCallback' | 'subscribeToNewsletter' | 'dataTrackingRegisterEvent' | 'updateEmail' | 'registerUserDevice' | 'userSubscribe' | 'updatePassword' | 'sendForgotPasswordEmail' | 'sendValidationEmail' | 'sendUpdateEmail' | 'pincodeOrBiometricTokenAuthTestService' | 'deleteUserRequest' | 'checkUserExists' | 'userUpdatePhone' | 'registerCompanyRepresentative' | 'getNewToken' | 'validateEmailAndLogin' | 'updatePasswordWithOldPassword' | 'checkTokenBeforeEmailSvc' | 'tokenBgk' | 'sendMessageToSupport' | 'getCryptoChartData' | 'getCurrencyRateLive' | 'checkTransactionStatus' | 'getCurrencyRates' | 'frontendErrorHandler' | 'getGeneralBonusCode' | 'createIcoTransaction' | 'cancelTransactionByUser' | 'icoGetAllReferedUsersWithBGKbonus' | 'getNbReferralSinceLastPageView' | 'userHasTransactions' | 'addTransactionBonusCode' | 'assignWalletToUser' | 'isBonusCodeValid' | 'bangkAdminLogin' | 'logout' | 'loginOrSubscribe' | 'userLoginWithEmail' | 'companyGetAll' | 'companyGetLastN' | 'companyGetFirstN' | 'companyCount' | 'companyGetById' | 'companyGetOne' | 'icoDashboardConfigGetById' | 'icoDashboardConfigGetOne' | 'icoRewardTransactionGetAll' | 'icoRewardTransactionGetLastN' | 'icoRewardTransactionGetFirstN' | 'icoRewardTransactionCount' | 'icoRewardTransactionGetById' | 'icoRewardTransactionGetOne' | 'icoTransactionGetAll' | 'icoTransactionGetLastN' | 'icoTransactionGetFirstN' | 'icoTransactionCount' | 'icoTransactionGetById' | 'icoTransactionGetOne' | 'investmentProjectBondsGetAll' | 'investmentProjectBondsGetLastN' | 'investmentProjectBondsGetFirstN' | 'investmentProjectBondsCount' | 'investmentProjectBondsGetById' | 'investmentProjectBondsGetOne' | 'investmentProjectEquityGetAll' | 'investmentProjectEquityGetLastN' | 'investmentProjectEquityGetFirstN' | 'investmentProjectEquityCount' | 'investmentProjectEquityGetById' | 'investmentProjectEquityGetOne' | 'investmentProjectFundSharesGetAll' | 'investmentProjectFundSharesGetLastN' | 'investmentProjectFundSharesGetFirstN' | 'investmentProjectFundSharesCount' | 'investmentProjectFundSharesGetById' | 'investmentProjectFundSharesGetOne' | 'userGetById' | 'userGetOne' | 'userUpdate' | 'userUpdateMany' | 'userUpsert' | 'userUpdateWithFilter'

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
    addTransactionInfo(props?: {
        'transactionId': string
        'solanaHash'?: string
        'ethereumHash'?: `0x${string}`
        'bitcoinHash'?: string
    }): Promise<void>,
    updateKycStatus(): Promise<void>,
    updateDueDiligenceStatus(): Promise<void>,
    kycRequestForRestrictedCountries(props?: {
        'nationality': string
        'countryOfResidence': string
    }): Promise<void>,
    getKycUrl(): Promise<string>,
    getDueDiligenceUrl(): Promise<string>,
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
    /** Send an email to the new email of the user for validating their email
     * @example
     * 'rndmString'
 */
    sendUpdateEmail(props?: {
        'newEmail': string
    }): Promise<string>,
    pincodeOrBiometricTokenAuthTestService(): Promise<string>,
    /** This will send a support message 'Delete user account request'
     * @example
     * {
     *   'isDeleted': true,
     *   'requestSentToSupport': true
     * }
 */
    deleteUserRequest(): Promise<Required<{
        'isDeleted': boolean
        'requestSentToSupport': boolean
    }>>,
    checkUserExists(props?: {
        'email'?: string
    }): Promise<boolean>,
    userUpdatePhone(phonePrefix?: any, phoneNumber?: any): Promise<string>,
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
    updatePasswordWithOldPassword(props?: {
        'oldPassword': string
        'newPassword': string
    }): Promise<string>,
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
    checkTransactionStatus(props?: {
        'transactionId': string
    }): Promise<Required<{
        'hasBeenUpdated': boolean
        'status': 'pending' | 'success' | 'error' | 'canceled' | 'refunded'
    }>>,
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
            /** 
        * This service is to create a new transaction to reserve BGK tokens. It will verify and make bonus / referral calculations
        * A Bonus may be applied automatically
             * @errorCodes
             * - 409: tooMuchTransactionForUser,     * - 422: blockchainNetworkNotDefined,     * - 403: kybMustBeValidatedForCompanyRepresentative,     * - 422: amountTooLow,     * - 422: amountTooHigh,     * - 403: bonusCodeExpired,     * - 403: bonusCodeNotActive,     * - 409: bonusAlreadyClaimed,     * - 403: firstTransactionBonusAlreadyClaimed
             * @example
             * {
             *   'isBonusTransaction': false,
             *   'icoTransaction': {
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
             * }
         */
            createIcoTransaction(props ?: {
                'sourceAmount': number
    'sourceCurrency': 'eur' | 'tether' | 'solana' | 'usd' | 'ethereum' | 'bitcoin' | 'usd-coin' | 'binancecoin'
    'blockchainNetwork'?: 'ethereum' | 'polygon' | 'bsc' | 'base' | 'solana' | 'bitcoin'
    'hash'?: string
    'ethTransactionHash'?: `0x${string}`
    'solTransactionHash'?: string
    'bitcoinTransactionHash'?: string
    'isWalletConnector'?: boolean
    'bonusCode'?: string
            }): Promise<Required<{
                'isBonusTransaction': false
                'icoTransaction': modelTypes.IcoTransactionModels['Read']
            }> | Required<{
                'isBonusTransaction': true
                'rewardTransactionId': string
            }>>,
                cancelTransactionByUser(props ?: {
                    'transactionId': string
                }): Promise<void>,
                    icoGetAllReferedUsersWithBGKbonus(): Promise<Required<{
                        'transactionByUsers': Array<Required<{
                            'amountCompleted': number
                            'amountPending': number
                            'firstName': string
                            'lastName': string
                            '_id': string
                        }>>
                        'totalCompleted': number
                        'totalPending': number
                    }>>,
                        getNbReferralSinceLastPageView(): Promise<number>,
                            userHasTransactions(): Promise<Required<{
                                'hasTransactions': boolean
                                'nbIcoTransactions': number
                                'nbRewardTransactions': number
                            }>>,
                                addTransactionBonusCode(props ?: {
                                    'code': string
    'transactionId': string
                                }): Promise<void>,
                                    assignWalletToUser(props ?: {
                                        'blockchain': 'solana' | 'ethereum' | 'bitcoin'
                                    }): Promise<string>,
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
                                                            // DAO ===================================,
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
                                                useQuery: {
    addTransactionInfo(
        queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>, props ?: {
            'transactionId': string
        'solanaHash'?: string
        'ethereumHash'?: `0x${string}`
        'bitcoinHash'?: string
        }): [
            void,
            Omit<ReturnType<typeof useSuspenseQuery>, 'data'>
        ],
            updateKycStatus(
                queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>,): [
                    void,
                    Omit<ReturnType<typeof useSuspenseQuery>, 'data'>
                ],
                    updateDueDiligenceStatus(
                        queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>,): [
                            void,
                            Omit<ReturnType<typeof useSuspenseQuery>, 'data'>
                        ],
                            kycRequestForRestrictedCountries(
                                queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>, props ?: {
                                    'nationality': string
        'countryOfResidence': string
                                }): [
                                    void,
                                    Omit<ReturnType<typeof useSuspenseQuery>, 'data'>
                                ],
                                    getKycUrl(
                                        queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>,): [
                                            string,
                                            Omit<ReturnType<typeof useSuspenseQuery>, 'data'>
                                        ],
                                            getDueDiligenceUrl(
                                                queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>,): [
                                                    string,
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
                                                                                                                            sendUpdateEmail(
                                                                                                                                queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>, props ?: {
                                                                                                                                    'newEmail': string
                                                                                                                                }): [
                                                                                                                                    string,
                                                                                                                                    Omit<ReturnType<typeof useSuspenseQuery>, 'data'>
                                                                                                                                ],
                                                                                                                                    pincodeOrBiometricTokenAuthTestService(
                                                                                                                                        queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>,): [
                                                                                                                                            string,
                                                                                                                                            Omit<ReturnType<typeof useSuspenseQuery>, 'data'>
                                                                                                                                        ],
                                                                                                                                            deleteUserRequest(
                                                                                                                                                queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>,): [
                                                                                                                                                    Required<{
                                                                                                                                                        'isDeleted': boolean
                                                                                                                                                        'requestSentToSupport': boolean
                                                                                                                                                    }>,
                                                                                                                                                    Omit<ReturnType<typeof useSuspenseQuery>, 'data'>
                                                                                                                                                ],
                                                                                                                                                    checkUserExists(
                                                                                                                                                        queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>, props ?: {
                                                                                                                                                            'email'?: string
                                                                                                                                                        }): [
                                                                                                                                                            boolean,
                                                                                                                                                            Omit<ReturnType<typeof useSuspenseQuery>, 'data'>
                                                                                                                                                        ],
                                                                                                                                                            userUpdatePhone(
                                                                                                                                                                queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>, phonePrefix ?: any, phoneNumber ?: any): [
                                                                                                                                                                    string,
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
                                                                                                                                                                                            updatePasswordWithOldPassword(
                                                                                                                                                                                                queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>, props ?: {
                                                                                                                                                                                                    'oldPassword': string
        'newPassword': string
                                                                                                                                                                                                }): [
                                                                                                                                                                                                    string,
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
                                                                                                                                                                                                                                            checkTransactionStatus(
                                                                                                                                                                                                                                                queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>, props ?: {
                                                                                                                                                                                                                                                    'transactionId': string
                                                                                                                                                                                                                                                }): [
                                                                                                                                                                                                                                                    Required<{
                                                                                                                                                                                                                                                        'hasBeenUpdated': boolean
                                                                                                                                                                                                                                                        'status': 'pending' | 'success' | 'error' | 'canceled' | 'refunded'
                                                                                                                                                                                                                                                    }>,
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
                                                                                                                                                                                                                                                                            createIcoTransaction(
                                                                                                                                                                                                                                                                                queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>, props ?: {
                                                                                                                                                                                                                                                                                    'sourceAmount': number
        'sourceCurrency': 'eur' | 'tether' | 'solana' | 'usd' | 'ethereum' | 'bitcoin' | 'usd-coin' | 'binancecoin'
        'blockchainNetwork'?: 'ethereum' | 'polygon' | 'bsc' | 'base' | 'solana' | 'bitcoin'
        'hash'?: string
        'ethTransactionHash'?: `0x${string}`
        'solTransactionHash'?: string
        'bitcoinTransactionHash'?: string
        'isWalletConnector'?: boolean
        'bonusCode'?: string
                                                                                                                                                                                                                                                                                }): [
                                                                                                                                                                                                                                                                                    Required<{
                                                                                                                                                                                                                                                                                        'isBonusTransaction': false
                                                                                                                                                                                                                                                                                        'icoTransaction': modelTypes.IcoTransactionModels['Read']
                                                                                                                                                                                                                                                                                    }> | Required<{
                                                                                                                                                                                                                                                                                        'isBonusTransaction': true
                                                                                                                                                                                                                                                                                        'rewardTransactionId': string
                                                                                                                                                                                                                                                                                    }>,
                                                                                                                                                                                                                                                                                    Omit<ReturnType<typeof useSuspenseQuery>, 'data'>
                                                                                                                                                                                                                                                                                ],
                                                                                                                                                                                                                                                                                    cancelTransactionByUser(
                                                                                                                                                                                                                                                                                        queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>, props ?: {
                                                                                                                                                                                                                                                                                            'transactionId': string
                                                                                                                                                                                                                                                                                        }): [
                                                                                                                                                                                                                                                                                            void,
                                                                                                                                                                                                                                                                                            Omit<ReturnType<typeof useSuspenseQuery>, 'data'>
                                                                                                                                                                                                                                                                                        ],
                                                                                                                                                                                                                                                                                            icoGetAllReferedUsersWithBGKbonus(
                                                                                                                                                                                                                                                                                                queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>,): [
                                                                                                                                                                                                                                                                                                    Required<{
                                                                                                                                                                                                                                                                                                        'transactionByUsers': Array<Required<{
                                                                                                                                                                                                                                                                                                            'amountCompleted': number
                                                                                                                                                                                                                                                                                                            'amountPending': number
                                                                                                                                                                                                                                                                                                            'firstName': string
                                                                                                                                                                                                                                                                                                            'lastName': string
                                                                                                                                                                                                                                                                                                            '_id': string
                                                                                                                                                                                                                                                                                                        }>>
                                                                                                                                                                                                                                                                                                        'totalCompleted': number
                                                                                                                                                                                                                                                                                                        'totalPending': number
                                                                                                                                                                                                                                                                                                    }>,
                                                                                                                                                                                                                                                                                                    Omit<ReturnType<typeof useSuspenseQuery>, 'data'>
                                                                                                                                                                                                                                                                                                ],
                                                                                                                                                                                                                                                                                                    getNbReferralSinceLastPageView(
                                                                                                                                                                                                                                                                                                        queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>,): [
                                                                                                                                                                                                                                                                                                            number,
                                                                                                                                                                                                                                                                                                            Omit<ReturnType<typeof useSuspenseQuery>, 'data'>
                                                                                                                                                                                                                                                                                                        ],
                                                                                                                                                                                                                                                                                                            userHasTransactions(
                                                                                                                                                                                                                                                                                                                queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>,): [
                                                                                                                                                                                                                                                                                                                    Required<{
                                                                                                                                                                                                                                                                                                                        'hasTransactions': boolean
                                                                                                                                                                                                                                                                                                                        'nbIcoTransactions': number
                                                                                                                                                                                                                                                                                                                        'nbRewardTransactions': number
                                                                                                                                                                                                                                                                                                                    }>,
                                                                                                                                                                                                                                                                                                                    Omit<ReturnType<typeof useSuspenseQuery>, 'data'>
                                                                                                                                                                                                                                                                                                                ],
                                                                                                                                                                                                                                                                                                                    addTransactionBonusCode(
                                                                                                                                                                                                                                                                                                                        queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>, props ?: {
                                                                                                                                                                                                                                                                                                                            'code': string
        'transactionId': string
                                                                                                                                                                                                                                                                                                                        }): [
                                                                                                                                                                                                                                                                                                                            void,
                                                                                                                                                                                                                                                                                                                            Omit<ReturnType<typeof useSuspenseQuery>, 'data'>
                                                                                                                                                                                                                                                                                                                        ],
                                                                                                                                                                                                                                                                                                                            assignWalletToUser(
                                                                                                                                                                                                                                                                                                                                queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>, props ?: {
                                                                                                                                                                                                                                                                                                                                    'blockchain': 'solana' | 'ethereum' | 'bitcoin'
                                                                                                                                                                                                                                                                                                                                }): [
                                                                                                                                                                                                                                                                                                                                    string,
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
                        ]
},
prefetch: {
    addTransactionInfo(
        queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>, props ?: {
            'transactionId': string
        'solanaHash'?: string
        'ethereumHash'?: `0x${string}`
        'bitcoinHash'?: string
        }): Promise<void>,
            updateKycStatus(
                queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>,): Promise<void>,
                    updateDueDiligenceStatus(
                        queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>,): Promise<void>,
                            kycRequestForRestrictedCountries(
                                queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>, props ?: {
                                    'nationality': string
        'countryOfResidence': string
                                }): Promise<void>,
                                    getKycUrl(
                                        queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>,): Promise<void>,
                                            getDueDiligenceUrl(
                                                queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>,): Promise<void>,
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
                                                                                                                            sendUpdateEmail(
                                                                                                                                queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>, props ?: {
                                                                                                                                    'newEmail': string
                                                                                                                                }): Promise<void>,
                                                                                                                                    pincodeOrBiometricTokenAuthTestService(
                                                                                                                                        queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>,): Promise<void>,
                                                                                                                                            deleteUserRequest(
                                                                                                                                                queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>,): Promise<void>,
                                                                                                                                                    checkUserExists(
                                                                                                                                                        queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>, props ?: {
                                                                                                                                                            'email'?: string
                                                                                                                                                        }): Promise<void>,
                                                                                                                                                            userUpdatePhone(
                                                                                                                                                                queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>, phonePrefix ?: any, phoneNumber ?: any): Promise<void>,
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
                                                                                                                                                                                            updatePasswordWithOldPassword(
                                                                                                                                                                                                queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>, props ?: {
                                                                                                                                                                                                    'oldPassword': string
        'newPassword': string
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
                                                                                                                                                                                                                                            checkTransactionStatus(
                                                                                                                                                                                                                                                queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>, props ?: {
                                                                                                                                                                                                                                                    'transactionId': string
                                                                                                                                                                                                                                                }): Promise<void>,
                                                                                                                                                                                                                                                    getCurrencyRates(
                                                                                                                                                                                                                                                        queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>,): Promise<void>,
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
                                                                                                                                                                                                                                                                            createIcoTransaction(
                                                                                                                                                                                                                                                                                queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>, props ?: {
                                                                                                                                                                                                                                                                                    'sourceAmount': number
        'sourceCurrency': 'eur' | 'tether' | 'solana' | 'usd' | 'ethereum' | 'bitcoin' | 'usd-coin' | 'binancecoin'
        'blockchainNetwork'?: 'ethereum' | 'polygon' | 'bsc' | 'base' | 'solana' | 'bitcoin'
        'hash'?: string
        'ethTransactionHash'?: `0x${string}`
        'solTransactionHash'?: string
        'bitcoinTransactionHash'?: string
        'isWalletConnector'?: boolean
        'bonusCode'?: string
                                                                                                                                                                                                                                                                                }): Promise<void>,
                                                                                                                                                                                                                                                                                    cancelTransactionByUser(
                                                                                                                                                                                                                                                                                        queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>, props ?: {
                                                                                                                                                                                                                                                                                            'transactionId': string
                                                                                                                                                                                                                                                                                        }): Promise<void>,
                                                                                                                                                                                                                                                                                            icoGetAllReferedUsersWithBGKbonus(
                                                                                                                                                                                                                                                                                                queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>,): Promise<void>,
                                                                                                                                                                                                                                                                                                    getNbReferralSinceLastPageView(
                                                                                                                                                                                                                                                                                                        queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>,): Promise<void>,
                                                                                                                                                                                                                                                                                                            userHasTransactions(
                                                                                                                                                                                                                                                                                                                queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>,): Promise<void>,
                                                                                                                                                                                                                                                                                                                    addTransactionBonusCode(
                                                                                                                                                                                                                                                                                                                        queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>, props ?: {
                                                                                                                                                                                                                                                                                                                            'code': string
        'transactionId': string
                                                                                                                                                                                                                                                                                                                        }): Promise<void>,
                                                                                                                                                                                                                                                                                                                            assignWalletToUser(
                                                                                                                                                                                                                                                                                                                                queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>, props ?: {
                                                                                                                                                                                                                                                                                                                                    'blockchain': 'solana' | 'ethereum' | 'bitcoin'
                                                                                                                                                                                                                                                                                                                                }): Promise<void>,
                                                                                                                                                                                                                                                                                                                                    isBonusCodeValid(
                                                                                                                                                                                                                                                                                                                                        queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>, props ?: {
                                                                                                                                                                                                                                                                                                                                            'code': string
                                                                                                                                                                                                                                                                                                                                        }): Promise<void>,
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
                    userGetById<Config extends RequestConfigGetOne<modelTypes.UserModels['Read']>>(
                        queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>,
                        id: string,
                        config ?: Config
                    ): Promise<void>,
                        userGetOne<Config extends Omit<RequestConfigGetOne<modelTypes.UserModels['Read']>, 'filter'>>(
                            queryOptions ?: Partial<Omit<FetchQueryOptions, 'queryFn'>>,
                            filter ?: AsFilter<modelTypes.UserModels['Write']>, // WRITE HERE because it will ensure referenced fields are passed as their string counterpart
                            config ?: Config
                        ): Promise<void>
},
addQueriesToInvalidate: {
    addTransactionInfo(queriesToInvalidate: Array<`${ModelNames}*` | MethodNames>): void,
        updateKycStatus(queriesToInvalidate: Array<`${ModelNames}*` | MethodNames>): void,
            updateDueDiligenceStatus(queriesToInvalidate: Array<`${ModelNames}*` | MethodNames>): void,
                kycRequestForRestrictedCountries(queriesToInvalidate: Array<`${ModelNames}*` | MethodNames>): void,
                    getKycUrl(queriesToInvalidate: Array<`${ModelNames}*` | MethodNames>): void,
                        getDueDiligenceUrl(queriesToInvalidate: Array<`${ModelNames}*` | MethodNames>): void,
                            shuftiProCallback(queriesToInvalidate: Array<`${ModelNames}*` | MethodNames>): void,
                                subscribeToNewsletter(queriesToInvalidate: Array<`${ModelNames}*` | MethodNames>): void,
                                    dataTrackingRegisterEvent(queriesToInvalidate: Array<`${ModelNames}*` | MethodNames>): void,
                                        updateEmail(queriesToInvalidate: Array<`${ModelNames}*` | MethodNames>): void,
                                            registerUserDevice(queriesToInvalidate: Array<`${ModelNames}*` | MethodNames>): void,
                                                userSubscribe(queriesToInvalidate: Array<`${ModelNames}*` | MethodNames>): void,
                                                    updatePassword(queriesToInvalidate: Array<`${ModelNames}*` | MethodNames>): void,
                                                        sendForgotPasswordEmail(queriesToInvalidate: Array<`${ModelNames}*` | MethodNames>): void,
                                                            sendValidationEmail(queriesToInvalidate: Array<`${ModelNames}*` | MethodNames>): void,
                                                                sendUpdateEmail(queriesToInvalidate: Array<`${ModelNames}*` | MethodNames>): void,
                                                                    pincodeOrBiometricTokenAuthTestService(queriesToInvalidate: Array<`${ModelNames}*` | MethodNames>): void,
                                                                        deleteUserRequest(queriesToInvalidate: Array<`${ModelNames}*` | MethodNames>): void,
                                                                            checkUserExists(queriesToInvalidate: Array<`${ModelNames}*` | MethodNames>): void,
                                                                                userUpdatePhone(queriesToInvalidate: Array<`${ModelNames}*` | MethodNames>): void,
                                                                                    registerCompanyRepresentative(queriesToInvalidate: Array<`${ModelNames}*` | MethodNames>): void,
                                                                                        getNewToken(queriesToInvalidate: Array<`${ModelNames}*` | MethodNames>): void,
                                                                                            validateEmailAndLogin(queriesToInvalidate: Array<`${ModelNames}*` | MethodNames>): void,
                                                                                                updatePasswordWithOldPassword(queriesToInvalidate: Array<`${ModelNames}*` | MethodNames>): void,
                                                                                                    checkTokenBeforeEmailSvc(queriesToInvalidate: Array<`${ModelNames}*` | MethodNames>): void,
                                                                                                        tokenBgk(queriesToInvalidate: Array<`${ModelNames}*` | MethodNames>): void,
                                                                                                            sendMessageToSupport(queriesToInvalidate: Array<`${ModelNames}*` | MethodNames>): void,
                                                                                                                getCryptoChartData(queriesToInvalidate: Array<`${ModelNames}*` | MethodNames>): void,
                                                                                                                    getCurrencyRateLive(queriesToInvalidate: Array<`${ModelNames}*` | MethodNames>): void,
                                                                                                                        checkTransactionStatus(queriesToInvalidate: Array<`${ModelNames}*` | MethodNames>): void,
                                                                                                                            getCurrencyRates(queriesToInvalidate: Array<`${ModelNames}*` | MethodNames>): void,
                                                                                                                                frontendthrow error.andler(queriesToInvalidate: Array<`${ModelNames}*` | MethodNames>): void,
                                                                                                                                    getGeneralBonusCode(queriesToInvalidate: Array<`${ModelNames}*` | MethodNames>): void,
                                                                                                                                        createIcoTransaction(queriesToInvalidate: Array<`${ModelNames}*` | MethodNames>): void,
                                                                                                                                            cancelTransactionByUser(queriesToInvalidate: Array<`${ModelNames}*` | MethodNames>): void,
                                                                                                                                                icoGetAllReferedUsersWithBGKbonus(queriesToInvalidate: Array<`${ModelNames}*` | MethodNames>): void,
                                                                                                                                                    getNbReferralSinceLastPageView(queriesToInvalidate: Array<`${ModelNames}*` | MethodNames>): void,
                                                                                                                                                        userHasTransactions(queriesToInvalidate: Array<`${ModelNames}*` | MethodNames>): void,
                                                                                                                                                            addTransactionBonusCode(queriesToInvalidate: Array<`${ModelNames}*` | MethodNames>): void,
                                                                                                                                                                assignWalletToUser(queriesToInvalidate: Array<`${ModelNames}*` | MethodNames>): void,
                                                                                                                                                                    isBonusCodeValid(queriesToInvalidate: Array<`${ModelNames}*` | MethodNames>): void,
                                                                                                                                                                        bangkAdminLogin(queriesToInvalidate: Array<`${ModelNames}*` | MethodNames>): void,
                                                                                                                                                                            logout(queriesToInvalidate: Array<`${ModelNames}*` | MethodNames>): void,
                                                                                                                                                                                loginOrSubscribe(queriesToInvalidate: Array<`${ModelNames}*` | MethodNames>): void,
                                                                                                                                                                                    userLoginWithEmail(queriesToInvalidate: Array<`${ModelNames}*` | MethodNames>): void
    },
/** DEFER is used to avoid many user actions to trigger a lot of api calls. When a user do a modification (Eg: check a checkbox) we send a deferred call that will send the api call in 3 seconds. If between this time the user reclick the checkbox, it will cancel the first call and wait 3 seconds again so that in the end only one call is triggered. */
defer: {
    addTransactionInfo(props ?: {
        'transactionId': string
    'solanaHash'?: string
    'ethereumHash'?: `0x${string}`
    'bitcoinHash'?: string
    }): void,
        updateKycStatus(): void,
            updateDueDiligenceStatus(): void,
                kycRequestForRestrictedCountries(props ?: {
                    'nationality': string
    'countryOfResidence': string
                }): void,
                    getKycUrl(): void,
                        getDueDiligenceUrl(): void,
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
                                                                sendUpdateEmail(props ?: {
                                                                    'newEmail': string
                                                                }): void,
                                                                    pincodeOrBiometricTokenAuthTestService(): void,
                                                                        deleteUserRequest(): Promise<Required<{
                                                                            'isDeleted': boolean
                                                                            'requestSentToSupport': boolean
                                                                        }>>,
                                                                            checkUserExists(props ?: {
                                                                                'email'?: string
                                                                            }): void,
                                                                                userUpdatePhone(phonePrefix ?: any, phoneNumber ?: any): void,
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
                                                                                                updatePasswordWithOldPassword(props ?: {
                                                                                                    'oldPassword': string
    'newPassword': string
                                                                                                }): void,
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
                                                                                                                        checkTransactionStatus(props ?: {
                                                                                                                            'transactionId': string
                                                                                                                        }): Promise<Required<{
                                                                                                                            'hasBeenUpdated': boolean
                                                                                                                            'status': 'pending' | 'success' | 'error' | 'canceled' | 'refunded'
                                                                                                                        }>>,
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
                                                                                                                                        createIcoTransaction(props ?: {
                                                                                                                                            'sourceAmount': number
    'sourceCurrency': 'eur' | 'tether' | 'solana' | 'usd' | 'ethereum' | 'bitcoin' | 'usd-coin' | 'binancecoin'
    'blockchainNetwork'?: 'ethereum' | 'polygon' | 'bsc' | 'base' | 'solana' | 'bitcoin'
    'hash'?: string
    'ethTransactionHash'?: `0x${string}`
    'solTransactionHash'?: string
    'bitcoinTransactionHash'?: string
    'isWalletConnector'?: boolean
    'bonusCode'?: string
                                                                                                                                        }): Promise<Required<{
                                                                                                                                            'isBonusTransaction': false
                                                                                                                                            'icoTransaction': modelTypes.IcoTransactionModels['Read']
                                                                                                                                        }> | Required<{
                                                                                                                                            'isBonusTransaction': true
                                                                                                                                            'rewardTransactionId': string
                                                                                                                                        }>>,
                                                                                                                                            cancelTransactionByUser(props ?: {
                                                                                                                                                'transactionId': string
                                                                                                                                            }): void,
                                                                                                                                                icoGetAllReferedUsersWithBGKbonus(): Promise<Required<{
                                                                                                                                                    'transactionByUsers': Array<Required<{
                                                                                                                                                        'amountCompleted': number
                                                                                                                                                        'amountPending': number
                                                                                                                                                        'firstName': string
                                                                                                                                                        'lastName': string
                                                                                                                                                        '_id': string
                                                                                                                                                    }>>
                                                                                                                                                    'totalCompleted': number
                                                                                                                                                    'totalPending': number
                                                                                                                                                }>>,
                                                                                                                                                    getNbReferralSinceLastPageView(): void,
                                                                                                                                                        userHasTransactions(): Promise<Required<{
                                                                                                                                                            'hasTransactions': boolean
                                                                                                                                                            'nbIcoTransactions': number
                                                                                                                                                            'nbRewardTransactions': number
                                                                                                                                                        }>>,
                                                                                                                                                            addTransactionBonusCode(props ?: {
                                                                                                                                                                'code': string
    'transactionId': string
                                                                                                                                                            }): void,
                                                                                                                                                                assignWalletToUser(props ?: {
                                                                                                                                                                    'blockchain': 'solana' | 'ethereum' | 'bitcoin'
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
                                                                                                                                                                                                            >
}

} /*  */

export declare const $: ApiType

export const methodNames: { dbRead: Record<string, string>, dbWrite: Record<string, string>, service: Record<string, string> }

export default $

export declare function initBackend(serverConfig: InitBackendConfig<ServerUrls>)