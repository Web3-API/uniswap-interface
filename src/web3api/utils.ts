import { W3ChainId, W3Currency, W3Token, W3TokenAmount, W3Pair } from './types'
import { ETHER } from './constants'
import Decimal from 'decimal.js-light'

export function isEther(token: W3Token | undefined): boolean {
  if (!token) return false
  return (
    token.currency.symbol === ETHER.symbol &&
    token.currency.name === ETHER.name &&
    token.currency.decimals === ETHER.decimals
  )
}

export function isToken(object: unknown): object is W3Token {
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

export function tokenEquals(tokenA?: W3Token, tokenB?: W3Token): boolean {
  return tokenA?.chainId === tokenB?.chainId && tokenA?.address === tokenB?.address
}

export function currencyEquals(currencyA?: W3Currency, currencyB?: W3Currency): boolean {
  if (currencyA === undefined || currencyB === undefined) {
    return false
  }
  return (
    currencyA.symbol === currencyB.symbol &&
    currencyA.name === currencyB.name &&
    currencyA.decimals === currencyB.decimals
  )
}

export function WETH(chainId: W3ChainId): W3Token {
  switch (chainId) {
    case W3ChainId.MAINNET:
      return {
        chainId: W3ChainId.MAINNET,
        address: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
        currency: {
          decimals: 18,
          symbol: 'WETH',
          name: 'Wrapped Ether'
        }
      }
    case W3ChainId.ROPSTEN:
      return {
        chainId: W3ChainId.ROPSTEN,
        address: '0xc778417E063141139Fce010982780140Aa0cD5Ab',
        currency: {
          decimals: 18,
          symbol: 'WETH',
          name: 'Wrapped Ether'
        }
      }
    case W3ChainId.RINKEBY:
      return {
        chainId: W3ChainId.RINKEBY,
        address: '0xc778417E063141139Fce010982780140Aa0cD5Ab',
        currency: {
          decimals: 18,
          symbol: 'WETH',
          name: 'Wrapped Ether'
        }
      }
    case W3ChainId.GÖRLI:
      return {
        chainId: W3ChainId.GÖRLI,
        address: '0xB4FBF271143F4FBf7B91A5ded31805e42b2208d6',
        currency: {
          decimals: 18,
          symbol: 'WETH',
          name: 'Wrapped Ether'
        }
      }
    case W3ChainId.KOVAN:
      return {
        chainId: W3ChainId.KOVAN,
        address: '0xd0A1E359811322d97991E03f863a0C30C2cF029C',
        currency: {
          decimals: 18,
          symbol: 'WETH',
          name: 'Wrapped Ether'
        }
      }
    default:
      throw new Error('Unknown chain ID. This should never happen.')
  }
}

export function toSignificant(tokenAmount?: W3TokenAmount, sd = 6): string | undefined {
  if (!tokenAmount) {
    return undefined
  }
  const numerator = new Decimal(tokenAmount.amount)
  const denominator = new Decimal(10).pow(tokenAmount.token.currency.decimals)
  return numerator
    .div(denominator)
    .toSignificantDigits(sd)
    .toString()
}

export function toExact(tokenAmount?: W3TokenAmount): string | undefined {
  if (!tokenAmount) {
    return undefined
  }
  const numerator = new Decimal(tokenAmount.amount)
  const denominator = new Decimal(10).pow(tokenAmount.token.currency.decimals)
  return numerator.div(denominator).toString()
}

export function chainIdToName(chainId: W3ChainId): string {
  switch (chainId) {
    case W3ChainId.MAINNET:
      return 'MAINNET'
    case W3ChainId.ROPSTEN:
      return 'ROPSTEN'
    case W3ChainId.RINKEBY:
      return 'RINKEBY'
    case W3ChainId.GÖRLI:
      return 'GOERLI'
    case W3ChainId.KOVAN:
      return 'KOVAN'
    default:
      throw new Error('Unknown chain ID')
  }
}

export function tokenDeps(token: W3Token | undefined) {
  if (!token) {
    return [undefined]
  } else {
    return [token.address, token.chainId]
  }
}

export function tokenAmountDeps(amount: W3TokenAmount | undefined) {
  if (!amount) {
    return [undefined]
  } else {
    return [amount.amount, ...tokenDeps(amount.token)]
  }
}

export function pairDeps(pair: W3Pair | undefined) {
  if (!pair) {
    return [undefined]
  } else {
    return [...tokenAmountDeps(pair.tokenAmount0), ...tokenAmountDeps(pair.tokenAmount1)]
  }
}
