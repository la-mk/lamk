import { Logger } from './logger';

export class NotFoundError extends Error {}

export const registerUnhandledErrorHandlers = (
  getSyncLogger: (handler: (err: Error, logger: Logger) => void) => void,
) => {
  process.on(
    // @ts-ignore
    'uncaughtException',
    getSyncLogger((err, logger) => {
      logger.error(err, 'uncaughtException');
      process.exit(1);
    }),
  );

  process.on(
    // @ts-ignore
    'unhandledRejection',
    getSyncLogger((err, logger) => {
      logger.error(err, 'unhandledRejection');
      process.exit(1);
    }),
  );
};
