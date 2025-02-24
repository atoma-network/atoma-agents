## Cetus Protocol Integration

The Sui Agent includes comprehensive integration with the Cetus Protocol, providing access to Cetus's concentrated liquidity pools and DeFi functionality.

### Features

#### Pool Management

- Get pool information and statistics
- Create new pools with custom parameters
- Monitor pool metrics (TVL, volume, etc.)
- View all positions in a pool

#### Position Management

- View positions for any address
- Add liquidity with customizable parameters
- Remove liquidity with slippage protection
- Collect fees and rewards

#### Trading

- Execute swaps with slippage protection
- Calculate swap quotes and price impact
- Support for both exact input and exact output swaps

### Example Usage

```typescript
// Initialize the agent
const agent = new Agents(YOUR_BEARER_TOKEN);

// Get pool information
const poolInfo = await agent.processUserQueryPipeline(
  'Get information about Cetus pool 0x123...abc',
);

// Get positions for an address
const positions = await agent.processUserQueryPipeline(
  'Get all Cetus positions for address 0x456...def',
);

// Calculate and execute a swap
const swap = await agent.processUserQueryPipeline(
  'Swap 1 SUI for USDC on Cetus pool 0x123...abc with 1% slippage',
);

// Add liquidity
const addLiquidity = await agent.processUserQueryPipeline(
  'Add 100 USDC as liquidity to Cetus pool 0x123...abc with 0.5% slippage',
);
```

### Supported Operations

1. Pool Operations

   - `get_cetus_pool`: Get details about a specific pool
   - `create_cetus_pool`: Create a new pool with custom parameters
   - Get pool statistics and metrics

2. Position Operations

   - `get_cetus_positions`: Get all positions for an address
   - `add_cetus_liquidity`: Add liquidity to a pool
   - `remove_cetus_liquidity`: Remove liquidity from a position

3. Trading Operations
   - `cetus_swap`: Execute a swap with slippage protection
   - Calculate swap quotes and estimates
   - Price impact analysis

### Configuration

The Cetus integration uses the following environment variables:

- `SUI_RPC_URL`: The Sui network RPC URL (defaults to mainnet)
- `SUI_WALLET_ADDRESS`: The simulation account address

### Error Handling

All operations include comprehensive error handling and return standardized responses:

```typescript
{
  reasoning: string;
  response: any;
  status: 'success' | 'error';
  query: string;
  errors: string[];
}
```

### Testing

Integration tests are available in `src/tests/cetus.test.ts`. To run the tests:

```bash
npm test -- cetus.test.ts
```

Make sure to set the required environment variables before running tests.
