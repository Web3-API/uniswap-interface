// @ts-ignore
import * as Types from "./";

// @ts-ignore
import {
  Client,
  InvokeResult
} from "@polywrap/core-js";

export type UInt = number;
export type UInt8 = number;
export type UInt16 = number;
export type UInt32 = number;
export type Int = number;
export type Int8 = number;
export type Int16 = number;
export type Int32 = number;
export type Bytes = Uint8Array;
export type BigInt = string;
export type BigNumber = string;
export type Json = string;
export type String = string;
export type Boolean = boolean;

/// Imported Objects START ///

/* URI: "wrap://ipfs/QmZ62dnMvxcGmVYoB6zHbaRvn7zbGAWN3f7sTY8FttTtzi" */
export interface Uni_Token {
  chainId: Types.Uni_ChainId;
  address: Types.String;
  currency: Types.Uni_Currency;
}

/* URI: "wrap://ipfs/QmZ62dnMvxcGmVYoB6zHbaRvn7zbGAWN3f7sTY8FttTtzi" */
export interface Uni_Currency {
  decimals: Types.UInt8;
  symbol?: Types.String | null;
  name?: Types.String | null;
}

/* URI: "wrap://ipfs/QmZ62dnMvxcGmVYoB6zHbaRvn7zbGAWN3f7sTY8FttTtzi" */
export interface Uni_Price {
  baseToken: Types.Uni_Token;
  quoteToken: Types.Uni_Token;
  denominator: Types.BigInt;
  numerator: Types.BigInt;
  price: Types.String;
}

/* URI: "wrap://ipfs/QmZ62dnMvxcGmVYoB6zHbaRvn7zbGAWN3f7sTY8FttTtzi" */
export interface Uni_Fraction {
  numerator: Types.BigInt;
  denominator: Types.BigInt;
  quotient: Types.String;
}

/* URI: "wrap://ipfs/QmZ62dnMvxcGmVYoB6zHbaRvn7zbGAWN3f7sTY8FttTtzi" */
export interface Uni_TokenAmount {
  token: Types.Uni_Token;
  amount: Types.BigInt;
}

/* URI: "wrap://ipfs/QmZ62dnMvxcGmVYoB6zHbaRvn7zbGAWN3f7sTY8FttTtzi" */
export interface Uni_Tick {
  index: Types.Int32;
  liquidityGross: Types.BigInt;
  liquidityNet: Types.BigInt;
}

/* URI: "wrap://ipfs/QmZ62dnMvxcGmVYoB6zHbaRvn7zbGAWN3f7sTY8FttTtzi" */
export interface Uni_Pool {
  token0: Types.Uni_Token;
  token1: Types.Uni_Token;
  fee: Types.Uni_FeeAmount;
  sqrtRatioX96: Types.BigInt;
  liquidity: Types.BigInt;
  tickCurrent: Types.Int32;
  tickDataProvider: Array<Types.Uni_Tick>;
  token0Price: Types.Uni_Price;
  token1Price: Types.Uni_Price;
}

/* URI: "wrap://ipfs/QmZ62dnMvxcGmVYoB6zHbaRvn7zbGAWN3f7sTY8FttTtzi" */
export interface Uni_Route {
  pools: Array<Types.Uni_Pool>;
  path: Array<Types.Uni_Token>;
  input: Types.Uni_Token;
  output: Types.Uni_Token;
  midPrice: Types.Uni_Price;
}

/* URI: "wrap://ipfs/QmZ62dnMvxcGmVYoB6zHbaRvn7zbGAWN3f7sTY8FttTtzi" */
export interface Uni_BestTradeOptions {
  maxNumResults?: Types.UInt32 | null;
  maxHops?: Types.UInt32 | null;
}

/* URI: "wrap://ipfs/QmZ62dnMvxcGmVYoB6zHbaRvn7zbGAWN3f7sTY8FttTtzi" */
export interface Uni_TradeSwap {
  route: Types.Uni_Route;
  inputAmount: Types.Uni_TokenAmount;
  outputAmount: Types.Uni_TokenAmount;
}

/* URI: "wrap://ipfs/QmZ62dnMvxcGmVYoB6zHbaRvn7zbGAWN3f7sTY8FttTtzi" */
export interface Uni_Trade {
  swaps: Array<Types.Uni_TradeSwap>;
  tradeType: Types.Uni_TradeType;
  inputAmount: Types.Uni_TokenAmount;
  outputAmount: Types.Uni_TokenAmount;
  executionPrice: Types.Uni_Price;
  priceImpact: Types.Uni_Fraction;
}

/* URI: "wrap://ipfs/QmZ62dnMvxcGmVYoB6zHbaRvn7zbGAWN3f7sTY8FttTtzi" */
export interface Uni_MintAmounts {
  amount0: Types.BigInt;
  amount1: Types.BigInt;
}

/* URI: "wrap://ipfs/QmZ62dnMvxcGmVYoB6zHbaRvn7zbGAWN3f7sTY8FttTtzi" */
export interface Uni_Position {
  pool: Types.Uni_Pool;
  tickLower: Types.Int32;
  tickUpper: Types.Int32;
  liquidity: Types.BigInt;
  token0Amount: Types.Uni_TokenAmount;
  token1Amount: Types.Uni_TokenAmount;
  mintAmounts: Types.Uni_MintAmounts;
  token0PriceLower: Types.Uni_Price;
  token0PriceUpper: Types.Uni_Price;
}

/* URI: "wrap://ipfs/QmZ62dnMvxcGmVYoB6zHbaRvn7zbGAWN3f7sTY8FttTtzi" */
export interface Uni_PermitOptions {
  v: Types.Uni_PermitV;
  r: Types.String;
  s: Types.String;
  amount?: Types.BigInt | null;
  deadline?: Types.BigInt | null;
  nonce?: Types.BigInt | null;
  expiry?: Types.BigInt | null;
}

/* URI: "wrap://ipfs/QmZ62dnMvxcGmVYoB6zHbaRvn7zbGAWN3f7sTY8FttTtzi" */
export interface Uni_FeeOptions {
  fee: Types.String;
  recipient: Types.String;
}

/* URI: "wrap://ipfs/QmZ62dnMvxcGmVYoB6zHbaRvn7zbGAWN3f7sTY8FttTtzi" */
export interface Uni_SwapOptions {
  slippageTolerance: Types.String;
  recipient: Types.String;
  deadline: Types.BigInt;
  inputTokenPermit?: Types.Uni_PermitOptions | null;
  sqrtPriceLimitX96?: Types.BigInt | null;
  fee?: Types.Uni_FeeOptions | null;
}

/* URI: "wrap://ipfs/QmZ62dnMvxcGmVYoB6zHbaRvn7zbGAWN3f7sTY8FttTtzi" */
export interface Uni_MethodParameters {
  calldata: Types.String;
  value: Types.String;
}

/* URI: "wrap://ipfs/QmZ62dnMvxcGmVYoB6zHbaRvn7zbGAWN3f7sTY8FttTtzi" */
export interface Uni_GasOptions {
  gasPrice?: Types.BigInt | null;
  gasLimit?: Types.BigInt | null;
}

/* URI: "wrap://ipfs/QmZ62dnMvxcGmVYoB6zHbaRvn7zbGAWN3f7sTY8FttTtzi" */
export interface Uni_NextTickResult {
  index: Types.Int32;
  found: Types.Boolean;
}

/* URI: "wrap://ipfs/QmZ62dnMvxcGmVYoB6zHbaRvn7zbGAWN3f7sTY8FttTtzi" */
export interface Uni_PoolChangeResult {
  amount: Types.Uni_TokenAmount;
  nextPool: Types.Uni_Pool;
}

/* URI: "wrap://ipfs/QmZ62dnMvxcGmVYoB6zHbaRvn7zbGAWN3f7sTY8FttTtzi" */
export interface Uni_TradeRoute {
  route: Types.Uni_Route;
  amount: Types.Uni_TokenAmount;
}

/* URI: "wrap://ipfs/QmZ62dnMvxcGmVYoB6zHbaRvn7zbGAWN3f7sTY8FttTtzi" */
export interface Uni_IncentiveKey {
  rewardToken: Types.Uni_Token;
  pool: Types.Uni_Pool;
  startTime: Types.BigInt;
  endTime: Types.BigInt;
  refundee: Types.String;
}

/* URI: "wrap://ipfs/QmZ62dnMvxcGmVYoB6zHbaRvn7zbGAWN3f7sTY8FttTtzi" */
export interface Uni_ClaimOptions {
  tokenId: Types.BigInt;
  recipient: Types.String;
  amount?: Types.BigInt | null;
}

/* URI: "wrap://ipfs/QmZ62dnMvxcGmVYoB6zHbaRvn7zbGAWN3f7sTY8FttTtzi" */
export interface Uni_FullWithdrawOptions {
  owner: Types.String;
  data?: Types.String | null;
  tokenId: Types.BigInt;
  recipient: Types.String;
  amount?: Types.BigInt | null;
}

/* URI: "wrap://ipfs/QmZ62dnMvxcGmVYoB6zHbaRvn7zbGAWN3f7sTY8FttTtzi" */
export interface Uni_QuoteOptions {
  sqrtPriceLimitX96?: Types.BigInt | null;
}

/* URI: "wrap://ipfs/QmZ62dnMvxcGmVYoB6zHbaRvn7zbGAWN3f7sTY8FttTtzi" */
export interface Uni_CommonAddLiquidityOptions {
  slippageTolerance: Types.String;
  deadline: Types.BigInt;
  useNative?: Types.Uni_Token | null;
  token0Permit?: Types.Uni_PermitOptions | null;
  token1Permit?: Types.Uni_PermitOptions | null;
}

/* URI: "wrap://ipfs/QmZ62dnMvxcGmVYoB6zHbaRvn7zbGAWN3f7sTY8FttTtzi" */
export interface Uni_AddLiquidityOptions {
  recipient?: Types.String | null;
  createPool?: Types.Boolean | null;
  tokenId?: Types.BigInt | null;
  slippageTolerance: Types.String;
  deadline: Types.BigInt;
  useNative?: Types.Uni_Token | null;
  token0Permit?: Types.Uni_PermitOptions | null;
  token1Permit?: Types.Uni_PermitOptions | null;
}

/* URI: "wrap://ipfs/QmZ62dnMvxcGmVYoB6zHbaRvn7zbGAWN3f7sTY8FttTtzi" */
export interface Uni_SafeTransferOptions {
  sender: Types.String;
  recipient: Types.String;
  tokenId: Types.BigInt;
  data?: Types.String | null;
}

/* URI: "wrap://ipfs/QmZ62dnMvxcGmVYoB6zHbaRvn7zbGAWN3f7sTY8FttTtzi" */
export interface Uni_CollectOptions {
  tokenId: Types.BigInt;
  expectedCurrencyOwed0: Types.Uni_TokenAmount;
  expectedCurrencyOwed1: Types.Uni_TokenAmount;
  recipient: Types.String;
}

/* URI: "wrap://ipfs/QmZ62dnMvxcGmVYoB6zHbaRvn7zbGAWN3f7sTY8FttTtzi" */
export interface Uni_NFTPermitOptions {
  v: Types.Uni_PermitV;
  r: Types.String;
  s: Types.String;
  deadline: Types.BigInt;
  spender: Types.String;
}

/* URI: "wrap://ipfs/QmZ62dnMvxcGmVYoB6zHbaRvn7zbGAWN3f7sTY8FttTtzi" */
export interface Uni_RemoveLiquidityOptions {
  tokenId: Types.BigInt;
  liquidityPercentage: Types.String;
  slippageTolerance: Types.String;
  deadline: Types.BigInt;
  burnToken?: Types.Boolean | null;
  permit?: Types.Uni_NFTPermitOptions | null;
  collectOptions: Types.Uni_CollectOptions;
}

/* URI: "wrap://ipfs/QmZ62dnMvxcGmVYoB6zHbaRvn7zbGAWN3f7sTY8FttTtzi" */
export interface Uni_Ethereum_TxResponse {
  hash: Types.String;
  to?: Types.String | null;
  from: Types.String;
  nonce: Types.UInt32;
  gasLimit: Types.BigInt;
  gasPrice?: Types.BigInt | null;
  data: Types.String;
  value: Types.BigInt;
  chainId: Types.BigInt;
  blockNumber?: Types.BigInt | null;
  blockHash?: Types.String | null;
  timestamp?: Types.UInt32 | null;
  confirmations: Types.UInt32;
  raw?: Types.String | null;
  r?: Types.String | null;
  s?: Types.String | null;
  v?: Types.UInt32 | null;
  type?: Types.UInt32 | null;
  accessList?: Array<Types.Uni_Ethereum_Access> | null;
}

