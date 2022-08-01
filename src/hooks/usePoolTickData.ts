import { PolywrapClient } from '@polywrap/client-js'
import { usePolywrapClient, usePolywrapInvoke } from '@polywrap/react'
import { skipToken } from '@reduxjs/toolkit/query/react'
import { Currency, Price } from '@uniswap/sdk-core'
import { SupportedChainId } from 'constants/chains'
import { ZERO_ADDRESS } from 'constants/misc'
import JSBI from 'jsbi'
import { useSingleContractMultipleData } from 'lib/hooks/multicall'
import ms from 'ms.macro'
import { useEffect, useMemo, useRef, useState } from 'react'
import { useAllV3TicksQuery } from 'state/data/enhanced'
import computeSurroundingTicks from 'utils/computeSurroundingTicks'

import { feeAmountToTickSpacing, mapToken, reverseMapFeeAmount, reverseMapToken, wrapperUri } from '../polywrap-utils'
import { CancelablePromise, makeCancelable } from '../polywrap-utils/makeCancelable'
import { Uni_FeeAmountEnum as FeeAmountEnum, Uni_Module, Uni_Pool, Uni_Price } from '../wrap'
import { useTickLens } from './useContract'
import { PoolState, usePool } from './usePools'

const PRICE_FIXED_DIGITS = 8
const CHAIN_IDS_MISSING_SUBGRAPH_DATA = [SupportedChainId.ARBITRUM_ONE, SupportedChainId.ARBITRUM_RINKEBY]

export interface TickData {
  tick: number
  liquidityNet: JSBI
  liquidityGross: JSBI
}

// Tick with fields parsed to JSBIs, and active liquidity computed.
export interface TickProcessed {
  tick: number
  liquidityActive: JSBI
  liquidityNet: JSBI
  price0: string
}

const REFRESH_FREQUENCY = { blocksPerFetch: 2 }

const getActiveTick = (tickCurrent: number | undefined, feeAmount: FeeAmountEnum | undefined) => {
  if (tickCurrent && feeAmount !== undefined) {
    const tickSpacing = feeAmountToTickSpacing(feeAmount)
    return Math.floor(tickCurrent / tickSpacing) * tickSpacing
  }
  return undefined
}

const bitmapIndex = (tick: number, tickSpacing: number) => {
  return Math.floor(tick / tickSpacing / 256)
}

function useTicksFromTickLens(
  currencyA: Currency | undefined,
  currencyB: Currency | undefined,
  feeAmount: FeeAmountEnum | undefined,
  numSurroundingTicks: number | undefined = 125
) {
  const [tickDataLatestSynced, setTickDataLatestSynced] = useState<TickData[]>([])

  const [poolState, pool] = usePool(currencyA, currencyB, feeAmount)

  const tickSpacing = feeAmount === undefined ? undefined : feeAmountToTickSpacing(feeAmount)

  const { data: activeTick, execute: nearestUsableTick } = usePolywrapInvoke<number | undefined>({
    uri: wrapperUri,
    method: 'nearestUsableTick',
  })
  const { data: poolAddress, execute: getPoolAddress } = usePolywrapInvoke<string | undefined>({
    uri: wrapperUri,
    method: 'getPoolAddress',
  })

  useEffect(() => {
    if (pool?.tickCurrent && tickSpacing) {
      void nearestUsableTick({
        tick: pool.tickCurrent,
        tickSpacing,
      })
    }
    if (currencyA && currencyB && feeAmount !== undefined && poolState === PoolState.EXISTS) {
      void getPoolAddress({
        tokenA: mapToken(currencyA.wrapped),
        tokenB: mapToken(currencyB.wrapped),
        fee: feeAmount,
      })
    }
  }, [currencyA, currencyB, feeAmount, poolState, tickSpacing, pool?.tickCurrent])

  // it is also possible to grab all tick data but it is extremely slow
  // bitmapIndex(nearestUsableTick(TickMath.MIN_TICK, tickSpacing), tickSpacing)
  const minIndex = useMemo(
    () =>
      tickSpacing && activeTick ? bitmapIndex(activeTick - numSurroundingTicks * tickSpacing, tickSpacing) : undefined,
    [tickSpacing, activeTick, numSurroundingTicks]
  )

  const maxIndex = useMemo(
    () =>
      tickSpacing && activeTick ? bitmapIndex(activeTick + numSurroundingTicks * tickSpacing, tickSpacing) : undefined,
    [tickSpacing, activeTick, numSurroundingTicks]
  )

  const tickLensArgs: [string, number][] = useMemo(
    () =>
      maxIndex && minIndex && poolAddress && poolAddress !== ZERO_ADDRESS
        ? new Array(maxIndex - minIndex + 1)
            .fill(0)
            .map((_, i) => i + minIndex)
            .map((wordIndex) => [poolAddress, wordIndex])
        : [],
    [minIndex, maxIndex, poolAddress]
  )

  const tickLens = useTickLens()
  const callStates = useSingleContractMultipleData(
    tickLensArgs.length > 0 ? tickLens : undefined,
    'getPopulatedTicksInWord',
    tickLensArgs,
    REFRESH_FREQUENCY
  )

  const isError = useMemo(() => callStates.some(({ error }) => error), [callStates])
  const isLoading = useMemo(() => callStates.some(({ loading }) => loading), [callStates])
  const IsSyncing = useMemo(() => callStates.some(({ syncing }) => syncing), [callStates])
  const isValid = useMemo(() => callStates.some(({ valid }) => valid), [callStates])

  const tickData: TickData[] = useMemo(
    () =>
      callStates
        .map(({ result }) => result?.populatedTicks)
        .reduce(
          (accumulator, current) => [
            ...accumulator,
            ...(current?.map((tickData: TickData) => {
              return {
                tick: tickData.tick,
                liquidityNet: JSBI.BigInt(tickData.liquidityNet),
                liquidityGross: JSBI.BigInt(tickData.liquidityGross),
              }
            }) ?? []),
          ],
          []
        ),
    [callStates]
  )

  // reset on input change
  useEffect(() => {
    setTickDataLatestSynced([])
  }, [currencyA, currencyB, feeAmount])

  // return the latest synced tickData even if we are still loading the newest data
  useEffect(() => {
    if (!IsSyncing && !isLoading && !isError && isValid) {
      setTickDataLatestSynced(tickData.sort((a, b) => a.tick - b.tick))
    }
  }, [isError, isLoading, IsSyncing, tickData, isValid])

  return useMemo(
    () => ({ isLoading, IsSyncing, isError, isValid, tickData: tickDataLatestSynced }),
    [isLoading, IsSyncing, isError, isValid, tickDataLatestSynced]
  )
}

