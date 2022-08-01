import { PolywrapClient } from '@polywrap/client-js'
import { InvokeResult } from '@polywrap/client-js'
import { usePolywrapClient } from '@polywrap/react'
import { Currency, CurrencyAmount, TradeType } from '@uniswap/sdk-core'
import { SupportedChainId } from 'constants/chains'
import JSBI from 'jsbi'
import { useEffect, useMemo, useRef, useState } from 'react'
import { TradeState } from 'state/routing/types'

import { currencyDepsSDK, mapTokenAmount, mapTradeType, reverseMapToken } from '../polywrap-utils'
import { CancelablePromise, makeCancelable } from '../polywrap-utils/makeCancelable'
import { useSingleContractWithCallData } from '../state/multicall/hooks'
import { Uni_Module, Uni_Route as Route, Uni_TokenAmount as TokenAmount, Uni_Trade as Trade } from '../wrap'
import { useAllV3Routes } from './useAllV3Routes'
import { useV3Quoter } from './useContract'
import { useActiveWeb3React } from './web3'

const QUOTE_GAS_OVERRIDES: { [chainId: number]: number } = {
  [SupportedChainId.ARBITRUM_ONE]: 25_000_000,
  [SupportedChainId.ARBITRUM_RINKEBY]: 25_000_000,
  [SupportedChainId.POLYGON]: 40_000_000,
  [SupportedChainId.POLYGON_MUMBAI]: 40_000_000,
}

const DEFAULT_GAS_QUOTE = 2_000_000

/**
 * Returns the best v3 trade for a desired swap
 * @param tradeType whether the swap is an exact in/out
 * @param amountSpecified the exact amount to swap in/out
 * @param otherCurrency the desired output/payment currency
 */
export function useClientSideV3Trade<TTradeType extends TradeType>(
  tradeType: TTradeType,
  amountSpecified?: CurrencyAmount<Currency>,
  otherCurrency?: Currency
): { state: TradeState; trade: Trade | undefined } {
  const client: PolywrapClient = usePolywrapClient()

  const [currencyIn, currencyOut] = useMemo(
    () =>
      tradeType === TradeType.EXACT_INPUT
        ? [amountSpecified?.currency, otherCurrency]
        : [otherCurrency, amountSpecified?.currency],
    [tradeType, amountSpecified, ...currencyDepsSDK(otherCurrency)]
  )

  const { routes, loading: routesLoading } = useAllV3Routes(currencyIn, currencyOut)

  const quoter = useV3Quoter()
  const { chainId } = useActiveWeb3React()

  const [callParams, setCallParams] = useState<string[]>([])
  const cancelableCalldata = useRef<CancelablePromise<(string | undefined)[] | undefined>>()

  useEffect(() => {
    cancelableCalldata.current?.cancel()
    if (!amountSpecified) {
      setCallParams([])
      return
    }
    const calldatas = routes.map(async (route) => {
      const invoke = await Uni_Module.quoteCallParameters(
        {
          route,
          amount: mapTokenAmount(amountSpecified) as TokenAmount,
          tradeType: mapTradeType(tradeType),
        },
        client
      )
      if (invoke.error) console.error(invoke.error)
      return invoke.data?.calldata
    })
    cancelableCalldata.current = makeCancelable(Promise.all(calldatas))
    cancelableCalldata.current?.promise.then((params) => {
      if (!params) return
      const definedParams = params.filter((v) => v !== undefined) as string[]
      setCallParams(definedParams)
    })
    return () => cancelableCalldata.current?.cancel()
  }, [amountSpecified, tradeType, routes, client])

  const quotesResults = useSingleContractWithCallData(quoter, callParams, {
    gasRequired: chainId ? QUOTE_GAS_OVERRIDES[chainId] ?? DEFAULT_GAS_QUOTE : undefined,
  })

  const [result, setResult] = useState<{ state: TradeState; trade: Trade | undefined }>({
    state: TradeState.LOADING,
    trade: undefined,
  })
  const cancelableTrade = useRef<CancelablePromise<InvokeResult<Trade> | undefined>>()

  useEffect(() => {
    cancelableTrade.current?.cancel()
    if (
      !amountSpecified ||
      !currencyIn ||
      !currencyOut ||
      quotesResults.some(({ valid }) => !valid) ||
      // skip when tokens are the same
      (tradeType === TradeType.EXACT_INPUT
        ? amountSpecified.currency.equals(currencyOut)
        : amountSpecified.currency.equals(currencyIn))
    ) {
      setResult({
        state: TradeState.INVALID,
        trade: undefined,
      })
      return
    }

    if (routesLoading || quotesResults.some(({ loading }) => loading)) {
      setResult({
        state: TradeState.LOADING,
        trade: undefined,
      })
      return
    }

    const { bestRoute, amountIn, amountOut } = quotesResults.reduce(
      (
        currentBest: {
          bestRoute: Route | null
          amountIn: CurrencyAmount<Currency> | null
          amountOut: CurrencyAmount<Currency> | null
        },
        { result },
        i
      ) => {
        if (!result) return currentBest

        // overwrite the current best if it's not defined or if this route is better
        if (tradeType === TradeType.EXACT_INPUT) {
          const amountOutStr = result.amountOut
          if (!amountOutStr) return currentBest
          const amountOut = CurrencyAmount.fromRawAmount(currencyOut, amountOutStr)
          if (currentBest.amountOut === null || JSBI.lessThan(currentBest.amountOut.quotient, amountOut.quotient)) {
            return {
              bestRoute: routes[i],
              amountIn: amountSpecified,
              amountOut,
            }
          }
        } else {
          const amountInStr = result.amountIn
          if (!amountInStr) return currentBest
          const amountIn = CurrencyAmount.fromRawAmount(currencyIn, amountInStr)
          if (currentBest.amountIn === null || JSBI.greaterThan(currentBest.amountIn.quotient, amountIn.quotient)) {
            return {
              bestRoute: routes[i],
              amountIn,
              amountOut: amountSpecified,
            }
          }
        }

        return currentBest
      },
      {
        bestRoute: null,
        amountIn: null,
        amountOut: null,
      }
    )

    if (!bestRoute || !amountIn || !amountOut) {
      setResult({
        state: TradeState.NO_ROUTE_FOUND,
        trade: undefined,
      })
      return
    }

    // mismatch can occur when token direction is reversed and values change asynchronously
    if (!bestRoute.input || !reverseMapToken(bestRoute.input)?.wrapped.equals(amountIn.currency.wrapped)) {
      return
    }
    if (!bestRoute.output || !reverseMapToken(bestRoute.output)?.wrapped.equals(amountOut.currency.wrapped)) {
      return
    }

    const tradePromise = Uni_Module.createUncheckedTrade(
      {
        swap: {
          route: bestRoute,
          inputAmount: mapTokenAmount(amountIn) as TokenAmount,
          outputAmount: mapTokenAmount(amountOut) as TokenAmount,
        },
        tradeType: mapTradeType(tradeType),
      },
      client
    )
    cancelableTrade.current = makeCancelable(tradePromise)
    cancelableTrade.current?.promise.then((invoke) => {
      if (!invoke) return
      if (invoke.error) {
        console.error(invoke.error)
      } else {
        setResult({
          state: TradeState.VALID,
          trade: invoke.data as Trade,
        })
      }
    })
    return () => cancelableTrade.current?.cancel()
  }, [amountSpecified, currencyIn, currencyOut, quotesResults, routes, routesLoading, tradeType, client])

  return result
}