/* URI: "wrap://ipfs/QmZ62dnMvxcGmVYoB6zHbaRvn7zbGAWN3f7sTY8FttTtzi" */
export interface Uni_Ethereum_Access {
  address: Types.String;
  storageKeys: Array<Types.String>;
}

/// Imported Objects END ///

/// Imported Enums START ///

/* URI: "wrap://ipfs/QmZ62dnMvxcGmVYoB6zHbaRvn7zbGAWN3f7sTY8FttTtzi" */
export enum Uni_ChainIdEnum {
  MAINNET,
  ROPSTEN,
  RINKEBY,
  GOERLI,
  KOVAN,
  OPTIMISM,
  OPTIMISTIC_KOVAN,
  ARBITRUM_ONE,
  ARBITRUM_RINKEBY,
  POLYGON,
  POLYGON_MUMBAI,
}

export type Uni_ChainIdString =
  | "MAINNET"
  | "ROPSTEN"
  | "RINKEBY"
  | "GOERLI"
  | "KOVAN"
  | "OPTIMISM"
  | "OPTIMISTIC_KOVAN"
  | "ARBITRUM_ONE"
  | "ARBITRUM_RINKEBY"
  | "POLYGON"
  | "POLYGON_MUMBAI"

export type Uni_ChainId = Uni_ChainIdEnum | Uni_ChainIdString;

/* URI: "wrap://ipfs/QmZ62dnMvxcGmVYoB6zHbaRvn7zbGAWN3f7sTY8FttTtzi" */
export enum Uni_FeeAmountEnum {
  LOWEST,
  LOW,
  MEDIUM,
  HIGH,
}

export type Uni_FeeAmountString =
  | "LOWEST"
  | "LOW"
  | "MEDIUM"
  | "HIGH"

export type Uni_FeeAmount = Uni_FeeAmountEnum | Uni_FeeAmountString;

/* URI: "wrap://ipfs/QmZ62dnMvxcGmVYoB6zHbaRvn7zbGAWN3f7sTY8FttTtzi" */
export enum Uni_TradeTypeEnum {
  EXACT_INPUT,
  EXACT_OUTPUT,
}

export type Uni_TradeTypeString =
  | "EXACT_INPUT"
  | "EXACT_OUTPUT"

export type Uni_TradeType = Uni_TradeTypeEnum | Uni_TradeTypeString;

/* URI: "wrap://ipfs/QmZ62dnMvxcGmVYoB6zHbaRvn7zbGAWN3f7sTY8FttTtzi" */
export enum Uni_PermitVEnum {
  v_0,
  v_1,
  v_27,
  v_28,
}

export type Uni_PermitVString =
  | "v_0"
  | "v_1"
  | "v_27"
  | "v_28"

export type Uni_PermitV = Uni_PermitVEnum | Uni_PermitVString;

/// Imported Enums END ///

/// Imported Modules START ///

/* URI: "wrap://ipfs/QmZ62dnMvxcGmVYoB6zHbaRvn7zbGAWN3f7sTY8FttTtzi" */
interface Uni_Module_Args_approve extends Record<string, unknown> {
  token: Types.Uni_Token;
  amount?: Types.BigInt | null;
  gasOptions?: Types.Uni_GasOptions | null;
}

/* URI: "wrap://ipfs/QmZ62dnMvxcGmVYoB6zHbaRvn7zbGAWN3f7sTY8FttTtzi" */
interface Uni_Module_Args_execCall extends Record<string, unknown> {
  parameters: Types.Uni_MethodParameters;
  address: Types.String;
  chainId: Types.Uni_ChainId;
  gasOptions?: Types.Uni_GasOptions | null;
}

/* URI: "wrap://ipfs/QmZ62dnMvxcGmVYoB6zHbaRvn7zbGAWN3f7sTY8FttTtzi" */
interface Uni_Module_Args_execSwap extends Record<string, unknown> {
  trades: Array<Types.Uni_Trade>;
  swapOptions: Types.Uni_SwapOptions;
  gasOptions?: Types.Uni_GasOptions | null;
}

/* URI: "wrap://ipfs/QmZ62dnMvxcGmVYoB6zHbaRvn7zbGAWN3f7sTY8FttTtzi" */
interface Uni_Module_Args_swap extends Record<string, unknown> {
  inToken: Types.Uni_Token;
  outToken: Types.Uni_Token;
  fee: Types.Uni_FeeAmount;
  amount: Types.BigInt;
  tradeType: Types.Uni_TradeType;
  swapOptions: Types.Uni_SwapOptions;
  gasOptions?: Types.Uni_GasOptions | null;
}

/* URI: "wrap://ipfs/QmZ62dnMvxcGmVYoB6zHbaRvn7zbGAWN3f7sTY8FttTtzi" */
interface Uni_Module_Args_swapWithPool extends Record<string, unknown> {
  address: Types.String;
  amount: Types.Uni_TokenAmount;
  tradeType: Types.Uni_TradeType;
  swapOptions: Types.Uni_SwapOptions;
  gasOptions?: Types.Uni_GasOptions | null;
}

/* URI: "wrap://ipfs/QmZ62dnMvxcGmVYoB6zHbaRvn7zbGAWN3f7sTY8FttTtzi" */
interface Uni_Module_Args_deployPool extends Record<string, unknown> {
  pool: Types.Uni_Pool;
  gasOptions?: Types.Uni_GasOptions | null;
}

/* URI: "wrap://ipfs/QmZ62dnMvxcGmVYoB6zHbaRvn7zbGAWN3f7sTY8FttTtzi" */
interface Uni_Module_Args_deployPoolFromTokens extends Record<string, unknown> {
  tokenA: Types.Uni_Token;
  tokenB: Types.Uni_Token;
  fee: Types.Uni_FeeAmount;
  gasOptions?: Types.Uni_GasOptions | null;
}

/* URI: "wrap://ipfs/QmZ62dnMvxcGmVYoB6zHbaRvn7zbGAWN3f7sTY8FttTtzi" */
interface Uni_Module_Args_currencyEquals extends Record<string, unknown> {
  currencyA: Types.Uni_Currency;
  currencyB: Types.Uni_Currency;
}

/* URI: "wrap://ipfs/QmZ62dnMvxcGmVYoB6zHbaRvn7zbGAWN3f7sTY8FttTtzi" */
interface Uni_Module_Args_tokenEquals extends Record<string, unknown> {
  tokenA: Types.Uni_Token;
  tokenB: Types.Uni_Token;
}

/* URI: "wrap://ipfs/QmZ62dnMvxcGmVYoB6zHbaRvn7zbGAWN3f7sTY8FttTtzi" */
interface Uni_Module_Args_tokenAmountEquals extends Record<string, unknown> {
  tokenAmountA: Types.Uni_TokenAmount;
  tokenAmountB: Types.Uni_TokenAmount;
}

/* URI: "wrap://ipfs/QmZ62dnMvxcGmVYoB6zHbaRvn7zbGAWN3f7sTY8FttTtzi" */
interface Uni_Module_Args_tokenSortsBefore extends Record<string, unknown> {
  tokenA: Types.Uni_Token;
  tokenB: Types.Uni_Token;
}

/* URI: "wrap://ipfs/QmZ62dnMvxcGmVYoB6zHbaRvn7zbGAWN3f7sTY8FttTtzi" */
interface Uni_Module_Args_getNative extends Record<string, unknown> {
  chainId: Types.Uni_ChainId;
}

/* URI: "wrap://ipfs/QmZ62dnMvxcGmVYoB6zHbaRvn7zbGAWN3f7sTY8FttTtzi" */
interface Uni_Module_Args_getWETH extends Record<string, unknown> {
  chainId: Types.Uni_ChainId;
}

/* URI: "wrap://ipfs/QmZ62dnMvxcGmVYoB6zHbaRvn7zbGAWN3f7sTY8FttTtzi" */
interface Uni_Module_Args_isNative extends Record<string, unknown> {
  token: Types.Uni_Token;
}

/* URI: "wrap://ipfs/QmZ62dnMvxcGmVYoB6zHbaRvn7zbGAWN3f7sTY8FttTtzi" */
interface Uni_Module_Args_wrapToken extends Record<string, unknown> {
  token: Types.Uni_Token;
}

/* URI: "wrap://ipfs/QmZ62dnMvxcGmVYoB6zHbaRvn7zbGAWN3f7sTY8FttTtzi" */
interface Uni_Module_Args_wrapAmount extends Record<string, unknown> {
  amount: Types.Uni_TokenAmount;
}

/* URI: "wrap://ipfs/QmZ62dnMvxcGmVYoB6zHbaRvn7zbGAWN3f7sTY8FttTtzi" */
interface Uni_Module_Args_validateTickList extends Record<string, unknown> {
  ticks: Array<Types.Uni_Tick>;
  tickSpacing: Types.Int32;
}

/* URI: "wrap://ipfs/QmZ62dnMvxcGmVYoB6zHbaRvn7zbGAWN3f7sTY8FttTtzi" */
interface Uni_Module_Args_getTick extends Record<string, unknown> {
  tickDataProvider: Array<Types.Uni_Tick>;
  tickIndex: Types.Int32;
}

/* URI: "wrap://ipfs/QmZ62dnMvxcGmVYoB6zHbaRvn7zbGAWN3f7sTY8FttTtzi" */
interface Uni_Module_Args_nextInitializedTickWithinOneWord extends Record<string, unknown> {
  tickDataProvider: Array<Types.Uni_Tick>;
  tick: Types.Int32;
  lte: Types.Boolean;
  tickSpacing: Types.Int32;
}

/* URI: "wrap://ipfs/QmZ62dnMvxcGmVYoB6zHbaRvn7zbGAWN3f7sTY8FttTtzi" */
interface Uni_Module_Args_createPool extends Record<string, unknown> {
  tokenA: Types.Uni_Token;
  tokenB: Types.Uni_Token;
  fee: Types.Uni_FeeAmount;
  sqrtRatioX96: Types.BigInt;
  liquidity: Types.BigInt;
  tickCurrent: Types.Int32;
  ticks?: Array<Types.Uni_Tick> | null;
}

/* URI: "wrap://ipfs/QmZ62dnMvxcGmVYoB6zHbaRvn7zbGAWN3f7sTY8FttTtzi" */
interface Uni_Module_Args_getPoolAddress extends Record<string, unknown> {
  tokenA: Types.Uni_Token;
  tokenB: Types.Uni_Token;
  fee: Types.Uni_FeeAmount;
  initCodeHashManualOverride?: Types.String | null;
}

/* URI: "wrap://ipfs/QmZ62dnMvxcGmVYoB6zHbaRvn7zbGAWN3f7sTY8FttTtzi" */
interface Uni_Module_Args_poolInvolvesToken extends Record<string, unknown> {
  pool: Types.Uni_Pool;
  token: Types.Uni_Token;
}

/* URI: "wrap://ipfs/QmZ62dnMvxcGmVYoB6zHbaRvn7zbGAWN3f7sTY8FttTtzi" */
interface Uni_Module_Args_poolToken0Price extends Record<string, unknown> {
  token0: Types.Uni_Token;
  token1: Types.Uni_Token;
  sqrtRatioX96: Types.BigInt;
}

/* URI: "wrap://ipfs/QmZ62dnMvxcGmVYoB6zHbaRvn7zbGAWN3f7sTY8FttTtzi" */
interface Uni_Module_Args_poolToken1Price extends Record<string, unknown> {
  token0: Types.Uni_Token;
  token1: Types.Uni_Token;
  sqrtRatioX96: Types.BigInt;
}

/* URI: "wrap://ipfs/QmZ62dnMvxcGmVYoB6zHbaRvn7zbGAWN3f7sTY8FttTtzi" */
interface Uni_Module_Args_poolPriceOf extends Record<string, unknown> {
  pool: Types.Uni_Pool;
  token: Types.Uni_Token;
}

/* URI: "wrap://ipfs/QmZ62dnMvxcGmVYoB6zHbaRvn7zbGAWN3f7sTY8FttTtzi" */
interface Uni_Module_Args_poolChainId extends Record<string, unknown> {
  pool: Types.Uni_Pool;
}

/* URI: "wrap://ipfs/QmZ62dnMvxcGmVYoB6zHbaRvn7zbGAWN3f7sTY8FttTtzi" */
interface Uni_Module_Args_getPoolOutputAmount extends Record<string, unknown> {
  pool: Types.Uni_Pool;
  inputAmount: Types.Uni_TokenAmount;
  sqrtPriceLimitX96?: Types.BigInt | null;
}

/* URI: "wrap://ipfs/QmZ62dnMvxcGmVYoB6zHbaRvn7zbGAWN3f7sTY8FttTtzi" */
interface Uni_Module_Args_getPoolInputAmount extends Record<string, unknown> {
  pool: Types.Uni_Pool;
  outputAmount: Types.Uni_TokenAmount;
  sqrtPriceLimitX96?: Types.BigInt | null;
}

