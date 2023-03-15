import { TokenAddressMap, useDefaultTokenList, useUnsupportedTokenList } from './../state/lists/hooks'
import { parseBytes32String } from '@ethersproject/strings'
import { useMemo } from 'react'
import { useCombinedActiveList, useCombinedInactiveList } from '../state/lists/hooks'
import { NEVER_RELOAD, useSingleCallResult } from '../state/multicall/hooks'
import { useUserAddedTokens } from '../state/user/hooks'
import { isAddress } from '../utils'

import { useActiveWeb3React } from './index'
import { useBytes32TokenContract, useTokenContract } from './useContract'
import { filterTokens } from '../components/SearchModal/w3filtering'
import { arrayify } from 'ethers/lib/utils'
import { mapChainId, mapToken } from '../polywrap/mapping'
import { W3Token } from '../polywrap/types'
import { ETHER } from '../polywrap/constants'
import { isEther, tokenEquals } from '../polywrap/utils'

// reduce token map into standard address <-> Token mapping, optionally include user added tokens
function useTokensFromMap(tokenMap: TokenAddressMap, includeUserAdded: boolean): { [address: string]: W3Token } {
  const { chainId } = useActiveWeb3React()
  const userAddedTokens: W3Token[] = useUserAddedTokens().map(mapToken)

  return useMemo(() => {
    if (!chainId) return {}

    // reduce to just tokens
    const mapWithoutUrls = Object.keys(tokenMap[chainId]).reduce<{ [address: string]: W3Token }>((newMap, address) => {
      newMap[address] = mapToken(tokenMap[chainId][address].token)
      return newMap
    }, {})

    if (includeUserAdded) {
      return (
        userAddedTokens
          // reduce into all ALL_TOKENS filtered by the current chain
          .reduce<{ [address: string]: W3Token }>(
            (tokenMap, token) => {
              tokenMap[token.address] = token
              return tokenMap
            },
            // must make a copy because reduce modifies the map, and we do not
            // want to make a copy in every iteration
            { ...mapWithoutUrls }
          )
      )
    }

    return mapWithoutUrls
  }, [chainId, userAddedTokens, tokenMap, includeUserAdded]) as { [address: string]: W3Token }
}

export function useDefaultTokens(): { [address: string]: W3Token } {
  const defaultList = useDefaultTokenList()
  return useTokensFromMap(defaultList, false)
}

export function useAllTokens(): { [address: string]: W3Token } {
  const allTokens = useCombinedActiveList()
  return useTokensFromMap(allTokens, true)
}

export function useAllInactiveTokens(): { [address: string]: W3Token } {
  // get inactive tokens
  const inactiveTokensMap = useCombinedInactiveList()
  const inactiveTokens = useTokensFromMap(inactiveTokensMap, false)

  // filter out any token that are on active list
  const activeTokensAddresses = Object.keys(useAllTokens())
  const filteredInactive = activeTokensAddresses
    ? Object.keys(inactiveTokens).reduce<{ [address: string]: W3Token }>((newMap, address) => {
        if (!activeTokensAddresses.includes(address)) {
          newMap[address] = inactiveTokens[address]
        }
        return newMap
      }, {})
    : inactiveTokens

  return filteredInactive
}

export function useUnsupportedTokens(): { [address: string]: W3Token } {
  const unsupportedTokensMap = useUnsupportedTokenList()
  return useTokensFromMap(unsupportedTokensMap, false)
}

export function useIsTokenActive(token: W3Token | undefined | null): boolean {
  const activeTokens = useAllTokens()

  if (!activeTokens || !token) {
    return false
  }

  return !!activeTokens[token.address]
}

// used to detect extra search results
export function useFoundOnInactiveList(searchQuery: string): W3Token[] | undefined {
  const { chainId } = useActiveWeb3React()
  const inactiveTokens = useAllInactiveTokens()

  return useMemo(() => {
    if (!chainId || searchQuery === '') {
      return undefined
    } else {
      return filterTokens(Object.values(inactiveTokens), searchQuery)
    }
  }, [chainId, inactiveTokens, searchQuery])
}

// Check if currency is included in custom list from user storage
export function useIsUserAddedToken(currency: W3Token | undefined | null): boolean {
  const userAddedTokens = useUserAddedTokens().map(mapToken)

  if (!currency) {
    return false
  }

  if (isEther(currency)) {
    return !!userAddedTokens.find(token => {
      return isEther(token)
    })
  } else {
    return !!userAddedTokens.find(token => {
      return tokenEquals(token, currency)
    })
  }
}

// parse a name or symbol from a token response
const BYTES32_REGEX = /^0x[a-fA-F0-9]{64}$/

function parseStringOrBytes32(str: string | undefined, bytes32: string | undefined, defaultValue: string): string {
  return str && str.length > 0
    ? str
    : // need to check for proper bytes string and valid terminator
    bytes32 && BYTES32_REGEX.test(bytes32) && arrayify(bytes32)[31] === 0
    ? parseBytes32String(bytes32)
    : defaultValue
}

// undefined if invalid or does not exist
// null if loading
// otherwise returns the token
export function useToken(tokenAddress?: string): W3Token | undefined | null {
  const { chainId } = useActiveWeb3React()
  const tokens = useAllTokens()

  const address = isAddress(tokenAddress)

  const tokenContract = useTokenContract(address ? address : undefined, false)
  const tokenContractBytes32 = useBytes32TokenContract(address ? address : undefined, false)
  const token: W3Token | undefined = address ? tokens[address] : undefined

  const tokenName = useSingleCallResult(token ? undefined : tokenContract, 'name', undefined, NEVER_RELOAD)
  const tokenNameBytes32 = useSingleCallResult(
    token ? undefined : tokenContractBytes32,
    'name',
    undefined,
    NEVER_RELOAD
  )
  const symbol = useSingleCallResult(token ? undefined : tokenContract, 'symbol', undefined, NEVER_RELOAD)
  const symbolBytes32 = useSingleCallResult(token ? undefined : tokenContractBytes32, 'symbol', undefined, NEVER_RELOAD)
  const decimals = useSingleCallResult(token ? undefined : tokenContract, 'decimals', undefined, NEVER_RELOAD)

  return useMemo(() => {
    if (token) return token
    if (!chainId || !address) return undefined
    if (decimals.loading || symbol.loading || tokenName.loading) return null
    if (decimals.result) {
      return {
        chainId: mapChainId(chainId),
        address: address,
        currency: {
          decimals: decimals.result[0],
          symbol: parseStringOrBytes32(symbol.result?.[0], symbolBytes32.result?.[0], 'UNKNOWN'),
          name: parseStringOrBytes32(tokenName.result?.[0], tokenNameBytes32.result?.[0], 'Unknown Token')
        }
      }
    }
    return undefined
  }, [
    address,
    chainId,
    decimals.loading,
    decimals.result,
    symbol.loading,
    symbol.result,
    symbolBytes32.result,
    token,
    tokenName.loading,
    tokenName.result,
    tokenNameBytes32.result
  ])
}

export function useCurrency(currencyId: string | undefined): W3Token | null | undefined {
  const isETH = currencyId?.toUpperCase() === 'ETH'
  const token = useToken(isETH ? undefined : currencyId)
  const { chainId } = useActiveWeb3React()
  return isETH
    ? {
        chainId: chainId ? mapChainId(chainId) : undefined,
        address: '',
        currency: ETHER
      }
    : token
}
