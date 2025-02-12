import { TransactionObjectArgument } from '@mysten/sui/transactions';

export interface TransferParams {
  fromAddress: string;
  toAddress: string;
  tokenType: string;
  amount: bigint;
}

export interface MultiTransferParams {
  fromAddress: string;
  toAddress: string;
  transfers: TokenBalance[];
}

export interface TokenBalance {
  tokenType: string;
  amount: bigint;
}

export interface MergeCoinsParams {
  coinType: string;
  walletAddress: string;
  maxCoins?: number;
}

export interface PoolDepositParams {
  walletAddress: string;
  metric: string;
  amount: string;
  numPools: string;
  slippage: string;
}

export interface PoolWithdrawParams {
  walletAddress: string;
  poolId: string;
  lpAmount: string;
  slippage: string;
}

export interface StakingParams {
  walletAddress: string;
  suiAmount?: string;
  validatorAddress?: string;
}

export interface MoveCallParams {
  target: `${string}::${string}::${string}`;
  typeArguments: string[];
  args: (string | number | boolean | bigint)[];
}

export interface SponsoredTxParams {
  sender: string;
  sponsor: string;
  sponsorCoins: { objectId: string; version: string; digest: string }[];
}

export interface MoveVecParams {
  elements: (string | TransactionObjectArgument)[];
  type?: string;
}
