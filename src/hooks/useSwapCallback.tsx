import { BigNumber } from '@ethersproject/bignumber'
// eslint-disable-next-line no-restricted-imports
import { t, Trans } from '@lingui/macro'
import { PolywrapClient } from '@polywrap/client-js'
import { usePolywrapClient } from '@polywrap/react'
import { SwapRouter, Trade as RouterTrade } from '@uniswap/router-sdk'
import { Currency, CurrencyAmount, Percent, TradeType } from '@uniswap/sdk-core'
import { Router as V2SwapRouter, Trade as V2Trade } from '@uniswap/v2-sdk'
import { ReactNode, useMemo } from 'react'

import { ArgentWalletContract } from '../abis/types'
import { SWAP_ROUTER_ADDRESSES, V3_ROUTER_ADDRESS } from '../constants/addresses'
import { isNative, isTrade, reverseMapToken, reverseMapTokenAmount } from '../polywrap-utils'
import { TransactionType } from '../state/transactions/actions'
import { useTransactionAdder } from '../state/transactions/hooks'
import approveAmountCalldata from '../utils/approveAmountCalldata'
import { calculateGasMargin } from '../utils/calculateGasMargin'
import { currencyId } from '../utils/currencyId'
import isZero from '../utils/isZero'
import {
  Uni_MethodParameters as MethodParameters,
  Uni_Module,
  Uni_PermitV as PermitV,
  Uni_Trade as PolyTrade,
  Uni_TradeTypeEnum as TradeTypeEnum,
} from '../wrap'
import { useArgentWalletContract } from './useArgentWalletContract'
import { useV2RouterContract } from './useContract'
import useENS from './useENS'
import { SignatureData } from './useERC20Permit'
import useTransactionDeadline from './useTransactionDeadline'
import { useActiveWeb3React } from './web3'

type AnyTrade = V2Trade<Currency, Currency, TradeType> | PolyTrade | RouterTrade<Currency, Currency, TradeType>

enum SwapCallbackState {
  INVALID,
  LOADING,
  VALID,
}

interface SwapCall {
  address: string
  calldata: string
  value: string
}

interface SwapCallAsync {
  address: string
  params: Promise<MethodParameters>
}

interface SwapCallEstimate {
  call: SwapCall
}

interface SuccessfulCall extends SwapCallEstimate {
  call: SwapCall
  gasEstimate: BigNumber
}

interface FailedCall extends SwapCallEstimate {
  call: SwapCall
  error: Error
}

async function createArgentParams(
  client: PolywrapClient,
  asyncParams: MethodParameters | Promise<MethodParameters>,
  trade: PolyTrade | RouterTrade<Currency, Currency, TradeType>,
  allowedSlippage: Percent,
  argentWalletContract: ArgentWalletContract,
  swapRouterAddress: string
): Promise<MethodParameters> {
  const params = await asyncParams
  let maxIn
  if (isTrade(trade)) {
    const maxInInvoke = await Uni_Module.tradeMaximumAmountIn(
      {
        slippageTolerance: allowedSlippage.toFixed(18),
        amountIn: trade.inputAmount,
        tradeType: trade.tradeType,
      },
      client
    )
    if (!maxInInvoke.ok) {
      console.error(maxInInvoke.error)
      maxIn = undefined
    } else {
      maxIn = reverseMapTokenAmount(maxInInvoke.value)
    }
  } else {
    maxIn = trade.maximumAmountIn(allowedSlippage)
  }
  return {
    calldata: argentWalletContract.interface.encodeFunctionData('wc_multiCall', [
      [
        approveAmountCalldata(maxIn as CurrencyAmount<Currency>, swapRouterAddress),
        {
          to: swapRouterAddress,
          value: params.value,
          data: params.calldata,
        },
      ],
    ]),
    value: '0x0',
  }
}

/**
 * Returns the swap calls that can be used to make the trade
 * @param trade trade to execute
 * @param allowedSlippage user allowed slippage
 * @param recipientAddressOrName the ENS name or address of the recipient of the swap output
 * @param signatureData the signature data of the permit of the input token amount, if available
 */
