import {
  MarketSymbol,
  ORDER_SIDE,
  ORDER_TYPE,
  TIME_IN_FORCE,
  ORDER_STATUS,
} from '@bluefin-exchange/bluefin-v2-client';

export interface BluefinConfig {
  network: 'mainnet' | 'testnet' | 'devnet';
  isTermAccepted: boolean;
}

export interface BluefinOrderParams {
  symbol: MarketSymbol;
  side: ORDER_SIDE;
  type: ORDER_TYPE;
  price?: number;
  quantity: number;
  timeInForce?: TIME_IN_FORCE;
  leverage?: number;
}

export interface BluefinPositionParams {
  symbol: MarketSymbol;
  leverage?: number;
}

export interface BluefinMarginParams {
  symbol: MarketSymbol;
  amount: number;
  isDeposit: boolean;
}

export interface BluefinCancelOrderParams {
  symbol: MarketSymbol;
  orderId?: string;
  cancelAll?: boolean;
}

export interface BluefinUserDataParams {
  symbol?: MarketSymbol;
  parentAddress?: string;
  statuses?: ORDER_STATUS[];
}

export interface BluefinMarketDataParams {
  symbol?: MarketSymbol;
  limit?: number;
}
