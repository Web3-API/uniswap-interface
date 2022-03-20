import { Price, Token } from '@uniswap/sdk-core'
import { Web3ApiClient } from '@web3api/client-js'

import { Uni_Price, Uni_Query } from '../polywrap'
import { mapToken, reverseMapPrice } from '../polywrap-utils'

export async function getTickToPrice(
  client: Web3ApiClient,
  baseToken?: Token,
  quoteToken?: Token,
  tick?: number
): Promise<Price<Token, Token> | undefined> {
  if (!baseToken || !quoteToken || typeof tick !== 'number') {
    return undefined
  }
  return Uni_Query.tickToPrice(
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
