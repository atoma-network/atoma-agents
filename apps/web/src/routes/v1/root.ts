import { Router } from 'express';
import { Request, Response } from 'express';

const rootRouter: Router = Router();

/**
 * GET /
 * Basic root endpoint that returns a welcome message
 * @route GET /
 * @returns {string} A simple welcome message
 * @description This endpoint serves as a basic test to verify the API is running
 */
rootRouter.get('/', (req: Request, res: Response) => {
  res.json({
    message: 'Atoma Agents API',
    version: '1.0.0'
  });
});

/**
 * GET /health
 * Health check endpoint for monitoring service status
 * @route GET /health
 * @returns {Object} JSON object with status message
 * @description Used for health monitoring and uptime checks. Returns a 200 status
 *              code and JSON response when the service is operational.
 */
rootRouter.get('/health', (req: Request, res: Response) => {
  res.status(200).json({ msg: 'ok' });
});

export default rootRouter;
