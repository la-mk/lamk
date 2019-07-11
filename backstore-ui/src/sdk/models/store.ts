import { Application } from '@feathersjs/feathers';
import { getCrudMethods } from '../setup';

export interface Store {
  id: string;
  ownedBy: string;
  name: string;
  slug: string;
  logo: string;
}

export const getStoreSdk = (client: Application) => {
  return {
    ...getCrudMethods(client, 'stores'),

    validate: (data: Store, considerRequired = true) => undefined,
    validateSingle: (val: any, selector: string) => {
      if (!val) {
        return 'xx is required';
      }
    },
  };
};
