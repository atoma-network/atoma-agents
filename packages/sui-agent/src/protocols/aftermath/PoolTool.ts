import { Aftermath, Pool } from 'aftermath-ts-sdk';
import { PoolInfo } from '../../@types/interface';
import { handleError } from '../../utils';

// Initialize Aftermath SDK for mainnet
const af = new Aftermath('MAINNET');
const pools = af.Pools();

/**
 * Processes raw pool data into standardized format.
 * @param poolInstance - A Pool instance returned from Aftermath containing the pool data.
 * @param poolId - Unique identifier for the pool.
 * @returns Standardized pool information.
 */
async function processPool(
  poolInstance: Pool,
  poolId: string,
): Promise<PoolInfo> {
  try {
    // Fetch pool metrics using the poolId
    const metrics = await pools.getPoolsStats({ poolIds: [poolId] });
    const poolMetrics = metrics[0];

    // Extract tokens (coin types) from the pool object.
    // Here we assume that the underlying pool data is stored in the `pool` property.
    const poolData = poolInstance.pool;
    const tokens = Object.keys(poolData.coins || {});

    // For each token, extract its normalized balance.
    const reserves = tokens.map((token) => {
      // Use optional chaining to guard against missing data.
      const coinData = poolData.coins[token];
      return BigInt(coinData?.normalizedBalance || 0);
    });

    return {
      id: poolId,
      tokens,
      reserves,
      fee: poolMetrics?.fees || 0,
      tvl: poolMetrics?.tvl || 0,
      apr: (poolMetrics?.apr || 0) * 100, // Convert to percentage if needed
    };
  } catch (error: unknown) {
    console.error(`Error processing pool ${poolId}:`, error);
    return {
      id: poolId,
      tokens: [],
      reserves: [],
      fee: 0,
      tvl: 0,
      apr: 0,
    };
  }
}

/**
 * Gets detailed information about a specific pool.
 * @param poolId - Unique identifier for the pool.
 * @returns JSON string containing pool details or error information.
 */
export async function getPool(
  ...args: (string | number | bigint | boolean)[]
): Promise<string> {
  const poolId = args[0] as string;
  try {
    const poolInstance = await pools.getPool({ objectId: poolId });
    if (!poolInstance) {
      return JSON.stringify([
        handleError('Pool not found', {
          reasoning: 'Pool not found with the specified ID.',
          query: `Attempted to fetch pool with ID: ${poolId}`,
        }),
      ]);
    }
    const processedPool = await processPool(poolInstance, poolId);
    return JSON.stringify([
      {
        reasoning:
          'Successfully retrieved pool information from Aftermath Finance.',
        response: JSON.stringify(processedPool, null, 2),
        status: 'success',
        query: `Fetched pool with ID: ${poolId}`,
        errors: [],
      },
    ]);
  } catch (error: unknown) {
    return JSON.stringify([
      handleError(error, {
        reasoning: 'Failed to retrieve pool information',
        query: `Attempted to fetch pool with ID: ${poolId}`,
      }),
    ]);
  }
}

/**
 * Retrieves information about all available pools.
 * @returns JSON string containing all pool information.
 */
export async function getAllPools(): Promise<string> {
  try {
    const allPools = await pools.getAllPools();
    const processedPools = await Promise.all(
      allPools.map(async (poolInstance) => {
        // Ensure the pool instance has an objectId defined.
        if (!poolInstance.pool?.objectId) return null;
        return processPool(poolInstance, poolInstance.pool.objectId);
      }),
    );

    // Filter out any null or empty pools.
    const validPools = processedPools.filter(
      (pool): pool is PoolInfo => pool !== null && pool.tokens.length > 0,
    );

    return JSON.stringify([
      {
        reasoning:
          'Successfully retrieved all available pools from Aftermath Finance.',
        response: JSON.stringify(validPools, null, 2),
        status: 'success',
        query: 'Fetched all available pools',
        errors: [],
      },
    ]);
  } catch (error: unknown) {
    return JSON.stringify([
      handleError(error, {
        reasoning: 'Failed to retrieve pool information',
        query: 'Attempted to fetch all available pools',
      }),
    ]);
  }
}

/**
 * Gets deposit or withdrawal events for a specific pool.
 * @param poolId - Unique identifier for the pool.
 * @param eventType - Type of events to fetch ("deposit" or "withdraw").
 * @param limit - Maximum number of events to return.
 * @returns JSON string containing event information.
 */
export async function getPoolEvents(
  ...args: (string | number | bigint | boolean)[]
): Promise<string> {
  const [poolId, eventType, limit] = args as [string, string, number];
  try {
    const poolInstance = await pools.getPool({ objectId: poolId });
    if (!poolInstance) {
      return JSON.stringify([
        handleError('Pool not found', {
          reasoning: 'Pool not found with the specified ID.',
          query: `Attempted to fetch ${eventType} events for pool: ${poolId}`,
        }),
      ]);
    }

    // Depending on the event type, fetch the appropriate events.
    const eventData =
      eventType === 'deposit'
        ? await poolInstance.getDepositEvents({ limit })
        : await poolInstance.getWithdrawEvents({ limit });

    return JSON.stringify([
      {
        reasoning: `Successfully retrieved ${eventType} events for the pool.`,
        response: JSON.stringify(eventData, null, 2),
        status: 'success',
        query: `Fetched ${eventType} events for pool: ${poolId}`,
        errors: [],
      },
    ]);
  } catch (error: unknown) {
    return JSON.stringify([
      handleError(error, {
        reasoning: `Failed to retrieve ${eventType} events`,
        query: `Attempted to fetch ${eventType} events for pool: ${poolId}`,
      }),
    ]);
  }
}

