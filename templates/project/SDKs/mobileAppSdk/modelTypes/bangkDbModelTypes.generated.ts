

export type AppConfig = {
    'featuredCryptos': Array<'bangkEuro' | 'bangkCoin' | 'tether' | 'bitcoin' | 'solana' | 'ethereum' | 'usd-coin' | 'binancecoin'>
    '_id': string
    'lastUpdateDate'?: Date
    'lastUpdater': string | User
}

export type AppConfigWrite = {
    'featuredCryptos'?: Array<'bangkEuro' | 'bangkCoin' | 'tether' | 'bitcoin' | 'solana' | 'ethereum' | 'usd-coin' | 'binancecoin'>
    '_id'?: string
    'lastUpdateDate'?: Date
    'lastUpdater'?: string
}

export interface AppConfigModels {
    Write: AppConfigWrite
    Read: AppConfig
}

export type BangkWallets = {
    'name': string
    'nameUnique'?: string
    'blockchain': 'solana' | 'ethereum' | 'bitcoin'
    'walletAdress'?: string
    'assigned': boolean
    '_id': string
}

export type BangkWalletsWrite = {
    'name': string
    'nameUnique'?: string
    'blockchain': 'solana' | 'ethereum' | 'bitcoin'
    'walletAdress'?: string
    'assigned'?: boolean
    '_id'?: string
}

export interface BangkWalletsModels {
    Write: BangkWalletsWrite
    Read: BangkWallets
}

export type BlockchainConfig = {
    'apiAdress': string
    '_id': string
}

export type BlockchainConfigWrite = {
    'apiAdress': string
    '_id'?: string
}

export interface BlockchainConfigModels {
    Write: BlockchainConfigWrite
    Read: BlockchainConfig
}

export type Card = {
    'last4digits': string
    '_id': string
    'creationDate': Date
    'creator': string | User
}

export type CardWrite = {
    'last4digits': string
    '_id'?: string
    'creationDate'?: Date
    'creator'?: string
}

export interface CardModels {
    Write: CardWrite
    Read: Card
}

export type CardTransaction = {
    'user': string | User
    'title': string
    'type': 'cardPayment' | 'contactless' | 'directDebit' | 'onlinePayment' | 'withdrawal' | 'incoming'
    'status': 'pending' | 'error' | 'rejected' | 'refunded' | 'success'
    'amount': number
    '_id': string
    'creationDate': Date
    'lastUpdateDate'?: Date
    'lastUpdater': string | User
}

export type CardTransactionWrite = {
    'user': string
    'title': string
    'type': 'cardPayment' | 'contactless' | 'directDebit' | 'onlinePayment' | 'withdrawal' | 'incoming'
    'status'?: 'pending' | 'error' | 'rejected' | 'refunded' | 'success'
    'amount': number
    '_id'?: string
    'creationDate'?: Date
    'lastUpdateDate'?: Date
    'lastUpdater'?: string
}

export interface CardTransactionModels {
    Write: CardTransactionWrite
    Read: CardTransaction
}

export type Company = {
    'name': string
    'activitySector'?: TranslationObj
    'representative'?: string | User
    'registrationCountry': string
    'geographyScope'?: 'national' | 'continental' | 'international' | 'global'
    'companyCreationDate'?: Date
    'companyIdenfier'?: string
    'address'?: {
        'street': string
        'zipCode': string
        'city': string
        'country': string
    }
    '_id': string
    'creationDate': Date
}

export type CompanyWrite = {
    'name': string
    'activitySector'?: TranslationObj
    'representative'?: string
    'registrationCountry': string
    'geographyScope'?: 'national' | 'continental' | 'international' | 'global'
    'companyCreationDate'?: Date
    'companyIdenfier'?: string
    'address'?: {
        'street': string
        'zipCode': string
        'city': string
        'country': string
    }
    '_id'?: string
    'creationDate'?: Date
}

export interface CompanyModels {
    Write: CompanyWrite
    Read: Company
}

export type DevComment = {
    'domain': string
    'route': string
    'parentIndex': number
    'x': number
    'y': number
    'content': string
    'userId'?: string
    'issueUrl'?: string
    '_id': string
}

export type DevCommentWrite = {
    'domain': string
    'route': string
    'parentIndex': number
    'x': number
    'y': number
    'content': string
    'userId'?: string
    'issueUrl'?: string
    '_id'?: string
}

export interface DevCommentModels {
    Write: DevCommentWrite
    Read: DevComment
}

export type Device = {
    'user'?: string | User
    'deviceName': string
    'deviceType': 'desktop' | 'mobile' | 'tablet' | 'unknown'
    'os'?: 'ios' | 'macos' | 'linux' | 'windows' | 'android' | 'other'
    'browser'?: 'firefox' | 'chrome' | 'safari' | 'other' | 'opera' | 'edge' | 'internetExplorer'
    'pixelHeight'?: number
    'pixelWidth'?: number
    'language'?: string
    'deviceInfos'?: {}
    '_id': string
}

export type DeviceWrite = {
    'user'?: string
    'deviceName': string
    'deviceType': 'desktop' | 'mobile' | 'tablet' | 'unknown'
    'os'?: 'ios' | 'macos' | 'linux' | 'windows' | 'android' | 'other'
    'browser'?: 'firefox' | 'chrome' | 'safari' | 'other' | 'opera' | 'edge' | 'internetExplorer'
    'pixelHeight'?: number
    'pixelWidth'?: number
    'language'?: string
    'deviceInfos'?: {}
    '_id'?: string
}

export interface DeviceModels {
    Write: DeviceWrite
    Read: Device
}

export type IcoBonusCode = {
    'code'?: string
    'type': 'onReferredFirstTransaction' | 'forReferrerOnAllReferredTransaction' | 'general' | 'custom'
    'description'?: string
    'valueType': 'value' | 'percentage'
    'value': number
    'expiresOn'?: Date
    'isOneShot': boolean
    'status': 'active' | 'paused' | 'expired' | 'used'
    'createdBy'?: string | User
    'onlyForUser'?: string | User
    'maximumUses'?: number
    'vestingConfig'?: string | VestingConfig
    '_id': string
}

export type IcoBonusCodeWrite = {
    'code'?: string
    'type': 'onReferredFirstTransaction' | 'forReferrerOnAllReferredTransaction' | 'general' | 'custom'
    'description'?: string
    'valueType'?: 'value' | 'percentage'
    'value': number
    'expiresOn'?: Date
    'isOneShot'?: boolean
    'status'?: 'active' | 'paused' | 'expired' | 'used'
    'createdBy'?: string
    'onlyForUser'?: string
    'maximumUses'?: number
    'vestingConfig'?: string
    '_id'?: string
}

export interface IcoBonusCodeModels {
    Write: IcoBonusCodeWrite
    Read: IcoBonusCode
}

export type IcoDashboardConfig = {
    'totalRaised': number
    'totalTarget': number
    'advantages'?: Array<{
        'title': TranslationObj
        'description': TranslationObj
        'from': number
        'displayNextAdvantageFromTrigger': number
    }>
    'priceCurve': Array<Required<{
        'fromDate': Date
        'tokenPrice': number
    }>>
    'listingDate': Date
    'vestingConfig'?: Array<string | VestingConfig>
    'minimumInvestment': number
    'whitepaperLink': string
    'websiteLink': string
    'privacyPolicyLink': string
    'termsAndConditionsLink': string
    'cookiePolicyLink': string
    '_id': string
}

export type IcoDashboardConfigWrite = {
    'totalRaised'?: number
    'totalTarget'?: number
    'advantages'?: Array<{
        'title': TranslationObj
        'description': TranslationObj
        'from': number
        'displayNextAdvantageFromTrigger': number
    }>
    'priceCurve': Array<Required<{
        'fromDate': Date
        'tokenPrice': number
    }>>
    'listingDate': Date
    'vestingConfig'?: Array<string>
    'minimumInvestment'?: number
    'whitepaperLink': string
    'websiteLink': string
    'privacyPolicyLink': string
    'termsAndConditionsLink': string
    'cookiePolicyLink': string
    '_id'?: string
}

export interface IcoDashboardConfigModels {
    Write: IcoDashboardConfigWrite
    Read: IcoDashboardConfig
}

export type IcoRewardTransaction = {
    'beneficiary': string | User
    'referrer'?: string | User
    'referred'?: string | User
    'amount': number
    'status': 'pending' | 'success' | 'canceled'
    'pendingReason'?: never
    'cancelReason'?: 'relatedTxCancelled'
    'errorExtraInfos'?: string
    'transactionStage': Array<{
        'status': 'pending' | 'success' | 'canceled'
        'pendingReason'?: never
        'cancelReason'?: 'relatedTxCancelled'
        'date': Date
    }>
    'transactionId': string
    'icoBonusCode'?: IcoBonusCode
    'originTransaction'?: string | IcoTransaction
    '_id': string
    'creationDate': Date
}

export type IcoRewardTransactionWrite = {
    'beneficiary': string
    'referrer'?: string
    'referred'?: string
    'amount': number
    'status': 'pending' | 'success' | 'canceled'
    'pendingReason'?: never
    'cancelReason'?: 'relatedTxCancelled'
    'errorExtraInfos'?: string
    'transactionStage'?: Array<{
        'status': 'pending' | 'success' | 'canceled'
        'pendingReason'?: never
        'cancelReason'?: 'relatedTxCancelled'
        'date': Date
    }>
    'transactionId': string
    'icoBonusCode'?: string
    'originTransaction'?: string
    '_id'?: string
    'creationDate'?: Date
}

export interface IcoRewardTransactionModels {
    Write: IcoRewardTransactionWrite
    Read: IcoRewardTransaction
}

export type IcoTransaction = {
    'user': string | User
    'sourceAmount': number
    'receivedAmount'?: number
    'sourceCurrency': 'eur' | 'tether' | 'solana' | 'usd' | 'ethereum' | 'bitcoin' | 'usd-coin' | 'binancecoin'
    'blockchainNetwork'?: 'ethereum' | 'polygon' | 'bsc' | 'base' | 'solana' | 'bitcoin'
    'conversionRate': number
    'amountInEuros': number
    'amountInDollars': number
    'ethTransactionHash'?: `0x${string}`
    'solTransactionHash'?: string
    'bitcoinTransactionHash'?: string
    'bonusCode'?: IcoBonusCode
    'validator'?: string | User
    'bgkPurchaseRequested': number
    'bgkReceivedAfterFeesAndAdjustment'?: number
    'acquisitionPrice': number
    'paymentMethod': 'solanaWithWalletConnector' | 'ethereumWithWalletConnector' | 'bankTransfer' | 'erc20CopyPaste' | 'ethCopyPaste' | 'solanaCopyPaste' | 'bitcoinCopyPaste'
    'userWallet'?: {
        'address': string
        'blockchain': 'solana' | 'ethereum' | 'bitcoin'
    }
    'userWalletId'?: string
    'userActionLogs'?: Array<{
        'action': 'submittedAt' | 'rejectedAt'
        'date': Date
    }>
    'status': 'pending' | 'success' | 'error' | 'canceled' | 'refunded'
    'pendingReason'?: 'fundsNotReceivedYetForUntrackableTx' | 'requiresManualVerification' | 'requiresAdditionnalInfos' | 'fundsNotReceivedYetForTrackableTx' | 'bankTransferAmountNotCorresponding' | 'bankTransferCurrencyNotCorresponding' | 'bankTransferPendingForTooLong'
    'cancelReason'?: 'relatedTxCancelled' | 'error' | 'cancelledByBangkAdmin' | 'expired' | 'transactionWithoutHashExpired' | 'neverProcessed'
    'errorExtraInfos'?: string
    'transactionStage': Array<{
        'status': 'pending' | 'success' | 'error' | 'canceled' | 'refunded'
        'pendingReason'?: 'fundsNotReceivedYetForUntrackableTx' | 'requiresManualVerification' | 'requiresAdditionnalInfos' | 'fundsNotReceivedYetForTrackableTx' | 'bankTransferAmountNotCorresponding' | 'bankTransferCurrencyNotCorresponding' | 'bankTransferPendingForTooLong'
        'cancelReason'?: 'relatedTxCancelled' | 'error' | 'cancelledByBangkAdmin' | 'expired' | 'transactionWithoutHashExpired' | 'neverProcessed'
        'date': Date
    }>
    'transactionId': string
    'expiresOn': Date
    'hasAgreedTermsOfSales': boolean
    'bankTransferInformations'?: Required<{
        'amount': number
        'object': string
        'date': string
        'pending': boolean
        'status': 'added' | 'modified' | 'removed'
        'currency': string
    }>
    'bgkSignature'?: string
    'isDeletedByUser'?: Date
    'vestingConfig'?: string | VestingConfig
    '_id': string
    'creationDate': Date
    'lastUpdateDate'?: Date
    'lastUpdater': string | User
}

