import memoize from "mem";
import { Store } from "../domain/store";

const getSlugForCustomDomain = async (
  host: string,
  getStoreByDomain: (domain: string) => Promise<Store>
) => {
  const laStoreResult = await getStoreByDomain(host);
  if (!laStoreResult) {
    throw new Error("Store not found");
  }

  return laStoreResult;
};

// Cache for 30 min, since custom domains will rarely change.
const memoizedGetSlugForCustomDomain = memoize(getSlugForCustomDomain, {
  maxAge: 30 * 60 * 1000,
});

const stripWww = (host: string) => {
  if (host.startsWith("www")) {
    return host.substring(4);
  }

  return host;
};

export const getStoreFromHost = (
  host: string,
  apiEndpoint: string,
  getStoreBySlug: (slug: string) => Promise<Store | null>,
  getStoreByDomain: (domain: string) => Promise<Store>
) => {
  const normalizedHost = stripWww(host);
  const tld = normalizedHost.substr(normalizedHost.indexOf(".") + 1);
  const serverTld = apiEndpoint.substr(apiEndpoint.indexOf(".") + 1);

  if (tld !== serverTld) {
    return memoizedGetSlugForCustomDomain(host, getStoreByDomain);
  }

  const slug = normalizedHost.substr(0, normalizedHost.indexOf("."));
  if (!slug) {
    throw new Error("Store not found");
  }

  return getStoreBySlug(slug).catch((err) => {
    console.log(err);
    return null;
  });
};
