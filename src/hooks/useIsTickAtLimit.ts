import { Web3ApiClient } from '@web3api/client-js'
import { useWeb3ApiClient } from '@web3api/react'
import { useEffect, useState } from 'react'
import { Bound } from 'state/mint/v3/actions'

import { Uni_FeeAmountEnum as FeeAmountEnum, Uni_Query } from '../polywrap'

export default function useIsTickAtLimit(
  feeAmount: FeeAmountEnum | undefined,
  tickLower: number | undefined,
  tickUpper: number | undefined
) {
  const client: Web3ApiClient = useWeb3ApiClient()

  const [isTickAtLimit, setIsTickAtLimit] = useState<{ LOWER: boolean | undefined; UPPER: boolean | undefined }>({
    [Bound.LOWER]: undefined,
    [Bound.UPPER]: undefined,
  })

  useEffect(() => {
    console.log('useIsTickAtLimit - src/hooks/useIsTickAtLimit')
    if (feeAmount === undefined) {
      setIsTickAtLimit({ [Bound.LOWER]: undefined, [Bound.UPPER]: undefined })
    } else {
      void loadIsTickAtLimits(feeAmount, tickLower, tickUpper, client).then((res) => setIsTickAtLimit(res))
    }
  }, [feeAmount, tickLower, tickUpper, client])

  return isTickAtLimit
}

const loadIsTickAtLimits = async (
  feeAmount: FeeAmountEnum,
  tickLower: number | undefined,
  tickUpper: number | undefined,
  client: Web3ApiClient
) => {
  let tickSpacing: number | undefined = undefined
  if (tickLower !== undefined || tickUpper !== undefined) {
    const tickSpacingInvoke = await Uni_Query.feeAmountToTickSpacing({ feeAmount }, client)
    if (tickSpacingInvoke.error) console.error(tickSpacingInvoke.error)
    tickSpacing = tickSpacingInvoke.data
  }

  let lower: boolean | undefined = undefined
  if (tickLower !== undefined && tickSpacing !== undefined) {
    const tickInvoke = await Uni_Query.MIN_TICK({}, client)
    if (tickInvoke.error) console.error(tickInvoke.error)
    const tick = tickInvoke.data

    if (tick !== undefined) {
      const nearestTickInvoke = await Uni_Query.nearestUsableTick({ tick, tickSpacing }, client)
      if (nearestTickInvoke.error) console.error(nearestTickInvoke.error)
      lower = tickLower === nearestTickInvoke.data
    }
  }

  let upper: boolean | undefined = undefined
  if (tickUpper !== undefined && tickSpacing !== undefined) {
    const tickInvoke = await Uni_Query.MAX_TICK({}, client)
    if (tickInvoke.error) console.error(tickInvoke.error)
    const tick = tickInvoke.data

    if (tick !== undefined) {
      const nearestTickInvoke = await Uni_Query.nearestUsableTick({ tick, tickSpacing }, client)
      if (nearestTickInvoke.error) console.error(nearestTickInvoke.error)
      upper = tickUpper === nearestTickInvoke.data
    }
  }

  return {
    [Bound.LOWER]: lower,
    [Bound.UPPER]: upper,
  }
}
