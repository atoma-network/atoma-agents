import { SuiClient, SuiHTTPTransport } from '@mysten/sui/client';
import { Transaction } from '@mysten/sui/transactions';
import { Signer } from '@mysten/sui/cryptography';
import { NETWORK_CONFIG } from '../@types/interface';
import { TransferParams } from './types';
/**
 * Initializes a Sui client for transaction operations
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
 * Builds a transaction for transferring SUI
 * @param client - Initialized SuiClient
 * @param params - Transfer parameters
 * @returns Prepared Transaction
 * @throws Error if insufficient coins or invalid addresses
 */
export async function buildTransferTx(
  client: SuiClient,
  params: TransferParams,
): Promise<Transaction> {
  const { fromAddress, toAddress, tokenType, amount } = params;

  const tx = new Transaction();
  tx.setGasBudget(2000000); // Set a gas budget

  // Get coins owned by sender
  const coins = await client.getCoins({
    owner: fromAddress,
    coinType: tokenType,
  });

  if (coins.data.length === 0) {
    throw new Error(`No ${tokenType} coins found for address ${fromAddress}`);
  }

  // Select the first coin and perform the transfer
  const coin = tx.object(coins.data[0].coinObjectId);
  const [splitCoin] = tx.splitCoins(coin, [tx.pure.u64(amount)]);
  tx.transferObjects([splitCoin], tx.pure.address(toAddress));

  return tx;
}

/**
 * Executes a signed transaction on the network
 * @param client - Initialized SuiClient
 * @param tx - Transaction to execute
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

export default Transaction;