function useSwapCallArguments(
  trade: AnyTrade | undefined, // trade to execute, required
  allowedSlippage: Percent, // in bips
  recipientAddressOrName: string | null, // the ENS name or address of the recipient of the trade, or null if swap should be returned to sender
  signatureData: SignatureData | null | undefined
): (SwapCall | SwapCallAsync)[] {
  const { account, chainId, library } = useActiveWeb3React()
  const client: PolywrapClient = usePolywrapClient()

  const { address: recipientAddress } = useENS(recipientAddressOrName)
  const recipient = recipientAddressOrName === null ? account : recipientAddress
  const deadline = useTransactionDeadline()
  const routerContract = useV2RouterContract()
  const argentWalletContract = useArgentWalletContract()

  return useMemo(() => {
    if (!trade || !recipient || !library || !account || !chainId || !deadline) return []

    if (trade instanceof V2Trade) {
      if (!routerContract) return []
      const swapMethods = []

      swapMethods.push(
        V2SwapRouter.swapCallParameters(trade, {
          feeOnTransfer: false,
          allowedSlippage,
          recipient,
          deadline: deadline.toNumber(),
        })
      )

      if (trade.tradeType === TradeType.EXACT_INPUT) {
        swapMethods.push(
          V2SwapRouter.swapCallParameters(trade, {
            feeOnTransfer: true,
            allowedSlippage,
            recipient,
            deadline: deadline.toNumber(),
          })
        )
      }
      return swapMethods.map(({ methodName, args, value }) => {
        if (argentWalletContract && trade.inputAmount.currency.isToken) {
          return {
            address: argentWalletContract.address,
            calldata: argentWalletContract.interface.encodeFunctionData('wc_multiCall', [
              [
                approveAmountCalldata(trade.maximumAmountIn(allowedSlippage), routerContract.address),
                {
                  to: routerContract.address,
                  value,
                  data: routerContract.interface.encodeFunctionData(methodName, args),
                },
              ],
            ]),
            value: '0x0',
          }
        } else {
          return {
            address: routerContract.address,
            calldata: routerContract.interface.encodeFunctionData(methodName, args),
            value,
          }
        }
      })
    } else {
      // swap options shared by v3 and v2+v3 swap routers
      const sharedSwapOptions = {
        recipient,
        slippageTolerance: allowedSlippage,
        ...(signatureData
          ? {
              inputTokenPermit:
                'allowed' in signatureData
                  ? {
                      expiry: signatureData.deadline,
                      nonce: signatureData.nonce,
                      s: signatureData.s,
                      r: signatureData.r,
                      v: signatureData.v as any,
                    }
                  : {
                      deadline: signatureData.deadline,
                      amount: signatureData.amount,
                      s: signatureData.s,
                      r: signatureData.r,
                      v: signatureData.v as any,
                    },
            }
          : {}),
      }

      const isV3Trade = isTrade(trade)

      const swapRouterAddress = chainId
        ? isV3Trade
          ? V3_ROUTER_ADDRESS[chainId]
          : SWAP_ROUTER_ADDRESSES[chainId]
        : undefined
      if (!swapRouterAddress) return []

      let swapParams
      if (isV3Trade) {
        swapParams = Uni_Module.swapCallParameters(
          {
            trades: [trade],
            options: {
              slippageTolerance: sharedSwapOptions.slippageTolerance.toFixed(18),
              recipient: sharedSwapOptions.recipient,
              deadline: deadline.toString(),
              inputTokenPermit: sharedSwapOptions.inputTokenPermit
                ? {
                    v: `v_${sharedSwapOptions.inputTokenPermit.v}` as PermitV,
                    r: sharedSwapOptions.inputTokenPermit.r,
                    s: sharedSwapOptions.inputTokenPermit.s,
                    amount: sharedSwapOptions.inputTokenPermit.amount,
                    deadline: sharedSwapOptions.inputTokenPermit.deadline?.toString(),
                    nonce: sharedSwapOptions.inputTokenPermit.nonce?.toString(),
                    expiry: sharedSwapOptions.inputTokenPermit.expiry?.toString(),
                  }
                : undefined,
            },
          },
          client
        ).then((paramsInvoke) => {
          if (!paramsInvoke.ok) throw paramsInvoke.error
          return paramsInvoke.value
        })
      } else {
        swapParams = SwapRouter.swapCallParameters(trade, {
          ...sharedSwapOptions,
          deadlineOrPreviousBlockhash: deadline.toString(),
        })
      }

      if (
        argentWalletContract &&
        ((trade instanceof RouterTrade && trade.inputAmount.currency.isToken) ||
          (isTrade(trade) && !isNative(trade.inputAmount.token)))
      ) {
        return [
          {
            address: argentWalletContract.address,
            params: createArgentParams(
              client,
              swapParams,
              trade,
              allowedSlippage,
              argentWalletContract,
              swapRouterAddress
            ),
          },
        ]
      }
      return [
        {
          address: swapRouterAddress,
          params: Promise.resolve(swapParams),
        },
      ]
    }
  }, [
    trade,
    recipient,
    library,
    account,
    chainId,
    deadline,
    routerContract,
    allowedSlippage,
    argentWalletContract,
    signatureData,
    client,
  ])
}

