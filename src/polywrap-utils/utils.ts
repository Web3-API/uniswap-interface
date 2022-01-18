import * as Poly from "../polywrap";
import { ETHER } from "./constants";

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

// export function toSignificant(tokenAmount?: Poly.TokenAmount, sd = 6): string | undefined {
//   if (!tokenAmount) {
//     return undefined
//   }
//   const numerator = new Decimal(tokenAmount.amount)
//   const denominator = new Decimal(10).pow(tokenAmount.token.currency.decimals)
//   return numerator
//     .div(denominator)
//     .toSignificantDigits(sd)
//     .toString()
// }
//
// export function toExact(tokenAmount?: Poly.TokenAmount): string | undefined {
//   if (!tokenAmount) {
//     return undefined
//   }
//   const numerator = new Decimal(tokenAmount.amount)
//   const denominator = new Decimal(10).pow(tokenAmount.token.currency.decimals)
//   return numerator.div(denominator).toString()
// }

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