function useTicksFromSubgraph(
  currencyA: Currency | undefined,
  currencyB: Currency | undefined,
  feeAmount: FeeAmountEnum | undefined
) {
  const { data: poolAddress, execute: getPoolAddress } = usePolywrapInvoke<string | undefined>({
    uri: wrapperUri,
    method: 'getPoolAddress',
  })

  useEffect(() => {
    if (currencyA && currencyB && feeAmount !== undefined) {
      void getPoolAddress({
        tokenA: mapToken(currencyA.wrapped),
        tokenB: mapToken(currencyB.wrapped),
        fee: feeAmount,
      })
    }
  }, [currencyA, currencyB, feeAmount])

  return useAllV3TicksQuery(poolAddress ? { poolAddress: poolAddress?.toLowerCase(), skip: 0 } : skipToken, {
    pollingInterval: ms`30s`,
  })
}

// Fetches all ticks for a given pool
function useAllV3Ticks(
  currencyA: Currency | undefined,
  currencyB: Currency | undefined,
  feeAmount: FeeAmountEnum | undefined
): {
  isLoading: boolean
  isUninitialized: boolean
  isError: boolean
  error: unknown
  ticks: TickData[] | undefined
} {
  const useSubgraph = currencyA ? !CHAIN_IDS_MISSING_SUBGRAPH_DATA.includes(currencyA.chainId) : true
  const feeAmountNumber = feeAmount ? reverseMapFeeAmount(feeAmount) : undefined
  const tickLensTickData = useTicksFromTickLens(!useSubgraph ? currencyA : undefined, currencyB, feeAmountNumber)
  const subgraphTickData = useTicksFromSubgraph(useSubgraph ? currencyA : undefined, currencyB, feeAmountNumber)

  return {
    isLoading: useSubgraph ? subgraphTickData.isLoading : tickLensTickData.isLoading,
    isUninitialized: useSubgraph ? subgraphTickData.isUninitialized : false,
    isError: useSubgraph ? subgraphTickData.isError : tickLensTickData.isError,
    error: useSubgraph ? subgraphTickData.error : tickLensTickData.isError,
    ticks: useSubgraph ? subgraphTickData.data?.ticks : tickLensTickData.tickData,
  }
}

