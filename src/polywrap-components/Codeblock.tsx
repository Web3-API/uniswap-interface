import './prism.css'

import React, { useState } from 'react'
import { Flex, Image } from 'rebass'
import styled from 'styled-components/macro'

import ArrowRight from '../assets/images/arrow-right.svg'
import { ButtonPolywrap } from '../components/Button'
import { Uni_Token, Uni_TradeTypeEnum } from '../polywrap'
import CodeblockTabs, { CodeTabsProps } from './CodeblockTabs'
import PolywrapTooltip from './PolywrapTooltip'
import { useCreateUncheckedTradeCode, useQuoteCallParametersCode, useSwapCallParametersCode } from './useCode'

const CodeblockContainer = styled(Flex)`
  max-width: 46rem;
  display: flex;
  flex-direction: column;
  align-items: flex-start;

  ${({ theme }) => theme.mediaWidth.upToMedium`
    padding-top: 3rem;
  `};
`

const CodeblockSelect = styled(Flex)`
  padding: 0 0 1rem 0;
  margin-top: 1rem !important;
  justify-content: space-between;
  width: 100%;

  ${({ theme }) => theme.mediaWidth.upToMedium`
    display: flex;
    flex-wrap: wrap;
  `};
`

const ButtonContainer = styled(Flex)`
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`

const Arrow = styled(Image)`
  filter: invert(79%) sepia(31%) saturate(554%) hue-rotate(90deg) brightness(96%) contrast(87%);

  ${({ theme }) => theme.mediaWidth.upToMedium`
    display: none;
  `};
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

  const { query: quoteCallParametersQuery, variables: quoteCallParametersVariables } = useQuoteCallParametersCode({
    independentToken,
    independentAmount,
    tradeType,
  })
  const { query: createUncheckedTradeQuery, variables: createUncheckedTradeVariables } = useCreateUncheckedTradeCode({
    dependentToken,
    dependentAmount,
    tradeType,
  })
  const { query: swapCallParamtersQuery, variables: swapCallParametersVariables } = useSwapCallParametersCode({
    slippageTolerance,
    recipient,
    deadline,
  })

  const [{ query, variables }, setQuery] = useState<CodeTabsProps>({
    query: quoteCallParametersQuery,
    variables: quoteCallParametersVariables,
  })
  const queryAHandler = () => setQuery({ query: quoteCallParametersQuery, variables: quoteCallParametersVariables })
  const queryBHandler = () => setQuery({ query: createUncheckedTradeQuery, variables: createUncheckedTradeVariables })
  const queryCHandler = () => setQuery({ query: swapCallParamtersQuery, variables: swapCallParametersVariables })

  return (
    <>
      <CodeblockContainer>
        <CodeblockSelect>
          <ButtonContainer>
            <ButtonPolywrap onClick={queryAHandler}>
              quoteCallParameters
              <PolywrapTooltip text="Given a route of pools to swap through and a specified amount of input or output, quoteCallParameters returns calldata for an Ethereum transaction. The calldata can be sent to Uniswap's Quoter smart contract to evaluate the trade result without executing it." />
            </ButtonPolywrap>
          </ButtonContainer>
          <Arrow src={ArrowRight} />
          <ButtonContainer>
            <ButtonPolywrap onClick={queryBHandler}>
              createUncheckedTrade
              <PolywrapTooltip text="createUncheckedTrade uses an input amount, an output amount, and a trade route to create a Trade without simulating swaps to verify the amounts." />
            </ButtonPolywrap>
          </ButtonContainer>
          <Arrow src={ArrowRight} />
          <ButtonContainer>
            <ButtonPolywrap onClick={queryCHandler}>
              swapCallParameters
              <PolywrapTooltip text="swapCallParameters accepts a Trade and a set of swap options as input. It transforms the trade into calldata for an Ethereum transaction that will execute the trade in Uniswap's smart contracts." />
            </ButtonPolywrap>
          </ButtonContainer>
        </CodeblockSelect>
        <CodeblockTabs query={query} variables={variables} />
      </CodeblockContainer>
    </>
  )
}

export default Codeblock
