import { Web3ApiClient } from '@web3api/client-js'
import { useWeb3ApiClient } from '@web3api/react'
import { usePool } from 'hooks/usePools'
import { useEffect, useState } from 'react'
import { PositionDetails } from 'types/position'

import { Uni_Pool as Pool, Uni_Position as Position, Uni_Query } from '../polywrap'
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

  const [position, setPosition] = useState<Position | undefined>(undefined)

  useEffect(() => {
    console.log('useDerivedPositionInfo - src/hooks/useDerivedPositionInfo')
    if (!pool || !positionDetails) {
      setPosition(undefined)
    } else {
      Uni_Query.createPosition(
        {
          pool,
          liquidity: positionDetails.liquidity.toString(),
          tickLower: positionDetails.tickLower,
          tickUpper: positionDetails.tickUpper,
        },
        client
      ).then((res) => {
        if (res.error) throw res.error
        setPosition(res.data)
      })
    }
  }, [positionDetails, pool, client])
  // todo: replace deps fun?
  return {
    position,
    pool: pool ?? undefined,
  }
}
