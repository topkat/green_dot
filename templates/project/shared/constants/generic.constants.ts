

import { objKeys } from 'topkat-utils'
import { CryptoCurrencyId } from './currency.constants'

export const primaryColor = '#427AEF'


//  ═╦═ ╦╗ ╔ ╦  ╦ ╔══╗ ╔═══ ══╦══ ╦╗╔╦ ╔══╗ ╦╗ ╔ ══╦══   ╔══╗ ╔══╗ ╔══╗    ╦ ╔══╗ ╔══╗ ══╦══ ╔═══
//   ║  ║╚╗║ ╚╗ ║ ╠═   ╚══╗   ║   ║╚╝║ ╠═   ║╚╗║   ║     ╠══╝ ╠═╦╝ ║  ║    ║ ╠═   ║      ║   ╚══╗
//  ═╩═ ╩ ╚╩  ╚═╝ ╚══╝ ═══╝   ╩   ╩  ╩ ╚══╝ ╩ ╚╩   ╩     ╩    ╩ ╚  ╚══╝ ╚══╝ ╚══╝ ╚══╝   ╩   ═══╝

export const investmentTypes = ['bond', 'equity', 'fundShares'] as const
export type InvestmentTypes = typeof investmentTypes[number]


export const investmentProjectModelsForInvestmentTypes = {
  bond: 'investmentProjectBonds',
  equity: 'investmentProjectEquity',
  fundShares: 'investmentProjectFundShares',
} as const satisfies Record<InvestmentTypes, string>

export const sellOfferModelsForInvestmentTypes = {
  bond: 'sellOfferBonds',
  equity: 'sellOfferEquity',
  fundShares: 'sellOfferFundShares',
} as const satisfies Record<InvestmentTypes, string>


export const investmentModelsForInvestmentTypes = {
  bond: 'investmentBonds',
  equity: 'investmentEquity',
  fundShares: 'investmentFundShares',
} as const satisfies Record<InvestmentTypes, string>

export const investmentTransactionsForInvestmentTypes = {
  bond: 'investmentTransactionBonds',
  equity: 'investmentTransactionEquity',
  fundShares: 'investmentTransactionFundShares',
} as const satisfies Record<InvestmentTypes, string>

/** Beware with adding a cashback period since it changes functional code */
export type CashbackPeriodTypes = keyof typeof nbMonthForCashbackPeriod
export const nbMonthForCashbackPeriod = {
  monthly: 1,
  quarterly: 3,
  halfly: 6,
  yearly: 12,
}
export const cashbackPeriodTypes = objKeys(nbMonthForCashbackPeriod)

export const externalLinksLabels = ['smartContract', 'detailedPresentation', 'ESG', 'financialAudit', 'legalAudit', 'keyInfos', 'fundRules', 'website', 'other'] as const
export type ExternalLinksLabels = typeof externalLinksLabels[number]

export const geographyScope = ['national', 'continental', 'international', 'global'] as const
export type GeographyScope = typeof geographyScope[number]


//  ╔══╗ ╔══╗ ╦   ╦ ╦╗╔╦ ╔══╗ ╦╗ ╔ ══╦══ ╔═══
//  ╠══╝ ╠══╣ ╚═╦═╝ ║╚╝║ ╠═   ║╚╗║   ║   ╚══╗
//  ╩    ╩  ╩   ╩   ╩  ╩ ╚══╝ ╩ ╚╩   ╩   ═══╝

export const paymentMethods = [
  'solanaWithWalletConnector',
  'ethereumWithWalletConnector',
  'bankTransfer',
  // Copy Paste
  'erc20CopyPaste',
  'ethCopyPaste',
  'solanaCopyPaste',
  'bitcoinCopyPaste'
] as const
export type PaymentMethods = typeof paymentMethods[number]

export const cardTransactionType = [
  'cardPayment',
  'contactless',
  'directDebit',
  'onlinePayment',
  'withdrawal',
  'incoming',
] as const
export type CardTransactionType = typeof cardTransactionType[number]

export const blockchains = ['solana', 'ethereum', 'bitcoin'] as const
export type Blockchains = typeof blockchains[number]


