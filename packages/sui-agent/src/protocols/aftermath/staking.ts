import { Aftermath } from 'aftermath-ts-sdk';
import { handleError } from '../../utils';

// Initialize Aftermath SDK
const afSdk = new Aftermath('MAINNET');

// Initialize the SDK and create staking provider
let stakingApi: Awaited<ReturnType<typeof afSdk.Staking>> | null = null;

async function initializeStakingApi() {
  if (!stakingApi) {
    await afSdk.init(); // Initialize provider
    stakingApi = afSdk.Staking();
  }
  return stakingApi;
}

/**
 * Gets user's staking positions
 * @param walletAddress - Address of the wallet to get positions for
 * @returns JSON string containing staking positions
 */
export async function getStakingPositions(
  walletAddress: string,
): Promise<string> {
  try {
    const staking = await initializeStakingApi();
    const positions = await staking.getStakingPositions({ walletAddress });
    return JSON.stringify([
      {
        reasoning:
          'Successfully retrieved staking positions from Aftermath Finance.',
        response: JSON.stringify(
          {
            walletAddress,
            positions,
            timestamp: new Date().toISOString(),
          },
          null,
          2,
        ),
        status: 'success',
        query: `Fetched staking positions for wallet: ${walletAddress}`,
        errors: [],
      },
    ]);
  } catch (error: unknown) {
    return JSON.stringify([
      handleError(error, {
        reasoning: 'Failed to retrieve staking positions',
        query: `Attempted to fetch positions for wallet: ${walletAddress}`,
      }),
    ]);
  }
}

/**
 * Generates a staking transaction for SUI
 * @param walletAddress - Address of the wallet staking tokens
 * @param suiAmount - Amount of SUI to stake (in base units)
 * @param validatorAddress - Address of the validator to stake with
 * @returns JSON string containing staking transaction data
 */
export async function getStakeTransaction(
  walletAddress: string,
  suiAmount: bigint,
  validatorAddress: string,
): Promise<string> {
  try {
    const staking = await initializeStakingApi();
    const tx = await staking.getStakeTransaction({
      walletAddress,
      suiStakeAmount: suiAmount,
      validatorAddress,
    });

    return JSON.stringify([
      {
        reasoning: 'Successfully generated staking transaction.',
        response: JSON.stringify(
          {
            transaction: tx,
            details: {
              walletAddress,
              suiAmount: suiAmount.toString(),
              validatorAddress,
            },
          },
          null,
          2,
        ),
        status: 'success',
        query: `Generated stake transaction for ${suiAmount} SUI with validator ${validatorAddress}`,
        errors: [],
      },
    ]);
  } catch (error: unknown) {
    return JSON.stringify([
      handleError(error, {
        reasoning: 'Failed to generate staking transaction',
        query: `Attempted to generate stake transaction for ${suiAmount} SUI`,
      }),
    ]);
  }
}

/**
 * Generates an unstaking transaction for afSUI
 * @param walletAddress - Address of the wallet unstaking tokens
 * @param afSuiAmount - Amount of afSUI to unstake (in base units)
 * @param isAtomic - Whether to perform atomic unstaking
 * @returns JSON string containing unstaking transaction data
 */
export async function getUnstakeTransaction(
  walletAddress: string,
  afSuiAmount: bigint,
  isAtomic = true,
): Promise<string> {
  try {
    const staking = await initializeStakingApi();
    const tx = await staking.getUnstakeTransaction({
      walletAddress,
      afSuiUnstakeAmount: afSuiAmount,
      isAtomic,
    });

    return JSON.stringify([
      {
        reasoning: 'Successfully generated unstaking transaction.',
        response: JSON.stringify(
          {
            transaction: tx,
            details: {
              walletAddress,
              afSuiAmount: afSuiAmount.toString(),
              isAtomic,
            },
          },
          null,
          2,
        ),
        status: 'success',
        query: `Generated unstake transaction for ${afSuiAmount} afSUI`,
        errors: [],
      },
    ]);
  } catch (error: unknown) {
    return JSON.stringify([
      handleError(error, {
        reasoning: 'Failed to generate unstaking transaction',
        query: `Attempted to generate unstake transaction for ${afSuiAmount} afSUI`,
      }),
    ]);
  }
}

/**
 * Gets total SUI TVL in staking
 * @returns JSON string containing TVL information
 */
export async function getSuiTvl(): Promise<string> {
  try {
    const staking = await initializeStakingApi();
    const tvl = await staking.getSuiTvl();
    return JSON.stringify([
      {
        reasoning: 'Successfully retrieved SUI TVL information.',
        response: JSON.stringify(
          {
            tvl: tvl.toString(),
            timestamp: new Date().toISOString(),
          },
          null,
          2,
        ),
        status: 'success',
        query: 'Fetched total SUI TVL in staking',
        errors: [],
      },
    ]);
  } catch (error: unknown) {
    return JSON.stringify([
      handleError(error, {
        reasoning: 'Failed to retrieve TVL information',
        query: 'Attempted to fetch total SUI TVL in staking',
      }),
    ]);
  }
}

/**
 * Gets afSUI to SUI exchange rate
 * @returns JSON string containing exchange rate information
 */
export async function getAfSuiExchangeRate(): Promise<string> {
  try {
    const staking = await initializeStakingApi();
    const rate = await staking.getAfSuiToSuiExchangeRate();
    return JSON.stringify([
      {
        reasoning: 'Successfully retrieved afSUI to SUI exchange rate.',
        response: JSON.stringify(
          {
            rate: rate.toString(),
            timestamp: new Date().toISOString(),
          },
          null,
          2,
        ),
        status: 'success',
        query: 'Fetched afSUI to SUI exchange rate',
        errors: [],
      },
    ]);
  } catch (error: unknown) {
    return JSON.stringify([
      handleError(error, {
        reasoning: 'Failed to retrieve exchange rate',
        query: 'Attempted to fetch afSUI to SUI exchange rate',
      }),
    ]);
  }
}
