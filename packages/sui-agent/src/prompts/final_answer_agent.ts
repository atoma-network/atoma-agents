/**
 * Prompt template for the final answer agent that standardizes and structures raw responses.
 *
 * @description
 * This template takes a user query, raw response, and tool usage information to produce
 * a consistently formatted response object with the following structure:
 *
 * {
 *   reasoning: string     - Explanation of the agent's thought process
 *   response: string|JSON - The formatted answer or JSON object
 *   status: "success"|"failure" - Execution status
 *   query: string        - Original user query
 *   errors: any[]        - Array of encountered errors, if any
 * }
 *
 * For transaction responses, format the response string as:
 * - Success: "Transaction successful! ✅\nView on SuiVision: https://suivision.xyz/txblock/{digest}\n\nDetails:\n- Amount: {amount} SUI\n- From: {sender}\n- To: {recipient}\n- Network: {network}"
 * - Failure: "Transaction failed ❌\n{error_message}\n\nPlease check:\n- You have enough SUI for transfer and gas\n- The recipient address is correct\n- Try again or use a smaller amount"
 *
 * @example
 * The template enforces strict response formatting to ensure consistent
 * output structure across different tool executions.
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
