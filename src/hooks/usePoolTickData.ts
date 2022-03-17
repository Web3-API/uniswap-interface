import { skipToken } from '@reduxjs/toolkit/query/react'
import { Currency, Price } from '@uniswap/sdk-core'
import { Web3ApiClient } from '@web3api/client-js'
import { useWeb3ApiClient } from '@web3api/react'
import JSBI from 'jsbi'
import ms from 'ms.macro'
import { useCallback, useMemo } from 'react'
import { useAllV3TicksQuery } from 'state/data/enhanced'
import { AllV3TicksQuery } from 'state/data/generated'
import computeSurroundingTicks from 'utils/computeSurroundingTicks'

import { Uni_FeeAmountEnum as FeeAmountEnum, Uni_Price, Uni_Query } from '../polywrap'
import { mapToken, reverseMapToken, useAsync } from '../polywrap-utils'
import { PoolState, usePool } from './usePools'

const PRICE_FIXED_DIGITS = 8

// Tick with fields parsed to JSBIs, and active liquidity computed.
export interface TickProcessed {
  tickIdx: number
  liquidityActive: JSBI
  liquidityNet: JSBI
  price0: string
}

const getActiveTick = async (
  client: Web3ApiClient,
  tickCurrent: number | undefined,
  feeAmount: FeeAmountEnum | undefined
) => {
  if (tickCurrent && feeAmount !== undefined) {
    const invoke = await Uni_Query.feeAmountToTickSpacing({ feeAmount }, client)
    if (invoke.error) throw invoke.error
    const tickSpacing = invoke.data as number
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

  const poolAddress = useAsync(
    useMemo(
      () => async () => {
        if (currencyA && currencyB && feeAmount !== undefined) {
          const invoke = await Uni_Query.getPoolAddress(
            {
              tokenA: mapToken(currencyA),
              tokenB: mapToken(currencyB),
              fee: feeAmount,
            },
            client
          )
          if (invoke.error) throw invoke.error
          return invoke.data
        }
        return undefined
      },
      [currencyA, currencyB, feeAmount, client]
    )
  )

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
  const activeTick = useAsync(
    useMemo(() => async () => getActiveTick(client, pool[1]?.tickCurrent, feeAmount), [pool, feeAmount, client])
  )

  const { isLoading, isUninitialized, isError, error, ticks } = useAllV3Ticks(currencyA, currencyB, feeAmount)

  return (
    useAsync(
      useCallback(async () => {
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
          liquidityNet:
            Number(ticks[pivot].tickIdx) === activeTick ? JSBI.BigInt(ticks[pivot].liquidityNet) : JSBI.BigInt(0),
          price0: new Price(
            reverseMapToken(baseToken) as Currency,
            reverseMapToken(quoteToken) as Currency,
            denominator,
            numerator
          ).toFixed(PRICE_FIXED_DIGITS),
        }

        const subsequentTicks = computeSurroundingTicks(token0, token1, activeTickProcessed, ticks, pivot, true)

        const previousTicks = computeSurroundingTicks(token0, token1, activeTickProcessed, ticks, pivot, false)

        const ticksProcessed = previousTicks.concat(activeTickProcessed).concat(subsequentTicks)

        return {
          isLoading,
          isUninitialized,
          isError,
          error,
          activeTick,
          data: ticksProcessed,
        }
      }, [currencyA, currencyB, activeTick, pool, ticks, isLoading, isUninitialized, isError, error, client])
    ) ?? {
      isLoading,
      isUninitialized,
      isError,
      error,
      activeTick,
      data: undefined,
    }
  )
}
