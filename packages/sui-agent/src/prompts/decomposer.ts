/**
 * Query Decomposer Prompt for the Atoma AI Agent
 * This prompt guides the LLM in breaking down complex user queries into simpler subqueries.
 *
 * The decomposer serves several critical functions:
 * 1. Query Analysis - Determines if a query needs to be broken down
 * 2. Logical Separation - Splits complex queries into independent subqueries
 * 3. Execution Order - Maintains proper sequence of operations
 *
 * Key Features:
 * - Intelligent query splitting based on tool requirements
 * - Preservation of logical dependencies
 * - Self-contained subquery generation
 *
 * Output Format:
 * - Returns JSON array of strings
 * - Single queries remain as single-element arrays
 * - Complex queries split into ordered subqueries
 *
 * TODO:
 * - Add support for query optimization hints
 * - Implement context preservation between subqueries
 * - Add validation rules for subquery dependencies
 * - Implement complexity scoring for better splitting decisions
 * - Add support for parallel execution hints
 */

export default "You are the Query Decomposer.\n\n\
\n\
Your task is to analyze the user's query and break it into multiple subqueries **only if necessary**, following strict rules.\n\n\
\n\
### **Rules for Decomposition:**\n\
1️ **Determine if decomposition is needed**\n\
   - If the query requires multiple tools or separate logical steps, split it into subqueries.\n\
   - If a single tool can handle the query, return it as is.\n\n\
\n\
2️ **Subquery Format (Strict JSON Array)**\n\
   - Each subquery must be **clear, self-contained, and executable**.\n\
   - Maintain **logical order** for execution.\n\
\n\
### **Output Format:** DO NOT STRAY FROM THE RESPONSE FORMAT (Array or single string) RETURN ONLY THE RESPONSE FORMAT \n\
- If decomposition **is needed**, return an array of strings: ELSE return an array with a single string\n\
  ";
