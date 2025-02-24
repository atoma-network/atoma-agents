import { Tool, toolResponse } from '../@types/interface';
import Atoma from '../config/atoma';
import { AtomaSDK } from 'atoma-sdk';

/**
 * Main tools management class that serves as a registry and orchestrator for all available tools.
 * This class is responsible for:
 * - Tool registration and management
 * - Tool selection based on user queries
 * - Tool execution coordination
 *
 * Tools are the primary way the agent interacts with external systems and performs actions.
 * Each tool represents a specific capability (e.g., checking prices, executing trades, etc.)
 */
class Tools {
  private tools: Tool[] = [];
  private prompt: string;
  private sdk: AtomaSDK;

  /**
   * Creates a new Tools instance with authentication and prompt template
   *
   * @param bearerAuth - Authentication token for API access
   * @param prompt - Template prompt for tool selection
   */
  constructor(bearerAuth: string, prompt: string) {
    this.prompt = prompt;
    this.sdk = new AtomaSDK({ bearerAuth });
  }

  /**
   * Registers a new tool in the tool registry.
   * Each tool must have a unique name and well-defined parameters.
   *
   * @param name - Unique identifier for the tool
   * @param description - Detailed description of tool's functionality
   * @param parameters - Array of parameter definitions for the tool
   * @param process - Function that implements the tool's logic
   */
  registerTool(
    name: string,
    description: string,
    parameters: {
      name: string;
      type: string;
      description: string;
      required: boolean;
    }[],
    process: (
      ...args: (string | number | boolean | bigint)[]
    ) => Promise<string> | string,
  ) {
    // TODO: Add validation for duplicate tool names
    // TODO: Validate parameter definitions
    this.tools.push({ name, description, parameters, process });
  }

  /**
   * Intelligently selects appropriate tools based on user query using LLM.
   * Uses the Atoma LLM to analyze the query and match it with available tools.
   *
   * The selection process:
   * 1. Formats the prompt with available tools
   * 2. Sends query to LLM for analysis
   * 3. Parses and validates the response
   * 4. Returns selected tools with their arguments
   *
   * @param AtomaClass - Instance of Atoma for LLM access
   * @param query - User's query to analyze
   * @param walletAddress - Optional wallet address for context
   * @returns Array of tool responses or null if no suitable tools found
   */
  async selectAppropriateTool(
    AtomaClass: Atoma,
    query: string,
    walletAddress?: string,
  ): Promise<toolResponse[] | null> {
    const finalPrompt = this.prompt.replace(
      '${toolsList}',
      JSON.stringify(this.getAllTools()),
    );

    const promptWithAddr = walletAddress
      ? `${finalPrompt}.Wallet address is ${walletAddress}.`
      : finalPrompt;

    const response = await AtomaClass.atomaChat([
      { role: 'assistant', content: promptWithAddr },
      { role: 'user', content: query },
    ]);

    if (
      response &&
      'choices' in response &&
      response.choices[0]?.message?.content
    ) {
      console.log(response.choices[0].message.content);
      const parsedContent = JSON.parse(response.choices[0].message.content);
      if (Array.isArray(parsedContent) && parsedContent.length > 0) {
        return parsedContent as toolResponse[];
      }
    }
    return null;
  }

  /**
   * Retrieves all registered tools in the registry.
   * Used for tool selection and management purposes.
   *
   * @returns Array of all registered Tool objects
   */
  getAllTools(): Tool[] {
    return this.tools;
  }
}

export default Tools;
