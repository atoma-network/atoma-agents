# Bluefin Protocol Integration

This module provides integration with the Bluefin decentralized derivatives exchange on Sui Network.

## Features

- Order Management
  - Place orders (market/limit)
  - Cancel orders
  - Get user orders
- Position Management
  - Adjust leverage
  - Adjust margin
  - Get user positions
- Market Data
  - Get orderbook
  - Get market data

## Tools

### Order Management

#### `place_bluefin_order`

Place a new order on Bluefin.

Parameters:

- `symbol` (string, required): Trading pair symbol
- `side` (string, required): Order side (BUY/SELL)
- `type` (string, required): Order type (LIMIT/MARKET)
- `quantity` (number, required): Order quantity
- `price` (number, optional): Order price (required for LIMIT orders)
- `leverage` (number, optional): Position leverage

#### `cancel_bluefin_order`

Cancel an existing order on Bluefin.

Parameters:

- `symbol` (string, required): Trading pair symbol
- `order_id` (string, optional): Order ID to cancel
- `cancel_all` (boolean, optional): Cancel all open orders

### Position Management

#### `adjust_bluefin_position`

Adjust position leverage on Bluefin.

Parameters:

- `symbol` (string, required): Trading pair symbol
- `leverage` (number, required): New leverage value

#### `adjust_bluefin_margin`

Add or remove margin from a position.

Parameters:

- `symbol` (string, required): Trading pair symbol
- `amount` (number, required): Amount to add/remove
- `is_deposit` (boolean, required): True for deposit, false for withdrawal

### Market Data

#### `get_bluefin_orderbook`

Get the orderbook for a trading pair.

Parameters:

- `symbol` (string, required): Trading pair symbol

#### `get_bluefin_market_data`

Get market data for a trading pair.

Parameters:

- `symbol` (string, optional): Trading pair symbol

### User Data

#### `get_bluefin_user_positions`

Get user's open positions.

Parameters:

- `symbol` (string, optional): Trading pair symbol
- `parent_address` (string, optional): Parent address

#### `get_bluefin_user_orders`

Get user's orders.

Parameters:

- `symbol` (string, optional): Trading pair symbol
- `parent_address` (string, optional): Parent address

## Usage Example

```typescript
// Initialize the protocol
const bluefinProtocol = new BluefinProtocol(provider, keypair, {
  network: 'mainnet',
  isTermAccepted: true,
});

// Place a market order
await tools.execute('place_bluefin_order', [
  'BTC-PERP', // symbol
  'BUY', // side
  'MARKET', // type
  1.0, // quantity
]);

// Get user positions
await tools.execute('get_bluefin_user_positions', [
  'BTC-PERP', // symbol
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

- @bluefin-exchange/bluefin-v2-client: ^6.1.29
- @mysten/sui: ^1.1.0
