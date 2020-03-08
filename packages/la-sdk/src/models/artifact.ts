import pick from 'lodash/pick';
import { Application } from '@feathersjs/feathers';
import { getCrudMethods, SetupSdkOptions } from '../setup';
import { OmitServerProperties } from '../utils';

export interface Artifact {
  _id: string;
  uri: string;
  length: number;
}

export const getArtifactSdk = (
  client: Application,
  options: SetupSdkOptions,
) => {
  const host =
    options.imagesEndpoint ?? options.apiEndpoint.replace('api', 'images');

  return {
    //These are the only supported methods for handling an artifact.
    ...pick(
      getCrudMethods<Omit<OmitServerProperties<Artifact>, 'length'>, Artifact>(
        client,
        'artifacts',
      ),
      ['create', 'remove'],
    ),

    getUrlForArtifact: (id: string, bucket: string) => {
      if (!id || !bucket) {
        return null;
      }

      return `${host}/${bucket}/${id}`;
    },
  };
};
