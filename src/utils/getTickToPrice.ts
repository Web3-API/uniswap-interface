import { PolywrapClient } from '@polywrap/client-js'
import { Price, Token } from '@uniswap/sdk-core'

import { mapToken, reverseMapPrice } from '../polywrap-utils'
import { Uni_Module, Uni_Price } from '../wrap'

export async function getTickToPrice(
  client: PolywrapClient,
  baseToken?: Token,
  quoteToken?: Token,
  tick?: number
): Promise<Price<Token, Token> | undefined> {
  if (!baseToken || !quoteToken || typeof tick !== 'number') {
    return undefined
  }
  return Uni_Module.tickToPrice(
    {
      baseToken: mapToken(baseToken),
      quoteToken: mapToken(quoteToken),
      tick,
    },
    client
  ).then((res) => {
    if (res.error) throw res.error
    return reverseMapPrice(res.data as Uni_Price)
  })
}
