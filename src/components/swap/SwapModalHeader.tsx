import { Trans } from '@lingui/macro'
import { Percent } from '@uniswap/sdk-core'
import { Web3ApiClient } from '@web3api/client-js'
import { useWeb3ApiClient } from '@web3api/react'
import { useContext, useEffect, useState } from 'react'
import { AlertTriangle, ArrowDown } from 'react-feather'
import { Text } from 'rebass'
import styled, { ThemeContext } from 'styled-components/macro'

import { useUSDCValue } from '../../hooks/useUSDCPrice'
import {
  Uni_Query,
  Uni_TokenAmount as TokenAmount,
  Uni_Trade as Trade,
  Uni_Trade,
  Uni_TradeTypeEnum as TradeTypeEnum,
} from '../../polywrap'
import { reverseMapPrice, reverseMapToken, reverseMapTokenAmount, toSignificant } from '../../polywrap-utils'
import { ThemedText } from '../../theme'
import { isAddress, shortenAddress } from '../../utils'
import { computeFiatValuePriceImpact } from '../../utils/computeFiatValuePriceImpact'
import { ButtonPrimary } from '../Button'
import { LightCard } from '../Card'
import { AutoColumn } from '../Column'
import { FiatValue } from '../CurrencyInputPanel/FiatValue'
import CurrencyLogo from '../CurrencyLogo'
import { RowBetween, RowFixed } from '../Row'
import TradePrice from '../swap/TradePrice'
import { AdvancedSwapDetails } from './AdvancedSwapDetails'
import { SwapShowAcceptChanges, TruncatedText } from './styleds'

const ArrowWrapper = styled.div`
  padding: 4px;
  border-radius: 12px;
  height: 32px;
  width: 32px;
  position: relative;
  margin-top: -18px;
  margin-bottom: -18px;
  left: calc(50% - 16px);
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: ${({ theme }) => theme.bg1};
  border: 4px solid;
  border-color: ${({ theme }) => theme.bg0};
  z-index: 2;
`

const asyncAmount = async (client: Web3ApiClient, allowedSlippage: Percent, trade: Uni_Trade): Promise<TokenAmount> => {
  let invoke
  if (trade.tradeType === TradeTypeEnum.EXACT_INPUT) {
    invoke = await Uni_Query.tradeMinimumAmountOut(
      {
        slippageTolerance: allowedSlippage.toFixed(18),
        amountOut: trade.outputAmount,
        tradeType: trade.tradeType,
      },
      client
    )
  } else {
    invoke = await Uni_Query.tradeMaximumAmountIn(
      {
        slippageTolerance: allowedSlippage.toFixed(18),
        amountIn: trade.inputAmount,
        tradeType: trade.tradeType,
      },
      client
    )
  }
  if (invoke.error) throw invoke.error
  return invoke.data as TokenAmount
}

