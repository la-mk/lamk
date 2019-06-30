import express, { Application } from '@feathersjs/express';
import { logger } from '../../common/logger';

export const initErrorHandlingMiddlewares = (app: Application) => {
  // Configure a middleware for error handler
  app.use(express.errorHandler({ logger }));
};
