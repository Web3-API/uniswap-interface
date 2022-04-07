import { MaxUint256 } from '@ethersproject/constants'
import { TransactionResponse } from '@ethersproject/providers'
import { Trade as RouterTrade } from '@uniswap/router-sdk'
import { Currency, CurrencyAmount, Percent, TradeType } from '@uniswap/sdk-core'
import { Trade as V2Trade } from '@uniswap/v2-sdk'
import { Web3ApiClient } from '@web3api/client-js'
import { useWeb3ApiClient } from '@web3api/react'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { getTxOptimizedSwapRouter, SwapRouterVersion } from 'utils/getTxOptimizedSwapRouter'

import { SWAP_ROUTER_ADDRESSES, V2_ROUTER_ADDRESS, V3_ROUTER_ADDRESS } from '../constants/addresses'
import { Uni_Query, Uni_TokenAmount, Uni_Trade as PolyTrade } from '../polywrap'
import { isEther, isTrade, reverseMapTokenAmount } from '../polywrap-utils'
import { TransactionType } from '../state/transactions/actions'
import { useHasPendingApproval, useTransactionAdder } from '../state/transactions/hooks'
import { calculateGasMargin } from '../utils/calculateGasMargin'
import { useTokenContract } from './useContract'
import { useTokenAllowance } from './useTokenAllowance'
import { useActiveWeb3React } from './web3'

export enum ApprovalState {
  UNKNOWN = 'UNKNOWN',
  NOT_APPROVED = 'NOT_APPROVED',
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
}

export function useApprovalState(amountToApprove?: CurrencyAmount<Currency>, spender?: string) {
  const { account } = useActiveWeb3React()
  const token = amountToApprove?.currency?.isToken ? amountToApprove.currency : undefined

  // TODO: why is useTokenAllowance returning undefined?
  const currentAllowance = useTokenAllowance(token, account ?? undefined, spender)
  const pendingApproval = useHasPendingApproval(token?.address, spender)

  return useMemo(() => {
    if (!amountToApprove || !spender) return ApprovalState.UNKNOWN
    if (amountToApprove.currency.isNative) return ApprovalState.APPROVED
    // we might not have enough data to know whether or not we need to approve
    if (!currentAllowance) return ApprovalState.UNKNOWN

    // amountToApprove will be defined if currentAllowance is
    return currentAllowance.lessThan(amountToApprove)
      ? pendingApproval
        ? ApprovalState.PENDING
        : ApprovalState.NOT_APPROVED
      : ApprovalState.APPROVED
  }, [amountToApprove, currentAllowance, pendingApproval, spender])
}

/** Returns approval state for all known swap routers */
export function useAllApprovalStates(trade: PolyTrade | undefined, allowedSlippage: Percent) {
  const { chainId } = useActiveWeb3React()
  const client: Web3ApiClient = useWeb3ApiClient()

  const [amountToApprove, setAmountToApprove] = useState<Uni_TokenAmount | undefined>(undefined)

  useEffect(() => {
    console.log('useApproveCallback - src/hooks/useApproveCallback')
    if (!trade || isEther(trade.inputAmount.token)) {
      setAmountToApprove(undefined)
    } else {
      Uni_Query.tradeMaximumAmountIn(
        {
          amountIn: trade.inputAmount,
          tradeType: trade.tradeType,
          slippageTolerance: allowedSlippage.toFixed(36),
        },
        client
      ).then((res) => {
        if (res.error) throw res.error
        setAmountToApprove(res.data)
      })
    }
  }, [trade, allowedSlippage, client])

  const uniAmount = reverseMapTokenAmount(amountToApprove)
  const v2ApprovalState = useApprovalState(uniAmount, chainId ? V2_ROUTER_ADDRESS[chainId] : undefined)
  const v3ApprovalState = useApprovalState(uniAmount, chainId ? V3_ROUTER_ADDRESS[chainId] : undefined)
  const v2V3ApprovalState = useApprovalState(uniAmount, chainId ? SWAP_ROUTER_ADDRESSES[chainId] : undefined)

  return useMemo(
    () => ({ v2: v2ApprovalState, v3: v3ApprovalState, v2V3: v2V3ApprovalState }),
    [v2ApprovalState, v2V3ApprovalState, v3ApprovalState]
  )
}