/* URI: "wrap://ipfs/QmZ62dnMvxcGmVYoB6zHbaRvn7zbGAWN3f7sTY8FttTtzi" */
interface Uni_Module_Args_getPoolTickSpacing extends Record<string, unknown> {
  pool: Types.Uni_Pool;
}

/* URI: "wrap://ipfs/QmZ62dnMvxcGmVYoB6zHbaRvn7zbGAWN3f7sTY8FttTtzi" */
interface Uni_Module_Args_createRoute extends Record<string, unknown> {
  pools: Array<Types.Uni_Pool>;
  inToken: Types.Uni_Token;
  outToken: Types.Uni_Token;
}

/* URI: "wrap://ipfs/QmZ62dnMvxcGmVYoB6zHbaRvn7zbGAWN3f7sTY8FttTtzi" */
interface Uni_Module_Args_routeChainId extends Record<string, unknown> {
  route: Types.Uni_Route;
}

/* URI: "wrap://ipfs/QmZ62dnMvxcGmVYoB6zHbaRvn7zbGAWN3f7sTY8FttTtzi" */
interface Uni_Module_Args_routeMidPrice extends Record<string, unknown> {
  pools: Array<Types.Uni_Pool>;
  inToken: Types.Uni_Token;
  outToken: Types.Uni_Token;
}

/* URI: "wrap://ipfs/QmZ62dnMvxcGmVYoB6zHbaRvn7zbGAWN3f7sTY8FttTtzi" */
interface Uni_Module_Args_createTradeExactIn extends Record<string, unknown> {
  tradeRoute: Types.Uni_TradeRoute;
}

/* URI: "wrap://ipfs/QmZ62dnMvxcGmVYoB6zHbaRvn7zbGAWN3f7sTY8FttTtzi" */
interface Uni_Module_Args_createTradeExactOut extends Record<string, unknown> {
  tradeRoute: Types.Uni_TradeRoute;
}

/* URI: "wrap://ipfs/QmZ62dnMvxcGmVYoB6zHbaRvn7zbGAWN3f7sTY8FttTtzi" */
interface Uni_Module_Args_createTradeFromRoute extends Record<string, unknown> {
  tradeRoute: Types.Uni_TradeRoute;
  tradeType: Types.Uni_TradeType;
}

/* URI: "wrap://ipfs/QmZ62dnMvxcGmVYoB6zHbaRvn7zbGAWN3f7sTY8FttTtzi" */
interface Uni_Module_Args_createTradeFromRoutes extends Record<string, unknown> {
  tradeRoutes: Array<Types.Uni_TradeRoute>;
  tradeType: Types.Uni_TradeType;
}

/* URI: "wrap://ipfs/QmZ62dnMvxcGmVYoB6zHbaRvn7zbGAWN3f7sTY8FttTtzi" */
interface Uni_Module_Args_createUncheckedTrade extends Record<string, unknown> {
  swap: Types.Uni_TradeSwap;
  tradeType: Types.Uni_TradeType;
}

/* URI: "wrap://ipfs/QmZ62dnMvxcGmVYoB6zHbaRvn7zbGAWN3f7sTY8FttTtzi" */
interface Uni_Module_Args_createUncheckedTradeWithMultipleRoutes extends Record<string, unknown> {
  swaps: Array<Types.Uni_TradeSwap>;
  tradeType: Types.Uni_TradeType;
}

/* URI: "wrap://ipfs/QmZ62dnMvxcGmVYoB6zHbaRvn7zbGAWN3f7sTY8FttTtzi" */
interface Uni_Module_Args_tradeInputAmount extends Record<string, unknown> {
  swaps: Array<Types.Uni_TradeSwap>;
}

/* URI: "wrap://ipfs/QmZ62dnMvxcGmVYoB6zHbaRvn7zbGAWN3f7sTY8FttTtzi" */
interface Uni_Module_Args_tradeOutputAmount extends Record<string, unknown> {
  swaps: Array<Types.Uni_TradeSwap>;
}

/* URI: "wrap://ipfs/QmZ62dnMvxcGmVYoB6zHbaRvn7zbGAWN3f7sTY8FttTtzi" */
interface Uni_Module_Args_tradeExecutionPrice extends Record<string, unknown> {
  inputAmount: Types.Uni_TokenAmount;
  outputAmount: Types.Uni_TokenAmount;
}

/* URI: "wrap://ipfs/QmZ62dnMvxcGmVYoB6zHbaRvn7zbGAWN3f7sTY8FttTtzi" */
interface Uni_Module_Args_tradePriceImpact extends Record<string, unknown> {
  swaps: Array<Types.Uni_TradeSwap>;
  outputAmount: Types.Uni_TokenAmount;
}

/* URI: "wrap://ipfs/QmZ62dnMvxcGmVYoB6zHbaRvn7zbGAWN3f7sTY8FttTtzi" */
interface Uni_Module_Args_tradeMinimumAmountOut extends Record<string, unknown> {
  slippageTolerance: Types.String;
  amountOut: Types.Uni_TokenAmount;
  tradeType: Types.Uni_TradeType;
}

/* URI: "wrap://ipfs/QmZ62dnMvxcGmVYoB6zHbaRvn7zbGAWN3f7sTY8FttTtzi" */
interface Uni_Module_Args_tradeMaximumAmountIn extends Record<string, unknown> {
  slippageTolerance: Types.String;
  amountIn: Types.Uni_TokenAmount;
  tradeType: Types.Uni_TradeType;
}

/* URI: "wrap://ipfs/QmZ62dnMvxcGmVYoB6zHbaRvn7zbGAWN3f7sTY8FttTtzi" */
interface Uni_Module_Args_tradeWorstExecutionPrice extends Record<string, unknown> {
  trade: Types.Uni_Trade;
  slippageTolerance: Types.String;
}

/* URI: "wrap://ipfs/QmZ62dnMvxcGmVYoB6zHbaRvn7zbGAWN3f7sTY8FttTtzi" */
interface Uni_Module_Args_bestTradeExactIn extends Record<string, unknown> {
  pools: Array<Types.Uni_Pool>;
  amountIn: Types.Uni_TokenAmount;
  tokenOut: Types.Uni_Token;
  options?: Types.Uni_BestTradeOptions | null;
}

/* URI: "wrap://ipfs/QmZ62dnMvxcGmVYoB6zHbaRvn7zbGAWN3f7sTY8FttTtzi" */
interface Uni_Module_Args_bestTradeExactOut extends Record<string, unknown> {
  pools: Array<Types.Uni_Pool>;
  tokenIn: Types.Uni_Token;
  amountOut: Types.Uni_TokenAmount;
  options?: Types.Uni_BestTradeOptions | null;
}

/* URI: "wrap://ipfs/QmZ62dnMvxcGmVYoB6zHbaRvn7zbGAWN3f7sTY8FttTtzi" */
interface Uni_Module_Args_createPosition extends Record<string, unknown> {
  pool: Types.Uni_Pool;
  tickLower: Types.Int32;
  tickUpper: Types.Int32;
  liquidity: Types.BigInt;
}

/* URI: "wrap://ipfs/QmZ62dnMvxcGmVYoB6zHbaRvn7zbGAWN3f7sTY8FttTtzi" */
interface Uni_Module_Args_createPositionFromAmounts extends Record<string, unknown> {
  pool: Types.Uni_Pool;
  tickLower: Types.Int32;
  tickUpper: Types.Int32;
  amount0: Types.BigInt;
  amount1: Types.BigInt;
  useFullPrecision: Types.Boolean;
}

/* URI: "wrap://ipfs/QmZ62dnMvxcGmVYoB6zHbaRvn7zbGAWN3f7sTY8FttTtzi" */
interface Uni_Module_Args_createPositionFromAmount0 extends Record<string, unknown> {
  pool: Types.Uni_Pool;
  tickLower: Types.Int32;
  tickUpper: Types.Int32;
  amount0: Types.BigInt;
  useFullPrecision: Types.Boolean;
}

/* URI: "wrap://ipfs/QmZ62dnMvxcGmVYoB6zHbaRvn7zbGAWN3f7sTY8FttTtzi" */
interface Uni_Module_Args_createPositionFromAmount1 extends Record<string, unknown> {
  pool: Types.Uni_Pool;
  tickLower: Types.Int32;
  tickUpper: Types.Int32;
  amount1: Types.BigInt;
}

/* URI: "wrap://ipfs/QmZ62dnMvxcGmVYoB6zHbaRvn7zbGAWN3f7sTY8FttTtzi" */
interface Uni_Module_Args_positionToken0PriceLower extends Record<string, unknown> {
  pool: Types.Uni_Pool;
  tickLower: Types.Int32;
}

/* URI: "wrap://ipfs/QmZ62dnMvxcGmVYoB6zHbaRvn7zbGAWN3f7sTY8FttTtzi" */
interface Uni_Module_Args_positionToken0PriceUpper extends Record<string, unknown> {
  pool: Types.Uni_Pool;
  tickUpper: Types.Int32;
}

/* URI: "wrap://ipfs/QmZ62dnMvxcGmVYoB6zHbaRvn7zbGAWN3f7sTY8FttTtzi" */
interface Uni_Module_Args_positionAmount0 extends Record<string, unknown> {
  pool: Types.Uni_Pool;
  tickLower: Types.Int32;
  tickUpper: Types.Int32;
  liquidity: Types.BigInt;
}

/* URI: "wrap://ipfs/QmZ62dnMvxcGmVYoB6zHbaRvn7zbGAWN3f7sTY8FttTtzi" */
interface Uni_Module_Args_positionAmount1 extends Record<string, unknown> {
  pool: Types.Uni_Pool;
  tickLower: Types.Int32;
  tickUpper: Types.Int32;
  liquidity: Types.BigInt;
}

/* URI: "wrap://ipfs/QmZ62dnMvxcGmVYoB6zHbaRvn7zbGAWN3f7sTY8FttTtzi" */
interface Uni_Module_Args_mintAmounts extends Record<string, unknown> {
  pool: Types.Uni_Pool;
  tickLower: Types.Int32;
  tickUpper: Types.Int32;
  liquidity: Types.BigInt;
}

/* URI: "wrap://ipfs/QmZ62dnMvxcGmVYoB6zHbaRvn7zbGAWN3f7sTY8FttTtzi" */
interface Uni_Module_Args_mintAmountsWithSlippage extends Record<string, unknown> {
  position: Types.Uni_Position;
  slippageTolerance: Types.String;
}

/* URI: "wrap://ipfs/QmZ62dnMvxcGmVYoB6zHbaRvn7zbGAWN3f7sTY8FttTtzi" */
interface Uni_Module_Args_burnAmountsWithSlippage extends Record<string, unknown> {
  position: Types.Uni_Position;
  slippageTolerance: Types.String;
}

/* URI: "wrap://ipfs/QmZ62dnMvxcGmVYoB6zHbaRvn7zbGAWN3f7sTY8FttTtzi" */
interface Uni_Module_Args_swapCallParameters extends Record<string, unknown> {
  trades: Array<Types.Uni_Trade>;
  options: Types.Uni_SwapOptions;
}

/* URI: "wrap://ipfs/QmZ62dnMvxcGmVYoB6zHbaRvn7zbGAWN3f7sTY8FttTtzi" */
interface Uni_Module_Args_encodeRouteToPath extends Record<string, unknown> {
  route: Types.Uni_Route;
  exactOutput: Types.Boolean;
}

/* URI: "wrap://ipfs/QmZ62dnMvxcGmVYoB6zHbaRvn7zbGAWN3f7sTY8FttTtzi" */
interface Uni_Module_Args_encodePermit extends Record<string, unknown> {
  token: Types.Uni_Token;
  options: Types.Uni_PermitOptions;
}

/* URI: "wrap://ipfs/QmZ62dnMvxcGmVYoB6zHbaRvn7zbGAWN3f7sTY8FttTtzi" */
interface Uni_Module_Args_encodeUnwrapWETH9 extends Record<string, unknown> {
  amountMinimum: Types.BigInt;
  recipient: Types.String;
  feeOptions?: Types.Uni_FeeOptions | null;
}

/* URI: "wrap://ipfs/QmZ62dnMvxcGmVYoB6zHbaRvn7zbGAWN3f7sTY8FttTtzi" */
interface Uni_Module_Args_encodeSweepToken extends Record<string, unknown> {
  token: Types.Uni_Token;
  amountMinimum: Types.BigInt;
  recipient: Types.String;
  feeOptions?: Types.Uni_FeeOptions | null;
}

/* URI: "wrap://ipfs/QmZ62dnMvxcGmVYoB6zHbaRvn7zbGAWN3f7sTY8FttTtzi" */
interface Uni_Module_Args_encodeRefundETH extends Record<string, unknown> {
}

