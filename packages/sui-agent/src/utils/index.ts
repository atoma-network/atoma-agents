import { randomUUID } from 'crypto';
import { AtomaSDK } from 'atoma-sdk';
import Atoma from '../config/atoma';
import Tools from './tools';
import { IntentAgentResponse, ToolArgument } from '../@types/interface';

/**
 * Core utility class for processing agent responses and orchestrating tool execution.
 * This class serves as the central coordinator for:
 * 1. Query Processing - Executes tools based on intent analysis
 * 2. Response Aggregation - Combines results from multiple tools
 * 3. Error Handling - Manages failures and generates structured errors
 *
 * The class implements a robust pipeline for:
 * - Tool execution and coordination
 * - Response formatting and standardization
 * - Error recovery and reporting
 */
class Utils {
  private sdk: AtomaSDK;
  private prompt: string;
  private tools: Tools;

  /**
   * Creates a new Utils instance with authentication and prompt template.
   *
   * @param bearerAuth - Authentication token for API access
   * @param prompt - Template for final answer generation
   * @param tools - Optional Tools instance for execution
=   */
  constructor(bearerAuth: string, prompt: string, tools?: Tools) {
    this.sdk = new AtomaSDK({ bearerAuth });
    this.prompt = prompt;
    // Use provided tools instance or create new one
    this.tools = tools || new Tools(bearerAuth, prompt);
  }

  /**
   * Updates the tools instance used for execution.
   *
   * @param tools - New Tools instance to use
   *
   * TODO:
   * - Implement graceful tool transition
   */
  setTools(tools: Tools) {
    this.tools = tools;
  }

  /**
   * Processes user queries by executing appropriate tools and aggregating results.
   * Core orchestration method that:
   * 1. Validates intent responses
   * 2. Executes selected tools
   * 3. Aggregates results
   * 4. Generates final response
   *
   * @param AtomaInstance - Instance of Atoma for LLM access
   * @param query - Original user query
   * @param intentResponses - Array of tool selection responses
   * @returns Processed and formatted final response
   *
   * TODO:
   * - Implement parallel tool execution
   * - Implement progressive response streaming
   * - Add execution timeouts
   * - Implement response quality validation
   */
  async processQuery(
    AtomaInstance: Atoma,
    query: string,
    intentResponses: IntentAgentResponse[],
  ) {
    try {
      if (!intentResponses || intentResponses.length === 0) {
        return this.finalAnswer(
          AtomaInstance,
          'No tools selected for the query',
          query,
        );
      }

      let aggregatedResults = '';

      for (const response of intentResponses) {
        const { selected_tools, tool_arguments } = response;

        if (!selected_tools?.length) {
          continue; // Skip if no tool selected
        }
        console.log(selected_tools, 'selected tools /...');
        // Execute the tool and append its result
        const result = await this.executeTools(selected_tools, tool_arguments);

        // Aggregate results (you might want to customize this based on your needs)
        aggregatedResults += result + '\n';
      }

      // If no tools were successfully executed
      if (!aggregatedResults) {
        return this.finalAnswer(
          AtomaInstance,
          'No valid tools were executed for the query',
          query,
        );
      }

      // Return final answer with aggregated results
      return this.finalAnswer(
        AtomaInstance,
        aggregatedResults.trim(),
        query,
        intentResponses.map((r) => r.selected_tools).join(', '),
      );
    } catch (error: unknown) {
      console.error('Error processing query:', error);
      return handleError(error, {
        reasoning:
          'The system encountered an issue while processing your query',
        query,
      });
    }
  }

  /**
   * Executes selected tools with provided arguments.
   * Handles tool lookup and execution with error management.
   *
   * @param selected_tool - Array of tool names to execute
   * @param args - Arguments to pass to the tools
   * @returns Tool execution result
   *
   * TODO:
   * - Implement retry mechanism
   * - Implement tool execution timeouts
   * - Implement execution metrics
   */
  private async executeTools(
    selected_tool: string[],
    args: ToolArgument[] | null,
  ) {
    const tool = this.tools
      .getAllTools()
      .find((t) => t.name.trim() === selected_tool[0]);

    if (!tool) {
      throw new Error(`Tool ${selected_tool} not found`);
    }

    try {
      const toolArgs = args || [];
      const result = await tool.process(...toolArgs);
      return result;
    } catch (error: unknown) {
      console.error('Error executing tool:', error);
      throw error; // Let the main processQuery handle the error
    }
  }

  /**
   * Generates the final answer using the Atoma LLM.
   * Formats and structures the response according to the template.
   *
   * @param AtomaInstance - Instance of Atoma for LLM access
   * @param response - Raw response to format
   * @param query - Original user query
   * @param tools - Optional tools used in processing
   * @returns Formatted and structured final response
   *
   * TODO:
   * - Implement response quality checks
   */
  private async finalAnswer(
    AtomaInstance: Atoma,
    response: string,
    query: string,
    tools?: string,
  ) {
    const finalPrompt = this.prompt
      .replace('${query}', query)
      .replace('${response}', response)
      .replace('tools', `${tools || null}`);

    const finalAns = await AtomaInstance.atomaChat([
      { role: 'assistant', content: finalPrompt },
      { role: 'user', content: query },
    ], process.env.ATOMA_CHAT_COMPLETIONS_MODEL);

    const res = finalAns.choices[0].message.content;
    const parsedRes = JSON.parse(res);
    console.log(parsedRes, 'parsed response');
    return parsedRes;
  }
}

export default Utils;

/**
 * Structured error type for consistent error reporting.
 * Ensures all errors follow a standard format with:
 * - Reasoning for the error
 * - Error response message
 * - Failure status indicator
 * - Original query context
 * - Detailed error information
 *
 * TODO:
 * - Add error categorization
 * - Implement error severity levels
 * - Add support for error recovery hints
 */
export type StructuredError = {
  reasoning: string;
  response: string;
  status: 'failure';
  query: string;
  errors: string[];
};

/**
 * Type guard for Error objects.
 * Ensures type safety when handling unknown error types.
 *
 * @param error - Unknown error object to check
 * @returns Type predicate indicating if error is Error instance
 */
export function isError(error: unknown): error is Error {
  return error instanceof Error;
}

/**
 * Generic error handler for creating structured error responses.
 * Provides consistent error formatting and unique error IDs.
 *
 * Features:
 * - Unique error identification
 * - Consistent error structure
 * - Error type normalization
 * - Context preservation
 *
 * @param error - The error to handle
 * @param context - Error context including reasoning and query
 * @returns Structured error response
 *
 * TODO:
 * - Add error categorization
 * - Implement error recovery suggestions
 * - Add error tracking integration
 * - Implement error rate limiting
 * - Add support for error aggregation
 */
export function handleError(
  error: unknown,
  context: {
    reasoning: string;
    query: string;
  },
): StructuredError {
  const errorId = randomUUID();

  let errorMessage: string;
  if (isError(error)) {
    errorMessage = error.message;
  } else if (typeof error === 'string') {
    errorMessage = error;
  } else {
    errorMessage = 'Unknown error occurred';
  }

  return {
    reasoning: context.reasoning,
    response: 'Operation unsuccessful',
    status: 'failure',
    query: context.query,
    errors: [`Error ID: ${errorId} - ${errorMessage}`],
  };
}
