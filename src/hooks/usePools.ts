import { Interface } from '@ethersproject/abi'
import { Currency, Token } from '@uniswap/sdk-core'
import { abi as IUniswapV3PoolStateABI } from '@uniswap/v3-core/artifacts/contracts/interfaces/pool/IUniswapV3PoolState.sol/IUniswapV3PoolState.json'
import { Web3ApiClient } from '@web3api/client-js'
import { useWeb3ApiClient } from '@web3api/react'
import { useMemo } from 'react'

import { V3_CORE_FACTORY_ADDRESSES } from '../constants/addresses'
import { Uni_FeeAmountEnum as FeeAmountEnum, Uni_Pool as Pool, Uni_Pool, Uni_Query } from '../polywrap'
import { mapToken, useAsync } from '../polywrap-utils'
import { useMultipleContractSingleData } from '../state/multicall/hooks'
import { IUniswapV3PoolStateInterface } from '../types/v3/IUniswapV3PoolState'
import { useActiveWeb3React } from './web3'

const POOL_STATE_INTERFACE = new Interface(IUniswapV3PoolStateABI) as IUniswapV3PoolStateInterface

export enum PoolState {
  LOADING,
  NOT_EXISTS,
  EXISTS,
  INVALID,
}

export function usePools(
  poolKeys: [Currency | undefined, Currency | undefined, FeeAmountEnum | undefined][]
): [PoolState, Pool | null][] {
  const { chainId } = useActiveWeb3React()
  const client: Web3ApiClient = useWeb3ApiClient()

  const transformed: ([Token, Token, FeeAmountEnum] | null)[] = useMemo(() => {
    return poolKeys.map(([currencyA, currencyB, feeAmount]) => {
      if (!chainId || !currencyA || !currencyB || feeAmount === undefined) return null

      const tokenA = currencyA?.wrapped
      const tokenB = currencyB?.wrapped
      if (!tokenA || !tokenB || tokenA.equals(tokenB)) return null
      const [token0, token1] = tokenA.sortsBefore(tokenB) ? [tokenA, tokenB] : [tokenB, tokenA]
      return [token0, token1, feeAmount]
    })
  }, [chainId, poolKeys])

  const poolAddresses: (string | undefined)[] = useAsync(
    async () => {
      const v3CoreFactoryAddress = chainId && V3_CORE_FACTORY_ADDRESSES[chainId]

      const mapped = transformed.map(async (value) => {
        if (!v3CoreFactoryAddress || !value) return undefined
        const invoke = await Uni_Query.computePoolAddress(
          {
            factoryAddress: v3CoreFactoryAddress,
            tokenA: mapToken(value[0]),
            tokenB: mapToken(value[1]),
            fee: value[2],
          },
          client
        )
        if (invoke.error) throw invoke.error
        return invoke.data
      })
      return Promise.all(mapped)
    },
    [chainId, transformed, client],
    []
  )

  const slot0s = useMultipleContractSingleData(poolAddresses, POOL_STATE_INTERFACE, 'slot0')
  const liquidities = useMultipleContractSingleData(poolAddresses, POOL_STATE_INTERFACE, 'liquidity')

  return useAsync<[PoolState, Pool | null][]>(
    async () => {
      const mapped = poolKeys.map(async (_key, index): Promise<[PoolState, Pool | null]> => {
        const [token0, token1, fee] = transformed[index] ?? []
        if (!token0 || !token1 || fee === undefined) return [PoolState.INVALID, null]

        const { result: slot0, loading: slot0Loading, valid: slot0Valid } = slot0s[index]
        const { result: liquidity, loading: liquidityLoading, valid: liquidityValid } = liquidities[index]

        if (!slot0Valid || !liquidityValid) return [PoolState.INVALID, null]
        if (slot0Loading || liquidityLoading) return [PoolState.LOADING, null]

        if (!slot0 || !liquidity) return [PoolState.NOT_EXISTS, null]

        if (!slot0.sqrtPriceX96 || slot0.sqrtPriceX96.eq(0)) return [PoolState.NOT_EXISTS, null]

        try {
          const invoke = await Uni_Query.createPool(
            {
              tokenA: mapToken(token0),
              tokenB: mapToken(token1),
              fee,
              sqrtRatioX96: slot0.sqrtPriceX96,
              liquidity: liquidity[0],
              tickCurrent: slot0.tick,
            },
            client
          )
          if (invoke.error) throw invoke.error
          const pool = invoke.data as Uni_Pool
          return [PoolState.EXISTS, pool]
        } catch (error) {
          console.error('Error when constructing the pool', error)
          return [PoolState.NOT_EXISTS, null]
        }
      })
      return Promise.all(mapped)
    },
    [liquidities, poolKeys, slot0s, transformed, client],
    [[PoolState.LOADING, null]]
  )
}

export function usePool(
  currencyA: Currency | undefined,
  currencyB: Currency | undefined,
  feeAmount: FeeAmountEnum | undefined
): [PoolState, Pool | null] {
  const poolKeys: [Currency | undefined, Currency | undefined, FeeAmountEnum | undefined][] = useMemo(
    () => [[currencyA, currencyB, feeAmount]],
    [currencyA, currencyB, feeAmount]
  )

  return usePools(poolKeys)[0]
}
