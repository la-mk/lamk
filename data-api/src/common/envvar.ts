import { EnvvarMissingError } from './errors';

// Return only the required envvars, allowing us to easily identify which service uses which variables.
export const loadEnvvars = (envvarList: Array<string>): any => {
  return envvarList.reduce(
    (envvars: { [key: string]: string | undefined }, envvarRequest: string) => {
      if (!process.env[envvarRequest]) {
        throw new EnvvarMissingError(`Missing ${envvarRequest} variable.`);
      }

      envvars[envvarRequest] = process.env[envvarRequest];
      return envvars;
    },
    {},
  );
};
