import { NAVISDKClient } from 'navi-sdk';
import { handleError } from '../../utils';

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
  const [mnemonic, networkType, numberOfAccounts] = args as [
    string | undefined,
    string,
    number,
  ];

  try {
    naviClient = new NAVISDKClient({
      mnemonic,
      networkType,
      numberOfAccounts: numberOfAccounts || 5,
    });

    return JSON.stringify([
      {
        reasoning: 'Successfully initialized NAVI SDK client',
        response: JSON.stringify(
          {
            numberOfAccounts: naviClient.accounts.length,
            networkType,
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

// Add more NAVI-specific functions here...