/**
 * This is hacking out the revert reason from the ethers provider thrown error however it can.
 * This object seems to be undocumented by ethers.
 * @param error an error from the ethers provider
 */
function swapErrorToUserReadableMessage(error: any): ReactNode {
  let reason: string | undefined
  while (Boolean(error)) {
    reason = error.reason ?? error.message ?? reason
    error = error.error ?? error.data?.originalError
  }

  if (reason?.indexOf('execution reverted: ') === 0) reason = reason.substr('execution reverted: '.length)

  switch (reason) {
    case 'UniswapV2Router: EXPIRED':
      return (
        <Trans>
          The transaction could not be sent because the deadline has passed. Please check that your transaction deadline
          is not too low.
        </Trans>
      )
    case 'UniswapV2Router: INSUFFICIENT_OUTPUT_AMOUNT':
    case 'UniswapV2Router: EXCESSIVE_INPUT_AMOUNT':
      return (
        <Trans>
          This transaction will not succeed either due to price movement or fee on transfer. Try increasing your
          slippage tolerance.
        </Trans>
      )
    case 'TransferHelper: TRANSFER_FROM_FAILED':
      return <Trans>The input token cannot be transferred. There may be an issue with the input token.</Trans>
    case 'UniswapV2: TRANSFER_FAILED':
      return <Trans>The output token cannot be transferred. There may be an issue with the output token.</Trans>
    case 'UniswapV2: K':
      return (
        <Trans>
          The Uniswap invariant x*y=k was not satisfied by the swap. This usually means one of the tokens you are
          swapping incorporates custom behavior on transfer.
        </Trans>
      )
    case 'Too little received':
    case 'Too much requested':
    case 'STF':
      return (
        <Trans>
          This transaction will not succeed due to price movement. Try increasing your slippage tolerance. Note: fee on
          transfer and rebase tokens are incompatible with Uniswap V3.
        </Trans>
      )
    case 'TF':
      return (
        <Trans>
          The output token cannot be transferred. There may be an issue with the output token. Note: fee on transfer and
          rebase tokens are incompatible with Uniswap V3.
        </Trans>
      )
    default:
      if (reason?.indexOf('undefined is not an object') !== -1) {
        console.error(error, reason)
        return (
          <Trans>
            An error occurred when trying to execute this swap. You may need to increase your slippage tolerance. If
            that does not work, there may be an incompatibility with the token you are trading. Note: fee on transfer
            and rebase tokens are incompatible with Uniswap V3.
          </Trans>
        )
      }
      return (
        <Trans>
          Unknown error{reason ? `: "${reason}"` : ''}. Try increasing your slippage tolerance. Note: fee on transfer
          and rebase tokens are incompatible with Uniswap V3.
        </Trans>
      )
  }
}

