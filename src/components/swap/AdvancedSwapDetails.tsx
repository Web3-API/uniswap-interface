import { Trans } from '@lingui/macro'
import { PolywrapClient } from '@polywrap/client-js'
import { usePolywrapClient } from '@polywrap/react'
import { Percent } from '@uniswap/sdk-core'
import Card from 'components/Card'
import { LoadingRows } from 'components/Loader/styled'
import { useActiveWeb3React } from 'hooks/web3'
import { useContext, useEffect, useMemo, useRef, useState } from 'react'
import styled, { ThemeContext } from 'styled-components/macro'

import { toSignificant } from '../../polywrap-utils'
import { ExtendedTrade } from '../../polywrap-utils/interfaces'
import { CancelablePromise, makeCancelable } from '../../polywrap-utils/makeCancelable'
import { Separator, ThemedText } from '../../theme'
import { computeRealizedLPFeePercent } from '../../utils/prices'
import { Uni_Module, Uni_TokenAmount, Uni_Trade, Uni_TradeTypeEnum as TradeTypeEnum } from '../../wrap'
import { AutoColumn } from '../Column'
import { RowBetween, RowFixed } from '../Row'
import FormattedPriceImpact from './FormattedPriceImpact'
import { SUPPORTED_GAS_ESTIMATE_CHAIN_IDS } from './GasEstimateBadge'

const StyledCard = styled(Card)`
  padding: 0;
`

interface AdvancedSwapDetailsProps {
  trade?: ExtendedTrade
  allowedSlippage: Percent
  syncing?: boolean
  hideRouteDiagram?: boolean
}

function TextWithLoadingPlaceholder({
  syncing,
  width,
  children,
}: {
  syncing: boolean
  width: number
  children: JSX.Element
}) {
  return syncing ? (
    <LoadingRows>
      <div style={{ height: '15px', width: `${width}px` }} />
    </LoadingRows>
  ) : (
    children
  )
}

const asyncAmounts = async (
  client: PolywrapClient,
  allowedSlippage: Percent,
  trade: Uni_Trade
): Promise<{ minAmountOut?: Uni_TokenAmount; maxAmountIn?: Uni_TokenAmount }> => {
  return {
    minAmountOut: await Uni_Module.tradeMinimumAmountOut(
      {
        slippageTolerance: allowedSlippage.toFixed(18),
        amountOut: trade.outputAmount,
        tradeType: trade.tradeType,
      },
      client
    ).then((res) => {
      if (!res.ok) {
        console.error(res.error)
        return undefined
      }
      return res.value
    }),
    maxAmountIn: await Uni_Module.tradeMaximumAmountIn(
      {
        slippageTolerance: allowedSlippage.toFixed(18),
        amountIn: trade.inputAmount,
        tradeType: trade.tradeType,
      },
      client
    ).then((res) => {
      if (!res.ok) {
        console.error(res.error)
        return undefined
      }
      return res.value
    }),
  }
}

export function AdvancedSwapDetails({ trade, allowedSlippage, syncing = false }: AdvancedSwapDetailsProps) {
  const theme = useContext(ThemeContext)
  const { chainId } = useActiveWeb3React()

  const { expectedOutputAmount, priceImpact } = useMemo(() => {
    if (!trade) return { expectedOutputAmount: undefined, priceImpact: undefined }
    const expectedOutputAmount = trade.outputAmount
    const realizedLpFeePercent = computeRealizedLPFeePercent(trade)
    const priceImpact = new Percent(trade.priceImpact.numerator, trade.priceImpact.denominator).subtract(
      realizedLpFeePercent
    )
    return { expectedOutputAmount, priceImpact }
  }, [trade])

  const client: PolywrapClient = usePolywrapClient()

  const [amounts, setAmounts] = useState<{ minAmountOut?: Uni_TokenAmount; maxAmountIn?: Uni_TokenAmount }>({})
  const cancelable =
    useRef<CancelablePromise<{ minAmountOut?: Uni_TokenAmount; maxAmountIn?: Uni_TokenAmount } | undefined>>()
  useEffect(() => {
    if (trade) {
      cancelable.current?.cancel()
      cancelable.current = makeCancelable(asyncAmounts(client, allowedSlippage, trade))
      cancelable.current?.promise.then((res) => {
        if (!res) return
        setAmounts(res)
      })
    }
    return () => cancelable.current?.cancel()
  }, [allowedSlippage, trade, client])
  const { minAmountOut, maxAmountIn } = amounts

  return !trade ? null : (
    <StyledCard>
      <AutoColumn gap="8px">
        <RowBetween>
          <RowFixed>
            <ThemedText.SubHeader color={theme.text1}>
              <Trans>Expected Output</Trans>
            </ThemedText.SubHeader>
          </RowFixed>
          <TextWithLoadingPlaceholder syncing={syncing} width={65}>
            <ThemedText.Black textAlign="right" fontSize={14}>
              {expectedOutputAmount
                ? `${toSignificant(expectedOutputAmount, 6)}  ${expectedOutputAmount.token.currency.symbol}`
                : '-'}
            </ThemedText.Black>
          </TextWithLoadingPlaceholder>
        </RowBetween>
        <RowBetween>
          <RowFixed>
            <ThemedText.SubHeader color={theme.text1}>
              <Trans>Price Impact</Trans>
            </ThemedText.SubHeader>
          </RowFixed>
          <TextWithLoadingPlaceholder syncing={syncing} width={50}>
            <ThemedText.Black textAlign="right" fontSize={14}>
              <FormattedPriceImpact priceImpact={priceImpact} />
            </ThemedText.Black>
          </TextWithLoadingPlaceholder>
        </RowBetween>
        <Separator />
        <RowBetween>
          <RowFixed style={{ marginRight: '20px' }}>
            <ThemedText.SubHeader color={theme.text3}>
              {trade.tradeType === TradeTypeEnum.EXACT_INPUT ? (
                <Trans>Minimum received</Trans>
              ) : (
                <Trans>Maximum sent</Trans>
              )}{' '}
              <Trans>after slippage</Trans> ({allowedSlippage.toFixed(2)}%)
            </ThemedText.SubHeader>
          </RowFixed>
          <TextWithLoadingPlaceholder syncing={syncing} width={70}>
            <ThemedText.Black textAlign="right" fontSize={14} color={theme.text3}>
              {trade.tradeType === TradeTypeEnum.EXACT_INPUT
                ? `${minAmountOut && toSignificant(minAmountOut, 6)} ${trade.outputAmount.token.currency.symbol}`
                : `${maxAmountIn && toSignificant(maxAmountIn, 6)} ${trade.inputAmount.token.currency.symbol}`}
            </ThemedText.Black>
          </TextWithLoadingPlaceholder>
        </RowBetween>
        {!trade?.gasUseEstimateUSD || !chainId || !SUPPORTED_GAS_ESTIMATE_CHAIN_IDS.includes(chainId) ? null : (
          <RowBetween>
            <ThemedText.SubHeader color={theme.text3}>
              <Trans>Network Fee</Trans>
            </ThemedText.SubHeader>
            <TextWithLoadingPlaceholder syncing={syncing} width={50}>
              <ThemedText.Black textAlign="right" fontSize={14} color={theme.text3}>
                ~${trade.gasUseEstimateUSD.toFixed(2)}
              </ThemedText.Black>
            </TextWithLoadingPlaceholder>
          </RowBetween>
        )}
      </AutoColumn>
    </StyledCard>
  )
}
