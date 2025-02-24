//import { describe, expect, test } from '@jest/globals';
import Agents from '../agents/SuiAgent';
import { TEST_POOLS, TEST_ADDRESSES, SLIPPAGE } from './setup';

// Initialize agent with test credentials
const agent = new Agents(process.env.BEARER_TOKEN || '');

describe('Cetus Protocol Integration Tests', () => {
  describe('Pool Operations', () => {
    test('should get pool information', async () => {
      const response = await agent.processUserQueryPipeline(
        `Get information about Cetus pool ${TEST_POOLS.SUI_USDC}`,
      );
      expect(response).toBeDefined();
      expect(response.errors).toHaveLength(0);
      expect(response.response).toHaveProperty('poolAddress');
      expect(response.response).toHaveProperty('coinTypeA');
      expect(response.response).toHaveProperty('coinTypeB');
    });

    test('should get pool statistics and TVL', async () => {
      const response = await agent.processUserQueryPipeline(
        `Get statistics and TVL for Cetus pool ${TEST_POOLS.USDC_USDT}`,
      );
      expect(response).toBeDefined();
      expect(response.errors).toHaveLength(0);
      expect(response.response).toHaveProperty('tvl');
      expect(response.response).toHaveProperty('fee');
    });

    test('should list all pools', async () => {
      const response = await agent.processUserQueryPipeline(
        'List all available Cetus pools',
      );
      expect(response).toBeDefined();
      expect(response.errors).toHaveLength(0);
      expect(Array.isArray(response.response)).toBe(true);
      expect(response.response.length).toBeGreaterThan(0);
    });
  });

  describe('Position Operations', () => {
    test('should get positions for address', async () => {
      const response = await agent.processUserQueryPipeline(
        `Get all Cetus positions for address ${TEST_ADDRESSES.LP_PROVIDER}`,
      );
      expect(response).toBeDefined();
      expect(response.errors).toHaveLength(0);
      expect(Array.isArray(response.response)).toBe(true);
    });

    test('should calculate add liquidity parameters', async () => {
      const response = await agent.processUserQueryPipeline(
        `Calculate parameters for adding 1000 USDC to Cetus pool ${TEST_POOLS.USDC_USDT} with ${SLIPPAGE.MEDIUM * 100}% slippage`,
      );
      expect(response).toBeDefined();
      expect(response.errors).toHaveLength(0);
      expect(response.response).toHaveProperty('amount_a');
      expect(response.response).toHaveProperty('amount_b');
      expect(response.response).toHaveProperty('tick_lower');
      expect(response.response).toHaveProperty('tick_upper');
    });

    test('should calculate remove liquidity parameters', async () => {
      // First get a position
      const positionsResponse = await agent.processUserQueryPipeline(
        `Get all Cetus positions for address ${TEST_ADDRESSES.LP_PROVIDER}`,
      );
      const position = positionsResponse.response[0];

      const response = await agent.processUserQueryPipeline(
        `Calculate parameters for removing liquidity from Cetus position ${position.pos_object_id} with ${SLIPPAGE.LOW * 100}% slippage`,
      );
      expect(response).toBeDefined();
      expect(response.errors).toHaveLength(0);
      expect(response.response).toHaveProperty('min_amount_a');
      expect(response.response).toHaveProperty('min_amount_b');
    });
  });

  describe('Trading Operations', () => {
    test('should calculate swap quote for exact input', async () => {
      const response = await agent.processUserQueryPipeline(
        `Calculate swap quote for trading 1 SUI to USDC on Cetus pool ${TEST_POOLS.SUI_USDC} with ${SLIPPAGE.HIGH * 100}% slippage`,
      );
      expect(response).toBeDefined();
      expect(response.errors).toHaveLength(0);
      expect(response.response).toHaveProperty('amount_limit');
      expect(response.response).toHaveProperty('by_amount_in', true);
    });

    test('should calculate swap quote for exact output', async () => {
      const response = await agent.processUserQueryPipeline(
        `Calculate swap quote to receive exactly 100 USDC by trading SUI on Cetus pool ${TEST_POOLS.SUI_USDC} with ${SLIPPAGE.MEDIUM * 100}% slippage`,
      );
      expect(response).toBeDefined();
      expect(response.errors).toHaveLength(0);
      expect(response.response).toHaveProperty('amount_limit');
      expect(response.response).toHaveProperty('by_amount_in', false);
    });

    test('should handle price impact calculation', async () => {
      const response = await agent.processUserQueryPipeline(
        `Calculate price impact for swapping 1000 USDC to USDT on Cetus pool ${TEST_POOLS.USDC_USDT}`,
      );
      expect(response).toBeDefined();
      expect(response.errors).toHaveLength(0);
      expect(response.response).toHaveProperty('priceImpact');
      expect(parseFloat(response.response.priceImpact)).toBeGreaterThanOrEqual(
        0,
      );
    });
  });

  describe('Pool Creation', () => {
    test('should validate pool creation parameters', async () => {
      const response = await agent.processUserQueryPipeline(
        'Create a new Cetus pool for SUI/USDC with tick spacing 2 and initial price 1.0',
      );
      expect(response).toBeDefined();
      expect(response.errors).toHaveLength(0);
      expect(response.response).toHaveProperty('initialize_sqrt_price');
      expect(response.response).toHaveProperty('tick_spacing', 2);
    });
  });

  describe('Error Handling', () => {
    test('should handle invalid pool ID gracefully', async () => {
      const response = await agent.processUserQueryPipeline(
        'Get information about Cetus pool 0xinvalid_pool_id',
      );
      expect(response).toBeDefined();
      expect(response.errors).toHaveLength(1);
      expect(response.status).toBe('error');
    });

    test('should handle invalid address gracefully', async () => {
      const response = await agent.processUserQueryPipeline(
        'Get all Cetus positions for address 0xinvalid_address',
      );
      expect(response).toBeDefined();
      expect(response.errors).toHaveLength(1);
      expect(response.status).toBe('error');
    });

    test('should handle excessive slippage values', async () => {
      const response = await agent.processUserQueryPipeline(
        `Calculate swap quote for trading 1 SUI to USDC on Cetus pool ${TEST_POOLS.SUI_USDC} with 50% slippage`,
      );
      expect(response).toBeDefined();
      expect(response.errors).toHaveLength(1);
      expect(response.status).toBe('error');
    });
  });
});
