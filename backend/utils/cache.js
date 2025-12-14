import { getRedisClient } from '../config/redisConnection.js';

/**
 * Redis cache utility with TTL support
 */

/**
 * Get value from cache
 * @param {string} key - Cache key
 * @returns {Promise<any|null>} - Parsed JSON value or null if not found
 */
export async function getCache(key) {
  try {
    const redis = getRedisClient();
    const value = await redis.get(key);

    if (!value) {
      return null;
    }

    return JSON.parse(value);
  } catch (error) {
    console.error(`Redis GET error for key ${key}:`, error.message);
    return null; // Fail gracefully - don't crash if Redis is down
  }
}

/**
 * Set value in cache with TTL
 * @param {string} key - Cache key
 * @param {any} value - Value to cache (will be JSON stringified)
 * @param {number} ttlSeconds - Time to live in seconds (default: 600 = 10 min)
 */
export async function setCache(key, value, ttlSeconds = 600) {
  try {
    const redis = getRedisClient();
    await redis.setEx(key, ttlSeconds, JSON.stringify(value));
  } catch (error) {
    console.error(`Redis SET error for key ${key}:`, error.message);
    // Fail gracefully - don't crash if Redis is down
  }
}

/**
 * Delete value from cache
 * @param {string} key - Cache key
 */
export async function deleteCache(key) {
  try {
    const redis = getRedisClient();
    await redis.del(key);
  } catch (error) {
    console.error(`Redis DEL error for key ${key}:`, error.message);
  }
}

/**
 * Delete all keys matching a pattern
 * @param {string} pattern - Pattern to match (e.g., "services:*")
 */
export async function deleteCachePattern(pattern) {
  try {
    const redis = getRedisClient();
    const keys = await redis.keys(pattern);

    if (keys.length > 0) {
      await redis.del(keys);
    }
  } catch (error) {
    console.error(`Redis pattern delete error for ${pattern}:`, error.message);
  }
}

/**
 * Middleware to cache GET requests
 * Usage: router.get('/', cacheMiddleware('services:all', 600), handler)
 */
export function cacheMiddleware(cacheKey, ttlSeconds = 600) {
  return async (req, res, next) => {
    try {
      const cached = await getCache(cacheKey);

      if (cached) {
        console.log(`✓ Cache HIT: ${cacheKey}`);
        return res.json(cached);
      }

      console.log(`✗ Cache MISS: ${cacheKey}`);

      // Store original res.json
      const originalJson = res.json.bind(res);

      // Override res.json to cache the response
      res.json = function(data) {
        setCache(cacheKey, data, ttlSeconds);
        return originalJson(data);
      };

      next();
    } catch (error) {
      console.error('Cache middleware error:', error.message);
      next(); // Continue without caching if error
    }
  };
}

// Common TTL values (in seconds)
export const TTL = {
  ONE_MINUTE: 60,
  FIVE_MINUTES: 300,
  TEN_MINUTES: 600,
  FIFTEEN_MINUTES: 900,
  THIRTY_MINUTES: 1800,
  ONE_HOUR: 3600,
  ONE_DAY: 86400
};
