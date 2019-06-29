import { setupClient } from './setup';

import { getStoreSdk } from './models/store';
import { getProductSdk } from './models/product';

export const setupSdk = () => {
  const client = setupClient();
  return {
    store: getStoreSdk(client),
    product: getProductSdk(client),
  };
};

export const sdk = setupSdk();
