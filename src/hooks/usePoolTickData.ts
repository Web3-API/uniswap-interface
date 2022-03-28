import { skipToken } from '@reduxjs/toolkit/query/react'
import { Currency, Price } from '@uniswap/sdk-core'
import { Web3ApiClient } from '@web3api/client-js'
import { useWeb3ApiClient, useWeb3ApiInvoke } from '@web3api/react'
import JSBI from 'jsbi'
import ms from 'ms.macro'
import { useEffect, useState } from 'react'
import { useAllV3TicksQuery } from 'state/data/enhanced'
import { AllV3TicksQuery } from 'state/data/generated'
import computeSurroundingTicks from 'utils/computeSurroundingTicks'

import {
  Uni_ChainIdEnum,
  Uni_FeeAmountEnum as FeeAmountEnum,
  Uni_Pool,
  Uni_Price,
  Uni_Query,
  Uni_Token,
} from '../polywrap'
import { ensUri, feeAmountToTickSpacing, mapToken, reverseMapToken } from '../polywrap-utils'
import { PoolState, usePool } from './usePools'

const PRICE_FIXED_DIGITS = 8

// Tick with fields parsed to JSBIs, and active liquidity computed.
export interface TickProcessed {
  tickIdx: number
  liquidityActive: JSBI
  liquidityNet: JSBI
  price0: string
}

const getActiveTick = (tickCurrent: number | undefined, feeAmount: FeeAmountEnum | undefined) => {
  if (tickCurrent && feeAmount !== undefined) {
    const tickSpacing = feeAmountToTickSpacing(feeAmount)
    return Math.floor(tickCurrent / tickSpacing) * tickSpacing
  }
  return undefined
}

// Fetches all ticks for a given pool
export function useAllV3Ticks(
  currencyA: Currency | undefined,
  currencyB: Currency | undefined,
  feeAmount: FeeAmountEnum | undefined
) {
  const client: Web3ApiClient = useWeb3ApiClient()

  const nullToken: Uni_Token = { chainId: Uni_ChainIdEnum.MAINNET, address: '', currency: { decimals: 18 } }
  const { data: poolAddress, execute: getPoolAddress } = useWeb3ApiInvoke<string | undefined>({
    uri: ensUri,
    module: 'query',
    method: 'getPoolAddress',
    input: {
      tokenA: currencyA ? mapToken(currencyA) : nullToken,
      tokenB: currencyB ? mapToken(currencyB) : nullToken,
      fee: feeAmount,
    },
  })

  useEffect(() => {
    console.log('useAllV3Ticks - src/hooks/usePoolTickData')
    if (currencyA && currencyB && feeAmount !== undefined) {
      void getPoolAddress()
    }
  }, [currencyA, currencyB, feeAmount, client, getPoolAddress])

  const { isLoading, isError, error, isUninitialized, data } = useAllV3TicksQuery(
    poolAddress ? { poolAddress: poolAddress?.toLowerCase(), skip: 0 } : skipToken,
    {
      pollingInterval: ms`30s`,
    }
  )

  return {
    isLoading,
    isUninitialized,
    isError,
    error,
    ticks: data?.ticks as AllV3TicksQuery['ticks'],
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
  const client: Web3ApiClient = useWeb3ApiClient()
  const pool = usePool(currencyA, currencyB, feeAmount)

  // Find nearest valid tick for pool in case tick is not initialized.
  const activeTick = getActiveTick(pool[1]?.tickCurrent, feeAmount)
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

  useEffect(() => {
    console.log('usePoolActiveLiquidity - src/hooks/usePoolTickData')
    void loadPoolLiquidity(
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
    ).then((res) => setResult(res))
  }, [currencyA, currencyB, activeTick, pool, ticks, isLoading, isUninitialized, isError, error, client])
  // todo: replace deps fun?
  return result
}

async function loadPoolLiquidity(
  client: Web3ApiClient,
  currencyA: Currency | undefined,
  currencyB: Currency | undefined,
  activeTick: number | undefined,
  pool: [PoolState, Uni_Pool | null],
  ticks: any[],
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
  const pivot = ticks.findIndex(({ tickIdx }) => tickIdx > activeTick) - 1

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

  const priceInvoke = await Uni_Query.tickToPrice(
    {
      baseToken: mapToken(token0),
      quoteToken: mapToken(token1),
      tick: activeTick,
    },
    client
  )
  if (priceInvoke.error) throw priceInvoke.error
  const { baseToken, quoteToken, numerator, denominator } = priceInvoke.data as Uni_Price

  const activeTickProcessed: TickProcessed = {
    liquidityActive: JSBI.BigInt(pool[1]?.liquidity ?? 0),
    tickIdx: activeTick,
    liquidityNet: Number(ticks[pivot].tickIdx) === activeTick ? JSBI.BigInt(ticks[pivot].liquidityNet) : JSBI.BigInt(0),
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
