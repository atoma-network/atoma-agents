import { Application } from 'express';
import { Server } from 'http';
import app from '../src/app';

declare global {
  let testApp: Application;
  let server: Server;
}

beforeAll(() => {
  global.testApp = app;
  global.server = app.listen(0); // Use port 0 for random available port
});

afterAll(async () => {
  // Close any open handles
  await new Promise<void>((resolve) => {
    if (global.server) {
      global.server.close(() => resolve());
    } else {
      resolve();
    }
  });
});

// Handle process termination
process.on('SIGTERM', () => {
  process.exit(0);
});

process.on('SIGINT', () => {
  process.exit(0);
});