export type IcoTransactionWrite = {
    'user': string
    'sourceAmount': number
    'receivedAmount'?: number
    'sourceCurrency': 'eur' | 'tether' | 'solana' | 'usd' | 'ethereum' | 'bitcoin' | 'usd-coin' | 'binancecoin'
    'blockchainNetwork'?: 'ethereum' | 'polygon' | 'bsc' | 'base' | 'solana' | 'bitcoin'
    'conversionRate': number
    'amountInEuros': number
    'amountInDollars': number
    'ethTransactionHash'?: `0x${string}`
    'solTransactionHash'?: string
    'bitcoinTransactionHash'?: string
    'bonusCode'?: string
    'validator'?: string
    'bgkPurchaseRequested': number
    'bgkReceivedAfterFeesAndAdjustment'?: number
    'acquisitionPrice': number
    'paymentMethod': 'solanaWithWalletConnector' | 'ethereumWithWalletConnector' | 'bankTransfer' | 'erc20CopyPaste' | 'ethCopyPaste' | 'solanaCopyPaste' | 'bitcoinCopyPaste'
    'userWallet'?: {
        'address': string
        'blockchain': 'solana' | 'ethereum' | 'bitcoin'
    }
    'userWalletId'?: string
    'userActionLogs'?: Array<{
        'action': 'submittedAt' | 'rejectedAt'
        'date': Date
    }>
    'status': 'pending' | 'success' | 'error' | 'canceled' | 'refunded'
    'pendingReason'?: 'fundsNotReceivedYetForUntrackableTx' | 'requiresManualVerification' | 'requiresAdditionnalInfos' | 'fundsNotReceivedYetForTrackableTx' | 'bankTransferAmountNotCorresponding' | 'bankTransferCurrencyNotCorresponding' | 'bankTransferPendingForTooLong'
    'cancelReason'?: 'relatedTxCancelled' | 'error' | 'cancelledByBangkAdmin' | 'expired' | 'transactionWithoutHashExpired' | 'neverProcessed'
    'errorExtraInfos'?: string
    'transactionStage'?: Array<{
        'status': 'pending' | 'success' | 'error' | 'canceled' | 'refunded'
        'pendingReason'?: 'fundsNotReceivedYetForUntrackableTx' | 'requiresManualVerification' | 'requiresAdditionnalInfos' | 'fundsNotReceivedYetForTrackableTx' | 'bankTransferAmountNotCorresponding' | 'bankTransferCurrencyNotCorresponding' | 'bankTransferPendingForTooLong'
        'cancelReason'?: 'relatedTxCancelled' | 'error' | 'cancelledByBangkAdmin' | 'expired' | 'transactionWithoutHashExpired' | 'neverProcessed'
        'date': Date
    }>
    'transactionId': string
    'expiresOn'?: Date
    'hasAgreedTermsOfSales'?: boolean
    'bankTransferInformations'?: Required<{
        'amount': number
        'object': string
        'date': string
        'pending': boolean
        'status': 'added' | 'modified' | 'removed'
        'currency': string
    }>
    'bgkSignature'?: string
    'isDeletedByUser'?: Date
    'vestingConfig'?: string
    '_id'?: string
    'creationDate'?: Date
    'lastUpdateDate'?: Date
    'lastUpdater'?: string
}

export interface IcoTransactionModels {
    Write: IcoTransactionWrite
    Read: IcoTransaction
}

export type IcoWalletTransactionToValidateManually = {
    'hash': string
    'amount': number
    'matchingTransactions'?: Array<string | IcoTransaction>
    'assignedUser': string | User
    'assignedWallet': string | BangkWallets
    'isHandled': boolean
    'currency': 'eur' | 'tether' | 'solana' | 'usd' | 'ethereum' | 'bitcoin' | 'usd-coin' | 'binancecoin'
    '_id': string
    'creationDate': Date
    'lastUpdateDate'?: Date
    'lastUpdater': string | User
}

export type IcoWalletTransactionToValidateManuallyWrite = {
    'hash': string
    'amount': number
    'matchingTransactions'?: Array<string>
    'assignedUser': string
    'assignedWallet': string
    'isHandled'?: boolean
    'currency': 'eur' | 'tether' | 'solana' | 'usd' | 'ethereum' | 'bitcoin' | 'usd-coin' | 'binancecoin'
    '_id'?: string
    'creationDate'?: Date
    'lastUpdateDate'?: Date
    'lastUpdater'?: string
}

export interface IcoWalletTransactionToValidateManuallyModels {
    Write: IcoWalletTransactionToValidateManuallyWrite
    Read: IcoWalletTransactionToValidateManually
}

export type InterestTransaction = {
    'user': string | User
    'investment': InvestmentTransactionBonds
    'investmentProject': string | InvestmentProjectBonds
    'investmentPeriodIndex': number
    'amount': number
    'targetCurrency': 'bangkEuro' | 'bangkCoin' | 'tether' | 'bitcoin' | 'solana' | 'ethereum' | 'usd-coin' | 'binancecoin' | 'eur' | 'usd' | 'thb' | 'jpy' | 'inr' | 'cny' | 'try' | 'mxn' | 'gbp' | 'chf' | 'rub' | 'pln' | 'dkk' | 'ils' | 'sek' | 'ars' | 'php' | 'brl' | 'cad' | 'krw' | 'nok' | 'sgd' | 'huf' | 'uah' | 'aud' | 'zar' | 'myr' | 'idr' | 'hkd' | 'nzd' | 'aed'
    'status': 'pending' | 'error' | 'success'
    '_id': string
    'creationDate': Date
}

export type InterestTransactionWrite = {
    'user': string
    'investment': string
    'investmentProject': string
    'investmentPeriodIndex': number
    'amount': number
    'targetCurrency': 'bangkEuro' | 'bangkCoin' | 'tether' | 'bitcoin' | 'solana' | 'ethereum' | 'usd-coin' | 'binancecoin' | 'eur' | 'usd' | 'thb' | 'jpy' | 'inr' | 'cny' | 'try' | 'mxn' | 'gbp' | 'chf' | 'rub' | 'pln' | 'dkk' | 'ils' | 'sek' | 'ars' | 'php' | 'brl' | 'cad' | 'krw' | 'nok' | 'sgd' | 'huf' | 'uah' | 'aud' | 'zar' | 'myr' | 'idr' | 'hkd' | 'nzd' | 'aed'
    'status'?: 'pending' | 'error' | 'success'
    '_id'?: string
    'creationDate'?: Date
}

export interface InterestTransactionModels {
    Write: InterestTransactionWrite
    Read: InterestTransaction
}

export type InvestmentBonds = {
    'investmentType': 'bond'
    'investmentProject': InvestmentProjectBonds
    'totalNbShares': number
    'nbSharesInSellOffer': number
    'nbSharesSold': number
    'transactions'?: Array<string | InvestmentTransactionBonds>
    'sellOffers'?: Array<string | SellOfferBonds>
    '_id': string
    'creationDate': Date
    'creator': string | User
}

export type InvestmentBondsWrite = {
    'investmentType'?: 'bond'
    'investmentProject': string
    'totalNbShares'?: number
    'nbSharesInSellOffer'?: number
    'nbSharesSold'?: number
    'transactions'?: Array<string>
    'sellOffers'?: Array<string>
    '_id'?: string
    'creationDate'?: Date
    'creator'?: string
}

export interface InvestmentBondsModels {
    Write: InvestmentBondsWrite
    Read: InvestmentBonds
}

export type InvestmentEquity = {
    'investmentType': 'equity'
    'investmentProject': InvestmentProjectEquity
    'totalNbShares': number
    'nbSharesInSellOffer': number
    'nbSharesSold': number
    'transactions'?: Array<string | InvestmentTransactionEquity>
    'sellOffers'?: Array<string | SellOfferEquity>
    '_id': string
    'creationDate': Date
    'creator': string | User
}

export type InvestmentEquityWrite = {
    'investmentType'?: 'equity'
    'investmentProject': string
    'totalNbShares'?: number
    'nbSharesInSellOffer'?: number
    'nbSharesSold'?: number
    'transactions'?: Array<string>
    'sellOffers'?: Array<string>
    '_id'?: string
    'creationDate'?: Date
    'creator'?: string
}

export interface InvestmentEquityModels {
    Write: InvestmentEquityWrite
    Read: InvestmentEquity
}

export type InvestmentFundShares = {
    'investmentType': 'fundShares'
    'investmentProject': InvestmentProjectFundShares
    'totalNbShares': number
    'nbSharesInSellOffer': number
    'nbSharesSold': number
    'transactions'?: Array<string | InvestmentTransactionFundShares>
    'sellOffers'?: Array<string | SellOfferFundShares>
    '_id': string
    'creationDate': Date
    'creator': string | User
}

export type InvestmentFundSharesWrite = {
    'investmentType'?: 'fundShares'
    'investmentProject': string
    'totalNbShares'?: number
    'nbSharesInSellOffer'?: number
    'nbSharesSold'?: number
    'transactions'?: Array<string>
    'sellOffers'?: Array<string>
    '_id'?: string
    'creationDate'?: Date
    'creator'?: string
}

export interface InvestmentFundSharesModels {
    Write: InvestmentFundSharesWrite
    Read: InvestmentFundShares
}

