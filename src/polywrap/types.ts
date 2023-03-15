// NOTE: this should be auto-generated in the future

export enum W3ChainId {
  MAINNET = 0,
  ROPSTEN = 1,
  RINKEBY = 2,
  GÖRLI = 3,
  KOVAN = 4
}

export enum W3TradeType {
  EXACT_INPUT = 0,
  EXACT_OUTPUT = 1
}

export interface W3Pair {
  tokenAmount0: W3TokenAmount
  tokenAmount1: W3TokenAmount
}

export interface W3TokenAmount {
  token: W3Token
  amount: string
}

export interface W3Token {
  chainId?: W3ChainId
  address: string
  currency: W3Currency
}

export interface W3Trade {
  route: W3Route
  inputAmount: W3TokenAmount
  outputAmount: W3TokenAmount
  tradeType: W3TradeType
}

export interface W3Currency {
  decimals: number
  symbol?: string
  name?: string
}

export interface W3Route {
  path: W3Token[]
  pairs: W3Pair[]
  input: W3Token
  output: W3Token
}

export interface W3BestTradeOptions {
  maxNumResults?: number
  maxHops?: number
}

export interface W3SwapParameters {
  methodName: string
  args: string[]
  value: string
}

export interface W3TradeOptions {
  allowedSlippage: string
  recipient: string
  unixTimestamp: number
  ttl?: number
  deadline?: number
  feeOnTransfer?: boolean
}

export interface W3TxOverrides {
  gasPrice?: string
  gasLimit?: string
}

export interface W3TxResponse {
  hash: string
  to?: string
  from: string
  nonce: number
  gasLimit: string
  gasPrice: string
  data: string
  value: string
  chainId: number
  blockNumber?: string
  blockHash?: string
  timestamp?: number
  confirmations: number
  raw?: string
  r?: string
  s?: string
  v?: number
  type?: number
  accessList?: W3Access[]
}

export interface W3StaticTxResult {
  result: string
  error: boolean
}

export interface W3Log {
  blockNumber: string
  blockHash: string
  transactionIndex: number
  removed: boolean
  address: string
  data: string
  topics: string[]
  transactionHash: string
  logIndex: number
}

export interface W3Access {
  address: string
  storageKeys: string[]
}
