import { Currency, CurrencyAmount, Token as UniToken, TradeType } from '@uniswap/sdk-core'
import { Pair, Route as V2Route } from '@uniswap/v2-sdk'

import { nativeOnChain } from '../../constants/tokens'
import { PolywrapDapp, Pool, Token, TokenAmount, TradeTypeEnum, Uniswap } from '../../polywrap'
import {
  mapChainId,
  mapFeeAmount,
  mapToken,
  mapTokenAmount,
  mapTradeType,
  useAsync,
  usePolywrapDapp,
} from '../../polywrap-utils'
import { GetQuoteResult, InterfaceTrade, V2PoolInRoute, V3PoolInRoute } from './types'

/**
 * Transforms a Routing API quote into an array of routes that can be used to create
 * a `Trade`.
 */
export function computeRoutes(
  currencyIn: Currency | undefined,
  currencyOut: Currency | undefined,
  tradeType: TradeType,
  quoteResult: Pick<GetQuoteResult, 'route'> | undefined
) {
  if (!quoteResult || !quoteResult.route || !currencyIn || !currencyOut) return undefined

  if (quoteResult.route.length === 0) return []

  const parsedTokenIn = parseUniToken(quoteResult.route[0][0].tokenIn)
  const parsedTokenOut = parseUniToken(quoteResult.route[0][quoteResult.route[0].length - 1].tokenOut)

  if (parsedTokenIn.address !== currencyIn.wrapped.address) return undefined
  if (parsedTokenOut.address !== currencyOut.wrapped.address) return undefined

  const parsedCurrencyIn = currencyIn.isNative ? nativeOnChain(currencyIn.chainId) : parsedTokenIn

  const parsedCurrencyOut = currencyOut.isNative ? nativeOnChain(currencyOut.chainId) : parsedTokenOut

  try {
    return quoteResult.route.map((route) => {
      if (route.length === 0) {
        throw new Error('Expected route to have at least one pair or pool')
      }
      const rawAmountIn = route[0].amountIn
      const rawAmountOut = route[route.length - 1].amountOut

      if (!rawAmountIn || !rawAmountOut) {
        throw new Error('Expected both amountIn and amountOut to be present')
      }

      const dapp: PolywrapDapp = usePolywrapDapp()
      const routev3 = useAsync(
        async () => {
          if (isV3Route(route)) {
            return dapp.uniswap.query.createRoute({
              pools: await Promise.all(route.map((route) => parsePool(dapp.uniswap, route))),
              inToken: mapToken(parsedCurrencyIn),
              outToken: mapToken(parsedCurrencyOut),
            })
          }
          return null
        },
        [route, parsedCurrencyIn, parsedCurrencyOut, dapp],
        null
      )

      return {
        routev3,
        routev2: !isV3Route(route) ? new V2Route(route.map(parsePair), parsedCurrencyIn, parsedCurrencyOut) : null,
        inputAmount: CurrencyAmount.fromRawAmount(parsedCurrencyIn, rawAmountIn),
        outputAmount: CurrencyAmount.fromRawAmount(parsedCurrencyOut, rawAmountOut),
      }
    })
  } catch (e) {
    // `Route` constructor may throw if inputs/outputs are temporarily out of sync
    // (RTK-Query always returns the latest data which may not be the right inputs/outputs)
    // This is not fatal and will fix itself in future render cycles
    console.error(e)
    return undefined
  }
}

export async function transformRoutesToTrade<TTradeType extends TradeType>(
  uni: Uniswap,
  route: ReturnType<typeof computeRoutes>,
  tradeType: TTradeType,
  gasUseEstimateUSD?: CurrencyAmount<UniToken> | null
): Promise<InterfaceTrade<Currency, Currency, TTradeType>> {
  return new InterfaceTrade({
    v2Routes:
      route
        ?.filter((r): r is typeof route[0] & { routev2: NonNullable<typeof route[0]['routev2']> } => r.routev2 !== null)
        .map(({ routev2, inputAmount, outputAmount }) => ({ routev2, inputAmount, outputAmount })) ?? [],
    v3Routes: [],
    polyTrade: await uni.query.createTradeFromRoutes({
      tradeRoutes:
        route
          ?.filter(
            (r): r is typeof route[0] & { routev3: NonNullable<typeof route[0]['routev3']> } => r.routev3 !== null
          )
          .map(({ routev3, inputAmount, outputAmount }) => ({
            route: routev3,
            amount: (mapTradeType(tradeType) === TradeTypeEnum.EXACT_INPUT
              ? mapTokenAmount(inputAmount)
              : mapTokenAmount(outputAmount)) as TokenAmount,
          })) ?? [],
      tradeType: mapTradeType(tradeType),
    }),
    tradeType,
    gasUseEstimateUSD,
  })
}

const parseUniToken = ({ address, chainId, decimals, symbol }: GetQuoteResult['route'][0][0]['tokenIn']): UniToken => {
  return new UniToken(chainId, address, parseInt(decimals.toString()), symbol)
}

const parseToken = ({ address, chainId, decimals, symbol }: GetQuoteResult['route'][0][0]['tokenIn']): Token => {
  return {
    chainId: mapChainId(chainId),
    address,
    currency: {
      decimals: parseInt(decimals.toString()),
      symbol,
    },
  }
}

const parsePool = async (
  uni: Uniswap,
  { fee, sqrtRatioX96, liquidity, tickCurrent, tokenIn, tokenOut }: V3PoolInRoute
): Promise<Pool> =>
  uni.query.createPool({
    tokenA: parseToken(tokenIn),
    tokenB: parseToken(tokenOut),
    fee: mapFeeAmount(fee),
    sqrtRatioX96,
    liquidity,
    tickCurrent: parseInt(tickCurrent),
  })

const parsePair = ({ reserve0, reserve1 }: V2PoolInRoute): Pair =>
  new Pair(
    CurrencyAmount.fromRawAmount(parseUniToken(reserve0.token), reserve0.quotient),
    CurrencyAmount.fromRawAmount(parseUniToken(reserve1.token), reserve1.quotient)
  )

function isV3Route(route: V3PoolInRoute[] | V2PoolInRoute[]): route is V3PoolInRoute[] {
  return route[0].type === 'v3-pool'
}
