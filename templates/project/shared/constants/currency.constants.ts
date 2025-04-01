
import { includes, objKeys } from 'topkat-utils'


//----------------------------------------
// CURRENCIES CONFIGURATIONS
//----------------------------------------

export const stableCoins = {
  bangkEuro: {
    id: 'bangkEuro' as const,
    symbol: 'eub' as const,
    img: 'https://github.com/j0j032/bgk-distant-public-images/blob/main/coinSymbols/eubx4.png?raw=true',
    decimals: 6 as const
  }
} satisfies Record<string, CryptoInfoSoft>

export const bangkCoin = {
  bangkCoin: {
    id: 'bangkCoin' as const,
    symbol: 'bgk' as const,
    img: 'https://github.com/j0j032/bgk-distant-public-images/blob/main/coinSymbols/BGKcoin.png?raw=true',
    decimals: 6 as const
  }
} satisfies Record<string, CryptoInfoSoft>

export const cryptoCurrencies = {
  tether: {
    id: 'tether' as const,
    symbol: 'usdt' as const,
    img: 'https://cryptologos.cc/logos/thumbs/tether.png?v=030',
    decimals: 6 as const
  },
  bitcoin: {
    id: 'bitcoin' as const,
    symbol: 'btc' as const,
    img: 'https://cryptologos.cc/logos/thumbs/bitcoin.png?v=030',
    decimals: 8 as const
  },
  solana: {
    id: 'solana' as const,
    symbol: 'sol' as const,
    img: 'https://cryptologos.cc/logos/thumbs/solana.png?v=030',
    decimals: 9 as const
  },
  ethereum: {
    id: 'ethereum' as const,
    symbol: 'eth' as const,
    img: 'https://cryptologos.cc/logos/thumbs/ethereum.png?v=030',
    decimals: 18 as const
  },
  'usd-coin': {
    id: 'usd-coin' as const,
    symbol: 'usdc' as const,
    img: 'https://cryptologos.cc/logos/thumbs/usd-coin.png?v=030',
    decimals: 6 as const
  },
  binancecoin: {
    id: 'binancecoin' as const,
    symbol: 'bnb' as const,
    img: 'https://cryptologos.cc/logos/thumbs/bnb.png',
    decimals: 18 as const
  }
} satisfies Record<string, CryptoInfoSoft>

export const allCurrencies = {
  ...cryptoCurrencies,
  ...bangkCoin,
  ...stableCoins,
}

export const projectCurrencies = {
  ...bangkCoin,
  ...stableCoins,
}


//==================================================================
//================ INFERRED TYPES AND CONST ========================
//==================================================================

//----------------------------------------
// CURRENCY IDS
//----------------------------------------
export const stableCoinIds = objKeys(stableCoins)
export const bangkCoinIds = objKeys(bangkCoin)
export const cryptoCurrencyIds = objKeys(cryptoCurrencies)
export const fiatCurrencyIds = ['eur', 'usd', 'thb', 'jpy', 'inr', 'cny', 'try', 'mxn', 'gbp', 'chf', 'rub', 'pln', 'dkk', 'ils', 'sek', 'ars', 'php', 'brl', 'cad', 'krw', 'nok', 'sgd', 'huf', 'uah', 'aud', 'zar', 'myr', 'idr', 'hkd', 'nzd', 'aed'] as const
export const allCryptoCurrencyIds = [...stableCoinIds, ...bangkCoinIds, ...cryptoCurrencyIds]
export const projectCryptoCurrencyIds = [...stableCoinIds, ...bangkCoinIds]
export const allCurrencyIds = [...allCryptoCurrencyIds, ...fiatCurrencyIds]
export const icoSupportedCurrencyIds = ['eur', 'tether', 'solana', 'usd', 'ethereum', 'bitcoin', 'usd-coin', 'binancecoin'] satisfies AllCurrencyId[]
export const icoAndWebsiteDefaultCurrencies = ['eur', 'usd'] satisfies AllCurrencyId[]
export const supportedErc20CurrencyIds = ['tether', 'usd-coin'] satisfies IcoSupportedCurrencyId[] as IcoSupportedCurrencyId[]

export type StableCoinId = keyof typeof stableCoins
export type BangkCoinId = keyof typeof bangkCoin
export type CryptoCurrencyId = keyof typeof cryptoCurrencies
export type FiatCurrencyId = typeof fiatCurrencyIds[number]
export type IcoSupportedCurrencyId = typeof icoSupportedCurrencyIds[number]
export type AllCryptoCurrencyId = StableCoinId | BangkCoinId | CryptoCurrencyId
export type ProjectCurrencyId = StableCoinId | BangkCoinId
export type AllCurrencyId = AllCryptoCurrencyId | FiatCurrencyId
export type IcoAndWebsiteDefaultCurrency = typeof icoAndWebsiteDefaultCurrencies[number]
export type SupportedErc20CurrencyId = typeof supportedErc20CurrencyIds[number]

//----------------------------------------
// CURRENCY SYMBOLS
//----------------------------------------
export type StableCoinSymbols = typeof stableCoins[StableCoinId]['symbol']
export type BangkCoinSymbol = typeof bangkCoin[BangkCoinId]['symbol']
export type CryptoCurrencySymbols = typeof cryptoCurrencies[CryptoCurrencyId]['symbol']
export type AllCurrenciesSymbol = StableCoinSymbols | BangkCoinSymbol | CryptoCurrencySymbols

export type BlockchainAllowedSymbols = Uppercase<StableCoinSymbols>

export const stableCoinsSymbols = Object.values(stableCoins).map(a => a.symbol)
export const bangkCoinSymbol = Object.values(bangkCoin).map(a => a.symbol)
export const cryptoCurrenciesSymbols = Object.values(cryptoCurrencies).map(a => a.symbol)
export const allCurrenciesSymbol = [...stableCoinsSymbols, ...bangkCoinSymbol, cryptoCurrenciesSymbols]

//----------------------------------------
// CRYPTO INFOS
//----------------------------------------
export type CryptoInfo = typeof allCurrencies[AllCryptoCurrencyId]





//----------------------------------------
// HELPERS
//----------------------------------------

type CryptoInfoSoft = {
  id: string
  symbol: string
  img: string
  decimals: number
}

export const projectCurrencyRateVsEur = {
  bangkEuro: 1,
} satisfies Record<StableCoinId, number>

// this should never be allowed because leading to potential big leaks
if (fiatCurrencyIds.some(c => includes(allCryptoCurrencyIds, c))) throw Error('DUPLICATE CURRENCY')