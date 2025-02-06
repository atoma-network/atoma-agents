import Tools from '../../utils/tools';
import {
  getPool,
  getAllPools,
  getPoolEvents,
  getRankedPools,
  getFilteredPools,
} from './PoolTool';
import {
  getPoolSpotPrice,
  getTradeAmountOut,
  getTradeRoute,
  getDepositTransaction,
  getWithdrawTransaction,
} from './TradeTool';
import { getCoinPrice, coinsToPrice } from './PriceTool';
import { getTokenAPR } from './apr';
class AfterMathTools {
  public static registerTools(tools: Tools) {
    // Price Tools
    tools.registerTool(
      'price_tool',
      'Tool to get the price of a single coin',
      [
        {
          name: 'coin',
          type: 'string',
          description: 'The cryptocurrency coin ID (e.g., bitcoin, ethereum)',
          required: true,
        },
      ],
      getCoinPrice,
    );

    tools.registerTool(
      'get_coins_to_price',
      'Tool to get the price of multiple coins',
      [
        {
          name: 'coins',
          type: 'string',
          description:
            'Comma-separated list of coin symbols or addresses (e.g., "SUI,USDC" or full addresses)',
          required: true,
        },
      ],
      coinsToPrice,
    );

    tools.registerTool(
      'get_token_apr',
      'Tool to get the APR of a token',
      [
        {
          name: 'tokenAddress',
          type: 'string',
          description: 'The token address to get APR for',
          required: true,
        },
      ],
      getTokenAPR,
    );

    // Pool Tools
    tools.registerTool(
      'get_pool',
      'Tool to get detailed information about a specific pool',
      [
        {
          name: 'poolId',
          type: 'string',
          description: 'The pool ID to get information for',
          required: true,
        },
      ],
      getPool,
    );

    tools.registerTool(
      'get_all_pools',
      'Tool to get information about all available pools',
      [],
      getAllPools,
    );

    tools.registerTool(
      'get_pool_events',
      'Tool to get deposit or withdrawal events for a pool',
      [
        {
          name: 'poolId',
          type: 'string',
          description: 'The pool ID to get events for',
          required: true,
        },
        {
          name: 'eventType',
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
      getPoolEvents,
    );

    // Pool Ranking Tools
    tools.registerTool(
      'get_ranked_pools',
      'Tool to get top pools ranked by a specific metric (apr, tvl, fees, volume)',
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
        {
          name: 'order',
          type: 'string',
          description: 'Sort order (asc or desc)',
          required: false,
        },
      ],
      getRankedPools,
    );

    tools.registerTool(
      'get_filtered_pools',
      'Tool to get pools filtered by specific criteria',
      [
        {
          name: 'minTvl',
          type: 'number',
          description: 'Minimum TVL requirement',
          required: false,
        },
        {
          name: 'minApr',
          type: 'number',
          description: 'Minimum APR requirement',
          required: false,
        },
        {
          name: 'tokens',
          type: 'array',
          description: 'Array of token symbols that must be in the pool',
          required: false,
        },
      ],
      getFilteredPools,
    );

    // Trade Tools
    tools.registerTool(
      'get_spot_price',
      'Tool to get the spot price between two tokens in a pool',
      [
        {
          name: 'poolId',
          type: 'string',
          description: 'The pool ID to check prices in',
          required: true,
        },
        {
          name: 'coinInType',
          type: 'string',
          description: 'Address of the input token',
          required: true,
        },
        {
          name: 'coinOutType',
          type: 'string',
          description: 'Address of the output token',
          required: true,
        },
        {
          name: 'withFees',
          type: 'boolean',
          description: 'Whether to include fees in the price calculation',
          required: false,
        },
      ],
      getPoolSpotPrice,
    );

    tools.registerTool(
      'get_trade_amount_out',
      'Tool to calculate the expected output amount for a trade',
      [
        {
          name: 'poolId',
          type: 'string',
          description: 'The pool ID to calculate trade in',
          required: true,
        },
        {
          name: 'coinInType',
          type: 'string',
          description: 'Address of the input token',
          required: true,
        },
        {
          name: 'coinOutType',
          type: 'string',
          description: 'Address of the output token',
          required: true,
        },
        {
          name: 'coinInAmount',
          type: 'string',
          description: 'Amount of input token (in base units)',
          required: true,
        },
      ],
      getTradeAmountOut,
    );

    tools.registerTool(
      'get_trade_route',
      'Tool to find the best trade route between tokens',
      [
        {
          name: 'coinInType',
          type: 'string',
          description: 'Address of the input token',
          required: true,
        },
        {
          name: 'coinOutType',
          type: 'string',
          description: 'Address of the output token',
          required: true,
        },
        {
          name: 'coinInAmount',
          type: 'string',
          description: 'Amount of input token (in base units)',
          required: true,
        },
      ],
      getTradeRoute,
    );

    tools.registerTool(
      'get_deposit_transaction',
      'Tool to generate a deposit transaction for a pool',
      [
        {
          name: 'poolId',
          type: 'string',
          description: 'The pool ID to deposit into',
          required: true,
        },
        {
          name: 'walletAddress',
          type: 'string',
          description: 'Address of the depositing wallet',
          required: true,
        },
        {
          name: 'amountsIn',
          type: 'object',
          description: 'Map of token addresses to amounts to deposit',
          required: true,
        },
        {
          name: 'slippage',
          type: 'number',
          description: 'Maximum allowed slippage (e.g., 0.01 for 1%)',
          required: false,
        },
      ],
      getDepositTransaction,
    );

    tools.registerTool(
      'get_withdraw_transaction',
      'Tool to generate a withdrawal transaction for a pool',
      [
        {
          name: 'poolId',
          type: 'string',
          description: 'The pool ID to withdraw from',
          required: true,
        },
        {
          name: 'walletAddress',
          type: 'string',
          description: 'Address of the withdrawing wallet',
          required: true,
        },
        {
          name: 'amountsOutDirection',
          type: 'object',
          description: 'Map of token addresses to desired withdrawal amounts',
          required: true,
        },
        {
          name: 'lpCoinAmount',
          type: 'string',
          description: 'Amount of LP tokens to burn',
          required: true,
        },
        {
          name: 'slippage',
          type: 'number',
          description: 'Maximum allowed slippage (e.g., 0.01 for 1%)',
          required: false,
        },
      ],
      getWithdrawTransaction,
    );
  }
}

export default AfterMathTools;
