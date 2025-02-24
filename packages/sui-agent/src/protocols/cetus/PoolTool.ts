import CetusClmmSDK, { initCetusSDK } from '@cetusprotocol/cetus-sui-clmm-sdk';
import { handleError } from '../../utils';
import { CetusPool } from './types';

class PoolTool {
  private static sdk: CetusClmmSDK;

  private static initSDK() {
    if (!this.sdk) {
      this.sdk = initCetusSDK({
        network: 'mainnet',
        fullNodeUrl:
          process.env.SUI_RPC_URL || 'https://fullnode.mainnet.sui.io',
        wallet: process.env.SUI_WALLET_ADDRESS || '',
      });
    }
    return this.sdk;
  }

  /**
   * Gets information about a specific pool on Cetus
   * @param poolId The ID of the pool to get information for
   * @returns Pool information
   */
  public static async getPool(poolId: string): Promise<string> {
    try {
      const sdk = this.initSDK();
      const pool = await sdk.Pool.getPool(poolId);
      return JSON.stringify([
        {
          reasoning: 'Successfully retrieved pool information',
          response: pool,
          status: 'success',
          query: `Get pool ${poolId}`,
          errors: [],
        },
      ]);
    } catch (error) {
      return JSON.stringify([
        handleError(error, {
          reasoning: 'Failed to retrieve pool information',
          query: `Attempted to get pool ${poolId}`,
        }),
      ]);
    }
  }

  /**
   * Gets all pools
   * @returns List of all pools
   */
  public static async getAllPools(): Promise<string> {
    try {
      const sdk = this.initSDK();
      const pools = await sdk.Pool.getPools();
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
          reasoning: 'Failed to retrieve pools',
          query: 'Attempted to get all pools',
        }),
      ]);
    }
  }

  /**
   * Gets pool statistics like TVL, volume, etc.
   * @param poolId The ID of the pool to get statistics for
   * @returns Pool statistics
   */
  public static async getPoolStats(poolId: string): Promise<string> {
    try {
      const sdk = this.initSDK();
      const stats = await sdk.Pool.getPoolImmutables([poolId]);
      return JSON.stringify([
        {
          reasoning: 'Successfully retrieved pool statistics',
          response: stats,
          status: 'success',
          query: `Get stats for pool ${poolId}`,
          errors: [],
        },
      ]);
    } catch (error) {
      return JSON.stringify([
        handleError(error, {
          reasoning: 'Failed to retrieve pool statistics',
          query: `Attempted to get stats for pool ${poolId}`,
        }),
      ]);
    }
  }

  /**
   * Gets all positions in a pool
   * @param poolId The ID of the pool to get positions for
   * @returns List of positions in the pool
   */
  public static async getPoolPositions(poolId: string): Promise<string> {
    try {
      const sdk = this.initSDK();
      const pool = (await sdk.Pool.getPool(poolId)) as unknown as CetusPool;
      const positions = await sdk.Pool.getPositionList(
        pool.position_manager.positions_handle,
      );
      return JSON.stringify([
        {
          reasoning: 'Successfully retrieved pool positions',
          response: positions,
          status: 'success',
          query: `Get positions for pool ${poolId}`,
          errors: [],
        },
      ]);
    } catch (error) {
      return JSON.stringify([
        handleError(error, {
          reasoning: 'Failed to retrieve pool positions',
          query: `Attempted to get positions for pool ${poolId}`,
        }),
      ]);
    }
  }
}

export default PoolTool;