//  ╦  ╦ ╔═══ ╔══╗ ╔══╗
//  ║  ║ ╚══╗ ╠═   ╠═╦╝
//  ╚══╝ ═══╝ ╚══╝ ╩ ╚

export const defaultLanguage = 'en'
export const supportedLanguages = ['fr', 'en', 'ru'] as const
export type SupportedLanguages = typeof supportedLanguages[number]
export const supportedLanguagesWebsiteAndIco = ['fr', 'en'] as const
export type SupportedLanguagesWebsiteAndIco = typeof supportedLanguagesWebsiteAndIco[number]
export const euroZoneLanguages = ['fr', 'de', 'it', 'es', 'pt', 'nl', 'pl', 'ro', 'el', 'bg', 'cs', 'hu', 'sv', 'fi', 'da', 'sk', 'lt', 'sl', 'et', 'lv', 'hr', 'mt', 'ga', 'cy'] as const
export type EuroZoneLanguages = typeof euroZoneLanguages[number]

export const userLockReasons = ['tooMuchPasswordAttempts', 'ban', 'tooManyAttempsForSecureAuthentication'] as const
export type UserLockReasons = typeof userLockReasons[number]

/** Types of emails sent by backend for validation */
export const emailTypes = ['forgotPassword', 'emailValidation', 'changeEmail'] as const
export type EmailTypes = typeof emailTypes[number]