export type InvestmentProjectBonds = {
    'tokenId': string
    'denomination': TranslationObj
    'wallet': Wallet
    'administrators'?: Array<string | User>
    'baseCurrency': 'eur' | 'usd' | 'thb' | 'jpy' | 'inr' | 'cny' | 'try' | 'mxn' | 'gbp' | 'chf' | 'rub' | 'pln' | 'dkk' | 'ils' | 'sek' | 'ars' | 'php' | 'brl' | 'cad' | 'krw' | 'nok' | 'sgd' | 'huf' | 'uah' | 'aud' | 'zar' | 'myr' | 'idr' | 'hkd' | 'nzd' | 'aed'
    'sharePrice': number
    'company': Company
    'targetInterestRatePerYear': number
    'riskScore': 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7
    'collectedAmount': number
    'individualInvestors': number
    'coverImage': string
    'presentationVideoUrl'?: string
    'tags': Array<string | Tag>
    'shortDescription': TranslationObj
    'descriptionSections'?: Array<Required<{
        'type': 'title' | 'paragraph'
        'content': TranslationObj
    }> | Required<{
        'type': 'gallery'
        'content': Array<string>
    }>>
    'news'?: Array<string | News>
    'taxAdvantage': TranslationObj
    'legalAnalysisInfos': Array<{
        'key': TranslationObj
        'value': TranslationObj
    }>
    'financialAnalysisInfos': Array<{
        'key': TranslationObj
        'value': TranslationObj
    }>
    'externalLinks': Array<{
        'label': 'smartContract' | 'detailedPresentation' | 'ESG' | 'financialAudit' | 'legalAudit' | 'keyInfos' | 'fundRules' | 'website' | 'other'
        'href': string
    }>
    'fundRaisingStartDate': Date
    'fundRaisingEndDate': Date
    'fundRaisingTarget': number
    'fundRaisingMinTarget': number
    'fundRaisingMaxTarget': number
    'impactInfos': Array<{
        'icon': 'ChevronDown' | 'DragAndDrop' | 'ChevronLeft' | 'ChevronLeftRight' | 'ChevronRight' | 'ChevronUp' | 'ChevronUpDown' | 'MinusRounded' | 'PlusRounded' | 'MediaPlayBackwardBold' | 'VideoCameraOffBold' | 'VideoCameraBold' | 'MediaPlayForwardBold' | 'MediaNextBold' | 'MediaPauseBold' | 'MediaPlayBold' | 'MediaPreviousBold' | 'MediaReplayBold' | 'MediaStopBold' | 'ComputerScreenBold' | 'LaptopComputerBold' | 'GamepadBold' | 'PhoneBold' | 'SmartTvBold' | 'TabletBold' | 'WatchBold' | 'SizeDownBold' | 'SizeUpBold' | 'DepositBold' | 'ArrowCaretDownBold' | 'ExchangeBold' | 'ReceiveBold' | 'SendBold' | 'TransferBold' | 'ArrowCaretUpBold' | 'WithdrawBold' | 'ArrowDownRoundedBold' | 'ArrowLeftRoundedBold' | 'ArrowRightRoundedBold' | 'ArrowUpRoundedBold' | 'BellBold' | 'BatteryChargingBold' | 'MagnifyingGlassRoundedBold' | 'MagnifyingGlassBold' | 'SoundMuteBold' | 'BatteryFullBold' | 'HideEyeBold' | 'VolumeHighBold' | 'VolumeLessBold' | 'BatteryLowBold' | 'VolumeLowBold' | 'BatteryMediumBold' | 'ZoomOutBold' | 'BellOnBold' | 'VolumePlusBold' | 'ZoomInBold' | 'VolumeMuteBold' | 'ViewEyeBold' | 'BangkStableBold' | 'BtcBold' | 'BasketCartBold' | 'TrashBold' | 'BluetoothBold' | 'BookBold' | 'CalendarBold' | 'ForbiddenSignBold' | 'CardContactlessBold' | 'CardBold' | 'Chart3linesBold' | 'Chart2linesBold' | 'CheckMarkBold' | 'ClockBold' | 'CloudBold' | 'HomeWithWindowBold' | 'CompassBold' | 'NoContactlessBold' | 'ContactlessBold' | 'CrossCircleBold' | 'CrowwTriangleBold' | 'CubeProjectBold' | 'DiamondBold' | 'DiscussionBold' | 'DollarRoundedBold' | 'ThreeDotsHorizontalRoundedBold' | 'ThreeDotsVerticalRoundedBold' | 'DueDateCalendar' | 'EnergyBold' | 'EnergyOffBold' | 'EuroRoundedBold' | 'ExclamationMarkRoundedBold' | 'ExclamationMarkTriangleBold' | 'TimeExpiredBold' | 'BookmarkOkBold' | 'RemoveBookmarkBold' | 'FileBold' | 'FlagBold' | 'FolderBold' | 'FolderOpenBold' | 'FoodBold' | 'GalleryBold' | 'GoldBold' | 'EarthBold' | 'HeartSlashBold' | 'Settings2fadersHorizontalBold' | 'Settings3fadersHorizontalBold' | 'HourGlassBold' | 'HomeWithTwoLinesBold' | 'InstitutionIbanBold' | 'IdCardBold' | 'InfoRoundedBold' | 'PlantInvestBold' | 'ListViewBold' | 'LockClosedBold' | 'LockOpenBold' | 'MailBold' | 'MailModifyBold' | 'MailSendingBold' | 'MailMapBold' | 'MicrophoneOffBold' | 'MicrophoneOnBold' | 'PencilBold' | 'MoonBold' | 'MusicNoteBold' | 'MusicNote2bold' | 'NewCheckedBold' | 'LightBulbOffBold' | 'LightBulbBold' | 'UserProfileBold' | 'OnlinePaymentWalletBold' | 'OperationArrowUpDownBold' | 'CogBold' | 'PaymentBold' | 'PhoneBold' | 'PhoneOffBold' | 'PhoneRingingBold' | 'CameraBold' | 'PieChartBold' | 'MapMarkerBold' | 'MapMarkerCheckedBold' | 'MapMarkerOffBold' | 'UserProfileRoundedBold' | 'PuzzlePieceBold' | 'QuestionMarkRoundedBold' | 'RocketBold' | 'SmsSpeechBaloonBold' | 'BookmarkBold' | 'SavingsBold' | 'SecurityKeyRoundedBold' | 'SendMsgBold' | 'SendMsgUpBold' | 'ProfileSettingBold' | 'ShareViaBold' | 'SheetBold' | 'ShieldKeyHoleBold' | 'SmartContractBold' | 'HomeNetworkBold' | 'SnowBold' | 'LayersBold' | 'FourSquareTilesBold' | 'StarBold' | 'StarSlashBold' | 'SunBold' | 'TagBold' | 'TargetBold' | 'TelescopeBold' | 'PeopleGroupThreeBold' | 'ThumbDownBold' | 'ThumbUpBold' | 'TimerBold' | 'PeopleGroupTwoBold' | 'VaultBold' | 'Settings3fadersVerticalBold' | 'VolatilityBold' | 'WorldWwwBold' | 'WalletInvestBold' | 'WalletBold' | 'WaterDropBold' | 'WifiBold' | 'WithdrawAtmBold' | 'WorldBold' | 'AtBold' | 'DownloadBold' | 'DoorExitBold' | 'MinusRoundedBold' | 'PlusRoundedBold' | 'MediaPlayBackward' | 'VideoCameraOff' | 'VideoCamera' | 'MediaPlayForward' | 'MediaNext' | 'MediaPause' | 'MediaPlay' | 'MediaPrevious' | 'MediaReplay' | 'MediaStop' | 'ComputerScreen' | 'LaptopComputer' | 'Gamepad' | 'Phone' | 'SmartTv' | 'Tablet' | 'Watch' | 'SizeDown' | 'SizeUp' | 'Deposit' | 'ArrowCaretDown' | 'Exchange' | 'Receive' | 'Send' | 'Transfer' | 'ArrowCaretUp' | 'Withdraw' | 'ArrowDownRounded' | 'ArrowLeftRounded' | 'ArrowRightRounded' | 'ArrowUpRounded' | 'Bell' | 'BatteryCharging' | 'MagnifyingGlassRounded' | 'MagnifyingGlass' | 'SoundMute' | 'BatteryFull' | 'HideEye' | 'VolumeHigh' | 'VolumeLess' | 'BatteryLow' | 'VolumeLow' | 'BatteryMedium' | 'ZoomOut' | 'BellOn' | 'VolumePlus' | 'ZoomIn' | 'VolumeMute' | 'ViewEye' | 'BangkStable' | 'Btc' | 'BasketCart' | 'Trash' | 'Bluetooth' | 'Book' | 'Calendar' | 'ForbiddenSign' | 'CardContactless' | 'Card' | 'Chart3lines' | 'Chart2lines' | 'CheckMark' | 'Clock' | 'Cloud' | 'HomeWithWindow' | 'Compass' | 'NoContactless' | 'Contactless' | 'CrossCircle' | 'CrossTriangle' | 'CubeProject' | 'Diamond' | 'Discussion' | 'DollarRounded' | 'ThreeDotsHorizontalRounded' | 'ThreeDotsVerticalRounded' | 'ThreeDotsHorizontal' | 'ThreeDotsVertical' | 'DueDateCalendar' | 'Energy' | 'EnergyOff' | 'EuroRounded' | 'ExclamationMarkRounded' | 'ExclamationMarkTriangle' | 'TimeExpired' | 'BookmarkOk' | 'RemoveBookmark' | 'File' | 'Fingerprint' | 'Flag' | 'Folder' | 'FolderOpen' | 'Food' | 'Gallery' | 'Gold' | 'Earth' | 'HeartSlash' | 'Settings2fadersHorizontal' | 'Settings3fadersHorizontal' | 'HourGlass' | 'HomeWithTwoLines' | 'InstitutionIban' | 'IdCard' | 'InfoRounded' | 'PlantInvest' | 'BurgerMenuHorizontal' | 'ListView' | 'LockClosed' | 'LockOpen' | 'Mail' | 'MailModify' | 'MailSending' | 'MailMap' | 'MicrophoneOff' | 'MicrophoneOn' | 'Pencil' | 'Moon' | 'MusicNote' | 'MusicNote2' | 'NewChecked' | 'LightBulbOff' | 'LightBulb' | 'UserProfile' | 'OnlinePaymentWallet' | 'OperationArrowUpDown' | 'Cog' | 'Payment' | 'Phone' | 'PhoneOff' | 'PhoneRinging' | 'Camera' | 'PieChart' | 'MapMarker' | 'MapMarkerChecked' | 'MapMarkerOff' | 'UserProfileRounded' | 'PuzzlePiece' | 'QuestionMarkRounded' | 'Rocket' | 'SmsSpeechBaloon' | 'Bookmark' | 'Savings' | 'SecurityKeyRounded' | 'SendMsg' | 'SendMsgUp' | 'ProfileSetting' | 'ShareVia' | 'Sheet' | 'ShieldKeyHole' | 'SmartContract' | 'HomeNetwork' | 'Snow' | 'Layers' | 'FourSquareTiles' | 'Star' | 'StarSlash' | 'Sun' | 'Tag' | 'Target' | 'Telescope' | 'PeopleGroupThree' | 'ThumbDown' | 'ThumbUp' | 'Timer' | 'PeopleGroupTwo' | 'Vault' | 'Settings3fadersVertical' | 'Volatility' | 'WorldWww' | 'WalletInvest' | 'Wallet' | 'WaterDrop' | 'Wifi' | 'WithdrawAtm' | 'World' | 'At' | 'Download' | 'DoorExit' | 'Attachement' | 'Cross' | 'ExternalLink' | 'Hashtag' | 'LinkJoint' | 'LinkJoin2' | 'Minus' | 'Next' | 'Plus' | 'Previous' | 'Check'
        'key': TranslationObj
        'value': TranslationObj
    }>
    'exitHorizon': number
    'cashbackPeriod': 'monthly' | 'quarterly' | 'halfly' | 'yearly'
    'interestDates': Array<Date>
    'interestPaymentStartDate': Date
    'interestPaymentEndDate': Date
    'investmentType': 'bond'
    'developmentStage': TranslationObj
    'location'?: Required<{
        'country': TranslationObj
        'city': TranslationObj
        'zone': TranslationObj
    }>
    '_id': string
    'creationDate': Date
    'lastUpdateDate'?: Date
    'lastUpdater': string | User
}

