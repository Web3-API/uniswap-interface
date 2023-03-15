import React, { useContext, useEffect, useState } from 'react'
import { Repeat } from 'react-feather'
import { Text } from 'rebass'
import { ThemeContext } from 'styled-components'
import { Field } from '../../state/swap/actions'
import { TYPE } from '../../theme'
import {
  w3ComputeSlippageAdjustedAmounts,
  w3computeTradePriceBreakdown,
  w3formatExecutionPrice,
  warningSeverity
} from '../../utils/prices'
import { ButtonError } from '../Button'
import { AutoColumn } from '../Column'
import QuestionHelper from '../QuestionHelper'
import { AutoRow, RowBetween, RowFixed } from '../Row'
import FormattedPriceImpact from './FormattedPriceImpact'
import { StyledBalanceMaxMini, SwapCallbackError } from './styleds'
import { W3TokenAmount, W3Trade, W3TradeType } from '../../polywrap/types'
import Decimal from 'decimal.js'
import { toSignificant } from '../../polywrap/utils'
import { PolywrapClient } from '@polywrap/client-js'
import { usePolywrapClient } from '@polywrap/react'

export default function SwapModalFooter({
  trade,
  onConfirm,
  allowedSlippage,
  swapErrorMessage,
  disabledConfirm
}: {
  trade: W3Trade
  allowedSlippage: number
  onConfirm: () => void
  swapErrorMessage: string | undefined
  disabledConfirm: boolean
}) {
  const [showInverted, setShowInverted] = useState<boolean>(false)
  const theme = useContext(ThemeContext)

  // get polywrap client
  const client: PolywrapClient = usePolywrapClient()

  const [slippageAdjustedAmounts, setSlippageAdjustedAmounts] = useState<
    { [field in Field]?: W3TokenAmount } | undefined
  >(undefined)
  const [priceImpactWithoutFee, setPriceImpactWithoutFee] = useState<Decimal | undefined>(undefined)
  const [realizedLPFee, setRealizedLPFee] = useState<W3TokenAmount | undefined>(undefined)
  const [formattedExecutionPrice, setFormattedExecutionPrice] = useState<string>('')
  useEffect(() => {
    const updateStateAsync = async () => {
      const slippageAdjustedAmounts = await w3ComputeSlippageAdjustedAmounts(client, trade, allowedSlippage)
      const { priceImpactWithoutFee, realizedLPFee } = await w3computeTradePriceBreakdown(client, trade)
      const formattedExecutionPrice = await w3formatExecutionPrice(client, trade, showInverted)
      setSlippageAdjustedAmounts(slippageAdjustedAmounts)
      setPriceImpactWithoutFee(priceImpactWithoutFee)
      setRealizedLPFee(realizedLPFee ?? undefined)
      setFormattedExecutionPrice(formattedExecutionPrice)
    }
    updateStateAsync()
  }, [trade, allowedSlippage, showInverted])

  const severity = warningSeverity(priceImpactWithoutFee)

  return (
    <>
      <AutoColumn gap="0px">
        <RowBetween align="center">
          <Text fontWeight={400} fontSize={14} color={theme.text2}>
            Price
          </Text>
          <Text
            fontWeight={500}
            fontSize={14}
            color={theme.text1}
            style={{
              justifyContent: 'center',
              alignItems: 'center',
              display: 'flex',
              textAlign: 'right',
              paddingLeft: '10px'
            }}
          >
            {formattedExecutionPrice}
            <StyledBalanceMaxMini onClick={() => setShowInverted(!showInverted)}>
              <Repeat size={14} />
            </StyledBalanceMaxMini>
          </Text>
        </RowBetween>

        <RowBetween>
          <RowFixed>
            <TYPE.black fontSize={14} fontWeight={400} color={theme.text2}>
              {trade.tradeType === W3TradeType.EXACT_INPUT ? 'Minimum received' : 'Maximum sold'}
            </TYPE.black>
            <QuestionHelper text="Your transaction will revert if there is a large, unfavorable price movement before it is confirmed." />
          </RowFixed>
          <RowFixed>
            <TYPE.black fontSize={14}>
              {trade.tradeType === W3TradeType.EXACT_INPUT
                ? toSignificant(slippageAdjustedAmounts?.[Field.OUTPUT], 4) ?? '-'
                : toSignificant(slippageAdjustedAmounts?.[Field.INPUT], 4) ?? '-'}
            </TYPE.black>
            <TYPE.black fontSize={14} marginLeft={'4px'}>
              {trade.tradeType === W3TradeType.EXACT_INPUT
                ? trade.outputAmount.token.currency.symbol
                : trade.inputAmount.token.currency.symbol}
            </TYPE.black>
          </RowFixed>
        </RowBetween>
        <RowBetween>
          <RowFixed>
            <TYPE.black color={theme.text2} fontSize={14} fontWeight={400}>
              Price Impact
            </TYPE.black>
            <QuestionHelper text="The difference between the market price and your price due to trade size." />
          </RowFixed>
          <FormattedPriceImpact priceImpact={priceImpactWithoutFee} />
        </RowBetween>
        <RowBetween>
          <RowFixed>
            <TYPE.black fontSize={14} fontWeight={400} color={theme.text2}>
              Liquidity Provider Fee
            </TYPE.black>
            <QuestionHelper text="A portion of each trade (0.30%) goes to liquidity providers as a protocol incentive." />
          </RowFixed>
          <TYPE.black fontSize={14}>
            {realizedLPFee ? toSignificant(realizedLPFee, 6) + ' ' + trade.inputAmount.token.currency.symbol : '-'}
          </TYPE.black>
        </RowBetween>
      </AutoColumn>

      <AutoRow>
        <ButtonError
          onClick={onConfirm}
          disabled={disabledConfirm}
          error={severity > 2}
          style={{ margin: '10px 0 0 0' }}
          id="confirm-swap-or-send"
        >
          <Text fontSize={20} fontWeight={500}>
            {severity > 2 ? 'Swap Anyway' : 'Confirm Swap'}
          </Text>
        </ButtonError>

        {swapErrorMessage ? <SwapCallbackError error={swapErrorMessage} /> : null}
      </AutoRow>
    </>
  )
}
