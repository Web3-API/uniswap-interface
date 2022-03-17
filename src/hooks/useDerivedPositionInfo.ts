import { Web3ApiClient } from '@web3api/client-js'
import { useWeb3ApiClient } from '@web3api/react'
import { usePool } from 'hooks/usePools'
import { useMemo } from 'react'
import { PositionDetails } from 'types/position'

import { Uni_Pool as Pool, Uni_Position as Position, Uni_Query } from '../polywrap'
import { useAsync } from '../polywrap-utils'
import { useCurrency } from './Tokens'

export function useDerivedPositionInfo(positionDetails: PositionDetails | undefined): {
  position?: Position
  pool?: Pool
} {
  const client: Web3ApiClient = useWeb3ApiClient()

  const currency0 = useCurrency(positionDetails?.token0)
  const currency1 = useCurrency(positionDetails?.token1)

  // construct pool data
  const [, pool] = usePool(currency0 ?? undefined, currency1 ?? undefined, positionDetails?.fee)

  return (
    useAsync<{
      position?: Position
      pool?: Pool
    }>(
      useMemo(
        () => async () => {
          let position = undefined
          if (pool && positionDetails) {
            const invoke = await Uni_Query.createPosition(
              {
                pool,
                liquidity: positionDetails.liquidity.toString(),
                tickLower: positionDetails.tickLower,
                tickUpper: positionDetails.tickUpper,
              },
              client
            )
            if (invoke.error) throw invoke.error
            position = invoke.data
          }
          return {
            position,
            pool: pool ?? undefined,
          }
        },
        [positionDetails, pool, client]
      )
    ) ?? {}
  )
}
