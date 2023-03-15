import { Token, TokenAmount } from '@uniswap/sdk'
import { useMemo } from 'react'
import { useAllTokenBalances } from '../../state/wallet/hooks'
import { reverseMapTokenAmount } from '../../polywrap/mapping'
import { W3ChainId } from '../../polywrap/types'
import { tokenAmountDeps } from '../../polywrap/utils'

// compare two token amounts with highest one coming first
function balanceComparator(balanceA?: TokenAmount, balanceB?: TokenAmount) {
  if (balanceA && balanceB) {
    return balanceA.greaterThan(balanceB) ? -1 : balanceA.equalTo(balanceB) ? 0 : 1
  } else if (balanceA && balanceA.greaterThan('0')) {
    return -1
  } else if (balanceB && balanceB.greaterThan('0')) {
    return 1
  }
  return 0
}

function getTokenComparator(balances: {
  [tokenAddress: string]: TokenAmount | undefined
}): (tokenA: Token, tokenB: Token) => number {
  return function sortTokens(tokenA: Token, tokenB: Token): number {
    // -1 = a is first
    // 1 = b is first

    // sort by balances
    const balanceA = balances[tokenA.address]
    const balanceB = balances[tokenB.address]

    const balanceComp = balanceComparator(balanceA, balanceB)
    if (balanceComp !== 0) return balanceComp

    if (tokenA.symbol && tokenB.symbol) {
      // sort by symbol
      return tokenA.symbol.toLowerCase() < tokenB.symbol.toLowerCase() ? -1 : 1
    } else {
      return tokenA.symbol ? -1 : tokenB.symbol ? -1 : 0
    }
  }
}

export function useTokenComparator(inverted: boolean): (tokenA: Token, tokenB: Token) => number {
  const w3balances = useAllTokenBalances()

  const w3BalancesDeps: (string | W3ChainId | undefined)[] = []
  if (w3balances) {
    Object.keys(w3balances).forEach(key => {
      const tokenAmount = w3balances[key]
      if (tokenAmount) {
        w3BalancesDeps.push(...tokenAmountDeps(tokenAmount))
      }
    })
    for (let i = w3BalancesDeps.length; i < 300; i++) {
      w3BalancesDeps.push(undefined)
    }
  }

  const balances: { [tokenAddress: string]: TokenAmount | undefined } = useMemo(() => {
    const reverseMappedBalances: { [tokenAddress: string]: TokenAmount | undefined } = {}
    Object.keys(w3balances).forEach(k => {
      reverseMappedBalances[k] = reverseMapTokenAmount(w3balances[k]) as TokenAmount | undefined
    })
    return reverseMappedBalances
  }, [...w3BalancesDeps])

  const comparator = useMemo(() => getTokenComparator(balances ?? {}), [balances])
  return useMemo(() => {
    if (inverted) {
      return (tokenA: Token, tokenB: Token) => comparator(tokenA, tokenB) * -1
    } else {
      return comparator
    }
  }, [inverted, comparator])
}
