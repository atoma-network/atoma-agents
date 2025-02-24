import CetusClmmSDK, {
  adjustForSlippage,
  initCetusSDK,
  d,
  TickMath,
  ClmmPoolUtil,
  Percentage,
} from '@cetusprotocol/cetus-sui-clmm-sdk';
import BN from 'bn.js';
import Tools from '../../utils/tools';
import { handleError } from '../../utils';

class CetusTools {
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

  public static registerTools(tools: Tools) {
    // Pool Tools
    tools.registerTool(
      'get_cetus_pool',
      'Get details about a specific Cetus pool',
      [
        {
          name: 'pool_id',
          type: 'string',
          description: 'The object ID of the pool',
          required: true,
        },
      ],
      async (...args) => this.getPool(args[0] as string),
    );

    // Position Tools
    tools.registerTool(
      'get_cetus_positions',
      'Get all positions for an address',
      [
        {
          name: 'address',
          type: 'string',
          description: 'The address to get positions for',
          required: true,
        },
        {
          name: 'pool_id',
          type: 'string',
          description: 'Optional pool ID to filter positions',
          required: false,
        },
      ],
      async (...args) =>
        this.getPositions(args[0] as string, args[1] as string),
    );

    // Add Liquidity Tool
    tools.registerTool(
      'add_cetus_liquidity',
      'Add liquidity to a Cetus pool',
      [
        {
          name: 'pool_id',
          type: 'string',
          description: 'Pool ID to add liquidity to',
          required: true,
        },
        {
          name: 'amount',
          type: 'string',
          description: 'Amount to add as liquidity',
          required: true,
        },
        {
          name: 'slippage',
          type: 'number',
          description: 'Slippage tolerance (e.g. 0.01 for 1%)',
          required: true,
        },
      ],
      async (...args) =>
        this.addLiquidity(
          args[0] as string,
          args[1] as string,
          args[2] as number,
        ),
    );

    // Swap Tool
    tools.registerTool(
      'cetus_swap',
      'Perform a swap on Cetus',
      [
        {
          name: 'pool_id',
          type: 'string',
          description: 'Pool ID to swap on',
          required: true,
        },
        {
          name: 'amount_in',
          type: 'string',
          description: 'Amount to swap',
          required: true,
        },
        {
          name: 'slippage',
          type: 'number',
          description: 'Slippage tolerance (e.g. 0.01 for 1%)',
          required: true,
        },
      ],
      async (...args) =>
        this.swap(args[0] as string, args[1] as string, args[2] as number),
    );

    // Create Pool Tool
    tools.registerTool(
      'create_cetus_pool',
      'Create a new Cetus pool',
      [
        {
          name: 'coin_type_a',
          type: 'string',
          description: 'Type of first coin in pool',
          required: true,
        },
        {
          name: 'coin_type_b',
          type: 'string',
          description: 'Type of second coin in pool',
          required: true,
        },
        {
          name: 'tick_spacing',
          type: 'number',
          description: 'Tick spacing for the pool (affects fee rate)',
          required: true,
        },
        {
          name: 'initial_price',
          type: 'string',
          description: 'Initial price for the pool',
          required: true,
        },
      ],
      async (...args) =>
        this.createPool(
          args[0] as string,
          args[1] as string,
          args[2] as number,
          args[3] as string,
        ),
    );

    // Remove Liquidity Tool
    tools.registerTool(
      'remove_cetus_liquidity',
      'Remove liquidity from a Cetus position',
      [
        {
          name: 'position_id',
          type: 'string',
          description: 'Position ID to remove liquidity from',
          required: true,
        },
        {
          name: 'liquidity_amount',
          type: 'string',
          description: 'Amount of liquidity to remove',
          required: true,
        },
        {
          name: 'slippage',
          type: 'number',
          description: 'Slippage tolerance (e.g. 0.01 for 1%)',
          required: true,
        },
      ],
      async (...args) =>
        this.removeLiquidity(
          args[0] as string,
          args[1] as string,
          args[2] as number,
        ),
    );
  }

