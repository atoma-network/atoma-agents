# Atoma Sage

A specialized AI agent for interacting with the Sui blockchain and its protocols, with current support for Aftermath Finance operations.

## Features

### Price Operations

- Get single token prices
- Get multiple token prices in one query
- Price tracking and historical data

### Pool Operations

- Get detailed pool information
- List all available pools
- Get pool events (deposits/withdrawals)
- Rank pools by various metrics (APR, TVL, fees, volume)
- Filter pools by criteria (min TVL, min APR, tokens)

### Trading Operations

- Get spot prices between tokens
- Calculate trade outputs
- Find optimal trade routes
- Generate deposit transactions
- Generate withdrawal transactions

### Transaction Operations

- Transfer single coins
- Multi-coin transfers
- Merge coins
- Estimate gas costs

## Technical Details

### Environment Setup

Create a `.env` file in the `sui-agent` directory with the following variables:

```env
PORT=2512
ATOMASDK_BEARER_AUTH=your_atoma_sdk_auth_token
```

### API Endpoints

#### Query Endpoint

```
POST /query
Content-Type: application/json
```

Request Body:

```json
{
  "prompt": "your natural language query here"
}
```

### Tool Registry

The agent uses a tool registry system for managing different operations. Each tool follows this structure:

```typescript
{
  name: string; // Unique identifier for the tool
  description: string; // What the tool does
  parameters: {
    // Parameters the tool accepts
    name: string;
    type: string;
    description: string;
    required: boolean;
  }
  [];
  process: Function; // The actual implementation
}
```

### Supported Token Types

The agent supports various token types on Sui, including:

- SUI
- USDC
- BTC
- AFSUI
- MSUI
- And many more (see `@types/interface.ts` for full list)

## Example Usage

### Get Token Prices

```bash
curl -X POST http://localhost:2512/query \
  -H "Content-Type: application/json" \
  -d '{"prompt": "what is the current price of SUI and USDC"}'
```

### Get Pool Information

```bash
curl -X POST http://localhost:2512/query \
  -H "Content-Type: application/json" \
  -d '{"prompt": "show me information for pool 0x123... on Cetus Protocol"}'
```

### Get Top Pools

```bash
curl -X POST http://localhost:2512/query \
  -H "Content-Type: application/json" \
  -d '{"prompt": "show me the top 5 pools on Aftermath Finance by APR"}'
```

### Deposit into Top Pools

```bash
# Deposit into top APR pools
curl -X POST http://localhost:2512/query \
  -H "Content-Type: application/json" \
  -d '{"prompt": "deposit 1 SUI into each of the top 5 pools on Aftermath Finance by APR with 1% slippage from my wallet 0x123..."}'

# Deposit into top TVL pools
curl -X POST http://localhost:2512/query \
  -H "Content-Type: application/json" \
  -d '{"prompt": "find the top 3 pools by TVL and deposit 0.5 SUI into each from wallet 0x123... with 0.5% slippage"}'

# Deposit into top fee-generating pools
curl -X POST http://localhost:2512/query \
  -H "Content-Type: application/json" \
  -d '{"prompt": "deposit 2 SUI each into the top 10 pools by fees from my wallet 0x123... using 1% slippage"}'
```

### Withdraw from Pools

```bash
curl -X POST http://localhost:2512/query \
  -H "Content-Type: application/json" \
  -d '{"prompt": "withdraw 1000000 LP tokens from pool 0xabc... using wallet 0x123... with 0.5% slippage"}'
```

### Staking Operations

```bash
# Get staking positions
curl -X POST http://localhost:2512/query \
  -H "Content-Type: application/json" \
  -d '{"prompt": "show me the staking positions for wallet 0x123..."}'

# Get total SUI TVL in staking
curl -X POST http://localhost:2512/query \
  -H "Content-Type: application/json" \
  -d '{"prompt": "what is the total SUI TVL in staking?"}'

# Get afSUI exchange rate
curl -X POST http://localhost:2512/query \
  -H "Content-Type: application/json" \
  -d '{"prompt": "what is the current afSUI to SUI exchange rate?"}'

# Create staking transaction
curl -X POST http://localhost:2512/query \
  -H "Content-Type: application/json" \
  -d '{"prompt": "stake 100 SUI from wallet 0x123... with validator 0xabc..."}'
```

### Transfer Tokens

```bash
curl -X POST http://localhost:2512/query \
  -H "Content-Type: application/json" \
  -d '{"prompt": "transfer 1 SUI from 0xsender to 0xrecipient"}'
```

## Adding New Tools

1. Create a new file in the appropriate directory under `src/`
2. Implement your tool function:

```typescript
export async function yourTool(param1: string): Promise<string> {
  try {
    // Your implementation
    return JSON.stringify([
      {
        reasoning: 'Explanation of what happened',
        response: 'The result',
        status: 'success',
        query: 'Original query',
        errors: [],
      },
    ]);
  } catch (error) {
    return JSON.stringify([
      {
        reasoning: 'What went wrong',
        response: 'Error message',
        status: 'failure',
        query: 'Original query',
        errors: [error.message],
      },
    ]);
  }
}
```

3. Register your tool in `src/tools/ToolRegistry.ts`:

```typescript
tools.registerTool(
  'your_tool_name',
  'Description of your tool',
  [
    {
      name: 'param1',
      type: 'string',
      description: 'Parameter description',
      required: true,
    },
  ],
  yourTool,
);
```

## Error Handling

The agent uses a standardized error response format:

```typescript
{
  reasoning: string;     // Why the error occurred
  response: string;      // User-friendly error message
  status: "failure";     // Error status
  query: string;         // Original query
  errors: string[];      // Array of error messages
}
```

## Dependencies

- aftermath-ts-sdk: Aftermath Finance SDK
- @mysten/sui.js: Sui blockchain interaction
- express: API server
- atoma-sdk: AI capabilities
- typescript: Type safety and development

## Contributing

1. Fork the repository
2. Create your feature branch
3. Implement your changes
4. Add tests if applicable
5. Submit a pull request

## License

Apache License 2.0. See [LICENSE](../LICENSE) for details.

```

```
