import { useMemo } from 'react'
import { isAddress } from '../../utils'
import { W3Token } from '../../polywrap/types'

export function filterTokens(tokens: W3Token[], search: string): W3Token[] {
  if (search.length === 0) return tokens

  const searchingAddress = isAddress(search)

  if (searchingAddress) {
    return tokens.filter(token => token.address === searchingAddress)
  }

  const lowerSearchParts = search
    .toLowerCase()
    .split(/\s+/)
    .filter(s => s.length > 0)

  if (lowerSearchParts.length === 0) {
    return tokens
  }

  const matchesSearch = (s: string): boolean => {
    const sParts = s
      .toLowerCase()
      .split(/\s+/)
      .filter(s => s.length > 0)

    return lowerSearchParts.every(p => p.length === 0 || sParts.some(sp => sp.startsWith(p) || sp.endsWith(p)))
  }

  return tokens.filter(token => {
    const { symbol, name } = token.currency
    return (symbol && matchesSearch(symbol)) || (name && matchesSearch(name))
  })
}

export function useSortedTokensByQuery(tokens: W3Token[] | undefined, searchQuery: string): W3Token[] {
  return useMemo(() => {
    if (!tokens) {
      return []
    }

    const symbolMatch = searchQuery
      .toLowerCase()
      .split(/\s+/)
      .filter(s => s.length > 0)

    if (symbolMatch.length > 1) {
      return tokens
    }

    const exactMatches: W3Token[] = []
    const symbolSubtrings: W3Token[] = []
    const rest: W3Token[] = []

    // sort tokens by exact match -> subtring on symbol match -> rest
    tokens.map(token => {
      if (token.currency.symbol?.toLowerCase() === symbolMatch[0]) {
        return exactMatches.push(token)
      } else if (token.currency.symbol?.toLowerCase().startsWith(searchQuery.toLowerCase().trim())) {
        return symbolSubtrings.push(token)
      } else {
        return rest.push(token)
      }
    })

    return [...exactMatches, ...symbolSubtrings, ...rest]
  }, [tokens, searchQuery])
}
