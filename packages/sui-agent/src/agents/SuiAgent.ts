import { IntentAgentResponse } from '../@types/interface';
import Tools from '../utils/tools';
import { registerAllTools } from './ToolRegistry';
import Utils from '../utils';
import intent_agent_prompt from '../prompts/intent_agent_prompt';
import final_answer_agent_prompt from '../prompts/final_answer_agent';
import Atoma from '../config/atoma';

/**
 * Main agent class that handles intent processing and decision making
 * Coordinates between different agent types to process user queries
 *
 * @example
 * const agent = new Agents("your-bearer-auth-token");
 * const response = await agent.SuperVisorAgent("What is the current price of the Sui token?");
 * console.log(response);
 */
class Agents {
  private tools: Tools;
  private utils: Utils;
  private AtomaClass: Atoma;

  constructor(bearerAuth: string) {
    this.tools = new Tools(bearerAuth, intent_agent_prompt);
    this.AtomaClass = new Atoma(bearerAuth);
    this.utils = new Utils(bearerAuth, final_answer_agent_prompt, this.tools);
    // Register tools when agent is instantiated
    registerAllTools(this.tools);
  }

  /**
   * Processes initial user intent and selects appropriate tools
   * @param prompt - User's input query
   * @returns IntentAgentResponse containing tool selection and processing details
   */
  async IntentAgent(prompt: string, address?: string) {
    const IntentResponse: IntentAgentResponse =
      (await this.tools.selectAppropriateTool(
        this.AtomaClass,
        prompt,
        address,
      )) as IntentAgentResponse;

    return IntentResponse;
  }

  /**
   * Makes decisions based on the intent response and user query
   * @param intentResponse - Response from the IntentAgent
   * @param query - Original user query
   * @returns Processed response after decision making
   */
  async DecisionMakingAgent(
    intentResponse: IntentAgentResponse,
    query: string,
  ) {
    // Pass both the selected tool name and arguments to processQuery
    return await this.utils.processQuery(
      this.AtomaClass,
      query,
      intentResponse.selected_tool,
      intentResponse.tool_arguments,
    );
  }

  /**
   * Main entry point for processing user queries
   * Coordinates between IntentAgent and DecisionMakingAgent
   * @param prompt - User's input query
   * @returns Final processed response
   */
  async SuperVisorAgent(prompt: string, walletAddress?: string) {
    // Process intent
    const res = await this.IntentAgent(prompt, walletAddress);

    // Make decision based on intent
    const finalAnswer = await this.DecisionMakingAgent(res, prompt);
    console.log('Final Answer:', finalAnswer);
    return finalAnswer;
  }
}

export default Agents;
