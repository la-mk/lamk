import { Logger } from './logger';
import * as errors from '@feathersjs/errors';

export class UniqueConstraint extends errors.BadRequest {}
export const BadRequest = errors.BadRequest;
export const NotFound = errors.NotFound;
export const NotAuthenticated = errors.NotAuthenticated;
export const GeneralError = errors.GeneralError;
export const MethodNotAllowed = errors.MethodNotAllowed;

export const registerUnhandledErrorHandlers = (
  getSyncLogger: (handler: (err: Error, logger: Logger) => void) => void,
) => {
  process.on(
    'uncaughtException',
    () => getSyncLogger((err, logger) => {
      logger.error(err, 'uncaughtException');
      process.exit(1);
    }),
  );

  process.on(
    'unhandledRejection',
    () => getSyncLogger((err, logger) => {
      logger.error(err, 'unhandledRejection');
      process.exit(1);
    }),
  );
};
