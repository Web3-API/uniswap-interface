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
    if (tickSpacingInvoke.error) throw tickSpacingInvoke.error
    tickSpacing = tickSpacingInvoke.data as number
  }

  let lower: boolean | undefined = undefined
  if (tickLower !== undefined) {
    const tickInvoke = await Uni_Query.MIN_TICK({}, client)
    if (tickInvoke.error) throw tickInvoke.error
    const tick = tickInvoke.data as number

    const nearestTickInvoke = await Uni_Query.nearestUsableTick({ tick, tickSpacing: tickSpacing as number }, client)
    if (nearestTickInvoke.error) throw nearestTickInvoke.error
    lower = tickLower === nearestTickInvoke.data
  }

  let upper: boolean | undefined = undefined
  if (tickUpper !== undefined) {
    const tickInvoke = await Uni_Query.MAX_TICK({}, client)
    if (tickInvoke.error) throw tickInvoke.error
    const tick = tickInvoke.data as number

    const nearestTickInvoke = await Uni_Query.nearestUsableTick({ tick, tickSpacing: tickSpacing as number }, client)
    if (nearestTickInvoke.error) throw nearestTickInvoke.error
    upper = tickUpper === nearestTickInvoke.data
  }

  return {
    [Bound.LOWER]: lower,
    [Bound.UPPER]: upper,
  }
}
