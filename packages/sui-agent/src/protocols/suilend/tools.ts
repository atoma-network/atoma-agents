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
}

export default SuilendTools;
