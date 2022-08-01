import { BigNumber } from '@ethersproject/bignumber'
import { PolywrapClient } from '@polywrap/client-js'
import { usePolywrapClient } from '@polywrap/react'
import { Trade as RouterTrade } from '@uniswap/router-sdk'
import { Currency, CurrencyAmount, Percent, TradeType } from '@uniswap/sdk-core'
import { Trade as V2Trade } from '@uniswap/v2-sdk'
import { useWeb3React } from '@web3-react/core'
import { V3_ROUTER_ADDRESS } from 'constants/addresses'
import { useMemo } from 'react'
import approveAmountCalldata from 'utils/approveAmountCalldata'

import { ArgentWalletContract } from '../abis/types'
import { isNative, isTrade, reverseMapTokenAmount } from '../polywrap-utils'
import { Uni_FeeOptions, Uni_MethodParameters, Uni_Module, Uni_PermitV, Uni_Trade } from '../wrap'
import { useArgentWalletContract } from './useArgentWalletContract'
import useENS from './useENS'
import { SignatureData } from './useERC20Permit'

export type AnyTrade = V2Trade<Currency, Currency, TradeType> | Uni_Trade | RouterTrade<Currency, Currency, TradeType>

export interface SwapCall {
  address: string
  calldata: string
  value: string
}

export interface SwapCallAsync {
  address: string
  params: Promise<Uni_MethodParameters>
}

/**
 * Returns the swap calls that can be used to make the trade
 * @param trade trade to execute
 * @param allowedSlippage user allowed slippage
 * @param recipientAddressOrName the ENS name or address of the recipient of the swap output
 * @param signatureData the signature data of the permit of the input token amount, if available
 */
export function useSwapCallArguments(
  trade: Uni_Trade | undefined, // trade to execute, required
  allowedSlippage: Percent, // in bips
  recipientAddressOrName: string | null | undefined, // the ENS name or address of the recipient of the trade, or null if swap should be returned to sender
  signatureData: SignatureData | null | undefined,
  deadline: BigNumber | undefined,
  feeOptions: Uni_FeeOptions | undefined
): (SwapCall | SwapCallAsync)[] {
  const { account, chainId, provider } = useWeb3React()
  const client: PolywrapClient = usePolywrapClient()

  const { address: recipientAddress } = useENS(recipientAddressOrName)
  const recipient = recipientAddressOrName === null ? account : recipientAddress
  const argentWalletContract = useArgentWalletContract()

  return useMemo(() => {
    if (!trade || !recipient || !provider || !account || !chainId || !deadline) return []

    // swap options shared by v3 and v2+v3 swap routers
    const sharedSwapOptions = {
      fee: feeOptions,
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

    const swapRouterAddress = chainId ? V3_ROUTER_ADDRESS[chainId] : undefined
    if (!swapRouterAddress) return []

    const swapParams = Uni_Module.swapCallParameters(
      {
        trades: [trade],
        options: {
          slippageTolerance: sharedSwapOptions.slippageTolerance.toFixed(18),
          recipient: sharedSwapOptions.recipient,
          deadline: deadline.toString(),
          inputTokenPermit: sharedSwapOptions.inputTokenPermit
            ? {
                v: `v_${sharedSwapOptions.inputTokenPermit.v}` as Uni_PermitV,
                r: sharedSwapOptions.inputTokenPermit.r,
                s: sharedSwapOptions.inputTokenPermit.s,
                amount: sharedSwapOptions.inputTokenPermit.amount,
                deadline: deadline.toString(),
                nonce: sharedSwapOptions.inputTokenPermit.nonce?.toString(),
                expiry: sharedSwapOptions.inputTokenPermit.expiry?.toString(),
              }
            : undefined,
          fee: sharedSwapOptions.fee,
        },
      },
      client
    ).then((paramsInvoke) => {
      if (paramsInvoke.error) throw paramsInvoke.error
      return paramsInvoke.data as Uni_MethodParameters
    })

    if (argentWalletContract && trade !== undefined && !isNative(trade.inputAmount.token)) {
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
  }, [
    trade,
    recipient,
    provider,
    account,
    chainId,
    deadline,
    allowedSlippage,
    argentWalletContract,
    signatureData,
    client,
    feeOptions,
  ])
}

async function createArgentParams(
  client: PolywrapClient,
  asyncParams: Uni_MethodParameters | Promise<Uni_MethodParameters>,
  trade: Uni_Trade | RouterTrade<Currency, Currency, TradeType>,
  allowedSlippage: Percent,
  argentWalletContract: ArgentWalletContract,
  swapRouterAddress: string
): Promise<Uni_MethodParameters> {
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
    if (maxInInvoke.error) console.error(maxInInvoke.error)
    maxIn = reverseMapTokenAmount(maxInInvoke.data)
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
