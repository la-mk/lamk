import pick from 'lodash/pick';
import { Application } from '@feathersjs/feathers';
import { getCrudMethods, SetupSdkOptions } from '../setup';
import { OmitServerProperties } from '../utils';

export interface Artifact {
  _id: string;
  uri: string;
  length: number;
}

export interface ImageParameters {
  dpr?: 1 | 2 | 3;
  w?: number | string;
  h?: number | string;
  format?: 'webp' | 'jpeg' | 'png';
}

const getImageOptimizationQueryString = (
  parameters: ImageParameters & { enlarge: boolean }
) => {
  return Object.keys(parameters)
    .map(key => key + '=' + (parameters as any)[key])
    .join('&');
};

export const getArtifactSdk = (
  client: Application,
  options: SetupSdkOptions
) => {
  const host =
    options.imagesEndpoint ?? options.apiEndpoint.replace('api', 'images');

  // If we use a proxy for the images use that, otherwise use the default endpoint.
  const imagesHost = options.imagesProxyEndpoint ?? host;

  return {
    //These are the only supported methods for handling an artifact.
    ...pick(
      getCrudMethods<Omit<OmitServerProperties<Artifact>, 'length'>, Artifact>(
        client,
        'artifacts'
      ),
      ['create', 'remove']
    ),

    getUrlForArtifact: (id: string, bucket: string) => {
      if (!id || !bucket) {
        return null;
      }

      return `${host}/${bucket}/${id}`;
    },

    getUrlForImage: (
      id: string,
      bucket: string,
      parameters?: ImageParameters
    ) => {
      if (!id || !bucket) {
        return null;
      }

      const imageOptimizationQueryString = parameters
        ? `?${getImageOptimizationQueryString({
            ...parameters,
            enlarge: false,
          })}`
        : '';

      return `${imagesHost}/${bucket}/${id}${imageOptimizationQueryString}`;
    },

    getImageOptimizationQueryString,
  };
};
