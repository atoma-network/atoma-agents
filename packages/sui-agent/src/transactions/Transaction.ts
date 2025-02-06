import { SuiClient, SuiHTTPTransport } from '@mysten/sui/client';
import {
  Transaction,
  TransactionObjectArgument,
} from '@mysten/sui/transactions';
import { TokenBalance, NETWORK_CONFIG } from '../@types/interface';
import { Signer } from '@mysten/sui/cryptography';

/** --------------------------------------------------------------------------
 * Core Transaction Infrastructure
 * --------------------------------------------------------------------------
 */

/**
 * Creates and initializes a Sui client for transaction operations
 * @param network - Network to connect to ("MAINNET" | "TESTNET")
 * @returns Initialized SuiClient instance
 */
export function initSuiClient(
  network: 'MAINNET' | 'TESTNET' = 'MAINNET',
): SuiClient {
  return new SuiClient({
    transport: new SuiHTTPTransport({
      url: NETWORK_CONFIG[network].fullnode,
    }),
  });
}

/**
 * Creates a programmable transaction block with common options
 * @param gasBudget - Maximum gas to spend (in MIST)
 * @returns Initialized TransactionBlock
 */
export function createPTB(gasBudget = 2000000): Transaction {
  const tx = new Transaction();
  tx.setGasBudget(gasBudget);
  return tx;
}

/** --------------------------------------------------------------------------
 * Basic Transaction Operations
 * --------------------------------------------------------------------------
 */

/**
 * Builds a transaction for transferring a single token
 * @param client - Initialized SuiClient
 * @param fromAddress - Sender's address
 * @param toAddress - Recipient's address
 * @param tokenType - Type of token to transfer (e.g., "0x2::sui::SUI")
 * @param amount - Amount to transfer
 * @returns Prepared TransactionBlock
 * @throws Error if insufficient coins or invalid addresses
 */
export async function buildTransferTx(
  client: SuiClient,
  fromAddress: string,
  toAddress: string,
  tokenType: string,
  amount: bigint,
): Promise<Transaction> {
  const tx = new Transaction();

  // Set gas budget
  tx.setGasBudget(2000000);

  // Get coins owned by sender
  const coins = await client.getCoins({
    owner: fromAddress,
    coinType: tokenType,
  });

  if (coins.data.length === 0) {
    throw new Error(`No ${tokenType} coins found for address ${fromAddress}`);
  }

  // Select coin and perform transfer
  const coin = tx.object(coins.data[0].coinObjectId);
  const [splitCoin] = tx.splitCoins(coin, [tx.pure.u64(amount)]);
  tx.transferObjects([splitCoin], tx.pure.address(toAddress));

  return tx;
}

/**
 * Builds a transaction for transferring multiple tokens
 * @param client - Initialized SuiClient
 * @param from - Sender's address
 * @param to - Recipient's address
 * @param transfers - Array of token balances to transfer
 * @returns Prepared TransactionBlock
 * @throws Error if insufficient coins
 */
export async function buildMultiTransferTx(
  client: SuiClient,
  from: string,
  to: string,
  transfers: TokenBalance[],
): Promise<Transaction> {
  const tx = new Transaction();

  // Process each transfer
  for (const transfer of transfers) {
    const [coin] = tx.splitCoins(tx.gas, [tx.pure.u64(transfer.amount)]);
    tx.transferObjects([coin], tx.pure.address(to));
  }

  return tx;
}

/** --------------------------------------------------------------------------
 * Transaction Utilities
 * --------------------------------------------------------------------------
 */

/**
 * Estimates the gas cost for executing a transaction
 * @param client - Initialized SuiClient
 * @param tx - TransactionBlock to estimate
 * @returns Estimated gas cost in MIST
 * @throws Error if estimation fails
 */
export async function estimateGas(
  client: SuiClient,
  tx: Transaction,
): Promise<bigint> {
  const estimate = await client.dryRunTransactionBlock({
    transactionBlock: tx.serialize(),
  });
  return BigInt(estimate.effects.gasUsed.computationCost);
}

/**
 * Executes a signed transaction on the network
 * @param client - Initialized SuiClient
 * @param tx - TransactionBlock to execute
 * @param signer - Wallet or signer for the transaction
 * @returns Transaction execution result
 * @throws Error if transaction fails or network error occurs
 */
