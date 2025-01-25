import { Transaction } from '@mysten/sui/transactions';
import { suilendClientWrapper } from '.';
import { ClaimRewardsReward, SuilendClient } from '@suilend/sdk/client';
import { handleError } from '../../utils';

/**
 * Add a reward
 * @param ownerId - The owner ID
 * @param lendingMarketOwnerCapId - The lending market owner cap ID
 * @param reserveArrayIndex - The reserve array index
 * @param isDepositReward - Whether the reward is a deposit reward
 * @param rewardCoinType - The reward coin type
 * @param rewardValue - The reward value
 * @param startTimeMs - The start time in milliseconds
 * @param endTimeMs - The end time in milliseconds
 * @returns A JSON string containing the result of the add reward operation
 */
export async function addRewardWrapper(
  ownerId: string,
  lendingMarketOwnerCapId: string,
  reserveArrayIndex: number,
  isDepositReward: boolean,
  rewardCoinType: string,
  rewardValue: string,
  startTimeMs: string,
  endTimeMs: string,
): Promise<string> {
  try {
    const client = await suilendClientWrapper();
    const transaction = new Transaction();
    await client.addReward(
      ownerId,
      lendingMarketOwnerCapId,
      BigInt(reserveArrayIndex),
      isDepositReward,
      rewardCoinType,
      rewardValue,
      BigInt(startTimeMs),
      BigInt(endTimeMs),
      transaction,
    );

    return JSON.stringify([
      {
        reasoning: 'Successfully added reward',
        response: JSON.stringify(
          {
            transaction: transaction,
            rewardDetails: {
              reserveIndex: reserveArrayIndex,
              rewardType: isDepositReward ? 'deposit' : 'borrow',
              coinType: rewardCoinType,
              value: rewardValue,
              duration: `${startTimeMs} to ${endTimeMs}`,
            },
            status: 'success',
          },
          null,
          2,
        ),
        status: 'success',
        query: `Added ${rewardValue} ${rewardCoinType} reward`,
        errors: [],
      },
    ]);
  } catch (error: unknown) {
    return JSON.stringify([
      handleError(error, {
        reasoning: 'Failed to add reward',
        query: `Attempted to add ${rewardValue} ${rewardCoinType} reward`,
      }),
    ]);
  }
}

/**
 * Cancel a reward
 * @param lendingMarketOwnerCapId - The lending market owner cap ID
 * @param reserveArrayIndex - The reserve array index
 * @param isDepositReward - Whether the reward is a deposit reward
 * @param rewardIndex - The reward index
 * @param rewardCoinType - The reward coin type
 * @returns A JSON string containing the result of the cancel reward operation
 */
export async function cancelRewardWrapper(
  lendingMarketOwnerCapId: string,
  reserveArrayIndex: number,
  isDepositReward: boolean,
  rewardIndex: number,
  rewardCoinType: string,
): Promise<string> {
  try {
    const client = await suilendClientWrapper();
    const transaction = new Transaction();
    await client.cancelReward(
      lendingMarketOwnerCapId,
      BigInt(reserveArrayIndex),
      isDepositReward,
      BigInt(rewardIndex),
      rewardCoinType,
      transaction,
    );

    return JSON.stringify([
      {
        reasoning: 'Successfully cancelled reward',
        response: JSON.stringify(
          {
            transaction: transaction,
            cancelledReward: {
              reserveIndex: reserveArrayIndex,
              rewardIndex: rewardIndex,
              rewardType: isDepositReward ? 'deposit' : 'borrow',
              coinType: rewardCoinType,
            },
            status: 'success',
          },
          null,
          2,
        ),
        status: 'success',
        query: `Cancelled reward at index ${rewardIndex}`,
        errors: [],
      },
    ]);
  } catch (error: unknown) {
    return JSON.stringify([
      handleError(error, {
        reasoning: 'Failed to cancel reward',
        query: `Attempted to cancel reward at index ${rewardIndex}`,
      }),
    ]);
  }
}

