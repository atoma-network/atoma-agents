import { NAVISDKClient } from 'navi-sdk';
import { handleError } from '../../utils';
import sentioApi from '../../config/sentio';
// Initialize NAVI SDK client
let naviClient: NAVISDKClient | null = null;

/**
 * Initializes the NAVI SDK client
 * @param mnemonic - Optional mnemonic for account generation
 * @param networkType - Network type ('mainnet' or custom RPC)
 * @param numberOfAccounts - Number of accounts to generate
 * @returns JSON string with initialization status
 */
export async function initializeNaviClient(
  ...args: (string | number | bigint | boolean)[]
): Promise<string> {
  let [mnemonic, networkType, numberOfAccounts] = args as [
    string,
    string,
    number,
  ];

  try {
    naviClient = new NAVISDKClient({
      mnemonic,
      networkType,
      numberOfAccounts: numberOfAccounts || 5,
    });
    let account = naviClient.accounts[0];
    return JSON.stringify([
      {
        reasoning: 'Successfully initialized NAVI SDK client',
        response: JSON.stringify(
          {
            numberOfAccounts: naviClient.accounts.length,
            networkType,
            mnemonic: naviClient.getMnemonic(),
            address: account.address,
          },
          null,
          2,
        ),
        status: 'success',
        query: 'Initialize NAVI SDK client',
        errors: [],
      },
    ]);
  } catch (error: unknown) {
    return JSON.stringify([
      handleError(error, {
        reasoning: 'Failed to initialize NAVI SDK client',
        query: 'Attempted to initialize NAVI SDK client',
      }),
    ]);
  }
}

/**
 * Gets account information for a specific index
 * @param accountIndex - Index of the account to retrieve
 * @returns JSON string with account information
 */
export async function getNaviAccount(
  ...args: (string | number | bigint | boolean)[]
): Promise<string> {
  const [accountIndex] = args as [number];

  try {
    if (!naviClient) {
      throw new Error('NAVI SDK client not initialized');
    }

    const account = naviClient.accounts[accountIndex];
    if (!account) {
      throw new Error(`No account found at index ${accountIndex}`);
    }

    return JSON.stringify([
      {
        reasoning: 'Successfully retrieved NAVI account information',
        response: JSON.stringify(
          {
            address: account.address,
            publicKey: account.getPublicKey(),
          },
          null,
          2,
        ),
        status: 'success',
        query: `Get NAVI account at index ${accountIndex}`,
        errors: [],
      },
    ]);
  } catch (error: unknown) {
    return JSON.stringify([
      handleError(error, {
        reasoning: 'Failed to retrieve NAVI account information',
        query: `Attempted to get NAVI account at index ${accountIndex}`,
      }),
    ]);
  }
}

export async function fetchLiquidationsFromSentio() {
  try {
    const response = await sentioApi.post('/sql/execute', {
      sqlQuery: {
        sql: 'select * from Liquidation',
      },
    });
    return response.data;
  } catch (error) {
    handleError(error, {
      reasoning: 'Failed to Fetch Liquidations from sentio',
      query: `Attempted to fetch liquidations from sentio`,
    });
  }
}

async function checkUserLiquidations(address: string) {
  try {
    const response = await sentioApi.post('/sql/execute', {
      sqlQuery: {
        sql: `SELECT * FROM Liquidation WHERE user = '${address}' OR liquidation_sender = '${address}'`,
      },
    });
    const liquidations = response.data;
    console.log(liquidations.result.rows, 'liquidations');
    return {
      asUser: liquidations.result.rows.filter((l: any) => l.user === address),
      asLiquidator: liquidations.result.rows.filter(
        (l: any) => l.liquidation_sender === address,
      ),
      totalLiquidations: liquidations.length,
    };
  } catch (error) {
    handleError(error, {
      reasoning: 'Failed to fetch liquidation status for user ',
      query: `Attempted to fetch liquidation status for user`,
    });
    console.error('Error checking user liquidations:', error);
    return {
      asUser: [],
      asLiquidator: [],
      totalLiquidations: 0,
    };
  }
}
export async function checkUserLiquidationStatusTool(
  ...args: (string | number | bigint | boolean)[]
): Promise<any> {
  const [walletAddress] = args as [string];
  return checkUserLiquidations(walletAddress);
}
// Add more NAVI-specific functions here...
