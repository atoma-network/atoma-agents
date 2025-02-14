import { Transaction } from '@mysten/sui/transactions';
import { SuilendClient } from '@suilend/sdk/client';
import { CreateReserveConfigArgs } from '@suilend/sdk/_generated/suilend/reserve-config/functions';
import { handleError } from '../../utils';
import Tools from '../../utils/tools';
import {
  SuilendOrderParams,
  SuilendDepositParams,
  SuilendReserveParams,
  SuilendMarketParams,
  SuilendObligationParams,
  SuilendOwnerCapParams,
  SuilendRewardParams,
  SuilendCancelRewardParams,
  SuilendCloseRewardParams,
  SuilendClaimRewardParams,
  ClaimRewardsReward,
  SuilendUpdateReserveConfigParams,
  SuilendChangePriceFeedParams,
  SuilendDepositLiquidityParams,
  SuilendWithdrawParams,
  SuilendRedeemCtokensParams,
} from './types';
import { suilendClientWrapper } from './config';

interface FormattedResponse {
  reasoning: string;
  response: string;
  status: 'success';
  query: string;
  errors: string[];
}

class SuilendTools {
  private static formatResponse(result: unknown, query: string): string {
    return JSON.stringify([
      {
        reasoning: 'Operation completed successfully',
        response: JSON.stringify(result, null, 2),
        status: 'success',
        query,
        errors: [],
      } as FormattedResponse,
    ]);
  }

  private static formatError(
    error: unknown,
    context: { reasoning: string; query: string },
  ): string {
    const errorResponse = handleError(error, context);
    return JSON.stringify([errorResponse]);
  }