// at least 1 upperCase, 1 lowerCase, 1 digit and 1 special character
export const emailRegexp = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[ !"#$%&'()*+,-./:;<=>?@[\]^_`{|}~]).*$/

export const refreshTokenExpirationMinutes = 30


//  ═╦═ ╔══╗ ╔══╗
//   ║  ║    ║  ║
//  ═╩═ ╚══╝ ╚══╝

export const vestingConfigFounderId = 'f1f0f0f0f0f0f0f0f0f0f0f0'
export const vestingConfigPartnerId = 'f1f0f0f0f0f0f0f0f0f0f0f1'

export const icoTransactionExpiration = 7 * 24 * 60 * 60 * 1000

export const referralCodeLength = 6 // should not be changed
export const defaultTransactionIdLength = 8 // should not be changed

export const icoTransactionPendingReason = [
  // WALLETS
  'fundsNotReceivedYetForUntrackableTx',
  'requiresManualVerification',
  'requiresAdditionnalInfos',
  'fundsNotReceivedYetForTrackableTx', // BANK TRANSFER, TODO rename bankTransferPending
  // BANK TRANSFER
  'bankTransferAmountNotCorresponding',
  'bankTransferCurrencyNotCorresponding',
  'bankTransferPendingForTooLong',
] as const
export type IcoTransactionPendingReason = typeof icoTransactionPendingReason[number]

export const icoTransactionCancelReason = [
  'relatedTxCancelled',
  'error',
  'cancelledByBangkAdmin',
  'expired',
  'transactionWithoutHashExpired',
  'neverProcessed'
] as const
export type IcoTransactionCancelReason = typeof icoTransactionCancelReason[number]

export const onReferredFirstTransactionBonusId = 'f1f9f3f0f0f0f0f0f0f0f0f0'
export const forReferrerOnAllReferredTransactionBonusId = 'f1f9f3f0f0f0f0f0f0f0f0f1'
export const customBonusIdForTest = 'f1f9f3f0f0f0f0f0f0f0f0f2'

//  ══╦══ ╔══╗ ╔══╗ ╔══╗ ╦ ╔  ═╦═ ╦╗ ╔ ╔══╗
//    ║   ╠═╦╝ ╠══╣ ║    ╠═╩╗  ║  ║╚╗║ ║ ═╦
//    ╩   ╩ ╚  ╩  ╩ ╚══╝ ╩  ╚ ═╩═ ╩ ╚╩ ╚══╝

export const specialEvents = ['navigate', 'componentVisible', 'componentHidden', 'error', 'sessionStart'] as const
export type SpecialEvents = typeof specialEvents[number]
export const standardEvent = ['press', 'click', 'sessionEnd', 'pageLeft', 'pageReturn'] as const
export type StandardEvent = typeof standardEvent[number]
export const eventNames = [...standardEvent, ...specialEvents]
export type EventNames = StandardEvent | SpecialEvents

//  ╦╗╔╦ ═╦═ ╔═══ ╔══╗
//  ║╚╝║  ║  ╚══╗ ║
//  ╩  ╩ ═╩═ ═══╝ ╚══╝

export const selectedLabel = ['24H', '1W', '1M'] as const
export type SelectLabel = typeof selectedLabel[number]

export const campaignSocialMedia = ['linkedin', 'instagram', 'x', 'discord', 'telegram', 'tiktok', 'medium', 'snapchat', 'whatsapp', 'youtube', 'reddit', 'twitch', 'wechat', 'facebook', 'other']

/** TODO improve this is used to get authorized iconTypes in models to provide in investmentProject
description and bullet points for example, but this is very large. Also in case an icon hanges, this
list has to be updated manually */
export const icons = [
  'ChevronDown', 'DragAndDrop', 'ChevronLeft', 'ChevronLeftRight', 'ChevronRight', 'ChevronUp', 'ChevronUpDown', 'MinusRounded', 'PlusRounded', 'MediaPlayBackwardBold', 'VideoCameraOffBold', 'VideoCameraBold', 'MediaPlayForwardBold', 'MediaNextBold', 'MediaPauseBold', 'MediaPlayBold', 'MediaPreviousBold', 'MediaReplayBold', 'MediaStopBold', 'ComputerScreenBold', 'LaptopComputerBold', 'GamepadBold', 'PhoneBold', 'SmartTvBold', 'TabletBold', 'WatchBold', 'SizeDownBold', 'SizeUpBold', 'DepositBold', 'ArrowCaretDownBold', 'ExchangeBold', 'ReceiveBold', 'SendBold', 'TransferBold', 'ArrowCaretUpBold', 'WithdrawBold', 'ArrowDownRoundedBold', 'ArrowLeftRoundedBold', 'ArrowRightRoundedBold', 'ArrowUpRoundedBold', 'BellBold', 'BatteryChargingBold', 'MagnifyingGlassRoundedBold', 'MagnifyingGlassBold', 'SoundMuteBold', 'BatteryFullBold', 'HideEyeBold', 'VolumeHighBold', 'VolumeLessBold', 'BatteryLowBold', 'VolumeLowBold', 'BatteryMediumBold', 'ZoomOutBold', 'BellOnBold', 'VolumePlusBold', 'ZoomInBold', 'VolumeMuteBold', 'ViewEyeBold', 'BangkStableBold', 'BtcBold', 'BasketCartBold', 'TrashBold', 'BluetoothBold', 'BookBold', 'CalendarBold', 'ForbiddenSignBold', 'CardContactlessBold', 'CardBold', 'Chart3linesBold', 'Chart2linesBold', 'CheckMarkBold', 'ClockBold', 'CloudBold', 'HomeWithWindowBold', 'CompassBold', 'NoContactlessBold', 'ContactlessBold', 'CrossCircleBold', 'CrowwTriangleBold', 'CubeProjectBold', 'DiamondBold', 'DiscussionBold', 'DollarRoundedBold', 'ThreeDotsHorizontalRoundedBold', 'ThreeDotsVerticalRoundedBold', 'DueDateCalendar', 'EnergyBold', 'EnergyOffBold', 'EuroRoundedBold', 'ExclamationMarkRoundedBold', 'ExclamationMarkTriangleBold', 'TimeExpiredBold', 'BookmarkOkBold', 'RemoveBookmarkBold', 'FileBold', 'FlagBold', 'FolderBold', 'FolderOpenBold', 'FoodBold', 'GalleryBold', 'GoldBold', 'EarthBold', 'HeartSlashBold', 'Settings2fadersHorizontalBold', 'Settings3fadersHorizontalBold', 'HourGlassBold', 'HomeWithTwoLinesBold', 'InstitutionIbanBold', 'IdCardBold', 'InfoRoundedBold', 'PlantInvestBold', 'ListViewBold', 'LockClosedBold', 'LockOpenBold', 'MailBold', 'MailModifyBold', 'MailSendingBold', 'MailMapBold', 'MicrophoneOffBold', 'MicrophoneOnBold', 'PencilBold', 'MoonBold', 'MusicNoteBold', 'MusicNote2bold', 'NewCheckedBold', 'LightBulbOffBold', 'LightBulbBold', 'UserProfileBold', 'OnlinePaymentWalletBold', 'OperationArrowUpDownBold', 'CogBold', 'PaymentBold', 'PhoneBold', 'PhoneOffBold', 'PhoneRingingBold', 'CameraBold', 'PieChartBold', 'MapMarkerBold', 'MapMarkerCheckedBold', 'MapMarkerOffBold', 'UserProfileRoundedBold', 'PuzzlePieceBold', 'QuestionMarkRoundedBold', 'RocketBold', 'SmsSpeechBaloonBold', 'BookmarkBold', 'SavingsBold', 'SecurityKeyRoundedBold', 'SendMsgBold', 'SendMsgUpBold', 'ProfileSettingBold', 'ShareViaBold', 'SheetBold', 'ShieldKeyHoleBold', 'SmartContractBold', 'HomeNetworkBold', 'SnowBold', 'LayersBold', 'FourSquareTilesBold', 'StarBold', 'StarSlashBold', 'SunBold', 'TagBold', 'TargetBold', 'TelescopeBold', 'PeopleGroupThreeBold', 'ThumbDownBold', 'ThumbUpBold', 'TimerBold', 'PeopleGroupTwoBold', 'VaultBold', 'Settings3fadersVerticalBold', 'VolatilityBold', 'WorldWwwBold', 'WalletInvestBold', 'WalletBold', 'WaterDropBold', 'WifiBold', 'WithdrawAtmBold', 'WorldBold', 'AtBold', 'DownloadBold', 'DoorExitBold', 'MinusRoundedBold', 'PlusRoundedBold', 'MediaPlayBackward', 'VideoCameraOff', 'VideoCamera', 'MediaPlayForward', 'MediaNext', 'MediaPause', 'MediaPlay', 'MediaPrevious', 'MediaReplay', 'MediaStop', 'ComputerScreen', 'LaptopComputer', 'Gamepad', 'Phone', 'SmartTv', 'Tablet', 'Watch', 'SizeDown', 'SizeUp', 'Deposit', 'ArrowCaretDown', 'Exchange', 'Receive', 'Send', 'Transfer', 'ArrowCaretUp', 'Withdraw', 'ArrowDownRounded', 'ArrowLeftRounded', 'ArrowRightRounded', 'ArrowUpRounded', 'Bell', 'BatteryCharging', 'MagnifyingGlassRounded', 'MagnifyingGlass', 'SoundMute', 'BatteryFull', 'HideEye', 'VolumeHigh', 'VolumeLess', 'BatteryLow', 'VolumeLow', 'BatteryMedium', 'ZoomOut', 'BellOn', 'VolumePlus', 'ZoomIn', 'VolumeMute', 'ViewEye', 'BangkStable', 'Btc', 'BasketCart', 'Trash', 'Bluetooth', 'Book', 'Calendar', 'ForbiddenSign', 'CardContactless', 'Card', 'Chart3lines', 'Chart2lines', 'CheckMark', 'Clock', 'Cloud', 'HomeWithWindow', 'Compass', 'NoContactless', 'Contactless', 'CrossCircle', 'CrossTriangle', 'CubeProject', 'Diamond', 'Discussion', 'DollarRounded', 'ThreeDotsHorizontalRounded', 'ThreeDotsVerticalRounded', 'ThreeDotsHorizontal', 'ThreeDotsVertical', 'DueDateCalendar', 'Energy', 'EnergyOff', 'EuroRounded', 'ExclamationMarkRounded', 'ExclamationMarkTriangle', 'TimeExpired', 'BookmarkOk', 'RemoveBookmark', 'File', 'Fingerprint', 'Flag', 'Folder', 'FolderOpen', 'Food', 'Gallery', 'Gold', 'Earth', 'HeartSlash', 'Settings2fadersHorizontal', 'Settings3fadersHorizontal', 'HourGlass', 'HomeWithTwoLines', 'InstitutionIban', 'IdCard', 'InfoRounded', 'PlantInvest', 'BurgerMenuHorizontal', 'ListView', 'LockClosed', 'LockOpen', 'Mail', 'MailModify', 'MailSending', 'MailMap', 'MicrophoneOff', 'MicrophoneOn', 'Pencil', 'Moon', 'MusicNote', 'MusicNote2', 'NewChecked', 'LightBulbOff', 'LightBulb', 'UserProfile', 'OnlinePaymentWallet', 'OperationArrowUpDown', 'Cog', 'Payment', 'Phone', 'PhoneOff', 'PhoneRinging', 'Camera', 'PieChart', 'MapMarker', 'MapMarkerChecked', 'MapMarkerOff', 'UserProfileRounded', 'PuzzlePiece', 'QuestionMarkRounded', 'Rocket', 'SmsSpeechBaloon', 'Bookmark', 'Savings', 'SecurityKeyRounded', 'SendMsg', 'SendMsgUp', 'ProfileSetting', 'ShareVia', 'Sheet', 'ShieldKeyHole', 'SmartContract', 'HomeNetwork', 'Snow', 'Layers', 'FourSquareTiles', 'Star', 'StarSlash', 'Sun', 'Tag', 'Target', 'Telescope', 'PeopleGroupThree', 'ThumbDown', 'ThumbUp', 'Timer', 'PeopleGroupTwo', 'Vault', 'Settings3fadersVertical', 'Volatility', 'WorldWww', 'WalletInvest', 'Wallet', 'WaterDrop', 'Wifi', 'WithdrawAtm', 'World', 'At', 'Download', 'DoorExit', 'Attachement', 'Cross', 'ExternalLink', 'Hashtag', 'LinkJoint', 'LinkJoin2', 'Minus', 'Next', 'Plus', 'Previous', 'Check'] as const
export type IconsCompName = typeof icons[number]

//  ╦╗ ╔ ╔══╗ ══╦══ ╦  ╦ ╔══╗ ╔══╗ ╦ ╔
//  ║╚╗║ ╠═     ║   ║╔╗║ ║  ║ ╠═╦╝ ╠═╩╗
//  ╩ ╚╩ ╚══╝   ╩   ╩╝╚╩ ╚══╝ ╩ ╚  ╩  ╚

export const evmNetwork = ['ethereum', 'polygon', 'bsc', 'base'] as const
export type EvmNetwork = typeof evmNetwork[number]


export const blockchainNetwork = [...evmNetwork, 'solana', 'bitcoin'] as const
export type BlockchainNetwork = typeof blockchainNetwork[number]

export const cryptoCurrencySupportedBlockchain = {
  bitcoin: ['bitcoin'],
  ethereum: ['base', 'ethereum'],
  tether: ['solana', 'ethereum'],
  'usd-coin': ['solana', 'polygon', 'base', 'ethereum'],
  binancecoin: ['bsc'],
  solana: ['solana']
} satisfies Record<CryptoCurrencyId, Array<BlockchainNetwork>>

export type CryptoCurrencySupportedBlockchain = typeof cryptoCurrencySupportedBlockchain


export type ContractAddressByCurrency = {
  [K in keyof CryptoCurrencySupportedBlockchain]?: {
    [N in CryptoCurrencySupportedBlockchain[K][number]]?: string
  }
}


export const contractAddressByCurrency = {
  tether: {
    ethereum: '0xdac17f958d2ee523a2206206994597c13d831ec7' as const,
    solana: 'Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB' as const,
  },
  'usd-coin': {
    ethereum: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48' as const,
    base: '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913' as const,
    polygon: '0x3c499c542cef5e3811e1192ce70d8cc03d5c3359' as const,
    solana: 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v' as const
  }
} satisfies ContractAddressByCurrency


export const contractAddressByCurrencyTestnet = {
  tether: {
    ethereum: '0x1c7d4b196cb0c7b01d743fbc6116a902379c7238' as const,
    solana: '4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU' as const
  },
  'usd-coin': {
    ethereum: '0x1c7d4b196cb0c7b01d743fbc6116a902379c7238' as const,
    base: '0x036CbD53842c5426634e7929541eC2318f3dCF7e' as const,
    polygon: '0x41e94eb019c0762f9bfcf9fb1e58725bfb0e7582' as const,
    solana: '4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU' as const
  }
} satisfies ContractAddressByCurrency

export const evmContractAddressByCurrency = contractAddressByCurrency || contractAddressByCurrencyTestnet
