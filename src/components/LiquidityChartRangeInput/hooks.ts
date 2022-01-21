import { Currency } from '@uniswap/sdk-core'
import { usePoolActiveLiquidity } from 'hooks/usePoolTickData'
import JSBI from 'jsbi'
import { useCallback, useMemo } from 'react'

import { FeeAmountEnum } from '../../polywrap'
import { reverseMapFeeAmount } from '../../polywrap-utils'
import { ChartEntry } from './types'

export interface TickProcessed {
  liquidityActive: JSBI
  price0: string
}

export function useDensityChartData({
  currencyA,
  currencyB,
  feeAmount,
}: {
  currencyA: Currency | undefined
  currencyB: Currency | undefined
  feeAmount: FeeAmountEnum | undefined
}) {
  const { isLoading, isUninitialized, isError, error, data } = usePoolActiveLiquidity(
    currencyA,
    currencyB,
    feeAmount ? reverseMapFeeAmount(feeAmount) : undefined
  )

  const formatData = useCallback(() => {
    if (!data?.length) {
      return undefined
    }

    const newData: ChartEntry[] = []

    for (let i = 0; i < data.length; i++) {
      const t: TickProcessed = data[i]

      const chartEntry = {
        activeLiquidity: parseFloat(t.liquidityActive.toString()),
        price0: parseFloat(t.price0),
      }

      if (chartEntry.activeLiquidity > 0) {
        newData.push(chartEntry)
      }
    }

    return newData
  }, [data])

  return useMemo(() => {
    return {
      isLoading,
      isUninitialized,
      isError,
      error,
      formattedData: !isLoading && !isUninitialized ? formatData() : undefined,
    }
  }, [isLoading, isUninitialized, isError, error, formatData])
}
