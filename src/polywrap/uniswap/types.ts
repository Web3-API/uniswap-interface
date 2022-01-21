// NOTE: This is generated by 'w3 codegen', DO NOT MODIFY

// @ts-noCheck
import { BigInt, Int, Int32, UInt8, UInt32 } from '../baseTypes'

export interface Currency {
  decimals: UInt8
  symbol?: string | null
  name?: string | null
}

export interface Token {
  chainId: ChainId
  address: string
  currency: Currency
}

export interface Route {
  pools: Array<Pool>
  path: Array<Token>
  input: Token
  output: Token
}

export interface Tick {
  index: Int32
  liquidityGross: BigInt
  liquidityNet: BigInt
}

export interface TickListDataProvider {
  ticks: Array<Tick>
}

export interface Pool {
  token0: Token
  token1: Token
  fee: FeeAmount
  sqrtRatioX96: BigInt
  liquidity: BigInt
  tickCurrent: Int32
  tickDataProvider?: TickListDataProvider | null
}

export interface Trade {
  swaps: Array<TradeSwap>
  tradeType: TradeType
  inputAmount: TokenAmount
  outputAmount: TokenAmount
  executionPrice: Price
  priceImpact: string
}

export interface TokenAmount {
  token: Token
  amount: BigInt
}

export interface TradeSwap {
  route: Route
  inputAmount: TokenAmount
  outputAmount: TokenAmount
}

export interface Price {
  baseToken: Token
  quoteToken: Token
  denominator: BigInt
  numerator: BigInt
  price: string
}

export interface SwapOptions {
  slippageTolerance: string
  recipient: string
  deadline: BigInt
  inputTokenPermit?: PermitOptions | null
  sqrtPriceLimitX96?: BigInt | null
  fee?: FeeOptions | null
}

export interface PermitOptions {
  v: PermitV
  r: string
  s: string
  amount?: BigInt | null
  deadline?: BigInt | null
  nonce?: BigInt | null
  expiry?: BigInt | null
}

export interface FeeOptions {
  fee: string
  recipient: string
}

export interface MethodParameters {
  calldata: string
  value: string
}

export interface GasOptions {
  gasPrice?: BigInt | null
  gasLimit?: BigInt | null
}

export interface NextTickResult {
  index: Int32
  found: boolean
}

export interface PoolChangeResult {
  amount: TokenAmount
  nextPool: Pool
}

export interface TradeRoute {
  route: Route
  amount: TokenAmount
}

export interface IncentiveKey {
  rewardToken: Token
  pool: Pool
  startTime: BigInt
  endTime: BigInt
  refundee: string
}

export interface ClaimOptions {
  tokenId: BigInt
  recipient: string
  amount?: BigInt | null
}

export interface FullWithdrawOptions {
  owner: string
  data?: string | null
  tokenId: BigInt
  recipient: string
  amount?: BigInt | null
}

export interface QuoteOptions {
  sqrtPriceLimitX96?: BigInt | null
}

export interface CommonAddLiquidityOptions {
  slippageTolerance: string
  deadline: BigInt
  useNative?: Token | null
  token0Permit?: PermitOptions | null
  token1Permit?: PermitOptions | null
}

export interface AddLiquidityOptions {
  recipient?: string | null
  createPool?: boolean | null
  tokenId?: BigInt | null
  slippageTolerance: string
  deadline: BigInt
  useNative?: Token | null
  token0Permit?: PermitOptions | null
  token1Permit?: PermitOptions | null
}

export interface SafeTransferOptions {
  sender: string
  recipient: string
  tokenId: BigInt
  data?: string | null
}

export interface CollectOptions {
  tokenId: BigInt
  expectedCurrencyOwed0: TokenAmount
  expectedCurrencyOwed1: TokenAmount
  recipient: string
}

export interface NFTPermitOptions {
  v: PermitV
  r: string
  s: string
  deadline: BigInt
  spender: string
}

export interface RemoveLiquidityOptions {
  tokenId: BigInt
  liquidityPercentage: string
  slippageTolerance: string
  deadline: BigInt
  burnToken?: boolean | null
  permit?: NFTPermitOptions | null
  collectOptions: CollectOptions
}

export interface BestTradeOptions {
  maxNumResults?: UInt32 | null
  maxHops?: UInt32 | null
}

export interface Position {
  pool: Pool
  tickLower: Int32
  tickUpper: Int32
  liquidity: BigInt
}

export interface MintAmounts {
  amount0: BigInt
  amount1: BigInt
}

export enum ChainIdEnum {
  MAINNET,
  ROPSTEN,
  RINKEBY,
  GOERLI,
  KOVAN,
  OPTIMISM,
  OPTIMISM_KOVAN,
  ARBITRUM_ONE,
  ARBITRUM_ONE_RINKEBY,
}

