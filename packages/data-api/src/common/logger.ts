import * as pino from 'pino';
import { merge } from 'lodash';

export interface LoggerConfig {
  env: string;
}

export type Logger = pino.Logger;

export let logger: Logger;

export const initLogger = (
  config: LoggerConfig,
  options?: pino.LoggerOptions,
) => {
  const defaultOptions: pino.LoggerOptions = {};

  if (config.env === 'development' || config.env === 'test') {
    defaultOptions.prettyPrint = { colorize: true };
  }

  const opts = merge(defaultOptions, options);
  logger = pino(opts, pino.destination());
  return logger;
};

export const getSyncLogger = (
  handler: (err: Error, finalLogger: pino.Logger) => void,
) => {
  return pino.final(logger, handler);
};
