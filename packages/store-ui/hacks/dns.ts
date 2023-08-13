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
    return getSlugForCustomDomain(host, getStoreByDomain);
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