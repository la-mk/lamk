// Note: It is just a simple in-memory cache. This is not a replacement for webWorkers or other types of native caching, as the cache is cleared when a page is refreshed on web (but not on navigation for a single-page application).

interface CacheObject {
  timestamp: number;
  ttl: number;
  data: any;
}

const cache: { [key: string]: CacheObject } = {};

const isExpired = (cacheKey: string) =>
  Date.now() - cache[cacheKey].timestamp > cache[cacheKey].ttl;

export const isCached = (cacheKey: string) => cacheKey in cache;

export const clearCache = (cacheKey: string) => {
  if (isCached(cacheKey)) {
    delete cache[cacheKey];
  }
};

export const getCache = (cacheKey: string) => {
  if (isCached(cacheKey) && !isExpired(cacheKey)) {
    return cache[cacheKey];
  }

  return null;
};

const removeExpiredCache = () => {
  Object.keys(cache).forEach(cacheKey => {
    if (isExpired(cacheKey)) {
      clearCache(cacheKey);
    }
  });
};

export const setCache = (cacheKey: string, data: any, ttl = 30 * 60 * 1000) => {
  cache[cacheKey] = {
    data,
    timestamp: Date.now(),
    ttl,
  };
};

setInterval(removeExpiredCache, 5000);