export async function executeTransaction(
  client: SuiClient,
  tx: Transaction,
  signer: Signer,
) {
  try {
    const result = await client.signAndExecuteTransaction({
      transaction: tx,
      signer,
      options: {
        showEffects: true,
        showEvents: true,
      },
    });
    return result;
  } catch (error) {
    console.error('Transaction failed:', error);
    throw error;
  }
}

/**
 * Move function target format: `package::module::function`
 */
type MoveTarget = `${string}::${string}::${string}`;

/**
 * Adds a move call to an existing transaction block
 *
 * Helper function to add a move call with proper typing and validation.
 *
 * @param tx - Existing transaction block
 * @param target - Move function to call (e.g., "0x2::sui::pay")
 * @param typeArguments - Type arguments for generic functions
 * @param args - Arguments for the function call
 * @returns The transaction block for chaining
 *
 * @example
 * const ptb = createPTB();
 * addMoveCall(ptb, "0x2::sui::pay", [], [recipient, amount]);
 */
export function addMoveCall(
  tx: Transaction,
  target: MoveTarget,
  typeArguments: string[] = [],
  args: (string | number | boolean | bigint)[] = [],
): Transaction {
  tx.moveCall({
    target,
    typeArguments,
    arguments: args.map((arg) => {
      if (typeof arg === 'string' && arg.startsWith('0x')) {
        return tx.object(arg);
      }
      if (typeof arg === 'bigint') {
        return tx.pure.u64(arg);
      }
      return tx.pure.address(arg as string);
    }),
  });
  return tx;
}

/** --------------------------------------------------------------------------
 *                            Transaction Operations
 *
 * --------------------------------------------------------------------------
 */

/**
 * Creates a transaction to merge multiple coins of the same type
 * @param client - Initialized SuiClient
 * @param coinType - Type of coins to merge
 * @param walletAddress - Address owning the coins
 * @param maxCoins - Maximum number of coins to merge (default: 10)
 * @returns TransactionBlock ready for signing
 * @throws Error if no coins found or invalid coin type
 */
export async function createMergeCoinsTx(
  client: SuiClient,
  coinType: string,
  walletAddress: string,
  maxCoins = 10,
): Promise<Transaction> {
  // Fetch available coins
  const coins = await client.getCoins({
    owner: walletAddress,
    coinType,
  });

  if (coins.data.length <= 1) {
    throw new Error('Not enough coins to merge');
  }

  // Create merge transaction
  const tx = new Transaction();
  const coinsToMerge = coins.data.slice(0, maxCoins);
  const primaryCoin = coinsToMerge[0].coinObjectId;
  const mergeCoins = coinsToMerge.slice(1).map((coin) => coin.coinObjectId);

  tx.mergeCoins(primaryCoin, mergeCoins);
  return tx;
}

/**
 * Creates a sponsored transaction block
 * @param tx - Transaction block to sponsor
 * @param sender - Address of the transaction sender
 * @param sponsor - Address of the gas sponsor
 * @param sponsorCoins - Coins owned by sponsor to use for gas
 * @returns Transaction block ready for sponsor signature
 */
export async function createSponsoredTx(
  tx: Transaction,
  sender: string,
  sponsor: string,
  sponsorCoins: { objectId: string; version: string; digest: string }[],
): Promise<Transaction> {
  // Extract transaction kind
  const kindBytes = await tx.build({ onlyTransactionKind: true });
  const sponsoredTx = Transaction.fromKind(kindBytes);

  // Set up sponsored transaction
  sponsoredTx.setSender(sender);
  sponsoredTx.setGasOwner(sponsor);
  sponsoredTx.setGasPayment(sponsorCoins);

  return sponsoredTx;
}

/**
 * Creates a vector of objects for move calls
 * @param tx - Transaction block to add vector to
 * @param elements - Array of objects/values to include
 * @param type - Optional type annotation for the vector
 * @returns Move vector input for transaction
 */
export function createMoveVec(
  tx: Transaction,
  elements: (string | TransactionObjectArgument)[],
  type?: string,
) {
  return tx.makeMoveVec({
    elements,
    type,
  });
}

/**
 * Transaction agent class providing high-level transaction operations
 */
export class TransactionAgent {
  private client: SuiClient;

  /**
   * Initialize transaction agent with network configuration
   * @param network - Network to connect to (default: MAINNET)
   */
  constructor(network: 'MAINNET' | 'TESTNET' = 'MAINNET') {
    this.client = new SuiClient({ url: NETWORK_CONFIG[network].fullnode });
  }