  public static registerTools(tools: Tools) {
    // Lending Market Management
    tools.registerTool(
      'create_lending_market',
      'Create a new lending market on suilend',
      [
        {
          name: 'registry_id',
          type: 'string',
          description: 'Registry ID',
          required: true,
        },
        {
          name: 'lending_market_type',
          type: 'string',
          description: 'Lending market type',
          required: true,
        },
      ],
      async (...args) => {
        try {
          const result = await this.createLendingMarket({
            registryId: args[0] as string,
            lendingMarketType: args[1] as string,
          });
          return this.formatResponse(
            result,
            `Create lending market with registry ID: ${args[0]}`,
          );
        } catch (error) {
          return this.formatError(error, {
            reasoning: 'Failed to create lending market',
            query: `Failed to create lending market with registry ID: ${args[0]}`,
          });
        }
      },
    );

    // Reserve Management
    tools.registerTool(
      'create_reserve',
      'Create a new reserve on suilend',
      [
        {
          name: 'lending_market_owner_cap_id',
          type: 'string',
          description: 'Lending market owner capability ID',
          required: true,
        },
        {
          name: 'pyth_price_id',
          type: 'string',
          description: 'Pyth price feed ID',
          required: true,
        },
        {
          name: 'coin_type',
          type: 'string',
          description: 'Coin type',
          required: true,
        },
        {
          name: 'config',
          type: 'object',
          description: 'Reserve configuration',
          required: true,
        },
      ],
      async (...args) => {
        try {
          const config = args[3] as unknown as CreateReserveConfigArgs;
          const result = await this.createReserve({
            lendingMarketOwnerCapId: args[0] as string,
            pythPriceId: args[1] as string,
            coinType: args[2] as string,
            config,
          });
          return this.formatResponse(
            result,
            `Create reserve with coin type: ${args[2]}`,
          );
        } catch (error) {
          return this.formatError(error, {
            reasoning: 'Failed to create reserve',
            query: `Failed to create reserve with coin type: ${args[2]}`,
          });
        }
      },
    );

    // Lending Operations
    tools.registerTool(
      'borrow_and_send',
      'Borrow and send funds to user on suilend',
      [
        {
          name: 'owner_id',
          type: 'string',
          description: 'Owner ID',
          required: true,
        },
        {
          name: 'obligation_owner_cap_id',
          type: 'string',
          description: 'Obligation owner capability ID',
          required: true,
        },
        {
          name: 'obligation_id',
          type: 'string',
          description: 'Obligation ID',
          required: true,
        },
        {
          name: 'coin_type',
          type: 'string',
          description: 'Coin type',
          required: true,
        },
        {
          name: 'value',
          type: 'string',
          description: 'Value to borrow',
          required: true,
        },
      ],
      async (...args) => {
        try {
          const result = await this.borrowAndSendToUser({
            ownerId: args[0] as string,
            obligationOwnerCapId: args[1] as string,
            obligationId: args[2] as string,
            coinType: args[3] as string,
            value: args[4] as string,
          });
          return this.formatResponse(
            result,
            `Borrow ${args[4]} of ${args[3]} for ${args[0]}`,
          );
        } catch (error) {
          return this.formatError(error, {
            reasoning: 'Failed to borrow and send funds',
            query: `Failed to borrow ${args[4]} of ${args[3]} for ${args[0]}`,
          });
        }
      },
    );

    // Deposit Operations
    tools.registerTool(
      'deposit_into_obligation',
      'Deposit funds into an obligation on suilend',
      [
        {
          name: 'owner_id',
          type: 'string',
          description: 'Owner ID',
          required: true,
        },
        {
          name: 'coin_type',
          type: 'string',
          description: 'Coin type',
          required: true,
        },
        {
          name: 'value',
          type: 'string',
          description: 'Value to deposit',
          required: true,
        },
        {
          name: 'obligation_owner_cap_id',
          type: 'string',
          description: 'Obligation owner capability ID',
          required: true,
        },
      ],
      async (...args) => {
        try {
          const result = await this.depositIntoObligation({
            ownerId: args[0] as string,
            coinType: args[1] as string,
            value: args[2] as string,
            obligationOwnerCapId: args[3] as string,
          });
          return this.formatResponse(
            result,
            `Deposit ${args[2]} of ${args[1]} for ${args[0]}`,
          );
        } catch (error) {
          return this.formatError(error, {
            reasoning: 'Failed to deposit into obligation',
            query: `Failed to deposit ${args[2]} of ${args[1]} for ${args[0]}`,
          });
        }
      },
    );

    // Repay Operations
    tools.registerTool(
      'repay_into_obligation',
      'Repay into obligation on suilend',
      [
        {
          name: 'owner_id',
          type: 'string',
          description: 'Owner ID',
          required: true,
        },
        {
          name: 'obligation_id',
          type: 'string',
          description: 'Obligation ID',
          required: true,
        },
        {
          name: 'coin_type',
          type: 'string',
          description: 'Coin type',
          required: true,
        },
        {
          name: 'value',
          type: 'string',
          description: 'Value to repay',
          required: true,
        },
      ],
      async (...args) => {
        try {
          const result = await this.repayIntoObligation({
            ownerId: args[0] as string,
            obligationId: args[1] as string,
            coinType: args[2] as string,
            value: args[3] as string,
          });
          return this.formatResponse(
            result,
            `Repay ${args[3]} of ${args[2]} into obligation ${args[1]}`,
          );
        } catch (error) {
          return this.formatError(error, {
            reasoning: 'Failed to repay into obligation',
            query: `Failed to repay ${args[3]} of ${args[2]} into obligation ${args[1]}`,
          });
        }
      },
    );

    // Query Operations
    tools.registerTool(
      'get_obligation',
      'Get obligation details from suilend',
      [
        {
          name: 'obligation_id',
          type: 'string',
          description: 'Obligation ID',
          required: true,
        },
      ],
      async (...args) => {
        try {
          const result = await this.getObligation({
            obligationId: args[0] as string,
          });
          return this.formatResponse(
            result,
            `Get obligation details for ${args[0]}`,
          );
        } catch (error) {
          return this.formatError(error, {
            reasoning: 'Failed to get obligation details',
            query: `Failed to get obligation details for ${args[0]}`,
          });
        }
      },
    );

    tools.registerTool(
      'get_lending_market_owner_cap_id',
      'Get lending market owner capability ID from suilend',
      [
        {
          name: 'owner_id',
          type: 'string',
          description: 'Owner ID',
          required: true,
        },
        {
          name: 'lending_market_id',
          type: 'string',
          description: 'Lending market ID',
          required: true,
        },
      ],
      async (...args) => {
        try {
          const result = await this.getLendingMarketOwnerCapId({
            ownerId: args[0] as string,
            lendingMarketId: args[1] as string,
          });
          return this.formatResponse(
            result,
            `Retrieved owner capability ID for ${args[0]}`,
          );
        } catch (error) {
          return this.formatError(error, {
            reasoning: 'Failed to retrieve lending market owner capability ID',
            query: `Attempted to get owner capability ID for ${args[0]}`,
          });
        }
      },
    );

    tools.registerTool(
      'add_reward',
      'Add a reward to a lending market on suilend',
      [
        {
          name: 'owner_id',
          type: 'string',
          description: 'Owner ID',
          required: true,
        },
        {
          name: 'lending_market_owner_cap_id',
          type: 'string',
          description: 'Lending market owner capability ID',
          required: true,
        },
        {
          name: 'reserve_array_index',
          type: 'number',
          description: 'Reserve array index',
          required: true,
        },
        {
          name: 'is_deposit_reward',
          type: 'boolean',
          description: 'Whether the reward is a deposit reward',
          required: true,
        },
        {
          name: 'reward_coin_type',
          type: 'string',
          description: 'Reward coin type',
          required: true,
        },
        {
          name: 'reward_value',
          type: 'string',
          description: 'Reward value',
          required: true,
        },
        {
          name: 'start_time_ms',
          type: 'string',
          description: 'Start time in milliseconds',
          required: true,
        },
        {
          name: 'end_time_ms',
          type: 'string',
          description: 'End time in milliseconds',
          required: true,
        },
      ],
      async (...args) => {
        try {
          const result = await this.addReward({
            ownerId: args[0] as string,
            lendingMarketOwnerCapId: args[1] as string,
            reserveArrayIndex: args[2] as number,
            isDepositReward: args[3] as boolean,
            rewardCoinType: args[4] as string,
            rewardValue: args[5] as string,
            startTimeMs: args[6] as string,
            endTimeMs: args[7] as string,
          });
          return this.formatResponse(
            result,
            `Add ${args[5]} ${args[4]} reward`,
          );
        } catch (error) {
          return this.formatError(error, {
            reasoning: 'Failed to add reward',
            query: `Failed to add ${args[5]} ${args[4]} reward`,
          });
        }
      },
    );

    tools.registerTool(
      'cancel_reward',
      'Cancel a reward in the lending market on suilend',
      [
        {
          name: 'lending_market_owner_cap_id',
          type: 'string',
          description: 'Lending market owner capability ID',
          required: true,
        },
        {
          name: 'reserve_array_index',
          type: 'number',
          description: 'Reserve array index',
          required: true,
        },
        {
          name: 'is_deposit_reward',
          type: 'boolean',
          description: 'Whether the reward is a deposit reward',
          required: true,
        },
        {
          name: 'reward_index',
          type: 'number',
          description: 'Reward index',
          required: true,
        },
        {
          name: 'reward_coin_type',
          type: 'string',
          description: 'Reward coin type',
          required: true,
        },
      ],
      async (...args) => {
        try {
          const result = await this.cancelReward({
            lendingMarketOwnerCapId: args[0] as string,
            reserveArrayIndex: args[1] as number,
            isDepositReward: args[2] as boolean,
            rewardIndex: args[3] as number,
            rewardCoinType: args[4] as string,
          });
          return this.formatResponse(
            result,
            `Cancel reward at index ${args[3]}`,
          );
        } catch (error) {
          return this.formatError(error, {
            reasoning: 'Failed to cancel reward',
            query: `Failed to cancel reward at index ${args[3]}`,
          });
        }
      },
    );

    tools.registerTool(
      'close_reward',
      'Close a reward in the lending market on suilend',
      [
        {
          name: 'lending_market_owner_cap_id',
          type: 'string',
          description: 'Lending market owner capability ID',
          required: true,
        },
        {
          name: 'reserve_array_index',
          type: 'number',
          description: 'Reserve array index',
          required: true,
        },
        {
          name: 'is_deposit_reward',
          type: 'boolean',
          description: 'Whether the reward is a deposit reward',
          required: true,
        },
        {
          name: 'reward_index',
          type: 'number',
          description: 'Reward index',
          required: true,
        },
        {
          name: 'reward_coin_type',
          type: 'string',
          description: 'Reward coin type',
          required: true,
        },
      ],
      async (...args) => {
        try {
          const result = await this.closeReward({
            lendingMarketOwnerCapId: args[0] as string,
            reserveArrayIndex: args[1] as number,
            isDepositReward: args[2] as boolean,
            rewardIndex: args[3] as number,
            rewardCoinType: args[4] as string,
          });
          return this.formatResponse(
            result,
            `Close reward at index ${args[3]}`,
          );
        } catch (error) {
          return this.formatError(error, {
            reasoning: 'Failed to close reward',
            query: `Failed to close reward at index ${args[3]}`,
          });
        }
      },
    );

    tools.registerTool(
      'claim_rewards_and_send',
      'Claim rewards and send them to user on suilend',
      [
        {
          name: 'owner_id',
          type: 'string',
          description: 'Owner ID',
          required: true,
        },
        {
          name: 'obligation_owner_cap_id',
          type: 'string',
          description: 'Obligation owner capability ID',
          required: true,
        },
        {
          name: 'rewards',
          type: 'array',
          description: 'Array of rewards to claim',
          required: true,
        },
      ],
      async (...args) => {
        try {
          const result = await this.claimRewardsAndSend({
            ownerId: args[0] as string,
            obligationOwnerCapId: args[1] as string,
            rewards: args[2] as unknown as ClaimRewardsReward[],
          });
          return this.formatResponse(result, `Claim rewards for ${args[0]}`);
        } catch (error) {
          return this.formatError(error, {
            reasoning: 'Failed to claim and send rewards',
            query: `Failed to claim rewards for ${args[0]}`,
          });
        }
      },
    );

    tools.registerTool(
      'claim_rewards_and_deposit',
      'Claim rewards and deposit them on suilend',
      [
        {
          name: 'owner_id',
          type: 'string',
          description: 'Owner ID',
          required: true,
        },
        {
          name: 'obligation_owner_cap_id',
          type: 'string',
          description: 'Obligation owner capability ID',
          required: true,
        },
        {
          name: 'rewards',
          type: 'array',
          description: 'Array of rewards to claim',
          required: true,
        },
      ],
      async (...args) => {
        try {
          const result = await this.claimRewardsAndDeposit({
            ownerId: args[0] as string,
            obligationOwnerCapId: args[1] as string,
            rewards: args[2] as unknown as ClaimRewardsReward[],
          });
          return this.formatResponse(
            result,
            `Claim and deposit rewards for ${args[0]}`,
          );
        } catch (error) {
          return this.formatError(error, {
            reasoning: 'Failed to claim and deposit rewards',
            query: `Failed to claim and deposit rewards for ${args[0]}`,
          });
        }
      },
    );

    tools.registerTool(
      'update_reserve_config',
      'Update reserve configuration on suilend',
      [
        {
          name: 'lending_market_owner_cap_id',
          type: 'string',
          description: 'Lending market owner capability ID',
          required: true,
        },
        {
          name: 'coin_type',
          type: 'string',
          description: 'Coin type',
          required: true,
        },
        {
          name: 'config',
          type: 'object',
          description: 'Reserve configuration',
          required: true,
        },
      ],
      async (...args) => {
        try {
          const result = await this.updateReserveConfig({
            lendingMarketOwnerCapId: args[0] as string,
            coinType: args[1] as string,
            config: args[2] as unknown as CreateReserveConfigArgs,
          });
          return this.formatResponse(
            result,
            `Update reserve configuration for coin type: ${args[1]}`,
          );
        } catch (error) {
          return this.formatError(error, {
            reasoning: 'Failed to update reserve config',
            query: `Failed to update reserve config for coin type: ${args[1]}`,
          });
        }
      },
    );

    tools.registerTool(
      'change_reserve_price_feed',
      'Change reserve price feed on suilend',
      [
        {
          name: 'lending_market_owner_cap_id',
          type: 'string',
          description: 'Lending market owner capability ID',
          required: true,
        },
        {
          name: 'coin_type',
          type: 'string',
          description: 'Coin type',
          required: true,
        },
        {
          name: 'pyth_price_id',
          type: 'string',
          description: 'Pyth price feed ID',
          required: true,
        },
      ],
      async (...args) => {
        try {
          const result = await this.changeReservePriceFeed({
            lendingMarketOwnerCapId: args[0] as string,
            coinType: args[1] as string,
            pythPriceId: args[2] as string,
          });
          return this.formatResponse(
            result,
            `Change reserve price feed for coin type: ${args[1]}`,
          );
        } catch (error) {
          return this.formatError(error, {
            reasoning: 'Failed to change reserve price feed',
            query: `Failed to change reserve price feed for coin type: ${args[1]}`,
          });
        }
      },
    );

    tools.registerTool(
      'deposit_liquidity',
      'Deposit liquidity and get CTokens on suilend',
      [
        {
          name: 'owner_id',
          type: 'string',
          description: 'Owner ID',
          required: true,
        },
        {
          name: 'coin_type',
          type: 'string',
          description: 'Coin type',
          required: true,
        },
        {
          name: 'value',
          type: 'string',
          description: 'Amount to deposit',
          required: true,
        },
      ],
      async (...args) => {
        try {
          const result = await this.depositLiquidity({
            ownerId: args[0] as string,
            coinType: args[1] as string,
            value: args[2] as string,
          });
          return this.formatResponse(
            result,
            `Deposited ${args[2]} of ${args[1]} for CTokens`,
          );
        } catch (error) {
          return this.formatError(error, {
            reasoning: 'Failed to deposit liquidity and get CTokens',
            query: `Failed to deposit ${args[2]} of ${args[1]}`,
          });
        }
      },
    );

    tools.registerTool(
      'withdraw_and_send',
      'Withdraw funds and send to user on suilend',
      [
        {
          name: 'owner_id',
          type: 'string',
          description: 'Owner ID',
          required: true,
        },
        {
          name: 'obligation_owner_cap_id',
          type: 'string',
          description: 'Obligation owner capability ID',
          required: true,
        },
        {
          name: 'obligation_id',
          type: 'string',
          description: 'Obligation ID',
          required: true,
        },
        {
          name: 'coin_type',
          type: 'string',
          description: 'Coin type',
          required: true,
        },
        {
          name: 'value',
          type: 'string',
          description: 'Amount to withdraw',
          required: true,
        },
      ],
      async (...args) => {
        try {
          const result = await this.withdrawAndSend({
            ownerId: args[0] as string,
            obligationOwnerCapId: args[1] as string,
            obligationId: args[2] as string,
            coinType: args[3] as string,
            value: args[4] as string,
          });
          return this.formatResponse(
            result,
            `Withdrew ${args[4]} of ${args[3]} to ${args[0]}`,
          );
        } catch (error) {
          return this.formatError(error, {
            reasoning: 'Failed to withdraw and send to user',
            query: `Failed to withdraw ${args[4]} of ${args[3]}`,
          });
        }
      },
    );

    tools.registerTool(
      'redeem_ctokens',
      'Redeem CTokens and withdraw liquidity on suilend',
      [
        {
          name: 'owner_id',
          type: 'string',
          description: 'Owner ID',
          required: true,
        },
        {
          name: 'ctoken_coin_types',
          type: 'array',
          description: 'Array of CToken coin types to redeem',
          required: true,
        },
      ],
      async (...args) => {
        try {
          const result = await this.redeemCtokens({
            ownerId: args[0] as string,
            ctokenCoinTypes: args[1] as unknown as string[],
          });
          return this.formatResponse(
            result,
            `Redeemed CTokens for types: ${(args[1] as unknown as string[]).join(', ')}`,
          );
        } catch (error) {
          return this.formatError(error, {
            reasoning: 'Failed to redeem CTokens and withdraw liquidity',
            query: `Failed to redeem CTokens for types: ${(args[1] as unknown as string[]).join(', ')}`,
          });
        }
      },
    );
  }

