import { Web3ApiClient } from '@web3api/client-js'
import { useWeb3ApiClient } from '@web3api/react'
import { useMemo } from 'react'
import { Bound } from 'state/mint/v3/actions'

import { Uni_FeeAmountEnum as FeeAmountEnum, Uni_Query } from '../polywrap'
import { useAsync } from '../polywrap-utils'

export default function useIsTickAtLimit(
  feeAmount: FeeAmountEnum | undefined,
  tickLower: number | undefined,
  tickUpper: number | undefined
) {
  const client: Web3ApiClient = useWeb3ApiClient()
  return (
    useAsync(
      useMemo(
        () => async () => {
          if (feeAmount === undefined) {
            return { [Bound.LOWER]: undefined, [Bound.UPPER]: undefined }
          }

          let lower: boolean | undefined = undefined
          if (tickLower !== undefined) {
            const tickInvoke = await Uni_Query.MIN_TICK({}, client)
            if (tickInvoke.error) throw tickInvoke.error
            const tick = tickInvoke.data as number

            const tickSpacingInvoke = await Uni_Query.feeAmountToTickSpacing({ feeAmount }, client)
            if (tickSpacingInvoke.error) throw tickSpacingInvoke.error
            const tickSpacing = tickSpacingInvoke.data as number

            const nearestTickInvoke = await Uni_Query.nearestUsableTick({ tick, tickSpacing }, client)
            if (nearestTickInvoke.error) throw nearestTickInvoke.error
            lower = tickLower === nearestTickInvoke.data
          }

          let upper: boolean | undefined = undefined
          if (tickUpper !== undefined) {
            const tickInvoke = await Uni_Query.MAX_TICK({}, client)
            if (tickInvoke.error) throw tickInvoke.error
            const tick = tickInvoke.data as number

            const tickSpacingInvoke = await Uni_Query.feeAmountToTickSpacing({ feeAmount }, client)
            if (tickSpacingInvoke.error) throw tickSpacingInvoke.error
            const tickSpacing = tickSpacingInvoke.data as number

            const nearestTickInvoke = await Uni_Query.nearestUsableTick({ tick, tickSpacing }, client)
            if (nearestTickInvoke.error) throw nearestTickInvoke.error
            upper = tickUpper === nearestTickInvoke.data
          }

          return {
            [Bound.LOWER]: lower,
            [Bound.UPPER]: upper,
          }
        },
        [feeAmount, tickLower, tickUpper, client]
      )
    ) ?? { [Bound.LOWER]: undefined, [Bound.UPPER]: undefined }
  )
}
