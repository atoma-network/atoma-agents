import { Aftermath } from 'aftermath-ts-sdk';
import { handleError } from '../../utils';
import { RankingMetric, PoolInfo, SDKPool } from './types';

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
   * Gets ranked pools by metric
   * @param metric Metric to rank by (apr, tvl, fees, volume)
   * @param numPools Number of top pools to return
   * @returns Ranked pool information
   */
  public static async getRankedPools(
    metric: RankingMetric,
    numPools = 5,
  ): Promise<string> {
    try {
      const sdk = PoolTool.initSDK();
      await sdk.init();
      const pools = await sdk.Pools().getPools({ objectIds: [] });

      // Process all pools
      const processedPools = await Promise.all(
        pools.map(async (poolInstance) => {
          if (!poolInstance.pool?.objectId) return null;
          return this.processPool(poolInstance, poolInstance.pool.objectId);
        }),
      );

      const validPools = processedPools.filter(
        (pool): pool is PoolInfo => pool !== null && pool.tokens.length > 0,
      );

      // Sort pools based on the specified metric
      const sortedPools = validPools.sort((a, b) => {
        let valueA: number, valueB: number;

        switch (metric) {
          case 'apr':
            valueA = a.apr;
            valueB = b.apr;
            break;
          case 'tvl':
            valueA = a.tvl;
            valueB = b.tvl;
            break;
          case 'fees':
            valueA = a.fee;
            valueB = b.fee;
            break;
          case 'volume':
            valueA = a.tvl * a.fee; // Using TVL * fee as a proxy for volume
            valueB = b.tvl * b.fee;
            break;
          default:
            valueA = a.tvl;
            valueB = b.tvl;
        }

        return valueB - valueA; // Default to descending order
      });

      // Take only the requested number of pools
      const topPools = sortedPools.slice(0, numPools);

      // Format the response with ranking information
      const rankedPools = topPools.map((pool, index) => ({
        rank: index + 1,
        id: pool.id,
        metrics: {
          apr: `${pool.apr.toFixed(2)}%`,
          tvl: `$${pool.tvl.toLocaleString()}`,
          fee: `${(pool.fee * 100).toFixed(2)}%`,
          volume: `$${(pool.tvl * pool.fee).toLocaleString()}`, // Estimated volume
        },
      }));

      return JSON.stringify([
        {
          reasoning: `Successfully retrieved top ${numPools} pools ranked by ${metric}`,
          response: {
            metric,
            numPools,
            pools: rankedPools,
            timestamp: new Date().toISOString(),
          },
          status: 'success',
          query: `Get top ${numPools} pools by ${metric}`,
          errors: [],
        },
      ]);
    } catch (error) {
      return JSON.stringify([
        handleError(error, {
          reasoning: 'Failed to retrieve ranked pools',
          query: `Attempted to get top ${numPools} pools by ${metric}`,
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
    limit: number,
  ): Promise<string> {
    try {
      const sdk = PoolTool.initSDK();
      await sdk.init();
      const pool = await sdk.Pools().getPool({ objectId: poolId });
      const events =
        eventType === 'deposit'
          ? await pool.getDepositEvents({ limit })
          : await pool.getWithdrawEvents({ limit });
      return JSON.stringify([
        {
          reasoning: 'Successfully retrieved pool events',
          response: events,
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
}

export default PoolTool;
