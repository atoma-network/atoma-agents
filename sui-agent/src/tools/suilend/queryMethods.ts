import { handleError } from '../../utils';
import { suilendClientWrapper } from '.';

/**
 * Get lending market owner capability ID
 * @param ownerId - The ID of the owner
 * @param lendingMarketId - The ID of the lending market
 * @param lendingMarketType - The type of the lending market
 * @returns A JSON string containing the lending market owner capability ID
 */
export async function getLendingMarketOwnerCapIdWrapper(
  ownerId: string,
  lendingMarketId: string,
): Promise<string> {
  try {
    const client = await suilendClientWrapper();
    const ownerCapId = await client.getLendingMarketOwnerCapId(ownerId);
    return JSON.stringify([
      {
        reasoning: 'Successfully retrieved lending market owner capability ID',
        response: JSON.stringify(
          {
            ownerId: ownerId,
            ownerCapId: ownerCapId,
            lendingMarketId: lendingMarketId,
            status: 'success',
          },
          null,
          2,
        ),
        status: 'success',
        query: `Retrieved owner capability ID for ${ownerId}`,
        errors: [],
      },
    ]);
  } catch (error: unknown) {
    return JSON.stringify([
      handleError(error, {
        reasoning: 'Failed to retrieve lending market owner capability ID',
        query: `Attempted to get owner capability ID for ${ownerId}`,
      }),
    ]);
  }
}

/**
 * Get obligation details
 * @param obligationId - The ID of the obligation
 * @returns A JSON string containing the obligation details
 */
export async function getObligationWrapper(
  obligationId: string,
): Promise<string> {
  try {
    const client = await suilendClientWrapper();

    const obligation = await client.getObligation(obligationId);
    return JSON.stringify([
      {
        reasoning: 'Successfully retrieved obligation details',
        response: JSON.stringify(
          {
            obligationId: obligationId,
            obligationDetails: obligation,
            status: 'success',
          },
          null,
          2,
        ),
        status: 'success',
        query: `Retrieved obligation details for ${obligationId}`,
        errors: [],
      },
    ]);
  } catch (error: unknown) {
    return JSON.stringify([
      handleError(error, {
        reasoning: 'Failed to retrieve obligation details',
        query: `Attempted to get obligation details for ${obligationId}`,
      }),
    ]);
  }
}
