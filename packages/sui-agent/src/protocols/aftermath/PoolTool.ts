import { Aftermath } from 'aftermath-ts-sdk';
import { handleError } from '../../utils';
import { PoolInfo, SDKPool } from './types';

class PoolTool {
  private static sdk: Aftermath | null = null;

  private static initSDK(): Aftermath {
    if (!PoolTool.sdk) {
      PoolTool.sdk = new Aftermath('MAINNET');
    }
    return PoolTool.sdk;
  }

  private static async processPool(
    poolInstance: SDKPool,
    poolId: string,
  ): Promise<PoolInfo | null> {
    try {
      if (!poolInstance?.pool?.objectId || !poolInstance?.pool?.coins)
        return null;

      // Extract basic pool information
      const tokens = Object.keys(poolInstance.pool.coins);
      if (tokens.length === 0) return null;

      // Get metrics with safe fallbacks
      const stats = poolInstance.stats || { apr: 0, tvl: 0, volume24h: 0 };

      // Calculate fee as a percentage of volume (using 0.3% as default fee if no volume)
      const fee =
        stats.volume24h && stats.tvl
          ? (stats.volume24h / stats.tvl) * 0.003 // Assuming 0.3% fee rate
          : 0.003; // Default to 0.3% if we can't calculate

      return {
        id: poolId,
        tokens,
        apr: stats.apr || 0,
        tvl: stats.tvl || 0,
        fee,
      };
    } catch (error) {
      console.error(`Error processing pool ${poolId}:`, error);
      return null;
    }
  }

  /**
   * Gets all pools
   * @returns All pool information
   */
  public static async getPools(): Promise<string> {
    try {
      const sdk = PoolTool.initSDK();
      await sdk.init();
      const pools = await sdk.Pools().getPools({ objectIds: [] });
      return JSON.stringify([
        {
          reasoning: 'Successfully retrieved all pools',
          response: pools,
          status: 'success',
          query: 'Get all pools',
          errors: [],
        },
      ]);
    } catch (error) {
      return JSON.stringify([
        handleError(error, {
          reasoning: 'Failed to retrieve all pools',
          query: 'Attempted to get all pools',
        }),
      ]);
    }
  }

  /**
   * Gets pool events
   * @param poolId Pool ID to get events for
   * @param eventType Type of events to get (deposit or withdraw)
   * @param limit Maximum number of events to return
   * @returns Pool events
   */
  public static async getPoolEvents(
    poolId: string,
    eventType: string,
    limit = 10,
  ): Promise<string> {
    try {
      const sdk = PoolTool.initSDK();
      await sdk.init();
      const pool = await sdk.Pools().getPool({ objectId: poolId });

      // Use the pools instance to get events
      const events = await pool.getInteractionEvents({
        walletAddress: pool.pool.creator, // Use the pool creator's address
        limit,
        cursor: undefined, // Add cursor for pagination
      });

      // Filter events by type
      const filteredEvents = events.events?.filter((event) =>
        eventType === 'deposit' ? 'deposits' in event : 'withdrawn' in event,
      );

      return JSON.stringify([
        {
          reasoning: 'Successfully retrieved pool events',
          response: {
            events: filteredEvents,
            pagination: {
              limit,
              hasMore: events.events?.length === limit,
            },
          },
          status: 'success',
          query: `Get ${eventType} events for pool ${poolId}`,
          errors: [],
        },
      ]);
    } catch (error) {
      return JSON.stringify([
        handleError(error, {
          reasoning: 'Failed to retrieve pool events',
          query: `Attempted to get ${eventType} events for pool ${poolId}`,
        }),
      ]);
    }
  }

  /**
   * Gets pool information
   * @param poolId Pool ID to get info for
   * @returns Pool information
   */
  public static async getPoolInfo(poolId: string): Promise<string> {
    try {
      const sdk = PoolTool.initSDK();
      await sdk.init();
      const pool = await sdk.Pools().getPool({ objectId: poolId });

      return JSON.stringify([
        {
          reasoning: 'Successfully retrieved pool information',
          response: {
            poolId,
            pool: {
              id: pool.pool.objectId,
              metrics: pool.stats || {},
              coins: pool.pool.coins,
            },
            timestamp: new Date().toISOString(),
          },
          status: 'success',
          query: `Get info for pool ${poolId}`,
          errors: [],
        },
      ]);
    } catch (error) {
      return JSON.stringify([
        handleError(error, {
          reasoning: 'Failed to retrieve pool information',
          query: `Attempted to get info for pool ${poolId}`,
        }),
      ]);
    }
  }

