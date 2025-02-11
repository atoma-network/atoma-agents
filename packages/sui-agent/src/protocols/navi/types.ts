import {
  Sui,
  USDT,
  WETH,
  vSui,
  haSui,
  CETUS,
  NAVX,
  WBTC,
  AUSD,
  wUSDC,
  nUSDC,
  ETH,
  USDY,
  NS,
  LorenzoBTC,
  DEEP,
  FDUSD,
  BLUE,
  BUCK,
  suiUSDT,
} from 'navi-sdk';

export type Liquidation = {
  user: string;
  liquidation_sender: string;
};

export type NaviPool = {
  pool_id: string;
  token_a: {
    address: string;
    decimals: number;
    symbol: string;
  };
  token_b: {
    address: string;
    decimals: number;
    symbol: string;
  };
  lp_token_addr: string;
  protocol: string;
  dex: string;
  pool_type: string;
  coin_type_a: string;
  coin_type_b: string;
  decimals: number;
  url: string;
};

export type NaviPoolsResponse = {
  pools: NaviPool[];
};

export type {
  Sui,
  USDT,
  WETH,
  vSui,
  haSui,
  CETUS,
  NAVX,
  WBTC,
  AUSD,
  wUSDC,
  nUSDC,
  ETH,
  USDY,
  NS,
  LorenzoBTC,
  DEEP,
  FDUSD,
  BLUE,
  BUCK,
  suiUSDT,
};
