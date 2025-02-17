import { ToolManager } from '../agents/ToolManager';
import { EnhancedTool, ToolExecutionResult } from '../@types/tool';
import Atoma from '../config/atoma';

// Mock Atoma class
jest.mock('../config/atoma');

interface MockChatMessage {
  role: string;
  content: string;
}

interface MockChatChoice {
  index: number;
  message: MockChatMessage;
}

interface MockChatResponse {
  id: string;
  created: number;
  model: string;
  choices: MockChatChoice[];
}

// Mock response helper
const createMockResponse = (tools: string[]): MockChatResponse => ({
  id: 'mock-id',
  created: Date.now(),
  model: 'mock-model',
  choices: [
    {
      index: 0,
      message: {
        role: 'assistant',
        content: JSON.stringify([{
          tools,
          reasoning: 'test',
          response: 'test',
          status: 'success',
          query: 'test',
          errors: [],
        }]),
      },
    },
  ],
});

describe('ToolManager', () => {
  let toolManager: ToolManager;
  let mockAtoma: jest.Mocked<Atoma>;

  beforeEach(() => {
    mockAtoma = new Atoma('') as jest.Mocked<Atoma>;
    mockAtoma.atomaChat = jest.fn();
    toolManager = new ToolManager('test prompt');
  });

  describe('Tool Registration', () => {
    it('should register a tool successfully', () => {
      const tool: EnhancedTool = {
        name: 'testTool',
        description: 'Test tool',
        category: 'test',
        version: '1.0.0',
        parameters: [],
        process: async (): Promise<string> => 'result',
        execute: async (): Promise<ToolExecutionResult> => ({ success: true, data: 'result' }),
      };

      toolManager.registerTool(tool);
      const tools = toolManager.getAllTools();
      expect(tools).toHaveLength(1);
      expect(tools[0].name).toBe('testTool');
    });

    it('should throw error when registering duplicate tool', () => {
      const tool: EnhancedTool = {
        name: 'testTool',
        description: 'Test tool',
        category: 'test',
        version: '1.0.0',
        parameters: [],
        process: async (): Promise<string> => 'result',
        execute: async (): Promise<ToolExecutionResult> => ({ success: true, data: 'result' }),
      };

      toolManager.registerTool(tool);
      expect(() => toolManager.registerTool(tool)).toThrow();
    });
  });

  describe('Execution Plan Creation', () => {
    it('should create execution plan for single tool', async () => {
      const tool: EnhancedTool = {
        name: 'testTool',
        description: 'Test tool',
        category: 'test',
        version: '1.0.0',
        parameters: [],
        process: async (): Promise<string> => 'result',
        execute: async (): Promise<ToolExecutionResult> => ({ success: true, data: 'result' }),
      };

      toolManager.registerTool(tool);
      mockAtoma.atomaChat.mockResolvedValue(createMockResponse(['testTool']));

      const plan = await toolManager.createExecutionPlan('test query', mockAtoma);
      expect(plan.tools).toHaveLength(1);
      expect(plan.executionOrder).toHaveLength(1);
    });

    it('should create execution plan for parallel tools', async () => {
      const tool1: EnhancedTool = {
        name: 'tool1',
        description: 'Test tool 1',
        category: 'test',
        version: '1.0.0',
        parameters: [],
        process: async (): Promise<string> => 'result1',
        execute: async (): Promise<ToolExecutionResult> => ({ success: true, data: 'result1' }),
        parallelExecutionSupported: true,
      };

      const tool2: EnhancedTool = {
        name: 'tool2',
        description: 'Test tool 2',
        category: 'test',
        version: '1.0.0',
        parameters: [],
        process: async (): Promise<string> => 'result2',
        execute: async (): Promise<ToolExecutionResult> => ({ success: true, data: 'result2' }),
        parallelExecutionSupported: true,
      };

      toolManager.registerTool(tool1);
      toolManager.registerTool(tool2);
      mockAtoma.atomaChat.mockResolvedValue(createMockResponse(['tool1', 'tool2']));

      const plan = await toolManager.createExecutionPlan('test query', mockAtoma);
      expect(plan.tools).toHaveLength(2);
      expect(plan.executionOrder).toHaveLength(2);
      expect(plan.parallelGroups).toBeDefined();
      expect(plan.parallelGroups![0]).toHaveLength(2);
    });
  });

  describe('Tool Execution', () => {
    it('should execute single tool successfully', async () => {
      const tool: EnhancedTool = {
        name: 'testTool',
        description: 'Test tool',
        category: 'test',
        version: '1.0.0',
        parameters: [],
        process: async (): Promise<string> => 'result',
        execute: async (): Promise<ToolExecutionResult> => ({ success: true, data: 'result' }),
      };

      toolManager.registerTool(tool);
      mockAtoma.atomaChat.mockResolvedValue(createMockResponse(['testTool']));

      const plan = await toolManager.createExecutionPlan('test query', mockAtoma);
      const result = await toolManager.executePlan(plan);

      expect(result.successfulTools).toHaveLength(1);
      expect(result.failedTools).toHaveLength(0);
      expect(result.stats).toHaveLength(1);
      expect(result.totalExecutionTime).toBeGreaterThan(0);
    });

    it('should handle tool execution failure', async () => {
      const tool: EnhancedTool = {
        name: 'failingTool',
        description: 'Failing tool',
        category: 'test',
        version: '1.0.0',
        parameters: [],
        process: async (): Promise<string> => { throw new Error('Test error'); },
        execute: async (): Promise<ToolExecutionResult> => ({ success: false, data: '', error: 'Test error' }),
      };

      toolManager.registerTool(tool);
      mockAtoma.atomaChat.mockResolvedValue(createMockResponse(['failingTool']));

      const plan = await toolManager.createExecutionPlan('test query', mockAtoma);
      const result = await toolManager.executePlan(plan);

      expect(result.successfulTools).toHaveLength(0);
      expect(result.failedTools).toHaveLength(1);
      expect(result.stats[0].error).toBe('Test error');
    });

    it('should execute parallel tools successfully', async () => {
      const tool1: EnhancedTool = {
        name: 'tool1',
        description: 'Test tool 1',
        category: 'test',
        version: '1.0.0',
        parameters: [],
        process: async (): Promise<string> => 'result1',
        execute: async (): Promise<ToolExecutionResult> => ({ success: true, data: 'result1' }),
        parallelExecutionSupported: true,
      };

      const tool2: EnhancedTool = {
        name: 'tool2',
        description: 'Test tool 2',
        category: 'test',
        version: '1.0.0',
        parameters: [],
        process: async (): Promise<string> => 'result2',
        execute: async (): Promise<ToolExecutionResult> => ({ success: true, data: 'result2' }),
        parallelExecutionSupported: true,
      };

      toolManager.registerTool(tool1);
      toolManager.registerTool(tool2);
      mockAtoma.atomaChat.mockResolvedValue(createMockResponse(['tool1', 'tool2']));

      const plan = await toolManager.createExecutionPlan('test query', mockAtoma);
      const result = await toolManager.executePlan(plan);

      expect(result.successfulTools).toHaveLength(2);
      expect(result.failedTools).toHaveLength(0);
      expect(result.stats).toHaveLength(2);
      expect(result.totalExecutionTime).toBeGreaterThan(0);
    });

    it('should handle mixed success/failure in parallel execution', async () => {
      const tool1: EnhancedTool = {
        name: 'tool1',
        description: 'Test tool 1',
        category: 'test',
        version: '1.0.0',
        parameters: [],
        process: async (): Promise<string> => 'result1',
        execute: async (): Promise<ToolExecutionResult> => ({ success: true, data: 'result1' }),
        parallelExecutionSupported: true,
      };

      const tool2: EnhancedTool = {
        name: 'tool2',
        description: 'Test tool 2',
        category: 'test',
        version: '1.0.0',
        parameters: [],
        process: async (): Promise<string> => { throw new Error('Test error'); },
        execute: async (): Promise<ToolExecutionResult> => ({ success: false, data: '', error: 'Test error' }),
        parallelExecutionSupported: true,
      };

      toolManager.registerTool(tool1);
      toolManager.registerTool(tool2);
      mockAtoma.atomaChat.mockResolvedValue(createMockResponse(['tool1', 'tool2']));

      const plan = await toolManager.createExecutionPlan('test query', mockAtoma);
      const result = await toolManager.executePlan(plan);

      expect(result.successfulTools).toHaveLength(1);
      expect(result.failedTools).toHaveLength(1);
      expect(result.stats).toHaveLength(2);
      expect(result.stats.find(s => s.toolName === 'tool2')?.error).toBe('Test error');
    });
  });

  describe('Error Handling and Retries', () => {
    it('should retry failed tool execution', async () => {
      let attempts = 0;
      const tool: EnhancedTool = {
        name: 'retryTool',
        description: 'Retry tool',
        category: 'test',
        version: '1.0.0',
        parameters: [],
        process: async (): Promise<string> => 'result',
        execute: async (): Promise<ToolExecutionResult> => {
          attempts++;
          if (attempts < 2) {
            throw new Error('Temporary error');
          }
          return { success: true, data: 'result' };
        },
      };

      toolManager.registerTool(tool);
      mockAtoma.atomaChat.mockResolvedValue(createMockResponse(['retryTool']));

      const plan = await toolManager.createExecutionPlan('test query', mockAtoma);
      const result = await toolManager.executePlan(plan);

      expect(result.successfulTools).toHaveLength(1);
      expect(result.stats[0].retries).toBe(1);
    });

    it('should handle timeout', async () => {
      const tool: EnhancedTool = {
        name: 'timeoutTool',
        description: 'Timeout tool',
        category: 'test',
        version: '1.0.0',
        parameters: [],
        process: async (): Promise<string> => 'result',
        execute: async (): Promise<ToolExecutionResult> => {
          await new Promise<void>(resolve => setTimeout(resolve, 2000));
          return { success: true, data: 'result' };
        },
      };

      toolManager.registerTool(tool);
      mockAtoma.atomaChat.mockResolvedValue(createMockResponse(['timeoutTool']));

      const plan = await toolManager.createExecutionPlan('test query', mockAtoma, {
        timeout: 100,
      });
      const result = await toolManager.executePlan(plan);

      expect(result.failedTools).toHaveLength(1);
      expect(result.stats[0].error).toContain('timeout');
    });
  });
}); 