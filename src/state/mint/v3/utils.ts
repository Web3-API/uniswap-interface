import { PolywrapClient } from '@polywrap/client-js'
import { Price, Token } from '@uniswap/sdk-core'
import JSBI from 'jsbi'

import { mapPrice } from '../../../polywrap-utils'
import { Uni_FeeAmountEnum as FeeAmountEnum, Uni_Module } from '../../../wrap'

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
  client: PolywrapClient,
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

  try {
    // check price is within min/max bounds, if outside return min/max
    const sqrtRatioX96Invoke = await Uni_Module.encodeSqrtRatioX96(
      {
        amount1: price.numerator.toString(),
        amount0: price.denominator.toString(),
      },
      client
    )
    if (!sqrtRatioX96Invoke.ok) throw sqrtRatioX96Invoke.error
    const sqrtRatioX96 = sqrtRatioX96Invoke.value

    const maxSqrtRatioInvoke = await Uni_Module.MAX_SQRT_RATIO({}, client)
    if (!maxSqrtRatioInvoke.ok) throw maxSqrtRatioInvoke.error
    const maxSqrtRatio = maxSqrtRatioInvoke.value

    const minSqrtRatioInvoke = await Uni_Module.MIN_SQRT_RATIO({}, client)
    if (!minSqrtRatioInvoke.ok) throw minSqrtRatioInvoke.error
    const minSqrtRatio = minSqrtRatioInvoke.value

    let tickInvoke
    if (JSBI.greaterThanOrEqual(JSBI.BigInt(sqrtRatioX96), JSBI.BigInt(maxSqrtRatio))) {
      tickInvoke = await Uni_Module.MAX_TICK({}, client)
    } else if (JSBI.lessThanOrEqual(JSBI.BigInt(sqrtRatioX96), JSBI.BigInt(minSqrtRatio))) {
      tickInvoke = await Uni_Module.MIN_TICK({}, client)
    } else {
      // this function is agnostic to the base, will always return the correct tick
      tickInvoke = await Uni_Module.priceToClosestTick({ price: mapPrice(price) }, client)
    }
    if (!tickInvoke.ok) throw tickInvoke.error
    const tick: number = tickInvoke.value

    const tickSpacingInvoke = await Uni_Module.feeAmountToTickSpacing({ feeAmount }, client)
    if (!tickSpacingInvoke.ok) throw tickSpacingInvoke.error
    const tickSpacing = tickSpacingInvoke.value

    const nearestTickInvoke = await Uni_Module.nearestUsableTick({ tick, tickSpacing }, client)
    if (!nearestTickInvoke.ok) throw nearestTickInvoke.error
    return nearestTickInvoke.value
  } catch (e) {
    console.error(e)
    return undefined
  }
}