  private static async createLendingMarket(
    params: SuilendMarketParams,
  ): Promise<unknown> {
    const transaction = new Transaction();
    const ownerCap = SuilendClient.createNewLendingMarket(
      params.registryId,
      params.lendingMarketType,
      transaction,
    );
    return { ownerCap, transaction };
  }

  private static async createReserve(
    params: SuilendReserveParams,
  ): Promise<unknown> {
    const transaction = new Transaction();
    const client = await suilendClientWrapper();
    const result = await client.createReserve(
      params.lendingMarketOwnerCapId,
      transaction,
      params.pythPriceId,
      params.coinType,
      params.config,
    );
    return { transaction, result };
  }

  private static async borrowAndSendToUser(
    params: SuilendOrderParams,
  ): Promise<unknown> {
    const client = await suilendClientWrapper();
    const transaction = new Transaction();
    await client.borrowAndSendToUser(
      params.ownerId,
      params.obligationOwnerCapId,
      params.obligationId,
      params.coinType,
      params.value,
      transaction,
    );
    return {
      ownerId: params.ownerId,
      obligationId: params.obligationId,
      coinType: params.coinType,
      borrowedAmount: params.value,
      status: 'success',
    };
  }

  private static async depositIntoObligation(
    params: SuilendDepositParams,
  ): Promise<unknown> {
    const client = await suilendClientWrapper();
    const transaction = new Transaction();
    await client.depositIntoObligation(
      params.ownerId,
      params.coinType,
      params.value,
      transaction,
      params.obligationOwnerCapId,
    );
    return {
      ownerId: params.ownerId,
      coinType: params.coinType,
      depositedAmount: params.value,
      status: 'success',
    };
  }

