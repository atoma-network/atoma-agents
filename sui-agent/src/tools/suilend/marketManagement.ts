import { Transaction } from '@mysten/sui/transactions';
import { SuilendClient } from '@suilend/sdk/client';
import { handleError } from '../../utils';
import { suilendClientWrapper } from '.';
import { CreateReserveConfigArgs } from '@suilend/sdk/_generated/suilend/reserve-config/functions';

/**
 * Creates a new lending market in the Suilend protocol and returns the result as a JSON string.
 *
 * @param registryId - The ID of the registry where the lending market will be created
 * @param lendingMarketType - The type of lending market to create
 * @returns A JSON string containing:
 *   - On success: An array with one object containing:
 *     - reasoning: Success message
 *     - response: JSON string with ownerCap and transaction details
 *     - status: 'success'
 *     - query: Description of the action performed
 *     - errors: Empty array
 *   - On failure: An array with one error object containing:
 *     - reasoning: Error message
 *     - query: Description of the attempted action
 *     - Additional error details from handleError
 */
export async function createLendingMarketWrapper(
  registryId: string,
  lendingMarketType: string,
): Promise<string> {
  try {
    const transaction = new Transaction();
    const ownerCap = SuilendClient.createNewLendingMarket(
      registryId,
      lendingMarketType,
      transaction,
    );

    return JSON.stringify([
      {
        reasoning: 'Successfully created new lending market',
        response: JSON.stringify(
          {
            ownerCap: ownerCap,
            transaction: transaction,
          },
          null,
          2,
        ),
        status: 'success',
        query: `Created lending market with registry ID: ${registryId}`,
        errors: [],
      },
    ]);
  } catch (error: unknown) {
    return JSON.stringify([
      handleError(error, {
        reasoning: 'Failed to create lending market',
        query: `Attempted to create lending market with registry ID: ${registryId}`,
      }),
    ]);
  }
}

/**
 * Creates a new reserve in an existing Suilend lending market and returns the result as a JSON string.
 *
 * @param lendingMarketOwnerCapId - The ID of the owner capability for the lending market
 * @param pythPriceId - The ID of the Pyth price feed to use for the reserve
 * @param coinType - The type of coin to be used in the reserve
 * @param config - Configuration parameters for the reserve
 * @returns A JSON string containing:
 *   - On success: An array with one object containing:
 *     - reasoning: Success message with coin type
 *     - response: JSON string with transaction and result details
 *     - status: 'success'
 *     - query: Description of the action performed
 *     - errors: Empty array
 *   - On failure: An array with one error object containing:
 *     - reasoning: Error message
 *     - query: Description of the attempted action
 *     - Additional error details from handleError
 */
export async function createReserveWrapper(
  lendingMarketOwnerCapId: string,
  pythPriceId: string,
  coinType: string,
  config: CreateReserveConfigArgs,
) {
  try {
    const transaction = new Transaction();
    const client = await suilendClientWrapper();
    const result = await client.createReserve(
      lendingMarketOwnerCapId,
      transaction,
      pythPriceId,
      coinType,
      config,
    );
    return JSON.stringify([
      {
        reasoning:
          'Successfully created reserve in lending market with coin type: ' +
          coinType,
        response: JSON.stringify({
          transaction: transaction,
          createdReserveConfig: {
            openLtvPct: config.openLtvPct,
            closeLtvPct: config.closeLtvPct,
            maxCloseLtvPct: config.maxCloseLtvPct,
            borrowWeightBps: config.borrowWeightBps,
            depositLimit: config.depositLimit,
            borrowLimit: config.borrowLimit,
            liquidationBonusBps: config.liquidationBonusBps,
            maxLiquidationBonusBps: config.maxLiquidationBonusBps,
            depositLimitUsd: config.depositLimitUsd,
            borrowLimitUsd: config.borrowLimitUsd,
          },
          result: result,
        }),
        status: 'success',
        query: `Created reserve with coin type: ${coinType}`,
        errors: [],
      },
    ]);
  } catch (error: unknown) {
    return JSON.stringify([
      handleError(error, {
        reasoning: 'Failed to create reserve',
        query: `Attempted to create reserve with coin type: ${coinType}`,
      }),
    ]);
  }
}

