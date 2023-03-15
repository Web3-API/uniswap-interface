import { W3ChainId, W3Token, W3TokenAmount } from '../polywrap/types'
import { isEther, tokenEquals, WETH } from '../polywrap/utils'
import { ETHER } from '../polywrap/constants'

export function wrappedCurrency(currency: W3Token | undefined, chainId: W3ChainId | undefined): W3Token | undefined {
  return chainId !== undefined && isEther(currency) ? WETH(chainId) : currency
}

export function wrappedCurrencyAmount(
  currencyAmount: W3TokenAmount | undefined,
  chainId: W3ChainId | undefined
): W3TokenAmount | undefined {
  const token = currencyAmount && chainId !== undefined ? wrappedCurrency(currencyAmount.token, chainId) : undefined
  return token && currencyAmount ? { token, amount: currencyAmount.amount } : undefined
}

export function unwrappedToken(token: W3Token): W3Token {
  if (isEther(token) || (token.chainId !== undefined && tokenEquals(token, WETH(token.chainId)))) {
    return {
      chainId: token.chainId,
      address: '',
      currency: ETHER
    }
  }
  return token
}
