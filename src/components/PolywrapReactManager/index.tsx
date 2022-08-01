import { PluginPackage } from '@polywrap/client-js'
import { PluginRegistration } from '@polywrap/core-js'
import { ethereumPlugin, EthereumPluginConfig } from '@polywrap/ethereum-plugin-js'
import { PolywrapProvider } from '@polywrap/react'
import { useWeb3React } from '@web3-react/core'
import { ReactNode, useEffect, useState } from 'react'

import { DEFAULT_ETHEREUM_PROVIDERS, mapChainId } from '../../polywrap-utils'
import { Uni_ChainIdEnum } from '../../wrap'

export default function PolywrapReactManager({ children }: { children: ReactNode }) {
  const { provider, chainId } = useWeb3React()

  const [ethPlugin, setEthPlugin] = useState<PluginPackage<EthereumPluginConfig>>(
    ethereumPlugin({
      networks: DEFAULT_ETHEREUM_PROVIDERS,
    })
  )

  const plugins: PluginRegistration[] = [
    {
      uri: 'wrap://ens/ethereum.polywrap.eth',
      plugin: ethPlugin,
    },
  ]

  useEffect(() => {
    if (chainId && provider) {
      const currentNetwork = Uni_ChainIdEnum[mapChainId(chainId)]
      const config = {
        ...DEFAULT_ETHEREUM_PROVIDERS,
        [currentNetwork]: { provider },
      }
      setEthPlugin(
        ethereumPlugin({
          networks: config,
          defaultNetwork: currentNetwork,
        })
      )
    }
  }, [provider, chainId])

  return <PolywrapProvider plugins={plugins}>{children}</PolywrapProvider>
}
