import Bluebird from 'bluebird';
import { setupSdk, sdk } from '@la-mk/la-sdk';
import { LamkProduct } from '.';
import { Product } from '@la-mk/la-sdk/dist/models/product';

const prepareSdk = async () => {
  setupSdk({
    transport: 'rest',
    apiEndpoint: process.env.API_ENDPOINT || '',
    imagesEndpoint: process.env.ARTIFACTS_ENDPOINT || '',
  });

  await sdk.authentication.authenticate({
    strategy: 'local',
    email: process.env.STORE_EMAIL,
    password: process.env.STORE_PASSWORD,
  });
};

const uploadImages = (
  productName: string,
  images: Array<{ name: string; format: string; buffer: ArrayBuffer | null }>
) => {
  return Bluebird.map(
    images,
    image => {
      if (!image.buffer) {
        console.log(
          `Empty image for product: ${productName}, url: ${image.name}`
        );
        return Promise.resolve('');
      }

      const uri = Buffer.from(image.buffer).toString('base64');
      return sdk.artifact
        .create({
          uri: `data:image/${image.format};base64,${uri}`,
        })
        .then(img => img._id);
    },
    { concurrency: 2 }
  ).filter(x => x.length > 0);
};

export const importProducts = async (
  res: LamkProduct[]
): Promise<Array<Product | {}>> => {
  await prepareSdk();
  // agnesa-test
  const storeId = process.env.STORE_ID || '';

  return Bluebird.map(
    res,
    async product => {
      const productExists = await sdk.product.findForStore(storeId, {
        query: { name: product.name },
      });

      if (productExists.total > 0) {
        console.log('Product already exists: ', product.name);
        return Promise.resolve({});
      }

      const imageIds = await uploadImages(product.name, product.images);

      return sdk.product.create({
        ...product,
        category: '#missing',
        images: imageIds,
        soldBy: storeId,
      });
    },
    { concurrency: 2 }
  );
};
