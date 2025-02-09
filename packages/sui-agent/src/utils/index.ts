import { randomUUID } from 'crypto';
import { AtomaSDK } from 'atoma-sdk';
import Atoma from '../config/atoma';
import Tools from './tools';
import { ToolArgument } from '../@types/interface';

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
    selectedTool: string | null,
    toolArguments: ToolArgument[] = [],
  ) {
    try {
      if (!selectedTool) {
        return this.finalAnswer(
          AtomaInstance,
          'No tool selected for the query',
          query,
        );
      }

      return this.executeTools(selectedTool, toolArguments, AtomaInstance);
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
    AtomaInstance: Atoma,
    response: string,
    query: string,
    tools?: string,
  ) {
    const finalPrompt = this.prompt
      .replace('${query}', query)
      .replace('${response}', response)
      .replace('tools', `${tools || null}`);

    // const finalAns = await new AtomaSDK({bearerAuth:'bearer auth here'}).chat.create({
    //   messages: [
    //     {role:"assistant",content:finalPrompt},
    //   //  { role: "user", content: query }
    //   ],
    //   model: "meta-llama/Llama-3.3-70B-Instruct"
    // });

    const finalAns = await AtomaInstance.atomaChat([
      { role: 'assistant', content: finalPrompt },
      { role: 'user', content: query },
    ]);
    console.log('new one');

    // const finalAns = await atomaChat(this.sdk, [
    //   {
    //     content: finalPrompt,
    //     role: 'assistant',
    //   },
    // ]);
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
  private async executeTools(
    selected_tool: string,
    args: ToolArgument[] | null,
    AtomaInstance: Atoma,
  ) {
    const tool = this.tools.getAllTools().find((t) => t.name === selected_tool);
    console.log('Selected tool:', selected_tool);
    console.log('Tool arguments:', args);

    if (!tool) {
      throw new Error(`Tool ${selected_tool} not found`);
    }

    try {
      const toolArgs = args || [];
      const result = await tool.process(...toolArgs);
      return await this.finalAnswer(AtomaInstance, result, '', selected_tool);
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
