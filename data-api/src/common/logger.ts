import * as pino from 'pino';
import merge = require('lodash/merge');

export interface LoggerConfig {
  env: 'development' | 'staging' | 'production';
}

export let logger: pino.Logger;

export const registerLogger = (
  config: LoggerConfig,
  options?: pino.LoggerOptions,
) => {
  const defaultOptions: pino.LoggerOptions = {};

  if (config.env === 'development') {
    defaultOptions.prettyPrint = { colorize: true };
  }

  const opts = merge(defaultOptions, options);
  logger = pino(opts);
  return logger;
};

export const getSyncLogger = (
  handler: (err: Error, finalLogger: pino.Logger) => void,
) => {
  return pino.final(logger, handler);
};