/**
 * Close a reward
 * @param lendingMarketOwnerCapId - The lending market owner cap ID
 * @param reserveArrayIndex - The reserve array index
 * @param isDepositReward - Whether the reward is a deposit reward
 * @param rewardIndex - The reward index
 * @param rewardCoinType - The reward coin type
 * @returns A JSON string containing the result of the close reward operation
 */
export async function closeRewardWrapper(
  lendingMarketOwnerCapId: string,
  reserveArrayIndex: number,
  isDepositReward: boolean,
  rewardIndex: number,
  rewardCoinType: string,
): Promise<string> {
  try {
    const client = await suilendClientWrapper();
    const transaction = new Transaction();

    await client.closeReward(
      lendingMarketOwnerCapId,
      BigInt(reserveArrayIndex),
      isDepositReward,
      BigInt(rewardIndex),
      rewardCoinType,
      transaction,
    );

    return JSON.stringify([
      {
        reasoning: 'Successfully closed reward',
        response: JSON.stringify(
          {
            transaction: transaction,
            closedReward: {
              reserveIndex: reserveArrayIndex,
              rewardIndex: rewardIndex,
              rewardType: isDepositReward ? 'deposit' : 'borrow',
              coinType: rewardCoinType,
            },
            status: 'success',
          },
          null,
          2,
        ),
        status: 'success',
        query: `Closed reward at index ${rewardIndex}`,
        errors: [],
      },
    ]);
  } catch (error: unknown) {
    return JSON.stringify([
      handleError(error, {
        reasoning: 'Failed to close reward',
        query: `Attempted to close reward at index ${rewardIndex}`,
      }),
    ]);
  }
}

/**
 * Claim rewards and send to user
 * @param ownerId - The owner ID
 * @param obligationOwnerCapId - The obligation owner cap ID
 * @param rewards - The rewards
 * @returns A JSON string containing the result of the claim rewards and send to user operation
 */
export async function claimRewardsAndSendToUserWrapper(
  ownerId: string,
  obligationOwnerCapId: string,
  rewards: ClaimRewardsReward[],
): Promise<string> {
  try {
    const client = await suilendClientWrapper();
    const transaction = new Transaction();

    await client.claimRewardsAndSendToUser(
      ownerId,
      obligationOwnerCapId,
      rewards,
      transaction,
    );

    return JSON.stringify([
      {
        reasoning: 'Successfully claimed and sent rewards',
        response: JSON.stringify(
          {
            transaction: transaction,
            claimedRewards: rewards,
            recipient: ownerId,
            status: 'success',
          },
          null,
          2,
        ),
        status: 'success',
        query: `Claimed rewards for ${ownerId}`,
        errors: [],
      },
    ]);
  } catch (error: unknown) {
    return JSON.stringify([
      handleError(error, {
        reasoning: 'Failed to claim and send rewards',
        query: `Attempted to claim rewards for ${ownerId}`,
      }),
    ]);
  }
}

/**
 * Claim rewards and deposit
 * @param ownerId - The owner ID
 * @param obligationOwnerCapId - The obligation owner cap ID
 * @param rewards - The rewards
 * @returns A JSON string containing the result of the claim rewards and deposit operation
 */
export async function claimRewardsAndDepositWrapper(
  ownerId: string,
  obligationOwnerCapId: string,
  rewards: ClaimRewardsReward[],
): Promise<string> {
  try {
    const client = await suilendClientWrapper();
    const transaction = new Transaction();

    await client.claimRewardsAndDeposit(
      ownerId,
      obligationOwnerCapId,
      rewards,
      transaction,
    );

    return JSON.stringify([
      {
        reasoning: 'Successfully claimed and deposited rewards',
        response: JSON.stringify(
          {
            transaction: transaction,
            claimedRewards: rewards,
            depositor: ownerId,
            status: 'success',
          },
          null,
          2,
        ),
        status: 'success',
        query: `Claimed and deposited rewards for ${ownerId}`,
        errors: [],
      },
    ]);
  } catch (error: unknown) {
    return JSON.stringify([
      handleError(error, {
        reasoning: 'Failed to claim and deposit rewards',
        query: `Attempted to claim and deposit rewards for ${ownerId}`,
      }),
    ]);
  }
}
