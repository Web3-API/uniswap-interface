import {
  Currency as UniCurrency,
  CurrencyAmount as UniCurrencyAmount,
  Ether,
  Price as UniPrice,
  Token as UniToken,
  TradeType as UniTradeType,
} from '@uniswap/sdk-core'

import {
  Uni_ChainId as ChainId,
  Uni_ChainIdEnum as ChainIdEnum,
  Uni_FeeAmount as FeeAmount,
  Uni_FeeAmountEnum as FeeAmountEnum,
  Uni_Price as Price,
  Uni_Token as Token,
  Uni_TokenAmount as TokenAmount,
  Uni_TradeType as TradeType,
  Uni_TradeTypeEnum as TradeTypeEnum,
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

// export function reverseMapPool(input: Pool): UniPool {
//   return new UniPool(
//     reverseMapToken(input.token0) as UniToken,
//     reverseMapToken(input.token1) as UniToken,
//     reverseMapFeeAmount(input.fee),
//     input.sqrtRatioX96,
//     input.liquidity,
//     input.tickCurrent,
//     input.tickDataProvider
//   )
// }
//
// export function reverseMapPools(input: Pool[]): UniPool[] {
//   return input.map(reverseMapPool)
// }
//
// export async function reverseMapPosition(input: Position): Promise<UniPosition> {
//   return new UniPosition({
//     pool: reverseMapPool(input.pool),
//     tickLower: input.tickLower,
//     tickUpper: input.tickUpper,
//     liquidity: input.liquidity,
//   })
// }
//
// export function reverseMapRoute(input: Route): UniRoute<UniCurrency, UniCurrency> {
//   return new UniRoute(reverseMapPools(input.pools), reverseMapToken(input.input)!, reverseMapToken(input.output)!)
// }

export function reverseMapTradeType(input: TradeType): UniTradeType {
  if (input === TradeTypeEnum.EXACT_OUTPUT || 'EXACT_OUTPUT') {
    return UniTradeType.EXACT_OUTPUT
  }
  return UniTradeType.EXACT_INPUT
}

// export function reverseMapTrade<TType extends UniTradeType>(input: Trade): UniTrade<UniCurrency, UniCurrency, TType> {
//   return UniTrade.createUncheckedTradeWithMultipleRoutes({
//     routes: input.swaps.map((swap) => ({
//       route: reverseMapRoute(swap.route),
//       inputAmount: reverseMapTokenAmount(swap.inputAmount)!,
//       outputAmount: reverseMapTokenAmount(swap.outputAmount)!,
//     })),
//     tradeType: reverseMapTradeType(input.tradeType) as TType,
//   })
// }

export function reverseMapPrice<TBase extends UniCurrency = UniCurrency, TQuote extends UniCurrency = UniCurrency>(
  input: Price
): UniPrice<TBase, TQuote> {
  const baseCurrency = reverseMapToken(input.baseToken) as TBase
  const quoteCurrency = reverseMapToken(input.quoteToken) as TQuote
  return new UniPrice(baseCurrency, quoteCurrency, input.denominator, input.numerator)
}
