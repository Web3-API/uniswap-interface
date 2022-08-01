import { Currency, CurrencyAmount, Fraction, Percent } from '@uniswap/sdk-core'

import {
  ALLOWED_PRICE_IMPACT_HIGH,
  ALLOWED_PRICE_IMPACT_LOW,
  ALLOWED_PRICE_IMPACT_MEDIUM,
  BLOCKED_PRICE_IMPACT_NON_EXPERT,
  ONE_HUNDRED_PERCENT,
  ZERO_PERCENT,
} from '../constants/misc'
import { reverseMapFeeAmount, reverseMapToken, reverseMapTokenAmount } from '../polywrap-utils'
import { Uni_Trade } from '../wrap'

// const THIRTY_BIPS_FEE = new Percent(JSBI.BigInt(30), JSBI.BigInt(10000))
// const INPUT_FRACTION_AFTER_FEE = ONE_HUNDRED_PERCENT.subtract(THIRTY_BIPS_FEE)

export function computeRealizedPriceImpact(trade: Uni_Trade): Percent {
  const realizedLpFeePercent = computeRealizedLPFeePercent(trade)
  return new Percent(trade.priceImpact.numerator, trade.priceImpact.denominator).subtract(realizedLpFeePercent)
}

export function getPriceImpactWarning(priceImpact?: Percent): 'warning' | 'error' | undefined {
  if (priceImpact?.greaterThan(ALLOWED_PRICE_IMPACT_HIGH)) return 'error'
  if (priceImpact?.greaterThan(ALLOWED_PRICE_IMPACT_MEDIUM)) return 'warning'
  return
}

// computes realized lp fee as a percent
export function computeRealizedLPFeePercent(trade: Uni_Trade): Percent {
  let percent: Percent = ZERO_PERCENT
  const tradeInputAmount = reverseMapTokenAmount(trade.inputAmount) as CurrencyAmount<Currency>
  for (const swap of trade.swaps) {
    const swapInputAmount = reverseMapTokenAmount(swap.inputAmount) as CurrencyAmount<Currency>
    const { numerator, denominator } = swapInputAmount.divide(tradeInputAmount)
    const overallPercent = new Percent(numerator, denominator)

    const routeRealizedLPFeePercent = overallPercent.multiply(
      ONE_HUNDRED_PERCENT.subtract(
        swap.route.pools.reduce<Percent>((currentFee: Percent, pool): Percent => {
          const fee = reverseMapFeeAmount(pool.fee)
          return currentFee.multiply(ONE_HUNDRED_PERCENT.subtract(new Fraction(fee, 1_000_000)))
        }, ONE_HUNDRED_PERCENT)
      )
    )

    percent = percent.add(routeRealizedLPFeePercent)
  }

  return new Percent(percent.numerator, percent.denominator)
}

// computes price breakdown for the trade
export function computeRealizedLPFeeAmount(trade?: Uni_Trade | null): CurrencyAmount<Currency> | undefined {
  if (trade) {
    const realizedLPFee = computeRealizedLPFeePercent(trade)

    const inputToken = reverseMapToken(trade.inputAmount.token) as Currency
    const inputAmount = reverseMapTokenAmount(trade.inputAmount) as CurrencyAmount<Currency>
    // the amount of the input that accrues to LPs
    return CurrencyAmount.fromRawAmount(inputToken, inputAmount.multiply(realizedLPFee).quotient)
  }

  return undefined
}

const IMPACT_TIERS = [
  BLOCKED_PRICE_IMPACT_NON_EXPERT,
  ALLOWED_PRICE_IMPACT_HIGH,
  ALLOWED_PRICE_IMPACT_MEDIUM,
  ALLOWED_PRICE_IMPACT_LOW,
]

type WarningSeverity = 0 | 1 | 2 | 3 | 4
export function warningSeverity(priceImpact: Percent | undefined): WarningSeverity {
  if (!priceImpact) return 4
  let impact: WarningSeverity = IMPACT_TIERS.length as WarningSeverity
  for (const impactLevel of IMPACT_TIERS) {
    if (impactLevel.lessThan(priceImpact)) return impact
    impact--
  }
  return 0
}