/**
 * Updates the configuration of an existing reserve in a Suilend lending market and returns the result as a JSON string.
 *
 * @param lendingMarketOwnerCapId - The ID of the owner capability for the lending market
 * @param coinType - The type of coin used in the reserve to update
 * @param config - Configuration parameters for the reserve, including:
 *   - openLtvPct: Open loan-to-value percentage
 *   - closeLtvPct: Close loan-to-value percentage
 *   - maxCloseLtvPct: Maximum close loan-to-value percentage
 *   - borrowWeightBps: Borrow weight in basis points
 *   - depositLimit: Maximum deposit limit in base units
 *   - borrowLimit: Maximum borrow limit in base units
 *   - liquidationBonusBps: Liquidation bonus in basis points
 *   - maxLiquidationBonusBps: Maximum liquidation bonus in basis points
 *   - depositLimitUsd: Maximum deposit limit in USD
 *   - borrowLimitUsd: Maximum borrow limit in USD
 *   - borrowFeeBps: Borrow fee in basis points
 *   - spreadFeeBps: Spread fee in basis points
 *   - protocolLiquidationFeeBps: Protocol liquidation fee in basis points
 *   - interestRateUtils: Interest rate utility parameters
 *   - interestRateAprs: Interest rate APR configurations
 *   - isolated: Whether the reserve is isolated
 *   - openAttributedBorrowLimitUsd: Open attributed borrow limit in USD
 *   - closeAttributedBorrowLimitUsd: Close attributed borrow limit in USD
 * @returns A JSON string containing:
 *   - On success: An array with one object containing:
 *     - reasoning: Success message
 *     - response: JSON string with transaction details and updated configuration
 *     - status: 'success'
 *     - query: Description of the action performed
 *     - errors: Empty array
 *   - On failure: An array with one error object containing:
 *     - reasoning: Error message
 *     - query: Description of the attempted action
 *     - Additional error details from handleError
 */
export async function updateReserveConfigWrapper(
  lendingMarketOwnerCapId: string,
  coinType: string,
  config: CreateReserveConfigArgs,
): Promise<string> {
  try {
    const transaction = new Transaction();
    const client = await suilendClientWrapper();
    const result = await client.updateReserveConfig(
      lendingMarketOwnerCapId,
      transaction,
      coinType,
      config,
    );
    // Format the response with the updated configuration
    return JSON.stringify([
      {
        reasoning: 'Successfully updated reserve configuration',
        response: JSON.stringify(
          {
            lendingMarketOwnerCapId: lendingMarketOwnerCapId,
            coinType: coinType,
            transaction: transaction,
            updatedConfig: {
              openLtvPct: config.openLtvPct,
              closeLtvPct: config.closeLtvPct,
              maxCloseLtvPct: config.maxCloseLtvPct,
              borrowWeightBps: config.borrowWeightBps,
              depositLimit: config.depositLimit,
              borrowLimit: config.borrowLimit,
              liquidationBonusBps: config.liquidationBonusBps,
              maxLiquidationBonusBps: config.maxLiquidationBonusBps,
              depositLimitUsd: config.depositLimitUsd,
              borrowLimitUsd: config.borrowLimitUsd,
              borrowFeeBps: config.borrowFeeBps,
              spreadFeeBps: config.spreadFeeBps,
              protocolLiquidationFeeBps: config.protocolLiquidationFeeBps,
              interestRateUtils: config.interestRateUtils,
              interestRateAprs: config.interestRateAprs,
              isolated: config.isolated,
              openAttributedBorrowLimitUsd: config.openAttributedBorrowLimitUsd,
              closeAttributedBorrowLimitUsd:
                config.closeAttributedBorrowLimitUsd,
            },
            status: 'success',
          },
          null,
          2,
        ),
        status: 'success',
        query: `Updated reserve configuration for coin type: ${coinType}`,
        errors: [],
      },
    ]);
  } catch (error: unknown) {
    return JSON.stringify([
      handleError(error, {
        reasoning: 'Failed to update reserve config',
        query: `Attempted to update reserve config with coin type: ${coinType}`,
      }),
    ]);
  }
}

/**
 * Changes the price feed for an existing reserve in a Suilend lending market and returns the result as a JSON string.
 *
 * @param lendingMarketOwnerCapId - The ID of the owner capability for the lending market
 * @param coinType - The type of coin used in the reserve
 * @param pythPriceId - The ID of the new Pyth price feed to use
 * @returns A JSON string containing:
 *   - On success: An array with one object containing:
 *     - reasoning: Success message
 *     - response: JSON string with transaction details and new price feed
 *     - status: 'success'
 *     - query: Description of the action performed
 *     - errors: Empty array
 */
export async function changeReservePriceFeedWrapper(
  lendingMarketOwnerCapId: string,
  coinType: string,
  pythPriceId: string,
) {
  try {
    const client = await suilendClientWrapper();
    const transaction = new Transaction();
    const result = await client.changeReservePriceFeed(
      lendingMarketOwnerCapId,
      coinType,
      pythPriceId,
      transaction,
    );
    return JSON.stringify([
      {
        reasoning: 'Successfully changed reserve price feed',
        response: JSON.stringify(
          {
            transaction: transaction,
            lendingMarketId: lendingMarketOwnerCapId,
            coinType: coinType,
            newPriceId: pythPriceId,
            status: 'success',
          },
          null,
          2,
        ),
        status: 'success',
        query: `Changed reserve price feed for coin type: ${coinType}`,
        errors: [],
      },
    ]);
  } catch (error: unknown) {
    return JSON.stringify([
      handleError(error, {
        reasoning: 'Failed to change reserve price feed',
        query: `Attempted to change reserve price feed for coin type: ${coinType}`,
      }),
    ]);
  }
}
