import Tools from '../utils/tools';
import { TransactionAgent } from './Transaction';
import {
  TransferParams,
  MultiTransferParams,
  MergeCoinsParams,
  PoolDepositParams,
  PoolWithdrawParams,
  StakingParams,
} from './types';

class TransactionTools {
  private static agent: TransactionAgent;

  private static async getAgent(): Promise<TransactionAgent> {
    if (!this.agent) {
      this.agent = new TransactionAgent();
    }
    return this.agent;
  }

  public static registerTools(tools: Tools) {
    tools.registerTool(
      'transfer_coin',
      'Tool to transfer a single type of coin to another address',
      [
        {
          name: 'fromAddress',
          type: 'string',
          description: "Sender's wallet address",
          required: true,
        },
        {
          name: 'toAddress',
          type: 'string',
          description: "Recipient's wallet address",
          required: true,
        },
        {
          name: 'tokenType',
          type: 'string',
          description: "Type of token to transfer (e.g., '0x2::sui::SUI')",
          required: true,
        },
        {
          name: 'amount',
          type: 'string',
          description: 'Amount to transfer in base units',
          required: true,
        },
      ],
      async (...args) => {
        const agent = await this.getAgent();
        const params: TransferParams = {
          fromAddress: args[0] as string,
          toAddress: args[1] as string,
          tokenType: args[2] as string,
          amount: BigInt(args[3] as string),
        };
        const tx = agent.buildTransferTx(params.amount, params.toAddress);
        return JSON.stringify(tx.serialize());
      },
    );

    tools.registerTool(
      'multi_transfer',
      'Tool to transfer multiple coins in a single transaction',
      [
        {
          name: 'fromAddress',
          type: 'string',
          description: "Sender's wallet address",
          required: true,
        },
        {
          name: 'toAddress',
          type: 'string',
          description: "Recipient's wallet address",
          required: true,
        },
        {
          name: 'transfers',
          type: 'array',
          description: 'Array of token transfers with token type and amount',
          required: true,
        },
      ],
      async (...args) => {
        const agent = await this.getAgent();
        const params: MultiTransferParams = {
          fromAddress: args[0] as string,
          toAddress: args[1] as string,
          transfers: JSON.parse(args[2] as string),
        };
        const tx = agent.buildMergeCoinsTx(params.transfers[0].tokenType, []);
        return JSON.stringify(tx.serialize());
      },
    );

    tools.registerTool(
      'merge_coins',
      'Tool to merge multiple coins of the same type',
      [
        {
          name: 'coinType',
          type: 'string',
          description: 'Type of coins to merge',
          required: true,
        },
        {
          name: 'walletAddress',
          type: 'string',
          description: 'Address owning the coins',
          required: true,
        },
        {
          name: 'maxCoins',
          type: 'number',
          description: 'Maximum number of coins to merge',
          required: false,
        },
      ],
      async (...args) => {
        const agent = await this.getAgent();
        const params: MergeCoinsParams = {
          coinType: args[0] as string,
          walletAddress: args[1] as string,
          maxCoins: args[2] ? parseInt(args[2] as string) : undefined,
        };
        const coins = await agent.getCoins(params.walletAddress);
        const sourceCoins = coins
          .slice(1, params.maxCoins || 10)
          .map((c) => c.coinObjectId);
        const tx = agent.buildMergeCoinsTx(coins[0].coinObjectId, sourceCoins);
        return JSON.stringify(tx.serialize());
      },
    );

    tools.registerTool(
      'deposit_top_pools',
      'Tool to deposit funds into top pools',
      [
        {
          name: 'walletAddress',
          type: 'string',
          description: 'Address of the depositing wallet',
          required: true,
        },
        {
          name: 'metric',
          type: 'string',
          description: 'Metric to rank by (apr, tvl, fees, volume)',
          required: true,
        },
        {
          name: 'amount',
          type: 'string',
          description: 'Amount of SUI to deposit in each pool (in MIST)',
          required: true,
        },
        {
          name: 'numPools',
          type: 'string',
          description: 'Number of pools to deposit into',
          required: true,
        },
        {
          name: 'slippage',
          type: 'string',
          description: 'Maximum allowed slippage (e.g., 0.01 for 1%)',
          required: true,
        },
      ],
      async (...args) => {
        const agent = await this.getAgent();
        const params: PoolDepositParams = {
          walletAddress: args[0] as string,
          metric: args[1] as string,
          amount: args[2] as string,
          numPools: args[3] as string,
          slippage: args[4] as string,
        };
        const tx = agent.buildMoveCallTx(
          '0x2::pool::deposit',
          [],
          [params.amount],
        );
        return JSON.stringify(tx.serialize());
      },
    );

    tools.registerTool(
      'withdraw_pool',
      'Tool to withdraw LP tokens from a pool',
      [
        {
          name: 'walletAddress',
          type: 'string',
          description: 'Address of the withdrawing wallet',
          required: true,
        },
        {
          name: 'poolId',
          type: 'string',
          description: 'ID of the pool to withdraw from',
          required: true,
        },
        {
          name: 'lpAmount',
          type: 'string',
          description: 'Amount of LP tokens to withdraw (in base units)',
          required: true,
        },
        {
          name: 'slippage',
          type: 'string',
          description: 'Maximum allowed slippage (e.g., 0.01 for 1%)',
          required: true,
        },
      ],
      async (...args) => {
        const agent = await this.getAgent();
        const params: PoolWithdrawParams = {
          walletAddress: args[0] as string,
          poolId: args[1] as string,
          lpAmount: args[2] as string,
          slippage: args[3] as string,
        };
        const tx = agent.buildMoveCallTx(
          '0x2::pool::withdraw',
          [],
          [params.lpAmount],
        );
        return JSON.stringify(tx.serialize());
      },
    );

    tools.registerTool(
      'get_staking_positions',
      'Tool to get staking positions for a wallet',
      [
        {
          name: 'walletAddress',
          type: 'string',
          description: 'Address of the wallet to check staking positions',
          required: true,
        },
      ],
      async (...args) => {
        const agent = await this.getAgent();
        const params: StakingParams = {
          walletAddress: args[0] as string,
        };
        const balance = await agent.getBalance(params.walletAddress);
        return JSON.stringify(balance);
      },
    );
  }
}

export default TransactionTools;
