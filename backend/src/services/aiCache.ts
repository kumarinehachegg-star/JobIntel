type CacheEntry = { value: any; expireAt: number };

const cache = new Map<string, CacheEntry>();

export function setCache(key: string, value: any, ttlSec = 300) {
  cache.set(key, { value, expireAt: Date.now() + ttlSec * 1000 });
}

export function getCache(key: string) {
  const e = cache.get(key);
  if (!e) return null;
  if (Date.now() > e.expireAt) {
    cache.delete(key);
    return null;
  }
  return e.value;
}

export function clearCache() {
  cache.clear();
}

export default { setCache, getCache, clearCache };