export type InvestmentProjectBondsWrite = {
    'tokenId': string
    'denomination': TranslationObj
    'wallet': string
    'administrators'?: Array<string>
    'baseCurrency'?: 'eur' | 'usd' | 'thb' | 'jpy' | 'inr' | 'cny' | 'try' | 'mxn' | 'gbp' | 'chf' | 'rub' | 'pln' | 'dkk' | 'ils' | 'sek' | 'ars' | 'php' | 'brl' | 'cad' | 'krw' | 'nok' | 'sgd' | 'huf' | 'uah' | 'aud' | 'zar' | 'myr' | 'idr' | 'hkd' | 'nzd' | 'aed'
    'sharePrice': number
    'company': string
    'targetInterestRatePerYear': number
    'riskScore': 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7
    'collectedAmount'?: number
    'individualInvestors'?: number
    'coverImage': string
    'presentationVideoUrl'?: string
    'tags': Array<string>
    'shortDescription': TranslationObj
    'descriptionSections'?: Array<Required<{
        'type': 'title' | 'paragraph'
        'content': TranslationObj
    }> | Required<{
        'type': 'gallery'
        'content': Array<string>
    }>>
    'news'?: Array<string>
    'taxAdvantage': TranslationObj
    'legalAnalysisInfos': Array<{
        'key': TranslationObj
        'value': TranslationObj
    }>
    'financialAnalysisInfos': Array<{
        'key': TranslationObj
        'value': TranslationObj
    }>
    'externalLinks': Array<{
        'label': 'smartContract' | 'detailedPresentation' | 'ESG' | 'financialAudit' | 'legalAudit' | 'keyInfos' | 'fundRules' | 'website' | 'other'
        'href': string
    }>
    'fundRaisingStartDate': Date
    'fundRaisingEndDate': Date
    'fundRaisingTarget': number
    'fundRaisingMinTarget': number
    'fundRaisingMaxTarget': number
    'impactInfos': Array<{
        'icon': 'ChevronDown' | 'DragAndDrop' | 'ChevronLeft' | 'ChevronLeftRight' | 'ChevronRight' | 'ChevronUp' | 'ChevronUpDown' | 'MinusRounded' | 'PlusRounded' | 'MediaPlayBackwardBold' | 'VideoCameraOffBold' | 'VideoCameraBold' | 'MediaPlayForwardBold' | 'MediaNextBold' | 'MediaPauseBold' | 'MediaPlayBold' | 'MediaPreviousBold' | 'MediaReplayBold' | 'MediaStopBold' | 'ComputerScreenBold' | 'LaptopComputerBold' | 'GamepadBold' | 'PhoneBold' | 'SmartTvBold' | 'TabletBold' | 'WatchBold' | 'SizeDownBold' | 'SizeUpBold' | 'DepositBold' | 'ArrowCaretDownBold' | 'ExchangeBold' | 'ReceiveBold' | 'SendBold' | 'TransferBold' | 'ArrowCaretUpBold' | 'WithdrawBold' | 'ArrowDownRoundedBold' | 'ArrowLeftRoundedBold' | 'ArrowRightRoundedBold' | 'ArrowUpRoundedBold' | 'BellBold' | 'BatteryChargingBold' | 'MagnifyingGlassRoundedBold' | 'MagnifyingGlassBold' | 'SoundMuteBold' | 'BatteryFullBold' | 'HideEyeBold' | 'VolumeHighBold' | 'VolumeLessBold' | 'BatteryLowBold' | 'VolumeLowBold' | 'BatteryMediumBold' | 'ZoomOutBold' | 'BellOnBold' | 'VolumePlusBold' | 'ZoomInBold' | 'VolumeMuteBold' | 'ViewEyeBold' | 'BangkStableBold' | 'BtcBold' | 'BasketCartBold' | 'TrashBold' | 'BluetoothBold' | 'BookBold' | 'CalendarBold' | 'ForbiddenSignBold' | 'CardContactlessBold' | 'CardBold' | 'Chart3linesBold' | 'Chart2linesBold' | 'CheckMarkBold' | 'ClockBold' | 'CloudBold' | 'HomeWithWindowBold' | 'CompassBold' | 'NoContactlessBold' | 'ContactlessBold' | 'CrossCircleBold' | 'CrowwTriangleBold' | 'CubeProjectBold' | 'DiamondBold' | 'DiscussionBold' | 'DollarRoundedBold' | 'ThreeDotsHorizontalRoundedBold' | 'ThreeDotsVerticalRoundedBold' | 'DueDateCalendar' | 'EnergyBold' | 'EnergyOffBold' | 'EuroRoundedBold' | 'ExclamationMarkRoundedBold' | 'ExclamationMarkTriangleBold' | 'TimeExpiredBold' | 'BookmarkOkBold' | 'RemoveBookmarkBold' | 'FileBold' | 'FlagBold' | 'FolderBold' | 'FolderOpenBold' | 'FoodBold' | 'GalleryBold' | 'GoldBold' | 'EarthBold' | 'HeartSlashBold' | 'Settings2fadersHorizontalBold' | 'Settings3fadersHorizontalBold' | 'HourGlassBold' | 'HomeWithTwoLinesBold' | 'InstitutionIbanBold' | 'IdCardBold' | 'InfoRoundedBold' | 'PlantInvestBold' | 'ListViewBold' | 'LockClosedBold' | 'LockOpenBold' | 'MailBold' | 'MailModifyBold' | 'MailSendingBold' | 'MailMapBold' | 'MicrophoneOffBold' | 'MicrophoneOnBold' | 'PencilBold' | 'MoonBold' | 'MusicNoteBold' | 'MusicNote2bold' | 'NewCheckedBold' | 'LightBulbOffBold' | 'LightBulbBold' | 'UserProfileBold' | 'OnlinePaymentWalletBold' | 'OperationArrowUpDownBold' | 'CogBold' | 'PaymentBold' | 'PhoneBold' | 'PhoneOffBold' | 'PhoneRingingBold' | 'CameraBold' | 'PieChartBold' | 'MapMarkerBold' | 'MapMarkerCheckedBold' | 'MapMarkerOffBold' | 'UserProfileRoundedBold' | 'PuzzlePieceBold' | 'QuestionMarkRoundedBold' | 'RocketBold' | 'SmsSpeechBaloonBold' | 'BookmarkBold' | 'SavingsBold' | 'SecurityKeyRoundedBold' | 'SendMsgBold' | 'SendMsgUpBold' | 'ProfileSettingBold' | 'ShareViaBold' | 'SheetBold' | 'ShieldKeyHoleBold' | 'SmartContractBold' | 'HomeNetworkBold' | 'SnowBold' | 'LayersBold' | 'FourSquareTilesBold' | 'StarBold' | 'StarSlashBold' | 'SunBold' | 'TagBold' | 'TargetBold' | 'TelescopeBold' | 'PeopleGroupThreeBold' | 'ThumbDownBold' | 'ThumbUpBold' | 'TimerBold' | 'PeopleGroupTwoBold' | 'VaultBold' | 'Settings3fadersVerticalBold' | 'VolatilityBold' | 'WorldWwwBold' | 'WalletInvestBold' | 'WalletBold' | 'WaterDropBold' | 'WifiBold' | 'WithdrawAtmBold' | 'WorldBold' | 'AtBold' | 'DownloadBold' | 'DoorExitBold' | 'MinusRoundedBold' | 'PlusRoundedBold' | 'MediaPlayBackward' | 'VideoCameraOff' | 'VideoCamera' | 'MediaPlayForward' | 'MediaNext' | 'MediaPause' | 'MediaPlay' | 'MediaPrevious' | 'MediaReplay' | 'MediaStop' | 'ComputerScreen' | 'LaptopComputer' | 'Gamepad' | 'Phone' | 'SmartTv' | 'Tablet' | 'Watch' | 'SizeDown' | 'SizeUp' | 'Deposit' | 'ArrowCaretDown' | 'Exchange' | 'Receive' | 'Send' | 'Transfer' | 'ArrowCaretUp' | 'Withdraw' | 'ArrowDownRounded' | 'ArrowLeftRounded' | 'ArrowRightRounded' | 'ArrowUpRounded' | 'Bell' | 'BatteryCharging' | 'MagnifyingGlassRounded' | 'MagnifyingGlass' | 'SoundMute' | 'BatteryFull' | 'HideEye' | 'VolumeHigh' | 'VolumeLess' | 'BatteryLow' | 'VolumeLow' | 'BatteryMedium' | 'ZoomOut' | 'BellOn' | 'VolumePlus' | 'ZoomIn' | 'VolumeMute' | 'ViewEye' | 'BangkStable' | 'Btc' | 'BasketCart' | 'Trash' | 'Bluetooth' | 'Book' | 'Calendar' | 'ForbiddenSign' | 'CardContactless' | 'Card' | 'Chart3lines' | 'Chart2lines' | 'CheckMark' | 'Clock' | 'Cloud' | 'HomeWithWindow' | 'Compass' | 'NoContactless' | 'Contactless' | 'CrossCircle' | 'CrossTriangle' | 'CubeProject' | 'Diamond' | 'Discussion' | 'DollarRounded' | 'ThreeDotsHorizontalRounded' | 'ThreeDotsVerticalRounded' | 'ThreeDotsHorizontal' | 'ThreeDotsVertical' | 'DueDateCalendar' | 'Energy' | 'EnergyOff' | 'EuroRounded' | 'ExclamationMarkRounded' | 'ExclamationMarkTriangle' | 'TimeExpired' | 'BookmarkOk' | 'RemoveBookmark' | 'File' | 'Fingerprint' | 'Flag' | 'Folder' | 'FolderOpen' | 'Food' | 'Gallery' | 'Gold' | 'Earth' | 'HeartSlash' | 'Settings2fadersHorizontal' | 'Settings3fadersHorizontal' | 'HourGlass' | 'HomeWithTwoLines' | 'InstitutionIban' | 'IdCard' | 'InfoRounded' | 'PlantInvest' | 'BurgerMenuHorizontal' | 'ListView' | 'LockClosed' | 'LockOpen' | 'Mail' | 'MailModify' | 'MailSending' | 'MailMap' | 'MicrophoneOff' | 'MicrophoneOn' | 'Pencil' | 'Moon' | 'MusicNote' | 'MusicNote2' | 'NewChecked' | 'LightBulbOff' | 'LightBulb' | 'UserProfile' | 'OnlinePaymentWallet' | 'OperationArrowUpDown' | 'Cog' | 'Payment' | 'Phone' | 'PhoneOff' | 'PhoneRinging' | 'Camera' | 'PieChart' | 'MapMarker' | 'MapMarkerChecked' | 'MapMarkerOff' | 'UserProfileRounded' | 'PuzzlePiece' | 'QuestionMarkRounded' | 'Rocket' | 'SmsSpeechBaloon' | 'Bookmark' | 'Savings' | 'SecurityKeyRounded' | 'SendMsg' | 'SendMsgUp' | 'ProfileSetting' | 'ShareVia' | 'Sheet' | 'ShieldKeyHole' | 'SmartContract' | 'HomeNetwork' | 'Snow' | 'Layers' | 'FourSquareTiles' | 'Star' | 'StarSlash' | 'Sun' | 'Tag' | 'Target' | 'Telescope' | 'PeopleGroupThree' | 'ThumbDown' | 'ThumbUp' | 'Timer' | 'PeopleGroupTwo' | 'Vault' | 'Settings3fadersVertical' | 'Volatility' | 'WorldWww' | 'WalletInvest' | 'Wallet' | 'WaterDrop' | 'Wifi' | 'WithdrawAtm' | 'World' | 'At' | 'Download' | 'DoorExit' | 'Attachement' | 'Cross' | 'ExternalLink' | 'Hashtag' | 'LinkJoint' | 'LinkJoin2' | 'Minus' | 'Next' | 'Plus' | 'Previous' | 'Check'
        'key': TranslationObj
        'value': TranslationObj
    }>
    'exitHorizon': number
    'cashbackPeriod': 'monthly' | 'quarterly' | 'halfly' | 'yearly'
    'interestDates': Array<Date>
    'interestPaymentStartDate': Date
    'interestPaymentEndDate': Date
    'investmentType'?: 'bond'
    'developmentStage': TranslationObj
    'location'?: Required<{
        'country': TranslationObj
        'city': TranslationObj
        'zone': TranslationObj
    }>
    '_id'?: string
    'creationDate'?: Date
    'lastUpdateDate'?: Date
    'lastUpdater'?: string
}

export interface InvestmentProjectBondsModels {
    Write: InvestmentProjectBondsWrite
    Read: InvestmentProjectBonds
}

