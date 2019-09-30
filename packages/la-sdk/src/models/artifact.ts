import pick from 'lodash/pick';
import { Application } from '@feathersjs/feathers';
import { getCrudMethods, SetupSdkOptions } from '../setup';
import { OmitServerProperties } from '../utils';

export interface Artifact {
  _id: string;
  uri: string;
  length: number;
}

export const getArtifactSdk = (client: Application, options: SetupSdkOptions) => {
  const host = `http://api.${options.host}:${options.port}`;
  
  return {
    //These are the only supported methods for handling an artifact.
    ...pick(
      getCrudMethods<Omit<OmitServerProperties<Artifact>, 'length'>, Artifact>(
        client,
        'artifacts',
      ),
      ['get', 'create', 'remove'],
    ),

    getUrlForArtifact: (id: string) => {
      return `${host}/images/${id.slice(0, 2)}/${id}`;
    },
  };
};
