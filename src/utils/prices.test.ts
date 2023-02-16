import { PolywrapClient } from '@polywrap/client-js'
import { CurrencyAmount, Percent, Token } from '@uniswap/sdk-core'
import JSBI from 'jsbi'

import {
  Uni_ChainIdEnum,
  Uni_FeeAmountEnum,
  Uni_Module,
  Uni_Pool,
  Uni_Token,
  Uni_Trade,
  Uni_TradeTypeEnum,
} from '../wrap'
import { computeRealizedLPFeeAmount, warningSeverity } from './prices'

const token1 = new Token(1, '0x0000000000000000000000000000000000000001', 18)

const polyToken1: Uni_Token = {
  chainId: Uni_ChainIdEnum.MAINNET,
  address: '0x0000000000000000000000000000000000000001',
  currency: {
    decimals: 18,
  },
}
const polyToken2: Uni_Token = {
  chainId: Uni_ChainIdEnum.MAINNET,
  address: '0x0000000000000000000000000000000000000002',
  currency: {
    decimals: 18,
  },
}
const polyToken3: Uni_Token = {
  chainId: Uni_ChainIdEnum.MAINNET,
  address: '0x0000000000000000000000000000000000000003',
  currency: {
    decimals: 18,
  },
}

const currencyAmount = (token: Token, amount: number) => CurrencyAmount.fromRawAmount(token, JSBI.BigInt(amount))

const getTrade = async (
  client: PolywrapClient,
  pools: Array<Uni_Pool>,
  inToken: Uni_Token,
  outToken: Uni_Token,
  tradeType: Uni_TradeTypeEnum,
  amount: string
): Promise<Uni_Trade> => {
  const routeInvoke = await Uni_Module.createRoute({ pools, inToken, outToken }, client)
  if (!routeInvoke.ok) throw routeInvoke.error
  const route = routeInvoke.value
  const tradeInvoke = await Uni_Module.createTradeFromRoutes(
    {
      tradeRoutes: [
        {
          route,
          amount: {
            token: tradeType === Uni_TradeTypeEnum.EXACT_INPUT ? inToken : outToken,
            amount,
          },
        },
      ],
      tradeType,
    },
    client
  )
  if (!tradeInvoke.ok) throw tradeInvoke.error
  return tradeInvoke.value
}

describe('prices', () => {
  const client: PolywrapClient = new PolywrapClient()
  let polyPool12: Uni_Pool
  let polyPool13: Uni_Pool

  beforeAll(async () => {
    const polyPool12Invoke = await Uni_Module.createPool(
      {
        tokenA: polyToken1,
        tokenB: polyToken2,
        fee: Uni_FeeAmountEnum.HIGH,
        sqrtRatioX96: '2437312313659959819381354528',
        liquidity: '10272714736694327408',
        tickCurrent: -69633,
      },
      client
    )
    if (!polyPool12Invoke.ok) throw polyPool12Invoke.error
    polyPool12 = polyPool12Invoke.value

    const polyPool13Invoke = await Uni_Module.createPool(
      {
        tokenA: polyToken1,
        tokenB: polyToken3,
        fee: Uni_FeeAmountEnum.MEDIUM,
        sqrtRatioX96: '2437312313659959819381354528',
        liquidity: '10272714736694327408',
        tickCurrent: -69633,
      },
      client
    )
    if (!polyPool13Invoke.ok) throw polyPool13Invoke.error
    polyPool13 = polyPool13Invoke.value
  })

  describe('#computeRealizedLPFeeAmount', () => {
    it('returns undefined for undefined', () => {
      expect(computeRealizedLPFeeAmount(undefined)).toEqual(undefined)
    })

    it.skip('correct realized lp fee for single hop on v3', async () => {
      const trade: Uni_Trade = await getTrade(
        client,
        [polyPool12],
        polyToken1,
        polyToken2,
        Uni_TradeTypeEnum.EXACT_INPUT,
        '1000'
      )
      expect(computeRealizedLPFeeAmount(trade)).toEqual(currencyAmount(token1, 10)) // 3% realized fee
    })

    it.skip('correct realized lp fee single hop v3 #2', async () => {
      const trade: Uni_Trade = await getTrade(
        client,
        [polyPool13],
        polyToken1,
        polyToken3,
        Uni_TradeTypeEnum.EXACT_INPUT,
        '1000'
      )
      expect(computeRealizedLPFeeAmount(trade)).toEqual(currencyAmount(token1, 8))
    })

    describe('#warningSeverity', () => {
      it('max for undefined', () => {
        expect(warningSeverity(undefined)).toEqual(4)
      })
      it('correct for 0', () => {
        expect(warningSeverity(new Percent(0))).toEqual(0)
      })
      it('correct for 0.5', () => {
        expect(warningSeverity(new Percent(5, 1000))).toEqual(0)
      })
      it('correct for 5', () => {
        expect(warningSeverity(new Percent(5, 100))).toEqual(2)
      })
      it('correct for 50', () => {
        expect(warningSeverity(new Percent(5, 10))).toEqual(4)
      })
    })
  })
})
