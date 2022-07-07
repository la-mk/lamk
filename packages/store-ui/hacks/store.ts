import { IncomingMessage } from "http";
import { NextPageContext } from "next";
import { Store } from "../domain/store";
import { sdk, setupSdk } from "../sdk/sdk";
import { envvars, loadEnv } from "../tooling/env";
import { getStoreFromHost } from "./dns";
import memoize from "mem";

export type PageContextWithStore = Omit<NextPageContext, "req"> & {
  req: IncomingMessage & { store: Store };
};

export const getStoreBase = async (
  host: string | null | undefined
): Promise<Store | null> => {
  // This makes the sdk available on the server
  if (!sdk) {
    loadEnv();
    setupSdk({
      transport: "rest",
      apiEndpoint: envvars.API_ENDPOINT,
      imagesEndpoint: envvars.ARTIFACTS_ENDPOINT,
      imagesProxyEndpoint: envvars.IMAGES_PROXY_ENDPOINT,
    });
  }

  if (!host) {
    return null;
  }

  // If we are running the store UI locally, get it from the enviornment
  host = envvars.DEV_STORE_URL || host;
  const store = await getStoreFromHost(
    host,
    envvars.API_ENDPOINT,
    sdk.store.getBySlug,
    sdk.store.getByDomain
  );

  return store;
};

// Cache for 10 min, since domains will rarely change. This can potentially render incorrect data for store, but it's an acceptable risk.
export const getStore = memoize(getStoreBase, {
  maxAge: 10 * 60 * 1000,
});
