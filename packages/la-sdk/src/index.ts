// This one has to be loaded first, so the validation library is extended before it's used.
import * as utils from './utils';
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
import { getProductGroupSdk } from './models/productGroup';
import { getCampaignSdk } from './models/campaign';
import { getStoreAnalyticsSdk } from './models/storeAnalytics';
import { getStorePaymentMethodsSdk } from './models/storePaymentMethods';
import { getOrderPaymentsSdk } from './models/orderPayments';

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
    productGroup: getProductGroupSdk(client),
    authentication: getAuthenticationSdk(client),
    campaign: getCampaignSdk(client),
    storeAnalytics: getStoreAnalyticsSdk(client),
    storePaymentMethods: getStorePaymentMethodsSdk(client),
    orderPayments: getOrderPaymentsSdk(client),
    request: (serviceName: string) => getCrudMethods(client, serviceName),
    utils,
  };

  sdk = tempSdk;
  return tempSdk;
};
