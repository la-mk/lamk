import fs from 'fs';
import path from 'path';
import util from 'util';
import csvtojson from 'csvtojson';
import Bluebird from 'bluebird';
import { setupSdk, sdk } from '@sradevski/la-sdk';
import { Category } from '@sradevski/la-sdk/dist/models/category';

const prepareSdk = async () => {
  setupSdk({
    transport: 'rest',
    apiEndpoint: process.env.API_ENDPOINT || '',
  });
};

export const importCategories = async (
  categories: Category[]
): Promise<Array<Category | {}>> => {
  await prepareSdk();

  return Bluebird.map(
    categories,
    async category => {
      const categoryExists = await sdk.category.find({
        query: {
          level1: category.level1,
          level2: category.level2,
          level3: category.level3,
        },
      });

      if (categoryExists.total > 0) {
        console.log(
          'Product already exists: ',
          category.level1,
          category.level2,
          category.level3
        );
        return Promise.resolve({});
      }

      return sdk.category.create({
        ...category,
      });
    },
    { concurrency: 5 }
  );
};

const promisifiedReadFile = util.promisify(fs.readFile);

const loadDataFromPath = (dataPath: string) => {
  return promisifiedReadFile(path.normalize(dataPath), { encoding: 'utf8' });
};

const main = async ([dataPath]: string[]) => {
  const categoriesData = await loadDataFromPath(dataPath);
  const categoriesAsJson = await csvtojson({ noheader: false }).fromString(
    categoriesData
  );
  return importCategories(categoriesAsJson);
};

main(process.argv.slice(2)).then(imported =>
  console.log(
    `Imported ${
      imported.filter(x => Object.keys(x).length > 0).length
    } out of ${imported.length} categories`
  )
);
