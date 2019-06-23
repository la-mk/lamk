import server from './server/server';
import { logger } from './common/logger';

process.on('unhandledRejection', (reason: any, p: any) =>
  logger.error('Unhandled Rejection at: Promise ', p, reason),
);

server();