export function usePoolActiveLiquidity(
  currencyA: Currency | undefined,
  currencyB: Currency | undefined,
  feeAmount: FeeAmountEnum | undefined
): {
  isLoading: boolean
  isUninitialized: boolean
  isError: boolean
  error: any
  activeTick: number | undefined
  data: TickProcessed[] | undefined
} {
  const client: PolywrapClient = usePolywrapClient()
  const pool = usePool(currencyA, currencyB, feeAmount)

  // Find nearest valid tick for pool in case tick is not initialized.
  const activeTick = useMemo(() => getActiveTick(pool[1]?.tickCurrent, feeAmount), [pool, feeAmount])
  // const activeTick = getActiveTick(pool[1]?.tickCurrent, feeAmount)
  const { isLoading, isUninitialized, isError, error, ticks } = useAllV3Ticks(currencyA, currencyB, feeAmount)

  const [result, setResult] = useState<{
    isLoading: boolean
    isUninitialized: boolean
    isError: boolean
    error: any
    activeTick: number | undefined
    data: TickProcessed[] | undefined
  }>({
    isLoading,
    isUninitialized,
    isError,
    error,
    activeTick,
    data: undefined,
  })
  const cancelable = useRef<
    CancelablePromise<
      | {
          isLoading: boolean
          isUninitialized: boolean
          isError: boolean
          error: any
          activeTick: number | undefined
          data: TickProcessed[] | undefined
        }
      | undefined
    >
  >()

  useEffect(() => {
    cancelable.current?.cancel()
    const liquidityPromise = loadPoolLiquidity(
      client,
      currencyA,
      currencyB,
      activeTick,
      pool,
      ticks,
      isLoading,
      isUninitialized,
      isError,
      error
    )
    cancelable.current = makeCancelable(liquidityPromise)
    cancelable.current?.promise.then((res) => {
      if (!res) return
      setResult(res)
    })
    return () => cancelable.current?.cancel()
  }, [currencyA, currencyB, activeTick, pool, ticks, isLoading, isUninitialized, isError, error, client])

  return result
}

async function loadPoolLiquidity(
  client: PolywrapClient,
  currencyA: Currency | undefined,
  currencyB: Currency | undefined,
  activeTick: number | undefined,
  pool: [PoolState, Uni_Pool | null],
  ticks: TickData[] | undefined,
  isLoading: boolean,
  isUninitialized: any,
  isError: boolean,
  error: any
): Promise<{
  isLoading: boolean
  isUninitialized: boolean
  isError: boolean
  error: any
  activeTick: number | undefined
  data: TickProcessed[] | undefined
}> {
  if (
    !currencyA ||
    !currencyB ||
    activeTick === undefined ||
    pool[0] !== PoolState.EXISTS ||
    !ticks ||
    ticks.length === 0 ||
    isLoading ||
    isUninitialized
  ) {
    return {
      isLoading: isLoading || pool[0] === PoolState.LOADING,
      isUninitialized,
      isError,
      error,
      activeTick,
      data: undefined,
    }
  }

  const token0 = currencyA?.wrapped
  const token1 = currencyB?.wrapped

  // find where the active tick would be to partition the array
  // if the active tick is initialized, the pivot will be an element
  // if not, take the previous tick as pivot
  const pivot = ticks.findIndex(({ tick }) => tick > activeTick) - 1

  if (pivot < 0) {
    // consider setting a local error
    console.error('TickData pivot not found')
    return {
      isLoading,
      isUninitialized,
      isError,
      error,
      activeTick,
      data: undefined,
    }
  }

  const priceInvoke = await Uni_Module.tickToPrice(
    {
      baseToken: mapToken(token0),
      quoteToken: mapToken(token1),
      tick: activeTick,
    },
    client
  )
  if (priceInvoke.error) {
    console.error(priceInvoke.error)
    return {
      isLoading,
      isUninitialized,
      isError,
      error,
      activeTick,
      data: undefined,
    }
  }
  const { baseToken, quoteToken, numerator, denominator } = priceInvoke.data as Uni_Price

  const activeTickProcessed: TickProcessed = {
    liquidityActive: JSBI.BigInt(pool[1]?.liquidity ?? 0),
    tick: activeTick,
    liquidityNet: Number(ticks[pivot].tick) === activeTick ? JSBI.BigInt(ticks[pivot].liquidityNet) : JSBI.BigInt(0),
    price0: new Price(
      reverseMapToken(baseToken) as Currency,
      reverseMapToken(quoteToken) as Currency,
      denominator,
      numerator
    ).toFixed(PRICE_FIXED_DIGITS),
  }

  const subsequentTicks = await computeSurroundingTicks(client, token0, token1, activeTickProcessed, ticks, pivot, true)

  const previousTicks = await computeSurroundingTicks(client, token0, token1, activeTickProcessed, ticks, pivot, false)

  const ticksProcessed = previousTicks.concat(activeTickProcessed).concat(subsequentTicks)

  return {
    isLoading,
    isUninitialized,
    isError,
    error,
    activeTick,
    data: ticksProcessed,
  }
}
