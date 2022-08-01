// eslint-disable-next-line no-restricted-imports
import { PolywrapClient } from '@polywrap/client-js'
import { usePolywrapClient } from '@polywrap/react'
import { Currency, Percent, TradeType } from '@uniswap/sdk-core'
import { useWeb3React } from '@web3-react/core'
import { SwapCallbackState, useSwapCallback as useLibSwapCallBack } from 'lib/hooks/swap/useSwapCallback'
import { ReactNode, useMemo } from 'react'

import { reverseMapToken } from '../polywrap-utils'
import { useTransactionAdder } from '../state/transactions/hooks'
import { TransactionInfo, TransactionType } from '../state/transactions/types'
import { currencyId } from '../utils/currencyId'
import { Uni_Module, Uni_TokenAmount, Uni_Trade, Uni_TradeTypeEnum } from '../wrap'
import useENS from './useENS'
import { SignatureData } from './useERC20Permit'
import useTransactionDeadline from './useTransactionDeadline'

// returns a function that will execute a swap, if the parameters are all valid
// and the user has approved the slippage adjusted input amount for the trade
export function useSwapCallback(
  trade: Uni_Trade | undefined, // trade to execute, required
  allowedSlippage: Percent, // in bips
  recipientAddressOrName: string | null, // the ENS name or address of the recipient of the trade, or null if swap should be returned to sender
  signatureData: SignatureData | undefined | null
): { state: SwapCallbackState; callback: null | (() => Promise<string>); error: ReactNode | null } {
  const { account } = useWeb3React()
  const client: PolywrapClient = usePolywrapClient()
  const deadline = useTransactionDeadline()

  const addTransaction = useTransactionAdder()

  const { address: recipientAddress } = useENS(recipientAddressOrName)
  const recipient = recipientAddressOrName === null ? account : recipientAddress

  const {
    state,
    callback: libCallback,
    error,
  } = useLibSwapCallBack({
    trade,
    allowedSlippage,
    recipientAddressOrName: recipient,
    signatureData,
    deadline,
  })

  const callback = useMemo(() => {
    if (!libCallback || !trade) {
      return null
    }
    return () =>
      libCallback().then(async (response) => {
        const transactionInfo: TransactionInfo =
          trade.tradeType === Uni_TradeTypeEnum.EXACT_INPUT
            ? {
                type: TransactionType.SWAP as TransactionType.SWAP,
                tradeType: TradeType.EXACT_INPUT as TradeType.EXACT_INPUT,
                inputCurrencyId: currencyId(reverseMapToken(trade.inputAmount.token) as Currency),
                inputCurrencyAmountRaw: trade.inputAmount.amount,
                expectedOutputCurrencyAmountRaw: trade.outputAmount.amount,
                outputCurrencyId: currencyId(reverseMapToken(trade.outputAmount.token) as Currency),
                minimumOutputCurrencyAmountRaw: await Uni_Module.tradeMinimumAmountOut(
                  {
                    tradeType: Uni_TradeTypeEnum.EXACT_INPUT,
                    slippageTolerance: allowedSlippage.toFixed(18),
                    amountOut: trade.outputAmount,
                  },
                  client
                ).then((invoke) => {
                  if (invoke.error) throw invoke.error
                  return (invoke.data as Uni_TokenAmount).amount
                }),
              }
            : {
                type: TransactionType.SWAP as TransactionType.SWAP,
                tradeType: TradeType.EXACT_OUTPUT as TradeType.EXACT_OUTPUT,
                inputCurrencyId: currencyId(reverseMapToken(trade.inputAmount.token) as Currency),
                maximumInputCurrencyAmountRaw: await Uni_Module.tradeMaximumAmountIn(
                  {
                    tradeType: Uni_TradeTypeEnum.EXACT_OUTPUT,
                    slippageTolerance: allowedSlippage.toFixed(18),
                    amountIn: trade.inputAmount,
                  },
                  client
                ).then((invoke) => {
                  if (invoke.error) throw invoke.error
                  return (invoke.data as Uni_TokenAmount).amount
                }),
                outputCurrencyId: currencyId(reverseMapToken(trade.outputAmount.token) as Currency),
                outputCurrencyAmountRaw: trade.outputAmount.amount,
                expectedInputCurrencyAmountRaw: trade.inputAmount.amount,
              }
        addTransaction(response, transactionInfo)
        return response.hash
      })
  }, [addTransaction, allowedSlippage, libCallback, trade, client])

  return {
    state,
    callback,
    error,
  }
}

