import { Bound } from 'state/mint/v3/actions'

import { FeeAmountEnum, PolywrapDapp } from '../polywrap'
import { useAsync, usePolywrapDapp } from '../polywrap-utils'

export default function useIsTickAtLimit(
  feeAmount: FeeAmountEnum | undefined,
  tickLower: number | undefined,
  tickUpper: number | undefined
) {
  const dapp: PolywrapDapp = usePolywrapDapp()
  return useAsync(
    async () => ({
      [Bound.LOWER]:
        feeAmount !== undefined && tickLower
          ? tickLower ===
            (await dapp.uniswap.query.nearestUsableTick({
              tick: await dapp.uniswap.query.MIN_TICK({}),
              tickSpacing: await dapp.uniswap.query.feeAmountToTickSpacing({ feeAmount }),
            }))
          : undefined,
      [Bound.UPPER]:
        feeAmount !== undefined && tickUpper
          ? tickUpper ===
            (await dapp.uniswap.query.nearestUsableTick({
              tick: await dapp.uniswap.query.MAX_TICK({}),
              tickSpacing: await dapp.uniswap.query.feeAmountToTickSpacing({ feeAmount }),
            }))
          : undefined,
    }),
    [feeAmount, tickLower, tickUpper, dapp],
    { [Bound.LOWER]: undefined, [Bound.UPPER]: undefined }
  )
}
