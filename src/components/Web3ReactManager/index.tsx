import { Trans } from '@lingui/macro'
import { PluginRegistration } from '@polywrap/core-js'
import { Connections, ethereumPlugin, EthereumProvider } from '@polywrap/ethereum-plugin-js'
import { PolywrapProvider } from '@polywrap/react'
import { useWeb3React } from '@web3-react/core'
import { useEffect, useMemo } from 'react'
import styled from 'styled-components/macro'

import { network } from '../../connectors'
import { NetworkContextName } from '../../constants/misc'
import { useEagerConnect, useInactiveListener } from '../../hooks/web3'
import { DEFAULT_ETHEREUM_PROVIDERS, mapChainId } from '../../polywrap-utils'
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

  const connections = useMemo(
    () =>
      new Connections({
        networks: DEFAULT_ETHEREUM_PROVIDERS,
        defaultNetwork: 'MAINNET',
      }),
    []
  )

  const plugins: PluginRegistration[] = [
    {
      uri: 'wrap://ens/ethereum.polywrap.eth',
      plugin: ethereumPlugin({ connections }),
    },
  ]

  useEffect(() => {
    if (chainId && library) {
      const currentNetwork: string = Uni_ChainIdEnum[mapChainId(chainId)]
      const prevNetwork: string = connections.getDefaultNetwork()
      connections.setDefaultNetwork(currentNetwork, library as EthereumProvider)
      // always have goerli and mainnet set for ens resolution
      if (
        prevNetwork === Uni_ChainIdEnum[Uni_ChainIdEnum.GOERLI] ||
        prevNetwork === Uni_ChainIdEnum[Uni_ChainIdEnum.MAINNET]
      ) {
        connections.set(prevNetwork, DEFAULT_ETHEREUM_PROVIDERS[prevNetwork])
      }
    }
  }, [library, chainId, connections])

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
