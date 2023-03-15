import React, { useContext, useEffect, useState } from 'react'
import { ArrowDown, AlertTriangle } from 'react-feather'
import { Text } from 'rebass'
import { ThemeContext } from 'styled-components'
import { Field } from '../../state/swap/actions'
import { TYPE } from '../../theme'
import { ButtonPrimary } from '../Button'
import { isAddress, shortenAddress } from '../../utils'
import { w3ComputeSlippageAdjustedAmounts, w3computeTradePriceBreakdown, warningSeverity } from '../../utils/prices'
import { AutoColumn } from '../Column'
import CurrencyLogo from '../CurrencyLogo'
import { RowBetween, RowFixed } from '../Row'
import { TruncatedText, SwapShowAcceptChanges } from './styleds'
import { W3TokenAmount, W3Trade, W3TradeType } from '../../polywrap/types'
import Decimal from 'decimal.js'
import { reverseMapToken } from '../../polywrap/mapping'
import { toSignificant } from '../../polywrap/utils'
import { PolywrapClient } from '@polywrap/client-js'
import { usePolywrapClient } from '@polywrap/react'

export default function SwapModalHeader({
  trade,
  allowedSlippage,
  recipient,
  showAcceptChanges,
  onAcceptChanges
}: {
  trade: W3Trade
  allowedSlippage: number
  recipient: string | null
  showAcceptChanges: boolean
  onAcceptChanges: () => void
}) {
  // get polywrap client
  const client: PolywrapClient = usePolywrapClient()

  const [slippageAdjustedAmounts, setSlippageAdjustedAmounts] = useState<
    { [field in Field]?: W3TokenAmount } | undefined
  >(undefined)
  const [priceImpactWithoutFee, setPriceImpactWithoutFee] = useState<Decimal | undefined>(undefined)
  useEffect(() => {
    const updateStateAsync = async () => {
      const slippageAdjustedAmounts = await w3ComputeSlippageAdjustedAmounts(client, trade, allowedSlippage)
      const { priceImpactWithoutFee } = await w3computeTradePriceBreakdown(client, trade)
      setSlippageAdjustedAmounts(slippageAdjustedAmounts)
      setPriceImpactWithoutFee(priceImpactWithoutFee)
    }
    updateStateAsync()
  }, [trade, allowedSlippage])

  const priceImpactSeverity = warningSeverity(priceImpactWithoutFee)

  const theme = useContext(ThemeContext)

  return (
    <AutoColumn gap={'md'} style={{ marginTop: '20px' }}>
      <RowBetween align="flex-end">
        <RowFixed gap={'0px'}>
          <CurrencyLogo
            currency={reverseMapToken(trade.inputAmount.token)}
            size={'24px'}
            style={{ marginRight: '12px' }}
          />
          <TruncatedText
            fontSize={24}
            fontWeight={500}
            color={showAcceptChanges && trade.tradeType === W3TradeType.EXACT_OUTPUT ? theme.primary1 : ''}
          >
            {toSignificant(trade.inputAmount, 6)}
          </TruncatedText>
        </RowFixed>
        <RowFixed gap={'0px'}>
          <Text fontSize={24} fontWeight={500} style={{ marginLeft: '10px' }}>
            {trade.inputAmount.token.currency.symbol}
          </Text>
        </RowFixed>
      </RowBetween>
      <RowFixed>
        <ArrowDown size="16" color={theme.text2} style={{ marginLeft: '4px', minWidth: '16px' }} />
      </RowFixed>
      <RowBetween align="flex-end">
        <RowFixed gap={'0px'}>
          <CurrencyLogo
            currency={reverseMapToken(trade.outputAmount.token)}
            size={'24px'}
            style={{ marginRight: '12px' }}
          />
          <TruncatedText
            fontSize={24}
            fontWeight={500}
            color={
              priceImpactSeverity > 2
                ? theme.red1
                : showAcceptChanges && trade.tradeType === W3TradeType.EXACT_INPUT
                ? theme.primary1
                : ''
            }
          >
            {toSignificant(trade.outputAmount, 6)}
          </TruncatedText>
        </RowFixed>
        <RowFixed gap={'0px'}>
          <Text fontSize={24} fontWeight={500} style={{ marginLeft: '10px' }}>
            {trade.outputAmount.token.currency.symbol}
          </Text>
        </RowFixed>
      </RowBetween>
      {showAcceptChanges ? (
        <SwapShowAcceptChanges justify="flex-start" gap={'0px'}>
          <RowBetween>
            <RowFixed>
              <AlertTriangle size={20} style={{ marginRight: '8px', minWidth: 24 }} />
              <TYPE.main color={theme.primary1}> Price Updated</TYPE.main>
            </RowFixed>
            <ButtonPrimary
              style={{ padding: '.5rem', width: 'fit-content', fontSize: '0.825rem', borderRadius: '12px' }}
              onClick={onAcceptChanges}
            >
              Accept
            </ButtonPrimary>
          </RowBetween>
        </SwapShowAcceptChanges>
      ) : null}
      <AutoColumn justify="flex-start" gap="sm" style={{ padding: '12px 0 0 0px' }}>
        {trade.tradeType === W3TradeType.EXACT_INPUT ? (
          <TYPE.italic textAlign="left" style={{ width: '100%' }}>
            {`Output is estimated. You will receive at least `}
            <b>
              {toSignificant(slippageAdjustedAmounts?.[Field.OUTPUT], 6)} {trade.outputAmount.token.currency.symbol}
            </b>
            {' or the transaction will revert.'}
          </TYPE.italic>
        ) : (
          <TYPE.italic textAlign="left" style={{ width: '100%' }}>
            {`Input is estimated. You will sell at most `}
            <b>
              {toSignificant(slippageAdjustedAmounts?.[Field.INPUT], 6)} {trade.inputAmount.token.currency.symbol}
            </b>
            {' or the transaction will revert.'}
          </TYPE.italic>
        )}
      </AutoColumn>
      {recipient !== null ? (
        <AutoColumn justify="flex-start" gap="sm" style={{ padding: '12px 0 0 0px' }}>
          <TYPE.main>
            Output will be sent to{' '}
            <b title={recipient}>{isAddress(recipient) ? shortenAddress(recipient) : recipient}</b>
          </TYPE.main>
        </AutoColumn>
      ) : null}
    </AutoColumn>
  )
}
