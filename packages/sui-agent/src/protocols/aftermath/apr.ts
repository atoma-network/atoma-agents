import { Aftermath } from 'aftermath-ts-sdk';
import { handleError } from '../../utils';

/**
 * Singleton class for managing Aftermath SDK interactions for APR calculations.
 * This class provides a centralized interface for interacting with the Aftermath SDK,
 * specifically for retrieving APR (Annual Percentage Rate) information for tokens.
 * It implements the Singleton pattern to ensure only one instance of the Aftermath client exists.
 */
class AftermathTool {
  private static instance: Aftermath | null = null;

  /**
   * Gets or creates the Aftermath SDK instance.
   * If an instance doesn't exist, it creates a new one configured for mainnet.
   * Subsequent calls will return the same instance.
   *
   * @returns {Aftermath} Initialized Aftermath instance for mainnet
   * @throws {Error} If initialization of Aftermath SDK fails
   */
  static getInstance(): Aftermath {
    if (!this.instance) {
      this.instance = new Aftermath('MAINNET');
    }
    return this.instance;
  }

  /**
   * Fetches APR (Annual Percentage Rate) information for a specific token.
   *
   * @param {string} tokenAddress - The blockchain address of the token to get APR for
   * @returns {Promise<string>} A promise that resolves to a JSON string containing APR information
   *
   * @example
   * ```typescript
   * const apr = await AftermathTool.getTokenAPR("0x123...abc");
   * ```
   */
  static async getTokenAPR(
    ...args: (string | number | bigint | boolean)[]
  ): Promise<string> {
    const tokenAddress = args[0] as string;
    try {
      const aftermath = this.getInstance();
      const apr = await aftermath.Prices();
      return JSON.stringify([
        {
          reasoning: 'Successfully retrieved APR information.',
          response: JSON.stringify(apr, null, 2),
          status: 'success',
          query: `Fetched APR for token: ${tokenAddress}`,
          errors: [],
        },
      ]);
    } catch (error: unknown) {
      return JSON.stringify([
        handleError(error, {
          reasoning: 'Failed to retrieve APR information',
          query: `Attempted to fetch APR for token: ${tokenAddress}`,
        }),
      ]);
    }
  }
}

export const getTokenAPR = AftermathTool.getTokenAPR.bind(AftermathTool);
