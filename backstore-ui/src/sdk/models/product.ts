import { Application } from '@feathersjs/feathers';
import { getCrudMethods } from '../setup';

export interface Product {
  id: string;
  name: string;
  description: string;
  category: string;
  images: string[];
}

export const getProductSdk = (client: Application) => {
  return {
    ...getCrudMethods(client, 'products'),

    uploadImages: (images: any[]) => Promise.resolve('url'),
  };
};
