import pick from 'lodash/pick';
import { Application } from '@feathersjs/feathers';
import { getCrudMethods } from '../setup';

export interface Artifact {
  id: string;
  uri: string;
  length: number;
}

export const getArtifactSdk = (client: Application) => {
  return {
    //These are the only supported methods for handling an artifact.
    ...pick(getCrudMethods(client, 'artifacts'), ['get', 'create', 'remove']),

    getUrlForArtifact: (id: string) => {
      return `http://localhost:3030/images/${id.slice(0, 2)}/${id}`;
    },

    toBase64: (file: Blob) => {
      return new Promise<string | ArrayBuffer | null>((resolve, reject) => {
        const fileReader = new FileReader();
        fileReader.readAsDataURL(file);
        fileReader.onload = () => {
          resolve(fileReader.result);
        };

        fileReader.onerror = err => {
          reject(err);
        };
      });
    },
  };
};
