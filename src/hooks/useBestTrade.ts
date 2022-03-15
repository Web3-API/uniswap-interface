import { Currency, CurrencyAmount, TradeType } from '@uniswap/sdk-core'
import { TradeState } from 'state/routing/types'
import { useRoutingAPITrade } from 'state/routing/useRoutingAPITrade'

import { reverseMapTokenAmount } from '../polywrap-utils'
import { ExtendedTrade } from '../polywrap-utils/interfaces'
import useAutoRouterSupported from './useAutoRouterSupported'
import { useClientSideV3Trade } from './useClientSideV3Trade'
import useDebounce from './useDebounce'
import useIsWindowVisible from './useIsWindowVisible'

/**
 * Returns the best v2+v3 trade for a desired swap.
 * @param tradeType whether the swap is an exact in/out
 * @param amountSpecified the exact amount to swap in/out
 * @param otherCurrency the desired output/payment currency
 */
export function useBestTrade(
  tradeType: TradeType,
  amountSpecified?: CurrencyAmount<Currency>,
  otherCurrency?: Currency
): {
  state: TradeState
  trade: ExtendedTrade | undefined
} {
  const autoRouterSupported = useAutoRouterSupported()
  const isWindowVisible = useIsWindowVisible()

  const [debouncedAmount, debouncedOtherCurrency] = useDebounce([amountSpecified, otherCurrency], 200)

  // the trade here is always a v3 polywrap trade
  const routingAPITrade = useRoutingAPITrade(
    tradeType,
    autoRouterSupported && isWindowVisible ? debouncedAmount : undefined,
    debouncedOtherCurrency
  )

  const isLoading = amountSpecified !== undefined && debouncedAmount === undefined

  const routingAPITradeInput = reverseMapTokenAmount(routingAPITrade.trade?.inputAmount)
  const routingAPITradeOutput = reverseMapTokenAmount(routingAPITrade.trade?.outputAmount)

  // consider trade debouncing when inputs/outputs do not match
  const debouncing =
    routingAPITradeInput &&
    routingAPITradeOutput &&
    amountSpecified &&
    (tradeType === TradeType.EXACT_INPUT
      ? !routingAPITradeInput.equalTo(amountSpecified) ||
        !amountSpecified.currency.equals(routingAPITradeInput.currency) ||
        !debouncedOtherCurrency?.equals(routingAPITradeOutput.currency)
      : !routingAPITradeOutput.equalTo(amountSpecified) ||
        !amountSpecified.currency.equals(routingAPITradeOutput.currency) ||
        !debouncedOtherCurrency?.equals(routingAPITradeInput.currency))

  const useFallback = !autoRouterSupported || (!debouncing && routingAPITrade.state === TradeState.NO_ROUTE_FOUND)

  // only use client side router if routing api trade failed or is not supported
  const bestV3Trade = useClientSideV3Trade(
    tradeType,
    useFallback ? debouncedAmount : undefined,
    useFallback ? debouncedOtherCurrency : undefined
  )

  // only return gas estimate from api if routing api trade is used
  return {
    ...(useFallback ? bestV3Trade : routingAPITrade),
    ...(debouncing ? { state: TradeState.SYNCING } : {}),
    ...(isLoading ? { state: TradeState.LOADING } : {}),
  }
}
