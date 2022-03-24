import { Trade as RouterTrade } from '@uniswap/router-sdk'
import { Fraction } from '@uniswap/sdk-core'
import { Trade as V2Trade } from '@uniswap/v2-sdk'
import JSBI from 'jsbi'

import {
  Uni_Currency,
  Uni_FeeAmountEnum,
  Uni_Pool,
  Uni_Position,
  Uni_Route,
  Uni_Token,
  Uni_TokenAmount,
  Uni_Trade,
} from '../polywrap'
import { ETHER } from './constants'

export function isEther(token: Uni_Token | undefined): boolean {
  if (!token) return false
  return (
    token.currency.symbol === ETHER.symbol &&
    token.currency.name === ETHER.name &&
    token.currency.decimals === ETHER.decimals
  )
}

export function isToken(object: unknown): object is Uni_Token {
  if (object === null || object === undefined) {
    return false
  }
  return (
    Object.prototype.hasOwnProperty.call(object, 'chainId') &&
    Object.prototype.hasOwnProperty.call(object, 'address') &&
    Object.prototype.hasOwnProperty.call(object, 'currency') &&
    Object.prototype.hasOwnProperty.call((object as any)?.currency, 'decimals') &&
    Object.prototype.hasOwnProperty.call((object as any)?.currency, 'symbol') &&
    Object.prototype.hasOwnProperty.call((object as any)?.currency, 'name')
  )
}

export function isPool(object: unknown): object is Uni_Pool {
  if (object === null || object === undefined) {
    return false
  }
  return (
    Object.prototype.hasOwnProperty.call(object, 'token0') &&
    Object.prototype.hasOwnProperty.call(object, 'token1') &&
    Object.prototype.hasOwnProperty.call(object, 'fee') &&
    Object.prototype.hasOwnProperty.call(object, 'sqrtRatioX96') &&
    Object.prototype.hasOwnProperty.call(object, 'liquidity') &&
    Object.prototype.hasOwnProperty.call(object, 'tickCurrent') &&
    Object.prototype.hasOwnProperty.call(object, 'tickDataProvider') &&
    isToken((object as any)?.token0)
  )
}

export function isTrade(object: unknown): object is Uni_Trade {
  if (object === null || object === undefined) {
    return false
  }
  return (
    !(object instanceof V2Trade) &&
    !(object instanceof RouterTrade) &&
    Object.prototype.hasOwnProperty.call(object, 'swaps') &&
    Object.prototype.hasOwnProperty.call(object, 'tradeType') &&
    Object.prototype.hasOwnProperty.call(object, 'inputAmount') &&
    Object.prototype.hasOwnProperty.call(object, 'outputAmount') &&
    Object.prototype.hasOwnProperty.call(object, 'executionPrice') &&
    Object.prototype.hasOwnProperty.call(object, 'priceImpact')
  )
}

export function tokenEquals(tokenA?: Uni_Token, tokenB?: Uni_Token): boolean {
  return tokenA?.chainId === tokenB?.chainId && tokenA?.address === tokenB?.address
}

export function currencyEquals(currencyA?: Uni_Currency, currencyB?: Uni_Currency): boolean {
  if (currencyA === undefined || currencyB === undefined) {
    return false
  }
  return (
    currencyA.symbol === currencyB.symbol &&
    currencyA.name === currencyB.name &&
    currencyA.decimals === currencyB.decimals
  )
}

// export function poolInvolvesToken(pool: Poly.Pool, token: Poly.Token): boolean {
//   return tokenEquals(pool.token0, token) || tokenEquals(pool.token1, token)
// }

export function toSignificant(tokenAmount: Uni_TokenAmount, sd = 6): string {
  const numerator = tokenAmount.amount
  const denominator = JSBI.exponentiate(JSBI.BigInt(10), JSBI.BigInt(tokenAmount.token.currency.decimals))
  return new Fraction(numerator, denominator).toSignificant(sd)
}

export function toFixed(tokenAmount: Uni_TokenAmount, digits = 6): string {
  const numerator = tokenAmount.amount
  const denominator = JSBI.exponentiate(JSBI.BigInt(10), JSBI.BigInt(tokenAmount.token.currency.decimals))
  return new Fraction(numerator, denominator).toFixed(digits)
}

export function toHex(amount: JSBI): string {
  const hex: string = amount.toString(16)
  if (hex.length % 2 !== 0) {
    return '0x0' + hex
  }
  return '0x' + hex
}

export function feeAmountToTickSpacing(feeAmount: Uni_FeeAmountEnum): number {
  switch (feeAmount) {
    case Uni_FeeAmountEnum.LOWEST:
      return 1
    case Uni_FeeAmountEnum.LOW:
      return 10
    case Uni_FeeAmountEnum.MEDIUM:
      return 60
    case Uni_FeeAmountEnum.HIGH:
      return 200
    default:
      throw new Error('Unknown FeeAmount')
  }
}

export function tokenDeps(token: Uni_Token | undefined) {
  if (!token) {
    return [undefined]
  } else {
    return [token.address, token.chainId]
  }
}

export function tokenAmountDeps(amount: Uni_TokenAmount | undefined) {
  if (!amount) {
    return [undefined]
  } else {
    return [amount.amount, ...tokenDeps(amount.token)]
  }
}

export function poolDeps(pool: Uni_Pool | undefined) {
  if (!pool) {
    return [undefined]
  } else {
    return [
      ...tokenDeps(pool.token0),
      ...tokenDeps(pool.token1),
      pool.fee,
      pool.tickCurrent,
      pool.sqrtRatioX96,
      pool.liquidity,
    ]
  }
}

export function routeDeps(route: Uni_Route | undefined) {
  if (!route) {
    return [undefined]
  } else {
    return [route.midPrice.price, ...tokenDeps(route.input), ...tokenDeps(route.output), route.pools.length]
  }
}

export function tradeDeps(trade: Uni_Trade | undefined) {
  if (!trade) {
    return [undefined]
  } else {
    return [
      trade.tradeType,
      ...tokenAmountDeps(trade.inputAmount),
      ...tokenAmountDeps(trade.outputAmount),
      trade.priceImpact.quotient,
    ]
  }
}

export function positionDeps(position: Uni_Position | undefined) {
  if (!position) {
    return [undefined]
  } else {
    return [...poolDeps(position.pool), position.liquidity, position.tickLower, position.tickUpper]
  }
}
