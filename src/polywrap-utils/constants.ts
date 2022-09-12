import { Connection } from '@polywrap/ethereum-plugin-js'

import { INFURA_NETWORK_URLS, SupportedChainId } from '../constants/chains'
import { Uni_ChainIdEnum, Uni_Currency } from '../wrap'
import { reverseMapChainId } from './reverseMapping'

export const ETHER: Uni_Currency = {
  decimals: 18,
  name: 'Ether',
  symbol: 'ETH',
}
export const MATIC: Uni_Currency = {
  decimals: 18,
  name: 'Polygon Matic',
  symbol: 'MATIC',
}

// export const wrapperUri = 'wrap://ipfs/QmRW4jyQREgP1xSM3dbPfYoaEjekACTqhjLeaexc9qWZbp'
export const wrapperUri = 'wrap://ens/goerli/v3.uniswap.wrappers.eth'

// infura keys
// b00b2c2cc09c487685e9fb061256d6a6
// b76cba91dc954ceebff27244923224b1

export const DEFAULT_ETHEREUM_PROVIDERS = getDefaultProviders()

function getDefaultProviders(): Record<string, Connection> {
  const result: Record<string, Connection> = {}
  for (let i = 0; i < 5; i++) {
    result[Uni_ChainIdEnum[i]] = new Connection({
      provider: INFURA_NETWORK_URLS[reverseMapChainId(i) as SupportedChainId],
    })
  }
  return result
}
