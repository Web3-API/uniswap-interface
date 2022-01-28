import {
  Currency as UniCurrency,
  CurrencyAmount as UniCurrencyAmount,
  Ether,
  Price as UniPrice,
  Token as UniToken,
  TradeType as UniTradeType,
} from '@uniswap/sdk-core'
import {
  FeeAmount as UniFeeAmount,
  Pool as UniPool,
  Position as UniPosition,
  Route as UniRoute,
  Trade as UniTrade,
} from '@uniswap/v3-sdk'

import {
  ChainId,
  ChainIdEnum,
  FeeAmount,
  FeeAmountEnum,
  Pool,
  Position,
  Price,
  Route,
  Token,
  TokenAmount,
  Trade,
  TradeType,
  TradeTypeEnum,
} from '../polywrap'
import { isEther } from './utils'

export function reverseMapChainId(input: ChainId | number): number {
  switch (input) {
    case ChainIdEnum.MAINNET || 'MAINNET':
      return 1
    case ChainIdEnum.ROPSTEN || 'ROPSTEN':
      return 3
    case ChainIdEnum.RINKEBY || 'RINKEBY':
      return 4
    case ChainIdEnum.GOERLI || 'GOERLI':
      return 5
    case ChainIdEnum.KOVAN || 'KOVAN':
      return 42
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
  return UniCurrencyAmount.fromRawAmount(reverseMapToken(input.token)!, input.amount)
}

export function reverseMapFeeAmount(input: FeeAmount): UniFeeAmount {
  switch (input) {
    case FeeAmountEnum.LOWEST || 'LOWEST':
      return UniFeeAmount.LOWEST
    case FeeAmountEnum.LOW || 'LOW':
      return UniFeeAmount.LOW
    case FeeAmountEnum.MEDIUM || 'MEDIUM':
      return UniFeeAmount.MEDIUM
    case FeeAmountEnum.HIGH || 'HIGH':
      return UniFeeAmount.HIGH
    default:
      throw Error('Unrecognized fee amount: ' + input.toString())
  }
}

export function reverseMapPool(input: Pool): UniPool {
  return new UniPool(
    reverseMapToken(input.token0) as UniToken,
    reverseMapToken(input.token1) as UniToken,
    reverseMapFeeAmount(input.fee),
    input.sqrtRatioX96,
    input.liquidity,
    input.tickCurrent,
    input.tickDataProvider?.ticks
  )
}

export function reverseMapPools(input: Pool[]): UniPool[] {
  return input.map(reverseMapPool)
}

export async function reverseMapPosition(input: Position): Promise<UniPosition> {
  return new UniPosition({
    pool: reverseMapPool(input.pool),
    tickLower: input.tickLower,
    tickUpper: input.tickUpper,
    liquidity: input.liquidity,
  })
}

export function reverseMapRoute(input: Route): UniRoute<UniCurrency, UniCurrency> {
  return new UniRoute(reverseMapPools(input.pools), reverseMapToken(input.input)!, reverseMapToken(input.output)!)
}

export function reverseMapTradeType(input: TradeType): UniTradeType {
  if (input === TradeTypeEnum.EXACT_OUTPUT || 'EXACT_OUTPUT') {
    return UniTradeType.EXACT_OUTPUT
  }
  return UniTradeType.EXACT_INPUT
}

export function reverseMapTrade<TType extends UniTradeType>(input: Trade): UniTrade<UniCurrency, UniCurrency, TType> {
  return UniTrade.createUncheckedTradeWithMultipleRoutes({
    routes: input.swaps.map((swap) => ({
      route: reverseMapRoute(swap.route),
      inputAmount: reverseMapTokenAmount(swap.inputAmount)!,
      outputAmount: reverseMapTokenAmount(swap.outputAmount)!,
    })),
    tradeType: reverseMapTradeType(input.tradeType) as TType,
  })
}

export function reverseMapPrice<TBase extends UniCurrency = UniCurrency, TQuote extends UniCurrency = UniCurrency>(
  input: Price
): UniPrice<TBase, TQuote> {
  const baseCurrency = reverseMapToken(input.baseToken) as TBase
  const quoteCurrency = reverseMapToken(input.quoteToken) as TQuote
  return new UniPrice(baseCurrency, quoteCurrency, input.denominator, input.numerator)
}
