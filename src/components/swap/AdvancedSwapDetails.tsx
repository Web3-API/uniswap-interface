import React, { useContext, useEffect, useState } from 'react'
import styled, { ThemeContext } from 'styled-components'
import { Field } from '../../state/swap/actions'
import { useUserSlippageTolerance } from '../../state/user/hooks'
import { ExternalLink, TYPE } from '../../theme'
import { w3ComputeSlippageAdjustedAmounts, w3computeTradePriceBreakdown } from '../../utils/prices'
import { AutoColumn } from '../Column'
import QuestionHelper from '../QuestionHelper'
import { RowBetween, RowFixed } from '../Row'
import FormattedPriceImpact from './FormattedPriceImpact'
import SwapRoute from './SwapRoute'
import { W3TokenAmount, W3Trade, W3TradeType } from '../../polywrap/types'
import Decimal from 'decimal.js'
import { toSignificant } from '../../polywrap/utils'
import { PolywrapClient } from '@polywrap/client-js'
import { usePolywrapClient, usePolywrapInvoke } from '@polywrap/react'
import { ipfsUri } from '../../polywrap/constants'

const InfoLink = styled(ExternalLink)`
  display: none;
  width: 100%;
  border: 1px solid ${({ theme }) => theme.bg3};
  padding: 6px 6px;
  border-radius: 8px;
  text-align: center;
  font-size: 14px;
  color: ${({ theme }) => theme.text1};
`

function TradeSummary({ trade, allowedSlippage }: { trade: W3Trade; allowedSlippage: number }) {
  const theme = useContext(ThemeContext)

  // get polywrap client
  const client: PolywrapClient = usePolywrapClient()

  const [slippageAdjustedAmounts, setSlippageAdjustedAmounts] = useState<
    { [field in Field]?: W3TokenAmount } | undefined
  >(undefined)
  const [priceImpactWithoutFee, setPriceImpactWithoutFee] = useState<Decimal | undefined>(undefined)
  const [realizedLPFee, setRealizedLPFee] = useState<W3TokenAmount | undefined>(undefined)
  useEffect(() => {
    const updateStateAsync = async () => {
      const slippageAdjustedAmounts = await w3ComputeSlippageAdjustedAmounts(client, trade, allowedSlippage)
      const { priceImpactWithoutFee, realizedLPFee } = await w3computeTradePriceBreakdown(client, trade)
      setSlippageAdjustedAmounts(slippageAdjustedAmounts)
      setPriceImpactWithoutFee(priceImpactWithoutFee)
      setRealizedLPFee(realizedLPFee ?? undefined)
    }
    updateStateAsync()
  }, [trade, allowedSlippage])

  const isExactIn = trade.tradeType === W3TradeType.EXACT_INPUT

  return (
    <>
      <AutoColumn style={{ padding: '0 16px' }}>
        <RowBetween>
          <RowFixed>
            <TYPE.black fontSize={14} fontWeight={400} color={theme.text2}>
              {isExactIn ? 'Minimum received' : 'Maximum sold'}
            </TYPE.black>
            <QuestionHelper text="Your transaction will revert if there is a large, unfavorable price movement before it is confirmed." />
          </RowFixed>
          <RowFixed>
            <TYPE.black color={theme.text1} fontSize={14}>
              {isExactIn
                ? `${toSignificant(slippageAdjustedAmounts?.[Field.OUTPUT], 4)} ${
                    trade.outputAmount.token.currency.symbol
                  }` ?? '-'
                : `${toSignificant(slippageAdjustedAmounts?.[Field.INPUT], 4)} ${
                    trade.inputAmount.token.currency.symbol
                  }` ?? '-'}
            </TYPE.black>
          </RowFixed>
        </RowBetween>
        <RowBetween>
          <RowFixed>
            <TYPE.black fontSize={14} fontWeight={400} color={theme.text2}>
              Price Impact
            </TYPE.black>
            <QuestionHelper text="The difference between the market price and estimated price due to trade size." />
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
          <TYPE.black fontSize={14} color={theme.text1}>
            {realizedLPFee ? `${toSignificant(realizedLPFee, 4)} ${trade.inputAmount.token.currency.symbol}` : '-'}
          </TYPE.black>
        </RowBetween>
      </AutoColumn>
    </>
  )
}

export interface AdvancedSwapDetailsProps {
  trade?: W3Trade
}

export function AdvancedSwapDetails({ trade }: AdvancedSwapDetailsProps) {
  const theme = useContext(ThemeContext)

  const [allowedSlippage] = useUserSlippageTolerance()

  const pair =
    trade?.tradeType === W3TradeType.EXACT_INPUT
      ? trade?.route.pairs[0]
      : trade?.route.pairs[trade?.route.pairs.length - 1]
  const pairAddressQuery = usePolywrapInvoke<string>({
    uri: ipfsUri,
    method: 'pairAddress',
    args: {
      token0: pair?.tokenAmount0.token,
      token1: pair?.tokenAmount1.token
    }
  })

  const [pairAddress, setPairAddress] = useState<string | undefined>(undefined)
  useEffect(() => {
    pairAddressQuery.execute().then(pairAddressExec => {
      setPairAddress(pairAddressExec.ok ? pairAddressExec.value : undefined)
    })
  }, [pair])

  const showRoute = Boolean(trade && trade.route.path.length > 2)

  return (
    <div style={{ display: 'none' }}>
      <AutoColumn gap="0px">
        {trade && (
          <>
            <TradeSummary trade={trade} allowedSlippage={allowedSlippage} />
            {showRoute && (
              <>
                <RowBetween style={{ padding: '0 16px' }}>
                  <span style={{ display: 'flex', alignItems: 'center' }}>
                    <TYPE.black fontSize={14} fontWeight={400} color={theme.text2}>
                      Route
                    </TYPE.black>
                    <QuestionHelper text="Routing through these tokens resulted in the best price for your trade." />
                  </span>
                  <SwapRoute trade={trade} />
                </RowBetween>
              </>
            )}
            {!showRoute && (
              <AutoColumn style={{ padding: '12px 16px 0 16px' }}>
                <InfoLink href={'https://info.uniswap.org/pair/' + pairAddress} target="_blank">
                  View pair analytics ↗
                </InfoLink>
              </AutoColumn>
            )}
          </>
        )}
      </AutoColumn>
    </div>
  )
}
