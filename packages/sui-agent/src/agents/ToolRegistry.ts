import Tools from '../utils/tools';
import { getCoinPrice, coinsToPrice } from '../tools/aftermath/PriceTool';
import { getTokenAPR } from '../tools/aftermath/apr';
import {
  getPool,
  getAllPools,
  getPoolEvents,
  getRankedPools,
  getFilteredPools,
} from '../tools/aftermath/PoolTool';
import {
  getPoolSpotPrice,
  getTradeAmountOut,
  getTradeRoute,
  getDepositTransaction,
  getWithdrawTransaction,
} from '../tools/aftermath/TradeTool';
import {
  transferCoinWrapper,
  multiTransferWrapper,
  mergeCoinsWrapper,
  estimateGasWrapper,
  depositTopPoolsWrapper,
  withdrawPoolsWrapper,
  getStakingPositionsWrapper,
  getSuiTvlWrapper,
  getAfSuiExchangeRateWrapper,
  getStakeTransactionWrapper,
} from '../utils/toolWrappers';

/* 
format for tool registry is:
tool name, tool description, tool arguments, process(function)
*/

export function registerAllTools(tools: Tools) {
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

  // APR Tool
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

  // Transaction Tools
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
    transferCoinWrapper,
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
    multiTransferWrapper,
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
    mergeCoinsWrapper,
  );

  tools.registerTool(
    'estimate_gas',
    'Tool to estimate gas cost for a transaction',
    [
      {
        name: 'transaction',
        type: 'object',
        description: 'Transaction block to estimate gas for',
        required: true,
      },
    ],
    estimateGasWrapper,
  );

  // Pool transaction tools
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
    depositTopPoolsWrapper,
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
    withdrawPoolsWrapper,
  );

  // Staking Tools
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
    getStakingPositionsWrapper,
  );

  tools.registerTool(
    'get_sui_tvl',
    'Tool to get total SUI TVL in staking',
    [],
    getSuiTvlWrapper,
  );

  tools.registerTool(
    'get_afsui_exchange_rate',
    'Tool to get afSUI to SUI exchange rate',
    [],
    getAfSuiExchangeRateWrapper,
  );

  tools.registerTool(
    'get_stake_transaction',
    'Tool to generate a staking transaction',
    [
      {
        name: 'walletAddress',
        type: 'string',
        description: 'Address of the wallet staking tokens',
        required: true,
      },
      {
        name: 'suiAmount',
        type: 'string',
        description: 'Amount of SUI to stake (in MIST)',
        required: true,
      },
      {
        name: 'validatorAddress',
        type: 'string',
        description: 'Address of the validator to stake with',
        required: true,
      },
    ],
    getStakeTransactionWrapper,
  );
}
