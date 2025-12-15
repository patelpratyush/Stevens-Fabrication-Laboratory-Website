import { getCache, setCache, deleteCache, deleteCachePattern } from '../utils/cache.js';

/**
 * Cache middleware - checks Redis cache before executing route handler
 * Usage: router.get('/', cacheMiddleware('services:all', 600), handler)
 * 
 * @param {string|function} keyOrFn - Cache key or function that generates key from req
 * @param {number} ttlSeconds - Time to live in seconds (default: 600 = 10 min)
 * @returns {function} - Express middleware
 */
export function cacheMiddleware(keyOrFn, ttlSeconds = 600) {
  return async (req, res, next) => {
    try {
      // Generate cache key
      const cacheKey = typeof keyOrFn === 'function' 
        ? keyOrFn(req) 
        : keyOrFn;

      // Try to get from cache
      const cached = await getCache(cacheKey);

      if (cached) {
        console.log(`⚡ Cache HIT: ${cacheKey}`);
        return res.json(cached);
      }

      console.log(`💾 Cache MISS: ${cacheKey}`);

      // Store original res.json to intercept response
      const originalJson = res.json.bind(res);

      // Override res.json to cache the response
      res.json = function(data) {
        // Cache the response
        setCache(cacheKey, data, ttlSeconds);
        
        // Send the response
        return originalJson(data);
      };

      next();
    } catch (error) {
      console.error('Cache middleware error:', error.message);
      // If cache fails, continue without caching
      next();
    }
  };
}

/**
 * Invalidate cache middleware - deletes cache keys after successful operation
 * Usage: router.post('/', invalidateCache('services:*'), handler)
 * 
 * @param {string|string[]|function} keysOrFn - Cache key(s) or function that returns key(s)
 * @returns {function} - Express middleware
 */
export function invalidateCache(keysOrFn) {
  return async (req, res, next) => {
    // Store original res.json
    const originalJson = res.json.bind(res);
    const originalStatus = res.status.bind(res);

    let statusCode = 200;

    // Override res.status to capture status code
    res.status = function(code) {
      statusCode = code;
      return originalStatus(code);
    };

    // Override res.json to invalidate cache after successful response
    res.json = async function(data) {
      // Only invalidate on successful operations (2xx status codes)
      if (statusCode >= 200 && statusCode < 300) {
        try {
          // Generate cache key(s)
          let keys = typeof keysOrFn === 'function' 
            ? keysOrFn(req) 
            : keysOrFn;

          // Ensure keys is an array
          if (!Array.isArray(keys)) {
            keys = [keys];
          }

          // Delete each key
          for (const key of keys) {
            if (key.includes('*')) {
              await deleteCachePattern(key);
            } else {
              await deleteCache(key);
            }
          }
        } catch (error) {
          console.error('Cache invalidation error:', error.message);
        }
      }

      return originalJson(data);
    };

    next();
  };
}