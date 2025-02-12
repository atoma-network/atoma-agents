# Navi Protocol Integration

This module provides integration with the Navi perpetual trading protocol on Sui Network.

## Features

- Order Management
  - Place orders (market/limit)
  - Cancel orders
  - Get user orders
- Position Management
  - Open positions
  - Close positions
  - Get user positions
  - Adjust leverage
  - Adjust margin
- Market Data
  - Get orderbook
  - Get market data
  - Get funding rates
- Account Management
  - Get account info
  - Get account balance
  - Get account positions

## Tools

### Order Management

#### `place_navi_order`

Place a new order on Navi.

Parameters:

- `symbol` (string, required): Trading pair symbol (e.g., "BTC-PERP")
- `side` (string, required): Order side ("BUY" or "SELL")
- `type` (string, required): Order type ("MARKET" or "LIMIT")
- `quantity` (number, required): Order quantity
- `price` (number, optional): Order price (required for LIMIT orders)
- `leverage` (number, optional): Position leverage

#### `cancel_navi_order`

Cancel an existing order on Navi.

Parameters:

- `symbol` (string, required): Trading pair symbol
- `order_id` (string, required): Order ID to cancel

### Position Management

#### `adjust_navi_position`

Adjust position leverage on Navi.

Parameters:

- `symbol` (string, required): Trading pair symbol
- `leverage` (number, required): New leverage value

#### `adjust_navi_margin`

Add or remove margin from a position.

Parameters:

- `symbol` (string, required): Trading pair symbol
- `amount` (number, required): Amount to add/remove
- `is_add` (boolean, required): True for adding margin, false for removing

### Market Data

#### `get_navi_orderbook`

Get the orderbook for a trading pair.

Parameters:

- `symbol` (string, required): Trading pair symbol

#### `get_navi_market_data`

Get market data for a trading pair.

Parameters:

- `symbol` (string, required): Trading pair symbol

### Account Management

#### `get_navi_account_info`

Get account information.

Parameters:

- `account_address` (string, required): Account address

## Usage Example

```typescript
// Place a market order
await tools.execute('place_navi_order', [
  'BTC-PERP', // symbol
  'BUY', // side
  'MARKET', // type
  1.0, // quantity
]);

// Get account positions
await tools.execute('get_navi_account_info', [
  '0x1234...', // account_address
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

- @mysten/sui: ^1.1.0
- Other Navi-specific dependencies
