import Tools from '../../utils/tools';
import {
  initializeNaviClient,
  getNaviAccount,
  fetchLiquidationsFromSentio,
  checkUserLiquidationStatusTool,
  getNaviPortfolio,
  getNaviAvailableRewards,
  getNaviPools,
  depositNavi,
  withrawFromNavi,
} from '../navi';

class NaviTools {
  public static registerTools(tools: Tools) {
    tools.registerTool(
      'initialize_navi',
      'Tool to initialize NAVI SDK client',
      [
        {
          name: 'mnemonic',
          type: 'string',
          description:
            'Mnemonic for account generation, if not present use empty string',
          required: true,
        },
        {
          name: 'networkType',
          type: 'string',
          description: "Network type ('mainnet' or custom RPC)",
          required: true,
        },
        {
          name: 'numberOfAccounts',
          type: 'number',
          description: 'Number of accounts to generate',
          required: false,
        },
      ],
      initializeNaviClient,
    );

    tools.registerTool(
      'get_navi_account',
      'Tool to get NAVI account information',
      [
        {
          name: 'accountIndex',
          type: 'number',
          description: 'Index of the account to retrieve',
          required: true,
        },
      ],
      getNaviAccount,
    );

    tools.registerTool(
      'get_all_liquidations_using_sentio',
      'Tool to get all liquidations from  the navi protocol',
      [],
      fetchLiquidationsFromSentio,
    );
    tools.registerTool(
      'get_user_liquidation_status_using_sentio',
      'Tool to get liquidation status for a user using their address and passing it through sentio ',
      [
        {
          name: 'address',
          type: 'string',
          description:
            'a wallet address which is used to check liquidation status, if no address is provided use user wallet address',
          required: true,
        },
      ],
      checkUserLiquidationStatusTool,
    );

    tools.registerTool(
      'get_navi_portfolio',
      'Tool to get NAVI portfolio for a specific address',
      [
        {
          name: 'address',
          type: 'string',
          description: 'Address to get NAVI portfolio for',
          required: true,
        },
      ],
      getNaviPortfolio,
    );

    tools.registerTool(
      'get_navi_rewards',
      'Tool to get available NAVI rewards for a specific address',
      [
        {
          name: 'address',
          type: 'string',
          description: 'Address to get available rewards for',
          required: true,
        },
      ],
      getNaviAvailableRewards,
    );

    tools.registerTool(
      'get_navi_pools',
      'Tool to get NAVI pools for a specific coin',
      [
        {
          name: 'coin',
          type: 'string',
          description: 'Coin to get NAVI pools for',
          required: true,
        },
      ],
      getNaviPools,
    );

    tools.registerTool(
      'deposit_navi',
      'Tool to deposit NAVI for a specific coin',
      [
        {
          name: 'coin',
          type: 'string',
          description: 'Coin to deposit NAVI for',
          required: true,
        },
        {
          name: 'amount',
          type: 'number',
          description: 'Amount to deposit',
          required: true,
        },
      ],
      depositNavi,
    );

    tools.registerTool(
      'withdraw_navi',
      'Tool to withdraw NAVI for a specific coin',
      [
        {
          name: 'coin',
          type: 'string',
          description: 'Coin to withdraw NAVI for',
          required: true,
        },
        {
          name: 'amount',
          type: 'number',
          description: 'Amount to withdraw',
          required: true,
        },
      ],
      withrawFromNavi,
    );
  }
}

export default NaviTools;
