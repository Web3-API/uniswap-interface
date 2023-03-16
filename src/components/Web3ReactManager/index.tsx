import React, { useState, useEffect, useRef } from 'react'
import { useWeb3React } from '@web3-react/core'
import styled from 'styled-components'
import { useTranslation } from 'react-i18next'
import { network } from '../../connectors'
import { useEagerConnect, useInactiveListener } from '../../hooks'
import { NetworkContextName } from '../../constants'
import Loader from '../Loader'
import { PolywrapProvider } from '@polywrap/react'
import { ethereumProviderPlugin, Connections, Connection } from '@polywrap/ethereum-provider-js'
import { ClientConfigBuilder } from '@polywrap/client-config-builder-js'
import { networks } from '../../polywrap/constants'
import { DefaultBundle, IWrapPackage } from '@polywrap/client-js'

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
  const { t } = useTranslation()
  const { active, account, library, chainId } = useWeb3React()
  const { active: networkActive, error: networkError, activate: activateNetwork } = useWeb3React(NetworkContextName)

  // Polywrap ethereum provider plugin
  const connections = useRef<Connections>(
    new Connections({
      networks: {
        mainnet: new Connection({
          provider: 'https://mainnet.infura.io/v3/b00b2c2cc09c487685e9fb061256d6a6'
        })
      }
    })
  )
  const ethPlugin = useRef<IWrapPackage>(ethereumProviderPlugin({ connections: connections.current }) as IWrapPackage)

  // try to eagerly connect to an injected provider, if it exists and has granted access already
  const triedEager = useEagerConnect()

  // after eagerly trying injected, if the network connect ever isn't active or in an error state, activate it
  useEffect(() => {
    if (triedEager && !networkActive && !networkError && !active) {
      activateNetwork(network)
    }
  }, [triedEager, networkActive, networkError, activateNetwork, active, account, library])

  useEffect(() => {
    if (chainId && library) {
      const id = chainId.toString()
      const currentNetwork = networks[id]
      const connection = new Connection({ provider: library })
      connections.current.setDefaultNetwork(currentNetwork.name, connection)
    }
  }, [library, chainId])

  // when there's no account connected, react to logins (broadly speaking) on the injected provider, if it exists
  useInactiveListener(!triedEager)

  // handle delayed loader state
  const [showLoader, setShowLoader] = useState(false)
  useEffect(() => {
    const timeout = setTimeout(() => {
      setShowLoader(true)
    }, 600)

    return () => {
      clearTimeout(timeout)
    }
  }, [])

  // on page load, do nothing until we've tried to connect to the injected connector
  if (!triedEager) {
    return null
  }

  // if the account context isn't active, and there's an error on the network context, it's an irrecoverable error
  if (!active && networkError) {
    return (
      <MessageWrapper>
        <Message>{t('unknownError')}</Message>
      </MessageWrapper>
    )
  }

  // if neither context is active, spin
  if (!active && !networkActive) {
    return showLoader ? (
      <MessageWrapper>
        <Loader />
      </MessageWrapper>
    ) : null
  }

  const config = new ClientConfigBuilder()
    .addDefaults()
    // Hot-fix: the ens-ocr-contenthash-uri-resolver-ext is failing to resolve
    .removeInterfaceImplementation(
      "wrap://ens/wraps.eth:uri-resolver-ext@1.1.0",
      "wrap://ens/wraps.eth:ens-ocr-contenthash-uri-resolver-ext@1.0.0"
    )
    .addPackage(DefaultBundle.plugins.ethereumProvider.uri.uri, ethPlugin.current).config

  return (
    <PolywrapProvider
      redirects={config.redirects}
      envs={config.envs}
      resolvers={config.resolvers}
      wrappers={config.wrappers}
      packages={config.packages}
      interfaces={config.interfaces}
    >
      {children}
    </PolywrapProvider>
  )
}
