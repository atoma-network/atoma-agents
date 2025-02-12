import { TransactionObjectArgument } from '@mysten/sui/transactions';

export interface TransferParams {
  fromAddress: string;
  toAddress: string;
  tokenType: string; // e.g., "0x2::sui::SUI"
  amount: bigint; // Amount in MIST
}

export interface MultiTransferParams {
  fromAddress: string;
  toAddress: string;
  transfers: TokenBalance[]; // Array of token balances to transfer
}

export interface TokenBalance {
  tokenType: string; // Type of token
  amount: bigint; // Amount in MIST
}

export interface MergeCoinsParams {
  coinType: string; // Type of coins to merge
  walletAddress: string; // Address owning the coins
  maxCoins?: number; // Optional max number of coins to merge
}

export interface PoolDepositParams {
  walletAddress: string; // Address of the wallet
  metric: string; // Metric for deposit
  amount: string; // Amount to deposit
  numPools: string; // Number of pools
  slippage: string; // Slippage tolerance
}

export interface PoolWithdrawParams {
  walletAddress: string; // Address of the wallet
  poolId: string; // ID of the pool
  lpAmount: string; // Amount of LP tokens to withdraw
  slippage: string; // Slippage tolerance
}

export interface StakingParams {
  walletAddress: string; // Address of the wallet
  suiAmount?: string; // Amount of SUI to stake
  validatorAddress?: string; // Address of the validator
}

export interface MoveCallParams {
  target: `${string}::${string}::${string}`; // Move function target
  typeArguments: string[]; // Type arguments for the function
  args: (string | number | boolean | bigint)[]; // Arguments for the function call
}

export interface SponsoredTxParams {
  sender: string; // Address of the transaction sender
  sponsor: string; // Address of the gas sponsor
  sponsorCoins: { objectId: string; version: string; digest: string }[]; // Coins for gas payment
}

export interface MoveVecParams {
  elements: (string | TransactionObjectArgument)[]; // Elements for the move vector
  type?: string; // Optional type annotation for the vector
}
