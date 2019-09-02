import { setupClient } from './setup';

import { getStoreSdk } from './models/store';
import { getProductSdk } from './models/product';
import { getOrderSdk } from './models/order';
import { getArtifactSdk } from './models/artifact';
import { getDeliverySdk } from './models/delivery';
import { getUserSdk } from './models/user';
import { getAuthenticationSdk } from './models/authentication';

export const setupSdk = () => {
  const client = setupClient();
  return {
    store: getStoreSdk(client),
    product: getProductSdk(client),
    delivery: getDeliverySdk(client),
    artifact: getArtifactSdk(client),
    order: getOrderSdk(client),
    user: getUserSdk(client),
    authentication: getAuthenticationSdk(client),
  };
};

export const sdk = setupSdk();