/* URI: "wrap://ipfs/QmZ62dnMvxcGmVYoB6zHbaRvn7zbGAWN3f7sTY8FttTtzi" */
interface Uni_Module_Args_encodeMulticall extends Record<string, unknown> {
  calldatas: Array<Types.String>;
}

/* URI: "wrap://ipfs/QmZ62dnMvxcGmVYoB6zHbaRvn7zbGAWN3f7sTY8FttTtzi" */
interface Uni_Module_Args_collectRewards extends Record<string, unknown> {
  incentiveKeys: Array<Types.Uni_IncentiveKey>;
  options: Types.Uni_ClaimOptions;
}

/* URI: "wrap://ipfs/QmZ62dnMvxcGmVYoB6zHbaRvn7zbGAWN3f7sTY8FttTtzi" */
interface Uni_Module_Args_withdrawToken extends Record<string, unknown> {
  incentiveKeys: Array<Types.Uni_IncentiveKey>;
  options: Types.Uni_FullWithdrawOptions;
}

/* URI: "wrap://ipfs/QmZ62dnMvxcGmVYoB6zHbaRvn7zbGAWN3f7sTY8FttTtzi" */
interface Uni_Module_Args_encodeDeposit extends Record<string, unknown> {
  incentiveKeys: Array<Types.Uni_IncentiveKey>;
}

/* URI: "wrap://ipfs/QmZ62dnMvxcGmVYoB6zHbaRvn7zbGAWN3f7sTY8FttTtzi" */
interface Uni_Module_Args_quoteCallParameters extends Record<string, unknown> {
  route: Types.Uni_Route;
  amount: Types.Uni_TokenAmount;
  tradeType: Types.Uni_TradeType;
  options?: Types.Uni_QuoteOptions | null;
}

/* URI: "wrap://ipfs/QmZ62dnMvxcGmVYoB6zHbaRvn7zbGAWN3f7sTY8FttTtzi" */
interface Uni_Module_Args_createCallParameters extends Record<string, unknown> {
  pool: Types.Uni_Pool;
}

/* URI: "wrap://ipfs/QmZ62dnMvxcGmVYoB6zHbaRvn7zbGAWN3f7sTY8FttTtzi" */
interface Uni_Module_Args_addCallParameters extends Record<string, unknown> {
  position: Types.Uni_Position;
  options: Types.Uni_AddLiquidityOptions;
}

/* URI: "wrap://ipfs/QmZ62dnMvxcGmVYoB6zHbaRvn7zbGAWN3f7sTY8FttTtzi" */
interface Uni_Module_Args_collectCallParameters extends Record<string, unknown> {
  options: Types.Uni_CollectOptions;
}

/* URI: "wrap://ipfs/QmZ62dnMvxcGmVYoB6zHbaRvn7zbGAWN3f7sTY8FttTtzi" */
interface Uni_Module_Args_removeCallParameters extends Record<string, unknown> {
  position: Types.Uni_Position;
  options: Types.Uni_RemoveLiquidityOptions;
}

/* URI: "wrap://ipfs/QmZ62dnMvxcGmVYoB6zHbaRvn7zbGAWN3f7sTY8FttTtzi" */
interface Uni_Module_Args_safeTransferFromParameters extends Record<string, unknown> {
  options: Types.Uni_SafeTransferOptions;
}

/* URI: "wrap://ipfs/QmZ62dnMvxcGmVYoB6zHbaRvn7zbGAWN3f7sTY8FttTtzi" */
interface Uni_Module_Args_toHex extends Record<string, unknown> {
  value: Types.BigInt;
}

/* URI: "wrap://ipfs/QmZ62dnMvxcGmVYoB6zHbaRvn7zbGAWN3f7sTY8FttTtzi" */
interface Uni_Module_Args_computePoolAddress extends Record<string, unknown> {
  factoryAddress: Types.String;
  tokenA: Types.Uni_Token;
  tokenB: Types.Uni_Token;
  fee: Types.Uni_FeeAmount;
  initCodeHashManualOverride?: Types.String | null;
}

/* URI: "wrap://ipfs/QmZ62dnMvxcGmVYoB6zHbaRvn7zbGAWN3f7sTY8FttTtzi" */
interface Uni_Module_Args_encodeSqrtRatioX96 extends Record<string, unknown> {
  amount1: Types.BigInt;
  amount0: Types.BigInt;
}

/* URI: "wrap://ipfs/QmZ62dnMvxcGmVYoB6zHbaRvn7zbGAWN3f7sTY8FttTtzi" */
interface Uni_Module_Args_mulDivRoundingUp extends Record<string, unknown> {
  a: Types.BigInt;
  b: Types.BigInt;
  denominator: Types.BigInt;
}

/* URI: "wrap://ipfs/QmZ62dnMvxcGmVYoB6zHbaRvn7zbGAWN3f7sTY8FttTtzi" */
interface Uni_Module_Args_addDelta extends Record<string, unknown> {
  x: Types.BigInt;
  y: Types.BigInt;
}

/* URI: "wrap://ipfs/QmZ62dnMvxcGmVYoB6zHbaRvn7zbGAWN3f7sTY8FttTtzi" */
interface Uni_Module_Args_maxLiquidityForAmounts extends Record<string, unknown> {
  sqrtRatioCurrentX96: Types.BigInt;
  sqrtRatioAX96: Types.BigInt;
  sqrtRatioBX96: Types.BigInt;
  amount0: Types.BigInt;
  amount1: Types.BigInt;
  useFullPrecision: Types.Boolean;
}

/* URI: "wrap://ipfs/QmZ62dnMvxcGmVYoB6zHbaRvn7zbGAWN3f7sTY8FttTtzi" */
interface Uni_Module_Args_mostSignificantBit extends Record<string, unknown> {
  x: Types.BigInt;
}

/* URI: "wrap://ipfs/QmZ62dnMvxcGmVYoB6zHbaRvn7zbGAWN3f7sTY8FttTtzi" */
interface Uni_Module_Args_nearestUsableTick extends Record<string, unknown> {
  tick: Types.Int32;
  tickSpacing: Types.Int32;
}

/* URI: "wrap://ipfs/QmZ62dnMvxcGmVYoB6zHbaRvn7zbGAWN3f7sTY8FttTtzi" */
interface Uni_Module_Args_tickToPrice extends Record<string, unknown> {
  baseToken: Types.Uni_Token;
  quoteToken: Types.Uni_Token;
  tick: Types.Int32;
}

/* URI: "wrap://ipfs/QmZ62dnMvxcGmVYoB6zHbaRvn7zbGAWN3f7sTY8FttTtzi" */
interface Uni_Module_Args_priceToClosestTick extends Record<string, unknown> {
  price: Types.Uni_Price;
}

/* URI: "wrap://ipfs/QmZ62dnMvxcGmVYoB6zHbaRvn7zbGAWN3f7sTY8FttTtzi" */
interface Uni_Module_Args_getAmount0Delta extends Record<string, unknown> {
  sqrtRatioAX96: Types.BigInt;
  sqrtRatioBX96: Types.BigInt;
  liquidity: Types.BigInt;
  roundUp: Types.Boolean;
}

/* URI: "wrap://ipfs/QmZ62dnMvxcGmVYoB6zHbaRvn7zbGAWN3f7sTY8FttTtzi" */
interface Uni_Module_Args_getAmount1Delta extends Record<string, unknown> {
  sqrtRatioAX96: Types.BigInt;
  sqrtRatioBX96: Types.BigInt;
  liquidity: Types.BigInt;
  roundUp: Types.Boolean;
}

/* URI: "wrap://ipfs/QmZ62dnMvxcGmVYoB6zHbaRvn7zbGAWN3f7sTY8FttTtzi" */
interface Uni_Module_Args_getNextSqrtPriceFromInput extends Record<string, unknown> {
  sqrtPX96: Types.BigInt;
  liquidity: Types.BigInt;
  amountIn: Types.BigInt;
  zeroForOne: Types.Boolean;
}

/* URI: "wrap://ipfs/QmZ62dnMvxcGmVYoB6zHbaRvn7zbGAWN3f7sTY8FttTtzi" */
interface Uni_Module_Args_getNextSqrtPriceFromOutput extends Record<string, unknown> {
  sqrtPX96: Types.BigInt;
  liquidity: Types.BigInt;
  amountOut: Types.BigInt;
  zeroForOne: Types.Boolean;
}

/* URI: "wrap://ipfs/QmZ62dnMvxcGmVYoB6zHbaRvn7zbGAWN3f7sTY8FttTtzi" */
interface Uni_Module_Args_tickIsBelowSmallest extends Record<string, unknown> {
  ticks: Array<Types.Uni_Tick>;
  tick: Types.Int32;
}

/* URI: "wrap://ipfs/QmZ62dnMvxcGmVYoB6zHbaRvn7zbGAWN3f7sTY8FttTtzi" */
interface Uni_Module_Args_tickIsAtOrAboveLargest extends Record<string, unknown> {
  ticks: Array<Types.Uni_Tick>;
  tick: Types.Int32;
}

/* URI: "wrap://ipfs/QmZ62dnMvxcGmVYoB6zHbaRvn7zbGAWN3f7sTY8FttTtzi" */
interface Uni_Module_Args_nextInitializedTick extends Record<string, unknown> {
  ticks: Array<Types.Uni_Tick>;
  tick: Types.Int32;
  lte: Types.Boolean;
}

/* URI: "wrap://ipfs/QmZ62dnMvxcGmVYoB6zHbaRvn7zbGAWN3f7sTY8FttTtzi" */
interface Uni_Module_Args_tickListIsSorted extends Record<string, unknown> {
  ticks: Array<Types.Uni_Tick>;
}

/* URI: "wrap://ipfs/QmZ62dnMvxcGmVYoB6zHbaRvn7zbGAWN3f7sTY8FttTtzi" */
interface Uni_Module_Args_getSqrtRatioAtTick extends Record<string, unknown> {
  tick: Types.Int32;
}

/* URI: "wrap://ipfs/QmZ62dnMvxcGmVYoB6zHbaRvn7zbGAWN3f7sTY8FttTtzi" */
interface Uni_Module_Args_getTickAtSqrtRatio extends Record<string, unknown> {
  sqrtRatioX96: Types.BigInt;
}

/* URI: "wrap://ipfs/QmZ62dnMvxcGmVYoB6zHbaRvn7zbGAWN3f7sTY8FttTtzi" */
interface Uni_Module_Args_fetchToken extends Record<string, unknown> {
  address: Types.String;
  chainId: Types.Uni_ChainId;
}

/* URI: "wrap://ipfs/QmZ62dnMvxcGmVYoB6zHbaRvn7zbGAWN3f7sTY8FttTtzi" */
interface Uni_Module_Args_fetchPoolFromTokens extends Record<string, unknown> {
  tokenA: Types.Uni_Token;
  tokenB: Types.Uni_Token;
  fee: Types.Uni_FeeAmount;
  fetchTicks: Types.Boolean;
}

/* URI: "wrap://ipfs/QmZ62dnMvxcGmVYoB6zHbaRvn7zbGAWN3f7sTY8FttTtzi" */
interface Uni_Module_Args_fetchPoolFromAddress extends Record<string, unknown> {
  address: Types.String;
  chainId: Types.Uni_ChainId;
  fetchTicks: Types.Boolean;
}

/* URI: "wrap://ipfs/QmZ62dnMvxcGmVYoB6zHbaRvn7zbGAWN3f7sTY8FttTtzi" */
interface Uni_Module_Args_fetchTickList extends Record<string, unknown> {
  address: Types.String;
  chainId: Types.Uni_ChainId;
}

/* URI: "wrap://ipfs/QmZ62dnMvxcGmVYoB6zHbaRvn7zbGAWN3f7sTY8FttTtzi" */
interface Uni_Module_Args_feeAmountToTickSpacing extends Record<string, unknown> {
  feeAmount: Types.Uni_FeeAmount;
}

/* URI: "wrap://ipfs/QmZ62dnMvxcGmVYoB6zHbaRvn7zbGAWN3f7sTY8FttTtzi" */
interface Uni_Module_Args_getFeeAmount extends Record<string, unknown> {
  feeAmount: Types.Uni_FeeAmount;
}

/* URI: "wrap://ipfs/QmZ62dnMvxcGmVYoB6zHbaRvn7zbGAWN3f7sTY8FttTtzi" */
interface Uni_Module_Args_getPermitV extends Record<string, unknown> {
  permitV: Types.Uni_PermitV;
}

/* URI: "wrap://ipfs/QmZ62dnMvxcGmVYoB6zHbaRvn7zbGAWN3f7sTY8FttTtzi" */
interface Uni_Module_Args_FACTORY_ADDRESS extends Record<string, unknown> {
}

/* URI: "wrap://ipfs/QmZ62dnMvxcGmVYoB6zHbaRvn7zbGAWN3f7sTY8FttTtzi" */
interface Uni_Module_Args_POOL_INIT_CODE_HASH extends Record<string, unknown> {
}

