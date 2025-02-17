import { Tool, toolResponse } from '../@types/interface';
import {
  EnhancedTool,
  ToolExecutionContext,
  ToolExecutionPlan,
  ToolExecutionResult,
  ToolExecutionStats,
  ToolExecutionSummary,
  ToolArguments,
} from '../@types/tool';
import Atoma from '../config/atoma';

export class ToolManager {
  private tools: Map<string, EnhancedTool>;
  private prompt: string;
  private defaultContext: Required<ToolExecutionContext>;

  constructor(prompt: string, defaultContext: Partial<ToolExecutionContext> = {}) {
    this.tools = new Map();
    this.prompt = prompt;
    this.defaultContext = {
      timestamp: Date.now(),
      priority: 1,
      maxRetries: 3,
      timeout: 30000,
      walletAddress: '',
      chainId: '',
      ...defaultContext,
    };
  }

  /**
   * Register a new enhanced tool
   */
  registerTool(tool: EnhancedTool): void {
    if (this.tools.has(tool.name)) {
      throw new Error(`Tool with name ${tool.name} already exists`);
    }
    this.tools.set(tool.name, tool);
  }

  /**
   * Create an execution plan for multiple tools
   */
  async createExecutionPlan(
    query: string,
    AtomaClass: Atoma,
    context: Partial<ToolExecutionContext> = {},
  ): Promise<ToolExecutionPlan> {
    const toolResponse = await this.selectTools(query, AtomaClass, context.walletAddress);
    if (!toolResponse) {
      throw new Error('No suitable tools found for the query');
    }

    const selectedTools: EnhancedTool[] = [];
    const executionOrder: number[] = [];
    const parallelGroups: number[][] = [];
    let currentGroup: number[] = [];

    // Convert tool names to actual tool instances and determine execution order
    for (let i = 0; i < toolResponse.tools.length; i++) {
      const toolName = toolResponse.tools[i];
      const tool = this.tools.get(toolName);
      
      if (!tool) {
        throw new Error(`Tool ${toolName} not found`);
      }

      selectedTools.push(tool);
      executionOrder.push(i);

      // Group tools that can be executed in parallel
      if (tool.parallelExecutionSupported) {
        currentGroup.push(i);
      } else {
        if (currentGroup.length > 0) {
          parallelGroups.push([...currentGroup]);
          currentGroup = [];
        }
      }
    }

    // Add the last parallel group if it exists
    if (currentGroup.length > 0) {
      parallelGroups.push(currentGroup);
    }

    return {
      tools: selectedTools,
      executionOrder,
      parallelGroups,
      context: { ...this.defaultContext, ...context },
    };
  }

  /**
   * Execute a plan of multiple tools
   */
  async executePlan(plan: ToolExecutionPlan): Promise<ToolExecutionSummary> {
    const startTime = Date.now();
    const stats = new Map<string, ToolExecutionStats>();
    const successfulTools = new Set<string>();
    const failedTools = new Set<string>();

    // Execute tools in parallel groups where possible
    for (let i = 0; i < plan.executionOrder.length; i++) {
      const toolIndex = plan.executionOrder[i];
      const currentTool = plan.tools[toolIndex];
      if (!currentTool) {
        throw new Error(`Tool at index ${toolIndex} not found in execution plan`);
      }

      const parallelGroup = plan.parallelGroups?.find(group => group.includes(toolIndex));

      if (parallelGroup && parallelGroup.length > 0) {
        // Execute parallel group
        const validTools = new Map<number, EnhancedTool>();
        for (const index of parallelGroup) {
          const tool = plan.tools[index];
          if (tool) {
            validTools.set(index, tool);
          }
        }

        if (validTools.size !== parallelGroup.length) {
          throw new Error('Some tools in the parallel group are undefined');
        }

        // Execute all tools in parallel
        const executions = new Map<number, Promise<ToolExecutionResult>>();
        validTools.forEach((tool, index) => {
          executions.set(index, this.executeSingleTool(tool, [], plan.context));
        });

        // Wait for all executions to complete
        const results = await Promise.all(executions.values());
        
        // Process results from parallel execution
        let resultIndex = 0;
        validTools.forEach((tool) => {
          const result = results[resultIndex++];
          if (result.success) {
            successfulTools.add(tool.name);
          } else {
            failedTools.add(tool.name);
          }
          stats.set(tool.name, {
            toolName: tool.name,
            executionTime: result.executionTime || 0,
            success: result.success,
            error: result.error,
            retries: result.retries || 0,
          });
        });

        // Skip the indices we just processed
        i += parallelGroup.length - 1;
      } else {
        // Execute single tool
        const result = await this.executeSingleTool(currentTool, [], plan.context);
        if (result.success) {
          successfulTools.add(currentTool.name);
        } else {
          failedTools.add(currentTool.name);
        }
        stats.set(currentTool.name, {
          toolName: currentTool.name,
          executionTime: result.executionTime || 0,
          success: result.success,
          error: result.error,
          retries: result.retries || 0,
        });
      }
    }

    return {
      totalExecutionTime: Date.now() - startTime,
      successfulTools: Array.from(successfulTools),
      failedTools: Array.from(failedTools),
      stats: Array.from(stats.values()),
    };
  }

  /**
   * Execute a single tool with retries and timeout
   */
  private async executeSingleTool(
    tool: EnhancedTool,
    args: ToolArguments,
    context: ToolExecutionContext,
  ): Promise<ToolExecutionResult> {
    let retries = 0;
    const startTime = Date.now();
    const maxRetries = context.maxRetries ?? this.defaultContext.maxRetries;
    const timeout = context.timeout ?? this.defaultContext.timeout;

    while (retries <= maxRetries) {
      try {
        // Validate input if validator exists
        if (tool.validateInput && !tool.validateInput(args)) {
          throw new Error('Invalid input parameters');
        }

        // Execute with timeout
        const result = await Promise.race([
          tool.execute(args, context),
          new Promise<never>((_, reject) => 
            setTimeout(() => reject(new Error('Execution timeout')), timeout)
          ),
        ]);

        // Transform output if transformer exists
        const transformedResult = tool.transformOutput 
          ? tool.transformOutput(result)
          : result;

        // Ensure the result matches ToolExecutionResult interface
        const finalResult: ToolExecutionResult = {
          success: true,
          data: typeof transformedResult === 'string' ? transformedResult : JSON.stringify(transformedResult),
          executionTime: Date.now() - startTime,
          retries,
        };

        return finalResult;
      } catch (error) {
        retries++;
        if (retries > maxRetries) {
          return {
            success: false,
            data: '',
            error: error instanceof Error ? error.message : String(error),
            executionTime: Date.now() - startTime,
            retries,
          };
        }
        // Wait before retrying with exponential backoff
        await new Promise<void>(resolve => setTimeout(resolve, Math.pow(2, retries) * 1000));
      }
    }

    return {
      success: false,
      data: '',
      error: 'Maximum retries exceeded',
      executionTime: Date.now() - startTime,
      retries,
    };
  }

  /**
   * Select appropriate tools based on user query
   */
  private async selectTools(
    query: string,
    AtomaClass: Atoma,
    walletAddress?: string,
  ): Promise<toolResponse | null> {
    const finalPrompt = this.prompt.replace(
      '${toolsList}',
      JSON.stringify(Array.from(this.tools.values())),
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
   * Get all registered tools
   */
  getAllTools(): Tool[] {
    return Array.from(this.tools.values());
  }
}

export default ToolManager; 