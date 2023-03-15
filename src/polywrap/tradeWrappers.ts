import {
  W3BestTradeOptions,
  W3ChainId,
  W3Pair,
  W3StaticTxResult,
  W3SwapParameters,
  W3Token,
  W3TokenAmount,
  W3Trade,
  W3TradeOptions,
  W3TxOverrides,
  W3TxResponse
} from './types'
import { ipfsUri } from './constants'
import Decimal from 'decimal.js'
import { PolywrapClient } from '@polywrap/client-js'
import { chainIdToName } from './utils'

export async function w3TradeExecutionPrice(client: PolywrapClient, trade: W3Trade): Promise<Decimal> {
  const result = await client.invoke<string>({
    uri: ipfsUri.uri,
    method: 'tradeExecutionPrice',
    args: { trade }
  })
  if (!result.ok) throw result.error
  return new Decimal(result.value)
}

export async function w3bestTradeExactIn(
  client: PolywrapClient,
  allowedPairs: W3Pair[],
  currencyAmountIn: W3TokenAmount,
  currencyOut: W3Token,
  bestTradeOptions: W3BestTradeOptions
): Promise<W3Trade[]> {
  const result = await client.invoke<W3Trade[]>({
    uri: ipfsUri.uri,
    method: 'bestTradeExactIn',
    args: {
      pairs: allowedPairs,
      amountIn: currencyAmountIn,
      tokenOut: currencyOut,
      options: bestTradeOptions
    }
  })
  if (!result.ok) throw result.error
  return result.value
}

export async function w3bestTradeExactOut(
  client: PolywrapClient,
  allowedPairs: W3Pair[],
  currencyIn: W3Token,
  currencyAmountOut: W3TokenAmount,
  bestTradeOptions: W3BestTradeOptions
): Promise<W3Trade[]> {
  const result = await client.invoke<W3Trade[]>({
    uri: ipfsUri.uri,
    method: 'bestTradeExactOut',
    args: {
      pairs: allowedPairs,
      tokenIn: currencyIn,
      amountOut: currencyAmountOut,
      options: bestTradeOptions
    }
  })
  if (!result.ok) throw result.error
  return result.value
}

export async function w3TradeMaximumAmountIn(
  client: PolywrapClient,
  trade: W3Trade,
  slippageTolerance: string
): Promise<W3TokenAmount> {
  const result = await client.invoke<W3TokenAmount>({
    uri: ipfsUri.uri,
    method: 'tradeMaximumAmountIn',
    args: {
      trade: trade,
      slippageTolerance: slippageTolerance
    }
  })
  if (!result.ok) throw result.error
  return result.value
}

export async function w3TradeMinimumAmountOut(
  client: PolywrapClient,
  trade: W3Trade,
  slippageTolerance: string
): Promise<W3TokenAmount> {
  const result = await client.invoke<W3TokenAmount>({
    uri: ipfsUri.uri,
    method: 'tradeMinimumAmountOut',
    args: {
      trade: trade,
      slippageTolerance: slippageTolerance
    }
  })
  if (!result.ok) throw result.error
  return result.value
}

export async function w3SwapCallParameters(
  client: PolywrapClient,
  trade: W3Trade,
  tradeOptions: W3TradeOptions
): Promise<W3SwapParameters> {
  const result = await client.invoke<W3SwapParameters>({
    uri: ipfsUri.uri,
    method: 'swapCallParameters',
    args: {
      trade: trade,
      tradeOptions: tradeOptions
    }
  })
  if (!result.ok) throw result.error
  return result.value
}

export async function w3TradeSlippage(client: PolywrapClient, trade: W3Trade): Promise<Decimal> {
  const result = await client.invoke<string>({
    uri: ipfsUri.uri,
    method: 'tradeSlippage',
    args: {
      trade: trade
    }
  })
  if (!result.ok) throw result.error
  return new Decimal(result.value)
}

export async function w3ExecCall(
  client: PolywrapClient,
  parameters: W3SwapParameters,
  chainId: W3ChainId,
  txOverrides?: W3TxOverrides
): Promise<W3TxResponse> {
  const result = await client.invoke<W3TxResponse>({
    uri: ipfsUri.uri,
    method: 'execCall',
    args: {
      parameters: parameters,
      chainId: chainIdToName(chainId),
      txOverrides: txOverrides ?? {}
    }
  })
  if (!result.ok) throw result.error
  return result.value
}

export async function w3EstimateGas(
  client: PolywrapClient,
  parameters: W3SwapParameters,
  chainId: W3ChainId
): Promise<string> {
  const result = await client.invoke<string>({
    uri: ipfsUri.uri,
    method: 'estimateGas',
    args: {
      parameters: parameters,
      chainId: chainIdToName(chainId)
    }
  })
  if (!result.ok) throw result.error
  return result.value
}

export async function w3ExecCallStatic(
  client: PolywrapClient,
  parameters: W3SwapParameters,
  chainId: W3ChainId
): Promise<string> {
  const result = await client.invoke<W3StaticTxResult>({
    uri: ipfsUri.uri,
    method: 'execCallStatic',
    args: {
      parameters: parameters,
      chainId: chainIdToName(chainId)
    }
  })
  if (!result.ok) throw result.error
  return result.value.error ? result.value.result : ''
}

export async function w3Approve(
  client: PolywrapClient,
  token: W3Token,
  amountToApprove?: string,
  txOverrides?: W3TxOverrides
): Promise<W3TxResponse> {
  const result = await client.invoke<W3TxResponse>({
    uri: ipfsUri.uri,
    method: 'approve',
    args: {
      token: token,
      amount: amountToApprove ?? '115792089237316195423570985008687907853269984665640564039457584007913129639935',
      overrides: txOverrides ?? {}
    }
  })
  if (!result.ok) throw result.error
  return result.value
}

export async function w3PairAddress(client: PolywrapClient, token0: W3Token, token1: W3Token): Promise<string> {
  const result = await client.invoke<string>({
    uri: ipfsUri.uri,
    method: 'pairAddress',
    args: {
      token0: token0,
      token1: token1
    }
  })
  if (!result.ok) throw result.error
  return result.value
}
