import {
  Currency as UniCurrency,
  CurrencyAmount as UniCurrencyAmount,
  Ether,
  Price as UniPrice,
  Token as UniToken,
} from '@uniswap/sdk-core'

import {
  Uni_ChainId as ChainId,
  Uni_ChainIdEnum as ChainIdEnum,
  Uni_FeeAmount as FeeAmount,
  Uni_FeeAmountEnum as FeeAmountEnum,
  Uni_Price as Price,
  Uni_Token as Token,
  Uni_TokenAmount as TokenAmount,
} from '../polywrap'
import { isEther } from './utils'

export function reverseMapChainId(input: ChainId | number): number {
  switch (input) {
    case 'MAINNET':
    case ChainIdEnum.MAINNET:
      return 1
    case 'ROPSTEN':
    case ChainIdEnum.ROPSTEN:
      return 3
    case 'RINKEBY':
    case ChainIdEnum.RINKEBY:
      return 4
    case 'GOERLI':
    case ChainIdEnum.GOERLI:
      return 5
    case 'KOVAN':
    case ChainIdEnum.KOVAN:
      return 42
    case 'OPTIMISM':
    case ChainIdEnum.OPTIMISM:
      return 10
    case 'OPTIMISM_KOVAN':
    case ChainIdEnum.OPTIMISM_KOVAN:
      return 69
    case 'ARBITRUM_ONE':
    case ChainIdEnum.ARBITRUM_ONE:
      return 42161
    case 'ARBITRUM_ONE_RINKEBY':
    case ChainIdEnum.ARBITRUM_ONE_RINKEBY:
      return 421611
    default:
      throw new Error('Unknown chain ID. This should never happen.')
  }
}

export function reverseMapToken(input?: Token): UniCurrency | undefined {
  if (!input) return undefined
  if (isEther(input)) {
    return Ether.onChain(reverseMapChainId(input.chainId))
  }
  return new UniToken(
    reverseMapChainId(input.chainId as ChainIdEnum),
    input.address,
    input.currency.decimals,
    input.currency.symbol ?? undefined,
    input.currency.name ?? undefined
  )
}

export function reverseMapTokenAmount(input?: TokenAmount): UniCurrencyAmount<UniCurrency> | undefined {
  if (!input) return undefined
  return UniCurrencyAmount.fromRawAmount(reverseMapToken(input.token) as UniCurrency, input.amount)
}

export function reverseMapFeeAmount(input: FeeAmount): number {
  switch (input) {
    case 'LOWEST':
    case FeeAmountEnum.LOWEST:
      return 100
    case 'LOW':
    case FeeAmountEnum.LOW:
      return 500
    case 'MEDIUM':
    case FeeAmountEnum.MEDIUM:
      return 3000
    case 'HIGH':
    case FeeAmountEnum.HIGH:
      return 10000
    default:
      throw Error('Unrecognized fee amount')
  }
}

export function reverseMapPrice<TBase extends UniCurrency = UniCurrency, TQuote extends UniCurrency = UniCurrency>(
  input: Price
): UniPrice<TBase, TQuote> {
  const baseCurrency = reverseMapToken(input.baseToken) as TBase
  const quoteCurrency = reverseMapToken(input.quoteToken) as TQuote
  return new UniPrice(baseCurrency, quoteCurrency, input.denominator, input.numerator)
}