// returns a function that will execute a swap, if the parameters are all valid
// and the user has approved the slippage adjusted input amount for the trade
export function useSwapCallback(
  trade: AnyTrade | undefined, // trade to execute, required
  allowedSlippage: Percent, // in bips
  recipientAddressOrName: string | null, // the ENS name or address of the recipient of the trade, or null if swap should be returned to sender
  signatureData: SignatureData | undefined | null
): { state: SwapCallbackState; callback: null | (() => Promise<string>); error: ReactNode | null } {
  const { account, chainId, library } = useActiveWeb3React()
  const client: PolywrapClient = usePolywrapClient()

  const swapCallsMaybeAsync = useSwapCallArguments(trade, allowedSlippage, recipientAddressOrName, signatureData)

  const addTransaction = useTransactionAdder()

  const { address: recipientAddress } = useENS(recipientAddressOrName)
  const recipient = recipientAddressOrName === null ? account : recipientAddress

  return useMemo(() => {
    if (!trade || !library || !account || !chainId) {
      return { state: SwapCallbackState.INVALID, callback: null, error: <Trans>Missing dependencies</Trans> }
    }
    if (!recipient) {
      if (recipientAddressOrName !== null) {
        return { state: SwapCallbackState.INVALID, callback: null, error: <Trans>Invalid recipient</Trans> }
      } else {
        return { state: SwapCallbackState.LOADING, callback: null, error: null }
      }
    }

    return {
      state: SwapCallbackState.VALID,
      callback: async function onSwap(): Promise<string> {
        const swapCalls: SwapCall[] = await Promise.all(
          swapCallsMaybeAsync.map(async (call) => {
            if ('calldata' in call) {
              return call
            } else {
              const { calldata, value } = await call.params
              return {
                address: call.address,
                calldata,
                value,
              }
            }
          })
        )

        const estimatedCalls: SwapCallEstimate[] = await Promise.all(
          swapCalls.map((call) => {
            const { address, calldata, value } = call

            const tx =
              !value || isZero(value)
                ? { from: account, to: address, data: calldata }
                : {
                    from: account,
                    to: address,
                    data: calldata,
                    value,
                  }

            return library
              .estimateGas(tx)
              .then((gasEstimate) => {
                return {
                  call,
                  gasEstimate,
                }
              })
              .catch((gasError) => {
                console.debug('Gas estimate failed, trying eth_call to extract error', call)

                return library
                  .call(tx)
                  .then((result) => {
                    console.debug('Unexpected successful call after failed estimate gas', call, gasError, result)
                    return { call, error: <Trans>Unexpected issue with estimating the gas. Please try again.</Trans> }
                  })
                  .catch((callError) => {
                    console.debug('Call threw error', call, callError)
                    return { call, error: swapErrorToUserReadableMessage(callError) }
                  })
              })
          })
        )

        // a successful estimation is a bignumber gas estimate and the next call is also a bignumber gas estimate
        let bestCallOption: SuccessfulCall | SwapCallEstimate | undefined = estimatedCalls.find(
          (el, ix, list): el is SuccessfulCall =>
            'gasEstimate' in el && (ix === list.length - 1 || 'gasEstimate' in list[ix + 1])
        )

        // check if any calls errored with a recognizable error
        if (!bestCallOption) {
          const errorCalls = estimatedCalls.filter((call): call is FailedCall => 'error' in call)
          if (errorCalls.length > 0) throw errorCalls[errorCalls.length - 1].error
          const firstNoErrorCall = estimatedCalls.find<SwapCallEstimate>(
            (call): call is SwapCallEstimate => !('error' in call)
          )
          if (!firstNoErrorCall) throw new Error(t`Unexpected error. Could not estimate gas for the swap.`)
          bestCallOption = firstNoErrorCall
        }

        const {
          call: { address, calldata, value },
        } = bestCallOption

        return library
          .getSigner()
          .sendTransaction({
            from: account,
            to: address,
            data: calldata,
            // let the wallet try if we can't estimate the gas
            ...('gasEstimate' in bestCallOption ? { gasLimit: calculateGasMargin(bestCallOption.gasEstimate) } : {}),
            ...(value && !isZero(value) ? { value } : {}),
          })
          .then(async (response) => {
            const isV3Trade = isTrade(trade)
            const transactionInfo =
              trade.tradeType === TradeType.EXACT_INPUT || trade.tradeType === TradeTypeEnum.EXACT_INPUT
                ? isV3Trade
                  ? {
                      type: TransactionType.SWAP as TransactionType.SWAP,
                      tradeType: TradeType.EXACT_INPUT as TradeType.EXACT_INPUT,
                      inputCurrencyId: currencyId(reverseMapToken(trade.inputAmount.token) as Currency),
                      inputCurrencyAmountRaw: trade.inputAmount.amount,
                      expectedOutputCurrencyAmountRaw: trade.outputAmount.amount,
                      outputCurrencyId: currencyId(reverseMapToken(trade.outputAmount.token) as Currency),
                      minimumOutputCurrencyAmountRaw: await Uni_Module.tradeMinimumAmountOut(
                        {
                          tradeType: TradeTypeEnum.EXACT_INPUT,
                          slippageTolerance: allowedSlippage.toFixed(18),
                          amountOut: trade.outputAmount,
                        },
                        client
                      ).then((invoke) => {
                        if (!invoke.ok) throw invoke.error
                        return invoke.value.amount
                      }),
                    }
                  : {
                      type: TransactionType.SWAP as TransactionType.SWAP,
                      tradeType: TradeType.EXACT_INPUT as TradeType.EXACT_INPUT,
                      inputCurrencyId: currencyId(trade.inputAmount.currency),
                      inputCurrencyAmountRaw: trade.inputAmount.quotient.toString(),
                      expectedOutputCurrencyAmountRaw: trade.outputAmount.quotient.toString(),
                      outputCurrencyId: currencyId(trade.outputAmount.currency),
                      minimumOutputCurrencyAmountRaw: trade.minimumAmountOut(allowedSlippage).quotient.toString(),
                    }
                : isV3Trade
                ? {
                    type: TransactionType.SWAP as TransactionType.SWAP,
                    tradeType: TradeType.EXACT_OUTPUT as TradeType.EXACT_OUTPUT,
                    inputCurrencyId: currencyId(reverseMapToken(trade.inputAmount.token) as Currency),
                    maximumInputCurrencyAmountRaw: await Uni_Module.tradeMaximumAmountIn(
                      {
                        tradeType: TradeTypeEnum.EXACT_OUTPUT,
                        slippageTolerance: allowedSlippage.toFixed(18),
                        amountIn: trade.inputAmount,
                      },
                      client
                    ).then((invoke) => {
                      if (!invoke.ok) throw invoke.error
                      return invoke.value.amount
                    }),
                    outputCurrencyId: currencyId(reverseMapToken(trade.outputAmount.token) as Currency),
                    outputCurrencyAmountRaw: trade.outputAmount.amount,
                    expectedInputCurrencyAmountRaw: trade.inputAmount.amount,
                  }
                : {
                    type: TransactionType.SWAP as TransactionType.SWAP,
                    tradeType: TradeType.EXACT_OUTPUT as TradeType.EXACT_OUTPUT,
                    inputCurrencyId: currencyId(trade.inputAmount.currency),
                    maximumInputCurrencyAmountRaw: trade.maximumAmountIn(allowedSlippage).quotient.toString(),
                    outputCurrencyId: currencyId(trade.outputAmount.currency),
                    outputCurrencyAmountRaw: trade.outputAmount.quotient.toString(),
                    expectedInputCurrencyAmountRaw: trade.inputAmount.quotient.toString(),
                  }
            addTransaction(response, transactionInfo)

            return response.hash
          })
          .catch((error) => {
            // if the user rejected the tx, pass this along
            if (error?.code === 4001) {
              throw new Error(t`Transaction rejected.`)
            } else {
              // otherwise, the error was unexpected and we need to convey that
              console.error(`Swap failed`, error, address, calldata, value)

              throw new Error(t`Swap failed: ${swapErrorToUserReadableMessage(error)}`)
            }
          })
      },
      error: null,
    }
  }, [
    trade,
    library,
    account,
    chainId,
    recipient,
    recipientAddressOrName,
    swapCallsMaybeAsync,
    addTransaction,
    allowedSlippage,
    client,
  ])
}
