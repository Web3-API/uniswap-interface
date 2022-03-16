import { ensPlugin } from '@web3api/ens-plugin-js'
import { ethereumPlugin } from '@web3api/ethereum-plugin-js'
import { ipfsPlugin } from '@web3api/ipfs-plugin-js'

// "@web3api/ethereum-plugin-js": "0.0.1-prealpha.68",
//   "@web3api/ipfs-plugin-js": "0.0.1-prealpha.68",
//   "@web3api/ens-plugin-js": "0.0.1-prealpha.68",

export function getPlugins(ethereum: string, ipfs: string, ensAddress: string) {
  return {
    redirects: [],
    plugins: [
      {
        uri: 'w3://ens/ipfs.web3api.eth',
        plugin: ipfsPlugin({ provider: ipfs }),
      },
      {
        uri: 'w3://ens/ens.web3api.eth',
        plugin: ensPlugin({ addresses: { testnet: ensAddress } }),
      },
      {
        uri: 'w3://ens/ethereum.web3api.eth',
        plugin: ethereumPlugin({
          networks: {
            testnet: {
              provider: ethereum,
            },
            MAINNET: {
              provider: 'http://localhost:8546',
            },
          },
          defaultNetwork: 'testnet',
        }),
      },
    ],
  }
}
