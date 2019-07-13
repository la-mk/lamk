import { Application } from '@feathersjs/feathers';
import { getCrudMethods } from '../setup';

export interface Product {
  _id: string;
  soldBy: string;
  name: string;
  price: number;
  images: string[];
  category: string;
  description?: string;
}

export const getProductSdk = (client: Application) => {
  return {
    ...getCrudMethods(client, 'products'),

    validate: (data: Product, considerRequired = true) => {
      if (!data.images) {
        return { logo: 'Logo is missing' };
      }
    },
    validateSingle: (val: any, selector: string) => {
      if (!val) {
        return 'xxx is required';
      }
    },
  };
};
