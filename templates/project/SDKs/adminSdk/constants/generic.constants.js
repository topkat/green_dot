"use strict";
/// <reference path="../global.d.ts" />
Object.defineProperty(exports, "__esModule", { value: true });
exports.evmContractAddressByCurrency = exports.contractAddressByCurrencyTestnet = exports.contractAddressByCurrency = exports.cryptoCurrencySupportedBlockchain = exports.blockchainNetwork = exports.evmNetwork = exports.icons = exports.campaignSocialMedia = exports.selectedLabel = exports.eventNames = exports.standardEvent = exports.specialEvents = exports.customBonusIdForTest = exports.forReferrerOnAllReferredTransactionBonusId = exports.onReferredFirstTransactionBonusId = exports.icoTransactionCancelReason = exports.icoTransactionPendingReason = exports.defaultTransactionIdLength = exports.referralCodeLength = exports.icoTransactionExpiration = exports.vestingConfigPartnerId = exports.vestingConfigFounderId = exports.refreshTokenExpirationMinutes = exports.emailRegexp = exports.emailTypes = exports.userLockReasons = exports.euroZoneLanguages = exports.supportedLanguagesWebsiteAndIco = exports.supportedLanguages = exports.defaultLanguage = exports.blockchains = exports.cardTransactionType = exports.paymentMethods = exports.geographyScope = exports.externalLinksLabels = exports.cashbackPeriodTypes = exports.nbMonthForCashbackPeriod = exports.investmentTransactionsForInvestmentTypes = exports.investmentModelsForInvestmentTypes = exports.sellOfferModelsForInvestmentTypes = exports.investmentProjectModelsForInvestmentTypes = exports.investmentTypes = exports.primaryColor = void 0;
const topkat_utils_1 = require("topkat-utils");
exports.primaryColor = '#427AEF';
//  ═╦═ ╦╗ ╔ ╦  ╦ ╔══╗ ╔═══ ══╦══ ╦╗╔╦ ╔══╗ ╦╗ ╔ ══╦══   ╔══╗ ╔══╗ ╔══╗    ╦ ╔══╗ ╔══╗ ══╦══ ╔═══
//   ║  ║╚╗║ ╚╗ ║ ╠═   ╚══╗   ║   ║╚╝║ ╠═   ║╚╗║   ║     ╠══╝ ╠═╦╝ ║  ║    ║ ╠═   ║      ║   ╚══╗
//  ═╩═ ╩ ╚╩  ╚═╝ ╚══╝ ═══╝   ╩   ╩  ╩ ╚══╝ ╩ ╚╩   ╩     ╩    ╩ ╚  ╚══╝ ╚══╝ ╚══╝ ╚══╝   ╩   ═══╝
exports.investmentTypes = ['bond', 'equity', 'fundShares'];
exports.investmentProjectModelsForInvestmentTypes = {
    bond: 'investmentProjectBonds',
    equity: 'investmentProjectEquity',
    fundShares: 'investmentProjectFundShares',
};
exports.sellOfferModelsForInvestmentTypes = {
    bond: 'sellOfferBonds',
    equity: 'sellOfferEquity',
    fundShares: 'sellOfferFundShares',
};
exports.investmentModelsForInvestmentTypes = {
    bond: 'investmentBonds',
    equity: 'investmentEquity',
    fundShares: 'investmentFundShares',
};
exports.investmentTransactionsForInvestmentTypes = {
    bond: 'investmentTransactionBonds',
    equity: 'investmentTransactionEquity',
    fundShares: 'investmentTransactionFundShares',
};
exports.nbMonthForCashbackPeriod = {
    monthly: 1,
    quarterly: 3,
    halfly: 6,
    yearly: 12,
};
exports.cashbackPeriodTypes = (0, topkat_utils_1.objKeys)(exports.nbMonthForCashbackPeriod);
exports.externalLinksLabels = ['smartContract', 'detailedPresentation', 'ESG', 'financialAudit', 'legalAudit', 'keyInfos', 'fundRules', 'website', 'other'];
exports.geographyScope = ['national', 'continental', 'international', 'global'];
//  ╔══╗ ╔══╗ ╦   ╦ ╦╗╔╦ ╔══╗ ╦╗ ╔ ══╦══ ╔═══
//  ╠══╝ ╠══╣ ╚═╦═╝ ║╚╝║ ╠═   ║╚╗║   ║   ╚══╗
//  ╩    ╩  ╩   ╩   ╩  ╩ ╚══╝ ╩ ╚╩   ╩   ═══╝
exports.paymentMethods = [
    'solanaWithWalletConnector',
    'ethereumWithWalletConnector',
    'bankTransfer',
    // Copy Paste
    'erc20CopyPaste',
    'ethCopyPaste',
    'solanaCopyPaste',
    'bitcoinCopyPaste'
];
exports.cardTransactionType = [
    'cardPayment',
    'contactless',
    'directDebit',
    'onlinePayment',
    'withdrawal',
    'incoming',
];
exports.blockchains = ['solana', 'ethereum', 'bitcoin'];
//  ╦  ╦ ╔═══ ╔══╗ ╔══╗
//  ║  ║ ╚══╗ ╠═   ╠═╦╝
//  ╚══╝ ═══╝ ╚══╝ ╩ ╚
exports.defaultLanguage = 'en';
exports.supportedLanguages = ['fr', 'en', 'ru'];
exports.supportedLanguagesWebsiteAndIco = ['fr', 'en'];
exports.euroZoneLanguages = ['fr', 'de', 'it', 'es', 'pt', 'nl', 'pl', 'ro', 'el', 'bg', 'cs', 'hu', 'sv', 'fi', 'da', 'sk', 'lt', 'sl', 'et', 'lv', 'hr', 'mt', 'ga', 'cy'];
exports.userLockReasons = ['tooMuchPasswordAttempts', 'ban', 'tooManyAttempsForSecureAuthentication'];
/** Types of emails sent by backend for validation */
exports.emailTypes = ['forgotPassword', 'emailValidation', 'changeEmail'];
// at least 1 upperCase, 1 lowerCase, 1 digit and 1 special character
exports.emailRegexp = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[ !"#$%&'()*+,-./:;<=>?@[\]^_`{|}~]).*$/;
exports.refreshTokenExpirationMinutes = 30;
//  ═╦═ ╔══╗ ╔══╗
//   ║  ║    ║  ║
//  ═╩═ ╚══╝ ╚══╝
exports.vestingConfigFounderId = 'f1f0f0f0f0f0f0f0f0f0f0f0';
exports.vestingConfigPartnerId = 'f1f0f0f0f0f0f0f0f0f0f0f1';
exports.icoTransactionExpiration = 7 * 24 * 60 * 60 * 1000;
exports.referralCodeLength = 6; // should not be changed
exports.defaultTransactionIdLength = 8; // should not be changed
exports.icoTransactionPendingReason = [
    // WALLETS
    'fundsNotReceivedYetForUntrackableTx',
    'requiresManualVerification',
    'requiresAdditionnalInfos',
    'fundsNotReceivedYetForTrackableTx', // BANK TRANSFER, TODO rename bankTransferPending
    // BANK TRANSFER
    'bankTransferAmountNotCorresponding',
    'bankTransferCurrencyNotCorresponding',
    'bankTransferPendingForTooLong',
];
exports.icoTransactionCancelReason = [
    'relatedTxCancelled',
    'error',
    'cancelledByBangkAdmin',
    'expired',
    'transactionWithoutHashExpired',
    'neverProcessed'
];
exports.onReferredFirstTransactionBonusId = 'f1f9f3f0f0f0f0f0f0f0f0f0';
exports.forReferrerOnAllReferredTransactionBonusId = 'f1f9f3f0f0f0f0f0f0f0f0f1';
exports.customBonusIdForTest = 'f1f9f3f0f0f0f0f0f0f0f0f2';
//  ══╦══ ╔══╗ ╔══╗ ╔══╗ ╦ ╔  ═╦═ ╦╗ ╔ ╔══╗
//    ║   ╠═╦╝ ╠══╣ ║    ╠═╩╗  ║  ║╚╗║ ║ ═╦
//    ╩   ╩ ╚  ╩  ╩ ╚══╝ ╩  ╚ ═╩═ ╩ ╚╩ ╚══╝
exports.specialEvents = ['navigate', 'componentVisible', 'componentHidden', 'error', 'sessionStart'];
exports.standardEvent = ['press', 'click', 'sessionEnd', 'pageLeft', 'pageReturn'];
exports.eventNames = [...exports.standardEvent, ...exports.specialEvents];
//  ╦╗╔╦ ═╦═ ╔═══ ╔══╗
//  ║╚╝║  ║  ╚══╗ ║
//  ╩  ╩ ═╩═ ═══╝ ╚══╝
exports.selectedLabel = ['24H', '1W', '1M'];
exports.campaignSocialMedia = ['linkedin', 'instagram', 'x', 'discord', 'telegram', 'tiktok', 'medium', 'snapchat', 'whatsapp', 'youtube', 'reddit', 'twitch', 'wechat', 'facebook', 'other'];
/** TODO improve this is used to get authorized iconTypes in models to provide in investmentProject
description and bullet points for example, but this is very large. Also in case an icon hanges, this
list has to be updated manually */
exports.icons = [
    'ChevronDown', 'DragAndDrop', 'ChevronLeft', 'ChevronLeftRight', 'ChevronRight', 'ChevronUp', 'ChevronUpDown', 'MinusRounded', 'PlusRounded', 'MediaPlayBackwardBold', 'VideoCameraOffBold', 'VideoCameraBold', 'MediaPlayForwardBold', 'MediaNextBold', 'MediaPauseBold', 'MediaPlayBold', 'MediaPreviousBold', 'MediaReplayBold', 'MediaStopBold', 'ComputerScreenBold', 'LaptopComputerBold', 'GamepadBold', 'PhoneBold', 'SmartTvBold', 'TabletBold', 'WatchBold', 'SizeDownBold', 'SizeUpBold', 'DepositBold', 'ArrowCaretDownBold', 'ExchangeBold', 'ReceiveBold', 'SendBold', 'TransferBold', 'ArrowCaretUpBold', 'WithdrawBold', 'ArrowDownRoundedBold', 'ArrowLeftRoundedBold', 'ArrowRightRoundedBold', 'ArrowUpRoundedBold', 'BellBold', 'BatteryChargingBold', 'MagnifyingGlassRoundedBold', 'MagnifyingGlassBold', 'SoundMuteBold', 'BatteryFullBold', 'HideEyeBold', 'VolumeHighBold', 'VolumeLessBold', 'BatteryLowBold', 'VolumeLowBold', 'BatteryMediumBold', 'ZoomOutBold', 'BellOnBold', 'VolumePlusBold', 'ZoomInBold', 'VolumeMuteBold', 'ViewEyeBold', 'BangkStableBold', 'BtcBold', 'BasketCartBold', 'TrashBold', 'BluetoothBold', 'BookBold', 'CalendarBold', 'ForbiddenSignBold', 'CardContactlessBold', 'CardBold', 'Chart3linesBold', 'Chart2linesBold', 'CheckMarkBold', 'ClockBold', 'CloudBold', 'HomeWithWindowBold', 'CompassBold', 'NoContactlessBold', 'ContactlessBold', 'CrossCircleBold', 'CrowwTriangleBold', 'CubeProjectBold', 'DiamondBold', 'DiscussionBold', 'DollarRoundedBold', 'ThreeDotsHorizontalRoundedBold', 'ThreeDotsVerticalRoundedBold', 'DueDateCalendar', 'EnergyBold', 'EnergyOffBold', 'EuroRoundedBold', 'ExclamationMarkRoundedBold', 'ExclamationMarkTriangleBold', 'TimeExpiredBold', 'BookmarkOkBold', 'RemoveBookmarkBold', 'FileBold', 'FlagBold', 'FolderBold', 'FolderOpenBold', 'FoodBold', 'GalleryBold', 'GoldBold', 'EarthBold', 'HeartSlashBold', 'Settings2fadersHorizontalBold', 'Settings3fadersHorizontalBold', 'HourGlassBold', 'HomeWithTwoLinesBold', 'InstitutionIbanBold', 'IdCardBold', 'InfoRoundedBold', 'PlantInvestBold', 'ListViewBold', 'LockClosedBold', 'LockOpenBold', 'MailBold', 'MailModifyBold', 'MailSendingBold', 'MailMapBold', 'MicrophoneOffBold', 'MicrophoneOnBold', 'PencilBold', 'MoonBold', 'MusicNoteBold', 'MusicNote2bold', 'NewCheckedBold', 'LightBulbOffBold', 'LightBulbBold', 'UserProfileBold', 'OnlinePaymentWalletBold', 'OperationArrowUpDownBold', 'CogBold', 'PaymentBold', 'PhoneBold', 'PhoneOffBold', 'PhoneRingingBold', 'CameraBold', 'PieChartBold', 'MapMarkerBold', 'MapMarkerCheckedBold', 'MapMarkerOffBold', 'UserProfileRoundedBold', 'PuzzlePieceBold', 'QuestionMarkRoundedBold', 'RocketBold', 'SmsSpeechBaloonBold', 'BookmarkBold', 'SavingsBold', 'SecurityKeyRoundedBold', 'SendMsgBold', 'SendMsgUpBold', 'ProfileSettingBold', 'ShareViaBold', 'SheetBold', 'ShieldKeyHoleBold', 'SmartContractBold', 'HomeNetworkBold', 'SnowBold', 'LayersBold', 'FourSquareTilesBold', 'StarBold', 'StarSlashBold', 'SunBold', 'TagBold', 'TargetBold', 'TelescopeBold', 'PeopleGroupThreeBold', 'ThumbDownBold', 'ThumbUpBold', 'TimerBold', 'PeopleGroupTwoBold', 'VaultBold', 'Settings3fadersVerticalBold', 'VolatilityBold', 'WorldWwwBold', 'WalletInvestBold', 'WalletBold', 'WaterDropBold', 'WifiBold', 'WithdrawAtmBold', 'WorldBold', 'AtBold', 'DownloadBold', 'DoorExitBold', 'MinusRoundedBold', 'PlusRoundedBold', 'MediaPlayBackward', 'VideoCameraOff', 'VideoCamera', 'MediaPlayForward', 'MediaNext', 'MediaPause', 'MediaPlay', 'MediaPrevious', 'MediaReplay', 'MediaStop', 'ComputerScreen', 'LaptopComputer', 'Gamepad', 'Phone', 'SmartTv', 'Tablet', 'Watch', 'SizeDown', 'SizeUp', 'Deposit', 'ArrowCaretDown', 'Exchange', 'Receive', 'Send', 'Transfer', 'ArrowCaretUp', 'Withdraw', 'ArrowDownRounded', 'ArrowLeftRounded', 'ArrowRightRounded', 'ArrowUpRounded', 'Bell', 'BatteryCharging', 'MagnifyingGlassRounded', 'MagnifyingGlass', 'SoundMute', 'BatteryFull', 'HideEye', 'VolumeHigh', 'VolumeLess', 'BatteryLow', 'VolumeLow', 'BatteryMedium', 'ZoomOut', 'BellOn', 'VolumePlus', 'ZoomIn', 'VolumeMute', 'ViewEye', 'BangkStable', 'Btc', 'BasketCart', 'Trash', 'Bluetooth', 'Book', 'Calendar', 'ForbiddenSign', 'CardContactless', 'Card', 'Chart3lines', 'Chart2lines', 'CheckMark', 'Clock', 'Cloud', 'HomeWithWindow', 'Compass', 'NoContactless', 'Contactless', 'CrossCircle', 'CrossTriangle', 'CubeProject', 'Diamond', 'Discussion', 'DollarRounded', 'ThreeDotsHorizontalRounded', 'ThreeDotsVerticalRounded', 'ThreeDotsHorizontal', 'ThreeDotsVertical', 'DueDateCalendar', 'Energy', 'EnergyOff', 'EuroRounded', 'ExclamationMarkRounded', 'ExclamationMarkTriangle', 'TimeExpired', 'BookmarkOk', 'RemoveBookmark', 'File', 'Fingerprint', 'Flag', 'Folder', 'FolderOpen', 'Food', 'Gallery', 'Gold', 'Earth', 'HeartSlash', 'Settings2fadersHorizontal', 'Settings3fadersHorizontal', 'HourGlass', 'HomeWithTwoLines', 'InstitutionIban', 'IdCard', 'InfoRounded', 'PlantInvest', 'BurgerMenuHorizontal', 'ListView', 'LockClosed', 'LockOpen', 'Mail', 'MailModify', 'MailSending', 'MailMap', 'MicrophoneOff', 'MicrophoneOn', 'Pencil', 'Moon', 'MusicNote', 'MusicNote2', 'NewChecked', 'LightBulbOff', 'LightBulb', 'UserProfile', 'OnlinePaymentWallet', 'OperationArrowUpDown', 'Cog', 'Payment', 'Phone', 'PhoneOff', 'PhoneRinging', 'Camera', 'PieChart', 'MapMarker', 'MapMarkerChecked', 'MapMarkerOff', 'UserProfileRounded', 'PuzzlePiece', 'QuestionMarkRounded', 'Rocket', 'SmsSpeechBaloon', 'Bookmark', 'Savings', 'SecurityKeyRounded', 'SendMsg', 'SendMsgUp', 'ProfileSetting', 'ShareVia', 'Sheet', 'ShieldKeyHole', 'SmartContract', 'HomeNetwork', 'Snow', 'Layers', 'FourSquareTiles', 'Star', 'StarSlash', 'Sun', 'Tag', 'Target', 'Telescope', 'PeopleGroupThree', 'ThumbDown', 'ThumbUp', 'Timer', 'PeopleGroupTwo', 'Vault', 'Settings3fadersVertical', 'Volatility', 'WorldWww', 'WalletInvest', 'Wallet', 'WaterDrop', 'Wifi', 'WithdrawAtm', 'World', 'At', 'Download', 'DoorExit', 'Attachement', 'Cross', 'ExternalLink', 'Hashtag', 'LinkJoint', 'LinkJoin2', 'Minus', 'Next', 'Plus', 'Previous', 'Check'
];
//  ╦╗ ╔ ╔══╗ ══╦══ ╦  ╦ ╔══╗ ╔══╗ ╦ ╔
//  ║╚╗║ ╠═     ║   ║╔╗║ ║  ║ ╠═╦╝ ╠═╩╗
//  ╩ ╚╩ ╚══╝   ╩   ╩╝╚╩ ╚══╝ ╩ ╚  ╩  ╚
exports.evmNetwork = ['ethereum', 'polygon', 'bsc', 'base'];
exports.blockchainNetwork = [...exports.evmNetwork, 'solana', 'bitcoin'];
exports.cryptoCurrencySupportedBlockchain = {
    bitcoin: ['bitcoin'],
    ethereum: ['base', 'ethereum'],
    tether: ['solana', 'ethereum'],
    'usd-coin': ['solana', 'polygon', 'base', 'ethereum'],
    binancecoin: ['bsc'],
    solana: ['solana']
};
exports.contractAddressByCurrency = {
    tether: {
        ethereum: '0xdac17f958d2ee523a2206206994597c13d831ec7',
        solana: 'Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB',
    },
    'usd-coin': {
        ethereum: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
        base: '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913',
        polygon: '0x3c499c542cef5e3811e1192ce70d8cc03d5c3359',
        solana: 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v'
    }
};
exports.contractAddressByCurrencyTestnet = {
    tether: {
        ethereum: '0x1c7d4b196cb0c7b01d743fbc6116a902379c7238',
        solana: '4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU'
    },
    'usd-coin': {
        ethereum: '0x1c7d4b196cb0c7b01d743fbc6116a902379c7238',
        base: '0x036CbD53842c5426634e7929541eC2318f3dCF7e',
        polygon: '0x41e94eb019c0762f9bfcf9fb1e58725bfb0e7582',
        solana: '4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU'
    }
};
exports.evmContractAddressByCurrency = exports.contractAddressByCurrency || exports.contractAddressByCurrencyTestnet;
//# sourceMappingURL=generic.constants.js.map