/* URI: "wrap://ipfs/QmZ62dnMvxcGmVYoB6zHbaRvn7zbGAWN3f7sTY8FttTtzi" */
interface Uni_Module_Args_POOL_INIT_CODE_HASH_OPTIMISM extends Record<string, unknown> {
}

/* URI: "wrap://ipfs/QmZ62dnMvxcGmVYoB6zHbaRvn7zbGAWN3f7sTY8FttTtzi" */
interface Uni_Module_Args_POOL_INIT_CODE_HASH_OPTIMISM_KOVAN extends Record<string, unknown> {
}

/* URI: "wrap://ipfs/QmZ62dnMvxcGmVYoB6zHbaRvn7zbGAWN3f7sTY8FttTtzi" */
interface Uni_Module_Args_MIN_TICK extends Record<string, unknown> {
}

/* URI: "wrap://ipfs/QmZ62dnMvxcGmVYoB6zHbaRvn7zbGAWN3f7sTY8FttTtzi" */
interface Uni_Module_Args_MAX_TICK extends Record<string, unknown> {
}

/* URI: "wrap://ipfs/QmZ62dnMvxcGmVYoB6zHbaRvn7zbGAWN3f7sTY8FttTtzi" */
interface Uni_Module_Args_MIN_SQRT_RATIO extends Record<string, unknown> {
}

/* URI: "wrap://ipfs/QmZ62dnMvxcGmVYoB6zHbaRvn7zbGAWN3f7sTY8FttTtzi" */
interface Uni_Module_Args_MAX_SQRT_RATIO extends Record<string, unknown> {
}

