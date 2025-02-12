import { CreateReserveConfigArgs } from '@suilend/sdk/_generated/suilend/reserve-config/functions';
import { ClaimRewardsReward } from '@suilend/sdk/client';

export interface SuilendOrderParams {
  ownerId: string;
  obligationOwnerCapId: string;
  obligationId: string;
  coinType: string;
  value: string;
}

export interface SuilendDepositParams {
  ownerId: string;
  coinType: string;
  value: string;
  obligationOwnerCapId: string;
}

export interface SuilendRewardParams {
  ownerId: string;
  lendingMarketOwnerCapId: string;
  reserveArrayIndex: number;
  isDepositReward: boolean;
  rewardCoinType: string;
  rewardValue: string;
  startTimeMs: string;
  endTimeMs: string;
}

export interface SuilendCancelRewardParams {
  lendingMarketOwnerCapId: string;
  reserveArrayIndex: number;
  isDepositReward: boolean;
  rewardIndex: number;
  rewardCoinType: string;
}

export interface SuilendClaimRewardParams {
  ownerId: string;
  obligationOwnerCapId: string;
  rewards: ClaimRewardsReward[];
}

export interface SuilendReserveParams {
  lendingMarketOwnerCapId: string;
  pythPriceId: string;
  coinType: string;
  config: CreateReserveConfigArgs;
}

export interface SuilendPriceFeedParams {
  lendingMarketOwnerCapId: string;
  coinType: string;
  pythPriceId: string;
}

export interface SuilendLiquidateParams {
  obligation: string;
  repayCoinType: string;
  withdrawCoinType: string;
  repayCoinId: string;
}

export interface SuilendMarketParams {
  registryId: string;
  lendingMarketType: string;
}

export interface SuilendObligationParams {
  obligationId: string;
}

export interface SuilendOwnerCapParams {
  ownerId: string;
  lendingMarketId: string;
}
