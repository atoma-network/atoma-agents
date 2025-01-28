I'll provide sample requests for all the tools available in the registry. Here are the example requests for each category:

### Price Tools

1. **Get Single Coin Price**:

```json
POST http://localhost:2512/query
{
    "prompt": "What is the current price of SUI?"
}
```

2. **Get Multiple Coin Prices**:

```json
POST http://localhost:2512/query
{
    "prompt": "Show me the prices for SUI, USDC, and CERT"
}
```

### APR Tools

3. **Get Token APR**:

```json
POST http://localhost:2512/query
{
    "prompt": "What is the APR for token 0x123...abc?"
}
```

### Pool Tools

4. **Get Single Pool Info**:

```json
POST http://localhost:2512/query
{
    "prompt": "Show me details for pool 0x456...def"
}
```

5. **Get All Pools**:

```json
POST http://localhost:2512/query
{
    "prompt": "List all available pools"
}
```

6. **Get Pool Events**:

```json
POST http://localhost:2512/query
{
    "prompt": "Show me the last 5 deposit events for pool 0x789...ghi"
}
```

### Pool Ranking Tools

7. **Get Ranked Pools by APR**:

```json
POST http://localhost:2512/query
{
    "prompt": "Show me the top 10 pools by APR in descending order"
}
```

8. **Get Ranked Pools by TVL**:

```json
POST http://localhost:2512/query
{
    "prompt": "What are the top 5 pools with highest TVL?"
}
```

9. **Get Filtered Pools**:

```json
POST http://localhost:2512/query
{
    "prompt": "Find pools with minimum TVL of 100000 and APR above 5% that contain SUI and USDC"
}
```

### Trade Tools

10. **Get Spot Price**:

```json
POST http://localhost:2512/query
{
    "prompt": "What is the spot price of SUI to USDC in pool 0xabc...123 including fees?"
}
```

11. **Get Trade Amount Out**:

```json
POST http://localhost:2512/query
{
    "prompt": "How much USDC will I get if I trade 100 SUI in pool 0xdef...456?"
}
```

12. **Get Trade Route**:

```json
POST http://localhost:2512/query
{
    "prompt": "Find the best route to trade 50 SUI for CERT"
}
```

13. **Get Deposit Transaction**:

```json
POST http://localhost:2512/query
{
    "prompt": "Generate a deposit transaction for pool 0xghi...789 to deposit 100 SUI and 1000 USDC from wallet 0xjkl...012 with 1% slippage"
}
```

14. **Get Withdraw Transaction**:

```json
POST http://localhost:2512/query
{
    "prompt": "Generate a withdrawal transaction for pool 0xmno...345 to withdraw from wallet 0xpqr...678, burning 50 LP tokens with 0.5% slippage"
}
```
