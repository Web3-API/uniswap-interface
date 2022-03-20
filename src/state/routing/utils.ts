import { Currency, CurrencyAmount, NativeCurrency, Token as UniToken, TradeType } from '@uniswap/sdk-core'
import { Pair, Route as V2Route } from '@uniswap/v2-sdk'
import { Web3ApiClient } from '@web3api/client-js'

import { nativeOnChain } from '../../constants/tokens'
import {
  Uni_Pool as Pool,
  Uni_Query,
  Uni_Route,
  Uni_Token as Token,
  Uni_TokenAmount as TokenAmount,
  Uni_Trade,
  Uni_TradeTypeEnum as TradeTypeEnum,
} from '../../polywrap'
import { mapChainId, mapFeeAmount, mapToken, mapTokenAmount, mapTradeType } from '../../polywrap-utils'
import { GetQuoteResult, InterfaceTrade, V2PoolInRoute, V3PoolInRoute } from './types'

/**
 * Transforms a Routing API quote into an array of routes that can be used to create
 * a `Trade`.
 */
export async function computeRoutes(
  client: Web3ApiClient,
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
    const routes = quoteResult.route.map(async (route) => {
      if (route.length === 0) {
        throw new Error('Expected route to have at least one pair or pool')
      }
      const rawAmountIn = route[0].amountIn
      const rawAmountOut = route[route.length - 1].amountOut

      if (!rawAmountIn || !rawAmountOut) {
        throw new Error('Expected both amountIn and amountOut to be present')
      }

      let routev3 = null
      if (isV3Route(route)) {
        const routeInvoke = await Uni_Query.createRoute(
          {
            pools: await Promise.all(route.map((route) => parsePool(client, route))),
            inToken: mapToken(parsedCurrencyIn),
            outToken: mapToken(parsedCurrencyOut),
          },
          client
        )
        if (routeInvoke.error) throw routeInvoke.error
        routev3 = routeInvoke.data ?? null
      }

      return {
        routev3,
        routev2: !isV3Route(route) ? new V2Route(route.map(parsePair), parsedCurrencyIn, parsedCurrencyOut) : null,
        inputAmount: CurrencyAmount.fromRawAmount(parsedCurrencyIn, rawAmountIn),
        outputAmount: CurrencyAmount.fromRawAmount(parsedCurrencyOut, rawAmountOut),
      }
    })
    return Promise.all(routes)
  } catch (e) {
    // `Route` constructor may throw if inputs/outputs are temporarily out of sync
    // (RTK-Query always returns the latest data which may not be the right inputs/outputs)
    // This is not fatal and will fix itself in future render cycles
    console.error(e)
    return undefined
  }
}

export async function transformRoutesToTrade<TTradeType extends TradeType>(
  client: Web3ApiClient,
  route:
    | {
        routev3: Uni_Route | null
        routev2: V2Route<NativeCurrency | UniToken, NativeCurrency | UniToken> | null
        inputAmount: CurrencyAmount<NativeCurrency | UniToken>
        outputAmount: CurrencyAmount<NativeCurrency | UniToken>
      }[]
    | undefined,
  tradeType: TTradeType,
  gasUseEstimateUSD?: CurrencyAmount<UniToken> | null
): Promise<InterfaceTrade<Currency, Currency, TTradeType>> {
  const polyTradeInvoke = await Uni_Query.createTradeFromRoutes(
    {
      tradeRoutes:
        route
          ?.filter((r) => r.routev3 !== null)
          .map(({ routev3, inputAmount, outputAmount }) => ({
            route: routev3 as Uni_Route,
            amount: (mapTradeType(tradeType) === TradeTypeEnum.EXACT_INPUT
              ? mapTokenAmount(inputAmount)
              : mapTokenAmount(outputAmount)) as TokenAmount,
          })) ?? [],
      tradeType: mapTradeType(tradeType),
    },
    client
  )
  if (polyTradeInvoke.error) throw polyTradeInvoke.error
  const polyTrade = polyTradeInvoke.data as Uni_Trade

  return new InterfaceTrade({
    v2Routes:
      route
        ?.filter((r): r is typeof route[0] & { routev2: NonNullable<typeof route[0]['routev2']> } => r.routev2 !== null)
        .map(({ routev2, inputAmount, outputAmount }) => ({ routev2, inputAmount, outputAmount })) ?? [],
    v3Routes: [],
    polyTrade,
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
  client: Web3ApiClient,
  { fee, sqrtRatioX96, liquidity, tickCurrent, tokenIn, tokenOut }: V3PoolInRoute
): Promise<Pool> => {
  const poolInvoke = await Uni_Query.createPool(
    {
      tokenA: parseToken(tokenIn),
      tokenB: parseToken(tokenOut),
      fee: mapFeeAmount(fee),
      sqrtRatioX96,
      liquidity,
      tickCurrent: parseInt(tickCurrent),
    },
    client
  )
  if (poolInvoke.error) throw poolInvoke.error
  return poolInvoke.data as Pool
}
const parsePair = ({ reserve0, reserve1 }: V2PoolInRoute): Pair =>
  new Pair(
    CurrencyAmount.fromRawAmount(parseUniToken(reserve0.token), reserve0.quotient),
    CurrencyAmount.fromRawAmount(parseUniToken(reserve1.token), reserve1.quotient)
  )

function isV3Route(route: V3PoolInRoute[] | V2PoolInRoute[]): route is V3PoolInRoute[] {
  return route[0].type === 'v3-pool'
}
