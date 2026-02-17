import app from './app';
import { config } from './config/env';
import { connectDB } from './config/db';
import { logger } from './utils/logger';

const startServer = async () => {
  try {
    // Connect to MongoDB
    await connectDB();

    // Start Express server
    const server = app.listen(config.PORT, () => {
      logger.info(`Server is running on port ${config.PORT}`);
      logger.info(`Environment: ${config.NODE_ENV}`);
    });

    // Graceful shutdown
    process.on('SIGTERM', () => {
      logger.info('SIGTERM signal received: closing HTTP server');
      server.close(() => {
        logger.info('HTTP server closed');
        process.exit(0);
      });
    });

    process.on('SIGINT', () => {
      logger.info('SIGINT signal received: closing HTTP server');
      server.close(() => {
        logger.info('HTTP server closed');
        process.exit(0);
      });
    });
  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();