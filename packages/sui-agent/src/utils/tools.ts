import { Tool, toolResponse } from '../@types/interface';
import { atomaChat } from '../config/atoma';
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
  async selectAppropriateTool(query: string): Promise<toolResponse | null> {
    const finalPrompt = this.prompt.replace(
      '${toolsList}',
      JSON.stringify(this.getAllTools()),
    );

    const response = await atomaChat(this.sdk, [
      {
        content: finalPrompt,
        role: 'system',
      },
      {
        content: query || '',
        role: 'user',
      },
    ]);

    // Handle the response based on the IntentAgentResponse interface
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

//   tools.registerTool("Tool 1", "Description of Tool 1", () => {
//     return "Tool 1 has been processed successfully.";
//   });
//   tools.registerTool("Tool 2", "Description of Tool 2", () => {
//     return "Tool 2 has been processed successfully.";
//   });
//   tools.registerTool("Tool 3", "Description of Tool 3", () => {
//     return "Tool 3 has been processed successfully.";
//   });

//   // Selecting a tool based on query
//   const query = "Tool 1";
//   const selectedTool = tools.selectAppropriateTool(query);

//   if (selectedTool) {
//     console.log(`Selected Tool: ${selectedTool.name}`);
//     const result = selectedTool.process(); // Running the tool's process method
//     console.log(result); // Output similar format for all tools
//   } else {
//     console.log("No tool found for the query.");
//   }
