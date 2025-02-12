export * from './types';
export { default as SuilendTools } from './tools';

import { SuiClient, SuiHTTPTransport } from '@mysten/sui/client';
import {
  SuilendClient,
  LENDING_MARKET_ID,
  LENDING_MARKET_TYPE,
} from '@suilend/sdk/client';
import { NETWORK_CONFIG } from '../../@types/interface';

/**
 * Initializes and returns a SuilendClient instance configured for the mainnet.
 *
 * This function creates a configured SuilendClient by:
 * 1. Establishing a connection to the Sui mainnet using SuiClient
 * 2. Initializing a SuilendClient with predefined lending market parameters
 *
 * @returns {Promise<SuilendClient>} A configured SuilendClient instance ready for lending operations
 * @throws {Error} If client initialization fails, with detailed error message
 *
 * @example
 * try {
 *   const client = await suilendClientWrapper();
 *   // Use client for lending operations
 * } catch (error) {
 *   console.error('Failed to initialize SuilendClient:', error);
 * }
 *
 * @see {@link SuilendClient} For available lending operations
 * @see {@link LENDING_MARKET_ID} For the configured lending market identifier
 * @see {@link LENDING_MARKET_TYPE} For the lending market type configuration
 */
export async function suilendClientWrapper(): Promise<SuilendClient> {
  try {
    const suiClient = new SuiClient({
      transport: new SuiHTTPTransport({
        url: NETWORK_CONFIG.MAINNET.fullnode,
      }),
    });

    const suilendClient = await SuilendClient.initialize(
      LENDING_MARKET_ID,
      LENDING_MARKET_TYPE,
      suiClient,
    );

    return suilendClient;
  } catch (error) {
    throw new Error(
      `Failed to initialize SuilendClient: ${error instanceof Error ? error.message : String(error)}`,
    );
  }
}
