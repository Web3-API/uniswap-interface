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

  const queryA = `
Client.query({
    uri: ensUri,
    query: \`query {
      bestTradeExactIn(
        pairs: $pairs,
        amountIn: $amountIn,
        tokenOut: $tokenOut,
        options: $options
      )
    }\`,
    variables
  })`.trim()

  const variablesA = `
  const currencyAmountIn = {
    token: {
      chainId: ${currencies.INPUT?.chainId ? currencies.INPUT.chainId : ''},
      address: '${currencies.INPUT?.address ? currencies.INPUT.address : ''}',
      currency: {
        decimals: ${currencies.INPUT?.currency.decimals},
        symbol: '${currencies.INPUT?.currency.symbol}',
        name: '${currencies.INPUT?.currency.name}'
      }
    },
    amount: ${input}
  }

  const currencyOut = {
    chainId: ${currencies.OUTPUT?.chainId ? currencies.OUTPUT.chainId : ''},
    address: '${currencies.OUTPUT?.address ? currencies.OUTPUT.address : ''}',
    currency: {
        decimals: ${currencies.OUTPUT?.currency.decimals},
        symbol: '${currencies.OUTPUT?.currency.symbol}',
        name: '${currencies.OUTPUT?.currency.name}'
    }
  }
`.trim()

  const queryB = `
Client.query({
    uri: ensUri,
    query: \`query {
      swapCallParameters(
        trade: $trade,
        tradeOptions: $tradeOptions,
      )
    }\`,
    variables
  })`.trim()

  const variablesB = `const trade = {
    route: Route,
    inputAmount: ${input}
    outputAmount: ${output}
  }

  const tradeOptions = {
    allowedSlippage: ${slippage}
    recipient: ${recipient}
    unixTimestamp: ${'1622664382250'}
  }
  `

  const queryC = `
Client.query({
    uri: ensUri,
    query: \`mutation {
      execCall(
        parameters: $parameters,
        chainId: $chainId,
      )
    }\`,
    variables
  })`.trim()

  const variablesC = `
  const parameters = ${slippage}
  const chainId: ${currencies.INPUT?.chainId}
  `

  return (
    <>
      {query === 'A' && (
        <CodeWrapper className="codeBlock__code">
          <pre className="line-numbers">
            <code className="language-js">{toggle ? queryA : variablesA}</code>
          </pre>
        </CodeWrapper>
      )}
      {query === 'B' && (
        <CodeWrapper className="codeBlock__code">
          <pre className="line-numbers">
            <code className="language-js">{toggle ? queryB : variablesB}</code>
          </pre>
        </CodeWrapper>
      )}
      {query === 'C' && (
        <CodeWrapper className="codeBlock__code">
          <pre className="line-numbers">
            <code className="language-js">{toggle ? queryC : variablesC}</code>
          </pre>
        </CodeWrapper>
      )}
    </>
  )
}

export default Code