  /**
   * Creates a transaction block for transferring SUI
   * @param amount - Amount of SUI to transfer
   * @param recipient - Recipient address
   * @returns Prepared transaction block
   */
  buildTransferTx(amount: bigint, recipient: string): Transaction {
    const tx = new Transaction();
    const [coin] = tx.splitCoins(tx.gas, [tx.pure.u64(amount)]);
    tx.transferObjects([coin], tx.pure.address(recipient));
    return tx;
  }

  /**
   * Creates a transaction block for merging coins
   * @param destinationCoin - Coin to merge into
   * @param sourceCoins - Coins to merge from
   * @returns Prepared transaction block
   */
  buildMergeCoinsTx(
    destinationCoin: string,
    sourceCoins: string[],
  ): Transaction {
    const tx = new Transaction();
    tx.mergeCoins(
      tx.object(destinationCoin),
      sourceCoins.map((coin) => tx.object(coin)),
    );
    return tx;
  }

  /**
   * Creates a transaction block for a Move call
   * @param target - Move function target
   * @param typeArguments - Type arguments for generic functions
   * @param args - Arguments for the function call
   * @returns Prepared transaction block
   */
  buildMoveCallTx(
    target: `${string}::${string}::${string}`,
    typeArguments: string[],
    args: (string | number | boolean | bigint)[],
  ): Transaction {
    const tx = new Transaction();
    tx.moveCall({
      target,
      typeArguments,
      arguments: args.map((arg) => {
        if (typeof arg === 'string' && arg.startsWith('0x')) {
          return tx.object(arg);
        }
        if (typeof arg === 'bigint') {
          return tx.pure.u64(arg);
        }
        return tx.pure.address(arg as string);
      }),
    });
    return tx;
  }

  /**
   * Creates a sponsored transaction
   * @param tx - Original transaction block
   * @param sender - Transaction sender address
   * @param sponsor - Gas sponsor address
   * @param sponsorCoins - Coins for gas payment
   * @returns Sponsored transaction block
   */
  async createSponsoredTx(
    tx: Transaction,
    sender: string,
    sponsor: string,
    sponsorCoins: { objectId: string; version: string; digest: string }[],
  ): Promise<Transaction> {
    const kindBytes = await tx.build({ onlyTransactionKind: true });
    const sponsoredTx = Transaction.fromKind(kindBytes);

    sponsoredTx.setSender(sender);
    sponsoredTx.setGasOwner(sponsor);
    sponsoredTx.setGasPayment(sponsorCoins);

    return sponsoredTx;
  }

  /**
   * Creates a vector of objects for move calls
   * @param tx - Transaction block
   * @param elements - Vector elements
   * @param type - Optional type annotation
   * @returns Move vector
   */
  createMoveVec(
    tx: Transaction,
    elements: (string | TransactionObjectArgument)[],
    type?: string,
  ) {
    return tx.makeMoveVec({
      elements,
      type,
    });
  }

  /**
   * Estimates gas for a transaction
   * @param tx - Transaction block to estimate
   * @returns Estimated gas cost in MIST
   */
  async estimateGas(tx: Transaction): Promise<bigint> {
    try {
      const dryRunResult = await this.client.dryRunTransactionBlock({
        transactionBlock: tx.serialize(),
      });
      return BigInt(dryRunResult.effects.gasUsed.computationCost);
    } catch (error) {
      console.error('Error estimating gas:', error);
      // Return a default gas estimate if dry run fails
      return BigInt(2000000);
    }
  }

  /**
   * Waits for a transaction to be confirmed
   * @param digest - Transaction digest
   * @returns Transaction block with effects and events
   */
  async waitForTransaction(digest: string) {
    return this.client.waitForTransaction({
      digest,
      options: {
        showEffects: true,
        showEvents: true,
      },
    });
  }

  /**
   * Gets all coins owned by an address
   * @param owner - Address to check
   * @returns Array of coin objects
   */
  async getCoins(owner: string) {
    const { data } = await this.client.getCoins({
      owner,
    });
    return data;
  }

  /**
   * Gets coin balances for an address
   * @param address - Address to check
   * @returns Total balance information
   */
  async getBalance(address: string): Promise<{ totalBalance: bigint }> {
    const balance = await this.client.getBalance({
      owner: address,
      coinType: '0x2::sui::SUI',
    });

    return {
      totalBalance: BigInt(balance.totalBalance),
    };
  }
}
