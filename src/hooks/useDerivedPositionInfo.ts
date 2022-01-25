import { usePool } from 'hooks/usePools'
import { PositionDetails } from 'types/position'

import { PolywrapDapp, Pool, Position } from '../polywrap'
import { mapPool, useAsync, usePolywrapDapp } from '../polywrap-utils'
import { useCurrency } from './Tokens'

export function useDerivedPositionInfo(positionDetails: PositionDetails | undefined): {
  position: Position | undefined
  pool: Pool | undefined
} {
  const dapp: PolywrapDapp = usePolywrapDapp()

  const currency0 = useCurrency(positionDetails?.token0)
  const currency1 = useCurrency(positionDetails?.token1)

  // construct pool data
  const [, uniPool] = usePool(currency0 ?? undefined, currency1 ?? undefined, positionDetails?.fee)

  return useAsync<{
    position: Position | undefined
    pool: Pool | undefined
  }>(
    async () => {
      const pool: Pool | undefined = uniPool ? await mapPool(uniPool) : undefined
      let position = undefined
      if (pool && positionDetails) {
        position = await dapp.uniswap.query.createPosition({
          pool,
          liquidity: positionDetails.liquidity.toString(),
          tickLower: positionDetails.tickLower,
          tickUpper: positionDetails.tickUpper,
        })
      }
      return {
        position,
        pool: pool ?? undefined,
      }
    },
    [positionDetails, uniPool, dapp],
    { position: undefined, pool: undefined }
  )
}
