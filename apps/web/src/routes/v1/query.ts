import { Router } from 'express';
import { Request, Response } from 'express';
import config from '../../config/config';
import Agent from '@atoma-agents/sui-agent/src/agents/SuiAgent';
const { atomaSdkBearerAuth } = config.auth;
const suiAgent = new Agent(atomaSdkBearerAuth);
const queryRouter: Router = Router();
// Health check endpoint
queryRouter.get('/health', (req: Request, res: Response) => {
  res.json({ status: 'healthy' });
});
// Query endpoint
const handleQuery = async (req: Request, res: Response): Promise<void> => {
  try {
    const { query } = req.body;
    if (!query) {
      res.status(400).json({
        error: 'Missing query in request body'
      });
      return;
    }
    // Get agent response first
    const result = await suiAgent.SuperVisorAgent(query);
    res.status(200).json(result);
  } catch (error) {
    console.error('Error handling query:', error);
    res.status(500).json({
      error: 'Internal server error'
    });
  }
};
// Handle unsupported methods
const handleUnsupportedMethod = (req: Request, res: Response): void => {
  res.status(405).json({
    error: 'Method not allowed'
  });
};
queryRouter.post('/', handleQuery);
queryRouter.all('/', handleUnsupportedMethod);

export default queryRouter;
