import { Currency, CurrencyAmount, TradeType } from '@uniswap/sdk-core'
import { Web3ApiClient } from '@web3api/client-js'
import { useWeb3ApiClient } from '@web3api/react'
import { SupportedChainId } from 'constants/chains'
import JSBI from 'jsbi'
import { useMemo } from 'react'
import { TradeState } from 'state/routing/types'

import {
  Uni_MethodParameters,
  Uni_Query,
  Uni_Route as Route,
  Uni_TokenAmount as TokenAmount,
  Uni_Trade as Trade,
  Uni_TradeTypeEnum as TradeTypeEnum,
} from '../polywrap'
import { mapTokenAmount, mapTradeType, useAsync } from '../polywrap-utils'
import { useSingleContractWithCallData } from '../state/multicall/hooks'
import { useAllV3Routes } from './useAllV3Routes'
import { useV3Quoter } from './useContract'
import { useActiveWeb3React } from './web3'

const QUOTE_GAS_OVERRIDES: { [chainId: number]: number } = {
  [SupportedChainId.ARBITRUM_ONE]: 25_000_000,
  [SupportedChainId.ARBITRUM_RINKEBY]: 25_000_000,
}

const DEFAULT_GAS_QUOTE = 2_000_000

/**
 * Returns the best v3 trade for a desired swap
 * @param tradeType whether the swap is an exact in/out
 * @param amountSpecified the exact amount to swap in/out
 * @param otherCurrency the desired output/payment currency
 */
export function useClientSideV3Trade<TTradeType extends TradeType>(
  tradeType: TTradeType,
  amountSpecified?: CurrencyAmount<Currency>,
  otherCurrency?: Currency
): { state: TradeState; trade: Trade | undefined } {
  const client: Web3ApiClient = useWeb3ApiClient()

  const [currencyIn, currencyOut] = useMemo(
    () =>
      tradeType === TradeType.EXACT_INPUT
        ? [amountSpecified?.currency, otherCurrency]
        : [otherCurrency, amountSpecified?.currency],
    [tradeType, amountSpecified, otherCurrency]
  )
  const { routes, loading: routesLoading } = useAllV3Routes(currencyIn, currencyOut)

  const quoter = useV3Quoter()
  const { chainId } = useActiveWeb3React()
  const callParams = useAsync(
    async () => {
      if (amountSpecified) {
        const calldatas = routes.map(async (route) => {
          const invoke = await Uni_Query.quoteCallParameters(
            {
              route,
              amount: mapTokenAmount(amountSpecified) as TokenAmount,
              tradeType: mapTradeType(tradeType),
            },
            client
          )
          if (invoke.error) throw invoke.error
          const params = invoke.data as Uni_MethodParameters
          return params.calldata
        })
        return Promise.all(calldatas)
      }
      return []
    },
    [amountSpecified, routes, client],
    []
  )
  const quotesResults = useSingleContractWithCallData(quoter, callParams, {
    gasRequired: chainId ? QUOTE_GAS_OVERRIDES[chainId] ?? DEFAULT_GAS_QUOTE : undefined,
  })

  return useAsync(
    async () => {
      if (
        !amountSpecified ||
        !currencyIn ||
        !currencyOut ||
        quotesResults.some(({ valid }) => !valid) ||
        // skip when tokens are the same
        (tradeType === TradeType.EXACT_INPUT
          ? amountSpecified.currency.equals(currencyOut)
          : amountSpecified.currency.equals(currencyIn))
      ) {
        return {
          state: TradeState.INVALID,
          trade: undefined,
        }
      }

      if (routesLoading || quotesResults.some(({ loading }) => loading)) {
        return {
          state: TradeState.LOADING,
          trade: undefined,
        }
      }

      const { bestRoute, amountIn, amountOut } = quotesResults.reduce(
        (
          currentBest: {
            bestRoute: Route | null
            amountIn: CurrencyAmount<Currency> | null
            amountOut: CurrencyAmount<Currency> | null
          },
          { result },
          i
        ) => {
          if (!result) return currentBest

          // overwrite the current best if it's not defined or if this route is better
          if (tradeType === TradeType.EXACT_INPUT) {
            const amountOut = CurrencyAmount.fromRawAmount(currencyOut, result.amountOut.toString())
            if (currentBest.amountOut === null || JSBI.lessThan(currentBest.amountOut.quotient, amountOut.quotient)) {
              return {
                bestRoute: routes[i],
                amountIn: amountSpecified,
                amountOut,
              }
            }
          } else {
            const amountIn = CurrencyAmount.fromRawAmount(currencyIn, result.amountIn.toString())
            if (currentBest.amountIn === null || JSBI.greaterThan(currentBest.amountIn.quotient, amountIn.quotient)) {
              return {
                bestRoute: routes[i],
                amountIn,
                amountOut: amountSpecified,
              }
            }
          }

          return currentBest
        },
        {
          bestRoute: null,
          amountIn: null,
          amountOut: null,
        }
      )

      if (!bestRoute || !amountIn || !amountOut) {
        return {
          state: TradeState.NO_ROUTE_FOUND,
          trade: undefined,
        }
      }

      const tradeInvoke = await Uni_Query.createTradeFromRoute(
        {
          tradeRoute: {
            route: bestRoute,
            amount: (mapTradeType(tradeType) === TradeTypeEnum.EXACT_INPUT
              ? mapTokenAmount(amountIn)
              : mapTokenAmount(amountOut)) as TokenAmount,
          },
          tradeType: mapTradeType(tradeType),
        },
        client
      )
      if (tradeInvoke.error) throw tradeInvoke.error
      const trade = tradeInvoke.data as Trade

      return {
        state: TradeState.VALID,
        trade,
      }
    },
    [amountSpecified, currencyIn, currencyOut, quotesResults, routes, routesLoading, tradeType, client],
    {
      state: TradeState.LOADING,
      trade: undefined,
    }
  )
}
