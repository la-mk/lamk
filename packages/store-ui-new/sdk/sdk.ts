import { FilterObject } from "@la-mk/blocks-ui/dist/hooks/useFilter";
import { sdk as sdkBase, setupSdk as setup } from "@la-mk/la-sdk";
import { SetupSdkOptions } from "@la-mk/la-sdk/dist/setup";
import { User } from "../domain/user";
import isObject from "lodash/isObject";

export let sdk: ReturnType<typeof setupSdk>;
export const setupSdk = (config: SetupSdkOptions) => {
  setup(config);
  const mappedSdk = {
    store: {
      getBySlug: sdkBase.store.getBySlug,
      getByDomain: async (domain: string) => {
        const res = await sdkBase.store.find({
          query: { customDomain: domain },
        });
        if (res.total === 0) {
          throw new Error("Store not found");
        }

        if (res.total > 1) {
          console.error(`Multiple stores with the domain ${domain} found`);
          throw new Error("Found multiple stores with the same domain.");
        }

        return res.data[0];
      },
    },

    address: {
      schema: sdkBase.address.schema,
      findForUser: sdkBase.address.findForUser,
      create: sdkBase.address.create,
      patch: sdkBase.address.patch,
      remove: sdkBase.address.remove,
    },

    user: {
      schema: sdkBase.user.schema,
      patch: sdkBase.user.patch,
    },

    order: {
      findForUserFromStore: sdkBase.order.findForUserFromStore,
      get: sdkBase.order.get,
    },

    storeCategory: {
      findForStore: sdkBase.storeCategory.findForStore,
    },

    storeContents: {
      getLandingContentForStore:
        sdkBase.storeContents.getLandingContentForStore,
      getAboutUsForStore: sdkBase.storeContents.getAboutUsForStore,
    },

    storeIntegrations: {
      findForStore: sdkBase.storeIntegrations.findForStore,
    },

    auth: {
      login: async (credentials: User, strategy: string) => {
        return sdkBase.authentication.authenticate({
          ...credentials,
          strategy,
        });
      },
      signup: async (credentials: User, strategy: string) => {
        await sdkBase.user.create(credentials);
        return sdkBase.authentication.authenticate({
          ...credentials,
          strategy,
        });
      },
      logout: sdkBase.authentication.logout,
      getAuthentication: sdkBase.authentication.getAuthentication,
      getAccessToken: sdkBase.authentication.getAccessToken,
      removeAccessToken: sdkBase.authentication.removeAccessToken,
      reauthenticate: sdkBase.authentication.reAuthenticate,
      resetPassword: sdkBase.authManagement.resetPassword,
    },

    utils: {
      schema: {
        pick: sdkBase.utils.schema.pick,
      },
      getShortId,
    },
  };

  sdk = mappedSdk;
  return mappedSdk;
};

export const getShortId = (
  idOrItem: string | { _id: string; [key: string]: any }
): string => {
  let id = idOrItem;
  if (isObject(idOrItem)) {
    id = idOrItem._id;
  }

  return id.substring(0, 8);
};