// returns a variable indicating the state of the approval and a function which approves if necessary or early returns
export function useApproveCallback(
  amountToApprove?: CurrencyAmount<Currency>,
  spender?: string
): [ApprovalState, () => Promise<void>] {
  const { chainId } = useActiveWeb3React()
  const token = amountToApprove?.currency?.isToken ? amountToApprove.currency : undefined

  // check the current approval status
  const approvalState = useApprovalState(amountToApprove, spender)

  const tokenContract = useTokenContract(token?.address)
  const addTransaction = useTransactionAdder()

  const approve = useCallback(async (): Promise<void> => {
    if (approvalState !== ApprovalState.NOT_APPROVED) {
      console.error('approve was called unnecessarily')
      return
    }
    if (!chainId) {
      console.error('no chainId')
      return
    }

    if (!token) {
      console.error('no token')
      return
    }

    if (!tokenContract) {
      console.error('tokenContract is null')
      return
    }

    if (!amountToApprove) {
      console.error('missing amount to approve')
      return
    }

    if (!spender) {
      console.error('no spender')
      return
    }

    let useExact = false
    const estimatedGas = await tokenContract.estimateGas.approve(spender, MaxUint256).catch(() => {
      // general fallback for tokens who restrict approval amounts
      useExact = true
      return tokenContract.estimateGas.approve(spender, amountToApprove.quotient.toString())
    })

    return tokenContract
      .approve(spender, useExact ? amountToApprove.quotient.toString() : MaxUint256, {
        gasLimit: calculateGasMargin(estimatedGas),
      })
      .then((response: TransactionResponse) => {
        addTransaction(response, { type: TransactionType.APPROVAL, tokenAddress: token.address, spender })
      })
      .catch((error: Error) => {
        console.debug('Failed to approve token', error)
        throw error
      })
  }, [approvalState, token, tokenContract, amountToApprove, spender, addTransaction, chainId])

  return [approvalState, approve]
}

// wraps useApproveCallback in the context of a swap
export function useApproveCallbackFromTrade(
  trade: V2Trade<Currency, Currency, TradeType> | PolyTrade | RouterTrade<Currency, Currency, TradeType> | undefined,
  allowedSlippage: Percent
) {
  const { chainId } = useActiveWeb3React()
  const client: Web3ApiClient = useWeb3ApiClient()

  const [amountToApprove, setAmountToApprove] = useState<CurrencyAmount<Currency> | undefined>(undefined)

  useEffect(() => {
    console.log('useApproveCallbackFromTrade - src/hooks/useApproveCallback')
    if (!trade) {
      setAmountToApprove(undefined)
    } else if (!isTrade(trade)) {
      setAmountToApprove(trade.inputAmount.currency.isToken ? trade.maximumAmountIn(allowedSlippage) : undefined)
    } else if (isEther(trade.inputAmount.token)) {
      setAmountToApprove(undefined)
    } else {
      Uni_Query.tradeMaximumAmountIn(
        {
          amountIn: trade.inputAmount,
          tradeType: trade.tradeType,
          slippageTolerance: allowedSlippage.toFixed(36),
        },
        client
      ).then((res) => {
        if (res.error) throw res.error
        const currencyAmount = reverseMapTokenAmount(res.data)
        setAmountToApprove(currencyAmount)
      })
    }
  }, [trade, allowedSlippage, client])

  const approveCallback = useApproveCallback(
    amountToApprove,
    chainId
      ? trade instanceof V2Trade
        ? V2_ROUTER_ADDRESS[chainId]
        : isTrade(trade)
        ? V3_ROUTER_ADDRESS[chainId]
        : SWAP_ROUTER_ADDRESSES[chainId]
      : undefined
  )

  // // TODO: remove L162-168 after testing is done. This error will help detect mistakes in the logic.
  // if (
  //   (trade instanceof V2Trade && approveCallback[0] !== ApprovalState.APPROVED) ||
  //   (isTrade(trade) && approveCallback[0] !== ApprovalState.APPROVED)
  // ) {
  //   throw new Error('Trying to approve legacy router')
  // }

  return approveCallback
}

export function useApprovalOptimizedTrade(
  trade: PolyTrade | undefined,
  allowedSlippage: Percent
): PolyTrade | undefined {
  const onlyV2Routes = false
  const onlyV3Routes = true
  const tradeHasSplits = (trade?.swaps.length ?? 0) > 1

  const approvalStates = useAllApprovalStates(trade, allowedSlippage)

  const optimizedSwapRouter = useMemo(
    () => getTxOptimizedSwapRouter({ onlyV2Routes, onlyV3Routes, tradeHasSplits, approvalStates }),
    [approvalStates, tradeHasSplits, onlyV2Routes, onlyV3Routes]
  )

  return useMemo(() => {
    if (!trade) return undefined

    try {
      switch (optimizedSwapRouter) {
        case SwapRouterVersion.V2V3:
          return trade
        case SwapRouterVersion.V2:
          return trade
        case SwapRouterVersion.V3:
          return trade
        default:
          return undefined
      }
    } catch (e) {
      // TODO(#2989): remove try-catch
      console.debug(e)
      return undefined
    }
  }, [trade, optimizedSwapRouter])
}
