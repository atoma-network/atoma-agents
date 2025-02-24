import dotenv from 'dotenv';
import path from 'path';
import { initCetusSDK } from '@cetusprotocol/cetus-sui-clmm-sdk';

// Load environment variables from .env file
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

// Set default environment variables for testing if not provided
process.env.BEARER_TOKEN = process.env.BEARER_TOKEN || 'test_bearer_token';
process.env.SUI_RPC_URL =
  process.env.SUI_RPC_URL || 'https://fullnode.mainnet.sui.io';
process.env.SUI_WALLET_ADDRESS =
  process.env.SUI_WALLET_ADDRESS ||
  '0xcd0247d0b67e53dde69b285e7a748e3dc390e8a5244eb9dd9c5c53d95e4cf0aa';

// Initialize Cetus SDK for tests
export const cetusSDK = initCetusSDK({
  network: 'mainnet',
  fullNodeUrl: process.env.SUI_RPC_URL,
  wallet: process.env.SUI_WALLET_ADDRESS,
});

// Test constants
export const TEST_POOLS = {
  SUI_USDC:
    '0x5eb2dfcdd1b15d2021328258f6d5ec081e9a0cdcfa9e13a0eaeb9b5f7505ca78',
  USDC_USDT:
    '0x06d8af9e6afd27262db436f0d37b304a041f710c3ea1fa4c3a9bab36b3569ad3',
  CETUS_SUI:
    '0x2e041f3fd93646dcc877f783c1f2b7fa62d30271bdef1f21ef002cebf857bded',
};

export const TEST_ADDRESSES = {
  WHALE: '0xcd0247d0b67e53dde69b285e7a748e3dc390e8a5244eb9dd9c5c53d95e4cf0aa',
  LP_PROVIDER:
    '0x7e6b10cce4ed7c7c0f63c204cd8d9a4ea418a0fa7e46c5732ab76474b2f70b9e',
};

// Common test utilities
export const SLIPPAGE = {
  LOW: 0.001, // 0.1%
  MEDIUM: 0.005, // 0.5%
  HIGH: 0.01, // 1%
};

// Increase test timeout for network requests
jest.setTimeout(30000); // 30 seconds
