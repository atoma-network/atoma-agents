## Aftermath Protocol Integration

The Sui Agent includes comprehensive integration with the Aftermath Protocol, providing access to Aftermath's DeFi functionality including pools, trading, and staking features.

### Features

#### Pool Management

- Get pool information and statistics
- View pool metrics (TVL, APR, fees)
- Monitor pool events
- Filter and rank pools by various metrics

#### Trading

- Execute swaps with slippage protection
- Calculate expected trade outputs
- Find optimal trade routes
- Support for multi-pool deposits and withdrawals

#### Staking

- View staking positions
- Stake and unstake SUI
- Monitor TVL and exchange rates
- Track rewards and APR

### Example Usage

```typescript
// Initialize the agent
const agent = new Agents(YOUR_BEARER_TOKEN);

// Get pool information
const poolInfo = await agent.SuperVisorAgent(
  'Get information about Aftermath pool 0x123...abc',
);

// Get APR for a token
const apr = await agent.SuperVisorAgent('Get APR for token 0x456...def');

// Execute a multi-pool deposit
const deposit = await agent.SuperVisorAgent(
  'Deposit 100 SUI into top 3 Aftermath pools by APR with 1% slippage',
);

// Check staking positions
const stakingInfo = await agent.SuperVisorAgent(
  'Get my staking positions for address 0x789...ghi',
);
```

### Supported Operations

1. Pool Operations

   - `get_pool`: Get details about a specific pool
   - `get_all_pools`: Get information about all pools
   - `get_pool_events`: Get deposit/withdrawal events for a pool
   - `get_ranked_pools`: Get pools ranked by metrics (APR, TVL, etc.)
   - `get_filtered_pools`: Get pools filtered by specific criteria

2. Trading Operations

   - `get_pool_spot_price`: Get spot price between tokens
   - `get_trade_amount_out`: Calculate expected output for a trade
   - `get_trade_route`: Find optimal route for a trade
   - `get_deposit_transaction`: Generate deposit transaction
   - `get_withdraw_transaction`: Generate withdrawal transaction

3. Staking Operations
   - `get_staking_positions`: Get staking positions for a wallet
   - `get_sui_tvl`: Get total SUI TVL in staking
   - `get_afsui_exchange_rate`: Get afSUI to SUI exchange rate
   - `get_stake_transaction`: Generate staking transaction

### Configuration

The Aftermath integration uses the following environment variables:

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

Integration tests are available in `src/tests/aftermath.test.ts`. To run the tests:

```bash
npm test -- aftermath.test.ts
```

Make sure to set the required environment variables before running tests.