  /**
   * Gets pool statistics
   * @param poolId Pool ID to get stats for
   * @returns Pool statistics including TVL, volume, APR etc.
   */
  public static async getPoolStats(poolId: string): Promise<string> {
    try {
      const sdk = PoolTool.initSDK();
      await sdk.init();

      const stats = await sdk.Pools().getPoolsStats({
        poolIds: [poolId],
      });

      return JSON.stringify([
        {
          reasoning: 'Successfully retrieved pool statistics',
          response: {
            poolId,
            stats: {
              volume: stats[0].volume,
              tvl: stats[0].tvl,
              supplyPerLps: stats[0].supplyPerLps,
              lpPrice: stats[0].lpPrice,
              fees: stats[0].fees,
              apr: stats[0].apr,
            },
            timestamp: new Date().toISOString(),
          },
          status: 'success',
          query: `Get statistics for pool ${poolId}`,
          errors: [],
        },
      ]);
    } catch (error) {
      return JSON.stringify([
        handleError(error, {
          reasoning: 'Failed to retrieve pool statistics',
          query: `Attempted to get statistics for pool ${poolId}`,
        }),
      ]);
    }
  }

  /**
   * Gets deposit transaction for a pool
   */
  public static async getDepositTransaction(
    poolId: string,
    walletAddress: string,
    amountsIn: Record<string, bigint>,
    slippage: number,
    referrer?: string,
  ): Promise<string> {
    try {
      const sdk = PoolTool.initSDK();
      await sdk.init();
      const pool = await sdk.Pools().getPool({ objectId: poolId });

      const tx = await pool.getDepositTransaction({
        walletAddress,
        amountsIn,
        slippage,
        referrer,
      });

      return JSON.stringify([
        {
          reasoning: 'Successfully created deposit transaction',
          response: { tx, poolId },
          status: 'success',
          query: 'Create deposit transaction',
          errors: [],
        },
      ]);
    } catch (error) {
      return JSON.stringify([
        handleError(error, {
          reasoning: 'Failed to create deposit transaction',
          query: 'Create deposit transaction',
        }),
      ]);
    }
  }

  /**
   * Gets withdraw transaction for a pool
   */
  public static async getWithdrawTransaction(
    poolId: string,
    walletAddress: string,
    amountsOutDirection: Record<string, bigint>,
    lpCoinAmount: bigint,
    slippage: number,
    referrer?: string,
  ): Promise<string> {
    try {
      const sdk = PoolTool.initSDK();
      await sdk.init();
      const pool = await sdk.Pools().getPool({ objectId: poolId });

      const tx = await pool.getWithdrawTransaction({
        walletAddress,
        amountsOutDirection,
        lpCoinAmount,
        slippage,
        referrer,
      });

      return JSON.stringify([
        {
          reasoning: 'Successfully created withdraw transaction',
          response: { tx, poolId },
          status: 'success',
          query: 'Create withdraw transaction',
          errors: [],
        },
      ]);
    } catch (error) {
      return JSON.stringify([
        handleError(error, {
          reasoning: 'Failed to create withdraw transaction',
          query: 'Create withdraw transaction',
        }),
      ]);
    }
  }

  /**
   * Gets trade transaction for a pool
   */
  public static async getTradeTransaction(
    poolId: string,
    walletAddress: string,
    coinInType: string,
    coinInAmount: bigint,
    coinOutType: string,
    slippage: number,
    referrer?: string,
  ): Promise<string> {
    try {
      const sdk = PoolTool.initSDK();
      await sdk.init();
      const pool = await sdk.Pools().getPool({ objectId: poolId });

      // Verify pool exists and has the required coins
      if (!pool?.pool?.coins) {
        throw new Error('Pool not found or invalid');
      }

      // Check if pool has both coins
      const coins = Object.keys(pool.pool.coins);
      if (!coins.includes(coinInType) || !coins.includes(coinOutType)) {
        throw new Error(
          `Pool does not support trading between ${coinInType} and ${coinOutType}`,
        );
      }

      const tx = await pool.getTradeTransaction({
        walletAddress,
        coinInType,
        coinInAmount,
        coinOutType,
        slippage,
        referrer,
      });

      return JSON.stringify([
        {
          reasoning: 'Successfully created trade transaction',
          response: {
            tx,
            poolId,
            coins: {
              in: coinInType,
              out: coinOutType,
              amount: coinInAmount.toString(),
            },
          },
          status: 'success',
          query: 'Create trade transaction',
          errors: [],
        },
      ]);
    } catch (error) {
      return JSON.stringify([
        handleError(error, {
          reasoning: 'Failed to create trade transaction',
          query: 'Create trade transaction',
        }),
      ]);
    }
  }
}

export default PoolTool;
