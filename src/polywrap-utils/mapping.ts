import {
  Currency as UniCurrency,
  CurrencyAmount as UniCurrencyAmount,
  Price as UniPrice,
  Token as UniToken,
  TradeType as UniTradeType,
} from '@uniswap/sdk-core'

import {
  Uni_ChainIdEnum as ChainIdEnum,
  Uni_Currency as Currency,
  Uni_FeeAmountEnum as FeeAmountEnum,
  Uni_Price as Price,
  Uni_Token as Token,
  Uni_TokenAmount as TokenAmount,
  Uni_TradeTypeEnum as TradeTypeEnum,
} from '../wrap'

export function mapChainId(input: number): ChainIdEnum {
  switch (input) {
    case 1:
      return ChainIdEnum.MAINNET
    case 3:
      return ChainIdEnum.ROPSTEN
    case 4:
      return ChainIdEnum.RINKEBY
    case 5:
      return ChainIdEnum.GOERLI
    case 42:
      return ChainIdEnum.KOVAN
    case 10:
      return ChainIdEnum.OPTIMISM
    case 69:
      return ChainIdEnum.OPTIMISTIC_KOVAN
    case 42161:
      return ChainIdEnum.ARBITRUM_ONE
    case 421611:
      return ChainIdEnum.ARBITRUM_RINKEBY
    case 137:
      return ChainIdEnum.POLYGON
    case 80001:
      return ChainIdEnum.POLYGON_MUMBAI
    default:
      throw new Error('Unknown chain ID. This should never happen.')
  }
}

export function mapCurrency(input: UniCurrency): Currency {
  return {
    decimals: input.decimals,
    symbol: input.symbol ?? null,
    name: input.name ?? null,
  }
}

export function mapToken(input: UniToken | UniCurrency): Token {
  if ('address' in input) {
    return {
      chainId: mapChainId(input.chainId),
      address: input.address,
      currency: mapCurrency(input),
    }
  }
  return {
    chainId: mapChainId(input.chainId),
    address: '',
    currency: mapCurrency(input),
  }
}

export function mapTokenAmount<T extends UniCurrency>(input?: UniCurrencyAmount<T>): TokenAmount | undefined {
  if (!input) return undefined
  return {
    token: mapToken(input.currency),
    amount: input.numerator.toString(),
  }
}

export function mapFeeAmount(input: string | number): FeeAmountEnum {
  switch (input) {
    case 100:
    case '100':
      return FeeAmountEnum.LOWEST
    case 500:
    case '500':
      return FeeAmountEnum.LOW
    case 3000:
    case '3000':
      return FeeAmountEnum.MEDIUM
    case 10000:
    case '10000':
      return FeeAmountEnum.HIGH
    default:
      throw Error('unknown fee amount')
  }
}

export function mapTradeType(input: UniTradeType): TradeTypeEnum {
  if (input === UniTradeType.EXACT_OUTPUT) {
    return TradeTypeEnum.EXACT_OUTPUT
  }
  return TradeTypeEnum.EXACT_INPUT
}

export function mapPrice<TBase extends UniCurrency, TQuote extends UniCurrency>(price: UniPrice<TBase, TQuote>): Price {
  return {
    baseToken: mapToken(price.baseCurrency),
    quoteToken: mapToken(price.quoteCurrency),
    denominator: price.denominator.toString(),
    numerator: price.numerator.toString(),
    price: price.toFixed(18),
  }
}
