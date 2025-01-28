# Atoma Sage

Built on the Sui blockchain and powered by Atoma Network's AI Infrastructure, AtomaSage are sets of extensible Intelligent Layer system for blockchain operations. This project aims to provide a comprehensive solution for interacting with various blockchain protocols through natural language processing.

## Vision

Our goal is to create a full-fledged agent system using the Atoma's distributed AI computation that can handle complex blockchain operations through simple natural language commands. By leveraging AI, we're making blockchain interactions more accessible and intuitive for both developers and users.

## Features

- 🤖 Natural Language Processing for blockchain operations
- 🔄 Protocol-agnostic design (currently supporting Aftermath Finance on Sui)
- 💰 Token price queries and tracking
- 🏊‍♂️ Pool management and analysis
- 📊 APR calculations and tracking
- 💸 Transaction handling
- 🔍 Advanced pool filtering and ranking

## Quick Start

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Basic understanding of blockchain concepts

### Installation

```bash
# Clone the repository
git clone https://github.com/atoma-network/atoma-agents.git

# Install dependencies
cd atoma-agents
npm install

# Start the development server
npm run dev
```

The server will start on port 2512 by default.

## Usage

You can interact with the agent using either cURL or Postman.

### Using cURL

```bash
# Example: Get price of SUI and BTC
curl -X POST http://localhost:2512/query \
  -H "Content-Type: application/json" \
  -d '{"prompt": "what is the price of sui and btc"}'
```

### Using Postman

1. Create a new POST request to `http://localhost:2512/query`
2. Set the Content-Type header to `application/json`
3. In the request body, add your prompt:

```json
{
  "prompt": "what is the price of sui and btc"
}
```

## Sample Prompts

Here are some example prompts you can try:

- "What is the current price of SUI and BTC?"
- "Show me the top 5 pools by TVL"
- "Get pool information for [pool_id]"
- "Send 1 SUI to [wallet_address]"
- "What's the APR for [token_address]?"
- "Show me pools with minimum TVL of $100,000"
- "Deposit 1 SUI into each of the top 5 pools by APR from my wallet [address]"
- "Find the top 3 pools by TVL and deposit 0.5 SUI into each with 0.5% slippage"
- "Deposit 2 SUI each into the top 10 pools by fees using 1% slippage"
- "Withdraw 1000000 LP tokens from pool [pool_id] with 0.5% slippage"
- "Show me the top pools by APR and help me deposit into them"

## Adding New Protocols

The system is designed to be easily extensible. To add a new protocol:

1. Create a new directory under `src/` for your protocol
2. Implement your tool functions following the existing patterns
3. Register your tools in `src/tools/ToolRegistry.ts`

Example structure for adding a new protocol:

```typescript
// src/yourprotocol/YourTool.ts
export async function yourToolFunction(param1: string): Promise<string> {
  // Implementation
}

// In ToolRegistry.ts
tools.registerTool(
  'your_tool_name',
  'Description of what your tool does',
  [
    {
      name: 'param1',
      type: 'string',
      description: 'Description of the parameter',
      required: true
    }
  ],
  yourToolFunction
);
```

## Project Structure

```
atoma-agents/
└── sui-agent/
    ├── types/            # TypeScript type definitions
    └── src/
        ├── app.ts        # Main application entry point
        ├── server.ts     # Server configuration
        ├── tools/        # Tool registry
        |   └── aftermath/    # Aftermath Finance protocol integration
        ├── agents/       # AI agent implementation
        ├── config/       # Configuration files
        ├── prompts/      # AI prompt templates
        ├── routes/
        │   └── v1/      # API route handlers
        ├── transactions/ # Transaction handling
        └── utils/        # Utility functions
```

## Contributing

We welcome contributions! Please see our [Contribution Guide](CONTRIBUTING.md) for details.

## License

This project is licensed under the Apache 2.0 - see the [LICENSE](LICENSE) file for details.

## Support

For support, please open an issue in the GitHub repository or contact the maintainers.

## Roadmap

- [ ] Add support for more Sui protocols like Suilend, Navi, Cetus, BlueFin, AlphaFi etc.
- [ ] Allow the prompt to sequentially compose multiple tools
- [ ] Implement cross-chain operations
- [ ] Add more complex transaction types
- [ ] Improve natural language processing capabilities
- [ ] Add support for batch operations
- [ ] Implement advanced analytics tools

# fishon-atoma-agent-1
