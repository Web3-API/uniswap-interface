import { PolywrapClient } from '@polywrap/client-js'
import { usePolywrapClient } from '@polywrap/react'
import { useEffect, useRef, useState } from 'react'
import { Bound } from 'state/mint/v3/actions'

import { CancelablePromise, makeCancelable } from '../polywrap-utils/makeCancelable'
import { Uni_FeeAmountEnum as FeeAmountEnum, Uni_Module } from '../wrap'

export default function useIsTickAtLimit(
  feeAmount: FeeAmountEnum | undefined,
  tickLower: number | undefined,
  tickUpper: number | undefined
) {
  const client: PolywrapClient = usePolywrapClient()

  const [isTickAtLimit, setIsTickAtLimit] = useState<{ LOWER: boolean | undefined; UPPER: boolean | undefined }>({
    [Bound.LOWER]: undefined,
    [Bound.UPPER]: undefined,
  })
  const cancelable = useRef<CancelablePromise<{ LOWER: boolean | undefined; UPPER: boolean | undefined } | undefined>>()

  useEffect(() => {
    cancelable.current?.cancel()
    if (feeAmount === undefined) {
      setIsTickAtLimit({ [Bound.LOWER]: undefined, [Bound.UPPER]: undefined })
    } else {
      const tickLimitsPromise = loadIsTickAtLimits(feeAmount, tickLower, tickUpper, client)
      cancelable.current = makeCancelable(tickLimitsPromise)
      cancelable.current?.promise.then((res) => {
        if (res === undefined) return
        setIsTickAtLimit(res)
      })
    }
    return () => cancelable.current?.cancel()
  }, [feeAmount, tickLower, tickUpper, client])

  return isTickAtLimit
}

const loadIsTickAtLimits = async (
  feeAmount: FeeAmountEnum,
  tickLower: number | undefined,
  tickUpper: number | undefined,
  client: PolywrapClient
): Promise<{ LOWER: boolean | undefined; UPPER: boolean | undefined }> => {
  let tickSpacing: number | undefined = undefined
  if (tickLower !== undefined || tickUpper !== undefined) {
    const tickSpacingInvoke = await Uni_Module.feeAmountToTickSpacing({ feeAmount }, client)
    if (!tickSpacingInvoke.ok) {
      console.error(tickSpacingInvoke.error)
    } else {
      tickSpacing = tickSpacingInvoke.value
    }
  }

  let lower: boolean | undefined = undefined
  if (tickLower !== undefined && tickSpacing !== undefined) {
    const tickInvoke = await Uni_Module.MIN_TICK({}, client)

    let tick = undefined
    if (!tickInvoke.ok) {
      console.error(tickInvoke.error)
    } else {
      tick = tickInvoke.value
    }

    if (tick !== undefined) {
      const nearestTickInvoke = await Uni_Module.nearestUsableTick({ tick, tickSpacing }, client)
      if (!nearestTickInvoke.ok) {
        console.error(nearestTickInvoke.error)
      } else {
        lower = tickLower === nearestTickInvoke.value
      }
    }
  }

  let upper: boolean | undefined = undefined
  if (tickUpper !== undefined && tickSpacing !== undefined) {
    const tickInvoke = await Uni_Module.MAX_TICK({}, client)

    let tick = undefined
    if (!tickInvoke.ok) {
      console.error(tickInvoke.error)
    } else {
      tick = tickInvoke.value
    }

    if (tick !== undefined) {
      const nearestTickInvoke = await Uni_Module.nearestUsableTick({ tick, tickSpacing }, client)
      if (!nearestTickInvoke.ok) {
        console.error(nearestTickInvoke.error)
      } else {
        upper = tickUpper === nearestTickInvoke.value
      }
    }
  }

  return {
    [Bound.LOWER]: lower,
    [Bound.UPPER]: upper,
  }
}
