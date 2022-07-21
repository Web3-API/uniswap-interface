import { useMemo } from 'react'

import { Uni_ChainIdEnum, Uni_Token, Uni_TradeTypeEnum } from '../wrap'

const quoteCallParameters: string = `
Client.invoke({
  uri: ensUri,
  method: 'quoteCallParameters',
  args: {
    route: route,
    amount: amountSpecified,
    tradeType: tradeType,
  }
})`.trim()

export interface quoteCallParametersArgs {
  independentToken?: Uni_Token
  independentAmount?: string
  tradeType: Uni_TradeTypeEnum
}

export function useQuoteCallParametersCode({
  independentToken,
  independentAmount,
  tradeType,
}: quoteCallParametersArgs): {
  invocation: string
  args: string
} {
  return useMemo(
    () => ({
      invocation: quoteCallParameters,
      args: `
const tradeType = TradeType.${Uni_TradeTypeEnum[tradeType]}
const amountSpecified = {
  token: {
    chainId: ${independentToken ? 'ChainId.' + Uni_ChainIdEnum[independentToken.chainId] : 'undefined'},
    address: '${independentToken ? independentToken.address : ''}',
    currency: {
      decimals: ${independentToken ? independentToken.currency.decimals : 'undefined'},
      symbol: ${independentToken ? `'${independentToken.currency.symbol}'` : undefined},
      name: ${independentToken ? `'${independentToken.currency.name}'` : undefined},
    }
  },
  amount: '${independentAmount ?? 0}',
}
`.trim(),
    }),
    [independentAmount, independentToken, tradeType]
  )
}

const createUncheckedTrade: string = `
Client.invoke({
  uri: ensUri,
  method: 'createUncheckedTrade',
  args: {
    swap: {
      route: bestRoute,
      inputAmount: amountIn,
      outputAmount: amountOut,
    },
    tradeType: tradeType,
  }
})`.trim()

export interface createUncheckedTradeArgs {
  dependentToken?: Uni_Token
  dependentAmount?: string
  tradeType: Uni_TradeTypeEnum
}

export function useCreateUncheckedTradeCode({ dependentToken, dependentAmount, tradeType }: createUncheckedTradeArgs): {
  invocation: string
  args: string
} {
  return useMemo(
    () => ({
      invocation: createUncheckedTrade,
      args: `
const tradeType = TradeType.${Uni_TradeTypeEnum[tradeType]}
const ${tradeType === Uni_TradeTypeEnum.EXACT_INPUT ? 'amountOut' : 'amountIn'} = {
  token: {
    chainId: ${dependentToken ? 'ChainId.' + Uni_ChainIdEnum[dependentToken.chainId] : 'undefined'},
    address: '${dependentToken ? dependentToken.address : ''}',
    currency: {
      decimals: ${dependentToken ? dependentToken.currency.decimals : 'undefined'},
      symbol: ${dependentToken ? `'${dependentToken.currency.symbol}'` : undefined},
      name: ${dependentToken ? `'${dependentToken.currency.name}'` : undefined},
    }
  },
  amount: '${dependentAmount ?? '0'}',
}
`.trim(),
    }),
    [dependentAmount, dependentToken, tradeType]
  )
}

const swapCallParameters: string = `
Client.invoke({
  uri: ensUri,
  method: 'swapCallParameters',
  args: {
    trades: trades,
    options: swapOptions,
  }
})`.trim()

export interface swapCallParametersArgs {
  slippageTolerance?: string
  recipient?: string
  deadline?: string
}

export function useSwapCallParametersCode({ slippageTolerance, recipient, deadline }: swapCallParametersArgs): {
  invocation: string
  args: string
} {
  return useMemo(
    () => ({
      invocation: swapCallParameters,
      args: `
const swapOptions = {
  slippageTolerance: ${slippageTolerance}%,
  recipient: ${recipient ? `'${recipient}'` : undefined},
  deadline: ${deadline ? `'${deadline}'` : undefined},
  inputTokenPermit: inputTokenPermit
}
`.trim(),
    }),
    [slippageTolerance, recipient, deadline]
  )
}
