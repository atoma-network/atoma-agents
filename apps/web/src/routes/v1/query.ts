import { Router } from 'express';
import { Request, Response } from 'express';
import { config } from '../../config';
import Agent from '@atoma-agents/sui-agent/src/agents/SuiAgent';
import ChatHistory from '../../models/ChatHistory';

const suiAgent = new Agent(config.atomaSdkBearerAuth);
const queryRouter: Router = Router();

// Health check endpoint
queryRouter.get('/health', (req: Request, res: Response) => {
  res.json({ status: 'healthy' });
});

// Query endpoint
const handleQuery = async (req: Request, res: Response): Promise<void> => {
  try {
    const { query, walletAddress } = req.body;

    if (!query) {
      res.status(400).json({
        error: 'Missing query in request body'
      });

      return;
    }
    // Get agent response first
    const result = await suiAgent.SuperVisorAgent(query, walletAddress);

    // Only try to save chat history if walletAddress is provided
    if (walletAddress) {
      try {
        // Get or create chat history for this wallet
        let chatHistory = await ChatHistory.findOne({ walletAddress });
        if (!chatHistory) {
          chatHistory = new ChatHistory({ walletAddress, messages: [] });
        }

        // Add user message to history
        chatHistory.messages.push({
          text: query,
          sender: 'user',
          timestamp: new Date()
        });

        // Add agent response to history
        chatHistory.messages.push({
          text:
            typeof result[0].response === 'string'
              ? result[0].response
              : JSON.stringify(result[0].response),
          sender: 'llm',
          isHTML: true,
          timestamp: new Date()
        });

        // Save chat history
        await chatHistory.save();
      } catch (chatError) {
        console.warn('Error saving chat history:', chatError);
        // Continue with the response even if chat history fails
      }
    }

    res.status(200).json(result);
  } catch (error) {
    console.error('Error handling query:', error);
    res.status(500).json({
      error: 'Internal server error'
    });
  }
};

// Get chat history endpoint
queryRouter.get('/history/:walletAddress', async (req: Request, res: Response) => {
  try {
    const { walletAddress } = req.params;
    const chatHistory = await ChatHistory.findOne({ walletAddress });
    res.status(200).json(chatHistory?.messages || []);
  } catch (error) {
    console.error('Error fetching chat history:', error);
    res.status(500).json({
      error: 'Internal server error'
    });
  }
});

// Handle unsupported methods
const handleUnsupportedMethod = (req: Request, res: Response): void => {
  res.status(405).json({
    error: 'Method not allowed'
  });
};

queryRouter.post('/', handleQuery);
queryRouter.all('/', handleUnsupportedMethod);

export default queryRouter;
