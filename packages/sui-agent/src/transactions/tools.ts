import Tools from '../utils/tools';
import {
  initSuiClient,
  buildTransferTx,
  executeTransaction,
} from './Transaction';
import { TransferParams } from './types';
import { Transaction } from '@mysten/sui/transactions';
import { Ed25519Keypair } from '@mysten/sui/keypairs/ed25519';

class TransactionTools {
  public static registerTools(tools: Tools) {
    // Initialize Sui Client
    tools.registerTool(
      'init_sui_client',
      'Initialize a Sui client for transaction operations',
      [
        {
          name: 'network',
          type: 'string',
          description: 'Network to connect to (MAINNET or TESTNET)',
          required: true,
        },
      ],
      async (...args) => {
        try {
          const client = initSuiClient(args[0] as 'MAINNET' | 'TESTNET');
          return JSON.stringify({
            status: 'success',
            message: 'Sui client initialized successfully',
            client,
          });
        } catch (error) {
          return JSON.stringify({
            status: 'error',
            message: `Failed to initialize Sui client: ${error}`,
          });
        }
      },
    );

    // Build Transfer Transaction
    tools.registerTool(
      'build_transfer_tx',
      'Build a transaction for transferring tokens',
      [
        {
          name: 'from_address',
          type: 'string',
          description: 'Sender address',
          required: true,
        },
        {
          name: 'to_address',
          type: 'string',
          description: 'Recipient address',
          required: true,
        },
        {
          name: 'token_type',
          type: 'string',
          description: 'Type of token to transfer (e.g., "0x2::sui::SUI")',
          required: true,
        },
        {
          name: 'amount',
          type: 'string',
          description: 'Amount to transfer in MIST',
          required: true,
        },
      ],
      async (...args) => {
        try {
          const client = initSuiClient();
          const params: TransferParams = {
            fromAddress: args[0] as string,
            toAddress: args[1] as string,
            tokenType: args[2] as string,
            amount: BigInt(args[3] as string),
          };
          const tx = await buildTransferTx(client, params);
          return JSON.stringify({ status: 'success', transaction: tx });
        } catch (error) {
          return JSON.stringify({
            status: 'error',
            message: `Failed to build transfer transaction: ${error}`,
          });
        }
      },
    );

    // Execute Transaction
    tools.registerTool(
      'execute_transaction',
      'Execute a signed transaction on the network',
      [
        {
          name: 'transaction',
          type: 'string',
          description: 'Serialized transaction to execute',
          required: true,
        },
        {
          name: 'private_key',
          type: 'string',
          description: 'Private key for signing the transaction',
          required: true,
        },
      ],
      async (...args) => {
        try {
          const client = initSuiClient();
          const tx = Transaction.from(args[0] as string);
          const keypair = Ed25519Keypair.fromSecretKey(
            Buffer.from(args[1] as string, 'hex'),
          );
          const result = await executeTransaction(client, tx, keypair);
          return JSON.stringify({ status: 'success', result });
        } catch (error) {
          return JSON.stringify({
            status: 'error',
            message: `Failed to execute transaction: ${error}`,
          });
        }
      },
    );

    // Transfer SUI Tool - Using mnemonic from ENV
    tools.registerTool(
      'transfer_sui',
      'Transfer SUI tokens from one address to another using mnemonic from environment variable SUI_MNEMONIC',
      [
        {
          name: 'recipient_address',
          type: 'string',
          description: 'Recipient address to send SUI to',
          required: true,
        },
        {
          name: 'amount',
          type: 'string',
          description: 'Amount of SUI to transfer in MIST (1 SUI = 10^9 MIST)',
          required: true,
        },
        {
          name: 'network',
          type: 'string',
          description: 'Network to use (MAINNET or TESTNET)',
          required: false,
        },
      ],
      async (...args) => {
        try {
          // Get mnemonic from environment variable
          const mnemonic = process.env.SUI_MNEMONIC;
          if (!mnemonic) {
            throw new Error('SUI_MNEMONIC environment variable is not set');
          }

          // Initialize client
          const network = (args[2] as 'MAINNET' | 'TESTNET') || 'MAINNET';
          const client = initSuiClient(network);

          // Create keypair from mnemonic
          const keypair = Ed25519Keypair.deriveKeypair(mnemonic);
          const senderAddress = keypair.getPublicKey().toSuiAddress();

          // Build transfer parameters
          const params: TransferParams = {
            fromAddress: senderAddress,
            toAddress: args[0] as string,
            tokenType: '0x2::sui::SUI',
            amount: BigInt(args[1] as string),
          };

          // Build and execute transaction
          const tx = await buildTransferTx(client, params);
          const result = await executeTransaction(client, tx, keypair);

          return JSON.stringify({
            status: 'success',
            result,
            details: {
              network,
              sender: senderAddress,
              recipient: args[0],
              amount: args[1],
            },
          });
        } catch (error) {
          return JSON.stringify({
            status: 'error',
            message: `Failed to transfer SUI: ${error}`,
          });
        }
      },
    );
  }
}

export default TransactionTools;
