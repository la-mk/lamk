import fs from 'fs';
import path from 'path';
import util from 'util';
import { Product } from '@sradevski/la-sdk/dist/models/product';
import { execute as shopify } from './shopify';

export interface LamkProduct extends Omit<Product, 'images'> {
  images: Array<{
    name: string;
    blob: Blob;
  }>;
}

const promisifiedReadFile = util.promisify(fs.readFile);

const execute = (serviceName: string, serviceData: any) => {
  switch (serviceName) {
    case 'shopify':
      return shopify(serviceData);
    default:
      throw new Error(`No importer for service: ${serviceName}`);
  }
};

const loadDataFromPath = (dataPath: string) => {
  return promisifiedReadFile(path.normalize(dataPath), { encoding: 'utf8' });
};

const main = async ([serviceName, dataPath]: string[]) => {
  const serviceData = await loadDataFromPath(dataPath);
  return execute(serviceName, serviceData);
};

main(process.argv.slice(2)).then(res => {
  process.stdout.write(JSON.stringify(res, null, 2));
});
