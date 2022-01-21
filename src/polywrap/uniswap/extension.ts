// NOTE: This is generated by 'w3 codegen', DO NOT MODIFY

import { Client, Extension, ExtensionConfig, SanitizedExtensionConfig, Uri } from '@web3api/core-js'

import { UniswapMutationExtension, UniswapMutationModule } from './mutation'
import { UniswapQueryExtension, UniswapQueryModule } from './query'

export class Uniswap implements Extension {
  private client: Client
  readonly buildUri: Uri = new Uri('w3://fs//Users/kris/WebstormProjects/integrations/uniswapv3/wrapper/build')
  readonly config: SanitizedExtensionConfig
  readonly mutation: UniswapMutationModule
  readonly query: UniswapQueryModule

  constructor(client: Client, config?: ExtensionConfig) {
    this.client = client
    this.config = this.sanitizeConfig(config)
    this.mutation = new UniswapMutationExtension(this.client, this.config.uri)
    this.query = new UniswapQueryExtension(this.client, this.config.uri)
    this.validate()
  }

  private validate(): boolean {
    // Not implemented
    return true
  }

  private sanitizeConfig(userConfig?: ExtensionConfig): SanitizedExtensionConfig {
    const sanitized: ExtensionConfig = {}
    sanitized.uri = this.sanitizeUri(userConfig?.uri) ?? this.buildUri
    return sanitized as SanitizedExtensionConfig
  }

  private sanitizeUri(uri?: Uri | string): Uri | undefined {
    if (uri && typeof uri === 'string') {
      uri = new Uri(uri)
    }
    return uri as Uri | undefined
  }
}
