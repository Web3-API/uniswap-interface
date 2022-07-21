import { PolywrapClient } from '@polywrap/client-js'
import { usePolywrapClient } from '@polywrap/react'
import { Currency } from '@uniswap/sdk-core'
import { useEffect, useRef, useState } from 'react'

import { mapToken, tokenEquals } from '../polywrap-utils'
import { CancelablePromise, makeCancelable } from '../polywrap-utils/makeCancelable'
import { Uni_Module, Uni_Pool, Uni_Route, Uni_Token } from '../wrap'
import { useV3SwapPools } from './useV3SwapPools'
import { useActiveWeb3React } from './web3'

/**
 * Returns true if poolA is equivalent to poolB
 * @param poolA one of the two pools
 * @param poolB the other pool
 */
function poolEquals(poolA: Uni_Pool, poolB: Uni_Pool): boolean {
  return (
    poolA === poolB ||
    (tokenEquals(poolA.token0, poolB.token0) && tokenEquals(poolA.token1, poolB.token1) && poolA.fee === poolB.fee)
  )
}

async function computeAllRoutes(
  client: PolywrapClient,
  currencyIn: Uni_Token,
  currencyOut: Uni_Token,
  pools: Uni_Pool[],
  chainId: number,
  currentPath: Uni_Pool[] = [],
  allPaths: Uni_Route[] = [],
  startCurrencyIn: Uni_Token = currencyIn,
  maxHops = 2
): Promise<Uni_Route[]> {
  const tokenInInvoke = await Uni_Module.wrapToken({ token: currencyIn }, client)
  if (tokenInInvoke.error) console.error(tokenInInvoke.error)
  const tokenIn = tokenInInvoke.data

  const tokenOutInvoke = await Uni_Module.wrapToken({ token: currencyOut }, client)
  if (tokenOutInvoke.error) console.error(tokenOutInvoke.error)
  const tokenOut = tokenOutInvoke.data

  if (!tokenIn || !tokenOut) throw new Error('Missing tokenIn/tokenOut')

  for (const pool of pools) {
    const token0IsTokenIn = tokenEquals(tokenIn, pool.token0)
    const involved = token0IsTokenIn || tokenEquals(tokenIn, pool.token1)
    if (!involved || currentPath.find((pathPool) => poolEquals(pool, pathPool))) {
      continue
    }
    const outputToken = token0IsTokenIn ? pool.token1 : pool.token0
    const outputTokenIsTokenOut = tokenEquals(outputToken, tokenOut)

    if (outputTokenIsTokenOut) {
      const routeInvoke = await Uni_Module.createRoute(
        {
          pools: [...currentPath, pool],
          inToken: startCurrencyIn,
          outToken: currencyOut,
        },
        client
      )
      if (routeInvoke.error) console.error(routeInvoke.error)
      else allPaths.push(routeInvoke.data as Uni_Route)
    } else if (maxHops > 1) {
      await computeAllRoutes(
        client,
        outputToken,
        currencyOut,
        pools,
        chainId,
        [...currentPath, pool],
        allPaths,
        startCurrencyIn,
        maxHops - 1
      )
    }
  }

  return allPaths
}

/**
 * Returns all the routes from an input currency to an output currency
 * @param currencyIn the input currency
 * @param currencyOut the output currency
 */
export function useAllV3Routes(
  currencyIn?: Currency,
  currencyOut?: Currency
): { loading: boolean; routes: Uni_Route[] } {
  const { chainId } = useActiveWeb3React()
  const { pools, loading: poolsLoading } = useV3SwapPools(currencyIn, currencyOut)
  const client: PolywrapClient = usePolywrapClient()

  const [routes, setRoutes] = useState<{ loading: boolean; routes: Uni_Route[] }>({ loading: true, routes: [] })
  const cancelable = useRef<CancelablePromise<Uni_Route[] | undefined>>()

  useEffect(() => {
    cancelable.current?.cancel()
    if (poolsLoading || !chainId || !pools || !currencyIn || !currencyOut) {
      setRoutes({ loading: true, routes: [] })
    } else {
      const currIn: Uni_Token = mapToken(currencyIn)
      const currOut: Uni_Token = mapToken(currencyOut)
      const routesPromise = computeAllRoutes(client, currIn, currOut, pools, chainId, [], [], currIn, 2)
      cancelable.current = makeCancelable(routesPromise)
      cancelable.current?.promise.then((routes) => {
        if (!routes) return
        setRoutes({ loading: false, routes })
      })
    }
    return () => cancelable.current?.cancel()
  }, [chainId, currencyIn, currencyOut, pools, poolsLoading, client])
  return routes
}
