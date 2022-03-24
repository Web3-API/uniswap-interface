import { Currency, Token } from '@uniswap/sdk-core'
import { SupportedChainId } from 'constants/chains'
import { useMemo } from 'react'

import { Uni_FeeAmountEnum as FeeAmountEnum, Uni_Pool as Pool } from '../polywrap'
import { poolDeps } from '../polywrap-utils'
import { useAllCurrencyCombinations } from './useAllCurrencyCombinations'
import { PoolState, usePools } from './usePools'
import { useActiveWeb3React } from './web3'

/**
 * Returns all the existing pools that should be considered for swapping between an input currency and an output currency
 * @param currencyIn the input currency
 * @param currencyOut the output currency
 */
export function useV3SwapPools(
  currencyIn?: Currency,
  currencyOut?: Currency
): {
  pools: Pool[]
  loading: boolean
} {
  const { chainId } = useActiveWeb3React()

  const allCurrencyCombinations = useAllCurrencyCombinations(currencyIn, currencyOut)

  const allCurrencyCombinationsWithAllFees: [Token, Token, FeeAmountEnum][] = useMemo(
    () =>
      allCurrencyCombinations.reduce<[Token, Token, FeeAmountEnum][]>((list, [tokenA, tokenB]) => {
        return chainId === SupportedChainId.MAINNET
          ? list.concat([
              [tokenA, tokenB, FeeAmountEnum.LOW],
              [tokenA, tokenB, FeeAmountEnum.MEDIUM],
              [tokenA, tokenB, FeeAmountEnum.HIGH],
            ])
          : list.concat([
              [tokenA, tokenB, FeeAmountEnum.LOWEST],
              [tokenA, tokenB, FeeAmountEnum.LOW],
              [tokenA, tokenB, FeeAmountEnum.MEDIUM],
              [tokenA, tokenB, FeeAmountEnum.HIGH],
            ])
      }, []),
    [allCurrencyCombinations, chainId]
  )

  const pools = usePools(allCurrencyCombinationsWithAllFees)

  return useMemo(() => {
    return {
      pools: pools
        .filter((tuple): tuple is [PoolState.EXISTS, Pool] => {
          return tuple[0] === PoolState.EXISTS && tuple[1] !== null
        })
        .map(([, pool]) => pool),
      loading: pools.some(([state]) => state === PoolState.LOADING),
    }
  }, [...pools.map((val) => [val[0], ...poolDeps(val[1] ?? undefined)]).flat()])
}
