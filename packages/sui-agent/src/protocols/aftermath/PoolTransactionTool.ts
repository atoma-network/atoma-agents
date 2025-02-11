import { Aftermath } from 'aftermath-ts-sdk';
import { Transaction } from '@mysten/sui/transactions';
import { SuiClient } from '@mysten/sui/client';
import { handleError } from '../../utils';
import { initSuiClient } from '../../transactions/Transaction';
import PoolTool from './PoolTool';
import { AftermathTransaction, RankingMetric, RankedPool } from './types';

// Initialize Aftermath SDK for mainnet
const af = new Aftermath('MAINNET');
const pools = af.Pools();

/**
 * Converts an Aftermath transaction to our internal format.
 * @param tx - Raw transaction from Aftermath SDK.
 * @returns Properly typed transaction data.
 */
function convertAftermathTransaction(tx: unknown): AftermathTransaction {
  const rawTx = tx as {
    target: string;
    arguments: (string | number | boolean | bigint)[];
    typeArguments: string[];
  };

  // Validate the target format
  if (
    !rawTx.target ||
    !rawTx.target.match(/^0x[a-fA-F0-9]+::[a-zA-Z_]+::[a-zA-Z_]+$/)
  ) {
    throw new Error(`Invalid transaction target format: ${rawTx.target}`);
  }

  return {
    target: rawTx.target as `${string}::${string}::${string}`,
    arguments: rawTx.arguments,
    typeArguments: rawTx.typeArguments,
  };
}

/**
 * Builds a transaction for depositing into multiple pools.
 * @param client - Initialized SuiClient.
 * @param walletAddress - Address of the depositing wallet.
 * @param poolDeposits - Array of { poolId, amount } to deposit.
 * @param slippage - Maximum allowed slippage percentage (0.01 = 1%).
 * @returns Transaction ready for signing.
 */
export async function buildMultiPoolDepositTx(
  client: SuiClient,
  walletAddress: string,
  poolDeposits: Array<{ poolId: string; amount: bigint }>,
  slippage = 0.01,
): Promise<Transaction> {
  const tx = new Transaction();
  tx.setGasBudget(2000000 * poolDeposits.length); // Scale gas budget with number of deposits

  for (const deposit of poolDeposits) {
    const pool = await pools.getPool({ objectId: deposit.poolId });
    if (!pool) {
      throw new Error(`Pool not found: ${deposit.poolId}`);
    }

    // For each pool, create a deposit with the specified amount.
    // We assume the pool accepts SUI. Adjust if needed.
    const amountsIn: { [key: string]: bigint } = {};
    const suiToken = Object.keys(pool.pool.coins).find((token) =>
      token.toLowerCase().includes('sui::sui::sui'),
    );
    if (!suiToken) {
      throw new Error(`Pool ${deposit.poolId} does not accept SUI`);
    }
    amountsIn[suiToken] = deposit.amount;

    // Get deposit transaction data and convert to proper format.
    const rawDepositTx = await pool.getDepositTransaction({
      walletAddress,
      amountsIn,
      slippage,
    });
    const depositTx = convertAftermathTransaction(rawDepositTx);

    // Add deposit transaction to the batch.
    tx.moveCall({
      target: depositTx.target,
      arguments: depositTx.arguments.map((arg) =>
        typeof arg === 'string' && arg.startsWith('0x')
          ? tx.object(arg)
          : tx.pure.address(arg as string),
      ),
      typeArguments: depositTx.typeArguments,
    });
  }

  return tx;
}

/**
 * Builds a transaction for depositing into top ranked pools.
 * @param walletAddress - Address of the depositing wallet.
 * @param metric - Metric to rank pools by (apr, tvl, fees, volume).
 * @param amount - Amount of SUI to deposit into each pool.
 * @param numPools - Number of top pools to deposit into.
 * @param slippage - Maximum allowed slippage percentage.
 * @returns JSON string containing transaction data.
 */
export async function depositIntoTopPools(
  walletAddress: string,
  metric: RankingMetric,
  amount: bigint,
  numPools = 5,
  slippage = 0.01,
): Promise<string> {
  try {
    // Get top ranked pools.
    const rankedPoolsResponse = await PoolTool.getRankedPools(metric, numPools);
    const rankedPoolsData = JSON.parse(rankedPoolsResponse)[0];
    if (rankedPoolsData.status !== 'success') {
      throw new Error('Failed to fetch ranked pools');
    }

    const topPools = JSON.parse(rankedPoolsData.response).pools as RankedPool[];
    const poolDeposits = topPools.map((pool: RankedPool) => ({
      poolId: pool.id,
      amount,
    }));

    // Build multi-pool deposit transaction.
    const client = initSuiClient();
    const tx = await buildMultiPoolDepositTx(
      client,
      walletAddress,
      poolDeposits,
      slippage,
    );

    return JSON.stringify([
      {
        reasoning: `Successfully created deposit transaction for top ${numPools} pools by ${metric}`,
        response: JSON.stringify(
          {
            transaction: tx.serialize(),
            pools: topPools.map((pool: RankedPool) => ({
              id: pool.id,
              metrics: pool.metrics,
            })),
          },
          null,
          2,
        ),
        status: 'success',
        query: `Created deposit transaction for ${amount} SUI into top ${numPools} pools by ${metric}`,
        errors: [],
      },
    ]);
  } catch (error: unknown) {
    return JSON.stringify([
      handleError(error, {
        reasoning: 'Failed to create deposit transaction',
        query: `Attempted to deposit ${amount} SUI into top ${numPools} pools by ${metric}`,
      }),
    ]);
  }
}

