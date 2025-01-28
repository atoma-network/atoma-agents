import http from 'http';
import app from './app';
import { config } from './config';

/**
 * Main application class that initializes and starts the server
 */
class Main {
  private port: string | number;

  /**
   * Initialize the application with port
   * @param port - Port number for the server to listen on
   */
  constructor(port: string | number) {
    this.port = port;
  }

  /**
   * Start the HTTP server
   */
  async start() {
    const server = http.createServer(app);

    // Graceful shutdown handler
    const shutdown = () => {
      console.log('Shutting down gracefully...');
      server.close(() => {
        console.log('Server closed');
        process.exit(0);
      });
    };

    // Handle shutdown signals
    process.on('SIGTERM', shutdown);
    process.on('SIGINT', shutdown);

    server.listen(this.port, () => {
      console.log(`Server is listening on port ${this.port}`);
    });
  }
}

// Create and start the application
const main = new Main(config.port);
main.start().catch((error) => {
  console.error('Failed to start server:', error);
  process.exit(1);
});