  private static async getPool(poolId: string) {
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

  private static async getPositions(address: string, poolId?: string) {
    try {
      const sdk = this.initSDK();
      const positions = await sdk.Position.getPositionList(
        address,
        poolId ? [poolId] : undefined,
      );
      return JSON.stringify([
        {
          reasoning: 'Successfully retrieved positions',
          response: positions,
          status: 'success',
          query: `Get positions for address ${address}`,
          errors: [],
        },
      ]);
    } catch (error) {
      return JSON.stringify([
        handleError(error, {
          reasoning: 'Failed to retrieve positions',
          query: `Attempted to get positions for address ${address}`,
        }),
      ]);
    }
  }

  private static async addLiquidity(
    poolId: string,
    amount: string,
    slippage: number,
  ) {
    try {
      const sdk = this.initSDK();
      const pool = await sdk.Pool.getPool(poolId);

      // Calculate tick range around current price
      const currentTick = TickMath.sqrtPriceX64ToTickIndex(
        new BN(pool.current_sqrt_price),
      );
      const tickSpacing = Number(pool.tickSpacing);
      const tickLower = TickMath.getPrevInitializableTickIndex(
        currentTick,
        tickSpacing,
      );
      const tickUpper = TickMath.getNextInitializableTickIndex(
        currentTick,
        tickSpacing,
      );

      // Calculate liquidity amounts
      const liquidityInput =
        ClmmPoolUtil.estLiquidityAndcoinAmountFromOneAmounts(
          tickLower,
          tickUpper,
          new BN(amount),
          true, // fix amount A
          true,
          slippage,
          new BN(pool.current_sqrt_price),
        );

      const payload = await sdk.Position.createAddLiquidityFixTokenPayload({
        coinTypeA: pool.coinTypeA,
        coinTypeB: pool.coinTypeB,
        pool_id: poolId,
        amount_a: liquidityInput.tokenMaxA.toString(),
        amount_b: liquidityInput.tokenMaxB.toString(),
        tick_lower: tickLower.toString(),
        tick_upper: tickUpper.toString(),
        is_open: true,
        slippage,
        fix_amount_a: true,
        rewarder_coin_types: [],
        collect_fee: false,
        pos_id: '',
      });

      return JSON.stringify([
        {
          reasoning: 'Successfully created add liquidity transaction',
          response: payload,
          status: 'success',
          query: `Add liquidity to pool ${poolId}`,
          errors: [],
        },
      ]);
    } catch (error) {
      return JSON.stringify([
        handleError(error, {
          reasoning: 'Failed to create add liquidity transaction',
          query: `Attempted to add liquidity to pool ${poolId}`,
        }),
      ]);
    }
  }

  private static async swap(
    poolId: string,
    amountIn: string,
    slippage: number,
  ) {
    try {
      const sdk = this.initSDK();
      const pool = await sdk.Pool.getPool(poolId);

      // Pre-swap calculation
      const preSwap = await sdk.Swap.preswap({
        pool,
        currentSqrtPrice: pool.current_sqrt_price,
        coinTypeA: pool.coinTypeA,
        coinTypeB: pool.coinTypeB,
        decimalsA: 9, // Should get from coin metadata
        decimalsB: 9,
        a2b: true,
        byAmountIn: true,
        amount: amountIn,
      });

      const toAmount = preSwap?.byAmountIn
        ? preSwap.estimatedAmountOut
        : preSwap?.estimatedAmountIn;
      const amountLimit = adjustForSlippage(
        toAmount,
        new Percentage(new BN(slippage * 100), new BN(100)),
        !preSwap?.byAmountIn,
      );

      const payload = await sdk.Swap.createSwapTransactionPayload({
        pool_id: poolId,
        coinTypeA: pool.coinTypeA,
        coinTypeB: pool.coinTypeB,
        a2b: true,
        by_amount_in: true,
        amount: amountIn,
        amount_limit: amountLimit.toString(),
      });

      return JSON.stringify([
        {
          reasoning: 'Successfully created swap transaction',
          response: payload,
          status: 'success',
          query: `Swap on pool ${poolId}`,
          errors: [],
        },
      ]);
    } catch (error) {
      return JSON.stringify([
        handleError(error, {
          reasoning: 'Failed to create swap transaction',
          query: `Attempted to swap on pool ${poolId}`,
        }),
      ]);
    }
  }

  private static async createPool(
    coinTypeA: string,
    coinTypeB: string,
    tickSpacing: number,
    initialPrice: string,
  ) {
    try {
      const sdk = this.initSDK();
      const initSqrtPrice = TickMath.priceToSqrtPriceX64(
        d(initialPrice),
        6,
        6,
      ).toString();

      const payload = await sdk.Pool.createPoolTransactionPayload({
        coinTypeA,
        coinTypeB,
        tick_spacing: tickSpacing,
        initialize_sqrt_price: initSqrtPrice,
        uri: '',
        amount_a: '0',
        amount_b: '0',
        fix_amount_a: true,
        tick_lower: 0,
        tick_upper: 0,
        metadata_a: '',
        metadata_b: '',
        slippage: 0,
      });

      return JSON.stringify([
        {
          reasoning: 'Successfully created pool creation transaction',
          response: payload,
          status: 'success',
          query: `Create pool for ${coinTypeA}/${coinTypeB}`,
          errors: [],
        },
      ]);
    } catch (error) {
      return JSON.stringify([
        handleError(error, {
          reasoning: 'Failed to create pool creation transaction',
          query: `Attempted to create pool for ${coinTypeA}/${coinTypeB}`,
        }),
      ]);
    }
  }

  private static async removeLiquidity(
    positionId: string,
    liquidityAmount: string,
    slippage: number,
  ) {
    try {
      const sdk = this.initSDK();
      const position = await sdk.Position.getPositionById(positionId);
      const pool = await sdk.Pool.getPool(position.pool);

      const lowerSqrtPrice = TickMath.tickIndexToSqrtPriceX64(
        position.tick_lower_index,
      );
      const upperSqrtPrice = TickMath.tickIndexToSqrtPriceX64(
        position.tick_upper_index,
      );
      const curSqrtPrice = new BN(pool.current_sqrt_price);

      // Get token amounts from liquidity
      const coinAmounts = ClmmPoolUtil.getCoinAmountFromLiquidity(
        new BN(liquidityAmount),
        curSqrtPrice,
        lowerSqrtPrice,
        upperSqrtPrice,
        false,
      );

      // Adjust for slippage
      const slippageTolerance = new Percentage(
        new BN(slippage * 100),
        new BN(100),
      );
      const minAmountA = adjustForSlippage(
        coinAmounts.coinA,
        slippageTolerance,
        false,
      );
      const minAmountB = adjustForSlippage(
        coinAmounts.coinB,
        slippageTolerance,
        false,
      );

      const payload = await sdk.Position.removeLiquidityTransactionPayload({
        coinTypeA: pool.coinTypeA,
        coinTypeB: pool.coinTypeB,
        delta_liquidity: liquidityAmount,
        min_amount_a: minAmountA.toString(),
        min_amount_b: minAmountB.toString(),
        pool_id: pool.poolAddress,
        pos_id: positionId,
        collect_fee: true,
        rewarder_coin_types: [],
      });

      return JSON.stringify([
        {
          reasoning: 'Successfully created remove liquidity transaction',
          response: payload,
          status: 'success',
          query: `Remove liquidity from position ${positionId}`,
          errors: [],
        },
      ]);
    } catch (error) {
      return JSON.stringify([
        handleError(error, {
          reasoning: 'Failed to create remove liquidity transaction',
          query: `Attempted to remove liquidity from position ${positionId}`,
        }),
      ]);
    }
  }
}

export default CetusTools;
