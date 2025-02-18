/**
 * Final Answer Agent Prompt for the Atoma AI Agent
 * This prompt template standardizes and structures the agent's responses into a consistent format.
 *
 * The Final Answer Agent serves as the last stage in the processing pipeline:
 * 1. Response Standardization - Ensures consistent output structure
 * 2. Transaction Formatting - Special handling for blockchain transactions
 * 3. Error Management - Proper error reporting and status tracking
 *
 * Response Structure:
 * {
 *   reasoning: string     - Detailed explanation of the agent's logic and decisions
 *   response: string|JSON - Formatted answer or structured JSON data
 *   status: "success"|"failure" - Overall execution status
 *   query: string        - Original user query for context
 *   errors: any[]        - Comprehensive error reporting
 * }
 *
 * Transaction Response Format:
 * Success Template:
 * ```
 * Transaction successful! ✅
 * View on SuiVision: https://suivision.xyz/txblock/{digest}
 *
 * Details:
 * - Amount: {amount} SUI
 * - From: {sender}
 * - To: {recipient}
 * - Network: {network}
 * ```
 *
 * Failure Template:
 * ```
 * Transaction failed ❌
 * {error_message}
 *
 * Please check:
 * - You have enough SUI for transfer and gas
 * - The recipient address is correct
 * - Try again or use a smaller amount
 * ```
 *
 * Key Features:
 * - Consistent response formatting
 * - Human-readable transaction details
 * - Comprehensive error reporting
 * - Network-aware transaction links
 * - Emoji usage for visual status indication
 *
 * TODO:
 * - Add support for response templating
 * - Implement response validation
 * - Add support for multiple transaction types
 * - Implement response localization
 * - Add support for rich media responses
 * - Implement response compression for large datasets
 * - Add support for streaming responses
 */

export default `this is the User query:\${query} and this is what your raw response \${response}. 
\${tools} tools were used.
This is raw and unrefined
Write down the response in this format 

[{
    "reasoning": string, // explain your reasoning in clear terms
    "response": string | JSON // For transactions, use the special transaction format described above. For other responses, provide clear detailed information unless explicitly stated otherwise. IF RESPONSE IS JSON, RETURN IT AS A JSON OBJECT
    "status": string ("success"| "failure") ,// success if no errors
    "query": string ,// initial user query; 
    "errors": any[], //if any
}]

If the response contains a transaction (check for digest or transaction details):
1. Always include the SuiVision link (https://suivision.xyz/txblock/{digest} or https://testnet.suivision.xyz/txblock/{digest} for testnet)
2. Format amounts in human-readable form (e.g., "1 SUI" instead of "1000000000")
3. Use emojis ✅ for success and ❌ for failure
4. Include all transaction details in a clear, readable format

DO NOT UNDER ANY CIRCUMSTANCES STRAY FROM THE RESPONSE FORMAT
RESPOND WITH ONLY THE RESPONSE FORMAT
`;
