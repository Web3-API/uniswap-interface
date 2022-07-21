import '../../polywrap-components/howItWorks.css'
import '../../polywrap-components/prism.css'
import '../../components/Card/index'

import React, { useEffect } from 'react'
import { Flex, Image, Text } from 'rebass'

import IpfsDiagram from '../../assets/images/ipfs-diagram.png'
import PolywrapLogo from '../../assets/images/polywrap-logo.png'
import WasmLogo from '../../assets/images/wasm-logo.png'
import ArrowDown from '../../assets/svg/arrow-down-green.svg'
import { OutlineCard } from '../../components/Card'

const query = `
Client.query({
  uri: ensUri,
  query: \`module {
          createRoute(
              pools: $pools
              inToken: $inToken
              outToken: $outToken
          )
      }\`
})`.trim()

const invoke = `
Client.invoke({
  uri: ensUri,
  method: "createRoute",
  args: {
    pools,
    inToken,
    outToken
  }
})`.trim()

export default function HowItWorks() {
  useEffect(() => {
    // @ts-ignore
    window.Prism.highlightAll()
  }, [])

  return (
    <>
      <Image className="intro__logo" width={'100px'} src={PolywrapLogo} />
      <Flex className="intro">
        <Text className="intro__text">
          While this demo may seem to work like the original Uniswap app, what happens behind the scenes is quite
          different:
        </Text>
        <Text className="intro__h2">
          Our team has replaced all the app functionality from the Uniswap JavaScript SDK with our own Uni v3 Wasm
          wrapper!
        </Text>
        <Text className="intro__text"> Scroll down to see how this all works!</Text>

        <Image style={{ width: '15px', paddingTop: '2rem' }} src={ArrowDown} />
      </Flex>
      <Flex className="steps">
        <Text className="steps__intro" style={{ paddingBottom: '2rem' }}>
          How It Works
        </Text>
        <Flex className="steps__container">
          <Flex className="steps__textContainer">
            <Text className="steps__heading">Downloading Polywrapper from IPFS</Text>
            <Text className="steps__text">
              The first step to integrate Polywrap into any dapp is to install it as a dependency and then initializing
              the PolywrapClient. Rather than bundling business logic into your app with a JS SDK, the Wasm wrapper is
              deployed to a decentralized endpoint like IPFS. The Polywrap client downloads this package at runtime and
              instantiates the wasm modules containing the protocol business logic.
            </Text>
          </Flex>
          <OutlineCard className="steps__visual">
            <Image width={'20rem'} src={IpfsDiagram} />
          </OutlineCard>
        </Flex>
        <Flex className="steps__container">
          <Flex className="steps__textContainer">
            <Text className="steps__heading">WebAssembly</Text>
            <Text className="steps__text">
              We implemented the Uni v3 business logic using a language called AssemblyScript. AssemblyScript compiles
              to WebAssembly modules which will have the functions that the dapp needs in order to perform swaps.
            </Text>
          </Flex>
          <OutlineCard className="steps__visual">
            <Image src={WasmLogo} style={{ maxWidth: '7rem' }} />
          </OutlineCard>
        </Flex>
        <Flex className="steps__container">
          <Flex className="steps__textContainer">
            <Text className="steps__heading">Invocation</Text>
            <Text className="steps__text">
              With a Polywrap-enabled dapp, you can invoke functions made available by the Wasm modules. Polywrap also
              Polywrap also features an alternative GraphQL query syntax for a familiar user experience.
            </Text>
          </Flex>
          <OutlineCard className="steps__code">
            <pre className="line-numbers">
              <code className="language-js">{invoke}</code>
            </pre>
            <pre>
              <code className="language-js">{query}</code>
            </pre>
          </OutlineCard>
        </Flex>
      </Flex>
    </>
  )
}
