import { randomUUID } from 'crypto';
import { AtomaSDK } from 'atoma-sdk';
import Atoma from '../config/atoma';
import Tools from './tools';
import { IntentAgentResponse, ToolArgument } from '../@types/interface';

/**
 * Utility class for processing agent responses and making decisions
 * Handles the execution of tools and formatting of final responses
 */
class Utils {
  private sdk: AtomaSDK;
  private prompt: string;
  private tools: Tools;

  constructor(bearerAuth: string, prompt: string, tools?: Tools) {
    this.sdk = new AtomaSDK({ bearerAuth });
    this.prompt = prompt;
    // Use provided tools instance or create new one
    this.tools = tools || new Tools(bearerAuth, prompt);
  }

  /**
   * Set tools instance
   * @param tools - Tools instance to use
   */
  setTools(tools: Tools) {
    this.tools = tools;
  }

  /**
   * Process user query and execute appropriate tool
   * @param query - User query
   * @param selectedTool - Name of the tool to execute
   * @param toolArguments - Arguments to pass to the tool
   * @returns Processed response
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
    ]);

    const res = finalAns.choices[0].message.content;
    const parsedRes = JSON.parse(res);
    console.log(parsedRes, 'parsed response');
    return parsedRes;
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
