import { Currency, CurrencyAmount, Percent } from '@uniswap/sdk-core'
import { useSwapApproval } from 'lib/hooks/swap/useSwapApproval'
import { ApprovalState, useApproval } from 'lib/hooks/useApproval'
import { useCallback } from 'react'

import { useHasPendingApproval, useTransactionAdder } from '../state/transactions/hooks'
import { TransactionType } from '../state/transactions/types'
import { Uni_Trade } from '../wrap'
export { ApprovalState } from 'lib/hooks/useApproval'

function useGetAndTrackApproval(getApproval: ReturnType<typeof useApproval>[1]) {
  const addTransaction = useTransactionAdder()
  return useCallback(() => {
    return getApproval().then((pending) => {
      if (pending) {
        const { response, tokenAddress, spenderAddress: spender } = pending
        addTransaction(response, { type: TransactionType.APPROVAL, tokenAddress, spender })
      }
    })
  }, [addTransaction, getApproval])
}

// returns a variable indicating the state of the approval and a function which approves if necessary or early returns
export function useApproveCallback(
  amountToApprove?: CurrencyAmount<Currency>,
  spender?: string
): [ApprovalState, () => Promise<void>] {
  const [approval, getApproval] = useApproval(amountToApprove, spender, useHasPendingApproval)
  return [approval, useGetAndTrackApproval(getApproval)]
}

export function useApproveCallbackFromTrade(
  trade: Uni_Trade | undefined,
  allowedSlippage: Percent
): [ApprovalState, () => Promise<void>] {
  const [approval, getApproval] = useSwapApproval(trade, allowedSlippage, useHasPendingApproval)
  return [approval, useGetAndTrackApproval(getApproval)]
}
