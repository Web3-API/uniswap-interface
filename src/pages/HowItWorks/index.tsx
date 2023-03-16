import React, { useEffect } from 'react'
import Prism from 'prismjs'
import PolywrapLogo from '../../assets/images/polywrap-logo.png'
import IpfsDiagram from '../../assets/images/ipfs-diagram.png'
import WasmLogo from '../../assets/images/wasm-logo.png'
import ArrowDown from '../../assets/images/arrow-down-green.svg'
import { Image, Flex, Text } from 'rebass'
import '../../polywrap/components/howItWorks.css'
import '../../components/Card/index'
import { OutlineCard } from '../../components/Card/index'
import { ExternalLink } from "../../components/Links"

const query = `
const trade = await client.invoke({
  uri: "ens/uniswap.wraps.eth:v2",
  method: "bestTradeExactIn"
  args: {
    pairs: [...],
    amountIn: {...},
    tokenOut: {...},
    options: {...}
  }
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
          While this demo may seem to work like the original Uniswap application, what happens behind the scenes is quite
          different:
        </Text>
        <Text className="intro__h2">
          Our team has replaced the Uniswap JavaScript SDK with a WebAssembly-based Wrapper!
        </Text>
        <Text className="intro__text"> Scroll down to see how this all works!</Text>

        <Image style={{ width: '15px', paddingTop: '2rem' }} src={ArrowDown} />
      </Flex>
      <Flex className="steps">
        <Text className="steps__intro" style={{ paddingBottom: '2rem' }}>
          How It Works
        </Text>
        <Flex className="steps__container">
          <OutlineCard className="steps__visual">
            <Image src={WasmLogo} style={{ maxWidth: '7rem' }} />
          </OutlineCard>
          <Flex className="steps__textContainer">
            <Text className="steps__heading">Run in WebAssembly</Text>
            <Text className="steps__text">
              We implemented the Uni v2 business logic entirely in <b>WebAssembly</b> thanks to the <b>Polywrap</b> toolchain!
              This will enable dapps built in any language to perform swaps on the Uniswap protocol.
            </Text>
            <ExternalLink
              id={`docs-nav-link`}
              href={'https://github.com/polywrap/uniswap'}
            >
              Source Code <span style={{ fontSize: '11px' }}>↗</span>
            </ExternalLink>
          </Flex>
        </Flex>
        <Flex className="steps__container">
          <OutlineCard className="steps__visual">
            <Image width={'20rem'} src={IpfsDiagram} />
          </OutlineCard>
          <Flex className="steps__textContainer">
            <Text className="steps__heading">Hosted on Web3</Text>
            <Text className="steps__text">
              Wrappers can be hosted anywhere, but in this particular example we're leveraging
              {" "}<b>ENS</b> and <b>IPFS</b>! Leveraging these web3-native technologies enable
              dapps anywhere in the world to freely fetch and use the Uniswap wrapper. Additionally,
              the Polywrap Client can safely download & run the wrapper at runtime, thanks to the
              security guarentees of Ethereum & IPFS!
            </Text>
          </Flex>
        </Flex>
        <Flex className="steps__container">
          <OutlineCard className="steps__code">
            <pre className="line-numbers">
              <code className="language-js" style={{
                fontFamily: "monospace",
                fontSize: "0.95em"
              }}>{query}</code>
            </pre>
          </OutlineCard>
          <Flex className="steps__textContainer">
            <Text className="steps__heading">Accessible Everywhere</Text>
            <Text className="steps__text">
              Wrappers can be integrated anywhere WebAssembly can run, which is pretty much everywhere.
              Simply integrate the <b>Polywrap Client</b> in your programming language of choice, and invoke wrappers on-the-fly with a familiar interface.
            </Text>
          </Flex>
        </Flex>
      </Flex>
    </>
  )
}
