import { Currency } from '@uniswap/sdk-core'

import { PolywrapDapp, Pool, Route, Token, Uniswap } from '../polywrap'
import { mapToken, tokenEquals, useAsync, usePolywrapDapp } from '../polywrap-utils'
import { useV3SwapPools } from './useV3SwapPools'
import { useActiveWeb3React } from './web3'

/**
 * Returns true if poolA is equivalent to poolB
 * @param poolA one of the two pools
 * @param poolB the other pool
 */
function poolEquals(poolA: Pool, poolB: Pool): boolean {
  return (
    poolA === poolB ||
    (tokenEquals(poolA.token0, poolB.token0) && tokenEquals(poolA.token1, poolB.token1) && poolA.fee === poolB.fee)
  )
}

async function computeAllRoutes(
  uni: Uniswap,
  currencyIn: Token,
  currencyOut: Token,
  pools: Pool[],
  chainId: number,
  currentPath: Pool[] = [],
  allPaths: Route[] = [],
  startCurrencyIn: Token = currencyIn,
  maxHops = 2
): Promise<Route[]> {
  const tokenIn = await uni.query.wrapToken({ token: currencyIn })
  const tokenOut = await uni.query.wrapToken({ token: currencyOut })
  if (!tokenIn || !tokenOut) throw new Error('Missing tokenIn/tokenOut')

  for (const pool of pools) {
    const involved = await uni.query.poolInvolvesToken({ pool, token: tokenIn })
    if (!involved || currentPath.find((pathPool) => poolEquals(pool, pathPool))) continue

    const outputToken = (await uni.query.tokenEquals({ tokenA: pool.token0, tokenB: tokenIn }))
      ? pool.token1
      : pool.token0
    if (await uni.query.tokenEquals({ tokenA: outputToken, tokenB: tokenOut })) {
      allPaths.push(
        await uni.query.createRoute({
          pools: [...currentPath, pool],
          inToken: startCurrencyIn,
          outToken: currencyOut,
        })
      )
    } else if (maxHops > 1) {
      computeAllRoutes(
        uni,
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
export function useAllV3Routes(currencyIn?: Currency, currencyOut?: Currency): { loading: boolean; routes: Route[] } {
  const { chainId } = useActiveWeb3React()
  const { pools, loading: poolsLoading } = useV3SwapPools(currencyIn, currencyOut)
  const dapp: PolywrapDapp = usePolywrapDapp()

  return useAsync(
    async () => {
      if (poolsLoading || !chainId || !pools || !currencyIn || !currencyOut) return { loading: true, routes: [] }

      const currIn: Token = mapToken(currencyIn)
      const currOut: Token = mapToken(currencyOut)

      const routes = await computeAllRoutes(dapp.uniswap, currIn, currOut, pools, chainId, [], [], currIn, 2)
      return { loading: false, routes }
    },
    [chainId, currencyIn, currencyOut, pools, poolsLoading],
    { loading: true, routes: [] }
  )
}
