import Tools from '../utils/tools';
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

class Transaction {
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
}
export default Transaction;