// export function useSwapCallback(
//   trade: AnyTrade | undefined, // trade to execute, required
//   allowedSlippage: Percent, // in bips
//   recipientAddressOrName: string | null, // the ENS name or address of the recipient of the trade, or null if swap should be returned to sender
//   signatureData: SignatureData | undefined | null
// ): { state: SwapCallbackState; callback: null | (() => Promise<string>); error: ReactNode | null } {
//   const { account, chainId, library } = useActiveWeb3React()
//   const client: PolywrapClient = usePolywrapClient()
//
//   const swapCallsMaybeAsync = useSwapCallArguments(trade, allowedSlippage, recipientAddressOrName, signatureData)
//
//   const addTransaction = useTransactionAdder()
//
//   const { address: recipientAddress } = useENS(recipientAddressOrName)
//   const recipient = recipientAddressOrName === null ? account : recipientAddress
//
//   return useMemo(() => {
//     if (!trade || !library || !account || !chainId) {
//       return { state: SwapCallbackState.INVALID, callback: null, error: <Trans>Missing dependencies</Trans> }
//     }
//     if (!recipient) {
//       if (recipientAddressOrName !== null) {
//         return { state: SwapCallbackState.INVALID, callback: null, error: <Trans>Invalid recipient</Trans> }
//       } else {
//         return { state: SwapCallbackState.LOADING, callback: null, error: null }
//       }
//     }
//
//     return {
//       state: SwapCallbackState.VALID,
//       callback: async function onSwap(): Promise<string> {
//         const swapCalls: SwapCall[] = await Promise.all(
//           swapCallsMaybeAsync.map(async (call) => {
//             if ('calldata' in call) {
//               return call
//             } else {
//               const { calldata, value } = await call.params
//               return {
//                 address: call.address,
//                 calldata,
//                 value,
//               }
//             }
//           })
//         )
//
//         const estimatedCalls: SwapCallEstimate[] = await Promise.all(
//           swapCalls.map((call) => {
//             const { address, calldata, value } = call
//
//             const tx =
//               !value || isZero(value)
//                 ? { from: account, to: address, data: calldata }
//                 : {
//                   from: account,
//                   to: address,
//                   data: calldata,
//                   value,
//                 }
//
//             return library
//               .estimateGas(tx)
//               .then((gasEstimate) => {
//                 return {
//                   call,
//                   gasEstimate,
//                 }
//               })
//               .catch((gasError) => {
//                 console.debug('Gas estimate failed, trying eth_call to extract error', call)
//
//                 return library
//                   .call(tx)
//                   .then((result) => {
//                     console.debug('Unexpected successful call after failed estimate gas', call, gasError, result)
//                     return { call, error: <Trans>Unexpected issue with estimating the gas. Please try again.</Trans> }
//                   })
//                   .catch((callError) => {
//                     console.debug('Call threw error', call, callError)
//                     return { call, error: swapErrorToUserReadableMessage(callError) }
//                   })
//               })
//           })
//         )
//
//         // a successful estimation is a bignumber gas estimate and the next call is also a bignumber gas estimate
//         let bestCallOption: SuccessfulCall | SwapCallEstimate | undefined = estimatedCalls.find(
//           (el, ix, list): el is SuccessfulCall =>
//             'gasEstimate' in el && (ix === list.length - 1 || 'gasEstimate' in list[ix + 1])
//         )
//
//         // check if any calls errored with a recognizable error
//         if (!bestCallOption) {
//           const errorCalls = estimatedCalls.filter((call): call is FailedCall => 'error' in call)
//           if (errorCalls.length > 0) throw errorCalls[errorCalls.length - 1].error
//           const firstNoErrorCall = estimatedCalls.find<SwapCallEstimate>(
//             (call): call is SwapCallEstimate => !('error' in call)
//           )
//           if (!firstNoErrorCall) throw new Error(t`Unexpected error. Could not estimate gas for the swap.`)
//           bestCallOption = firstNoErrorCall
//         }
//
//         const {
//           call: { address, calldata, value },
//         } = bestCallOption
//
//         return library
//           .getSigner()
//           .sendTransaction({
//             from: account,
//             to: address,
//             data: calldata,
//             // let the wallet try if we can't estimate the gas
//             ...('gasEstimate' in bestCallOption ? { gasLimit: calculateGasMargin(bestCallOption.gasEstimate) } : {}),
//             ...(value && !isZero(value) ? { value } : {}),
//           })
//           .then(async (response) => {
//             const isV3Trade = isTrade(trade)
//             const transactionInfo =
//               trade.tradeType === TradeType.EXACT_INPUT || trade.tradeType === TradeTypeEnum.EXACT_INPUT
//                 ? isV3Trade
//                   ? {
//                     type: TransactionType.SWAP as TransactionType.SWAP,
//                     tradeType: TradeType.EXACT_INPUT as TradeType.EXACT_INPUT,
//                     inputCurrencyId: currencyId(reverseMapToken(trade.inputAmount.token) as Currency),
//                     inputCurrencyAmountRaw: trade.inputAmount.amount,
//                     expectedOutputCurrencyAmountRaw: trade.outputAmount.amount,
//                     outputCurrencyId: currencyId(reverseMapToken(trade.outputAmount.token) as Currency),
//                     minimumOutputCurrencyAmountRaw: await Uni_Module.tradeMinimumAmountOut(
//                       {
//                         tradeType: TradeTypeEnum.EXACT_INPUT,
//                         slippageTolerance: allowedSlippage.toFixed(18),
//                         amountOut: trade.outputAmount,
//                       },
//                       client
//                     ).then((invoke) => {
//                       if (invoke.error) throw invoke.error
//                       return (invoke.data as Uni_TokenAmount).amount
//                     }),
//                   }
//                   : {
//                     type: TransactionType.SWAP as TransactionType.SWAP,
//                     tradeType: TradeType.EXACT_INPUT as TradeType.EXACT_INPUT,
//                     inputCurrencyId: currencyId(trade.inputAmount.currency),
//                     inputCurrencyAmountRaw: trade.inputAmount.quotient.toString(),
//                     expectedOutputCurrencyAmountRaw: trade.outputAmount.quotient.toString(),
//                     outputCurrencyId: currencyId(trade.outputAmount.currency),
//                     minimumOutputCurrencyAmountRaw: trade.minimumAmountOut(allowedSlippage).quotient.toString(),
//                   }
//                 : isV3Trade
//                   ? {
//                     type: TransactionType.SWAP as TransactionType.SWAP,
//                     tradeType: TradeType.EXACT_OUTPUT as TradeType.EXACT_OUTPUT,
//                     inputCurrencyId: currencyId(reverseMapToken(trade.inputAmount.token) as Currency),
//                     maximumInputCurrencyAmountRaw: await Uni_Module.tradeMaximumAmountIn(
//                       {
//                         tradeType: TradeTypeEnum.EXACT_OUTPUT,
//                         slippageTolerance: allowedSlippage.toFixed(18),
//                         amountIn: trade.inputAmount,
//                       },
//                       client
//                     ).then((invoke) => {
//                       if (invoke.error) throw invoke.error
//                       return (invoke.data as Uni_TokenAmount).amount
//                     }),
//                     outputCurrencyId: currencyId(reverseMapToken(trade.outputAmount.token) as Currency),
//                     outputCurrencyAmountRaw: trade.outputAmount.amount,
//                     expectedInputCurrencyAmountRaw: trade.inputAmount.amount,
//                   }
//                   : {
//                     type: TransactionType.SWAP as TransactionType.SWAP,
//                     tradeType: TradeType.EXACT_OUTPUT as TradeType.EXACT_OUTPUT,
//                     inputCurrencyId: currencyId(trade.inputAmount.currency),
//                     maximumInputCurrencyAmountRaw: trade.maximumAmountIn(allowedSlippage).quotient.toString(),
//                     outputCurrencyId: currencyId(trade.outputAmount.currency),
//                     outputCurrencyAmountRaw: trade.outputAmount.quotient.toString(),
//                     expectedInputCurrencyAmountRaw: trade.inputAmount.quotient.toString(),
//                   }
//             addTransaction(response, transactionInfo)
//
//             return response.hash
//           })
//           .catch((error) => {
//             // if the user rejected the tx, pass this along
//             if (error?.code === 4001) {
//               throw new Error(t`Transaction rejected.`)
//             } else {
//               // otherwise, the error was unexpected and we need to convey that
//               console.error(`Swap failed`, error, address, calldata, value)
//
//               throw new Error(t`Swap failed: ${swapErrorToUserReadableMessage(error)}`)
//             }
//           })
//       },
//       error: null,
//     }
//   }, [
//     trade,
//     library,
//     account,
//     chainId,
//     recipient,
//     recipientAddressOrName,
//     swapCallsMaybeAsync,
//     addTransaction,
//     allowedSlippage,
//     client,
//   ])
// }