  private static async repayIntoObligation(
    params: Omit<SuilendOrderParams, 'obligationOwnerCapId'>,
  ): Promise<unknown> {
    const client = await suilendClientWrapper();
    const transaction = new Transaction();
    await client.repayIntoObligation(
      params.ownerId,
      params.obligationId,
      params.coinType,
      params.value,
      transaction,
    );
    return {
      ownerId: params.ownerId,
      obligationId: params.obligationId,
      coinType: params.coinType,
      repaidAmount: params.value,
      status: 'success',
    };
  }

  private static async getObligation(
    params: SuilendObligationParams,
  ): Promise<unknown> {
    const client = await suilendClientWrapper();
    const obligation = await client.getObligation(params.obligationId);
    return {
      obligationId: params.obligationId,
      obligationDetails: obligation,
      status: 'success',
    };
  }

  private static async getLendingMarketOwnerCapId(
    params: SuilendOwnerCapParams,
  ): Promise<unknown> {
    const client = await suilendClientWrapper();
    const ownerCapId = await client.getLendingMarketOwnerCapId(params.ownerId);
    return {
      ownerId: params.ownerId,
      ownerCapId: ownerCapId,
      lendingMarketId: params.lendingMarketId,
      status: 'success',
    };
  }

  private static async addReward(
    params: SuilendRewardParams,
  ): Promise<unknown> {
    const client = await suilendClientWrapper();
    const transaction = new Transaction();
    await client.addReward(
      params.ownerId,
      params.lendingMarketOwnerCapId,
      BigInt(params.reserveArrayIndex),
      params.isDepositReward,
      params.rewardCoinType,
      params.rewardValue,
      BigInt(params.startTimeMs),
      BigInt(params.endTimeMs),
      transaction,
    );

    return {
      transaction,
      rewardDetails: {
        reserveIndex: params.reserveArrayIndex,
        rewardType: params.isDepositReward ? 'deposit' : 'borrow',
        coinType: params.rewardCoinType,
        value: params.rewardValue,
        duration: `${params.startTimeMs} to ${params.endTimeMs}`,
      },
      status: 'success',
    };
  }

