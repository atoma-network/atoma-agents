import { Aftermath } from 'aftermath-ts-sdk';
import Tools from '../../utils/tools';
import PoolTool from './PoolTool';
import TradeTool from './TradeTool';
import { getCoinPrice, coinsToPrice } from './PriceTool';
import { getTokenAPR } from './apr';
import StakingTool from './staking';
import { RankingMetric } from './types';

class AftermathTools {
  private static sdk: Aftermath | null = null;

  private static initSDK() {
    if (!this.sdk) {
      this.sdk = new Aftermath('MAINNET');
    }
    return this.sdk;
  }

  public static registerTools(tools: Tools) {
    // Price Tools
    tools.registerTool(
      'get_coin_price on Aftermath',
      'Get the price of a single coin on Aftermath',
      [
        {
          name: 'coin',
          type: 'string',
          description: 'The coin symbol or address',
          required: true,
        },
      ],
      async (...args) => getCoinPrice(args[0] as string),
    );

    tools.registerTool(
      'get_coins_to_price on Aftermath',
      'Get the price of multiple coins on Aftermath',
      [
        {
          name: 'coins',
          type: 'string',
          description: 'Comma-separated list of coin symbols or addresses',
          required: true,
        },
      ],
      async (...args) => coinsToPrice(args[0] as string),
    );

    tools.registerTool(
      'get ranked pools on Aftermath',
      'Get ranked pools by a specific metric',
      [
        {
          name: 'metric',
          type: 'string',
          description: 'Metric to rank by (apr, tvl, fees, volume)',
          required: true,
        },
        {
          name: 'limit',
          type: 'number',
          description: 'Number of pools to return',
          required: false,
        },
      ],
      async (...args) =>
        PoolTool.getRankedPools(args[0] as RankingMetric, args[1] as number),
    );

    tools.registerTool(
      'get_token_apr on Aftermath',
      'Get the APR of a token on Aftermath',
      [
        {
          name: 'token_address',
          type: 'string',
          description: 'The token address to get APR for',
          required: true,
        },
      ],
      async (...args) => getTokenAPR(args[0] as string),
    );

    // Pool Tools
    tools.registerTool(
      'get_pool',
      'Get details about a specific pool',
      [
        {
          name: 'pool_id',
          type: 'string',
          description: 'The pool ID to get information for',
          required: true,
        },
      ],
      async (...args) => PoolTool.getPoolInfo(args[0] as string),
    );

    tools.registerTool(
      'get_all_pools',
      'Get information about all available pools on Aftermath',
      [],
      PoolTool.getPools,
    );

    tools.registerTool(
      'get_pool_events',
      'Get deposit or withdrawal events for a pool on Aftermath',
      [
        {
          name: 'pool_id',
          type: 'string',
          description: 'The pool ID to get events for',
          required: true,
        },
        {
          name: 'event_type',
          type: 'string',
          description: 'Type of events to fetch (deposit or withdraw)',
          required: true,
        },
        {
          name: 'limit',
          type: 'number',
          description: 'Maximum number of events to return',
          required: false,
        },
      ],
      async (...args) =>
        PoolTool.getPoolEvents(
          args[0] as string,
          args[1] as string,
          args[2] as number,
        ),
    );

    // Pool Ranking Tools
    tools.registerTool(
      'get_ranked_pools',
      'Get top pools ranked by a specific metric on Aftermath',
      [
        {
          name: 'metric',
          type: 'string',
          description: 'Metric to rank by (apr, tvl, fees, volume)',
          required: true,
        },
        {
          name: 'limit',
          type: 'number',
          description: 'Number of pools to return',
          required: false,
        },
      ],
      async (...args) =>
        PoolTool.getRankedPools(args[0] as RankingMetric, args[1] as number),
    );

    // Trading Tools
    tools.registerTool(
      'get_spot_price',
      'Get the spot price between two tokens in a pool on Aftermath',
      [
        {
          name: 'pool_id',
          type: 'string',
          description: 'The pool ID to check prices in',
          required: true,
        },
      ],
      async (...args) => TradeTool.getPoolSpotPrice(args[0] as string),
    );

    tools.registerTool(
      'get_trade_amount_out',
      'Calculate expected output amount for a trade on Aftermath',
      [
        {
          name: 'pool_id',
          type: 'string',
          description: 'The pool ID to trade in',
          required: true,
        },
        {
          name: 'amount_in',
          type: 'string',
          description: 'Amount of input token',
          required: true,
        },
        {
          name: 'slippage',
          type: 'number',
          description: 'Maximum slippage percentage',
          required: true,
        },
        {
          name: 'wallet_address',
          type: 'string',
          description: 'Address of the trading wallet',
          required: true,
        },
      ],
      async (...args) =>
        TradeTool.getTradeAmountOut({
          poolId: args[0] as string,
          amountIn: BigInt(args[1] as string),
          slippage: args[2] as number,
          walletAddress: args[3] as string,
        }),
    );

    // Staking Tools
    tools.registerTool(
      'get_staking_positions',
      'Get staking positions for a wallet on Aftermath',
      [
        {
          name: 'wallet_address',
          type: 'string',
          description: 'Address to get positions for',
          required: true,
        },
      ],
      async (...args) => StakingTool.getStakingPositions(args[0] as string),
    );

    tools.registerTool(
      'get_sui_tvl',
      'Get total SUI TVL in staking',
      [],
      StakingTool.getSuiTvl,
    );

    tools.registerTool(
      'get_afsui_exchange_rate',
      'Get afSUI to SUI exchange rate',
      [],
      StakingTool.getAfSuiExchangeRate,
    );

    tools.registerTool(
      'get_stake_transaction on Aftermath',
      'Generate a staking transaction',
      [
        {
          name: 'wallet_address',
          type: 'string',
          description: 'Address of the staking wallet',
          required: true,
        },
        {
          name: 'sui_amount',
          type: 'string',
          description: 'Amount of SUI to stake',
          required: true,
        },
        {
          name: 'validator_address',
          type: 'string',
          description: 'Address of the validator',
          required: true,
        },
      ],
      async (...args) =>
        StakingTool.getStakeTransaction({
          walletAddress: args[0] as string,
          suiAmount: BigInt(args[1] as string),
          validatorAddress: args[2] as string,
        }),
    );

    tools.registerTool(
      'get_unstake_transaction on Aftermath',
      'Generate an unstaking transaction on Aftermath',
      [
        {
          name: 'wallet_address',
          type: 'string',
          description: 'Address of the unstaking wallet',
          required: true,
        },
        {
          name: 'afsui_amount',
          type: 'string',
          description: 'Amount of afSUI to unstake',
          required: true,
        },
        {
          name: 'is_atomic',
          type: 'boolean',
          description: 'Whether to perform atomic unstaking',
          required: false,
        },
      ],
      async (...args) =>
        StakingTool.getUnstakeTransaction({
          walletAddress: args[0] as string,
          afSuiAmount: BigInt(args[1] as string),
          isAtomic: (args[2] as boolean) ?? true,
        }),
    );
  }
}

export default AftermathTools;
