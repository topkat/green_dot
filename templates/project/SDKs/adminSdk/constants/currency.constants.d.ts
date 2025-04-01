export declare const stableCoins: {
    bangkEuro: {
        id: "bangkEuro";
        symbol: "eub";
        img: string;
        decimals: 6;
    };
};
export declare const bangkCoin: {
    bangkCoin: {
        id: "bangkCoin";
        symbol: "bgk";
        img: string;
        decimals: 6;
    };
};
export declare const cryptoCurrencies: {
    tether: {
        id: "tether";
        symbol: "usdt";
        img: string;
        decimals: 6;
    };
    bitcoin: {
        id: "bitcoin";
        symbol: "btc";
        img: string;
        decimals: 8;
    };
    solana: {
        id: "solana";
        symbol: "sol";
        img: string;
        decimals: 9;
    };
    ethereum: {
        id: "ethereum";
        symbol: "eth";
        img: string;
        decimals: 18;
    };
    'usd-coin': {
        id: "usd-coin";
        symbol: "usdc";
        img: string;
        decimals: 6;
    };
    binancecoin: {
        id: "binancecoin";
        symbol: "bnb";
        img: string;
        decimals: 18;
    };
};
export declare const allCurrencies: {
    bangkEuro: {
        id: "bangkEuro";
        symbol: "eub";
        img: string;
        decimals: 6;
    };
    bangkCoin: {
        id: "bangkCoin";
        symbol: "bgk";
        img: string;
        decimals: 6;
    };
    tether: {
        id: "tether";
        symbol: "usdt";
        img: string;
        decimals: 6;
    };
    bitcoin: {
        id: "bitcoin";
        symbol: "btc";
        img: string;
        decimals: 8;
    };
    solana: {
        id: "solana";
        symbol: "sol";
        img: string;
        decimals: 9;
    };
    ethereum: {
        id: "ethereum";
        symbol: "eth";
        img: string;
        decimals: 18;
    };
    'usd-coin': {
        id: "usd-coin";
        symbol: "usdc";
        img: string;
        decimals: 6;
    };
    binancecoin: {
        id: "binancecoin";
        symbol: "bnb";
        img: string;
        decimals: 18;
    };
};
export declare const projectCurrencies: {
    bangkEuro: {
        id: "bangkEuro";
        symbol: "eub";
        img: string;
        decimals: 6;
    };
    bangkCoin: {
        id: "bangkCoin";
        symbol: "bgk";
        img: string;
        decimals: 6;
    };
};
export declare const stableCoinIds: "bangkEuro"[];
export declare const bangkCoinIds: "bangkCoin"[];
export declare const cryptoCurrencyIds: ("tether" | "bitcoin" | "solana" | "ethereum" | "usd-coin" | "binancecoin")[];
export declare const fiatCurrencyIds: readonly ["eur", "usd", "thb", "jpy", "inr", "cny", "try", "mxn", "gbp", "chf", "rub", "pln", "dkk", "ils", "sek", "ars", "php", "brl", "cad", "krw", "nok", "sgd", "huf", "uah", "aud", "zar", "myr", "idr", "hkd", "nzd", "aed"];
export declare const allCryptoCurrencyIds: ("bangkEuro" | "bangkCoin" | "tether" | "bitcoin" | "solana" | "ethereum" | "usd-coin" | "binancecoin")[];
export declare const projectCryptoCurrencyIds: ("bangkEuro" | "bangkCoin")[];
export declare const allCurrencyIds: ("bangkEuro" | "bangkCoin" | "tether" | "bitcoin" | "solana" | "ethereum" | "usd-coin" | "binancecoin" | "eur" | "usd" | "thb" | "jpy" | "inr" | "cny" | "try" | "mxn" | "gbp" | "chf" | "rub" | "pln" | "dkk" | "ils" | "sek" | "ars" | "php" | "brl" | "cad" | "krw" | "nok" | "sgd" | "huf" | "uah" | "aud" | "zar" | "myr" | "idr" | "hkd" | "nzd" | "aed")[];
export declare const icoSupportedCurrencyIds: ("tether" | "bitcoin" | "solana" | "ethereum" | "usd-coin" | "binancecoin" | "eur" | "usd")[];
export declare const icoAndWebsiteDefaultCurrencies: ("eur" | "usd")[];
export declare const supportedErc20CurrencyIds: IcoSupportedCurrencyId[];
export type StableCoinId = keyof typeof stableCoins;
export type BangkCoinId = keyof typeof bangkCoin;
export type CryptoCurrencyId = keyof typeof cryptoCurrencies;
export type FiatCurrencyId = typeof fiatCurrencyIds[number];
export type IcoSupportedCurrencyId = typeof icoSupportedCurrencyIds[number];
export type AllCryptoCurrencyId = StableCoinId | BangkCoinId | CryptoCurrencyId;
export type ProjectCurrencyId = StableCoinId | BangkCoinId;
export type AllCurrencyId = AllCryptoCurrencyId | FiatCurrencyId;
export type IcoAndWebsiteDefaultCurrency = typeof icoAndWebsiteDefaultCurrencies[number];
export type SupportedErc20CurrencyId = typeof supportedErc20CurrencyIds[number];
export type StableCoinSymbols = typeof stableCoins[StableCoinId]['symbol'];
export type BangkCoinSymbol = typeof bangkCoin[BangkCoinId]['symbol'];
export type CryptoCurrencySymbols = typeof cryptoCurrencies[CryptoCurrencyId]['symbol'];
export type AllCurrenciesSymbol = StableCoinSymbols | BangkCoinSymbol | CryptoCurrencySymbols;
export type BlockchainAllowedSymbols = Uppercase<StableCoinSymbols>;
export declare const stableCoinsSymbols: "eub"[];
export declare const bangkCoinSymbol: "bgk"[];
export declare const cryptoCurrenciesSymbols: ("usdt" | "btc" | "sol" | "eth" | "usdc" | "bnb")[];
export declare const allCurrenciesSymbol: ("eub" | "bgk" | ("usdt" | "btc" | "sol" | "eth" | "usdc" | "bnb")[])[];
export type CryptoInfo = typeof allCurrencies[AllCryptoCurrencyId];
export declare const projectCurrencyRateVsEur: {
    bangkEuro: number;
};