export type InvestmentProjectEquity = {
    'tokenId': string
    'denomination': TranslationObj
    'wallet': Wallet
    'administrators'?: Array<string | User>
    'baseCurrency': 'eur' | 'usd' | 'thb' | 'jpy' | 'inr' | 'cny' | 'try' | 'mxn' | 'gbp' | 'chf' | 'rub' | 'pln' | 'dkk' | 'ils' | 'sek' | 'ars' | 'php' | 'brl' | 'cad' | 'krw' | 'nok' | 'sgd' | 'huf' | 'uah' | 'aud' | 'zar' | 'myr' | 'idr' | 'hkd' | 'nzd' | 'aed'
    'sharePrice': number
    'company': Company
    'targetInterestRatePerYear': number
    'riskScore': 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7
    'collectedAmount': number
    'individualInvestors': number
    'coverImage': string
    'presentationVideoUrl'?: string
    'tags': Array<string | Tag>
    'shortDescription': TranslationObj
    'descriptionSections'?: Array<Required<{
        'type': 'title' | 'paragraph'
        'content': TranslationObj
    }> | Required<{
        'type': 'gallery'
        'content': Array<string>
    }>>
    'news'?: Array<string | News>
    'taxAdvantage': TranslationObj
    'legalAnalysisInfos': Array<{
        'key': TranslationObj
        'value': TranslationObj
    }>
    'financialAnalysisInfos': Array<{
        'key': TranslationObj
        'value': TranslationObj
    }>
    'externalLinks': Array<{
        'label': 'smartContract' | 'detailedPresentation' | 'ESG' | 'financialAudit' | 'legalAudit' | 'keyInfos' | 'fundRules' | 'website' | 'other'
        'href': string
    }>
    'fundRaisingStartDate': Date
    'fundRaisingEndDate': Date
    'fundRaisingTarget': number
    'fundRaisingMinTarget': number
    'fundRaisingMaxTarget': number
    'impactInfos': Array<{
        'icon': 'ChevronDown' | 'DragAndDrop' | 'ChevronLeft' | 'ChevronLeftRight' | 'ChevronRight' | 'ChevronUp' | 'ChevronUpDown' | 'MinusRounded' | 'PlusRounded' | 'MediaPlayBackwardBold' | 'VideoCameraOffBold' | 'VideoCameraBold' | 'MediaPlayForwardBold' | 'MediaNextBold' | 'MediaPauseBold' | 'MediaPlayBold' | 'MediaPreviousBold' | 'MediaReplayBold' | 'MediaStopBold' | 'ComputerScreenBold' | 'LaptopComputerBold' | 'GamepadBold' | 'PhoneBold' | 'SmartTvBold' | 'TabletBold' | 'WatchBold' | 'SizeDownBold' | 'SizeUpBold' | 'DepositBold' | 'ArrowCaretDownBold' | 'ExchangeBold' | 'ReceiveBold' | 'SendBold' | 'TransferBold' | 'ArrowCaretUpBold' | 'WithdrawBold' | 'ArrowDownRoundedBold' | 'ArrowLeftRoundedBold' | 'ArrowRightRoundedBold' | 'ArrowUpRoundedBold' | 'BellBold' | 'BatteryChargingBold' | 'MagnifyingGlassRoundedBold' | 'MagnifyingGlassBold' | 'SoundMuteBold' | 'BatteryFullBold' | 'HideEyeBold' | 'VolumeHighBold' | 'VolumeLessBold' | 'BatteryLowBold' | 'VolumeLowBold' | 'BatteryMediumBold' | 'ZoomOutBold' | 'BellOnBold' | 'VolumePlusBold' | 'ZoomInBold' | 'VolumeMuteBold' | 'ViewEyeBold' | 'BangkStableBold' | 'BtcBold' | 'BasketCartBold' | 'TrashBold' | 'BluetoothBold' | 'BookBold' | 'CalendarBold' | 'ForbiddenSignBold' | 'CardContactlessBold' | 'CardBold' | 'Chart3linesBold' | 'Chart2linesBold' | 'CheckMarkBold' | 'ClockBold' | 'CloudBold' | 'HomeWithWindowBold' | 'CompassBold' | 'NoContactlessBold' | 'ContactlessBold' | 'CrossCircleBold' | 'CrowwTriangleBold' | 'CubeProjectBold' | 'DiamondBold' | 'DiscussionBold' | 'DollarRoundedBold' | 'ThreeDotsHorizontalRoundedBold' | 'ThreeDotsVerticalRoundedBold' | 'DueDateCalendar' | 'EnergyBold' | 'EnergyOffBold' | 'EuroRoundedBold' | 'ExclamationMarkRoundedBold' | 'ExclamationMarkTriangleBold' | 'TimeExpiredBold' | 'BookmarkOkBold' | 'RemoveBookmarkBold' | 'FileBold' | 'FlagBold' | 'FolderBold' | 'FolderOpenBold' | 'FoodBold' | 'GalleryBold' | 'GoldBold' | 'EarthBold' | 'HeartSlashBold' | 'Settings2fadersHorizontalBold' | 'Settings3fadersHorizontalBold' | 'HourGlassBold' | 'HomeWithTwoLinesBold' | 'InstitutionIbanBold' | 'IdCardBold' | 'InfoRoundedBold' | 'PlantInvestBold' | 'ListViewBold' | 'LockClosedBold' | 'LockOpenBold' | 'MailBold' | 'MailModifyBold' | 'MailSendingBold' | 'MailMapBold' | 'MicrophoneOffBold' | 'MicrophoneOnBold' | 'PencilBold' | 'MoonBold' | 'MusicNoteBold' | 'MusicNote2bold' | 'NewCheckedBold' | 'LightBulbOffBold' | 'LightBulbBold' | 'UserProfileBold' | 'OnlinePaymentWalletBold' | 'OperationArrowUpDownBold' | 'CogBold' | 'PaymentBold' | 'PhoneBold' | 'PhoneOffBold' | 'PhoneRingingBold' | 'CameraBold' | 'PieChartBold' | 'MapMarkerBold' | 'MapMarkerCheckedBold' | 'MapMarkerOffBold' | 'UserProfileRoundedBold' | 'PuzzlePieceBold' | 'QuestionMarkRoundedBold' | 'RocketBold' | 'SmsSpeechBaloonBold' | 'BookmarkBold' | 'SavingsBold' | 'SecurityKeyRoundedBold' | 'SendMsgBold' | 'SendMsgUpBold' | 'ProfileSettingBold' | 'ShareViaBold' | 'SheetBold' | 'ShieldKeyHoleBold' | 'SmartContractBold' | 'HomeNetworkBold' | 'SnowBold' | 'LayersBold' | 'FourSquareTilesBold' | 'StarBold' | 'StarSlashBold' | 'SunBold' | 'TagBold' | 'TargetBold' | 'TelescopeBold' | 'PeopleGroupThreeBold' | 'ThumbDownBold' | 'ThumbUpBold' | 'TimerBold' | 'PeopleGroupTwoBold' | 'VaultBold' | 'Settings3fadersVerticalBold' | 'VolatilityBold' | 'WorldWwwBold' | 'WalletInvestBold' | 'WalletBold' | 'WaterDropBold' | 'WifiBold' | 'WithdrawAtmBold' | 'WorldBold' | 'AtBold' | 'DownloadBold' | 'DoorExitBold' | 'MinusRoundedBold' | 'PlusRoundedBold' | 'MediaPlayBackward' | 'VideoCameraOff' | 'VideoCamera' | 'MediaPlayForward' | 'MediaNext' | 'MediaPause' | 'MediaPlay' | 'MediaPrevious' | 'MediaReplay' | 'MediaStop' | 'ComputerScreen' | 'LaptopComputer' | 'Gamepad' | 'Phone' | 'SmartTv' | 'Tablet' | 'Watch' | 'SizeDown' | 'SizeUp' | 'Deposit' | 'ArrowCaretDown' | 'Exchange' | 'Receive' | 'Send' | 'Transfer' | 'ArrowCaretUp' | 'Withdraw' | 'ArrowDownRounded' | 'ArrowLeftRounded' | 'ArrowRightRounded' | 'ArrowUpRounded' | 'Bell' | 'BatteryCharging' | 'MagnifyingGlassRounded' | 'MagnifyingGlass' | 'SoundMute' | 'BatteryFull' | 'HideEye' | 'VolumeHigh' | 'VolumeLess' | 'BatteryLow' | 'VolumeLow' | 'BatteryMedium' | 'ZoomOut' | 'BellOn' | 'VolumePlus' | 'ZoomIn' | 'VolumeMute' | 'ViewEye' | 'BangkStable' | 'Btc' | 'BasketCart' | 'Trash' | 'Bluetooth' | 'Book' | 'Calendar' | 'ForbiddenSign' | 'CardContactless' | 'Card' | 'Chart3lines' | 'Chart2lines' | 'CheckMark' | 'Clock' | 'Cloud' | 'HomeWithWindow' | 'Compass' | 'NoContactless' | 'Contactless' | 'CrossCircle' | 'CrossTriangle' | 'CubeProject' | 'Diamond' | 'Discussion' | 'DollarRounded' | 'ThreeDotsHorizontalRounded' | 'ThreeDotsVerticalRounded' | 'ThreeDotsHorizontal' | 'ThreeDotsVertical' | 'DueDateCalendar' | 'Energy' | 'EnergyOff' | 'EuroRounded' | 'ExclamationMarkRounded' | 'ExclamationMarkTriangle' | 'TimeExpired' | 'BookmarkOk' | 'RemoveBookmark' | 'File' | 'Fingerprint' | 'Flag' | 'Folder' | 'FolderOpen' | 'Food' | 'Gallery' | 'Gold' | 'Earth' | 'HeartSlash' | 'Settings2fadersHorizontal' | 'Settings3fadersHorizontal' | 'HourGlass' | 'HomeWithTwoLines' | 'InstitutionIban' | 'IdCard' | 'InfoRounded' | 'PlantInvest' | 'BurgerMenuHorizontal' | 'ListView' | 'LockClosed' | 'LockOpen' | 'Mail' | 'MailModify' | 'MailSending' | 'MailMap' | 'MicrophoneOff' | 'MicrophoneOn' | 'Pencil' | 'Moon' | 'MusicNote' | 'MusicNote2' | 'NewChecked' | 'LightBulbOff' | 'LightBulb' | 'UserProfile' | 'OnlinePaymentWallet' | 'OperationArrowUpDown' | 'Cog' | 'Payment' | 'Phone' | 'PhoneOff' | 'PhoneRinging' | 'Camera' | 'PieChart' | 'MapMarker' | 'MapMarkerChecked' | 'MapMarkerOff' | 'UserProfileRounded' | 'PuzzlePiece' | 'QuestionMarkRounded' | 'Rocket' | 'SmsSpeechBaloon' | 'Bookmark' | 'Savings' | 'SecurityKeyRounded' | 'SendMsg' | 'SendMsgUp' | 'ProfileSetting' | 'ShareVia' | 'Sheet' | 'ShieldKeyHole' | 'SmartContract' | 'HomeNetwork' | 'Snow' | 'Layers' | 'FourSquareTiles' | 'Star' | 'StarSlash' | 'Sun' | 'Tag' | 'Target' | 'Telescope' | 'PeopleGroupThree' | 'ThumbDown' | 'ThumbUp' | 'Timer' | 'PeopleGroupTwo' | 'Vault' | 'Settings3fadersVertical' | 'Volatility' | 'WorldWww' | 'WalletInvest' | 'Wallet' | 'WaterDrop' | 'Wifi' | 'WithdrawAtm' | 'World' | 'At' | 'Download' | 'DoorExit' | 'Attachement' | 'Cross' | 'ExternalLink' | 'Hashtag' | 'LinkJoint' | 'LinkJoin2' | 'Minus' | 'Next' | 'Plus' | 'Previous' | 'Check'
        'key': TranslationObj
        'value': TranslationObj
    }>
    'investmentType': 'equity'
    '_id': string
    'creationDate': Date
    'lastUpdateDate'?: Date
    'lastUpdater': string | User
}

export type InvestmentProjectEquityWrite = {
    'tokenId': string
    'denomination': TranslationObj
    'wallet': string
    'administrators'?: Array<string>
    'baseCurrency'?: 'eur' | 'usd' | 'thb' | 'jpy' | 'inr' | 'cny' | 'try' | 'mxn' | 'gbp' | 'chf' | 'rub' | 'pln' | 'dkk' | 'ils' | 'sek' | 'ars' | 'php' | 'brl' | 'cad' | 'krw' | 'nok' | 'sgd' | 'huf' | 'uah' | 'aud' | 'zar' | 'myr' | 'idr' | 'hkd' | 'nzd' | 'aed'
    'sharePrice': number
    'company': string
    'targetInterestRatePerYear': number
    'riskScore': 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7
    'collectedAmount'?: number
    'individualInvestors'?: number
    'coverImage': string
    'presentationVideoUrl'?: string
    'tags': Array<string>
    'shortDescription': TranslationObj
    'descriptionSections'?: Array<Required<{
        'type': 'title' | 'paragraph'
        'content': TranslationObj
    }> | Required<{
        'type': 'gallery'
        'content': Array<string>
    }>>
    'news'?: Array<string>
    'taxAdvantage': TranslationObj
    'legalAnalysisInfos': Array<{
        'key': TranslationObj
        'value': TranslationObj
    }>
    'financialAnalysisInfos': Array<{
        'key': TranslationObj
        'value': TranslationObj
    }>
    'externalLinks': Array<{
        'label': 'smartContract' | 'detailedPresentation' | 'ESG' | 'financialAudit' | 'legalAudit' | 'keyInfos' | 'fundRules' | 'website' | 'other'
        'href': string
    }>
    'fundRaisingStartDate': Date
    'fundRaisingEndDate': Date
    'fundRaisingTarget': number
    'fundRaisingMinTarget': number
    'fundRaisingMaxTarget': number
    'impactInfos': Array<{
        'icon': 'ChevronDown' | 'DragAndDrop' | 'ChevronLeft' | 'ChevronLeftRight' | 'ChevronRight' | 'ChevronUp' | 'ChevronUpDown' | 'MinusRounded' | 'PlusRounded' | 'MediaPlayBackwardBold' | 'VideoCameraOffBold' | 'VideoCameraBold' | 'MediaPlayForwardBold' | 'MediaNextBold' | 'MediaPauseBold' | 'MediaPlayBold' | 'MediaPreviousBold' | 'MediaReplayBold' | 'MediaStopBold' | 'ComputerScreenBold' | 'LaptopComputerBold' | 'GamepadBold' | 'PhoneBold' | 'SmartTvBold' | 'TabletBold' | 'WatchBold' | 'SizeDownBold' | 'SizeUpBold' | 'DepositBold' | 'ArrowCaretDownBold' | 'ExchangeBold' | 'ReceiveBold' | 'SendBold' | 'TransferBold' | 'ArrowCaretUpBold' | 'WithdrawBold' | 'ArrowDownRoundedBold' | 'ArrowLeftRoundedBold' | 'ArrowRightRoundedBold' | 'ArrowUpRoundedBold' | 'BellBold' | 'BatteryChargingBold' | 'MagnifyingGlassRoundedBold' | 'MagnifyingGlassBold' | 'SoundMuteBold' | 'BatteryFullBold' | 'HideEyeBold' | 'VolumeHighBold' | 'VolumeLessBold' | 'BatteryLowBold' | 'VolumeLowBold' | 'BatteryMediumBold' | 'ZoomOutBold' | 'BellOnBold' | 'VolumePlusBold' | 'ZoomInBold' | 'VolumeMuteBold' | 'ViewEyeBold' | 'BangkStableBold' | 'BtcBold' | 'BasketCartBold' | 'TrashBold' | 'BluetoothBold' | 'BookBold' | 'CalendarBold' | 'ForbiddenSignBold' | 'CardContactlessBold' | 'CardBold' | 'Chart3linesBold' | 'Chart2linesBold' | 'CheckMarkBold' | 'ClockBold' | 'CloudBold' | 'HomeWithWindowBold' | 'CompassBold' | 'NoContactlessBold' | 'ContactlessBold' | 'CrossCircleBold' | 'CrowwTriangleBold' | 'CubeProjectBold' | 'DiamondBold' | 'DiscussionBold' | 'DollarRoundedBold' | 'ThreeDotsHorizontalRoundedBold' | 'ThreeDotsVerticalRoundedBold' | 'DueDateCalendar' | 'EnergyBold' | 'EnergyOffBold' | 'EuroRoundedBold' | 'ExclamationMarkRoundedBold' | 'ExclamationMarkTriangleBold' | 'TimeExpiredBold' | 'BookmarkOkBold' | 'RemoveBookmarkBold' | 'FileBold' | 'FlagBold' | 'FolderBold' | 'FolderOpenBold' | 'FoodBold' | 'GalleryBold' | 'GoldBold' | 'EarthBold' | 'HeartSlashBold' | 'Settings2fadersHorizontalBold' | 'Settings3fadersHorizontalBold' | 'HourGlassBold' | 'HomeWithTwoLinesBold' | 'InstitutionIbanBold' | 'IdCardBold' | 'InfoRoundedBold' | 'PlantInvestBold' | 'ListViewBold' | 'LockClosedBold' | 'LockOpenBold' | 'MailBold' | 'MailModifyBold' | 'MailSendingBold' | 'MailMapBold' | 'MicrophoneOffBold' | 'MicrophoneOnBold' | 'PencilBold' | 'MoonBold' | 'MusicNoteBold' | 'MusicNote2bold' | 'NewCheckedBold' | 'LightBulbOffBold' | 'LightBulbBold' | 'UserProfileBold' | 'OnlinePaymentWalletBold' | 'OperationArrowUpDownBold' | 'CogBold' | 'PaymentBold' | 'PhoneBold' | 'PhoneOffBold' | 'PhoneRingingBold' | 'CameraBold' | 'PieChartBold' | 'MapMarkerBold' | 'MapMarkerCheckedBold' | 'MapMarkerOffBold' | 'UserProfileRoundedBold' | 'PuzzlePieceBold' | 'QuestionMarkRoundedBold' | 'RocketBold' | 'SmsSpeechBaloonBold' | 'BookmarkBold' | 'SavingsBold' | 'SecurityKeyRoundedBold' | 'SendMsgBold' | 'SendMsgUpBold' | 'ProfileSettingBold' | 'ShareViaBold' | 'SheetBold' | 'ShieldKeyHoleBold' | 'SmartContractBold' | 'HomeNetworkBold' | 'SnowBold' | 'LayersBold' | 'FourSquareTilesBold' | 'StarBold' | 'StarSlashBold' | 'SunBold' | 'TagBold' | 'TargetBold' | 'TelescopeBold' | 'PeopleGroupThreeBold' | 'ThumbDownBold' | 'ThumbUpBold' | 'TimerBold' | 'PeopleGroupTwoBold' | 'VaultBold' | 'Settings3fadersVerticalBold' | 'VolatilityBold' | 'WorldWwwBold' | 'WalletInvestBold' | 'WalletBold' | 'WaterDropBold' | 'WifiBold' | 'WithdrawAtmBold' | 'WorldBold' | 'AtBold' | 'DownloadBold' | 'DoorExitBold' | 'MinusRoundedBold' | 'PlusRoundedBold' | 'MediaPlayBackward' | 'VideoCameraOff' | 'VideoCamera' | 'MediaPlayForward' | 'MediaNext' | 'MediaPause' | 'MediaPlay' | 'MediaPrevious' | 'MediaReplay' | 'MediaStop' | 'ComputerScreen' | 'LaptopComputer' | 'Gamepad' | 'Phone' | 'SmartTv' | 'Tablet' | 'Watch' | 'SizeDown' | 'SizeUp' | 'Deposit' | 'ArrowCaretDown' | 'Exchange' | 'Receive' | 'Send' | 'Transfer' | 'ArrowCaretUp' | 'Withdraw' | 'ArrowDownRounded' | 'ArrowLeftRounded' | 'ArrowRightRounded' | 'ArrowUpRounded' | 'Bell' | 'BatteryCharging' | 'MagnifyingGlassRounded' | 'MagnifyingGlass' | 'SoundMute' | 'BatteryFull' | 'HideEye' | 'VolumeHigh' | 'VolumeLess' | 'BatteryLow' | 'VolumeLow' | 'BatteryMedium' | 'ZoomOut' | 'BellOn' | 'VolumePlus' | 'ZoomIn' | 'VolumeMute' | 'ViewEye' | 'BangkStable' | 'Btc' | 'BasketCart' | 'Trash' | 'Bluetooth' | 'Book' | 'Calendar' | 'ForbiddenSign' | 'CardContactless' | 'Card' | 'Chart3lines' | 'Chart2lines' | 'CheckMark' | 'Clock' | 'Cloud' | 'HomeWithWindow' | 'Compass' | 'NoContactless' | 'Contactless' | 'CrossCircle' | 'CrossTriangle' | 'CubeProject' | 'Diamond' | 'Discussion' | 'DollarRounded' | 'ThreeDotsHorizontalRounded' | 'ThreeDotsVerticalRounded' | 'ThreeDotsHorizontal' | 'ThreeDotsVertical' | 'DueDateCalendar' | 'Energy' | 'EnergyOff' | 'EuroRounded' | 'ExclamationMarkRounded' | 'ExclamationMarkTriangle' | 'TimeExpired' | 'BookmarkOk' | 'RemoveBookmark' | 'File' | 'Fingerprint' | 'Flag' | 'Folder' | 'FolderOpen' | 'Food' | 'Gallery' | 'Gold' | 'Earth' | 'HeartSlash' | 'Settings2fadersHorizontal' | 'Settings3fadersHorizontal' | 'HourGlass' | 'HomeWithTwoLines' | 'InstitutionIban' | 'IdCard' | 'InfoRounded' | 'PlantInvest' | 'BurgerMenuHorizontal' | 'ListView' | 'LockClosed' | 'LockOpen' | 'Mail' | 'MailModify' | 'MailSending' | 'MailMap' | 'MicrophoneOff' | 'MicrophoneOn' | 'Pencil' | 'Moon' | 'MusicNote' | 'MusicNote2' | 'NewChecked' | 'LightBulbOff' | 'LightBulb' | 'UserProfile' | 'OnlinePaymentWallet' | 'OperationArrowUpDown' | 'Cog' | 'Payment' | 'Phone' | 'PhoneOff' | 'PhoneRinging' | 'Camera' | 'PieChart' | 'MapMarker' | 'MapMarkerChecked' | 'MapMarkerOff' | 'UserProfileRounded' | 'PuzzlePiece' | 'QuestionMarkRounded' | 'Rocket' | 'SmsSpeechBaloon' | 'Bookmark' | 'Savings' | 'SecurityKeyRounded' | 'SendMsg' | 'SendMsgUp' | 'ProfileSetting' | 'ShareVia' | 'Sheet' | 'ShieldKeyHole' | 'SmartContract' | 'HomeNetwork' | 'Snow' | 'Layers' | 'FourSquareTiles' | 'Star' | 'StarSlash' | 'Sun' | 'Tag' | 'Target' | 'Telescope' | 'PeopleGroupThree' | 'ThumbDown' | 'ThumbUp' | 'Timer' | 'PeopleGroupTwo' | 'Vault' | 'Settings3fadersVertical' | 'Volatility' | 'WorldWww' | 'WalletInvest' | 'Wallet' | 'WaterDrop' | 'Wifi' | 'WithdrawAtm' | 'World' | 'At' | 'Download' | 'DoorExit' | 'Attachement' | 'Cross' | 'ExternalLink' | 'Hashtag' | 'LinkJoint' | 'LinkJoin2' | 'Minus' | 'Next' | 'Plus' | 'Previous' | 'Check'
        'key': TranslationObj
        'value': TranslationObj
    }>
    'investmentType'?: 'equity'
    '_id'?: string
    'creationDate'?: Date
    'lastUpdateDate'?: Date
    'lastUpdater'?: string
}

