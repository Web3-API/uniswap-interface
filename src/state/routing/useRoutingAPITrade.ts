import { PolywrapClient } from '@polywrap/client-js'
import { usePolywrapClient } from '@polywrap/react'
import { skipToken } from '@reduxjs/toolkit/query/react'
import { Currency, CurrencyAmount, Token, TradeType } from '@uniswap/sdk-core'
import { IMetric, MetricLoggerUnit, setGlobalMetric } from '@uniswap/smart-order-router'
import { sendTiming } from 'components/analytics'
import { useStablecoinAmountFromFiatValue } from 'hooks/useStablecoinPrice'
import { useRoutingAPIArguments } from 'lib/hooks/routing/useRoutingAPIArguments'
import useIsValidBlock from 'lib/hooks/useIsValidBlock'
import ms from 'ms.macro'
import { useEffect, useMemo, useRef, useState } from 'react'
import { useGetQuoteQuery } from 'state/routing/slice'

import { ExtendedTrade } from '../../polywrap-utils/interfaces'
import { CancelablePromise, makeCancelable } from '../../polywrap-utils/makeCancelable'
import { GetQuoteResult, TradeState } from './types'
import { computeRoutes, transformRoutesToTrade } from './utils'

/**
 * Returns the best trade by invoking the routing api or the smart order router on the client
 * @param tradeType whether the swap is an exact in/out
 * @param amountSpecified the exact amount to swap in/out
 * @param otherCurrency the desired output/payment currency
 */
export function useRoutingAPITrade<TTradeType extends TradeType>(
  tradeType: TTradeType,
  amountSpecified?: CurrencyAmount<Currency>,
  otherCurrency?: Currency
): {
  state: TradeState
  trade?: ExtendedTrade
  gasUseEstimateUSD?: CurrencyAmount<Token> | null
} {
  const [currencyIn, currencyOut]: [Currency | undefined, Currency | undefined] = useMemo(
    () =>
      tradeType === TradeType.EXACT_INPUT
        ? [amountSpecified?.currency, otherCurrency]
        : [otherCurrency, amountSpecified?.currency],
    [amountSpecified, otherCurrency, tradeType]
  )

  const queryArgs = useRoutingAPIArguments({
    tokenIn: currencyIn,
    tokenOut: currencyOut,
    amount: amountSpecified,
    tradeType,
    useClientSideRouter: true,
  })

  const { isLoading, isError, data, currentData } = useGetQuoteQuery(queryArgs ?? skipToken, {
    pollingInterval: ms`15s`,
    refetchOnFocus: true,
  })

  const quoteResult: GetQuoteResult | undefined = useIsValidBlock(Number(data?.blockNumber) || 0) ? data : undefined

  const client: PolywrapClient = usePolywrapClient()

  // get USD gas cost of trade in active chains stablecoin amount
  const gasUseEstimateUSD = useStablecoinAmountFromFiatValue(quoteResult?.gasUseEstimateUSD) ?? null
  const isSyncing = currentData !== data

  const [tradeResult, setTradeResult] = useState<{
    state: TradeState
    trade?: ExtendedTrade
    gasUseEstimateUSD?: CurrencyAmount<Token> | null
  }>({
    state: TradeState.LOADING,
  })
  const cancelable =
    useRef<
      CancelablePromise<
        { state: TradeState; trade?: ExtendedTrade; gasUseEstimateUSD?: CurrencyAmount<Token> | null } | undefined
      >
    >()

  useEffect(() => {
    cancelable.current?.cancel()
    if (!currencyIn || !currencyOut) {
      setTradeResult({
        state: TradeState.INVALID,
        trade: undefined,
      })
      return
    }

    if (isLoading && !quoteResult) {
      // only on first hook render
      setTradeResult({
        state: TradeState.LOADING,
        trade: undefined,
      })
      return
    }

    let otherAmount = undefined
    if (quoteResult) {
      if (tradeType === TradeType.EXACT_INPUT && currencyOut) {
        otherAmount = CurrencyAmount.fromRawAmount(currencyOut, quoteResult.quote)
      }

      if (tradeType === TradeType.EXACT_OUTPUT && currencyIn) {
        otherAmount = CurrencyAmount.fromRawAmount(currencyIn, quoteResult.quote)
      }
    }

    if (isError || !otherAmount || !queryArgs) {
      setTradeResult({
        state: TradeState.NO_ROUTE_FOUND,
        trade: undefined,
      })
      return
    }

    const tradePromise = loadTrade(
      client,
      currencyIn,
      currencyOut,
      tradeType,
      quoteResult,
      gasUseEstimateUSD,
      isSyncing
    )
    cancelable.current = makeCancelable(tradePromise)
    cancelable.current?.promise.then((res) => {
      if (!res) return
      setTradeResult(res)
    })
    return () => cancelable.current?.cancel()
  }, [
    currencyIn,
    currencyOut,
    isLoading,
    quoteResult,
    tradeType,
    isError,
    queryArgs,
    gasUseEstimateUSD?.toFixed(),
    isSyncing,
    client,
  ])

  return tradeResult
}

const loadTrade = async (
  client: PolywrapClient,
  currencyIn: Currency,
  currencyOut: Currency,
  tradeType: TradeType,
  quoteResult: GetQuoteResult | undefined,
  gasUseEstimateUSD: CurrencyAmount<Token> | null,
  isSyncing?: boolean
): Promise<{ state: TradeState; trade?: ExtendedTrade; gasUseEstimateUSD?: CurrencyAmount<Token> | null }> => {
  const route = await computeRoutes(client, currencyIn, currencyOut, tradeType, quoteResult)

  if (!route || route.length === 0) {
    return {
      state: TradeState.NO_ROUTE_FOUND,
      trade: undefined,
    }
  }

  try {
    const trade = await transformRoutesToTrade(client, route, tradeType, gasUseEstimateUSD)
    if (!trade) {
      console.debug('transformRoutesToTrade returned undefined')
      return { state: TradeState.INVALID, trade: undefined, gasUseEstimateUSD }
    }
    return {
      // always return VALID regardless of isFetching status
      state: isSyncing ? TradeState.SYNCING : TradeState.VALID,
      trade,
    }
  } catch (e) {
    console.debug('transformRoutesToTrade failed: ', e)
    return { state: TradeState.INVALID, trade: undefined, gasUseEstimateUSD }
  }
}

// only want to enable this when app hook called
class GAMetric extends IMetric {
  putDimensions() {
    return
  }

  putMetric(key: string, value: number, unit?: MetricLoggerUnit) {
    sendTiming('Routing API', `${key} | ${unit}`, value, 'client')
  }
}

setGlobalMetric(new GAMetric())
