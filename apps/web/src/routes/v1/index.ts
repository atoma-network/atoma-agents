import { Router } from 'express';
import queryRouter from './query';
import rootRouter from './root';
import conversationRouter from './conversation.routes';

/**
 * Router instance for v1 API endpoints
 * This router serves as the main entry point for all v1 API routes
 * and aggregates sub-routers for different functionality domains
 */
const v1Router: Router = Router();

/**
 * Mount sub-routers to the v1 API router
 *
 * Route Structure:
 * - rootRouter:   Base endpoints for system status
 *   - GET /health - Health check endpoint
 *   - GET /status - System status information
 *
 * - queryRouter:  Blockchain query operations
 *   - GET /query/* - Various blockchain data queries
 *   - POST /query/batch - Batch query operations
 */
v1Router.use('/', rootRouter); // Handles basic and health check routes
v1Router.use('/query', queryRouter); // Handles query operations
v1Router.use('/conversations', conversationRouter);

export default v1Router;
