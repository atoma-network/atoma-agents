export interface AftermathPool {
  id: string;
  tokens: string[];
  reserves: bigint[];
  fee: number;
  tvl: number;
  apr: number;
}

export interface AftermathTransaction {
  target: `${string}::${string}::${string}`;
  arguments: (string | number | boolean | bigint)[];
  typeArguments: string[];
}

export interface PoolMetrics {
  apr: string;
  tvl: string;
  fee: string;
  volume: string;
}

export interface RankedPool {
  id: string;
  metrics: PoolMetrics;
}

export interface StakingPosition {
  walletAddress: string;
  validatorAddress: string;
  amount: string;
  rewards: string;
  status: string;
}

export interface AddLiquidityParams {
  poolId: string;
  walletAddress: string;
  amountsIn: { [key: string]: bigint };
  slippage: number;
}

export interface WithdrawParams {
  poolId: string;
  walletAddress: string;
  lpAmount: bigint;
  slippage: number;
}

export interface SwapParams {
  poolId: string;
  amountIn: bigint;
  slippage: number;
  walletAddress: string;
}

export interface StakeParams {
  walletAddress: string;
  suiAmount: bigint;
  validatorAddress: string;
}

export interface UnstakeParams {
  walletAddress: string;
  afSuiAmount: bigint;
  isAtomic: boolean;
}

export type RankingMetric = 'apr' | 'tvl' | 'fees' | 'volume';

// Pool-related interfaces
export interface PoolInfo {
  id: string;
  tokens: string[];
  apr: number;
  tvl: number;
  fee: number;
}

export interface SDKPoolStats {
  apr: number;
  tvl: number;
  volume24h?: number;
}

export interface SDKPool {
  pool: {
    objectId: string;
    coins: Record<string, unknown>;
  };
  stats?: SDKPoolStats;
}

// Type definitions for Aftermath SDK responses
export interface AftermathTransaction {
  target: `${string}::${string}::${string}`;
  arguments: (string | number | boolean | bigint)[];
  typeArguments: string[];
}

export interface PoolMetrics {
  apr: string;
  tvl: string;
  fee: string;
  volume: string;
}

export interface RankedPool {
  id: string;
  metrics: PoolMetrics;
}
