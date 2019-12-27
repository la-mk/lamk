import pick from 'lodash/pick';
import { Application } from '@feathersjs/feathers';
import { getCrudMethods, SetupSdkOptions } from '../setup';
import { OmitServerProperties } from '../utils/utils';

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
  const imagesBucket = 'images';

  return {
    //These are the only supported methods for handling an artifact.
    ...pick(
      getCrudMethods<Omit<OmitServerProperties<Artifact>, 'length'>, Artifact>(
        client,
        'artifacts',
      ),
      ['create', 'remove'],
    ),

    getUrlForArtifact: (id: string) => {
      return `${host}/${imagesBucket}/${id}`;
    },
  };
};
