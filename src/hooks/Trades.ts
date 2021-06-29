import { w3IsTradeBetter } from 'utils/trades'
import { Pair } from '@uniswap/sdk'
import flatMap from 'lodash.flatmap'
import { useMemo } from 'react'

import {
  BASES_TO_CHECK_TRADES_AGAINST,
  CUSTOM_BASES,
  W3_BETTER_TRADE_LESS_HOPS_THRESHOLD,
  ADDITIONAL_BASES
} from '../constants'
import { PairState, usePairs } from '../data/Reserves'
import { useActiveWeb3React } from './index'
import { useUnsupportedTokens } from './W3Tokens'
import { useUserSingleHopOnly } from 'state/user/hooks'
import { w3bestTradeExactIn, w3bestTradeExactOut } from '../web3api/tradeWrappers'
import { W3Pair, W3Token, W3TokenAmount, W3Trade } from '../web3api/types'
import { mapChainId, mapPair, mapToken, reverseMapToken } from '../web3api/mapping'
import { tokenEquals, tokenDeps, tokenAmountDeps, pairDeps } from '../web3api/utils'
import { wrappedCurrency } from '../utils/w3WrappedCurrency'
import { Web3ApiClient } from '@web3api/client-js'
import { useWeb3ApiClient } from '@web3api/react'

function useAllCommonPairs(currencyA?: W3Token, currencyB?: W3Token): W3Pair[] {
  const { chainId } = useActiveWeb3React()

  const [tokenA, tokenB] = chainId
    ? [
        wrappedCurrency(currencyA, chainId ? mapChainId(chainId) : undefined),
        wrappedCurrency(currencyB, chainId ? mapChainId(chainId) : undefined)
      ]
    : [undefined, undefined]

  const bases: W3Token[] = useMemo(() => {
    if (!chainId) return []

    const common = BASES_TO_CHECK_TRADES_AGAINST[chainId]?.map(mapToken) ?? []
    const additionalA = tokenA ? ADDITIONAL_BASES[chainId]?.[tokenA.address]?.map(mapToken) ?? [] : []
    const additionalB = tokenB ? ADDITIONAL_BASES[chainId]?.[tokenB.address]?.map(mapToken) ?? [] : []

    return [...common, ...additionalA, ...additionalB]
  }, [chainId, tokenA, tokenB])

  const basePairs: [W3Token, W3Token][] = useMemo(
    () => flatMap(bases, (base: W3Token): [W3Token, W3Token][] => bases.map(otherBase => [base, otherBase])),
    [bases]
  )

  const allPairCombinations: [W3Token, W3Token][] = useMemo(
    () =>
      tokenA && tokenB
        ? [
            // the direct pair
            [tokenA, tokenB],
            // token A against all bases
            ...bases.map((base): [W3Token, W3Token] => [tokenA, base]),
            // token B against all bases
            ...bases.map((base): [W3Token, W3Token] => [tokenB, base]),
            // each base against all bases
            ...basePairs
          ]
            .filter((tokens): tokens is [W3Token, W3Token] => Boolean(tokens[0] && tokens[1]))
            .filter(([t0, t1]) => t0.address !== t1.address)
            .filter(([tokenA, tokenB]) => {
              if (!chainId) return true
              const customBases = CUSTOM_BASES[chainId]

              const customBasesA: W3Token[] | undefined = customBases?.[tokenA.address]?.map(mapToken)
              const customBasesB: W3Token[] | undefined = customBases?.[tokenB.address]?.map(mapToken)

              if (!customBasesA && !customBasesB) return true

              if (customBasesA && !customBasesA.find(base => tokenEquals(tokenB, base))) return false
              if (customBasesB && !customBasesB.find(base => tokenEquals(tokenA, base))) return false

              return true
            })
        : [],
    [tokenA, tokenB, bases, basePairs, chainId]
  )

  const allPairs = usePairs(allPairCombinations.map(val => [reverseMapToken(val[0]), reverseMapToken(val[1])]))

  // only pass along valid pairs, non-duplicated pairs
  return useMemo(
    () =>
      Object.values(
        allPairs
          // filter out invalid pairs
          .filter((result): result is [PairState.EXISTS, Pair] => Boolean(result[0] === PairState.EXISTS && result[1]))
          // filter out duplicated pairs
          .reduce<{ [pairAddress: string]: Pair }>((memo, [, curr]) => {
            memo[curr.liquidityToken.address] = memo[curr.liquidityToken.address] ?? curr
            return memo
          }, {})
      ).map(mapPair),
    [allPairs]
  )
}

const MAX_HOPS = 3

