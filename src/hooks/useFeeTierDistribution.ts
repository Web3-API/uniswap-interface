import { skipToken } from '@reduxjs/toolkit/query/react'
import { Currency, Token } from '@uniswap/sdk-core'
import ms from 'ms.macro'
import { useMemo } from 'react'
import ReactGA from 'react-ga'
import { useBlockNumber } from 'state/application/hooks'
import { useFeeTierDistributionQuery } from 'state/data/enhanced'
import { FeeTierDistributionQuery } from 'state/data/generated'

import { FeeAmountEnum } from '../polywrap'
import { PoolState, usePool } from './usePools'

// maximum number of blocks past which we consider the data stale
const MAX_DATA_BLOCK_AGE = 20

interface FeeTierDistribution {
  isLoading: boolean
  isError: boolean
  largestUsageFeeTier?: FeeAmountEnum | undefined

  // distributions as percentages of overall liquidity
  distributions?: Record<FeeAmountEnum, number | undefined>
}

export function useFeeTierDistribution(
  currencyA: Currency | undefined,
  currencyB: Currency | undefined
): FeeTierDistribution {
  const { isFetching, isLoading, isUninitialized, isError, distributions } = usePoolTVL(
    currencyA?.wrapped,
    currencyB?.wrapped
  )

  // fetch all pool states to determine pool state
  const [poolStateVeryLow] = usePool(currencyA, currencyB, FeeAmountEnum.LOWEST)
  const [poolStateLow] = usePool(currencyA, currencyB, FeeAmountEnum.LOW)
  const [poolStateMedium] = usePool(currencyA, currencyB, FeeAmountEnum.MEDIUM)
  const [poolStateHigh] = usePool(currencyA, currencyB, FeeAmountEnum.HIGH)

  return useMemo(() => {
    if (isLoading || isFetching || isUninitialized || isError || !distributions) {
      return {
        isLoading: isLoading || isFetching || !isUninitialized,
        isError,
        distributions,
      }
    }

    const largestUsageFeeTier = Object.keys(distributions)
      .map((d) => Number(d))
      .filter((d: FeeAmountEnum) => distributions[d] !== 0 && distributions[d] !== undefined)
      .reduce((a: FeeAmountEnum, b: FeeAmountEnum) => ((distributions[a] ?? 0) > (distributions[b] ?? 0) ? a : b), -1)

    const percentages =
      !isLoading &&
      !isError &&
      distributions &&
      poolStateVeryLow !== PoolState.LOADING &&
      poolStateLow !== PoolState.LOADING &&
      poolStateMedium !== PoolState.LOADING &&
      poolStateHigh !== PoolState.LOADING
        ? {
            [FeeAmountEnum.LOWEST]:
              poolStateVeryLow === PoolState.EXISTS ? (distributions[FeeAmountEnum.LOWEST] ?? 0) * 100 : undefined,
            [FeeAmountEnum.LOW]:
              poolStateLow === PoolState.EXISTS ? (distributions[FeeAmountEnum.LOW] ?? 0) * 100 : undefined,
            [FeeAmountEnum.MEDIUM]:
              poolStateMedium === PoolState.EXISTS ? (distributions[FeeAmountEnum.MEDIUM] ?? 0) * 100 : undefined,
            [FeeAmountEnum.HIGH]:
              poolStateHigh === PoolState.EXISTS ? (distributions[FeeAmountEnum.HIGH] ?? 0) * 100 : undefined,
          }
        : undefined

    return {
      isLoading,
      isError,
      distributions: percentages,
      largestUsageFeeTier: largestUsageFeeTier === -1 ? undefined : largestUsageFeeTier,
    }
  }, [
    isLoading,
    isFetching,
    isUninitialized,
    isError,
    distributions,
    poolStateVeryLow,
    poolStateLow,
    poolStateMedium,
    poolStateHigh,
  ])
}

