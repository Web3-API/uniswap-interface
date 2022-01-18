import {
  Currency as UniCurrency,
  CurrencyAmount as UniCurrencyAmount,
  Ether,
  Token as UniToken,
  TradeType as UniTradeType,
} from '@uniswap/sdk-core'
import {
  FeeAmount as UniFeeAmount,
  Pool as UniPool,
  Route as UniRoute,
  Tick as UniTick,
  TickDataProvider as UniTickDataProvider,
  TickMath,
  Trade as UniTrade,
} from '@uniswap/v3-sdk'

import {
  ChainId,
  ChainIdEnum,
  Currency,
  FeeAmount,
  FeeAmountEnum,
  Pool,
  Route,
  Tick,
  Token,
  TokenAmount,
  Trade,
  TradeType,
  TradeTypeEnum,
} from '../polywrap'
import { ETHER } from './constants'
import { currencyEquals, isEther } from './utils'

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
    default:
      throw new Error('Unknown chain ID. This should never happen.')
  }
}

export function mapCurrency(input: UniCurrency): Currency {
  return {
    decimals: input.decimals,
    symbol: input.symbol,
    name: input.name,
  }
}

export function mapToken(input: UniToken | UniCurrency, backupChainId?: number): Token {
  const currency = mapCurrency(input)
  if (input instanceof UniToken) {
    return {
      chainId: mapChainId(input.chainId),
      address: currencyEquals(currency, ETHER) ? '' : input.address,
      currency,
    }
  }
  return {
    chainId: backupChainId ? mapChainId(backupChainId) : 999,
    address: '',
    currency,
  }
}

export function mapTokenAmount<T extends UniCurrency>(
  input?: UniCurrencyAmount<T>,
  backupChainId?: number
): TokenAmount | undefined {
  if (!input) return undefined
  return {
    token: mapToken(input.currency, backupChainId),
    amount: input.numerator.toString(),
  }
}

export async function mapPool(input: UniPool): Promise<Pool> {
  return {
    token0: mapToken(input.token0),
    token1: mapToken(input.token1),
    fee: mapFeeAmount(input.fee),
    sqrtRatioX96: input.sqrtRatioX96.toString(),
    liquidity: input.liquidity.toString(),
    tickCurrent: input.tickCurrent,
    tickDataProvider: {
      ticks: await mapTicks(input.tickDataProvider, input.tickSpacing),
    },
  }
}

function mapFeeAmount(input: UniFeeAmount): FeeAmount {
  switch (input) {
    case UniFeeAmount.LOWEST:
      return FeeAmountEnum.LOWEST
    case UniFeeAmount.LOW:
      return FeeAmountEnum.LOW
    case UniFeeAmount.MEDIUM:
      return FeeAmountEnum.MEDIUM
    case UniFeeAmount.HIGH:
      return FeeAmountEnum.HIGH
  }
}

async function mapTicks(provider: UniTickDataProvider, spacing: number): Promise<Tick[]> {
  const ticks: Tick[] = []
  for (
    let i = TickMath.MIN_TICK - 1;
    i < TickMath.MAX_TICK;
    i = (await provider.nextInitializedTickWithinOneWord(i, false, spacing))[0]
  ) {
    const uniTick: UniTick = (await provider.getTick(i)) as UniTick
    ticks.push({
      index: uniTick.index,
      liquidityGross: uniTick.liquidityGross.toString(),
      liquidityNet: uniTick.liquidityNet.toString(),
    })
  }
  return ticks
}

export async function mapPools(input: UniPool[]): Promise<Pool[]> {
  return Promise.all(input.map(mapPool))
}

export async function mapRoute<TIn extends UniCurrency, TOut extends UniCurrency>(
  input: UniRoute<TIn, TOut>
): Promise<Route> {
  return {
    pools: await mapPools(input.pools),
    path: input.tokenPath.map(mapToken),
    input: mapToken(input.input),
    output: mapToken(input.output),
  }
}

export function mapTradeType(input: UniTradeType): TradeTypeEnum {
  if (input === UniTradeType.EXACT_OUTPUT) {
    return TradeTypeEnum.EXACT_OUTPUT
  }
  return TradeTypeEnum.EXACT_INPUT
}

export async function mapTrade<TIn extends UniCurrency, TOut extends UniCurrency, TType extends UniTradeType>(
  input: UniTrade<TIn, TOut, TType>
): Promise<Trade> {
  const swapPromises = input.swaps.map(async (swap) => ({
    route: await mapRoute(swap.route),
    inputAmount: mapTokenAmount(swap.inputAmount)!,
    outputAmount: mapTokenAmount(swap.outputAmount)!,
  }))
  const executionPrice = {
    baseToken: mapToken(input.executionPrice.baseCurrency),
    quoteToken: mapToken(input.executionPrice.quoteCurrency),
    denominator: input.executionPrice.denominator.toString(),
    numerator: input.executionPrice.numerator.toString(),
    price: input.executionPrice.toFixed(19),
  }
  return {
    swaps: await Promise.all(swapPromises),
    tradeType: mapTradeType(input.tradeType),
    inputAmount: mapTokenAmount(input.inputAmount)!,
    outputAmount: mapTokenAmount(input.outputAmount)!,
    executionPrice,
    priceImpact: input.priceImpact.toFixed(19),
  }
}

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

function reverseMapFeeAmount(input: FeeAmount): UniFeeAmount {
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

export function reverseMapPools(input: Pool[]): UniPool[] {
  return input.map(reverseMapPool)
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
