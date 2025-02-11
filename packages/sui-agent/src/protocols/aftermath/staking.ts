import { Aftermath } from 'aftermath-ts-sdk';
import { handleError } from '../../utils';
import { StakeParams, UnstakeParams } from './types';

class StakingTool {
  private static sdk: Aftermath | null = null;

  private static initSDK(): Aftermath {
    if (!StakingTool.sdk) {
      StakingTool.sdk = new Aftermath('MAINNET');
    }
    return StakingTool.sdk;
  }

  /**
   * Gets user's staking positions
   * @param walletAddress Address of the wallet to get positions for
   * @returns Staking positions
   */
  public static async getStakingPositions(
    walletAddress: string,
  ): Promise<string> {
    try {
      const sdk = StakingTool.initSDK();
      await sdk.init();
      const staking = sdk.Staking();
      const positions = await staking.getStakingPositions({ walletAddress });

      return JSON.stringify([
        {
          reasoning: 'Successfully retrieved staking positions',
          response: {
            walletAddress,
            positions,
            timestamp: new Date().toISOString(),
          },
          status: 'success',
          query: `Get staking positions for ${walletAddress}`,
          errors: [],
        },
      ]);
    } catch (error) {
      return JSON.stringify([
        handleError(error, {
          reasoning: 'Failed to retrieve staking positions',
          query: `Attempted to get positions for ${walletAddress}`,
        }),
      ]);
    }
  }

  /**
   * Gets total SUI TVL in staking
   * @returns TVL information
   */
  public static async getSuiTvl(): Promise<string> {
    try {
      const sdk = StakingTool.initSDK();
      await sdk.init();
      const staking = sdk.Staking();
      const tvl = await staking.getSuiTvl();

      return JSON.stringify([
        {
          reasoning: 'Successfully retrieved SUI TVL information',
          response: {
            tvl: tvl.toString(),
            timestamp: new Date().toISOString(),
          },
          status: 'success',
          query: 'Get total SUI TVL in staking',
          errors: [],
        },
      ]);
    } catch (error) {
      return JSON.stringify([
        handleError(error, {
          reasoning: 'Failed to retrieve TVL information',
          query: 'Attempted to get total SUI TVL in staking',
        }),
      ]);
    }
  }

  /**
   * Gets afSUI to SUI exchange rate
   * @returns Exchange rate information
   */
  public static async getAfSuiExchangeRate(): Promise<string> {
    try {
      const sdk = StakingTool.initSDK();
      await sdk.init();
      const staking = sdk.Staking();
      const rate = await staking.getAfSuiToSuiExchangeRate();

      return JSON.stringify([
        {
          reasoning: 'Successfully retrieved exchange rate',
          response: {
            rate: rate.toString(),
            timestamp: new Date().toISOString(),
          },
          status: 'success',
          query: 'Get afSUI to SUI exchange rate',
          errors: [],
        },
      ]);
    } catch (error) {
      return JSON.stringify([
        handleError(error, {
          reasoning: 'Failed to retrieve exchange rate',
          query: 'Attempted to get afSUI to SUI exchange rate',
        }),
      ]);
    }
  }

  /**
   * Generates a staking transaction
   * @param params Staking parameters
   * @returns Staking transaction data
   */
  public static async getStakeTransaction(
    params: StakeParams,
  ): Promise<string> {
    try {
      const sdk = StakingTool.initSDK();
      await sdk.init();
      const staking = sdk.Staking();
      const tx = await staking.getStakeTransaction({
        walletAddress: params.walletAddress,
        suiStakeAmount: params.suiAmount,
        validatorAddress: params.validatorAddress,
      });

      return JSON.stringify([
        {
          reasoning: 'Successfully generated staking transaction',
          response: {
            transaction: tx,
            details: {
              walletAddress: params.walletAddress,
              suiAmount: params.suiAmount.toString(),
              validatorAddress: params.validatorAddress,
            },
          },
          status: 'success',
          query: `Generate stake transaction for ${params.suiAmount} SUI`,
          errors: [],
        },
      ]);
    } catch (error) {
      return JSON.stringify([
        handleError(error, {
          reasoning: 'Failed to generate staking transaction',
          query: `Attempted to generate stake transaction for ${params.suiAmount} SUI`,
        }),
      ]);
    }
  }

  /**
   * Generates an unstaking transaction
   * @param params Unstaking parameters
   * @returns Unstaking transaction data
   */
  public static async getUnstakeTransaction(
    params: UnstakeParams,
  ): Promise<string> {
    try {
      const sdk = StakingTool.initSDK();
      await sdk.init();
      const staking = sdk.Staking();
      const tx = await staking.getUnstakeTransaction({
        walletAddress: params.walletAddress,
        afSuiUnstakeAmount: params.afSuiAmount,
        isAtomic: params.isAtomic,
      });

      return JSON.stringify([
        {
          reasoning: 'Successfully generated unstaking transaction',
          response: {
            transaction: tx,
            details: {
              walletAddress: params.walletAddress,
              afSuiAmount: params.afSuiAmount.toString(),
              isAtomic: params.isAtomic,
            },
          },
          status: 'success',
          query: `Generate unstake transaction for ${params.afSuiAmount} afSUI`,
          errors: [],
        },
      ]);
    } catch (error) {
      return JSON.stringify([
        handleError(error, {
          reasoning: 'Failed to generate unstaking transaction',
          query: `Attempted to generate unstake transaction for ${params.afSuiAmount} afSUI`,
        }),
      ]);
    }
  }
}

export default StakingTool;
