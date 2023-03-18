import { Uri } from '@polywrap/core-js'
import { Connection } from '@polywrap/ethereum-provider-js'

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

export const wrapperUri = Uri.from('wrap://ens/uniswap.wraps.eth:v3@1.0.0')

export const DEFAULT_ETHEREUM_PROVIDERS = getDefaultProviders()

export function getDefaultProviders(): Record<string, Connection> {
  const result: Record<string, Connection> = {}
  for (let i = 0; i < 5; i++) {
    result[Uni_ChainIdEnum[i]] = new Connection({
      provider: INFURA_NETWORK_URLS[reverseMapChainId(i) as SupportedChainId],
    })
  }
  return result
}