async function bestExactIn(
  client: Web3ApiClient,
  allowedPairs: W3Pair[],
  singleHopOnly: boolean,
  currencyAmountIn?: W3TokenAmount,
  currencyOut?: W3Token
): Promise<W3Trade | null> {
  if (currencyAmountIn && currencyOut && allowedPairs.length > 0) {
    if (singleHopOnly) {
      // Expect to return true.
      return (
        (
          await w3bestTradeExactIn(client, allowedPairs, currencyAmountIn, currencyOut, {
            maxHops: 1,
            maxNumResults: 1
          })
        )?.[0] ?? null
      )
    }
    // search through trades with varying hops, find best trade out of them
    let bestTradeSoFar: W3Trade | null = null
    for (let i = 1; i <= MAX_HOPS; i++) {
      const currentTrade: W3Trade | null =
        (
          await w3bestTradeExactIn(client, allowedPairs, currencyAmountIn, currencyOut, {
            maxHops: i,
            maxNumResults: 1
          })
        )?.[0] ?? null
      // if current trade is best yet, save it
      if (await w3IsTradeBetter(client, bestTradeSoFar, currentTrade, W3_BETTER_TRADE_LESS_HOPS_THRESHOLD)) {
        bestTradeSoFar = currentTrade
      }
    }
    return bestTradeSoFar
  }

  return null
}

async function bestExactOut(
  client: Web3ApiClient,
  allowedPairs: W3Pair[],
  singleHopOnly: boolean,
  currencyIn?: W3Token,
  currencyAmountOut?: W3TokenAmount
): Promise<W3Trade | null> {
  if (currencyIn && currencyAmountOut && allowedPairs.length > 0) {
    if (singleHopOnly) {
      return (
        (
          await w3bestTradeExactOut(client, allowedPairs, currencyIn, currencyAmountOut, {
            maxHops: 1,
            maxNumResults: 1
          })
        )?.[0] ?? null
      )
    }
    // search through trades with varying hops, find best trade out of them
    let bestTradeSoFar: W3Trade | null = null
    for (let i = 1; i <= MAX_HOPS; i++) {
      const currentTrade: W3Trade =
        (
          await w3bestTradeExactOut(client, allowedPairs, currencyIn, currencyAmountOut, {
            maxHops: i,
            maxNumResults: 1
          })
        )?.[0] ?? null
      if (await w3IsTradeBetter(client, bestTradeSoFar, currentTrade, W3_BETTER_TRADE_LESS_HOPS_THRESHOLD)) {
        bestTradeSoFar = currentTrade
      }
    }
    return bestTradeSoFar
  }
  return null
}

/**
 * Returns the best trade for the exact amount of tokens in to the given token out
 */
export function useTradeExactIn(currencyAmountIn?: W3TokenAmount, currencyOut?: W3Token): Promise<W3Trade | null> | undefined {
  const allowedPairs = useAllCommonPairs(currencyAmountIn?.token, currencyOut)
  const [singleHopOnly] = useUserSingleHopOnly()
  const client: Web3ApiClient = useWeb3ApiClient()
  const allowedPairsDeps: unknown[] = [];
  allowedPairs.forEach((pair) => {
    allowedPairsDeps.push(...pairDeps(pair))
  });

  return useMemo(() => {
    if (!currencyAmountIn || !currencyOut) {
      return undefined;
    } else {
      return bestExactIn(client, allowedPairs, singleHopOnly, currencyAmountIn, currencyOut);
    }
  }, [
    ...allowedPairsDeps,
    singleHopOnly,
    ...tokenAmountDeps(currencyAmountIn),
    ...tokenDeps(currencyOut)
  ])
}

/**
 * Returns the best trade for the token in to the exact amount of token out
 */
export function useTradeExactOut(currencyIn?: W3Token, currencyAmountOut?: W3TokenAmount): Promise<W3Trade | null> | undefined {
  const allowedPairs = useAllCommonPairs(currencyIn, currencyAmountOut?.token)
  const [singleHopOnly] = useUserSingleHopOnly()
  const client: Web3ApiClient = useWeb3ApiClient()
  const allowedPairsDeps: unknown[] = [];
  allowedPairs.forEach((pair) => {
    allowedPairsDeps.push(...pairDeps(pair))
  });

  return useMemo(() => {
    if (!currencyIn || !currencyAmountOut) {
      return undefined;
    } else {
      return bestExactOut(client, allowedPairs, singleHopOnly, currencyIn, currencyAmountOut)
    }
  }, [
    ...allowedPairsDeps,
    singleHopOnly,
    ...tokenDeps(currencyIn),
    ...tokenAmountDeps(currencyAmountOut)
  ])
}

export function useIsTransactionUnsupported(currencyIn?: W3Token, currencyOut?: W3Token): boolean {
  const unsupportedTokens: { [address: string]: W3Token } = useUnsupportedTokens()
  const { chainId } = useActiveWeb3React()

  const tokenIn = wrappedCurrency(currencyIn, chainId ? mapChainId(chainId) : undefined)
  const tokenOut = wrappedCurrency(currencyOut, chainId ? mapChainId(chainId) : undefined)

  // if unsupported list loaded & either token on list, mark as unsupported
  if (unsupportedTokens) {
    if (tokenIn && Object.keys(unsupportedTokens).includes(tokenIn.address)) {
      return true
    }
    if (tokenOut && Object.keys(unsupportedTokens).includes(tokenOut.address)) {
      return true
    }
  }

  return false
}