/**
 * Builds a transaction for withdrawing from multiple pools.
 * @param client - Initialized SuiClient.
 * @param walletAddress - Address of the withdrawing wallet.
 * @param poolWithdraws - Array of { poolId, lpAmount } to withdraw.
 * @param slippage - Maximum allowed slippage percentage.
 * @returns Transaction ready for signing.
 */
export async function buildMultiPoolWithdrawTx(
  client: SuiClient,
  walletAddress: string,
  poolWithdraws: Array<{ poolId: string; lpAmount: bigint }>,
  slippage = 0.01,
): Promise<Transaction> {
  const tx = new Transaction();
  tx.setGasBudget(2000000 * poolWithdraws.length);

  for (const withdraw of poolWithdraws) {
    const pool = await pools.getPool({ objectId: withdraw.poolId });
    if (!pool) {
      throw new Error(`Pool not found: ${withdraw.poolId}`);
    }

    // For each pool, create a withdrawal with the specified LP amount.
    const rawWithdrawTx = await pool.getWithdrawTransaction({
      walletAddress,
      lpCoinAmount: withdraw.lpAmount,
      slippage,
      amountsOutDirection: {}, // Empty object for proportional withdrawal.
    });
    const withdrawTx = convertAftermathTransaction(rawWithdrawTx);

    // Add withdrawal transaction to the batch.
    tx.moveCall({
      target: withdrawTx.target,
      arguments: withdrawTx.arguments.map((arg) =>
        typeof arg === 'string' && arg.startsWith('0x')
          ? tx.object(arg)
          : tx.pure.address(arg as string),
      ),
      typeArguments: withdrawTx.typeArguments,
    });
  }

  return tx;
}

/**
 * Builds a transaction for trading tokens in a specific pool.
 * @param client - Initialized SuiClient.
 * @param walletAddress - Address of the trading wallet.
 * @param poolId - The pool identifier.
 * @param coinInType - The token type to trade in.
 * @param coinInAmount - The amount of coin in.
 * @param coinOutType - The token type to trade out.
 * @param slippage - Maximum allowed slippage percentage.
 * @returns Transaction ready for signing.
 */
export async function buildTradeTx(
  client: SuiClient,
  walletAddress: string,
  poolId: string,
  coinInType: string,
  coinInAmount: bigint,
  coinOutType: string,
  slippage = 0.01,
): Promise<Transaction> {
  const tx = new Transaction();
  tx.setGasBudget(2000000);

  const pool = await pools.getPool({ objectId: poolId });
  if (!pool) {
    throw new Error(`Pool not found: ${poolId}`);
  }

  const rawTradeTx = await pool.getTradeTransaction({
    walletAddress,
    coinInType,
    coinInAmount,
    coinOutType,
    slippage,
  });
  const tradeTx = convertAftermathTransaction(rawTradeTx);

  tx.moveCall({
    target: tradeTx.target,
    arguments: tradeTx.arguments.map((arg) =>
      typeof arg === 'string' && arg.startsWith('0x')
        ? tx.object(arg)
        : tx.pure.address(arg as string),
    ),
    typeArguments: tradeTx.typeArguments,
  });

  return tx;
}

/**
 * Builds a transaction for publishing a new LP coin.
 * @param client - Initialized SuiClient.
 * @param walletAddress - Address of the wallet.
 * @param lpCoinDecimals - Number of decimals for the LP coin.
 * @returns Transaction ready for signing.
 */
export async function buildPublishLpCoinTx(
  client: SuiClient,
  walletAddress: string,
  lpCoinDecimals = 9,
): Promise<Transaction> {
  const tx = new Transaction();
  tx.setGasBudget(1000000);

  const rawTx = await pools.getPublishLpCoinTransaction({
    walletAddress,
    lpCoinDecimals,
  });
  const publishTx = convertAftermathTransaction(rawTx);

  tx.moveCall({
    target: publishTx.target,
    arguments: publishTx.arguments.map((arg) =>
      typeof arg === 'string' && arg.startsWith('0x')
        ? tx.object(arg)
        : tx.pure.address(arg as string),
    ),
    typeArguments: publishTx.typeArguments,
  });

  return tx;
}

/**
 * Builds a transaction for withdrawing from a specific pool.
 * @param client - Initialized SuiClient.
 * @param walletAddress - Address of the withdrawing wallet.
 * @param poolId - The pool identifier.
 * @param coinInType - The token type to trade in.
 * @param coinInAmount - The amount of coin in.
 * @param coinOutType - The token type to trade out.
 * @param slippage - Maximum allowed slippage percentage.
 * @returns Transaction ready for signing.
 */
export async function buildWithdrawTx(
  client: SuiClient,
  walletAddress: string,
  poolId: string,
  coinInAmount: bigint,
  coinOutType: string,
  slippage = 0.01,
): Promise<Transaction> {
  const tx = new Transaction();
  tx.setGasBudget(2000000);
  const pool = await pools.getPool({ objectId: poolId });
  if (!pool) {
    throw new Error(`Pool not found: ${poolId}`);
  }

  const rawWithdrawTx = await pool.getWithdrawTransaction({
    walletAddress,
    lpCoinAmount: coinInAmount,
    slippage,
    amountsOutDirection: {},
  });
  const withdrawTx = convertAftermathTransaction(rawWithdrawTx);

  tx.moveCall({
    target: withdrawTx.target,
    arguments: withdrawTx.arguments.map((arg) =>
      typeof arg === 'string' && arg.startsWith('0x')
        ? tx.object(arg)
        : tx.pure.address(arg as string),
    ),
    typeArguments: withdrawTx.typeArguments,
  });

  return tx;
}
