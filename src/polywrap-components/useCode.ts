import { useMemo } from 'react'

import { Uni_ChainIdEnum, Uni_Token, Uni_TradeTypeEnum } from '../polywrap'

const quoteCallParametersQuery: string = `
Client.query({
  uri: ensUri,
  query: \`query {
      quoteCallParameters(
          route: $route,
          amount: $amountSpecified,
          tradeType: $tradeType,
      )
    }\`,
  variables
})`.trim()

export interface quoteCallParametersVariables {
  independentToken?: Uni_Token
  independentAmount?: string
  tradeType: Uni_TradeTypeEnum
}

export function useQuoteCallParametersCode({
  independentToken,
  independentAmount,
  tradeType,
}: quoteCallParametersVariables): {
  query: string
  variables: string
} {
  return useMemo(
    () => ({
      query: quoteCallParametersQuery,
      variables: `
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

const createUncheckedTradeQuery: string = `
Client.invoke({
  uri: ensUri,
  module: 'query',
  method: 'createUncheckedTrade',
  input: {
    swap: {
      route: bestRoute,
      inputAmount: amountIn,
      outputAmount: amountOut,
    },
    tradeType: tradeType,
  }
})`.trim()

export interface createUncheckedTradeVariables {
  dependentToken?: Uni_Token
  dependentAmount?: string
  tradeType: Uni_TradeTypeEnum
}

export function useCreateUncheckedTradeCode({
  dependentToken,
  dependentAmount,
  tradeType,
}: createUncheckedTradeVariables): {
  query: string
  variables: string
} {
  return useMemo(
    () => ({
      query: createUncheckedTradeQuery,
      variables: `
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

const swapCallParametersQuery: string = `
Client.query({
  uri: ensUri,
  query: \`query {
      swapCallParameters(
          trades: $trades
          options: $swapOptions,
      )
    }\`,
  variables
})`.trim()

export interface swapCallParametersVariables {
  slippageTolerance?: string
  recipient?: string
  deadline?: string
}

export function useSwapCallParametersCode({ slippageTolerance, recipient, deadline }: swapCallParametersVariables): {
  query: string
  variables: string
} {
  return useMemo(
    () => ({
      query: swapCallParametersQuery,
      variables: `
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
