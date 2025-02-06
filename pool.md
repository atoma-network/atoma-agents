Pools
AMM pools for both stable and uncorrelated assets of variable weights with up to 8 assets per pool.

A comprehensive system for managing liquidity pools, trades, and LP tokens in the Aftermath Finance protocol.

Initialization
Copy
const afSdk = new Aftermath("MAINNET");
await afSdk.init(); // initialize provider

const pools = afSdk.Pools();
Constants
Copy
Pools.constants = {
feePercentages: {
totalProtocol: 0.00005, // 0.005%
treasury: 0.5, // 50% of protocol fees
insuranceFund: 0.3, // 30% of protocol fees
devWallet: 0.2, // 20% of protocol fees
},
referralPercentages: {
discount: 0.05, // 5% of treasury fees
rebate: 0.05, // 5% of treasury fees
},
bounds: {
maxCoinsInPool: 8,
maxTradePercentageOfPoolBalance: 0.3, // 30%
maxWithdrawPercentageOfPoolBalance: 0.3, // 30%
minSwapFee: 0.0001, // 0.01%
maxSwapFee: 0.1, // 10%
minWeight: 0.01, // 1%
maxWeight: 0.99, // 99%
minDaoFee: 0, // 0%
maxDaoFee: 1, // 100%
},
defaults: {
lpCoinDecimals: 9,
},
};
Pool Management Methods
Getting Pool Information
Copy
// Get a single pool
const pool = await pools.getPool({
objectId: "0x...",
});

// Get multiple pools
const somePools = await pools.getPools({
objectIds: ["0x...", "0x..."],
});

// Get all pools
const allPools = await pools.getAllPools();

// Get owned LP coins
const lpCoins = await pools.getOwnedLpCoins({
walletAddress: "0x...",
});
Pool Creation and Publishing
Copy
// Publish new LP coin
const publishTx = await pools.getPublishLpCoinTransaction({
walletAddress: "0x...",
lpCoinDecimals: 9,
});

// Create new pool
const createPoolTx = await pools.getCreatePoolTransaction({
walletAddress: "0x...",
lpCoinType: "0x...",
lpCoinMetadata: {
name: "My Pool LP",
symbol: "MLP",
},
coinsInfo: [
{
coinType: "0x...",
weight: 0.5,
decimals: 9,
tradeFeeIn: 0.003,
initialDeposit: BigInt("1000000000"),
},
],
poolName: "My Pool",
poolFlatness: 0,
createPoolCapId: "0x...",
respectDecimals: true,
});
Pool Information Queries
Copy
// Get pool object ID from LP coin type
const poolId = await pools.getPoolObjectIdForLpCoinType({
lpCoinType: "0x...",
});

// Check if coin type is LP token
const isLp = await pools.isLpCoinType({
lpCoinType: "0x...",
});

// Get 24h volume
const volume = await pools.getTotalVolume24hrs();

// Get pool statistics
const stats = await pools.getPoolsStats({
poolIds: ["0x..."],
});
Pool Class Methods
The Pool class provides methods for interacting with individual pools.

Trading and Liquidity Operations
Copy
const pool = new Pool(poolObject);

// Trade
const tradeTx = await pool.getTradeTransaction({
walletAddress: "0x...",
coinInType: "0x...",
coinInAmount: BigInt("1000000"),
coinOutType: "0x...",
slippage: 0.01,
});

// Deposit
const depositTx = await pool.getDepositTransaction({
walletAddress: "0x...",
amountsIn: {
"0x...": BigInt("1000000"),
},
slippage: 0.01,
});

// Withdraw
const withdrawTx = await pool.getWithdrawTransaction({
walletAddress: "0x...",
amountsOutDirection: {
"0x...": BigInt("1000000"),
},
lpCoinAmount: BigInt("1000000"),
slippage: 0.01,
});

// Multi-coin withdraw
const multiWithdrawTx = await pool.getAllCoinWithdrawTransaction({
walletAddress: "0x...",
lpCoinAmount: BigInt("1000000"),
});
Price and Amount Calculations
Copy
// Get spot price
const spotPrice = pool.getSpotPrice({
coinInType: "0x...",
coinOutType: "0x...",
withFees: true,
});

// Calculate trade output amount
const amountOut = pool.getTradeAmountOut({
coinInType: "0x...",
coinInAmount: BigInt("1000000"),
coinOutType: "0x...",
referral: false,
});

// Calculate trade input amount
const amountIn = pool.getTradeAmountIn({
coinInType: "0x...",
coinOutAmount: BigInt("1000000"),
coinOutType: "0x...",
referral: false,
});

// Calculate LP tokens for deposit
const lpInfo = pool.getDepositLpAmountOut({
amountsIn: {
"0x...": BigInt("1000000"),
},
referral: false,
});
Pool Analytics
Copy
// Get pool statistics
const stats = await pool.getStats();

// Get volume data
const volumeData = await pool.getVolumeData({
timeframe: "1D", // "1D" | "1W" | "1M" | "3M" | "6M" | "1Y"
});

// Get fee data
const feeData = await pool.getFeeData({
timeframe: "1D",
});

// Get 24h volume
const volume24h = await pool.getVolume24hrs();
Types
Pool Types
Copy
interface PoolObject {
name: string;
creator: string;
lpCoinType: string;
lpCoinSupply: bigint;
illiquidLpCoinSupply: bigint;
flatness: bigint;
coins: Record<string, PoolCoin>;
lpCoinDecimals: number;
daoFeePoolObject?: DaoFeePoolObject;
}

interface PoolCoin {
weight: bigint;
balance: bigint;
tradeFeeIn: bigint;
tradeFeeOut: bigint;
depositFee: bigint;
withdrawFee: bigint;
decimalsScalar: bigint;
normalizedBalance: bigint;
decimals?: number;
}

interface PoolStats {
volume: number;
tvl: number;
supplyPerLps: number[];
lpPrice: number;
fees: number;
apr: number;
}
Example Usage
Copy
const afSdk = new Aftermath("MAINNET");
await afSdk.init();
const pools = afSdk.Pools();

// Get a pool
const pool = await pools.getPool({
objectId: "0x...",
});

// Calculate trade output
const amountOut = pool.getTradeAmountOut({
coinInType: "0x2::sui::SUI",
coinOutType:
"0x5d4b302506645c37ff133b98c4b50a5ae14841659738d6d733d59d0d217a93bf::coin::COIN",
coinInAmount: BigInt("1000000000"),
referral: true,
});

// Execute trade
const tradeTx = await pool.getTradeTransaction({
walletAddress: "0x...",
coinInType: "0x2::sui::SUI",
coinInAmount: BigInt("1000000000"),
coinOutType:
"0x5d4b302506645c37ff133b98c4b50a5ae14841659738d6d733d59d0d217a93bf::coin::COIN",
slippage: 0.01,
});
