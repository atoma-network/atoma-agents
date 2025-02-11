import { Aftermath } from 'aftermath-ts-sdk';
import { handleError } from '../../utils';
import { SwapParams } from './types';

class TradeTool {
  private static sdk: Aftermath | null = null;

  private static initSDK(): Aftermath {
    if (!TradeTool.sdk) {
      TradeTool.sdk = new Aftermath('MAINNET');
    }
    return TradeTool.sdk;
  }

  /**
   * Finds tokens in a pool
   * @param poolId Pool ID to search in
   * @returns Token information
   */
  public static async findTokensInPool(poolId: string): Promise<string> {
    try {
      const sdk = TradeTool.initSDK();
      await sdk.init();
      const pool = await sdk.Pools().getPool({ objectId: poolId });
      const tokens = Object.keys(pool.pool.coins);

      return JSON.stringify([
        {
          reasoning: 'Successfully retrieved pool tokens',
          response: {
            poolId,
            tokens,
            timestamp: new Date().toISOString(),
          },
          status: 'success',
          query: `Find tokens in pool ${poolId}`,
          errors: [],
        },
      ]);
    } catch (error) {
      return JSON.stringify([
        handleError(error, {
          reasoning: 'Failed to find tokens in pool',
          query: `Attempted to find tokens in pool ${poolId}`,
        }),
      ]);
    }
  }

  /**
   * Gets spot price for a pool
   * @param poolId Pool ID to get price for
   * @returns Pool spot price information
   */
  public static async getPoolSpotPrice(poolId: string): Promise<string> {
    try {
      const sdk = TradeTool.initSDK();
      await sdk.init();
      const pool = await sdk.Pools().getPool({ objectId: poolId });
      const tokens = Object.keys(pool.pool.coins);
      const price = pool.getSpotPrice({
        coinInType: tokens[0],
        coinOutType: tokens[1],
        withFees: true,
      });

      return JSON.stringify([
        {
          reasoning: 'Successfully retrieved pool spot price',
          response: {
            poolId,
            price: price.toString(),
            coinIn: tokens[0],
            coinOut: tokens[1],
            timestamp: new Date().toISOString(),
          },
          status: 'success',
          query: `Get spot price for pool ${poolId}`,
          errors: [],
        },
      ]);
    } catch (error) {
      return JSON.stringify([
        handleError(error, {
          reasoning: 'Failed to get pool spot price',
          query: `Attempted to get spot price for pool ${poolId}`,
        }),
      ]);
    }
  }

  /**
   * Calculates the expected output amount for a trade
   * @param params Trade parameters
   * @returns Expected output amount
   */
  public static async getTradeAmountOut(params: SwapParams): Promise<string> {
    try {
      const sdk = TradeTool.initSDK();
      await sdk.init();
      const pool = await sdk.Pools().getPool({ objectId: params.poolId });
      const tokens = Object.keys(pool.pool.coins);
      const amountOut = pool.getTradeAmountOut({
        coinInType: tokens[0],
        coinOutType: tokens[1],
        coinInAmount: params.amountIn,
      });

      return JSON.stringify([
        {
          reasoning: 'Successfully calculated trade output amount',
          response: {
            poolId: params.poolId,
            amountIn: params.amountIn.toString(),
            expectedAmountOut: amountOut.toString(),
            coinIn: tokens[0],
            coinOut: tokens[1],
            slippage: params.slippage,
            timestamp: new Date().toISOString(),
          },
          status: 'success',
          query: `Calculate output amount for ${params.amountIn} tokens with ${params.slippage}% slippage`,
          errors: [],
        },
      ]);
    } catch (error) {
      return JSON.stringify([
        handleError(error, {
          reasoning: 'Failed to calculate trade output amount',
          query: `Attempted to calculate output for ${params.amountIn} tokens`,
        }),
      ]);
    }
  }

  /**
   * Gets the optimal trade route for a swap
   * @param params Trade parameters
   * @returns Trade route information
   */
  public static async getTradeRoute(params: SwapParams): Promise<string> {
    try {
      const sdk = TradeTool.initSDK();
      await sdk.init();
      const pool = await sdk.Pools().getPool({ objectId: params.poolId });
      const tokens = Object.keys(pool.pool.coins);
      const route = await sdk.Router().getCompleteTradeRouteGivenAmountIn({
        coinInType: tokens[0],
        coinOutType: tokens[1],
        coinInAmount: params.amountIn,
      });

      return JSON.stringify([
        {
          reasoning: 'Successfully found optimal trade route',
          response: {
            route,
            params: {
              amountIn: params.amountIn.toString(),
              slippage: params.slippage,
              poolId: params.poolId,
              coinIn: tokens[0],
              coinOut: tokens[1],
            },
            timestamp: new Date().toISOString(),
          },
          status: 'success',
          query: `Find optimal route for ${params.amountIn} tokens swap`,
          errors: [],
        },
      ]);
    } catch (error) {
      return JSON.stringify([
        handleError(error, {
          reasoning: 'Failed to find optimal trade route',
          query: `Attempted to find route for ${params.amountIn} tokens swap`,
        }),
      ]);
    }
  }

  /**
   * Generates a swap transaction
   * @param params Swap parameters
   * @returns Swap transaction data
   */
  public static async getSwapTransaction(params: SwapParams): Promise<string> {
    try {
      const sdk = TradeTool.initSDK();
      await sdk.init();
      const pool = await sdk.Pools().getPool({ objectId: params.poolId });
      const tokens = Object.keys(pool.pool.coins);
      const tx = await pool.getTradeTransaction({
        walletAddress: params.walletAddress,
        coinInType: tokens[0],
        coinOutType: tokens[1],
        coinInAmount: params.amountIn,
        slippage: params.slippage,
      });

      return JSON.stringify([
        {
          reasoning: 'Successfully generated swap transaction',
          response: {
            transaction: tx,
            details: {
              poolId: params.poolId,
              amountIn: params.amountIn.toString(),
              slippage: params.slippage,
              walletAddress: params.walletAddress,
              coinIn: tokens[0],
              coinOut: tokens[1],
            },
          },
          status: 'success',
          query: `Generate swap transaction for ${params.amountIn} tokens`,
          errors: [],
        },
      ]);
    } catch (error) {
      return JSON.stringify([
        handleError(error, {
          reasoning: 'Failed to generate swap transaction',
          query: `Attempted to generate swap for ${params.amountIn} tokens`,
        }),
      ]);
    }
  }
}

export default TradeTool;
