// NOTE: This is generated by 'w3 codegen', DO NOT MODIFY

import { BasePolywrapDapp, BasePolywrapDappConfig, Client, ExtensionConfig } from '@web3api/core-js'

import { Uniswap } from './uniswap'

export interface PolywrapDappConfig extends BasePolywrapDappConfig {
  uniswap?: ExtensionConfig
}

export class PolywrapDapp implements BasePolywrapDapp {
  readonly client: Client
  readonly uniswap: Uniswap

  constructor(client: Client, config?: PolywrapDappConfig) {
    this.client = client
    this.uniswap = new Uniswap(this.client, config?.uniswap)
  }
}