  private static async cancelReward(
    params: SuilendCancelRewardParams,
  ): Promise<unknown> {
    const client = await suilendClientWrapper();
    const transaction = new Transaction();
    await client.cancelReward(
      params.lendingMarketOwnerCapId,
      BigInt(params.reserveArrayIndex),
      params.isDepositReward,
      BigInt(params.rewardIndex),
      params.rewardCoinType,
      transaction,
    );

    return {
      transaction,
      cancelledReward: {
        reserveIndex: params.reserveArrayIndex,
        rewardIndex: params.rewardIndex,
        rewardType: params.isDepositReward ? 'deposit' : 'borrow',
        coinType: params.rewardCoinType,
      },
      status: 'success',
    };
  }

  private static async closeReward(
    params: SuilendCloseRewardParams,
  ): Promise<unknown> {
    const client = await suilendClientWrapper();
    const transaction = new Transaction();
    await client.closeReward(
      params.lendingMarketOwnerCapId,
      BigInt(params.reserveArrayIndex),
      params.isDepositReward,
      BigInt(params.rewardIndex),
      params.rewardCoinType,
      transaction,
    );

    return {
      transaction,
      closedReward: {
        reserveIndex: params.reserveArrayIndex,
        rewardIndex: params.rewardIndex,
        rewardType: params.isDepositReward ? 'deposit' : 'borrow',
        coinType: params.rewardCoinType,
      },
      status: 'success',
    };
  }

