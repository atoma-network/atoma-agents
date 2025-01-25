import { SuiClient, SuiHTTPTransport } from '@mysten/sui/client';
import {
  SuilendClient,
  LENDING_MARKET_ID,
  LENDING_MARKET_TYPE,
} from '@suilend/sdk/client';
import { NETWORK_CONFIG } from '../../../@types/interface';

/**
 * Initializes and returns a SuilendClient instance configured for the mainnet.
 *
 * This function creates a configured SuilendClient by:
 * 1. Establishing a connection to the Sui mainnet using SuiClient
 * 2. Initializing a SuilendClient with predefined lending market parameters
 *
 * @returns {Promise<SuilendClient>} A configured SuilendClient instance ready for lending operations
 * @throws {Error} If client initialization fails, with detailed error message
 *
 * @example
 * try {
 *   const client = await suilendClientWrapper();
 *   // Use client for lending operations
 * } catch (error) {
 *   console.error('Failed to initialize SuilendClient:', error);
 * }
 *
 * @see {@link SuilendClient} For available lending operations
 * @see {@link LENDING_MARKET_ID} For the configured lending market identifier
 * @see {@link LENDING_MARKET_TYPE} For the lending market type configuration
 */
async function suilendClientWrapper(): Promise<SuilendClient> {
  try {
    const suiClient = new SuiClient({
      transport: new SuiHTTPTransport({
        url: NETWORK_CONFIG.MAINNET.fullnode,
      }),
    });

    const suilendClient = await SuilendClient.initialize(
      LENDING_MARKET_ID,
      LENDING_MARKET_TYPE,
      suiClient,
    );

    return suilendClient;
  } catch (error) {
    throw new Error(
      `Failed to initialize SuilendClient: ${error instanceof Error ? error.message : String(error)}`,
    );
  }
}

export { suilendClientWrapper };

// // Market Management Methods
// 1. createLendingMarket(registryId, lendingMarketType)
// 2. createReserve(lendingMarketOwnerCapId, pythPriceId, coinType, config)
// 3. updateReserveConfig(lendingMarketOwnerCapId, coinType, config)
// 4. changeReservePriceFeed(lendingMarketOwnerCapId, coinType, pythPriceId)
// 5. updateRateLimiterConfig(lendingMarketOwnerCapId, config)
// 6. migrate(lendingMarketOwnerCapId)
// 7. setFeeReceiversAndWeights(lendingMarketOwnerCapId, receivers, weights)
// 8. claimFees(coinType)

// // Obligation Management
// 9. createObligation()
// 10. newObligationOwnerCap(lendingMarketOwnerCapId, destinationAddress, obligationId)

// // Deposit/Withdraw Operations
// 11. depositIntoObligation(ownerId, coinType, value, obligationOwnerCapId)
// 12. depositLiquidityAndGetCTokens(ownerId, coinType, value)
// 13. withdrawAndSendToUser(ownerId, obligationOwnerCapId, obligationId, coinType, value)
// 14. redeemCtokensAndWithdrawLiquidity(ownerId, ctokenCoinTypes)

// // Borrow/Repay Operations
// 15. borrowAndSendToUser(ownerId, obligationOwnerCapId, obligationId, coinType, value)
// 16. repayIntoObligation(ownerId, obligationId, coinType, value)

// // Reward Management
// 17. addReward(ownerId, lendingMarketOwnerCapId, reserveArrayIndex, isDepositReward, rewardCoinType, rewardValue, startTimeMs, endTimeMs)
// 18. cancelReward(lendingMarketOwnerCapId, reserveArrayIndex, isDepositReward, rewardIndex, rewardCoinType)
// 19. closeReward(lendingMarketOwnerCapId, reserveArrayIndex, isDepositReward, rewardIndex, rewardCoinType)
// 20. claimRewardsAndSendToUser(ownerId, obligationOwnerCapId, rewards)
// 21. claimRewardsAndDeposit(ownerId, obligationOwnerCapId, rewards)

// // Liquidation Operations
// 22. liquidateAndRedeem(obligation, repayCoinType, withdrawCoinType, repayCoinId)

// // Query Methods
// 23. getLendingMarketOwnerCapId(ownerId)
// 24. getObligation(obligationId)
