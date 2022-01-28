import { Trans } from '@lingui/macro'
import { Currency, CurrencyAmount, Percent } from '@uniswap/sdk-core'
import { useToken } from 'hooks/Tokens'
import { usePool } from 'hooks/usePools'
import { useV3PositionFees } from 'hooks/useV3PositionFees'
import { useActiveWeb3React } from 'hooks/web3'
import { ReactNode, useCallback } from 'react'
import { useAppDispatch, useAppSelector } from 'state/hooks'
import { PositionDetails } from 'types/position'
import { unwrappedToken } from 'utils/unwrappedToken'

import { PolywrapDapp, Position, TokenAmount } from '../../../polywrap'
import { useAsync, usePolywrapDapp } from '../../../polywrap-utils'
import { AppState } from '../../index'
import { selectPercent } from './actions'

export function useBurnV3State(): AppState['burnV3'] {
  return useAppSelector((state) => state.burnV3)
}

export function useDerivedV3BurnInfo(
  position?: PositionDetails,
  asWETH = false
): {
  position?: Position
  liquidityPercentage?: Percent
  liquidityValue0?: CurrencyAmount<Currency>
  liquidityValue1?: CurrencyAmount<Currency>
  feeValue0?: CurrencyAmount<Currency>
  feeValue1?: CurrencyAmount<Currency>
  outOfRange: boolean
  error?: ReactNode
} {
  const dapp: PolywrapDapp = usePolywrapDapp()
  const { account } = useActiveWeb3React()
  const { percent } = useBurnV3State()

  const token0 = useToken(position?.token0)
  const token1 = useToken(position?.token1)

  const [, pool] = usePool(token0 ?? undefined, token1 ?? undefined, position?.fee)

  const { positionSDK, amount0, amount1 } = useAsync(
    async (): Promise<{ positionSDK?: Position; amount0?: TokenAmount; amount1?: TokenAmount }> => {
      if (
        pool &&
        position?.liquidity &&
        typeof position?.tickLower === 'number' &&
        typeof position?.tickUpper === 'number'
      ) {
        const positionSDK = await dapp.uniswap.query.createPosition({
          pool,
          liquidity: position.liquidity.toString(),
          tickLower: position.tickLower,
          tickUpper: position.tickUpper,
        })
        return {
          positionSDK,
          amount0: await dapp.uniswap.query.positionAmount0({ position: positionSDK }),
          amount1: await dapp.uniswap.query.positionAmount1({ position: positionSDK }),
        }
      }
      return {
        positionSDK: undefined,
        amount0: undefined,
        amount1: undefined,
      }
    },
    [pool, position],
    {
      positionSDK: undefined,
      amount0: undefined,
      amount1: undefined,
    }
  )

  const liquidityPercentage = new Percent(percent, 100)

  const discountedAmount0 = amount0 ? liquidityPercentage.multiply(amount0.amount).quotient : undefined
  const discountedAmount1 = amount1 ? liquidityPercentage.multiply(amount1.amount).quotient : undefined

  const liquidityValue0 =
    token0 && discountedAmount0
      ? CurrencyAmount.fromRawAmount(asWETH ? token0 : unwrappedToken(token0), discountedAmount0)
      : undefined
  const liquidityValue1 =
    token1 && discountedAmount1
      ? CurrencyAmount.fromRawAmount(asWETH ? token1 : unwrappedToken(token1), discountedAmount1)
      : undefined

  const [feeValue0, feeValue1] = useV3PositionFees(pool ?? undefined, position?.tokenId, asWETH)

  const outOfRange =
    pool && position ? pool.tickCurrent < position.tickLower || pool.tickCurrent > position.tickUpper : false

  let error: ReactNode | undefined
  if (!account) {
    error = <Trans>Connect Wallet</Trans>
  }
  if (percent === 0) {
    error = error ?? <Trans>Enter a percent</Trans>
  }
  return {
    position: positionSDK,
    liquidityPercentage,
    liquidityValue0,
    liquidityValue1,
    feeValue0,
    feeValue1,
    outOfRange,
    error,
  }
}

export function useBurnV3ActionHandlers(): {
  onPercentSelect: (percent: number) => void
} {
  const dispatch = useAppDispatch()

  const onPercentSelect = useCallback(
    (percent: number) => {
      dispatch(selectPercent({ percent }))
    },
    [dispatch]
  )

  return {
    onPercentSelect,
  }
}
