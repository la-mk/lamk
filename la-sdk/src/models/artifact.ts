import pick from 'lodash/pick';
import { Application } from '@feathersjs/feathers';
import { getCrudMethods } from '../setup';
import { OmitServerProperties } from '../utils';

export interface Artifact {
  _id: string;
  uri: string;
  length: number;
}

export const getArtifactSdk = (client: Application) => {
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
      return `http://localhost:3030/images/${id.slice(0, 2)}/${id}`;
    },
  };
};