export interface InvestmentProjectEquityModels {
    Write: InvestmentProjectEquityWrite
    Read: InvestmentProjectEquity
}

export type InvestmentProjectFundShares = {
    'tokenId': string
    'denomination': TranslationObj
    'wallet': Wallet
    'administrators'?: Array<string | User>
    'baseCurrency': 'eur' | 'usd' | 'thb' | 'jpy' | 'inr' | 'cny' | 'try' | 'mxn' | 'gbp' | 'chf' | 'rub' | 'pln' | 'dkk' | 'ils' | 'sek' | 'ars' | 'php' | 'brl' | 'cad' | 'krw' | 'nok' | 'sgd' | 'huf' | 'uah' | 'aud' | 'zar' | 'myr' | 'idr' | 'hkd' | 'nzd' | 'aed'
    'sharePrice': number
    'company': Company
    'targetInterestRatePerYear': number
    'riskScore': 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7
    'collectedAmount': number
    'individualInvestors': number
    'coverImage': string
    'presentationVideoUrl'?: string
    'tags': Array<string | Tag>
    'shortDescription': TranslationObj
    'descriptionSections'?: Array<Required<{
        'type': 'title' | 'paragraph'
        'content': TranslationObj
    }> | Required<{
        'type': 'gallery'
        'content': Array<string>
    }>>
    'news'?: Array<string | News>
    'taxAdvantage': TranslationObj
    'legalAnalysisInfos': Array<{
        'key': TranslationObj
        'value': TranslationObj
    }>
    'financialAnalysisInfos': Array<{
        'key': TranslationObj
        'value': TranslationObj
    }>
    'externalLinks': Array<{
        'label': 'smartContract' | 'detailedPresentation' | 'ESG' | 'financialAudit' | 'legalAudit' | 'keyInfos' | 'fundRules' | 'website' | 'other'
        'href': string
    }>
    'fundRaisingStartDate': Date
    'fundRaisingEndDate': Date
    'exitHorizon': number
    'cashbackPeriod': 'monthly' | 'quarterly' | 'halfly' | 'yearly'
    'interestDates': Array<Date>
    'interestPaymentStartDate': Date
    'interestPaymentEndDate': Date
    'investmentType': 'fundShares'
    'capitalizationD1': number
    'creationDate': Date
    'activityZone': TranslationObj
    'relatedFundedProject'?: Array<{
        'name': TranslationObj
        'coverImage': string
        'href': string
    }>
    '_id': string
    'lastUpdateDate'?: Date
    'lastUpdater': string | User
}

export type InvestmentProjectFundSharesWrite = {
    'tokenId': string
    'denomination': TranslationObj
    'wallet': string
    'administrators'?: Array<string>
    'baseCurrency'?: 'eur' | 'usd' | 'thb' | 'jpy' | 'inr' | 'cny' | 'try' | 'mxn' | 'gbp' | 'chf' | 'rub' | 'pln' | 'dkk' | 'ils' | 'sek' | 'ars' | 'php' | 'brl' | 'cad' | 'krw' | 'nok' | 'sgd' | 'huf' | 'uah' | 'aud' | 'zar' | 'myr' | 'idr' | 'hkd' | 'nzd' | 'aed'
    'sharePrice': number
    'company': string
    'targetInterestRatePerYear': number
    'riskScore': 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7
    'collectedAmount'?: number
    'individualInvestors'?: number
    'coverImage': string
    'presentationVideoUrl'?: string
    'tags': Array<string>
    'shortDescription': TranslationObj
    'descriptionSections'?: Array<Required<{
        'type': 'title' | 'paragraph'
        'content': TranslationObj
    }> | Required<{
        'type': 'gallery'
        'content': Array<string>
    }>>
    'news'?: Array<string>
    'taxAdvantage': TranslationObj
    'legalAnalysisInfos': Array<{
        'key': TranslationObj
        'value': TranslationObj
    }>
    'financialAnalysisInfos': Array<{
        'key': TranslationObj
        'value': TranslationObj
    }>
    'externalLinks': Array<{
        'label': 'smartContract' | 'detailedPresentation' | 'ESG' | 'financialAudit' | 'legalAudit' | 'keyInfos' | 'fundRules' | 'website' | 'other'
        'href': string
    }>
    'fundRaisingStartDate': Date
    'fundRaisingEndDate': Date
    'exitHorizon': number
    'cashbackPeriod': 'monthly' | 'quarterly' | 'halfly' | 'yearly'
    'interestDates': Array<Date>
    'interestPaymentStartDate': Date
    'interestPaymentEndDate': Date
    'investmentType'?: 'fundShares'
    'capitalizationD1': number
    'creationDate'?: Date
    'activityZone': TranslationObj
    'relatedFundedProject'?: Array<{
        'name': TranslationObj
        'coverImage': string
        'href': string
    }>
    '_id'?: string
    'lastUpdateDate'?: Date
    'lastUpdater'?: string
}

export interface InvestmentProjectFundSharesModels {
    Write: InvestmentProjectFundSharesWrite
    Read: InvestmentProjectFundShares
}

export type InvestmentTransactionBonds = {
    'investmentType': 'bond'
    'user': string | User
    'investment': string | InvestmentBonds
    'investmentProject': string | InvestmentProjectBonds
    'sourceUser'?: string | User
    'sellOffer'?: string | SellOfferBonds
    'status': 'pending' | 'error' | 'success'
    'sourceWallet'?: string | Wallet
    'totalPriceInSourceCurrency': number
    'totalPriceInProjectCurrency': number
    'nbShares': number
    'exchangeRateMultiplier': number
    'exchangeFeesPercent': number
    'exchangeFeesAmountInSourceCurrency': number
    'blockchainTransactionHash'?: string
    '_id': string
    'creationDate': Date
    'lastUpdateDate'?: Date
    'lastUpdater': string | User
}

export type InvestmentTransactionBondsWrite = {
    'investmentType'?: 'bond'
    'user': string
    'investment': string
    'investmentProject': string
    'sourceUser'?: string
    'sellOffer'?: string
    'status'?: 'pending' | 'error' | 'success'
    'sourceWallet'?: string
    'totalPriceInSourceCurrency': number
    'totalPriceInProjectCurrency': number
    'nbShares': number
    'exchangeRateMultiplier': number
    'exchangeFeesPercent': number
    'exchangeFeesAmountInSourceCurrency': number
    'blockchainTransactionHash'?: string
    '_id'?: string
    'creationDate'?: Date
    'lastUpdateDate'?: Date
    'lastUpdater'?: string
}

export interface InvestmentTransactionBondsModels {
    Write: InvestmentTransactionBondsWrite
    Read: InvestmentTransactionBonds
}

export type InvestmentTransactionEquity = {
    'investmentType': 'equity'
    'user': string | User
    'investment': string | InvestmentEquity
    'investmentProject': string | InvestmentProjectEquity
    'sourceUser'?: string | User
    'sellOffer'?: string | SellOfferEquity
    'status': 'pending' | 'error' | 'success'
    'sourceWallet'?: string | Wallet
    'totalPriceInSourceCurrency': number
    'totalPriceInProjectCurrency': number
    'nbShares': number
    'exchangeRateMultiplier': number
    'exchangeFeesPercent': number
    'exchangeFeesAmountInSourceCurrency': number
    'blockchainTransactionHash'?: string
    '_id': string
    'creationDate': Date
    'lastUpdateDate'?: Date
    'lastUpdater': string | User
}

export type InvestmentTransactionEquityWrite = {
    'investmentType'?: 'equity'
    'user': string
    'investment': string
    'investmentProject': string
    'sourceUser'?: string
    'sellOffer'?: string
    'status'?: 'pending' | 'error' | 'success'
    'sourceWallet'?: string
    'totalPriceInSourceCurrency': number
    'totalPriceInProjectCurrency': number
    'nbShares': number
    'exchangeRateMultiplier': number
    'exchangeFeesPercent': number
    'exchangeFeesAmountInSourceCurrency': number
    'blockchainTransactionHash'?: string
    '_id'?: string
    'creationDate'?: Date
    'lastUpdateDate'?: Date
    'lastUpdater'?: string
}

export interface InvestmentTransactionEquityModels {
    Write: InvestmentTransactionEquityWrite
    Read: InvestmentTransactionEquity
}