function usePoolTVL(token0: Token | undefined, token1: Token | undefined) {
  const latestBlock = useBlockNumber()

  const { isLoading, isFetching, isUninitialized, isError, data } = useFeeTierDistributionQuery(
    token0 && token1 ? { token0: token0.address.toLowerCase(), token1: token1.address.toLowerCase() } : skipToken,
    {
      pollingInterval: ms`30s`,
    }
  )

  const { asToken0, asToken1, _meta } = (data as FeeTierDistributionQuery) ?? {}

  return useMemo(() => {
    if (!latestBlock || !_meta || !asToken0 || !asToken1) {
      return {
        isLoading,
        isFetching,
        isUninitialized,
        isError,
      }
    }

    if (latestBlock - (_meta?.block?.number ?? 0) > MAX_DATA_BLOCK_AGE) {
      ReactGA.exception({
        description: `Graph stale (latest block: ${latestBlock})`,
      })

      return {
        isLoading,
        isFetching,
        isUninitialized,
        isError,
      }
    }

    const all = asToken0.concat(asToken1)

    // TODO: will this work without changing FeeAmountEnum to contain fee amount values?
    // sum tvl for token0 and token1 by fee tier
    const tvlByFeeTier = all.reduce<{ [feeAmount: number]: [number | undefined, number | undefined] }>(
      (acc, value) => {
        acc[value.feeTier][0] = (acc[value.feeTier][0] ?? 0) + Number(value.totalValueLockedToken0)
        acc[value.feeTier][1] = (acc[value.feeTier][1] ?? 0) + Number(value.totalValueLockedToken1)
        return acc
      },
      {
        [FeeAmountEnum.LOWEST]: [undefined, undefined],
        [FeeAmountEnum.LOW]: [undefined, undefined],
        [FeeAmountEnum.MEDIUM]: [undefined, undefined],
        [FeeAmountEnum.HIGH]: [undefined, undefined],
      } as Record<FeeAmountEnum, [number | undefined, number | undefined]>
    )

    // sum total tvl for token0 and token1
    const [sumToken0Tvl, sumToken1Tvl] = Object.values(tvlByFeeTier).reduce(
      (acc: [number, number], value) => {
        acc[0] += value[0] ?? 0
        acc[1] += value[1] ?? 0
        return acc
      },
      [0, 0]
    )

    // returns undefined if both tvl0 and tvl1 are undefined (pool not created)
    const mean = (tvl0: number | undefined, sumTvl0: number, tvl1: number | undefined, sumTvl1: number) =>
      tvl0 === undefined && tvl1 === undefined ? undefined : ((tvl0 ?? 0) + (tvl1 ?? 0)) / (sumTvl0 + sumTvl1) || 0

    const distributions: Record<FeeAmountEnum, number | undefined> = {
      [FeeAmountEnum.LOWEST]: mean(
        tvlByFeeTier[FeeAmountEnum.LOWEST][0],
        sumToken0Tvl,
        tvlByFeeTier[FeeAmountEnum.LOWEST][1],
        sumToken1Tvl
      ),
      [FeeAmountEnum.LOW]: mean(
        tvlByFeeTier[FeeAmountEnum.LOW][0],
        sumToken0Tvl,
        tvlByFeeTier[FeeAmountEnum.LOW][1],
        sumToken1Tvl
      ),
      [FeeAmountEnum.MEDIUM]: mean(
        tvlByFeeTier[FeeAmountEnum.MEDIUM][0],
        sumToken0Tvl,
        tvlByFeeTier[FeeAmountEnum.MEDIUM][1],
        sumToken1Tvl
      ),
      [FeeAmountEnum.HIGH]: mean(
        tvlByFeeTier[FeeAmountEnum.HIGH][0],
        sumToken0Tvl,
        tvlByFeeTier[FeeAmountEnum.HIGH][1],
        sumToken1Tvl
      ),
    }

    return {
      isLoading,
      isFetching,
      isUninitialized,
      isError,
      distributions,
    }
  }, [_meta, asToken0, asToken1, isLoading, isError, isFetching, isUninitialized, latestBlock])
}
