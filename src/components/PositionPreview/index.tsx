import { Trans } from '@lingui/macro'
import { Currency as UniCurrency, Price as UniPrice, Token as UniToken } from '@uniswap/sdk-core'
import RangeBadge from 'components/Badge/RangeBadge'
import { LightCard } from 'components/Card'
import { AutoColumn } from 'components/Column'
import CurrencyLogo from 'components/CurrencyLogo'
import DoubleCurrencyLogo from 'components/DoubleLogo'
import { Break } from 'components/earn/styled'
import RateToggle from 'components/RateToggle'
import { RowBetween, RowFixed } from 'components/Row'
import JSBI from 'jsbi'
import { ReactNode, useCallback, useContext, useEffect, useState } from 'react'
import { Bound } from 'state/mint/v3/actions'
import { ThemeContext } from 'styled-components/macro'
import { ThemedText } from 'theme'
import { formatTickPrice } from 'utils/formatTickPrice'
import { unwrappedToken } from 'utils/unwrappedToken'

import { PolywrapDapp, Position, Price, TokenAmount } from '../../polywrap'
import {
  reverseMapFeeAmount,
  reverseMapPrice,
  reverseMapToken,
  toSignificant,
  usePolywrapDapp,
} from '../../polywrap-utils'

export const PositionPreview = ({
  position,
  title,
  inRange,
  baseCurrencyDefault,
  ticksAtLimit,
}: {
  position: Position
  title?: ReactNode
  inRange: boolean
  baseCurrencyDefault?: UniCurrency | undefined
  ticksAtLimit: { [bound: string]: boolean | undefined }
}) => {
  const theme = useContext(ThemeContext)

  const currency0 = unwrappedToken(reverseMapToken(position.pool.token0) as UniCurrency)
  const currency1 = unwrappedToken(reverseMapToken(position.pool.token1) as UniCurrency)

  // track which currency should be base
  const [baseCurrency, setBaseCurrency] = useState(
    baseCurrencyDefault
      ? baseCurrencyDefault === currency0
        ? currency0
        : baseCurrencyDefault === currency1
        ? currency1
        : currency0
      : currency0
  )

  const sorted = baseCurrency === currency0
  const quoteCurrency = sorted ? currency1 : currency0

  const dapp: PolywrapDapp = usePolywrapDapp()
  const [price, setPrice] = useState<UniPrice<UniCurrency, UniCurrency>>(
    new UniPrice(baseCurrency, quoteCurrency, 0, 0)
  )
  const [priceLower, setPriceLower] = useState<UniPrice<UniCurrency, UniCurrency>>(
    new UniPrice(baseCurrency, quoteCurrency, 0, 0)
  )
  const [priceUpper, setPriceUpper] = useState<UniPrice<UniCurrency, UniCurrency>>(
    new UniPrice(baseCurrency, quoteCurrency, 0, 0)
  )
  const [amount0, setAmount0] = useState<TokenAmount>({ token: position.pool.token0, amount: '0' })
  const [amount1, setAmount1] = useState<TokenAmount>({ token: position.pool.token1, amount: '0' })

  useEffect(() => {
    const updateAsync = async () => {
      const tokenToPrice = sorted ? position.pool.token0 : position.pool.token1
      const price: Price = await dapp.uniswap.query.poolPriceOf({ pool: position.pool, token: tokenToPrice })
      const token0PriceLower: Price = await dapp.uniswap.query.positionToken0PriceLower({ position })
      const token0PriceUpper: Price = await dapp.uniswap.query.positionToken0PriceUpper({ position })
      const priceLower = sorted ? reverseMapPrice(token0PriceLower) : reverseMapPrice(token0PriceUpper).invert()
      const priceUpper = sorted ? reverseMapPrice(token0PriceUpper) : reverseMapPrice(token0PriceLower).invert()
      const amount0 = await dapp.uniswap.query.positionAmount0({ position })
      const amount1 = await dapp.uniswap.query.positionAmount1({ position })
      setPrice(reverseMapPrice(price))
      setPriceLower(priceLower)
      setPriceUpper(priceUpper)
      setAmount0(amount0)
      setAmount1(amount1)
    }
    void updateAsync()
  }, [sorted, position, dapp])

  const handleRateChange = useCallback(() => {
    setBaseCurrency(quoteCurrency)
  }, [quoteCurrency])

  const removed = JSBI.equal(JSBI.BigInt(position.liquidity), JSBI.BigInt(0))

  return (
    <AutoColumn gap="md" style={{ marginTop: '0.5rem' }}>
      <RowBetween style={{ marginBottom: '0.5rem' }}>
        <RowFixed>
          <DoubleCurrencyLogo
            currency0={currency0 ?? undefined}
            currency1={currency1 ?? undefined}
            size={24}
            margin={true}
          />
          <ThemedText.Label ml="10px" fontSize="24px">
            {currency0?.symbol} / {currency1?.symbol}
          </ThemedText.Label>
        </RowFixed>
        <RangeBadge removed={removed} inRange={inRange} />
      </RowBetween>

      <LightCard>
        <AutoColumn gap="md">
          <RowBetween>
            <RowFixed>
              <CurrencyLogo currency={currency0} />
              <ThemedText.Label ml="8px">{currency0?.symbol}</ThemedText.Label>
            </RowFixed>
            <RowFixed>
              <ThemedText.Label mr="8px">{toSignificant(amount0, 4)}</ThemedText.Label>
            </RowFixed>
          </RowBetween>
          <RowBetween>
            <RowFixed>
              <CurrencyLogo currency={currency1} />
              <ThemedText.Label ml="8px">{currency1?.symbol}</ThemedText.Label>
            </RowFixed>
            <RowFixed>
              <ThemedText.Label mr="8px">{toSignificant(amount1, 4)}</ThemedText.Label>
            </RowFixed>
          </RowBetween>
          <Break />
          <RowBetween>
            <ThemedText.Label>
              <Trans>Fee Tier</Trans>
            </ThemedText.Label>
            <ThemedText.Label>
              <Trans>{reverseMapFeeAmount(position.pool.fee) / 10000}%</Trans>
            </ThemedText.Label>
          </RowBetween>
        </AutoColumn>
      </LightCard>

      <AutoColumn gap="md">
        <RowBetween>
          {title ? <ThemedText.Main>{title}</ThemedText.Main> : <div />}
          <RateToggle
            currencyA={sorted ? currency0 : currency1}
            currencyB={sorted ? currency1 : currency0}
            handleRateToggle={handleRateChange}
          />
        </RowBetween>

        <RowBetween>
          <LightCard width="48%" padding="8px">
            <AutoColumn gap="4px" justify="center">
              <ThemedText.Main fontSize="12px">
                <Trans>Min Price</Trans>
              </ThemedText.Main>
              <ThemedText.MediumHeader textAlign="center">{`${formatTickPrice(
                priceLower as UniPrice<UniToken, UniToken>,
                ticksAtLimit,
                Bound.LOWER
              )}`}</ThemedText.MediumHeader>
              <ThemedText.Main textAlign="center" fontSize="12px">
                <Trans>
                  {quoteCurrency.symbol} per {baseCurrency.symbol}
                </Trans>
              </ThemedText.Main>
              <ThemedText.Small textAlign="center" color={theme.text3} style={{ marginTop: '4px' }}>
                <Trans>Your position will be 100% composed of {baseCurrency?.symbol} at this price</Trans>
              </ThemedText.Small>
            </AutoColumn>
          </LightCard>

          <LightCard width="48%" padding="8px">
            <AutoColumn gap="4px" justify="center">
              <ThemedText.Main fontSize="12px">
                <Trans>Max Price</Trans>
              </ThemedText.Main>
              <ThemedText.MediumHeader textAlign="center">{`${formatTickPrice(
                priceUpper as UniPrice<UniToken, UniToken>,
                ticksAtLimit,
                Bound.UPPER
              )}`}</ThemedText.MediumHeader>
              <ThemedText.Main textAlign="center" fontSize="12px">
                <Trans>
                  {quoteCurrency.symbol} per {baseCurrency.symbol}
                </Trans>
              </ThemedText.Main>
              <ThemedText.Small textAlign="center" color={theme.text3} style={{ marginTop: '4px' }}>
                <Trans>Your position will be 100% composed of {quoteCurrency?.symbol} at this price</Trans>
              </ThemedText.Small>
            </AutoColumn>
          </LightCard>
        </RowBetween>
        <LightCard padding="12px ">
          <AutoColumn gap="4px" justify="center">
            <ThemedText.Main fontSize="12px">
              <Trans>Current price</Trans>
            </ThemedText.Main>
            <ThemedText.MediumHeader>{`${price.toSignificant(5)} `}</ThemedText.MediumHeader>
            <ThemedText.Main textAlign="center" fontSize="12px">
              <Trans>
                {quoteCurrency.symbol} per {baseCurrency.symbol}
              </Trans>
            </ThemedText.Main>
          </AutoColumn>
        </LightCard>
      </AutoColumn>
    </AutoColumn>
  )
}
