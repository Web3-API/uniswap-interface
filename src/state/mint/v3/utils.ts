import { Price, Token } from '@uniswap/sdk-core'
import { Web3ApiClient } from '@web3api/client-js'
import JSBI from 'jsbi'

import { Uni_FeeAmountEnum as FeeAmountEnum, Uni_Query } from '../../../polywrap'
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
  client: Web3ApiClient,
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
    const sqrtRatioX96Invoke = await Uni_Query.encodeSqrtRatioX96(
      {
        amount1: price.numerator.toString(),
        amount0: price.denominator.toString(),
      },
      client
    )
    if (sqrtRatioX96Invoke.error) throw sqrtRatioX96Invoke.error
    const sqrtRatioX96 = sqrtRatioX96Invoke.data as string

    const maxSqrtRatioInvoke = await Uni_Query.MAX_SQRT_RATIO({}, client)
    if (maxSqrtRatioInvoke.error) throw maxSqrtRatioInvoke.error
    const maxSqrtRatio = maxSqrtRatioInvoke.data as string

    const minSqrtRatioInvoke = await Uni_Query.MIN_SQRT_RATIO({}, client)
    if (minSqrtRatioInvoke.error) throw minSqrtRatioInvoke.error
    const minSqrtRatio = minSqrtRatioInvoke.data as string

    let tickInvoke
    if (JSBI.greaterThanOrEqual(JSBI.BigInt(sqrtRatioX96), JSBI.BigInt(maxSqrtRatio))) {
      tickInvoke = await Uni_Query.MAX_TICK({}, client)
    } else if (JSBI.lessThanOrEqual(JSBI.BigInt(sqrtRatioX96), JSBI.BigInt(minSqrtRatio))) {
      tickInvoke = await Uni_Query.MIN_TICK({}, client)
    } else {
      // this function is agnostic to the base, will always return the correct tick
      tickInvoke = await Uni_Query.priceToClosestTick({ price: mapPrice(price) }, client)
    }
    if (tickInvoke.error) throw tickInvoke.error
    const tick: number = tickInvoke.data as number

    const tickSpacingInvoke = await Uni_Query.feeAmountToTickSpacing({ feeAmount }, client)
    if (tickSpacingInvoke.error) throw tickSpacingInvoke.error
    const tickSpacing = tickSpacingInvoke.data as number

    const nearestTickInvoke = await Uni_Query.nearestUsableTick({ tick, tickSpacing }, client)
    if (nearestTickInvoke.error) throw nearestTickInvoke.error
    return nearestTickInvoke.data
  } catch (e) {
    console.error(e)
    return undefined
  }
}
