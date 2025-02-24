import { Aftermath } from 'aftermath-ts-sdk';
import { handleError } from '../../utils';

class PriceTool {
  private static sdk: Aftermath | null = null;

  private static initSDK(): Aftermath {
    if (!PriceTool.sdk) {
      PriceTool.sdk = new Aftermath('MAINNET');
    }
    return PriceTool.sdk;
  }

  /**
   * Gets current price for a single coin
   */
  public static async getCoinPrice(coinType: string): Promise<string> {
    try {
      const sdk = PriceTool.initSDK();
      await sdk.init();

      const priceInfo = await sdk.Prices().getCoinPriceInfo({
        coin: coinType,
      });

      return JSON.stringify([
        {
          reasoning: 'Successfully retrieved current price',
          response: {
            price: priceInfo.price,
            priceChange24h: priceInfo.priceChange24HoursPercentage,
            coin: coinType,
          },
          status: 'success',
          query: `Get price for ${coinType}`,
          errors: [],
        },
      ]);
    } catch (error) {
      return JSON.stringify([
        handleError(error, {
          reasoning: 'Failed to fetch price',
          query: `Get price for ${coinType}`,
        }),
      ]);
    }
  }

  /**
   * Gets prices for multiple coins
   */
  public static async getCoinsPrice(coinTypes: string[]): Promise<string> {
    try {
      const sdk = PriceTool.initSDK();
      await sdk.init();

      const priceInfos = await sdk.Prices().getCoinsToPriceInfo({
        coins: coinTypes,
      });

      return JSON.stringify([
        {
          reasoning: 'Successfully retrieved prices',
          response: {
            prices: priceInfos,
            timestamp: new Date().toISOString(),
          },
          status: 'success',
          query: `Get prices for ${coinTypes.join(', ')}`,
          errors: [],
        },
      ]);
    } catch (error) {
      return JSON.stringify([
        handleError(error, {
          reasoning: 'Failed to fetch prices',
          query: `Get prices for ${coinTypes.join(', ')}`,
        }),
      ]);
    }
  }
}

export { PriceTool };
