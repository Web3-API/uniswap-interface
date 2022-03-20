import { Token } from '@uniswap/sdk-core'
import { Web3ApiClient } from '@web3api/client-js'
import { TickProcessed } from 'hooks/usePoolTickData'
import JSBI from 'jsbi'
import { AllV3TicksQuery } from 'state/data/generated'

import { Uni_Price, Uni_Query } from '../polywrap'
import { mapToken, reverseMapPrice } from '../polywrap-utils'

const PRICE_FIXED_DIGITS = 8

// Computes the numSurroundingTicks above or below the active tick.
export default async function computeSurroundingTicks(
  client: Web3ApiClient,
  token0: Token,
  token1: Token,
  activeTickProcessed: TickProcessed,
  sortedTickData: AllV3TicksQuery['ticks'],
  pivot: number,
  ascending: boolean
): Promise<TickProcessed[]> {
  let previousTickProcessed: TickProcessed = {
    ...activeTickProcessed,
  }
  // Iterate outwards (either up or down depending on direction) from the active tick,
  // building active liquidity for every tick.
  let processedTicks: TickProcessed[] = []
  for (let i = pivot + (ascending ? 1 : -1); ascending ? i < sortedTickData.length : i >= 0; ascending ? i++ : i--) {
    const tickIdx = Number(sortedTickData[i].tickIdx)

    const price = await Uni_Query.tickToPrice(
      {
        baseToken: mapToken(token0),
        quoteToken: mapToken(token1),
        tick: tickIdx,
      },
      client
    ).then((res) => {
      if (res.error) throw res.error
      return reverseMapPrice(res.data as Uni_Price)
    })

    const currentTickProcessed: TickProcessed = {
      liquidityActive: previousTickProcessed.liquidityActive,
      tickIdx,
      liquidityNet: JSBI.BigInt(sortedTickData[i].liquidityNet),
      price0: price.toFixed(PRICE_FIXED_DIGITS),
    }

    // Update the active liquidity.
    // If we are iterating ascending and we found an initialized tick we immediately apply
    // it to the current processed tick we are building.
    // If we are iterating descending, we don't want to apply the net liquidity until the following tick.
    if (ascending) {
      currentTickProcessed.liquidityActive = JSBI.add(
        previousTickProcessed.liquidityActive,
        JSBI.BigInt(sortedTickData[i].liquidityNet)
      )
    } else if (!ascending && JSBI.notEqual(previousTickProcessed.liquidityNet, JSBI.BigInt(0))) {
      // We are iterating descending, so look at the previous tick and apply any net liquidity.
      currentTickProcessed.liquidityActive = JSBI.subtract(
        previousTickProcessed.liquidityActive,
        previousTickProcessed.liquidityNet
      )
    }

    processedTicks.push(currentTickProcessed)
    previousTickProcessed = currentTickProcessed
  }

  if (!ascending) {
    processedTicks = processedTicks.reverse()
  }

  return processedTicks
}
