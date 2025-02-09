import app from './app';
import { connectDB, disconnectDB } from './utils/db';

const port = process.env.PORT || 2512;

async function startServer() {
  try {
    await connectDB();

    const server = app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });

    // Handle graceful shutdown
    const shutdown = async () => {
      console.log('Shutting down server...');
      server.close(async () => {
        await disconnectDB();
        process.exit(0);
      });
    };

    process.on('SIGTERM', shutdown);
    process.on('SIGINT', shutdown);
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

startServer();
