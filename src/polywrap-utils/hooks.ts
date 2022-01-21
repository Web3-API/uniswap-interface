import { Position as UniPosition } from '@uniswap/v3-sdk'
import { Web3ApiClient } from '@web3api/client-js'
import { useWeb3ApiClient } from '@web3api/react'
import { DependencyList, useEffect, useMemo, useState } from 'react'

import { PolywrapDapp, PolywrapDappConfig, Position } from '../polywrap'
import { mapPosition } from './mapping'

export function usePolywrapDapp(config?: PolywrapDappConfig): PolywrapDapp {
  const client: Web3ApiClient = useWeb3ApiClient()
  return useMemo(() => {
    return new PolywrapDapp(client, config)
  }, [client, config])
}

export function useAsync<T>(callback: () => Promise<T>, deps: DependencyList, initialValue: T): T {
  const [val, setVal] = useState<T>(initialValue)

  useEffect(() => {
    const updateAsync = async () => {
      setVal(await callback())
    }
    void updateAsync()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [...deps, callback])

  return val
}

export function useMapPosition(position?: UniPosition): Position | undefined {
  return useAsync<Position | undefined>(
    () => {
      if (!position) {
        return Promise.resolve(undefined)
      }
      return mapPosition(position)
    },
    [position],
    undefined
  )
}
