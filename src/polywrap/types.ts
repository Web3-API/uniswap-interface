// @ts-noCheck
import { Client, InvokeApiResult } from '@web3api/core-js'

import * as Types from './'

export type UInt = number
export type UInt8 = number
export type UInt16 = number
export type UInt32 = number
export type Int = number
export type Int8 = number
export type Int16 = number
export type Int32 = number
export type Bytes = Uint8Array
export type BigInt = string
export type Json = string
export type String = string
export type Boolean = boolean

/// Imported Objects START ///

/* URI: "w3://fs/./../../integrations/uniswapv3/wrapper/build" */
export interface Uni_NextTickResult {
  index: Int32
  found: boolean
}

/* URI: "w3://fs/./../../integrations/uniswapv3/wrapper/build" */
export interface Uni_PoolChangeResult {
  amount: Types.Uni_TokenAmount
  nextPool: Types.Uni_Pool
}

/* URI: "w3://fs/./../../integrations/uniswapv3/wrapper/build" */
export interface Uni_TokenAmount {
  token: Types.Uni_Token
  amount: BigInt
}

/* URI: "w3://fs/./../../integrations/uniswapv3/wrapper/build" */
export interface Uni_Token {
  chainId: Types.Uni_ChainId
  address: string
  currency: Types.Uni_Currency
}

/* URI: "w3://fs/./../../integrations/uniswapv3/wrapper/build" */
export interface Uni_Currency {
  decimals: UInt8
  symbol?: string | null
  name?: string | null
}

/* URI: "w3://fs/./../../integrations/uniswapv3/wrapper/build" */
export interface Uni_Pool {
  token0: Types.Uni_Token
  token1: Types.Uni_Token
  fee: Types.Uni_FeeAmount
  sqrtRatioX96: BigInt
  liquidity: BigInt
  tickCurrent: Int32
  tickDataProvider: Array<Types.Uni_Tick>
  token0Price: Types.Uni_Price
  token1Price: Types.Uni_Price
}

/* URI: "w3://fs/./../../integrations/uniswapv3/wrapper/build" */
export interface Uni_Tick {
  index: Int32
  liquidityGross: BigInt
  liquidityNet: BigInt
}

/* URI: "w3://fs/./../../integrations/uniswapv3/wrapper/build" */
export interface Uni_Price {
  baseToken: Types.Uni_Token
  quoteToken: Types.Uni_Token
  denominator: BigInt
  numerator: BigInt
  price: string
}

/* URI: "w3://fs/./../../integrations/uniswapv3/wrapper/build" */
export interface Uni_TradeRoute {
  route: Types.Uni_Route
  amount: Types.Uni_TokenAmount
}

/* URI: "w3://fs/./../../integrations/uniswapv3/wrapper/build" */
export interface Uni_Route {
  pools: Array<Types.Uni_Pool>
  path: Array<Types.Uni_Token>
  input: Types.Uni_Token
  output: Types.Uni_Token
  midPrice: Types.Uni_Price
}

/* URI: "w3://fs/./../../integrations/uniswapv3/wrapper/build" */
export interface Uni_IncentiveKey {
  rewardToken: Types.Uni_Token
  pool: Types.Uni_Pool
  startTime: BigInt
  endTime: BigInt
  refundee: string
}

/* URI: "w3://fs/./../../integrations/uniswapv3/wrapper/build" */
export interface Uni_ClaimOptions {
  tokenId: BigInt
  recipient: string
  amount?: BigInt | null
}

/* URI: "w3://fs/./../../integrations/uniswapv3/wrapper/build" */
export interface Uni_FullWithdrawOptions {
  owner: string
  data?: string | null
  tokenId: BigInt
  recipient: string
  amount?: BigInt | null
}

/* URI: "w3://fs/./../../integrations/uniswapv3/wrapper/build" */
export interface Uni_QuoteOptions {
  sqrtPriceLimitX96?: BigInt | null
}

/* URI: "w3://fs/./../../integrations/uniswapv3/wrapper/build" */
export interface Uni_CommonAddLiquidityOptions {
  slippageTolerance: string
  deadline: BigInt
  useNative?: Types.Uni_Token | null
  token0Permit?: Types.Uni_PermitOptions | null
  token1Permit?: Types.Uni_PermitOptions | null
}

/* URI: "w3://fs/./../../integrations/uniswapv3/wrapper/build" */
export interface Uni_PermitOptions {
  v: Types.Uni_PermitV
  r: string
  s: string
  amount?: BigInt | null
  deadline?: BigInt | null
  nonce?: BigInt | null
  expiry?: BigInt | null
}

/* URI: "w3://fs/./../../integrations/uniswapv3/wrapper/build" */
export interface Uni_AddLiquidityOptions {
  recipient?: string | null
  createPool?: boolean | null
  tokenId?: BigInt | null
  slippageTolerance: string
  deadline: BigInt
  useNative?: Types.Uni_Token | null
  token0Permit?: Types.Uni_PermitOptions | null
  token1Permit?: Types.Uni_PermitOptions | null
}

/* URI: "w3://fs/./../../integrations/uniswapv3/wrapper/build" */
export interface Uni_SafeTransferOptions {
  sender: string
  recipient: string
  tokenId: BigInt
  data?: string | null
}

/* URI: "w3://fs/./../../integrations/uniswapv3/wrapper/build" */
export interface Uni_CollectOptions {
  tokenId: BigInt
  expectedCurrencyOwed0: Types.Uni_TokenAmount
  expectedCurrencyOwed1: Types.Uni_TokenAmount
  recipient: string
}

/* URI: "w3://fs/./../../integrations/uniswapv3/wrapper/build" */
export interface Uni_NFTPermitOptions {
  v: Types.Uni_PermitV
  r: string
  s: string
  deadline: BigInt
  spender: string
}

/* URI: "w3://fs/./../../integrations/uniswapv3/wrapper/build" */
export interface Uni_RemoveLiquidityOptions {
  tokenId: BigInt
  liquidityPercentage: string
  slippageTolerance: string
  deadline: BigInt
  burnToken?: boolean | null
  permit?: Types.Uni_NFTPermitOptions | null
  collectOptions: Types.Uni_CollectOptions
}

/* URI: "w3://fs/./../../integrations/uniswapv3/wrapper/build" */
export interface Uni_TradeSwap {
  route: Types.Uni_Route
  inputAmount: Types.Uni_TokenAmount
  outputAmount: Types.Uni_TokenAmount
}

/* URI: "w3://fs/./../../integrations/uniswapv3/wrapper/build" */
export interface Uni_Trade {
  swaps: Array<Types.Uni_TradeSwap>
  tradeType: Types.Uni_TradeType
  inputAmount: Types.Uni_TokenAmount
  outputAmount: Types.Uni_TokenAmount
  executionPrice: Types.Uni_Price
  priceImpact: Types.Uni_Fraction
}

/* URI: "w3://fs/./../../integrations/uniswapv3/wrapper/build" */
export interface Uni_Fraction {
  numerator: BigInt
  denominator: BigInt
  quotient: string
}

/* URI: "w3://fs/./../../integrations/uniswapv3/wrapper/build" */
export interface Uni_BestTradeOptions {
  maxNumResults?: UInt32 | null
  maxHops?: UInt32 | null
}

/* URI: "w3://fs/./../../integrations/uniswapv3/wrapper/build" */
export interface Uni_Position {
  pool: Types.Uni_Pool
  tickLower: Int32
  tickUpper: Int32
  liquidity: BigInt
  token0Amount: Types.Uni_TokenAmount
  token1Amount: Types.Uni_TokenAmount
  mintAmounts: Types.Uni_MintAmounts
  token0PriceLower: Types.Uni_Price
  token0PriceUpper: Types.Uni_Price
}

/* URI: "w3://fs/./../../integrations/uniswapv3/wrapper/build" */
export interface Uni_MintAmounts {
  amount0: BigInt
  amount1: BigInt
}

/* URI: "w3://fs/./../../integrations/uniswapv3/wrapper/build" */
export interface Uni_FeeOptions {
  fee: string
  recipient: string
}

/* URI: "w3://fs/./../../integrations/uniswapv3/wrapper/build" */
export interface Uni_SwapOptions {
  slippageTolerance: string
  recipient: string
  deadline: BigInt
  inputTokenPermit?: Types.Uni_PermitOptions | null
  sqrtPriceLimitX96?: BigInt | null
  fee?: Types.Uni_FeeOptions | null
}

/* URI: "w3://fs/./../../integrations/uniswapv3/wrapper/build" */
export interface Uni_MethodParameters {
  calldata: string
  value: string
}

/* URI: "w3://fs/./../../integrations/uniswapv3/wrapper/build" */
export interface Uni_GasOptions {
  gasPrice?: BigInt | null
  gasLimit?: BigInt | null
}

/* URI: "w3://fs/./../../integrations/uniswapv3/wrapper/build" */
export interface Uni_Ethereum_TxResponse {
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
  accessList?: Array<Types.Uni_Ethereum_Access> | null
}

/* URI: "w3://fs/./../../integrations/uniswapv3/wrapper/build" */
export interface Uni_Ethereum_Access {
  address: string
  storageKeys: Array<string>
}