  private static async claimRewardsAndSend(
    params: SuilendClaimRewardParams,
  ): Promise<unknown> {
    const client = await suilendClientWrapper();
    const transaction = new Transaction();
    await client.claimRewardsAndSendToUser(
      params.ownerId,
      params.obligationOwnerCapId,
      params.rewards,
      transaction,
    );

    return {
      transaction,
      claimedRewards: params.rewards,
      recipient: params.ownerId,
      status: 'success',
    };
  }

  private static async claimRewardsAndDeposit(
    params: SuilendClaimRewardParams,
  ): Promise<unknown> {
    const client = await suilendClientWrapper();
    const transaction = new Transaction();
    await client.claimRewardsAndDeposit(
      params.ownerId,
      params.obligationOwnerCapId,
      params.rewards,
      transaction,
    );

    return {
      transaction,
      claimedRewards: params.rewards,
      depositor: params.ownerId,
      status: 'success',
    };
  }

  private static async updateReserveConfig(
    params: SuilendUpdateReserveConfigParams,
  ): Promise<unknown> {
    const transaction = new Transaction();
    const client = await suilendClientWrapper();
    await client.updateReserveConfig(
      params.lendingMarketOwnerCapId,
      transaction,
      params.coinType,
      params.config,
    );

    return {
      lendingMarketOwnerCapId: params.lendingMarketOwnerCapId,
      coinType: params.coinType,
      transaction,
      updatedConfig: {
        openLtvPct: params.config.openLtvPct,
        closeLtvPct: params.config.closeLtvPct,
        maxCloseLtvPct: params.config.maxCloseLtvPct,
        borrowWeightBps: params.config.borrowWeightBps,
        depositLimit: params.config.depositLimit,
        borrowLimit: params.config.borrowLimit,
        liquidationBonusBps: params.config.liquidationBonusBps,
        maxLiquidationBonusBps: params.config.maxLiquidationBonusBps,
        depositLimitUsd: params.config.depositLimitUsd,
        borrowLimitUsd: params.config.borrowLimitUsd,
        borrowFeeBps: params.config.borrowFeeBps,
        spreadFeeBps: params.config.spreadFeeBps,
        protocolLiquidationFeeBps: params.config.protocolLiquidationFeeBps,
        interestRateUtils: params.config.interestRateUtils,
        interestRateAprs: params.config.interestRateAprs,
        isolated: params.config.isolated,
        openAttributedBorrowLimitUsd:
          params.config.openAttributedBorrowLimitUsd,
        closeAttributedBorrowLimitUsd:
          params.config.closeAttributedBorrowLimitUsd,
      },
      status: 'success',
    };
  }

