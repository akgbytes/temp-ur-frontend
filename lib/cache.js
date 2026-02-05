// Simple in-memory cache for API responses
class APICache {
  constructor() {
    this.cache = new Map();
    this.defaultTTL = 5 * 60 * 1000; // 5 minutes in milliseconds
  }

  // Generate cache key from endpoint and options
  getKey(endpoint, options = {}) {
    const sortedOptions = Object.keys(options)
      .sort()
      .reduce((result, key) => {
        result[key] = options[key];
        return result;
      }, {});
    
    return `${endpoint}:${JSON.stringify(sortedOptions)}`;
  }

  // Get cached data
  get(endpoint, options = {}) {
    const key = this.getKey(endpoint, options);
    const cached = this.cache.get(key);
    
    if (!cached) return null;
    
    // Check if cache has expired
    if (Date.now() > cached.expiresAt) {
      this.cache.delete(key);
      return null;
    }
    
    return cached.data;
  }

  // Set cached data
  set(endpoint, data, options = {}, ttl = this.defaultTTL) {
    const key = this.getKey(endpoint, options);
    const expiresAt = Date.now() + ttl;
    
    this.cache.set(key, {
      data,
      expiresAt,
      createdAt: Date.now()
    });
  }

  // Clear specific cache entry
  clear(endpoint, options = {}) {
    const key = this.getKey(endpoint, options);
    this.cache.delete(key);
  }

  // Clear all cache
  clearAll() {
    this.cache.clear();
  }

  // Get cache stats
  getStats() {
    const now = Date.now();
    let validEntries = 0;
    let expiredEntries = 0;
    
    for (const [key, value] of this.cache.entries()) {
      if (now > value.expiresAt) {
        expiredEntries++;
      } else {
        validEntries++;
      }
    }
    
    return {
      total: this.cache.size,
      valid: validEntries,
      expired: expiredEntries
    };
  }
}

// Create singleton instance
const apiCache = new APICache();

export default apiCache;
