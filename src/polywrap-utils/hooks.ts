import { Web3ApiClient } from '@web3api/client-js'
import { useWeb3ApiClient } from '@web3api/react'
import { useMemo } from 'react'

import { PolywrapDapp, PolywrapDappConfig } from '../polywrap'

export function usePolywrapDapp(config?: PolywrapDappConfig): PolywrapDapp {
  const client: Web3ApiClient = useWeb3ApiClient()
  return useMemo(() => {
    return new PolywrapDapp(client, config)
  }, [client, config])
}
