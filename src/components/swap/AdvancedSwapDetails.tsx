import { Trans } from '@lingui/macro'
import { PolywrapClient } from '@polywrap/client-js'
import { usePolywrapClient } from '@polywrap/react'
import { Percent } from '@uniswap/sdk-core'
import { useWeb3React } from '@web3-react/core'
import Card from 'components/Card'
import { LoadingRows } from 'components/Loader/styled'
import { SUPPORTED_GAS_ESTIMATE_CHAIN_IDS } from 'constants/chains'
import useNativeCurrency from 'lib/hooks/useNativeCurrency'
import { useContext, useEffect, useMemo, useRef, useState } from 'react'
import styled, { ThemeContext } from 'styled-components/macro'

import { toSignificant } from '../../polywrap-utils'
import { ExtendedTrade } from '../../polywrap-utils/interfaces'
import { CancelablePromise, makeCancelable } from '../../polywrap-utils/makeCancelable'
import { Separator, ThemedText } from '../../theme'
import { computeRealizedPriceImpact } from '../../utils/prices'
import { Uni_Module, Uni_TokenAmount, Uni_Trade, Uni_TradeTypeEnum } from '../../wrap'
import { AutoColumn } from '../Column'
import { RowBetween, RowFixed } from '../Row'
import { MouseoverTooltip } from '../Tooltip'
import FormattedPriceImpact from './FormattedPriceImpact'

const StyledCard = styled(Card)`
  padding: 0;
`

interface AdvancedSwapDetailsProps {
  trade?: ExtendedTrade
  allowedSlippage: Percent
  syncing?: boolean
  hideInfoTooltips?: boolean
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
      if (res.error) console.error(res.error)
      return res.data
    }),
    maxAmountIn: await Uni_Module.tradeMaximumAmountIn(
      {
        slippageTolerance: allowedSlippage.toFixed(18),
        amountIn: trade.inputAmount,
        tradeType: trade.tradeType,
      },
      client
    ).then((res) => {
      if (res.error) console.error(res.error)
      return res.data
    }),
  }
}

export function AdvancedSwapDetails({
  trade,
  allowedSlippage,
  syncing = false,
  hideInfoTooltips = false,
}: AdvancedSwapDetailsProps) {
  const theme = useContext(ThemeContext)
  const { chainId } = useWeb3React()
  const nativeCurrency = useNativeCurrency()

  const { expectedOutputAmount, priceImpact } = useMemo(() => {
    return {
      expectedOutputAmount: trade?.outputAmount,
      priceImpact: trade ? computeRealizedPriceImpact(trade) : undefined,
    }
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
            <MouseoverTooltip
              text={
                <Trans>
                  The amount you expect to receive at the current market price. You may receive less or more if the
                  market price changes while your transaction is pending.
                </Trans>
              }
              disableHover={hideInfoTooltips}
            >
              <ThemedText.DeprecatedSubHeader color={theme.deprecated_text1}>
                <Trans>Expected Output</Trans>
              </ThemedText.DeprecatedSubHeader>
            </MouseoverTooltip>
          </RowFixed>
          <TextWithLoadingPlaceholder syncing={syncing} width={65}>
            <ThemedText.DeprecatedBlack textAlign="right" fontSize={14}>
              {expectedOutputAmount
                ? `${toSignificant(expectedOutputAmount, 6)}  ${expectedOutputAmount.token.currency.symbol}`
                : '-'}
            </ThemedText.DeprecatedBlack>
          </TextWithLoadingPlaceholder>
        </RowBetween>
        <RowBetween>
          <RowFixed>
            <MouseoverTooltip
              text={<Trans>The impact your trade has on the market price of this pool.</Trans>}
              disableHover={hideInfoTooltips}
            >
              <ThemedText.DeprecatedSubHeader color={theme.deprecated_text1}>
                <Trans>Price Impact</Trans>
              </ThemedText.DeprecatedSubHeader>
            </MouseoverTooltip>
          </RowFixed>
          <TextWithLoadingPlaceholder syncing={syncing} width={50}>
            <ThemedText.DeprecatedBlack textAlign="right" fontSize={14}>
              <FormattedPriceImpact priceImpact={priceImpact} />
            </ThemedText.DeprecatedBlack>
          </TextWithLoadingPlaceholder>
        </RowBetween>
        <Separator />
        <RowBetween>
          <RowFixed style={{ marginRight: '20px' }}>
            <MouseoverTooltip
              text={
                <Trans>
                  The minimum amount you are guaranteed to receive. If the price slips any further, your transaction
                  will revert.
                </Trans>
              }
              disableHover={hideInfoTooltips}
            >
              <ThemedText.DeprecatedSubHeader color={theme.deprecated_text3}>
                {trade.tradeType === Uni_TradeTypeEnum.EXACT_INPUT ? (
                  <Trans>Minimum received</Trans>
                ) : (
                  <Trans>Maximum sent</Trans>
                )}{' '}
                <Trans>after slippage</Trans> ({allowedSlippage.toFixed(2)}%)
              </ThemedText.DeprecatedSubHeader>
            </MouseoverTooltip>
          </RowFixed>
          <TextWithLoadingPlaceholder syncing={syncing} width={70}>
            <ThemedText.DeprecatedBlack textAlign="right" fontSize={14} color={theme.deprecated_text3}>
              {trade.tradeType === Uni_TradeTypeEnum.EXACT_INPUT
                ? `${minAmountOut && toSignificant(minAmountOut, 6)} ${trade.outputAmount.token.currency.symbol}`
                : `${maxAmountIn && toSignificant(maxAmountIn, 6)} ${trade.inputAmount.token.currency.symbol}`}
            </ThemedText.DeprecatedBlack>
          </TextWithLoadingPlaceholder>
        </RowBetween>
        {!trade?.gasUseEstimateUSD || !chainId || !SUPPORTED_GAS_ESTIMATE_CHAIN_IDS.includes(chainId) ? null : (
          <RowBetween>
            <MouseoverTooltip
              text={
                <Trans>
                  The fee paid to miners who process your transaction. This must be paid in {nativeCurrency.symbol}.
                </Trans>
              }
              disableHover={hideInfoTooltips}
            >
              <ThemedText.DeprecatedSubHeader color={theme.deprecated_text3}>
                <Trans>Network Fee</Trans>
              </ThemedText.DeprecatedSubHeader>
            </MouseoverTooltip>
            <TextWithLoadingPlaceholder syncing={syncing} width={50}>
              <ThemedText.DeprecatedBlack textAlign="right" fontSize={14} color={theme.deprecated_text3}>
                ~${trade.gasUseEstimateUSD.toFixed(2)}
              </ThemedText.DeprecatedBlack>
            </TextWithLoadingPlaceholder>
          </RowBetween>
        )}
      </AutoColumn>
    </StyledCard>
  )
}
