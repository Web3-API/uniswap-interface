import { InvokeApiResult, Web3ApiClient } from '@web3api/client-js'
import { useWeb3ApiClient } from '@web3api/react'
import { usePool } from 'hooks/usePools'
import { useEffect, useRef, useState } from 'react'
import { PositionDetails } from 'types/position'

import { Uni_Pool as Pool, Uni_Position as Position, Uni_Query } from '../polywrap'
import { CancelablePromise, makeCancelable } from '../polywrap-utils/makeCancelable'
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
  const cancelable = useRef<CancelablePromise<InvokeApiResult<Position> | undefined>>()

  useEffect(() => {
    cancelable.current?.cancel()
    if (!pool || !positionDetails) {
      setPosition(undefined)
    } else {
      const positionPromise = Uni_Query.createPosition(
        {
          pool,
          liquidity: positionDetails.liquidity.toString(),
          tickLower: positionDetails.tickLower,
          tickUpper: positionDetails.tickUpper,
        },
        client
      )
      cancelable.current = makeCancelable(positionPromise)
      cancelable.current?.promise.then((res) => {
        if (!res) return
        if (res.error) console.error(res.error)
        setPosition(res.data)
      })
    }
    return () => cancelable.current?.cancel()
  }, [positionDetails, pool, client])

  return {
    position,
    pool: pool ?? undefined,
  }
}
