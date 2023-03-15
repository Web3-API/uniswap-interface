import React, { useState } from 'react'
import styled from 'styled-components'
import { Image, Flex } from 'rebass'
import Code from './Code'
import CodeToggle from './CodeToggle'
import { ButtonPolywrap } from '../../components/Button'
import { W3Token } from '../types'
import './prism.css'
import W3ToolTip from './W3ToolTip'
import Arrow from '../../assets/images/arrow-right.svg'

// Styling for Codeblock component.
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
}

/**
 * The styled container element that wraps the content of most pages and the tabs.
 */
const Codeblock = (props: React.PropsWithChildren<Props>) => {
  const { input, currencies, slippage, recipient, output } = props
  const [toggle, setToggle] = useState<boolean>(true)
  const [query, setQuery] = useState<string | null>('A')

  const queryAHandler = () => {
    setQuery('A')
    setToggle(true)
  }

  const queryBHandler = () => {
    setQuery('B')
    setToggle(true)
  }

  const queryCHandler = () => {
    setQuery('C')
    setToggle(true)
  }

  return (
    <>
      <Flex className="codeBlock">
        <Flex className="codeBlock__select">
          <Flex className="codeBlock__btnContainer">
            <ButtonPolywrap onClick={queryAHandler} className="codeBlock__btn">
              bestTradeExactIn
              <W3ToolTip text="Given a list of pairs, a fixed amount in, and token amount out, this method returns the best maxNumResults trades that swap an input token amount to an output token, making at most maxHops hops. The returned trades are sorted by output amount, in decreasing order, and all share the given input amount. " />
            </ButtonPolywrap>
            <Image className="codeBlock__arrow" src={Arrow} />
          </Flex>
          <Flex className="codeBlock__btnContainer">
            <ButtonPolywrap onClick={queryBHandler} className="codeBlock__btn">
              swapCallParameters
              <W3ToolTip text="swapCallParameters accepts a Trade and a set of trade options as input. It transforms the trade into parameter values that can later be used to submit an Ethereum transaction that will execute the trade in Uniswap's smart contracts." />
            </ButtonPolywrap>
            <Image className="codeBlock__arrow" src={Arrow} />
          </Flex>
          <Flex className="codeBlock__btnContainer">
            <ButtonPolywrap onClick={queryCHandler} className="codeBlock__btn">
              execCall
              <W3ToolTip text="Using the output of swapCallParameters, execCall submits an Ethereum transaction and returns the transaction hash that uniquely identifies it on the Ethereum blockchain." />
            </ButtonPolywrap>
          </Flex>
        </Flex>
        <Flex className="codeBlock__toggle">
          <CodeToggle id="toggle-expert-mode-button" isActive={toggle} toggle={() => setToggle(!toggle)} />
        </Flex>
        <Code
          toggle={toggle}
          input={input}
          currencies={currencies}
          slippage={slippage}
          recipient={recipient}
          output={output}
          query={query}
        />
      </Flex>
    </>
  )
}

export default Codeblock
