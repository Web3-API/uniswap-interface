import React, { useState, useEffect } from 'react'
import { useWeb3React } from '@web3-react/core'
import styled from 'styled-components'
import { useTranslation } from 'react-i18next'
import { network } from '../../connectors'
import { useEagerConnect, useInactiveListener } from '../../hooks'
import { NetworkContextName } from '../../constants'
import Loader from '../Loader'
import { PluginRegistration } from '@web3api/client-js'
import { Web3ApiProvider } from '@web3api/react'
import { ethereumPlugin } from '@web3api/ethereum-plugin-js'
import { sha3Plugin } from '@web3api/sha3-plugin-js'
import { networks } from 'web3api/constants'
import { ipfsPlugin } from '@web3api/ipfs-plugin-js'

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

  // Web3API integration.
  const [ethPlugin, setEthPlugin] = useState<any>(
    ethereumPlugin({
      networks: {
        mainnet: {
          provider: 'https://mainnet.infura.io/v3/b00b2c2cc09c487685e9fb061256d6a6'
        }
      }
    })
  )

  const plugins: PluginRegistration[] = [
    {
      uri: 'ens/ethereum.web3api.eth',
      plugin: ethPlugin
    },
    {
      uri: 'w3://ens/ipfs.web3api.eth',
      plugin: ipfsPlugin({
        provider: 'https://polywrap-dev.mypinata.cloud',
        fallbackProviders: [
          'https://ipfs.io'
        ]
      })
    },
    {
      uri: 'w3://ens/sha3.web3api.eth',
      plugin: sha3Plugin()
    }
  ]

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
      const config = {
        [currentNetwork.name]: {
          provider: library,
          signer: library.getSigner()
        }
      }
      setEthPlugin(
        ethereumPlugin({
          networks: config,
          defaultNetwork: currentNetwork.name
        })
      )
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

  return <Web3ApiProvider plugins={plugins}>{children}</Web3ApiProvider>
}
