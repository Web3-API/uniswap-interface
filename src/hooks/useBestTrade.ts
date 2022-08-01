import { Currency, CurrencyAmount, TradeType } from '@uniswap/sdk-core'
import { useMemo } from 'react'
import { TradeState } from 'state/routing/types'

import { ExtendedTrade } from '../polywrap-utils/interfaces'
import { useClientSideV3Trade } from './useClientSideV3Trade'
import useDebounce from './useDebounce'

/**
 * Returns the best v3 trade for a desired swap.
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
  const [debouncedAmount, debouncedOtherCurrency] = useDebounce(
    useMemo(() => [amountSpecified, otherCurrency], [amountSpecified, otherCurrency]),
    200
  )
  return useClientSideV3Trade(tradeType, debouncedAmount, debouncedOtherCurrency)
}
