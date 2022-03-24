import { Uni_Currency } from '../polywrap'

export const ETHER: Uni_Currency = {
  decimals: 18,
  name: 'Ether',
  symbol: 'ETH',
}

export const ensUri = 'ens/rinkeby/univ3.eth'
export const ipfsCid = 'ipfs/QmYnjDEVUu2mdyzuPPA3TBXu4sDFPEcbgaLquJrAdFxx4K'
export const wrapperUri = ipfsCid
export const ethereumPluginUri = 'ens/ethereum.web3api.eth'

export const networks: any = {
  '1': {
    chainId: 1,
    name: 'mainnet',
    node: 'https://mainnet.infura.io/v3/b76cba91dc954ceebff27244923224b1',
    explorer: 'https://etherscan.io',
  },
  '3': {
    chainId: 3,
    name: 'ropsten',
    node: 'https://ropsten.infura.io/v3/b76cba91dc954ceebff27244923224b1',
    explorer: 'https://ropsten.etherscan.io',
  },
  '4': {
    chainId: 4,
    name: 'rinkeby',
    node: 'https://rinkeby.infura.io/v3/b76cba91dc954ceebff27244923224b1',
    explorer: 'https://rinkeby.etherscan.io',
  },
}
