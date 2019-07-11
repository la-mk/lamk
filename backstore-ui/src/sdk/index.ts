import { setupClient } from './setup';

import { getStoreSdk } from './models/store';
import { getProductSdk } from './models/product';
import { getArtifactSdk } from './models/artifact';

export const setupSdk = () => {
  const client = setupClient();
  return {
    store: getStoreSdk(client),
    product: getProductSdk(client),
    artifact: getArtifactSdk(client),
  };
};

export const sdk = setupSdk();
