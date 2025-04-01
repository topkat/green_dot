export declare const primaryColor = "#427AEF";
export declare const investmentTypes: readonly ["bond", "equity", "fundShares"];
export type InvestmentTypes = typeof investmentTypes[number];
export declare const investmentProjectModelsForInvestmentTypes: {
    readonly bond: "investmentProjectBonds";
    readonly equity: "investmentProjectEquity";
    readonly fundShares: "investmentProjectFundShares";
};
export declare const sellOfferModelsForInvestmentTypes: {
    readonly bond: "sellOfferBonds";
    readonly equity: "sellOfferEquity";
    readonly fundShares: "sellOfferFundShares";
};
export declare const investmentModelsForInvestmentTypes: {
    readonly bond: "investmentBonds";
    readonly equity: "investmentEquity";
    readonly fundShares: "investmentFundShares";
};
export declare const investmentTransactionsForInvestmentTypes: {
    readonly bond: "investmentTransactionBonds";
    readonly equity: "investmentTransactionEquity";
    readonly fundShares: "investmentTransactionFundShares";
};
/** Beware with adding a cashback period since it changes functional code */
export type CashbackPeriodTypes = keyof typeof nbMonthForCashbackPeriod;
export declare const nbMonthForCashbackPeriod: {
    monthly: number;
    quarterly: number;
    halfly: number;
    yearly: number;
};
export declare const cashbackPeriodTypes: ("monthly" | "quarterly" | "halfly" | "yearly")[];
export declare const externalLinksLabels: readonly ["smartContract", "detailedPresentation", "ESG", "financialAudit", "legalAudit", "keyInfos", "fundRules", "website", "other"];
export type ExternalLinksLabels = typeof externalLinksLabels[number];
export declare const geographyScope: readonly ["national", "continental", "international", "global"];
export type GeographyScope = typeof geographyScope[number];
export declare const paymentMethods: readonly ["solanaWithWalletConnector", "ethereumWithWalletConnector", "bankTransfer", "erc20CopyPaste", "ethCopyPaste", "solanaCopyPaste", "bitcoinCopyPaste"];
export type PaymentMethods = typeof paymentMethods[number];
export declare const cardTransactionType: readonly ["cardPayment", "contactless", "directDebit", "onlinePayment", "withdrawal", "incoming"];
export type CardTransactionType = typeof cardTransactionType[number];
export declare const blockchains: readonly ["solana", "ethereum", "bitcoin"];
export type Blockchains = typeof blockchains[number];
export declare const defaultLanguage = "en";
export declare const supportedLanguages: readonly ["fr", "en", "ru"];
export type SupportedLanguages = typeof supportedLanguages[number];
export declare const supportedLanguagesWebsiteAndIco: readonly ["fr", "en"];
export type SupportedLanguagesWebsiteAndIco = typeof supportedLanguagesWebsiteAndIco[number];
export declare const euroZoneLanguages: readonly ["fr", "de", "it", "es", "pt", "nl", "pl", "ro", "el", "bg", "cs", "hu", "sv", "fi", "da", "sk", "lt", "sl", "et", "lv", "hr", "mt", "ga", "cy"];
export type EuroZoneLanguages = typeof euroZoneLanguages[number];
export declare const userLockReasons: readonly ["tooMuchPasswordAttempts", "ban", "tooManyAttempsForSecureAuthentication"];
export type UserLockReasons = typeof userLockReasons[number];
/** Types of emails sent by backend for validation */
export declare const emailTypes: readonly ["forgotPassword", "emailValidation", "changeEmail"];
export type EmailTypes = typeof emailTypes[number];
export declare const emailRegexp: RegExp;
export declare const refreshTokenExpirationMinutes = 30;
export declare const vestingConfigFounderId = "f1f0f0f0f0f0f0f0f0f0f0f0";
export declare const vestingConfigPartnerId = "f1f0f0f0f0f0f0f0f0f0f0f1";
export declare const icoTransactionExpiration: number;
export declare const referralCodeLength = 6;
export declare const defaultTransactionIdLength = 8;
export declare const icoTransactionPendingReason: readonly ["fundsNotReceivedYetForUntrackableTx", "requiresManualVerification", "requiresAdditionnalInfos", "fundsNotReceivedYetForTrackableTx", "bankTransferAmountNotCorresponding", "bankTransferCurrencyNotCorresponding", "bankTransferPendingForTooLong"];
export type IcoTransactionPendingReason = typeof icoTransactionPendingReason[number];
export declare const icoTransactionCancelReason: readonly ["relatedTxCancelled", "error", "cancelledByBangkAdmin", "expired", "transactionWithoutHashExpired", "neverProcessed"];
export type IcoTransactionCancelReason = typeof icoTransactionCancelReason[number];
export declare const onReferredFirstTransactionBonusId = "f1f9f3f0f0f0f0f0f0f0f0f0";
export declare const forReferrerOnAllReferredTransactionBonusId = "f1f9f3f0f0f0f0f0f0f0f0f1";
export declare const customBonusIdForTest = "f1f9f3f0f0f0f0f0f0f0f0f2";
export declare const specialEvents: readonly ["navigate", "componentVisible", "componentHidden", "error", "sessionStart"];
export type SpecialEvents = typeof specialEvents[number];
export declare const standardEvent: readonly ["press", "click", "sessionEnd", "pageLeft", "pageReturn"];
export type StandardEvent = typeof standardEvent[number];
export declare const eventNames: ("error" | "navigate" | "componentVisible" | "componentHidden" | "sessionStart" | "press" | "click" | "sessionEnd" | "pageLeft" | "pageReturn")[];
export type EventNames = StandardEvent | SpecialEvents;
export declare const selectedLabel: readonly ["24H", "1W", "1M"];
export type SelectLabel = typeof selectedLabel[number];
export declare const campaignSocialMedia: string[];
/** TODO improve this is used to get authorized iconTypes in models to provide in investmentProject
description and bullet points for example, but this is very large. Also in case an icon hanges, this
list has to be updated manually */
export declare const icons: readonly ["ChevronDown", "DragAndDrop", "ChevronLeft", "ChevronLeftRight", "ChevronRight", "ChevronUp", "ChevronUpDown", "MinusRounded", "PlusRounded", "MediaPlayBackwardBold", "VideoCameraOffBold", "VideoCameraBold", "MediaPlayForwardBold", "MediaNextBold", "MediaPauseBold", "MediaPlayBold", "MediaPreviousBold", "MediaReplayBold", "MediaStopBold", "ComputerScreenBold", "LaptopComputerBold", "GamepadBold", "PhoneBold", "SmartTvBold", "TabletBold", "WatchBold", "SizeDownBold", "SizeUpBold", "DepositBold", "ArrowCaretDownBold", "ExchangeBold", "ReceiveBold", "SendBold", "TransferBold", "ArrowCaretUpBold", "WithdrawBold", "ArrowDownRoundedBold", "ArrowLeftRoundedBold", "ArrowRightRoundedBold", "ArrowUpRoundedBold", "BellBold", "BatteryChargingBold", "MagnifyingGlassRoundedBold", "MagnifyingGlassBold", "SoundMuteBold", "BatteryFullBold", "HideEyeBold", "VolumeHighBold", "VolumeLessBold", "BatteryLowBold", "VolumeLowBold", "BatteryMediumBold", "ZoomOutBold", "BellOnBold", "VolumePlusBold", "ZoomInBold", "VolumeMuteBold", "ViewEyeBold", "BangkStableBold", "BtcBold", "BasketCartBold", "TrashBold", "BluetoothBold", "BookBold", "CalendarBold", "ForbiddenSignBold", "CardContactlessBold", "CardBold", "Chart3linesBold", "Chart2linesBold", "CheckMarkBold", "ClockBold", "CloudBold", "HomeWithWindowBold", "CompassBold", "NoContactlessBold", "ContactlessBold", "CrossCircleBold", "CrowwTriangleBold", "CubeProjectBold", "DiamondBold", "DiscussionBold", "DollarRoundedBold", "ThreeDotsHorizontalRoundedBold", "ThreeDotsVerticalRoundedBold", "DueDateCalendar", "EnergyBold", "EnergyOffBold", "EuroRoundedBold", "ExclamationMarkRoundedBold", "ExclamationMarkTriangleBold", "TimeExpiredBold", "BookmarkOkBold", "RemoveBookmarkBold", "FileBold", "FlagBold", "FolderBold", "FolderOpenBold", "FoodBold", "GalleryBold", "GoldBold", "EarthBold", "HeartSlashBold", "Settings2fadersHorizontalBold", "Settings3fadersHorizontalBold", "HourGlassBold", "HomeWithTwoLinesBold", "InstitutionIbanBold", "IdCardBold", "InfoRoundedBold", "PlantInvestBold", "ListViewBold", "LockClosedBold", "LockOpenBold", "MailBold", "MailModifyBold", "MailSendingBold", "MailMapBold", "MicrophoneOffBold", "MicrophoneOnBold", "PencilBold", "MoonBold", "MusicNoteBold", "MusicNote2bold", "NewCheckedBold", "LightBulbOffBold", "LightBulbBold", "UserProfileBold", "OnlinePaymentWalletBold", "OperationArrowUpDownBold", "CogBold", "PaymentBold", "PhoneBold", "PhoneOffBold", "PhoneRingingBold", "CameraBold", "PieChartBold", "MapMarkerBold", "MapMarkerCheckedBold", "MapMarkerOffBold", "UserProfileRoundedBold", "PuzzlePieceBold", "QuestionMarkRoundedBold", "RocketBold", "SmsSpeechBaloonBold", "BookmarkBold", "SavingsBold", "SecurityKeyRoundedBold", "SendMsgBold", "SendMsgUpBold", "ProfileSettingBold", "ShareViaBold", "SheetBold", "ShieldKeyHoleBold", "SmartContractBold", "HomeNetworkBold", "SnowBold", "LayersBold", "FourSquareTilesBold", "StarBold", "StarSlashBold", "SunBold", "TagBold", "TargetBold", "TelescopeBold", "PeopleGroupThreeBold", "ThumbDownBold", "ThumbUpBold", "TimerBold", "PeopleGroupTwoBold", "VaultBold", "Settings3fadersVerticalBold", "VolatilityBold", "WorldWwwBold", "WalletInvestBold", "WalletBold", "WaterDropBold", "WifiBold", "WithdrawAtmBold", "WorldBold", "AtBold", "DownloadBold", "DoorExitBold", "MinusRoundedBold", "PlusRoundedBold", "MediaPlayBackward", "VideoCameraOff", "VideoCamera", "MediaPlayForward", "MediaNext", "MediaPause", "MediaPlay", "MediaPrevious", "MediaReplay", "MediaStop", "ComputerScreen", "LaptopComputer", "Gamepad", "Phone", "SmartTv", "Tablet", "Watch", "SizeDown", "SizeUp", "Deposit", "ArrowCaretDown", "Exchange", "Receive", "Send", "Transfer", "ArrowCaretUp", "Withdraw", "ArrowDownRounded", "ArrowLeftRounded", "ArrowRightRounded", "ArrowUpRounded", "Bell", "BatteryCharging", "MagnifyingGlassRounded", "MagnifyingGlass", "SoundMute", "BatteryFull", "HideEye", "VolumeHigh", "VolumeLess", "BatteryLow", "VolumeLow", "BatteryMedium", "ZoomOut", "BellOn", "VolumePlus", "ZoomIn", "VolumeMute", "ViewEye", "BangkStable", "Btc", "BasketCart", "Trash", "Bluetooth", "Book", "Calendar", "ForbiddenSign", "CardContactless", "Card", "Chart3lines", "Chart2lines", "CheckMark", "Clock", "Cloud", "HomeWithWindow", "Compass", "NoContactless", "Contactless", "CrossCircle", "CrossTriangle", "CubeProject", "Diamond", "Discussion", "DollarRounded", "ThreeDotsHorizontalRounded", "ThreeDotsVerticalRounded", "ThreeDotsHorizontal", "ThreeDotsVertical", "DueDateCalendar", "Energy", "EnergyOff", "EuroRounded", "ExclamationMarkRounded", "ExclamationMarkTriangle", "TimeExpired", "BookmarkOk", "RemoveBookmark", "File", "Fingerprint", "Flag", "Folder", "FolderOpen", "Food", "Gallery", "Gold", "Earth", "HeartSlash", "Settings2fadersHorizontal", "Settings3fadersHorizontal", "HourGlass", "HomeWithTwoLines", "InstitutionIban", "IdCard", "InfoRounded", "PlantInvest", "BurgerMenuHorizontal", "ListView", "LockClosed", "LockOpen", "Mail", "MailModify", "MailSending", "MailMap", "MicrophoneOff", "MicrophoneOn", "Pencil", "Moon", "MusicNote", "MusicNote2", "NewChecked", "LightBulbOff", "LightBulb", "UserProfile", "OnlinePaymentWallet", "OperationArrowUpDown", "Cog", "Payment", "Phone", "PhoneOff", "PhoneRinging", "Camera", "PieChart", "MapMarker", "MapMarkerChecked", "MapMarkerOff", "UserProfileRounded", "PuzzlePiece", "QuestionMarkRounded", "Rocket", "SmsSpeechBaloon", "Bookmark", "Savings", "SecurityKeyRounded", "SendMsg", "SendMsgUp", "ProfileSetting", "ShareVia", "Sheet", "ShieldKeyHole", "SmartContract", "HomeNetwork", "Snow", "Layers", "FourSquareTiles", "Star", "StarSlash", "Sun", "Tag", "Target", "Telescope", "PeopleGroupThree", "ThumbDown", "ThumbUp", "Timer", "PeopleGroupTwo", "Vault", "Settings3fadersVertical", "Volatility", "WorldWww", "WalletInvest", "Wallet", "WaterDrop", "Wifi", "WithdrawAtm", "World", "At", "Download", "DoorExit", "Attachement", "Cross", "ExternalLink", "Hashtag", "LinkJoint", "LinkJoin2", "Minus", "Next", "Plus", "Previous", "Check"];
export type IconsCompName = typeof icons[number];
export declare const evmNetwork: readonly ["ethereum", "polygon", "bsc", "base"];
export type EvmNetwork = typeof evmNetwork[number];
export declare const blockchainNetwork: readonly ["ethereum", "polygon", "bsc", "base", "solana", "bitcoin"];
export type BlockchainNetwork = typeof blockchainNetwork[number];
export declare const cryptoCurrencySupportedBlockchain: {
    bitcoin: "bitcoin"[];
    ethereum: ("ethereum" | "base")[];
    tether: ("solana" | "ethereum")[];
    'usd-coin': ("solana" | "ethereum" | "polygon" | "base")[];
    binancecoin: "bsc"[];
    solana: "solana"[];
};
export type CryptoCurrencySupportedBlockchain = typeof cryptoCurrencySupportedBlockchain;
export type ContractAddressByCurrency = {
    [K in keyof CryptoCurrencySupportedBlockchain]?: {
        [N in CryptoCurrencySupportedBlockchain[K][number]]?: string;
    };
};
export declare const contractAddressByCurrency: {
    tether: {
        ethereum: "0xdac17f958d2ee523a2206206994597c13d831ec7";
        solana: "Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB";
    };
    'usd-coin': {
        ethereum: "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48";
        base: "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913";
        polygon: "0x3c499c542cef5e3811e1192ce70d8cc03d5c3359";
        solana: "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v";
    };
};
export declare const contractAddressByCurrencyTestnet: {
    tether: {
        ethereum: "0x1c7d4b196cb0c7b01d743fbc6116a902379c7238";
        solana: "4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU";
    };
    'usd-coin': {
        ethereum: "0x1c7d4b196cb0c7b01d743fbc6116a902379c7238";
        base: "0x036CbD53842c5426634e7929541eC2318f3dCF7e";
        polygon: "0x41e94eb019c0762f9bfcf9fb1e58725bfb0e7582";
        solana: "4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU";
    };
};
export declare const evmContractAddressByCurrency: {
    tether: {
        ethereum: "0xdac17f958d2ee523a2206206994597c13d831ec7";
        solana: "Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB";
    };
    'usd-coin': {
        ethereum: "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48";
        base: "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913";
        polygon: "0x3c499c542cef5e3811e1192ce70d8cc03d5c3359";
        solana: "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v";
    };
} | {
    tether: {
        ethereum: "0x1c7d4b196cb0c7b01d743fbc6116a902379c7238";
        solana: "4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU";
    };
    'usd-coin': {
        ethereum: "0x1c7d4b196cb0c7b01d743fbc6116a902379c7238";
        base: "0x036CbD53842c5426634e7929541eC2318f3dCF7e";
        polygon: "0x41e94eb019c0762f9bfcf9fb1e58725bfb0e7582";
        solana: "4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU";
    };
};
