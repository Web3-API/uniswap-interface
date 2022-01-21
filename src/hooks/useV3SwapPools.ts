import { Currency, Token } from '@uniswap/sdk-core'
import { SupportedChainId } from 'constants/chains'
import { useMemo } from 'react'

import { FeeAmountEnum, Pool } from '../polywrap'
import { mapPool, reverseMapFeeAmount, useAsync } from '../polywrap-utils'
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

  const usePoolsResult = usePools(
    allCurrencyCombinationsWithAllFees.map(([token0, token1, feeAmountEnum]) => [
      token0,
      token1,
      reverseMapFeeAmount(feeAmountEnum),
    ])
  )

  // this block is just for mapping
  // const [pools, setPools] = useState<[PoolState, Pool | null][]>([])
  // useEffect(() => {
  //   const updateAsync = async () => {
  //     const poolsAsync = usePoolsResult.map(
  //       async ([poolState, pool]): Promise<[PoolState, Pool | null]> => [
  //         poolState,
  //         pool === null ? null : await mapPool(pool),
  //       ]
  //     )
  //     const pools = await Promise.all(poolsAsync)
  //     setPools(pools)
  //   }
  //   void updateAsync()
  // }, [usePoolsResult])

  // this block is just for mapping
  const pools = useAsync(
    () => {
      const poolsAsync = usePoolsResult.map(
        async ([poolState, pool]): Promise<[PoolState, Pool | null]> => [
          poolState,
          pool === null ? null : await mapPool(pool),
        ]
      )
      return Promise.all(poolsAsync)
    },
    [usePoolsResult],
    []
  )

  return useMemo(() => {
    return {
      pools: pools
        .filter((tuple): tuple is [PoolState.EXISTS, Pool] => {
          return tuple[0] === PoolState.EXISTS && tuple[1] !== null
        })
        .map(([, pool]) => pool),
      loading: pools.some(([state]) => state === PoolState.LOADING),
    }
  }, [pools])
}