export type InvestmentTransactionFundShares = {
    'investmentType': 'fundShares'
    'user': string | User
    'investment': string | InvestmentFundShares
    'investmentProject': string | InvestmentProjectFundShares
    'sourceUser'?: string | User
    'sellOffer'?: string | SellOfferFundShares
    'status': 'pending' | 'error' | 'success'
    'sourceWallet'?: string | Wallet
    'totalPriceInSourceCurrency': number
    'totalPriceInProjectCurrency': number
    'nbShares': number
    'exchangeRateMultiplier': number
    'exchangeFeesPercent': number
    'exchangeFeesAmountInSourceCurrency': number
    'blockchainTransactionHash'?: string
    '_id': string
    'creationDate': Date
    'lastUpdateDate'?: Date
    'lastUpdater': string | User
}

export type InvestmentTransactionFundSharesWrite = {
    'investmentType'?: 'fundShares'
    'user': string
    'investment': string
    'investmentProject': string
    'sourceUser'?: string
    'sellOffer'?: string
    'status'?: 'pending' | 'error' | 'success'
    'sourceWallet'?: string
    'totalPriceInSourceCurrency': number
    'totalPriceInProjectCurrency': number
    'nbShares': number
    'exchangeRateMultiplier': number
    'exchangeFeesPercent': number
    'exchangeFeesAmountInSourceCurrency': number
    'blockchainTransactionHash'?: string
    '_id'?: string
    'creationDate'?: Date
    'lastUpdateDate'?: Date
    'lastUpdater'?: string
}

export interface InvestmentTransactionFundSharesModels {
    Write: InvestmentTransactionFundSharesWrite
    Read: InvestmentTransactionFundShares
}

export type Mission = {
    'title': TranslationObj
    'description': TranslationObj
    'abTestingVersion': Array<string>
    'url': string
    'startBtnText'?: TranslationObj
    'bottomBarTitle'?: TranslationObj
    'bottomBarDescription'?: TranslationObj
    'bottomBarBtnTxt'?: TranslationObj
    'outroTitle'?: TranslationObj
    'outroDescription'?: TranslationObj
    'outroUrl'?: string
    '_id': string
}

export type MissionWrite = {
    'title': TranslationObj
    'description': TranslationObj
    'abTestingVersion': Array<string>
    'url': string
    'startBtnText'?: TranslationObj
    'bottomBarTitle'?: TranslationObj
    'bottomBarDescription'?: TranslationObj
    'bottomBarBtnTxt'?: TranslationObj
    'outroTitle'?: TranslationObj
    'outroDescription'?: TranslationObj
    'outroUrl'?: string
    '_id'?: string
}

export interface MissionModels {
    Write: MissionWrite
    Read: Mission
}

export type News = {
    'title': TranslationObj
    'tags'?: Array<string | Tag>
    'avatar': string
    'description': TranslationObj
    'info': TranslationObj
    'image': string
    'linkUrl'?: string
    '_id': string
    'creationDate': Date
    'creator': string | User
    'lastUpdateDate'?: Date
}

export type NewsWrite = {
    'title': TranslationObj
    'tags'?: Array<string>
    'avatar': string
    'description': TranslationObj
    'info': TranslationObj
    'image': string
    'linkUrl'?: string
    '_id'?: string
    'creationDate'?: Date
    'creator'?: string
    'lastUpdateDate'?: Date
}

export interface NewsModels {
    Write: NewsWrite
    Read: News
}

export type SellOfferBonds = {
    'investmentType': 'bond'
    'status': 'active' | 'inProgress' | 'finished' | 'expired'
    'investment': InvestmentBonds
    'investmentProject'?: InvestmentProjectBonds
    'pricePerShare': number
    'currency': 'bangkEuro' | 'bangkCoin' | 'tether' | 'bitcoin' | 'solana' | 'ethereum' | 'usd-coin' | 'binancecoin'
    'nbShares': number
    'transaction'?: string | InvestmentTransactionBonds
    'validUntil'?: Date
    '_id': string
    'creationDate': Date
    'creator': string | User
}

export type SellOfferBondsWrite = {
    'investmentType'?: 'bond'
    'status'?: 'active' | 'inProgress' | 'finished' | 'expired'
    'investment': string
    'investmentProject'?: string
    'pricePerShare': number
    'currency': 'bangkEuro' | 'bangkCoin' | 'tether' | 'bitcoin' | 'solana' | 'ethereum' | 'usd-coin' | 'binancecoin'
    'nbShares': number
    'transaction'?: string
    'validUntil'?: Date
    '_id'?: string
    'creationDate'?: Date
    'creator'?: string
}

export interface SellOfferBondsModels {
    Write: SellOfferBondsWrite
    Read: SellOfferBonds
}

export type SellOfferEquity = {
    'investmentType': 'equity'
    'status': 'active' | 'inProgress' | 'finished' | 'expired'
    'investment': InvestmentEquity
    'investmentProject'?: InvestmentProjectEquity
    'pricePerShare': number
    'currency': 'bangkEuro' | 'bangkCoin' | 'tether' | 'bitcoin' | 'solana' | 'ethereum' | 'usd-coin' | 'binancecoin'
    'nbShares': number
    'transaction'?: string | InvestmentTransactionEquity
    'validUntil'?: Date
    '_id': string
    'creationDate': Date
    'creator': string | User
}

export type SellOfferEquityWrite = {
    'investmentType'?: 'equity'
    'status'?: 'active' | 'inProgress' | 'finished' | 'expired'
    'investment': string
    'investmentProject'?: string
    'pricePerShare': number
    'currency': 'bangkEuro' | 'bangkCoin' | 'tether' | 'bitcoin' | 'solana' | 'ethereum' | 'usd-coin' | 'binancecoin'
    'nbShares': number
    'transaction'?: string
    'validUntil'?: Date
    '_id'?: string
    'creationDate'?: Date
    'creator'?: string
}

export interface SellOfferEquityModels {
    Write: SellOfferEquityWrite
    Read: SellOfferEquity
}

export type SellOfferFundShares = {
    'investmentType': 'fundShares'
    'status': 'active' | 'inProgress' | 'finished' | 'expired'
    'investment': InvestmentFundShares
    'investmentProject'?: InvestmentProjectFundShares
    'pricePerShare': number
    'currency': 'bangkEuro' | 'bangkCoin' | 'tether' | 'bitcoin' | 'solana' | 'ethereum' | 'usd-coin' | 'binancecoin'
    'nbShares': number
    'transaction'?: string | InvestmentTransactionFundShares
    'validUntil'?: Date
    '_id': string
    'creationDate': Date
    'creator': string | User
}

export type SellOfferFundSharesWrite = {
    'investmentType'?: 'fundShares'
    'status'?: 'active' | 'inProgress' | 'finished' | 'expired'
    'investment': string
    'investmentProject'?: string
    'pricePerShare': number
    'currency': 'bangkEuro' | 'bangkCoin' | 'tether' | 'bitcoin' | 'solana' | 'ethereum' | 'usd-coin' | 'binancecoin'
    'nbShares': number
    'transaction'?: string
    'validUntil'?: Date
    '_id'?: string
    'creationDate'?: Date
    'creator'?: string
}

export interface SellOfferFundSharesModels {
    Write: SellOfferFundSharesWrite
    Read: SellOfferFundShares
}

export type ServerBlacklist = {
    'discriminator'?: string
    'lockUntil'?: Date
    'nbWarning': number
    'nbBan': number
    '_id': string
    'creationDate': Date
    'lastUpdateDate'?: Date
}

export type ServerBlacklistWrite = {
    'discriminator'?: string
    'lockUntil'?: Date
    'nbWarning'?: number
    'nbBan'?: number
    '_id'?: string
    'creationDate'?: Date
    'lastUpdateDate'?: Date
}

export interface ServerBlacklistModels {
    Write: ServerBlacklistWrite
    Read: ServerBlacklist
}

export type SupportMessages = {
    'msg'?: string
    'topic'?: string
    'deviceId'?: string | Device
    'errorId'?: string | UnexpectedError
    '_id': string
    'creationDate': Date
    'creator': string | User
}

export type SupportMessagesWrite = {
    'msg'?: string
    'topic'?: string
    'deviceId'?: string
    'errorId'?: string
    '_id'?: string
    'creationDate'?: Date
    'creator'?: string
}

export interface SupportMessagesModels {
    Write: SupportMessagesWrite
    Read: SupportMessages
}

export type Tag = {
    'label': TranslationObj
}

export type TagWrite = {
    'label': TranslationObj
}

export interface TagModels {
    Write: TagWrite
    Read: Tag
}

export type TrackingDataEvents = {
    'type': 'press' | 'click' | 'sessionEnd' | 'pageLeft' | 'pageReturn' | 'navigate' | 'componentVisible' | 'componentHidden' | 'error' | 'sessionStart'
    'project': string
    'session': string
    'ts': number
    'screen'?: string
    'data'?: {
        [key: string]: any
    }
    'device'?: string | Device
    'error'?: string | UnexpectedError
    '_id': string
    'creator': string | User
}

export type TrackingDataEventsWrite = {
    'type': 'press' | 'click' | 'sessionEnd' | 'pageLeft' | 'pageReturn' | 'navigate' | 'componentVisible' | 'componentHidden' | 'error' | 'sessionStart'
    'project': string
    'session': string
    'ts': number
    'screen'?: string
    'data'?: {
        [key: string]: any
    }
    'device'?: string
    'error'?: string
    '_id'?: string
    'creator'?: string
}

export interface TrackingDataEventsModels {
    Write: TrackingDataEventsWrite
    Read: TrackingDataEvents
}

export type TrackingDataSession = {
    'sessionStart': number
    'sessionEnd'?: number
    'utmCampaign'?: string | UtmCampaign
    'device'?: string | Device
    '_id': string
    'creator': string | User
}

export type TrackingDataSessionWrite = {
    'sessionStart': number
    'sessionEnd'?: number
    'utmCampaign'?: string
    'device'?: string
    '_id'?: string
    'creator'?: string
}

export interface TrackingDataSessionModels {
    Write: TrackingDataSessionWrite
    Read: TrackingDataSession
}

export type UnexpectedError = {
    'status': 'unresolved' | 'inProgress' | 'resolved'
    'title'?: string
    'ipAddress'?: string
    'applicationVersion'?: string
    'extraInfos'?: string
    'stackTrace'?: string
    'deviceId'?: string | Device
    'deviceType'?: 'tablet' | 'mobile' | 'desktop' | 'unknown'
    '_id': string
    'creationDate': Date
    'creator': string | User
    'lastUpdateDate'?: Date
    'lastUpdater': string | User
}

export type UnexpectedErrorWrite = {
    'status'?: 'unresolved' | 'inProgress' | 'resolved'
    'title'?: string
    'ipAddress'?: string
    'applicationVersion'?: string
    'extraInfos'?: string
    'stackTrace'?: string
    'deviceId'?: string
    'deviceType'?: 'tablet' | 'mobile' | 'desktop' | 'unknown'
    '_id'?: string
    'creationDate'?: Date
    'creator'?: string
    'lastUpdateDate'?: Date
    'lastUpdater'?: string
}

export interface UnexpectedErrorModels {
    Write: UnexpectedErrorWrite
    Read: UnexpectedError
}

