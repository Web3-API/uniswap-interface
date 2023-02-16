import { InvokeResult, PolywrapClient } from '@polywrap/client-js'
import { usePolywrapClient } from '@polywrap/react'
import { usePool } from 'hooks/usePools'
import { useEffect, useRef, useState } from 'react'
import { PositionDetails } from 'types/position'

import { CancelablePromise, makeCancelable } from '../polywrap-utils/makeCancelable'
import { Uni_Module, Uni_Pool as Pool, Uni_Position as Position } from '../wrap'
import { useCurrency } from './Tokens'

export function useDerivedPositionInfo(positionDetails: PositionDetails | undefined): {
  position?: Position
  pool?: Pool
} {
  const client: PolywrapClient = usePolywrapClient()

  const currency0 = useCurrency(positionDetails?.token0)
  const currency1 = useCurrency(positionDetails?.token1)

  // construct pool data
  const [, pool] = usePool(currency0 ?? undefined, currency1 ?? undefined, positionDetails?.fee)

  const [position, setPosition] = useState<Position | undefined>(undefined)
  const cancelable = useRef<CancelablePromise<InvokeResult<Position> | undefined>>()

  useEffect(() => {
    cancelable.current?.cancel()
    if (!pool || !positionDetails) {
      setPosition(undefined)
    } else {
      const positionPromise = Uni_Module.createPosition(
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
        if (!res.ok) {
          if (res.error) console.error(res.error)
          setPosition(undefined)
        } else {
          setPosition(res.value)
        }
      })
    }
    return () => cancelable.current?.cancel()
  }, [positionDetails, pool, client])

  return {
    position,
    pool: pool ?? undefined,
  }
}