  private static async changeReservePriceFeed(
    params: SuilendChangePriceFeedParams,
  ): Promise<unknown> {
    const client = await suilendClientWrapper();
    const transaction = new Transaction();
    await client.changeReservePriceFeed(
      params.lendingMarketOwnerCapId,
      params.coinType,
      params.pythPriceId,
      transaction,
    );

    return {
      transaction,
      lendingMarketId: params.lendingMarketOwnerCapId,
      coinType: params.coinType,
      newPriceId: params.pythPriceId,
      status: 'success',
    };
  }

  private static async depositLiquidity(
    params: SuilendDepositLiquidityParams,
  ): Promise<unknown> {
    const client = await suilendClientWrapper();
    const transaction = new Transaction();
    await client.depositLiquidityAndGetCTokens(
      params.ownerId,
      params.coinType,
      params.value,
      transaction,
    );

    return {
      ownerId: params.ownerId,
      coinType: params.coinType,
      depositedValue: params.value,
      transaction,
      status: 'success',
    };
  }

  private static async withdrawAndSend(
    params: SuilendWithdrawParams,
  ): Promise<unknown> {
    const client = await suilendClientWrapper();
    const transaction = new Transaction();
    await client.withdrawAndSendToUser(
      params.ownerId,
      params.obligationOwnerCapId,
      params.obligationId,
      params.coinType,
      params.value,
      transaction,
    );

    return {
      ownerId: params.ownerId,
      coinType: params.coinType,
      withdrawnValue: params.value,
      transaction,
      status: 'success',
    };
  }

  private static async redeemCtokens(
    params: SuilendRedeemCtokensParams,
  ): Promise<unknown> {
    const client = await suilendClientWrapper();
    const transaction = new Transaction();
    await client.redeemCtokensAndWithdrawLiquidity(
      params.ownerId,
      params.ctokenCoinTypes,
      transaction,
    );

    return {
      ownerId: params.ownerId,
      ctokenCoinTypes: params.ctokenCoinTypes,
      transaction,
      status: 'success',
    };
  }
}

export default SuilendTools;
