import { extendValidation } from './utils/validation';
extendValidation();

import { setupClient, SetupSdkOptions, getCrudMethods } from './setup';
import { getStoreSdk } from './models/store';
import { getStoreContentsSdk } from './models/storeContents';
import { getProductSdk } from './models/product';
import { getOrderSdk } from './models/order';
import { getArtifactSdk } from './models/artifact';
import { getDeliverySdk } from './models/delivery';
import { getCategorySdk } from './models/category';
import { getUserSdk } from './models/user';
import { getAuthenticationSdk } from './models/authentication';
import { getCartSdk } from './models/cart';
import { getAddressSdk } from './models/address/address';
import * as utils from './utils/modelUtils';

// eslint-disable-next-line
export let sdk: ReturnType<typeof setupSdk>;

export const setupSdk = (options: SetupSdkOptions = { apiEndpoint: '' }) => {
  const client = setupClient(options);
  const tempSdk = {
    store: getStoreSdk(client),
    storeContents: getStoreContentsSdk(client),
    product: getProductSdk(client),
    delivery: getDeliverySdk(client),
    category: getCategorySdk(client),
    artifact: getArtifactSdk(client, options),
    order: getOrderSdk(client),
    user: getUserSdk(client),
    cart: getCartSdk(client),
    address: getAddressSdk(client),
    authentication: getAuthenticationSdk(client),
    request: (serviceName: string) => getCrudMethods(client, serviceName),
    utils,
  };

  sdk = tempSdk;
  return tempSdk;
};
