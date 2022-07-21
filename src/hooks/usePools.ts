import { Interface } from '@ethersproject/abi'
import { PolywrapClient } from '@polywrap/client-js'
import { usePolywrapClient } from '@polywrap/react'
import { Currency, Token } from '@uniswap/sdk-core'
import { abi as IUniswapV3PoolStateABI } from '@uniswap/v3-core/artifacts/contracts/interfaces/pool/IUniswapV3PoolState.sol/IUniswapV3PoolState.json'
import JSBI from 'jsbi'
import { useEffect, useMemo, useRef, useState } from 'react'

import { V3_CORE_FACTORY_ADDRESSES } from '../constants/addresses'
import { mapToken, tokenEquals } from '../polywrap-utils'
import { CancelablePromise, makeCancelable } from '../polywrap-utils/makeCancelable'
import { useMultipleContractSingleData } from '../state/multicall/hooks'
import { IUniswapV3PoolStateInterface } from '../types/v3/IUniswapV3PoolState'
import { Uni_FeeAmountEnum, Uni_Module, Uni_Pool, Uni_Token } from '../wrap'
import { useActiveWeb3React } from './web3'

const POOL_STATE_INTERFACE = new Interface(IUniswapV3PoolStateABI) as IUniswapV3PoolStateInterface

export enum PoolState {
  LOADING,
  NOT_EXISTS,
  EXISTS,
  INVALID,
}

// Classes are expensive to instantiate, so this caches the recently instantiated pools.
// This avoids re-instantiating pools as the other pools in the same request are loaded.
class PoolCache {
  // Evict after 128 entries. Empirically, a swap uses 64 entries.
  private static MAX_ENTRIES = 128

  // These are FIFOs, using unshift/pop. This makes recent entries faster to find.
  private static pools: Uni_Pool[] = []
  private static addresses: { key: string; address: string }[] = []

  static async getPoolAddress(
    factoryAddress: string,
    tokenA: Uni_Token,
    tokenB: Uni_Token,
    fee: Uni_FeeAmountEnum,
    client: PolywrapClient
  ): Promise<string | undefined> {
    if (this.addresses.length > this.MAX_ENTRIES) {
      this.addresses = this.addresses.slice(0, this.MAX_ENTRIES / 2)
    }

    const { address: addressA } = tokenA
    const { address: addressB } = tokenB
    const key = `${factoryAddress}:${addressA}:${addressB}:${fee.toString()}`
    const found = this.addresses.find((address) => address.key === key)
    if (found) return found.address

    const invoke = await Uni_Module.computePoolAddress(
      {
        factoryAddress,
        tokenA,
        tokenB,
        fee,
      },
      client
    )
    if (invoke.error) {
      console.error(invoke.error)
      return undefined
    }
    const address = {
      key,
      address: invoke.data as string,
    }

    this.addresses.unshift(address)
    return address.address
  }

  static async getPool(
    tokenA: Uni_Token,
    tokenB: Uni_Token,
    fee: Uni_FeeAmountEnum,
    sqrtPriceX96: string,
    liquidity: string,
    tick: number,
    client: PolywrapClient
  ): Promise<Uni_Pool> {
    if (this.pools.length > this.MAX_ENTRIES) {
      this.pools = this.pools.slice(0, this.MAX_ENTRIES / 2)
    }

    const found = this.pools.find(
      (pool) =>
        tokenEquals(pool.token0, tokenA) &&
        tokenEquals(pool.token1, tokenB) &&
        pool.fee === fee &&
        JSBI.EQ(pool.sqrtRatioX96, sqrtPriceX96) &&
        JSBI.EQ(pool.liquidity, liquidity) &&
        pool.tickCurrent === tick
    )
    if (found) return found

    const invoke = await Uni_Module.createPool(
      {
        tokenA,
        tokenB,
        fee,
        sqrtRatioX96: sqrtPriceX96,
        liquidity,
        tickCurrent: tick,
      },
      client
    )
    if (invoke.error) throw invoke.error
    const pool = invoke.data as Uni_Pool

    this.pools.unshift(pool)
    return pool
  }
}

