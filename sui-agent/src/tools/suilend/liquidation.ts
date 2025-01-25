import { Transaction } from '@mysten/sui/transactions';
import { handleError } from '../../utils';
import { suilendClientWrapper } from '.';

/**
 * Liquidate and redeem
 * @param obligation - The obligation ID
 * @param repayCoinType - The type of coin to repay
 * @param withdrawCoinType - The type of coin to withdraw
 * @param repayCoinId - The ID of the coin to repay
 * @returns A JSON string containing the result of the liquidation and redemption operation
 */
export async function liquidateAndRedeemWrapper(
  obligation: string,
  repayCoinType: string,
  withdrawCoinType: string,
  repayCoinId: string,
): Promise<string> {
  try {
    const client = await suilendClientWrapper();
    const transaction = new Transaction();
    // Fetch obligation details first to include in response
    const obligationDetails = await client.getObligation(obligation);
    // Perform liquidation
    await client.liquidateAndRedeem(
      transaction,
      obligation,
      repayCoinType,
      withdrawCoinType,
      repayCoinId,
    );

    return JSON.stringify([
      {
        reasoning: 'Successfully performed liquidation',
        response: JSON.stringify(
          {
            transaction: transaction,
            liquidationDetails: {
              transaction: transaction,
              obligation: obligation,
              repaidCoinType: repayCoinType,
              withdrawnCoinType: withdrawCoinType,
              repayCoinId: repayCoinId,
              obligationDetails: obligationDetails, // Include original obligation state
            },
            status: 'success',
          },
          null,
          2,
        ),
        status: 'success',
        query: `Liquidated obligation ${obligation} repaying with ${repayCoinType} and withdrawing ${withdrawCoinType}`,
        errors: [],
      },
    ]);
  } catch (error: unknown) {
    return JSON.stringify([
      handleError(error, {
        reasoning: 'Failed to perform liquidation',
        query: `Attempted to liquidate obligation ${obligation}`,
      }),
    ]);
  }
}
