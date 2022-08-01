import { BigNumber } from '@ethersproject/bignumber'
import { Currency, CurrencyAmount } from '@uniswap/sdk-core'
import { useSingleCallResult } from 'lib/hooks/multicall'
import useBlockNumber from 'lib/hooks/useBlockNumber'
import { useEffect, useState } from 'react'
import { unwrappedToken } from 'utils/unwrappedToken'

import { reverseMapToken } from '../polywrap-utils'
import { Uni_Pool as Pool } from '../wrap'
import { useV3NFTPositionManagerContract } from './useContract'

const MAX_UINT128 = BigNumber.from(2).pow(128).sub(1)

// compute current + counterfactual fees for a v3 position
export function useV3PositionFees(
  pool?: Pool,
  tokenId?: BigNumber,
  asWETH = false
): [CurrencyAmount<Currency>, CurrencyAmount<Currency>] | [undefined, undefined] {
  const positionManager = useV3NFTPositionManagerContract(false)
  const owner: string | undefined = useSingleCallResult(tokenId ? positionManager : null, 'ownerOf', [tokenId])
    .result?.[0]

  const tokenIdHexString = tokenId?.toHexString()
  const latestBlockNumber = useBlockNumber()

  // we can't use multicall for this because we need to simulate the call from a specific address
  // latestBlockNumber is included to ensure data stays up-to-date every block
  const [amounts, setAmounts] = useState<[BigNumber, BigNumber] | undefined>()
  useEffect(() => {
    if (positionManager && tokenIdHexString && owner) {
      positionManager.callStatic
        .collect(
          {
            tokenId: tokenIdHexString,
            recipient: owner, // some tokens might fail if transferred to address(0)
            amount0Max: MAX_UINT128,
            amount1Max: MAX_UINT128,
          },
          { from: owner } // need to simulate the call as the owner
        )
        .then((results) => {
          setAmounts([results.amount0, results.amount1])
        })
    }
  }, [positionManager, tokenIdHexString, owner, latestBlockNumber])

  if (pool && amounts) {
    const token0 = reverseMapToken(pool.token0) as Currency
    const token1 = reverseMapToken(pool.token1) as Currency
    return [
      CurrencyAmount.fromRawAmount(asWETH ? token0 : unwrappedToken(token0), amounts[0].toString()),
      CurrencyAmount.fromRawAmount(asWETH ? token1 : unwrappedToken(token1), amounts[1].toString()),
    ]
  } else {
    return [undefined, undefined]
  }
}
