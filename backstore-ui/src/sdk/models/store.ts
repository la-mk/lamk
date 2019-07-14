import { Application } from '@feathersjs/feathers';
import { getCrudMethods } from '../setup';

export interface Store {
  _id: string;
  ownedBy: string;
  name: string;
  slug: string;
  logo: string;
  isPublished: boolean;
}

export const getStoreSdk = (client: Application) => {
  return {
    ...getCrudMethods(client, 'stores'),

    validate: (data: Store, considerRequired = true) => {
      if (!data.logo) {
        return { logo: 'Logo is missing' };
      }
    },
    validateSingle: (val: any, selector: string) => {
      if (!val) {
        return 'xx is required';
      }
    },
  };
};
