import JSBI from 'jsbi'

import { tokenEquals } from '../polywrap-utils'
import { Uni_Trade } from '../wrap'

/**
 * Returns true if the trade requires a confirmation of details before we can submit it
 * @param args either a pair of V2 trades or a pair of V3 trades
 */
export function tradeMeaningfullyDiffers(...args: [Uni_Trade, Uni_Trade]): boolean {
  const [tradeA, tradeB] = args
  return (
    tradeA.tradeType !== tradeB.tradeType ||
    !tokenEquals(tradeA.inputAmount.token, tradeB.inputAmount.token) ||
    !JSBI.equal(JSBI.BigInt(tradeA.inputAmount.amount), JSBI.BigInt(tradeB.inputAmount.amount)) ||
    !tokenEquals(tradeA.outputAmount.token, tradeB.outputAmount.token) ||
    !JSBI.equal(JSBI.BigInt(tradeA.outputAmount.amount), JSBI.BigInt(tradeB.outputAmount.amount))
  )
}
