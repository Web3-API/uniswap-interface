import { W3_MIN_ETH } from '../constants'
import { W3TokenAmount } from '../polywrap/types'
import { isEther } from '../polywrap/utils'
import Decimal from 'decimal.js'
import { ETHER } from '../polywrap/constants'

/**
 * Given some token amount, return the max that can be spent of it
 * @param currencyAmount to return max of
 */
export function maxAmountSpend(currencyAmount?: W3TokenAmount): W3TokenAmount | undefined {
  if (!currencyAmount) return undefined
  if (isEther(currencyAmount.token)) {
    const decimalAmount = new Decimal(currencyAmount.amount)
    if (decimalAmount.greaterThan(W3_MIN_ETH)) {
      return {
        token: {
          chainId: currencyAmount.token.chainId,
          address: '',
          currency: ETHER
        },
        amount: decimalAmount.sub(W3_MIN_ETH).toFixed(0)
      }
    } else {
      return {
        token: {
          chainId: currencyAmount.token.chainId,
          address: '',
          currency: ETHER
        },
        amount: '0'
      }
    }
  }
  return currencyAmount
}
