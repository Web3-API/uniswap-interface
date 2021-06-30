import React, { useEffect } from 'react'
import Prism from 'prismjs'
import PolywrapLogo from '../../assets/images/polywrap-logo.png'
import IpfsDiagram from '../../assets/images/ipfs-diagram.png'
import WasmLogo from '../../assets/images/wasm-logo.png'
import ArrowDown from '../../assets/images/arrow-down-green.svg'
import { Image, Flex, Text } from 'rebass'
import '../../web3api/components/howItWorks.css'
import '../../components/Card/index'
import { OutlineCard } from '../../components/Card/index'

const query = `
  Client.query({
      uri: ensUri,
      query: \`query {
          bestTradeExactIn(
            pairs: $pairs
            amountIn: $amountIn
            tokenOut: $tokenOut
            options: $options
           )
         }\`,
      })
  })`.trim()

export default function HowItWorks() {
  useEffect(() => {
    setTimeout(() => Prism.highlightAll(), 0)
  })

  return (
    <>
      <Image className="intro__logo" width={'100px'} src={PolywrapLogo} />
      <Flex className="intro">
        <Text className="intro__h1"></Text>
        <Text className="intro__text">
          While this demo may seem to work like the original Uniswap Swap page, what happens behind the scenes is quite
          different:
        </Text>
        <Text className="intro__h2">
          Our team has replaced all the Swap functionality from the Uniswap JavaScript SDK with ones from our own Uni v2
          Polywrapper!
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
              the PolywrapClient. Rather than bundling business logic into your app with a JS SDK, the Polywrapper is
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
              We implemented the Uni v2 business logic using a language called AssemblyScript. AssemblyScript compiles
              to WebAssembly modules which will have the functions that the dapp needs in order to perform swaps.
            </Text>
          </Flex>
          <OutlineCard className="steps__visual">
            <Image src={WasmLogo} style={{ maxWidth: '7rem' }} />
          </OutlineCard>
        </Flex>
        <Flex className="steps__container">
          <Flex className="steps__textContainer">
            <Text className="steps__heading">GraphQL</Text>
            <Text className="steps__text">
              With a Polywrap-enabled dapp, you can send GraphQL queries to invoke functions made available by the wasm
              modules.
            </Text>
          </Flex>
          <OutlineCard className="steps__code">
            <pre className="line-numbers">
              <code className="language-js">{query}</code>
            </pre>
          </OutlineCard>
        </Flex>
      </Flex>
    </>
  )
}
