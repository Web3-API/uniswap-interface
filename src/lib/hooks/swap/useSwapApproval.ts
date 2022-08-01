import { InvokeResult, PolywrapClient } from '@polywrap/client-js'
import { usePolywrapClient } from '@polywrap/react'
import { Trade as RouterTrade } from '@uniswap/router-sdk'
import { Currency, CurrencyAmount, Percent, Token, TradeType } from '@uniswap/sdk-core'
import { Trade as V2Trade } from '@uniswap/v2-sdk'
import { useWeb3React } from '@web3-react/core'
import { V3_ROUTER_ADDRESS } from 'constants/addresses'
import { useEffect, useRef, useState } from 'react'

import { isNative, isTrade, reverseMapTokenAmount } from '../../../polywrap-utils'
import { CancelablePromise, makeCancelable } from '../../../polywrap-utils/makeCancelable'
import { Uni_Module, Uni_TokenAmount, Uni_Trade } from '../../../wrap'
import { useApproval } from '../useApproval'

// wraps useApproveCallback in the context of a swap
export function useSwapApproval(
  trade: V2Trade<Currency, Currency, TradeType> | Uni_Trade | RouterTrade<Currency, Currency, TradeType> | undefined,
  allowedSlippage: Percent,
  useIsPendingApproval: (token?: Token, spender?: string) => boolean
  // amount?: CurrencyAmount<Currency> // defaults to trade.maximumAmountIn(allowedSlippage)
) {
  const { chainId } = useWeb3React()
  const client: PolywrapClient = usePolywrapClient()

  const [amountToApprove, setAmountToApprove] = useState<CurrencyAmount<Currency> | undefined>(undefined)
  const cancelable = useRef<CancelablePromise<InvokeResult<Uni_TokenAmount> | undefined>>()

  useEffect(() => {
    cancelable.current?.cancel()
    if (!trade) {
      setAmountToApprove(undefined)
    } else if (!isTrade(trade)) {
      setAmountToApprove(trade.inputAmount.currency.isToken ? trade.maximumAmountIn(allowedSlippage) : undefined)
    } else if (isNative(trade.inputAmount.token)) {
      setAmountToApprove(undefined)
    } else {
      const maxInPromise = Uni_Module.tradeMaximumAmountIn(
        {
          amountIn: trade.inputAmount,
          tradeType: trade.tradeType,
          slippageTolerance: allowedSlippage.toFixed(36),
        },
        client
      )
      cancelable.current = makeCancelable(maxInPromise)
      cancelable.current?.promise.then((res) => {
        if (!res) return
        if (res.error) console.error(res.error)
        const currencyAmount = reverseMapTokenAmount(res.data)
        setAmountToApprove(currencyAmount)
      })
    }
    return () => cancelable.current?.cancel()
  }, [trade, allowedSlippage, client])

  return useApproval(amountToApprove, chainId ? V3_ROUTER_ADDRESS[chainId] : undefined, useIsPendingApproval)
}