export type ChainIdString =
  | 'MAINNET'
  | 'ROPSTEN'
  | 'RINKEBY'
  | 'GOERLI'
  | 'KOVAN'
  | 'OPTIMISM'
  | 'OPTIMISM_KOVAN'
  | 'ARBITRUM_ONE'
  | 'ARBITRUM_ONE_RINKEBY'

export type ChainId = ChainIdEnum | ChainIdString

export enum FeeAmountEnum {
  LOWEST,
  LOW,
  MEDIUM,
  HIGH,
}

export type FeeAmountString = 'LOWEST' | 'LOW' | 'MEDIUM' | 'HIGH'

export type FeeAmount = FeeAmountEnum | FeeAmountString

export enum TradeTypeEnum {
  EXACT_INPUT,
  EXACT_OUTPUT,
}

export type TradeTypeString = 'EXACT_INPUT' | 'EXACT_OUTPUT'

export type TradeType = TradeTypeEnum | TradeTypeString

export enum PermitVEnum {
  v_0,
  v_1,
  v_27,
  v_28,
}

export type PermitVString = 'v_0' | 'v_1' | 'v_27' | 'v_28'

export type PermitV = PermitVEnum | PermitVString

export enum RoundingEnum {
  ROUND_DOWN,
  ROUND_HALF_UP,
  ROUND_UP,
}

export type RoundingString = 'ROUND_DOWN' | 'ROUND_HALF_UP' | 'ROUND_UP'

export type Rounding = RoundingEnum | RoundingString

/// Imported Objects START ///

/* URI: "w3://ens/ethereum.web3api.eth" */
export interface Ethereum_Connection {
  node?: string | null
  networkNameOrChainId?: string | null
}

/* URI: "w3://ens/ethereum.web3api.eth" */
export interface Ethereum_TxOverrides {
  gasLimit?: BigInt | null
  gasPrice?: BigInt | null
  value?: BigInt | null
}

/* URI: "w3://ens/ethereum.web3api.eth" */
export interface Ethereum_TxResponse {
  hash: string
  to?: string | null
  from: string
  nonce: UInt32
  gasLimit: BigInt
  gasPrice?: BigInt | null
  data: string
  value: BigInt
  chainId: UInt32
  blockNumber?: BigInt | null
  blockHash?: string | null
  timestamp?: UInt32 | null
  confirmations: UInt32
  raw?: string | null
  r?: string | null
  s?: string | null
  v?: UInt32 | null
  type?: UInt32 | null
  accessList?: Array<Ethereum_Access> | null
}

/* URI: "w3://ens/ethereum.web3api.eth" */
export interface Ethereum_Access {
  address: string
  storageKeys: Array<string>
}

/* URI: "w3://ens/ethereum.web3api.eth" */
export interface Ethereum_TxReceipt {
  to: string
  from: string
  contractAddress: string
  transactionIndex: UInt32
  root?: string | null
  gasUsed: BigInt
  logsBloom: string
  transactionHash: string
  logs: Array<Ethereum_Log>
  blockNumber: BigInt
  blockHash: string
  confirmations: UInt32
  cumulativeGasUsed: BigInt
  effectiveGasPrice: BigInt
  byzantium: boolean
  type: UInt32
  status?: UInt32 | null
}

/* URI: "w3://ens/ethereum.web3api.eth" */
export interface Ethereum_Log {
  blockNumber: BigInt
  blockHash: string
  transactionIndex: UInt32
  removed: boolean
  address: string
  data: string
  topics: Array<string>
  transactionHash: string
  logIndex: UInt32
}

/* URI: "w3://ens/ethereum.web3api.eth" */
export interface Ethereum_TxRequest {
  to?: string | null
  from?: string | null
  nonce?: UInt32 | null
  gasLimit?: BigInt | null
  gasPrice?: BigInt | null
  data?: string | null
  value?: BigInt | null
  chainId?: UInt32 | null
  type?: UInt32 | null
}

/* URI: "w3://ens/ethereum.web3api.eth" */
export interface Ethereum_StaticTxResult {
  result: string
  error: boolean
}

/* URI: "w3://ens/ethereum.web3api.eth" */
export interface Ethereum_EventNotification {
  data: string
  address: string
  log: Ethereum_Log
}

/* URI: "w3://ens/ethereum.web3api.eth" */
export interface Ethereum_Network {
  name: string
  chainId: Int
  ensAddress?: string | null
}

/* URI: "w3://ipfs/QmeiPWHe2ixfitcgjRwP5AaJD5R7DbsGhQNQwT4rFNyxx8" */
export interface ERC20_Ethereum_Connection {
  node?: string | null
  networkNameOrChainId?: string | null
}

/// Imported Objects END ///
