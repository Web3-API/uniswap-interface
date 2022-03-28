import { Currency } from '@uniswap/sdk-core'
import { Web3ApiClient } from '@web3api/client-js'
import { useWeb3ApiClient } from '@web3api/react'
import { useEffect, useState } from 'react'

import { Uni_Pool, Uni_Query, Uni_Route, Uni_Token } from '../polywrap'
import { mapToken, tokenEquals } from '../polywrap-utils'
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
  client: Web3ApiClient,
  currencyIn: Uni_Token,
  currencyOut: Uni_Token,
  pools: Uni_Pool[],
  chainId: number,
  currentPath: Uni_Pool[] = [],
  allPaths: Uni_Route[] = [],
  startCurrencyIn: Uni_Token = currencyIn,
  maxHops = 2
): Promise<Uni_Route[]> {
  const tokenInInvoke = await Uni_Query.wrapToken({ token: currencyIn }, client)
  if (tokenInInvoke.error) throw tokenInInvoke.error
  const tokenIn = tokenInInvoke.data as Uni_Token

  const tokenOutInvoke = await Uni_Query.wrapToken({ token: currencyOut }, client)
  if (tokenOutInvoke.error) throw tokenOutInvoke.error
  const tokenOut = tokenOutInvoke.data as Uni_Token

  if (!tokenIn || !tokenOut) throw new Error('Missing tokenIn/tokenOut')

  for (const pool of pools) {
    const involvedInvoke = await Uni_Query.poolInvolvesToken({ pool, token: tokenIn }, client)
    if (involvedInvoke.error) throw involvedInvoke.error
    const involved = involvedInvoke.data as boolean
    if (!involved || currentPath.find((pathPool) => poolEquals(pool, pathPool))) continue

    const token0IsTokenInInvoke = await Uni_Query.tokenEquals({ tokenA: pool.token0, tokenB: tokenIn }, client)
    if (token0IsTokenInInvoke.error) throw token0IsTokenInInvoke.error
    const token0IsTokenIn = token0IsTokenInInvoke.data as boolean
    const outputToken = token0IsTokenIn ? pool.token1 : pool.token0

    const outputTokenIsTokenOutInvoke = await Uni_Query.tokenEquals({ tokenA: outputToken, tokenB: tokenOut }, client)
    if (outputTokenIsTokenOutInvoke.error) throw outputTokenIsTokenOutInvoke.error
    const outputTokenIsTokenOut = outputTokenIsTokenOutInvoke.data as boolean

    if (outputTokenIsTokenOut) {
      const routeInvoke = await Uni_Query.createRoute(
        {
          pools: [...currentPath, pool],
          inToken: startCurrencyIn,
          outToken: currencyOut,
        },
        client
      )
      if (routeInvoke.error) throw routeInvoke.error
      allPaths.push(routeInvoke.data as Uni_Route)
    } else if (maxHops > 1) {
      computeAllRoutes(
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
  const client: Web3ApiClient = useWeb3ApiClient()

  const [routes, setRoutes] = useState<{ loading: boolean; routes: Uni_Route[] }>({ loading: true, routes: [] })

  useEffect(() => {
    console.log('useAllV3Routes - src/hooks/useAllV3Routes')
    if (poolsLoading || !chainId || !pools || !currencyIn || !currencyOut) {
      setRoutes({ loading: true, routes: [] })
    } else {
      const currIn: Uni_Token = mapToken(currencyIn)
      const currOut: Uni_Token = mapToken(currencyOut)
      computeAllRoutes(client, currIn, currOut, pools, chainId, [], [], currIn, 2).then((routes) => {
        setRoutes({ loading: false, routes })
      })
    }
  }, [chainId, currencyIn, currencyOut, pools, poolsLoading, client])
  // todo: replace deps fun?
  return routes
}
