import fs from 'fs';
import path from 'path';
import util from 'util';
import { Product } from '@la-mk/la-sdk/dist/models/product';
import { execute as shopify } from './shopify';
import { importProducts } from './importer';

export interface LamkProduct extends Omit<Product, 'images'> {
  images: Array<{
    name: string;
    format: string;
    buffer: ArrayBuffer | null;
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

main(process.argv.slice(2))
  .then(importProducts)
  .then(imported =>
    console.log(
      `Imported ${
        imported.filter(x => Object.keys(x).length > 0).length
      } out of ${imported.length} products`
    )
  );