/* URI: "w3://fs/./../../integrations/uniswapv3/wrapper/build" */
export enum Uni_ChainIdEnum {
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

export type Uni_ChainIdString =
  | 'MAINNET'
  | 'ROPSTEN'
  | 'RINKEBY'
  | 'GOERLI'
  | 'KOVAN'
  | 'OPTIMISM'
  | 'OPTIMISM_KOVAN'
  | 'ARBITRUM_ONE'
  | 'ARBITRUM_ONE_RINKEBY'

export type Uni_ChainId = Uni_ChainIdEnum | Uni_ChainIdString

/* URI: "w3://fs/./../../integrations/uniswapv3/wrapper/build" */
export enum Uni_FeeAmountEnum {
  LOWEST,
  LOW,
  MEDIUM,
  HIGH,
}

export type Uni_FeeAmountString = 'LOWEST' | 'LOW' | 'MEDIUM' | 'HIGH'

export type Uni_FeeAmount = Uni_FeeAmountEnum | Uni_FeeAmountString

/* URI: "w3://fs/./../../integrations/uniswapv3/wrapper/build" */
export enum Uni_PermitVEnum {
  v_0,
  v_1,
  v_27,
  v_28,
}

export type Uni_PermitVString = 'v_0' | 'v_1' | 'v_27' | 'v_28'

export type Uni_PermitV = Uni_PermitVEnum | Uni_PermitVString

/* URI: "w3://fs/./../../integrations/uniswapv3/wrapper/build" */
export enum Uni_TradeTypeEnum {
  EXACT_INPUT,
  EXACT_OUTPUT,
}

export type Uni_TradeTypeString = 'EXACT_INPUT' | 'EXACT_OUTPUT'

export type Uni_TradeType = Uni_TradeTypeEnum | Uni_TradeTypeString

/// Imported Objects END ///

/// Imported Queries START ///

/* URI: "w3://fs/./../../integrations/uniswapv3/wrapper/build" */
interface Uni_Query_Input_currencyEquals extends Record<string, unknown> {
  currencyA: Types.Uni_Currency
  currencyB: Types.Uni_Currency
}

/* URI: "w3://fs/./../../integrations/uniswapv3/wrapper/build" */
interface Uni_Query_Input_tokenEquals extends Record<string, unknown> {
  tokenA: Types.Uni_Token
  tokenB: Types.Uni_Token
}

/* URI: "w3://fs/./../../integrations/uniswapv3/wrapper/build" */
interface Uni_Query_Input_tokenAmountEquals extends Record<string, unknown> {
  tokenAmountA: Types.Uni_TokenAmount
  tokenAmountB: Types.Uni_TokenAmount
}

/* URI: "w3://fs/./../../integrations/uniswapv3/wrapper/build" */
interface Uni_Query_Input_tokenSortsBefore extends Record<string, unknown> {
  tokenA: Types.Uni_Token
  tokenB: Types.Uni_Token
}

/* URI: "w3://fs/./../../integrations/uniswapv3/wrapper/build" */
interface Uni_Query_Input_getEther extends Record<string, unknown> {
  chainId: Types.Uni_ChainId
}

/* URI: "w3://fs/./../../integrations/uniswapv3/wrapper/build" */
interface Uni_Query_Input_getWETH extends Record<string, unknown> {
  chainId: Types.Uni_ChainId
}

/* URI: "w3://fs/./../../integrations/uniswapv3/wrapper/build" */
interface Uni_Query_Input_isEther extends Record<string, unknown> {
  token: Types.Uni_Token
}

/* URI: "w3://fs/./../../integrations/uniswapv3/wrapper/build" */
interface Uni_Query_Input_wrapToken extends Record<string, unknown> {
  token: Types.Uni_Token
}

/* URI: "w3://fs/./../../integrations/uniswapv3/wrapper/build" */
interface Uni_Query_Input_wrapAmount extends Record<string, unknown> {
  amount: Types.Uni_TokenAmount
}

/* URI: "w3://fs/./../../integrations/uniswapv3/wrapper/build" */
interface Uni_Query_Input_validateTickList extends Record<string, unknown> {
  ticks: Array<Types.Uni_Tick>
  tickSpacing: Int32
}

/* URI: "w3://fs/./../../integrations/uniswapv3/wrapper/build" */
interface Uni_Query_Input_getTick extends Record<string, unknown> {
  tickDataProvider: Array<Types.Uni_Tick>
  tickIndex: Int32
}

/* URI: "w3://fs/./../../integrations/uniswapv3/wrapper/build" */
interface Uni_Query_Input_nextInitializedTickWithinOneWord extends Record<string, unknown> {
  tickDataProvider: Array<Types.Uni_Tick>
  tick: Int32
  lte: boolean
  tickSpacing: Int32
}

/* URI: "w3://fs/./../../integrations/uniswapv3/wrapper/build" */
interface Uni_Query_Input_createPool extends Record<string, unknown> {
  tokenA: Types.Uni_Token
  tokenB: Types.Uni_Token
  fee: Types.Uni_FeeAmount
  sqrtRatioX96: BigInt
  liquidity: BigInt
  tickCurrent: Int32
  ticks?: Array<Types.Uni_Tick> | null
}

/* URI: "w3://fs/./../../integrations/uniswapv3/wrapper/build" */
interface Uni_Query_Input_getPoolAddress extends Record<string, unknown> {
  tokenA: Types.Uni_Token
  tokenB: Types.Uni_Token
  fee: Types.Uni_FeeAmount
  initCodeHashManualOverride?: string | null
}

/* URI: "w3://fs/./../../integrations/uniswapv3/wrapper/build" */
interface Uni_Query_Input_poolInvolvesToken extends Record<string, unknown> {
  pool: Types.Uni_Pool
  token: Types.Uni_Token
}

/* URI: "w3://fs/./../../integrations/uniswapv3/wrapper/build" */
interface Uni_Query_Input_poolToken0Price extends Record<string, unknown> {
  token0: Types.Uni_Token
  token1: Types.Uni_Token
  sqrtRatioX96: BigInt
}

/* URI: "w3://fs/./../../integrations/uniswapv3/wrapper/build" */
interface Uni_Query_Input_poolToken1Price extends Record<string, unknown> {
  token0: Types.Uni_Token
  token1: Types.Uni_Token
  sqrtRatioX96: BigInt
}

/* URI: "w3://fs/./../../integrations/uniswapv3/wrapper/build" */
interface Uni_Query_Input_poolPriceOf extends Record<string, unknown> {
  pool: Types.Uni_Pool
  token: Types.Uni_Token
}

/* URI: "w3://fs/./../../integrations/uniswapv3/wrapper/build" */
interface Uni_Query_Input_poolChainId extends Record<string, unknown> {
  pool: Types.Uni_Pool
}

/* URI: "w3://fs/./../../integrations/uniswapv3/wrapper/build" */
interface Uni_Query_Input_getPoolOutputAmount extends Record<string, unknown> {
  pool: Types.Uni_Pool
  inputAmount: Types.Uni_TokenAmount
  sqrtPriceLimitX96?: BigInt | null
}

/* URI: "w3://fs/./../../integrations/uniswapv3/wrapper/build" */
interface Uni_Query_Input_getPoolInputAmount extends Record<string, unknown> {
  pool: Types.Uni_Pool
  outputAmount: Types.Uni_TokenAmount
  sqrtPriceLimitX96?: BigInt | null
}

/* URI: "w3://fs/./../../integrations/uniswapv3/wrapper/build" */
interface Uni_Query_Input_getPoolTickSpacing extends Record<string, unknown> {
  pool: Types.Uni_Pool
}

/* URI: "w3://fs/./../../integrations/uniswapv3/wrapper/build" */
interface Uni_Query_Input_createRoute extends Record<string, unknown> {
  pools: Array<Types.Uni_Pool>
  inToken: Types.Uni_Token
  outToken: Types.Uni_Token
}

/* URI: "w3://fs/./../../integrations/uniswapv3/wrapper/build" */
interface Uni_Query_Input_routeChainId extends Record<string, unknown> {
  route: Types.Uni_Route
}

/* URI: "w3://fs/./../../integrations/uniswapv3/wrapper/build" */
interface Uni_Query_Input_routeMidPrice extends Record<string, unknown> {
  pools: Array<Types.Uni_Pool>
  inToken: Types.Uni_Token
  outToken: Types.Uni_Token
}

/* URI: "w3://fs/./../../integrations/uniswapv3/wrapper/build" */
interface Uni_Query_Input_createTradeExactIn extends Record<string, unknown> {
  tradeRoute: Types.Uni_TradeRoute
}

/* URI: "w3://fs/./../../integrations/uniswapv3/wrapper/build" */
interface Uni_Query_Input_createTradeExactOut extends Record<string, unknown> {
  tradeRoute: Types.Uni_TradeRoute
}

/* URI: "w3://fs/./../../integrations/uniswapv3/wrapper/build" */
interface Uni_Query_Input_createTradeFromRoute extends Record<string, unknown> {
  tradeRoute: Types.Uni_TradeRoute
  tradeType: Types.Uni_TradeType
}

/* URI: "w3://fs/./../../integrations/uniswapv3/wrapper/build" */
interface Uni_Query_Input_createTradeFromRoutes extends Record<string, unknown> {
  tradeRoutes: Array<Types.Uni_TradeRoute>
  tradeType: Types.Uni_TradeType
}

/* URI: "w3://fs/./../../integrations/uniswapv3/wrapper/build" */
interface Uni_Query_Input_createUncheckedTrade extends Record<string, unknown> {
  swap: Types.Uni_TradeSwap
  tradeType: Types.Uni_TradeType
}

/* URI: "w3://fs/./../../integrations/uniswapv3/wrapper/build" */
interface Uni_Query_Input_createUncheckedTradeWithMultipleRoutes extends Record<string, unknown> {
  swaps: Array<Types.Uni_TradeSwap>
  tradeType: Types.Uni_TradeType
}

/* URI: "w3://fs/./../../integrations/uniswapv3/wrapper/build" */
interface Uni_Query_Input_tradeInputAmount extends Record<string, unknown> {
  swaps: Array<Types.Uni_TradeSwap>
}

/* URI: "w3://fs/./../../integrations/uniswapv3/wrapper/build" */
interface Uni_Query_Input_tradeOutputAmount extends Record<string, unknown> {
  swaps: Array<Types.Uni_TradeSwap>
}

/* URI: "w3://fs/./../../integrations/uniswapv3/wrapper/build" */
interface Uni_Query_Input_tradeExecutionPrice extends Record<string, unknown> {
  inputAmount: Types.Uni_TokenAmount
  outputAmount: Types.Uni_TokenAmount
}

/* URI: "w3://fs/./../../integrations/uniswapv3/wrapper/build" */
interface Uni_Query_Input_tradePriceImpact extends Record<string, unknown> {
  swaps: Array<Types.Uni_TradeSwap>
  outputAmount: Types.Uni_TokenAmount
}

/* URI: "w3://fs/./../../integrations/uniswapv3/wrapper/build" */
interface Uni_Query_Input_tradeMinimumAmountOut extends Record<string, unknown> {
  slippageTolerance: string
  amountOut: Types.Uni_TokenAmount
  tradeType: Types.Uni_TradeType
}

/* URI: "w3://fs/./../../integrations/uniswapv3/wrapper/build" */
interface Uni_Query_Input_tradeMaximumAmountIn extends Record<string, unknown> {
  slippageTolerance: string
  amountIn: Types.Uni_TokenAmount
  tradeType: Types.Uni_TradeType
}

/* URI: "w3://fs/./../../integrations/uniswapv3/wrapper/build" */
interface Uni_Query_Input_tradeWorstExecutionPrice extends Record<string, unknown> {
  trade: Types.Uni_Trade
  slippageTolerance: string
}

/* URI: "w3://fs/./../../integrations/uniswapv3/wrapper/build" */
interface Uni_Query_Input_bestTradeExactIn extends Record<string, unknown> {
  pools: Array<Types.Uni_Pool>
  amountIn: Types.Uni_TokenAmount
  tokenOut: Types.Uni_Token
  options?: Types.Uni_BestTradeOptions | null
}

/* URI: "w3://fs/./../../integrations/uniswapv3/wrapper/build" */
interface Uni_Query_Input_bestTradeExactOut extends Record<string, unknown> {
  pools: Array<Types.Uni_Pool>
  tokenIn: Types.Uni_Token
  amountOut: Types.Uni_TokenAmount
  options?: Types.Uni_BestTradeOptions | null
}

/* URI: "w3://fs/./../../integrations/uniswapv3/wrapper/build" */
interface Uni_Query_Input_createPosition extends Record<string, unknown> {
  pool: Types.Uni_Pool
  tickLower: Int32
  tickUpper: Int32
  liquidity: BigInt
}

/* URI: "w3://fs/./../../integrations/uniswapv3/wrapper/build" */
interface Uni_Query_Input_createPositionFromAmounts extends Record<string, unknown> {
  pool: Types.Uni_Pool
  tickLower: Int32
  tickUpper: Int32
  amount0: BigInt
  amount1: BigInt
  useFullPrecision: boolean
}

/* URI: "w3://fs/./../../integrations/uniswapv3/wrapper/build" */
interface Uni_Query_Input_createPositionFromAmount0 extends Record<string, unknown> {
  pool: Types.Uni_Pool
  tickLower: Int32
  tickUpper: Int32
  amount0: BigInt
  useFullPrecision: boolean
}

/* URI: "w3://fs/./../../integrations/uniswapv3/wrapper/build" */
interface Uni_Query_Input_createPositionFromAmount1 extends Record<string, unknown> {
  pool: Types.Uni_Pool
  tickLower: Int32
  tickUpper: Int32
  amount1: BigInt
}

/* URI: "w3://fs/./../../integrations/uniswapv3/wrapper/build" */
interface Uni_Query_Input_positionToken0PriceLower extends Record<string, unknown> {
  pool: Types.Uni_Pool
  tickLower: Int32
}

/* URI: "w3://fs/./../../integrations/uniswapv3/wrapper/build" */
interface Uni_Query_Input_positionToken0PriceUpper extends Record<string, unknown> {
  pool: Types.Uni_Pool
  tickUpper: Int32
}

/* URI: "w3://fs/./../../integrations/uniswapv3/wrapper/build" */
interface Uni_Query_Input_positionAmount0 extends Record<string, unknown> {
  pool: Types.Uni_Pool
  tickLower: Int32
  tickUpper: Int32
  liquidity: BigInt
}

/* URI: "w3://fs/./../../integrations/uniswapv3/wrapper/build" */
interface Uni_Query_Input_positionAmount1 extends Record<string, unknown> {
  pool: Types.Uni_Pool
  tickLower: Int32
  tickUpper: Int32
  liquidity: BigInt
}

/* URI: "w3://fs/./../../integrations/uniswapv3/wrapper/build" */
interface Uni_Query_Input_mintAmounts extends Record<string, unknown> {
  pool: Types.Uni_Pool
  tickLower: Int32
  tickUpper: Int32
  liquidity: BigInt
}

/* URI: "w3://fs/./../../integrations/uniswapv3/wrapper/build" */
interface Uni_Query_Input_mintAmountsWithSlippage extends Record<string, unknown> {
  position: Types.Uni_Position
  slippageTolerance: string
}

/* URI: "w3://fs/./../../integrations/uniswapv3/wrapper/build" */
interface Uni_Query_Input_burnAmountsWithSlippage extends Record<string, unknown> {
  position: Types.Uni_Position
  slippageTolerance: string
}

/* URI: "w3://fs/./../../integrations/uniswapv3/wrapper/build" */
interface Uni_Query_Input_swapCallParameters extends Record<string, unknown> {
  trades: Array<Types.Uni_Trade>
  options: Types.Uni_SwapOptions
}

/* URI: "w3://fs/./../../integrations/uniswapv3/wrapper/build" */
interface Uni_Query_Input_encodeRouteToPath extends Record<string, unknown> {
  route: Types.Uni_Route
  exactOutput: boolean
}

/* URI: "w3://fs/./../../integrations/uniswapv3/wrapper/build" */
interface Uni_Query_Input_encodePermit extends Record<string, unknown> {
  token: Types.Uni_Token
  options: Types.Uni_PermitOptions
}

/* URI: "w3://fs/./../../integrations/uniswapv3/wrapper/build" */
interface Uni_Query_Input_encodeUnwrapWETH9 extends Record<string, unknown> {
  amountMinimum: BigInt
  recipient: string
  feeOptions?: Types.Uni_FeeOptions | null
}

/* URI: "w3://fs/./../../integrations/uniswapv3/wrapper/build" */
interface Uni_Query_Input_encodeSweepToken extends Record<string, unknown> {
  token: Types.Uni_Token
  amountMinimum: BigInt
  recipient: string
  feeOptions?: Types.Uni_FeeOptions | null
}

/* URI: "w3://fs/./../../integrations/uniswapv3/wrapper/build" */
type Uni_Query_Input_encodeRefundETH = Record<string, unknown>

/* URI: "w3://fs/./../../integrations/uniswapv3/wrapper/build" */
interface Uni_Query_Input_encodeMulticall extends Record<string, unknown> {
  calldatas: Array<string>
}

/* URI: "w3://fs/./../../integrations/uniswapv3/wrapper/build" */
interface Uni_Query_Input_collectRewards extends Record<string, unknown> {
  incentiveKeys: Array<Types.Uni_IncentiveKey>
  options: Types.Uni_ClaimOptions
}

/* URI: "w3://fs/./../../integrations/uniswapv3/wrapper/build" */
interface Uni_Query_Input_withdrawToken extends Record<string, unknown> {
  incentiveKeys: Array<Types.Uni_IncentiveKey>
  options: Types.Uni_FullWithdrawOptions
}

/* URI: "w3://fs/./../../integrations/uniswapv3/wrapper/build" */
interface Uni_Query_Input_encodeDeposit extends Record<string, unknown> {
  incentiveKeys: Array<Types.Uni_IncentiveKey>
}

/* URI: "w3://fs/./../../integrations/uniswapv3/wrapper/build" */
interface Uni_Query_Input_quoteCallParameters extends Record<string, unknown> {
  route: Types.Uni_Route
  amount: Types.Uni_TokenAmount
  tradeType: Types.Uni_TradeType
  options?: Types.Uni_QuoteOptions | null
}

/* URI: "w3://fs/./../../integrations/uniswapv3/wrapper/build" */
interface Uni_Query_Input_createCallParameters extends Record<string, unknown> {
  pool: Types.Uni_Pool
}

/* URI: "w3://fs/./../../integrations/uniswapv3/wrapper/build" */
interface Uni_Query_Input_addCallParameters extends Record<string, unknown> {
  position: Types.Uni_Position
  options: Types.Uni_AddLiquidityOptions
}

/* URI: "w3://fs/./../../integrations/uniswapv3/wrapper/build" */
interface Uni_Query_Input_collectCallParameters extends Record<string, unknown> {
  options: Types.Uni_CollectOptions
}

/* URI: "w3://fs/./../../integrations/uniswapv3/wrapper/build" */
interface Uni_Query_Input_removeCallParameters extends Record<string, unknown> {
  position: Types.Uni_Position
  options: Types.Uni_RemoveLiquidityOptions
}

/* URI: "w3://fs/./../../integrations/uniswapv3/wrapper/build" */
interface Uni_Query_Input_safeTransferFromParameters extends Record<string, unknown> {
  options: Types.Uni_SafeTransferOptions
}

/* URI: "w3://fs/./../../integrations/uniswapv3/wrapper/build" */
interface Uni_Query_Input_toHex extends Record<string, unknown> {
  value: BigInt
}

/* URI: "w3://fs/./../../integrations/uniswapv3/wrapper/build" */
interface Uni_Query_Input_computePoolAddress extends Record<string, unknown> {
  factoryAddress: string
  tokenA: Types.Uni_Token
  tokenB: Types.Uni_Token
  fee: Types.Uni_FeeAmount
  initCodeHashManualOverride?: string | null
}

/* URI: "w3://fs/./../../integrations/uniswapv3/wrapper/build" */
interface Uni_Query_Input_encodeSqrtRatioX96 extends Record<string, unknown> {
  amount1: BigInt
  amount0: BigInt
}

/* URI: "w3://fs/./../../integrations/uniswapv3/wrapper/build" */
interface Uni_Query_Input_mulDivRoundingUp extends Record<string, unknown> {
  a: BigInt
  b: BigInt
  denominator: BigInt
}

/* URI: "w3://fs/./../../integrations/uniswapv3/wrapper/build" */
interface Uni_Query_Input_addDelta extends Record<string, unknown> {
  x: BigInt
  y: BigInt
}

/* URI: "w3://fs/./../../integrations/uniswapv3/wrapper/build" */
interface Uni_Query_Input_maxLiquidityForAmounts extends Record<string, unknown> {
  sqrtRatioCurrentX96: BigInt
  sqrtRatioAX96: BigInt
  sqrtRatioBX96: BigInt
  amount0: BigInt
  amount1: BigInt
  useFullPrecision: boolean
}

/* URI: "w3://fs/./../../integrations/uniswapv3/wrapper/build" */
interface Uni_Query_Input_mostSignificantBit extends Record<string, unknown> {
  x: BigInt
}

/* URI: "w3://fs/./../../integrations/uniswapv3/wrapper/build" */
interface Uni_Query_Input_nearestUsableTick extends Record<string, unknown> {
  tick: Int32
  tickSpacing: Int32
}

/* URI: "w3://fs/./../../integrations/uniswapv3/wrapper/build" */
interface Uni_Query_Input_tickToPrice extends Record<string, unknown> {
  baseToken: Types.Uni_Token
  quoteToken: Types.Uni_Token
  tick: Int32
}

/* URI: "w3://fs/./../../integrations/uniswapv3/wrapper/build" */
interface Uni_Query_Input_priceToClosestTick extends Record<string, unknown> {
  price: Types.Uni_Price
}

/* URI: "w3://fs/./../../integrations/uniswapv3/wrapper/build" */
interface Uni_Query_Input_getAmount0Delta extends Record<string, unknown> {
  sqrtRatioAX96: BigInt
  sqrtRatioBX96: BigInt
  liquidity: BigInt
  roundUp: boolean
}

/* URI: "w3://fs/./../../integrations/uniswapv3/wrapper/build" */
interface Uni_Query_Input_getAmount1Delta extends Record<string, unknown> {
  sqrtRatioAX96: BigInt
  sqrtRatioBX96: BigInt
  liquidity: BigInt
  roundUp: boolean
}

/* URI: "w3://fs/./../../integrations/uniswapv3/wrapper/build" */
interface Uni_Query_Input_getNextSqrtPriceFromInput extends Record<string, unknown> {
  sqrtPX96: BigInt
  liquidity: BigInt
  amountIn: BigInt
  zeroForOne: boolean
}

/* URI: "w3://fs/./../../integrations/uniswapv3/wrapper/build" */
interface Uni_Query_Input_getNextSqrtPriceFromOutput extends Record<string, unknown> {
  sqrtPX96: BigInt
  liquidity: BigInt
  amountOut: BigInt
  zeroForOne: boolean
}

/* URI: "w3://fs/./../../integrations/uniswapv3/wrapper/build" */
interface Uni_Query_Input_tickIsBelowSmallest extends Record<string, unknown> {
  ticks: Array<Types.Uni_Tick>
  tick: Int32
}

/* URI: "w3://fs/./../../integrations/uniswapv3/wrapper/build" */
interface Uni_Query_Input_tickIsAtOrAboveLargest extends Record<string, unknown> {
  ticks: Array<Types.Uni_Tick>
  tick: Int32
}

/* URI: "w3://fs/./../../integrations/uniswapv3/wrapper/build" */
interface Uni_Query_Input_nextInitializedTick extends Record<string, unknown> {
  ticks: Array<Types.Uni_Tick>
  tick: Int32
  lte: boolean
}

/* URI: "w3://fs/./../../integrations/uniswapv3/wrapper/build" */
interface Uni_Query_Input_tickListIsSorted extends Record<string, unknown> {
  ticks: Array<Types.Uni_Tick>
}

/* URI: "w3://fs/./../../integrations/uniswapv3/wrapper/build" */
interface Uni_Query_Input_getSqrtRatioAtTick extends Record<string, unknown> {
  tick: Int32
}

/* URI: "w3://fs/./../../integrations/uniswapv3/wrapper/build" */
interface Uni_Query_Input_getTickAtSqrtRatio extends Record<string, unknown> {
  sqrtRatioX96: BigInt
}

/* URI: "w3://fs/./../../integrations/uniswapv3/wrapper/build" */
interface Uni_Query_Input_fetchToken extends Record<string, unknown> {
  address: string
  chainId: Types.Uni_ChainId
}

/* URI: "w3://fs/./../../integrations/uniswapv3/wrapper/build" */
interface Uni_Query_Input_fetchPoolFromTokens extends Record<string, unknown> {
  tokenA: Types.Uni_Token
  tokenB: Types.Uni_Token
  fee: Types.Uni_FeeAmount
  fetchTicks: boolean
}

/* URI: "w3://fs/./../../integrations/uniswapv3/wrapper/build" */
interface Uni_Query_Input_fetchPoolFromAddress extends Record<string, unknown> {
  address: string
  chainId: Types.Uni_ChainId
  fetchTicks: boolean
}

/* URI: "w3://fs/./../../integrations/uniswapv3/wrapper/build" */
interface Uni_Query_Input_fetchTickList extends Record<string, unknown> {
  address: string
  chainId: Types.Uni_ChainId
}

/* URI: "w3://fs/./../../integrations/uniswapv3/wrapper/build" */
interface Uni_Query_Input_feeAmountToTickSpacing extends Record<string, unknown> {
  feeAmount: Types.Uni_FeeAmount
}

/* URI: "w3://fs/./../../integrations/uniswapv3/wrapper/build" */
interface Uni_Query_Input_getFeeAmount extends Record<string, unknown> {
  feeAmount: Types.Uni_FeeAmount
}

/* URI: "w3://fs/./../../integrations/uniswapv3/wrapper/build" */
interface Uni_Query_Input_getPermitV extends Record<string, unknown> {
  permitV: Types.Uni_PermitV
}

/* URI: "w3://fs/./../../integrations/uniswapv3/wrapper/build" */
type Uni_Query_Input_FACTORY_ADDRESS = Record<string, unknown>

/* URI: "w3://fs/./../../integrations/uniswapv3/wrapper/build" */
type Uni_Query_Input_POOL_INIT_CODE_HASH = Record<string, unknown>

/* URI: "w3://fs/./../../integrations/uniswapv3/wrapper/build" */
type Uni_Query_Input_POOL_INIT_CODE_HASH_OPTIMISM = Record<string, unknown>

/* URI: "w3://fs/./../../integrations/uniswapv3/wrapper/build" */
type Uni_Query_Input_POOL_INIT_CODE_HASH_OPTIMISM_KOVAN = Record<string, unknown>

/* URI: "w3://fs/./../../integrations/uniswapv3/wrapper/build" */
type Uni_Query_Input_MIN_TICK = Record<string, unknown>

/* URI: "w3://fs/./../../integrations/uniswapv3/wrapper/build" */
type Uni_Query_Input_MAX_TICK = Record<string, unknown>

/* URI: "w3://fs/./../../integrations/uniswapv3/wrapper/build" */
type Uni_Query_Input_MIN_SQRT_RATIO = Record<string, unknown>

/* URI: "w3://fs/./../../integrations/uniswapv3/wrapper/build" */
type Uni_Query_Input_MAX_SQRT_RATIO = Record<string, unknown>

/* URI: "w3://fs/./../../integrations/uniswapv3/wrapper/build" */
export const Uni_Query = {
  currencyEquals: async (
    input: Uni_Query_Input_currencyEquals,
    client: Client,
    uri = 'w3://fs/./../../integrations/uniswapv3/wrapper/build'
  ): Promise<InvokeApiResult<boolean>> => {
    return client.invoke<boolean>({
      uri,
      module: 'query',
      method: 'currencyEquals',
      input,
    })
  },

  tokenEquals: async (
    input: Uni_Query_Input_tokenEquals,
    client: Client,
    uri = 'w3://fs/./../../integrations/uniswapv3/wrapper/build'
  ): Promise<InvokeApiResult<boolean>> => {
    return client.invoke<boolean>({
      uri,
      module: 'query',
      method: 'tokenEquals',
      input,
    })
  },

  tokenAmountEquals: async (
    input: Uni_Query_Input_tokenAmountEquals,
    client: Client,
    uri = 'w3://fs/./../../integrations/uniswapv3/wrapper/build'
  ): Promise<InvokeApiResult<boolean>> => {
    return client.invoke<boolean>({
      uri,
      module: 'query',
      method: 'tokenAmountEquals',
      input,
    })
  },

  tokenSortsBefore: async (
    input: Uni_Query_Input_tokenSortsBefore,
    client: Client,
    uri = 'w3://fs/./../../integrations/uniswapv3/wrapper/build'
  ): Promise<InvokeApiResult<boolean>> => {
    return client.invoke<boolean>({
      uri,
      module: 'query',
      method: 'tokenSortsBefore',
      input,
    })
  },

  getEther: async (
    input: Uni_Query_Input_getEther,
    client: Client,
    uri = 'w3://fs/./../../integrations/uniswapv3/wrapper/build'
  ): Promise<InvokeApiResult<Types.Uni_Token>> => {
    return client.invoke<Types.Uni_Token>({
      uri,
      module: 'query',
      method: 'getEther',
      input,
    })
  },

  getWETH: async (
    input: Uni_Query_Input_getWETH,
    client: Client,
    uri = 'w3://fs/./../../integrations/uniswapv3/wrapper/build'
  ): Promise<InvokeApiResult<Types.Uni_Token>> => {
    return client.invoke<Types.Uni_Token>({
      uri,
      module: 'query',
      method: 'getWETH',
      input,
    })
  },

  isEther: async (
    input: Uni_Query_Input_isEther,
    client: Client,
    uri = 'w3://fs/./../../integrations/uniswapv3/wrapper/build'
  ): Promise<InvokeApiResult<boolean>> => {
    return client.invoke<boolean>({
      uri,
      module: 'query',
      method: 'isEther',
      input,
    })
  },

  wrapToken: async (
    input: Uni_Query_Input_wrapToken,
    client: Client,
    uri = 'w3://fs/./../../integrations/uniswapv3/wrapper/build'
  ): Promise<InvokeApiResult<Types.Uni_Token>> => {
    return client.invoke<Types.Uni_Token>({
      uri,
      module: 'query',
      method: 'wrapToken',
      input,
    })
  },

  wrapAmount: async (
    input: Uni_Query_Input_wrapAmount,
    client: Client,
    uri = 'w3://fs/./../../integrations/uniswapv3/wrapper/build'
  ): Promise<InvokeApiResult<Types.Uni_TokenAmount>> => {
    return client.invoke<Types.Uni_TokenAmount>({
      uri,
      module: 'query',
      method: 'wrapAmount',
      input,
    })
  },

  validateTickList: async (
    input: Uni_Query_Input_validateTickList,
    client: Client,
    uri = 'w3://fs/./../../integrations/uniswapv3/wrapper/build'
  ): Promise<InvokeApiResult<boolean>> => {
    return client.invoke<boolean>({
      uri,
      module: 'query',
      method: 'validateTickList',
      input,
    })
  },

  getTick: async (
    input: Uni_Query_Input_getTick,
    client: Client,
    uri = 'w3://fs/./../../integrations/uniswapv3/wrapper/build'
  ): Promise<InvokeApiResult<Types.Uni_Tick>> => {
    return client.invoke<Types.Uni_Tick>({
      uri,
      module: 'query',
      method: 'getTick',
      input,
    })
  },

  nextInitializedTickWithinOneWord: async (
    input: Uni_Query_Input_nextInitializedTickWithinOneWord,
    client: Client,
    uri = 'w3://fs/./../../integrations/uniswapv3/wrapper/build'
  ): Promise<InvokeApiResult<Types.Uni_NextTickResult>> => {
    return client.invoke<Types.Uni_NextTickResult>({
      uri,
      module: 'query',
      method: 'nextInitializedTickWithinOneWord',
      input,
    })
  },

  createPool: async (
    input: Uni_Query_Input_createPool,
    client: Client,
    uri = 'w3://fs/./../../integrations/uniswapv3/wrapper/build'
  ): Promise<InvokeApiResult<Types.Uni_Pool>> => {
    return client.invoke<Types.Uni_Pool>({
      uri,
      module: 'query',
      method: 'createPool',
      input,
    })
  },

  getPoolAddress: async (
    input: Uni_Query_Input_getPoolAddress,
    client: Client,
    uri = 'w3://fs/./../../integrations/uniswapv3/wrapper/build'
  ): Promise<InvokeApiResult<string>> => {
    return client.invoke<string>({
      uri,
      module: 'query',
      method: 'getPoolAddress',
      input,
    })
  },

  poolInvolvesToken: async (
    input: Uni_Query_Input_poolInvolvesToken,
    client: Client,
    uri = 'w3://fs/./../../integrations/uniswapv3/wrapper/build'
  ): Promise<InvokeApiResult<boolean>> => {
    return client.invoke<boolean>({
      uri,
      module: 'query',
      method: 'poolInvolvesToken',
      input,
    })
  },

  poolToken0Price: async (
    input: Uni_Query_Input_poolToken0Price,
    client: Client,
    uri = 'w3://fs/./../../integrations/uniswapv3/wrapper/build'
  ): Promise<InvokeApiResult<Types.Uni_Price>> => {
    return client.invoke<Types.Uni_Price>({
      uri,
      module: 'query',
      method: 'poolToken0Price',
      input,
    })
  },

  poolToken1Price: async (
    input: Uni_Query_Input_poolToken1Price,
    client: Client,
    uri = 'w3://fs/./../../integrations/uniswapv3/wrapper/build'
  ): Promise<InvokeApiResult<Types.Uni_Price>> => {
    return client.invoke<Types.Uni_Price>({
      uri,
      module: 'query',
      method: 'poolToken1Price',
      input,
    })
  },

  poolPriceOf: async (
    input: Uni_Query_Input_poolPriceOf,
    client: Client,
    uri = 'w3://fs/./../../integrations/uniswapv3/wrapper/build'
  ): Promise<InvokeApiResult<Types.Uni_Price>> => {
    return client.invoke<Types.Uni_Price>({
      uri,
      module: 'query',
      method: 'poolPriceOf',
      input,
    })
  },

  poolChainId: async (
    input: Uni_Query_Input_poolChainId,
    client: Client,
    uri = 'w3://fs/./../../integrations/uniswapv3/wrapper/build'
  ): Promise<InvokeApiResult<Types.Uni_ChainId>> => {
    return client.invoke<Types.Uni_ChainId>({
      uri,
      module: 'query',
      method: 'poolChainId',
      input,
    })
  },

  getPoolOutputAmount: async (
    input: Uni_Query_Input_getPoolOutputAmount,
    client: Client,
    uri = 'w3://fs/./../../integrations/uniswapv3/wrapper/build'
  ): Promise<InvokeApiResult<Types.Uni_PoolChangeResult>> => {
    return client.invoke<Types.Uni_PoolChangeResult>({
      uri,
      module: 'query',
      method: 'getPoolOutputAmount',
      input,
    })
  },

  getPoolInputAmount: async (
    input: Uni_Query_Input_getPoolInputAmount,
    client: Client,
    uri = 'w3://fs/./../../integrations/uniswapv3/wrapper/build'
  ): Promise<InvokeApiResult<Types.Uni_PoolChangeResult>> => {
    return client.invoke<Types.Uni_PoolChangeResult>({
      uri,
      module: 'query',
      method: 'getPoolInputAmount',
      input,
    })
  },

  getPoolTickSpacing: async (
    input: Uni_Query_Input_getPoolTickSpacing,
    client: Client,
    uri = 'w3://fs/./../../integrations/uniswapv3/wrapper/build'
  ): Promise<InvokeApiResult<Int32>> => {
    return client.invoke<Int32>({
      uri,
      module: 'query',
      method: 'getPoolTickSpacing',
      input,
    })
  },

  createRoute: async (
    input: Uni_Query_Input_createRoute,
    client: Client,
    uri = 'w3://fs/./../../integrations/uniswapv3/wrapper/build'
  ): Promise<InvokeApiResult<Types.Uni_Route>> => {
    return client.invoke<Types.Uni_Route>({
      uri,
      module: 'query',
      method: 'createRoute',
      input,
    })
  },

  routeChainId: async (
    input: Uni_Query_Input_routeChainId,
    client: Client,
    uri = 'w3://fs/./../../integrations/uniswapv3/wrapper/build'
  ): Promise<InvokeApiResult<Types.Uni_ChainId>> => {
    return client.invoke<Types.Uni_ChainId>({
      uri,
      module: 'query',
      method: 'routeChainId',
      input,
    })
  },

  routeMidPrice: async (
    input: Uni_Query_Input_routeMidPrice,
    client: Client,
    uri = 'w3://fs/./../../integrations/uniswapv3/wrapper/build'
  ): Promise<InvokeApiResult<Types.Uni_Price>> => {
    return client.invoke<Types.Uni_Price>({
      uri,
      module: 'query',
      method: 'routeMidPrice',
      input,
    })
  },

  createTradeExactIn: async (
    input: Uni_Query_Input_createTradeExactIn,
    client: Client,
    uri = 'w3://fs/./../../integrations/uniswapv3/wrapper/build'
  ): Promise<InvokeApiResult<Types.Uni_Trade>> => {
    return client.invoke<Types.Uni_Trade>({
      uri,
      module: 'query',
      method: 'createTradeExactIn',
      input,
    })
  },

  createTradeExactOut: async (
    input: Uni_Query_Input_createTradeExactOut,
    client: Client,
    uri = 'w3://fs/./../../integrations/uniswapv3/wrapper/build'
  ): Promise<InvokeApiResult<Types.Uni_Trade>> => {
    return client.invoke<Types.Uni_Trade>({
      uri,
      module: 'query',
      method: 'createTradeExactOut',
      input,
    })
  },

  createTradeFromRoute: async (
    input: Uni_Query_Input_createTradeFromRoute,
    client: Client,
    uri = 'w3://fs/./../../integrations/uniswapv3/wrapper/build'
  ): Promise<InvokeApiResult<Types.Uni_Trade>> => {
    return client.invoke<Types.Uni_Trade>({
      uri,
      module: 'query',
      method: 'createTradeFromRoute',
      input,
    })
  },

  createTradeFromRoutes: async (
    input: Uni_Query_Input_createTradeFromRoutes,
    client: Client,
    uri = 'w3://fs/./../../integrations/uniswapv3/wrapper/build'
  ): Promise<InvokeApiResult<Types.Uni_Trade>> => {
    return client.invoke<Types.Uni_Trade>({
      uri,
      module: 'query',
      method: 'createTradeFromRoutes',
      input,
    })
  },

  createUncheckedTrade: async (
    input: Uni_Query_Input_createUncheckedTrade,
    client: Client,
    uri = 'w3://fs/./../../integrations/uniswapv3/wrapper/build'
  ): Promise<InvokeApiResult<Types.Uni_Trade>> => {
    return client.invoke<Types.Uni_Trade>({
      uri,
      module: 'query',
      method: 'createUncheckedTrade',
      input,
    })
  },

  createUncheckedTradeWithMultipleRoutes: async (
    input: Uni_Query_Input_createUncheckedTradeWithMultipleRoutes,
    client: Client,
    uri = 'w3://fs/./../../integrations/uniswapv3/wrapper/build'
  ): Promise<InvokeApiResult<Types.Uni_Trade>> => {
    return client.invoke<Types.Uni_Trade>({
      uri,
      module: 'query',
      method: 'createUncheckedTradeWithMultipleRoutes',
      input,
    })
  },

  tradeInputAmount: async (
    input: Uni_Query_Input_tradeInputAmount,
    client: Client,
    uri = 'w3://fs/./../../integrations/uniswapv3/wrapper/build'
  ): Promise<InvokeApiResult<Types.Uni_TokenAmount>> => {
    return client.invoke<Types.Uni_TokenAmount>({
      uri,
      module: 'query',
      method: 'tradeInputAmount',
      input,
    })
  },

  tradeOutputAmount: async (
    input: Uni_Query_Input_tradeOutputAmount,
    client: Client,
    uri = 'w3://fs/./../../integrations/uniswapv3/wrapper/build'
  ): Promise<InvokeApiResult<Types.Uni_TokenAmount>> => {
    return client.invoke<Types.Uni_TokenAmount>({
      uri,
      module: 'query',
      method: 'tradeOutputAmount',
      input,
    })
  },

  tradeExecutionPrice: async (
    input: Uni_Query_Input_tradeExecutionPrice,
    client: Client,
    uri = 'w3://fs/./../../integrations/uniswapv3/wrapper/build'
  ): Promise<InvokeApiResult<Types.Uni_Price>> => {
    return client.invoke<Types.Uni_Price>({
      uri,
      module: 'query',
      method: 'tradeExecutionPrice',
      input,
    })
  },

  tradePriceImpact: async (
    input: Uni_Query_Input_tradePriceImpact,
    client: Client,
    uri = 'w3://fs/./../../integrations/uniswapv3/wrapper/build'
  ): Promise<InvokeApiResult<Types.Uni_Fraction>> => {
    return client.invoke<Types.Uni_Fraction>({
      uri,
      module: 'query',
      method: 'tradePriceImpact',
      input,
    })
  },

  tradeMinimumAmountOut: async (
    input: Uni_Query_Input_tradeMinimumAmountOut,
    client: Client,
    uri = 'w3://fs/./../../integrations/uniswapv3/wrapper/build'
  ): Promise<InvokeApiResult<Types.Uni_TokenAmount>> => {
    return client.invoke<Types.Uni_TokenAmount>({
      uri,
      module: 'query',
      method: 'tradeMinimumAmountOut',
      input,
    })
  },

  tradeMaximumAmountIn: async (
    input: Uni_Query_Input_tradeMaximumAmountIn,
    client: Client,
    uri = 'w3://fs/./../../integrations/uniswapv3/wrapper/build'
  ): Promise<InvokeApiResult<Types.Uni_TokenAmount>> => {
    return client.invoke<Types.Uni_TokenAmount>({
      uri,
      module: 'query',
      method: 'tradeMaximumAmountIn',
      input,
    })
  },

  tradeWorstExecutionPrice: async (
    input: Uni_Query_Input_tradeWorstExecutionPrice,
    client: Client,
    uri = 'w3://fs/./../../integrations/uniswapv3/wrapper/build'
  ): Promise<InvokeApiResult<Types.Uni_Price>> => {
    return client.invoke<Types.Uni_Price>({
      uri,
      module: 'query',
      method: 'tradeWorstExecutionPrice',
      input,
    })
  },

  bestTradeExactIn: async (
    input: Uni_Query_Input_bestTradeExactIn,
    client: Client,
    uri = 'w3://fs/./../../integrations/uniswapv3/wrapper/build'
  ): Promise<InvokeApiResult<Array<Types.Uni_Trade>>> => {
    return client.invoke<Array<Types.Uni_Trade>>({
      uri,
      module: 'query',
      method: 'bestTradeExactIn',
      input,
    })
  },

  bestTradeExactOut: async (
    input: Uni_Query_Input_bestTradeExactOut,
    client: Client,
    uri = 'w3://fs/./../../integrations/uniswapv3/wrapper/build'
  ): Promise<InvokeApiResult<Array<Types.Uni_Trade>>> => {
    return client.invoke<Array<Types.Uni_Trade>>({
      uri,
      module: 'query',
      method: 'bestTradeExactOut',
      input,
    })
  },

  createPosition: async (
    input: Uni_Query_Input_createPosition,
    client: Client,
    uri = 'w3://fs/./../../integrations/uniswapv3/wrapper/build'
  ): Promise<InvokeApiResult<Types.Uni_Position>> => {
    return client.invoke<Types.Uni_Position>({
      uri,
      module: 'query',
      method: 'createPosition',
      input,
    })
  },

  createPositionFromAmounts: async (
    input: Uni_Query_Input_createPositionFromAmounts,
    client: Client,
    uri = 'w3://fs/./../../integrations/uniswapv3/wrapper/build'
  ): Promise<InvokeApiResult<Types.Uni_Position>> => {
    return client.invoke<Types.Uni_Position>({
      uri,
      module: 'query',
      method: 'createPositionFromAmounts',
      input,
    })
  },

  createPositionFromAmount0: async (
    input: Uni_Query_Input_createPositionFromAmount0,
    client: Client,
    uri = 'w3://fs/./../../integrations/uniswapv3/wrapper/build'
  ): Promise<InvokeApiResult<Types.Uni_Position>> => {
    return client.invoke<Types.Uni_Position>({
      uri,
      module: 'query',
      method: 'createPositionFromAmount0',
      input,
    })
  },

  createPositionFromAmount1: async (
    input: Uni_Query_Input_createPositionFromAmount1,
    client: Client,
    uri = 'w3://fs/./../../integrations/uniswapv3/wrapper/build'
  ): Promise<InvokeApiResult<Types.Uni_Position>> => {
    return client.invoke<Types.Uni_Position>({
      uri,
      module: 'query',
      method: 'createPositionFromAmount1',
      input,
    })
  },

  positionToken0PriceLower: async (
    input: Uni_Query_Input_positionToken0PriceLower,
    client: Client,
    uri = 'w3://fs/./../../integrations/uniswapv3/wrapper/build'
  ): Promise<InvokeApiResult<Types.Uni_Price>> => {
    return client.invoke<Types.Uni_Price>({
      uri,
      module: 'query',
      method: 'positionToken0PriceLower',
      input,
    })
  },

  positionToken0PriceUpper: async (
    input: Uni_Query_Input_positionToken0PriceUpper,
    client: Client,
    uri = 'w3://fs/./../../integrations/uniswapv3/wrapper/build'
  ): Promise<InvokeApiResult<Types.Uni_Price>> => {
    return client.invoke<Types.Uni_Price>({
      uri,
      module: 'query',
      method: 'positionToken0PriceUpper',
      input,
    })
  },

  positionAmount0: async (
    input: Uni_Query_Input_positionAmount0,
    client: Client,
    uri = 'w3://fs/./../../integrations/uniswapv3/wrapper/build'
  ): Promise<InvokeApiResult<Types.Uni_TokenAmount>> => {
    return client.invoke<Types.Uni_TokenAmount>({
      uri,
      module: 'query',
      method: 'positionAmount0',
      input,
    })
  },

  positionAmount1: async (
    input: Uni_Query_Input_positionAmount1,
    client: Client,
    uri = 'w3://fs/./../../integrations/uniswapv3/wrapper/build'
  ): Promise<InvokeApiResult<Types.Uni_TokenAmount>> => {
    return client.invoke<Types.Uni_TokenAmount>({
      uri,
      module: 'query',
      method: 'positionAmount1',
      input,
    })
  },

  mintAmounts: async (
    input: Uni_Query_Input_mintAmounts,
    client: Client,
    uri = 'w3://fs/./../../integrations/uniswapv3/wrapper/build'
  ): Promise<InvokeApiResult<Types.Uni_MintAmounts>> => {
    return client.invoke<Types.Uni_MintAmounts>({
      uri,
      module: 'query',
      method: 'mintAmounts',
      input,
    })
  },

  mintAmountsWithSlippage: async (
    input: Uni_Query_Input_mintAmountsWithSlippage,
    client: Client,
    uri = 'w3://fs/./../../integrations/uniswapv3/wrapper/build'
  ): Promise<InvokeApiResult<Types.Uni_MintAmounts>> => {
    return client.invoke<Types.Uni_MintAmounts>({
      uri,
      module: 'query',
      method: 'mintAmountsWithSlippage',
      input,
    })
  },

  burnAmountsWithSlippage: async (
    input: Uni_Query_Input_burnAmountsWithSlippage,
    client: Client,
    uri = 'w3://fs/./../../integrations/uniswapv3/wrapper/build'
  ): Promise<InvokeApiResult<Types.Uni_MintAmounts>> => {
    return client.invoke<Types.Uni_MintAmounts>({
      uri,
      module: 'query',
      method: 'burnAmountsWithSlippage',
      input,
    })
  },

  swapCallParameters: async (
    input: Uni_Query_Input_swapCallParameters,
    client: Client,
    uri = 'w3://fs/./../../integrations/uniswapv3/wrapper/build'
  ): Promise<InvokeApiResult<Types.Uni_MethodParameters>> => {
    return client.invoke<Types.Uni_MethodParameters>({
      uri,
      module: 'query',
      method: 'swapCallParameters',
      input,
    })
  },

  encodeRouteToPath: async (
    input: Uni_Query_Input_encodeRouteToPath,
    client: Client,
    uri = 'w3://fs/./../../integrations/uniswapv3/wrapper/build'
  ): Promise<InvokeApiResult<string>> => {
    return client.invoke<string>({
      uri,
      module: 'query',
      method: 'encodeRouteToPath',
      input,
    })
  },

  encodePermit: async (
    input: Uni_Query_Input_encodePermit,
    client: Client,
    uri = 'w3://fs/./../../integrations/uniswapv3/wrapper/build'
  ): Promise<InvokeApiResult<string>> => {
    return client.invoke<string>({
      uri,
      module: 'query',
      method: 'encodePermit',
      input,
    })
  },

  encodeUnwrapWETH9: async (
    input: Uni_Query_Input_encodeUnwrapWETH9,
    client: Client,
    uri = 'w3://fs/./../../integrations/uniswapv3/wrapper/build'
  ): Promise<InvokeApiResult<string>> => {
    return client.invoke<string>({
      uri,
      module: 'query',
      method: 'encodeUnwrapWETH9',
      input,
    })
  },

  encodeSweepToken: async (
    input: Uni_Query_Input_encodeSweepToken,
    client: Client,
    uri = 'w3://fs/./../../integrations/uniswapv3/wrapper/build'
  ): Promise<InvokeApiResult<string>> => {
    return client.invoke<string>({
      uri,
      module: 'query',
      method: 'encodeSweepToken',
      input,
    })
  },

  encodeRefundETH: async (
    input: Uni_Query_Input_encodeRefundETH,
    client: Client,
    uri = 'w3://fs/./../../integrations/uniswapv3/wrapper/build'
  ): Promise<InvokeApiResult<string>> => {
    return client.invoke<string>({
      uri,
      module: 'query',
      method: 'encodeRefundETH',
      input,
    })
  },

  encodeMulticall: async (
    input: Uni_Query_Input_encodeMulticall,
    client: Client,
    uri = 'w3://fs/./../../integrations/uniswapv3/wrapper/build'
  ): Promise<InvokeApiResult<string>> => {
    return client.invoke<string>({
      uri,
      module: 'query',
      method: 'encodeMulticall',
      input,
    })
  },

  collectRewards: async (
    input: Uni_Query_Input_collectRewards,
    client: Client,
    uri = 'w3://fs/./../../integrations/uniswapv3/wrapper/build'
  ): Promise<InvokeApiResult<Types.Uni_MethodParameters>> => {
    return client.invoke<Types.Uni_MethodParameters>({
      uri,
      module: 'query',
      method: 'collectRewards',
      input,
    })
  },

  withdrawToken: async (
    input: Uni_Query_Input_withdrawToken,
    client: Client,
    uri = 'w3://fs/./../../integrations/uniswapv3/wrapper/build'
  ): Promise<InvokeApiResult<Types.Uni_MethodParameters>> => {
    return client.invoke<Types.Uni_MethodParameters>({
      uri,
      module: 'query',
      method: 'withdrawToken',
      input,
    })
  },

  encodeDeposit: async (
    input: Uni_Query_Input_encodeDeposit,
    client: Client,
    uri = 'w3://fs/./../../integrations/uniswapv3/wrapper/build'
  ): Promise<InvokeApiResult<string>> => {
    return client.invoke<string>({
      uri,
      module: 'query',
      method: 'encodeDeposit',
      input,
    })
  },

  quoteCallParameters: async (
    input: Uni_Query_Input_quoteCallParameters,
    client: Client,
    uri = 'w3://fs/./../../integrations/uniswapv3/wrapper/build'
  ): Promise<InvokeApiResult<Types.Uni_MethodParameters>> => {
    return client.invoke<Types.Uni_MethodParameters>({
      uri,
      module: 'query',
      method: 'quoteCallParameters',
      input,
    })
  },

  createCallParameters: async (
    input: Uni_Query_Input_createCallParameters,
    client: Client,
    uri = 'w3://fs/./../../integrations/uniswapv3/wrapper/build'
  ): Promise<InvokeApiResult<Types.Uni_MethodParameters>> => {
    return client.invoke<Types.Uni_MethodParameters>({
      uri,
      module: 'query',
      method: 'createCallParameters',
      input,
    })
  },

  addCallParameters: async (
    input: Uni_Query_Input_addCallParameters,
    client: Client,
    uri = 'w3://fs/./../../integrations/uniswapv3/wrapper/build'
  ): Promise<InvokeApiResult<Types.Uni_MethodParameters>> => {
    return client.invoke<Types.Uni_MethodParameters>({
      uri,
      module: 'query',
      method: 'addCallParameters',
      input,
    })
  },

  collectCallParameters: async (
    input: Uni_Query_Input_collectCallParameters,
    client: Client,
    uri = 'w3://fs/./../../integrations/uniswapv3/wrapper/build'
  ): Promise<InvokeApiResult<Types.Uni_MethodParameters>> => {
    return client.invoke<Types.Uni_MethodParameters>({
      uri,
      module: 'query',
      method: 'collectCallParameters',
      input,
    })
  },

  removeCallParameters: async (
    input: Uni_Query_Input_removeCallParameters,
    client: Client,
    uri = 'w3://fs/./../../integrations/uniswapv3/wrapper/build'
  ): Promise<InvokeApiResult<Types.Uni_MethodParameters>> => {
    return client.invoke<Types.Uni_MethodParameters>({
      uri,
      module: 'query',
      method: 'removeCallParameters',
      input,
    })
  },

  safeTransferFromParameters: async (
    input: Uni_Query_Input_safeTransferFromParameters,
    client: Client,
    uri = 'w3://fs/./../../integrations/uniswapv3/wrapper/build'
  ): Promise<InvokeApiResult<Types.Uni_MethodParameters>> => {
    return client.invoke<Types.Uni_MethodParameters>({
      uri,
      module: 'query',
      method: 'safeTransferFromParameters',
      input,
    })
  },

  toHex: async (
    input: Uni_Query_Input_toHex,
    client: Client,
    uri = 'w3://fs/./../../integrations/uniswapv3/wrapper/build'
  ): Promise<InvokeApiResult<string>> => {
    return client.invoke<string>({
      uri,
      module: 'query',
      method: 'toHex',
      input,
    })
  },

  computePoolAddress: async (
    input: Uni_Query_Input_computePoolAddress,
    client: Client,
    uri = 'w3://fs/./../../integrations/uniswapv3/wrapper/build'
  ): Promise<InvokeApiResult<string>> => {
    return client.invoke<string>({
      uri,
      module: 'query',
      method: 'computePoolAddress',
      input,
    })
  },

  encodeSqrtRatioX96: async (
    input: Uni_Query_Input_encodeSqrtRatioX96,
    client: Client,
    uri = 'w3://fs/./../../integrations/uniswapv3/wrapper/build'
  ): Promise<InvokeApiResult<BigInt>> => {
    return client.invoke<BigInt>({
      uri,
      module: 'query',
      method: 'encodeSqrtRatioX96',
      input,
    })
  },

  mulDivRoundingUp: async (
    input: Uni_Query_Input_mulDivRoundingUp,
    client: Client,
    uri = 'w3://fs/./../../integrations/uniswapv3/wrapper/build'
  ): Promise<InvokeApiResult<BigInt>> => {
    return client.invoke<BigInt>({
      uri,
      module: 'query',
      method: 'mulDivRoundingUp',
      input,
    })
  },

  addDelta: async (
    input: Uni_Query_Input_addDelta,
    client: Client,
    uri = 'w3://fs/./../../integrations/uniswapv3/wrapper/build'
  ): Promise<InvokeApiResult<BigInt>> => {
    return client.invoke<BigInt>({
      uri,
      module: 'query',
      method: 'addDelta',
      input,
    })
  },

  maxLiquidityForAmounts: async (
    input: Uni_Query_Input_maxLiquidityForAmounts,
    client: Client,
    uri = 'w3://fs/./../../integrations/uniswapv3/wrapper/build'
  ): Promise<InvokeApiResult<BigInt>> => {
    return client.invoke<BigInt>({
      uri,
      module: 'query',
      method: 'maxLiquidityForAmounts',
      input,
    })
  },

  mostSignificantBit: async (
    input: Uni_Query_Input_mostSignificantBit,
    client: Client,
    uri = 'w3://fs/./../../integrations/uniswapv3/wrapper/build'
  ): Promise<InvokeApiResult<UInt32>> => {
    return client.invoke<UInt32>({
      uri,
      module: 'query',
      method: 'mostSignificantBit',
      input,
    })
  },

  nearestUsableTick: async (
    input: Uni_Query_Input_nearestUsableTick,
    client: Client,
    uri = 'w3://fs/./../../integrations/uniswapv3/wrapper/build'
  ): Promise<InvokeApiResult<Int32>> => {
    return client.invoke<Int32>({
      uri,
      module: 'query',
      method: 'nearestUsableTick',
      input,
    })
  },

  tickToPrice: async (
    input: Uni_Query_Input_tickToPrice,
    client: Client,
    uri = 'w3://fs/./../../integrations/uniswapv3/wrapper/build'
  ): Promise<InvokeApiResult<Types.Uni_Price>> => {
    return client.invoke<Types.Uni_Price>({
      uri,
      module: 'query',
      method: 'tickToPrice',
      input,
    })
  },

  priceToClosestTick: async (
    input: Uni_Query_Input_priceToClosestTick,
    client: Client,
    uri = 'w3://fs/./../../integrations/uniswapv3/wrapper/build'
  ): Promise<InvokeApiResult<Int32>> => {
    return client.invoke<Int32>({
      uri,
      module: 'query',
      method: 'priceToClosestTick',
      input,
    })
  },

  getAmount0Delta: async (
    input: Uni_Query_Input_getAmount0Delta,
    client: Client,
    uri = 'w3://fs/./../../integrations/uniswapv3/wrapper/build'
  ): Promise<InvokeApiResult<BigInt>> => {
    return client.invoke<BigInt>({
      uri,
      module: 'query',
      method: 'getAmount0Delta',
      input,
    })
  },

  getAmount1Delta: async (
    input: Uni_Query_Input_getAmount1Delta,
    client: Client,
    uri = 'w3://fs/./../../integrations/uniswapv3/wrapper/build'
  ): Promise<InvokeApiResult<BigInt>> => {
    return client.invoke<BigInt>({
      uri,
      module: 'query',
      method: 'getAmount1Delta',
      input,
    })
  },

  getNextSqrtPriceFromInput: async (
    input: Uni_Query_Input_getNextSqrtPriceFromInput,
    client: Client,
    uri = 'w3://fs/./../../integrations/uniswapv3/wrapper/build'
  ): Promise<InvokeApiResult<BigInt>> => {
    return client.invoke<BigInt>({
      uri,
      module: 'query',
      method: 'getNextSqrtPriceFromInput',
      input,
    })
  },

  getNextSqrtPriceFromOutput: async (
    input: Uni_Query_Input_getNextSqrtPriceFromOutput,
    client: Client,
    uri = 'w3://fs/./../../integrations/uniswapv3/wrapper/build'
  ): Promise<InvokeApiResult<BigInt>> => {
    return client.invoke<BigInt>({
      uri,
      module: 'query',
      method: 'getNextSqrtPriceFromOutput',
      input,
    })
  },

  tickIsBelowSmallest: async (
    input: Uni_Query_Input_tickIsBelowSmallest,
    client: Client,
    uri = 'w3://fs/./../../integrations/uniswapv3/wrapper/build'
  ): Promise<InvokeApiResult<boolean>> => {
    return client.invoke<boolean>({
      uri,
      module: 'query',
      method: 'tickIsBelowSmallest',
      input,
    })
  },

  tickIsAtOrAboveLargest: async (
    input: Uni_Query_Input_tickIsAtOrAboveLargest,
    client: Client,
    uri = 'w3://fs/./../../integrations/uniswapv3/wrapper/build'
  ): Promise<InvokeApiResult<boolean>> => {
    return client.invoke<boolean>({
      uri,
      module: 'query',
      method: 'tickIsAtOrAboveLargest',
      input,
    })
  },

  nextInitializedTick: async (
    input: Uni_Query_Input_nextInitializedTick,
    client: Client,
    uri = 'w3://fs/./../../integrations/uniswapv3/wrapper/build'
  ): Promise<InvokeApiResult<Types.Uni_Tick>> => {
    return client.invoke<Types.Uni_Tick>({
      uri,
      module: 'query',
      method: 'nextInitializedTick',
      input,
    })
  },

  tickListIsSorted: async (
    input: Uni_Query_Input_tickListIsSorted,
    client: Client,
    uri = 'w3://fs/./../../integrations/uniswapv3/wrapper/build'
  ): Promise<InvokeApiResult<boolean>> => {
    return client.invoke<boolean>({
      uri,
      module: 'query',
      method: 'tickListIsSorted',
      input,
    })
  },

  getSqrtRatioAtTick: async (
    input: Uni_Query_Input_getSqrtRatioAtTick,
    client: Client,
    uri = 'w3://fs/./../../integrations/uniswapv3/wrapper/build'
  ): Promise<InvokeApiResult<BigInt>> => {
    return client.invoke<BigInt>({
      uri,
      module: 'query',
      method: 'getSqrtRatioAtTick',
      input,
    })
  },

  getTickAtSqrtRatio: async (
    input: Uni_Query_Input_getTickAtSqrtRatio,
    client: Client,
    uri = 'w3://fs/./../../integrations/uniswapv3/wrapper/build'
  ): Promise<InvokeApiResult<Int32>> => {
    return client.invoke<Int32>({
      uri,
      module: 'query',
      method: 'getTickAtSqrtRatio',
      input,
    })
  },

  fetchToken: async (
    input: Uni_Query_Input_fetchToken,
    client: Client,
    uri = 'w3://fs/./../../integrations/uniswapv3/wrapper/build'
  ): Promise<InvokeApiResult<Types.Uni_Token>> => {
    return client.invoke<Types.Uni_Token>({
      uri,
      module: 'query',
      method: 'fetchToken',
      input,
    })
  },

  fetchPoolFromTokens: async (
    input: Uni_Query_Input_fetchPoolFromTokens,
    client: Client,
    uri = 'w3://fs/./../../integrations/uniswapv3/wrapper/build'
  ): Promise<InvokeApiResult<Types.Uni_Pool>> => {
    return client.invoke<Types.Uni_Pool>({
      uri,
      module: 'query',
      method: 'fetchPoolFromTokens',
      input,
    })
  },

  fetchPoolFromAddress: async (
    input: Uni_Query_Input_fetchPoolFromAddress,
    client: Client,
    uri = 'w3://fs/./../../integrations/uniswapv3/wrapper/build'
  ): Promise<InvokeApiResult<Types.Uni_Pool>> => {
    return client.invoke<Types.Uni_Pool>({
      uri,
      module: 'query',
      method: 'fetchPoolFromAddress',
      input,
    })
  },

  fetchTickList: async (
    input: Uni_Query_Input_fetchTickList,
    client: Client,
    uri = 'w3://fs/./../../integrations/uniswapv3/wrapper/build'
  ): Promise<InvokeApiResult<Array<Types.Uni_Tick>>> => {
    return client.invoke<Array<Types.Uni_Tick>>({
      uri,
      module: 'query',
      method: 'fetchTickList',
      input,
    })
  },

  feeAmountToTickSpacing: async (
    input: Uni_Query_Input_feeAmountToTickSpacing,
    client: Client,
    uri = 'w3://fs/./../../integrations/uniswapv3/wrapper/build'
  ): Promise<InvokeApiResult<Int32>> => {
    return client.invoke<Int32>({
      uri,
      module: 'query',
      method: 'feeAmountToTickSpacing',
      input,
    })
  },

  getFeeAmount: async (
    input: Uni_Query_Input_getFeeAmount,
    client: Client,
    uri = 'w3://fs/./../../integrations/uniswapv3/wrapper/build'
  ): Promise<InvokeApiResult<UInt32>> => {
    return client.invoke<UInt32>({
      uri,
      module: 'query',
      method: 'getFeeAmount',
      input,
    })
  },

  getPermitV: async (
    input: Uni_Query_Input_getPermitV,
    client: Client,
    uri = 'w3://fs/./../../integrations/uniswapv3/wrapper/build'
  ): Promise<InvokeApiResult<Int32>> => {
    return client.invoke<Int32>({
      uri,
      module: 'query',
      method: 'getPermitV',
      input,
    })
  },

  FACTORY_ADDRESS: async (
    input: Uni_Query_Input_FACTORY_ADDRESS,
    client: Client,
    uri = 'w3://fs/./../../integrations/uniswapv3/wrapper/build'
  ): Promise<InvokeApiResult<string>> => {
    return client.invoke<string>({
      uri,
      module: 'query',
      method: 'FACTORY_ADDRESS',
      input,
    })
  },

  POOL_INIT_CODE_HASH: async (
    input: Uni_Query_Input_POOL_INIT_CODE_HASH,
    client: Client,
    uri = 'w3://fs/./../../integrations/uniswapv3/wrapper/build'
  ): Promise<InvokeApiResult<string>> => {
    return client.invoke<string>({
      uri,
      module: 'query',
      method: 'POOL_INIT_CODE_HASH',
      input,
    })
  },

  POOL_INIT_CODE_HASH_OPTIMISM: async (
    input: Uni_Query_Input_POOL_INIT_CODE_HASH_OPTIMISM,
    client: Client,
    uri = 'w3://fs/./../../integrations/uniswapv3/wrapper/build'
  ): Promise<InvokeApiResult<string>> => {
    return client.invoke<string>({
      uri,
      module: 'query',
      method: 'POOL_INIT_CODE_HASH_OPTIMISM',
      input,
    })
  },

  POOL_INIT_CODE_HASH_OPTIMISM_KOVAN: async (
    input: Uni_Query_Input_POOL_INIT_CODE_HASH_OPTIMISM_KOVAN,
    client: Client,
    uri = 'w3://fs/./../../integrations/uniswapv3/wrapper/build'
  ): Promise<InvokeApiResult<string>> => {
    return client.invoke<string>({
      uri,
      module: 'query',
      method: 'POOL_INIT_CODE_HASH_OPTIMISM_KOVAN',
      input,
    })
  },

  MIN_TICK: async (
    input: Uni_Query_Input_MIN_TICK,
    client: Client,
    uri = 'w3://fs/./../../integrations/uniswapv3/wrapper/build'
  ): Promise<InvokeApiResult<Int32>> => {
    return client.invoke<Int32>({
      uri,
      module: 'query',
      method: 'MIN_TICK',
      input,
    })
  },

  MAX_TICK: async (
    input: Uni_Query_Input_MAX_TICK,
    client: Client,
    uri = 'w3://fs/./../../integrations/uniswapv3/wrapper/build'
  ): Promise<InvokeApiResult<Int32>> => {
    return client.invoke<Int32>({
      uri,
      module: 'query',
      method: 'MAX_TICK',
      input,
    })
  },

  MIN_SQRT_RATIO: async (
    input: Uni_Query_Input_MIN_SQRT_RATIO,
    client: Client,
    uri = 'w3://fs/./../../integrations/uniswapv3/wrapper/build'
  ): Promise<InvokeApiResult<BigInt>> => {
    return client.invoke<BigInt>({
      uri,
      module: 'query',
      method: 'MIN_SQRT_RATIO',
      input,
    })
  },

  MAX_SQRT_RATIO: async (
    input: Uni_Query_Input_MAX_SQRT_RATIO,
    client: Client,
    uri = 'w3://fs/./../../integrations/uniswapv3/wrapper/build'
  ): Promise<InvokeApiResult<BigInt>> => {
    return client.invoke<BigInt>({
      uri,
      module: 'query',
      method: 'MAX_SQRT_RATIO',
      input,
    })
  },
}

/* URI: "w3://fs/./../../integrations/uniswapv3/wrapper/build" */
interface Uni_Mutation_Input_approve extends Record<string, unknown> {
  token: Types.Uni_Token
  amount?: BigInt | null
  gasOptions?: Types.Uni_GasOptions | null
}

/* URI: "w3://fs/./../../integrations/uniswapv3/wrapper/build" */
interface Uni_Mutation_Input_execCall extends Record<string, unknown> {
  parameters: Types.Uni_MethodParameters
  address: string
  chainId: Types.Uni_ChainId
  gasOptions?: Types.Uni_GasOptions | null
}

/* URI: "w3://fs/./../../integrations/uniswapv3/wrapper/build" */
interface Uni_Mutation_Input_execSwap extends Record<string, unknown> {
  trades: Array<Types.Uni_Trade>
  swapOptions: Types.Uni_SwapOptions
  gasOptions?: Types.Uni_GasOptions | null
}

/* URI: "w3://fs/./../../integrations/uniswapv3/wrapper/build" */
interface Uni_Mutation_Input_swap extends Record<string, unknown> {
  inToken: Types.Uni_Token
  outToken: Types.Uni_Token
  fee: Types.Uni_FeeAmount
  amount: BigInt
  tradeType: Types.Uni_TradeType
  swapOptions: Types.Uni_SwapOptions
  gasOptions?: Types.Uni_GasOptions | null
}

/* URI: "w3://fs/./../../integrations/uniswapv3/wrapper/build" */
interface Uni_Mutation_Input_swapWithPool extends Record<string, unknown> {
  address: string
  amount: Types.Uni_TokenAmount
  tradeType: Types.Uni_TradeType
  swapOptions: Types.Uni_SwapOptions
  gasOptions?: Types.Uni_GasOptions | null
}

/* URI: "w3://fs/./../../integrations/uniswapv3/wrapper/build" */
interface Uni_Mutation_Input_deployPool extends Record<string, unknown> {
  pool: Types.Uni_Pool
  gasOptions?: Types.Uni_GasOptions | null
}

/* URI: "w3://fs/./../../integrations/uniswapv3/wrapper/build" */
interface Uni_Mutation_Input_deployPoolFromTokens extends Record<string, unknown> {
  tokenA: Types.Uni_Token
  tokenB: Types.Uni_Token
  fee: Types.Uni_FeeAmount
  gasOptions?: Types.Uni_GasOptions | null
}

/* URI: "w3://fs/./../../integrations/uniswapv3/wrapper/build" */
export const Uni_Mutation = {
  approve: async (
    input: Uni_Mutation_Input_approve,
    client: Client,
    uri = 'w3://fs/./../../integrations/uniswapv3/wrapper/build'
  ): Promise<InvokeApiResult<Types.Uni_Ethereum_TxResponse>> => {
    return client.invoke<Types.Uni_Ethereum_TxResponse>({
      uri,
      module: 'mutation',
      method: 'approve',
      input,
    })
  },

  execCall: async (
    input: Uni_Mutation_Input_execCall,
    client: Client,
    uri = 'w3://fs/./../../integrations/uniswapv3/wrapper/build'
  ): Promise<InvokeApiResult<Types.Uni_Ethereum_TxResponse>> => {
    return client.invoke<Types.Uni_Ethereum_TxResponse>({
      uri,
      module: 'mutation',
      method: 'execCall',
      input,
    })
  },

  execSwap: async (
    input: Uni_Mutation_Input_execSwap,
    client: Client,
    uri = 'w3://fs/./../../integrations/uniswapv3/wrapper/build'
  ): Promise<InvokeApiResult<Types.Uni_Ethereum_TxResponse>> => {
    return client.invoke<Types.Uni_Ethereum_TxResponse>({
      uri,
      module: 'mutation',
      method: 'execSwap',
      input,
    })
  },

  swap: async (
    input: Uni_Mutation_Input_swap,
    client: Client,
    uri = 'w3://fs/./../../integrations/uniswapv3/wrapper/build'
  ): Promise<InvokeApiResult<Types.Uni_Ethereum_TxResponse>> => {
    return client.invoke<Types.Uni_Ethereum_TxResponse>({
      uri,
      module: 'mutation',
      method: 'swap',
      input,
    })
  },

  swapWithPool: async (
    input: Uni_Mutation_Input_swapWithPool,
    client: Client,
    uri = 'w3://fs/./../../integrations/uniswapv3/wrapper/build'
  ): Promise<InvokeApiResult<Types.Uni_Ethereum_TxResponse>> => {
    return client.invoke<Types.Uni_Ethereum_TxResponse>({
      uri,
      module: 'mutation',
      method: 'swapWithPool',
      input,
    })
  },

  deployPool: async (
    input: Uni_Mutation_Input_deployPool,
    client: Client,
    uri = 'w3://fs/./../../integrations/uniswapv3/wrapper/build'
  ): Promise<InvokeApiResult<Types.Uni_Ethereum_TxResponse>> => {
    return client.invoke<Types.Uni_Ethereum_TxResponse>({
      uri,
      module: 'mutation',
      method: 'deployPool',
      input,
    })
  },

  deployPoolFromTokens: async (
    input: Uni_Mutation_Input_deployPoolFromTokens,
    client: Client,
    uri = 'w3://fs/./../../integrations/uniswapv3/wrapper/build'
  ): Promise<InvokeApiResult<Types.Uni_Ethereum_TxResponse>> => {
    return client.invoke<Types.Uni_Ethereum_TxResponse>({
      uri,
      module: 'mutation',
      method: 'deployPoolFromTokens',
      input,
    })
  },
}

/// Imported Queries END ///