export default function SwapModalHeader({
  trade,
  allowedSlippage,
  recipient,
  showAcceptChanges,
  onAcceptChanges,
}: {
  trade: Trade
  allowedSlippage: Percent
  recipient: string | null
  showAcceptChanges: boolean
  onAcceptChanges: () => void
}) {
  const theme = useContext(ThemeContext)
  const client: Web3ApiClient = useWeb3ApiClient()

  const [amount, setAmount] = useState<string>('')

  useEffect(() => {
    console.log('SwapModalHeader - src/components/swap/SwapModalHeader')
    void asyncAmount(client, allowedSlippage, trade).then((res) => {
      const newAmount = toSignificant(res, 6)
      setAmount(newAmount)
    })
  }, [trade, allowedSlippage, client])

  const [showInverted, setShowInverted] = useState<boolean>(false)

  const fiatValueInput = useUSDCValue(reverseMapTokenAmount(trade.inputAmount))
  const fiatValueOutput = useUSDCValue(reverseMapTokenAmount(trade.outputAmount))

  return (
    <AutoColumn gap={'4px'} style={{ marginTop: '1rem' }}>
      <LightCard padding="0.75rem 1rem">
        <AutoColumn gap={'8px'}>
          <RowBetween align="center">
            <RowFixed gap={'0px'}>
              <TruncatedText
                fontSize={24}
                fontWeight={500}
                color={showAcceptChanges && trade.tradeType === TradeTypeEnum.EXACT_OUTPUT ? theme.primary1 : ''}
              >
                {toSignificant(trade.inputAmount, 6)}
              </TruncatedText>
            </RowFixed>
            <RowFixed gap={'0px'}>
              <CurrencyLogo
                currency={reverseMapToken(trade.inputAmount.token)}
                size={'20px'}
                style={{ marginRight: '12px' }}
              />
              <Text fontSize={20} fontWeight={500}>
                {trade.inputAmount.token.currency.symbol}
              </Text>
            </RowFixed>
          </RowBetween>
          <RowBetween>
            <FiatValue fiatValue={fiatValueInput} />
          </RowBetween>
        </AutoColumn>
      </LightCard>
      <ArrowWrapper>
        <ArrowDown size="16" color={theme.text2} />
      </ArrowWrapper>
      <LightCard padding="0.75rem 1rem" style={{ marginBottom: '0.25rem' }}>
        <AutoColumn gap={'8px'}>
          <RowBetween align="flex-end">
            <RowFixed gap={'0px'}>
              <TruncatedText fontSize={24} fontWeight={500}>
                {toSignificant(trade.outputAmount, 6)}
              </TruncatedText>
            </RowFixed>
            <RowFixed gap={'0px'}>
              <CurrencyLogo
                currency={reverseMapToken(trade.outputAmount.token)}
                size={'20px'}
                style={{ marginRight: '12px' }}
              />
              <Text fontSize={20} fontWeight={500}>
                {trade.outputAmount.token.currency.symbol}
              </Text>
            </RowFixed>
          </RowBetween>
          <RowBetween>
            <ThemedText.Body fontSize={14} color={theme.text3}>
              <FiatValue
                fiatValue={fiatValueOutput}
                priceImpact={computeFiatValuePriceImpact(fiatValueInput, fiatValueOutput)}
              />
            </ThemedText.Body>
          </RowBetween>
        </AutoColumn>
      </LightCard>
      <RowBetween style={{ marginTop: '0.25rem', padding: '0 1rem' }}>
        <TradePrice
          price={reverseMapPrice(trade.executionPrice)}
          showInverted={showInverted}
          setShowInverted={setShowInverted}
        />
      </RowBetween>
      <LightCard style={{ padding: '.75rem', marginTop: '0.5rem' }}>
        <AdvancedSwapDetails trade={trade} allowedSlippage={allowedSlippage} />
      </LightCard>
      {showAcceptChanges ? (
        <SwapShowAcceptChanges justify="flex-start" gap={'0px'}>
          <RowBetween>
            <RowFixed>
              <AlertTriangle size={20} style={{ marginRight: '8px', minWidth: 24 }} />
              <ThemedText.Main color={theme.primary1}>
                <Trans>Price Updated</Trans>
              </ThemedText.Main>
            </RowFixed>
            <ButtonPrimary
              style={{ padding: '.5rem', width: 'fit-content', fontSize: '0.825rem', borderRadius: '12px' }}
              onClick={onAcceptChanges}
            >
              <Trans>Accept</Trans>
            </ButtonPrimary>
          </RowBetween>
        </SwapShowAcceptChanges>
      ) : null}

      <AutoColumn justify="flex-start" gap="sm" style={{ padding: '.75rem 1rem' }}>
        {trade.tradeType === TradeTypeEnum.EXACT_INPUT ? (
          <ThemedText.Italic fontWeight={400} textAlign="left" style={{ width: '100%' }}>
            <Trans>
              Output is estimated. You will receive at least{' '}
              <b>
                {amount} {trade.outputAmount.token.currency.symbol}
              </b>{' '}
              or the transaction will revert.
            </Trans>
          </ThemedText.Italic>
        ) : (
          <ThemedText.Italic fontWeight={400} textAlign="left" style={{ width: '100%' }}>
            <Trans>
              Input is estimated. You will sell at most{' '}
              <b>
                {amount} {trade.inputAmount.token.currency.symbol}
              </b>{' '}
              or the transaction will revert.
            </Trans>
          </ThemedText.Italic>
        )}
      </AutoColumn>
      {recipient !== null ? (
        <AutoColumn justify="flex-start" gap="sm" style={{ padding: '12px 0 0 0px' }}>
          <ThemedText.Main>
            <Trans>
              Output will be sent to{' '}
              <b title={recipient}>{isAddress(recipient) ? shortenAddress(recipient) : recipient}</b>
            </Trans>
          </ThemedText.Main>
        </AutoColumn>
      ) : null}
    </AutoColumn>
  )
}
