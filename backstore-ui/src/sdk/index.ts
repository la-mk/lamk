import { setupClient } from './setup';

import { getStoreSdk } from './models/store';
import { getProductSdk } from './models/product';
import { getOrderSdk } from './models/order';
import { getArtifactSdk } from './models/artifact';
import { getDeliverySdk } from './models/delivery';

export const setupSdk = () => {
  const client = setupClient();
  return {
    store: getStoreSdk(client),
    product: getProductSdk(client),
    delivery: getDeliverySdk(client),
    artifact: getArtifactSdk(client),
    order: getOrderSdk(client),
  };
};

export const sdk = setupSdk();
