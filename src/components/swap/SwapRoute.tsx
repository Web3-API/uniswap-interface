import { Trans } from '@lingui/macro'
import { Protocol } from '@uniswap/router-sdk'
import { Currency, CurrencyAmount, Percent } from '@uniswap/sdk-core'
import { useWeb3React } from '@web3-react/core'
import { ElementName, Event, EventName } from 'components/AmplitudeAnalytics/constants'
import { TraceEvent } from 'components/AmplitudeAnalytics/TraceEvent'
import AnimatedDropdown from 'components/AnimatedDropdown'
import { AutoColumn } from 'components/Column'
import { LoadingRows } from 'components/Loader/styled'
import RoutingDiagram from 'components/RoutingDiagram/RoutingDiagram'
import { AutoRow, RowBetween } from 'components/Row'
import { SUPPORTED_GAS_ESTIMATE_CHAIN_IDS } from 'constants/chains'
import useAutoRouterSupported from 'hooks/useAutoRouterSupported'
import { memo, useState } from 'react'
import { Plus } from 'react-feather'
import { useDarkModeManager } from 'state/user/hooks'
import styled from 'styled-components/macro'
import { Separator, ThemedText } from 'theme'

import { reverseMapToken, reverseMapTokenAmount } from '../../polywrap-utils'
import { ExtendedTrade } from '../../polywrap-utils/interfaces'
import { Uni_FeeAmountEnum as FeeAmountEnum, Uni_FeeAmountEnum, Uni_TradeTypeEnum as TradeTypeEnum } from '../../wrap'
import { AutoRouterLabel, AutoRouterLogo } from './RouterLabel'

const Wrapper = styled(AutoColumn)<{ darkMode?: boolean; fixedOpen?: boolean }>`
  padding: ${({ fixedOpen }) => (fixedOpen ? '12px' : '12px 8px 12px 12px')};
  border-radius: 16px;
  border: 1px solid ${({ theme, fixedOpen }) => (fixedOpen ? 'transparent' : theme.deprecated_bg2)};
  cursor: pointer;
`

const OpenCloseIcon = styled(Plus)<{ open?: boolean }>`
  margin-left: 8px;
  height: 20px;
  stroke-width: 2px;
  transition: transform 0.1s;
  transform: ${({ open }) => (open ? 'rotate(45deg)' : 'none')};
  stroke: ${({ theme }) => theme.deprecated_text3};
  cursor: pointer;
  :hover {
    opacity: 0.8;
  }
`

interface SwapRouteProps extends React.HTMLAttributes<HTMLDivElement> {
  trade: ExtendedTrade
  syncing: boolean
  fixedOpen?: boolean // fixed in open state, hide open/close icon
}

export default memo(function SwapRoute({ trade, syncing, fixedOpen = false, ...rest }: SwapRouteProps) {
  const autoRouterSupported = useAutoRouterSupported()
  const routes = getTokenPath(trade)
  const [open, setOpen] = useState(false)
  const { chainId } = useWeb3React()

  const [darkMode] = useDarkModeManager()

  const formattedGasPriceString = trade?.gasUseEstimateUSD
    ? trade.gasUseEstimateUSD.toFixed(2) === '0.00'
      ? '<$0.01'
      : '$' + trade.gasUseEstimateUSD.toFixed(2)
    : undefined

  return (
    <Wrapper {...rest} darkMode={darkMode} fixedOpen={fixedOpen}>
      <TraceEvent
        events={[Event.onClick]}
        name={EventName.SWAP_AUTOROUTER_VISUALIZATION_EXPANDED}
        element={ElementName.AUTOROUTER_VISUALIZATION_ROW}
        shouldLogImpression={!open}
      >
        <RowBetween onClick={() => setOpen(!open)}>
          <AutoRow gap="4px" width="auto">
            <AutoRouterLogo />
            <AutoRouterLabel />
          </AutoRow>
          {fixedOpen ? null : <OpenCloseIcon open={open} />}
        </RowBetween>
      </TraceEvent>
      <AnimatedDropdown open={open || fixedOpen}>
        <AutoRow gap="4px" width="auto" style={{ paddingTop: '12px', margin: 0 }}>
          {syncing ? (
            <LoadingRows>
              <div style={{ width: '400px', height: '30px' }} />
            </LoadingRows>
          ) : (
            <RoutingDiagram
              currencyIn={reverseMapToken(trade.inputAmount.token) as Currency}
              currencyOut={reverseMapToken(trade.outputAmount.token) as Currency}
              routes={routes}
            />
          )}

          {autoRouterSupported && (
            <>
              <Separator />
              {syncing ? (
                <LoadingRows>
                  <div style={{ width: '250px', height: '15px' }} />
                </LoadingRows>
              ) : (
                <ThemedText.DeprecatedMain fontSize={12} width={400} margin={0}>
                  {trade?.gasUseEstimateUSD && chainId && SUPPORTED_GAS_ESTIMATE_CHAIN_IDS.includes(chainId) ? (
                    <Trans>Best price route costs ~{formattedGasPriceString} in gas. </Trans>
                  ) : null}{' '}
                  <Trans>
                    This route optimizes your total output by considering split routes, multiple hops, and the gas cost
                    of each step.
                  </Trans>
                </ThemedText.DeprecatedMain>
              )}
            </>
          )}
        </AutoRow>
      </AnimatedDropdown>
    </Wrapper>
  )
})

export interface RoutingDiagramEntry {
  percent: Percent
  path: [Currency, Currency, Uni_FeeAmountEnum][]
  protocol: Protocol
}

/**
 * Loops through all routes on a trade and returns an array of diagram entries.
 */
export function getTokenPath(trade: ExtendedTrade): RoutingDiagramEntry[] {
  return trade.swaps.map(({ route: { path: tokenPath, pools }, inputAmount, outputAmount }) => {
    let portion
    if (trade.tradeType === TradeTypeEnum.EXACT_INPUT) {
      const uniInputAmount = reverseMapTokenAmount(inputAmount) as CurrencyAmount<Currency>
      const uniTradeInputAmount = reverseMapTokenAmount(trade.inputAmount) as CurrencyAmount<Currency>
      portion = uniInputAmount.divide(uniTradeInputAmount)
    } else {
      const uniOutputAmount = reverseMapTokenAmount(outputAmount) as CurrencyAmount<Currency>
      const uniTradeOutputAmount = reverseMapTokenAmount(trade.outputAmount) as CurrencyAmount<Currency>
      portion = uniOutputAmount.divide(uniTradeOutputAmount)
    }

    const percent = new Percent(portion.numerator, portion.denominator)
    const path: RoutingDiagramEntry['path'] = []
    for (let i = 0; i < pools.length; i++) {
      const nextPool = pools[i]
      const tokenIn = tokenPath[i]
      const tokenOut = tokenPath[i + 1]
      const entry: RoutingDiagramEntry['path'][0] = [
        reverseMapToken(tokenIn) as Currency,
        reverseMapToken(tokenOut) as Currency,
        nextPool.fee as FeeAmountEnum,
      ]
      path.push(entry)
    }
    return {
      percent,
      path,
      protocol: Protocol.V3,
    }
  })
}
