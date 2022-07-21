import { Trans } from '@lingui/macro'
import { PluginPackage } from '@polywrap/client-js'
import { PluginRegistration } from '@polywrap/core-js'
import { ethereumPlugin, EthereumPluginConfig } from '@polywrap/ethereum-plugin-js'
import { PolywrapProvider } from '@polywrap/react'
import { useWeb3React } from '@web3-react/core'
import { useEffect, useState } from 'react'
import styled from 'styled-components/macro'

import { network } from '../../connectors'
import { INFURA_NETWORK_URLS, SupportedChainId } from '../../constants/chains'
import { NetworkContextName } from '../../constants/misc'
import { useEagerConnect, useInactiveListener } from '../../hooks/web3'
import { mapChainId } from '../../polywrap-utils'
import { Uni_ChainIdEnum } from '../../wrap'

const MessageWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 20rem;
`

const Message = styled.h2`
  color: ${({ theme }) => theme.secondary1};
`

export default function Web3ReactManager({ children }: { children: JSX.Element }) {
  const { active, library, chainId } = useWeb3React()
  const { active: networkActive, error: networkError, activate: activateNetwork } = useWeb3React(NetworkContextName)

  // try to eagerly connect to an injected provider, if it exists and has granted access already
  const triedEager = useEagerConnect()

  // after eagerly trying injected, if the network connect ever isn't active or in an error state, activate itd
  useEffect(() => {
    if (triedEager && !networkActive && !networkError && !active) {
      activateNetwork(network)
    }
  }, [triedEager, networkActive, networkError, activateNetwork, active])

  // when there's no account connected, react to logins (broadly speaking) on the injected provider, if it exists
  useInactiveListener(!triedEager)

  // Polywrap integration.
  const [ethPlugin, setEthPlugin] = useState<PluginPackage<EthereumPluginConfig>>(
    ethereumPlugin({
      networks: {
        mainnet: {
          provider: INFURA_NETWORK_URLS[SupportedChainId.MAINNET],
        },
      },
    })
  )

  const plugins: PluginRegistration[] = [
    {
      uri: 'wrap://ens/ethereum.polywrap.eth',
      plugin: ethPlugin,
    },
  ]

  useEffect(() => {
    if (chainId && library) {
      const currentNetwork = Uni_ChainIdEnum[mapChainId(chainId)]
      const config = {
        [currentNetwork]: {
          provider: library,
          signer: library.getSigner(),
        },
      }
      setEthPlugin(
        ethereumPlugin({
          networks: config,
          defaultNetwork: currentNetwork,
        })
      )
    }
  }, [library, chainId])

  // if the account context isn't active, and there's an error on the network context, it's an irrecoverable error
  if (triedEager && !active && networkError) {
    return (
      <MessageWrapper>
        <Message>
          <Trans>
            Oops! An unknown error occurred. Please refresh the page, or visit from another browser or device.
          </Trans>
        </Message>
      </MessageWrapper>
    )
  }

  return <PolywrapProvider plugins={plugins}>{children}</PolywrapProvider>
}
