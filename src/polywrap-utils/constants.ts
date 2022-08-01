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
  name: 'Matic',
  symbol: 'MATIC',
}
export const mMATIC: Uni_Currency = {
  name: 'Polygon Mumbai Matic',
  symbol: 'mMATIC',
  decimals: 18,
}

export const wrapperUri = 'wrap://ens/goerli/v3.uniswap.wrappers.eth'

// infura keys
// b00b2c2cc09c487685e9fb061256d6a6
// b76cba91dc954ceebff27244923224b1

export const DEFAULT_ETHEREUM_PROVIDERS = getDefaultProviders()

function getDefaultProviders(): Record<string, any> {
  const result: Record<string, any> = {}
  for (let i = 0; i < Object.keys(Uni_ChainIdEnum).length / 2; i++) {
    result[Uni_ChainIdEnum[i]] = {
      provider: INFURA_NETWORK_URLS[reverseMapChainId(i) as SupportedChainId],
    }
  }
  return result
}
