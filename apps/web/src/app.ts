import express, { Application } from 'express';
import cors from 'cors';
import v1routes from './routes/v1';
import { connectDB } from './config/db';
//import queryRouter from './routes/v1/query';

/**
 * Express application instance.
 * This is the main application object that handles all HTTP requests
 * and middleware configuration.
 * @type {Application}
 */
const app: Application = express();

/**
 * Middleware Configuration:
 * 1. express.json() - Parses incoming JSON payloads
 * 2. express.urlencoded() - Parses URL-encoded bodies
 * 3. cors() - Enables Cross-Origin Resource Sharing
 */
app.use(express.json()); // Parse JSON request bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies
app.use(cors()); // Enable CORS for all routes

/**
 * API Routes:
 * Mounts all v1 routes under the base path.
 * @see ./routes/v1 for route definitions
 */
app.use(v1routes);

// Connect to MongoDB
connectDB().catch(console.error);

/**
 * @exports app
 * @type {Application}
 * @description Express application instance configured with middleware and routes
 */
export default app;