/* URI: "wrap://ipfs/QmZ62dnMvxcGmVYoB6zHbaRvn7zbGAWN3f7sTY8FttTtzi" */
export const Uni_Module = {
  approve: async (
    args: Uni_Module_Args_approve,
    client: Client,
    uri: string = "wrap://ipfs/QmZ62dnMvxcGmVYoB6zHbaRvn7zbGAWN3f7sTY8FttTtzi"
  ): Promise<InvokeResult<Types.Uni_Ethereum_TxResponse>> => {
    return client.invoke<Types.Uni_Ethereum_TxResponse>({
      uri,
      method: "approve",
      args
    });
  },

  execCall: async (
    args: Uni_Module_Args_execCall,
    client: Client,
    uri: string = "wrap://ipfs/QmZ62dnMvxcGmVYoB6zHbaRvn7zbGAWN3f7sTY8FttTtzi"
  ): Promise<InvokeResult<Types.Uni_Ethereum_TxResponse>> => {
    return client.invoke<Types.Uni_Ethereum_TxResponse>({
      uri,
      method: "execCall",
      args
    });
  },

  execSwap: async (
    args: Uni_Module_Args_execSwap,
    client: Client,
    uri: string = "wrap://ipfs/QmZ62dnMvxcGmVYoB6zHbaRvn7zbGAWN3f7sTY8FttTtzi"
  ): Promise<InvokeResult<Types.Uni_Ethereum_TxResponse>> => {
    return client.invoke<Types.Uni_Ethereum_TxResponse>({
      uri,
      method: "execSwap",
      args
    });
  },

  swap: async (
    args: Uni_Module_Args_swap,
    client: Client,
    uri: string = "wrap://ipfs/QmZ62dnMvxcGmVYoB6zHbaRvn7zbGAWN3f7sTY8FttTtzi"
  ): Promise<InvokeResult<Types.Uni_Ethereum_TxResponse>> => {
    return client.invoke<Types.Uni_Ethereum_TxResponse>({
      uri,
      method: "swap",
      args
    });
  },

  swapWithPool: async (
    args: Uni_Module_Args_swapWithPool,
    client: Client,
    uri: string = "wrap://ipfs/QmZ62dnMvxcGmVYoB6zHbaRvn7zbGAWN3f7sTY8FttTtzi"
  ): Promise<InvokeResult<Types.Uni_Ethereum_TxResponse>> => {
    return client.invoke<Types.Uni_Ethereum_TxResponse>({
      uri,
      method: "swapWithPool",
      args
    });
  },

  deployPool: async (
    args: Uni_Module_Args_deployPool,
    client: Client,
    uri: string = "wrap://ipfs/QmZ62dnMvxcGmVYoB6zHbaRvn7zbGAWN3f7sTY8FttTtzi"
  ): Promise<InvokeResult<Types.Uni_Ethereum_TxResponse>> => {
    return client.invoke<Types.Uni_Ethereum_TxResponse>({
      uri,
      method: "deployPool",
      args
    });
  },

  deployPoolFromTokens: async (
    args: Uni_Module_Args_deployPoolFromTokens,
    client: Client,
    uri: string = "wrap://ipfs/QmZ62dnMvxcGmVYoB6zHbaRvn7zbGAWN3f7sTY8FttTtzi"
  ): Promise<InvokeResult<Types.Uni_Ethereum_TxResponse>> => {
    return client.invoke<Types.Uni_Ethereum_TxResponse>({
      uri,
      method: "deployPoolFromTokens",
      args
    });
  },

  currencyEquals: async (
    args: Uni_Module_Args_currencyEquals,
    client: Client,
    uri: string = "wrap://ipfs/QmZ62dnMvxcGmVYoB6zHbaRvn7zbGAWN3f7sTY8FttTtzi"
  ): Promise<InvokeResult<Types.Boolean>> => {
    return client.invoke<Types.Boolean>({
      uri,
      method: "currencyEquals",
      args
    });
  },

  tokenEquals: async (
    args: Uni_Module_Args_tokenEquals,
    client: Client,
    uri: string = "wrap://ipfs/QmZ62dnMvxcGmVYoB6zHbaRvn7zbGAWN3f7sTY8FttTtzi"
  ): Promise<InvokeResult<Types.Boolean>> => {
    return client.invoke<Types.Boolean>({
      uri,
      method: "tokenEquals",
      args
    });
  },

  tokenAmountEquals: async (
    args: Uni_Module_Args_tokenAmountEquals,
    client: Client,
    uri: string = "wrap://ipfs/QmZ62dnMvxcGmVYoB6zHbaRvn7zbGAWN3f7sTY8FttTtzi"
  ): Promise<InvokeResult<Types.Boolean>> => {
    return client.invoke<Types.Boolean>({
      uri,
      method: "tokenAmountEquals",
      args
    });
  },

  tokenSortsBefore: async (
    args: Uni_Module_Args_tokenSortsBefore,
    client: Client,
    uri: string = "wrap://ipfs/QmZ62dnMvxcGmVYoB6zHbaRvn7zbGAWN3f7sTY8FttTtzi"
  ): Promise<InvokeResult<Types.Boolean>> => {
    return client.invoke<Types.Boolean>({
      uri,
      method: "tokenSortsBefore",
      args
    });
  },

  getNative: async (
    args: Uni_Module_Args_getNative,
    client: Client,
    uri: string = "wrap://ipfs/QmZ62dnMvxcGmVYoB6zHbaRvn7zbGAWN3f7sTY8FttTtzi"
  ): Promise<InvokeResult<Types.Uni_Token>> => {
    return client.invoke<Types.Uni_Token>({
      uri,
      method: "getNative",
      args
    });
  },

  getWETH: async (
    args: Uni_Module_Args_getWETH,
    client: Client,
    uri: string = "wrap://ipfs/QmZ62dnMvxcGmVYoB6zHbaRvn7zbGAWN3f7sTY8FttTtzi"
  ): Promise<InvokeResult<Types.Uni_Token>> => {
    return client.invoke<Types.Uni_Token>({
      uri,
      method: "getWETH",
      args
    });
  },

  isNative: async (
    args: Uni_Module_Args_isNative,
    client: Client,
    uri: string = "wrap://ipfs/QmZ62dnMvxcGmVYoB6zHbaRvn7zbGAWN3f7sTY8FttTtzi"
  ): Promise<InvokeResult<Types.Boolean>> => {
    return client.invoke<Types.Boolean>({
      uri,
      method: "isNative",
      args
    });
  },

  wrapToken: async (
    args: Uni_Module_Args_wrapToken,
    client: Client,
    uri: string = "wrap://ipfs/QmZ62dnMvxcGmVYoB6zHbaRvn7zbGAWN3f7sTY8FttTtzi"
  ): Promise<InvokeResult<Types.Uni_Token>> => {
    return client.invoke<Types.Uni_Token>({
      uri,
      method: "wrapToken",
      args
    });
  },

  wrapAmount: async (
    args: Uni_Module_Args_wrapAmount,
    client: Client,
    uri: string = "wrap://ipfs/QmZ62dnMvxcGmVYoB6zHbaRvn7zbGAWN3f7sTY8FttTtzi"
  ): Promise<InvokeResult<Types.Uni_TokenAmount>> => {
    return client.invoke<Types.Uni_TokenAmount>({
      uri,
      method: "wrapAmount",
      args
    });
  },

  validateTickList: async (
    args: Uni_Module_Args_validateTickList,
    client: Client,
    uri: string = "wrap://ipfs/QmZ62dnMvxcGmVYoB6zHbaRvn7zbGAWN3f7sTY8FttTtzi"
  ): Promise<InvokeResult<Types.Boolean>> => {
    return client.invoke<Types.Boolean>({
      uri,
      method: "validateTickList",
      args
    });
  },

  getTick: async (
    args: Uni_Module_Args_getTick,
    client: Client,
    uri: string = "wrap://ipfs/QmZ62dnMvxcGmVYoB6zHbaRvn7zbGAWN3f7sTY8FttTtzi"
  ): Promise<InvokeResult<Types.Uni_Tick>> => {
    return client.invoke<Types.Uni_Tick>({
      uri,
      method: "getTick",
      args
    });
  },

  nextInitializedTickWithinOneWord: async (
    args: Uni_Module_Args_nextInitializedTickWithinOneWord,
    client: Client,
    uri: string = "wrap://ipfs/QmZ62dnMvxcGmVYoB6zHbaRvn7zbGAWN3f7sTY8FttTtzi"
  ): Promise<InvokeResult<Types.Uni_NextTickResult>> => {
    return client.invoke<Types.Uni_NextTickResult>({
      uri,
      method: "nextInitializedTickWithinOneWord",
      args
    });
  },

  createPool: async (
    args: Uni_Module_Args_createPool,
    client: Client,
    uri: string = "wrap://ipfs/QmZ62dnMvxcGmVYoB6zHbaRvn7zbGAWN3f7sTY8FttTtzi"
  ): Promise<InvokeResult<Types.Uni_Pool>> => {
    return client.invoke<Types.Uni_Pool>({
      uri,
      method: "createPool",
      args
    });
  },

  getPoolAddress: async (
    args: Uni_Module_Args_getPoolAddress,
    client: Client,
    uri: string = "wrap://ipfs/QmZ62dnMvxcGmVYoB6zHbaRvn7zbGAWN3f7sTY8FttTtzi"
  ): Promise<InvokeResult<Types.String>> => {
    return client.invoke<Types.String>({
      uri,
      method: "getPoolAddress",
      args
    });
  },

  poolInvolvesToken: async (
    args: Uni_Module_Args_poolInvolvesToken,
    client: Client,
    uri: string = "wrap://ipfs/QmZ62dnMvxcGmVYoB6zHbaRvn7zbGAWN3f7sTY8FttTtzi"
  ): Promise<InvokeResult<Types.Boolean>> => {
    return client.invoke<Types.Boolean>({
      uri,
      method: "poolInvolvesToken",
      args
    });
  },

  poolToken0Price: async (
    args: Uni_Module_Args_poolToken0Price,
    client: Client,
    uri: string = "wrap://ipfs/QmZ62dnMvxcGmVYoB6zHbaRvn7zbGAWN3f7sTY8FttTtzi"
  ): Promise<InvokeResult<Types.Uni_Price>> => {
    return client.invoke<Types.Uni_Price>({
      uri,
      method: "poolToken0Price",
      args
    });
  },

  poolToken1Price: async (
    args: Uni_Module_Args_poolToken1Price,
    client: Client,
    uri: string = "wrap://ipfs/QmZ62dnMvxcGmVYoB6zHbaRvn7zbGAWN3f7sTY8FttTtzi"
  ): Promise<InvokeResult<Types.Uni_Price>> => {
    return client.invoke<Types.Uni_Price>({
      uri,
      method: "poolToken1Price",
      args
    });
  },

  poolPriceOf: async (
    args: Uni_Module_Args_poolPriceOf,
    client: Client,
    uri: string = "wrap://ipfs/QmZ62dnMvxcGmVYoB6zHbaRvn7zbGAWN3f7sTY8FttTtzi"
  ): Promise<InvokeResult<Types.Uni_Price>> => {
    return client.invoke<Types.Uni_Price>({
      uri,
      method: "poolPriceOf",
      args
    });
  },

  poolChainId: async (
    args: Uni_Module_Args_poolChainId,
    client: Client,
    uri: string = "wrap://ipfs/QmZ62dnMvxcGmVYoB6zHbaRvn7zbGAWN3f7sTY8FttTtzi"
  ): Promise<InvokeResult<Types.Uni_ChainId>> => {
    return client.invoke<Types.Uni_ChainId>({
      uri,
      method: "poolChainId",
      args
    });
  },

  getPoolOutputAmount: async (
    args: Uni_Module_Args_getPoolOutputAmount,
    client: Client,
    uri: string = "wrap://ipfs/QmZ62dnMvxcGmVYoB6zHbaRvn7zbGAWN3f7sTY8FttTtzi"
  ): Promise<InvokeResult<Types.Uni_PoolChangeResult>> => {
    return client.invoke<Types.Uni_PoolChangeResult>({
      uri,
      method: "getPoolOutputAmount",
      args
    });
  },

  getPoolInputAmount: async (
    args: Uni_Module_Args_getPoolInputAmount,
    client: Client,
    uri: string = "wrap://ipfs/QmZ62dnMvxcGmVYoB6zHbaRvn7zbGAWN3f7sTY8FttTtzi"
  ): Promise<InvokeResult<Types.Uni_PoolChangeResult>> => {
    return client.invoke<Types.Uni_PoolChangeResult>({
      uri,
      method: "getPoolInputAmount",
      args
    });
  },

  getPoolTickSpacing: async (
    args: Uni_Module_Args_getPoolTickSpacing,
    client: Client,
    uri: string = "wrap://ipfs/QmZ62dnMvxcGmVYoB6zHbaRvn7zbGAWN3f7sTY8FttTtzi"
  ): Promise<InvokeResult<Types.Int32>> => {
    return client.invoke<Types.Int32>({
      uri,
      method: "getPoolTickSpacing",
      args
    });
  },

  createRoute: async (
    args: Uni_Module_Args_createRoute,
    client: Client,
    uri: string = "wrap://ipfs/QmZ62dnMvxcGmVYoB6zHbaRvn7zbGAWN3f7sTY8FttTtzi"
  ): Promise<InvokeResult<Types.Uni_Route>> => {
    return client.invoke<Types.Uni_Route>({
      uri,
      method: "createRoute",
      args
    });
  },

  routeChainId: async (
    args: Uni_Module_Args_routeChainId,
    client: Client,
    uri: string = "wrap://ipfs/QmZ62dnMvxcGmVYoB6zHbaRvn7zbGAWN3f7sTY8FttTtzi"
  ): Promise<InvokeResult<Types.Uni_ChainId>> => {
    return client.invoke<Types.Uni_ChainId>({
      uri,
      method: "routeChainId",
      args
    });
  },

  routeMidPrice: async (
    args: Uni_Module_Args_routeMidPrice,
    client: Client,
    uri: string = "wrap://ipfs/QmZ62dnMvxcGmVYoB6zHbaRvn7zbGAWN3f7sTY8FttTtzi"
  ): Promise<InvokeResult<Types.Uni_Price>> => {
    return client.invoke<Types.Uni_Price>({
      uri,
      method: "routeMidPrice",
      args
    });
  },

  createTradeExactIn: async (
    args: Uni_Module_Args_createTradeExactIn,
    client: Client,
    uri: string = "wrap://ipfs/QmZ62dnMvxcGmVYoB6zHbaRvn7zbGAWN3f7sTY8FttTtzi"
  ): Promise<InvokeResult<Types.Uni_Trade>> => {
    return client.invoke<Types.Uni_Trade>({
      uri,
      method: "createTradeExactIn",
      args
    });
  },

  createTradeExactOut: async (
    args: Uni_Module_Args_createTradeExactOut,
    client: Client,
    uri: string = "wrap://ipfs/QmZ62dnMvxcGmVYoB6zHbaRvn7zbGAWN3f7sTY8FttTtzi"
  ): Promise<InvokeResult<Types.Uni_Trade>> => {
    return client.invoke<Types.Uni_Trade>({
      uri,
      method: "createTradeExactOut",
      args
    });
  },

  createTradeFromRoute: async (
    args: Uni_Module_Args_createTradeFromRoute,
    client: Client,
    uri: string = "wrap://ipfs/QmZ62dnMvxcGmVYoB6zHbaRvn7zbGAWN3f7sTY8FttTtzi"
  ): Promise<InvokeResult<Types.Uni_Trade>> => {
    return client.invoke<Types.Uni_Trade>({
      uri,
      method: "createTradeFromRoute",
      args
    });
  },

  createTradeFromRoutes: async (
    args: Uni_Module_Args_createTradeFromRoutes,
    client: Client,
    uri: string = "wrap://ipfs/QmZ62dnMvxcGmVYoB6zHbaRvn7zbGAWN3f7sTY8FttTtzi"
  ): Promise<InvokeResult<Types.Uni_Trade>> => {
    return client.invoke<Types.Uni_Trade>({
      uri,
      method: "createTradeFromRoutes",
      args
    });
  },

  createUncheckedTrade: async (
    args: Uni_Module_Args_createUncheckedTrade,
    client: Client,
    uri: string = "wrap://ipfs/QmZ62dnMvxcGmVYoB6zHbaRvn7zbGAWN3f7sTY8FttTtzi"
  ): Promise<InvokeResult<Types.Uni_Trade>> => {
    return client.invoke<Types.Uni_Trade>({
      uri,
      method: "createUncheckedTrade",
      args
    });
  },

  createUncheckedTradeWithMultipleRoutes: async (
    args: Uni_Module_Args_createUncheckedTradeWithMultipleRoutes,
    client: Client,
    uri: string = "wrap://ipfs/QmZ62dnMvxcGmVYoB6zHbaRvn7zbGAWN3f7sTY8FttTtzi"
  ): Promise<InvokeResult<Types.Uni_Trade>> => {
    return client.invoke<Types.Uni_Trade>({
      uri,
      method: "createUncheckedTradeWithMultipleRoutes",
      args
    });
  },

  tradeInputAmount: async (
    args: Uni_Module_Args_tradeInputAmount,
    client: Client,
    uri: string = "wrap://ipfs/QmZ62dnMvxcGmVYoB6zHbaRvn7zbGAWN3f7sTY8FttTtzi"
  ): Promise<InvokeResult<Types.Uni_TokenAmount>> => {
    return client.invoke<Types.Uni_TokenAmount>({
      uri,
      method: "tradeInputAmount",
      args
    });
  },

  tradeOutputAmount: async (
    args: Uni_Module_Args_tradeOutputAmount,
    client: Client,
    uri: string = "wrap://ipfs/QmZ62dnMvxcGmVYoB6zHbaRvn7zbGAWN3f7sTY8FttTtzi"
  ): Promise<InvokeResult<Types.Uni_TokenAmount>> => {
    return client.invoke<Types.Uni_TokenAmount>({
      uri,
      method: "tradeOutputAmount",
      args
    });
  },

  tradeExecutionPrice: async (
    args: Uni_Module_Args_tradeExecutionPrice,
    client: Client,
    uri: string = "wrap://ipfs/QmZ62dnMvxcGmVYoB6zHbaRvn7zbGAWN3f7sTY8FttTtzi"
  ): Promise<InvokeResult<Types.Uni_Price>> => {
    return client.invoke<Types.Uni_Price>({
      uri,
      method: "tradeExecutionPrice",
      args
    });
  },

  tradePriceImpact: async (
    args: Uni_Module_Args_tradePriceImpact,
    client: Client,
    uri: string = "wrap://ipfs/QmZ62dnMvxcGmVYoB6zHbaRvn7zbGAWN3f7sTY8FttTtzi"
  ): Promise<InvokeResult<Types.Uni_Fraction>> => {
    return client.invoke<Types.Uni_Fraction>({
      uri,
      method: "tradePriceImpact",
      args
    });
  },

  tradeMinimumAmountOut: async (
    args: Uni_Module_Args_tradeMinimumAmountOut,
    client: Client,
    uri: string = "wrap://ipfs/QmZ62dnMvxcGmVYoB6zHbaRvn7zbGAWN3f7sTY8FttTtzi"
  ): Promise<InvokeResult<Types.Uni_TokenAmount>> => {
    return client.invoke<Types.Uni_TokenAmount>({
      uri,
      method: "tradeMinimumAmountOut",
      args
    });
  },

  tradeMaximumAmountIn: async (
    args: Uni_Module_Args_tradeMaximumAmountIn,
    client: Client,
    uri: string = "wrap://ipfs/QmZ62dnMvxcGmVYoB6zHbaRvn7zbGAWN3f7sTY8FttTtzi"
  ): Promise<InvokeResult<Types.Uni_TokenAmount>> => {
    return client.invoke<Types.Uni_TokenAmount>({
      uri,
      method: "tradeMaximumAmountIn",
      args
    });
  },

  tradeWorstExecutionPrice: async (
    args: Uni_Module_Args_tradeWorstExecutionPrice,
    client: Client,
    uri: string = "wrap://ipfs/QmZ62dnMvxcGmVYoB6zHbaRvn7zbGAWN3f7sTY8FttTtzi"
  ): Promise<InvokeResult<Types.Uni_Price>> => {
    return client.invoke<Types.Uni_Price>({
      uri,
      method: "tradeWorstExecutionPrice",
      args
    });
  },

  bestTradeExactIn: async (
    args: Uni_Module_Args_bestTradeExactIn,
    client: Client,
    uri: string = "wrap://ipfs/QmZ62dnMvxcGmVYoB6zHbaRvn7zbGAWN3f7sTY8FttTtzi"
  ): Promise<InvokeResult<Array<Types.Uni_Trade>>> => {
    return client.invoke<Array<Types.Uni_Trade>>({
      uri,
      method: "bestTradeExactIn",
      args
    });
  },

  bestTradeExactOut: async (
    args: Uni_Module_Args_bestTradeExactOut,
    client: Client,
    uri: string = "wrap://ipfs/QmZ62dnMvxcGmVYoB6zHbaRvn7zbGAWN3f7sTY8FttTtzi"
  ): Promise<InvokeResult<Array<Types.Uni_Trade>>> => {
    return client.invoke<Array<Types.Uni_Trade>>({
      uri,
      method: "bestTradeExactOut",
      args
    });
  },

  createPosition: async (
    args: Uni_Module_Args_createPosition,
    client: Client,
    uri: string = "wrap://ipfs/QmZ62dnMvxcGmVYoB6zHbaRvn7zbGAWN3f7sTY8FttTtzi"
  ): Promise<InvokeResult<Types.Uni_Position>> => {
    return client.invoke<Types.Uni_Position>({
      uri,
      method: "createPosition",
      args
    });
  },

  createPositionFromAmounts: async (
    args: Uni_Module_Args_createPositionFromAmounts,
    client: Client,
    uri: string = "wrap://ipfs/QmZ62dnMvxcGmVYoB6zHbaRvn7zbGAWN3f7sTY8FttTtzi"
  ): Promise<InvokeResult<Types.Uni_Position>> => {
    return client.invoke<Types.Uni_Position>({
      uri,
      method: "createPositionFromAmounts",
      args
    });
  },

  createPositionFromAmount0: async (
    args: Uni_Module_Args_createPositionFromAmount0,
    client: Client,
    uri: string = "wrap://ipfs/QmZ62dnMvxcGmVYoB6zHbaRvn7zbGAWN3f7sTY8FttTtzi"
  ): Promise<InvokeResult<Types.Uni_Position>> => {
    return client.invoke<Types.Uni_Position>({
      uri,
      method: "createPositionFromAmount0",
      args
    });
  },

  createPositionFromAmount1: async (
    args: Uni_Module_Args_createPositionFromAmount1,
    client: Client,
    uri: string = "wrap://ipfs/QmZ62dnMvxcGmVYoB6zHbaRvn7zbGAWN3f7sTY8FttTtzi"
  ): Promise<InvokeResult<Types.Uni_Position>> => {
    return client.invoke<Types.Uni_Position>({
      uri,
      method: "createPositionFromAmount1",
      args
    });
  },

  positionToken0PriceLower: async (
    args: Uni_Module_Args_positionToken0PriceLower,
    client: Client,
    uri: string = "wrap://ipfs/QmZ62dnMvxcGmVYoB6zHbaRvn7zbGAWN3f7sTY8FttTtzi"
  ): Promise<InvokeResult<Types.Uni_Price>> => {
    return client.invoke<Types.Uni_Price>({
      uri,
      method: "positionToken0PriceLower",
      args
    });
  },

  positionToken0PriceUpper: async (
    args: Uni_Module_Args_positionToken0PriceUpper,
    client: Client,
    uri: string = "wrap://ipfs/QmZ62dnMvxcGmVYoB6zHbaRvn7zbGAWN3f7sTY8FttTtzi"
  ): Promise<InvokeResult<Types.Uni_Price>> => {
    return client.invoke<Types.Uni_Price>({
      uri,
      method: "positionToken0PriceUpper",
      args
    });
  },

  positionAmount0: async (
    args: Uni_Module_Args_positionAmount0,
    client: Client,
    uri: string = "wrap://ipfs/QmZ62dnMvxcGmVYoB6zHbaRvn7zbGAWN3f7sTY8FttTtzi"
  ): Promise<InvokeResult<Types.Uni_TokenAmount>> => {
    return client.invoke<Types.Uni_TokenAmount>({
      uri,
      method: "positionAmount0",
      args
    });
  },

  positionAmount1: async (
    args: Uni_Module_Args_positionAmount1,
    client: Client,
    uri: string = "wrap://ipfs/QmZ62dnMvxcGmVYoB6zHbaRvn7zbGAWN3f7sTY8FttTtzi"
  ): Promise<InvokeResult<Types.Uni_TokenAmount>> => {
    return client.invoke<Types.Uni_TokenAmount>({
      uri,
      method: "positionAmount1",
      args
    });
  },

  mintAmounts: async (
    args: Uni_Module_Args_mintAmounts,
    client: Client,
    uri: string = "wrap://ipfs/QmZ62dnMvxcGmVYoB6zHbaRvn7zbGAWN3f7sTY8FttTtzi"
  ): Promise<InvokeResult<Types.Uni_MintAmounts>> => {
    return client.invoke<Types.Uni_MintAmounts>({
      uri,
      method: "mintAmounts",
      args
    });
  },

  mintAmountsWithSlippage: async (
    args: Uni_Module_Args_mintAmountsWithSlippage,
    client: Client,
    uri: string = "wrap://ipfs/QmZ62dnMvxcGmVYoB6zHbaRvn7zbGAWN3f7sTY8FttTtzi"
  ): Promise<InvokeResult<Types.Uni_MintAmounts>> => {
    return client.invoke<Types.Uni_MintAmounts>({
      uri,
      method: "mintAmountsWithSlippage",
      args
    });
  },

  burnAmountsWithSlippage: async (
    args: Uni_Module_Args_burnAmountsWithSlippage,
    client: Client,
    uri: string = "wrap://ipfs/QmZ62dnMvxcGmVYoB6zHbaRvn7zbGAWN3f7sTY8FttTtzi"
  ): Promise<InvokeResult<Types.Uni_MintAmounts>> => {
    return client.invoke<Types.Uni_MintAmounts>({
      uri,
      method: "burnAmountsWithSlippage",
      args
    });
  },

  swapCallParameters: async (
    args: Uni_Module_Args_swapCallParameters,
    client: Client,
    uri: string = "wrap://ipfs/QmZ62dnMvxcGmVYoB6zHbaRvn7zbGAWN3f7sTY8FttTtzi"
  ): Promise<InvokeResult<Types.Uni_MethodParameters>> => {
    return client.invoke<Types.Uni_MethodParameters>({
      uri,
      method: "swapCallParameters",
      args
    });
  },

  encodeRouteToPath: async (
    args: Uni_Module_Args_encodeRouteToPath,
    client: Client,
    uri: string = "wrap://ipfs/QmZ62dnMvxcGmVYoB6zHbaRvn7zbGAWN3f7sTY8FttTtzi"
  ): Promise<InvokeResult<Types.String>> => {
    return client.invoke<Types.String>({
      uri,
      method: "encodeRouteToPath",
      args
    });
  },

  encodePermit: async (
    args: Uni_Module_Args_encodePermit,
    client: Client,
    uri: string = "wrap://ipfs/QmZ62dnMvxcGmVYoB6zHbaRvn7zbGAWN3f7sTY8FttTtzi"
  ): Promise<InvokeResult<Types.String>> => {
    return client.invoke<Types.String>({
      uri,
      method: "encodePermit",
      args
    });
  },

  encodeUnwrapWETH9: async (
    args: Uni_Module_Args_encodeUnwrapWETH9,
    client: Client,
    uri: string = "wrap://ipfs/QmZ62dnMvxcGmVYoB6zHbaRvn7zbGAWN3f7sTY8FttTtzi"
  ): Promise<InvokeResult<Types.String>> => {
    return client.invoke<Types.String>({
      uri,
      method: "encodeUnwrapWETH9",
      args
    });
  },

  encodeSweepToken: async (
    args: Uni_Module_Args_encodeSweepToken,
    client: Client,
    uri: string = "wrap://ipfs/QmZ62dnMvxcGmVYoB6zHbaRvn7zbGAWN3f7sTY8FttTtzi"
  ): Promise<InvokeResult<Types.String>> => {
    return client.invoke<Types.String>({
      uri,
      method: "encodeSweepToken",
      args
    });
  },

  encodeRefundETH: async (
    args: Uni_Module_Args_encodeRefundETH,
    client: Client,
    uri: string = "wrap://ipfs/QmZ62dnMvxcGmVYoB6zHbaRvn7zbGAWN3f7sTY8FttTtzi"
  ): Promise<InvokeResult<Types.String>> => {
    return client.invoke<Types.String>({
      uri,
      method: "encodeRefundETH",
      args
    });
  },

  encodeMulticall: async (
    args: Uni_Module_Args_encodeMulticall,
    client: Client,
    uri: string = "wrap://ipfs/QmZ62dnMvxcGmVYoB6zHbaRvn7zbGAWN3f7sTY8FttTtzi"
  ): Promise<InvokeResult<Types.String>> => {
    return client.invoke<Types.String>({
      uri,
      method: "encodeMulticall",
      args
    });
  },

  collectRewards: async (
    args: Uni_Module_Args_collectRewards,
    client: Client,
    uri: string = "wrap://ipfs/QmZ62dnMvxcGmVYoB6zHbaRvn7zbGAWN3f7sTY8FttTtzi"
  ): Promise<InvokeResult<Types.Uni_MethodParameters>> => {
    return client.invoke<Types.Uni_MethodParameters>({
      uri,
      method: "collectRewards",
      args
    });
  },

  withdrawToken: async (
    args: Uni_Module_Args_withdrawToken,
    client: Client,
    uri: string = "wrap://ipfs/QmZ62dnMvxcGmVYoB6zHbaRvn7zbGAWN3f7sTY8FttTtzi"
  ): Promise<InvokeResult<Types.Uni_MethodParameters>> => {
    return client.invoke<Types.Uni_MethodParameters>({
      uri,
      method: "withdrawToken",
      args
    });
  },

  encodeDeposit: async (
    args: Uni_Module_Args_encodeDeposit,
    client: Client,
    uri: string = "wrap://ipfs/QmZ62dnMvxcGmVYoB6zHbaRvn7zbGAWN3f7sTY8FttTtzi"
  ): Promise<InvokeResult<Types.String>> => {
    return client.invoke<Types.String>({
      uri,
      method: "encodeDeposit",
      args
    });
  },

  quoteCallParameters: async (
    args: Uni_Module_Args_quoteCallParameters,
    client: Client,
    uri: string = "wrap://ipfs/QmZ62dnMvxcGmVYoB6zHbaRvn7zbGAWN3f7sTY8FttTtzi"
  ): Promise<InvokeResult<Types.Uni_MethodParameters>> => {
    return client.invoke<Types.Uni_MethodParameters>({
      uri,
      method: "quoteCallParameters",
      args
    });
  },

  createCallParameters: async (
    args: Uni_Module_Args_createCallParameters,
    client: Client,
    uri: string = "wrap://ipfs/QmZ62dnMvxcGmVYoB6zHbaRvn7zbGAWN3f7sTY8FttTtzi"
  ): Promise<InvokeResult<Types.Uni_MethodParameters>> => {
    return client.invoke<Types.Uni_MethodParameters>({
      uri,
      method: "createCallParameters",
      args
    });
  },

  addCallParameters: async (
    args: Uni_Module_Args_addCallParameters,
    client: Client,
    uri: string = "wrap://ipfs/QmZ62dnMvxcGmVYoB6zHbaRvn7zbGAWN3f7sTY8FttTtzi"
  ): Promise<InvokeResult<Types.Uni_MethodParameters>> => {
    return client.invoke<Types.Uni_MethodParameters>({
      uri,
      method: "addCallParameters",
      args
    });
  },

  collectCallParameters: async (
    args: Uni_Module_Args_collectCallParameters,
    client: Client,
    uri: string = "wrap://ipfs/QmZ62dnMvxcGmVYoB6zHbaRvn7zbGAWN3f7sTY8FttTtzi"
  ): Promise<InvokeResult<Types.Uni_MethodParameters>> => {
    return client.invoke<Types.Uni_MethodParameters>({
      uri,
      method: "collectCallParameters",
      args
    });
  },

  removeCallParameters: async (
    args: Uni_Module_Args_removeCallParameters,
    client: Client,
    uri: string = "wrap://ipfs/QmZ62dnMvxcGmVYoB6zHbaRvn7zbGAWN3f7sTY8FttTtzi"
  ): Promise<InvokeResult<Types.Uni_MethodParameters>> => {
    return client.invoke<Types.Uni_MethodParameters>({
      uri,
      method: "removeCallParameters",
      args
    });
  },

  safeTransferFromParameters: async (
    args: Uni_Module_Args_safeTransferFromParameters,
    client: Client,
    uri: string = "wrap://ipfs/QmZ62dnMvxcGmVYoB6zHbaRvn7zbGAWN3f7sTY8FttTtzi"
  ): Promise<InvokeResult<Types.Uni_MethodParameters>> => {
    return client.invoke<Types.Uni_MethodParameters>({
      uri,
      method: "safeTransferFromParameters",
      args
    });
  },

  toHex: async (
    args: Uni_Module_Args_toHex,
    client: Client,
    uri: string = "wrap://ipfs/QmZ62dnMvxcGmVYoB6zHbaRvn7zbGAWN3f7sTY8FttTtzi"
  ): Promise<InvokeResult<Types.String>> => {
    return client.invoke<Types.String>({
      uri,
      method: "toHex",
      args
    });
  },

  computePoolAddress: async (
    args: Uni_Module_Args_computePoolAddress,
    client: Client,
    uri: string = "wrap://ipfs/QmZ62dnMvxcGmVYoB6zHbaRvn7zbGAWN3f7sTY8FttTtzi"
  ): Promise<InvokeResult<Types.String>> => {
    return client.invoke<Types.String>({
      uri,
      method: "computePoolAddress",
      args
    });
  },

  encodeSqrtRatioX96: async (
    args: Uni_Module_Args_encodeSqrtRatioX96,
    client: Client,
    uri: string = "wrap://ipfs/QmZ62dnMvxcGmVYoB6zHbaRvn7zbGAWN3f7sTY8FttTtzi"
  ): Promise<InvokeResult<Types.BigInt>> => {
    return client.invoke<Types.BigInt>({
      uri,
      method: "encodeSqrtRatioX96",
      args
    });
  },

  mulDivRoundingUp: async (
    args: Uni_Module_Args_mulDivRoundingUp,
    client: Client,
    uri: string = "wrap://ipfs/QmZ62dnMvxcGmVYoB6zHbaRvn7zbGAWN3f7sTY8FttTtzi"
  ): Promise<InvokeResult<Types.BigInt>> => {
    return client.invoke<Types.BigInt>({
      uri,
      method: "mulDivRoundingUp",
      args
    });
  },

  addDelta: async (
    args: Uni_Module_Args_addDelta,
    client: Client,
    uri: string = "wrap://ipfs/QmZ62dnMvxcGmVYoB6zHbaRvn7zbGAWN3f7sTY8FttTtzi"
  ): Promise<InvokeResult<Types.BigInt>> => {
    return client.invoke<Types.BigInt>({
      uri,
      method: "addDelta",
      args
    });
  },

  maxLiquidityForAmounts: async (
    args: Uni_Module_Args_maxLiquidityForAmounts,
    client: Client,
    uri: string = "wrap://ipfs/QmZ62dnMvxcGmVYoB6zHbaRvn7zbGAWN3f7sTY8FttTtzi"
  ): Promise<InvokeResult<Types.BigInt>> => {
    return client.invoke<Types.BigInt>({
      uri,
      method: "maxLiquidityForAmounts",
      args
    });
  },

  mostSignificantBit: async (
    args: Uni_Module_Args_mostSignificantBit,
    client: Client,
    uri: string = "wrap://ipfs/QmZ62dnMvxcGmVYoB6zHbaRvn7zbGAWN3f7sTY8FttTtzi"
  ): Promise<InvokeResult<Types.UInt32>> => {
    return client.invoke<Types.UInt32>({
      uri,
      method: "mostSignificantBit",
      args
    });
  },

  nearestUsableTick: async (
    args: Uni_Module_Args_nearestUsableTick,
    client: Client,
    uri: string = "wrap://ipfs/QmZ62dnMvxcGmVYoB6zHbaRvn7zbGAWN3f7sTY8FttTtzi"
  ): Promise<InvokeResult<Types.Int32>> => {
    return client.invoke<Types.Int32>({
      uri,
      method: "nearestUsableTick",
      args
    });
  },

  tickToPrice: async (
    args: Uni_Module_Args_tickToPrice,
    client: Client,
    uri: string = "wrap://ipfs/QmZ62dnMvxcGmVYoB6zHbaRvn7zbGAWN3f7sTY8FttTtzi"
  ): Promise<InvokeResult<Types.Uni_Price>> => {
    return client.invoke<Types.Uni_Price>({
      uri,
      method: "tickToPrice",
      args
    });
  },

  priceToClosestTick: async (
    args: Uni_Module_Args_priceToClosestTick,
    client: Client,
    uri: string = "wrap://ipfs/QmZ62dnMvxcGmVYoB6zHbaRvn7zbGAWN3f7sTY8FttTtzi"
  ): Promise<InvokeResult<Types.Int32>> => {
    return client.invoke<Types.Int32>({
      uri,
      method: "priceToClosestTick",
      args
    });
  },

  getAmount0Delta: async (
    args: Uni_Module_Args_getAmount0Delta,
    client: Client,
    uri: string = "wrap://ipfs/QmZ62dnMvxcGmVYoB6zHbaRvn7zbGAWN3f7sTY8FttTtzi"
  ): Promise<InvokeResult<Types.BigInt>> => {
    return client.invoke<Types.BigInt>({
      uri,
      method: "getAmount0Delta",
      args
    });
  },

  getAmount1Delta: async (
    args: Uni_Module_Args_getAmount1Delta,
    client: Client,
    uri: string = "wrap://ipfs/QmZ62dnMvxcGmVYoB6zHbaRvn7zbGAWN3f7sTY8FttTtzi"
  ): Promise<InvokeResult<Types.BigInt>> => {
    return client.invoke<Types.BigInt>({
      uri,
      method: "getAmount1Delta",
      args
    });
  },

  getNextSqrtPriceFromInput: async (
    args: Uni_Module_Args_getNextSqrtPriceFromInput,
    client: Client,
    uri: string = "wrap://ipfs/QmZ62dnMvxcGmVYoB6zHbaRvn7zbGAWN3f7sTY8FttTtzi"
  ): Promise<InvokeResult<Types.BigInt>> => {
    return client.invoke<Types.BigInt>({
      uri,
      method: "getNextSqrtPriceFromInput",
      args
    });
  },

  getNextSqrtPriceFromOutput: async (
    args: Uni_Module_Args_getNextSqrtPriceFromOutput,
    client: Client,
    uri: string = "wrap://ipfs/QmZ62dnMvxcGmVYoB6zHbaRvn7zbGAWN3f7sTY8FttTtzi"
  ): Promise<InvokeResult<Types.BigInt>> => {
    return client.invoke<Types.BigInt>({
      uri,
      method: "getNextSqrtPriceFromOutput",
      args
    });
  },

  tickIsBelowSmallest: async (
    args: Uni_Module_Args_tickIsBelowSmallest,
    client: Client,
    uri: string = "wrap://ipfs/QmZ62dnMvxcGmVYoB6zHbaRvn7zbGAWN3f7sTY8FttTtzi"
  ): Promise<InvokeResult<Types.Boolean>> => {
    return client.invoke<Types.Boolean>({
      uri,
      method: "tickIsBelowSmallest",
      args
    });
  },

  tickIsAtOrAboveLargest: async (
    args: Uni_Module_Args_tickIsAtOrAboveLargest,
    client: Client,
    uri: string = "wrap://ipfs/QmZ62dnMvxcGmVYoB6zHbaRvn7zbGAWN3f7sTY8FttTtzi"
  ): Promise<InvokeResult<Types.Boolean>> => {
    return client.invoke<Types.Boolean>({
      uri,
      method: "tickIsAtOrAboveLargest",
      args
    });
  },

  nextInitializedTick: async (
    args: Uni_Module_Args_nextInitializedTick,
    client: Client,
    uri: string = "wrap://ipfs/QmZ62dnMvxcGmVYoB6zHbaRvn7zbGAWN3f7sTY8FttTtzi"
  ): Promise<InvokeResult<Types.Uni_Tick>> => {
    return client.invoke<Types.Uni_Tick>({
      uri,
      method: "nextInitializedTick",
      args
    });
  },

  tickListIsSorted: async (
    args: Uni_Module_Args_tickListIsSorted,
    client: Client,
    uri: string = "wrap://ipfs/QmZ62dnMvxcGmVYoB6zHbaRvn7zbGAWN3f7sTY8FttTtzi"
  ): Promise<InvokeResult<Types.Boolean>> => {
    return client.invoke<Types.Boolean>({
      uri,
      method: "tickListIsSorted",
      args
    });
  },

  getSqrtRatioAtTick: async (
    args: Uni_Module_Args_getSqrtRatioAtTick,
    client: Client,
    uri: string = "wrap://ipfs/QmZ62dnMvxcGmVYoB6zHbaRvn7zbGAWN3f7sTY8FttTtzi"
  ): Promise<InvokeResult<Types.BigInt>> => {
    return client.invoke<Types.BigInt>({
      uri,
      method: "getSqrtRatioAtTick",
      args
    });
  },

  getTickAtSqrtRatio: async (
    args: Uni_Module_Args_getTickAtSqrtRatio,
    client: Client,
    uri: string = "wrap://ipfs/QmZ62dnMvxcGmVYoB6zHbaRvn7zbGAWN3f7sTY8FttTtzi"
  ): Promise<InvokeResult<Types.Int32>> => {
    return client.invoke<Types.Int32>({
      uri,
      method: "getTickAtSqrtRatio",
      args
    });
  },

  fetchToken: async (
    args: Uni_Module_Args_fetchToken,
    client: Client,
    uri: string = "wrap://ipfs/QmZ62dnMvxcGmVYoB6zHbaRvn7zbGAWN3f7sTY8FttTtzi"
  ): Promise<InvokeResult<Types.Uni_Token>> => {
    return client.invoke<Types.Uni_Token>({
      uri,
      method: "fetchToken",
      args
    });
  },

  fetchPoolFromTokens: async (
    args: Uni_Module_Args_fetchPoolFromTokens,
    client: Client,
    uri: string = "wrap://ipfs/QmZ62dnMvxcGmVYoB6zHbaRvn7zbGAWN3f7sTY8FttTtzi"
  ): Promise<InvokeResult<Types.Uni_Pool>> => {
    return client.invoke<Types.Uni_Pool>({
      uri,
      method: "fetchPoolFromTokens",
      args
    });
  },

  fetchPoolFromAddress: async (
    args: Uni_Module_Args_fetchPoolFromAddress,
    client: Client,
    uri: string = "wrap://ipfs/QmZ62dnMvxcGmVYoB6zHbaRvn7zbGAWN3f7sTY8FttTtzi"
  ): Promise<InvokeResult<Types.Uni_Pool>> => {
    return client.invoke<Types.Uni_Pool>({
      uri,
      method: "fetchPoolFromAddress",
      args
    });
  },

  fetchTickList: async (
    args: Uni_Module_Args_fetchTickList,
    client: Client,
    uri: string = "wrap://ipfs/QmZ62dnMvxcGmVYoB6zHbaRvn7zbGAWN3f7sTY8FttTtzi"
  ): Promise<InvokeResult<Array<Types.Uni_Tick>>> => {
    return client.invoke<Array<Types.Uni_Tick>>({
      uri,
      method: "fetchTickList",
      args
    });
  },

  feeAmountToTickSpacing: async (
    args: Uni_Module_Args_feeAmountToTickSpacing,
    client: Client,
    uri: string = "wrap://ipfs/QmZ62dnMvxcGmVYoB6zHbaRvn7zbGAWN3f7sTY8FttTtzi"
  ): Promise<InvokeResult<Types.Int32>> => {
    return client.invoke<Types.Int32>({
      uri,
      method: "feeAmountToTickSpacing",
      args
    });
  },

  getFeeAmount: async (
    args: Uni_Module_Args_getFeeAmount,
    client: Client,
    uri: string = "wrap://ipfs/QmZ62dnMvxcGmVYoB6zHbaRvn7zbGAWN3f7sTY8FttTtzi"
  ): Promise<InvokeResult<Types.UInt32>> => {
    return client.invoke<Types.UInt32>({
      uri,
      method: "getFeeAmount",
      args
    });
  },

  getPermitV: async (
    args: Uni_Module_Args_getPermitV,
    client: Client,
    uri: string = "wrap://ipfs/QmZ62dnMvxcGmVYoB6zHbaRvn7zbGAWN3f7sTY8FttTtzi"
  ): Promise<InvokeResult<Types.Int32>> => {
    return client.invoke<Types.Int32>({
      uri,
      method: "getPermitV",
      args
    });
  },

  FACTORY_ADDRESS: async (
    args: Uni_Module_Args_FACTORY_ADDRESS,
    client: Client,
    uri: string = "wrap://ipfs/QmZ62dnMvxcGmVYoB6zHbaRvn7zbGAWN3f7sTY8FttTtzi"
  ): Promise<InvokeResult<Types.String>> => {
    return client.invoke<Types.String>({
      uri,
      method: "FACTORY_ADDRESS",
      args
    });
  },

  POOL_INIT_CODE_HASH: async (
    args: Uni_Module_Args_POOL_INIT_CODE_HASH,
    client: Client,
    uri: string = "wrap://ipfs/QmZ62dnMvxcGmVYoB6zHbaRvn7zbGAWN3f7sTY8FttTtzi"
  ): Promise<InvokeResult<Types.String>> => {
    return client.invoke<Types.String>({
      uri,
      method: "POOL_INIT_CODE_HASH",
      args
    });
  },

  POOL_INIT_CODE_HASH_OPTIMISM: async (
    args: Uni_Module_Args_POOL_INIT_CODE_HASH_OPTIMISM,
    client: Client,
    uri: string = "wrap://ipfs/QmZ62dnMvxcGmVYoB6zHbaRvn7zbGAWN3f7sTY8FttTtzi"
  ): Promise<InvokeResult<Types.String>> => {
    return client.invoke<Types.String>({
      uri,
      method: "POOL_INIT_CODE_HASH_OPTIMISM",
      args
    });
  },

  POOL_INIT_CODE_HASH_OPTIMISM_KOVAN: async (
    args: Uni_Module_Args_POOL_INIT_CODE_HASH_OPTIMISM_KOVAN,
    client: Client,
    uri: string = "wrap://ipfs/QmZ62dnMvxcGmVYoB6zHbaRvn7zbGAWN3f7sTY8FttTtzi"
  ): Promise<InvokeResult<Types.String>> => {
    return client.invoke<Types.String>({
      uri,
      method: "POOL_INIT_CODE_HASH_OPTIMISM_KOVAN",
      args
    });
  },

  MIN_TICK: async (
    args: Uni_Module_Args_MIN_TICK,
    client: Client,
    uri: string = "wrap://ipfs/QmZ62dnMvxcGmVYoB6zHbaRvn7zbGAWN3f7sTY8FttTtzi"
  ): Promise<InvokeResult<Types.Int32>> => {
    return client.invoke<Types.Int32>({
      uri,
      method: "MIN_TICK",
      args
    });
  },

  MAX_TICK: async (
    args: Uni_Module_Args_MAX_TICK,
    client: Client,
    uri: string = "wrap://ipfs/QmZ62dnMvxcGmVYoB6zHbaRvn7zbGAWN3f7sTY8FttTtzi"
  ): Promise<InvokeResult<Types.Int32>> => {
    return client.invoke<Types.Int32>({
      uri,
      method: "MAX_TICK",
      args
    });
  },

  MIN_SQRT_RATIO: async (
    args: Uni_Module_Args_MIN_SQRT_RATIO,
    client: Client,
    uri: string = "wrap://ipfs/QmZ62dnMvxcGmVYoB6zHbaRvn7zbGAWN3f7sTY8FttTtzi"
  ): Promise<InvokeResult<Types.BigInt>> => {
    return client.invoke<Types.BigInt>({
      uri,
      method: "MIN_SQRT_RATIO",
      args
    });
  },

  MAX_SQRT_RATIO: async (
    args: Uni_Module_Args_MAX_SQRT_RATIO,
    client: Client,
    uri: string = "wrap://ipfs/QmZ62dnMvxcGmVYoB6zHbaRvn7zbGAWN3f7sTY8FttTtzi"
  ): Promise<InvokeResult<Types.BigInt>> => {
    return client.invoke<Types.BigInt>({
      uri,
      method: "MAX_SQRT_RATIO",
      args
    });
  }
}

/// Imported Modules END ///
