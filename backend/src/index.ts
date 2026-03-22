import app from './app';
import http from "http";
import {initSocket} from "./socket";
import { config } from './config/env';
import { connectDB } from './config/db';
import { logger } from './utils/logger';

const startServer = async () => {
  try {
  
    await connectDB();
    const server = http.createServer(app);
    initSocket(server);
   server.listen(config.PORT, () => {
      logger.info(`Server is running on port ${config.PORT}`)
      logger.info(`Environment: ${config.NODE_ENV}`)
    })
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