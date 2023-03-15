import Decimal from 'decimal.js'
import React from 'react'
import { useContext } from 'react'
import { Repeat } from 'react-feather'
import { Text } from 'rebass'
import { ThemeContext } from 'styled-components'
import { StyledBalanceMaxMini } from './styleds'
import { W3Token } from '../../polywrap/types'

interface TradePriceProps {
  price?: Decimal
  baseCurrency?: W3Token
  quoteCurrency?: W3Token
  showInverted: boolean
  setShowInverted: (showInverted: boolean) => void
}

export default function TradePrice({
  price,
  baseCurrency,
  quoteCurrency,
  showInverted,
  setShowInverted
}: TradePriceProps) {
  const theme = useContext(ThemeContext)

  const formattedPrice = showInverted
    ? price?.toSignificantDigits(6).toString()
    : price
    ? new Decimal(1)
        .div(price)
        .toSignificantDigits(6)
        .toString()
    : undefined

  const show = Boolean(baseCurrency && quoteCurrency)
  const label = showInverted
    ? `${quoteCurrency?.currency.symbol} per ${baseCurrency?.currency.symbol}`
    : `${baseCurrency?.currency.symbol} per ${quoteCurrency?.currency.symbol}`

  return (
    <Text
      fontWeight={500}
      fontSize={14}
      color={theme.text2}
      style={{ justifyContent: 'center', alignItems: 'center', display: 'flex' }}
    >
      {show ? (
        <>
          {formattedPrice ?? '-'} {label}
          <StyledBalanceMaxMini onClick={() => setShowInverted(!showInverted)}>
            <Repeat size={14} />
          </StyledBalanceMaxMini>
        </>
      ) : (
        '-'
      )}
    </Text>
  )
}
