import { PolywrapClient } from '@polywrap/client-js'
import { Token } from '@uniswap/sdk-core'
import { TickData } from 'hooks/usePoolTickData'
import JSBI from 'jsbi'

import { Uni_FeeAmountEnum, Uni_Module } from '../wrap'
import computeSurroundingTicks from './computeSurroundingTicks'

const getV3Tick = (tick: number, liquidityNet: number): TickData => ({
  tick,
  liquidityNet: JSBI.BigInt(liquidityNet),
  liquidityGross: JSBI.BigInt(liquidityNet),
})

describe('#computeSurroundingTicks', () => {
  const client: PolywrapClient = new PolywrapClient()

  it('correctly compute active liquidity', async () => {
    const token0 = new Token(1, '0x2170ed0880ac9a755fd29b2688956bd959f933f8', 18)
    const token1 = new Token(1, '0x1f9840a85d5af5bf1d1762f925bdaddc4201f984', 18)
    const feeAmount = Uni_FeeAmountEnum.LOW
    const spacing = await Uni_Module.feeAmountToTickSpacing({ feeAmount }, client).then((res) => {
      if (res.error) throw res.error
      return res.data as number
    })
    const activeTickProcessed = {
      tickIdx: 1000,
      liquidityActive: JSBI.BigInt(300),
      liquidityNet: JSBI.BigInt(100),
      price0: '100',
    }
    const pivot = 3
    const ascending = true
    const sortedTickData: TickData[] = [
      getV3Tick(activeTickProcessed.tick - 4 * spacing, 10),
      getV3Tick(activeTickProcessed.tick - 2 * spacing, 20),
      getV3Tick(activeTickProcessed.tick - 1 * spacing, 30),
      getV3Tick(activeTickProcessed.tick * spacing, 100),
      getV3Tick(activeTickProcessed.tick + 1 * spacing, 40),
      getV3Tick(activeTickProcessed.tick + 2 * spacing, 20),
      getV3Tick(activeTickProcessed.tick + 5 * spacing, 20),
    ]

    const previous = await computeSurroundingTicks(
      client,
      token0,
      token1,
      activeTickProcessed,
      sortedTickData,
      pivot,
      !ascending
    )

    const subsequent = await computeSurroundingTicks(
      client,
      token0,
      token1,
      activeTickProcessed,
      sortedTickData,
      pivot,
      ascending
    )

    expect(previous.length).toEqual(3)
    expect(previous.map((t) => [t.tick, parseFloat(t.liquidityActive.toString())])).toEqual([
      [activeTickProcessed.tick - 4 * spacing, 150],
      [activeTickProcessed.tick - 2 * spacing, 170],
      [activeTickProcessed.tick - 1 * spacing, 200],
    ])

    expect(subsequent.length).toEqual(3)
    expect(subsequent.map((t) => [t.tick, parseFloat(t.liquidityActive.toString())])).toEqual([
      [activeTickProcessed.tick + 1 * spacing, 340],
      [activeTickProcessed.tick + 2 * spacing, 360],
      [activeTickProcessed.tick + 5 * spacing, 380],
    ])
  })
})
