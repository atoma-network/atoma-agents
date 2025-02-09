import { Tool, toolResponse } from '../@types/interface';
import Atoma from '../config/atoma';
import { AtomaSDK } from 'atoma-sdk';

/**
 * Main tools management class
 * Handles registration and selection of tools for processing user queries
 */
class Tools {
  private tools: Tool[] = [];
  private prompt: string;
  private sdk: AtomaSDK;

  constructor(bearerAuth: string, prompt: string) {
    this.prompt = prompt;
    this.sdk = new AtomaSDK({ bearerAuth });
  }

  /**
   * Register a new tool
   * @param name - Tool name
   * @param description - Tool description
   * @param parameters - Tool parameters
   * @param process - Tool process function
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
    this.tools.push({ name, description, parameters, process });
  }

  /**
   * Select appropriate tool based on user query
   * @param query - User query
   * @returns Selected tool response or null if no tool found
   */
  async selectAppropriateTool(
    AtomaClass: Atoma,
    query: string,
    walletAddress?: string,
  ): Promise<toolResponse | null> {
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
      const parsedContent = JSON.parse(response.choices[0].message.content);
      if (Array.isArray(parsedContent) && parsedContent.length > 0) {
        return parsedContent[0] as toolResponse;
      }
    }

    return null;
  }

  /**
   * Get list of all registered tools
   * @returns Array of registered tools
   */
  getAllTools(): Tool[] {
    return this.tools;
  }
}

export default Tools;
