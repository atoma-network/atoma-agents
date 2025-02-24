import { Aftermath } from 'aftermath-ts-sdk';
import Tools from '../../utils/tools';
import PoolTool from './PoolTool';
import TradeTool from './TradeTool';
import { PriceTool } from './PriceTool';
import StakingTool from './staking';

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
      'get_coin_price',
      'Get the current price and 24h change for a coin',
      [
        {
          name: 'coin_type',
          type: 'string',
          description: 'Full coin type (e.g., "0x2::sui::SUI")',
          required: true,
        },
      ],
      async (...args) => PriceTool.getCoinPrice(args[0] as string),
    );

    tools.registerTool(
      'get_coins_price',
      'Get prices for multiple coins',
      [
        {
          name: 'coin_types',
          type: 'string',
          description: 'Comma-separated list of full coin types',
          required: true,
        },
      ],
      async (...args) =>
        PriceTool.getCoinsPrice((args[0] as string).split(',')),
    );

    tools.registerTool(
      'get pool stats',
      'Get the stats of a pool on Aftermath by pool id. This will return the volume, tvl, supply per lps, lp price, fees, and apr of the pool.',
      [
        {
          name: 'pool_id',
          type: 'string',
          description: 'The pool ID to get stats for',
          required: true,
        },
      ],
      async (...args) => PoolTool.getPoolStats(args[0] as string),
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

    // Add after existing pool tools
    tools.registerTool(
      'get_pool_deposit_transaction',
      'Create a deposit transaction for a pool on Aftermath',
      [
        {
          name: 'pool_id',
          type: 'string',
          description: 'The pool ID to deposit into',
          required: true,
        },
        {
          name: 'wallet_address',
          type: 'string',
          description: 'Address of the depositing wallet',
          required: true,
        },
        {
          name: 'amounts_in',
          type: 'string',
          description:
            'JSON string of token amounts to deposit (e.g., {"SUI":"1000000"})',
          required: true,
        },
        {
          name: 'slippage',
          type: 'number',
          description: 'Maximum slippage percentage',
          required: true,
        },
        {
          name: 'referrer',
          type: 'string',
          description: 'Optional referrer address',
          required: false,
        },
      ],
      async (...args) =>
        PoolTool.getDepositTransaction(
          args[0] as string,
          args[1] as string,
          JSON.parse(args[2] as string),
          args[3] as number,
          args[4] as string,
        ),
    );

    tools.registerTool(
      'get_pool_withdraw_transaction',
      'Create a withdraw transaction for a pool on Aftermath',
      [
        {
          name: 'pool_id',
          type: 'string',
          description: 'The pool ID to withdraw from',
          required: true,
        },
        {
          name: 'wallet_address',
          type: 'string',
          description: 'Address of the withdrawing wallet',
          required: true,
        },
        {
          name: 'amounts_out',
          type: 'string',
          description:
            'JSON string of token amounts to withdraw (e.g., {"SUI":"1000000"})',
          required: true,
        },
        {
          name: 'lp_amount',
          type: 'string',
          description: 'Amount of LP tokens to burn',
          required: true,
        },
        {
          name: 'slippage',
          type: 'number',
          description: 'Maximum slippage percentage',
          required: true,
        },
        {
          name: 'referrer',
          type: 'string',
          description: 'Optional referrer address',
          required: false,
        },
      ],
      async (...args) =>
        PoolTool.getWithdrawTransaction(
          args[0] as string,
          args[1] as string,
          JSON.parse(args[2] as string),
          BigInt(args[3] as string),
          args[4] as number,
          args[5] as string,
        ),
    );

    tools.registerTool(
      'get_pool_trade_transaction',
      'Create a trade transaction for a pool on Aftermath',
      [
        {
          name: 'pool_id',
          type: 'string',
          description: 'The pool ID to trade in',
          required: true,
        },
        {
          name: 'wallet_address',
          type: 'string',
          description: 'Address of the trading wallet',
          required: true,
        },
        {
          name: 'coin_in_type',
          type: 'string',
          description: 'Type of input coin (e.g., "0x2::sui::SUI")',
          required: true,
        },
        {
          name: 'coin_in_amount',
          type: 'string',
          description:
            'Amount of input coin in base units (e.g., "1000000000" for 1 SUI)',
          required: true,
        },
        {
          name: 'coin_out_type',
          type: 'string',
          description:
            'Type of output coin (e.g., "0x5d4b302506645c37ff133b98c4b50a5ae14841659738d6d733d59d0d217a93bf::coin::COIN")',
          required: true,
        },
        {
          name: 'slippage',
          type: 'number',
          description: 'Maximum slippage percentage (e.g., 0.5 for 0.5%)',
          required: true,
        },
        {
          name: 'referrer',
          type: 'string',
          description: 'Optional referrer address',
          required: false,
        },
      ],
      async (...args) => {
        // Convert amount to BigInt and handle SUI decimals
        const amount =
          args[2] === '0x2::sui::SUI'
            ? BigInt(Number(args[3]) * 1_000_000_000) // Convert SUI to MIST
            : BigInt(args[3]);

        return PoolTool.getTradeTransaction(
          args[0] as string,
          args[1] as string,
          args[2] as string,
          amount,
          args[4] as string,
          args[5] as number,
          args[6] as string,
        );
      },
    );
  }
}

export default AftermathTools;
