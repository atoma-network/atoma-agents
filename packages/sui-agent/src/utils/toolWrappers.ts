import { TokenBalance } from '../@types/interface';
import PoolTool from '../protocols/aftermath/PoolTool';
import StakingTool from '../protocols/aftermath/staking';
import { RankingMetric } from '../protocols/aftermath/types';
import {
  buildMultiPoolDepositTx,
  buildMultiPoolWithdrawTx,
} from '../protocols/aftermath/PoolTransactionTool';
import {
  initSuiClient,
  buildTransferTx,
  buildMultiTransferTx,
  createMergeCoinsTx,
  estimateGas,
} from '../transactions/Transaction';
import { Transaction } from '@mysten/sui/transactions';
import { StakeParams } from '../protocols/aftermath/types';

// Transaction wrapper functions
export async function transferCoinWrapper(
  ...args: (string | number | bigint | boolean)[]
): Promise<string> {
  const [fromAddress, toAddress, tokenType, amount] = args as [
    string,
    string,
    string,
    string,
  ];
  const client = initSuiClient();
  const tx = await buildTransferTx(
    client,
    fromAddress,
    toAddress,
    tokenType,
    BigInt(amount),
  );
  return JSON.stringify([
    {
      reasoning: 'Transfer transaction created successfully',
      response: tx.serialize(),
      status: 'success',
      query: `Transfer ${amount} of ${tokenType} from ${fromAddress} to ${toAddress}`,
      errors: [],
    },
  ]);
}

export async function multiTransferWrapper(
  ...args: (string | number | bigint | boolean)[]
): Promise<string> {
  const [fromAddress, toAddress, transfers] = args as [
    string,
    string,
    TokenBalance[],
  ];
  const client = initSuiClient();
  const tx = await buildMultiTransferTx(
    client,
    fromAddress,
    toAddress,
    transfers,
  );
  return JSON.stringify([
    {
      reasoning: 'Multi-transfer transaction created successfully',
      response: tx.serialize(),
      status: 'success',
      query: `Multi-transfer from ${fromAddress} to ${toAddress}`,
      errors: [],
    },
  ]);
}

export async function mergeCoinsWrapper(
  ...args: (string | number | bigint | boolean)[]
): Promise<string> {
  const [coinType, walletAddress, maxCoins] = args as [
    string,
    string,
    number | undefined,
  ];
  const client = initSuiClient();
  const tx = await createMergeCoinsTx(
    client,
    coinType,
    walletAddress,
    maxCoins,
  );
  return JSON.stringify([
    {
      reasoning: 'Merge coins transaction created successfully',
      response: tx.serialize(),
      status: 'success',
      query: `Merge ${
        maxCoins || 'all'
      } coins of type ${coinType} for wallet ${walletAddress}`,
      errors: [],
    },
  ]);
}

export async function estimateGasWrapper(
  ...args: (string | number | bigint | boolean | Transaction)[]
): Promise<string> {
  const [transaction] = args as [Transaction];
  const client = initSuiClient();
  const gasEstimate = await estimateGas(client, transaction);
  return JSON.stringify([
    {
      reasoning: 'Gas estimation completed successfully',
      response: gasEstimate.toString(),
      status: 'success',
      query: 'Estimate gas for transaction',
      errors: [],
    },
  ]);
}

// Pool transaction wrapper functions
export async function depositTopPoolsWrapper(
  ...args: (string | number | bigint | boolean)[]
): Promise<string> {
  const [walletAddress, metric, amount, numPools, slippage] = args as [
    string,
    RankingMetric,
    string,
    string,
    string,
  ];
  // First get the top pools
  const rankedPoolsResponse = await PoolTool.getRankedPools(
    metric,
    parseInt(numPools),
  );
  const rankedPools = JSON.parse(rankedPoolsResponse)[0].response;

  // Create deposit transactions for each pool
  const client = initSuiClient();
  const poolDeposits = rankedPools.map((pool: { id: string }) => ({
    poolId: pool.id,
    amount: BigInt(amount),
  }));

  const tx = await buildMultiPoolDepositTx(
    client,
    walletAddress,
    poolDeposits,
    parseFloat(slippage),
  );

  return JSON.stringify([
    {
      reasoning: 'Successfully created deposit transactions',
      response: {
        transaction: tx.serialize(),
        pools: rankedPools,
      },
      status: 'success',
      query: `Created deposit transactions for ${amount} into ${numPools} pools`,
      errors: [],
    },
  ]);
}

export async function withdrawPoolsWrapper(
  ...args: (string | number | bigint | boolean)[]
): Promise<string> {
  const [walletAddress, poolId, lpAmount, slippage] = args as [
    string,
    string,
    string,
    string,
  ];
  const client = initSuiClient();
  const tx = await buildMultiPoolWithdrawTx(
    client,
    walletAddress,
    [{ poolId, lpAmount: BigInt(lpAmount) }],
    parseFloat(slippage),
  );

  return JSON.stringify([
    {
      reasoning: 'Successfully created withdrawal transaction',
      response: {
        transaction: tx.serialize(),
      },
      status: 'success',
      query: `Created withdrawal transaction for ${lpAmount} LP tokens from pool ${poolId}`,
      errors: [],
    },
  ]);
}

// Staking wrapper functions
export async function getStakingPositionsWrapper(
  ...args: (string | number | bigint | boolean)[]
): Promise<string> {
  const [walletAddress] = args as [string];
  return StakingTool.getStakingPositions(walletAddress);
}

export async function getSuiTvlWrapper(): Promise<string> {
  return StakingTool.getSuiTvl();
}

export async function getAfSuiExchangeRateWrapper(): Promise<string> {
  return StakingTool.getAfSuiExchangeRate();
}

export async function getStakeTransactionWrapper(
  ...args: (string | number | bigint | boolean)[]
): Promise<string> {
  const [walletAddress, suiAmount, validatorAddress] = args as [
    string,
    string,
    string,
  ];
  const params: StakeParams = {
    walletAddress,
    suiAmount: BigInt(suiAmount),
    validatorAddress,
  };
  return StakingTool.getStakeTransaction(params);
}
