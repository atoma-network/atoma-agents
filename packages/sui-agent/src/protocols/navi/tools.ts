import Tools from '../../utils/tools';
import {
  initializeNaviClient,
  getNaviAccount,
  fetchLiquidationsFromSentio,
  checkUserLiquidationStatusTool,
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
  }
}

export default NaviTools;
