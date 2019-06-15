import { EnvvarMissingError } from './errors';

export interface EnvvarRequest {
  name: string;
  required?: boolean;
}

// Return only the required envvars, allowing us to easily identify which service uses which variables.
export const loadEnvvars = (envvarList: EnvvarRequest[]) => {
  envvarList.reduce(
    (
      envvars: { [key: string]: string | undefined },
      envvarRequest: EnvvarRequest,
    ) => {
      const varValue = process.env[envvarRequest.name];
      if (!varValue && envvarRequest.required) {
        throw new EnvvarMissingError(`Missing ${envvarRequest.name} variable.`);
      }

      envvars[envvarRequest.name] = varValue;
      return envvars;
    },
    {},
  );
};