/**
 * Gets ranked pools by specified metric.
 * @param metric - Metric to rank by (apr, tvl, fees, volume).
 * @param limit - Maximum number of pools to return.
 * @param order - Sort order (ascending or descending).
 * @returns JSON string containing ranked pool information.
 */
export async function getRankedPools(
  ...args: (string | number | bigint | boolean)[]
): Promise<string> {
  const [metric, limit, order] = args as [string, number, string];
  try {
    // Fetch and process all pools.
    const allPools = await pools.getAllPools();
    const processedPools = await Promise.all(
      allPools.map(async (poolInstance) => {
        if (!poolInstance.pool?.objectId) return null;
        return processPool(poolInstance, poolInstance.pool.objectId);
      }),
    );

    const validPools = processedPools.filter(
      (pool): pool is PoolInfo => pool !== null && pool.tokens.length > 0,
    );

    // Sort pools based on the specified metric.
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

      return order === 'desc' ? valueB - valueA : valueA - valueB;
    });

    // Take only the requested number of pools.
    const topPools = sortedPools.slice(0, limit);

    // Format the response with ranking information.
    const rankedPools = topPools.map((pool, index) => ({
      rank: index + 1,
      ...pool,
      metrics: {
        apr: `${pool.apr.toFixed(2)}%`,
        tvl: `$${pool.tvl.toLocaleString()}`,
        fee: `${(pool.fee * 100).toFixed(2)}%`,
        volume: `$${(pool.tvl * pool.fee).toLocaleString()}`, // Estimated volume
      },
    }));

    return JSON.stringify([
      {
        reasoning: `Successfully retrieved top ${limit} pools ranked by ${metric}.`,
        response: JSON.stringify(
          {
            metric,
            order,
            pools: rankedPools,
          },
          null,
          2,
        ),
        status: 'success',
        query: `Retrieved top ${limit} pools ranked by ${metric} in ${order}ending order`,
        errors: [],
      },
    ]);
  } catch (error: unknown) {
    return JSON.stringify([
      handleError(error, {
        reasoning: 'Failed to retrieve ranked pools',
        query: `Attempted to fetch top ${limit} pools ranked by ${metric}`,
      }),
    ]);
  }
}

/**
 * Gets pools filtered by specific criteria.
 * @param minTvl - Minimum Total Value Locked requirement.
 * @param minApr - Minimum Annual Percentage Rate requirement.
 * @param tokens - Array of token symbols that must be in the pool.
 * @returns JSON string containing filtered pool information.
 */
export async function getFilteredPools(
  ...args: (string | number | bigint | boolean)[]
): Promise<string> {
  const [minTvl, minApr, tokens] = args as [number, number, string[]];
  try {
    // Fetch and process all pools.
    const allPools = await pools.getAllPools();
    const processedPools = await Promise.all(
      allPools.map(async (poolInstance) => {
        if (!poolInstance.pool?.objectId) return null;
        return processPool(poolInstance, poolInstance.pool.objectId);
      }),
    );

    // Apply filters.
    const filteredPools = processedPools.filter((pool): pool is PoolInfo => {
      if (!pool || pool.tokens.length === 0) return false;

      // Apply TVL filter.
      if (minTvl && pool.tvl < minTvl) return false;

      // Apply APR filter.
      if (minApr && pool.apr < minApr) return false;

      // Apply token filter.
      if (tokens && tokens.length > 0) {
        const poolTokens = pool.tokens.map((t) => t.toLowerCase());
        const hasRequiredTokens = tokens.every((token) =>
          poolTokens.some((poolToken) =>
            poolToken.includes(token.toLowerCase()),
          ),
        );
        if (!hasRequiredTokens) return false;
      }

      return true;
    });

    // Format the response with detailed metrics.
    const formattedPools = filteredPools.map((pool) => ({
      ...pool,
      metrics: {
        apr: `${pool.apr.toFixed(2)}%`,
        tvl: `$${pool.tvl.toLocaleString()}`,
        fee: `${(pool.fee * 100).toFixed(2)}%`,
        volume: `$${(pool.tvl * pool.fee).toLocaleString()}`, // Estimated volume
      },
    }));

    return JSON.stringify([
      {
        reasoning:
          'Successfully retrieved pools matching the specified criteria.',
        response: JSON.stringify(
          {
            filters: {
              minTvl,
              minApr,
              tokens,
            },
            poolCount: formattedPools.length,
            pools: formattedPools,
          },
          null,
          2,
        ),
        status: 'success',
        query: `Retrieved pools with${minTvl ? ` min TVL $${minTvl}` : ''}${
          minApr ? ` min APR ${minApr}%` : ''
        }${tokens && tokens.length > 0 ? ` containing tokens ${tokens.join(', ')}` : ''}`,
        errors: [],
      },
    ]);
  } catch (error: unknown) {
    return JSON.stringify([
      handleError(error, {
        reasoning: 'Failed to retrieve filtered pools',
        query: 'Attempted to fetch filtered pools',
      }),
    ]);
  }
}
