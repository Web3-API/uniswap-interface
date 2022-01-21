import { Fraction } from '@uniswap/sdk-core'
import JSBI from 'jsbi'
import { DependencyList, useEffect, useState } from 'react'

import * as Poly from '../polywrap'
import { ETHER } from './constants'

export function isEther(token: Poly.Token | undefined): boolean {
  if (!token) return false
  return (
    token.currency.symbol === ETHER.symbol &&
    token.currency.name === ETHER.name &&
    token.currency.decimals === ETHER.decimals
  )
}

export function isToken(object: unknown): object is Poly.Token {
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

export function tokenEquals(tokenA?: Poly.Token, tokenB?: Poly.Token): boolean {
  return tokenA?.chainId === tokenB?.chainId && tokenA?.address === tokenB?.address
}

export function currencyEquals(currencyA?: Poly.Currency, currencyB?: Poly.Currency): boolean {
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

export function toSignificant(tokenAmount: Poly.TokenAmount, sd = 6): string {
  const numerator = tokenAmount.amount
  const denominator = JSBI.exponentiate(JSBI.BigInt(10), JSBI.BigInt(tokenAmount.token.currency.decimals))
  return new Fraction(numerator, denominator).toSignificant(sd)
}

export function toFixed(tokenAmount: Poly.TokenAmount, digits = 6): string {
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

export function useAsync<T>(callback: () => Promise<T>, deps: DependencyList, initialValue: T): T {
  const [val, setVal] = useState<T>(initialValue)

  useEffect(() => {
    const updateAsync = async () => {
      setVal(await callback())
    }
    void updateAsync()
  }, [...deps, callback])

  return val
}
