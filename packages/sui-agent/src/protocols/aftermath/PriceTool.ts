import { Aftermath } from 'aftermath-ts-sdk';
import { COIN_ADDRESSES, COIN_SYNONYMS } from '../../@types/interface';
import { handleError } from '../../utils';

const af = new Aftermath('MAINNET');
const prices = af.Prices();

/**
 * Normalizes a coin symbol by handling various formats and synonyms
 * @param symbol - Raw coin symbol input
 * @returns Normalized coin symbol or null if not recognized
 */
function normalizeCoinSymbol(symbol: string): string | null {
  const normalized = symbol
    .trim()
    .toUpperCase()
    .replace(/[^A-Z_]/g, '');
  return COIN_SYNONYMS[normalized] || null;
}

/**
 * Fetches current price for a single coin from Aftermath Finance
 * @param coin - Coin symbol or address
 * @returns Formatted price string or error message
 */
export async function getCoinPrice(
  ...args: (string | number | bigint | boolean)[]
): Promise<string> {
  const coin = args[0] as string; // Cast first argument to string
  try {
    // Handle direct addresses vs symbols
    let coinType = coin;
    if (!coin.includes('::')) {
      const normalizedSymbol = normalizeCoinSymbol(coin);
      if (!normalizedSymbol) {
        throw new Error(`Unknown coin symbol: ${coin}`);
      }
      coinType =
        COIN_ADDRESSES[normalizedSymbol as keyof typeof COIN_ADDRESSES];
      if (!coinType) {
        throw new Error(`No address mapping for coin: ${coin}`);
      }
    }

    const price = await prices.getCoinPrice({ coin: coinType });

    return JSON.stringify([
      {
        reasoning:
          'Successfully retrieved current price from Aftermath Finance',
        response: `The current price of ${coin} is $${price}`,
        status: 'success',
        query: `Fetched price for ${coin}`,
        errors: [],
      },
    ]);
  } catch (error: unknown) {
    return JSON.stringify([
      handleError(error, {
        reasoning: 'Failed to fetch price from Aftermath Finance',
        query: `Attempted to fetch price for ${coin}`,
      }),
    ]);
  }
}

/**
 * Gets price information for multiple coins from Aftermath Finance
 * @param coins - Comma-separated string of coin symbols or addresses
 * @returns JSON string containing price information or error response
 * @throws Error if price fetch fails or invalid token addresses
 */
export async function coinsToPrice(
  ...args: (string | number | bigint | boolean)[]
): Promise<string> {
  const coins = args[0] as string;
  try {
    // Convert coin symbols to addresses
    const coinTypes = coins.split(',').map((coin) => {
      const trimmed = coin.trim();
      // Handle direct addresses
      if (trimmed.includes('::')) {
        return trimmed;
      }
      // Handle symbols
      const normalizedSymbol = normalizeCoinSymbol(trimmed);
      if (!normalizedSymbol) {
        throw new Error(`Unknown coin symbol: ${trimmed}`);
      }
      const address =
        COIN_ADDRESSES[normalizedSymbol as keyof typeof COIN_ADDRESSES];
      if (!address) {
        throw new Error(`No address mapping for coin: ${trimmed}`);
      }
      return address;
    });

    // Fetch prices from Aftermath
    const priceInfo = await prices.getCoinsToPrice({ coins: coinTypes });
    return JSON.stringify([
      {
        reasoning:
          'Successfully retrieved current price information from Aftermath Finance for the requested coins.',
        response: JSON.stringify(priceInfo, null, 2),
        status: 'success',
        query: `Fetched prices for coins: ${coins}`,
        errors: [],
      },
    ]);
  } catch (error: unknown) {
    return JSON.stringify([
      handleError(error, {
        reasoning: 'Failed to retrieve prices from Aftermath Finance',
        query: `Attempted to fetch prices for coins: ${coins}`,
      }),
    ]);
  }
}
