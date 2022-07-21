import { ensResolverPlugin } from '@polywrap/ens-resolver-plugin-js'
import { ethereumPlugin } from '@polywrap/ethereum-plugin-js'
import { ipfsPlugin } from '@polywrap/ipfs-plugin-js'

export function getPlugins(ethereum: string, ipfs: string, ensAddress: string) {
  return {
    plugins: [
      {
        uri: 'w3://ens/ipfs.polywrap.eth',
        plugin: ipfsPlugin({ provider: ipfs }),
      },
      {
        uri: 'w3://ens/ens-resolver.polywrap.eth',
        plugin: ensResolverPlugin({ addresses: { testnet: ensAddress } }),
      },
      {
        uri: 'w3://ens/ethereum.polywrap.eth',
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
