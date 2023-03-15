import { W3_ZERO_PERCENT, W3_ONE_HUNDRED_PERCENT } from '../constants'
import { W3Trade } from '../polywrap/types'
import Decimal from 'decimal.js'
import { w3TradeExecutionPrice } from '../polywrap/tradeWrappers'
import { currencyEquals as w3currencyEquals } from '../polywrap/utils'
import { PolywrapClient } from '@polywrap/client-js'

export async function w3IsTradeBetter(
  client: PolywrapClient,
  tradeA: W3Trade | undefined | null,
  tradeB: W3Trade | undefined | null,
  minimumDelta: Decimal = W3_ZERO_PERCENT
): Promise<boolean | undefined> {
  if (tradeA && !tradeB) return false
  if (tradeB && !tradeA) return true
  if (!tradeA || !tradeB) return undefined

  if (
    tradeA.tradeType !== tradeB.tradeType ||
    !w3currencyEquals(tradeA.inputAmount.token.currency, tradeB.inputAmount.token.currency) ||
    !w3currencyEquals(tradeB.outputAmount.token.currency, tradeB.outputAmount.token.currency)
  ) {
    throw new Error('Trades are not comparable')
  }

  const executionPriceA: Decimal = await w3TradeExecutionPrice(client, tradeA)
  const executionPriceB: Decimal = await w3TradeExecutionPrice(client, tradeB)

  if (minimumDelta.equals(W3_ZERO_PERCENT)) {
    return executionPriceA.lessThan(executionPriceB)
  } else {
    return executionPriceA.mul(minimumDelta.add(W3_ONE_HUNDRED_PERCENT)).lessThan(executionPriceB)
  }
}
