import { Trade as RouterTrade } from '@uniswap/router-sdk'
import { Fraction } from '@uniswap/sdk-core'
import { Trade as V2Trade } from '@uniswap/v2-sdk'
import JSBI from 'jsbi'

import { Uni_Currency, Uni_Pool, Uni_Token, Uni_TokenAmount, Uni_Trade } from '../polywrap'
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

// export function tokenDeps(token: Poly.Token | undefined) {
//   if (!token) {
//     return [undefined]
//   } else {
//     return [token.address, token.chainId]
//   }
// }
//
// export function tokenAmountDeps(amount: Poly.TokenAmount | undefined) {
//   if (!amount) {
//     return [undefined]
//   } else {
//     return [amount.amount, ...tokenDeps(amount.token)]
//   }
// }

// export function pairDeps(pair: Poly.Pair | undefined) {
//   if (!pair) {
//     return [undefined]
//   } else {
//     return [...tokenAmountDeps(pair.tokenAmount0), ...tokenAmountDeps(pair.tokenAmount1)]
//   }
// }
