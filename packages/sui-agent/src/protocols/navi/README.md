## Navi Protocol Integration

The Sui Agent includes integration with the Navi Protocol, providing access to Navi's DeFi functionality and perpetual trading features.

### Features

#### Perpetual Trading

- Open and close positions
- Manage leverage and margin
- Monitor position metrics
- Track funding rates

#### Market Data

- Get real-time prices
- View market statistics
- Monitor trading volume
- Track historical data

#### Account Management

- View account positions
- Monitor margin levels
- Track PnL
- Manage collateral

### Example Usage

```typescript
// Initialize the agent
const agent = new Agents(YOUR_BEARER_TOKEN);

// Get market information
const marketInfo = await agent.SuperVisorAgent(
  'Get Navi market information for BTC-PERP',
);

// Open a position
const position = await agent.SuperVisorAgent(
  'Open a long position on Navi BTC-PERP with 5x leverage and 100 USDC as margin',
);

// Check account positions
const positions = await agent.SuperVisorAgent(
  'Get my Navi positions for address 0x123...abc',
);

// Monitor funding rate
const funding = await agent.SuperVisorAgent(
  'Get current funding rate for Navi BTC-PERP market',
);
```

### Supported Operations

1. Trading Operations

   - Open positions with leverage
   - Close positions
   - Adjust position size
   - Modify leverage
   - Set stop loss and take profit

2. Market Operations

   - Get market prices
   - View order book depth
   - Monitor funding rates
   - Track trading volume
   - View market statistics

3. Account Operations
   - View account positions
   - Monitor margin levels
   - Track realized/unrealized PnL
   - Manage collateral deposits/withdrawals

### Configuration

The Navi integration uses the following environment variables:

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

Integration tests are available in `src/tests/navi.test.ts`. To run the tests:

```bash
npm test -- navi.test.ts
```

Make sure to set the required environment variables before running tests.
