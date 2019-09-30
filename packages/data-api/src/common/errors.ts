import { Logger } from './logger';
import * as errors from '@feathersjs/errors';

export class UniqueConstraint extends errors.BadRequest {}
export const BadRequest = errors.BadRequest;
export const NotFound = errors.NotFound;

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
