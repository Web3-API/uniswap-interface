import { UNI } from './../../constants/index'
import { TokenAmount } from '@uniswap/sdk'
import { useMemo } from 'react'
import ERC20_INTERFACE from '../../constants/abis/erc20'
import { useAllTokens } from '../../hooks/W3Tokens'
import { useActiveWeb3React } from '../../hooks'
import { useMulticallContract } from '../../hooks/useContract'
import { isAddress } from '../../utils'
import { useSingleContractMultipleData, useMultipleContractSingleData } from '../multicall/hooks'
import { useUserUnclaimedAmount } from '../claim/hooks'
import { useTotalUniEarned } from '../stake/hooks'
import { W3Token, W3TokenAmount } from '../../polywrap/types'
import { ETHER } from '../../polywrap/constants'
import { isEther, isToken } from '../../polywrap/utils'
import { mapChainId, mapToken, mapTokenAmount } from '../../polywrap/mapping'
import Decimal from 'decimal.js'

/**
 * Returns a map of the given addresses to their eventually consistent ETH balances.
 */
export function useETHBalances(
  uncheckedAddresses?: (string | undefined)[]
): { [address: string]: W3TokenAmount | undefined } {
  const multicallContract = useMulticallContract()

  const addresses: string[] = useMemo(
    () =>
      uncheckedAddresses
        ? uncheckedAddresses
            .map(isAddress)
            .filter((a): a is string => a !== false)
            .sort()
        : [],
    [uncheckedAddresses]
  )

  const results = useSingleContractMultipleData(
    multicallContract,
    'getEthBalance',
    addresses.map(address => [address])
  )

  const { chainId } = useActiveWeb3React()

  return useMemo(
    () =>
      addresses.reduce<{ [address: string]: W3TokenAmount }>((memo, address, i) => {
        const value = results?.[i]?.result?.[0]
        if (value)
          memo[address] = {
            token: {
              chainId: chainId ? mapChainId(chainId) : undefined,
              address: '',
              currency: ETHER
            },
            amount: value.toString()
          }
        return memo
      }, {}),
    [addresses, results, chainId]
  )
}

/**
 * Returns a map of token addresses to their eventually consistent token balances for a single account.
 */
export function useTokenBalancesWithLoadingIndicator(
  address?: string,
  tokens?: (W3Token | undefined)[]
): [{ [tokenAddress: string]: W3TokenAmount | undefined }, boolean] {
  const validatedTokens: W3Token[] = useMemo(
    () =>
      tokens?.filter((t?: W3Token): t is W3Token => {
        const hasAddress = isAddress(t?.address)
        return hasAddress !== false && hasAddress !== ''
      }) ?? [],
    [tokens]
  )

  const validatedTokenAddresses = useMemo(() => validatedTokens.map(vt => vt.address), [validatedTokens])

  const balances = useMultipleContractSingleData(validatedTokenAddresses, ERC20_INTERFACE, 'balanceOf', [address])

  const anyLoading: boolean = useMemo(() => balances.some(callState => callState.loading), [balances])

  return [
    useMemo(
      () =>
        address && validatedTokens.length > 0
          ? validatedTokens.reduce<{ [tokenAddress: string]: W3TokenAmount | undefined }>((memo, token, i) => {
              const value = balances[i].result?.[0]
              const amount = value ? value.toString() : undefined
              if (amount) {
                memo[token.address] = {
                  token: token,
                  amount: amount
                }
              }
              return memo
            }, {})
          : {},
      [address, validatedTokens, balances]
    ),
    anyLoading
  ]
}

export function useTokenBalances(
  address?: string,
  tokens?: (W3Token | undefined)[]
): { [tokenAddress: string]: W3TokenAmount | undefined } {
  return useTokenBalancesWithLoadingIndicator(address, tokens)[0]
}

// get the balance for a single token/account combo
export function useTokenBalance(account?: string, token?: W3Token): W3TokenAmount | undefined {
  const tokenBalances = useTokenBalances(account, [token])
  if (!token) return undefined
  return tokenBalances[token.address]
}

export function useCurrencyBalances(
  account?: string,
  currencies?: (W3Token | undefined)[]
): (W3TokenAmount | undefined)[] {
  const tokens = useMemo(
    () => currencies?.filter((currency): currency is W3Token => isToken(currency) && !isEther(currency)) ?? [],
    [currencies]
  )

  const tokenBalances = useTokenBalances(account, tokens)
  const containsETH: boolean = useMemo(() => currencies?.some(isEther) ?? false, [currencies])
  const ethBalance = useETHBalances(containsETH ? [account] : [])

  return useMemo(
    () =>
      currencies?.map(currency => {
        if (!account || !currency) return undefined
        if (isEther(currency)) return ethBalance[account]
        if (isToken(currency)) return tokenBalances[currency.address]
        return undefined
      }) ?? [],
    [account, currencies, ethBalance, tokenBalances]
  )
}

export function useCurrencyBalance(account?: string, currency?: W3Token): W3TokenAmount | undefined {
  return useCurrencyBalances(account, [currency])[0]
}

// mimics useAllBalances
export function useAllTokenBalances(): { [tokenAddress: string]: W3TokenAmount | undefined } {
  const { account } = useActiveWeb3React()
  const allTokens = useAllTokens()
  const allTokensArray = useMemo(() => Object.values(allTokens ?? {}), [allTokens])
  const balances = useTokenBalances(account ?? undefined, allTokensArray)
  return balances ?? {}
}

// get the total owned, unclaimed, and unharvested UNI for account
export function useAggregateUniBalance(): W3TokenAmount | undefined {
  const { account, chainId } = useActiveWeb3React()

  const uni = chainId ? mapToken(UNI[chainId]) : undefined

  const uniBalance: W3TokenAmount | undefined = useTokenBalance(account ?? undefined, uni)
  const uniUnclaimed: TokenAmount | undefined = useUserUnclaimedAmount(account)
  const w3uniUnclaimed: W3TokenAmount | undefined = mapTokenAmount(uniUnclaimed)
  const uniUnHarvested: TokenAmount | undefined = useTotalUniEarned()
  const w3uniUnHarvested: W3TokenAmount | undefined = mapTokenAmount(uniUnHarvested)

  if (!uni) return undefined

  return {
    token: uni,
    amount: new Decimal(uniBalance?.amount ?? '0')
      .add(new Decimal(w3uniUnclaimed?.amount ?? '0'))
      .add(new Decimal(w3uniUnHarvested?.amount ?? '0'))
      .toFixed(0)
  }
}
