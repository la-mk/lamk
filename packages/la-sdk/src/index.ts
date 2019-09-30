import { setupClient, SetupSdkOptions } from './setup';

import { getStoreSdk } from './models/store';
import { getProductSdk } from './models/product';
import { getOrderSdk } from './models/order';
import { getArtifactSdk } from './models/artifact';
import { getDeliverySdk } from './models/delivery';
import { getUserSdk } from './models/user';
import { getAuthenticationSdk } from './models/authentication';
import { getCartSdk } from './models/cart';

// eslint-disable-next-line
export let sdk: ReturnType<typeof setupSdk>;

export const setupSdk = (options: SetupSdkOptions = {}) => {
  const client = setupClient(options);
  const tempSdk = {
    store: getStoreSdk(client),
    product: getProductSdk(client),
    delivery: getDeliverySdk(client),
    artifact: getArtifactSdk(client, options),
    order: getOrderSdk(client),
    user: getUserSdk(client),
    cart: getCartSdk(client),
    authentication: getAuthenticationSdk(client),
  };

  sdk = tempSdk;
  return tempSdk;
};
