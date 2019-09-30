import { Application } from '@feathersjs/feathers';
import { getCrudMethods } from '../setup';
import { OmitServerProperties } from '../utils';

export interface User {
  _id: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  createdAt: string;
  modifiedAt: string;
}

export const getUserSdk = (client: Application) => {
  const crudMethods = getCrudMethods<OmitServerProperties<User>, User>(
    client,
    'users',
  );
  return {
    ...crudMethods,
    validate: (data: User, considerRequired = true) => {
      if (!data.email) {
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
