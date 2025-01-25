import { Transaction } from '@mysten/sui/transactions';
import { handleError } from '../../utils';
import { suilendClientWrapper } from '.';

/**
 * Borrow and send funds to user
 * @param ownerId - The owner ID
 * @param obligationOwnerCapId - The obligation owner cap ID
 * @param obligationId - The obligation ID
 * @param coinType - The coin type
 * @param value - The value
 * @returns A JSON string containing the result of the borrow and send to user operation
 */
export async function borrowAndSendToUserWrapper(
  ownerId: string,
  obligationOwnerCapId: string,
  obligationId: string,
  coinType: string,
  value: string,
): Promise<string> {
  try {
    const client = await suilendClientWrapper();
    const transaction = new Transaction();
    await client.borrowAndSendToUser(
      ownerId,
      obligationOwnerCapId,
      obligationId,
      coinType,
      value,
      transaction,
    );
    return JSON.stringify([
      {
        reasoning: 'Successfully borrowed and sent funds to user',
        response: JSON.stringify(
          {
            ownerId: ownerId,
            obligationId: obligationId,
            coinType: coinType,
            borrowedAmount: value,
            status: 'success',
          },
          null,
          2,
        ),
        status: 'success',
        query: `Borrowed ${value} of ${coinType} for ${ownerId}`,
        errors: [],
      },
    ]);
  } catch (error: unknown) {
    return JSON.stringify([
      handleError(error, {
        reasoning: 'Failed to borrow and send funds to user',
        query: `Attempted to borrow ${value} of ${coinType}`,
      }),
    ]);
  }
}

/**
 * Repay into obligation
 * @param ownerId - The owner ID
 * @param obligationId - The obligation ID
 * @param coinType - The coin type
 * @param value - The value
 * @returns A JSON string containing the result of the repay into obligation operation
 */
export async function repayIntoObligationWrapper(
  ownerId: string,
  obligationId: string,
  coinType: string,
  value: string,
): Promise<string> {
  try {
    const client = await suilendClientWrapper();
    const transaction = new Transaction();
    await client.repayIntoObligation(
      ownerId,
      obligationId,
      coinType,
      value,
      transaction,
    );
    return JSON.stringify([
      {
        reasoning: 'Successfully repaid into obligation',
        response: JSON.stringify(
          {
            ownerId: ownerId,
            obligationId: obligationId,
            coinType: coinType,
            repaidAmount: value,
            status: 'success',
          },
          null,
          2,
        ),
        status: 'success',
        query: `Repaid ${value} of ${coinType} into obligation`,
        errors: [],
      },
    ]);
  } catch (error: unknown) {
    return JSON.stringify([
      handleError(error, {
        reasoning: 'Failed to repay into obligation',
        query: `Attempted to repay ${value} of ${coinType}`,
      }),
    ]);
  }
}
