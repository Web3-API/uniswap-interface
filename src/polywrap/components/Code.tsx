import React, { useEffect } from 'react'
import styled from 'styled-components'
import Prism from 'prismjs'
import { W3Token } from '../types'
import './prism.css'

export const CodeWrapper = styled.div`
  background: transparent;
  width: 40rem;
  margin-left: 2rem;
  position: relative;
  border-radius: 10px;
  /* padding: 1rem; */
`

const codeStyle = {
  fontFamily: "monospace",
  fontSize: "0.95em"
};

interface Props {
  input: string
  currencies: { INPUT?: W3Token | undefined; OUTPUT?: W3Token | undefined }
  slippage: number
  recipient: string | null
  output: string
  query: string | null
  toggle: boolean
}

/**
 * The styled container element that wraps the content of most pages and the tabs.
 */
const Code = (props: React.PropsWithChildren<Props>) => {
  const { input, currencies, slippage, recipient, output, query, toggle } = props

  useEffect(() => {
    setTimeout(() => Prism.highlightAll(), 0)
  }, [input, currencies, slippage, recipient, output, query, toggle])

  const invokeA = `
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

  const codegenA = `
const trade = await UniswapV2.bestTradeExactIn({
  pairs: [...],
  amountIn: {...},
  tokenOut: {...},
  options: {...}
})`.trim()

  const invokeB = `
const parameters = await client.invoke({
  uri: "ens/uniswap.wraps.eth:v2",
  method: "swapCallParameters",
  args: {
    trade: trade.value,
    tradeOptions: {...}
  }
})`.trim()

  const codegenB = `
const parameters = await UniswapV2.swapCallParameters({
  trade: trade,
  tradeOptions: {...}
})`.trim()

  const invokeC = `
const txRes = await client.invoke({
  uri: "ens/uniswap.wraps.eth:v2",
  method: "execCall",
  args: {
    parameters: parameters.value,
    chainId: "...",
  }
})`.trim()

  const codegenC = `
const txRes = await UniswapV2.execCall({
  parameters: params,
  chainId: "...",
})`.trim()

  return (
    <>
      {query === 'A' && (
        <CodeWrapper className="codeBlock__code">
          <pre className="line-numbers">
            <code className="language-js" style={codeStyle}>
              {toggle ? invokeA : codegenA}
            </code>
          </pre>
        </CodeWrapper>
      )}
      {query === 'B' && (
        <CodeWrapper className="codeBlock__code">
          <pre className="line-numbers">
          <code className="language-js" style={codeStyle}>
            {toggle ? invokeB : codegenB}
          </code>
          </pre>
        </CodeWrapper>
      )}
      {query === 'C' && (
        <CodeWrapper className="codeBlock__code">
          <pre className="line-numbers">
          <code className="language-js" style={codeStyle}>
            {toggle ? invokeC : codegenC}
          </code>
          </pre>
        </CodeWrapper>
      )}
    </>
  )
}

export default Code
