import './prism.css'

import React, { useState } from 'react'
import { Flex, Image } from 'rebass'
import styled from 'styled-components/macro'

import ArrowRight from '../assets/images/arrow-right.svg'
import { ButtonPolywrap } from '../components/Button'
import { Uni_Token, Uni_TradeTypeEnum } from '../polywrap'
import CodeblockTabs, { CodeTabsProps } from './CodeblockTabs'
import PolywrapTooltip from './PolywrapTooltip'
import { useQuoteCallParametersCode, useSwapCallParametersCode, useUncheckedTradeCode } from './useCode'

const CodeblockContainer = styled(Flex)`
  width: 40rem;
  display: flex;
  flex-direction: column;
  align-items: flex-start;

  @media (max-width: 960px) {
    padding-top: 3rem;
  }
`

const CodeblockSelect = styled(Flex)`
  padding: 0 0 1rem 0;
  margin-top: 1rem !important;
  justify-content: space-between;
  width: 100%;

  @media (max-width: 1280px) {
    margin-top: 0 !important;
  }

  @media (max-width: 960px) {
    display: flex;
    height: 9rem;
    flex-wrap: wrap;
  }
`

const ButtonContainer = styled(Flex)`
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`

const Arrow = styled(Image)`
  filter: invert(79%) sepia(31%) saturate(554%) hue-rotate(90deg) brightness(96%) contrast(87%);

  @media (max-width: 960px) {
    display: none;
  }
`

interface Props {
  currencies: { INPUT?: Uni_Token; OUTPUT?: Uni_Token }
  input?: string
  output?: string
  tradeType: Uni_TradeTypeEnum
  slippageTolerance: string
  recipient?: string
  deadline?: string
}

/**
 * The styled container element that wraps the content of most pages and the tabs.
 */
const Codeblock = (props: React.PropsWithChildren<Props>) => {
  const { currencies, input, output, tradeType, slippageTolerance, recipient, deadline } = props

  const independentToken = tradeType === Uni_TradeTypeEnum.EXACT_INPUT ? currencies.INPUT : currencies.OUTPUT
  const dependentToken = tradeType === Uni_TradeTypeEnum.EXACT_INPUT ? currencies.OUTPUT : currencies.INPUT
  const independentAmount = tradeType === Uni_TradeTypeEnum.EXACT_INPUT ? input : output
  const dependentAmount = tradeType === Uni_TradeTypeEnum.EXACT_INPUT ? output : input

  const { query: queryStrA, variables: variablesStrA } = useQuoteCallParametersCode({
    independentToken,
    independentAmount,
    tradeType,
  })
  const { query: queryStrB, variables: variablesStrB } = useUncheckedTradeCode({
    dependentToken,
    dependentAmount,
    tradeType,
  })
  const { query: queryStrC, variables: variablesStrC } = useSwapCallParametersCode({
    slippageTolerance,
    recipient,
    deadline,
  })

  const [{ query, variables }, setQuery] = useState<CodeTabsProps>({ query: queryStrA, variables: variablesStrA })
  const queryAHandler = () => setQuery({ query: queryStrA, variables: variablesStrA })
  const queryBHandler = () => setQuery({ query: queryStrB, variables: variablesStrB })
  const queryCHandler = () => setQuery({ query: queryStrC, variables: variablesStrC })

  return (
    <>
      <CodeblockContainer>
        <CodeblockSelect>
          <ButtonContainer>
            <ButtonPolywrap onClick={queryAHandler}>
              bestTradeExactIn
              <PolywrapTooltip text="Given a list of pairs, a fixed amount in, and token amount out, this method returns the best maxNumResults trades that swap an input token amount to an output token, making at most maxHops hops. The returned trades are sorted by output amount, in decreasing order, and all share the given input amount. " />
            </ButtonPolywrap>
          </ButtonContainer>
          <Arrow src={ArrowRight} />
          <ButtonContainer>
            <ButtonPolywrap onClick={queryBHandler}>
              swapCallParameters
              <PolywrapTooltip text="swapCallParameters accepts a Trade and a set of trade options as input. It transforms the trade into parameter values that can later be used to submit an Ethereum transaction that will execute the trade in Uniswap's smart contracts." />
            </ButtonPolywrap>
          </ButtonContainer>
          <Arrow src={ArrowRight} />
          <ButtonContainer>
            <ButtonPolywrap onClick={queryCHandler}>
              execCall
              <PolywrapTooltip text="Using the output of swapCallParameters, execCall submits an Ethereum transaction and returns the transaction hash that uniquely identifies it on the Ethereum blockchain." />
            </ButtonPolywrap>
          </ButtonContainer>
        </CodeblockSelect>
        <CodeblockTabs query={query} variables={variables} />
      </CodeblockContainer>
    </>
  )
}

export default Codeblock
