# Suilend Protocol Integration

This module provides integration with the Suilend lending protocol on Sui Network.

## Features

- Lending Market Management
  - Create lending markets
  - Create and configure reserves
  - Update reserve configurations
  - Change reserve price feeds
- Lending Operations
  - Borrow and send funds
  - Repay into obligation
  - Deposit into obligation
  - Withdraw and send to user
  - Deposit liquidity and get CTokens
  - Redeem CTokens and withdraw liquidity
- Reward Management
  - Add rewards
  - Cancel rewards
  - Close rewards
  - Claim rewards and send to user
  - Claim rewards and deposit
- Liquidation
  - Liquidate and redeem positions
- Query Operations
  - Get lending market owner capability ID
  - Get obligation details

## Tools

### Lending Market Management

#### `create_lending_market`

Create a new lending market.

Parameters:

- `registry_id` (string, required): Registry ID
- `lending_market_type` (string, required): Lending market type

#### `create_reserve`

Create a new reserve in a lending market.

Parameters:

- `lending_market_owner_cap_id` (string, required): Lending market owner capability ID
- `pyth_price_id` (string, required): Pyth price feed ID
- `coin_type` (string, required): Coin type
- `config` (object, required): Reserve configuration

### Lending Operations

#### `borrow_and_send`

Borrow and send funds to user.

Parameters:

- `owner_id` (string, required): Owner ID
- `obligation_owner_cap_id` (string, required): Obligation owner capability ID
- `obligation_id` (string, required): Obligation ID
- `coin_type` (string, required): Coin type
- `value` (string, required): Value to borrow

## Usage Example

```typescript
// Initialize the protocol
const client = await suilendClientWrapper();

// Create a lending market
await tools.execute('create_lending_market', [
  'registry123', // registry_id
  'type123', // lending_market_type
]);

// Borrow funds
await tools.execute('borrow_and_send', [
  'owner123', // owner_id
  'cap123', // obligation_owner_cap_id
  'obligation123', // obligation_id
  'sui', // coin_type
  '1000000', // value
]);
```

## Error Handling

All tools return responses in a standardized format:

```typescript
{
  reasoning: string;     // Description of what happened
  response: string;     // The actual response data
  status: string;      // "success" or "failure"
  query: string;       // The original query
  errors: string[];    // Array of error messages if any
}
```

## Dependencies

- @suilend/sdk: Latest version
- @mysten/sui: ^1.1.0