export type User = {
    'isEmailVerified': boolean
    'isPhoneVerified': boolean
    'hasPassedKyc': boolean
    'isLocked': boolean
    'hasAgreedWithTermsAndConditions': boolean
    'isDeleted': boolean
    'isCompanyRepresentative': boolean
    'isFinanceAdmin': boolean
    'isComplianceAdmin': boolean
    'isAppUser': boolean
    'isIcoInvestor': boolean
    'isBangkAdmin': boolean
    'phonePrefix'?: any
    'phoneWithPrefix'?: string
    'email'?: string
    'newEmail'?: string
    'password'?: string
    'validationTokens'?: Array<{
        'validUntil'?: Date
        'creationDate'?: Date
        'value'?: string
        'type'?: 'forgotPassword' | 'emailValidation' | 'changeEmail'
    }>
    'refreshTokens'?: Array<string>
    'accessTokens'?: Array<string>
    'lastPasswordCompareTime': Date
    'passwordRetrialNb': number
    'lockedReason'?: 'tooMuchPasswordAttempts' | 'ban' | 'tooManyAttempsForSecureAuthentication'
    'lockUntil'?: Date
    'deleteRequestStatus'?: 'sent' | 'processed'
    'pinCode'?: string
    'pinCodeRetrialNb': number
    'lastPincodeCompareTime': Date
    'biometricAuthToken'?: string
    'biometricAuthRetrialNb': number
    'lastBiometricCompareTime': Date
    '_2FAcode'?: string
    '_2FAretrialNb': number
    'last2FACompareTime': Date
    'kycStatus': 'required' | 'kycStarted' | 'canRetry' | 'pending' | 'declined' | 'success'
    'kycLastRequestDate'?: Date
    'kycUrl'?: string
    'isDuplicateAccount': boolean
    'kycReferences'?: Array<{
        'date': Date
        'reference': string
        'status': 'required' | 'canceled' | 'kycInProgress' | 'pendingValidation' | 'requireIntervention' | 'declined' | 'success' | 'error'
    }>
    'kycValidator'?: string | User
    'kycRetrialNb': number
    'kycDeclinedReasons'?: Array<string>
    'hasCompletedDueDiligence'?: boolean
    'dueDiligenceStatus'?: 'required' | 'kycStarted' | 'canRetry' | 'pending' | 'declined' | 'success'
    'dueDiligenceUrl'?: string
    'dueDiligenceReferences'?: Array<{
        'date': Date
        'reference': string
        'status': 'required' | 'canceled' | 'kycInProgress' | 'pendingValidation' | 'requireIntervention' | 'declined' | 'success' | 'error'
    }>
    'KYBstatus': 'notConcerned' | 'pending' | 'success' | 'declined'
    'kycReminderSentNb'?: number
    'kycReminderLastSentAt'?: Date
    'referralCode': string
    'referralCodeUsed'?: string
    'referralPageLastView': Date
    'wallets'?: Array<{
        'address': string
        'blockchain': 'solana' | 'ethereum' | 'bitcoin'
    }>
    'walletIds'?: Array<string>
    'assignedBangkEthWallet'?: BangkWallets
    'assignedBangkSolanaWallet'?: BangkWallets
    'assignedBangkBitcoinWallet'?: BangkWallets
    'assignedBangkPolygonWallet'?: BangkWallets
    'firstName'?: string
    'middleName'?: string
    'lastName'?: string
    'gender'?: 'M' | 'F' | 'N'
    'contactPhoneNumber'?: string
    'contactPhoneNumberPrefix'?: string
    'lang': 'fr' | 'en' | 'ru'
    'currency': 'eur' | 'usd' | 'thb' | 'jpy' | 'inr' | 'cny' | 'try' | 'mxn' | 'gbp' | 'chf' | 'rub' | 'pln' | 'dkk' | 'ils' | 'sek' | 'ars' | 'php' | 'brl' | 'cad' | 'krw' | 'nok' | 'sgd' | 'huf' | 'uah' | 'aud' | 'zar' | 'myr' | 'idr' | 'hkd' | 'nzd' | 'aed'
    'nationality'?: string
    'birthDate'?: number
    'address'?: {
        'line1'?: string
        'line2'?: string
        'zipCode'?: string
        'city'?: string
        'country'?: string
    }
    'devices'?: Array<string | Device>
    'countryIsoCode': string
    'favoriteCryptos': Array<'bangkEuro' | 'bangkCoin' | 'tether' | 'bitcoin' | 'solana' | 'ethereum' | 'usd-coin' | 'binancecoin'>
    'hasSubscribedToBangkNewsletter': boolean
    'hasSubscribedToBangkOpportunitiesNewsletter': boolean
    'hasSubscribedToUserResearchNewsletter': boolean
    'hasSentEmailVerificationReminder'?: boolean
    'hasSentReferralProgramReminder': boolean
    'company'?: Company
    'lastBrevoSync'?: number
    '_id': string
    'creationDate': Date
    'lastUpdateDate'?: Date
}

export type UserWrite = {
    'isEmailVerified'?: boolean
    'isPhoneVerified'?: boolean
    'hasPassedKyc'?: boolean
    'isLocked'?: boolean
    'hasAgreedWithTermsAndConditions'?: boolean
    'isDeleted'?: boolean
    'isCompanyRepresentative'?: boolean
    'isFinanceAdmin'?: boolean
    'isComplianceAdmin'?: boolean
    'isAppUser'?: boolean
    'isIcoInvestor'?: boolean
    'isBangkAdmin'?: boolean
    'phonePrefix'?: any
    'phoneWithPrefix'?: string
    'email'?: string
    'newEmail'?: string
    'password'?: string
    'validationTokens'?: Array<{
        'validUntil'?: Date
        'creationDate'?: Date
        'value'?: string
        'type'?: 'forgotPassword' | 'emailValidation' | 'changeEmail'
    }>
    'refreshTokens'?: Array<string>
    'accessTokens'?: Array<string>
    'lastPasswordCompareTime'?: Date
    'passwordRetrialNb'?: number
    'lockedReason'?: 'tooMuchPasswordAttempts' | 'ban' | 'tooManyAttempsForSecureAuthentication'
    'lockUntil'?: Date
    'deleteRequestStatus'?: 'sent' | 'processed'
    'pinCode'?: string
    'pinCodeRetrialNb'?: number
    'lastPincodeCompareTime'?: Date
    'biometricAuthToken'?: string
    'biometricAuthRetrialNb'?: number
    'lastBiometricCompareTime'?: Date
    '_2FAcode'?: string
    '_2FAretrialNb'?: number
    'last2FACompareTime'?: Date
    'kycStatus'?: 'required' | 'kycStarted' | 'canRetry' | 'pending' | 'declined' | 'success'
    'kycLastRequestDate'?: Date
    'kycUrl'?: string
    'isDuplicateAccount'?: boolean
    'kycReferences'?: Array<{
        'date'?: Date
        'reference': string
        'status'?: 'required' | 'canceled' | 'kycInProgress' | 'pendingValidation' | 'requireIntervention' | 'declined' | 'success' | 'error'
    }>
    'kycValidator'?: string
    'kycRetrialNb'?: number
    'kycDeclinedReasons'?: Array<string>
    'hasCompletedDueDiligence'?: boolean
    'dueDiligenceStatus'?: 'required' | 'kycStarted' | 'canRetry' | 'pending' | 'declined' | 'success'
    'dueDiligenceUrl'?: string
    'dueDiligenceReferences'?: Array<{
        'date'?: Date
        'reference': string
        'status'?: 'required' | 'canceled' | 'kycInProgress' | 'pendingValidation' | 'requireIntervention' | 'declined' | 'success' | 'error'
    }>
    'KYBstatus'?: 'notConcerned' | 'pending' | 'success' | 'declined'
    'kycReminderSentNb'?: number
    'kycReminderLastSentAt'?: Date
    'referralCode': string
    'referralCodeUsed'?: string
    'referralPageLastView'?: Date
    'wallets'?: Array<{
        'address': string
        'blockchain': 'solana' | 'ethereum' | 'bitcoin'
    }>
    'walletIds'?: Array<string>
    'assignedBangkEthWallet'?: string
    'assignedBangkSolanaWallet'?: string
    'assignedBangkBitcoinWallet'?: string
    'assignedBangkPolygonWallet'?: string
    'firstName'?: string
    'middleName'?: string
    'lastName'?: string
    'gender'?: 'M' | 'F' | 'N'
    'contactPhoneNumber'?: string
    'contactPhoneNumberPrefix'?: string
    'lang': 'fr' | 'en' | 'ru'
    'currency': 'eur' | 'usd' | 'thb' | 'jpy' | 'inr' | 'cny' | 'try' | 'mxn' | 'gbp' | 'chf' | 'rub' | 'pln' | 'dkk' | 'ils' | 'sek' | 'ars' | 'php' | 'brl' | 'cad' | 'krw' | 'nok' | 'sgd' | 'huf' | 'uah' | 'aud' | 'zar' | 'myr' | 'idr' | 'hkd' | 'nzd' | 'aed'
    'nationality'?: string
    'birthDate'?: number
    'address'?: {
        'line1'?: string
        'line2'?: string
        'zipCode'?: string
        'city'?: string
        'country'?: string
    }
    'devices'?: Array<string>
    'countryIsoCode'?: string
    'favoriteCryptos'?: Array<'bangkEuro' | 'bangkCoin' | 'tether' | 'bitcoin' | 'solana' | 'ethereum' | 'usd-coin' | 'binancecoin'>
    'hasSubscribedToBangkNewsletter'?: boolean
    'hasSubscribedToBangkOpportunitiesNewsletter'?: boolean
    'hasSubscribedToUserResearchNewsletter'?: boolean
    'hasSentEmailVerificationReminder'?: boolean
    'hasSentReferralProgramReminder'?: boolean
    'company'?: string
    'lastBrevoSync'?: number
    '_id'?: string
    'creationDate'?: Date
    'lastUpdateDate'?: Date
}

export interface UserModels {
    Write: UserWrite
    Read: User
}

export type UtmCampaign = {
    'id': string
    'from'?: string
    'fromDescription'?: string
    'campaignStartDate'?: Date
    'campaignEndDate'?: Date
    '_id': string
}

export type UtmCampaignWrite = {
    'id': string
    'from'?: string
    'fromDescription'?: string
    'campaignStartDate'?: Date
    'campaignEndDate'?: Date
    '_id'?: string
}

export interface UtmCampaignModels {
    Write: UtmCampaignWrite
    Read: UtmCampaign
}

export type VestingConfig = {
    'type': 'teamFounder' | 'parnerOrAdvisor' | 'privateSale' | 'publicSale' | 'lastCall'
    'forParticipantsFromPeriod'?: number
    'forParticipantsToPeriod'?: number
    'vestedForWeeks'?: number
    'vestingStartingAtNbWeeksPostListing': number
    'initialUnvestingPercent': number
    'weeklyUnvestingPercent': number
    'lastUnvestingPercent': number
    '_id': string
}

export type VestingConfigWrite = {
    'type': 'teamFounder' | 'parnerOrAdvisor' | 'privateSale' | 'publicSale' | 'lastCall'
    'forParticipantsFromPeriod'?: number
    'forParticipantsToPeriod'?: number
    'vestedForWeeks'?: number
    'vestingStartingAtNbWeeksPostListing': number
    'initialUnvestingPercent'?: number
    'weeklyUnvestingPercent': number
    'lastUnvestingPercent': number
    '_id'?: string
}

export interface VestingConfigModels {
    Write: VestingConfigWrite
    Read: VestingConfig
}

export type Wallet = {
    'user': string | User
    'amount': number
    'currency': 'bangkEuro' | 'bangkCoin' | 'tether' | 'bitcoin' | 'solana' | 'ethereum' | 'usd-coin' | 'binancecoin'
    'identityPublicKey'?: string
    '_id': string
    'creationDate': Date
}

export type WalletWrite = {
    'user': string
    'amount'?: number
    'currency': 'bangkEuro' | 'bangkCoin' | 'tether' | 'bitcoin' | 'solana' | 'ethereum' | 'usd-coin' | 'binancecoin'
    'identityPublicKey'?: string
    '_id'?: string
    'creationDate'?: Date
}

export interface WalletModels {
    Write: WalletWrite
    Read: Wallet
}

export type WalletTransferTransaction = {
    'source': {
        'user'?: string | User
        'amount': number
        'wallet'?: string | Wallet
    }
    'target': {
        'user'?: string | User
        'amount': number
        'wallet'?: string | Wallet
    }
    'status': 'pending' | 'error' | 'success'
    'exchangeRateMultiplier': number
    'exchangeFeesPercent': number
    'exchangeFeesAmount': number
    '_id': string
    'creationDate': Date
    'creator': string | User
    'lastUpdateDate'?: Date
    'lastUpdater': string | User
}

export type WalletTransferTransactionWrite = {
    'source': {
        'user'?: string
        'amount': number
        'wallet'?: string
    }
    'target': {
        'user'?: string
        'amount': number
        'wallet'?: string
    }
    'status'?: 'pending' | 'error' | 'success'
    'exchangeRateMultiplier': number
    'exchangeFeesPercent': number
    'exchangeFeesAmount': number
    '_id'?: string
    'creationDate'?: Date
    'creator'?: string
    'lastUpdateDate'?: Date
    'lastUpdater'?: string
}

export interface WalletTransferTransactionModels {
    Write: WalletTransferTransactionWrite
    Read: WalletTransferTransaction
}

export type AllModels = {
    appConfig: AppConfigModels
    bangkWallets: BangkWalletsModels
    blockchainConfig: BlockchainConfigModels
    card: CardModels
    cardTransaction: CardTransactionModels
    company: CompanyModels
    devComment: DevCommentModels
    device: DeviceModels
    icoBonusCode: IcoBonusCodeModels
    icoDashboardConfig: IcoDashboardConfigModels
    icoRewardTransaction: IcoRewardTransactionModels
    icoTransaction: IcoTransactionModels
    icoWalletTransactionToValidateManually: IcoWalletTransactionToValidateManuallyModels
    interestTransaction: InterestTransactionModels
    investmentBonds: InvestmentBondsModels
    investmentEquity: InvestmentEquityModels
    investmentFundShares: InvestmentFundSharesModels
    investmentProjectBonds: InvestmentProjectBondsModels
    investmentProjectEquity: InvestmentProjectEquityModels
    investmentProjectFundShares: InvestmentProjectFundSharesModels
    investmentTransactionBonds: InvestmentTransactionBondsModels
    investmentTransactionEquity: InvestmentTransactionEquityModels
    investmentTransactionFundShares: InvestmentTransactionFundSharesModels
    mission: MissionModels
    news: NewsModels
    sellOfferBonds: SellOfferBondsModels
    sellOfferEquity: SellOfferEquityModels
    sellOfferFundShares: SellOfferFundSharesModels
    serverBlacklist: ServerBlacklistModels
    supportMessages: SupportMessagesModels
    tag: TagModels
    trackingDataEvents: TrackingDataEventsModels
    trackingDataSession: TrackingDataSessionModels
    unexpectedError: UnexpectedErrorModels
    user: UserModels
    utmCampaign: UtmCampaignModels
    vestingConfig: VestingConfigModels
    wallet: WalletModels
    walletTransferTransaction: WalletTransferTransactionModels
}

export type ModelNames = keyof AllModels

