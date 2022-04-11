import { Trans } from '@lingui/macro'
import { useWeb3React } from '@web3-react/core'
import { PluginRegistration } from '@web3api/core-js'
import { ethereumPlugin } from '@web3api/ethereum-plugin-js'
import { Web3ApiProvider } from '@web3api/react'
import { useEffect, useState } from 'react'
import styled from 'styled-components/macro'

import { network } from '../../connectors'
import { NetworkContextName } from '../../constants/misc'
import { useEagerConnect, useInactiveListener } from '../../hooks/web3'
import { Uni_ChainIdEnum } from '../../polywrap'
import { ethereumPluginUri, mapChainId } from '../../polywrap-utils'

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

  // Web3API integration.
  const [ethPlugin, setEthPlugin] = useState<any>(
    ethereumPlugin({
      networks: {
        mainnet: {
          provider: 'https://mainnet.infura.io/v3/b00b2c2cc09c487685e9fb061256d6a6',
        },
      },
    })
  )

  const plugins: PluginRegistration[] = [
    {
      uri: ethereumPluginUri,
      plugin: ethPlugin,
    },
  ]

  // try to eagerly connect to an injected provider, if it exists and has granted access already
  const triedEager = useEagerConnect()

  // after eagerly trying injected, if the network connect ever isn't active or in an error state, activate itd
  useEffect(() => {
    if (triedEager && !networkActive && !networkError && !active) {
      activateNetwork(network)
    }
  }, [triedEager, networkActive, networkError, activateNetwork, active])

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

  // when there's no account connected, react to logins (broadly speaking) on the injected provider, if it exists
  useInactiveListener(!triedEager)

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

  return <Web3ApiProvider plugins={plugins}>{children}</Web3ApiProvider>
}
