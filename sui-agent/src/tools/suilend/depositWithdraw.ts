import { Transaction } from '@mysten/sui/transactions';
import { handleError } from '../../utils';
import { suilendClientWrapper } from '.';

/**
 * Deposits funds into an obligation in a Suilend lending market and returns the result as a JSON string.
 *
 * @param lendingMarketId - The ID of the lending market
 * @param lendingMarketType - The type of lending market
 * @param ownerId - The ID of the owner
 * @param coinType - The type of coin
 * @param value - The amount of coin to deposit
 * @param obligationOwnerCapId - The ID of the obligation owner capability
 * @returns A JSON string containing the result of the deposit operation
 */
export async function depositIntoObligationWrapper(
  ownerId: string,
  coinType: string,
  value: string,
  obligationOwnerCapId: string,
): Promise<string> {
  try {
    const client = await suilendClientWrapper();
    const transaction = new Transaction();
    await client.depositIntoObligation(
      ownerId,
      coinType,
      value,
      transaction,
      obligationOwnerCapId,
    );
    return JSON.stringify([
      {
        reasoning: 'Successfully deposited into obligation',
        response: JSON.stringify(
          {
            transaction: transaction,
            ownerId: ownerId,
            coinType: coinType,
            value: value,
            status: 'success',
          },
          null,
          2,
        ),
        status: 'success',
        query: `Deposited ${value} of ${coinType} into obligation`,
        errors: [],
      },
    ]);
  } catch (error: unknown) {
    return JSON.stringify([
      handleError(error, {
        reasoning: 'Failed to deposit into obligation',
        query: `Attempted to deposit ${value} of ${coinType}`,
      }),
    ]);
  }
}

/**
 * Deposits liquidity into a Suilend lending market and returns the result as a JSON string.
 *
 * @param ownerId - The ID of the owner
 * @param coinType - The type of coin
 * @param value - The amount of coin to deposit
 * @returns A JSON string containing the result of the deposit operation
 */
export async function depositLiquidityAndGetCTokensWrapper(
  ownerId: string,
  coinType: string,
  value: string,
): Promise<string> {
  try {
    const client = await suilendClientWrapper();
    const transaction = new Transaction();
    await client.depositLiquidityAndGetCTokens(
      ownerId,
      coinType,
      value,
      transaction,
    );
    return JSON.stringify([
      {
        reasoning: 'Successfully deposited liquidity and received CTokens',
        response: JSON.stringify(
          {
            ownerId: ownerId,
            coinType: coinType,
            depositedValue: value,
            transaction: transaction,
            status: 'success',
          },
          null,
          2,
        ),
        status: 'success',
        query: `Deposited ${value} of ${coinType} for CTokens`,
        errors: [],
      },
    ]);
  } catch (error: unknown) {
    return JSON.stringify([
      handleError(error, {
        reasoning: 'Failed to deposit liquidity and get CTokens',
        query: `Attempted to deposit ${value} of ${coinType}`,
      }),
    ]);
  }
}

/**
 * Withdraws funds from an obligation in a Suilend lending market and returns the result as a JSON string.
 *
 * @param ownerId - The ID of the owner
 * @param obligationOwnerCapId - The ID of the obligation owner capability
 * @param obligationId - The ID of the obligation
 * @param coinType - The type of coin
 * @param value - The amount of coin to withdraw
 * @returns A JSON string containing the result of the withdrawal operation
 */
export async function withdrawAndSendToUserWrapper(
  ownerId: string,
  obligationOwnerCapId: string,
  obligationId: string,
  coinType: string,
  value: string,
): Promise<string> {
  try {
    const client = await suilendClientWrapper();
    const transaction = new Transaction();
    await client.withdrawAndSendToUser(
      ownerId,
      obligationOwnerCapId,
      obligationId,
      coinType,
      value,
      transaction,
    );
    return JSON.stringify([
      {
        reasoning: 'Successfully withdrew and sent funds to user',
        response: JSON.stringify(
          {
            ownerId: ownerId,
            coinType: coinType,
            withdrawnValue: value,
            transaction: transaction,
            status: 'success',
          },
          null,
          2,
        ),
        status: 'success',
        query: `Withdrew ${value} of ${coinType} to ${ownerId}`,
        errors: [],
      },
    ]);
  } catch (error: unknown) {
    return JSON.stringify([
      handleError(error, {
        reasoning: 'Failed to withdraw and send to user',
        query: `Attempted to withdraw ${value} of ${coinType}`,
      }),
    ]);
  }
}

/**
 * Redeems CTokens and withdraws liquidity from a Suilend lending market and returns the result as a JSON string.
 *
 * @param ownerId - The ID of the owner
 * @param ctokenCoinTypes - The types of CTokens to redeem
 * @returns A JSON string containing the result of the redemption operation
 */
export async function redeemCtokensAndWithdrawLiquidityWrapper(
  ownerId: string,
  ctokenCoinTypes: string[],
): Promise<string> {
  try {
    const client = await suilendClientWrapper();
    const transaction = new Transaction();
    await client.redeemCtokensAndWithdrawLiquidity(
      ownerId,
      ctokenCoinTypes,
      transaction,
    );
    return JSON.stringify([
      {
        reasoning: 'Successfully redeemed CTokens and withdrew liquidity',
        response: JSON.stringify(
          {
            ownerId: ownerId,
            ctokenCoinTypes: ctokenCoinTypes,
            transaction: transaction,
            status: 'success',
          },
          null,
          2,
        ),
        status: 'success',
        query: `Redeemed CTokens for types: ${ctokenCoinTypes.join(', ')}`,
        errors: [],
      },
    ]);
  } catch (error: unknown) {
    return JSON.stringify([
      handleError(error, {
        reasoning: 'Failed to redeem CTokens and withdraw liquidity',
        query: `Attempted to redeem CTokens for types: ${ctokenCoinTypes.join(', ')}`,
      }),
    ]);
  }
}
