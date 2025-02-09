import { W3Currency } from './types'
import { Uri } from '@polywrap/client-js'

export const ipfsUri = Uri.from('wrap://ipfs/QmVJj8wZRpviHyANvNX8or2p8dk8ywmEviigGY7LzYBq2f')

export const ETHER: W3Currency = {
  decimals: 18,
  name: 'Ether',
  symbol: 'ETH'
}

export const networks: any = {
  '1': {
    chainId: 1,
    name: 'mainnet',
    node: 'https://mainnet.infura.io/v3/b76cba91dc954ceebff27244923224b1',
    explorer: 'https://etherscan.io'
  },
  '3': {
    chainId: 3,
    name: 'ropsten',
    node: 'https://ropsten.infura.io/v3/b76cba91dc954ceebff27244923224b1',
    explorer: 'https://ropsten.etherscan.io'
  },
  '4': {
    chainId: 4,
    name: 'rinkeby',
    node: 'https://rinkeby.infura.io/v3/b76cba91dc954ceebff27244923224b1',
    explorer: 'https://rinkeby.etherscan.io'
  },
  '5': {
    chainId: 5,
    name: 'goerli',
    node: 'https://goerli.infura.io/v3/b76cba91dc954ceebff27244923224b1',
    explorer: 'https://goerli.etherscan.io'
  }
}
