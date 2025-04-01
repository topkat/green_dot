"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.projectCurrencyRateVsEur = exports.allCurrenciesSymbol = exports.cryptoCurrenciesSymbols = exports.bangkCoinSymbol = exports.stableCoinsSymbols = exports.supportedErc20CurrencyIds = exports.icoAndWebsiteDefaultCurrencies = exports.icoSupportedCurrencyIds = exports.allCurrencyIds = exports.projectCryptoCurrencyIds = exports.allCryptoCurrencyIds = exports.fiatCurrencyIds = exports.cryptoCurrencyIds = exports.bangkCoinIds = exports.stableCoinIds = exports.projectCurrencies = exports.allCurrencies = exports.cryptoCurrencies = exports.bangkCoin = exports.stableCoins = void 0;
const topkat_utils_1 = require("topkat-utils");
//----------------------------------------
// CURRENCIES CONFIGURATIONS
//----------------------------------------
exports.stableCoins = {
    bangkEuro: {
        id: 'bangkEuro',
        symbol: 'eub',
        img: 'https://github.com/j0j032/bgk-distant-public-images/blob/main/coinSymbols/eubx4.png?raw=true',
        decimals: 6
    }
};
exports.bangkCoin = {
    bangkCoin: {
        id: 'bangkCoin',
        symbol: 'bgk',
        img: 'https://github.com/j0j032/bgk-distant-public-images/blob/main/coinSymbols/BGKcoin.png?raw=true',
        decimals: 6
    }
};
exports.cryptoCurrencies = {
    tether: {
        id: 'tether',
        symbol: 'usdt',
        img: 'https://cryptologos.cc/logos/thumbs/tether.png?v=030',
        decimals: 6
    },
    bitcoin: {
        id: 'bitcoin',
        symbol: 'btc',
        img: 'https://cryptologos.cc/logos/thumbs/bitcoin.png?v=030',
        decimals: 8
    },
    solana: {
        id: 'solana',
        symbol: 'sol',
        img: 'https://cryptologos.cc/logos/thumbs/solana.png?v=030',
        decimals: 9
    },
    ethereum: {
        id: 'ethereum',
        symbol: 'eth',
        img: 'https://cryptologos.cc/logos/thumbs/ethereum.png?v=030',
        decimals: 18
    },
    'usd-coin': {
        id: 'usd-coin',
        symbol: 'usdc',
        img: 'https://cryptologos.cc/logos/thumbs/usd-coin.png?v=030',
        decimals: 6
    },
    binancecoin: {
        id: 'binancecoin',
        symbol: 'bnb',
        img: 'https://cryptologos.cc/logos/thumbs/bnb.png',
        decimals: 18
    }
};
exports.allCurrencies = {
    ...exports.cryptoCurrencies,
    ...exports.bangkCoin,
    ...exports.stableCoins,
};
exports.projectCurrencies = {
    ...exports.bangkCoin,
    ...exports.stableCoins,
};
//==================================================================
//================ INFERRED TYPES AND CONST ========================
//==================================================================
//----------------------------------------
// CURRENCY IDS
//----------------------------------------
exports.stableCoinIds = (0, topkat_utils_1.objKeys)(exports.stableCoins);
exports.bangkCoinIds = (0, topkat_utils_1.objKeys)(exports.bangkCoin);
exports.cryptoCurrencyIds = (0, topkat_utils_1.objKeys)(exports.cryptoCurrencies);
exports.fiatCurrencyIds = ['eur', 'usd', 'thb', 'jpy', 'inr', 'cny', 'try', 'mxn', 'gbp', 'chf', 'rub', 'pln', 'dkk', 'ils', 'sek', 'ars', 'php', 'brl', 'cad', 'krw', 'nok', 'sgd', 'huf', 'uah', 'aud', 'zar', 'myr', 'idr', 'hkd', 'nzd', 'aed'];
exports.allCryptoCurrencyIds = [...exports.stableCoinIds, ...exports.bangkCoinIds, ...exports.cryptoCurrencyIds];
exports.projectCryptoCurrencyIds = [...exports.stableCoinIds, ...exports.bangkCoinIds];
exports.allCurrencyIds = [...exports.allCryptoCurrencyIds, ...exports.fiatCurrencyIds];
exports.icoSupportedCurrencyIds = ['eur', 'tether', 'solana', 'usd', 'ethereum', 'bitcoin', 'usd-coin', 'binancecoin'];
exports.icoAndWebsiteDefaultCurrencies = ['eur', 'usd'];
exports.supportedErc20CurrencyIds = ['tether', 'usd-coin'];
exports.stableCoinsSymbols = Object.values(exports.stableCoins).map(a => a.symbol);
exports.bangkCoinSymbol = Object.values(exports.bangkCoin).map(a => a.symbol);
exports.cryptoCurrenciesSymbols = Object.values(exports.cryptoCurrencies).map(a => a.symbol);
exports.allCurrenciesSymbol = [...exports.stableCoinsSymbols, ...exports.bangkCoinSymbol, exports.cryptoCurrenciesSymbols];
exports.projectCurrencyRateVsEur = {
    bangkEuro: 1,
};
// this should never be allowed because leading to potential big leaks
if (exports.fiatCurrencyIds.some(c => (0, topkat_utils_1.includes)(exports.allCryptoCurrencyIds, c)))
    throw Error('DUPLICATE CURRENCY');
//# sourceMappingURL=currency.constants.js.map