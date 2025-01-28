import { randomUUID } from 'crypto';
import { AtomaSDK } from 'atoma-sdk';
import { atomaChat } from '../config/atoma';
import Tools from '../tools/aftermath';
import { IntentAgentResponse } from '../@types/interface';

/**
 * Utility class for processing agent responses and making decisions
 * Handles the execution of tools and formatting of final responses
 */
class Utils {
  private tools: Tools;
  private sdk: AtomaSDK;
  private prompt: string;

  constructor(bearerAuth: string, prompt: string) {
    this.tools = new Tools(bearerAuth, prompt);
    this.sdk = new AtomaSDK({ bearerAuth });
    this.prompt = prompt;
  }

  /**
   * Process user query and execute appropriate tool
   * @param query - User query
   * @returns Processed response
   */
  async processQuery(query: string): Promise<any> {
    try {
      const selectedTool = await this.tools.selectAppropriateTool(query);
      if (!selectedTool) {
        return this.finalAnswer('No tool found for the query', query);
      }

      return this.executeTools(
        selectedTool.selected_tool || '',
        selectedTool.tool_arguments || [],
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
   * Format final answer
   * @param response - Raw response
   * @param query - Original query
   * @param tools - Tools used
   * @returns Formatted response
   * @private
   */
  private async finalAnswer(
    response: string,
    query: string,
    tools?: string,
  ): Promise<any> {
    const finalPrompt = this.prompt
      .replace('${query}', query)
      .replace('${response}', response)
      .replace('tools', `${tools || null}`);

    const finalAns: any = await atomaChat(this.sdk, [
      {
        content: finalPrompt,
        role: 'assistant',
      },
    ]);
    const res = finalAns.choices[0].message.content;
    console.log(finalPrompt);
    return JSON.parse(res);
  }

  /**
   * Executes selected tools with provided arguments
   * @param selected_tool - Name of the tool to execute
   * @param args - Arguments to pass to the tool
   * @returns Processed tool response
   * @private
   */
  private async executeTools(selected_tool: string, args: any[] | null) {
    const tool = this.tools.getAllTools().find((t) => t.name === selected_tool);
    console.log('Selected tool:', selected_tool);
    console.log('Tool arguments:', args);

    if (!tool) {
      throw new Error(`Tool ${selected_tool} not found`);
    }

    try {
      const toolArgs = args || [];
      const result = await tool.process(...toolArgs);
      return await this.finalAnswer(result, '', selected_tool);
    } catch (error: unknown) {
      console.error('Error executing tool:', error);
      return handleError(error, {
        reasoning: `The system encountered an issue while executing the tool ${selected_tool}`,
        query: `Attempted to execute ${selected_tool} with arguments: ${JSON.stringify(args)}`,
      });
    }
  }
}

export default Utils;

/**
 * Define custom error type for structured error responses
 */
export type StructuredError = {
  reasoning: string;
  response: string;
  status: 'failure';
  query: string;
  errors: string[];
};

/**
 * Type guard for Error objects
 */
export function isError(error: unknown): error is Error {
  return error instanceof Error;
}

/**
 * Generic error handler that creates a structured error response
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
