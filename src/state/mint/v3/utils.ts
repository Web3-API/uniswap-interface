import { Price, Token } from '@uniswap/sdk-core'
import JSBI from 'jsbi'

import { FeeAmountEnum, Uniswap } from '../../../polywrap'
import { mapPrice } from '../../../polywrap-utils'

export function tryParsePrice(baseToken?: Token, quoteToken?: Token, value?: string) {
  if (!baseToken || !quoteToken || !value) {
    return undefined
  }

  if (!value.match(/^\d*\.?\d+$/)) {
    return undefined
  }

  const [whole, fraction] = value.split('.')

  const decimals = fraction?.length ?? 0
  const withoutDecimals = JSBI.BigInt((whole ?? '') + (fraction ?? ''))

  return new Price(
    baseToken,
    quoteToken,
    JSBI.multiply(JSBI.BigInt(10 ** decimals), JSBI.BigInt(10 ** baseToken.decimals)),
    JSBI.multiply(withoutDecimals, JSBI.BigInt(10 ** quoteToken.decimals))
  )
}

export async function tryParseTick(
  uni: Uniswap,
  baseToken?: Token,
  quoteToken?: Token,
  feeAmount?: FeeAmountEnum,
  value?: string
): Promise<number | undefined> {
  if (!baseToken || !quoteToken || feeAmount === undefined || !value) {
    return undefined
  }

  const price = tryParsePrice(baseToken, quoteToken, value)

  if (!price) {
    return undefined
  }

  let tick: number

  // check price is within min/max bounds, if outside return min/max
  const sqrtRatioX96 = await uni.query.encodeSqrtRatioX96({
    amount1: price.numerator.toString(),
    amount0: price.denominator.toString(),
  })

  if (JSBI.greaterThanOrEqual(JSBI.BigInt(sqrtRatioX96), JSBI.BigInt(await uni.query.MAX_SQRT_RATIO({})))) {
    tick = await uni.query.MAX_TICK({})
  } else if (JSBI.lessThanOrEqual(JSBI.BigInt(sqrtRatioX96), JSBI.BigInt(await uni.query.MIN_SQRT_RATIO({})))) {
    tick = await uni.query.MIN_TICK({})
  } else {
    // this function is agnostic to the base, will always return the correct tick
    tick = await uni.query.priceToClosestTick({ price: mapPrice(price) })
  }

  const tickSpacing = await uni.query.feeAmountToTickSpacing({ feeAmount })
  return await uni.query.nearestUsableTick({ tick, tickSpacing })
}