export function usePools(
  poolKeys: [Currency | undefined, Currency | undefined, Uni_FeeAmountEnum | undefined][]
): [PoolState, Uni_Pool | null][] {
  const { chainId } = useActiveWeb3React()
  const client: PolywrapClient = usePolywrapClient()

  const transformed: ([Token, Token, Uni_FeeAmountEnum] | null)[] = useMemo(() => {
    return poolKeys.map(([currencyA, currencyB, feeAmount]) => {
      if (!chainId || !currencyA || !currencyB || feeAmount === undefined) return null

      const tokenA = currencyA?.wrapped
      const tokenB = currencyB?.wrapped
      if (!tokenA || !tokenB || tokenA.equals(tokenB)) return null
      const [token0, token1] = tokenA.sortsBefore(tokenB) ? [tokenA, tokenB] : [tokenB, tokenA]
      return [token0, token1, feeAmount]
    })
  }, [chainId, poolKeys])

  const [poolAddresses, setPoolAddresses] = useState<(string | undefined)[]>([])
  const cancelableAddresses = useRef<CancelablePromise<(string | undefined)[] | undefined>>()

  useEffect(() => {
    cancelableAddresses.current?.cancel()
    const v3CoreFactoryAddress = chainId && V3_CORE_FACTORY_ADDRESSES[chainId]
    const mapped = transformed.map(async (value) => {
      if (!v3CoreFactoryAddress || !value) {
        return undefined
      }
      return await PoolCache.getPoolAddress(
        v3CoreFactoryAddress,
        mapToken(value[0]),
        mapToken(value[1]),
        value[2],
        client
      )
    })
    cancelableAddresses.current = makeCancelable(Promise.all(mapped))
    cancelableAddresses.current?.promise.then((addresses) => {
      if (!addresses) return
      setPoolAddresses(addresses)
    })
    return () => cancelableAddresses.current?.cancel()
  }, [chainId, transformed, client])

  const slot0s = useMultipleContractSingleData(poolAddresses, POOL_STATE_INTERFACE, 'slot0')
  const liquidities = useMultipleContractSingleData(poolAddresses, POOL_STATE_INTERFACE, 'liquidity')

  const [pools, setPools] = useState<[PoolState, Uni_Pool | null][]>([[PoolState.LOADING, null]])
  const cancelablePools = useRef<CancelablePromise<[PoolState, Uni_Pool | null][] | undefined>>()

  useEffect(() => {
    cancelablePools.current?.cancel()
    const mapped = poolKeys.map(async (_key, index): Promise<[PoolState, Uni_Pool | null]> => {
      const [token0, token1, fee] = transformed[index] ?? []
      if (!token0 || !token1 || fee === undefined || !slot0s[index]) return [PoolState.INVALID, null]

      const { result: slot0, loading: slot0Loading, valid: slot0Valid } = slot0s[index]
      const { result: liquidity, loading: liquidityLoading, valid: liquidityValid } = liquidities[index]

      if (!slot0Valid || !liquidityValid) return [PoolState.INVALID, null]
      if (slot0Loading || liquidityLoading) return [PoolState.LOADING, null]

      if (!slot0 || !liquidity) return [PoolState.NOT_EXISTS, null]

      if (!slot0.sqrtPriceX96 || slot0.sqrtPriceX96.eq(0)) return [PoolState.NOT_EXISTS, null]

      try {
        const pool = await PoolCache.getPool(
          mapToken(token0),
          mapToken(token1),
          fee,
          slot0.sqrtPriceX96.toString(),
          liquidity[0].toString(),
          parseInt(slot0.tick),
          client
        )
        return [PoolState.EXISTS, pool]
      } catch (error) {
        console.error('Error when constructing the pool', error)
        return [PoolState.NOT_EXISTS, null]
      }
    })
    cancelablePools.current = makeCancelable(Promise.all(mapped))
    cancelablePools.current?.promise.then((res) => {
      if (!res) return
      setPools(res)
    })
    return () => cancelablePools.current?.cancel()
  }, [liquidities, poolKeys, slot0s, transformed, client])

  return pools
}

export function usePool(
  currencyA: Currency | undefined,
  currencyB: Currency | undefined,
  feeAmount: Uni_FeeAmountEnum | undefined
): [PoolState, Uni_Pool | null] {
  const poolKeys: [Currency | undefined, Currency | undefined, Uni_FeeAmountEnum | undefined][] = useMemo(
    () => [[currencyA, currencyB, feeAmount]],
    [currencyA, currencyB, feeAmount]
  )

  return usePools(poolKeys)[0]
}
