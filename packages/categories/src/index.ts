import fs from 'fs';
import path from 'path';
import csvtojson from 'csvtojson';
import Bluebird from 'bluebird';
import { setupSdk, sdk } from '@la-mk/la-sdk';
import { Category } from '@la-mk/la-sdk/dist/models/category';

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
          'Category already exists: ',
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

const flatlist = (categories: Array<Category>) => {
  const list = categories.reduce((list: string[], category) => {
    list.push(category.level1);
    list.push(category.level2);
    list.push(category.level3);

    return list;
  }, []);

  return Array.from(new Set(list));
};

const loadDataFromPath = (dataPath: string) => {
  return fs.promises.readFile(path.normalize(dataPath), { encoding: 'utf8' });
};

const loadFilesInDir = (filesDir: string) => {
  return fs.promises.readdir(path.normalize(filesDir));
}

const main = async ([action, dataPath, imagesPath, illustrationsPath]: string[]) => {
  const categoriesData = await loadDataFromPath(dataPath);
  const categoriesAsJson: Category[] = await csvtojson({ noheader: false }).fromString(
    categoriesData
  );

  switch (action) {
    case 'import': {
      const categories = await importCategories(categoriesAsJson)
      
      console.log(
        `Imported ${
          categories.filter(x => Object.keys(x).length > 0).length
        } out of ${categories.length} categories`
      )
      return;
    }

    case 'flatlist': {
      const list = flatlist(categoriesAsJson);
      process.stdout.write(list.join('\n'));
      return;
    }

    case 'imgcompare': {
      const level2Categories = Array.from(new Set(categoriesAsJson.map(category => category.level2)));
      const images = (await loadFilesInDir(imagesPath)).map(img => img.split('.')[0]);
      const illustrations = await loadFilesInDir(illustrationsPath);
      console.log("Categories for which there are no images: \n")
      process.stdout.write(level2Categories.filter(x => !images.includes(x)).join('\n'));

      console.log("\n\nCategories for which there are no illustrations: \n")
      process.stdout.write(level2Categories.filter(x => !illustrations.includes(x)).join('\n'));

      console.log("\n\nImages for which there are no categories: \n")
      process.stdout.write(images.filter(x => !level2Categories.includes(x)).join('\n'));

      console.log("\n\nIllustrations for which there are no categories: \n")
      process.stdout.write(illustrations.filter(x => !level2Categories.includes(x)).join('\n'));
      return;
    }

    default:
      throw new Error('Action not specified.');
  }
};

main(process.argv.slice(2));
