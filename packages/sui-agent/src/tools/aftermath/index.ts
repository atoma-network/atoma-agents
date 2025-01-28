import { Tool, toolResponse } from '../../@types/interface';
import { atomaChat } from '../../config/atoma';
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
    process: (...args: any[]) => any,
  ) {
    this.tools.push({ name, description, parameters, process });
  }

  /**
   * Convert tool parameters to OpenAI function parameters format
   * @param parameters - Tool parameters
   * @returns OpenAI function parameters format
   */
  private convertToFunctionParameters(parameters: Tool['parameters']) {
    const properties: Record<string, any> = {};
    const required: string[] = [];

    parameters.forEach((param) => {
      properties[param.name] = {
        type: param.type,
        description: param.description,
      };
      if (param.required) {
        required.push(param.name);
      }
    });

    return {
      type: 'object',
      properties,
      required: required.length > 0 ? required : undefined,
    };
  }

  /**
   * Convert registered tools to OpenAI function format
   * @returns Array of functions in OpenAI format
   */
  private getToolsAsFunctions() {
    return this.tools.map((tool) => ({
      name: tool.name,
      description: tool.description,
      parameters: this.convertToFunctionParameters(tool.parameters),
    }));
  }

  /**
   * Select appropriate tool based on user query
   * @param query - User query
   * @returns Selected tool response or null if no tool found
   */
  async selectAppropriateTool(query: string): Promise<toolResponse | null> {
    const functions = this.getToolsAsFunctions();

    const ai: any = await atomaChat(
      this.sdk,
      [
        {
          content: this.prompt,
          role: 'system',
        },
        {
          content: query || '',
          role: 'user',
        },
      ],
      undefined,
      functions,
    );

    const message = ai.choices[0].message;
    if (!message.function_call) {
      return null;
    }

    const selectedTool = this.tools.find(
      (tool) => tool.name === message.function_call.name,
    );
    if (!selectedTool) {
      return null;
    }

    const args = JSON.parse(message.function_call.arguments);
    const toolArgs = selectedTool.parameters.map((param) => args[param.name]);

    return {
      success: true,
      selected_tool: selectedTool.name,
      response: null,
      needs_additional_info: false,
      additional_info_required: null,
      tool_arguments: toolArgs,
    };
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
